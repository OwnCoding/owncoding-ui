import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import BancoLogo from '../src/components/BancoLogo.jsx'
import { logoDeBanco } from '../src/utils/bancos.js'

test('BNF keeps both original assets on the same navy presentation surface', () => {
  for (const variant of ['compacto', 'horizontal']) {
    expect(logoDeBanco('BNF', variant).visual.fondo).toBe('#0B1F3A')
    const markup = renderToStaticMarkup(<BancoLogo banco="BNF" variante={variant} />)
    expect(markup).toContain('background-color:#0B1F3A')
  }
  const manifest = JSON.parse(readFileSync(new URL('../docs/financial-assets-manifest.json', import.meta.url)))
  for (const file of ['bnf-compacto.png', 'bnf-horizontal.svg']) {
    const record = manifest.assets.find((entry) => entry.file === `bancos/${file}`)
    const bytes = readFileSync(new URL(`../src/assets/financial/bancos/${file}`, import.meta.url))
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(record.sha256)
  }
  expect(manifest.assets.find((entry) => entry.file === 'bancos/bnf-compacto.png').sha256)
    .toBe('a8b817a247550783edffa8800d64c695987167a42beb0871979b5b9406dbacea')
})
