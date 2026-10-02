# Reglas de interfaz — OwnCoding

Reglas vivas, portables a cualquier app del grupo. Antes de crear un campo, un
aviso o una celda, se busca acá y se usa el objeto del paquete. Si algo falta,
se crea en `owncoding-ui` y se adopta en todas las apps.

> **Anexo de ecosistema (Segundo Cerebro):** acceso, permisos, eliminación,
> seguridad, infraestructura (Hub), correo (WEEM), SaaS/pagos/dominios,
> publicación y **protección de datos personales (Ley 7593/2025, §12)** están
> en **`docs/REGLAS-ECOSISTEMA.md`**. Este documento (REGLAS) cubre la
> **interfaz**; el anexo es igual de obligatorio y aplica a todas las apps del
> grupo.

## 1. Campos de formulario

### Tabla por tipo de dato

| Tipo | Objeto | Patrón |
| --- | --- | --- |
| Texto libre | `Input` + `Label`/`FormField` | label arriba (`htmlFor`), `required` real, `maxLength` por tipo (120/200) |
| Texto largo | `Textarea` | hasta 2000/400 según uso, `rows` fijo |
| Moneda Gs/USD | `MoneyInput` + `CurrencySelect` | PYG sin decimales, USD/monedas con 2; el símbolo lo dibuja el campo; `max` por tipo de monto |
| Moneda de solo lectura | `Money` | nunca convertir a mano; no finito → `—` |
| Porcentaje | `PercentField` | coma decimal, 0–100; guardar con `parsePercent`, mostrar con `formatPercent` |
| Teléfono | `PhoneField` | código de país editable (default +595), valida con `telefonoValido`; guardar con `componerTelefono`. El número conserva **ancho mínimo** (`min-w-[8.5rem]`) y la fila código + número **envuelve** cuando el contenedor es corto (p. ej. `TAMANOS_CAMPO.telefono` = `w-44` o una grilla de dos columnas): el campo crece a lo alto en vez de aplastar el número |
| Correo | `EmailField` | sugiere dominios mientras se tipea, sin romper pegado/autofill |
| Serial/IMEI | `SerialField` | mayúsculas, sin espacios ni prefijo; varios seriales con normalización propia (prop `normalizar`) |
| Fechas/horas | `Input type="date"`/`datetime-local` | 24 h; para mostrar, `fechaHora`/`fechaDia`/`fechaCorta` |
| Booleano | `Switch` | interruptor estilo iPhone, guarda `onChange(event.target.checked)` |
| Selección múltiple | `Input type="checkbox"` | para listas con varias filas |
| Opciones excluyentes (2–5) | `SegmentedField` | `aria-pressed`; opciones `[id, etiqueta, icono?, contador?]` |
| Subnavegación | `Subtabs` | pestañas anchas de una subpágina |
| Catálogo cerrado | `Select` | nunca texto libre para catálogos |
| Lista/cuadrícula | `ListGridToggle` | solo íconos, `aria-pressed` |
| Búsqueda instantánea | `SearchField` | lupa + limpiar; el debounce vive en la pantalla |
| Proveedor (catálogo) | `BuscadorProveedor` | input search con **últimos usados por defecto** (`recientes`), filtro por **nombre o abreviatura** (`code`) y **alta rápida** (`onCreate` async → proveedor creado). Elegir avisa por `onSelect`; el catálogo entra por props o se consulta al servidor con `onQueryChange` |
| Cuenta de cobro | `SelectorCuentaCobro` (+`TarjetaCuentaCobro`) | al elegir **colapsa el buscador** y muestra **una sola tarjeta** (nombre, logo o medio, moneda, tipo de transferencia, banco —una sola vez— y saldo pendiente) con la acción «Cambiar cuenta» que reabre la búsqueda. **Preselección** con `preseleccionar` + `ultimoUsadoId`/`predeterminadaId` (helper `preseleccionDeCuenta`). **Hasta 100 cuentas** (`LIMITE_CUENTAS`) con scroll y **virtualización** estable en mobile (`ventanaDeLista`); las flechas mueven el resaltado sin arrastrar la página. `logo`/`detalle` se pasan por función; helpers de medio/símbolo/número parcial en `utils/cuentaCobro.js` |
| Acción dentro del campo | `BotonDentroCampo` | botón trailing **adentro** del input (`relative` + `pr-11`): ícono con tooltip (`title`/`aria-label`) y estado ocupado «Consultando…» con spinner; vacío → `disabled`. La pantalla decide qué hace `onClick` (la librería no consulta nada) |
| Dispositivo (modelo → variantes) | `BuscadorDispositivo` (+`PERFILES_DISPOSITIVO`, `etiquetaDispositivo`) | **El modelo manda**: se busca por nombre o código y recién ahí se despliegan capacidad, color, conectividad (mobile), marca y categoría (accesorios) o capacidad/color (servicio); cambiar de modelo limpia las variantes que no aplican. Catálogo y perfil por props (guía: `docs/DISPOSITIVOS.md`) |
| Producto | `ProductCombobox` | buscar/elegir y **crear** desde el campo: sugerencias en flujo (no superpuestas) con `role="combobox"`/`listbox`, teclado ↑↓/Enter/Esc y «Agregar … como producto nuevo»; la pantalla filtra en memoria o consulta al servidor (`onQueryChange`) |
| RUC / CI | `RucField` (+`extraerRuc`/`esRuc`) | input con el botón **Extraer** adentro (trailing, `BotonDentroCampo`): la consulta entra por `consultar` (async) y el resultado se aplica solo al confirmar («Usar estos datos»); sin `consultar` el botón no se muestra |
| Serial (lectura) | `SerialTexto` | el serial completo si entra y, si la columna queda corta, se recorta la cabeza y los **últimos 4** siguen visibles; vacío → `—` |
| Seriales por lote (pegar/escanear) | `CampoSeriales` (+`imeiValido`, `separarSeriales`, `normalizarSeriales`) | textarea que normaliza al vuelo y entrega **solo los válidos únicos** por `onCambio`, con conteos de repetidos e inválidos; para IMEI se pasa `validar={imeiValido}` (15 dígitos + Luhn) |
| Ciudad | `CityAutocomplete` | sugiere al tipear y **resuelve el departamento solo** (es dependiente de la ciudad); el catálogo es bilingüe (`ciudad`/`departamento` y `city`/`department`) y el texto libre sigue permitido |
| RUC/identificación fiscal | `TaxIdField` | RUC PY de 5 a 8 dígitos, con o sin verificador (`taxIdValid`); el resto de los países usa el patrón genérico. Se guarda con `normalizeTaxId`; la consulta de razón social es un callback de la app (`onBuscarRazonSocial`): la librería no consulta nada |

### Tamaños recomendados (#148, portable)

| Dato | Clase | Ejemplo |
| --- | --- | --- |
| Monto | `w-36` (`monedaAmplia`: `w-44` en ventas) | Gs 12.500.000 |
| Porcentaje | `w-24` | 12,5 |
| Cantidad | `w-20` | 999 |
| Fecha | `w-40` | 17/09/2026 |
| Teléfono | `w-44` | +595 981 123 456 |
| RUC/CI | `w-44` | 80012345-6 |
| IP | `w-40` | 192.168.1.50 |
| Ciudad | `w-56` | Ciudad del Este |

`TAMANOS_CAMPO` (librería) trae los valores; `MoneyInput` y `PercentField` ya
aplican su ancho por defecto y la pantalla puede pisarlo (`w-full` cuando el
campo va solo). Regla: **el campo no se estira más de lo que el dato necesita**;
si hay espacio libre, se lo lleva el layout, no el input.

