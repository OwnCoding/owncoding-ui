# Adopción v2 en otra app — guía práctica

Para pasar una app (MobOS, ScaleOS, LedBox, PagaYa…) al lenguaje **v2 "device
ops"** sin romper nada: una sola paleta, una sola capa de reglas, objetos
portables y controles que sostienen la migración. Continúa a `docs/ADOPCION.md`
(sumar la biblioteca) con el camino que MobOS ya recorrió entre la **v0.24 y la
v0.30**.

Referencias: `docs/V2.md` (tokens y objetos) · `docs/SHELL.md` (shell y AA) ·
`docs/REGLAS.md` (reglas por pieza) · `docs/REGLAS-ECOSISTEMA.md` (reglas del
ecosistema: acceso, seguridad, infra, pagos, correo, publicación) ·
`docs/MIGRACION-V2.md` (una pantalla paso a paso) · `docs/ADOPCION.md`
(instalación y errores de paquete) · `docs/ALIMENTAR.md` (devolver objetos
nuevos).

## 0. Qué significa adoptar v2

- **Una paleta global** (`--c-*`) que llega con `styles.css`; la app no la
  redefine. Un rol que necesita ajuste se cambia en la biblioteca.
- **Una capa de reglas** (`base.css`) para el shell y el contenido: navegación,
  chips, stepper, números, tiles, medallas, degradados y foco. La app **no las
  repite**.
- **Objetos portables**: reciben props y avisan por callbacks; no hacen `fetch`,
  no leen stores ni conocen el router. La app resuelve datos y navegación.
- **Scopes**: `tema-v2` (el flag de la migración) y su alias `v2-piloto`
  (pantallas que son v2 por diseño, como un tablero `/ops`). Los tokens ya son
  globales: el scope solo activa las reglas de CSS.
- **No es** rediseñar pantalla por pantalla con CSS propio ni copiar clases del
  mock: es reemplazar piezas por objetos y borrar lo que quedó duplicado.

## 1. Preparar la app

1. Fijar un **tag** y usar `npm ci`: `github:dariodeoli/owncoding-ui#v0.30.0`.
2. Tailwind con el **preset** (`owncoding-ui/tailwind-preset`); el preset ya
   declara el `content` del bundle (sin eso, las clases se purgan).
3. Importar **después** de las directivas de Tailwind:
   `@import 'owncoding-ui/styles.css';`
   (o `tokens.css` si la app conserva su propia base).
4. `qrcode` solo si se usan QR/informe/certificado (peer opcional).
5. Captura de referencia en claro, oscuro y mobile antes de tocar nada.

## 2. Activar el scope

```jsx
// shell completo (lo más común durante la migración)
<div className="tema-v2">…</div>

// pantalla v2 por diseño, fuera del flag
<main className="v2-piloto">…</main>
```

Verificar en la primera pantalla que **los colores ya cambian solos** (tokens
globales) y que el contraste se sostiene (paso 3). Si algo se ve "plano" o
"AI", es porque falta aplicar la profundidad del tema: `V2.md` (sombras
`shadow-card`/`shadow-float`, capas de superficie).

## 3. Contraste AA (la puerta de entrada)

- Para **texto**, usar los roles AA del scope: `text-ok`, `text-bad`,
  `text-warn`, `text-info`, `text-fono-light`. Para **relleno e indicadores**,
  los vivos (`bg-pass/10`, `border-accion/30`).
- Los chips y rótulos del shell ya vienen resueltos en `styles.css`; no
  agregar overrides de color por pantalla.
- Sumar a la app una **guarda de contraste** (test que mida tus superficies),
  como `owncoding-ui/test/contraste-tokens.test.js`. Es la red que evita
  "arreglar" un color y romper AA en el otro tema.

## 4. Shell

Armar la navegación con los objetos (detalle y props en `SHELL.md` §1–3):

`PageHeader` (migas + un solo `h1`) · `NavLateral` (grupos plegables, activo
AA) · `Drawer`/`MenuDesplegable` (móvil y menú de usuario) · `PaletaComandos`
(buscador global único, ⌘/Ctrl+K) · `AyudaModulo` · `BarraInferior` +
`ESPACIO_BARRA_INFERIOR` · `IndicadorConexion` (banner/chip) · `PilaPersonas` ·
`CampanaAvisos` · `Avatar` · `ProductFooter`.

Reglas finas: ítem activo con `aria-current`, rótulos de grupo con
`aria-expanded`, alto táctil de 44 px (`toque-44`/`min-h-11`), un solo buscador.
El ejemplo mínimo está en `SHELL.md` §5.

## 5. Pantallas

Migrar **una por commit**, con captura antes/después y reemplazando objetos, no
estilos: chips (`v2-chip`), tablas (`CELDA_*`, `DataTable`), estados
(`EstadoBadge`, `ChipEstado`), dinero (`MoneyInput`/`Money`/`CeldaMoneda`),
fechas (`utils/fecha`), previews (`VistaPreviaPapel`, `DocumentoImpresion`).
Recetas: `MIGRACION-V2.md` y `REGLAS.md` §1–8 ter.

