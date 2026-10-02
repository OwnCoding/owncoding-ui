// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { SPECIALIZED_DEMOS } from '../gallery/specialized-previews.jsx'
import { ComponentPreview } from '../gallery/component-previews.jsx'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'
const observed = vi.hoisted(() => new Set())
vi.mock('../src/index.js', async importOriginal => {
  const actual = await importOriginal()
  const names = ['BuscadorDispositivo', 'Calendario', 'CodigoQr', 'BotonCargaIA', 'DialogoCargaIA', 'PegarEnlaceToken', 'SelectorCuentaCobro', 'TarjetaCuentaCobro', 'SubidaImagen', 'ToastProvider']
  return { ...actual, ...Object.fromEntries(names.map(name => [name, props => { observed.add(name); return React.createElement(actual[name], props) }])) }
})
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { observed.clear(); host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.useRealTimers() })
const render = async name => { await act(async () => root.render(<ComponentPreview key={name} name={name} />)) }
const click = async label => { await act(async () => [...document.querySelectorAll('button')].find(button => button.textContent === label || button.getAttribute('aria-label') === label).click()) }
const write = (input, value) => act(() => { const prototype = input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })) })
test.each(Object.keys(SPECIALIZED_DEMOS))('%s instantiates its actual named export', async name => { await render(name); expect(observed.has(name)).toBe(true); expect(CATALOGO_EXPORTS.find(item => item.nombre === name).presentacion).toBe('individual') })
test.each(['BotonCargaIA', 'DialogoCargaIA'])('%s reviews a local result before explicit simulated creation and cleans the dialog', async name => {
  const request = vi.spyOn(globalThis, 'fetch')
  const storage = vi.spyOn(Storage.prototype, 'setItem')
  await render(name); await click(name === 'BotonCargaIA' ? 'Abrir simulación IA' : 'Abrir diálogo IA local')
  write(document.querySelector('textarea'), 'Nota ficticia de prueba')
  await click('Analizar con IA')
  expect(host.textContent).toContain('revise antes de confirmar')
  expect(host.textContent).not.toContain('confirmadas; ninguna escritura real')
  expect(document.body.textContent).toContain('Nota ficticia para revisar')
  await click('Crear todo (1)'); expect(host.textContent).toContain('1 notas simuladas confirmadas')
  await render('CodigoQr'); expect(document.querySelector('[role="dialog"]')).toBeNull()
  expect(request).not.toHaveBeenCalled(); expect(storage).not.toHaveBeenCalled()
})
test('device keyboard selection resolves local dependent options', async () => {
  await render('BuscadorDispositivo'); const input = host.querySelector('input')
  write(input, 'DEMO-A')
  act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })))
  act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })))
  expect(host.textContent).toContain('Modelo local: Equipo ficticio A')
  expect(host.textContent).toContain('128 GB')
})
test('calendar fixed month navigation and day selection stay local', async () => {
  await render('Calendario')
  const day = [...host.querySelectorAll('button')].find(button => button.getAttribute('aria-label')?.includes('2 de octubre'))
  expect(day).toBeDefined(); act(() => day.click())
  expect(host.textContent).toContain('Día local: 2026-10-02')
  await click('Mes siguiente'); expect(host.textContent.toLowerCase()).toContain('noviembre')
  await click('Mes anterior'); expect(host.textContent.toLowerCase()).toContain('octubre')
  await click('Alternar calendario vacío'); expect(host.textContent).not.toContain('Revisión ficticia')
})
test('fake token parsing does not validate or apply a credential', async () => {
  await render('PegarEnlaceToken'); write(host.querySelector('input'), `https://fixture.invalid/demo/${'a'.repeat(64)}`)
  await act(async () => host.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
  expect(host.textContent).toContain('Código ficticio extraído; no se valida ni aplica')
})
test('account keyboard selection collapses to an actual account card and can change', async () => {
  await render('SelectorCuentaCobro'); const input = host.querySelector('input')
  act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })))
  expect(host.textContent).toContain('Selección local: cash')
  await click('Cambiar cuenta'); expect(host.querySelector('input')).not.toBeNull()
  await render('TarjetaCuentaCobro'); await click('Alternar cuenta ficticia'); expect(host.textContent).toContain('Cuenta ficticia USD')
})
test('image fixture runs the actual validation and clear callbacks without upload or object URLs', async () => {
  const request = vi.spyOn(globalThis, 'fetch')
  await render('SubidaImagen'); await click('Elegir pixel ficticio')
  expect(host.querySelector('img').src).toMatch(/^data:image\/png;base64,/)
  expect(host.textContent).toContain('Pixel ficticio validado')
  await click('Quitar imagen'); expect(host.querySelector('img')).toBeNull()
  await click('Probar tamaño inválido'); expect(host.querySelector('[role="alert"]').textContent).toContain('supera')
  expect(request).not.toHaveBeenCalled()
})
test('contained provider has one persistent dismissible toast with no timers or demo event listener', async () => {
  await render('ToastProvider'); vi.useFakeTimers()
  await click('Mostrar aviso local'); expect(host.textContent).toContain('Aviso ficticio local')
  expect(vi.getTimerCount()).toBe(0)
  expect(host.querySelector('.gallery-toast-scene .fixed')).not.toBeNull()
  act(() => window.dispatchEvent(new Event('mobos:demo-guardado')))
  expect(host.textContent).not.toContain('Cambio simulado en la demo')
  await click('Cerrar aviso'); expect(host.textContent).not.toContain('Aviso ficticio local')
  await click('Reiniciar avisos locales'); await click('Mostrar aviso local')
  await render('Eyebrow'); expect(document.body.textContent).not.toContain('Aviso ficticio local')
  expect(vi.getTimerCount()).toBe(0)
})
test('QR fixture generates a real local PNG and removes it when empty', async () => {
  await render('CodigoQr')
  await vi.waitFor(async () => { await act(async () => Promise.resolve()); expect(host.querySelector('img')?.src).toMatch(/^data:image\/png;base64,/) })
  await click('Alternar QR vacío')
  expect(host.querySelector('img')).toBeNull()
})
test.each(CATALOGO_EXPORTS.filter(entry => entry.presentacion === 'individual').map(entry => entry.nombre))('curated individual %s safely mounts and unmounts', async name => {
  await render(name)
  expect(host.childNodes.length).toBeGreaterThan(0)
  expect(host.textContent).not.toContain('Todavía no tiene una demo específica')
})
