import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'

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
if (!/No se\s+considera publicado/.test(readme)) fallar('la galería debe conservar su aclaración de despliegue pendiente')

const previews = [
  'docs/assets/readme-hero.svg',
  'docs/assets/readme-components.svg',
  'docs/assets/readme-financial-phone.svg',
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

const hero = await readFile(path.join(root, previews[0]), 'utf8')
for (const dato of [`${total} exports`, `${visuales} visuales`, `${categorias} categorías`, `v${version}`]) {
  if (!hero.includes(dato)) fallar(`hero desactualizado: ${dato}`)
}

if (errores.length > 0) {
  console.error(`readme check failed (${errores.length})`)
  for (const error of errores) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`readme ok: ${referencias.size} referencias · ${previews.length} previews · v${version} · ${total} exports`)
