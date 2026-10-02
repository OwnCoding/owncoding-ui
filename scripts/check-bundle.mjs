import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { execNpmSync } from './npm-command.mjs'

const budgets = {
  'dist/index.js': { raw: 2_600_000, gzip: 1_500_000 },
  'dist/utils.js': { raw: 165_000, gzip: 42_000 },
  'dist/ia.js': { raw: 20_000, gzip: 6_000 },
  'dist/phone.js': { raw: 35_000, gzip: 11_000 },
  // Includes 72 authorized assets, including two unmodified user PNG originals.
  // Measured baseline and bounded headroom: docs/BUNDLE-BUDGETS.md.
  'dist/financial.js': { raw: 2_010_000, gzip: 1_360_000 },
  'dist/financial-metadata.js': { raw: 42_000, gzip: 9_000 },
  'dist/app-identity.js': { raw: 3_000, gzip: 1_500 },
  'dist/email.js': { raw: 9_000, gzip: 3_500 },
}

let fallo = false
for (const [archivo, limite] of Object.entries(budgets)) {
  const contenido = readFileSync(archivo)
  const tamanos = { raw: contenido.byteLength, gzip: gzipSync(contenido).byteLength }
  const excedidos = Object.entries(tamanos).filter(([tipo, bytes]) => bytes > limite[tipo])
  console.log(`${archivo}: ${tamanos.raw} B raw / ${tamanos.gzip} B gzip (budget ${limite.raw}/${limite.gzip})`)
  if (excedidos.length) {
    fallo = true
    for (const [tipo, bytes] of excedidos) console.error(`  ${tipo} excede por ${bytes - limite[tipo]} B`)
  }
}

if (fallo) process.exitCode = 1

const [{ size, unpackedSize, entryCount, files }] = JSON.parse(
  execNpmSync(['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' }),
)
const duplicateArtifacts = files.filter(({ path }) => / \d+\.[^/]+$/.test(path))
if (duplicateArtifacts.length) {
  console.error(`npm package contiene ${duplicateArtifacts.length} copias locales numeradas`)
  process.exitCode = 1
}
const paquete = { packed: size, unpacked: unpackedSize }
// The two original PNGs ship in source and inline financial/root bundles.
// Only affected budgets move; finite headroom remains approximately 2%.
const limitePaquete = { packed: 5_250_000, unpacked: 10_010_000 }
console.log(`npm package: ${paquete.packed} B packed / ${paquete.unpacked} B unpacked / ${entryCount} entries (budget ${limitePaquete.packed}/${limitePaquete.unpacked})`)
for (const [tipo, bytes] of Object.entries(paquete)) {
  if (bytes > limitePaquete[tipo]) {
    console.error(`  package ${tipo} excede por ${bytes - limitePaquete[tipo]} B`)
    process.exitCode = 1
  }
}
