# Comandos del orquestador

Los comandos con los que el dueño ordena el trabajo de los agentes. Viven acá
para que cualquier app del grupo los conozca; el detalle de roles, worktrees y
ciclo está en `docs/MODOS-DE-TRABAJO.md`.

| Comando | Qué hace |
| --- | --- |
| **`pp`** | Resumen de pendientes: qué hay en producción, ramas con trabajo, agentes activos, issues abiertos y pendientes del dueño. |
| **`pd`** | Pendiente de deploy: tabla **commit → qué cambia** con el tipo de cada cambio (`feature` / `fix` / `test` / `docs`), listo para decidir la ronda. |
| **`al`** | Agentes libres: qué slot está libre y **qué unidad concreta** puede tomar, sin filler ni volver a despachar lo que ya está en curso o entregado. |
| **`xx`** | Estado **x/100** por app/unidad: implementado, checks, integrado, publicado y QA, por separado. No infla el avance ni declara PASS falsos. |
| **`hd`** | **Ciclo único**: integrar `--no-ff`, checks afectados, bump + CHANGELOG, push + tag, deploy y verificación de identidad servida. |
| **`cm`** | Reporte ligero multi-app (corte de estado); documenta, **no** dispara deploy ni checks por sí solo. |

## El ciclo `hd` (único)

Un solo ciclo para integrar y publicar, de a una rama por vez:

1. **Preámbulo (sin daño):** verificar que no haya un merge ni un ciclo en curso
   (`.git/MERGE_HEAD`, marca del chequeo automático). No se matan procesos ni
   servidores ajenos.
2. `git fetch origin --prune` y relevar las ramas con trabajo (`pd`), contando
   **commits únicos**: los compartidos entre ramas no se cuentan dos veces.
3. Integrar a `main` con `merge --no-ff`, verificando por contenido contra
   `origin/main`. Conflicto real: parar y consultar. Rama superseded: resolver
   del lado de `main` y verificar que el diff neto quede vacío.
4. **Checks afectados** del árbol mergeado (los lint/tipos/tests/build que la
   app tenga), cero marcadores de conflicto. No se re-ejecuta la suite completa
   por cambios puros de docs u operación: el CI de GitHub corre sobre el SHA
   exacto después del push.
5. **Release:** bump de patch, `CHANGELOG.md`/`NOVEDADES.md` al día y **tag
   anotado**.
6. **Push** a `main` + tags. Con el push sale el CI y, donde hay receptor
   configurado, el webhook → Hub/Coolify.
7. **Deploy** según el circuito de la app: deduplicar por SHA (si ya existe un
   deployment del mismo SHA se sigue, no se re-dispara); el fallback por API
   persiste la intención antes del único POST.
8. **Identidad servida:** health/`status.json` con la versión nueva y el SHA40
   del build. Se distingue **local** (tag y artefacto) de **servido** (HTTP
   real): un artefacto local nunca se presenta como publicado.
9. **Reporte:** ramas integradas, versión publicada, checks, CI, deploy/estado
   servido y **QA pendiente**, por separado.

### QA diferida (orden vigente)

La QA visual, de navegador y de flujos reales está **temporalmente diferida**
por el dueño: no bloquea el trabajo ejecutable. Cada unidad registra
`QA_NOT_RUN_DEFERRED_OWNER` (alcance, owner y siguiente paso), **no** se
convierte en PASS y el issue no se cierra como terminado por health. Los fallos
conocidos de permisos, documentos públicos, pérdida de datos o migraciones no
quedan omitidos por esta pausa, y la evidencia QA necesaria para resolver el
cambio concreto (incluidas pruebas funcionales nuevas) se corre con foco
acotado. La autoridad completa está en `docs/MODOS-DE-TRABAJO.md` (QA temporalmente
diferida).

## Política automática de integración

Para que las ramas no se acumulen sin integrar:

- Vigía cada **300 s**; cuando el repo acumula **≥ 10 commits nuevos únicos**
  (contados una sola vez entre las ramas con trabajo) y no hay un merge ni un
  chequeo en curso, se dispara el **`hd`** único.
- **Cooldown de 600 s** entre disparos: si el `hd` recién terminó (o falló), no
  se vuelve a disparar hasta que pase la ventana.
- El umbral y el cooldown se miden sobre el estado real del repo, no sobre la
  cantidad de pedidos. Tras una publicación, si quedan menos de 10 commits, no
  se crea otra release automática.
- El dueño puede adelantarlo escribiendo `hd` a mano. Nada se mergea, pushea ni
  despliega fuera del ciclo o de una ronda ordenada.

### Script de referencia: `tools/auto-hd.sh`

El script genérico que implementa la política (cada app lo copia y lo
parametriza: repo del integrador, ramas, agente, umbral y cooldown). Cuenta
commits **únicos** sin integrar, arma la tabla del `pd` (commit → qué cambia,
con tipo) y, si corresponde, ejecuta el comando que le pases. No invoca runners
ni deploys por sí solo: sin `--comando` únicamente informa.

