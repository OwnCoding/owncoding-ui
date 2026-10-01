import { BANCOS_PARAGUAY, logoDeBanco } from '../src/utils/bancos.js'
import { MEDIOS_PAGO_CON_MARCA, logoDeMedioPago } from '../src/utils/mediosPago.js'

export const BANCO_DESTACADO = 'ueno bank'

function tieneDosAssets(resolver, nombre) {
  return ['compacto', 'horizontal'].every((variante) => Boolean(resolver(nombre, variante)?.visual?.empaquetado))
}

export const BANCOS_PREVIEW = Object.freeze([
  BANCO_DESTACADO,
  ...BANCOS_PARAGUAY.filter((nombre) => nombre !== BANCO_DESTACADO && tieneDosAssets(logoDeBanco, nombre)),
])

export const MARCAS_PAGO_PREVIEW = Object.freeze(
  MEDIOS_PAGO_CON_MARCA.filter((nombre) => nombre !== 'uPOS' && tieneDosAssets(logoDeMedioPago, nombre)),
)

export const MARCAS_CONECTADAS_PREVIEW = Object.freeze(['Mango', 'Vaquita', 'EKO', 'eCLUB', 'Pik'])

export const MARCAS_PAGO_RESTO_PREVIEW = Object.freeze(
  MARCAS_PAGO_PREVIEW.filter((nombre) => !MARCAS_CONECTADAS_PREVIEW.includes(nombre)),
)
