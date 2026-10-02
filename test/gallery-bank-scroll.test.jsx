// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { readFileSync } from 'node:fs'
import { PriorityPreviews, VistaBancosPagos } from '../gallery/main.jsx'
import { BANCOS_PREVIEW } from '../gallery/financial-fixtures.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => {
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  act(() => root.render(<VistaBancosPagos />))
})
afterEach(() => { act(() => root.unmount()); host.remove() })

test('bank review is a named keyboard-focusable region retaining every institution in canonical order', () => {
  const region = host.querySelector('.bank-review-grid')
  expect(region.getAttribute('role')).toBe('region')
  expect(region.tabIndex).toBe(0)
  expect(host.querySelector(`#${region.getAttribute('aria-labelledby')}`).textContent).toContain(`${BANCOS_PREVIEW.length} instituciones`)
  expect(host.querySelector(`#${region.getAttribute('aria-describedby')}`).textContent).toContain('Desliza dentro de la lista')
  expect([...region.querySelectorAll('h5')].map(heading => heading.textContent)).toEqual(BANCOS_PREVIEW)
  expect(region.querySelectorAll('.bank-variant')).toHaveLength(BANCOS_PREVIEW.length * 2)
  expect(region.querySelector('#gallery-banco')).toBeNull()
  act(() => region.focus())
  expect(document.activeElement).toBe(region)
})

test('last institution remains selectable inside the review without removing or reordering cards', () => {
  const region = host.querySelector('.bank-review-grid')
  const last = BANCOS_PREVIEW.at(-1)
  act(() => region.querySelector(`[aria-label="Seleccionar ${last}"]`).click())
  expect(region.querySelector('[aria-current="true"] h5').textContent).toBe(last)
  expect(host.querySelector('.brand-selection__compact').getAttribute('aria-label')).toBe(`Variante compacta de ${last}`)
  expect(region.querySelectorAll('.bank-review-card')).toHaveLength(BANCOS_PREVIEW.length)
})

test('review has a responsive height ceiling, focus affordance and native page-scroll chaining', () => {
  const css = readFileSync('gallery/styles.css', 'utf8')
  const regionCss = css.match(/\.bank-review-grid \{([^}]+)\}/)[1]
  expect(regionCss).toContain('max-height: min(36rem, 65svh)')
  expect(regionCss).toContain('overflow-y: auto')
  expect(regionCss).toContain('scrollbar-gutter: stable')
  expect(regionCss).not.toMatch(/overscroll-behavior|touch-action|height:\s*\d+px/)
  expect(css).toContain('.bank-review-grid:focus-visible')
  expect(css.match(/\.priority-grid \{([^}]+)\}/)[1]).toContain('align-items: start')
})

test('priority columns preserve reading and anchor order while stacking all three inputs beside financial previews', () => {
  act(() => root.render(<PriorityPreviews />))
  expect([...host.querySelectorAll('.priority-card')].map(card => card.id)).toEqual([
    'preview-bancos-pagos', 'preview-telefono-py', 'preview-ciudad-departamento', 'preview-cliente-ci-ruc',
  ])
  expect(host.querySelector('.priority-column--financial').children).toHaveLength(1)
  expect([...host.querySelector('.priority-column--inputs').children].map(card => card.id)).toEqual([
    'preview-telefono-py', 'preview-ciudad-departamento', 'preview-cliente-ci-ruc',
  ])
  const css = readFileSync('gallery/styles.css', 'utf8')
  expect(css).toContain('.priority-grid { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }')
  expect(css).toContain('.priority-column { display: grid; min-width: 0; align-content: start; gap: 1rem; }')
  expect(css).not.toMatch(/\.priority-card--[1-4]\s*\{\s*grid-column/)
  expect(css.match(/\.priority-column \{([^}]+)\}/)[1]).not.toMatch(/order|grid-area/)
  expect(css.match(/\.priority-grid \{([^}]+)\}/)[1]).toContain('grid-template-columns: minmax(0, 1fr)')
})
