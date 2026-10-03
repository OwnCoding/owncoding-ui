# Reglas operativas — <APP>

Plantilla portable: copiá este archivo como `AGENTS.md` en la raíz del repo de
la app y reemplazá `<APP>`, `<PUERTO_APP>`, `<PUERTO_API>`, `<schema validate>`
y `<COMANDO_RELEASE>` por los valores reales. Borrá lo que no aplique.

Complementa `owncoding-ui/docs/MODOS-DE-TRABAJO.md` (topología y ciclo) y
`owncoding-ui/docs/REGLAS.md` (objetos y patrones de interfaz).

## Memoria de agentes (Engram)

- Engram es la memoria por defecto del ecosistema: antes de tocar algo, buscá
  contexto (`mem_context` → `mem_search` → `mem_get_observation`); guardá
  proactivamente decisiones, bugs, descubrimientos y convenciones
  (`mem_save`); cerrá con `mem_session_summary`.
- Nunca guardes secretos, tokens ni datos personales.
- Guardar es bookkeeping: el handover va completo igual.

## Componentes y reglas de interfaz

- **Buscar antes de crear:** campos, avisos, celdas, estados y acciones salen de
  `owncoding-ui` (ver `REGLAS.md`). Si un objeto falta, se crea en la librería y
  se adopta en todas las apps; no se inventa una variante local.
- Los agentes no copian clases ni patrones entre pantallas: usan la clase o el
  objeto compartido y lo fijan con un test de aserción de fuente.

## Comandos `hd` (rápido) y `hdd` (completo) — integrar y desplegar

- **`hd` (rápido, rutina):** el integrador ejecuta: (0) preámbulo: matar
  servidores zombies del repo y verificar que no haya otro merge en curso
  (`.git/MERGE_HEAD`); (1) `git fetch origin --prune` y relevar ramas con
  trabajo; (2) integrar a `main` una rama por vez (API antes que frontend),
  verificando el árbol mergeado y los **specs afectados** por lo que entró;
  (3) conflictos: si la rama quedó superseded, resolver del lado de `main` y
  verificar diff neto vacío; si hay trabajo real en conflicto, parar y
  preguntar; (4) pushear con `<APP>_INTEGRATOR=1`; (5) release con
  `<COMANDO_RELEASE>`. Sin suite completa, sin smoke y sin cierres.
- **`hdd` (completo, ronda):** todo lo del `hd` y además la **suite completa**,
  el **CI verde**, el **smoke de producción** hasta que sirva la versión nueva
  y el **cierre de issues**. `ht` es el alias histórico de este ciclo.
- Los tres comandos son **exclusivos del integrador**: los worktrees nunca los
  ejecutan. El glosario de términos (suite, smoke, gate, release, ronda…) está
  en `docs/COMANDOS.md`.

## Hook y protección de main

- Nadie pushea ni mergea a `main` salvo el integrador (hook `pre-push` +
  branch protection con checks en strict; force-push deshabilitado).
- Conflicto de merge → parar y consultar; nunca resolver en silencio.

## Despliegues

- Cada deploy incrementa la versión y pasa por `<COMANDO_RELEASE>` (árboles
  limpios, bump, build, deploy, smoke). No se publica sin bump ni sin smoke.
- Las sesiones de worktree nunca despliegan.

## Trabajo en worktrees

- Solo la rama propia; push a `origin/<rama-propia>`.
- Antes de tocar: `git fetch origin --prune && git rebase origin/main`.
  Conflicto → se resuelve en la rama propia; `--force-with-lease` solo a la
  rama propia.
- Entrega: commits por unidad (conventional, sin atribución de IA, `Refs #N`),
  checks, push y handover (rama, `git log --oneline origin/main..HEAD`, qué hace
  cada commit, rutas, checks y **Novedades para el dueño** de 2–5 bullets en
  lenguaje de producto).

## Checks de entrega obligatorios

1. Lint con 0 errores.
2. Build de la app (y del API si aplica) con artefacto verificado.
3. Suite de tests en verde.
4. Cero marcadores de conflicto en el código.
5. Si tocaste el API: suite del API, migraciones aditivas/idempotentes/
   re-ejecutables, un handler por archivo, sin slugs duplicados.
6. Validación del schema (`<schema validate>`) si tocaste datos.
7. e2e smoke aislado por worktree (puertos y base únicos).

Si algún check falla, la rama no se entrega.

## Issues

- Cada pedido vive en un issue (backlog canónico); los commits y el handover lo
  citan con `Refs #N`. El integrador cierra el issue solo después de verificar
  por contenido contra `main`.
- Todo cierre incluye el bloque **Novedades para el dueño** y se registra en el
  archivo acumulativo de novedades de la app.
