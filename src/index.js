// OwnCoding UI — puntos de entrada del paquete.
//
// Todo lo que exporta esta librería es portable: no hace fetch, no lee stores
// ni depende del router. Las apps aportan datos y manejan el estado.

// Primitivas y objetos de interfaz
export {
  Button,
  Input,
  PasswordInput,
  PinInput,
  MoneyInput,
  Money,
  Select,
  Textarea,
  Label,
  Eyebrow,
  Card,
  Modal,
  ConfirmDialog,
  Badge,
  Dot,
  IconAction,
  Drawer,
  ToastProvider,
  useToast,
  Skeleton,
  EmptyState,
  ErrorState,
  SectionState,
  Aviso,
  Nota,
  FormActions,
  SaveActions,
  useDialogClose,
  useDialogPending,
  useDialogDirty,
  useResultado,
  conFormulario,
  PageHeader,
  DataTable,
  FormField,
  Stat,
  Subtabs,
  FilaDato,
  CeldaMoneda,
  BarraProgreso,
} from './components/ui.jsx'
export { default as useComboboxNavigation } from './hooks/useComboboxNavigation.js'

// Campos y objetos compartidos
export { default as Icon, ICONOS } from './components/Icon.jsx'
export { default as Switch } from './components/Switch.jsx'
export { default as Checkbox } from './components/Checkbox.jsx'
export { default as SearchField } from './components/SearchField.jsx'
export { default as BotonDentroCampo } from './components/BotonDentroCampo.jsx'
export { default as SegmentedField } from './components/SegmentedField.jsx'
export { default as PercentField, parsePercent, formatPercent, limpiarPercent } from './components/PercentField.jsx'
export { default as CurrencySelect } from './components/CurrencySelect.jsx'
export { default as ListGridToggle } from './components/ListGridToggle.jsx'
export { default as PeriodoTabs } from './components/PeriodoTabs.jsx'
export { default as NumericKeypad } from './components/NumericKeypad.jsx'
export { default as BarraLote } from './components/BarraLote.jsx'
export { default as EmailField, DOMINIOS_EMAIL, sugerenciasDe } from './components/EmailField.jsx'
export { default as PhoneField } from './components/PhoneField.jsx'
export { default as CountryPhoneSelect } from './components/CountryPhoneSelect.jsx'
export { default as SerialField, normalizarSerial } from './components/SerialField.jsx'
export { default as ImeiField } from './components/ImeiField.jsx'
export {
  imeiValido,
  normalizarImei,
  estadoImei,
  analizarImei,
  LARGO_IMEI,
  MENSAJES_IMEI,
  separarSeriales,
  normalizarSeriales,
} from './utils/serial.js'
export { default as InstagramField, normalizarInstagram } from './components/InstagramField.jsx'
export { default as ProductCombobox } from './components/ProductCombobox.jsx'
export {
  default as BuscadorProveedor,
  normalizarProveedor,
  nombreProveedor,
  detalleProveedor,
  filtrarProveedores,
  resolverRecientes,
} from './components/BuscadorProveedor.jsx'
export { default as BloquePago } from './components/BloquePago.jsx'
export { default as NavegacionSeccion } from './components/NavegacionSeccion.jsx'
export { default as BuscadorCliente } from './components/BuscadorCliente.jsx'
export { default as BuscadorPersonas } from './components/BuscadorPersonas.jsx'
export { default as PreviewFusion } from './components/PreviewFusion.jsx'
export { default as ChipFusion } from './components/ChipFusion.jsx'
export { CATEGORIAS_FUSION, categoriasFusion, hayFusion } from './utils/fusion.js'
export { default as ConfirmarConPalabra } from './components/ConfirmarConPalabra.jsx'
export {
  campoBuscableCliente,
  filtrarClientes,
  detalleCliente,
  motivosDuplicadoCliente,
  digitosCliente,
  claveTelefonoCliente,
  coincideTelefonoCliente,
} from './utils/cliente.js'
export { default as SelectorCuentaCobro } from './components/SelectorCuentaCobro.jsx'
export { default as TarjetaCuentaCobro } from './components/TarjetaCuentaCobro.jsx'
export {
  MEDIOS_CUENTA,
  SIMBOLOS_CUENTA,
  LIMITE_CUENTAS,
  etiquetaMedioCuenta,
  iconoMedioCuenta,
  simboloCuenta,
  numeroParcialCuenta,
  campoBuscableCuenta,
  filtrarCuentasCobro,
  preseleccionDeCuenta,
  detalleCuentaCobro,
} from './utils/cuentaCobro.js'
export {
  normalizarPersonaTexto,
  etiquetaPersona,
  filtrarPersonas,
  ordenarPersonas,
  CLAVE_USO_PERSONAS,
  leerUsoPersonas,
  registrarUsoPersona,
} from './utils/personas.js'
export { MARGEN_VENTANA, ventanaDeLista } from './utils/ventana.js'
export { rutaDeAviso, payloadPush, enHorarioSilencioso } from './utils/avisos.js'
export { partesVersion, compararVersiones, hayVersionNueva } from './utils/version.js'
export { VERSION_APP_RE, esVersionApp, etiquetaVersionApp, crearIdentidadApp } from './utils/appIdentity.js'
export { default as BuscadorDispositivo } from './components/BuscadorDispositivo.jsx'
export {
  PERFILES_DISPOSITIVO, CAMPOS_DISPOSITIVO, DISPOSITIVOS_MOBILE, CONECTIVIDADES_MOVIL,
  buscarDispositivo, opcionesDependiente, limpiarDependientes, etiquetaDispositivo,
  nombreDeDispositivo, codigoDeDispositivo,
} from './catalog/dispositivos.js'
export { default as RucField } from './components/RucField.jsx'
export { RUC_RE, extraerRuc, esRuc } from './utils/ruc.js'
export { default as SerialTexto } from './components/SerialTexto.jsx'
export { default as CampoSeriales } from './components/CampoSeriales.jsx'
export { default as EstadoBadge } from './components/EstadoBadge.jsx'
export { default as SeccionColapsable } from './components/SeccionColapsable.jsx'
export { default as TaxIdField } from './components/TaxIdField.jsx'
export {
  PATRON_RUC,
  PATRON_TAX_ID_GENERICO,
  MENSAJE_RUC,
  MENSAJE_RUC_SIN_DATOS,
  MENSAJE_RUC_CONSULTA,
  taxIdValid,
  taxIdGenericoValid,
  taxIdValidoParaPais,
  normalizeTaxId,
  limpiarTaxId,
} from './utils/taxId.js'

