// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { DOCUMENT_DEMOS } from '../gallery/document-previews.jsx'
import { REVIEW_DEMOS } from '../gallery/review-previews.jsx'
import { ComponentPreview } from '../gallery/component-previews.jsx'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'

const observed = vi.hoisted(() => new Set())
vi.mock('../src/index.js', async importOriginal => {
  const actual = await importOriginal()
  const names = ['AjustesImpresion', 'BotonImprimir', 'DocumentoImpresion', 'VistaPreviaPapel', 'FichaCertificado', 'ManifiestoEnvio', 'EtiquetaLote', 'CampoSeriales', 'CurrencySelect', 'BotonDentroCampo', 'ConsentimientoDatos', 'AvisoPrivacidad', 'FilaChecklist', 'FilaRevision', 'ImporteDelta', 'MedidorBateria', 'IndicadorConexion', 'SemaforoItem', 'SerialTexto', 'PasosEquipo', 'ChipFusion', 'ChipsLocks', 'ContadoresCompra', 'BarraLote', 'ColumnaLote']
  return { ...actual, ...Object.fromEntries(names.map(name => [name, props => { observed.add(name); return React.createElement(actual[name], props) }])) }
})
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { observed.clear(); host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove(); vi.restoreAllMocks() })
const render = async name => { await act(async () => root.render(<ComponentPreview key={name} name={name} />)) }
const click = label => act(() => [...document.querySelectorAll('button')].find(button => button.textContent === label || button.getAttribute('aria-label') === label).click())
const input = (node, value) => act(() => {
  const prototype = node.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(prototype, 'value').set.call(node, value)
  node.dispatchEvent(new Event('input', { bubbles: true }))
})

test.each([...Object.keys(DOCUMENT_DEMOS), ...Object.keys(REVIEW_DEMOS)])('%s instantiates its actual named export', async name => {
  await render(name)
  expect(observed.has(name)).toBe(true)
  expect(CATALOGO_EXPORTS.find(item => item.nombre === name).presentacion).toBe('individual')
  expect(host.querySelector('[data-demo-export]').dataset.demoExport).toBe(name)
})
test('printing controls simulate work without browser print, network or storage', async () => {
  const print = vi.spyOn(window, 'print').mockImplementation(() => {})
  const fetch = vi.spyOn(globalThis, 'fetch')
  const storage = vi.spyOn(Storage.prototype, 'setItem')
  await render('BotonImprimir'); click('Simular impresión')
  expect(host.textContent).toContain('ningún papel impreso')
  await render('DocumentoImpresion'); click('Simular impresión')
  expect(host.textContent).toContain('no se abre el diálogo del sistema')
  await render('AjustesImpresion'); click('Imprimir prueba'); click('Verificar')
  expect(host.textContent).toContain('Ningún dispositivo fue consultado')
  expect(print).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled(); expect(storage).not.toHaveBeenCalled()
})
test('paper preview uses an inert sandbox and selected format', async () => {
  await render('VistaPreviaPapel')
  expect(host.querySelector('iframe').getAttribute('sandbox')).toBe('')
  expect(host.querySelector('iframe').srcdoc).not.toMatch(/<script|https?:\/\//)
  click('58 mm')
  expect(host.querySelector('[aria-pressed="true"]').textContent).toBe('58 mm')
  click('Alternar contenido')
  expect(host.querySelector('iframe').srcdoc).toContain('Sin detalle')
})
test('serial entry deduplicates fixture and updates local state', async () => {
  await render('CampoSeriales'); input(host.querySelector('textarea'), 'DEMO-A\nDEMO-A\nDEMO-B')
  expect(host.textContent).toContain('2 seriales únicos locales')
  expect(host.textContent).toContain('1 duplicados')
})
test('consent is opt-in and local, batch selection can clear', async () => {
  await render('ConsentimientoDatos')
  expect(host.querySelector('input[type="checkbox"]').checked).toBe(false)
  act(() => host.querySelector('input[type="checkbox"]').click())
  expect(host.textContent).toContain('Aceptación local de muestra')
  await render('BarraLote'); click('Limpiar')
  expect(host.textContent).toContain('Sin fixtures seleccionados')
  click('Seleccionar dos fixtures')
  expect(host.textContent).toContain('2 seleccionada(s)')
})
test('empty column and local sync fixtures remain controllable', async () => {
  await render('ColumnaLote'); click('Alternar columna vacía')
  expect(host.textContent).toContain('Sin fixtures en esta columna')
  await render('IndicadorConexion'); click('Sincronizar 2 pendientes')
  expect(host.textContent).toContain('nada sincronizado con un servidor')
  expect(host.querySelector('[aria-label="Sincronizar 2 pendientes"]')).toBeNull()
})
test('battery absence and manifest/label pending states use actual contracts', async () => {
  await render('MedidorBateria'); click('Alternar sin medición')
  expect(host.textContent).toContain('Sin dato')
  await render('EtiquetaLote'); click('Alternar serial pendiente')
  expect(host.textContent).toContain('IMEI pendiente')
  await render('ManifiestoEnvio'); click('Alternar manifiesto vacío')
  expect(host.textContent).toContain('0 unidades')
})
