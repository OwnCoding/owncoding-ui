# OwnCoding UI

Componentes, objetos y reglas de interfaz **reutilizables entre todas las apps
de OwnCoding** (MobOS, ScaleOS, LedBox, PagaYa): un solo paquete, sin copiar y
pegar entre repos.

Filosofía: **buscar antes de crear**. Si un campo, un aviso, una celda o una
regla ya existe acá, se usa tal cual; si falta, se crea en este paquete y se
adopta en todas las apps. Los objetos no saben de negocio: no hacen `fetch`, no
leen stores ni conocen el router; reciben props y devuelven interfaz.

## Cómo lo consume una app

```bash
# Versión fija (recomendado: se adopta una versión y se sube a propósito)
npm install github:dariodeoli/owncoding-ui#v0.25.0

# Rama principal (solo para probar)
npm install github:dariodeoli/owncoding-ui

# Repo privado por SSH
npm install git+ssh://git@github.com/dariodeoli/owncoding-ui.git#v0.25.0
```

`prepare` corre el build al instalar (npm instala las devDependencies de una
dependencia git para eso). El bundle ya queda commiteado en `dist/` por si la
instalación se hace con `--ignore-scripts`. Alternativa sin git: publicar el
mismo paquete en GitHub Packages (`npm.pkg.github.com`) y consumirlo con
`@dariodeoli/owncoding-ui`; el paquete es el mismo, cambia el registry.

Requisitos: **React 18+** y **Tailwind CSS 3.4+**.

> **Sistema v2 (tokens + iconos):** guía de adopción paso a paso en
> **`docs/V2.md`**. Desde la **v0.21.0** los tokens v2 (consola #0E1116/#1F2430,
> verde pass, azul acción, tonos de texto AA) son la **paleta global** del
> paquete; `.tema-v2`/`.v2-piloto` quedan como alias temporal. `.v2-numero` e
> `IconoCategoria` completan el sistema.
>
> **Shell v2 (navegación):** piezas, props, breakpoints y reglas de contraste
> AA en **`docs/SHELL.md`**.
>
> **Migrar una pantalla (otras apps):** proceso por fases, tabla de reemplazos
> y verificación en **`docs/MIGRACION-V2.md`**.
>
> **Adoptar la biblioteca en una app:** instalación, preset/CSS, peers
> opcionales, errores comunes y rollback en **`docs/ADOPCION.md`**.
>
> **Adopción v2 en otra app (guía práctica):** de la paleta al shell, el retiro
> del bloque local, los puentes de migración y los controles que la sostienen,
> con el caso real de MobOS: **`docs/ADOPCION-V2.md`**.
>
> **Reglas del ecosistema (Segundo Cerebro):** acceso, permisos, eliminación,
> seguridad, Hub/Coolify, correo WEEM, pagos/dominios, publicación y
> **protección de datos personales (Ley 7593/2025, §12)** —el anexo obligatorio
> que complementa las reglas de interfaz— en
> **`docs/REGLAS-ECOSISTEMA.md`**.
>
> **Infra multi-tenant (wildcard de subdominios):** DNS en Cloudflare, token
> acotado, DNS-01 en Traefik, certificado wildcard, router dinámico seguro en
> Coolify, verificación y rollback: **`docs/INFRA-WILDCARD.md`**.

```js
// tailwind.config.js
import preset, { owncodingContent } from 'owncoding-ui/tailwind-preset'
export default {
  presets: [preset],
  // Tailwind 3.4 IGNORA el `content` de un preset: sin sumar
  // `owncodingContent` se purgan las clases de los componentes (íconos
  // gigantes, estilos perdidos) y no hay ningún error. Sumalo siempre.
  content: [...owncodingContent, './src/**/*.{js,jsx,ts,tsx}'],
}
```

`owncodingContent` apunta al bundle
(`node_modules/owncoding-ui/dist/**/*.js`) y a las fuentes
(`node_modules/owncoding-ui/src/**/*.jsx`), así funciona también si el paquete
se instaló con `--ignore-scripts`; si el `node_modules` está hoisted (monorepo),
ajustá la ruta al `node_modules` real.

```css
/* tu CSS principal, después de las directivas de Tailwind */

/* Opción A — todo (tokens + base global), igual que v0.13.1 */
@tailwind base;
@tailwind components;
@tailwind utilities;
@import 'owncoding-ui/styles.css';

/* Opción B — solo tokens (app con diseño propio: no toca html/body) */
@import 'owncoding-ui/tokens.css';

/* Opción C — tokens + base, por separado */
@import 'owncoding-ui/tokens.css';
@import 'owncoding-ui/base.css'; /* html, body, tipografías, foco, .oc-print */
```

`tokens.css` es **solo variables** (`--c-*`, temas `consola` y `tema-v2`):
importarlo no cambia ni un píxel del documento. `base.css` es la base global
opt-in (fondo, tipografía de títulos/botones, foco, placeholders, números
tabulares, `.pin-oculto` y las reglas `@media print` de `DocumentoImpresion`).
`styles.css` sigue siendo las dos concatenadas (autocontenido).

Los **tipos** viajan en el paquete (`dist/index.d.ts`, declarados a mano y
expuestos por `types`/`exports`): una app TypeScript `strict` los resuelve sin
shim propio. Cubren los objetos principales, los campos, los estados, las
tablas y los formatos (`Money`, fechas, etc.).

La **lógica pura** también sale por **`owncoding-ui/utils`**: la misma
superficie sin React y sin el banner `"use client"`, para componentes de
servidor, route handlers y scripts de Next (no hace falta
`serverExternalPackages`). Los objetos de interfaz siguen en `owncoding-ui`.

```js
import { formatGs, fechaDia, parseTelefono, telefonoValido } from 'owncoding-ui/utils'
```

```jsx
import { Button, Aviso, EmptyState, montoTexto, CELDA_DATO } from 'owncoding-ui'

<Button onClick={guardar}>Guardar</Button>
{error && <Aviso>{error}</Aviso>}
{montoTexto(pedido.totalPyg)}
```

Cada app pisa sus colores en `:root` (y `.dark`) sin tocar la librería; el
acento es el token `fono` (borde `--c-fono`, etc.). La paleta de referencia es
la de MobOS.

### Notas de release

