import type { ComponentType, ReactElement } from 'react'
import type { RegistroLogoBanco, RegistroLogoMedioPago } from './utils.js'

export { BancoLogo, MedioPagoLogo } from './index.js'
export function LogoFinanciero(props: {
  nombre?: string
  registro?: RegistroLogoBanco | RegistroLogoMedioPago | null
  alto?: string
  className?: string
  baseAssets?: string
  marcas?: Record<string, ComponentType>
  soloCatalogo?: boolean
  decorativo?: boolean
}): ReactElement | null
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
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  normalizarMarcaPago,
  logoDeMedioPago,
  coberturaMediosPago,
  sugerenciasDeMarcaPago,
  FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  RELACIONES_FINANCIERAS,
  MARCAS_CON_RELACION_FINANCIERA,
  normalizarRelacionFinanciera,
  relacionFinancieraDe,
  buscarRelacionesFinancieras,
  institucionesSugeridasPorMarca,
  marcasRelacionadasConInstitucion,
} from './utils.js'
export type {
  VisualFinanciero,
  EvidenciaRedistribucionMarca,
  RegistroLogoBanco,
  RegistroLogoMedioPago,
  EntradaLogoBanco,
  EntradaMarcaMedioPago,
  CoberturaMarcaFinanciera,
  OperadorMarcaFinanciera,
  RelacionFinanciera,
} from './utils.js'


export const AUTORIZACION_ASSETS_FINANCIEROS: Readonly<{
  permitida: true
  evidencia: string
  base: string
  confirmadaEn: string
  alcance: readonly string[]
}>
export const BLOQUEOS_ASSETS_FINANCIEROS: readonly Readonly<{
  catalogo: 'banco' | 'pago'
  id: string
  motivo: string
}>[]
export const ASSETS_FINANCIEROS: Readonly<Record<string, string>>
export const ASSET_KEYS_FINANCIEROS: readonly string[]
export function obtenerAssetFinanciero(clave: string): string | null
