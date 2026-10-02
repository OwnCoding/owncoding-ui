// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { SEARCH_BOARD_DEMOS } from '../gallery/search-board-previews.jsx'
import { ComponentPreview } from '../gallery/component-previews.jsx'
const observed = vi.hoisted(() => new Set())
vi.mock('../src/index.js', async importOriginal => {
  const actual = await importOriginal()
  const names = ['BuscadorPersonas', 'BuscadorProveedor', 'ProductCombobox', 'TableroKanban']
  return { ...actual, ...Object.fromEntries(names.map(name => [name, props => { observed.add(name); return React.createElement(actual[name], props) }])) }
})
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { observed.clear(); host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove(); vi.restoreAllMocks() })
const render = async name => { await act(async () => root.render(<ComponentPreview key={name} name={name} />)) }
const click = label => act(() => [...host.querySelectorAll('button')].find(button => button.textContent === label).click())
test.each(Object.keys(SEARCH_BOARD_DEMOS))('%s instantiates the actual named export', async name => { await render(name); expect(observed.has(name)).toBe(true) })
test('people fixture selection does not persist usage', async () => {
  const storage = vi.spyOn(Storage.prototype, 'setItem')
  await render('BuscadorPersonas'); act(() => host.querySelector('[role="option"]').click())
  expect(host.textContent).toContain('Selección local: a'); expect(storage).not.toHaveBeenCalled()
})
test('kanban select applies and rolls back local moves without network', async () => {
  const request = vi.spyOn(globalThis, 'fetch')
  const move = value => act(() => { const select = host.querySelector('select'); select.value = value; select.dispatchEvent(new Event('change', { bubbles: true })) })
  await render('TableroKanban'); move('revisado')
  expect(host.textContent).toContain('Movimiento local aplicado')
  click('Simular rechazo local'); move('pendiente')
  expect(host.textContent).toContain('Movimiento revertido por rechazo local')
  expect(host.querySelector('select option[value="pendiente"]')).not.toBeNull()
  click('Restaurar tablero local'); expect(host.querySelector('select option[value="revisado"]')).not.toBeNull()
  expect(request).not.toHaveBeenCalled()
})
