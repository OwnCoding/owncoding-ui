// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { DEFAULT_GALLERY_STATE, galleryStateUrl, readGalleryState, useGalleryUrlState } from '../gallery/url-state.js'
import { App } from '../gallery/main.jsx'
import { CATEGORIAS_CATALOGO } from '../gallery/catalog.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => {
  window.history.replaceState({ retained: true }, '', '/')
  host = document.createElement('div'); document.body.append(host); root = createRoot(host)
  vi.stubGlobal('requestAnimationFrame', callback => { callback(); return 1 })
})
afterEach(() => { act(() => root.unmount()); host.remove(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
const render = node => act(() => root.render(node))
const click = label => act(() => [...host.querySelectorAll('button')].find(button => button.textContent === label).click())
const input = (node, value) => act(() => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(node, value)
  node.dispatchEvent(new Event('input', { bubbles: true }))
})
function Harness() {
  const [state, update] = useGalleryUrlState()
  return <><output>{JSON.stringify(state)}</output><input aria-label="Search" value={state.consulta} onChange={event => update({ consulta: event.target.value }, 'replace')} /><button onClick={() => update({ exportName: 'PasswordInput' })}>Select</button><button onClick={() => update({ exportName: null })}>Close</button><button onClick={() => update({ tipo: 'api', categoria: CATEGORIAS_CATALOGO[0] })}>Filter</button></>
}
const observed = () => JSON.parse(host.querySelector('output').textContent)

test('validated direct URL restores every public catalog state field', () => {
  const category = CATEGORIAS_CATALOGO[0]
  expect(readGalleryState(`/?q=Password&type=todos&category=${encodeURIComponent(category)}&export=PasswordInput#catalogo`)).toEqual({ consulta: 'Password', categoria: category, tipo: 'todos', exportName: 'PasswordInput' })
})

test('unknown, invalid and abusive parameters fall back safely', () => {
  expect(readGalleryState('/?type=admin&category=missing&export=Unknown&q=%00bad')).toEqual(DEFAULT_GALLERY_STATE)
  expect(readGalleryState(`/?q=${'x'.repeat(201)}`)).toEqual(DEFAULT_GALLERY_STATE)
  expect(readGalleryState('/?export=%3Cscript%3E')).toEqual(DEFAULT_GALLERY_STATE)
})

test('serializer retains unrelated query parameters and section hash while omitting defaults', () => {
  const url = new URL(galleryStateUrl('https://controlaria.online/?utm_source=guide&foo=one&foo=two#preview-telefono-py', { ...DEFAULT_GALLERY_STATE, exportName: 'PasswordInput' }))
  expect(url.searchParams.getAll('foo')).toEqual(['one', 'two'])
  expect(url.searchParams.get('utm_source')).toBe('guide')
  expect(url.hash).toBe('#preview-telefono-py')
  expect([...url.searchParams.keys()]).not.toContain('type')
  expect(url.searchParams.get('export')).toBe('PasswordInput')
})

test('search uses one debounced replacement without growing history', () => {
  vi.useFakeTimers()
  render(<Harness />)
  const replace = vi.spyOn(window.history, 'replaceState')
  const push = vi.spyOn(window.history, 'pushState')
  input(host.querySelector('input'), 'Pass')
  input(host.querySelector('input'), 'Password')
  expect(replace).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(250))
  expect(replace).toHaveBeenCalledTimes(1)
  expect(push).not.toHaveBeenCalled()
  expect(new URL(window.location.href).searchParams.get('q')).toBe('Password')
  expect(window.history.state).toEqual({ retained: true })
})

test('selection commits pending search, filters push once and navigation restores state', async () => {
  window.history.replaceState({ retained: true }, '', '/?utm_source=guide#catalogo')
  render(<Harness />)
  const push = vi.spyOn(window.history, 'pushState')
  input(host.querySelector('input'), 'Password')
  click('Select')
  expect(push).toHaveBeenCalledTimes(1)
  expect(window.location.search).toContain('q=Password')
  click('Select')
  expect(push).toHaveBeenCalledTimes(1)
  click('Filter')
  expect(push).toHaveBeenCalledTimes(2)
  expect(window.location.hash).toBe('#catalogo')
  expect(window.location.search).toContain('utm_source=guide')
  await act(async () => { window.history.back(); await new Promise(resolve => setTimeout(resolve, 30)) })
  expect(observed()).toEqual({ ...DEFAULT_GALLERY_STATE, consulta: 'Password', exportName: 'PasswordInput' })
  await act(async () => { window.history.forward(); await new Promise(resolve => setTimeout(resolve, 30)) })
  expect(observed().tipo).toBe('api')
  click('Close')
  expect(new URL(window.location.href).searchParams.has('export')).toBe(false)
})

test('popstate cancels pending search replacement rather than overwriting restored URL', () => {
  vi.useFakeTimers()
  render(<Harness />)
  input(host.querySelector('input'), 'stale')
  act(() => {
    window.history.replaceState({}, '', '/?export=PhoneField#preview-telefono-py')
    window.dispatchEvent(new PopStateEvent('popstate'))
    vi.advanceTimersByTime(500)
  })
  expect(observed().consulta).toBe('')
  expect(observed().exportName).toBe('PhoneField')
  expect(window.location.search).not.toContain('stale')
})

test('direct selected export renders real preview and provides an exact shareable link', () => {
  window.history.replaceState({}, '', '/?q=Password&export=PasswordInput#catalogo')
  render(<App />)
  const selected = host.querySelector('#ficha-export')
  expect(selected.querySelector('h2').textContent).toBe('PasswordInput')
  expect(selected.querySelector('input').type).toBe('password')
  const link = selected.querySelector('[aria-label="Enlace directo a PasswordInput"]')
  expect(link.href).toBe(window.location.href)
  expect(host.querySelector('.smart-inputs').open).toBe(true)
  click('Cerrar ficha')
  expect(host.querySelector('#ficha-export')).toBeNull()
})

test('customer, phone and smart-form values never become URL parameters', () => {
  render(<App />)
  input(host.querySelector('#gallery-correo'), 'private@example.com')
  input(host.querySelector('#gallery-serial'), '123456789012345')
  input(host.querySelector('#gallery-ruc'), '80012345-6')
  input(host.querySelector('#gallery-telefono'), '0981987654')
  expect(window.location.search).toBe('')
  expect(window.location.href).not.toContain('private')
  expect(window.location.href).not.toContain('123456789012345')
})