- **v0.14.0 (propuesta, sin publicar)** — cierre del piloto de LedBox (issue #3):
  `owncodingContent` para el `content` de Tailwind 3.4, tipos `.d.ts` publicados,
  `tokens.css`/`base.css` separados, `timeZone` en las fechas, símbolo
  configurable en los montos, estados de negocio en `ChipEstado`, 23 íconos de
  módulo/acción y `Stat` con `tono`/`nota`. Compatible hacia atrás; el detalle
  está en «Formatos, estados, íconos y tipos».
- **v0.13.0 (propuesta, sin publicar)** — lote de objetos genéricos portado de
  LedBox: `TableroKanban`, `Cronologia`, `PlanPagos`, `DocumentoImpresion`,
  `SubidaImagen` y `ProgresoChecklist`; `qrcode` pasa a import dinámico (la peer
  opcional ya no rompe el import del paquete). Props y reglas en
  `docs/REGLAS.md` §8 ter; ejemplos en «Objetos genéricos del lote LedBox».
- **v0.12.0** — informe público: `FichaCertificado` (tarjeta del informe de
  dispositivo) y `CodigoQr` + `qrDataUrl` (QR unificado, peer opcional
  `qrcode`).
- **v0.11.0** — tokens v2 del piloto promovidos desde el rediseño:
  `.tema-v2` (alias `.v2-piloto`) con variante clara y oscura del lenguaje
  consola, azul acción como `info` y `.v2-numero` para números grandes.
- **v0.10.0** — sistema v2 "device ops" (#240/#241): tokens consola (`.consola`
  + verde `pass` + azul `accion`), `ChipEstado`, `ChipsLocks`, `SemaforoItem`,
  `FilaChecklist`/`ConteoChecklist`, `TileEquipo`, `Stepper`, `MedidorBateria`
  y `GradoBadge`; iconos de categoría `IconoCategoria` + `CATEGORIAS_PRODUCTO`
  / `ICONO_CATEGORIA` (#242). Props y reglas en `docs/REGLAS.md` §8 bis.
- **v0.9.0** — `Nota` (superficie informativa warn/info/neutra, sin `role`),
  `BarraProgreso` con `pista`/`relleno` y tono `onbrand` para las barras de
  gráfico, `BotonDentroCampo`, `esRazonSocial` y el tamaño estándar de modal
  (`Modal size` + `TAMANOS_MODAL`). El README de consumo queda en la versión
  publicada.
- **v0.8.0** — ancho de modales por tipo (`Modal size` + `TAMANOS_MODAL`:
  corto/formulario/amplio/completo, sin `max-w-*` suelto), `BotonDentroCampo`
  (acción trailing dentro del input, con tooltip y «Consultando…») y
  `esRazonSocial` (`normalizarNombre` ya no reordena razones sociales).
- **v0.7.0** — piezas de formulario: `GRILLA_DOS_COLUMNAS` (+ `_COMPACTA`),
  `PIE_ACCIONES` y `PIE_ACCIONES_REVERSO` (mismo criterio que las clases de
  tabla).
- **v0.6.0** — `CELDA_IDENTIDAD` (celda de nombre en tablas) y consumo más
  simple: el preset ya incluye el bundle de la librería en el `content` de
  Tailwind (si no, las clases de los componentes se purgan).
- **v0.5.0** — catálogos por defecto (263 ciudades con departamento, modelos de
  iPhone y accesorios), tamaños de campo (`TAMANOS_CAMPO`) y modelos de
  impresión (`crearTicket` ESC/POS + `paginaDePrueba`).
- **v0.4.0** — impresión LAN/USB (`AjustesImpresion`, `BotonImprimir`),
  navegación (`NavLateral`, `MenuDesplegable`), ajustes (`PanelDerecho`,
  `TarjetaAjuste`) y bancos de Paraguay.
- **v0.3.0** — familia de acceso (Google, `AuthLayout`, `ProductFooter`,
  `LoadingScreen`, `PegarEnlaceToken`) y campos ampliados (correo, teléfono,
  serial, Instagram), sin API.
- **v0.2.2 / v0.2.1** — documentación de consumo y robustez (`exports`,
  `engines`, CI).
- **v0.2.0 (cambio incompatible)** — se retiró el alias `Toggle` (#186).
  **Actualizar:** reemplazar `Toggle` por `Switch`; el callback ahora recibe el
  evento (`onChange={(event) => setValor(event.target.checked)}`) en vez del
  booleano. Los alias de compatibilidad no viven en esta librería.
- Detalle completo por versión: `CHANGELOG.md`.

### Ejemplo completo de consumo

```jsx
// main.jsx (Vite o Next.js cliente)
import 'owncoding-ui/styles.css' // después de las directivas de Tailwind

// pantalla
import { AjustesImpresion, BotonImprimir, Card, CELDA_IDENTIDAD, CityAutocomplete, MoneyInput, montoTexto } from 'owncoding-ui'

export function Pantalla({ impresoras, onGuardar, onImprimir, ciudad, setCiudad }) {
  return (
    <Card className="space-y-3">
      <p className="tabular-nums">{montoTexto(1250000)}</p>
      <MoneyInput value={0} onValueChange={() => {}} />
      <CityAutocomplete value={ciudad} onSelect={(c, d) => setCiudad(c, d)} />
      <span className={CELDA_IDENTIDAD}>Cliente de prueba</span>
      <AjustesImpresion impresoras={impresoras} onGuardar={onGuardar} />
      <BotonImprimir onImprimir={onImprimir} />
    </Card>
  )
}
```

### Adopción en una app (checklist)

1. Instalar la versión fija por tag y configurar el preset en Tailwind **sumando
   `owncodingContent`** al `content` (si no, se purgan los componentes).
2. Importar el CSS: `owncoding-ui/styles.css` completo, o `tokens.css` (y
   `base.css` si querés también la base global) para una app con diseño propio.
3. Definir la paleta de la app en `:root`/`.dark` (si no usa la de referencia).
4. Reemplazar los objetos locales por los de la librería, de a un objeto por
   commit (sin mezclar con cambios de negocio).
5. Correr lint + tests + build + e2e smoke de la app.
6. Si falta un objeto, se crea acá (con test) y después se adopta en la app.

## Qué incluye

- **Campos:** `Input`, `Textarea`, `Select`, `Label`, `FormField`,
  `MoneyInput`, `PinInput`, `PasswordInput`, `Switch`, `SegmentedField`,
  `SearchField`, `BotonDentroCampo` (acción trailing dentro del input),
  `PercentField` (+`parsePercent`/`formatPercent`),
  `CurrencySelect`, `EmailField` (sugerencia de dominios), `PhoneField`
  (código de país + validación; el número conserva un ancho mínimo y la fila
  envuelve en contenedores cortos en vez de aplastarlo), `SerialField` (IMEI/serial), `InstagramField`,
  `ProductCombobox` (buscar/elegir/crear producto), `BuscadorProveedor`
  (últimos usados por defecto, filtro por nombre/abreviatura y alta rápida,
  #259), `NavegacionSeccion` (riel de secciones que colapsa a íconos y variante
  horizontal, #267/#253), `SelectorCuentaCobro` (+`TarjetaCuentaCobro`: al elegir colapsa el
  buscador y muestra una sola tarjeta con «Cambiar cuenta», preselección de la
  última usada/predeterminada y hasta 100 cuentas con scroll virtualizado
  estable en mobile, #262),
  `BloquePago` (la papelera adentro de la tarjeta del medio de pago, #265), el
  flujo de **unificar clientes** (`BuscadorCliente` con posible duplicado,
  `PreviewFusion`, `CATEGORIAS_FUSION`/`categoriasFusion`, `ConfirmarConPalabra`
  y `ChipFusion` para la ficha archivada, #268), `RucField`
  (+`extraerRuc`/`esRuc`: la consulta entra por prop) y `SerialTexto` (serial
  con los últimos 4 siempre visibles).
- **Acceso (sin API):** `GoogleButton` (+`GoogleMark`, `OAuthDivider`),
  `AuthLayout` (slots de logo/copy/acciones/pie), `ProductFooter` (el pie
  institucional **obligatorio en todas las páginas**, #291),
  `LoadingScreen` y `PegarEnlaceToken` (extrae el token del enlace). No leen
  sesión ni llaman a la API: reciben props y avisan por callback.
- **Privacidad (Ley 7593/2025):** `AvisoPrivacidad` (aviso de finalidad con
  enlaces a la política y a los derechos del titular) y `ConsentimientoDatos`
  (casilla explícita con versión visible y **nunca pre-tildada**), más
  `registroConsentimiento` (registro de versión/fecha/canal para la aceptación
  y la revocación). Reglas por app en `docs/REGLAS-ECOSISTEMA.md` §12.
- **Carga con IA (#11/#12):** `CargaIA` (botón + diálogo con apertura
  diferida), `BotonCargaIA` (topbar, ✨ y tooltip) y `DialogoCargaIA` (pegado
  con contador, revisión editable por tarjetas con avisos, incluir/descartar,
  «Crear todo» con confirmación y resumen). La app pasa un **esquema
  declarativo** (`EsquemaIA` con tipos y campos) y los callbacks
  `analizar`/`crear`; el componente no hace `fetch`, no conoce proveedores y no
  persiste el texto. Motor server portable en **`owncoding-ui/ia`**
  (`motorIA`, OpenAI-compatible por `IA_API_KEY`/`IA_MODELO`/`IA_BASE_URL`,
  JSON estricto, `fetch` inyectable y rate-limit). Reglas: `docs/REGLAS.md`
  §18.
- **Acciones y contenedores:** `Button`, `IconAction` (el default mide **44 px
  reales en móvil** y 28 px en escritorio desde #13; `size="touch"` deja 36 px
  de dibujo + 44 de toque con `.toque-44`),
  `Card`, `Stat`,
  `Modal` (ancho por `size`: corto/formulario/amplio/completo),
  `ConfirmDialog`, `Drawer`, `ToastProvider`/`useToast`, `Subtabs`.
  El interruptor booleano es **`Switch`** (un solo objeto; #186 retiró el alias
  `Toggle`).
- **Navegación y shell:** `NavLateral` (colapsable y con grupos plegables,
  modelo `[{id,label,icono,contador}]` o `grupos`), `MenuDesplegable` (usuario,
  acciones de fila), `AuthLayout`, `ProductFooter` (**pie institucional
  obligatorio**, #291), `LoadingScreen`. Las reglas
  de navegación del v2 (activo AA, rótulos y foco) viajan en `styles.css`; el
  armado completo (breakpoints, barra inferior, paleta y contraste) está en
  **`docs/SHELL.md`**.
- **Ajustes (modelo):** `PanelDerecho` (contenido + formulario fijo a la
  derecha) y `TarjetaAjuste` (título/descripción/acción + cuerpo).
- **Impresión LAN/USB (funcional):** `AjustesImpresion`, `BotonImprimir` y
  `printing/estadoImpresoras.js` (estados honestos, destinos `lan:<ip>:<puerto>`
  y `cups:<cola>`). Guía completa: `docs/IMPRESION.md`.
- **Bancos de Paraguay:** catálogo `BANCOS_PARAGUAY` como predeterminado,
  `BancoCombobox` y `BancoLogo` (archivo/marca/monograma, sin cuadros rotos).
- **Buscador de dispositivos (#241/#250):** `BuscadorDispositivo` elige el
  modelo por nombre o código y despliega sus dependientes (capacidad, color,
  conectividad, marca o categoría) según el tipo de tienda; con
  `PERFILES_DISPOSITIVO` y `etiquetaDispositivo`. Guía:
  `docs/DISPOSITIVOS.md`.
- **Catálogos por defecto (Paraguay):** `CIUDADES_PARAGUAY` (263 municipios con
  departamento, cada fila con las claves en español `ciudad`/`departamento` y
  en inglés `city`/`department`) + `CityAutocomplete` (el departamento se
  resuelve solo con la ciudad), `MODELOS_IPHONE`, `CAPACIDADES_IPHONE`,
  `COLORES_IPHONE` y `CATEGORIAS_ACCESORIOS`. Se actualizan acá y llegan a
  todas las apps.
- **Tamaños de campo:** `TAMANOS_CAMPO` (`moneda: w-36`, `porcentaje: w-24`,
  `cantidad: w-20`, `fecha: w-40`, …) para que los campos no se estiren de más;
  `MoneyInput` y `PercentField` ya traen su ancho recomendado.
- **Tamaños de modal:** `TAMANOS_MODAL` (`corto`, `formulario`, `amplio`,
  `completo`) con el predeterminado `formulario`; se elige con `size` y no se
  pasa `max-w-*` suelto.
- **Piezas de formulario:** `GRILLA_DOS_COLUMNAS` (+ `_COMPACTA`) y
  `PIE_ACCIONES`/`PIE_ACCIONES_REVERSO` en `utils/formulario.js`.
- **Impresión — modelos:** `crearTicket` (ESC/POS 58/80 mm) y `paginaDePrueba`
  (verificador con validación de 4 dígitos, ticket **corto predeterminado** y
  secciones por tipo, con `PLANTILLA_PRUEBA`). Ver `docs/IMPRESION.md`.
- **Estados y avisos:** `Aviso` (error/ok/warn, con contenedor), `Nota`
  (aclaración sin `role`: warn/info/neutra, `compact`), `EmptyState`,
  `ErrorState`, `Skeleton`, `Badge`, `Dot`.
- **Operación de equipos (#240/#241):** `SemaforoItem`, `FilaChecklist` (+
  `ConteoChecklist` "x de y pass"), `ChipEstado` (estados de dispositivo **y de
  negocio**), `ChipsLocks`, `MedidorBateria`, `GradoBadge`, `TileEquipo`,
  `Stepper` y los estados en `utils/estadoEquipo.js`; tema **consola** y verde
  `pass` en `styles.css`.
- **Categorías de producto (#242):** `IconoCategoria` (mobile/laptop/tablet/
  watch/buds/cable) + `CATEGORIAS_PRODUCTO`, `ICONO_CATEGORIA` y
  `normalizarCategoria` en `utils/categorias.js`.
- **Datos:** `Money`, `FilaDato`, `CeldaMoneda`, `BarraProgreso`
  (`pista`/`relleno` para las barras de gráfico),
  `DataTable`, `PageHeader`, `Eyebrow`, clases de tabla `CELDA_DATO`,
  `CELDA_NUMERO`, `CELDA_ENCABEZADO`, `ROTULO_DATO`, `ROTULO_SECCION`,
  `EstadoBadge` (badge desde un mapa `{ label, color }`) y `SeccionColapsable`
  (detalle plegable que recuerda el estado con `clave`).
- **Lógica:** `cn`, `primerNombre`, moneda (`formatGs` con símbolo configurable,
  `montoTexto`, …), fechas (`fechaHora`, `fechaCorta`, … con `timeZone`),
  teléfono/WhatsApp (`whatsappUrl`, `telefonoVisible`, …), seriales (`ultimos4`,
  `serialEnmascarado`) y tokens de acción (`extractTokenFromUrl`).
- **Íconos:** `Icon` (78 glifos con `ICONOS`) con los módulos y las acciones del
  panel de LedBox (`overview`, `events`, `clients`, `budgets`, `finance`,
  `inventory`, `suppliers`, `promoters`, `building`, `plan`, `audit`,
  `arrowRight`, `mail`, `bank`, `checkin`, `database`, `instagram`, …). El mapa
  `AdminIcon` → librería está en «Formatos, estados, íconos y tipos».
- **Agenda, filtros y shell (lote 2, sin publicar):** `Calendario` (grilla
  mensual + lista por día en mobile, detalle del día y `renderItem` a medida),
  `RangoFecha` (atajos + campos desde/hasta), `PaletaComandos` (⌘/Ctrl+K con
  `buscar` async y `onElegir`), `AyudaModulo` («¿Qué es esto?»),
  `BarraInferior` (+ `ESPACIO_BARRA_INFERIOR`) y `Avatar` (iniciales con color
  derivado del nombre, imagen con caída a iniciales).
- **Identidad de usuario (#211):** `PersonaChip` es el único objeto para
  mostrar a una persona: foto local → foto de Google → iniciales (con
  `nombreCorto`, `estado` de presencia, `size` xs…xl y `title`), más el
  adaptador `identidadDeUsuario`, `ESTADOS_PRESENCIA` y `PilaPersonas` (pila de
  avatares con «+N» y `resumenPresencia` para la píldora del shell).
  `BarraLote` (acciones por lote), `PeriodoTabs` (Día/Semana/Mes/Año),
  `NumericKeypad` (teclado de cobro) y la **miga de sección** de `PageHeader`
  (`migas`) completan el lote.
- **Abastecimiento (#250):** `CampoSeriales` (pegar/escanear IMEI por lote con
  conteos de repetidos e inválidos) + `imeiValido` (Luhn) · `separarSeriales` ·
  `normalizarSeriales` en `utils/serial.js`, `MedidorStock` (stock vs punto de
  reposición), `Stepper variante="tarjetas"` (flujo de entrega del pedido, v2)
  y las piezas de envíos/recepción: `ContadorLote` («3 de 12»),
  `ResumenDestinos` («1 pedido A · 3 stock»), `ResumenIncidencias`, `FilaRevision`,
  `SelectorIncidencia` y `DestinoRecepcion` (faltantes, sobrantes, dañadas,
  incorrectas, sin IMEI, y recibir en depósito). El shell suma
  `IndicadorConexion variante="banner"`.
  **F1 — Demanda y tablero:** `ChipPrioridad` (URGENTE/ALTA/NORMAL/BAJA),
  `ChipOrigen` (venta sin stock, reserva sin unidad, …), `ContadoresCompra`
  (pendiente/comprado/faltan), `TarjetaNecesidad` (la tarjeta compacta del panel
  «Por comprar», con origen y centro), `Subtabs` con contador para las colas y
  `CONDICION_UNIDAD`/`etiquetaCondicion`; los mapas `PRIORIDADES_COMPRA`/
  `ORIGENES_NECESIDAD`/`ESTADOS_NECESIDAD` con `ordenarPorPrioridad` viven en
  `utils/abastecimiento.js` (REGLAS §12).
  **F2–F5 — compra, lote, etiqueta y recepción:** `TarjetaCompra`, `TarjetaLote`,
  `TarjetaRecepcion` (llegada pendiente con ETA y depósito sugerido),
  `ResumenRecepcion` (conteos por resultado), `EtiquetaLote` («PRODUCTO n DE N»
  con QR) y `ManifiestoEnvio` (el papel del lote con IMEI conocidos y
  pendientes), `ESTADOS_COMPRA`/`ESTADOS_ENVIO`/`ESTADOS_RECEPCION`,
  `METODOS_ENVIO`, `PASOS_ENVIO` y `claveRevision` (REGLAS §13).
- **Tablero (lote 2, sin publicar):** `ImporteDelta` (monto con signo y color),
  `IndicadorConexion` (en línea / pendientes de subir), `CampanaAvisos`
  (bandeja oficial: contrato por canal en `REGLAS.md` §16, #293)
  (contador + panel por props) y `GraficoBarras` (barras CSS sin dependencias).
- **Días, rangos y cantidades:** `utils/calendario.js` (clave `YYYY-MM-DD`,
  semana lunes-domingo y etiquetas es-PY), `utils/rangoFecha.js` (atajos y
  rango) y `formatoNumero`/`signoDe`/`montoConSigno` en `utils/moneda.js`.
- **Lote LedBox (sin publicar, v0.13.0 propuesta):** `TableroKanban`,
  `Cronologia`, `PlanPagos`, `DocumentoImpresion`, `SubidaImagen` y
  `ProgresoChecklist`. Detalle y ejemplos en la sección siguiente.

## Objetos genéricos del lote LedBox

Seis objetos que LedBox ya resolvió a mano y ahora viven acá. Todos son
portables: reciben props, avisan por callbacks, no hacen `fetch`, no leen
stores ni conocen el router; los montos van enteros y el formato lo dibuja
`Money`. Las reglas están en `docs/REGLAS.md` §8 ter.

### `TableroKanban` — pipeline por columnas de estado

**Para qué sirve:** un pipeline con columnas por estado (leads, presupuestos,
trabajos, eventos): contador por columna, tarjetas con subtítulo, chips, monto,
fecha y detalle, arrastre HTML5 entre columnas y el menú «Mover a…» para
teclado. El tablero mueve la tarjeta de forma optimista y la revierte si el
callback falla.

```jsx
<TableroKanban
  etiqueta="Presupuestos"
  puedeMover={puedeEscribir}
  columnas={[
    { valor: 'borrador', titulo: 'Borrador', tono: 'mute' },
    { valor: 'enviado', titulo: 'Enviado', tono: 'info' },
    { valor: 'aprobado', titulo: 'Aprobado', tono: 'ok' },
  ]}
  tarjetas={presupuestos.map((fila) => ({
    id: fila.id,
    estado: fila.status,
    titulo: fila.title,
    subtitulo: fila.client,
    monto: fila.total,
    fecha: fila.validUntil,
    chips: [{ etiqueta: 'Portal', tono: 'info' }],
    destinos: ['borrador', 'enviado', 'aprobado'], // máquina de estados real
  }))}
  onMover={(id, estado) => mover(id, estado)} // devuelve { ok } | Promise<{ ok }>
  onError={(mensaje) => toast(mensaje)}
/>
```

Props: `etiqueta`, `columnas` (`[{ valor, titulo, tono? }]`), `tarjetas`
(`[{ id, estado, titulo, subtitulo?, chips?, monto?, montoNota?, fecha?,
detalle?, acciones?, destinos? }]`), `puedeMover`, `etiquetaMover`,
`textoVacio`, `onMover`, `onError`, `className`. También exporta
`useTableroOptimista`, `columnasDelTablero`, `agruparTarjetas` y
`destinosDeTarjeta`.

**Qué NO hace:** no hace `fetch` ni conoce estados de negocio (los `valor` y
`destinos` los define la app); sin `onMover`/`puedeMover` es de solo lectura; no
ordena las tarjetas; los estados que llegan sin columna declarada se dibujan al
final con su valor crudo (no se ocultan filas).

### `Cronologia` — historial de hitos

**Para qué sirve:** la historia de un pedido, un equipo o un cliente: una fila
por hito con ícono y tono por tipo, título, detalle, actor y fecha es-PY 24 h,
con agrupación por día opcional y estado vacío.

```jsx
<Cronologia
  agrupar
  mostrarTipo
  hitos={hitos.map((h) => ({ id: h.id, fecha: h.at, tipo: h.kind, titulo: h.title, detalle: h.detail, actor: h.actor, tono: h.tone }))}
  iconos={{ pago: 'money', cancelado: 'close' }} // pisa ICONOS_HITO
  tonos={{ cancelado: 'bad' }}                  // pisa TONOS_HITO
/>
```

Props: `hitos` (`[{ id, fecha, tipo, titulo, detalle?, actor?, tono?, icono? }]`),
`iconos`, `tonos`, `etiquetas`, `agrupar`, `mostrarTipo`, `etiqueta`,
`vacioTitulo`, `vacioDetalle`, `className`, y los estados honestos
`cargando` (esqueleto), `error` + `onReintentar` y `onActualizar` +
`textoActualizar`/`textoCabecera` (la pantalla hace el fetch y avisa).
Exporta `ICONOS_HITO`, `TONOS_HITO`, `ETIQUETAS_HITO`, `etiquetaDeHito` y
`agruparHitos`.

**Qué NO hace:** no ordena ni filtra hitos (llegan ordenados por el API y el
consumidor decide la audiencia); no inventa hitos: si un hecho no está, no se
muestra; un tipo desconocido cae en el tono `mute` con su texto crudo.

### `PlanPagos` — anticipo, cuotas y total

**Para qué sirve:** el plan de pagos de una venta a plazo: anticipo (si
existe), cuotas con etiqueta, monto, vencimiento y estado, el bloque «a
transferir ahora» destacado, el total y el saldo sin cuota.

```jsx
<PlanPagos
  anticipo={plan.advanceAmount}
  cuotas={plan.installments.map((c, i) => ({ id: `c${i}`, etiqueta: c.label, monto: c.amount, vence: c.dueAt, estado: 'pendiente' }))}
  aTransferir={plan.dueNow ? { id: 'c0', etiqueta: plan.dueNow.label, monto: plan.dueNow.amount } : null}
  total={presupuesto.total}
  saldoSinCuota={plan.pending}
  condiciones={plan.terms}
/>
```

Props: `anticipo`, `anticipoEtiqueta`, `anticipoVence`, `cuotas`, `aTransferir`,
`total`, `totalEtiqueta`, `saldoSinCuota`, `saldoEtiqueta`, `condiciones`,
`moneda`, `estados`, `vacio`, `className`. Estados de cuota en `ESTADOS_CUOTA`
(`pendiente`, `revision`, `pagada`, `cancelada`) dibujados con `ChipEstado`.

**Qué NO hace:** no calcula cuotas ni intereses, no consulta la API y no cambia
estados: recibe el plan resuelto y lo dibuja. Tampoco sube comprobantes (eso es
de la pantalla).

### `DocumentoImpresion` — hoja A4 imprimible

**Para qué sirve:** presupuestos, facturas y órdenes de trabajo en A4:
encabezado con emisor y receptor, número y meta, tabla de detalle, liquidación
(subtotal, descuento, IVA por tasa, otros y total), notas y pie, con botón de
imprimir opcional.

```jsx
<DocumentoImpresion
  titulo="Presupuesto"
  numero="0001-0000123"
  emisor={{ nombre: empresa.nombre, documento: empresa.ruc, direccion: empresa.direccion, logo: empresa.logo }}
  receptor={{ nombre: cliente.nombre, documento: cliente.ruc }}
  meta={[{ etiqueta: 'Emitido', valor: fechaHora(presupuesto.createdAt) }, { etiqueta: 'Válido hasta', valor: fechaDia(presupuesto.validUntil) }]}
  estado="Aprobado"
  estadoTono="ok"
  detalle={items.map((item) => ({ cantidad: item.quantity, concepto: item.name, unitario: item.unitPrice, subtotal: item.subtotal }))}
  liquidacion={{ subtotal, descuento, iva: [{ tasa: 10, base, monto }], total }}
  notas={presupuesto.notes}
  pie="ledbox.online · Documento generado desde el panel"
  onImprimir={() => window.print()}
/>
```

Props: `titulo`, `numero`, `etiquetaNumero`, `emisor`, `receptor`,
`meta`, `estado`, `estadoTono`, `detalle`, `liquidacion`, `notas`,
`notasEtiqueta`, `pie`, `onImprimir`, `etiquetaImprimir`, `moneda`,
`etiquetaDetalle`, `etiquetaEmisor`, `etiquetaReceptor`, `etiquetaLiquidacion`,
`etiquetaMeta`, `vacioDetalle`, `className`.

**Qué NO hace:** no llama a `window.print()` (lo dispara `onImprimir`), no
resuelve la marca ni los datos de la empresa y no muestra nada que no reciba.
Las reglas `@media print` viven en `styles.css` (`.oc-print`,
`oc-print-oculto`): la pantalla marca con `oc-print-oculto` su toolbar o
navegación.

### `SubidaImagen` — imagen sin dependencias

**Para qué sirve:** elegir una imagen con validación real (JPG/PNG/WebP por
firma, no por extensión), tamaño máximo, vista previa, arrastrar y soltar,
limpiar y compresión opcional en el navegador con canvas (avatar cuadrado o
logo con su relación de aspecto).

```jsx
<SubidaImagen
  etiqueta="Logo de la empresa"
  descripcion="Se ve en el portal y en los impresos."
  valor={empresa.logoUrl}
  cuadrado={false}
  error={errorDelApi}
  onImagen={(imagen) => guardar({ base64: imagen.base64, tipo: imagen.tipo })}
  onLimpiar={() => guardar(null)}
/>
```

Props: `etiqueta`, `descripcion`, `valor`, `error`, `tipos`, `tamanoMaximo`,
`comprimir`, `cuadrado`, `ladoMaximo`, `tamanoObjetivo`, `onImagen`,
`onLimpiar`, `limpiarEtiqueta`, `subirEtiqueta`, `cambiarEtiqueta`, `disabled`,
`ocupado`, `className`. Exporta `MIMES_IMAGEN`, `TAMANO_MAXIMO_IMAGEN`,
`mimeDeImagen`, `validarImagen` y `prepararImagen`.

**Qué NO hace:** no sube nada (entrega la imagen preparada por `onImagen`), no
recorta con otra lógica que la acordada (`cuadrado` o relación original), no
acepta PDF/GIF y no comprime fuera del navegador (`prepararImagen` devuelve un
error claro en el servidor).

### `ProgresoChecklist` — avance con umbrales

**Para qué sirve:** el avance de un checklist o de una lista de tareas: barra
accesible + «x de y» + porcentaje, con tono verde al completar, ámbar si hay
vencidas y rojo si el trabajo está en riesgo (próximo y sin ningún avance).

```jsx
<ProgresoChecklist
  hechas={avance.done}
  total={avance.total}
  vencidas={avance.overdue}
  riesgo={eventoProximo && avance.done === 0}
  sustantivo="tareas"
/>
```

Props: `hechas`, `total`, `vencidas`, `riesgo`, `sustantivo`, `porcentaje`,
`mostrarDetalle`, `alto`, `textoVacio`, `className`. La lógica pura está en
`progresoChecklist(...)`, que devuelve `hechas`, `total`, `pendientes`,
`vencidas`, `riesgo`, `completo`, `tono`, `porcentaje`, `etiqueta` y `detalle`.

**Qué NO hace:** no cuenta tareas ni conoce fechas; los números llegan
calculados por la pantalla. Sin tareas no dibuja una barra en 0 %: dice «Sin
datos».

## «Carga con IA» — asistente declarativo y motor portable (#11/#12)

**Para qué sirve:** cargar datos desde texto libre sin planillas: la persona
pega un mensaje o una lista, la IA detecta los registros y el diálogo muestra
una **vista previa editable por tarjetas con avisos**; **nada se crea sin la
confirmación** («Crear todo»). La app describe sus tipos con un **esquema
declarativo** e inyecta solo lo que conoce:

```jsx
const esquema = {
  tipos: [
    {
      id: 'clientes', label: 'Clientes', singular: 'cliente', plural: 'clientes',
      campos: [
        { id: 'nombre', label: 'Nombre', tipo: 'texto', obligatorio: true },
        { id: 'telefono', label: 'Teléfono', tipo: 'texto', ayuda: '0981 123 456' },
        { id: 'saldo', label: 'Saldo', tipo: 'moneda' },
        { id: 'alta', label: 'Alta', tipo: 'fecha' },
        { id: 'tipo', label: 'Tipo', tipo: 'select', opciones: [{ value: 'FINAL', label: 'Cliente final' }] },
      ],
    },
  ],
}

const [abierto, setAbierto] = useState(false)

<>
  <BotonCargaIA onAbrir={() => setAbierto(true)} />
  <DialogoCargaIA
    abierto={abierto}
    onCerrar={() => setAbierto(false)}
    esquema={esquema}
    consultarConfig={() => api.get('/api/ia/carga')} // → { configurada, modelo, tipos }
    analizar={(texto, tipos) => api.post('/api/ia/carga', { texto, tipos })} // → { registros, avisos }
    crear={(registros) => api.post('/api/ia/crear', { registros })} // → { creados, errores }
  />
</>
```

Props del diálogo: `abierto`, `onCerrar`, `esquema`, `analizar`, `crear`,
`consultarConfig` (opcional: sin él se asume configurado), `enlacePrivacidad`,
`titulo`, `placeholder`, `maxTexto` (20.000) y `maxRegistros` (25).
`BotonCargaIA` recibe `onAbrir`, `texto` y `tooltip`; el diálogo se monta recién
al abrirlo.

**Forma corta:** `CargaIA` envuelve botón + diálogo con **apertura diferida**
(el diálogo no se monta hasta el primer clic):

```jsx
<CargaIA
  esquema={esquema}
  consultarConfig={() => api.get('/api/ia/carga')} // → { configurada, modelo, tipos }
  analizar={(texto, tipos) => api.post('/api/ia/carga', { texto, tipos })} // → { clientes: [...], avisos: [] }
  crear={(registros) => api.post('/api/ia/crear', { registros })} // → { creados, errores }
/>
```

### Adopción en 3 pasos (motor incluido)

1. **Esquema** (arriba): los tipos y campos de la app, una sola vez.
2. **Endpoint** con el motor server `owncoding-ui/ia` (variables del servidor:
   `IA_API_KEY`, `IA_MODELO`, `IA_BASE_URL`; sin key queda apagado con aviso
   claro):

```js
// app/api/ia/carga/route.ts (Next route handler)
import { IAError, crearLimitadorIA, motorIA, estadoIA } from 'owncoding-ui/ia'

const motor = motorIA({ esquema, tipos: ['clientes'], aplicacion: 'MiApp' })
const limite = crearLimitadorIA()

export async function GET() {
  return Response.json({ ...estadoIA(), tipos: tiposPermitidos }) // { configurada, modelo, tipos }
}

export async function POST(request) {
  const { texto, tipos = ['clientes'] } = await request.json()
  const cupo = limite.permitir(`ia:${organizacionActiva}`)
  if (!cupo.permitido) {
    return Response.json({ error: 'Probá en unos minutos.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(cupo.esperaMs / 1000)) },
    })
  }
  try {
    return Response.json(await motor.analizar(texto, tipos)) // { clientes: [...], avisos: [] }
  } catch (falla) {
    if (falla instanceof IAError) {
      return Response.json({ error: falla.message }, { status: falla.codigo === 'ia_no_configurada' ? 503 : 502 })
    }
    throw falla
  }
}
```

3. **UI**: `CargaIA` (o botón + diálogo) con `analizar` apuntando al endpoint y
   `crear` a los endpoints propios de alta (mismos permisos, aislamiento y
   auditoría).

El contrato puro (`EsquemaIA`, `AnalisisIA`, `RegistroIA`,
`normalizarAnalisisIA`, `validarRegistrosIA`, `IA_TEXTO_MAX`, `IA_REGISTROS_MAX`,
`IA_RATE_LIMIT`, …) vive en `utils/cargaIA.js` y sale por `owncoding-ui` y por
`owncoding-ui/utils`. El **motor** (`motorIA`, `proveedorIA`,
`validarAnalisisIA`, `parsearSalidaIA`, `crearLimitadorIA`, `IAError`, …) sale
por `owncoding-ui/ia` (sin React y sin banner de cliente); el `fetch` del
proveedor es **inyectable**, así se prueba mockeado y sin red. **Qué NO hace:**
el componente no hace `fetch`, no conoce endpoints, permisos ni proveedores; el
motor no persiste el texto, no lo loguea ni escribe en la base: solo analiza y
devuelve registros para revisar, y la app los crea con sus endpoints después de
la confirmación humana. Reglas: `docs/REGLAS.md` §18.

## Formatos, estados, íconos y tipos (cierre del piloto de LedBox)

Los huecos que dejó el piloto de adopción en LedBox/EventOS (issue #3), cerrados
en la librería. Todos los agregados son opcionales: nada de lo que ya consumía
`v0.13.1` cambia de firma ni de valor por defecto.

### Dinero: símbolo configurable (`formatGs` y compañía)

El default sigue siendo **`Gs 1.234.567`** (sin punto). Una app que escribe
distinto pasa el símbolo por llamada (cadena suelta u objeto, recortado y unido
con un solo espacio):

```jsx
import { formatGs, montoTexto, montoConSigno, Money, CeldaMoneda, MoneyInput } from 'owncoding-ui'

formatGs(1201032)                        // 'Gs 1.201.032' (igual que antes)
formatGs(1201032, { simbolo: 'Gs.' })    // 'Gs. 1.201.032'
formatGs(1201032, '₲')                   // '₲ 1.201.032'
montoTexto(total, 'PYG', '—', { simbolo: 'Gs.' })
montoConSigno(-500000, 'PYG', '—', { simbolo: '₲' })

<Money value={total} simbolo="Gs." />
<CeldaMoneda valor={total} simbolo="Gs." />
<MoneyInput value={total} onValueChange={setTotal} symbol="₲" /> // `symbol` ya existía
```

`PlanPagos`, `DocumentoImpresion` e `ImporteDelta` suman la prop opcional
`simbolo` y la propagan a todos sus montos. El mapa `SIMBOLOS_MONEDA`
(`PYG` → `Gs`, `USD` → `US$`, …) es la fuente única del prefijo.

### Fechas con zona (`timeZone`)

`fechaHora`, `fechaDia`, `fechaHoraCorta` y `fechaCorta` aceptan un tercer
argumento con `timeZone` (o un objeto de opciones como segundo argumento). Sin
zona se mantiene el huso del navegador (compatible) y las fechas puras
`YYYY-MM-DD` se dibujan como día de calendario, sin corrimiento:

```jsx
import { fechaHora, fechaDia } from 'owncoding-ui'

fechaDia(pago.dueAt, '—', { timeZone: 'America/Asuncion' })   // '21/9/2026'
fechaHora(evento.startsAt, { timeZone: 'America/Asuncion' })  // '21/9/26, 23:30'
fechaHora(evento.startsAt, '—', { timeZone: 'UTC' })           // '22/9/26, 02:30'
fechaDia('2026-09-22', '—', { timeZone: 'America/Asuncion' })  // '22/9/2026' (día puro)
```

### `ChipEstado`: estados de negocio

El chip de dispositivos (`pass`, `revision`, `pendiente`, `falla`) suma los
estados de negocio habituales, con lectura tolerante (mayúsculas, acentos,
espacios y género):

```jsx
<ChipEstado estado="aprobado" />              // Aprobado · verde
<ChipEstado estado="Pagada" />                // Pagado · verde pass
<ChipEstado estado="En revisión" />           // En revisión · azul
<ChipEstado estado="POR COBRAR" />            // Por cobrar · ámbar
<ChipEstado estado="vencido" />               // Vencido · rojo
<ChipEstado estado="cancelado" etiqueta="Anulado por el cliente" />
```

Mapa: `borrador` (neutro), `enviado` (azul), `aprobado` (verde), `rechazado`
(rojo), `vencido` (rojo), `cobrado`/`pagado` (verde pass), `por cobrar`
(ámbar), `activo` (verde), `pausado` (ámbar), `anulado` (neutro), `cancelado`
(rojo) y `en revisión` (azul). La etiqueta y el `tono` por props siguen pisando
el mapa; `title` lleva la etiqueta y el ícono es decorativo (`aria-hidden`).

### `Stat` con tono y nota

```jsx
<Stat label="Por cobrar" valor={montoTexto(total)} tono="danger" nota="3 cobros vencidos" />
<Stat label="Ventas" valor={montoTexto(ventas)} delta={12.5} sub="vs. agosto" />
```

`tono` colorea el valor con el mapa semántico (`ok`/`warn`/`bad`/`info`/`mute`,
con alias como `danger` o `accent`) y `nota` agrega el pie del KPI
(`AdminKpi`). Sin `tono`/`nota`, la tarjeta se dibuja exactamente como antes.

### Íconos nuevos (mapa desde el panel de LedBox)

El set suma 23 glifos con el trazo de la librería (1.75) para los módulos y las
acciones que el panel ya usaba; ningún nombre existente se renombró ni cambió de
glifo. `ICONOS` expone la lista completa.

| `AdminIcon` (LedBox) | Librería | | `AdminIcon` (LedBox) | Librería |
| --- | --- | --- | --- | --- |
| `overview` | `overview` | | `arrow-right` | `arrowRight` |
| `events` | `events` | | `arrow-left` | `arrowLeft` |
| `calendar` | `calendar` | | `sun` | `sun` |
| `clients` | `clients` | | `moon` | `moon` |
| `leads` | `leads` | | `power` | `power` |
| `budgets` | `budgets` | | `mail` | `mail` |
| `receipt` (Facturación) | `receipt` | | `print` | `printer` |
| `finance` | `finance` | | `bank` | `bank` |
| `inventory` | `inventory` | | `checkin` | `checkin` |
| `suppliers` | `suppliers` | | `globe` | `globe` |
| `promoters` | `promoters` | | `database` (Sistema) | `database` |
| `building` (Empresa) | `building` | | `instagram` | `instagram` |
| `plan` | `plan` | | `eye-off` | `eyeOff` |
| `audit` | `audit` | | `chevron-down` | `chevron` |
| `users` | `users` | | `refresh`, `clock`, `info`, `trash`, `upload`, `download`, `lock`, `image`, `external`, `search`, `plus`, `check`, `edit`, `alert`, `wallet`, `bell`, `menu`, `close`, `logout`, `user` | los mismos nombres |

Los glifos de `calendar`, `receipt`, `users`, `wallet`, `image`, `lock`,
`refresh`, `clock`, `info`, `search`, `edit`, `trash`, `download`, `upload`,
`external`, `bell`, `menu`, `close`, `logout`, `plus`, `check` y `alert` son
los que la librería ya tenía: no se pisan para no cambiar pantallas existentes.

### Preset, hojas CSS y tipos

- **`owncodingContent`** (Tailwind 3.4 ignora el `content` del preset): ver el
  arranque del README.
- **`tokens.css` / `base.css` / `styles.css`**: ver el arranque del README.
- **Tipos `.d.ts`**: `package.json` declara `types` y la condición `types` del
  `exports`; `npm run build` copia `types/index.d.ts` a `dist/index.d.ts`. Los
  tipos son aditivos: la app los consume sin cambiar su código.



## Estructura

```
src/components/   objetos portables (ui.jsx = primitivas y objetos)
src/utils/        lógica compartida pura (moneda, fechas, teléfono, nombre, bancos, tabla, cn)
src/printing/     estado de impresoras y trabajos (puro)
src/styles/       tokens.css (solo variables) · base.css (base opt-in) · styles.css (las dos)
types/            declaraciones .d.ts escritas a mano (el build las copia a dist/)
docs/             REGLAS.md · REGLAS-ECOSISTEMA.md · SHELL.md · V2.md · MIGRACION-V2.md · ADOPCION.md · ADOPCION-V2.md · MODOS-DE-TRABAJO.md · COMANDOS.md · PLANTILLA-AGENTS.md · IMPRESION.md · ALIMENTAR.md · INFRA-WILDCARD.md
tools/            auto-ht.sh (política automática de integración, ver docs/COMANDOS.md)
scripts/build.mjs build (esbuild → dist/index.js + dist/index.d.ts + dist/styles.css + tokens.css/base.css)
test/             smoke de render (vitest + renderToStaticMarkup), lógica y contrato del paquete
```

## Alimentar la biblioteca

La biblioteca crece con lo que ya funciona en las apps y también cosecha de
otras apps del grupo: ver `docs/ALIMENTAR.md` (criterio, pasos y cuándo no
traerlo).

## Versionado

- `v0.x` = biblioteca en formación; los objetos pueden cambiar de nombre.
- Cada release sube la versión del `package.json` y se etiqueta (`v0.1.0`).
- Una app adopta una versión fija; para subir, se cambia la dependencia y se
  corren sus checks (la adopción es un cambio de la app, no de la librería).

## Pendientes (fase 2)

- ✅ **Identidad unificada (#211):** publicada en **v0.16.0** — `PersonaChip`
  (foto local → Google → iniciales, con `size`/`nombreCorto`/`estado`/`title`)
  y el adaptador `identidadDeUsuario`; el `Avatar` suma `onError` y los tamaños
  `xs`/`xl` para la cadena de fotos.
- **Tipos:** el paquete publica `dist/index.d.ts` con los objetos principales
  (props de uso real). Sigue pendiente que los tipos sean exhaustivos y se
  generen desde el código (hoy se escriben a mano en `types/index.d.ts`).
- **Adopción por app:** migrar MobOS (y luego ScaleOS, LedBox, PagaYa) a
  consumir el paquete sin romper nada. Ver `docs/MODOS-DE-TRABAJO.md`.
- Objetos de MobOS que aún no se portaron: `ComprobantePreview` (compone la
  impresión de cada app: agente, cola y plantillas — las piezas portables,
  `VistaPreviaPapel` y `DocumentoImpresion`, ya viven acá) y el agente de
  impresión (no es UI). `SeccionColapsable`, `ProductCombobox` y los combos
  con datos (`BancoCombobox`, `CityAutocomplete`) se portaron en **v0.15.0**.
