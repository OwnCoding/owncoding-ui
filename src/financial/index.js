import BancoLogo from '../components/BancoLogo.jsx'
import LogoFinanciero from '../components/LogoFinanciero.jsx'
import MedioPagoLogo from '../components/MedioPagoLogo.jsx'
import {
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  COOPERATIVAS_PARAGUAY,
  LOGOS_BANCOS,
  COLORES_BANCO_RESPALDO,
  FECHA_VERIFICACION_MARCAS_FINANCIERAS,
  normalizarBanco,
  inicialesDeBanco,
  colorDeBanco,
  sugerenciasDeBanco,
} from '../utils/bancos.js'
import {
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  normalizarMarcaPago,
  sugerenciasDeMarcaPago,
} from '../utils/mediosPago.js'
export { logoDeBanco, coberturaBancos, logoDeMedioPago, coberturaMediosPago } from './resolvers.js'
export { ASSETS_FINANCIEROS, ASSET_KEYS_FINANCIEROS, obtenerAssetFinanciero } from './assets.js'
export { AUTORIZACION_ASSETS_FINANCIEROS, BLOQUEOS_ASSETS_FINANCIEROS } from '../utils/financialAssets.js'
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

export {
  BancoLogo,
  LogoFinanciero,
  MedioPagoLogo,
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  COOPERATIVAS_PARAGUAY,
  LOGOS_BANCOS,
  COLORES_BANCO_RESPALDO,
  FECHA_VERIFICACION_MARCAS_FINANCIERAS,
  normalizarBanco,
  inicialesDeBanco,
  colorDeBanco,
  sugerenciasDeBanco,
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  normalizarMarcaPago,
  sugerenciasDeMarcaPago,
}