// Acceso y shell (sin API: todo por props)
export { default as GoogleButton, GoogleMark, OAuthDivider } from './components/GoogleButton.jsx'
export { default as AuthLayout } from './components/AuthLayout.jsx'
export { default as ProductFooter, CREDITO_PIE, CREDITO_PIE_URL } from './components/ProductFooter.jsx'
export { default as ProductPrefooter } from './components/ProductPrefooter.jsx'
export { default as LoadingScreen } from './components/LoadingScreen.jsx'
export { default as PegarEnlaceToken } from './components/PegarEnlaceToken.jsx'
export { default as NavLateral } from './components/NavLateral.jsx'
export { default as MenuDesplegable } from './components/MenuDesplegable.jsx'

// Datos personales (Ley 7593/2025): aviso de finalidad y consentimiento
// explícito, sin pre-tildar, con el registro de versión/fecha/canal.
export { default as AvisoPrivacidad } from './components/AvisoPrivacidad.jsx'
export { default as ConsentimientoDatos } from './components/ConsentimientoDatos.jsx'
export { registroConsentimiento } from './utils/consentimiento.js'

// Tema claro/oscuro: la clase `dark` en <html> es el contrato (styles.css)
export { default as ThemeToggle, aplicarTema, TEMA_CLARO, TEMA_OSCURO } from './components/ThemeToggle.jsx'

// Ajustes (modelo de configuración) e impresión LAN/USB
export { default as PanelDerecho } from './components/PanelDerecho.jsx'
export { default as TarjetaAjuste } from './components/TarjetaAjuste.jsx'
export { default as EstadoGuardado } from './components/EstadoGuardado.jsx'
export { default as AjustesImpresion } from './components/AjustesImpresion.jsx'
export { default as BotonImprimir } from './components/BotonImprimir.jsx'
export { default as BancoCombobox } from './components/BancoCombobox.jsx'
export { default as BancoLogo } from './components/BancoLogo.jsx'
export { default as MedioPagoLogo } from './components/MedioPagoLogo.jsx'
export { default as CityAutocomplete } from './components/CityAutocomplete.jsx'

