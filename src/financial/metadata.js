// Metadatos puros: aptos para RSC, route handlers, jobs y Node. Este punto de
// entrada no importa React ni bytes de imágenes.
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
} from '../utils/bancos.js'
export {
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  normalizarMarcaPago,
  logoDeMedioPago,
  coberturaMediosPago,
  sugerenciasDeMarcaPago,
} from '../utils/mediosPago.js'

export {
  FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  RELACIONES_FINANCIERAS,
  MARCAS_CON_RELACION_FINANCIERA,
  normalizarRelacionFinanciera,
  relacionFinancieraDe,
  buscarRelacionesFinancieras,
  institucionesSugeridasPorMarca,
  marcasRelacionadasConInstitucion,
} from '../utils/relacionesFinancieras.js'

export { AUTORIZACION_ASSETS_FINANCIEROS, BLOQUEOS_ASSETS_FINANCIEROS } from '../utils/financialAssets.js'
