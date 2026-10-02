import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { PREVIEW_GROUPS } from '../gallery/preview-registry.js'

// Account for the complete static import graph, not just a sharded entry file.
const manifest = JSON.parse(readFileSync('site-dist/.vite/manifest.json', 'utf8'))
const entry = Object.keys(manifest).find(key => manifest[key].isEntry && key === 'index.html')
if (!entry) throw new Error('Gallery entry is missing from the Vite manifest')
const eager = new Set()
function visit(key) {
  if (eager.has(key)) return
  if (!manifest[key]) throw new Error(`Unknown static import: ${key}`)
  eager.add(key)
  for (const dependency of manifest[key].imports || []) visit(dependency)
}
visit(entry)
const metrics = [...eager].reduce((total, key) => {
  const item = manifest[key]
  if (!item.file.endsWith('.js')) return total
  const bytes = readFileSync(`site-dist/${item.file}`)
  total.bytes += bytes.length
  total.gzipBytes += gzipSync(bytes).length
  total.files.push(item.file)
  return total
}, { bytes: 0, gzipBytes: 0, files: [] })
for (const group of Object.keys(PREVIEW_GROUPS)) {
  const key = `${group}-previews.jsx`
  if (!manifest[key]?.isDynamicEntry || eager.has(key)) throw new Error(`Secondary preview is not deferred: ${key}`)
}
// Baseline on Node 24: 819,127 bytes / 239,629 gzip bytes. Tighten rather
// than silence Vite's warning or move eager bytes into shared chunks.
if (metrics.bytes > 650000 || metrics.gzipBytes > 190000) throw new Error(`Gallery eager JS budget exceeded: ${JSON.stringify(metrics)}`)
console.log(JSON.stringify({ ...metrics, deferredGroups: Object.keys(PREVIEW_GROUPS) }, null, 2))