// Clases de tabla/listado
export { ROTULO_DATO, CELDA_ENCABEZADO, ROTULO_SECCION, CELDA_DATO, CELDA_NUMERO, CELDA_IDENTIDAD, CELDA_IDENTIDAD_GRANDE } from './utils/tabla.js'

// Operación de equipos (épicas #240/#241): checklist, locks, batería, grado,
// tile y stepper. Los estados y sus tonos viven en utils/estadoEquipo.js.
export { default as SemaforoItem } from './components/SemaforoItem.jsx'
export { default as FilaChecklist, ConteoChecklist } from './components/FilaChecklist.jsx'
export { default as ChipEstado } from './components/ChipEstado.jsx'
export { default as ChipsLocks } from './components/ChipsLocks.jsx'
export { default as MedidorBateria } from './components/MedidorBateria.jsx'
export { default as MedidorStock } from './components/MedidorStock.jsx'
export { default as ContadorLote } from './components/ContadorLote.jsx'
export { default as ChipPrioridad } from './components/ChipPrioridad.jsx'
export { default as ChipOrigen } from './components/ChipOrigen.jsx'
export { default as ContadoresCompra } from './components/ContadoresCompra.jsx'
export { default as TarjetaNecesidad } from './components/TarjetaNecesidad.jsx'
export { default as TarjetaCompra } from './components/TarjetaCompra.jsx'
export { default as TarjetaLote } from './components/TarjetaLote.jsx'
export { default as TarjetaRecepcion } from './components/TarjetaRecepcion.jsx'
export { default as EtiquetaLote } from './components/EtiquetaLote.jsx'
export { default as ManifiestoEnvio } from './components/ManifiestoEnvio.jsx'
export {
  PRIORIDADES_COMPRA,
  claveDePrioridad,
  prioridadDe,
  etiquetaPrioridad,
  tonoPrioridad,
  ordenDePrioridad,
  ordenarPorPrioridad,
  ORIGENES_NECESIDAD,
  origenDe,
  etiquetaOrigen,
  tonoOrigen,
  iconoOrigen,
  ESTADOS_NECESIDAD,
  claveDeEstado,
  estadoNecesidad,
  etiquetaNecesidad,
  tonoNecesidad,
  PASOS_NECESIDAD,
  ESTADOS_COMPRA,
  claveDeEstadoCompra,
  estadoCompra,
  etiquetaCompra,
  tonoCompra,
  ESTADOS_ENVIO,
  claveDeEstadoEnvio,
  estadoEnvio,
  etiquetaEnvio,
  tonoEnvio,
  PASOS_ENVIO,
  METODOS_ENVIO,
  claveDeMetodoEnvio,
  metodoEnvio,
  etiquetaMetodoEnvio,
  iconoMetodoEnvio,
  ESTADOS_RECEPCION,
  claveDeEstadoRecepcion,
  estadoRecepcion,
  etiquetaRecepcion,
  tonoRecepcion,
  COLOR_DE_TONO,
  colorDeTono,
} from './utils/abastecimiento.js'
export { default as ResumenDestinos } from './components/ResumenDestinos.jsx'
export { default as ResumenIncidencias } from './components/ResumenIncidencias.jsx'
export { default as ResumenRecepcion } from './components/ResumenRecepcion.jsx'
export { default as FilaRevision } from './components/FilaRevision.jsx'
export { default as SelectorIncidencia } from './components/SelectorIncidencia.jsx'
export { default as DestinoRecepcion } from './components/DestinoRecepcion.jsx'
export { ESTADOS_REVISION, INCIDENCIAS, claveRevision, esIncidencia, etiquetaRevision, etiquetaPluralRevision, tonoRevision } from './utils/revision.js'
export { default as GradoBadge } from './components/GradoBadge.jsx'
export { default as TileEquipo } from './components/TileEquipo.jsx'
export { default as PasosEquipo } from './components/PasosEquipo.jsx'
export { default as ColumnaLote } from './components/ColumnaLote.jsx'
export { default as Vencimiento, estadoVencimiento } from './components/Vencimiento.jsx'
export { default as TileRol } from './components/TileRol.jsx'
export { default as Stepper } from './components/Stepper.jsx'
export { default as CodigoQr } from './components/CodigoQr.jsx'
export { default as FichaCertificado } from './components/FichaCertificado.jsx'
export { default as VistaPreviaPapel, ANCHOS_PAPEL } from './components/VistaPreviaPapel.jsx'
export { QR_OPCIONES, qrDataUrl } from './utils/qr.js'
export {
  ESTADOS_ITEM,
  ESTADOS_CHIP,
  ESTADOS_LOCK,
  LOCKS_DISPOSITIVO,
  GRADOS_CONDICION,
  CONDICION_UNIDAD,
  COLOR_BADGE,
  UMBRAL_BATERIA_OK,
  UMBRAL_BATERIA_ATENCION,
  estadoItem,
  estadoChip,
  estadoLock,
  gradoCondicion,
  etiquetaCondicion,
  colorBadge,
  tonoBateria,
} from './utils/estadoEquipo.js'

