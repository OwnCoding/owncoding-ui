// Build del paquete: el bundle principal (`dist/index.js`, con el banner
// `"use client"`), la entrada pura para servidor (`dist/utils.js`, sin banner
// ni React), los tipos declarados y las tres hojas CSS (`styles.css` = tokens +
// base, `tokens.css` sola y `base.css` sola). Sin TypeScript: los `.d.ts` se
// escriben a mano en `types/` y se copian tal cual al `dist/` publicado.
import { build } from 'esbuild'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const opciones = {
  bundle: true,
  format: 'esm',
  target: 'es2020',
  platform: 'neutral',
  jsx: 'automatic',
  sourcemap: true,
  external: ['react', 'react-dom', 'clsx', 'tailwind-merge', 'qrcode'],
  logLevel: 'info',
}

await build({
  ...opciones,
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
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
console.log('build ok: dist/index.js + dist/utils.js + dist/ia.js + dist/index.d.ts + dist/utils.d.ts + dist/ia.d.ts + dist/styles.css + dist/tokens.css + dist/base.css')