**Configuración** (`REGLAS.md` §11): `TarjetaAjuste` (con `tono="peligro"` para
archivar/eliminar), `Subtabs`, `PageHeader`/`Eyebrow`, `PanelDerecho`,
`EstadoGuardado` (estado del guardado con `aria-live`) y `Checkbox` (selección
múltiple; `Switch` para booleanos).

## 6. Retirar el bloque local

Cuando los objetos y las reglas de la biblioteca alcanzan, la app puede borrar
su bloque `.v2-piloto`/`.tema-v2` completo. `SHELL.md` §8 lista qué cubre la
biblioteca y qué **sí** queda en la app:

- las superficies rojas de sus propios objetos (`bg-bad`),
- el área táctil 44 px de su topbar si no usa `toque-44`,
- el cursor visible del PIN y selectores de markup propio.

Cómo verificar el retiro: capturas claro/oscuro/mobile, guarda de contraste en
verde y el inventario de duplicados en 0 (paso 8).

## 7. Adopción incremental con puentes

1. Si la copia local es **idéntica** a la publicada, se deja un puente:
   ```js
   export { PanelDerecho as default } from 'owncoding-ui'
   ```
   Los consumidores no cambian de ruta y el objeto queda en un solo lugar.
2. Si **diverge**, comparar dependencias (`utils/*`) antes de delegar: puede ser
   que la biblioteca esté detrás. Se porta primero lo que falta, se publica
   (changelog + tag) y recién ahí se puentea.
   Casos reales de MobOS: `categorias` («auriculares genéricos»), `mail` (trazo
   en producción) e `Icon` (`share` faltante).
3. Nunca dejar dos implementaciones vivas: el puente no tiene lógica.

## 8. Controles que sostienen la adopción

| Control | Qué frena |
| --- | --- |
| Inventario de duplicados (`scripts/auditoria-duplicacion.mjs`) | Saber cuántas copias locales quedan por objeto; puede bajar, no subir |
| Guarda de duplicados (test de aserción de fuente) | Un nombre nuevo que duplica un objeto publicado |
| Guarda de contraste (test) | Un rol de texto por debajo de AA en claro u oscuro |
| Guarda del shell (`test/shell-v2.test.js` en la biblioteca) | Que se borren las reglas del shell o la capa de contenido |
| Modales por ancho (#237) | Que una vista "amplia" no mida su ancho estándar |
| Smoke e2e por flujo + capturas por fase | Regresiones visuales en los caminos que importan |

## 9. Caso real: MobOS (v0.24 → v0.30)

- **v0.25** profundidad del tema (lienzo, capas, sombras por tema).
- **v0.26** retiro del bloque local v2: la app dejó 187 líneas de CSS y el
  alias `v2-piloto` recibió las mismas reglas que `tema-v2`.
- **v0.27** buscador global: la app reemplazó su paleta propia (342 líneas) por
  `PaletaComandos` (`max-w-3xl` conserva el ancho «amplio»).
- **v0.28** Configuración: `TarjetaAjuste` (tono peligro), `Subtabs`,
  `PanelDerecho` y el control de duplicados (69 objetos declarados).
- **v0.28.1** paridad de categorías, **v0.29** `EstadoGuardado` + `Checkbox`,
  **v0.30** set de íconos único (`share` + trazo de `mail`).
- Resultado: **0 reglas v2 propias** más allá de las 3 que le corresponden,
  puentes sin lógica en 16 objetos y una guarda que frena copias nuevas. La
  suite de la app (753 unitarios + smoke) queda verde en cada paso.

## 10. Checklist de cierre

- [ ] Tag fijado, preset y `styles.css` en el orden correcto.
- [ ] Scope `tema-v2`/`v2-piloto` aplicado donde corresponde.
- [ ] Guarda de contraste en la app (claro y oscuro) en verde.
- [ ] Shell con los objetos y 44 px de alto táctil.
- [ ] Pantallas migradas de a una, con capturas antes/después.
- [ ] Bloque local v2 retirado; inventario de duplicados en 0.
- [ ] Íconos: todo nombre usado existe en `ICONOS` (los desconocidos no dibujan).
- [ ] Puentes sin lógica para lo migrado; lo divergente, publicado primero.

## 11. Errores comunes de v2

| Síntoma | Causa | Solución |
| --- | --- | --- |
| Se ve "plano" o "AI" | Faltan las capas/sombras del tema | `V2.md`: superficies y `shadow-card`/`shadow-float` |
| El chip no es píldora | No se puso `v2-chip` o falta el scope | Aplicar la clase dentro de `tema-v2`/`v2-piloto` |
| El ítem activo no es azul | Falta `aria-current="page"`/`aria-pressed` | El hook del shell es la semántica real |
| Un ícono no aparece | El nombre no existe en el set | Ver `ICONOS`; no inventar nombres |
| El foco no se ve en claro | Se pisó `:focus-visible` con el verde de marca | Dejar el foco de `base.css` |
| Rompí AA al "mejorar" un color | El rol se usó como relleno/texto al revés | Texto AA vs vivos; correr la guarda |
| Las clases no llegan | Tailwind purgó el bundle | Usar el preset (`content` incluido) |
