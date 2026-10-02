import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
import { COOPERATIVAS_PARAGUAY } from '../src/utils/bancos.js'
import * as fixtures from '../gallery/financial-fixtures.js'

test('gallery review enlarges all thirteen cooperatives and whitespace-heavy GNB without changing ordinary selectors', () => {
  expect(fixtures.bankReviewSize).toBeTypeOf('function')
  expect(COOPERATIVAS_PARAGUAY).toHaveLength(13)
  for (const name of COOPERATIVAS_PARAGUAY) {
    expect(fixtures.bankReviewSize(name, 'compacto')).toBe(name === 'San Cristóbal' ? 'h-28' : 'h-24')
    expect(fixtures.bankReviewSize(name, 'horizontal')).toBe('h-20')
  }
  expect(fixtures.bankReviewSize('Banco GNB Paraguay', 'compacto')).toBe('h-28')
  expect(fixtures.bankReviewSize('Banco Atlas', 'compacto')).toBe('h-12')
  const source = readFileSync(new URL('../gallery/main.jsx', import.meta.url), 'utf8')
  expect(source).toContain('alto={bankReviewSize(nombre, variante)}')
  expect(source).toContain('data-bank-review-size')
})

test('all existing originals retain their manifest hashes after presentation changes', () => {
  const manifest = JSON.parse(readFileSync(new URL('../docs/financial-assets-manifest.json', import.meta.url)))
  for (const record of manifest.assets) {
    const bytes = readFileSync(new URL(`../src/assets/financial/${record.file}`, import.meta.url))
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(record.sha256)
  }
})
