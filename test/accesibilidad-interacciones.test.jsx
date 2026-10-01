// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  BancoCombobox,
  FormField,
  Input,
  MenuDesplegable,
  Subtabs,
  ToastProvider,
  useToast,
} from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let container
let root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

async function render(element) {
  await act(async () => { root.render(element) })
}

async function click(node) {
  await act(async () => { node.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
}

async function key(node, value) {
  await act(async () => { node.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true })) })
}

describe('contratos de interacción accesible', () => {
  test('MenuDesplegable aplica foco roving y devuelve el foco con Escape', async () => {
    await render(
      <MenuDesplegable
        trigger={<span>Cuenta</span>}
        items={[{ label: 'Perfil' }, { separador: true }, { label: 'Salir' }]}
      />,
    )
    const trigger = container.querySelector('[aria-haspopup="menu"]')
    await click(trigger)
    await act(async () => { await new Promise((resolve) => requestAnimationFrame(resolve)) })
    const items = [...container.querySelectorAll('[role="menuitem"]')]
    expect(document.activeElement).toBe(items[0])
    expect(container.querySelector('[role="separator"]')).not.toBeNull()
    await key(items[0], 'ArrowDown')
    expect(document.activeElement).toBe(items[1])
    await key(items[1], 'Escape')
    expect(container.querySelector('[role="menu"]')).toBeNull()
    await act(async () => { await new Promise((resolve) => requestAnimationFrame(resolve)) })
    expect(document.activeElement).toBe(trigger)
  })

  test('BancoCombobox mantiene el foco en el input y selecciona con teclado', async () => {
    function Harness() {
      const [value, setValue] = useState('')
      return <BancoCombobox value={value} onChange={setValue} catalogo={['Banco Atlas', 'Banco Basa']} />
    }
    await render(<Harness />)
    const input = container.querySelector('input')
    await act(async () => { input.focus() })
    expect(input.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(2)
    expect(container.querySelector('[role="option"] button')).toBeNull()
    await key(input, 'ArrowDown')
    expect(document.activeElement).toBe(input)
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy()
    await key(input, 'Enter')
    expect(input.value).toBe('Banco Basa')
    expect(container.querySelector('[role="listbox"]')).toBeNull()
  })

  test('FormField mezcla la descripción existente y marca el control inválido', async () => {
    await render(
      <FormField label="Correo" htmlFor="correo" error="Correo inválido">
        <div><Input id="correo" aria-describedby="ayuda-correo" /></div>
      </FormField>,
    )
    const input = container.querySelector('#correo')
    expect(input.getAttribute('aria-describedby')).toBe('ayuda-correo correo-descripcion')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(container.querySelector('#correo-descripcion').textContent).toBe('Correo inválido')
  })

  test('Subtabs usa una sola parada de Tab y navega con flechas', async () => {
    function Harness() {
      const [value, setValue] = useState('uno')
      return <Subtabs value={value} onChange={setValue} items={[["uno", 'Uno'], ["dos", 'Dos']]} />
    }
    await render(<Harness />)
    let tabs = [...container.querySelectorAll('[role="tab"]')]
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1])
    tabs[0].focus()
    await key(tabs[0], 'ArrowRight')
    tabs = [...container.querySelectorAll('[role="tab"]')]
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([-1, 0])
    await act(async () => { await new Promise((resolve) => requestAnimationFrame(resolve)) })
    expect(document.activeElement).toBe(tabs[1])
  })

  test('los errores toast persisten y se anuncian como alerta', async () => {
    vi.useFakeTimers()
    function Trigger() {
      const toast = useToast()
      return <button type="button" onClick={() => toast.error('Falló', 'Reintentá')}>Mostrar</button>
    }
    await render(<ToastProvider><Trigger /></ToastProvider>)
    await click(container.querySelector('button'))
    expect(container.querySelector('[role="alert"]')).not.toBeNull()
    await act(async () => { vi.advanceTimersByTime(20_000) })
    expect(container.querySelector('[role="alert"]')).not.toBeNull()
  })
})