Transversales: error **o** hint (nunca ambos), `aria-invalid` +
`aria-describedby`, error con `role="alert"`, teclado móvil correcto y nada de
máscaras que rompan pegado/autofill. El campo de monto mantiene el caret al
tipear y pegar (`normalizarMontoInput` + `caretTrasDigitos`, #2) y acepta
`integerOnly` para los montos enteros de previsión/informes. `FormField` dibuja el mensaje con `id`
(derivado de `htmlFor` o pasado como `descripcionId`) para que el campo lo
declare en `aria-describedby` incluso cuando el id es generado (`useId`). El
servidor revalida siempre. El interruptor booleano es **`Switch`** (un solo
objeto; #186 retiró el alias `Toggle` y la librería no expone alias de
compatibilidad).

**Datos personales (Ley 7593/2025):** todo formulario que recolecte datos
personales muestra la **finalidad** y el enlace a la **política de privacidad**
en el propio punto de recolección; el consentimiento va explícito, por
finalidad y **sin venir pre-tildado** (nunca atado a los términos), se registra
con versión/fecha/canal y se revoca con el mismo peso. Objetos
`AvisoPrivacidad` y `ConsentimientoDatos`; regla completa en
`docs/REGLAS-ECOSISTEMA.md` §12.

### Un componente por tipo de dato (#10)

- **Biblioteca primero, sin duplicar.** Si el tipo de dato ya tiene objeto en
  `owncoding-ui` (moneda, correo, RUC/CI, teléfono, fechas, porcentaje,
  búsqueda, serial, ciudad…), el formulario usa **ese** componente; la lógica
  (normalización, caret, validación, formato, teclado móvil) vive una sola vez
  y **editar el componente corrige a todas las apps**.
- **Prohibido reimplementar el campo por pantalla**, aunque parezca «solo un
  input»: la copia deja variantes que se desincronizan. Si la pantalla necesita
  otra cosa, se agrega una **prop** al objeto (o se porta el caso nuevo a la
  biblioteca, §9) y la copia local se borra en el mismo cambio.
- **Un solo objeto por tipo dentro de cada app:** no conviven dos campos de
  correo, dos selectores de fecha ni dos buscadores para lo mismo. La app puede
  **frenar la duplicación** con su test de contrato (referencia real: MobOS,
  `docs/CAMPOS.md` §6 y `src/lib/camposReglas.test.js`).
- El alta de un dato nuevo sigue **§9**: objeto con props claras, test en
  `test/` y regla en este documento.

### Alineación garantizada (#10)

- En una fila o grilla, los controles (inputs, selects, botones) comparten
  **línea base**: arrancan a la misma altura, en horizontal y en vertical.
- El **label arriba y el hint/error abajo no pueden desalinear el control**: la
  garantía vive en el objeto/CSS del campo (el mensaje ocupa su lugar sin
  empujar ni descuadrar la fila). La pantalla no compensa con márgenes,
  `min-h` ni alturas fijas: no se pelea el layout a mano.
- Campo y botón en la misma fila alinean por el **borde del control**, no por
  su texto. Si el campo tiene `hint`/`error`, la fila va **dentro** del
  `FormField` con el slot `accion` (label → fila [input + botón] → mensaje
  debajo); nunca el botón hermano con `items-end` (#112). los controles que no cambian su dibujo usan las utilidades del kit
  (`.toque-44`, `PIE_ACCIONES`, `GRILLA_DOS_COLUMNAS`).
- El error/hint usa el mecanismo del campo (`FormField`, §1 y §3): **uno u
  otro, nunca los dos**, con `aria-describedby`/`aria-invalid`, y su aparición
  no mueve el control.
- La verificación se **mide sobre el render real**; no se declara por CSS.

**Checklist de verificación (#10):**

- [ ] Cada dato usa el objeto de la biblioteca si existe; no hay copias locales
      del campo ni de su validación.
- [ ] Un solo componente por tipo en el repo (sin variantes espejo).
- [ ] Misma línea base con `label` y sin `label`.
- [ ] Misma línea base con `hint`, con `error` y sin mensaje.
- [ ] Campo + botón en la misma fila alinean por el borde del control.
- [ ] Grilla de dos columnas sin saltos de altura entre celdas/filas.
- [ ] Medido a **390 px** y **1440 px**, en claro y oscuro.

## 2. Botones y acciones

- Jerarquía: primario (marca), secundario/outline, peligro (rojo, nunca marca),
  fantasma. No se restylean sin pedido.
- Botón solo-icono: `IconAction` (trae `aria-label` y `title`).
- Deshabilitado: opacidad reducida y `cursor: not-allowed`; foco visible.
- **Bloque de pago (`BloquePago`, #265):** al mostrar varios medios de pago, el
  contenido de cada uno (medio/cuenta/monto) va dentro de la tarjeta y la
  **papelera va adentro**, arriba a la derecha (`IconAction` `tone="bad"`
  `size="touch"`, con tooltip), así la fila gana el ancho completo. La
  confirmación de quitar, si hace falta, es de la pantalla.
- **Alto táctil ≥44 px (móvil, #249):** los controles agrupados crecen con
  `min-h-11` (`SegmentedField`, `Subtabs`, barra inferior) y los que no pueden
  cambiar su dibujo suman la utilidad **`.toque-44`** (pseudo-elemento centrado
  de 44×44 que captura el toque, sin mover el layout): `ListGridToggle`,
  `IconAction size="touch"` (36 px de dibujo, 44 de toque) y los botones del
  shell. Radios por contexto.
- Medición y hallazgos: auditoría responsive mobile (#249). Una acción de fila
  que quede corta se agrupa en un menú (`MenuDesplegable`) en vez de achicar el
  toque.

## 2 bis. Acceso (login/registro)

- `GoogleButton` (+ `GoogleMark`, `OAuthDivider`) para el acceso con Google;
  `AuthLayout` arma la pantalla (slots de logo, copy de marca, acciones y pie);
  `ProductFooter` y `LoadingScreen` son institucionales y van por props
  (**regla del pie institucional: §14**).
- `PegarEnlaceToken` resuelve los enlaces de correo que llegan incompletos.
- Todos son **sin API**: no leen sesión ni llaman al backend; la app maneja el
  flujo y pasa callbacks.

## 2 ter. Ciclo de guardado (#2)

- **Envío único:** los formularios que validan o guardan con async usan
  `useSingleFlightSubmit(envio)` (`{ pendiente, onSubmit }`): el bloqueo empieza
  **antes** de la validación asíncrona, un segundo submit mientras corre se
  ignora y `pendiente` pertenece al envío original. No se reimplementa con un
  `useState` suelto ni se limpia el estado desde otro envío.
- **Cierre después de persistir:** al terminar de escribir se llama
  `completeSave(cerrar, refrescar, { avisar })`: cierra, refresca y convierte un
  fallo de refresco en advertencia (`AVISO_REFRESCO`) — «no hace falta guardar
  otra vez». Nunca se envuelve la mutación con `completeSave`.
- Mientras el formulario está pendiente, el diálogo no se cierra: el form lo
  registra con `useDialogPending(pendiente)` o usa el objeto `SaveActions`
  (§5), que ya trae el botón de cancelar deshabilitado y el pie asociado al
  `<form>` real.

## 3. Avisos, estados y vacíos

- `Aviso` es el único objeto para el mensaje inline: `tono="error"` (role
  `alert`), `tono="ok"`/`tono="warn"` (role `status`), `compact` para el tamaño
  chico, `como="div"` cuando el contenido es estructurado (ícono o botón de
  reintentar). No se copia el `<p>` con borde y fondo de color.
- **Error/hint de un campo:** se dibuja con el mecanismo del campo (`FormField`
  con `role="alert"` y `id`, §1), no con `Aviso`; uno u otro, nunca los dos, y
  su aparición **no mueve el control** (alineación garantizada, §1).
- `Nota` es la aclaración que **no** es resultado (no anuncia con `role`):
  `tono="warn"` (predeterminado, borde ámbar), `tono="info"` o `tono="neutro"`,
  `compact` para el tamaño chico y `como="div"` si lleva estructura. Tampoco se
  copia el `<p>` con `border-warn/30 bg-warn/10`.
- Vacíos: `EmptyState` (`compact` dentro de tablas y paneles), con acción
  opcional.
- Carga: `Skeleton` para placeholders; las pulsaciones decorativas (un ícono,
  un punto de estado) no son skeletons.
- Errores de pantalla completa: `ErrorState` con reintento.
- **Transversal (#293):** nada de éxito falso —el resultado sale del dato real—
  y toda pantalla tiene los cuatro estados: cargando / vacío **con acción** /
  error **con reintento** / lleno (§15.1 y §15.3).
- Conexión: `IndicadorConexion` en `variante="chip"` (cola offline) o `variante="banner"` (franja ancha del shell; sin conexión usa la superficie roja con texto legible en cada tema).
- **Estados de negocio:** también se dibujan con `ChipEstado` (un solo chip en
  toda la app): `borrador`, `enviado`, `aprobado`, `rechazado`, `vencido`,
  `cobrado`/`pagado`, `por cobrar`, `activo`, `pausado`, `anulado`, `cancelado`
  y `en revisión`, con la etiqueta y el tono del mapa `ESTADOS_CHIP`
  (`utils/estadoEquipo.js`). La lectura tolera mayúsculas, acentos, espacios y
  género («Pagada», «EN REVISIÓN»). La app no copia el `<span>` con borde y
  fondo: usa el chip, pisa `etiqueta`/`tono` si su módulo lo necesita y nunca
  inventa un estado (uno desconocido cae en «Pendiente»).
- **Estados con badge:** `EstadoBadge` toma el mapa de cada dominio
  (`{ ESTADO: { label, color } }`) y dibuja el `Badge`; un valor fuera del mapa
  se muestra crudo y el vacío es explícito (`vacio`), nunca un badge en blanco.
- Estados de sección: `SectionState`
  (`estado="vacio" | "cargando" | "error"`), compacto y con `action`/`onRetry`.
  **Compone** `EmptyState`, `Skeleton` y `ErrorState` en vez de duplicar su
  markup: cada estado sigue teniendo su objeto cuando se usa suelto.

## 4. Datos y tablas

- Encabezado: `CELDA_ENCABEZADO` (una línea, truncado); rótulos de sección:
  `ROTULO_SECCION`; etiqueta de dato: `ROTULO_DATO`.
- Dato secundario: `CELDA_DATO`; número/cantidad: `CELDA_NUMERO`
  (`text-right tabular-nums`); **dinero: `CeldaMoneda`** (renderiza `Money`).
- `FilaDato`: fila etiqueta/valor de paneles de detalle (mantiene `dt`/`dd`).
- `SeccionColapsable`: sección de detalle plegable (arranca cerrada, `aria-expanded` + `aria-controls`); con `clave` recuerda el estado en la sesión y el contenido queda en el DOM con `hidden` (los apoyos de lectura y las pruebas lo encuentran).
- Barras de avance: `BarraProgreso` (accesible, con tono y altura).
- Vencimientos: `Vencimiento` (+`estadoVencimiento`) dice «venció», «en 3 d» o la fecha con el tono según la urgencia (garantías, cuotas, cobranzas) y vacío explícito.
- Stock contra el punto de reposición: `MedidorStock` (`texto`/`chip`/`barra`; agotado/reponer/en stock; sin dato dice «Sin dato», nunca 0).
- Avance de un lote: `ContadorLote` («3 de 12», variantes `texto`/`chip`/`barra`, tono según el avance, `mostrarFaltan`).
- **Recepción (#250 F5):** `FilaRevision` (lo esperado + serial con los últimos 4 + el chip del estado), `SelectorIncidencia` (elegir/quitar el tipo en la fila) y `DestinoRecepcion` (recibir en el depósito predeterminado en un clic o elegir otro; avisa los IMEI pendientes). Estados, etiquetas y tonos salen de `utils/revision.js` (`ESTADOS_REVISION`, `INCIDENCIAS`), el mismo mapa que usa `ResumenIncidencias` (faltantes/sobrantes/dañadas/incorrectas/sin IMEI con conteos reales; sin incidencias lo dice en verde).
- Destinos de una compra consolidada: `ResumenDestinos` («1 pedido A · 3 stock», conserva los destinos;#250 §5).
- Reglas: misma altura de fila, sin cortes de texto, acciones en una línea,
  montos/fechas/códigos con `nowrap` + dígitos tabulares.
- Vacíos y estados dentro de la tabla: `EmptyState compact`.

## 5. Diálogos y overlays

- **Ancho por tipo, no por uso:** `Modal` expone `size` y el ancho vive en
  `utils/modal.js` (`TAMANOS_MODAL`): `corto` = `max-w-md` (avisos,
  confirmaciones y formularios de un campo), `formulario` = `max-w-xl`
  (predeterminado: formularios de una columna), `amplio` = `max-w-3xl`
  (formularios de dos columnas, tablas y contenido amplio) y `completo` =
  `max-w-5xl` (editores y pantallas grandes). No se pasa `max-w-*` en el
  `className` de un modal. `ConfirmDialog` usa `corto`.
- **Sin franjas vacías:** el contenido de un modal `amplio`/`completo` se
  acomoda en grillas (`GRILLA_DOS_COLUMNAS`, filas de tabla), nunca en una
  columna angosta con la mitad del modal vacía.
- `Modal`/`ConfirmDialog` con foco atrapado, `Esc`, scroll bloqueado y retorno
  de foco; el pie de guardado va asociado al formulario y bloquea doble clic.
- Ese comportamiento vive en `useDialogFocusTrap(open, onClose, ref, opciones)`
  (`src/hooks/`), compartido por `Modal` y `Drawer`: bloquea el scroll, enfoca
  al abrir (o lo que devuelva `initialFocus()`), cicla Tab, cierra con `Esc` y
  devuelve el foco al elemento anterior. Un overlay propio usa el hook en vez de
  copiar la trampa. El hook además sostiene la **pila de capas** (#2): la capa
  superior es la única que responde a `Esc`/Tab/foco y la única que lleva
  `aria-modal`; el scroll se restaura cuando se cierra la última y el foco
  vuelve a lo que abrió la capa. `busy` bloquea el cierre interactivo.
- **Pending por formulario (#2):** cada `<form>` del diálogo registra su
  bloqueo con `useDialogPending(pendiente)` mientras guarda; el diálogo no
  cierra (Esc, clic afuera, botón ×) hasta que terminan todos. Un formulario
  ocioso no destraba a otro que está guardando y el registro se libera en
  layout effect para que un guardado confirmado pueda cerrar.
- **Pie asociado al `<form>` real (#2):** `FormActions` monta las acciones en
  el pie del diálogo (fuera del área de scroll) y les pone `form={id}`, así la
  validación nativa, el Enter y el `disabled` siguen siendo los del
  formulario. `SaveActions` es el pie completo del ciclo de guardado: registra
  el pending y deja el cancelar deshabilitado mientras guarda.
- Eliminación destructiva: confirmación propia; datos críticos con doble
  confirmación y plazo recuperable.

## 6. Identidad y personas

- Identidad **por ID**, nunca por nombre o correo.
- **`PersonaChip` (#211) es el único objeto para mostrar a una persona** en
  cualquier superficie: envuelve a `Avatar` y resuelve la foto en un solo
  orden —**foto local** (`foto`, la resuelve la app por id) → **foto de Google**
  (`picture`) → **iniciales**—, con caída a la siguiente fuente si la imagen
  falla (nunca un cuadro roto). Props: `user` (objeto o texto), `foto`,
  `picture`, `size` (`xs`…`xl`), `nombre` (mostrar/ocultar), `nombreCorto`
  (solo el primer nombre en contextos compactos), `estado`
  (`en-linea`/`ausente`/`ocupado`/`offline`), `title` y `children` (texto extra,
  p. ej. la fecha). Expone `data-testid="persona-chip"`.
- El adaptador `identidadDeUsuario(fuente)` normaliza los campos habituales
  (`name`/`nombre`, `avatarUrl`/`foto`/`photoURL`, `picture`, `hasAvatar`) y
  `ESTADOS_PRESENCIA` define la etiqueta y el punto de cada estado. La app no
  vuelve a pluckear campos ni dibuja la foto a mano.
- **Cambio de imagen sin foto vieja (#271):** al cambiar `src`/`foto`, el
  `Avatar` monta un nodo nuevo (`key` por URL) y muestra el **placeholder
  neutro** de iniciales hasta que la imagen carga; el navegador no puede
  mantener la imagen anterior (eso producía el flash de la foto previa al
  recargar el bloqueo). Si la imagen falla, cae a iniciales y avisa por
  `onError` (la app pasa a la fuente siguiente: local → Google).
- `primerNombre` para contextos compactos (la cronología) — ya en la librería.
- `normalizarNombre` respeta las **razones sociales** (`esRazonSocial`): un
  nombre de empresa con tipo societario (S.A., S.R.L., LTDA, cooperativa…)
  no se reordena ni se capitaliza como un nombre de persona, aunque venga en
  mayúsculas desde el proveedor de RUC.

## 7. Dinero, fechas y formatos

- Un solo lugar para cada formato: `moneda.js` (`formatGs`, `formatUsd`,
  `montoGs`/`montoUsd`/`montoTexto`), `fecha.js` (24 h, vacío explícito,
  nunca “Invalid Date”), `telefono.js` (`whatsappUrl` arma el único enlace).
  El teléfono se guarda y se muestra en el formato canónico agrupado
  (`+595 981 123 456`) con `componerTelefono`/`normalizarTelefono`; el pegado
  internacional `00…` se parte solo (`parseTelefono`) y `internationalPhone`
  devuelve los dígitos para `wa.me`.
- Listas densas (#2): `fechaLista` (`17 sept 26 · 14:30`, con la hora aparte
  en `{ hora }`) y `fechaListaCorta` (`17-sept`), con la zona de la app
  (`{ timeZone: 'America/Asuncion' }`); un día puro se formatea en UTC y no se
  corre de fecha. El vencimiento se mide por día de calendario con `diasHasta`
  y su tono sale de `tonoVencimiento` (`bad` vencido, `warn` dentro de
  `diasAviso`) — el mismo cálculo que usa `Vencimiento`/`estadoVencimiento`.
- Seriales en listas y fichas (#2): `SerialTexto` mantiene la cola siempre
  visible y con `enmascarar` deja solo `••••4821` donde el serial completo no
  aporta (el valor completo queda en el `title`).
- **Símbolo del guaraní configurable:** el default es `Gs 1.234.567` (sin
  punto); la app que escribe distinto pasa `{ simbolo: 'Gs.' }` (o `'₲'`) por
  llamada a `formatGs`/`montoTexto`/`Money`/`CeldaMoneda`/`MoneyInput`
  (`symbol`)/`PlanPagos`/`DocumentoImpresion`/`ImporteDelta`. No se arma el
  prefijo a mano ni se copia el mapa de símbolos (`SIMBOLOS_MONEDA`).
- **Zona horaria explícita:** `fechaHora`/`fechaDia`/`fechaHoraCorta`/
  `fechaCorta` aceptan `{ timeZone }` (p. ej. `America/Asuncion`) para que el
  servidor y el cliente dibujen el mismo día; sin zona se usa la del navegador.
  Una clave `YYYY-MM-DD` es un día de calendario y no se corre de zona.
- Prohibido `toLocaleString` de dinero/fechas por pantalla y los helpers
  locales (`fmt`, `fecha`, `precio`).
- **Del servidor:** la lógica pura (dinero, fechas, teléfono, catálogos,
  estados) se importa de `owncoding-ui/utils` —la entrada sin React ni
  `"use client"`—; los objetos de interfaz salen de `owncoding-ui`. No se
  reimplementa un helper del paquete para el server.
- Los montos y las fechas no se convierten ni se inventan: dato ausente → texto
  de vacío.

## 8. Tokens y estilo

- Colores, tipografía y sombras salen del preset + `styles.css`; prohibido
  hardcodear colores o usar estilos inline salvo valores dinámicos.
- **Transversal (#293):** tres temas —claro, oscuro y **alto contraste**— y
  objetivos táctiles de **≥44 px** en móvil (`.toque-44`/`min-h-11`); las
  entregas de UI se documentan con capturas (§15.4).
- **Hojas separadas (22-09-2026):** `tokens.css` trae **solo variables**
  (importable en una app con diseño propio sin que le toque `html`/`body`);
  `base.css` es la base global opt-in (`html`, `body`, tipografías, foco,
  placeholders, tabulares, `.pin-oculto` y `@media print` de
  `DocumentoImpresion`); `styles.css` es las dos concatenadas (compatibilidad
  total con las apps que ya lo importan).
- **Tailwind — `owncodingContent`:** el preset **no alcanza** en Tailwind 3.4
  (el `content` de un preset se ignora): la app suma `owncodingContent` a su
  propio `content` o los componentes se purgan en silencio (íconos gigantes).
- **Íconos:** un solo set (`Icon`, 78 glifos, `ICONOS`) con el trazo de la
  librería; los nombres del panel de LedBox ya existen (mapa en el README) y no
  se renombran glifos existentes. Un nombre desconocido no dibuja nada (nunca
  un cuadrado roto).
- **KPI:** `Stat` con `tono` (color del valor por tono semántico), `nota`,
  **`deltaComo="chip"`** (tendencia en chip con tinte AA) y **`barra`**
  (barrita de color cuando no hay delta); el valor va con `.v2-numero`
  (dato al pie); `destacado` sigue siendo la tarjeta de marca.
- Modo oscuro con la clase `dark` en `<html>`; toda superficie nueva tiene que
  verse bien en ambos temas.
- Un solo activo de marca por app; los componentes no traen logos.

### Tema (claro/oscuro, #1)

`ThemeToggle` es el único control de tema: alterna la clase `dark` en `<html>`
(el contrato de `styles.css`), persiste en `localStorage[clave]` (clave por
prop; sin clave no persiste) y avisa por `alCambiar(tema)`. La app aplica la
preferencia guardada antes del primer pintado con `aplicarTema(tema, clave)`;
el control lee la clase vigente, así varios toggles comparten el mismo estado y
no hay parpadeo. Iconos sol/luna y etiqueta de la acción accesible
(`etiquetaClaro`/`etiquetaOscuro`, `aria-label` + `title`, estado con
`aria-pressed`).

### Iconos (#1)

Set único **`Icon`** (`name` + `className`): no se incrustan SVG sueltos en los
componentes. Los glifos existentes **no se renombran**; si falta uno, se suma al
set. La cosecha de PagaYa sumó los glifos de pago y operación: `home`, `arrow`,
`link`, `building`, `play`, `pause`, `archive`, `backspace`, `call`, `mail`,
`pin`, `code`, `qr`, `transfer`, `subscription`, `bank`, `card`, `terminal` y
`nfc`.

Equivalencias con `components/app-icon.tsx` de PagaYa (se usa el glifo de la
librería; no se agrega un segundo nombre para lo mismo):

- `activity` → `pulse`
- `trend` → `trending`
- `person` → `user`
- `more` → `dots`
- `products` → `package`
- `orders` → `report`
- `company` → `building`
- `phone` (auricular) → `call` (el `phone` de la librería es el equipo móvil)
- Nombres que ya coinciden y no se tocan: `close`, `check`, `plus`, `users`,
  `settings`, `search`, `receipt`, `wallet`, `refresh`, `clock`, `copy`,
  `external`, `calendar`, `shield`.

Los colores y el grosor del trazo salen del ícono (heredan `currentColor`); no
se les pasa `stroke` ni `fill` por pantalla.

### Sistema `--ds-*` y contrato medido (#1)

La geometría, la tipografía y el ritmo salen del sistema `--ds-*` de
`styles.css` (cosechado de PagaYa, aditivo: ningún token existente cambia):

| Grupo | Tokens |
| --- | --- |
| Espaciado | `--ds-space-1..8` (4/8/12/16/24/32/48/64) |
| Radios | `--ds-radius-xs..2xl` (8/12/16/24/32/40) + `--ds-radius-pill` |
| Tipografía | `--ds-text-xs..lg` (11/12/13/15), `--ds-title-sm..xl` (22/28/38/48), `--ds-leading-tight/snug/relaxed` (1.04/1.35/1.6), `--ds-tracking-title` |
| Elevación y halo | `--ds-shadow-1..3`, `--ds-glow`, `--ds-glow-strong` |
| Superficies | `--ds-gradient-surface`, `--ds-gradient-panel`, `--ds-gradient-immersive`, `--ds-gradient-auth` |
| Ritmo | `--ds-shell-pad-x/y`, `--ds-section-gap`, `--ds-card-pad` |

Reglas de aplicación:

- El halo y los gradientes se derivan de `--c-fono` y `--c-ink-800`: siguen el
  tema y el acento de cada app. Prohibidas las sombras de color ad hoc; los
  halos son solo `--ds-glow` y `--ds-glow-strong`.
- Los títulos van por `--ds-title-*`; el cuerpo no baja de `--ds-text-sm`.
- Las superficies elevadas usan los gradientes del sistema, no gradientes
  inventados por pantalla.
- Cualquier `--ds-*` se puede pisar desde el CSS de la app (el último gana).

**Contrato de densidad:** `--ds-row: 54px` (alto de fila de lista) y
`--ds-cell-min: 150px` (ancho mínimo de celda de grilla). La regla es «se miden, no se declaran»: el token fija el objetivo y la verificación es la medición sobre el
render real (el harness de la app); declarar la variable no alcanza.

### Contraste de chips y borde interactivo (#5)

`Badge`, `ChipEstado` y los puntos de estado pintan **texto sobre el relleno
tenue** (`bg-*/10`–`15`). Para eso existe la familia de texto `--c-ok-text`,
`--c-warn-text`, `--c-bad-text`, `--c-info-text`, `--c-fono-text` y
`--c-pass-text` (en el preset: `text-ok-text`, `bg-ok-text/…`, …): es la única
que se usa como texto sobre tinte y se mide ≥4.5:1 sobre blanco y el canvas en
claro y sobre las superficies oscuras (`test/contraste-tokens.test.js`). Los
tonos base `--c-ok`/`--c-warn`/`--c-bad`/`--c-info`/`--c-fono`/`--c-pass`
quedan para rellenos, puntos y bordes, y no cambian de valor: una app con
paleta propia (p. ej. la AA de Scale OS) mapea la familia de texto sin tocar
los rellenos.

El borde que es la **única affordance** de un control (`Button variant="outline"`,
botones de solo-icono con borde, `ThemeToggle`) usa `--c-interactivo`, medido
≥3:1 sobre las superficies en ambos temas (WCAG 1.4.11). No se aplica a los
bordes decorativos ni a los de las tarjetas (`--c-ink-600`).

### Botones llenos, enlaces y paletas propias (#13)

- `Button` usa pares texto/relleno que cumplen AA en los dos temas:
  `text-onbrand` sobre `--c-fono` (**primary**; el hover **aclara con
  `brightness-110`** en vez de cambiar de tono, que era el 3.25:1 de la ronda
  13) y **`text-on-ok`/`text-on-bad`** sobre `--c-ok`/`--c-bad`
  (**success**/**danger**): son tokens de par que invierten la tinta por tema
  (clara en claro, oscura en oscuro), no un color fijo. La app que pise
  `--c-fono` pisa `--c-onbrand` con el mismo criterio, y quien pise
  `--c-ok`/`--c-bad` pisa `--c-on-ok`/`--c-on-bad`; los estados de hover no
  cambian de token para no romper el par.
- Los **enlaces en línea** (`EnlaceLinea`, `ProductFooter`) usan los roles de
  texto AA (`text-fono-light`/`text-fono-dark`), nunca el verde vivo
  (`text-fono` daba 2.54:1 en claro). La regla de un objeto por tipo de dato
  aplica igual: no hay estilos de enlace por pantalla.
- La app que **remapea los tonos base** (p. ej. la paleta lila de Scale OS)
  tiene que mapear también la familia de texto: el chip `warn` real de OPS
  medía 4.18:1 con el `#8A6207` propuesto sobre su tinte compuesto
  (`rgb(231 224 212)`); un paso más oscuro (`#7E5A06`) pasa 4.78:1. El valor se
  elige **midiendo sobre el tinte compuesto de esa app**, no copiando el de la
  biblioteca; `test/contraste-tokens.test.js` deja el caso medido.
- El `pie` de `NavLateral` hereda `text-fore`: un riel propio de la app pinta su
  texto con los roles AA (`text-fore`/`text-mute`), nunca con colores legacy
  fijos.

## 8 bis. Operación de equipos (#240/#241)

Base del piloto de DSN: checklist/tile/rack de inspección. Todo es portable
(recibe props y avisa por callbacks); los estados, etiquetas y tonos viven en
`utils/estadoEquipo.js` y las categorías en `utils/categorias.js`.

### Tokens consola

`styles.css` agrega el verde **pass** (`--c-pass` #22C55E, `--c-pass-dark`
#1A8D4F, `--c-pass-soft` #E7F8EE) y el azul **acción** (`--c-accion` #4D7CFE),
disponibles en cualquier tema. La clase **`consola`** (en `<html>` o en el
contenedor) aplica la base oscura de PhoneCheck: fondo #0E1116, panel #1F2430,
borde #2D2D30, texto #F1F3F5, mute #A8B0BE y el verde pass como acento. Los
IMEI/serial van en monoespaciada (`data-serial`).

**Tema v2 `device ops`** (`tema-v2`, alias `v2-piloto` para las pantallas del
piloto): variante clara y oscura del mismo lenguaje, promovida desde el piloto
de DSN. En claro: fondo #F6F8FB, superficie #FFFFFF, borde #D6DCE6 y texto
#0E1116. En oscuro (`html.dark`): fondo #0E1116, panel #1F2430, borde #373F51 y
texto #F4F6FA. Los números grandes van con `.v2-numero` (tabular + tracking
ajustado). Se aplica por clase al contenedor de la pantalla, así el resto de la
app no cambia.

**Tonos de TEXTO AA (#241):** los roles semánticos del scope v2 son los que
llegan a 4.5:1 sobre las superficies v2 —claro `ok` #166534, `bad` #B91C1C,
`warn` #92400E, `info` #2059BE; oscuro `ok` #4ADE80, `bad` #FCA5A5, `warn`
#FCD34D, `info` #9FB8FF—. Los vivos de PhoneCheck (#16A34A/#22C55E, #DC2626,
#D97706, #4D7CFE) quedan para **rellenos e indicadores** (`--c-pass`,
`--c-accion` y las clases `bg-*`). La guarda `test/contraste-tokens.test.js`
frena si un tono de texto deja de cumplir. Con el scope, `base.css` ya trae las
**reglas del shell** (ítem activo con `aria-current`/`aria-pressed`, rótulos de
grupo y `.oc-rotulo-grupo`, chips `.v2-chip`, números y foco por tema): la app
no las repite. El armado del shell y la tabla de contrastes están en
**`docs/SHELL.md`**.

### Objetos y props

| Objeto | Props | Notas |
| --- | --- | --- |
| `ChipEstado` | `estado` (`pass`/`revision`/`pendiente`/`falla`), `etiqueta`, `icono`, `className` | Chip de estado del equipo en la consola/rack; `pass` = verde certificado |
| `ChipsLocks` | `locks` = `[{ clave, estado, etiqueta?, detalle? }]`, `conEstado`, `className` | `clave` de `LOCKS_DISPOSITIVO` (`icloud`/`mdm`/`esn`/`carrier`/`oem`); `estado` = `libre`/`activo`/`desconocido` |
| `SemaforoItem` | `estado` (`ok`/`aviso`/`falla`/`sinVerificar`), `etiqueta`, `detalle`, `como` (`li`/`div`) | Punto con ícono + texto accesible (`Etiqueta: Estado`) |
| `FilaChecklist` | `etiqueta`, `estado`, `nota`, `accion`, `className` | Fila del checklist con el semáforo y la nota de la inspección |
| `ConteoChecklist` | `pasan`, `total`, `fallas`, `sustantivo` (default `pass`), `className` | "12 de 12 pass" en verde `pass`; las fallas aparte en rojo |
| `MedidorBateria` | `porcentaje`, `ciclos`, `etiqueta`, `variante` (`barra`/`chip`), `compact`, `mostrarEtiqueta` (chip «87% batería»), `className` | Umbrales 90/80; sin dato → `—` y "Sin dato" (nunca 0) |
| `GradoBadge` | `grado` (`A`/`B`/`C`), `conDescripcion`, `className` | A verde, B naranja, C rojo; un grado inválido se muestra crudo |
| `TileEquipo` | `modelo`, `imei`, `detalle`, `foto`, `estado`, `grado`, `bateria`, `ciclos`, `locks`, `acciones`, `onOpen` | Compone chip, grado, batería, locks e icono de categoría; `onOpen` lo vuelve botón |
| `Stepper` | `pasos` = `[{ id, etiqueta, detalle? }]` o etiquetas sueltas, `actual`, `hechos`, `variante` (`linea`/`tarjetas`), `ariaLabel`, `className` | Línea: hecho verde `pass`, actual con anillo, pendiente gris; **`tarjetas`**: grilla con el paso actual en azul y el **`detalle`** debajo (conteos del servicio/entrega) |
| `IconoCategoria` | `categoria` (texto libre) o `icono`, `className` | Glifos `mobile`/`laptop`/`tablet`/`watch`/`buds`/`cable`; `servicio`/`otro` delegan en `Icon` |
| `CodigoQr` | `valor`, `ancho` (220), `nivel` (`M`), `margen` (1), `alt`, `className` | QR del informe/enlace; sin valor no renderiza nada. Requiere `qrcode` (peer opcional) |
| `qrDataUrl` | `valor`, `{ ancho, nivel, margen }` | Data URL del QR para HTML impreso o previews; vacío → `''`, nunca lanza |
| `FichaCertificado` | `empresa`, `modelo`, `imei`, `grado`, `bateria`, `ciclos`, `locks`, `aprobados`, `total`, `puntaje`, `condicion`, `repuestosNoOem`, `repuestosNoOemNota`, `estado`, `verificadoPor`, `verificadoAt`, `enlace`, `etiquetaQr`, `acciones`, `className` | Tarjeta del informe público: compone chip, grado, batería, conteo y **puntaje** del checklist, **condición**, **repuestos no OEM** (con nota), locks y QR |
| `PasosEquipo` | `pasos` (etiquetas u objetos), `actual` (id o índice), `etiqueta`, `testId`, `className` | Indicador compacto de una línea (puntos + paso actual) para listas, racks y servicios |
| `ColumnaLote` | `etiqueta`, `tono`, `contador`, `acciones`, `vacio`, `testId`, `children` | Columna de un tablero por lotes/estaciones: chip del estado + conteo + acciones masivas arriba, tarjetas abajo (o el vacío explícito) |
| `VistaPreviaPapel` (`ANCHOS_PAPEL`) | `formato` (`thermal-80`/`thermal-58`/`thermal-55`/`a4`), `contenido` (HTML), `titulo`, `alto`, `className` | Vista previa del documento impreso con el ancho real del papel (mm a 96 dpi: 302/219/208 y 794 px); el selector de formato va con `SegmentedField` |
| `CATEGORIAS_PRODUCTO` | — | iPhone/MacBook/iPad/Watch/AirPods/Accesorios/Servicio/Otro con `etiqueta`, `icono` y `alias` |
| `ICONO_CATEGORIA` | — | Mapa `categoría → glifo` para filtros y chips |
| `normalizarCategoria` / `categoriaDe` / `iconoDeCategoria` / `etiquetaDeCategoria` | `texto` | "Funda iPhone" → accesorios; "CELULAR" → iPhone; desconocido → Otro |

Reglas: la batería y el grado **nunca** se inventan (sin dato se dice sin
dato); los chips de locks usan color + tooltip (el color solo no alcanza); los
estados no se re-etiquetan por pantalla.

## 8 ter. Pipeline, documentos y avance (lote LedBox)

Objetos genéricos portados de LedBox (lote del 22-09-2026). Todos reciben props
y avisan por callbacks: no hacen `fetch`, no leen stores ni conocen el router.
Los montos son enteros (PYG) y el formato lo dibuja `Money`; las fechas van en
es-PY 24 h con `utils/fecha.js`.

| Objeto | Props | Notas |
| --- | --- | --- |
| `TableroKanban` | `etiqueta`, `columnas` = `[{ valor, titulo, tono? }]`, `tarjetas` = `[{ id, estado, titulo, subtitulo?, chips?, monto?, montoNota?, fecha?, detalle?, acciones?, destinos? }]`, `puedeMover`, `etiquetaMover`, `textoVacio`, `onMover(id, destino)`, `onError`, `className` | Tablero único por pipeline; arrastre HTML5 + «Mover a…» accesible por teclado; contador por columna y «vacío» por columna |
| `useTableroOptimista` | `{ tarjetas, onMover, onError }` | Hook del movimiento optimista con revert (single-flight, idempotente) para quien necesite las filas efectivas fuera del tablero |
| `Cronologia` | `hitos` = `[{ id, fecha, tipo, titulo, detalle?, actor?, tono?, icono? }]`, `iconos`/`tonos`/`etiquetas`, `agrupar`, `mostrarTipo`, `etiqueta`, `vacioTitulo`/`vacioDetalle`, `cargando`/`error`/`onReintentar`, `onActualizar`/`textoActualizar`/`textoCabecera` | Los mapas por tipo pisan los defaults (`ICONOS_HITO`, `TONOS_HITO`, `ETIQUETAS_HITO`); un tipo desconocido cae en `info`/`mute` y su etiqueta muestra el texto crudo. Los estados honestos son parte del objeto: esqueleto al cargar, error con reintento y cabecera de actualizar |
| `PlanPagos` | `anticipo`, `anticipoEtiqueta`, `anticipoVence`, `cuotas` = `[{ id?, etiqueta, monto, vence?, estado?, nota? }]`, `aTransferir` = `{ id?, etiqueta, monto }`, `total`, `totalEtiqueta`, `saldoSinCuota`, `condiciones`, `moneda`, `estados`, `vacio` | La cuota «a transferir ahora» se destaca y se marca en su fila; los estados de cuota (`pendiente`/`revision`/`pagada`/`cancelada`) salen de `ESTADOS_CUOTA` y se dibujan con `ChipEstado` |
| `DocumentoImpresion` | `titulo`, `numero`, `emisor`, `receptor`, `meta` = `[{ etiqueta, valor }]`, `estado` + `estadoTono`, `detalle` = `[{ cantidad, concepto, unitario, subtotal, nota? }]`, `liquidacion` = `{ subtotal, descuento?, iva? = [{ tasa, base?, monto }], otros?, total }`, `notas`, `pie`, `onImprimir`, `moneda` | Hoja A4 con reglas en `styles.css` (`.oc-print`, `oc-print-oculto`); el botón de imprimir es opcional y el callback lo pone la pantalla (la librería no llama a `window.print()`) |
| `SubidaImagen` | `etiqueta`, `descripcion`, `valor`, `error`, `tipos`, `tamanoMaximo`, `comprimir`, `cuadrado`, `ladoMaximo`, `tamanoObjetivo`, `onImagen`, `onLimpiar`, `disabled`, `ocupado` | Valida por firma real (JPG/PNG/WebP) y tamaño, con vista previa, arrastrar y soltar y limpiar; la compresión es canvas sin librerías y el objeto no sube nada |
| `ProgresoChecklist` | `hechas`, `total`, `vencidas`, `riesgo`, `sustantivo`, `porcentaje`, `mostrarDetalle`, `alto`, `textoVacio` | Barra accesible + «x de y» + porcentaje; tonos `ok` (completo), `warn` (vencidas), `bad` (riesgo) y `fono` (en curso). Sin tareas no se inventa 0 %: dice «Sin datos» |
| `ChipEstado` | `estado`, `etiqueta`, `icono`, **`tono`**, `className` | `tono` pisa el color del estado para los estados propios de cada módulo (p. ej. una cuota «Cancelada») sin copiar el chip |
| `TONOS`, `tonoCanonico`, `puntoDeTono`, `chipDeTono`, `textoDeTono` | `valor` | Mapa único de tonos (`ok`/`warn`/`bad`/`mute`/`info`/`pass`/`fono`) con alias de otras apps (`neutral`, `accent`, `danger`…); todo objeto que muestra estados lee de acá |

Reglas:

- Un pipeline por estados usa `TableroKanban`: no se crean tableros paralelos ni
  columnas con colapsos distintos; la vista lista/tablero es de la pantalla.
- La cronología muestra los hitos ordenados tal como llegan: la librería no
  ordena, no agrupa por estado ni esconde hitos. Si una audiencia no debe ver
  algo, el consumidor filtra antes de pasarlo.
- Los documentos A4 usan `DocumentoImpresion` con las reglas `@media print` de
  `styles.css`; no se copian hojas `lbprint` ni bloques `@page` por pantalla.
- La subida de imagen es una sola pieza (`SubidaImagen`): tipo real por magic
  bytes, compresión en canvas y preview; no se repite el `<input type="file">`
  con su validación por pantalla.
- El avance de un checklist se muestra con `ProgresoChecklist` (y
  `progresoChecklist` para la lógica pura); no se copia la barra con el conteo.

## 9. Cómo se fija una regla

1. El objeto se crea en este paquete con props claras y sin acoplarse a una app.
2. Cada regla nueva se fija con un test de aserción de fuente o de render en
   `test/` (si una app vuelve a copiar el patrón, su test lo marca).
3. La app adopta el objeto y borra su copia en el mismo cambio.

Las **reglas transversales** (§15) siguen el mismo proceso: donde hay objeto,
tiene props claras y su test de aserción en este paquete; el aviso al usuario
sigue el **formato de notificaciones** (§16).

## 10. Agenda, filtros, shell e identidad (lote 2 — 22-09-2026)

Objetos para las pantallas de trabajo diario: calendario, filtro de fechas,
buscador global, ayuda del módulo, barra inferior mobile y avatar, más las
piezas de tablero (importe con signo, conexión, avisos y barras). Todos son
portables: reciben props y avisan por callbacks; no hacen `fetch`, no leen
stores ni conocen el router. Textos y datos entran por props.

### 10.1 Días y semanas

- Un día es una **clave pura `YYYY-MM-DD`** (`utils/calendario.js`): no se corre
  de fecha entre el server y el navegador. `etiquetaMes`, `etiquetaDia` y
  `etiquetaDiaCorta` rinden es-PY en UTC; la hora de cada ítem la formatea la
  app con `utils/fecha.js`.
- La semana va de **lunes a domingo** (`rangoSemana`, `indiceSemana`); el mes se
  arma con la grilla completa (`rangoMes`, 35 o 42 días con los días vecinos).
- «Este mes» llega **hasta hoy** (no inventa días futuros), «Mes pasado» es el
  mes anterior completo y «Últimos 30 días» incluye hoy (`utils/rangoFecha.js`).

### 10.2 Objetos y props

| Objeto | Props | Notas |
| --- | --- | --- |
| `Calendario` | `items`, `vistas` (`['mes']`), `vista`/`vistaPorDefecto`, `onCambiarVista`, `ancla`/`anclaPorDefecto`, `onCambiarPeriodo(ancla, rango)`, `diaSeleccionado`/`onSeleccionarDia`, `onElegirItem`, `renderItem(item, { vista, dia })`, `maxPorDia` (2), `cargando`, `mostrarDetalle`, `hoy` | Grilla mensual en escritorio y lista por día en mobile (sin scroll horizontal). Ítem: `{ id, fecha, titulo, hora?, detalle?, tono?, href? }`; `fecha` es clave de día. Sin ítems en el rango dice que no hay movimientos |
| `RangoFecha` | `desde`/`hasta` + `onCambio(desde, hasta)`, o `desdePorDefecto`/`hastaPorDefecto`/`periodoPorDefecto` (`este-mes`), `atajos`, `hoy`, `mostrarCampos` | Atajos: Hoy · Esta semana · Este mes · Mes pasado · Últimos 30 días · Personalizado. El atajo activo se deriva del par; un rango invertido se avisa, no se corrige solo |
| `PaletaComandos` | `abierta`/`onAbrir`/`onCerrar`, `buscar` (async), `onElegir`, `etiquetasTipo`, `iconosTipo`, `atajo` (`k`), `atajoTexto` (`⌘K`), `conAtajo`, `minimo` (2), `espera` (220 ms), `boton`/`textoBoton` | Resultados `{ id, tipo, titulo, detalle?, icono? }` agrupados por `tipo`; ↑↓ mueven, Enter elige, Esc cierra y el foco arranca en el buscador. Estados honestos: «seguí escribiendo», cargando, sin resultados y error con reintento |
| `AyudaModulo` | `titulo`, `resumen`, `puntos` (3–5), `enlaces` `[{ href, etiqueta, onClick? }]`, `abierta`/`onAbrir`/`onCerrar` | Botón «?» + diálogo de la librería (mismo alto y ancho que un formulario de una columna). Sin título ni resumen no monta nada; los enlaces cierran el diálogo al navegar |
| `BarraInferior` | `items` (máx. 4), `activo`, `onSelect`, `onMas`, `masEtiqueta`, `menuAbierto`, `menuId`, `maxItems` (4) | `fixed` en mobile (`md:hidden`), ítem activo con `aria-current="page"`. **No reserva espacio**: la app corre el contenido con `ESPACIO_BARRA_INFERIOR` |
| `Avatar` | `nombre`, `src`, `tamano` (`sm`/`md`/`lg`), `forma` (`redondo`/`cuadrado`), `empresa`, `title`, `ariaLabel`, `decorativo` | Iniciales con color estable derivado del nombre; con `src` dibuja la imagen y si falla vuelve a las iniciales (nunca un cuadro roto). La cadena de identidad de #211 (foto local → foto de identidad → iniciales) sigue pendiente |
| `ImporteDelta` | `valor`, `moneda`, `formato` (`moneda`/`porcentaje`), `invertir`, `vacio` | Importe con signo (`+ Gs …` / `− Gs …`) y color: verde lo que suma, rojo lo que resta, neutro el cero; `tabular-nums` y `nowrap`. El signo y el formato salen de `utils/moneda.js` (`montoConSigno`, `signoDe`) |
| `IndicadorConexion` | `enLinea`, `pendientes`, `sincronizando`, `onSincronizar` | Estado real de la cola: en línea / sin conexión + «N pendientes de subir»; el botón solo sincroniza cuando hay pendientes |
| `CampanaAvisos` | `avisos` `[{ id, titulo, detalle?, tono?, fecha?, href?, onClick?, leido? }]`, `onAbrir`, `onElegir`, `pie`, `anclaje` | Contador de no leídos (si ninguno trae `leido`, cuenta todos) hasta `99+`; el panel no marca nada solo: abrir y elegir se avisan por callback |
| `GraficoBarras` | `datos` `[{ etiqueta, valor, tono? }]`, `max`, `orientacion` (`vertical`/`horizontal`), `altura` (160), `tono`, `formatoValor`, `etiqueta`, `mostrarValores` | Barras CSS sin dependencias, con lista accesible para lectores de pantalla. Los negativos se dibujan en 0 y el valor real queda en el tooltip: no se inventa una escala |
| `formatoNumero` / `signoDe` / `montoConSigno` | `valor`, `{ decimales, vacio }` / `valor` / `valor`, `moneda`, `vacio` | Cantidades y signos en el formato único (es-PY); un dato ausente devuelve el vacío, nunca 0 |

### 10.3 Ejemplo (la app resuelve datos y navegación)

```jsx
import { useState } from 'react'
import {
  Avatar, BarraInferior, Calendario, ESPACIO_BARRA_INFERIOR, PaletaComandos,
  RangoFecha,
} from 'owncoding-ui'

export function Agenda({ items, buscar, ir }) {
  const [rango, setRango] = useState({ desde: '', hasta: '' })
  const [abierta, setAbierta] = useState(false)

  return (
    <div className={ESPACIO_BARRA_INFERIOR}>
      <RangoFecha
        desde={rango.desde}
        hasta={rango.hasta}
        onCambio={(desde, hasta) => setRango({ desde, hasta })}
      />
      <Calendario
        items={items} // [{ id, fecha: '2026-09-22', titulo, hora, tono, href }]
        vistas={['mes', 'semana']}
        onCambiarPeriodo={(ancla, range) => pedir(range.desde, range.hasta)}
        onElegirItem={(item) => item.href && ir(item.href)}
      />
      <PaletaComandos
        abierta={abierta}
        onCerrar={() => setAbierta(false)}
        buscar={buscar} // async (consulta) => [{ id, tipo, titulo, detalle }]
        onElegir={(resultado) => ir(resultado.datos.href)}
        boton
      />
      <BarraInferior
        items={NAVEGACION} // [{ id, etiqueta, icono, href }]
        activo="calendario"
        onMas={abrirMenu}
      />
      <Avatar nombre={usuario.nombre} src={usuario.fotoUrl} tamano="sm" />
    </div>
  )
}
```

### 10.4 Reglas

Los días no se corren de zona (clave pura); un rango invertido se dice; la
paleta no busca ni navega por su cuenta; el avatar no inventa fotos; el contador
de avisos cuenta lo que hay; un gráfico sin datos lo dice.

El **shell** se arma como en **`docs/SHELL.md`**: scope `tema-v2` con los tonos
de texto AA, ítem activo con `aria-current="page"`, grupos plegables con
`aria-expanded`, identidad con `PersonaChip` en el pie, presencia con
`PilaPersonas`, miga de sección con `PageHeader migas=[…]` y el contenido con
`ESPACIO_BARRA_INFERIOR` cuando hay barra inferior. La **densidad operativa** de
escritorio (encabezado y barra de acciones de una fila, KPIs y ritmo) va con
**§17**.

## 11. Configuración: tarjetas, solapas y encabezados (#253)

La pantalla de Configuración se arma con estas piezas y no se repiten en cada
sección:

- **Tarjeta de ajuste**: `TarjetaAjuste` (título + descripción + acción
  opcional e ícono; `tono="peligro"` para archivar/eliminar). No se escribe a
  mano el `<h2>` de un `Card` con su descripción.
- **Solapas internas**: `Subtabs` (`role="tablist"`, `aria-selected`, 44 px en
  móvil). La pantalla no dibuja su propio `role="tab"`.
- **Encabezado**: `PageHeader` (con `migas` cuando la sección navega) y
  `Eyebrow`; la miga no se arma con spans sueltos.
- **Formulario al costado**: `PanelDerecho` (contenido/lista a la izquierda y
  formulario fijo a la derecha desde `lg`, apilado en móvil).
- **Campos**: el kit (`Input`, `Select`, `FormField`, `MoneyInput`, …) y los
  compuestos por patrón; cada campo nuevo se busca antes de crearlo. El control
  de duplicación de MobOS (`docs/CAMPOS.md` §6 y
  `src/lib/camposReglas.test.js`) falla si un objeto publicado se reimplementa.
- **Navegación interna**: `NavegacionSeccion` — el riel de los 7 grupos que
  **colapsa a solo íconos** (tooltip + `aria-label`, indicador del activo,
  `aria-current`) y en mobile es una tira horizontal desplazable;
  `variante="horizontal"` lo deja horizontal donde convenga. El estado
  colapsado es **controlado** (`colapsado`/`onToggle`): la app lo recuerda
  (último usado). Conserva `role="tab"`/`aria-selected`, la descripción del
  grupo activo y centra la sección al entrar por enlace directo.
- **Estado de guardado**: `EstadoGuardado` (chip verde «Guardado…» o el error
  en rojo, `aria-live`) va en el lugar donde iría el botón; la app maneja el
  POST y la reautenticación. No se dibuja el chip ni el aviso a mano.
- **Selección múltiple**: `Checkbox` (`variante="simple"` en listas y
  permisos, `variante="tarjeta"` con título y descripción en preferencias,
  `tono="bad"` para lo destructivo). Para booleanos de encendido/apagado va
  `Switch`; el control pelado acepta `ariaLabel` para filas de tabla.
- **Mapa campo por campo**: `docs/MAPA-CONFIG.md` de MobOS (grupos y detalle).

## 11 ter. Unificar entidades (clientes, #268)

**Transversal (#293, regla 5):** esta regla no es solo de clientes — si dos
pantallas muestran lo mismo (pedido, producto, cuenta, unidad), comparten el
objeto o la derivación. Un dato, un formato.

- **Selector de duplicado**: `BuscadorCliente` encuentra por nombre, teléfono
  (crudo o en dígitos), CI/RUC, correo, facturación o tags, con alta rápida y
  marca de **«posible duplicado»** (`detectarDuplicado`; los motivos salen de
  `motivosDuplicadoCliente` y los teléfonos se comparan por **clave nacional**,
  sin prefijo país ni 0 inicial).
- **Preview/checklist**: `PreviewFusion` muestra las dos fichas (`entidades`
  con sus datos), deja elegir **cuál queda como principal** y lista el
  **checklist de lo que se fusiona** por categoría con conteos (pedidos, pagos y
  cuotas, créditos/saldo, notas, direcciones, teléfonos/correos, tags, seguro,
  portal, garantías/servicio…). La ficha fusionada no se borra: queda archivada
  con un puntero al principal.
- **Confirmación**: `ConfirmarConPalabra` resume lo que va a pasar, advierte y
  exige la **palabra exacta** para confirmar, con estado ocupado y error.
- **Categorías canónicas**: `CATEGORIAS_FUSION` + `categoriasFusion(conteos)`
  arman el checklist en el orden y con las etiquetas de la casa (pedidos, pagos
  y cuotas, créditos y saldo, notas, direcciones, teléfonos y correos, tags,
  seguro de ventas, portal, garantías y servicio); `hayFusion` dice si hay algo
  que mover.
- **Ficha fusionada**: `ChipFusion` marca el registro archivado con la ficha
  principal, cuándo y quién lo hizo, y ofrece abrir la principal.
- Al crear un cliente, el aviso previo usa los mismos helpers
  (`motivosDuplicadoCliente`) comparando teléfono, documento y correo.

## 12. Abastecimiento F1: demanda y tablero (#250)

El panel «Por comprar» y la lista de compra se arman con estas piezas; ninguna
pantalla repite los mapas ni los contadores:

- **Prioridad**: `ChipPrioridad` con `PRIORIDADES_COMPRA`, alineado al contrato
  del backend (`URGENTE` → rojo, `ALTA` → ámbar, `NORMAL` → azul, `BAJA` →
  mute; `media` sigue como alias de `normal`). La lista se ordena con
  `ordenarPorPrioridad`; la prioridad no se escribe como texto suelto.
- **Origen**: `ChipOrigen` con `ORIGENES_NECESIDAD` (venta sin stock, reserva
  sin unidad, venta sobre stock, bajo reposición, pedido comprometido, manual),
  con etiqueta, tono e ícono. Una clave libre se muestra tal cual en mute.
- **Estado de la necesidad**: `ESTADOS_NECESIDAD` con las claves del contrato
  (`ABIERTA` · `ASIGNADA` · `COMPRADA` · `RECIBIDA` · `CANCELADA`) más las de
  las fases siguientes (preparar envío · en tránsito · recepción · incidencia);
  los alias de la UI (`por_comprar`, `comprado`…) siguen andando y
  `PASOS_NECESIDAD` marca el recorrido lineal. Las colas del panel usan
  **`Subtabs` con contador** (`items=[['pendientes', 'Por comprar', n]]`), con
  `contadores.porEstado` de la API.
- **Condición**: `CONDICION_UNIDAD` + `etiquetaCondicion` (Nuevo / Seminuevo /
  Reacondicionado) para listas, tarjetas y panel; una clave libre se muestra tal
  cual y el vacío es «—».
- **Contadores**: `ContadoresCompra` (pendiente/comprado/faltan) con números
  tabulares; «faltan» solo se pinta en rojo cuando hay diferencia y nunca hay
  negativos.
- **Fecha prometida**: `Vencimiento` (texto o chip) con `diasAviso`; la fecha
  entra por prop y el vacío es explícito.
- **Consolidación**: `ResumenDestinos` conserva los destinos al agrupar
  solicitudes idénticas («1 Pedido A · 3 stock»); nunca se mezclan variante,
  condición ni origen.
- **Tarjeta**: `TarjetaNecesidad` compone todo lo anterior para el panel móvil
  (producto/variante exacta, estado, prioridad, origen, centro, fecha
  prometida, vínculo con la venta o reserva, destinos, observaciones y
  acciones). Sin scroll horizontal y sin lógica de permisos.
- **Stock**: nada de esto crea stock disponible; el stock entra recién en la
  recepción de la épica. Los vínculos con la venta/reserva y la auditoría los
  maneja la app.

## 13. Abastecimiento F2–F5: compra, lote, etiqueta y recepción (#250)

- **Estados**: `ESTADOS_COMPRA` (comprada · preparando · en tránsito · recibida
  · cancelada), `ESTADOS_ENVIO` (borrador → preparando → despachado → en
  tránsito, más recepción parcial/recibido/con incidencia/cancelado),
  `ESTADOS_RECEPCION` (borrador · confirmada · cancelada) y `PASOS_ENVIO`.
  Todos aceptan las claves del backend (mayúsculas, guiones) y exponen
  `etiqueta…`/`tono…`; el estado de la compra y el del lote no se escriben
  sueltos.
- **Método**: `METODOS_ENVIO` (bus · transportadora · AEX · importación) con
  etiqueta e ícono (`etiquetaMetodoEnvio`/`iconoMetodoEnvio`).
- **Tarjeta de compra**: `TarjetaCompra` (código `COM-…`, proveedor, estado,
  «N de M con IMEI», costo/moneda y referencia del proveedor).
- **Tarjeta de lote**: `TarjetaLote` (código `ENV-…`, origen → destino, método,
  empresa/guía, responsable, ETA con `Vencimiento` y «N de M con IMEI»).
- **Etiqueta de preparación**: `EtiquetaLote` («ENV-… · PRODUCTO n DE N»,
  modelo/variante, IMEI o «IMEI pendiente», pedido/destino y QR del manifiesto);
  se imprime en papel claro y se envuelve con `DocumentoImpresion`.
- **Manifiesto del lote**: `ManifiestoEnvio` (código, origen → destino, método,
  empresa/conductor/guía, responsable, compra, fechas, detalle por producto con
  IMEI conocidos y pendientes, totales y QR del manifiesto público). Papel claro
  con clases `oc-print-*`, también para envolver con `DocumentoImpresion`.
- **Recepción**: los resultados de unidad usan `ESTADOS_REVISION`/`FilaRevision`
  (`RECIBIDO` entra como estado ok; `claveRevision` tolera las claves del
  backend) y los conteos, `ResumenRecepcion` (mapa del backend o ítems) +
  `ResumenIncidencias`. La llegada pendiente se muestra con `TarjetaRecepcion`
  (lote, ETA, «N de M con IMEI» y depósito sugerido), el cierre con
  `DestinoRecepcion` y el escaneo con `CampoSeriales`/`SerialField`; el stock
  nace recién al confirmar (regla de la épica).

## 14. Pie institucional (#291)

**Toda página de toda app muestra el pie institucional**: el shell del panel
(todas las pantallas), las pantallas de acceso (login, registro, recuperación,
verificación, invitación) y las páginas públicas o tokenizadas (seguimiento de
pedido, informe, certificado, prueba de impresión, ficha pública de producto,
portal, estado del sistema). No hay superficies exceptuadas.

- **Objeto único: `ProductFooter`.** Nadie dibuja el `<footer>` institucional a
  mano ni repite el texto en cada pantalla. Si una página no puede usar el
  componente (por ejemplo, un lienzo de impresión), la excepción se documenta
  en la app.
- **Contenido mínimo** (en este orden, en una línea):
  **© + año + nombre de la app + versión de la app + crédito
  «Desarrollado por Owncoding» con enlace**.
  `ProductFooter` lo garantiza: el crédito viene por defecto
  (`CREDITO_PIE`/`CREDITO_PIE_URL`) y la app puede pisarlo, no quitarlo.
- **La app inyecta su identidad** (la biblioteca no conoce la marca):
  `nombre`, `version`, `credito`/`creditoUrl` si quiere otro crédito, `anio` si
  lo necesita fijo y `leading`/`children` para textos propios (por ejemplo,
  «Estado del sistema ·» o un enlace a términos).
- **La versión es la real publicada**: sale de la fuente única de la app (su
  `brand`/`version.json`), no de un literal en cada pantalla.
- **`data-testid="product-footer"`**: las apps pueden asertar en e2e que cada
  superficie (panel, auth, públicas) lo tiene; el enlace del crédito cumple el
  área táctil de 44 px (`toque-44`, §1).

```jsx
import { ProductFooter } from 'owncoding-ui'
import { APP_NAME, APP_VERSION, APP_CREDIT, APP_CREDIT_URL } from '@/lib/brand'

<ProductFooter nombre={APP_NAME} version={APP_VERSION}
  credito={APP_CREDIT} creditoUrl={APP_CREDIT_URL} />
```

**Adopción**: checklist en `docs/SHELL.md` §6 (panel, auth, públicas y
tokenizadas). Referencia real: MobOS (`src/components/app/ProductFooter.jsx`,
puente a este objeto) y sus páginas de acceso y públicas.

**Transversal (#293, regla 10):** la versión del pie es la fuente del **aviso de
versión nueva** (`hayVersionNueva`/`compararVersiones`, `utils/version.js`) y
`/status` queda accesible desde la Ayuda (`AyudaModulo`).

## 15. Reglas transversales (#293)

Aprobadas por Dario el 29-09. Aplican a **toda** pantalla y módulo de todas las
apps. Donde hay objeto, va con props claras y **test de aserción** (proceso §9);
las apps adoptan borrando su copia. Las reglas **de ecosistema** que las
complementan (acceso, seguridad, infra, pagos, correo) viven en
**`docs/REGLAS-ECOSISTEMA.md`**; la **protección de datos personales (Ley
7593/2025)** está en su **§12** y usa `AvisoPrivacidad` y
`ConsentimientoDatos` en cada punto de recolección.

1. **Cero éxito falso.** Nada se marca como hecho sin la entrega real y ningún
   fallo se silencia: siempre hay mensaje accionable y reintento o salida. El
   resultado sale del dato real (lo que devolvió el backend, el `ok` del agente
   de impresión), nunca de una suposición de la pantalla. Un envío sin relay
   queda **en cola**, no «enviado» (§16). Objetos: `Aviso`, `ErrorState`,
   `EstadoGuardado`, `IndicadorConexion`, `SaveActions` (§2 ter).
2. **Paridad demo.** Toda feature o pantalla nueva funciona en la demo con los
   mismos flujos y datos ficticios: la demo no es un camino aparte. La pantalla
   no esconde features por ser demo; cambia la fuente (`demoStorage`, seeds) y
   usa los mismos objetos.
3. **Cuatro estados por pantalla.** Cargando (`Skeleton`), vacío **con acción**
   (`EmptyState action`), error **con reintento** (`ErrorState onRetry`) y
   lleno. Ninguna pantalla en blanco. Se revisan las cuatro ramas y se
   documentan con capturas.
4. **Tres temas + toque 44.** Claro, oscuro y **alto contraste**; objetivos
   táctiles de **≥44 px** en móvil (`.toque-44`, `min-h-11`). **Capturas
   obligatorias** en toda entrega de UI (mobile y escritorio). Objetos: tokens
   de `styles.css` y `ThemeToggle` (§8); el alto contraste se declara con los
   mismos tokens.
5. **Una entidad, una fuente de verdad.** Si dos pantallas muestran lo mismo,
   comparten objeto o derivación —extiende §11-ter a **todo** (clientes,
   pedidos, productos, cuentas, unidades): un dato, un formato. Nada de dos
   versiones del mismo cálculo repartidas.
6. **Microcopy es-PY (voseo), sin jerga.** El mensaje dice **qué pasó** y **qué
   hacer**, en segunda persona («Revisá…», «Probá de nuevo»), con el vocabulario
   del negocio (venta, pedido, unidad, cobro). Sin nombres internos, códigos
   técnicos ni inglés. Los textos accionables salen de los objetos
   (`vacioDetalle`, `ErrorState`, `Aviso`).
7. **Rutas canónicas.** Toda ruta visible vive declarada en `rutas.js` con su
   metadata (título, ícono, permisos), sin duplicar slugs dinámicos (`[id]` vs
   `[userId]`). La compatibilidad **redirige**; no se monta la pantalla dos
   veces.
8. **Búsqueda y atajos consistentes.** Ctrl/Cmd+K global en el panel; F1–F4,
   Cmd/Ctrl+S y Esc documentados y funcionando donde aplican; la ayuda de cada
   pantalla es `AyudaModulo` y la de la app queda en su sección de ayuda.
   Objetos: `PaletaComandos` y `AyudaModulo` (`docs/SHELL.md`).
9. **Dinero y sensibilidad.** La visibilidad de costos depende del rol; las
   acciones sensibles piden reautenticación; **toda acción crítica se audita**;
   lo destructivo usa confirmación reforzada. Objetos: `ConfirmarConPalabra`,
   los bloqueos de autorización de la app y la auditoría del backend.
10. **Versión visible y novedades.** El pie institucional muestra la versión de
    la app (§14) y la app avisa cuando hay una **versión nueva**
    (`hayVersionNueva`/`compararVersiones`); `/status` queda accesible desde la
    Ayuda. Objetos: `ProductFooter`, `utils/version.js`, `AyudaModulo`.
11. **Rendimiento por defecto.** Pantallas lazy, chunk de entrada liviano y
    listas grandes acotadas o **virtualizadas** (`ventanaDeLista`). Objetos:
    `utils/ventana.js`, `ListGridToggle` para tablas densas. La **densidad
    visual** de la pantalla se completa con el pase de **§17** (no reemplaza la
    virtualización ni justifica recortar datos).

## 16. Formato de notificaciones (#293)

Un solo formato de aviso al usuario, con contrato canónico por canal. El hecho
nace **una vez** en la bandeja interna oficial y de ahí se deriva al resto: no
hay lógica de avisos duplicada por canal.

### Bandeja / campana (`CampanaAvisos`)

- **Aviso**: `{ id, titulo, detalle?, tono?, fecha?, href?, leido?, icono? }`.
  - `titulo` corto (sin punto final) y `detalle` en **una línea**.
  - `tono` es uno de `TONOS` (`ok`/`warn`/`bad`/`info`/`mute`); define el punto
    de color.
  - `fecha` llega **ya formateada** («hace 5 min»): la calcula la app.
  - `href` —o `destino`, que se tolera— es la **ruta interna**; nunca una URL
    externa.
  - `leido` marca el estado; el contador sale de los no leídos y se muestra
    hasta **99+**.
- **Panel**: contador, cabecera, **vacío con acción** (`vacioAccion`) y `pie`
  opcional. Abrir avisa `onAbrir`; elegir, `onElegir` (la app decide qué se
  marca como leído). El objeto no consulta nada: los avisos entran por props.

### Push

- Payload **genérico** (`payloadPush`): título = nombre de la app (o uno
  propio), cuerpo corto y `data` con la **ruta interna** + `id`/`tono`.
- **Nada sensible en la pantalla bloqueada**: no viajan cliente, montos, motivos
  ni datos del pedido; el detalle vive en la bandeja.
- **Horario silencioso** (`enHorarioSilencioso`, 22 → 8 por defecto): no suena,
  pero el aviso **queda** en la bandeja.
- Métricas por aviso (`id`): entrega y apertura se miden en la app; la
  biblioteca no mide nada.

### Toast

- Solo para el **resultado de una acción en pantalla** (`useToast`): «Venta
  guardada», «Se copió el enlace».
- **No** para eventos de otros módulos (eso va a la bandeja) ni para novedades
  que el usuario no pidió.

### Derivación única

- El hecho nace en la bandeja interna (oficial) y de ahí se sirve a push,
  correo y WhatsApp; ningún canal arma su propio texto o estado por su cuenta.
- Un envío sin relay configurado queda **en cola**, no «enviado» (regla 1):
  estados canónicos `enviado`, `encolado`, `duplicado` y `fallido`.

### Plantillas de mensajes (correo/WhatsApp)

- Estructura canónica: **motivo** (qué pasó), **acción** (qué hacer, con
  enlace), **cierre** (cordial, es-PY) y **firma** (app + «Desarrollado por
  Owncoding»).
- Placeholders con llaves (`{{cliente}}`, `{{pedido}}`, `{{enlace}}`); el texto
  no lleva lógica. El correo **siempre** incluye el enlace de respaldo visible
  (`docs/TOKENS.md`).
- WhatsApp: mensaje corto armado con `whatsappUrl`; sin datos de más.

## 17. Compactación de escritorio (densidad operativa, #7)

**Más contenido útil arriba del pliegue, sin eliminar funciones.** Un pase de
compactación se hace **auditando primero** (`PageHeader`, barra de acciones,
tarjetas de KPI, tabs y contenedores compartidos) y ajustando después; no se
crea CSS nuevo para lo que ya resuelven los objetos y los tokens (§8). La
anatomía del shell por breakpoint está en **`docs/SHELL.md` §3**.

### Escritorio (≥1280 px)

- **Fila única de encabezado (56–64 px):** título + contador/contexto + acción
  primaria. El subtítulo va en **una línea** (lo que no entra, al tooltip); no
  se apila en varios renglones.
- **Ritmo:** `gap` 12–16 px; padding de tarjetas 16–20 px; separación entre
  secciones 16–24 px.
- **Barra de acciones en una sola fila**; el wrap, solo en breakpoints reales.
  Una tarjeta grande no aloja solo un buscador, filtros o botones.
- **KPIs de 112–140 px:** rótulo chico, valor prominente (`Stat`) y **una**
  línea de explicación; el detalle restante, en tooltip.
- **Información secundaria** como chip, texto auxiliar o tooltip; nunca como
  bloque alto. El vacío ocupa una línea (`EmptyState compact`) cuando se pueda.
- **Tabs** en una barra horizontal compacta; sin botones enormes ni varias
  filas.

### Mobile

- Objetivos táctiles de **≥44 px** (§2 y §15.4); apilar solo donde haga falta;
  tabs con **scroll horizontal** y sin texto cortado.

### Prohibiciones

- No eliminar funciones, permisos, endpoints, datos ni lógica de negocio; no
  esconder acciones importantes.
- No usar altura fija para contenido dinámico.
- No crear variantes locales de objetos publicados: **la `prop` es el camino**
  (§9).

### Verificación

- A **1440×900** cada pantalla muestra contenido real sin scroll innecesario
  después del encabezado y los controles; la barra de acciones no suma capas
  visuales.
- Capturas **desktop (1440×900) y mobile (390×844)**, claro y oscuro, y medición
  antes/después de la altura al primer contenido cuando aplique (§15.4).
- Tests de layout/contrato de la app que fijen lo adoptado (los que tenga).

**Referencia real:** Scale OS (`dariodeoli/scale-os#89`–`#96`): medición de
Inventario **−37 %** a 1440 px (453 → 285 px al primer equipo) y capturas
`docs/qa/compact-*` de ese repositorio. **Adopción:** checklist de
`docs/SHELL.md` §6 y cierre de `docs/ADOPCION-V2.md` §10.

Esto es **densidad visual**, no rendimiento: §15.11 (listas acotadas o
virtualizadas) sigue vigente y compactar no justifica recortar datos ni
funciones.

## 18. «Carga con IA» (#11/#12/#15)

Asistente **opcional** para cargar datos desde **texto libre**: la persona pega
texto, la IA detecta registros y **nada se crea sin confirmación** suya. La
biblioteca lo da completo: `CargaIA` (botón + diálogo juntos, con montaje
diferido), `BotonCargaIA` (topbar, ✨ con tooltip), `DialogoCargaIA` (entrada,
revisión y resultado), el contrato puro en `utils/cargaIA.js` y el **motor
server** en `owncoding-ui/ia`. No duplica reglas: los campos salen de la
**fuente única por tipo de dato** (§1) y la privacidad se apoya en la **§12 de
`docs/REGLAS-ECOSISTEMA.md`**. El **playbook** de abajo (#15) fija el carrito
editable, los errores esperables y el matching, aprendidos en EventOS
(`#120`–`#129`).

### Esquema y callbacks (lo que pasa la app)

- La app define un **esquema declarativo** `EsquemaIA`:
  `{ tipos: [{ id, label, singular?, plural?, campos: [{ id, label, tipo,
  obligatorio?, ayuda?, opciones?, moneda?, maxLargo? }] }] }`, con `tipo` en
  `texto | numero | moneda | fecha | select` (`CAMPOS_IA`). El diálogo dibuja
  cada campo con el objeto publicado que corresponde (`Input`, `MoneyInput`,
  `Select`; fechas con `input type="date"` y la lógica de `utils/fecha.js`).
- La app inyecta `analizar(texto, tipos)` y `crear(registros)`: el
  **componente** no hace `fetch`, no conoce endpoints, permisos ni proveedores
  (el `fetch` al proveedor vive solo en el motor server, abajo). `analizar`
  devuelve `AnalisisIA` (`{ registros, avisos }`, tolerando también la forma
  por tipo `{ clientes: [...] }` con los campos planos); `crear` recibe
  **solo los registros incluidos** (`RegistroIA[]`, en el orden del preview) y
  devuelve `{ creados, errores?, advertencias? }`.
- **Cero éxito falso (§15.1):** si `crear` no informa el conteo, el resultado
  no inventa números; los creados salen de lo que devolvió la app.
- **Nada se crea sin confirmación:** `crear` se llama **solo** desde
  «Crear todo»; descartar una tarjeta la saca del alta y los obligatorios
  vacíos bloquean la creación con el campo marcado.
- **No se persiste el texto pegado:** la biblioteca no guarda el texto (ni en
  logs ni en storage); la app tampoco lo persiste (el endpoint solo lo manda al
  proveedor y lo descarta).

### Límites y estados

- Por defecto **20.000** caracteres (`IA_TEXTO_MAX`) y **25** registros por
  tipo (`IA_REGISTROS_MAX`), configurables por props; contador visible,
  `maxLength` al pegar y recorte con aviso.
- Estados: consultando, **sin configurar** (avisa y no rompe; «Volver a
  chequear»), entrada, analizando, error con reintento, **revisión editable por
  tarjetas con avisos** (incluir/descartar, obligatorios visibles) y resultado
  (creados/errores/advertencias). El diálogo se monta recién al abrirlo.
- **Ancho adaptativo y densidad (#16):** `entrada` y `resultado` abren en
  `amplio` (`max-w-3xl`); la `revisión` pide `completo` solo con varias tarjetas
  (`IA_DIALOGO_COMPLETO_REGISTROS`) o tipos densos
  (`IA_DIALOGO_COMPLETO_CAMPOS`), y `tamanoDialogoIA(fase, …)` lo resuelve. La
  prop aditiva `size` fija el ancho. El textarea usa alto acotado (5 filas,
  `min-h-28`/`max-h-56`, redimensionable) con el contador en la fila del hint;
  el ritmo sigue §17 (gap 12–16, tarjetas 16–20, secciones 16–24) y mobile
  conserva el bottom-sheet a alto completo.

### La persona confirma: carrito editable (#15)

- El asistente **propone y la persona decide**: el preview es un **carrito
  editable**, la misma idea que una venta. Se puede **agregar** un registro a
  mano, **editar cualquier campo**, **duplicar** y **quitar**; nada se aplica
  hasta la confirmación final («Crear todo» / «Aplicar»). El contador muestra
  **N por crear/vincular** y la confirmación aplica solo lo incluido.
- **Editar no reescribe el maestro:** cambiar un precio (o cualquier dato) en
  el carrito ajusta **solo esa fila**; actualizar el producto o cliente
  existente es una **acción explícita** («Actualizar el producto») y nunca un
  efecto colateral de la revisión.
- La IA **acelera** la carga, no la reemplaza: sin detecciones, la persona
  sigue cargando a mano en el mismo carrito (paridad demo, §15.2).

### Errores esperables y su manejo (#15)

| Error esperable | Cómo lo maneja el asistente |
| --- | --- |
| Typos, espacios y mayúsculas («noe ces» ↔ «NoeCes») | Compara con la clave normalizada (sin acentos ni mayúsculas, espacios colapsados o quitados) y tolera 1–2 letras (distancia de edición) en nombres cortos; los umbrales no bajan. |
| **Alucinaciones** (campos que no están en el texto) | Cada escalar se **verifica contra el texto pegado** y se marca «no está en el texto»; no se aplica hasta que la persona lo complete o lo confirme. |
| Moneda extranjera (US$, R$, cotizaciones) | No se interpreta como moneda local ni se convierte sola: se muestra el monto con su moneda y se pide carga manual (o una cotización explícita de la app). |
| Fechas relativas o sin año («mañana», «jueves», «3/10») | Se resuelven contra la fecha del análisis y **se muestran resueltas** («vie 3/10/2026»); la ambigüedad se avisa y se confirma. |
| «A crédito N días» | Es un **plazo**, no un cobro: se convierte en vencimiento (+N días) y nunca en referencia ni fecha de pago. |
| Duplicados y coincidencias ambiguas (dos «María») | Se listan los candidatos **con su porcentaje** y se elige; nunca se crea a ciegas ni se duplica un registro con candidato claro. |
| Reintentos o doble clic | El alta es **idempotente**: la misma clave no se aplica dos veces y el guardado bloquea el doble envío (§2 ter). |
| Proveedor caído o respuesta inválida | **Nada se aplica**: error claro con reintento y el texto pegado sigue en pantalla para volver a analizar. |
| Texto largo o muchos registros | Límites con aviso (20.000 / 25) y recorte visible; nunca un análisis parcial silencioso. |
| Texto con órdenes («ignorá tus reglas…») | Es **dato, no instrucción** (anti-inyección del motor): no cambia el esquema, los límites ni las acciones permitidas. |

### Matching y preselección (#15)

- **Vincular antes que crear:** cada registro detectado se compara primero con
  la cartera de la empresa (clientes por nombre/empresa/RUC/teléfono; productos
  por nombre/SKU/categoría) con normalización + fuzzy; el preview muestra
  «Existente: … (N %) → Vincular» y «Crear nuevo». La **`confianza` es 0–100**
  y se deriva de las señales + la **distancia de edición** entre claves
  normalizadas (tolera typos, espacios y mayúsculas); los umbrales se evalúan
  en el servidor.
- **Preselección por confianza** (siempre cambiable, con «elegir otro»):
  **≥90 %** deja elegido *Vincular*; **60–89 %** deja elegido el **mejor
  candidato**; **<60 %** deja elegido *Crear nuevo*. Nunca un estado bloqueante
  «— Elegí —»: el default es una propuesta y el porcentaje se muestra.
- **Acciones encadenadas:** al resolver el cliente, las acciones que lo
  referencian (cobro, evento, presupuesto) lo **adoptan sin volver a
  preguntar**; si el cliente cambia, se actualizan. La confirmación final del
  lote sigue existiendo.
- Si la cartera está vacía, el preview **lo dice** («no hay productos
  cargados») en vez de ofrecer «crear nuevo» a ciegas.

### Imágenes para confirmar (#15)

- El preview puede mostrar la **foto/miniatura del producto** y el
  **logo/avatar del cliente** (caja uniforme, fallback al ícono del producto o
  a las iniciales con `PersonaChip`/`Avatar`; nunca un cuadro roto).
- La imagen **confirma el match de un vistazo**; no reemplaza el porcentaje ni
  la posibilidad de cambiar el candidato.

### Pagos: parciales, seña y división (#15)

- Los cobros usan **métodos/cuentas reales de la empresa** (banco, número,
  alias de tesorería); **nunca un selector vacío**: sin cuentas configuradas la
  acción no se ofrece y la pantalla guía a cargarlas.
- **Parcial/seña:** el monto cobrado puede ser menor al total y deja el saldo
  pendiente con su vencimiento; el total no se marca «cobrado».
- **Dividir un cobro** en N partes (montos y fechas) se aplica como pagos/plan
  de la app, todo dentro del mismo carrito y con una sola confirmación.
- **Validaciones sin efectos:** monto ≤ 0, suma de las partes ≠ monto, cuenta
  inexistente o inactiva y duplicados se avisan y **no aplican nada**; el flujo
  no queda a medias.
- Un cobro detectado («me pagó X») exige **cliente resuelto**: nunca se
  registra contra un «pendiente de vincular».

### Contrato del endpoint de la app

- `GET` → `{ configurada, modelo, tipos }`: `tipos` son los que el rol puede
  crear; sin `tipos`, el diálogo usa todo el esquema. Sin proveedor
  configurado `configurada: false`.
- `POST { texto }` → análisis normalizado. Guardas: el texto es **dato, no
  instrucción** (prompt anti-inyección), salida **JSON estricto** validada en
  el servidor, **solo se manda el texto pegado** (nunca la base) y el análisis
  **no escribe nada**: los registros los crea el panel con los endpoints
  existentes (mismos permisos, aislamiento por empresa y auditoría).

### Motor server (`owncoding-ui/ia`, #12)

- **Opcional y sin dependencias:** `motorIA({ esquema, tipos })` lee
  `IA_API_KEY`, `IA_MODELO` y `IA_BASE_URL` (proveedor **OpenAI-compatible**:
  `POST <base>/chat/completions` con `response_format: json_object`,
  temperatura 0.1 y `IA_TOKENS_MAX`). Sin `IA_API_KEY` queda **apagado con
  aviso claro** (`ia_no_configurada`): la app sigue funcionando a mano.
- **JSON estricto validado contra el esquema:** el prompt se arma solo con los
  tipos habilitados; la respuesta se parsea (`parsearSalidaIA`) y se valida
  campo por campo (`validarAnalisisIA`): los obligatorios vacíos descartan la
  fila con aviso, los tipos se coaccionan (`numero`/`moneda` a número, `fecha`
  a `YYYY-MM-DD`, `select` contra sus opciones), los campos y tipos
  desconocidos se ignoran y se recorta a `IA_REGISTROS_MAX` por tipo. Un
  registro roto no tumba la pasada.
- **El texto es dato, no instrucción:** el prompt lo dice explícitamente
  (anti-inyección); solo viaja el texto pegado, **no se persiste, no se
  loguea** y el motor **no escribe en la base**: la creación sigue en los
  endpoints de la app, después de la confirmación humana.
- **`fetch` inyectable:** `motorIA({ fetchImpl })` o
  `proveedorIA(config, fetch)` permiten probar con un proveedor mockeado, sin
  red.
- **Rate-limit:** `crearLimitadorIA()` da la ventana fija `IA_RATE_LIMIT` /
  `IA_VENTANA_MS` por clave (la organización); con varias instancias del
  servidor se respalda con un almacén compartido o el rate-limit del borde.

### Privacidad y permisos

- **Ley 7593/2025:** el proveedor de IA es **encargado** —se registra en el
  inventario de la app (§12.5 de `REGLAS-ECOSISTEMA.md`) y se menciona en la
  política—; el diálogo avisa que se envía el texto, **recuerda no pegar datos
  sensibles** (salud, biometría, menores o financieros que no hagan falta) y
  enlaza la política (`enlacePrivacidad`). **Rate-limit por organización** en
  el endpoint (referencia: `IA_RATE_LIMIT` = 10 llamadas / 15 min) y auditoría
  de la transferencia.
- **Permisos:** los tipos que ofrece `GET` son los que el rol puede crear
  (mismas capacidades que los endpoints de alta). Si el rol no puede crear
  ninguno, **el asistente no se ofrece** (la app no monta el botón) y el
  diálogo tampoco deja confirmar.

**Checklist de adopción por app (#15):**

- [ ] Preview **carrito editable**: agregar, editar, duplicar y quitar; editar
      un precio no reescribe el maestro sin «actualizar el producto».
- [ ] Errores esperables cubiertos (tabla de arriba): escalares «no está en el
      texto», moneda extranjera, fechas resueltas, «a crédito» como plazo,
      duplicados con % y elección, idempotencia y proveedor caído sin aplicar.
- [ ] Matching con normalización + typos y **preselección** por umbrales
      90 / 60–89 / <60, siempre cambiable.
- [ ] Imágenes de confirmación (producto y cliente) con fallback.
- [ ] Cobros con **cuentas reales**, parcial/seña y división; cliente resuelto
      antes de registrar.
- [ ] Proveedor encargado + aviso de datos sensibles; solo el texto pegado.

**Referencia real:** LedBox `#120` y los aprendizajes de `#122`–`#129` (playbook
#15); **implementación validada** del playbook en Scale OS `#131`–`#133` (motor
con `confianza`/verificación de escalares, carrito con preselección e imágenes,
y pagos parciales/seña con cuentas reales) y `#117`/`#118`. Adopción: checklist
de `docs/ADOPCION-V2.md` §10 y el checklist de arriba.

## 19. Fronteras de paquete, control y compatibilidad

- Importar desde el subpath más angosto: `ia`, `app-identity`, `email` y
  `financial-metadata` son puros/servidor; `phone` y `financial` son cliente.
  `utils` no puede importar React, componentes ni bytes SVG/PNG.
- Los assets financieros solo pueden vivir en `financial` cuando existe una
  licencia o autorización de redistribución explícita y auditable. Sin esa
  evidencia, todos los subpaths y la galería usan fallback tipográfico;
  metadatos, alias, procedencia y estados siguen disponibles sin cargar bytes.
- Un componente controlado se decide por **presencia de prop**, no por verdad
  del valor ni por presencia del callback. En modo controlado emite intención y
  espera el nuevo prop; en modo no controlado usa `default*` y estado interno.
- Los alias `@deprecated` tienen una ventana mínima de dos releases menores.
  No se borra ningún export sin auditoría de uso en todas las apps, migración
  documentada y changelog.
- `dist/` se regenera solo con `npm run build`. CI compila un consumidor
  TypeScript real, instala el tarball en un directorio temporal y controla
  presupuestos raw/gzip.
