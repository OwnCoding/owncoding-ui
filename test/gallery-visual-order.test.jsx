// @vitest-environment jsdom
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { AppHeader, PublicHeader, FooterPreset } from '../src/index.js'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'
import { hasInlineGalleryPreview, orderGalleryEntries } from '../gallery/catalog-order.js'
afterEach(cleanup)

describe('rounded composed surfaces', () => {
  it.each([AppHeader, PublicHeader])('header surface has rounded borders without clipping descendants', Header => {
    const { container } = render(<Header title="Demo" />)
    const header = container.querySelector('header')
    expect(header.className).toContain('rounded-xl')
    expect(header.className).not.toMatch(/overflow-(hidden|clip)/)
  })
  it.each(['app', 'auth'])('%s footer preset rounds all painted footer corners', variant => {
    const { container } = render(<FooterPreset variant={variant} name="Demo" />)
    expect(container.querySelector('footer').className).toContain('rounded-xl')
    expect(container.querySelector('footer').className).not.toContain('rounded-b-xl')
    expect(container.querySelector('aside')).toBeNull()
  })
  it('footer preset rounds painted child corners without an overflow mask', () => {
    const { container } = render(<FooterPreset variant="public" name="Demo" />)
    expect(container.querySelector('aside').className).toContain('rounded-t-xl')
    expect(container.querySelector('footer').className).toContain('rounded-b-xl')
    expect(container.firstChild.className).not.toMatch(/overflow-(hidden|clip)/)
  })
})

describe('preview-first catalog', () => {
  it('real inline miniatures precede deferred visual cards', () => {
    const result = orderGalleryEntries(CATALOGO_EXPORTS)
    for (const name of ['Badge', 'Button', 'BancoLogo']) {
      const item = result.find(entry => entry.nombre === name)
      expect(hasInlineGalleryPreview(item)).toBe(true)
      for (const deferredName of ['AppHeader', 'AccountSwitcher']) {
        const deferred = result.find(entry => entry.nombre === deferredName)
        expect(hasInlineGalleryPreview(deferred)).toBe(false)
        expect(result.indexOf(item)).toBeLessThan(result.indexOf(deferred))
      }
    }
    const firstDeferred = result.findIndex(item => item.tipo === 'visual' && !item.destacado && !hasInlineGalleryPreview(item))
    expect(result.slice(firstDeferred).some(hasInlineGalleryPreview)).toBe(false)
  })

  it('all preview entries precede every API, with featured priority unchanged', () => {
    const result = orderGalleryEntries(CATALOGO_EXPORTS)
    expect(result.slice(0, 4).map(item => item.destacado.id)).toEqual(['bancos-pagos', 'telefono-py', 'ciudad-departamento', 'cliente-ci-ruc'])
    const apiIndex = result.findIndex(item => item.tipo === 'api')
    expect(result.slice(0, apiIndex).every(item => item.tipo === 'visual' && item.presentacion)).toBe(true)
    expect(result.slice(apiIndex).every(item => item.tipo === 'api')).toBe(true)
    expect(result).toHaveLength(CATALOGO_EXPORTS.length)
  })
  it('orders filtered subsets and preserves equal-key input order without mutation', () => {
    const entries = [{ nombre: 'Same', tipo: 'api' }, { nombre: 'Same', tipo: 'api' }, { nombre: 'Zebra', tipo: 'visual', presentacion: 'individual' }, { nombre: 'Alpha', tipo: 'api', destacado: { prioridad: 0 } }]
    const original = [...entries]
    expect(orderGalleryEntries(entries)[0]).toBe(entries[2])
    expect(orderGalleryEntries(entries).filter(item => item.nombre === 'Same')).toEqual(entries.slice(0, 2))
    expect(entries).toEqual(original)
    expect(orderGalleryEntries(CATALOGO_EXPORTS.filter(item => item.nombre.toLowerCase().includes('product')))[0].tipo).toBe('visual')
  })
  it('unknown visual entries without a curated scene stay below previews and above API', () => {
    const entries = [{ nombre: 'a', tipo: 'api' }, { nombre: 'b', tipo: 'visual' }, { nombre: 'c', tipo: 'visual', presentacion: 'acciones' }]
    expect(orderGalleryEntries(entries).map(item => item.nombre)).toEqual(['c', 'b', 'a'])
  })
  it('filtered gallery uses the tested ordering and explains API grouping', () => {
    const source = readFileSync('gallery/main.jsx', 'utf8')
    expect(source).toContain('orderGalleryEntries(')
    expect(source).toContain('hasInlineGalleryPreview(item)')
    expect(source).toContain('API, modelos y utilidades')
  })
})
