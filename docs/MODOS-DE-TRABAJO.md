# Modos de trabajo — OwnCoding

Cómo se trabaja en las apps del grupo (MobOS, ScaleOS, LedBox, PagaYa) y cómo
se mantiene esta biblioteca. Es el mismo esquema probado en MobOS, portable.

## Piezas y límites

```
Dueño ──▶ ORQUESTADOR ──▶ SLOTS (worktrees, ramas persistentes)
              │                │ handover
              └──▶ INTEGRADOR ◀─┘  (único dueño de main: merge, checks, push, deploy)
```

| Pieza | Dónde vive | Qué hace | Qué NO hace |
| --- | --- | --- | --- |
| **Orquestador** | carpeta de coordinación, sin repo (`~/.herdr/worktrees/<app>/orquestador/`) | interlocutor único del dueño: abre issues, elige slot, briefea, sigue handovers, ordena la integración | no mergea, no pushea, no despliega, no edita código |
| **Integrador** | checkout principal de `main` | verifica por contenido, `merge --no-ff` una rama por vez, checks del árbol mergeado, push, cierra issues, despliega | no implementa features, no resuelve conflictos reales en silencio |
| **Slots** | un worktree por dominio, rama persistente | implementan, commitean por unidad, corren checks, entregan handover | no mergean ni pushean a `main`, no despliegan, no tocan worktrees ajenos |
| **Librería (este repo)** | `owncoding-ui` | objetos y reglas compartidas; se versiona y se consume como dependencia | no tiene lógica de negocio ni estado de ninguna app |

## Ramas y worktrees

- Una rama persistente por slot (`slot/<dominio>`); no se crea rama por tarea.
- Antes de cada tarea: `git fetch origin --prune && git rebase origin/main`.
  Después de cada integración, la rama se reposiciona y sigue viva.
- `--force-with-lease` solo a la rama propia; **jamás** a `main`.
- `main` se protege con hook local (`pre-push`) y branch protection de GitHub:
  solo el integrador pushea a `main` (con la variable de entorno del proyecto).

## Ciclo de un pedido

> Los comandos abreviados del dueño (`pp`, `pd`, `al`, `xx`, `hd`, `cm`) están
> en **`docs/COMANDOS.md`**: `hd` es el **ciclo único** (integración `--no-ff` +
> checks afectados + versión/CHANGELOG + push + deploy + identidad/health). El
> mismo doc tiene un **glosario en simple** para el dueño.

1. El dueño le cuenta el problema al orquestador, en lenguaje de producto.
2. El orquestador abre un issue (plantilla) y elige el slot por dominio.
3. Brief al slot: issue, alcance, criterio, rama, checks, handover.
4. El slot rebasea, implementa, commitea (conventional commits sin atribución
   de IA, citando `Refs #N`), corre los checks, pushea su rama y entrega
   handover.
5. El integrador verifica por contenido contra `origin/main`, mergea una rama
   por vez (`--no-ff`), corre los checks afectados del árbol mergeado, publica
   (bump + tag anotado + push) y sigue el deploy hasta verificar la **identidad
   servida** (versión + SHA40 del build). Los commits y handovers citan
   `Refs #N`.
6. El deploy se decide por candidato con autorización vigente; la verificación
   distingue **local** (tag/artefacto) de **servido** (HTTP real). La QA
   visual/browser diferida queda registrada como `QA_NOT_RUN_DEFERRED_OWNER`:
   no bloquea ni se convierte en PASS.

## Handover (obligatorio)

- Rama y `git log --oneline origin/main..HEAD`, con `Refs #N` por issue.
- Qué hace cada commit y rutas tocadas.
- Resultado de cada check.
- Estado de QA: `QA_NOT_RUN_DEFERRED_OWNER` cuando aplique (alcance, owner y
  siguiente paso de recuperación).
- Bloque **Novedades para el dueño**: 2–5 bullets en lenguaje de producto, sin
  jerga técnica (ver `docs/NOVEDADES.md` de cada app).
- Riesgos, pendientes y conflictos de dominio detectados.

## Checks de entrega (frontend)

1. Lint con 0 errores.
2. Build de la app (y del API si aplica) con artefacto verificado.
3. Tests afectados en verde; la suite completa corre en el CI del SHA publicado.
4. Cero marcadores de conflicto.
5. e2e smoke con puertos/base aislados por worktree cuando haya app; la QA de
   flujo real diferida no lo reemplaza.
6. Si se tocó el schema: validación + migración idempotente + `db:check`.

## QA temporalmente diferida (autoridad vigente)

Autoridad: `qa-diferida-carril-rapido-autorizado-20261010.md` (dueño, 10-10).
Se reanuda cuando el dueño lo indique o al necesitar su evidencia para resolver
un cambio concreto; no hay fecha inventada.

### Avanzar ahora

- Implementación en paralelo en carriles/worktrees existentes, ownership
  disjunto. Reviews, handoffs, conflictos en ramas propias y preparación de
  integración.
- Tests afectados significativos, lint, tipos y build del candidato; los
  resultados válidos se conservan y no se repiten por acuses.
- El integrador avanza cuando los gates de código aplicables están acreditados;
  no se importan WIP/candidatos no admitidos ni se mueven cuts inmutables sin
  repin y gates propios.
