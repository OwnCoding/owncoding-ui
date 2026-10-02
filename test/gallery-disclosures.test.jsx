// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { OtrosCamposInteligentes } from '../gallery/main.jsx'
import { ComponentPreview, EmailPreview } from '../gallery/component-previews.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove() })
const render = node => act(() => root.render(node))

test.each([
  ['Otros campos inteligentes', OtrosCamposInteligentes],
  ['Correo transaccional · HTML y texto', EmailPreview],
])('%s starts expanded and remains natively user-collapsible', (label, Preview) => {
  render(<Preview />)
  const details = host.querySelector('details')
  const summary = details.querySelector('summary')
  expect(summary.textContent).toContain(label)
  expect(details.open).toBe(true)
  expect(details.hasAttribute('open')).toBe(true)
  act(() => summary.click())
  expect(details.open).toBe(false)
  act(() => summary.click())
  expect(details.open).toBe(true)
})

test('email format changes do not force a user-collapsed disclosure back open', () => {
  render(<EmailPreview />)
  const details = host.querySelector('details')
  act(() => details.querySelector('summary').click())
  act(() => [...host.querySelectorAll('button')].find(button => button.textContent === 'Texto').click())
  expect(host.querySelector('pre')).not.toBeNull()
  expect(details.open).toBe(false)
})

test.each(['Modal', 'Drawer', 'ConfirmDialog'])('%s still waits for explicit user activation', name => {
  render(<ComponentPreview name={name} />)
  expect(host.querySelector('[role="dialog"]')).toBeNull()
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})
