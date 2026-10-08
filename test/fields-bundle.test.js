import { describe, it, expect } from 'vitest'
import { build } from 'esbuild'
import { gzipSync } from 'node:zlib'

describe('public fields artifact closure', () => {
  it('keeps field APIs identical to root exports', async () => {
    const root = await import('../dist/index.js')
    const fields = await import('../dist/fields.js')
    for (const name of ['CityAutocomplete', 'PhoneField', 'EmailField']) {
      expect(typeof fields[name]).toBe('function')
      expect(fields[name]).toBe(root[name])
    }
  })

  it.each([['owncoding-ui', 65_000], ['owncoding-ui/fields', 60_000]])('bundles real fields through %s without financial artwork', async (entry, budget) => {
    const result = await build({
      stdin: { contents: `export { CityAutocomplete, PhoneField, EmailField } from '${entry}'`, resolveDir: process.cwd() },
      bundle: true, format: 'esm', platform: 'browser', minify: true, write: false, metafile: true,
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    })
    const output = result.outputFiles[0].contents
    expect(Buffer.from(output).toString()).not.toContain('AUTORIZACION_ASSETS_FINANCIEROS')
    expect(Buffer.from(output).toString()).not.toContain('data:image/png;base64')
    expect(gzipSync(output, { level: 9 }).length).toBeLessThan(budget)
    const entryPath = entry.endsWith('/fields') ? /(^|\/)dist\/fields\.js$/ : /(^|\/)dist\/index\.js$/
    expect(Object.keys(result.metafile.inputs).some(path => entryPath.test(path))).toBe(true)
  })
})