// Categorías de producto con icono (#242)
export { default as IconoCategoria, GLIFOS_CATEGORIA } from './components/IconoCategoria.jsx'
export {
  CATEGORIAS_PRODUCTO,
  ICONO_CATEGORIA,
  normalizarCategoria,
  categoriaDe,
  iconoDeCategoria,
  etiquetaDeCategoria,
} from './utils/categorias.js'

// ── Lote 2: agenda, filtros, navegación e identidad ─────────────────────────
// Calendario por mes/semana, filtro de rango, buscador global, ayuda de
// pantalla, barra inferior mobile, avatar y las piezas de tablero.
export { default as Calendario } from './components/Calendario.jsx'
export {
  DIAS_SEMANA,
  esClaveDia,
  claveDia,
  fechaDeClave,
  hoyClave,
  sumarDias,
  sumarMeses,
  indiceSemana,
  rangoSemana,
  rangoMes,
  mismoMes,
  etiquetaMes,
  etiquetaDia,
  etiquetaDiaCorta,
  agruparPorDia,
} from './utils/calendario.js'
export { default as RangoFecha } from './components/RangoFecha.jsx'
export {
  PERIODOS_FECHA,
  ETIQUETA_PERIODO,
  esAtajo,
  rangoDePeriodo,
  periodoDeRango,
  rangoInvertido,
} from './utils/rangoFecha.js'
export { default as PaletaComandos, agruparResultados, estadoPaleta } from './components/PaletaComandos.jsx'
export { default as AyudaModulo } from './components/AyudaModulo.jsx'
export { default as BarraInferior, ESPACIO_BARRA_INFERIOR } from './components/BarraInferior.jsx'
export { default as Avatar, TAMANOS_AVATAR } from './components/Avatar.jsx'
export { default as PersonaChip } from './components/PersonaChip.jsx'
export { default as PilaPersonas } from './components/PilaPersonas.jsx'
export { identidadDeUsuario, ESTADOS_PRESENCIA, resumenPresencia } from './utils/identidad.js'
export { COLORES_AVATAR, inicialesDeNombre, claveColorDeNombre, colorDeNombre } from './utils/avatar.js'
export { default as ImporteDelta, tonoDelta } from './components/ImporteDelta.jsx'
export { default as IndicadorConexion } from './components/IndicadorConexion.jsx'
export { default as CampanaAvisos, contarSinLeer, textoContador } from './components/CampanaAvisos.jsx'
export { default as GraficoBarras, maximoDeBarras, porcentajeBarra } from './components/GraficoBarras.jsx'
// Pipeline, documentos y avance (lote LedBox): tablero, cronología, plan de
// pagos, impresión A4, subida de imagen y progreso de checklist. Todo portable:
// props adentro, callbacks afuera, sin fetch ni router.
export {
  default as TableroKanban,
  useTableroOptimista,
  columnasDelTablero,
  agruparTarjetas,
  destinosDeTarjeta,
} from './components/TableroKanban.jsx'
export {
  default as Cronologia,
  ICONOS_HITO,
  TONOS_HITO,
  ETIQUETAS_HITO,
  etiquetaDeHito,
  agruparHitos,
} from './components/Cronologia.jsx'
export { default as PlanPagos, ESTADOS_CUOTA } from './components/PlanPagos.jsx'
export { default as DocumentoImpresion } from './components/DocumentoImpresion.jsx'
export {
  default as SubidaImagen,
  MIMES_IMAGEN,
  EXTENSION_IMAGEN,
  TAMANO_MAXIMO_IMAGEN,
  TAMANO_OBJETIVO_IMAGEN,
  mimeDeImagen,
  validarImagen,
  prepararImagen,
} from './components/SubidaImagen.jsx'
export { default as ProgresoChecklist, progresoChecklist } from './components/ProgresoChecklist.jsx'
export { TONOS, TONOS_ALIAS, tonoCanonico, puntoDeTono, chipDeTono, textoDeTono } from './utils/tonos.js'

