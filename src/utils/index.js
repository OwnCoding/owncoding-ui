// Entrada pura del paquete: `owncoding-ui/utils`.
//
// Es la misma lógica compartida que sale por `owncoding-ui`, sin React y sin
// el banner `"use client"` del bundle principal. Sirve para componentes de
// servidor, route handlers, jobs y scripts de Next: importar de acá no
// arrastra componentes ni obliga a `serverExternalPackages`.
//
// Todo lo que se exporta acá es puro: no hace fetch, no lee stores ni toca el
// DOM. El único import diferido es `qrcode` (peer opcional) dentro de
// `qrDataUrl`. Los objetos de interfaz viven en `owncoding-ui`.

// ── Lógica compartida ───────────────────────────────────────────────────────
export { cn, primerNombre } from './cn.js'
export { normalizarNombre, nombrePartes, esApellidosPrimero, esRazonSocial } from './nombre.js'
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
} from './bancos.js'
export {
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  normalizarMarcaPago,
  logoDeMedioPago,
  coberturaMediosPago,
  sugerenciasDeMarcaPago,
} from './mediosPago.js'
export {
  FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  RELACIONES_FINANCIERAS,
  MARCAS_CON_RELACION_FINANCIERA,
  normalizarRelacionFinanciera,
  relacionFinancieraDe,
  buscarRelacionesFinancieras,
  institucionesSugeridasPorMarca,
  marcasRelacionadasConInstitucion,
} from './relacionesFinancieras.js'
export { TAMANOS_CAMPO, anchoParaLargo } from './tamanos.js'
export { TAMANOS_MODAL, TAMANO_MODAL_PREDETERMINADO } from './modal.js'
export { GRILLA_DOS_COLUMNAS, GRILLA_DOS_COLUMNAS_COMPACTA, PIE_ACCIONES, PIE_ACCIONES_REVERSO } from './formulario.js'
export { ROTULO_DATO, CELDA_ENCABEZADO, ROTULO_SECCION, CELDA_DATO, CELDA_NUMERO, CELDA_IDENTIDAD, CELDA_IDENTIDAD_GRANDE } from './tabla.js'

// ── Catálogos por defecto ───────────────────────────────────────────────────
export { CIUDADES_PARAGUAY, DEPARTAMENTOS_PARAGUAY, departamentoDe, buscarCiudad } from '../catalog/ciudades.js'
export {
  MODELOS_IPHONE,
  CAPACIDADES_IPHONE,
  COLORES_IPHONE,
  CATEGORIAS_ACCESORIOS,
  MARCAS_ACCESORIOS,
  buscarEnCatalogo,
  normalizarBusqueda,
} from '../catalog/productos.js'
export {
  PERFILES_DISPOSITIVO,
  CAMPOS_DISPOSITIVO,
  DISPOSITIVOS_MOBILE,
  CONECTIVIDADES_MOVIL,
  buscarDispositivo,
  opcionesDependiente,
  limpiarDependientes,
  etiquetaDispositivo,
  nombreDeDispositivo,
  codigoDeDispositivo,
} from '../catalog/dispositivos.js'

// ── Dinero, fechas, seriales, RUC y teléfono ────────────────────────────────
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
  normalizarMontoInput,
  caretTrasDigitos,
} from './moneda.js'
export {
  fechaValida,
  fechaHora,
  fechaDia,
  fechaHoraCorta,
  fechaCorta,
  fechaLista,
  fechaListaCorta,
  diasHasta,
  tonoVencimiento,
} from './fecha.js'
export { imeiValido, separarSeriales, normalizarSeriales, ultimos4, partirSerial, serialEnmascarado } from './serial.js'
export { RUC_RE, extraerRuc, esRuc } from './ruc.js'
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
} from './taxId.js'
export { extractTokenFromUrl, esToken } from './token.js'
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
} from './telefono.js'
export {
  PAISES_TELEFONO,
  paisTelefonoPorIso,
  paisesDeCodigo,
  buscarPaisesTelefono,
} from './paisesTelefono.js'

// ── Estados y tonos ─────────────────────────────────────────────────────────
export { TONOS, TONOS_ALIAS, tonoCanonico, puntoDeTono, chipDeTono, textoDeTono } from './tonos.js'
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
} from './estadoEquipo.js'
export { CATEGORIAS_PRODUCTO, ICONO_CATEGORIA, normalizarCategoria, categoriaDe, iconoDeCategoria, etiquetaDeCategoria } from './categorias.js'
export { COLORES_AVATAR, inicialesDeNombre, claveColorDeNombre, colorDeNombre } from './avatar.js'
export { identidadDeUsuario, ESTADOS_PRESENCIA, resumenPresencia } from './identidad.js'

// ── Agenda y rangos ─────────────────────────────────────────────────────────
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
} from './calendario.js'
export { PERIODOS_FECHA, ETIQUETA_PERIODO, esAtajo, rangoDePeriodo, periodoDeRango, rangoInvertido } from './rangoFecha.js'

// ── Abastecimiento y recepción ──────────────────────────────────────────────
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
} from './abastecimiento.js'
export { ESTADOS_REVISION, INCIDENCIAS, claveRevision, esIncidencia, etiquetaRevision, etiquetaPluralRevision, tonoRevision } from './revision.js'

// ── Impresión (modelos de texto, sin browser) ───────────────────────────────
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
} from '../printing/estadoImpresoras.js'
export { crearTicket, columnasDeAncho, envolver, repartirLinea, bloqueFirma, AVANCES_FIRMA, VARIANTES_CORTE } from '../printing/escpos.js'
export { paginaDePrueba, paginaDePruebaSimple, TIPOS_PRUEBA, TIPOS_TICKET_PRUEBA, ANCHOS_PRUEBA, CORTES_PRUEBA, PLANTILLA_PRUEBA, plantillaDePrueba } from '../printing/prueba.js'

// ── Ciclo de guardado y overlays (cosecha de ScaleOS) ───────────────────────
export { AVISO_REFRESCO, crearEnvioUnico, completeSave } from './guardado.js'
export { crearPilaCapas, crearRegistroPendientes } from './pilaOverlays.js'

// ── Utilidades puntuales ────────────────────────────────────────────────────
export { registroConsentimiento } from './consentimiento.js'
export { rutaDeAviso, payloadPush, enHorarioSilencioso } from './avisos.js'
export { partesVersion, compararVersiones, hayVersionNueva } from './version.js'
export { VERSION_APP_RE, esVersionApp, etiquetaVersionApp, crearIdentidadApp } from './appIdentity.js'
export { QR_OPCIONES, qrDataUrl } from './qr.js'

// ── «Carga con IA»: contrato puro (#11) ─────────────────────────────────────
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
} from './cargaIA.js'

export {
  normalizarPersonaTexto,
  etiquetaPersona,
  filtrarPersonas,
  ordenarPersonas,
  CLAVE_USO_PERSONAS,
  leerUsoPersonas,
  registrarUsoPersona,
} from './personas.js'
