// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { RECEIVING_DEMOS } from '../gallery/receiving-previews.jsx'
import { ComponentPreview } from '../gallery/component-previews.jsx'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'
const observed = vi.hoisted(() => new Set())
vi.mock('../src/index.js', async importOriginal => {
  const actual = await importOriginal()
  const names = ['BloquePago', 'CeldaMoneda', 'DestinoRecepcion', 'Eyebrow', 'Icon', 'IconoCategoria', 'PanelDerecho', 'PlanPagos', 'PreviewFusion', 'ResumenDestinos', 'ResumenIncidencias', 'ResumenRecepcion', 'SectionState', 'SelectorIncidencia', 'TarjetaAjuste', 'TarjetaCompra', 'TarjetaLote', 'TarjetaNecesidad', 'TarjetaRecepcion', 'TileEquipo', 'TileRol']
  return { ...actual, ...Object.fromEntries(names.map(name => [name, props => { observed.add(name); return React.createElement(actual[name], props) }])) }
})
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { observed.clear(); host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove(); vi.restoreAllMocks() })
const render = async name => { await act(async () => root.render(<ComponentPreview key={name} name={name} />)) }
const click = label => act(() => [...host.querySelectorAll('button')].find(button => button.textContent === label || button.getAttribute('aria-label') === label).click())
test.each(Object.keys(RECEIVING_DEMOS))('%s mounts its named real export with local fixtures', async name => {
  await render(name)
  expect(observed.has(name)).toBe(true)
  expect(CATALOGO_EXPORTS.find(item => item.nombre === name).presentacion).toBe('individual')
  expect(host.querySelector('[data-demo-export]').dataset.demoExport).toBe(name)
})
test('payment removal is local and reversible', async () => {
  await render('BloquePago'); click('Eliminar pago')
  expect(host.textContent).toContain('Bloque retirado del fixture.')
  click('Restaurar bloque local'); expect(host.textContent).toContain('Cuota de muestra')
})
test('fusion only selects a principal without performing a merge', async () => {
  await render('PreviewFusion'); act(() => host.querySelectorAll('input[type="radio"]')[1].click())
  expect(host.querySelectorAll('input[type="radio"]')[1].checked).toBe(true)
  expect(host.textContent).toContain('No se fusiona ni archiva información')
})
test('simulated receiving and card opening never invoke network or storage', async () => {
  const request = vi.spyOn(globalThis, 'fetch')
  const storage = vi.spyOn(Storage.prototype, 'setItem')
  await render('DestinoRecepcion'); click('Simular recepción local')
  expect(host.textContent).toContain('no se recibe mercadería')
  await render('TileRol'); act(() => host.querySelector('button').click())
  expect(host.textContent).toContain('ningún registro real modificado')
  expect(request).not.toHaveBeenCalled(); expect(storage).not.toHaveBeenCalled()
})
test('error retry and empty destinations update controlled local state', async () => {
  await render('SectionState'); click('Error'); click('Reintentar')
  expect(host.textContent).toContain('Reintento simulado sin solicitudes')
  await render('ResumenDestinos'); click('Alternar destinos vacíos')
  expect(host.textContent).toContain('Sin destinos en el fixture')
})
