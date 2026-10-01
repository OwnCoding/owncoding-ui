import { logoDeBanco as logoDeBancoPuro, coberturaBancos as coberturaBancosPura } from '../utils/bancos.js'
import { logoDeMedioPago as logoDeMedioPagoPuro, coberturaMediosPago as coberturaMediosPagoPura } from '../utils/mediosPago.js'
import { adjuntarAssetsACobertura, adjuntarAssetsAlRegistro } from './assets.js'

export function logoDeBanco(nombre, variante) {
  return adjuntarAssetsAlRegistro(logoDeBancoPuro(nombre, variante))
}

export function coberturaBancos(catalogo) {
  return coberturaBancosPura(catalogo).map(adjuntarAssetsACobertura)
}

export function logoDeMedioPago(nombre, variante) {
  return adjuntarAssetsAlRegistro(logoDeMedioPagoPuro(nombre, variante))
}

export function coberturaMediosPago(catalogo) {
  return coberturaMediosPagoPura(catalogo).map(adjuntarAssetsACobertura)
}
