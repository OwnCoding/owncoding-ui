import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { execNpmSync } from './npm-command.mjs'

const budgets = {
  'dist/index.js': { raw: 650_000, gzip: 160_000 },
  'dist/utils.js': { raw: 150_000, gzip: 40_000 },
  'dist/ia.js': { raw: 20_000, gzip: 6_000 },
  'dist/phone.js': { raw: 35_000, gzip: 11_000 },
  // Sin licencias/autorizaciones explícitas no hay bytes de terceros; este
  // presupuesto evita reintroducirlos accidentalmente en el subpath visual.
  'dist/financial.js': { raw: 45_000, gzip: 10_000 },
  'dist/financial-metadata.js': { raw: 27_000, gzip: 7_000 },
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

const [{ size, unpackedSize, entryCount }] = JSON.parse(
  execNpmSync(['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' }),
)
const paquete = { packed: size, unpacked: unpackedSize }
// v0.58/v0.59 incorporaron evidencia visual de QA (CargaIA y a11y ronda 13)
// dentro de docs/qa. El presupuesto contempla esos recibos publicados sin
// relajar los límites de cada bundle ejecutable definidos arriba.
const limitePaquete = { packed: 2_100_000, unpacked: 5_500_000 }
console.log(`npm package: ${paquete.packed} B packed / ${paquete.unpacked} B unpacked / ${entryCount} entries (budget ${limitePaquete.packed}/${limitePaquete.unpacked})`)
for (const [tipo, bytes] of Object.entries(paquete)) {
  if (bytes > limitePaquete[tipo]) {
    console.error(`  package ${tipo} excede por ${bytes - limitePaquete[tipo]} B`)
    process.exitCode = 1
  }
}
