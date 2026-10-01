// Build del paquete: barrel compatible, subpaths granulares cliente/servidor,
// declaraciones y CSS. Los `.d.ts` se mantienen en `types/`, se validan con un
// consumidor TypeScript real y se copian al `dist/` publicado.
import { build } from 'esbuild'
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

// Los assets financieros solo podrían viajar en los bundles visuales si el
// registro documenta permiso de redistribución explícito. Limpiamos outputs
// viejos al pasar cualquier marca a fallback por falta de evidencia.
rmSync('dist/assets/financial', { recursive: true, force: true })

const opciones = {
  bundle: true,
  format: 'esm',
  target: 'es2020',
  platform: 'neutral',
  jsx: 'automatic',
  sourcemap: true,
  external: ['react', 'react-dom', 'clsx', 'tailwind-merge', 'qrcode', 'libphonenumber-js/min'],
  loader: { '.svg': 'dataurl', '.png': 'dataurl' },
  logLevel: 'info',
}

await build({
  ...opciones,
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  banner: { js: '"use client"' },
})

await build({
  ...opciones,
  entryPoints: ['src/phone/index.js'],
  outfile: 'dist/phone.js',
  banner: { js: '"use client"' },
})

await build({
  ...opciones,
  entryPoints: ['src/financial/index.js'],
  outfile: 'dist/financial.js',
  banner: { js: '"use client"' },
})

// Subpath `owncoding-ui/utils`: la misma lógica pura, sin el banner de cliente
// (Next puede importarla desde el servidor sin `serverExternalPackages`).
await build({
  ...opciones,
  entryPoints: ['src/utils/index.js'],
  outfile: 'dist/utils.js',
})

// Subpath `owncoding-ui/ia`: motor server de «Carga con IA» (#12), sin banner
// de cliente ni React; se importa desde route handlers y server actions.
await build({
  ...opciones,
  entryPoints: ['src/ia/index.js'],
  outfile: 'dist/ia.js',
})

await build({
  ...opciones,
  entryPoints: ['src/financial/metadata.js'],
  outfile: 'dist/financial-metadata.js',
})

await build({
  ...opciones,
  entryPoints: ['src/appIdentity/index.js'],
  outfile: 'dist/app-identity.js',
})

// Presentación transaccional pura: no envía, no lee secretos ni depende de
// React. Los backends conectan este HTML/texto a su relay.
await build({
  ...opciones,
  entryPoints: ['src/email/index.js'],
  outfile: 'dist/email.js',
})

mkdirSync('dist', { recursive: true })
const tokens = readFileSync('src/styles/tokens.css', 'utf8')
const base = readFileSync('src/styles/base.css', 'utf8')
copyFileSync('src/styles/tokens.css', 'dist/tokens.css')
copyFileSync('src/styles/base.css', 'dist/base.css')
// `styles.css` sigue siendo autocontenido (compatible con v0.13.1): se arma
// concatenando, así ninguna herramienta tiene que resolver `@import`.
writeFileSync('dist/styles.css', `${tokens.trimEnd()}\n\n${base}`)
copyFileSync('types/index.d.ts', 'dist/index.d.ts')
copyFileSync('types/utils.d.ts', 'dist/utils.d.ts')
copyFileSync('types/ia.d.ts', 'dist/ia.d.ts')
copyFileSync('types/email.d.ts', 'dist/email.d.ts')
copyFileSync('types/phone.d.ts', 'dist/phone.d.ts')
copyFileSync('types/financial.d.ts', 'dist/financial.d.ts')
copyFileSync('types/financial-metadata.d.ts', 'dist/financial-metadata.d.ts')
copyFileSync('types/app-identity.d.ts', 'dist/app-identity.d.ts')
console.log('build ok: root + ia + granular subpaths + types + CSS')
