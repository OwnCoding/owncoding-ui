import React from 'react'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import BancoLogo from '../src/components/BancoLogo.jsx'
import { LOGOS_BANCOS } from '../src/utils/bancos.js'
import { pngMetrics } from '../scripts/financial-raster-audit.mjs'

describe('Atlas supplied compact artwork', () => {
  test('uses the unchanged supplied PNG with explicit user-reference provenance', () => {
    const manifest = JSON.parse(readFileSync('docs/financial-assets-manifest.json', 'utf8'))
    const asset = manifest.assets.find((entry) => entry.id === 'bancos-atlas-compacto')
    const bytes = readFileSync(`src/assets/financial/${asset.file}`)
    expect(asset.sourceKind).toBe('user-provided-reference')
    expect(asset.sourceRef).toBe('codex-clipboard-d80103e5-64fa-47fc-8a60-3bf5d7207947.png')
    expect(asset.sourceUrl).toBeUndefined()
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256)
    expect(asset.sha256).toBe('6c05be7036f398184fc8761b9d634d057970062fc38c3c3ab64e05b9b76f9bb5')
    expect(pngMetrics(bytes)).toMatchObject({ width: 512, height: 512 })
    expect(pngMetrics(bytes).transparentCoverage).toBeGreaterThan(0.55)
    expect(LOGOS_BANCOS['Banco Atlas'].variantes.compacto.empaquetado).toBe('bancos/atlas-compacto.png')
  })

  test('renders the new compact PNG and preserves horizontal white artwork', () => {
    const compact = renderToStaticMarkup(<BancoLogo banco="Banco Atlas" variante="compacto" />)
    expect(compact).toContain('atlas-compacto.png')
    expect(compact).not.toContain('background-color:')
    expect(LOGOS_BANCOS['Banco Atlas'].variantes.compacto.fondo).toBeUndefined()
    expect(LOGOS_BANCOS['Banco Atlas'].variantes.compacto.padding).toBeUndefined()
    expect(compact).not.toContain('atlas-compacto.svg')
    const horizontal = renderToStaticMarkup(<BancoLogo banco="Banco Atlas" variante="horizontal" />)
    expect(horizontal).toContain('atlas-horizontal-blanco.svg')
    expect(horizontal).toContain('background-color:#B20933')
  })
})
