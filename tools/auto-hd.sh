#!/usr/bin/env bash
# auto-hd.sh — política automática de integración (ver docs/COMANDOS.md)
#
# Cuenta los commits únicos sin integrar de las ramas de los slots y,
# cuando llegan al umbral y no hay un merge ni un chequeo en curso, ejecuta el
# comando que le pases por `--comando` —el ciclo único `hd`— respetando un
# cooldown. Es genérico: cada app lo copia y lo parametriza.
#
# Ejemplo de uso (cron cada 5 minutos):
#   */5 * * * * /ruta/a/owncoding-ui/tools/auto-hd.sh \
#     --repo /ruta/al/checkout-del-integrador \
#     --ramas "slot/componentes slot/diseno slot/impresion" \
#     --agente integrador \
#     --comando 'herdr agent prompt integrador "hd"' >> /tmp/auto-hd.log 2>&1
#
# Ejemplo de prueba (no dispara nada, solo informa):
#   tools/auto-hd.sh --repo ../MobOS --ramas "slot/componentes" --dry-run
#
# Opciones:
#   --repo <dir>        Checkout del integrador (obligatorio).
#   --ramas "<a b c>"   Ramas de los slots a relevar (obligatorio).
#   --ref <ref>         Referencia contra la que se cuenta (default: origin/main).
#   --agente <nombre>   Agente integrador a invocar (se exporta como AUTO_HD_AGENTE).
#   --umbral <n>        Commits únicos sin integrar que disparan el ciclo (default: 10).
#   --cooldown <seg>    Segundos mínimos entre disparos (default: 600 = 10 min).
#   --estado <archivo>  Marca del último disparo (default: /tmp/auto-hd-<repo>.stamp).
#   --comando "<cmd>"   Comando a ejecutar al disparar (default: solo informa).
#   --force             Ignora el cooldown (para pruebas).
#   --dry-run           No escribe la marca ni ejecuta el comando.
#   --sin-fetch         No hace `git fetch` antes de contar.
#
# Alcance real: lock local con `mkdir` para que no corran dos chequeos a la vez,
# cooldown por marca y espera si hay un merge en curso. No es una cola global,
# no consulta agentes ocupados fuera del repo y no invoca runners ni deploys
# por sí solo: sin `--comando` únicamente informa.
#
# Salida: 0 = no correspondía (o dry-run); 10 = disparó (o habría disparado en dry-run).

set -euo pipefail

REPO=""
RAMAS=""
REF="origin/main"
AGENTE="integrador"
UMBRAL=10
COOLDOWN=600
ESTADO=""
COMANDO=""
FORCE=0
DRY_RUN=0
FETCH=1

while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="${2:-}"; shift 2 ;;
    --ramas) RAMAS="${2:-}"; shift 2 ;;
    --ref) REF="${2:-}"; shift 2 ;;
    --agente) AGENTE="${2:-}"; shift 2 ;;
    --umbral) UMBRAL="${2:-}"; shift 2 ;;
    --cooldown) COOLDOWN="${2:-}"; shift 2 ;;
    --estado) ESTADO="${2:-}"; shift 2 ;;
    --comando) COMANDO="${2:-}"; shift 2 ;;
    --force) FORCE=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --sin-fetch) FETCH=0; shift ;;
    -h|--help) sed -n '2,/^# Salida/p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "auto-hd: opción desconocida «$1» (usá --help)" >&2; exit 2 ;;
  esac
done

[ -n "$REPO" ] || { echo "auto-hd: falta --repo <checkout del integrador>" >&2; exit 2; }
[ -n "$RAMAS" ] || { echo "auto-hd: falta --ramas \"<rama> <rama>\"" >&2; exit 2; }
cd "$REPO"
git rev-parse --git-dir >/dev/null 2>&1 || { echo "auto-hd: $REPO no es un repo git" >&2; exit 2; }

# La marca del último disparo vive fuera del repo: no ensucia el árbol.
SUFIJO="$(basename "$REPO" | tr -c 'a-zA-Z0-9-' '_')"
[ -n "$ESTADO" ] || ESTADO="/tmp/auto-hd-${SUFIJO}.stamp"

# Tipo del commit para la tabla «pendiente de deploy» (`pd`).
tipo_de() {
  case "$1" in
    feat*|feature*) echo "feature" ;;
    fix*) echo "fix" ;;
    test*) echo "test" ;;
    docs*) echo "docs" ;;
    refactor*|perf*|chore*|build*|ci*) echo "${1%%(*}" ;;
    *) echo "otros" ;;
  esac
}

