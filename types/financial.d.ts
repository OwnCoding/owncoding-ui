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
} from './utils.js'
export type {
  VisualFinanciero,
  EvidenciaRedistribucionMarca,
  RegistroLogoBanco,
  RegistroLogoMedioPago,
  EntradaLogoBanco,
  EntradaMarcaMedioPago,
  CoberturaMarcaFinanciera,
} from './utils.js'
