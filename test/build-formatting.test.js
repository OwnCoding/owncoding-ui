import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import { expect, test } from 'vitest'
import * as source from '../src/index.js'
import * as published from '../dist/index.js'

const entries = ['index', 'financial', 'phone', 'utils', 'ia', 'financial-metadata', 'app-identity', 'email']

test('whitespace-only build policy leaves identifier and syntax minification disabled', () => {
  const script = readFileSync('scripts/build.mjs', 'utf8')
  expect(script).toContain('minifyWhitespace: true')
  expect(script).toContain('minifyIdentifiers: false')
  expect(script).toContain('minifySyntax: false')
  expect(script).toContain('sourcemap: true')
  expect(script).not.toMatch(/\b(?:minify|mangleProps|drop):/)
})

test('published exports, representative names and linked source maps survive formatting', () => {
  expect(Object.keys(published).sort()).toEqual(Object.keys(source).sort())
  expect(published.Button.name).toBe(source.Button.name)
  expect(published.formatGs.name).toBe(source.formatGs.name)
  for (const entry of entries) {
    const text = readFileSync(`dist/${entry}.js`, 'utf8')
    expect(text).toContain(`//# sourceMappingURL=${entry}.js.map`)
    const map = JSON.parse(readFileSync(`dist/${entry}.js.map`, 'utf8'))
    expect(map.version).toBe(3)
    expect(map.sources).toHaveLength(map.sourcesContent.length)
    // A re-export-only facade has no mapped local source; its chunk owns it.
    if (entry === 'financial') expect(map.sources).toEqual([])
    else {
      expect(map.mappings.length).toBeGreaterThan(0)
      expect(map.sourcesContent.some(content => content?.length > 0)).toBe(true)
    }
  }
})

test('consumer bundling still tree-shakes unused utility exports', async () => {
  const output = await build({
    stdin: { contents: "export { formatGs } from './dist/utils.js'", resolveDir: resolve('.') },
    bundle: true, format: 'esm', platform: 'neutral', write: false,
  })
  const text = output.outputFiles[0].text
  expect(text).toContain('formatGs')
  expect(text).not.toContain('AVISO_REFRESCO')
  expect(text).not.toContain('data:image/')
  expect(text).not.toContain('use client')
})
