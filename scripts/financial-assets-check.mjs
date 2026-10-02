import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pngMetrics, gifMetrics } from './financial-raster-audit.mjs'
import { LOGOS_BANCOS } from '../src/utils/bancos.js'
import { MARCAS_MEDIOS_PAGO } from '../src/utils/mediosPago.js'
import { BLOQUEOS_ASSETS_FINANCIEROS } from '../src/utils/financialAssets.js'
import { auditSvg } from './financial-svg-audit.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsRoot = path.join(root, 'src/assets/financial')
const manifest = JSON.parse(await readFile(path.join(root, 'docs/financial-assets-manifest.json'), 'utf8'))
const errors = []

// Explicit first-party limitations kept visible without weakening checks for new assets.
const QUALITY_EXCEPTIONS = new Set([
  'pago:Procard:compacto:min-raster',
  'pago:Procard:horizontal:min-raster',
  'pago:PayPro:compacto:transparent-canvas',
  'pago:PayPro:horizontal:horizontal-ratio',
  'pago:PayPro:horizontal:transparent-canvas',
  'pago:Zimple:horizontal:horizontal-ratio',
])

function qualityException(catalogo, nombre, variante, rule) {
  return QUALITY_EXCEPTIONS.has(`${catalogo}:${nombre}:${variante}:${rule}`)
}

async function walk(directory, prefix = '') {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) output.push(...await walk(path.join(directory, entry.name), relative))
    else if (!/ \d+\.[^/]+$/.test(relative)) output.push(relative)
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
  if (asset.sourceKind === 'official-first-party') {
    if (!/^https:\/\//.test(asset.sourceUrl)) errors.push(`${asset.file}: sourceUrl no oficial/HTTPS`)
    if (asset.sourceRef) errors.push(`${asset.file}: fuente oficial no debe usar sourceRef`)
  } else if (asset.sourceKind === 'user-provided-reference') {
    if (!/^codex-clipboard-[\w.-]+$/.test(asset.sourceRef || '')) errors.push(`${asset.file}: referencia local de usuario ausente`)
    if (asset.sourceUrl) errors.push(`${asset.file}: referencia de usuario no debe fingir URL oficial`)
  } else {
    errors.push(`${asset.file}: sourceKind inválido`)
  }
  if (asset.retrievedAt === '2026-10-02' && (!Number.isFinite(asset.dimensions?.width) || asset.dimensions.width <= 0 || !Number.isFinite(asset.dimensions?.height) || asset.dimensions.height <= 0)) errors.push(`${asset.file}: dimensiones verificadas ausentes o inválidas`)
  if (asset.sourceSha256 && (!/^[a-f0-9]{64}$/.test(asset.sourceSha256) || !asset.transformation || asset.sourceSha256 === asset.sha256)) errors.push(`${asset.file}: fuente original o transformación SVG incorrecta`)
  if (asset.sourceFile) {
    if (!/^docs\/financial-originals\/[a-z_]+\.(png|pdf)$/.test(asset.sourceFile)) errors.push(`${asset.file}: ruta de original retenido inválida`)
    else {
      try {
        const retained = await readFile(path.join(root, asset.sourceFile))
        if (createHash('sha256').update(retained).digest('hex') !== asset.sourceSha256) errors.push(`${asset.file}: hash de original retenido no coincide`)
      } catch { errors.push(`${asset.file}: original retenido ausente`) }
    }
  }
  if (asset.sourceIdentity) {
    if (!/^[a-f0-9]{64}$/.test(asset.sourceIdentity.sha256 || '')) errors.push(`${asset.file}: sha256 de fuente original inválido`)
    if (!Number.isInteger(asset.sourceIdentity.pixelWidth) || asset.sourceIdentity.pixelWidth < 1) errors.push(`${asset.file}: ancho de fuente original inválido`)
    if (!Number.isInteger(asset.sourceIdentity.pixelHeight) || asset.sourceIdentity.pixelHeight < 1) errors.push(`${asset.file}: alto de fuente original inválido`)
    if (asset.sourceIdentity.sha256 === asset.sha256) errors.push(`${asset.file}: fuente original y derivado runtime no están diferenciados`)
    if (!asset.transformation) errors.push(`${asset.file}: derivado runtime sin transformación documentada`)
  }
  if (!['2026-10-01', '2026-10-02'].includes(asset.retrievedAt) || asset.authorization?.confirmedAt !== '2026-10-01') errors.push(`${asset.file}: fecha de evidencia incorrecta`)
  if (asset.authorization?.basis !== 'User-provided written authorization') errors.push(`${asset.file}: base de autorización ausente`)
  if (!asset.authorization?.scope?.includes('Public GitHub repository dariodeoli/owncoding-ui') || !asset.authorization?.scope?.includes('Own UI / OwnCoding website and gallery')) errors.push(`${asset.file}: alcance incompleto`)
  if (!referenced.has(asset.file)) errors.push(`${asset.file}: asset sin variante real referenciada`)
  if (asset.file.endsWith('.svg')) errors.push(...auditSvg(asset.file, source))
  if (asset.file.endsWith('.png') && !source.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) errors.push(`${asset.file}: firma PNG inválida`)
  if (asset.file.endsWith('.webp') && source.subarray(8, 12).toString() !== 'WEBP') errors.push(`${asset.file}: firma WebP inválida`)
  if (asset.file.endsWith('.gif')) {
    try { gifMetrics(source) } catch (error) { errors.push(`${asset.file}: GIF inválido: ${error.message}`) }
  }
  if (asset.file.endsWith('.ico') && !source.subarray(0, 4).equals(Buffer.from([0, 0, 1, 0]))) errors.push(`${asset.file}: firma ICO inválida`)
}

