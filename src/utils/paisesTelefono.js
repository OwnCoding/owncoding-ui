import { getCountries, getCountryCallingCode } from 'libphonenumber-js/min'

const PAIS_PREDETERMINADO = 'PY'
const PAIS_PRINCIPAL_POR_DDI = Object.freeze({
  '+1': 'US',
  '+7': 'RU',
  '+44': 'GB',
})
const cacheCatalogos = new Map()

function isoValido(value) {
  const iso = String(value || '').trim().toUpperCase()
  return /^[A-Z]{2}$/.test(iso) && getCountries().includes(iso) ? iso : ''
}

function banderaDeIso(iso) {
  return [...iso].map((letra) => String.fromCodePoint(127397 + letra.charCodeAt(0))).join('')
}

function nombreDePais(iso, locale) {
  try {
    return new Intl.DisplayNames([locale || 'es'], { type: 'region' }).of(iso) || iso
  } catch {
    return iso
  }
}

function compararPaises(a, b, locale) {
  return a.name.localeCompare(b.name, locale || 'es', { sensitivity: 'base' })
}

function catalogoParaLocale(locale = 'es') {
  const clave = String(locale || 'es')
  if (cacheCatalogos.has(clave)) return cacheCatalogos.get(clave)
  const catalogo = getCountries()
    .map((country) => Object.freeze({
      country,
      countryCode: `+${getCountryCallingCode(country)}`,
      name: nombreDePais(country, clave),
      flag: banderaDeIso(country),
    }))
    .sort((a, b) => (a.country === PAIS_PREDETERMINADO ? -1 : b.country === PAIS_PREDETERMINADO ? 1 : compararPaises(a, b, clave)))
  const congelado = Object.freeze(catalogo)
  cacheCatalogos.set(clave, congelado)
  return congelado
}

function textoBuscable(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
}

function catalogoNormalizado(countries, locale) {
  const catalogo = catalogoParaLocale(locale)
  if (!Array.isArray(countries) || countries.length === 0) return [...catalogo]
  const porIso = new Map(catalogo.map((pais) => [pais.country, pais]))
  const vistos = new Set()
  return countries.flatMap((entrada) => {
    if (typeof entrada === 'object' && entrada?.custom === true) {
      const country = String(entrada.country || '').trim()
      const countryCode = `+${String(entrada.countryCode || '').replace(/\D/g, '')}`
      if (!country || countryCode === '+' || vistos.has(country)) return []
      vistos.add(country)
      return [Object.freeze({
        country,
        countryCode,
        name: String(entrada.name || `Código internacional ${countryCode}`),
        flag: String(entrada.flag || '🌐'),
        custom: true,
      })]
    }
    const iso = isoValido(typeof entrada === 'string' ? entrada : entrada?.country)
    if (!iso || vistos.has(iso)) return []
    vistos.add(iso)
    const base = porIso.get(iso)
    return base ? [base] : []
  })
}

/** Catálogo internacional completo, localizado al español y con Paraguay primero. */
export const PAISES_TELEFONO = catalogoParaLocale('es')

/** Devuelve los datos de un país ISO 3166-1 alpha-2. */
export function paisTelefonoPorIso(iso, locale = 'es') {
  const country = isoValido(iso)
  return country ? catalogoParaLocale(locale).find((pais) => pais.country === country) || null : null
}

/** Devuelve todos los países que comparten un código telefónico (por ejemplo, +1). */
export function paisesDeCodigo(countryCode, locale = 'es', countries = PAISES_TELEFONO) {
  const codigo = `+${String(countryCode || '').replace(/\D/g, '')}`
  const principal = PAIS_PRINCIPAL_POR_DDI[codigo]
  return catalogoNormalizado(countries, locale)
    .filter((pais) => pais.countryCode === codigo)
    .sort((a, b) => {
      if (a.country === principal) return -1
      if (b.country === principal) return 1
      return compararPaises(a, b, locale)
    })
}

/**
 * Busca sin distinguir acentos por nombre localizado, ISO o código telefónico.
 * Sin consulta deja Paraguay primero; con consulta ordena alfabéticamente.
 */
export function buscarPaisesTelefono(consulta = '', countries = PAISES_TELEFONO, locale = 'es') {
  const termino = textoBuscable(consulta)
  const digitos = termino.replace(/\D/g, '')
  const catalogo = catalogoNormalizado(countries, locale)
  const resultados = termino
    ? catalogo.filter((pais) => {
      const texto = textoBuscable(`${pais.name} ${pais.country} ${pais.countryCode}`)
      return texto.includes(termino) || (digitos && pais.countryCode.replace(/\D/g, '').includes(digitos))
    })
    : catalogo
  return resultados.sort((a, b) => {
    if (!termino && a.country === PAIS_PREDETERMINADO) return -1
    if (!termino && b.country === PAIS_PREDETERMINADO) return 1
    return compararPaises(a, b, locale)
  })
}

/** Normaliza una lista de ISO/entradas para el selector. */
export function resolverPaisesTelefono(countries, locale = 'es') {
  return buscarPaisesTelefono('', countries, locale)
}
