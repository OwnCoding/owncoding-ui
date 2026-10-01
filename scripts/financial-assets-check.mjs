import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LOGOS_BANCOS } from '../src/utils/bancos.js'
import { MARCAS_MEDIOS_PAGO } from '../src/utils/mediosPago.js'
import { BLOQUEOS_ASSETS_FINANCIEROS } from '../src/utils/financialAssets.js'
import { auditSvg } from './financial-svg-audit.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsRoot = path.join(root, 'src/assets/financial')
const manifest = JSON.parse(await readFile(path.join(root, 'docs/financial-assets-manifest.json'), 'utf8'))
const errors = []

async function walk(directory, prefix = '') {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) output.push(...await walk(path.join(directory, entry.name), relative))
    else output.push(relative)
  }
  return output
}

const records = [...Object.values(LOGOS_BANCOS), ...Object.values(MARCAS_MEDIOS_PAGO)]
const referenced = new Set(records.flatMap((record) => Object.values(record.variantes || {}).map((variant) => variant?.empaquetado)).filter(Boolean))
const files = (await walk(assetsRoot)).sort()
const manifestFiles = manifest.assets.map((asset) => asset.file).sort()
if (JSON.stringify(files) !== JSON.stringify(manifestFiles)) errors.push('manifest y directorio de assets no coinciden')

for (const asset of manifest.assets) {
  const source = await readFile(path.join(assetsRoot, asset.file))
  const digest = createHash('sha256').update(source).digest('hex')
  if (digest !== asset.sha256) errors.push(`${asset.file}: sha256 no coincide`)
  if (!/^https:\/\//.test(asset.sourceUrl)) errors.push(`${asset.file}: sourceUrl no oficial/HTTPS`)
  if (asset.retrievedAt !== '2026-10-01' || asset.authorization?.confirmedAt !== '2026-10-01') errors.push(`${asset.file}: fecha de evidencia incorrecta`)
  if (asset.authorization?.basis !== 'User-provided written authorization') errors.push(`${asset.file}: base de autorización ausente`)
  if (!asset.authorization?.scope?.includes('Public GitHub repository dariodeoli/owncoding-ui') || !asset.authorization?.scope?.includes('Own UI / OwnCoding website and gallery')) errors.push(`${asset.file}: alcance incompleto`)
  if (!referenced.has(asset.file)) errors.push(`${asset.file}: asset sin variante real referenciada`)
  if (asset.file.endsWith('.svg')) errors.push(...auditSvg(asset.file, source))
  if (asset.file.endsWith('.png') && !source.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) errors.push(`${asset.file}: firma PNG inválida`)
  if (asset.file.endsWith('.webp') && source.subarray(8, 12).toString() !== 'WEBP') errors.push(`${asset.file}: firma WebP inválida`)
  if (asset.file.endsWith('.ico') && !source.subarray(0, 4).equals(Buffer.from([0, 0, 1, 0]))) errors.push(`${asset.file}: firma ICO inválida`)
}

for (const key of referenced) if (!manifestFiles.includes(key)) errors.push(`${key}: variante sin procedencia en manifest`)
const codeBlockers = BLOQUEOS_ASSETS_FINANCIEROS.map(({ catalogo, id, variante = '' }) => `${catalogo}:${id}:${variante}`).sort()
const docBlockers = manifest.blockers.map(({ catalog, id, variant = '' }) => `${catalog === 'bank' ? 'banco' : 'pago'}:${id}:${variant}`).sort()
if (JSON.stringify(codeBlockers) !== JSON.stringify(docBlockers)) errors.push('bloqueos del runtime y manifest no coinciden')

if (errors.length) {
  console.error(`financial assets check failed (${errors.length})`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`financial assets ok: ${files.length} archivos · ${referenced.size} variantes referenciadas · ${manifest.blockers.length} bloqueos explícitos`)