function svgMetrics(source) {
  const text = source.toString('utf8')
  const viewBox = text.match(/\bviewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i)
  if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) }
  const width = text.match(/\bwidth=["']([\d.]+)/i)
  const height = text.match(/\bheight=["']([\d.]+)/i)
  return { width: Number(width?.[1]), height: Number(height?.[1]) }
}

async function checkVariantQuality(catalogo, nombre, registro) {
  if (!registro.variantes || registro.redirigeA) return
  const compacto = registro.variantes.compacto
  const horizontal = registro.variantes.horizontal
  const containedCompact = compacto?.tipo === 'horizontal-contained'
  const containedHorizontal = horizontal?.tipo === 'marca-contained'
  if (!containedCompact && !containedHorizontal && compacto?.empaquetado && compacto.empaquetado === horizontal?.empaquetado) errors.push(`${catalogo} ${nombre}: variantes reutilizan el mismo asset`)
  for (const [variante, visual] of Object.entries(registro.variantes)) {
    if (!visual?.empaquetado) continue
    const source = await readFile(path.join(assetsRoot, visual.empaquetado))
    const metrics = visual.empaquetado.endsWith('.svg') ? svgMetrics(source) : visual.empaquetado.endsWith('.png') ? pngMetrics(source) : visual.empaquetado.endsWith('.gif') ? gifMetrics(source) : null
    if (catalogo === 'banco' && ['horizontal-contained', 'marca-contained'].includes(visual.tipo)) {
      if (!visual.descripcion || !visual.descripcion.includes('contenida')) errors.push(`${catalogo} ${nombre}: presentación contenida sin descripción honesta`)
      if ((visual.tipo === 'horizontal-contained' && (variante !== 'compacto' || metrics?.width / metrics?.height < 1.4)) || (visual.tipo === 'marca-contained' && (variante !== 'horizontal' || metrics?.width / metrics?.height >= 1.4))) errors.push(`${catalogo} ${nombre}: presentación contenida incompatible con su slot`)
    }
    if (!metrics?.width || !metrics?.height) continue
    const assetMetadata = manifest.assets.find((item) => item.file === visual.empaquetado)
    if (assetMetadata?.dimensions && (assetMetadata.dimensions.width !== metrics.width || assetMetadata.dimensions.height !== metrics.height)) errors.push(`${catalogo} ${nombre}: dimensiones del manifest no coinciden`)
    const ratio = metrics.width / metrics.height
    if (variante === 'compacto' && !containedCompact && (ratio < 0.5 || ratio > 2)) errors.push(`${catalogo} ${nombre}: compacto fuera de proporción (${ratio.toFixed(2)})`)
    if (variante === 'horizontal' && !containedHorizontal && ratio < 1.4 && !qualityException(catalogo, nombre, variante, 'horizontal-ratio')) errors.push(`${catalogo} ${nombre}: horizontal fuera de proporción (${ratio.toFixed(2)})`)
    if (/\.(png|gif)$/.test(visual.empaquetado)) {
      const minimum = variante === 'compacto' ? 64 : 56
      if (Math.min(metrics.width, metrics.height) < minimum && !qualityException(catalogo, nombre, variante, 'min-raster')) errors.push(`${catalogo} ${nombre}: ${variante} raster menor a ${minimum}px`)
      if (metrics.transparentCoverage !== null && metrics.transparentCoverage < 0.55 && !qualityException(catalogo, nombre, variante, 'transparent-canvas')) errors.push(`${catalogo} ${nombre}: ${variante} conserva canvas transparente excesivo`)
      const asset = manifest.assets.find((item) => item.file === visual.empaquetado)
      if (asset?.sourceIdentity && (metrics.width > asset.sourceIdentity.pixelWidth || metrics.height > asset.sourceIdentity.pixelHeight)) errors.push(`${catalogo} ${nombre}: derivado runtime fue ampliado`)
    }
  }
}

for (const [nombre, registro] of Object.entries(LOGOS_BANCOS)) await checkVariantQuality('banco', nombre, registro)
for (const [nombre, registro] of Object.entries(MARCAS_MEDIOS_PAGO)) await checkVariantQuality('pago', nombre, registro)

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
