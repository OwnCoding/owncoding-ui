// @vitest-environment jsdom
import React, { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import RucField from '../src/components/RucField.jsx'
import CityAutocomplete from '../src/components/CityAutocomplete.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }
beforeEach(() => { vi.useFakeTimers(); host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove(); vi.useRealTimers() })
const render = node => act(() => root.render(node))
const input = value => act(() => {
  const field = host.querySelector('input')
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(field, value)
  field.dispatchEvent(new Event('input', { bubbles: true }))
})
const extract = () => act(() => host.querySelector('button').click())
const tick = () => act(() => vi.advanceTimersByTime(250))
const settle = async (request, value, fail = false) => act(async () => { if (fail) request.reject(new Error(value)); else request.resolve(value); await request.promise.catch(() => {}) })
function RucHarness({ provider, apply }) { const [value, setValue] = useState('80012345-6'); return <RucField value={value} onChange={setValue} consultar={provider} onAplicar={apply} /> }
function CityHarness({ provider }) { const [value, setValue] = useState(''); return <CityAutocomplete value={value} onChange={setValue} buscar={provider} /> }

test.each([false, true])('RUC edit invalidates stale %s response and permits current lookup', async fail => {
  const old = deferred(), current = deferred(), apply = vi.fn()
  const provider = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise)
  render(<RucHarness provider={provider} apply={apply} />); extract(); input('80054321-2')
  expect(host.querySelector('button').disabled).toBe(false)
  extract()
  expect(provider).toHaveBeenCalledTimes(2)
  await settle(old, fail ? 'Old lookup error' : { name: 'Old company', fullRuc: '80012345-6' }, fail)
  expect(host.textContent).not.toContain('Old company'); expect(host.textContent).not.toContain('Old lookup error')
  expect(host.querySelector('button').disabled).toBe(true)
  await settle(current, { name: 'Current company', fullRuc: '80054321-2' })
  expect(host.textContent).toContain('Current company')
  act(() => [...host.querySelectorAll('button')].find(button => button.textContent === 'Usar estos datos').click())
  expect(apply).toHaveBeenCalledWith({ name: 'Current company', fullRuc: '80054321-2' })
})
test.each([false, true])('RUC clear hides stale success/error %s', async fail => {
  const request = deferred(); render(<RucHarness provider={() => request.promise} />); extract(); input('')
  await settle(request, fail ? 'Old lookup error' : { name: 'Old company', fullRuc: '80012345-6' }, fail)
  expect(host.querySelector('[role="alert"]')).toBeNull(); expect(host.textContent).not.toContain('Old company')
})
test('RUC externally controlled value and provider changes invalidate results', async () => {
  const old = deferred(), current = deferred(); const provider = vi.fn(() => old.promise), next = vi.fn(() => current.promise)
  render(<RucField value="80012345-6" consultar={provider} />); extract()
  render(<RucField value="80054321-2" consultar={next} />)
  await settle(old, { name: 'Old company' }); expect(host.textContent).not.toContain('Old company')
  extract(); await settle(current, { name: 'Current company' }); expect(host.textContent).toContain('Current company')
  render(<RucField value="" consultar={next} />); expect(host.textContent).not.toContain('Current company')
})
test('city clearing before debounce cancels provider invocation', () => {
  const provider = vi.fn(() => []); render(<CityHarness provider={provider} />); input('As'); input(''); tick()
  expect(provider).not.toHaveBeenCalled(); expect(host.querySelector('[role="listbox"]')).toBeNull()
})
test.each([false, true])('city newest request wins against stale success/error %s', async fail => {
  const old = deferred(), current = deferred(); const provider = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise)
  render(<CityHarness provider={provider} />); input('As'); tick(); input('Lu'); tick()
  await settle(current, [{ city: 'Luque fixture', department: 'Demo' }]); expect(host.textContent).toContain('Luque fixture')
  await settle(old, fail ? 'Old city error' : [{ city: 'Old city', department: 'Demo' }], fail)
  expect(host.textContent).toContain('Luque fixture'); expect(host.textContent).not.toContain('Old city'); expect(host.querySelector('[role="alert"]')).toBeNull()
})
test.each([false, true])('city clear invalidates in-flight success/error %s', async fail => {
  const request = deferred(); render(<CityHarness provider={() => request.promise} />); input('As'); tick(); input('')
  await settle(request, fail ? 'Old city error' : [{ city: 'Old city', department: 'Demo' }], fail)
  expect(host.querySelector('[role="listbox"]')).toBeNull(); expect(host.querySelector('[role="alert"]')).toBeNull()
})
test('city external changes and provider replacement invalidate in-flight response', async () => {
  const old = deferred(); const provider = vi.fn(() => old.promise), next = vi.fn(() => [])
  render(<CityHarness provider={provider} />); input('As'); tick()
  render(<CityAutocomplete value="Lu" buscar={next} />)
  await settle(old, [{ city: 'Old city', department: 'Demo' }]); expect(host.textContent).not.toContain('Old city')
  render(<CityAutocomplete value="" buscar={next} />); expect(host.querySelector('[role="listbox"]')).toBeNull()
})
test('pending city and RUC responses do not survive unmount/remount', async () => {
  const city = deferred(), ruc = deferred(); const provider = vi.fn(() => city.promise)
  render(<CityHarness provider={provider} />); input('As'); tick()
  render(<RucHarness provider={() => ruc.promise} />); extract()
  render(<CityHarness provider={provider} />)
  await settle(city, [{ city: 'Old city' }]); await settle(ruc, { name: 'Old company' })
  expect(host.textContent).not.toContain('Old city'); expect(host.textContent).not.toContain('Old company')
})

test('RUC same-query provider replacement retires the old request', async () => {
  const old = deferred(), current = deferred(); const provider = () => old.promise, next = () => current.promise
  render(<RucField value="80012345-6" consultar={provider} />); extract()
  render(<RucField value="80012345-6" consultar={next} />); extract()
  await settle(old, 'Stale provider failure', true)
  expect(host.querySelector('[role="alert"]')).toBeNull(); expect(host.querySelector('button').disabled).toBe(true)
  await settle(current, { name: 'Current provider company' }); expect(host.textContent).toContain('Current provider company')
})
test('city same-query provider replacement retires old suggestions', async () => {
  const old = deferred(); const provider = () => old.promise, next = vi.fn(() => [])
  render(<CityHarness provider={provider} />); input('As'); tick()
  render(<CityHarness provider={next} />)
  await settle(old, [{ city: 'Old provider city' }])
  expect(host.querySelector('[role="listbox"]')).toBeNull()
})
test('current provider errors still show, unlike stale errors', async () => {
  const city = deferred(), ruc = deferred()
  render(<CityHarness provider={() => city.promise} />); input('As'); tick()
  await settle(city, 'Current city failure', true)
  expect(host.querySelector('[role="alert"]').textContent).toContain('No se pudieron cargar')
  render(<RucHarness provider={() => ruc.promise} />); extract(); await settle(ruc, 'Current RUC failure', true)
  expect(host.querySelector('[role="alert"]').textContent).toBe('Current RUC failure')
  expect(host.querySelector('button').disabled).toBe(false)
})
test('city unmount cancels debounce before starting provider work', () => {
  const provider = vi.fn(() => [])
  render(<CityHarness provider={provider} />); input('As'); render(null); tick()
  expect(provider).not.toHaveBeenCalled()
})