```bash
# Revisar sin disparar nada (informa y sale)
tools/auto-hd.sh --repo ../MobOS \
  --ramas "slot/componentes slot/diseno slot/impresion" --dry-run

# Cron cada 5 minutos: dispara el hd cuando se juntan 10 commits únicos
*/5 * * * * /ruta/owncoding-ui/tools/auto-hd.sh \
  --repo /ruta/al/checkout-del-integrador \
  --ramas "slot/componentes slot/diseno slot/impresion" \
  --agente integrador \
  --comando 'herdr agent prompt integrador "hd"' >> /tmp/auto-hd.log 2>&1
```

| Opción | Para qué |
| --- | --- |
| `--repo <dir>` | Checkout del integrador (obligatorio) |
| `--ramas "<a b c>"` | Ramas de los slots a relevar (obligatorio) |
| `--ref <ref>` | Referencia contra la que se cuenta (default `origin/main`) |
| `--agente <nombre>` | Agente integrador a invocar (se exporta como `AUTO_HD_AGENTE`) |
| `--umbral <n>` / `--cooldown <seg>` | 10 commits únicos / 600 s (10 min) por defecto |
| `--comando "<cmd>"` | Ciclo a ejecutar al disparar (default: solo informa) |
| `--estado <archivo>` | Marca del último disparo (default `/tmp/auto-hd-<repo>.stamp`) |
| `--force` / `--dry-run` / `--sin-fetch` | Pruebas y control fino |

Alcance real: lock local con `mkdir` (evita dos chequeos simultáneos), cooldown
por marca y espera si hay un merge en curso. **No** es una cola global, no
consulta agentes ocupados fuera del repo y no reemplaza la coordinación de
ventanas pesadas.

## Reglas

- **Nada se mergea, pushea ni despliega sin el ciclo `hd`** o una ronda
  explícitamente ordenada por el dueño. El único que toca `main` y despliega es
  el integrador, con `<APP>_INTEGRATOR=1`.
- **Los conflictos se resuelven en la rama propia del slot**, contra el main del
  integrador, y se avisan en el handover. Nunca se resuelven en `main` ni en el
  checkout del integrador, y nunca en silencio. Si después del rebase el diff
  neto contra `main` queda vacío, la rama quedó superseded: se descarta y se
  avisa.
- **El orquestador no toca código**: abre issues (backlog canónico), elige el
  slot por dominio, briefea, sigue los handovers, ordena la integración y
  mantiene el estado. No mergea, no pushea, no despliega y no resuelve
  conflictos.
- Cada entrega cierra con los **checks de entrega** aplicables y el bloque
  **«Novedades para el dueño»** (2-5 bullets en lenguaje de producto). El cierre
  del issue distingue implementado, checks, integrado, publicado y QA pendiente.

Referencia: `docs/MODOS-DE-TRABAJO.md` (roles, ramas, ciclo de un pedido,
handover y releases) y el `AGENTS.md` de cada repo.

## Glosario (en simple)

Para leer los reportes sin jerga: estas son las palabras que aparecen en los
handovers y en el tablero.

| Palabra | Qué significa |
| --- | --- |
| **Suite** | El conjunto **completo** de pruebas automáticas de la app: recorre todas las pantallas y flujos como lo haría una persona. «La suite quedó verde» = pasó todo. |
| **Specs afectados** | Las pruebas que cubren **justo lo que se tocó** en la ronda (por ejemplo, las de Ventas si se cambió el carrito). Son las que corre el ciclo `hd`. |
| **Unitarias** | Pruebas de una pieza chica y aislada (un cálculo, un formato): rápidas y sin abrir la app. |
| **Integración** | Pruebas de varias piezas juntas (por ejemplo, la pantalla con la API y la base), para ver que se hablen bien. |
| **E2E** (de punta a punta) | La prueba que hace el recorrido completo en un navegador automático: entrar, cargar una venta, ver el pedido. Es la que más se parece a usar la app. |
| **Smoke** | Verificación «de humo» del deploy: que lo esencial esté vivo y sirviendo la versión nueva. El flujo real profundo es QA y hoy está diferido. |
| **CI** | El robot de GitHub que corre las pruebas solo cada vez que sube código. **Verde** = todo pasó; **rojo** = algo falló y hay que arreglarlo antes de publicar. |
| **Gate** | La «puerta» de calidad: el punto donde hay que estar en verde para seguir (por ejemplo, los checks antes del release o el CI antes de dar por publicado). Nada pasa si está en rojo. |
| **Release** | La **publicación** de una versión nueva: sube el número, se anota en `NOVEDADES.md` y sale a producción. |
| **Ronda** | Una **tanda** de trabajo: lo que hicieron los slots en un período, integrado y publicado (por ejemplo, «la ronda .145»). |
| **NOVEDADES.md** | El registro de lo que salió a producción, contado en lenguaje de negocio. Cada versión agrega su sección y todo handover/cierre incluye el bloque «Novedades para el dueño». |
| **QA diferida** | QA visual/browser/flujo real que el dueño pausó: se registra `QA_NOT_RUN_DEFERRED_OWNER`, no se declara PASS y no bloquea lo ejecutable. |
| **`hd`** | El ciclo único: integra, verifica lo afectado, publica (bump/tag/push), despliega y verifica la identidad servida. |
| **`xx`** | Estado x/100: foto corta del avance real por app/unidad. |
| **`cm`** | Corte ligero multi-app; documenta estado y no dispara deploy. |
