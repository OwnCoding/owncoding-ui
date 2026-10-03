// @vitest-environment jsdom
// IMEI check (#17): utilidades Luhn puras y el campo con feedback en vivo.
// Fixtures ficticios y deterministas: 490154203237518 es válido; cambiar el
// último dígito rompe el control.
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  ImeiField,
  LARGO_IMEI,
  MENSAJES_IMEI,
  analizarImei,
  estadoImei,
  imeiValido,
  normalizarImei,
} from '../src/index.js'

const VALIDO = '490154203237518'
const INVALIDO = '490154203237510'

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
})

async function render(element) {
  await act(async () => root.render(element))
}

async function cambiar(input, value) {
  await act(async () => {
    const descriptor = Object.getOwnPropertyDescriptor(input.constructor.prototype, 'value')
    descriptor.set.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

async function blur(input) {
  // React escucha `focusout` para `onBlur` (#108, mismo patrón del repo).
  await act(async () => input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body })))
}

describe('utilidades de IMEI (#17)', () => {
  test('imeiValido exige 15 dígitos y respeta el dígito control (Luhn)', () => {
    expect(LARGO_IMEI).toBe(15)
    expect(imeiValido(VALIDO)).toBe(true)
    expect(imeiValido('490-154 203 237518')).toBe(true)
    expect(imeiValido(INVALIDO)).toBe(false)
    expect(imeiValido('')).toBe(false)
    expect(imeiValido('49015420323751')).toBe(false)
    expect(imeiValido('4901542032375188')).toBe(false)
    expect(imeiValido(null)).toBe(false)
  })

  test('normalizarImei deja solo dígitos y acota a 15', () => {
    expect(normalizarImei(' 490-154 203 237518 ')).toBe(VALIDO)
    expect(normalizarImei('abc123def456ghi789jkl012mno345pqr678')).toBe('123456789012345')
    expect(normalizarImei(null)).toBe('')
  })

  test('estadoImei distingue vacío, incompleto, inválido y válido', () => {
    expect(estadoImei('')).toBe('vacio')
    expect(estadoImei('   ')).toBe('vacio')
    expect(estadoImei('abc')).toBe('vacio')
    expect(estadoImei('490154')).toBe('incompleto')
    expect(estadoImei(INVALIDO)).toBe('invalido')
    expect(estadoImei(`${VALIDO}9`)).toBe('invalido')
    expect(estadoImei(VALIDO)).toBe('valido')
  })

  test('analizarImei devuelve el limpio, el largo, los faltantes y el estado', () => {
    expect(analizarImei('490-154')).toEqual({ imei: '490154', largo: 6, faltan: 9, completo: false, valido: false, estado: 'incompleto' })
    expect(analizarImei(INVALIDO)).toEqual({ imei: INVALIDO, largo: 15, faltan: 0, completo: true, valido: false, estado: 'invalido' })
    expect(analizarImei(VALIDO)).toEqual({ imei: VALIDO, largo: 15, faltan: 0, completo: true, valido: true, estado: 'valido' })
  })

  test('los mensajes cubren singular y plural', () => {
    expect(MENSAJES_IMEI.vacio).toContain('15 dígitos')
    expect(MENSAJES_IMEI.incompleto(1)).toBe('Falta 1 dígito para completar el IMEI.')
    expect(MENSAJES_IMEI.incompleto(4)).toBe('Faltan 4 dígitos para completar el IMEI.')
    expect(MENSAJES_IMEI.invalido).toContain('dígito control')
  })
})

describe('ImeiField en vivo (#17)', () => {
  test('vacío muestra la ayuda de 15 dígitos y no muestra error', async () => {
    await render(<ImeiField value="" onChange={() => {}} />)
    expect(container.textContent).toContain(MENSAJES_IMEI.vacio)
    expect(container.querySelector('[role="alert"]')).toBeNull()
    const input = container.querySelector('input')
    expect(input.inputMode).toBe('numeric')
    expect(input.getAttribute('maxlength')).toBe('15')
  })

  test('limpia lo no numérico al escribir y emite solo dígitos', async () => {
    const onChange = vi.fn()
    function Harness() {
      const [value, setValue] = useState('')
      return <ImeiField value={value} onChange={(next) => { onChange(next); setValue(next) }} />
    }
    await render(<Harness />)
    await cambiar(container.querySelector('input'), '49A0-154 203 237518')
    expect(onChange).toHaveBeenLastCalledWith(VALIDO)
    expect(container.querySelector('input').value).toBe(VALIDO)
    expect(container.textContent).toContain(MENSAJES_IMEI.valido)
    expect(container.querySelector('[role="status"]').textContent).toContain('IMEI válido.')
  })

  test('el dígito control inválido deja el error junto al campo', async () => {
    await render(<ImeiField value={INVALIDO} onChange={() => {}} />)
    const alerta = container.querySelector('[role="alert"]')
    expect(alerta.textContent).toContain('dígito control')
    const input = container.querySelector('input')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe(alerta.id)
    expect(container.textContent).not.toContain('IMEI válido.')
  })

  test('el incompleto avisa cuántos faltan y solo es error al salir del campo', async () => {
    function Harness() {
      const [value, setValue] = useState('')
      return <ImeiField value={value} onChange={setValue} />
    }
    await render(<Harness />)
    const input = container.querySelector('input')
    await cambiar(input, '490154')
    expect(container.textContent).toContain('Faltan 9 dígitos para completar el IMEI.')
    expect(container.querySelector('[role="alert"]')).toBeNull()
    await blur(input)
    expect(container.querySelector('[role="alert"]').textContent).toContain('Faltan 9 dígitos')
  })

  test('required vacío pide completar el IMEI recién al salir', async () => {
    await render(<ImeiField value="" onChange={() => {}} required />)
    expect(container.querySelector('[role="alert"]')).toBeNull()
    await blur(container.querySelector('input'))
    expect(container.querySelector('[role="alert"]').textContent).toBe(MENSAJES_IMEI.obligatorio)
  })

  test('revisando muestra el estado externo sin adelantar el resultado', async () => {
    await render(<ImeiField value={VALIDO} onChange={() => {}} revisando />)
    const input = container.querySelector('input')
    expect(input.getAttribute('aria-busy')).toBe('true')
    expect(container.textContent).toContain(MENSAJES_IMEI.revisando)
    expect(container.textContent).not.toContain('IMEI válido.')
  })
})
