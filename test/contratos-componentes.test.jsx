// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, test, vi } from 'vitest'

import {
  BancoCombobox,
  CityAutocomplete,
  EmailField,
  InstagramField,
  MoneyInput,
  PercentField,
  SerialField,
} from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

function montar(elemento) {
  const contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  const root = createRoot(contenedor)
  act(() => root.render(elemento))
  return {
    contenedor,
    desmontar() {
      act(() => root.unmount())
      contenedor.remove()
    },
  }
}

function escribir(input, valor) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, valor)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('contratos compatibles de campos', () => {
  test('MoneyInput reenvía la ref al input real', () => {
    const ref = { current: null }
    const ui = montar(<MoneyInput ref={ref} value="1000" />)
    expect(ref.current).toBe(ui.contenedor.querySelector('input'))
    ui.desmontar()
    expect(ref.current).toBeNull()
  })

  test('PercentField notifica ambos contratos sin duplicar la misma función', () => {
    const onChange = vi.fn()
    const onValueChange = vi.fn()
    let ui = montar(<PercentField onChange={onChange} onValueChange={onValueChange} />)
    act(() => escribir(ui.contenedor.querySelector('input'), '12.5'))
    expect(onChange).toHaveBeenCalledWith('12,5')
    expect(onValueChange).toHaveBeenCalledWith('12,5')
    ui.desmontar()

    const compartida = vi.fn()
    ui = montar(<PercentField onChange={compartida} onValueChange={compartida} />)
    act(() => escribir(ui.contenedor.querySelector('input'), '25'))
    expect(compartida).toHaveBeenCalledTimes(1)
    ui.desmontar()
  })

  test('BancoCombobox notifica el valor de texto y la selección', () => {
    const onChange = vi.fn()
    const onSelect = vi.fn()
    const ui = montar(<BancoCombobox value="Atlas" onChange={onChange} onSelect={onSelect} />)
    const input = ui.contenedor.querySelector('input')
    act(() => input.focus())
    const opcion = ui.contenedor.querySelector('[role="option"]')
    expect(opcion).not.toBeNull()
    act(() => opcion.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(onChange).toHaveBeenCalledWith('Banco Atlas')
    expect(onSelect).toHaveBeenCalledWith('Banco Atlas')
    ui.desmontar()
  })

  test('CityAutocomplete conserva onSelect y agrega onChange(string)', () => {
    const onChange = vi.fn()
    const onSelect = vi.fn()
    const ui = montar(<CityAutocomplete value="" onChange={onChange} onSelect={onSelect} />)
    act(() => escribir(ui.contenedor.querySelector('input'), 'Asunción'))
    expect(onChange).toHaveBeenCalledWith('Asunción')
    expect(onSelect).toHaveBeenCalledWith('Asunción', 'Asunción')
    ui.desmontar()
  })

  test.each([
    ['EmailField', EmailField, 'ANA@EXAMPLE.COM', 'ANA@EXAMPLE.COM'],
    ['SerialField', SerialField, ' ab-12 ', 'AB12'],
    ['InstagramField', InstagramField, '@ana lopez', 'analopez'],
  ])('%s entrega un string normalizado, no el evento', (_nombre, Componente, escrito, esperado) => {
    const onChange = vi.fn()
    const ui = montar(<Componente value="" onChange={onChange} />)
    act(() => escribir(ui.contenedor.querySelector('input'), escrito))
    expect(onChange).toHaveBeenCalledWith(esperado)
    expect(typeof onChange.mock.calls[0][0]).toBe('string')
    ui.desmontar()
  })
})
