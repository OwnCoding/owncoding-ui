# Shell v2 — armar la navegación con la biblioteca

Cómo se compone el shell de una app (barra lateral, topbar, menú móvil, barra
inferior y buscador global) con los objetos de `owncoding-ui`, y las reglas de
accesibilidad del sistema v2 **device ops** medidas sobre el shell real (#241).

Referencias: `docs/V2.md` (tokens e iconos) · `docs/REGLAS.md` §10 (props y
reglas de los objetos) · `docs/MIGRACION-V2.md` (migrar una pantalla) ·
`docs/ADOPCION.md` (sumar la biblioteca a una app).

Los objetos son **portables**: reciben props y avisan por callbacks; no hacen
`fetch`, no leen stores ni conocen el router. La app resuelve datos, rutas y
permisos; el shell solo dibuja y navega.

## 1. Piezas del shell

| Zona | Objeto | Qué resuelve |
| --- | --- | --- |
| Encabezado de la vista | `PageHeader` | Miga de sección (`migas` con `aria-current`), `eyebrow` + un solo `h1` + `subtitle` + `actions`; `backTo` para subpáginas |
| Barra lateral (escritorio) | `NavLateral` | Ítems con ícono, contador y activo; grupos plegables opcionales; colapsable; slots `cabecera` (logo/marca) y `pie` (identidad) |
| Menú de usuario / acciones | `MenuDesplegable` | Menú portable (`role="menu"`): usuario, acciones de fila y filtros; cierra con clic afuera y `Esc` |
| Cajón (móvil) | `Drawer` | Panel lateral con overlay, foco atrapado, `Esc` y clic afuera |
| Buscador global | `PaletaComandos` | `⌘`/`Ctrl`+`K`: búsqueda async (`buscar` → `onElegir`) con estados honestos (mínimo, cargando, sin resultados, error con reintento) |
| Ayuda de la pantalla | `AyudaModulo` | Botón «?» + diálogo con `titulo`, `resumen`, `puntos` y `enlaces` |
| Barra inferior (móvil) | `BarraInferior` | Hasta 4 destinos + «Más»; el contenido suma `ESPACIO_BARRA_INFERIOR` |
| Estado de la cola | `IndicadorConexion` | Chip de `role="status"`: en línea / sin conexión y pendientes de subir (la app decide el estado) |
| Presencia | `PilaPersonas` | Avatares superpuestos con punto de presencia y contador «+N»; `resumenPresencia` arma el texto («Ana en línea», «3 en línea») |
| Avisos | `CampanaAvisos` | Bandeja oficial del panel (#293): contador de no leídos (`99+`), vacío **con acción** y ruta interna (`href`/`destino`); abrir/elegir se avisan por callback. Contrato por canal en `REGLAS.md` §16 |
| Identidad de la sesión | `Avatar` | Foto → iniciales con color estable; vive en el `pie` de la barra o del menú |
| Pie institucional | `ProductFooter` | **Obligatorio en todas las páginas** (#291): © + nombre + versión + crédito «Desarrollado por Owncoding» con enlace; marca y versión entran por props (la biblioteca no conoce la marca) |
| Ajustes con formulario | `PanelDerecho` + `TarjetaAjuste` | Contenido/lista a la izquierda; formulario fijo a la derecha desde `lg` y apilado en móvil |

## 2. Props (resumen)

| Objeto | Props |
| --- | --- |
| `PageHeader` | `title` (único `h1`), `migas` `[{ etiqueta, href? }]`, `eyebrow`, `subtitle`, `actions`, `backTo` |
| `NavLateral` | `items` `[{ id, label, icono?, contador? }]` o `grupos` `[{ titulo, items }]`, `gruposPlegados`/`onToggleGrupo(titulo)`, `activeId`, `onSelect(id)`, `colapsado`, `onToggle`, `cabecera`, `pie`, `ancho` (`w-64`), `ariaLabel` |
| `MenuDesplegable` | `trigger`, `items` `[{ id?, label, icono?, onClick?, peligro?, disabled?, separador? }]`, `alineacion` (`right`/`left`), `ariaLabel` |
| `PaletaComandos` | `abierta`/`onAbrir`/`onCerrar`, `buscar(consulta)` async, `onElegir(resultado)`, `etiquetasTipo`, `iconosTipo`, `atajo`, `atajoTexto`, `conAtajo`, `minimo` (2), `espera` (220 ms), `boton`, `textoBoton` |
| `AyudaModulo` | `titulo`, `resumen`, `puntos` (3–5), `enlaces` `[{ href, etiqueta, onClick? }]`, `abierta`/`onAbrir`/`onCerrar` |
| `BarraInferior` | `items` (máx. 4) `[{ id, etiqueta, icono, href }]`, `activo`, `onSelect`, `onMas`, `masEtiqueta`, `menuAbierto`, `menuId`, `maxItems` (4) |
| `IndicadorConexion` | `enLinea`, `pendientes`, `sincronizando`, `onSincronizar`, etiquetas (`etiquetaEnLinea`/`etiquetaSinConexion`/`etiquetaSincronizando`) |
| `PilaPersonas` | `personas` (objetos o strings), `max` (4), `size`, `onMas`, `resumen`, `ariaLabel`, `title`, `className` |
| `CampanaAvisos` | `avisos` `[{ id, titulo, detalle?, tono?, fecha?, href?/destino?, onClick?, leido? }]`, `onAbrir`, `onElegir`, `vacioTitulo`/`vacioDetalle`/`vacioAccion`, `pie`, `anclaje` |
| `Avatar` | `nombre`, `src`, `tamano` (`sm`/`md`/`lg`), `forma` (`redondo`/`cuadrado`), `empresa`, `title`, `ariaLabel`, `decorativo` |
| `ProductFooter` | `nombre`, `version`, `credito` (default «Desarrollado por Owncoding»), `creditoUrl` (default `https://owncoding.dev/`), `anio` (default: año actual), `leading`, `children`, `className` |

## 3. Anatomía por breakpoint

- **Escritorio (`lg+`)**: `NavLateral` fija a la izquierda (colapsable); la app
  recuerda el estado si quiere. La identidad de la sesión va en el `pie`; la
  marca, en la `cabecera`.
- **Móvil**: la navegación va al cajón (`Drawer` + `MenuDesplegable`) y los
  destinos frecuentes a `BarraInferior`; el contenido suma
  `ESPACIO_BARRA_INFERIOR` para no quedar tapado.
- **Estados**: el ítem activo lleva `aria-current="page"`; los grupos plegables,
  `aria-expanded`; el contador se oculta con `sr-only` cuando el menú está
  colapsado (el `title` conserva la etiqueta).
- **Un solo buscador**: la paleta global reemplaza los buscadores duplicados del
  topbar; el botón visible se activa con `boton`. Adopción real (MobOS, lote
  33): `buscar` reparte entre los 8 grupos de la API y el elegido navega por
  `datos`; `conAtajo={false}` deja el Ctrl+K del shell y `className="max-w-3xl"`
  conserva el ancho «amplio» del estándar de modales (#237).

## 4. Tokens v2 y contraste AA (shell v2, #241)

Desde la **v0.21.0** los tokens v2 son la **paleta global** de la biblioteca:
una app que importa `styles.css` los tiene sin hacer nada. El scope
**`tema-v2`** (alias `v2-piloto`) queda como **alias temporal** — ahí viven las
reglas del shell y de contenido de `base.css` — y se retira cuando las apps
terminen la migración. Desde la **v0.26.0** las reglas del shell y de contenido
cubren **los dos scopes**: una pantalla que es v2 por diseño (sin el flag, como
el tablero `/ops`) lleva `v2-piloto` y recibe exactamente lo mismo.

Los roles semánticos del scope v2 son **tonos de texto AA**: los vivos de
PhoneCheck no llegan a 4.5:1 sobre las superficies v2 y quedan para rellenos e
indicadores (`--c-pass`, `--c-accion` y las clases `bg-*`).

| Rol | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--c-ok` | `#166534` | `#4ADE80` | Textos y cifras «pass» |
| `--c-bad` | `#B91C1C` | `#FCA5A5` | Errores y avisos de falla |
| `--c-warn` | `#92400E` | `#FCD34D` | Atención |
| `--c-info` | `#2059BE` | `#9FB8FF` | Azul de acción: ítem activo, enlaces |
| `--c-fono` / `--c-fono-light` | `#10B981` / `#047857` | `#05F19C` / `#7CFFC9` | Marca; en claro el tono de texto es el oscuro |
| Relleno «vivo» | `#22C55E` (`--c-pass`) | `#22C55E` | Sellos, indicadores y barras |

Reglas del shell (medidas sobre el shell real, claro y oscuro): **vienen con
`styles.css`**, dentro del scope `tema-v2`, así la app no las repite.

1. **Rótulos de grupo sólidos**: hooks `nav button[aria-expanded] > span` y
   `.oc-rotulo-grupo` (cajón u otros rótulos) → `--c-fono-light` sin alfa.
2. **Ítem activo**: hooks `nav [aria-current="page"]` y `nav [aria-pressed="true"]`
   → azul de acción AA sobre su tinte (`/14` en claro, `/20` en oscuro; en
   oscuro el texto es `--c-fore`). La misma regla cubre los activos segmentados
   (`button.bg-fono/15.text-fono-light`) y las pestañas
   (`[role="tab"][aria-selected="true"]`).
3. **Foco visible** por tema (en `base.css`): `--c-fono-dark` en claro — el de
   marca quedaba casi blanco — y `--oc-brand` en oscuro.
4. **Alto táctil de 44 px (#249):** los botones de ícono del shell (menú,
   notificaciones, acciones, tema, ayuda, salir) suman `.toque-44`: 36 px de
   dibujo y 44 de toque, sin mover el layout; los controles agrupados
   (segmentados, solapas) usan `min-h-11`.
4. **Contenido del scope**: los chips (`… .v2-chip`) van tipo pill con
   micro-rótulo, los de tono `bg-fono/15` pasan al azul de acción y los
   `bg-warn/15` al ámbar suave; los números blancos se aprietan
   (`.tabular-nums`) y el paso actual del stepper usa la burbuja sólida
   (`.oc-paso-activo`, que `Stepper` ya emite).
5. **Superficies rojas**: se resuelven en los objetos, no con un override
   genérico de `.bg-bad`. El contador de `CampanaAvisos` usa
   `text-white dark:text-onbrand` (en oscuro el rojo es claro y pide texto
   oscuro); una superficie roja nueva sigue la misma regla.
6. La **guarda** `test/contraste-tokens.test.js` mide los tonos de texto contra
   las superficies del scope en ambos temas y falla por debajo de AA;
   `test/shell-v2.test.js` fija que estas reglas sigan publicadas.

Medición de referencia (antes → después): rótulos de grupo 3.20 → 4.97; ítem
activo 2.91 → 4.80 en claro y 3.49 → 5.93 en oscuro; `ok` 2.99–3.30 → 6.46+;
`warn` 2.89–3.19 → 6.43+; `info` 3.38–3.73 → 5.89+; `bad` 4.38 → 5.86+ (claro)
y 4.12 → 5.61+ (oscuro).

## 5. Ejemplo mínimo

```jsx
import { useState } from 'react'
import {
  Avatar, BarraInferior, ESPACIO_BARRA_INFERIOR, NavLateral, PaletaComandos,
} from 'owncoding-ui'

export function Shell({ usuario, nav, activo, ir, buscar }) {
  const [menu, setMenu] = useState(false)
  return (
    <div className="tema-v2 flex min-h-dvh">
      <NavLateral
        items={nav} // [{ id, label, icono, contador? }]
        activeId={activo}
        onSelect={ir}
        cabecera={<b>Marca</b>}
        pie={<Avatar nombre={usuario.nombre} src={usuario.fotoUrl} tamano="sm" />}
      />
      <div className={`min-w-0 flex-1 ${ESPACIO_BARRA_INFERIOR}`}>
        <PaletaComandos abierta={menu} onCerrar={() => setMenu(false)} buscar={buscar} onElegir={(r) => ir(r.datos.id)} />
        {/* …contenido de la pantalla… */}
      </div>
      <BarraInferior items={nav.slice(0, 4)} activo={activo} onSelect={ir} />
    </div>
  )
}
```

## 6. Checklist de adopción

- [ ] Scope `tema-v2` en el contenedor del shell (y el flag de la app si el
      rollout va por partes).
- [ ] Navegación con `aria-current`, grupos con `aria-expanded` y contadores
      accesibles.
- [ ] Un solo buscador global (`PaletaComandos`) y ayuda por pantalla
      (`AyudaModulo`) si la pantalla es densa.
- [ ] Identidad de la sesión con `Avatar` (nunca iniciales a mano).
- [ ] **Pie institucional (#291) en las cuatro superficies**: shell del panel,
      acceso (login/registro/recuperación/verificación/invitación), públicas y
      tokenizadas (seguimiento de pedido, informe, certificado, prueba de
      impresión, ficha pública de producto, portal, estado). El puente de la
      app pasa `nombre`, `version` y el crédito; se verifica
      `data-testid="product-footer"` por pantalla (regla en `REGLAS.md` §14).
- [ ] Barra inferior con `ESPACIO_BARRA_INFERIOR` en el contenido.
- [ ] Contraste AA verificado en claro y oscuro (`test/contraste-tokens.test.js`
      en esta biblioteca; en la app, su propia guarda).
- [ ] Capturas antes/después en mobile y escritorio, sin scroll horizontal.

## 7. Estado de la migración (con DSN, #241)

Revisión cruzada CMP ↔ DSN del shell real. **El bloque local de la app se puede
retirar completo** (MobOS lo hizo en el lote 32, biblioteca v0.26.0): todo lo
declarado vive en `styles.css`, en los dos scopes (`tema-v2` y su alias
`v2-piloto`).

- ✅ **Navegación**: las reglas del shell y de los activos viajan en
  `styles.css` desde **v0.14.9**, y `NavLateral` ya soporta grupos plegables
  (`grupos` + `gruposPlegados`/`onToggleGrupo`) con el activo azul AA y el
  rótulo sólido.
- ✅ **Capa de contenido genérica**: `.v2-chip` (con sus tonos fono/warn),
  números del scope (incluido `strong.text-xl.tabular-nums`), activos de
  segmentados y pestañas, y `.oc-paso-activo` para el stepper — todo en
  `styles.css` desde **v0.14.10**.
- ✅ **Capa de contenido de las pantallas**: tiles (`v2-tile`), grado
  (`v2-grado`), rótulos sobre marca (`text-onbrand/70|75`), medallas
  (`bg-fono/15|10`), tinte oscuro (`bg-fore/5`), encabezados de tabla, números
  en verde, chips ok/bad al 10% y el degradado de los heroes — desde
  **v0.26.0**. La app ya no necesita selectores por `data-testid`: pone la
  clase `v2-chip` en sus filas.
- ✅ **Presencia**: `PilaPersonas` (+ `PersonaChip estado` y `resumenPresencia`)
  cubre la píldora del shell desde **v0.17.0**.
- ✅ **Sin conexión**: `IndicadorConexion variante="banner"` (franja ancha con
  la regla de superficies rojas) desde **v0.19.0**; solo queda app-side el
  alternador de tema (el chip de la cola sigue siendo la variante `chip`).
- ✅ **`PageHeader` con migas**: `migas=[{ etiqueta, href? }]` con
  `aria-current="page"` desde v0.17.0.

## 8. Retirar el bloque local de la app

Checklist para borrar el `.v2-piloto`/`.tema-v2` propio sin perder AA:

**La biblioteca cubre** (en ambos scopes): navegación (hover, activo AA,
rótulos de grupo), chips (`v2-chip` con tonos ok/bad/warn/fono y el neutro en
oscuro), stepper (`oc-paso-activo`; el alias `v2-paso-activo` queda para el
código viejo), números (`tabular-nums`, `v2-numero`), activos de segmentados y
pestañas, tiles (`v2-tile`), grado (`v2-grado`), rótulos sobre marca, medallas
de marca, encabezados de tabla, números en verde y el degradado de los heroes.

**Queda en la app a propósito**:

- Las superficies rojas de sus propios objetos (`bg-bad`): la biblioteca
  resuelve las suyas en los objetos (§5), no con un override genérico.
- El área táctil de 44 px del topbar si no marca cada botón con `toque-44`.
- El cursor visible del PIN (`pin-oculto`, #124).
- Los selectores de markup propio (por ejemplo, el rótulo interno de su cajón
  o el hook del tablero que usa `v2-piloto`).

Adopción: subir la dependencia al tag **v0.26.0**, poner `v2-chip` en las filas
y borrar el bloque local. Referencia real: MobOS `src/index.css` y
`docs/AUDITORIA-DUPLICACION.md` (lote 32).