// «Carga con IA» (#11): botón de topbar + diálogo declarativo. La app pasa el
// esquema de tipos/campos y los callbacks `analizar`/`crear`; nada se crea sin
// confirmación. Reglas: docs/REGLAS.md §18.
export { BotonCargaIA, CargaIA, default as DialogoCargaIA } from './components/CargaIA.jsx'
export {
  IA_TEXTO_MAX,
  IA_REGISTROS_MAX,
  IA_RATE_LIMIT,
  IA_TOKENS_MAX,
  IA_TIMEOUT_MS,
  IA_BOTON,
  IA_TOOLTIP,
  IA_TITULO,
  CAMPOS_IA,
  IA_DIALOGO_COMPLETO_REGISTROS,
  IA_DIALOGO_COMPLETO_CAMPOS,
  tipoDeEsquemaIA,
  campoDeTipoIA,
  opcionesDeCampoIA,
  tituloDeRegistroIA,
  valorVacioIA,
  normalizarAnalisisIA,
  registrosIncluidosIA,
  validarRegistrosIA,
  normalizarResultadoIA,
  tamanoDialogoIA,
} from './utils/cargaIA.js'

// Lógica compartida
export { cn, primerNombre } from './utils/cn.js'
export { default as useDialogFocusTrap, destinoDeTab, SELECTOR_ENFOCABLES } from './hooks/useDialogFocusTrap.js'
export { crearPilaCapas, crearRegistroPendientes } from './utils/pilaOverlays.js'
export { useSingleFlightSubmit } from './hooks/useSingleFlightSubmit.js'
export { default as useValidacionCampos } from './hooks/useValidacionCampos.js'
export { completeSave, crearEnvioUnico, AVISO_REFRESCO } from './utils/guardado.js'
export {
  MENSAJES_VALIDACION,
  EMAIL_RE,
  campoVacio,
  obligatorio,
  largoMinimo,
  largoMaximo,
  patron,
  emailValido,
  minimo,
  maximo,
  validarCampo,
  validarCampos,
  limpiarError,
} from './utils/validacion.js'
export { RESULTADOS_VALIDOS, mensajeResultado, mensajeFallo } from './utils/resultado.js'
export { normalizarNombre, nombrePartes, esApellidosPrimero, esRazonSocial } from './utils/nombre.js'
export {
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  COOPERATIVAS_PARAGUAY,
  LOGOS_BANCOS,
  COLORES_BANCO_RESPALDO,
  FECHA_VERIFICACION_MARCAS_FINANCIERAS,
  normalizarBanco,
  inicialesDeBanco,
  colorDeBanco,
  logoDeBanco,
  coberturaBancos,
  sugerenciasDeBanco,
} from './utils/bancos.js'
export {
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  normalizarMarcaPago,
  logoDeMedioPago,
  coberturaMediosPago,
  sugerenciasDeMarcaPago,
} from './utils/mediosPago.js'
export {
  FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  RELACIONES_FINANCIERAS,
  MARCAS_CON_RELACION_FINANCIERA,
  normalizarRelacionFinanciera,
  relacionFinancieraDe,
  buscarRelacionesFinancieras,
  institucionesSugeridasPorMarca,
  marcasRelacionadasConInstitucion,
} from './utils/relacionesFinancieras.js'
export {
  ESTADO_IMPRESORA,
  ETIQUETA_ESTADO,
  TONO_ESTADO,
  ETIQUETA_TRABAJO,
  etiquetaTrabajo,
  colorTrabajo,
  conexionDeDestino,
  destinoDeConexion,
  estadoDeDiagnostico,
  motivoDeDiagnostico,
  textoVerificacion,
  agregarEstado,
} from './printing/estadoImpresoras.js'
export {
  crearTicket,
  columnasDeAncho,
  envolver,
  repartirLinea,
  bloqueFirma,
  AVANCES_FIRMA,
  VARIANTES_CORTE,
} from './printing/escpos.js'
export { paginaDePrueba, paginaDePruebaSimple, TIPOS_PRUEBA, TIPOS_TICKET_PRUEBA, ANCHOS_PRUEBA, CORTES_PRUEBA, PLANTILLA_PRUEBA, plantillaDePrueba } from './printing/prueba.js'
export { TAMANOS_CAMPO, anchoParaLargo } from './utils/tamanos.js'
export { TAMANOS_MODAL, TAMANO_MODAL_PREDETERMINADO, CIERRE_CON_CAMBIOS } from './utils/modal.js'
export { GRILLA_DOS_COLUMNAS, GRILLA_DOS_COLUMNAS_COMPACTA, PIE_ACCIONES, PIE_ACCIONES_REVERSO } from './utils/formulario.js'
export { CIUDADES_PARAGUAY, DEPARTAMENTOS_PARAGUAY, departamentoDe, buscarCiudad } from './catalog/ciudades.js'
export {
  MODELOS_IPHONE,
  CAPACIDADES_IPHONE,
  COLORES_IPHONE,
  CATEGORIAS_ACCESORIOS,
  MARCAS_ACCESORIOS,
  buscarEnCatalogo,
  normalizarBusqueda,
} from './catalog/productos.js'
export {
  formatGs,
  formatGsInput,
  largoMaximoMonto,
  LIMITE_MONTO_ALMACENABLE,
  limiteMonto,
  errorMonto,
  parseGsInput,
  formatUsd,
  formatUsdInput,
  parseUsdInput,
  normalizarMontoInput,
  caretTrasDigitos,
  formatMoney,
  montoGs,
  montoUsd,
  montoTexto,
  excedeMonto,
  formatoNumero,
  signoDe,
  montoConSigno,
  SIMBOLO_PYG,
  SIMBOLOS_MONEDA,
  LIMITE_MONTO_GENERAL,
  LIMITE_MONTO_VENTAS,
} from './utils/moneda.js'
export { fechaValida, fechaHora, fechaDia, fechaHoraCorta, fechaCorta, fechaLista, fechaListaCorta, diasHasta, tonoVencimiento } from './utils/fecha.js'
export { ultimos4, partirSerial, serialEnmascarado } from './utils/serial.js'
export { extractTokenFromUrl, esToken } from './utils/token.js'
export {
  CODIGOS_PAIS,
  parseTelefono,
  parseTelefonoInternacional,
  componerTelefono,
  telefonoE164,
  telefonoInternacionalValido,
  normalizarTelefono,
  internationalPhone,
  whatsappUrl,
  soloDigitos,
  codigoPais,
  telefonoVisible,
  telefonoValido,
  MENSAJE_TELEFONO,
} from './utils/telefono.js'
export {
  PAISES_TELEFONO,
  paisTelefonoPorIso,
  paisesDeCodigo,
  buscarPaisesTelefono,
} from './utils/paisesTelefono.js'

export { Combobox, Popover, Tooltip, CloseButton, AppHeader, PublicHeader, ProfileCard, UserMenu, AccountSwitcher, NotificationCenter, AsyncButton, FooterPreset, CopyButton, ActionToolbar } from './components/ReusableUI.jsx'

export { default as AnimatedStatus } from './components/AnimatedStatus.jsx'
export { default as MotionSurface } from './components/MotionSurface.jsx'

export { default as OtpVerification } from './components/OtpVerification.jsx'

export { default as Carousel } from './components/Carousel.jsx'

export { default as CartSummary } from './components/CartSummary.jsx'

export { default as ProductVariantSelector } from './components/ProductVariantSelector.jsx'

export { default as PricingCard } from './components/PricingCard.jsx'
