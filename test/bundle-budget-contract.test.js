import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

const source = readFileSync('scripts/check-bundle.mjs', 'utf8')
const budgets = Object.fromEntries([...source.matchAll(/'([^']+)': \{ raw: ([\d_]+), gzip: ([\d_]+) \}/g)].map(([, name, raw, gzip]) => [name, { raw: Number(raw.replaceAll('_', '')), gzip: Number(gzip.replaceAll('_', '')) }]))

test('shared original artwork and pure metadata have finite measured closure ceilings', () => {
  expect(budgets).toEqual({
    'dist/index.js': { raw: 3262000, gzip: 1981000 },
    'dist/financial.js': { raw: 2669000, gzip: 1844000 },
    'dist/utils.js': { raw: 168702, gzip: 40949 },
    'dist/ia.js': { raw: 20000, gzip: 6000 },
    'dist/phone.js': { raw: 35000, gzip: 11000 },
    'dist/financial-metadata.js': { raw: 43216, gzip: 8109 },
    'dist/app-identity.js': { raw: 3000, gzip: 1500 },
    'dist/email.js': { raw: 9000, gzip: 3500 },
  })
  expect(source).toContain('packed: 5_250_000, unpacked: 10_010_000')
})

test('size and numbered-copy guards remain failures rather than warnings', () => {
  expect(source).toContain('bytes > limite[tipo]')
  expect(source).toContain('bytes > limitePaquete[tipo]')
  expect(source).toContain('if (fallo) process.exitCode = 1')
  expect(source).toContain('if (duplicateArtifacts.length)')
  expect(source.match(/process.exitCode = 1/g)).toHaveLength(3)
  expect(readFileSync('docs/BUNDLE-BUDGETS.md', 'utf8')).toContain('495,372 B')
})
