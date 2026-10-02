import React from 'react'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { BancoLogo, MedioPagoLogo, logoDeBanco, logoDeMedioPago } from '../src/index.js'
const manifest = JSON.parse(readFileSync('docs/financial-assets-manifest.json','utf8'))
const names = ['Capiatá','Ñemby','Lambaré','Coodeñe','Mburicaó','Mercado Nº 4','San Lorenzo']
test.each(names)('%s has genuine local variants, aliases and limited authorization', name => {
  expect(logoDeBanco(`cooperativa ${name}`).banco).toBe(name)
  for (const variant of ['compacto','horizontal']) {
    const record = logoDeBanco(name,variant)
    const asset = manifest.assets.find(asset => asset.file === record.visual.empaquetado)
    expect(asset.sourceUrl).toMatch(/^https:/)
    expect(asset.retrievedAt).toBe('2026-10-02')
    expect(createHash('sha256').update(readFileSync('src/assets/financial/'+asset.file)).digest('hex')).toBe(asset.sha256)
    expect(record.redistribucion.permitida).toBe(true)
    expect(asset.authorization.note).toContain('not represented as an open license')
    const markup = renderToStaticMarkup(<BancoLogo banco={name} variante={variant} />)
    expect(markup).toContain('<img')
    if (record.visual.tipo.endsWith('contained')) { expect(record.visual.descripcion).toContain('contenid'); expect(markup).toContain(record.visual.descripcion) }
  }
})
test.each(['Visa','Mastercard'])('%s uses a verified public original rather than gated artwork claims', name => {
  const compact = logoDeMedioPago(name,'compacto'), horizontal = logoDeMedioPago(name,'horizontal')
  expect(compact.visual.empaquetado).toBe(horizontal.visual.empaquetado)
  expect(compact.estado).toBe('verificado')
  expect(renderToStaticMarkup(<MedioPagoLogo marca={name} variante="horizontal" />)).toContain('<img')
  expect(name === 'Visa' ? compact.visual.tipo : horizontal.visual.tipo).toContain('contained')
})
test('San Lorenzo preserves its compact original without claiming an independent horizontal', () => {
  expect(logoDeBanco('San Lorenzo','horizontal').visual).toMatchObject({ tipo:'marca-contained',empaquetado:'bancos/san-lorenzo-compacto.png' })
  expect(manifest.assets.some(asset => asset.file.includes('san-lorenzo-horizontal'))).toBe(false)
})
test('raw Node root and financial imports SSR-render newly added artwork as data URLs', async () => {
  for (const entry of ['index','financial']) {
    const published = await import(`../dist/${entry}.js`)
    for (const name of names) {
      const markup = renderToStaticMarkup(React.createElement(published.BancoLogo,{banco:name,variante:'horizontal'}))
      expect(markup).toContain('src="data:image/')
      expect(markup).not.toContain('file://')
    }
    for (const name of ['Visa','Mastercard']) expect(renderToStaticMarkup(React.createElement(published.MedioPagoLogo,{marca:name}))).toContain('src="data:image/')
  }
})
test('Mastercard original CRLF and source hash survive Git normalization policy', () => {
  const bytes = readFileSync('src/assets/financial/pagos/mastercard-marca.svg')
  expect(bytes.includes(Buffer.from('\r\n'))).toBe(true)
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(manifest.assets.find(asset => asset.file === 'pagos/mastercard-marca.svg').sha256)
  expect(readFileSync('.gitattributes','utf8')).toContain('src/assets/financial/pagos/mastercard-marca.svg -text whitespace=cr-at-eol')
})
test('published data URL payloads decode to the exact new original source bytes', async () => {
  const published = await import('../dist/financial.js')
  const originalFiles = manifest.assets.filter(asset => /capiata|nemby|lambare|coodene|mburicao|mercado-n4|san-lorenzo|visa-marca|mastercard-marca/.test(asset.file))
  expect(originalFiles).toHaveLength(10)
  for (const asset of originalFiles) {
    const url = published.obtenerAssetFinanciero(asset.file)
    const comma = url.indexOf(',')
    const header = url.slice(0,comma), payload = url.slice(comma+1)
    const decoded = /;base64$/.test(header) ? Buffer.from(payload,'base64') : Buffer.from(decodeURIComponent(payload))
    expect(createHash('sha256').update(decoded).digest('hex')).toBe(asset.sha256)
  }
})
