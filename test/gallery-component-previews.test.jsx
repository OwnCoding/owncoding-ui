// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { ComponentPreview, EmailPreview } from '../gallery/component-previews.jsx'
import LogoFinanciero from '../src/components/LogoFinanciero.jsx'
import { BancoCombobox } from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove() })
const render = node => act(() => root.render(node))
const click = label => act(() => [...document.querySelectorAll('button')].find(button => button.textContent === label || button.getAttribute('aria-label') === label).click())

test('password visibility and PIN use actual input contracts', () => {
  render(<ComponentPreview name="PasswordInput" />)
  expect(host.querySelector('input').type).toBe('password')
  click('Mostrar contraseña')
  expect(host.querySelector('input').type).toBe('text')
  render(<ComponentPreview key="pin" name="PinInput" />)
  expect(host.querySelector('input').inputMode).toBe('numeric')
  expect(host.querySelector('input').maxLength).toBe(4)
})
test('table filter and grid mode update local fixture', () => {
  render(<ComponentPreview name="DataTable" />)
  expect(host.textContent).toContain('Pedido Demo B')
  click('Pendientes')
  expect(host.textContent).not.toContain('Pedido Demo B')
  click('Ver como cuadrícula')
  expect(host.querySelector('table')).toBeNull()
  expect(host.textContent).toContain('Pedido Demo A')
})
test('confirmation cannot apply fixture before explicit confirm', () => {
  render(<ComponentPreview name="ConfirmDialog" />)
  expect(host.textContent).toContain('No hay cambios aplicados')
  click('Abrir ConfirmDialog')
  expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  click('Cancelar')
  expect(host.textContent).toContain('No hay cambios aplicados')
  click('Abrir ConfirmDialog')
  click('Confirmar')
  expect(host.textContent).toContain('Fixture confirmado; sin persistencia')
})
test.each(['Modal', 'Drawer'])('%s closes using its real close contract', name => {
  render(<ComponentPreview name={name} />)
  click(`Abrir ${name}`)
  expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  click('Cerrar muestra')
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})
test('progress announces local completion', () => {
  render(<ComponentPreview name="ProgresoChecklist" />)
  click('Avanzar fixture'); click('Avanzar fixture'); click('Avanzar fixture')
  expect(host.textContent).toContain('4 de 4 tareas')
  expect(host.textContent).toContain('Fixture completado')
  expect(host.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('100')
})
test('footer models and version are selectable', () => {
  render(<ComponentPreview name="ProductFooter" />)
  const select = host.querySelector('select')
  act(() => { select.value = 'apilado'; select.dispatchEvent(new Event('change', { bubbles: true })) })
  expect(host.querySelector('footer').dataset.modelo).toBe('apilado')
  expect(host.querySelector('footer').textContent).toContain('v0.62.0')
})
test('email is isolated HTML or text without sending controls', () => {
  render(<EmailPreview />)
  expect(host.querySelector('iframe').getAttribute('sandbox')).toBe('')
  expect(host.querySelector('iframe').srcdoc).toContain('DEMO-001')
  click('Texto')
  expect(host.querySelector('iframe')).toBeNull()
  expect(host.querySelector('pre').textContent).toContain('No se envió ningún correo')
})
test('compact financial marks retain usable height without changing artwork', () => {
  render(<LogoFinanciero nombre="Fixture" alto="h-6" registro={{ variante: 'compacto', banco: 'Fixture', visual: { tipo: 'archivo', archivo: '/fixture.svg', fondo: '#ffffff', padding: true } }} />)
  const logo = host.querySelector('[data-logo-variante="compacto"]')
  expect(logo.className).toContain('h-6')
  expect(logo.className).toContain('p-[2px]')
  expect(logo.className).not.toContain('p-1.5')
  render(<BancoCombobox value="" onChange={() => {}} />)
  act(() => host.querySelector('input').dispatchEvent(new FocusEvent('focusin', { bubbles: true })))
  expect(host.querySelector('[data-logo-variante="compacto"]').className).toContain('h-6')
})
