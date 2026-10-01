# Changelog — owncoding-ui

Formato: [Keep a Changelog](https://keepachangelog.com/es/1.0.0/). Versionado
0.x: mientras la biblioteca se forma, un objeto puede cambiar de nombre (se
documenta acá y en el README).

## Sin publicar

- **«Carga con IA» — playbook de errores esperables y carrito editable (#15):**
  `REGLAS.md` §18 suma el **carrito editable** (agregar/editar/duplicar/quitar;
  editar un precio **no** reescribe el maestro sin «actualizar el producto»),
  la tabla de **errores esperables con su manejo** (typos/espacios,
  alucinaciones marcadas «no está en el texto», moneda extranjera, fechas
  resueltas, «a crédito N días» como plazo, duplicados/ambiguos con %,
  idempotencia y proveedor caído sin aplicar nada), **matching con
  preselección** por umbrales ≥90 / 60–89 / <60 (siempre cambiable),
  **imágenes de confirmación** (producto/cliente con fallback), **pagos**
  parciales/seña y división con **cuentas reales de la empresa**, recordatorio
  de **datos sensibles** (Ley 7593/2025) y el **checklist de adopción por
  app**. `ADOPCION-V2.md` §10 suma el ítem del playbook y
  `REGLAS-ECOSISTEMA.md` §12.5 el aviso de datos sensibles. Docs-only: sin
  cambios de API ni de componentes.

## v0.60.1 — 2026-10-01 (preparada, no publicada)

- **Galería priorizada:** la portada y el README muestran primero cuatro
  previews profesionales e interactivos: bancos/medios de pago,
  `PhoneField` con Paraguay y `+595`, ciudad con departamento automático y
  clientes por CI/RUC. Los fixtures de ciudad y clientes se rotulan como
  locales/simulados; no consultan proveedores reales ni asumen una conversión
  universal de CI a RUC.
- `gallery:check` fija los IDs y el orden de esas cuatro vistas para evitar
  drift, y `readme:check` valida la jerarquía y seguridad de los nuevos SVG.
- **Logos financieros reales:** `BancoLogo` y `MedioPagoLogo` incorporan un
  manifiesto local por variante con 63 archivos obtenidos de fuentes oficiales,
  SHA-256, fecha y autorización de proyecto. ueno encabeza la galería; Bancard,
  Dinelco, upay, Pagopar, billeteras y bancos disponibles se renderizan como
  imágenes auténticas. Los 11 casos/variantes bloqueados quedan identificados
  por ID sin recrear símbolos o iniciales.
- Mango, Vaquita, EKO, eCLUB y Pik se incorporan como marcas de pago o acceso
  financiero independientes, con operador, proveedor/institución relacionada,
  actividad y fuentes oficiales. No se modelan como bancos ni como alias de la
  institución; una búsqueda puede sugerir la relación sin sustituir el logo de
  ninguna de las partes.
- Pagopar vuelve al catálogo activo como producto de upay; uPOS conserva la
  relación de producto padre sin atribuirle una marca independiente. Se corrigen
  Dinelco y las URLs oficiales de Medalla, Universitaria, TU Financiera y Zeta.
- Sudameris usa el campo oficial rojo `#FF0000` para mantener contraste y espacio
  de seguridad del lockup blanco, en vez del fondo verde inferido previamente.
- El auditor de assets rechaza XML/SVG malformado, SMIL, eventos y SVG activos
  anidados; el lookup visual ignora claves heredadas y el gate corre también en CI.

## v0.60.0 — 2026-10-01 (preparada, no publicada)

- **Presentación del repositorio:** README reorganizado como portada del
  sistema, con jerarquía progresiva, métricas verificadas del catálogo,
  ejemplos de adopción e imports granulares, matriz de soporte y previews SVG
  propios para componentes, teléfono/finanzas e identidad. `readme:check`
  valida rutas locales, versión, métricas y seguridad básica de los SVG.

- **Fronteras de bundle:** nuevos subpaths `owncoding-ui/phone`,
  `owncoding-ui/financial`, `owncoding-ui/financial-metadata` y
  `owncoding-ui/app-identity`. `utils` y `financial-metadata` quedan puros y
  sin bytes visuales; el registro que empaqueta SVG/PNG vive en `financial`.
  Los imports raíz se conservan.
- **Contratos controlados:** `NavLateral` decide el modo por presencia de prop
  y suma defaults no controlados; `DestinoRecepcion` suma
  `destinoId`/`defaultDestinoId`/`onDestinoChange` y reconcilia cambios del
  `destino` legado; `RangoFecha` permite control parcial sin congelar el otro
  extremo y avisa en desarrollo.
- **Garantías de publicación:** fixture TypeScript real, instalación temporal
  desde `npm pack`, smoke de todos los subpaths y presupuestos raw/gzip forman
  parte de CI. Los alias `@deprecated` tienen una ventana mínima de dos
  releases menores y ningún export se retira sin auditoría del ecosistema.

- **Identidad de app y versión estricta:** `crearIdentidadApp` produce un
  modelo inmutable sin leer el `package.json` consumidor; acepta `X.Y.Z` o
  `X.Y.Z-rc.N` y expone la etiqueta visible `v…` desde la entrada raíz y
  `owncoding-ui/utils`.
- **Pies configurables:** `ProductFooter` conserva su API y suma `identidad`,
  enlaces estructurados y modelos `compacto`/`apilado`/`distribuido`; nuevo
  `ProductPrefooter` opcional con modelos `enlaces`/`accion`/`completo`.
- **Correo transaccional puro:** nuevo subpath `owncoding-ui/email` con modelo,
  HTML y texto escapados, CTA y URL de respaldo. No envía ni maneja relay,
  credenciales, reintentos o tracking.
  Los renderers normalizan también objetos congelados creados por consumidores
  y solo admiten CTA `https:`/`mailto:`; `javascript:`, `data:`, `vbscript:` y
  `http:` fallan antes de producir HTML o texto.
- **Galería pública:** React + Vite + Tailwind enumera todos los exports con
  fixtures explícitos, modo claro/oscuro, búsqueda/filtros y guard de cobertura.
  `gallery:build` produce `site-dist` y un `/status.json` estático para Coolify.
- Docs: `docs/IDENTIDAD-APP-Y-CORREO.md` y `docs/GALERIA.md`.
- **Contratos runtime/TypeScript compatibles:** `MoneyInput` reenvía refs;
  `PercentField` admite `onChange(value)` y `onValueChange(value)` sin duplicar
  una misma función; `BancoCombobox` suma `onSelect`; `CityAutocomplete` suma
  `onChange`; y los callbacks de correo, serial e Instagram quedan declarados
  como strings. Se completan además los tipos de `LoadingScreen`, `Label`,
  `ErrorState`, `SeccionColapsable` y `MedidorBateria`.
- **Accesibilidad crítica:** `Button` usa foregrounds semánticos AA para éxito
  y peligro, los campos compartidos usan el borde interactivo de 3:1,
  `DataTable` conserva datos en móvil con tarjetas genéricas y suma caption,
  encabezados con scope, claves configurables y estado de carga anunciado.
  `PaletaComandos` adopta la trampa compartida de foco, bloqueo de scroll, pila
  de overlays y retorno de foco, sin cierre duplicado por Escape.
- **Teléfono internacional:** `PhoneField` usa Paraguay (`PY`, `+595`, 🇵🇾)
  por defecto y suma un selector accesible con catálogo internacional completo,
  bandera Unicode, nombre localizado, ISO, DDI, búsqueda sin acentos y teclado.
  Mantiene `onChange(local)`/`onCountryCodeChange(dial)` y agrega `country`,
  `onCountryChange` y `onInternationalChange(E.164, meta)`; pegados/autofill con
  `+` o `00` separan país y parte nacional sin reformatear cada tecla.
- **Utilidades de teléfono:** dependencia runtime `libphonenumber-js/min`
  (v1.13.14), `PAISES_TELEFONO`, `paisTelefonoPorIso`, `paisesDeCodigo`,
  `buscarPaisesTelefono`, `parseTelefonoInternacional` y `telefonoE164`. Los
  inválidos/incompletos producen E.164 vacío y Paraguay conserva la validación
  móvil estricta `9XXXXXXXX`.
  Los DDI legados desconocidos permanecen visibles como selección neutral y
  nunca caen silenciosamente a Paraguay; los códigos compartidos usan países
  principales deterministas (`+1` Estados Unidos, `+7` Rusia, `+44` Reino
  Unido) sin reemplazar un ISO explícito.
- **Marcas financieras:** `BancoLogo` suma variantes `compacto` y `horizontal`
  con cobertura visual completa y fallback seguro; esto no implica que cada
  par sea oficial. `BancoCombobox`
  usa la variante compacta. Nuevo `MedioPagoLogo` y registro puro
  `MARCAS_MEDIOS_PAGO` para Visa, Mastercard, American Express, Bancard, Red
  Infonet, Dinelco, upay, uPOS, Procard, PayPro, Cabal y Panal.
- **Catálogo corregido:** Finexpar pasa a `Zeta Banco`; El Comercio y Visión
  quedan como alias históricos de `ueno bank`; Banco Río queda como alias de
  Continental. Se agregan Finlatina y Tu Financiera, y las cooperativas se
  publican por separado en `COOPERATIVAS_PARAGUAY`.
- Cada entrada declara fuente oficial, fecha, categoría, estado y cobertura por
  variante. Citi, Bancard, Dinelco, Procard y otras marcas con redistribución
  no confirmada usan fallback explícito: autenticidad no equivale a permiso y
  no se inventan símbolos recortando wordmarks.
- **Redistribución fail-closed:** v0.60.0 no empaqueta ningún logo de terceros.
  La URL oficial documenta procedencia, pero solo una licencia o autorización
  explícita y auditable habilitará bytes en una versión futura. El paquete, los
  subpaths financieros y la galería usan únicamente fallbacks tipográficos.
- **Scripts portables:** los subprocesses de package smoke y presupuesto de
  bundle resuelven `npm.cmd` en Windows y `npm` en el resto de plataformas.
- Docs: `docs/MARCAS-FINANCIERAS.md`. Tests de catálogo, alias, variantes,
  cobertura, fuentes autocontenidas y seguridad SVG.

## v0.59.0 — 2026-10-01

- **A11y ronda 13 (#13):** verificación de los hallazgos de `dariodeoli/scale-os#60`
  sobre la versión actual y corrección de los que seguían bajo AA en la paleta
  de la biblioteca:
  - **`Button` lleno:** `primary` conserva el par `text-onbrand`/`--c-fono`
    (7.02:1 claro / 11.69:1 oscuro) y su hover pasa a `brightness-110` (el
    `bg-fono-light` daba **3.25:1** en claro); `success` y `danger` usan el par
    nuevo `--c-on-ok`/`--c-on-bad` con `--c-ok`/`--c-bad` (7.13/8.91 y
    6.47/8.18), definido también para el scope `consola` (antes 2.95:1 en claro
    y 1.75:1 en oscuro).
  - **`EnlaceLinea`** usa `text-fono-light` (el verde vivo daba **2.54:1** en
    claro); `ProductFooter` ya usaba el rol AA.
  - **`IconAction` por defecto:** target **real de 44 px en móvil** y 28 px en
    escritorio (el hallazgo medía 28 px en mobile); `size="touch"` sigue igual
    (36 px de dibujo + 44 de toque con `.toque-44`), sin solaparse con las
    acciones vecinas.
  - **Chips:** el `StateChip` warn de la paleta de la biblioteca **ya estaba en
    AA** (6.07:1 claro / 8.48:1 oscuro; ok 6.12/7.22 y bad 5.46/6.69); el 3.65:1
    era del mapeo de Scale OS. Se documenta el mapeo `--c-*-text` para paletas
    propias (el `#8A6207` propuesto da 4.18:1 sobre el tinte real de OPS;
    `#7E5A06` pasa 4.78:1) y la guarda se extiende a **todos los componentes**
    (ningún tono base como texto: `BuscadorCliente`, `TarjetaCuentaCobro`,
    `ConfirmarConPalabra` y `PreviewFusion` pasan a la familia `*-text`).
  - **Pie del riel:** el slot `pie` de `NavLateral` no pintaba color (hallazgo de
    la app); ahora hereda `text-fore` como default AA.
- Tests: guardas nuevas en `contraste-tokens.test.js` (botones llenos y hover,
  enlace, barrido de los 100+ componentes, chip de Scale OS medido sobre su
  tinte) y actualización de `render`/`tactil` para el target del `IconAction`.
- Docs: `REGLAS.md` §8 suma «Botones llenos, enlaces y paletas propias (#13)».

## v0.58.0 — 2026-10-01

- **«Carga con IA» (#11):** asistente reutilizable para cargar datos desde
  texto libre con **confirmación humana obligatoria**. `CargaIA` (forma corta:
  botón + diálogo con montaje diferido), `BotonCargaIA` (topbar, ✨ con
  tooltip) y `DialogoCargaIA` (entrada con contador, estados
  «sin configurar»/analizando/error, **preview editable por tarjetas con
  avisos**, incluir/descartar, «Crear todo» y resumen creados/errores). El
  preview se dibuja desde un **esquema declarativo** (`EsquemaIA`: tipos y
  campos `texto | numero | moneda | fecha | select` con obligatorio/ayuda) y la
  app inyecta `analizar(texto, tipos)` y `crear(registros)`; el componente no
  hace `fetch`, no conoce endpoints ni proveedores y **no persiste el texto
  pegado**.
- **Contrato puro:** `utils/cargaIA.js` exporta los límites por defecto
  **20.000** caracteres (`IA_TEXTO_MAX`) y **25** registros por tipo
  (`IA_REGISTROS_MAX`), la referencia de rate-limit (`IA_RATE_LIMIT` = 10 / 15
  min), tokens/timeout, los rótulos (`IA_BOTON`, `IA_TOOLTIP`, `IA_TITULO`) y
  los normalizadores (`normalizarAnalisisIA`, `validarRegistrosIA`,
  `registrosIncluidosIA`, `normalizarResultadoIA`, …), también por
  `owncoding-ui/utils`.
- **Motor server portable (#12):** nuevo subpath **`owncoding-ui/ia`** (sin
  React y sin banner de cliente) con el motor del asistente:
  `motorIA({ esquema })` lee `IA_API_KEY`/`IA_MODELO`/`IA_BASE_URL` (proveedor
  **OpenAI-compatible**, JSON estricto) y expone `analizar(texto, tipos)`; sin
  key queda **apagado con aviso claro** (`ia_no_configurada`). El prompt se
  genera desde el esquema y marca el texto pegado como **dato, no instrucción**
  (anti-inyección); `validarAnalisisIA` coacciona y valida contra el esquema
  (obligatorios, `numero`/`moneda`, `fecha`, `select`, recortes) y
  `crearLimitadorIA()` da el rate-limit por clave (`IA_RATE_LIMIT` / 15 min).
  El `fetch` es **inyectable** (pruebas mockeadas, sin red); el motor **no
  persiste** el texto ni escribe en la base.
- **Reglas (`REGLAS.md` §18):** esquema y callbacks, contrato del endpoint
  (`GET` estado/tipos, `POST` texto) con las guardas (el texto es **dato**, JSON
  estricto, solo se manda el texto, **no se persiste**, el análisis no escribe),
  el **motor server** y sus variables, privacidad (**Ley 7593/2025**: proveedor
  **encargado**, aviso y **rate-limit por organización**) y permisos (mismas
  capacidades que crear cada tipo; si el rol no puede ninguno, el asistente no
  se ofrece). Referencias sin duplicar: §1 (fuente única por tipo de dato, #10)
  y `REGLAS-ECOSISTEMA.md` §12. Checklist de adopción en `ADOPCION-V2.md` §10 y
  ejemplo de adopción en 3 pasos en el README.
- Tests: contrato puro, interacción (nada se crea sin confirmar, obligatorios,
  descartar, sin configurar, errores, resultado sin conteo, montaje diferido de
  `CargaIA`) y motor (config, prompt anti-inyección, proveedor mockeado, JSON,
  fechas, validación/recortes, rate-limit y guardas del subpath); tipos
  publicados en los tres subpaths.
- Referencias: LedBox `#120` (rama `feat/plataforma`) y Scale OS `#117`/`#118`.

## v0.55.0 — 2026-09-30

- **Fuente única por tipo de dato (#10):** `REGLAS.md` §1 suma «Un componente
  por tipo de dato» —todo campo repetido (moneda, correo, RUC/CI, teléfono,
  fechas, porcentaje, búsqueda, serial, ciudad…) usa **un solo objeto** de la
  biblioteca; la lógica vive una vez y **editar el componente corrige a todas
  las apps**—. Prohibido reimplementar el campo por pantalla; la variante se
  pide por **prop** (o se porta el caso nuevo, §9) y la copia local se borra en
  el mismo cambio; sin objetos espejo dentro de una app.
- **Alineación garantizada de formularios (#10):** `REGLAS.md` §1 suma la regla
  —controles con **línea base** en horizontal y vertical; label arriba y
  hint/error abajo **no pueden desalinear** el control, porque la garantía vive
  en el objeto/CSS del campo y no en márgenes de la pantalla—, el cruce de
  error/hint de campo en §3 y el **checklist de verificación** (un objeto por
  tipo; con/sin `label`; con `hint`, con `error` y sin mensaje; campo + botón;
  grilla; medido a **390/1440**, claro y oscuro).
- **Ecosistema:** §5 y §7 de `REGLAS-ECOSISTEMA.md` refuerzan **biblioteca
  primero, sin duplicar**: componente compartido por tipo de dato, variante por
  prop y «editar una vez, corregir todas».
- Docs-only: sin cambios de API ni de componentes.

## v0.54.0 — 2026-09-30

- **Protección de datos personales (Ley 7593/2025, #8):** `REGLAS-ECOSISTEMA.md`
  suma la **§12** —finalidad determinada y minimización; consentimiento
  granular, no pre-tildado, registrable y **revocable en cualquier momento**;
  transparencia (aviso y política versionada, rol plataforma vs. negocio);
  seguridad y privacidad por defecto (auditoría, PII enmascarada, demos sin
  datos reales, brechas); derechos del titular (acceso, rectificación,
  supresión, oposición, portabilidad y revocación, con respuesta en **≤30 días
  corridos** y exportación/eliminación con doble confirmación y período
  recuperable); encargados, retención y destrucción (con la excepción del
  historial financiero auditable) y **checklist por app**. Autoridad de
  control: Agencia Nacional de Protección de Datos Personales (MITIC). La
  tabla de referencias cruzadas suma las filas de datos personales.
- **Interfaz:** `REGLAS.md` §1 exige finalidad + política en todo formulario
  que recolecte datos personales, sin casillas pre-tildadas y con revocación
  visible; la intro y §15 apuntan a la §12 del anexo.
- **Objetos nuevos (aditivos, sin cambios de API):** `AvisoPrivacidad` (aviso
  de finalidad con enlaces a la política y a los derechos), `ConsentimientoDatos`
  (casilla explícita con versión visible y **nunca pre-tildada**, con enlace
  fuera del label y error anunciado) y `registroConsentimiento`
  (`owncoding-ui/utils`), que normaliza el registro de versión/fecha/canal
  para aceptar y revocar.
- Tests: `test/privacidad.test.jsx` (casilla no pre-tildada, enlace fuera del
  label, error accesible y registro). Docs: README (índice y «Qué incluye») y
  CHANGELOG.

## v0.53.1 — 2026-09-29

- **Campos cortos sin truncar (`PhoneField`):** el número del teléfono ya no se
  comprime por debajo de un ancho legible (`min-w-[8.5rem]` en lugar del
  `min-w-0` que lo aplastaba) y la fila **código de país + número** envuelve
  (`flex-wrap`) cuando el contenedor no alcanza: un ancho corto como el `w-44`
  de `TAMANOS_CAMPO.telefono` —o una grilla de dos columnas— manda el número a
  la línea siguiente en vez de recortar el texto. El código de país pasa de
  `w-[92px]` a `w-24` (96 px): entra «+» y hasta los 6 dígitos de `MAX_CODIGO`
  también con el `text-base` de móvil. Sin cambios de API.
- Tests: `test/campos-cortos.test.jsx` (mínimo del número, fila que envuelve y
  `TAMANOS_CAMPO.telefono` respetado).
- Docs: `REGLAS.md` §1 (teléfono) y el listado del README.

## v0.53.0 — 2026-09-29

- **Compactación de escritorio (#7):** `REGLAS.md` **§17** fija el pase de
  densidad operativa —auditar primero (`PageHeader`, barra de acciones, KPIs,
  tabs y contenedores compartidos) y ajustar después— con las medidas
  adoptables por cualquier app: fila única de encabezado (**56–64 px**), barra
  de acciones en una fila, KPIs de **112–140 px**, ritmo (`gap` 12–16, tarjetas
  16–20, secciones 16–24), mobile con **≥44 px** y tabs con scroll horizontal,
  las prohibiciones (no recortar funciones ni esconder acciones, sin altura
  fija para contenido dinámico, sin variantes locales) y la verificación a
  **1440×900** con capturas 1440×900/390×844 en claro y oscuro.
- Referencias cruzadas sin duplicar: `SHELL.md` §3 (anatomía por breakpoint) y
  §6 (checklist), `REGLAS.md` §10 (shell) y §15.11 (rendimiento), y
  `ADOPCION-V2.md` §10 (checklist de cierre).
- **Referencia real:** Scale OS (`dariodeoli/scale-os#89`–`#96`): medición de
  Inventario **−37 %** de altura a 1440 px (453 → 285 px al primer equipo) y
  capturas `docs/qa/compact-*`.

## v0.52.0 — 2026-09-29

- **Reglas del ecosistema (Segundo Cerebro) anexadas:** nuevo
  **`docs/REGLAS-ECOSISTEMA.md`** con las 11 secciones vigentes —acceso y
  cuentas, permisos y datos, eliminación y privacidad, seguridad técnica,
  diseño/marca/publicación, versionado y pendientes, reutilización,
  infraestructura OwnCoding Hub, correo WEEM, SaaS/pagos/dominios y
  demos/RUC/admin/UX— fieles al texto del Segundo Cerebro, con los docs
  canónicos, el alcance (universales del ecosistema; las reglas propias por app
  **no** se promueven) y **AEX como referencia opcional**. Tabla de referencias
  cruzadas con **§14** (pie/versión), **§15** (transversales) y **§16**
  (notificaciones).
- Links desde `REGLAS.md` (intro y §15), `README.md`, `ADOPCION.md` y
  `ADOPCION-V2.md`; queda claro que `REGLAS.md` es la interfaz y el anexo el
  resto del ecosistema.

## v0.51.0 — 2026-09-29

- **Reglas transversales (#293):** `REGLAS.md` §15 documenta las 11 reglas
  aprobadas (cero éxito falso, paridad demo, cuatro estados, tres temas + toque
  44, una entidad una fuente de verdad, microcopy es-PY, rutas canónicas,
  búsqueda y atajos, dinero y sensibilidad, versión visible y novedades,
  rendimiento por defecto), con el objeto y la verificación de cada una; §3, §8,
  §9, §11-ter y §14 quedan ampliadas con el puntero correspondiente.
- **Formato de notificaciones (#293):** nueva sección `REGLAS.md` §16 con el
  contrato por canal —bandeja (`CampanaAvisos`), push genérico + horario
  silencioso, toast solo de acción en pantalla, derivación única y «sin relay →
  en cola» (estados `enviado`/`encolado`/`duplicado`/`fallido`), y la estructura
  canónica de las plantillas de correo/WhatsApp.
  - `CampanaAvisos`: **vacío con acción** (`vacioAccion`), ruta interna que
    tolera `destino` además de `href` y `data-testid="campana-avisos"`.
  - Nuevos helpers puros: `rutaDeAviso`, `payloadPush` (nada sensible en la
    pantalla bloqueada) y `enHorarioSilencioso`; `partesVersion`,
    `compararVersiones` y `hayVersionNueva` (aviso de versión nueva, regla 10).
- Tests: `test/notificaciones.test.js` y `test/campana-avisos.test.jsx`
  (jsdom: vacío con acción, ruta y elegir).

## v0.50.0 — 2026-09-29

- **Pie institucional obligatorio (#291):** `ProductFooter` es el objeto único
  para el pie de **todas** las páginas (panel, acceso y públicas/tokenizadas):
  © + nombre + **versión de la app** + crédito **«Desarrollado por Owncoding»**
  con enlace. El crédito y su URL ahora vienen por defecto
  (`CREDITO_PIE`/`CREDITO_PIE_URL`; la app puede pisarlos, no quitarlos), el
  enlace suma el área táctil de 44 px (`toque-44`), el pie expone
  `data-testid="product-footer"` para asertar la adopción por pantalla y sin
  `nombre` ya no queda un punto suelto.
- Docs: **`REGLAS.md` §14 «Pie institucional»** (regla y ejemplo) y
  `SHELL.md` (fila, props y checklist de adopción: panel, auth, públicas y
  tokenizadas).
- Tests: `test/product-footer.test.jsx` (contenido mínimo, crédito por defecto
  y pisado, 44 px, año, leading/children).

## v0.49.0 — 2026-09-27

- **Ticket de prueba con corto predeterminado y plantilla (#277):**
  - `paginaDePrueba` gana el tipo **`corta` minimal** (solo «TICKET DE PRUEBA» +
    «VALIDACIÓN XXXX-X» y, si la plantilla lo pide, fecha/hora): menos papel y
    más rápido. El ticket **`completa`** conserva lo que hacía el corto anterior
    (destino, método, pie auditable, QR/barras y acentos).
  - **`PLANTILLA_PRUEBA` + `plantillaDePrueba(datos)`**: tipo, ancho (58/80),
    `incluyeFecha`, corte (`VARIANTES_CORTE`) y copias (1–5), normalizando lo
    que venga; `paginaDePrueba` la aplica (`incluyeFecha`, `corte`).
  - Tests: `test/prueba.test.js` (corto sin pie ni códigos, fecha opcional,
    completo con trazabilidad, plantilla válida/basura).
- Docs: `docs/IMPRESION.md` y README.

## v0.48.2 — 2026-09-27

- **`Avatar` no pinta la imagen anterior (#271):** al cambiar `src` (otra
  persona, otra versión de la foto) monta un nodo nuevo (`key` por URL) y, hasta
  que la nueva carga, queda el **placeholder neutro de iniciales**; el navegador
  ya no puede mantener la imagen vieja en el mismo `<img>` (eso producía el
  flash de la foto previa al recargar). Si la imagen falla, cae a iniciales y
  avisa por `onError` para que la app pase a la fuente siguiente.
- Tests de navegador (`test/avatar-carga.test.jsx`) y guarda nueva: los
  componentes no cachean datos en el módulo (`test/sin-cache.test.js`), revisada
  contra los objetos de los lotes de Inventario, Finanzas, Config y cobros.
- Docs: `REGLAS.md` §6.

## v0.48.1 — 2026-09-27

- **`SelectorCuentaCobro`**: «Cambiar cuenta» reabre la búsqueda de verdad.
  Antes el oyente de clic afuera quedaba activo en modo tarjeta (el `ref` no
  estaba montado) y la cerraba en el mismo clic. Ahora vive solo mientras se
  busca. Lo cubre el test de navegador nuevo.
- Tests: el paquete suma `jsdom` y `test/selectorCuentaCobro.test.jsx` con las
  interacciones reales —preselección, buscar/elegir/colapsar, teclado que no
  arrastra la página y virtualización al desplazar la lista.

## v0.48.0 — 2026-09-27

- **`SelectorCuentaCobro` con preselección y lista larga estable (#262, con
  POS):**
  - **Preselección**: con `preseleccionar` el selector propone solo la
    **última cuenta usada** (`ultimoUsadoId`, la guarda la app) o, si no hay,
    la **predeterminada** (`predeterminadaId`) y avisa por `onSelect`; una
    cuenta inactiva o que ya no existe no se propone. Helper puro
    `preseleccionDeCuenta(cuentas, { ultimoUsadoId, predeterminadaId })`.
  - **Hasta 100 cuentas** (`LIMITE_CUENTAS`, `limite` configurable) con
    **virtualización**: solo se montan las filas visibles (margen de 2),
    `aria-posinset`/`aria-setsize` mantienen la posición real y el alto que
    falta se reserva con el relleno de la lista. La fila mide 48 px y se
    corrige con la fila real al montar (zoom/tipografía del dispositivo).
  - **Mobile estable**: la lista scrollea con `overscroll-contain` y hasta
    `min(60vh, 18rem)`; las flechas mueven el resaltado desplazando **solo la
    lista** (antes `scrollIntoView` podía arrastrar la página).
  - Se mantiene el buscador y el **colapso de #262** (una sola tarjeta con
    «Cambiar cuenta»).
  - Nuevo helper puro `ventanaDeLista` (+`MARGEN_VENTANA`) en `utils/ventana.js`
    para listas largas de cualquier pantalla.
- Docs: `REGLAS.md` §1 y README.

## v0.47.0 — 2026-09-27

- **`NavegacionSeccion` (#267/#253):** el riel de secciones de una pantalla —
  escritorio con barra lateral que **colapsa a solo íconos** (tooltip,
  `aria-label`, indicador y `aria-current` del activo) y mobile con tira
  horizontal desplazable que centra la sección activa; `variante="horizontal"`
  la deja horizontal en todas las medidas. El colapso es **controlado**
  (`colapsado`/`onToggle`): la app recuerda el último usado. Conserva
  `role="tab"`/`aria-selected` y muestra la descripción del grupo activo.
- Docs: `REGLAS.md` §11 y README.

## v0.46.0 — 2026-09-26

- **`Cronologia` con estados honestos:** suma `cargando` (esqueleto, no una
  lista vacía), `error` + `onReintentar` (aviso con reintento) y `onActualizar`
  + `textoActualizar`/`textoCabecera` (cabecera con el botón de actualizar).
  Con eso la pantalla solo hace el fetch y mapea los hitos; la lista, los
  estados y la accesibilidad viven en el objeto.
- Docs: `REGLAS.md` §8 ter y README.

## v0.45.0 — 2026-09-26

- **Unificar clientes (#268), lo que faltaba del flujo:**
  - **`ChipFusion`**: marca la **ficha archivada** con la principal, cuándo y
    quién la fusionó, y abre la principal (los enlaces y tokens siguen vivos).
  - **`CATEGORIAS_FUSION` + `categoriasFusion(conteos)`**: el checklist del
    preview con el orden y las etiquetas canónicas (pedidos, pagos y cuotas,
    créditos y saldo, notas, direcciones, teléfonos y correos, tags, seguro de
    ventas, portal, garantías y servicio); `hayFusion` dice si hay algo que
    mover. Los ids fuera del catálogo se agregan al final.
- Docs: `REGLAS.md` §11 ter y README.

## v0.44.0 — 2026-09-26

- **Bloque de pago (#265):** **`BloquePago`** — la tarjeta de cada medio de pago
  con la **papelera adentro** (arriba a la derecha, `IconAction` con tooltip y
  44 px de toque), el contenido con el ancho completo y un `acento` opcional
  para el borde izquierdo (pagado/no pagado). El contenido entra por `children`
  y quitar se avisa por `onQuitar`; la confirmación es de la pantalla.
- Docs: `REGLAS.md` §2 y README.
- Recordatorio del lote: el selector de cuenta de cobro (#262, v0.42.0:
  `SelectorCuentaCobro`/`TarjetaCuentaCobro`) y los componentes de unificación
  de clientes (#268, v0.43.0) quedan publicados y documentados.

## v0.43.0 — 2026-09-26

- **Unificar clientes duplicados (#268):** componentes del flujo completo.
  - **`BuscadorCliente`**: input search por nombre, teléfono (crudo o en
    dígitos), CI/RUC, correo, facturación o tags, con alta rápida y marca de
    **«posible duplicado»**.
  - **`PreviewFusion`**: las dos fichas con sus datos, elección de **cuál queda
    como principal** y **checklist de lo que se fusiona** por categoría con
    conteos; la ficha fusionada no se borra (queda archivada con puntero).
  - **`ConfirmarConPalabra`**: confirmación fuerte con resumen, advertencia y la
    palabra exacta (`FUSIONAR`), ocupado y error.
  - Helpers en `utils/cliente.js`: `campoBuscableCliente`, `filtrarClientes`,
    `detalleCliente`, `motivosDuplicadoCliente` (teléfonos por clave nacional:
    sin 595 ni 0 inicial), `claveTelefonoCliente` y `coincideTelefonoCliente`.
- Docs: `REGLAS.md` §11 ter y README.

## v0.42.0 — 2026-09-26

- **Selector de cuenta de cobro (#262):** **`SelectorCuentaCobro`** +
  **`TarjetaCuentaCobro`** — al elegir una cuenta el buscador **se colapsa** y
  queda **una sola tarjeta** limpia con nombre, logo o ícono del medio, moneda,
  tipo de transferencia, **banco una sola vez** (se omite si el nombre ya lo
  dice) y el **saldo pendiente de la venta** (con equivalente si la cuenta es en
  otra moneda), más la acción **«Cambiar cuenta»** que reabre la búsqueda.
  Filtra por nombre, banco/procesadora, titular, número, medio y moneda.
  Helpers en `utils/cuentaCobro.js` (`MEDIOS_CUENTA`, `simboloCuenta`,
  `numeroParcialCuenta`, `filtrarCuentasCobro`, `detalleCuentaCobro`…).
- Docs: `REGLAS.md` §1 y README.

## v0.41.0 — 2026-09-26

- **Buscador de proveedor (#259):** **`BuscadorProveedor`** — input search con
  **últimos usados por defecto** (`recientes`, ids o proveedores, resueltos en
  orden y sin repetir), filtro por **nombre o abreviatura** (`code`, sin
  acentos) y **alta rápida** desde el campo (`onCreate` async → proveedor
  creado). Contrato combobox completo (`aria-activedescendant`, ↑↓/Enter/Esc),
  catálogo por props o al servidor (`onQueryChange`); helpers
  `normalizarProveedor`/`filtrarProveedores`/`resolverRecientes`.
- Docs: `REGLAS.md` §1 y README.

## v0.40.1 — 2026-09-26

- **Fix del CSS publicado:** el comentario de los tokens de texto de chip
  contenía `*/` y cerraba el bloque antes de tiempo, así que cualquier app que
  importara `styles.css` fallaba al compilar (PostCSS: «Unknown word 10–15`»).
  El comentario ya no usa esa secuencia y `dist/styles.css` vuelve a parsear.

## v0.40.0 — 2026-09-26

- **Abastecimiento F3–F5 · manifiesto del lote (#250 §11):** **`ManifiestoEnvio`**
  — el papel que viaja con el envío: código, origen → destino, método,
  empresa/conductor/guía, responsable, compra, fechas, detalle por producto con
  los IMEI conocidos y pendientes, totales y QR del manifiesto público. Papel
  claro con clases `oc-print-*`, para envolver con `DocumentoImpresion` (PRN
  solo le da el layout).
- Docs: `REGLAS.md` §13 y README.

## v0.39.0 — 2026-09-26

Ronda de cosechas: PagaYa (#1), ScaleOS (#2), LedBox (#3/#4) y el fix de
contraste AA de los chips (#5). Aditivo, sin cambios incompatibles de API.

### Cosecha de ScaleOS (#2)

Portado de ScaleOS (`app/save-actions.tsx`, `use-single-flight-submit.ts`,
`save-completion.ts`, `amount-format.ts`, `dialog.tsx`, `overlay-stack.ts`,
`list-format.tsx` y `due-date.tsx`, repetidos en las verticales). Reglas en
`docs/REGLAS.md`.

- **Ciclo de guardado:** `useSingleFlightSubmit(envio)` bloquea antes de la
  validación asíncrona y no solapa envíos; `completeSave(cerrar, refrescar,
  { avisar })` cierra después de persistir y convierte un fallo de refresco en
  advertencia («no hace falta guardar otra vez», `AVISO_REFRESCO`);
  `crearEnvioUnico` es el envoltorio puro que usan los tests.
- **Caret de montos:** `MoneyInput` conserva el cursor al tipear y pegar en
  cualquier posición (`normalizarMontoInput` + `caretTrasDigitos`), acepta
  pegado es-PY (`1.250,50`), en-US (`1,250.50`) o suelto (`1250.50`) y suma
  `integerOnly` para los enteros de previsión/informes (mismo contrato de
  `onValueChange`, sin romper el `maxLength`).
- **Overlays (#2):** `Modal`/`Drawer` sostienen la pila de capas —`aria-modal`
  solo en la superior, `Esc`/Tab/foco solo en la de arriba, scroll con
  contador y retorno de foco a la capa anterior—; `busy` bloquea el cierre
  interactivo. Los formularios registran su bloqueo con
  `useDialogPending(pendiente)` (uno ocioso no destraba a otro) y
  `FormActions`/`SaveActions` montan el pie fuera del scroll asociado al
  `<form>` real (`form={id}`), con el cancelar deshabilitado mientras guarda.
  `Modal`/`Drawer` suman `busy`; `ConfirmDialog` lo pasa al modal.
- **Serial y fechas (#2):** `fechaLista` (`17 sept 26 · 14:30`, hora aparte
  con `{ hora }`) y `fechaListaCorta` (`17-sept`) para las columnas densas, con
  la zona de la app y h23; `diasHasta` y `tonoVencimiento` miden el vencimiento
  por día de calendario (el `dueTone` de ScaleOS, ahora el mismo cálculo de
  `Vencimiento`); `SerialTexto` suma `enmascarar` (`••••4821` con el serial
  completo en el `title`).

### Contraste de chips y borde interactivo (#5)

Fix de la QA de Scale OS (ola 2): el texto de los chips quedaba por debajo de
AA en tema claro. La evidencia y los valores medidos quedan en el issue.

- **Familia de texto `--c-*-text`:** `Badge`, `ChipEstado`, los puntos de estado
  y todo texto sobre relleno tenue (`bg-*/10–15`) usan ahora `--c-ok-text`,
  `--c-warn-text`, `--c-bad-text`, `--c-info-text`, `--c-fono-text` y
  `--c-pass-text` (preset: `text-ok-text`, …). Los tonos base
  `--c-ok`/`--c-warn`/`--c-bad`/`--c-info`/`--c-fono`/`--c-pass` **no cambian
  de valor**: siguen siendo los de relleno, punto y borde.
  - Medido (texto sobre tinte al 15, blanco/canvas): `fono` sube de
    **4.43/4.05 → 6.67/6.11** (la cápsula azul del `Badge`); `pass` pasa de
    **2.01/1.84 → 6.25/5.73** (chips «Certificado», «Pagada»). Los cuatro tonos
    que la QA marcó (`ok`, `warn`, `bad`, `info`) ya habían quedado ≥4.5 con la
    paleta v2 global y se mantienen (5.66/5.17, 5.60/5.11, 5.01/4.56,
    5.18/4.73); oscuro sin regresión (5.2–9.6).
  - Una app con paleta propia mapea su familia de texto (p. ej. la AA de Scale
    OS: `--c-ok-text: #116B35` → 5.39:1 y `--c-warn-text: #7E5A06` → 5.10:1
    sobre su propio tinte) sin tocar los rellenos.
- **Borde interactivo `--c-interactivo`:** el borde que es la única affordance
  (`Button variant="outline"`, botones de solo-icono con borde, `ThemeToggle`)
  pasa de `--c-ink-500` (2.56:1 en claro / 2.89:1 en oscuro) a un gris medido
  **3.49–3.85:1 en claro y 4.28–5.22:1 en oscuro** (WCAG 1.4.11).
- `test/contraste-tokens.test.js` mide la familia completa (dos alfas ×
  superficies × dos temas) y el borde; ningún mapa de la librería puede volver
  al tono base como texto (aserción de fuente).

### Cosecha de PagaYa (#1)

Portado de PagaYa (`app/tokens.css`, `docs/ui-kit.md`, `components/app-icon.tsx`,
`lib/shared/inputs.ts`, `components/fields/tax-id-field.tsx` y
`lib/hooks/use-dialog.ts`). Todas las reglas quedan en `docs/REGLAS.md`.

- **`TaxIdField` (RUC paraguayo):** campo de identificación fiscal con
  `taxIdValid` / `normalizeTaxId` (más `taxIdGenericoValid`,
  `taxIdValidoParaPais` y `limpiarTaxId`) en `utils/taxId.js`. La consulta de
  razón social es un callback de la app
  (`onBuscarRazonSocial` / `onAplicarRazonSocial`): la librería no hace `fetch`.
  `FormField` ahora dibuja el mensaje con `id` para enlazarlo por
  `aria-describedby`.
- **Iconos de pago y operación:** se suman a `Icon` los glifos que faltaban
  (`home`, `arrow`, `link`, `play`, `pause`, `archive`, `call`, `pin`, `code`,
  `qr`, `transfer`, `subscription`, `card`, `terminal` y `nfc`) sin renombrar
  los existentes; `building`, `mail`, `bank` y `backspace` ya estaban en la
  librería y conservan su glifo (paridad #253). Las equivalencias con `AppIcon`
  de PagaYa quedan documentadas en `docs/REGLAS.md` §8.
- **`ThemeToggle`:** único control de tema sobre la clase `dark` de la
  librería, con persistencia configurable por prop (`clave`), etiquetas
  accesibles e iconos sol/luna. `aplicarTema(tema, clave)` queda exportada para
  que la app restaure la preferencia antes del primer pintado.
- **Sistema `--ds-*`:** espaciado, radios, tipografía, elevación, halos,
  gradientes y ritmo de contenedores del rediseño de PagaYa, con el contrato de
  densidad `--ds-row: 54px` / `--ds-cell-min: 150px` y la regla «se miden, no
  se declaran». Aditivo: ningún token existente cambia de valor.
- **`SectionState`:** vacío, cargando o error en un solo objeto, compacto y con
  acción o reintento; compone `EmptyState`, `Skeleton` y `ErrorState` en vez de
  duplicar su markup.
- **`useDialogFocusTrap`:** scroll bloqueado, foco inicial, ciclo de Tab, `Esc`
  y devolución del foco en un hook compartido por `Modal` y `Drawer` (antes
  estaba copiado en cada uno).

### Utils y tipos al día — LedBox (#3) y contrato de utils (#4)

Pendientes de los issues **#4** (`.d.ts` vs runtime, ciudades y entrada de
utils) y **#3** (cierre del piloto de LedBox). Aditivo: la firma tipada de los
helpers de teléfono pasa a la del runtime y el resto de los agregados son
opcionales.

- **Teléfono — contrato real y formato canónico (#4):**
  - `parseTelefono` y `componerTelefono` viven en `utils/telefono.js` (con
    `CODIGOS_PAIS`) y el `.d.ts` publica la firma real del runtime:
    `{ countryCode, phone }` y el objeto de datos (antes declaraba
    `{ codigo, numero }` y `(codigo, numero)`, así que TypeScript llamaba mal).
  - `parseTelefono` parte el pegado internacional `00…` (`00595 981 123 456`
    → `+595`, `981123456`) contra los códigos conocidos, el más largo primero.
  - `normalizarTelefono` fija el formato canónico agrupado (`+595 981 000 000`)
    en vez de devolver dígitos pegados; sin teléfono devuelve `''`.
  - `PhoneField` tipa sus props reales y `CODIGOS_PAIS` queda como `string[]`
    (el `.d.ts` declaraba objetos). La política sigue siendo móvil-PY y
    `docs/REGLAS.md` §7 documenta el formato.
- **Bancos — tipos del registro y alias de LedBox (#4):**
  - `BANCOS_PARAGUAY` se publica como `string[]` y `logoDeBanco` con el tipo
    real del registro (`{ banco, tipo: archivo|marca|monograma } | null`); el
    `.d.ts` declaraba objetos y `string | null`.
  - El registro suma los alias que cada app resolvía a mano: `continental`,
    `bnf`, `interfisa`, `atlas`, `familiar`, `vision`, `sudameris`, `fic`,
    `rio` y `ueno`. `Visión Banco` y `Financiera FIC` entran al catálogo;
    `Banco Río` (absorbido por Continental) solo se resuelve para datos
    históricos y no se sugiere.
  - `'ueno bank'` pasa a `'Ueno Bank'` (el alias `ueno` sigue andando) y
    `coberturaBancos` no cambia.
- **Ciudades — catálogo bilingüe y campo tolerante (#4):**
  - Cada fila de `CIUDADES_PARAGUAY` expone las claves en español
    (`ciudad`/`departamento`) y en inglés (`city`/`department`), el mismo dato.
    Antes el catálogo era solo español y `buscarCiudad` devolvía solo inglés.
  - `buscarCiudad` devuelve las filas bilingües y `CityAutocomplete` acepta un
    `buscar` propio con las claves en español o en inglés.
  - El `.d.ts` publica `CiudadParaguay` (fila bilingüe) y `departamentoDe`
    devuelve `string` (nunca `null`): se acaban los shims de las apps.
- **Entrada de utils sin `"use client"` (#4):** nuevo subpath
  **`owncoding-ui/utils`** con toda la lógica pura (dinero, fechas, teléfono,
  catálogos, nombres, estados, agenda, abastecimiento e impresión de texto),
  sin React y sin el banner de cliente; `dist/utils.js` +
  `dist/utils.d.ts`. Sirve para server components, route handlers y scripts de
  Next sin `serverExternalPackages`. `owncoding-ui` sigue igual. Tras integrar
  la rama `lib`, el subpath también publica su cosecha pura: `fechaLista`/
  `fechaListaCorta`/`diasHasta`/`tonoVencimiento`,
  `normalizarMontoInput`/`caretTrasDigitos`, `taxId*` (`PATRON_*`,
  `taxIdValid`, `normalizeTaxId`…) y `crearEnvioUnico`/`completeSave` +
  pila de overlays.
- **Tipos al día con el runtime (cierre de #3):** el `.d.ts` suma
  `VistaPreviaPapel`/`ANCHOS_PAPEL`, `LIMITE_MONTO_ALMACENABLE`,
  `limiteMonto` y `errorMonto`, y `normalizarBusqueda` ahora sale por
  `owncoding-ui` (estaba declarado en los tipos pero no exportado). Test
  nuevo en `tipos.test.js`: todo export del runtime tiene declaración y toda
  declaración de valor existe en runtime (la deriva vuelve a fallar sola).
- **Cierre del piloto de LedBox (#3):** el resto de la cosecha
  (`owncodingContent`, tipos publicados, `tokens.css`/`base.css`, `timeZone`,
  símbolo del guaraní, `ChipEstado` de negocio y los 23 íconos) ya viajó en
  v0.14.0; esta ronda completa los tipos que faltaban y corrige
  `docs/ADOPCION.md`, que todavía afirmaba que el preset aportaba `content`.

## v0.38.0 — 2026-09-26

- **Abastecimiento F5 — recepción e incidencias (#250):**
  - **`TarjetaRecepcion`**: la llegada pendiente (lote, origen → destino,
    método, ETA con `Vencimiento`, «N de M con IMEI» y depósito sugerido) con
    la acción de abrir/retomar.
  - **`ResumenRecepcion`**: conteos por resultado desde el mapa del backend
    (`{ RECIBIDO: 12, FALTANTE: 1, … }`) o desde los ítems, con los tonos del
    mapa compartido.
  - **`claveRevision`**: los resultados del backend (`RECIBIDO`, `DANADO`,
    `SIN_IMEI`…) se normalizan antes de buscar en `ESTADOS_REVISION`; los
    helpers `etiquetaRevision`/`tonoRevision`/`esIncidencia` la usan.
- Docs: `REGLAS.md` §13 y README.

## v0.37.0 — 2026-09-26

- **Abastecimiento F2–F5 (#250):** objetos para la compra, el lote y la
  recepción, alineados a los contratos ya implementados:
  - **Estados** `ESTADOS_COMPRA`, `ESTADOS_ENVIO` y `ESTADOS_RECEPCION` (con
    `PASOS_ENVIO`), tolerantes a las claves del backend y con etiqueta/tono.
  - **`METODOS_ENVIO`** (bus · transportadora · AEX · importación) con etiqueta
    e ícono.
  - **`TarjetaCompra`** (`COM-…`: proveedor, estado, «N de M con IMEI»,
    costo/moneda y referencia) y **`TarjetaLote`** (`ENV-…`: origen → destino,
    método, empresa/guía, responsable, ETA y conteo).
  - **`EtiquetaLote`**: la etiqueta de preparación «ENV-… · PRODUCTO n DE N»
    con modelo/variante, IMEI o «IMEI pendiente», pedido/destino y QR.
  - `ESTADOS_REVISION` suma `recibido` (resultado de unidad de F5).
- Docs: `REGLAS.md` §13 y README.

## v0.36.0 — 2026-09-26

- **Abastecimiento F1 · lo que pedía el panel (#254):**
  - **`Subtabs` acepta contador**: `items=[['pendientes', 'Por comprar', 12]]`
    muestra la cantidad en la pestaña (tabular, tono según activo) para las
    colas del panel.
  - **`CONDICION_UNIDAD` + `etiquetaCondicion`** en `utils/estadoEquipo.js`:
    «Nuevo / Seminuevo / Reacondicionado» en un solo lugar (listas, tarjetas y
    panel), con la clave libre tal cual y vacío «—».
- Docs: `REGLAS.md` §12 y README al día.

## v0.35.0 — 2026-09-26

- **Abastecimiento F1 · contrato real (#254):** los mapas se alinean al
  contrato de INV para que el panel de PLT no traduzca nada:
  - **Prioridades** `URGENTE · ALTA · NORMAL · BAJA` (con `media` como alias de
    `normal`), tolerantes a mayúsculas.
  - **`ChipOrigen`** + `ORIGENES_NECESIDAD` (venta sin stock, reserva sin
    unidad, venta sobre stock, bajo reposición, pedido comprometido, manual)
    con etiqueta, tono e ícono; las claves libres se muestran tal cual.
  - **Estados** `ABIERTA · ASIGNADA · COMPRADA · RECIBIDA · CANCELADA` (más las
    fases siguientes), con alias de la UI (`por_comprar`, `comprado`…).
  - **`TarjetaNecesidad`** suma `centro` y usa `ChipOrigen` para el origen.
- Docs: `REGLAS.md` §12 y README al día.

## v0.34.0 — 2026-09-26

- **`CityAutocomplete` (#253):** si `buscar` falla, el campo muestra el aviso en
  línea (`role="alert"`, `mensajeError`) en lugar de ocultar la lista en
  silencio; al volver a tipear se limpia. Paridad con el campo de MobOS, que ya
  avisaba (el adaptador de la app se apoya en esto).

## v0.33.0 — 2026-09-26

- **Abastecimiento F1 — demanda y tablero (#250/#254):**
  - **`ChipPrioridad`** con `PRIORIDADES_COMPRA` (alta/media/baja → tono y
    orden) y **`ordenarPorPrioridad`** para la lista.
  - **`ContadoresCompra`** (pendiente/comprado/faltan) en texto o chips, con
    números tabulares y sin negativos.
  - **`TarjetaNecesidad`**: la tarjeta compacta del panel «Por comprar»
    (producto/variante exacta, estado, prioridad, origen, fecha prometida,
    vínculo con la venta/reserva, destinos, observaciones y acciones), que
    compone `Vencimiento`, `ResumenDestinos` y los contadores.
  - **`utils/abastecimiento.js`**: `ESTADOS_NECESIDAD` (por comprar → recibido,
    más incidencia/cancelada), `PASOS_NECESIDAD` y `colorDeTono`.
  - Docs: `REGLAS.md` §12 y README.
- **Paridad:** `normalizarSerial` quita el prefijo `MOBOS:` de las etiquetas del
  agente (el campo de MobOS ya lo hacía).

## v0.32.0 — 2026-09-26

- **Paridad para la migración del kit (#253):**
  - `Badge` suma la clase de scope **`v2-chip`** (chip tipo pill dentro de v2) y
    los tonos `ok/warn/bad/info/mute` del semáforo, como los usa MobOS.
  - Los cierres de **`Modal` y `Drawer`** usan **`toque-44`**: 44 px de toque
    sin mover el dibujo (#249).
  - **`utils/moneda`** publica `LIMITE_MONTO_ALMACENABLE`, **`limiteMonto(max)`**
    y **`errorMonto(value, max)`**: el límite efectivo del campo se acota a lo
    que el backend puede guardar y el mensaje queda en un solo lugar.
- Tests: límite y error de monto, `v2-chip` en `Badge` y el cierre táctil del
  modal.

## v0.31.0 — 2026-09-26

- **Paridad para la migración (#253):** `SeccionColapsable` acepta **`id` como
  alias de `clave`** — las apps que ya lo llamaban así conservan el estado
  plegable de la sesión al puentear el objeto. La clave de sesión es el valor
  tal cual.
- Tests: `render.test.jsx` cubre el alias.

## v0.30.0 — 2026-09-25

- **Guía práctica de adopción v2 en otra app:** nuevo
  **`docs/ADOPCION-V2.md`** — de la paleta al shell, contraste AA, retiro del
  bloque local, puentes de migración, controles que sostienen la migración, el
  caso real de MobOS (v0.24 → v0.30) y los errores comunes. Enlazada desde el
  README; complementa `ADOPCION.md` (paquete) y `MIGRACION-V2.md` (pantalla).
- **Set de íconos único (#253):** `share` se suma al set y `mail` conserva el
  trazo que la app ya tenía en producción (esquinas rectas). Con eso la app
  puede puentear `Icon` sin perder ni cambiar ningún glifo.
- Tests: paridad de `share`/`mail` en `test/iconos.test.jsx`.

## v0.29.0 — 2026-09-25

- **Objetos de Configuración (#253):**
  - **`EstadoGuardado`**: el estado transversal de guardado (chip verde
    «Guardado…» o el error en rojo, con `aria-live`) que MobOS tenía en
    `control/GuardadoCuenta.jsx`; la app maneja el POST y la reautenticación.
  - **`Checkbox`**: selección múltiple con `label`/`descripcion`,
    `variante="simple" | "tarjeta"` y `tono="fono" | "bad"`; sin label queda el
    control pelado con `ariaLabel`. Para booleanos va `Switch`.
- Docs: `docs/REGLAS.md` §11 suma las dos piezas (estado de guardado y
  selección múltiple).
- Tests: `test/configuracion.test.jsx` (asociación label↔control, variantes,
  tono/disabled, chip y aviso del guardado).

## v0.28.1 — 2026-09-25

- **Categorías (#253):** «auriculares genéricos» vuelve a mandar a **accesorios**
  (antes caía en el alias de AirPods); la app tenía la palabra y la biblioteca
  no, así que los puentes de `IconoCategoria` quedan con el mismo resultado.
  Test: `utils.test.js` fija los dos casos («auriculares» = AirPods, «genéricos»
  = accesorios).

## v0.28.0 — 2026-09-25

- **Objetos de Configuración (#253):**
  - `TarjetaAjuste` suma **`tono="peligro"`** (borde y título rojos) para las
    tarjetas de archivar/eliminar/cancelar; el default no cambia.
  - Los tipos corrigen `PanelDerecho` (`panel` en lugar de `formulario`) y
    declaran `icono`/`id`/`tono` en `TarjetaAjuste`.
- Docs: **`docs/REGLAS.md` §11** — cómo se arma una pantalla de Configuración
  con tarjeta de ajuste, `Subtabs`, `PageHeader`/`Eyebrow` y `PanelDerecho`,
  sin duplicar cards, tabs ni encabezados; campos por el kit y el control de
  duplicación de MobOS (`docs/CAMPOS.md` §6).
- Tests: `test/ajustes.test.jsx` cubre el tono peligro y el ícono de la tarjeta.

## v0.27.0 — 2026-09-25

- **Buscador global (`PaletaComandos`), paridad para la adopción (#241):**
  - El campo usa el patrón combobox completo: `aria-activedescendant` apunta a
    la opción resaltada (ids por posición) mientras el foco queda en el input.
  - El vacío acepta `descripcionVacio` (la app conserva su texto: «Probá con
    otro nombre, SKU, serial o número»).
  - Los tipos declaran las props de textos (`titulo`, `placeholder`,
    `ariaLabel`, `mensajeError`, `textoSeguir`, `textoSinResultados`).
- Tests nuevos `test/paleta-comandos.test.jsx`: agrupación con etiquetas e
  íconos por props, estados honestos (`seguir`/`cargando`/`error`/`listo`/
  `vacio`), contrato combobox y botón con atajo.
- Docs: `docs/SHELL.md` §3 con la adopción real de MobOS como referencia.

## v0.26.0 — 2026-09-25

- **Retiro del bloque local v2 (#241):** la capa de contenido del shell v2
  queda completa en `styles.css` y las apps pueden borrar su
  `.v2-piloto`/`.tema-v2` local sin perder AA. Se portan las reglas que MobOS
  todavía tenía en su `index.css`:
  - Tiles de consola (`v2-tile`) y grado del tile de equipo (`v2-grado`).
  - Rótulos sobre el verde de marca (`text-onbrand/70|75`) y medallas con
    fondo de marca (`bg-fono/15|10`) con el verde de texto del scope.
  - Encabezados de tabla (`thead`) y números en verde (`v2-numero.text-fono`,
    `strong.text-fono`, `font-bold/semibold.text-fono`).
  - Degradado de los heroes (`from-fono-dark via-fono to-fono`) con caída
    suave que sostiene el contraste.
  - Chips `ok`/`bad` al 10% (además de warn/fono) y el tinte oscuro
    `bg-fore/5` al 3%.
  - El **alias `v2-piloto`** recibe las mismas reglas que `tema-v2` (pantallas
    que son v2 por diseño, como el tablero `/ops`); `v2-paso-activo` queda como
    alias histórico de `oc-paso-activo`.
- Docs: `docs/SHELL.md` §7 actualizado (migración cerrada) y nuevo **§8 —
  Retirar el bloque local de la app**; `V2.md` paso 3 al día.
- Tests: `test/shell-v2.test.js` fija las reglas nuevas y su publicación en
  `dist` (205 en total en verde).

## v0.25.0 — 2026-09-25

- **Renovación del tema: profundidad en claro y retoques del oscuro (#241).**
  El claro quedaba plano; ahora las superficies van en capas y la elevación es
  real, sin renombrar ningún token:
  - Claro: lienzo **#F1F4F8** (más profundo), tarjetas blancas, paneles
    #F8FAFD, hovers #EDF1F6 y bordes **#D5DCE6** con más presencia; nuevo tinte
    de marca **`--c-fono-soft` #ECFDF5**.
  - Oscuro: capas **#181D27 / #1F2430 / #242A38**, bordes levantados
    **#3E475A**, hovers #2D3444 y el mismo tinte de marca en #062E22.
  - **Sombras por tema:** `--oc-shadow-card` y `--oc-shadow-float` (el preset
    las expone como **`shadow-card`** y **`shadow-float`**); el tema consola
    también las define. `Card` pasa a borde neutro + `shadow-card` y los
    modales/cajones/popovers usan `shadow-float` (antes sombras fijas de
    Tailwind).
  - Los estados AA no cambian; la guarda `test/contraste-tokens.test.js` sigue
    en verde con la paleta nueva.
- Docs (V2.md con la tabla y la sección de profundidad, REGLAS §8) y tests
  actualizados (205 en total).

## v0.24.0 — 2026-09-25

- **Buscador dependiente de dispositivos (#241/#250):** `BuscadorDispositivo`
  elige el **modelo** (búsqueda por nombre o **código**, tolerante a acentos) y
  despliega sus dependientes —capacidad, color, conectividad, marca o
  categoría— según el **tipo de tienda** (`mobile`, `accesorios`, `servicio`) o
  un perfil propio. El catálogo admite entradas con código y listas propias por
  modelo; cambiar de modelo limpia las variantes que ya no aplican y
  `permitirLibre` deja cargar un modelo nuevo.
  - Helpers: `PERFILES_DISPOSITIVO`, `CAMPOS_DISPOSITIVO`, `buscarDispositivo`,
    `opcionesDependiente`, `limpiarDependientes`, `etiquetaDispositivo`,
    `normalizarBusqueda` (compartido con el catálogo de productos).
  - Guía de adopción: **`docs/DISPOSITIVOS.md`** (quick start, perfiles,
    catálogo propio, helpers y recetas para asistencia, stock y compras).
- Docs (REGLAS §1, README) y tests: `test/dispositivos.test.jsx` (9 casos).

## v0.23.0 — 2026-09-24

- **Taller/rack y servicio/garantías (#241, paso 4 y lote E):**
  - `ColumnaLote`: columna de un tablero por estaciones/lotes con el chip del
    estado, el conteo, las acciones masivas y las tarjetas abajo (o el vacío
    explícito); el rack del taller y los tableros dejan de repetir el encabezado.
  - `Vencimiento` (+`estadoVencimiento`): «venció», «en 3 d» o la fecha con
    tono según la urgencia y vacío explícito; para garantías, cuotas y
    cobranzas (texto o chip).
  - `Stepper` en `tarjetas` acepta **`detalle`** por paso (los conteos del
    pipeline del taller: «2 equipos» debajo del nombre).
- Docs (REGLAS §4 bis/§4, README) y tests (195 en total).

## v0.22.0 — 2026-09-24

- **Apoyo a los lotes F4 A/C/E/F/G (#241):**
  - `TileRol` (lote F): tarjeta de rol/acceso con descripción, «x/y» en número
    grande y los dominios como chips según el acceso.
  - `PasosEquipo` (lote E): indicador compacto del flujo de un equipo (puntos +
    paso actual) para listas, racks y servicios; el `Stepper` completo sigue
    para los flujos con acciones.
  - `Stat` en modo consola (lote A): `deltaComo="chip"` (tendencia con tinte AA)
    y `barra` (barrita cuando no hay delta); el valor usa `.v2-numero`.
  - `FichaCertificado` (lote G): cierra el contrato acordado en #240 y suma
    **`puntaje`**, **`condicion`**, **`repuestosNoOem`** y
    **`repuestosNoOemNota`** para el informe público.
- Docs (REGLAS §2/§3/§4 bis, README) y tests (194 en total).

## v0.21.0 — 2026-09-24

- **Tokens v2 promovidos a globales (#241, rollout aprobado, paso 1):** el
  lenguaje "device ops" pasa de scope (`.tema-v2`/`.v2-piloto`) a la **paleta
  base** de la biblioteca: claro `#F6F8FB`/`#FFFFFF` con tonos de **texto AA**
  (`ok` #166534, `bad` #B91C1C, `warn` #92400E, `info` #2059BE) y oscuro
  `#0E1116`/`#1F2430` con sus tonos AA (`ok` #4ADE80, `bad` #FCA5A5, `warn`
  #FCD34D, `info` #9FB8FF); el verde pass `#22C55E` y el azul acción `#4D7CFE`
  siguen en cualquier tema.
  - **Impacto:** una app que importe `styles.css`/`tokens.css` **sin su propia
    paleta** pasa a ver la del v2 (es el objetivo del rollout). Las apps con
    paleta propia no cambian: siguen pisando las variables. Los vivos de
    PhoneCheck quedan para rellenos e indicadores (`--c-pass`, `--c-accion`).
  - **Alias temporal:** `.tema-v2`/`.v2-piloto` siguen existiendo (sin
    overrides de color) porque ahí viven las reglas del shell y de contenido de
    `base.css`; se retiran cuando las apps terminen la migración.
- Docs (V2, MIGRACION-V2, SHELL, REGLAS, README) alineadas; la guarda
  `test/contraste-tokens.test.js` ahora mide **la paleta global** (claro y
  oscuro) y `test/tokens.test.js` fija que el alias no tenga overrides.

## v0.20.0 — 2026-09-24

- **Recepción e incidencias (#250 F5):**
  - `FilaRevision`: fila de una recepción/control con lo esperado, el serial
    (últimos 4 visibles) o «IMEI pendiente», el chip del estado y las acciones
    de la pantalla; las incidencias usan la superficie suave del tono.
  - `SelectorIncidencia`: elegir el tipo en la fila (y quitarlo volviendo a
    tocarlo); los tipos entran por prop.
  - `DestinoRecepcion`: recibir todo en el depósito predeterminado en un clic o
    elegir otro de la lista, con el aviso de unidades sin IMEI.
  - `utils/revision.js`: **un solo mapa** de estados de revisión
    (`ESTADOS_REVISION`, `INCIDENCIAS`, etiquetas singular/plural y tonos) que
    usan la fila, el selector y `ResumenIncidencias`.
- Docs (REGLAS §4, README) y tests (192 en total).

## v0.19.0 — 2026-09-24

- **Envíos entrantes y recepción (#250 F4/F5, lote del 24-09):**
  - `ContadorLote`: avance «3 de 12» con tono según el lote (en curso/completo),
    `mostrarFaltan` y variantes `texto`/`chip`/`barra` (progressbar accesible).
  - `ResumenDestinos`: la compra consolidada conserva sus destinos
    («1 pedido A · 3 stock»), con callback opcional al elegir.
  - `ResumenIncidencias`: faltantes/sobrantes/dañadas/incorrectas/sin IMEI con
    los conteos reales; sin incidencias lo dice en verde.
- **Rollout v2 (shell):** `IndicadorConexion` suma **`variante="banner"`** (la
  franja ancha de sin conexión, con la superficie roja y texto legible por
  tema) y un `mensaje` propio; el chip de la cola queda igual. Con esto
  `SHELL.md` §7 solo deja app-side el alternador de tema.
- Docs (REGLAS §3/§4, SHELL §7, README) y tests (189 en total).

## v0.18.0 — 2026-09-24

- **Tanda de abastecimiento y entrega (#250/#241, lote del 24-09):**
  - `CampoSeriales` (pegar o escanear seriales/IMEI por lote): normaliza al
    vuelo y entrega **solo los válidos únicos** por `onCambio`, con conteos de
    repetidos e inválidos; `utils/serial.js` suma **`imeiValido`** (15 dígitos +
    Luhn), **`separarSeriales`** y **`normalizarSeriales`** (y `normalizarSerial`
    se movió ahí, re-exportado por `SerialField`).
  - `MedidorStock`: stock contra el punto de reposición con tonos
    agotado/reponer/en stock y variantes `texto`/`chip`/`barra`; sin dato dice
    «Sin dato» (nunca 0).
  - `Stepper` suma **`variante="tarjetas"`** (grilla 2/4 con el paso actual en
    azul y los cumplidos en verde) para el flujo de entrega de pedidos, y
    acepta etiquetas sueltas y `ariaLabel`.
- Docs: `REGLAS.md` §1/§4/§8 bis; tests de serial/Luhn y de los tres objetos
  (188 en total).

## v0.17.0 — 2026-09-24

- **Pila de personas y migas (lote del 24-09, #211/#241):** `PilaPersonas`
  apila avatares con el punto de presencia y el contador «+N» (props
  `personas`, `max`, `size`, `onMas`, `resumen`), con el helper
  `resumenPresencia` («Ana en línea», «3 en línea»); `PageHeader` suma
  **`migas`** (`[{ etiqueta, href? }]` con `aria-current="page"`) para la miga
  de sección del shell. Con eso el pendiente de presencia de `docs/SHELL.md`
  queda cerrado; solo siguen app-side el alternador de tema y el banner ancho
  de sin conexión.
- Tests: pila (presencia, resumen, +N, onMas) y miga (183 en total).

## v0.16.0 — 2026-09-23

- **Identidad de usuario unificada (#211):** `PersonaChip` es el único objeto
  para mostrar a una persona: envuelve a `Avatar` y resuelve la foto en un solo
  orden —**foto local** (`foto`, la resuelve la app por id) → **foto de Google**
  (`picture`) → **iniciales**—, con caída a la siguiente fuente si una imagen
  falla. Props: `user`, `foto`, `picture`, `size` (`xs`…`xl`), `nombre`,
  **`nombreCorto`**, **`estado`** (presencia), `title` y `children`. Incluye el
  adaptador **`identidadDeUsuario`** y **`ESTADOS_PRESENCIA`**. El `Avatar`
  suma `onError` (para encadenar fuentes) y los tamaños `xs`/`xl`.
- **Más objetos del lote:** `BarraLote` (acciones por lote con «Limpiar»),
  `PeriodoTabs` (Día/Semana/Mes/Año sobre `SegmentedField`) y `NumericKeypad`
  (teclado de cobro en pantalla; el set de íconos suma `backspace`).
- **Adopción en MobOS (#211):** `PresencePill`, `PantallaBloqueada` y la
  cronología/transacciones de `PedidoDetalle` pasan al objeto de identidad
  (de paso desaparece un avatar duplicado por evento de la cronología).
- Tests: cadena de foto, `hasAvatar`, nombre corto, presencia, adaptador y los
  tres objetos nuevos (177 en total).

## v0.15.1 — 2026-09-23

- **Alto táctil de 44 px (#249, H3 de la auditoría responsive mobile, con
  DSN):** `SegmentedField` y `Subtabs` pasan a `min-h-11` (44 px),
  `ListGridToggle` e `IconAction size="touch"` suman la utilidad **`.toque-44`**
  (pseudo-elemento centrado de 44×44 que captura el toque sin cambiar el dibujo
  ni el layout) y la barra inferior garantiza 44 px por ítem. El patrón queda
  documentado en `REGLAS.md` §2 y `SHELL.md` §4 para que POS/INV/CRM/FIN lo
  apliquen en sus dominios.
- **`FichaCertificado` (#240):** suma `estado` (chip de la cabecera; por defecto
  `pass`) para el certificado embebible del informe público: la app puede
  mostrar el estado real del equipo sin copiar la tarjeta.
- Tests: guarda del alto táctil (`test/tactil.test.js`) más los renders del
  segmentado, las solapas y la ficha (169 en total).

## v0.15.0 — 2026-09-23

- **Objetos que faltaban (cierre de los pendientes de la fase 2):**
  - `ProductCombobox` — buscar/elegir y **crear producto desde el campo**:
    sugerencias en flujo (no superpuestas) con `role="combobox"`/`listbox`,
    teclado ↑↓/Enter/Esc y «Agregar … como producto nuevo»; la pantalla filtra
    en memoria o consulta al servidor (`onQueryChange`).
  - `RucField` (+`utils/ruc.js`: `extraerRuc`/`esRuc`) — input con el botón
    **Extraer** adentro; la consulta entra por `consultar` (async) y el
    resultado se aplica solo al confirmar («Usar estos datos»). Sin `consultar`
    el botón no se muestra: la librería no llama APIs.
  - `SerialTexto` — el serial completo si entra y, si la columna queda corta,
    los **últimos 4** siempre visibles; vacío explícito.
  - `EstadoBadge` — estado con badge desde un mapa `{ label, color }`; un valor
    fuera del mapa se muestra crudo y el vacío es explícito (nunca un badge en
    blanco).
  - `SeccionColapsable` — detalle plegable con `aria-expanded`/`aria-controls`;
    con `clave` recuerda el estado en la sesión y el contenido queda en el DOM
    con `hidden`.
- **Tipos y docs:** `types/index.d.ts` declara los cinco objetos y el RUC;
  `docs/REGLAS.md` §1/§3/§4 documenta props y reglas; el README actualiza la
  lista y los pendientes (queda `ComprobantePreview`, explicado como
  composición de impresión de cada app).
- Tests: render de los cinco objetos + extracción/validación de RUC (165 en
  total).

## v0.14.11 — 2026-09-23

- **Dos modos de deploy (`docs/COMANDOS.md`):** **`hd`** es el modo **rápido**
  de rutina (merge de las ramas + specs afectados en verde + push + release,
  sin suite completa ni smoke) y **`hdd`** el **completo** (lo de `hd` + suite
  completa + CI verde + smoke de producción + cierre de issues); **`ht`** queda
  como alias histórico del completo. La tabla de comandos, los pasos de cada
  modo y las reglas quedan explícitos.
- **Política automática:** el disparo por ≥15 commits usa `hd` (rápido);
  `hdd` no se dispara solo, lo pide el dueño/orquestador para la ronda con
  smoke y cierres.
- **`tools/auto-ht.sh`:** comentarios, `--help` y el ejemplo alineados con los
  dos modos (el disparo automático sugiere `hd`; el ejemplo usa
  `herdr agent prompt`).
- **Glosario para el dueño (`docs/COMANDOS.md`):** suite, specs afectados,
  unitarias, integración, E2E, smoke, CI (verde/rojo), gate, release, ronda,
  `NOVEDADES.md` y los modos `hd`/`hdd`, explicados en simple (sin jerga) para
  leer handovers y tablero. `MODOS-DE-TRABAJO.md` y la plantilla de agentes lo
  referencian.

## v0.14.10 — 2026-09-23

- **Cierre de los huecos del shell v2 (#241):** los chips de contenido de tono
  `bg-fono/15` pasan al azul de acción (`--c-info / .1`, borde `/ .3`) y los
  `bg-warn/15` al ámbar suave, ambos bajo `.v2-chip`; se suma la utilidad
  **`.oc-paso-activo`** (burbuja sólida del azul de acción con texto blanco en
  claro y `--c-onbrand` en oscuro) que `Stepper` ya emite en el paso actual.
  Con esto el port de navegación + contenido queda verificado 1:1 contra el
  shell de MobOS (revisión cruzada CMP ↔ DSN) y la app puede vaciar su bloque
  local `.v2-piloto`.
- Guardas: `test/shell-v2.test.js` cubre los chips y el paso activo; el stepper
  del smoke de render exige `oc-paso-activo` (162 tests).
- Docs: `docs/SHELL.md` con las reglas publicadas y los pendientes actualizados.

## v0.14.9 — 2026-09-23

- **Shell v2 en la biblioteca (#241):** las reglas de navegación que DSN midió
  sobre el shell real viajan con `styles.css` dentro del scope `tema-v2` —
  rótulos de grupo sólidos (`nav button[aria-expanded] > span` y
  `.oc-rotulo-grupo`), ítem activo con el azul de acción AA sobre su tinte
  (`nav [aria-current="page"]` / `nav [aria-pressed="true"]`, `/14` en claro y
  `/20` en oscuro), activos de segmentados y pestañas, chip `.v2-chip`, números
  del scope (`tabular-nums`) y foco visible por tema. Una app puede retirar su
  bloque local `.v2-piloto` sin perder AA.
- **`CampanaAvisos`:** el contador usa `text-white dark:text-onbrand` (en oscuro
  el rojo es claro y el blanco no llegaba a AA).
- **`NavLateral` con grupos:** `grupos` = `[{ titulo, items }]` con rótulo
  plegable (`aria-expanded`), estado controlado (`gruposPlegados` +
  `onToggleGrupo`) o recordado por el objeto; la lista plana sigue igual y los
  tipos reflejan las props reales.
- Guardas nuevas: `test/shell-v2.test.js` (reglas publicadas) y ampliación de
  `test/navegacion.test.jsx`/`test/tablero.test.jsx`; 161 tests en total.
- Docs: `docs/SHELL.md` con las reglas publicadas y los pendientes declarados.

## v0.14.8 — 2026-09-23

- **Tonos de texto AA en el scope v2 (#241):** los roles semánticos de
  `.tema-v2`/`.v2-piloto` pasan a los tonos de **texto** medidos sobre el shell
  v2 —claro `ok` #166534, `bad` #B91C1C, `warn` #92400E, `info` #2059BE; oscuro
  `ok` #4ADE80, `bad` #FCA5A5, `warn` #FCD34D, `info` #9FB8FF—, y el bloque
  queda completo en claro y oscuro (fono, reserved, onbrand e ink-950 dejan de
  heredarse sueltos). Los vivos de PhoneCheck siguen en `--c-pass`/`--c-accion`
  para rellenos e indicadores. Medición de referencia (antes → después): rótulos
  de grupo 3.20 → 4.97; ítem activo 2.91 → 4.80 en claro y 3.49 → 5.93 en
  oscuro. Guarda nueva `test/contraste-tokens.test.js` (AA 4.5:1 sobre las
  superficies del scope en ambos temas).
- **Guía del shell v2 (`docs/SHELL.md`, nueva):** piezas del shell (barra
  lateral, menú, cajón, paleta, ayuda, barra inferior, avisos e identidad),
  props, anatomía por breakpoint, reglas de contraste AA y checklist de
  adopción. Referenciada desde `README`, `docs/V2.md` y `docs/REGLAS.md`.
- **`IconAction size="touch"`:** paridad con MobOS (#236), donde la lista de
  Clientes lo estrenó; el default `sm` no cambia. Tipos actualizados.

## Sin publicar — v0.14.0 propuesta (2026-09-22)

Cierre de los huecos que dejó el piloto de adopción en LedBox/EventOS (issue
#3). Todos los agregados son opcionales: nada de lo que consumía `v0.13.1`
cambia de firma ni de valor por defecto. **Versión sugerida: v0.14.0** (la rama
`lib`, con la cosecha de PagaYa/ScaleOS, también apunta a esa versión: el
integrador decide el número final).

- **Tailwind — `owncodingContent`:** Tailwind 3.4 ignora el `content` que
  declara un preset, así que la librería exporta `owncodingContent` (globs de
  `owncoding-ui/dist/**/*.js` y `src/**/*.jsx`) desde `tailwind-preset.js` y el
  README explica cómo sumarlo (`content: [...owncodingContent, …]`). El preset
  mantiene su clave `content` y avisa del bug; sin sumarlo, los componentes se
  purgaban en silencio (íconos gigantes).
- **Tipos publicados:** `types/index.d.ts` (declarado a mano, aditivo) con los
  objetos principales, los campos, los estados, las tablas y los formatos;
  `package.json` expone `types` y la condición `types` del `exports`, y el build
  lo copia a `dist/index.d.ts`. `tailwind-preset` también tiene tipos. Una app
  TypeScript `strict` ya no necesita un shim propio.
- **Hojas CSS separadas:** `tokens.css` (solo variables, no toca el documento)
  y `base.css` (base global opt-in: `html`/`body`, tipografías, foco, tabulares,
  animaciones y `@media print` de `DocumentoImpresion`). `styles.css` sigue
  siendo tokens + base concatenadas, autocontenido, compatible con v0.13.1.
  `exports` publica las tres.
- **Fechas con zona:** `fechaHora`, `fechaDia`, `fechaHoraCorta` y `fechaCorta`
  aceptan `{ timeZone }` (o un objeto de opciones como segundo argumento); sin
  zona se mantiene el huso del navegador. Una fecha pura `YYYY-MM-DD` se dibuja
  como día de calendario (no se corre de zona).
- **`formatGs` con símbolo configurable:** `formatGs(valor, { simbolo })` (o
  una cadena suelta), propagado a `montoTexto`, `montoGs`, `montoConSigno`,
  `formatMoney`, `Money`, `CeldaMoneda`, `MoneyInput` (`symbol`),
  `PlanPagos`, `DocumentoImpresion` e `ImporteDelta`. El default sigue siendo
  `Gs 1.234.567`; `SIMBOLOS_MONEDA` es la fuente única del prefijo.
- **`ChipEstado` genérico:** suma los estados de negocio (borrador, enviado,
  aprobado, rechazado, vencido, cobrado/pagado, por cobrar, activo, pausado,
  anulado, cancelado y en revisión) con tonos coherentes, lectura tolerante
  (mayúsculas, acentos, espacios y género) y `title`/`data-estado` accesibles.
  Los estados de dispositivo no cambian.
- **Íconos (23 nuevos, 78 en total):** `overview`, `events`, `clients`, `leads`,
  `budgets`, `finance`, `inventory`, `suppliers`, `promoters`, `building`,
  `plan`, `audit`, `arrowRight`, `arrowLeft`, `sun`, `moon`, `power`, `mail`,
  `bank`, `checkin`, `globe`, `database` e `instagram`, con el trazo de la
  librería (1.75) y el mapa `AdminIcon` → librería en el README. `ICONOS` expone
  la lista; ningún glifo existente se renombró ni cambió.
- **`Stat` con `tono` y `nota`:** el valor se colorea con el tono semántico y el
  KPI suma el dato al pie (lo que cubría `AdminKpi`), sin cambiar la firma
  anterior.
- **Fix — `.pin-oculto`:** la clase que `PinInput` usa para no mostrar los
  dígitos reales sobre los puntos no existía en la librería; ahora vive en
  `base.css`.
- 18 tests nuevos (149 en total), con verificación de consumo real del paquete
  construido (tipos, `owncodingContent`, hojas CSS, `timeZone`, símbolo y
  `ChipEstado`). `dist/` regenerado (incluye `dist/index.d.ts`).

## v0.14.7 — 2026-09-22

- **`docs/ADOPCION.md` (nuevo):** la guía práctica para sumar la biblioteca a
  una app — requisitos y versión fija, instalación (git/SSH/packages, `prepare`
  y `dist` commiteado), preset + CSS por partes (`styles.css` o `tokens.css` +
  `base.css`), peers opcionales (`qrcode`), estrategia incremental (piloto y un
  objeto por commit), tabla de errores comunes (purga de Tailwind, orden del
  CSS, tipos, CI) y verificación/rollback con checklist por app. Referenciada
  desde el README.

## v0.14.6 — 2026-09-22

- **`docs/MIGRACION-V2.md` (nuevo):** la guía para que las otras apps
  (ScaleOS, LedBox, PagaYa) migren una pantalla al sistema v2 — inventario y
  capturas previas, instalación y preset, tabla de mapeo de la paleta propia a
  los tokens, tabla de reemplazos por tipo de pantalla, verificación
  (densidad/acciones, 360/768/1440, claro-oscuro, capturas, checks), las fases
  F1–F4 y qué no hacer. Referenciada desde el README y `docs/V2.md`.

## v0.14.5 — 2026-09-22

- **`VistaPreviaPapel` + `ANCHOS_PAPEL` (preview v2, #241):** la vista previa
  del documento impreso con el ancho real del papel (mm a 96 dpi): `thermal-80`
  (302 px), `thermal-58` (219 px), `thermal-55` (208 px) y `a4` (794 px), con
  centro automático y alto configurable. Cierra el combo del informe junto a
  `FichaCertificado`, `CodigoQr` y `qrDataUrl`.
- **Resumen de lo nuevo de la línea v0.14** (todo incluido en esta versión):
  `tools/auto-ht.sh` y la política automática de integración (v0.14.3/2),
  `GradoBadge` y `MedidorBateria` —con `mostrarEtiqueta` en el chip— (v0.10.0 /
  v0.14.4), `CodigoQr` + `qrDataUrl` (v0.12.0), `FichaCertificado` (v0.12.0) y
  `VistaPreviaPapel` (v0.14.5). Props en `docs/REGLAS.md` §8 bis; adopción en
  `docs/V2.md`.

## v0.14.4 — 2026-09-22

- **`MedidorBateria` con `mostrarEtiqueta`:** el chip puede mostrar la palabra
  además del porcentaje («87% batería»), para las tiles del modo taller/rack
  donde el `%` solo quedaría ambiguo. Portado del lote 15 de MobOS, que adopta
  `GradoBadge` y `MedidorBateria` en el rack.
- Props en `docs/REGLAS.md` §8 bis.

## v0.14.3 — 2026-09-22

- **`tools/auto-ht.sh` (script genérico):** implementa la política automática
  para que cada app lo copie: cuenta los commits sin integrar contra
  `origin/main`, arma la tabla del `pd` (commit → qué cambia con su tipo),
  respeta el umbral (15), el cooldown (20 min) y el merge en curso, y dispara
  el ciclo con `--comando`. Parametrizable por repo del integrador, lista de
  ramas, agente, umbral, cooldown y archivo de estado; `--dry-run` para
  ensayar. Documentado en `docs/COMANDOS.md`.

## v0.14.2 — 2026-09-22

- **Documentación (sin cambios de código):** `docs/COMANDOS.md` suma la
  **política automática de integración** — con **≥ 15 commits nuevos sin
  integrar** y el integrador libre, el orquestador dispara un **`hd`
  automático** (merge → suite → push → NOVEDADES → release + smoke), con
  **cooldown de 20 minutos**, un solo ciclo a la vez y el `ht`/`hd` manual
  siempre disponible para adelantarlo.

## v0.14.1 — 2026-09-22

- **Documentación (sin cambios de código):** `docs/COMANDOS.md` con los
  comandos del orquestador (`pp` pendientes, `pd` pendiente de deploy con la
  tabla commit → qué cambia y su tipo, `al` agentes libres, `ht` ciclo
  completo y `hd` alias) y las reglas: nada se mergea/pushea/despliega sin `ht`
  o ronda ordenada, los conflictos se resuelven en el worktree del slot que
  rebasea, y el orquestador no toca código. Referenciado desde
  `docs/MODOS-DE-TRABAJO.md`.

## v0.14.0 — 2026-09-22

- **Adopción sin fricción (pedido del piloto de LedBox):** `owncodingContent`
  exportado del preset, **tipos** (`.d.ts`) publicados, `styles.css` partido en
  **`tokens.css` + `base.css`**, fechas con **`timeZone`**, **`formatGs`** con
  símbolo configurable (default `Gs 1.234.567`), **`ChipEstado`** con estados de
  negocio, **23 íconos nuevos** (78 en total) y **`Stat`** con `tono` y `nota`.
  Todo compatible con v0.13.1.
## v0.13.1 — 2026-09-22

- **Release completa:** suma al lote LedBox ya etiquetado el **lote 2** (agenda,
  filtros, shell y tablero: `Calendario`, `RangoFecha`, `PaletaComandos`,
  `AyudaModulo`, `BarraInferior`, `Avatar`, `ImporteDelta`, `IndicadorConexion`,
  `CampanaAvisos`, `GraficoBarras`) y el resto de los helpers.
- **Formato de guaraníes sin punto:** `Money` y `CeldaMoneda` muestran
  `Gs 1.234.567` (el símbolo de `PYG` pierde el punto) para coincidir con el
  formato que usan las apps en pantalla y en los imprimibles. Los
  formateadores puros (`formatGs`, `montoTexto`, `formatMoney`, `montoGs`) ya lo
  hacían.
- Nota: `v0.13.0` quedó como pre-release parcial (sin el lote 2 ni el formato);
  las apps deben fijar **v0.13.1**.

## v0.13.0 — 2026-09-22

- **Agenda:** `Calendario` — grilla mensual (semana opcional) con encabezado de
  navegación, conteo por día, detalle del día elegido y lista por día en mobile
  (sin scroll horizontal). Ítems `{ fecha, titulo, hora?, detalle?, tono?,
  href? }` con `renderItem` a medida y rango visible por
  `onCambiarPeriodo(ancla, rango)`; el consumidor decide qué datos pide. Los
  días son claves puras `YYYY-MM-DD` (`utils/calendario.js`: `rangoMes`,
  `rangoSemana`, `sumarDias`, `sumarMeses`, `etiquetaMes`/`etiquetaDia` es-PY).
- **Filtro de fechas:** `RangoFecha` — atajos Hoy · Esta semana · Este mes · Mes
  pasado · Últimos 30 días · Personalizado + campos desde/hasta, controlado o
  suelto, con `onCambio(desde, hasta)` y aviso de rango invertido
  (`utils/rangoFecha.js`: `rangoDePeriodo`, `periodoDeRango`).
- **Búsqueda global:** `PaletaComandos` — ⌘/Ctrl+K (atajo configurable), foco
  automático, resultados agrupados por tipo, ↑↓/Enter/Escape, debounce con
  cancelación, «seguí escribiendo» con mínimo configurable, sin resultados y
  error con reintento. La búsqueda la provee el consumidor (`buscar` async) y
  el elegido se devuelve por `onElegir`; helpers `agruparResultados` y
  `estadoPaleta`.
- **Shell:** `AyudaModulo` («¿Qué es esto?»: resumen + 3–5 puntos + 2–3 enlaces
  internos en el diálogo de la librería) y `BarraInferior` (hasta 4 ítems +
  «Más»; activo con `aria-current`, `ESPACIO_BARRA_INFERIOR` para que no tape el
  contenido).
- **Identidad:** `Avatar` — iniciales con color estable derivado del nombre
  (`inicialesDeNombre`, `colorDeNombre`), imagen opcional con caída a iniciales,
  tamaños sm/md/lg, forma redonda o cuadrada (empresas) y `role="img"` con
  `aria-label`. Queda pendiente la cadena de identidad de #211.
- **Tablero:** `ImporteDelta` (monto con signo y color, tabular, `invertir`),
  `IndicadorConexion` (en línea/sin conexión + pendientes de subir),
  `CampanaAvisos` (contador de no leídos hasta 99+ y panel props-driven) y
  `GraficoBarras` (barras CSS sin dependencias, vertical/horizontal, lista
  accesible). `utils/moneda.js` suma `formatoNumero`, `signoDe` y
  `montoConSigno`.
- 45 tests nuevos (101 en total); props y reglas en `docs/REGLAS.md` §10. Sin
  bump de versión: lo decide el dueño junto con el resto del lote.
## Sin publicar — v0.13.0 propuesta (2026-09-22)

Lote de objetos genéricos portado de LedBox (los seis que su panel resolvía a
mano). Props y reglas en `docs/REGLAS.md` §8 ter; ejemplos de uso por objeto en
el README. Sin cambios incompatibles.

- **`TableroKanban` + `useTableroOptimista`:** pipeline por columnas de estado
  con contador, tarjetas con chips/monto/fecha/detalle, arrastre HTML5 y
  «Mover a…» accesible por teclado; movimiento optimista con revert si
  `onMover` falla. Helpers puros `columnasDelTablero`, `agruparTarjetas` y
  `destinosDeTarjeta`. Referencia: `AdminBoard` de LedBox.
- **`Cronologia`:** lista de hitos con ícono/tono por tipo, título, detalle,
  actor y fecha es-PY 24 h, agrupable por día; `ICONOS_HITO`, `TONOS_HITO`,
  `ETIQUETAS_HITO` por defecto y pisables por props, con vacío. Referencia:
  `AdminTimeline` + `lib/server/timeline.ts` de LedBox.
- **`PlanPagos`:** anticipo + cuotas con etiqueta, monto (Int PYG), vencimiento
  y estado (`ESTADOS_CUOTA` dibujados con `ChipEstado`), «a transferir ahora»
  destacado, total y saldo sin cuota. Referencia: el plan del portal de LedBox
  (`PortalBudgetView` + `paymentPlan`).
- **`DocumentoImpresion`:** hoja A4 con emisor/receptor, meta (número, fechas,
  estado), detalle, liquidación (subtotal, descuento, IVA por tasa, total),
  notas, pie y botón de imprimir opcional; las reglas `@media print` viven en
  `styles.css` (`.oc-print`, `oc-print-oculto`). Referencia: las hojas `lbprint`
  de LedBox.
- **`SubidaImagen`:** campo de imagen con arrastrar y soltar, vista previa,
  validación por firma real (JPG/PNG/WebP) y tamaño, error, limpiar y
  compresión opcional en canvas sin librerías (`mimeDeImagen`,
  `validarImagen`, `prepararImagen`). Referencia: `AdminImageUpload` +
  `lib/identity-image.ts` de LedBox.
- **`ProgresoChecklist`:** barra accesible + «x de y» + porcentaje, con tonos
  por umbral (completo `ok`, vencidas `warn`, riesgo `bad`) y la lógica pura
  `progresoChecklist`. Referencia: `checklistProgress` de LedBox.
- **Tonos unificados:** `utils/tonos.js` es el único mapa de clases por tono
  (`ok`/`warn`/`bad`/`mute`/`info`/`pass`/`fono`), con alias de otras apps
  (`neutral`, `accent`, `danger`…) y helpers `puntoDeTono`, `chipDeTono` y
  `textoDeTono`. `TONOS` se sigue exportando igual. `ChipEstado` suma la prop
  `tono` para los estados propios de cada módulo.
- **Fix — `qrcode` ya no rompe el import:** la peer opcional pasa de import
  estático a import dinámico dentro de `qrDataUrl`; importar el paquete sin
  `qrcode` instalado funciona y el QR inexistente devuelve `''`. Test nuevo
  con la peer mockeada como ausente.
- **Fix — fechas puras (`YYYY-MM-DD`):** `fechaValida` las interpreta como día
  local (como los `dueAt` del API) y no como medianoche UTC, que en Asunción
  mostraba el día anterior; un día inexistente (31/9) sigue siendo inválido.
- 30 tests nuevos (86 en total) y `dist/` regenerado.
## v0.12.0 — 2026-09-22

- **Informe público (#240):** `FichaCertificado` — tarjeta del informe de
  dispositivo (empresa, modelo, IMEI enmascarado, grado, batería, "x de y pass",
  chips de locks, quién/cuándo verificó y QR) que compone los objetos del
  checklist. `CodigoQr` + `qrDataUrl` unifican la generación del QR (nivel M,
  margen 1, ancho 220 por defecto) que antes se repetía en cada pantalla con
  opciones distintas; `qrcode` queda como peer dependency **opcional**.
  En MobOS se migraron 16 llamadas en 7 pantallas.

## v0.11.0 — 2026-09-22

- **Tokens v2 del piloto (promovidos desde `slot/diseno`, #241):** scope
  `.tema-v2` con alias `.v2-piloto` — variante **clara** (fondo #F6F8FB,
  superficie #FFFFFF, borde #D6DCE6, texto #0E1116, ok #16A34A, bad #DC2626,
  warn #D97706) y **oscura** (`html.dark`: fondo #0E1116, panel #1F2430, borde
  #373F51, texto #F4F6FA, ok #22C55E, bad #EF4444, warn #F59E0B), con el azul
  acción #4D7CFE como `info`. Se aplica por clase al contenedor de la pantalla
  y suma `.v2-numero` (tabular, tracking ajustado) para los números grandes del
  checklist y los tableros.
- Así las pantallas del piloto pueden borrar su bloque local de `index.css` y
  consumir los tokens desde la biblioteca; el resto de la app no cambia.

## v0.10.0 — 2026-09-22

- **Sistema v2 "device ops" (épicas #240/#241):** tokens del tema consola
  (`.consola` con fondo #0E1116, panel #1F2430, borde #2D2D30, texto #F1F3F5) y
  verde **pass** (`--c-pass` #22C55E + variantes) y azul **acción**
  (`--c-accion` #4D7CFE), disponibles también fuera del tema consola.
- **Objetos:** `ChipEstado` (certificado/en revisión/pendiente/con fallas),
  `ChipsLocks` (iCloud/MDM/ESN/carrier/OEM), `SemaforoItem`,
  `FilaChecklist` + `ConteoChecklist` ("x de y pass"), `MedidorBateria`
  (barra/chip, umbrales 90/80), `GradoBadge` (A/B/C), `TileEquipo` y `Stepper`;
  estados y tonos en `utils/estadoEquipo.js`. Props en `docs/REGLAS.md` §8 bis.
- **Categorías con icono (#242):** `IconoCategoria` con los glifos mobile,
  laptop, tablet, watch, buds y cable; `CATEGORIAS_PRODUCTO`, `ICONO_CATEGORIA`
  y normalización de texto libre (`normalizarCategoria`) en
  `utils/categorias.js` ("Funda iPhone" → accesorios, "CELULAR" → iPhone).

## v0.9.0 — 2026-09-22

- **`Nota`:** superficie informativa para aclaraciones que no son resultado (no
  anuncia con `role`), con `tono` warn/info/neutro, `compact` y `como`. Portada
  del lote 10 de MobOS, donde reemplaza 8 notas copiadas en 4 pantallas.
- **`BarraProgreso` con `pista`/`relleno` y tono `onbrand`:** las barras de
  gráfico (ranking, series, fondo sobre color de marca) también pasan por el
  objeto (rol, aria y transición) sin copiar el markup. En MobOS se migraron 5
  barras a mano.
- El README de consumo fija la versión publicada (`#v0.9.0`).

## v0.8.0 — 2026-09-22

- **Ancho de modales por tipo (#237, portado de MobOS):** `Modal` expone
  `size` y el ancho vive en `utils/modal.js` — `corto` (`max-w-md`),
  `formulario` (`max-w-xl`, predeterminado), `amplio` (`max-w-3xl`) y
  `completo` (`max-w-5xl`). `ConfirmDialog` usa `corto`. En MobOS se migraron
  67 modales con `max-w-*` suelto; acá el ancho ya no se pasa en `className`.
  Regla nueva: el contenido de un modal `amplio`/`completo` va en grillas
  (`GRILLA_DOS_COLUMNAS`, filas de tabla) para no dejar franjas vacías.
- **`BotonDentroCampo` (#234):** acción trailing **dentro** del input, con
  `title`/`aria-label` (tooltip), estado ocupado «Consultando…» con spinner y
  `disabled` cuando no hay dato. Portable: la pantalla decide qué hace
  `onClick`; la librería no consulta nada.
- **`esRazonSocial` (+ fix de `normalizarNombre`):** una razón social con tipo
  societario (S.A., S.R.L., LTDA, cooperativa…) no se reordena ni se capitaliza
  como un nombre de persona, aunque venga en mayúsculas desde el proveedor
  de RUC.

## v0.7.0 — 2026-09-22

- **Piezas de formulario:** `GRILLA_DOS_COLUMNAS` (+ `_COMPACTA`),
  `PIE_ACCIONES` y `PIE_ACCIONES_REVERSO` en `utils/formulario.js`, portadas
  del barrido de MobOS (90 usos migrados allá).

## v0.6.0 — 2026-09-22

- `CELDA_IDENTIDAD` (`truncate text-[13px] font-semibold`) para la celda de
  nombre en tablas y listados.
- Consumo: el preset de Tailwind ya incluye el bundle de la librería en
  `content` (si no, las clases de los componentes se purgan); el README suma
  notas de release hasta v0.6 y un ejemplo completo de consumo.
- Sin cambios incompatibles.

## v0.5.0 — 2026-09-22

- **Ciudades de Paraguay:** catálogo `CIUDADES_PARAGUAY` (263 municipios + 18
  departamentos), `departamentoDe` y `buscarCiudad`; `CityAutocomplete` resuelve
  el departamento solo con la ciudad (al tipear coincidencia exacta, al elegir
  una sugerencia y al salir del campo), con `buscar` inyectable para usar la API
  propia.
- **Catálogos de productos:** `MODELOS_IPHONE`, `CAPACIDADES_IPHONE`,
  `COLORES_IPHONE`, `CATEGORIAS_ACCESORIOS`, `MARCAS_ACCESORIOS` y
  `buscarEnCatalogo` como predeterminados actualizables por release.
- **Tamaños de campo:** `TAMANOS_CAMPO` + `anchoParaLargo`; `MoneyInput`
  (`w-36`) y `PercentField` (`w-24`) aplican su ancho recomendado.
- **Impresión — builder y prueba:** `printing/escpos.js` (`crearTicket`,
  columnas, líneas, cortes, `bloqueFirma`) y `printing/prueba.js`
  (`paginaDePrueba` con verificador). `docs/IMPRESION.md` queda con los
  apartados por tipo y lo que falta portar.
- 8 tests nuevos (45 en total).

## v0.4.0 — 2026-09-22

- **Impresión LAN/USB funcional:** `AjustesImpresion`, `BotonImprimir` y
  `printing/estadoImpresoras.js` (destinos `lan:<ip>:<puerto>` y `cups:<cola>`,
  estados honestos, agregado por empresa). Guía: `docs/IMPRESION.md`.
- **Navegación y shell:** `NavLateral` (colapsable) y `MenuDesplegable`.
- **Ajustes (modelo):** `PanelDerecho` y `TarjetaAjuste`.
- **Bancos de Paraguay:** catálogo `BANCOS_PARAGUAY` + `BancoCombobox` +
  `BancoLogo` (archivo/marca/monograma).
- **Nombres:** `normalizarNombre` con orden SIFEN (A1 A2 N1 N2 → N1 N2 A1 A2),
  `nombrePartes` y `esApellidosPrimero`.
- **Moneda:** `largoMaximoMonto(max, { decimales })` y `MoneyInput` con
  `maxLength` derivado del tope (general 14, ventas 14, decimales 17).
- **Docs:** `docs/ALIMENTAR.md` (alimentar la biblioteca y cosechar de otras
  apps). 12 tests nuevos (37 en total).

## v0.3.0 — 2026-09-22

- **Familia de acceso (sin API):** `GoogleButton` (+`GoogleMark`,
  `OAuthDivider`), `AuthLayout` (slots de logo/copy/acciones/pie),
  `ProductFooter`, `LoadingScreen` y `PegarEnlaceToken`. Todo por props: no
  leen sesión, marca ni llaman a la API (la app pasa logo, nombre, versión y
  callbacks).
- **Campos ampliados:** `EmailField` (sugerencia de dominios, `dominios` por
  prop), `PhoneField` (+`parseTelefono`, `componerTelefono`, códigos por prop),
  `SerialField` (normalización inyectable) e `InstagramField`.
- **Lógica:** `utils/serial.js` (`ultimos4`, `partirSerial`,
  `serialEnmascarado`) y `utils/token.js` (`extractTokenFromUrl`, `esToken`).
- `styles.css` trae las animaciones de la pantalla de carga y respeta
  `prefers-reduced-motion`.
- 10 tests nuevos (25 en total).

## v0.2.2 — 2026-09-21

- README: consumo real (versión fija por tag) y notas de release v0.2.x con la
  guía de actualización del cambio de `Toggle` a `Switch`; checklist de adopción.
- CHANGELOG incluido en el paquete. Sin cambios de API.

## v0.2.1 — 2026-09-21

- `exports` expone `./package.json`; `engines.node >= 18` (robustez de consumo).
- CI en GitHub Actions: `npm ci` + build + tests + chequeo de exports.

## v0.2.0 — 2026-09-21

- **Interruptor único (#186):** se retira el alias `Toggle`; el objeto canónico
  es `Switch` (checkbox accesible, `onChange(event)`). Cambio incompatible de
  API (0.x).
- `REGLAS.md` y el README lo documentan; test que verifica que no se exportan
  alias de compatibilidad.

## v0.1.0 — 2026-09-21

- Bootstrap del paquete: componentes portables de MobOS (campos, acciones,
  contenedores, estados/avisos, datos), lógica compartida (moneda, fechas,
  teléfono/WhatsApp, clases de tabla), tokens CSS + preset de Tailwind.
- Build con esbuild (`dist/index.js` + `dist/styles.css`), `prepare`, `dist`
  commiteado; smoke de render (vitest) y tests de lógica.
- Docs: `REGLAS.md`, `MODOS-DE-TRABAJO.md`, `PLANTILLA-AGENTS.md` y README de
  consumo (git dependency / GitHub Packages).
- Pendiente: tipos `.d.ts`, identidad unificada (#211, DSN) y adopción por app
  (fase 2).
