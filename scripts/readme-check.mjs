import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATALOGO_EXPORTS, DESTACADOS_CATALOGO } from '../gallery/catalog.js'
import { CIUDADES_PARAGUAY } from '../src/catalog/ciudades.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const readmePath = path.join(root, 'README.md')
const readme = await readFile(readmePath, 'utf8')
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))

const errores = []
const fallar = (mensaje) => errores.push(mensaje)

const referencias = new Set()
for (const match of readme.matchAll(/!?(?:\[[^\]]*\])\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) referencias.add(match[1])
for (const match of readme.matchAll(/<(?:a|img)\b[^>]*(?:href|src)="([^"]+)"[^>]*>/g)) referencias.add(match[1])

for (const referencia of referencias) {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(referencia)) continue
  const limpia = decodeURIComponent(referencia.split(/[?#]/, 1)[0])
  const destino = path.resolve(root, limpia)
  if (destino !== root && !destino.startsWith(`${root}${path.sep}`)) {
    fallar(`referencia fuera del repositorio: ${referencia}`)
    continue
  }
  try {
    await stat(destino)
  } catch {
    fallar(`referencia local inexistente: ${referencia}`)
  }
}

const total = CATALOGO_EXPORTS.length
const visuales = CATALOGO_EXPORTS.filter((item) => item.tipo === 'visual').length
const api = total - visuales
const vistas = CATALOGO_EXPORTS.filter((item) => item.tipo === 'visual' && item.presentacion).length
const categorias = new Set(CATALOGO_EXPORTS.map((item) => item.categoria)).size
const métricas = [
  ['exports de la entrada raíz', total],
  ['exports visuales', visuales],
  ['API, modelos y utilidades', api],
  ['vistas curadas', vistas],
  ['categorías del catálogo', categorias],
]

for (const [etiqueta, valor] of métricas) {
  if (!readme.includes(`**${valor}**`)) fallar(`métrica ausente o desactualizada (${etiqueta}): ${valor}`)
}

const version = packageJson.version
if (!readme.includes(`v${version}`)) fallar(`README no referencia la versión actual: v${version}`)
if (!readme.includes(`versi%C3%B3n-${version}-`)) fallar(`badge de versión desactualizado: ${version}`)
if (!readme.includes('https://controlaria.online')) fallar('falta el destino de la galería')
if (!/Estado verificado el \d{4}-\d{2}-\d{2}/.test(readme)) fallar('falta fecha de evidencia de publicación')
if (!readme.includes('https://controlaria.online/status.json') || !/build `[a-f0-9]{40}`/.test(readme)) fallar('falta evidencia de status.json y build publicado')
if (!readme.includes('HTTP 200') || !readme.includes('fixtures locales')) fallar('falta evidencia HTTP o limitación de demostraciones locales')

const previews = [
  'docs/assets/readme-hero.svg',
  'docs/assets/readme-financial.svg',
  'docs/assets/readme-phone.svg',
  'docs/assets/readme-smart-inputs.svg',
  'docs/assets/readme-components.svg',
  'docs/assets/readme-identity.svg',
]

for (const preview of previews) {
  const contenido = await readFile(path.join(root, preview), 'utf8')
  if (!readme.includes(preview)) fallar(`preview no referenciado desde README: ${preview}`)
  if (!/<svg\b[^>]*\brole="img"/.test(contenido)) fallar(`SVG sin role=img: ${preview}`)
  if (!/<title\b/.test(contenido) || !/<desc\b/.test(contenido)) fallar(`SVG sin title/desc: ${preview}`)
  if (/<script\b|\bon\w+\s*=|@import|https?:\/\//i.test(contenido.replace('http://www.w3.org/2000/svg', ''))) {
    fallar(`SVG contiene script, handler o referencia externa: ${preview}`)
  }
}

const financialPreview = await readFile(path.join(root, 'docs/assets/readme-financial.svg'), 'utf8')
const financialAssets = [...financialPreview.matchAll(/<image\b[^>]*data-financial-asset="([^"]+)"[^>]*href="(data:image\/[^"]+)"/g)]
const requiredFinancialAssets = [
  'bancos/ueno-compacto.svg',
  'bancos/ueno-horizontal.svg',
  'bancos/basa-horizontal.svg',
  'pagos/bancard-horizontal.png',
  'pagos/dinelco-horizontal.svg',
  'pagos/upay-horizontal.svg',
  'pagos/pagopar-horizontal.svg',
  'pagos/mango-horizontal.svg',
  'pagos/vaquita-horizontal.png',
  'pagos/eko-horizontal.svg',
  'pagos/eclub-horizontal.svg',
  'pagos/pik-horizontal.svg',
]
if (financialAssets.length < requiredFinancialAssets.length) fallar('preview financiero no contiene suficientes logos reales embebidos')
for (const required of requiredFinancialAssets) {
  if (!financialAssets.some(([_, file]) => file === required)) fallar(`preview financiero sin asset real: ${required}`)
}
for (const [_, file, dataUrl] of financialAssets) {
  const payload = dataUrl.split(',', 2)[1]
  if (!payload || !/;base64,/.test(dataUrl) || Buffer.from(payload, 'base64').byteLength < 100) fallar(`asset embebido inválido: ${file}`)
}
if (/<image\b[^>]*href="https?:/i.test(financialPreview)) fallar('preview financiero contiene un hotlink')

const smartInputs = await readFile(path.join(root, 'docs/assets/readme-smart-inputs.svg'), 'utf8')
const fixturesCiudad = [...smartInputs.matchAll(/<g\b[^>]*data-city-fixture="([^"]+)"[^>]*data-department-fixture="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)]
if (fixturesCiudad.length === 0) fallar('preview de ciudad sin fixtures verificables')
for (const [, ciudad, departamento, contenido] of fixturesCiudad) {
  const existe = CIUDADES_PARAGUAY.some((item) => item.ciudad === ciudad && item.departamento === departamento)
  if (!existe) fallar(`fixture de ciudad fuera de CIUDADES_PARAGUAY: ${ciudad} · ${departamento}`)
  if (!contenido.includes(`>${ciudad}</text>`) || !contenido.includes(`>${departamento}</text>`)) {
    fallar(`fixture de ciudad no coincide con el texto visible: ${ciudad} · ${departamento}`)
  }
}

const previewsPrioritarios = previews.slice(1, 4)
let indiceAnterior = -1
for (const preview of previewsPrioritarios) {
  const indice = readme.indexOf(preview)
  if (indice <= indiceAnterior) fallar(`orden de previews prioritarios incorrecto: ${previewsPrioritarios.join(' > ')}`)
  indiceAnterior = indice
}

const idsDestacados = DESTACADOS_CATALOGO.map((item) => item.destacado.id)
for (const id of idsDestacados) {
  if (!readme.includes(`\`${id}\``)) fallar(`README no documenta el preview prioritario: ${id}`)
}

const hero = await readFile(path.join(root, previews[0]), 'utf8')
for (const dato of [`${total} exports`, `${visuales} visuales`, `${categorias} categorías`, `v${version}`]) {
  if (!hero.includes(dato)) fallar(`hero desactualizado: ${dato}`)
}
const componentes = await readFile(path.join(root, 'docs/assets/readme-components.svg'), 'utf8')
if (!componentes.includes(`>${visuales}</text>`)) fallar(`preview de componentes desactualizado: ${visuales} visuales`)

if (errores.length > 0) {
  console.error(`readme check failed (${errores.length})`)
  for (const error of errores) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`readme ok: ${referencias.size} referencias · ${previews.length} previews · v${version} · ${total} exports`)
