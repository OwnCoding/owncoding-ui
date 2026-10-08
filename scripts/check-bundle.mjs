import { measureClosure } from './bundle-closure.mjs'
import { execNpmSync } from './npm-command.mjs'

const budgets = {
  'dist/index.js': { raw: 3_262_000, gzip: 1_981_000 },
  // New public entry: measured closure 115889/32023, finite <4% headroom.
  'dist/fields.js': { raw: 120_000, gzip: 33_000 },
  'dist/utils.js': { raw: 168_702, gzip: 40_949 },
  'dist/ia.js': { raw: 20_000, gzip: 6_000 },
  'dist/phone.js': { raw: 35_000, gzip: 11_000 },
  // Transitive visual closure with shared original assets; finite ~2% headroom.
  // Pure metadata deltas are separately bounded. See docs/BUNDLE-BUDGETS.md.
  'dist/financial.js': { raw: 2_669_000, gzip: 1_844_000 },
  'dist/financial-metadata.js': { raw: 43_216, gzip: 8_109 },
  'dist/app-identity.js': { raw: 3_000, gzip: 1_500 },
  'dist/email.js': { raw: 9_000, gzip: 3_500 },
}

let fallo = false
for (const [archivo, limite] of Object.entries(budgets)) {
  const { raw, gzip, files } = await measureClosure(archivo, { pure: !['dist/index.js', 'dist/financial.js', 'dist/phone.js', 'dist/fields.js'].includes(archivo) })
  const tamanos = { raw, gzip }
  const excedidos = Object.entries(tamanos).filter(([tipo, bytes]) => bytes > limite[tipo])
  console.log(`${archivo} (${files.length} reachable files): ${tamanos.raw} B raw / ${tamanos.gzip} B gzip (budget ${limite.raw}/${limite.gzip})`)
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
// Shared chunks are included by npm's complete file inventory, never excluded.
// Physical deduplication funds additions; the total package caps do not move.
const limitePaquete = { packed: 5_250_000, unpacked: 10_010_000 }
console.log(`npm package: ${paquete.packed} B packed / ${paquete.unpacked} B unpacked / ${entryCount} entries (budget ${limitePaquete.packed}/${limitePaquete.unpacked})`)
for (const [tipo, bytes] of Object.entries(paquete)) {
  if (bytes > limitePaquete[tipo]) {
    console.error(`  package ${tipo} excede por ${bytes - limitePaquete[tipo]} B`)
    process.exitCode = 1
  }
}
