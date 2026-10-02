import { readFileSync } from 'node:fs'
import { init, parse } from 'es-module-lexer'
import { CATALOGO_EXPORTS, CATEGORIAS_CATALOGO, DESTACADOS_CATALOGO } from '../gallery/catalog.js'
import {
  BANCO_DESTACADO,
  BANCOS_PREVIEW,
  MARCAS_CONECTADAS_PREVIEW,
  MARCAS_PAGO_PREVIEW,
  SOLUCIONES_PAGO_COMERCIOS_PREVIEW,
} from '../gallery/financial-fixtures.js'
import { BANCOS_PARAGUAY, logoDeBanco } from '../src/utils/bancos.js'
import { BLOQUEOS_ASSETS_FINANCIEROS } from '../src/utils/financialAssets.js'
import { logoDeMedioPago } from '../src/utils/mediosPago.js'
import { relacionFinancieraDe } from '../src/utils/relacionesFinancieras.js'

await init
const fuente = readFileSync('src/index.js', 'utf8')
const exportados = [...new Set(parse(fuente)[1].map((entrada) => entrada.n))].sort()
const catalogados = CATALOGO_EXPORTS.map((entrada) => entrada.nombre)
const catalogadosUnicos = [...new Set(catalogados)]
const faltantes = exportados.filter((nombre) => !catalogadosUnicos.includes(nombre))
const sobrantes = catalogadosUnicos.filter((nombre) => !exportados.includes(nombre))
const duplicados = catalogados.filter((nombre, indice) => catalogados.indexOf(nombre) !== indice)
const PRESENTACIONES = new Set([
  'acciones',
  'campos',
  'datos',
  'estados',
  'seleccion',
  'bancos',
  'pagos',
  'telefono',
  'footer',
  'prefooter',
  'ia',
  'bancos-pagos',
  'telefono-py',
  'ciudad-departamento',
  'cliente-ci-ruc',
])
const PRIORIDAD_ESPERADA = [
  ['bancos-pagos', 'BancoCombobox', 1],
  ['telefono-py', 'PhoneField', 2],
  ['ciudad-departamento', 'CityAutocomplete', 3],
  ['cliente-ci-ruc', 'RucField', 4],
]

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
const prioridadActual = DESTACADOS_CATALOGO.map((item) => [item.destacado.id, item.nombre, item.destacado.prioridad])
const prioridadInvalida = JSON.stringify(prioridadActual) === JSON.stringify(PRIORIDAD_ESPERADA)
  ? []
  : [{ esperada: PRIORIDAD_ESPERADA, actual: prioridadActual }]
const categoriasPrioritarias = [...new Set(DESTACADOS_CATALOGO.map((item) => item.categoria))]
const ordenCategoriasInvalido = categoriasPrioritarias.every((categoria, indice) => CATEGORIAS_CATALOGO[indice] === categoria)
  ? []
  : [{ esperadas: categoriasPrioritarias, actuales: CATEGORIAS_CATALOGO.slice(0, categoriasPrioritarias.length) }]

const erroresFinancieros = []
if (BANCO_DESTACADO !== 'ueno bank' || BANCOS_PREVIEW[0] !== BANCO_DESTACADO) erroresFinancieros.push('ueno bank debe liderar bancos-pagos')
if (BANCOS_PREVIEW.length !== BANCOS_PARAGUAY.length || BANCOS_PARAGUAY.some((nombre) => !BANCOS_PREVIEW.includes(nombre))) {
  erroresFinancieros.push('la revisión bancaria debe incluir las 24 instituciones del catálogo')
}
if (JSON.stringify(MARCAS_CONECTADAS_PREVIEW) !== JSON.stringify(['Mango', 'Vaquita', 'EKO', 'eCLUB', 'Pik'])) {
  erroresFinancieros.push('el orden de marcas conectadas debe ser Mango > Vaquita > EKO > eCLUB > Pik')
}
if (JSON.stringify(SOLUCIONES_PAGO_COMERCIOS_PREVIEW.marcas) !== JSON.stringify(['Bancard', 'Dinelco', 'upay', 'Pik'])) {
  erroresFinancieros.push('el grupo funcional de comercios debe ser Bancard > Dinelco > upay > Pik')
}
for (const marca of SOLUCIONES_PAGO_COMERCIOS_PREVIEW.marcas) {
  for (const variante of ['compacto', 'horizontal']) {
    if (!logoDeMedioPago(marca, variante)?.visual?.empaquetado) erroresFinancieros.push(`pago:${marca}:${variante} falta en el grupo funcional`)
  }
}
for (const marca of MARCAS_CONECTADAS_PREVIEW) {
  if (!relacionFinancieraDe(marca)) erroresFinancieros.push(`pago:${marca} no tiene relación financiera verificable`)
}
for (const [grupo, nombres, resolver] of [
  ['banco', BANCOS_PREVIEW, logoDeBanco],
  ['pago', MARCAS_PAGO_PREVIEW, logoDeMedioPago],
]) {
  if (new Set(nombres).size !== nombres.length) erroresFinancieros.push(`${grupo}: fixtures duplicados`)
  for (const nombre of nombres) {
    for (const variante of ['compacto', 'horizontal']) {
      const visual = resolver(nombre, variante)?.visual
      if (!visual?.empaquetado || !['archivo', 'horizontal-contained', 'marca-contained'].includes(visual.tipo)) {
        const bloqueo = BLOQUEOS_ASSETS_FINANCIEROS.some((item) => item.catalogo === grupo && item.id === nombre && (!item.variante || item.variante === variante))
        if (grupo !== 'banco' || visual?.tipo !== 'texto' || !bloqueo) erroresFinancieros.push(`${grupo}:${nombre}:${variante} no resuelve un asset local ni un bloqueo explícito`)
      }
    }
  }
}

if (faltantes.length || sobrantes.length || duplicados.length || erroresVisuales.length || erroresApi.length || presentacionesInvalidas.length || prioridadInvalida.length || ordenCategoriasInvalido.length || erroresFinancieros.length) {
  console.error(JSON.stringify({ faltantes, sobrantes, duplicados, erroresVisuales, erroresApi, presentacionesInvalidas, prioridadInvalida, ordenCategoriasInvalido, erroresFinancieros }, null, 2))
  process.exit(1)
}

const api = exportados.length - visuales.length
const vistas = CATALOGO_EXPORTS.filter((item) => item.presentacion).length
console.log(`gallery coverage ok: ${exportados.length} exports · ${visuales.length} visuales · ${api} API · ${vistas} vistas curadas · prioridad ${prioridadActual.map(([id]) => id).join(' > ')} · ${BANCOS_PREVIEW.length} bancos y ${MARCAS_PAGO_PREVIEW.length} pagos reales`)
