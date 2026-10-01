import { readFileSync } from 'node:fs'
import { init, parse } from 'es-module-lexer'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'

await init
const fuente = readFileSync('src/index.js', 'utf8')
const exportados = [...new Set(parse(fuente)[1].map((entrada) => entrada.n))].sort()
const catalogados = CATALOGO_EXPORTS.map((entrada) => entrada.nombre)
const catalogadosUnicos = [...new Set(catalogados)]
const faltantes = exportados.filter((nombre) => !catalogadosUnicos.includes(nombre))
const sobrantes = catalogadosUnicos.filter((nombre) => !exportados.includes(nombre))
const duplicados = catalogados.filter((nombre, indice) => catalogados.indexOf(nombre) !== indice)
const PRESENTACIONES = new Set(['acciones', 'campos', 'datos', 'estados', 'seleccion', 'bancos', 'pagos', 'telefono', 'footer', 'prefooter', 'ia'])

// Convención verificable del paquete: los exports PascalCase son piezas
// visuales; constantes SCREAMING_CASE y funciones camelCase son API/modelos.
const visuales = exportados.filter((nombre) => /^[A-Z]/.test(nombre) && nombre !== nombre.toUpperCase())
const erroresVisuales = visuales.filter((nombre) => {
  const entrada = CATALOGO_EXPORTS.find((item) => item.nombre === nombre)
  return !entrada || entrada.tipo !== 'visual' || !entrada.categoria
})
const erroresApi = exportados.filter((nombre) => {
  const entrada = CATALOGO_EXPORTS.find((item) => item.nombre === nombre)
  return !entrada || !entrada.categoria || !['visual', 'api'].includes(entrada.tipo)
})
const presentacionesInvalidas = CATALOGO_EXPORTS.filter((item) => item.presentacion && (!PRESENTACIONES.has(item.presentacion) || item.tipo !== 'visual'))

if (faltantes.length || sobrantes.length || duplicados.length || erroresVisuales.length || erroresApi.length || presentacionesInvalidas.length) {
  console.error(JSON.stringify({ faltantes, sobrantes, duplicados, erroresVisuales, erroresApi, presentacionesInvalidas }, null, 2))
  process.exit(1)
}

const api = exportados.length - visuales.length
const vistas = CATALOGO_EXPORTS.filter((item) => item.presentacion).length
console.log(`gallery coverage ok: ${exportados.length} exports · ${visuales.length} visuales · ${api} API · ${vistas} vistas curadas`)
