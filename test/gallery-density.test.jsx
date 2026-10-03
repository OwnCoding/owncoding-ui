// @vitest-environment jsdom
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { Ficha, PriorityPreviews } from '../gallery/main.jsx'
import { COMPACT_SCENES, galleryCardIsWide, hasInlineGalleryPreview } from '../gallery/catalog-order.js'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'
afterEach(cleanup)
it('basic cards render real primitive scenes and open the original export explicitly', () => {
  const item = CATALOGO_EXPORTS.find(entry => entry.nombre === 'Button')
  const open = vi.fn()
  const { container } = render(<Ficha item={item} onAbrir={open} />)
  expect(container.querySelector('.catalog-miniature')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Primaria' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Ver ficha del export' }))
  expect(open).toHaveBeenCalledWith(item)
})
it('complex demos stay deferred while wide families receive explicit room', () => {
  const item = CATALOGO_EXPORTS.find(entry => entry.nombre === 'CartSummary')
  const { container } = render(<Ficha item={item} onAbrir={() => {}} />)
  expect(container.querySelector('.gallery-card--wide')).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull()
  expect(hasInlineGalleryPreview(item)).toBe(false)
  expect(galleryCardIsWide({ tipo: 'api', nombre: 'TableModel' })).toBe(false)
  expect(Object.keys(COMPACT_SCENES)).toHaveLength(14)
})
it('flat responsive priority grid keeps anchor and keyboard reading order without CSS reordering', () => {
  const { container } = render(<PriorityPreviews />)
  expect([...container.querySelector('.priority-grid').children].map(node => node.id)).toEqual(['preview-bancos-pagos', 'preview-telefono-py', 'preview-ciudad-departamento', 'preview-cliente-ci-ruc'])
  const css = readFileSync('gallery/styles.css', 'utf8')
  expect(css).toContain('.priority-card--1, .priority-card--4 { grid-column: 1 / -1; }')
  expect(css).toContain('.catalog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }')
  expect(css).toContain('.catalog-workspace { grid-template-columns: 15rem minmax(0, 1fr); }')
  expect(css).toContain('.catalog-categories { flex-direction: column; overflow-x: visible; }')
  expect(css).toContain('.catalog-categories { display: flex; min-width: 0; gap: .4rem; overflow-x: auto;')
  expect(css).not.toMatch(/\.priority-card[^{}]*\{[^}]*\border:/)
})