- El orquestador coordina, no implementa. `al` va con trabajo concreto: sin
  filler y sin volver a despachar lo que ya está en curso o entregado.

### Diferir temporalmente

- QA visual, de navegador y de flujos reales no necesarios para resolver el
  cambio. Cada unidad/source registra **`QA_NOT_RUN_DEFERRED_OWNER`** (alcance,
  owner y siguiente paso de recuperación).
- La ausencia de QA **no** es PASS y el issue no se cierra como terminado. La
  QA deferida no bloquea el trabajo ejecutable.
- Excepción: evidencia QA necesaria para diagnosticar/corregir el cambio, o
  gates de permisos, documentos públicos, pérdida de datos o migraciones con
  fallo conocido. Esos fallos se resuelven con foco acotado, no como espera
  global. Las pruebas funcionales nuevas (incluido un PostgreSQL aislado de una
  corrección) no quedan omitidas por llamarlas QA.

### Coordinación simplificada

- Lo ligero no requiere acuerdos globales ni reserva de recursos.
- Lo pesado usa **un responsable de ventana** que verifica jobs realmente
  activos e incompatibilidades actuales, y entrega directo al owner listo.
- Se reutilizan los compromisos vigentes; se actualizan solo si cambia
  owner/job/fuente/alcance/estado. No se renueva por cada ACK ni se repite
  aprobación.
- Si el evento requiere GRANT: source/argv/budget/owner exactos, `START_BY`
  emitido cuando el ejecutor está listo, y START/terminal/release reales. Un
  lease expirado no se usa: se resuelve el mismo evento sin nueva cola/reprep.
- Sin disponibilidad CPU global como gate, sin límites permanentes, sin polls,
  sin kills ajenos, sin sucesores reservados/FIFO ni leases heredadas.

### Publicación y cierre

- El deploy se decide por candidato con las autorizaciones existentes; la pausa
  de QA por sí sola no autoriza deploy ni revoca holds específicos.
- No se repite push/POST/deploy por un aviso. La identidad servida/healthcheck y
  los estados reales se distinguen del build local.
- El cierre final del issue queda pendiente de la QA diferida: se reporta
  implementado / checks PASS / integrado / publicado / QA pendiente por
  separado, nunca todo como terminado.

Automatización: vigía **300 s**, umbral **10 únicos**, cooldown **600 s** y
holds propios sin cambios automáticos. No se adoptan los defaults antiguos
(15 commits / 20 min).

## App Store y cliente móvil

- Checklist canónico **`docs/APP-STORE.md`**; no garantiza aprobación y no
  contiene credenciales. Cuenta Apple Developer **disponible según el dueño**;
  membresía, App Store Connect y acuerdos sin verificación independiente.
- El alcance aprobado **incluye** desarrollar API móvil/backend, preparar Expo
  u otro cliente compatible y adaptaciones: no se repite la autorización
  general ni por dependencia técnica. Si falta un endpoint, se implementa de
  verdad antes de afirmar que la app está conectada; un scaffold no entrega.
- Arquitectura contra el inventario real (iOS/Expo/API/contratos) de cada app;
  se reutiliza la movilidad existente y **Swift no es obligatorio**.
- Sin runtime iOS, toolchain ni build firmado no hay `AppStoreREADY`. La QA
  diferida no exime las pruebas de dispositivo/capturas/flujo requeridas al
  enviar; upload/submission, acuerdos, billing y mercados son del dueño.
- Cada orquestador registra el alcance App Store por app y crea unidades
  implementables por gap demostrado, con ownership disjunto y evidencia.

## Releases y deploy

- Una sola fuente de versión; el release sube patch, corre los checks
  aplicables, publica (tag anotado + push) y avisa la versión desplegada
  explícita.
- La identidad servida se acredita con health/`status.json` (versión + SHA40 del
  build); **local y servido se informan por separado**. Nadie presenta local
  como publicado; si falta un dato del proveedor, se informa “no disponible”.
- Antes de reintentar un deploy se deduplica por SHA: si el deployment ya
  existe (aun fallido), se diagnostica ese mismo y no se re-dispara en
  automático.

## La biblioteca (esta repo)

- **Se versiona con tags** (`v0.x.y`); cada app adopta una versión fija.
- Un objeto nuevo entra acá con: props claras, sin acoplarse a una app, tests
  de render/lógica y su regla en `docs/REGLAS.md`.
- La adopción por app es un cambio de la app (rama de su slot), no de la
  librería: se cambia la dependencia, se reemplazan las copias y se corren los
  checks de la app.
- Los conflictos entre apps se resuelven acá: si dos apps necesitan variantes,
  la prop (no la copia) es el camino.

## Por app

| App | Estado | Notas |
| --- | --- | --- |
| **MobOS** | Modo completo (orquestador + integrador + slots por dominio + deploy con release) | Es la fuente de los objetos portados. La adopción de la librería es la fase 2. |
| **ScaleOS** | A completar | Copiar el modo de MobOS y ajustar dominios, puertos y comando de release. |
| **LedBox** | A completar | Ídem. |
| **PagaYa** | A completar | Ídem. |

Plantilla para configurar agentes y slots en una app nueva:
`docs/PLANTILLA-AGENTS.md`.