# Segundos de modificación portables (macOS y GNU).
segundos_de() {
  stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo 0
}

# Lock local del chequeo: `mkdir` es atómico; un lock viejo (> 1 h) se descarta.
LOCK="${ESTADO}.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  if [ $(( $(date +%s) - $(segundos_de "$LOCK") )) -gt 3600 ]; then
    rmdir "$LOCK" 2>/dev/null || true
    mkdir "$LOCK" 2>/dev/null || { echo "auto-hd: no se pudo tomar el lock ($LOCK)." >&2; exit 0; }
  else
    echo "auto-hd: ya hay un chequeo en curso ($LOCK). Se espera."
    exit 0
  fi
fi
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT

# Cooldown: si el último disparo fue hace menos de N segundos, no se hace nada.
if [ "$FORCE" -eq 0 ] && [ -f "$ESTADO" ]; then
  transcurridos=$(( $(date +%s) - $(segundos_de "$ESTADO") ))
  if [ "$transcurridos" -lt "$COOLDOWN" ]; then
    echo "auto-hd: en cooldown (${transcurridos} de ${COOLDOWN} s). Nada que hacer."
    exit 0
  fi
fi

# Integrador ocupado: un merge en curso.
if [ -e "$(git rev-parse --git-dir)/MERGE_HEAD" ]; then
  echo "auto-hd: hay un merge en curso en el integrador ($REPO). Se espera."
  exit 0
fi

[ "$FETCH" -eq 1 ] && git fetch --prune --quiet origin 2>/dev/null || true

# Conteo por rama (se ignoran las que no existen y los merges).
DETALLE=""
RANGOS=()
for RAMA in $RAMAS; do
  if ! git rev-parse --verify --quiet "$RAMA" >/dev/null; then
    echo "auto-hd: la rama $RAMA no existe en $REPO (se omite)."
    continue
  fi
  N="$(git rev-list --count --no-merges "$REF..$RAMA" 2>/dev/null || echo 0)"
  DETALLE+="$(printf '%4d  %s\n' "$N" "$RAMA")"$'\n'
  RANGOS+=("$REF..$RAMA")
done

# Total único entre ramas: los commits compartidos se cuentan una sola vez.
TOTAL=0
if [ "${#RANGOS[@]}" -gt 0 ]; then
  TOTAL="$(git rev-list --count --no-merges "${RANGOS[@]}" 2>/dev/null || echo 0)"
fi

echo "auto-hd: $TOTAL commits únicos sin integrar (umbral $UMBRAL) contra $REF"
echo "$DETALLE" | sed '/^$/d'

if [ "$TOTAL" -lt "$UMBRAL" ]; then
  echo "auto-hd: todavía no corresponde (faltan $((UMBRAL - TOTAL)))."
  exit 0
fi

# Tabla «pd»: commit → qué cambia, con su tipo.
echo
echo "Pendiente de deploy (commit → qué cambia):"
for RAMA in $RAMAS; do
  git rev-parse --verify --quiet "$RAMA" >/dev/null || continue
  git log --oneline --no-merges --reverse "$REF..$RAMA" 2>/dev/null | while IFS= read -r linea; do
    hash="${linea%% *}"; asunto="${linea#* }"
    printf '  %s  %-8s %s  (%s)\n' "$hash" "$(tipo_de "$asunto")" "$asunto" "$RAMA"
  done
done

echo
if [ "$DRY_RUN" -eq 1 ]; then
  echo "auto-hd: DRY-RUN — correspondería disparar el hd (agente: $AGENTE). No se ejecuta nada."
  exit 10
fi

# Disparo: marca el cooldown y ejecuta el comando del ciclo (si se pasó uno).
date +%s > "$ESTADO"
export AUTO_HD_AGENTE="$AGENTE"
export AUTO_HD_TOTAL="$TOTAL"
export AUTO_HD_REPO="$REPO"
echo "auto-hd: disparando el ciclo hd con el agente «$AGENTE» (marca: $ESTADO)"
if [ -n "$COMANDO" ]; then
  bash -c "$COMANDO"
else
  echo "auto-hd: sin --comando, el ciclo queda a cargo del dueño/agente: escribí hd."
fi
exit 10
