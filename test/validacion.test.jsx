// @vitest-environment jsdom
// Validación compartida (#323): reglas puras, mensajes canónicos y el hook de
// estado por campo que alimenta `FormField error`.
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import {
  EMAIL_RE,
  FormField,
  Input,
  MENSAJES_VALIDACION,
  campoVacio,
  emailValido,
  largoMaximo,
  largoMinimo,
  limpiarError,
  maximo,
  minimo,
  obligatorio,
  patron,
  useValidacionCampos,
  validarCampo,
  validarCampos,
} from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let contenedor
let raiz

beforeEach(() => {
  contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  raiz = createRoot(contenedor)
})

afterEach(() => {
  act(() => raiz.unmount())
  contenedor.remove()
})

describe('reglas puras de validación (#323)', () => {
  test('campoVacio cubre null, texto en blanco y arreglos', () => {
    expect(campoVacio(null)).toBe(true)
    expect(campoVacio(undefined)).toBe(true)
    expect(campoVacio('   ')).toBe(true)
    expect(campoVacio([])).toBe(true)
    expect(campoVacio(0)).toBe(false)
    expect(campoVacio('0')).toBe(false)
    expect(campoVacio(['a'])).toBe(false)
  })

  test('obligatorio devuelve el mensaje canónico solo con el campo vacío', () => {
    expect(obligatorio()('')).toBe(MENSAJES_VALIDACION.obligatorio)
    expect(obligatorio()('  ')).toBe(MENSAJES_VALIDACION.obligatorio)
    expect(obligatorio()(null)).toBe(MENSAJES_VALIDACION.obligatorio)
    expect(obligatorio()('Ana')).toBe('')
    expect(obligatorio('Poné un nombre.')('')).toBe('Poné un nombre.')
  })

  test('largo y número respetan el vacío y el mensaje propio', () => {
    expect(largoMinimo(3)('')).toBe('')
    expect(largoMinimo(3)('ab')).toBe(MENSAJES_VALIDACION.largoMinimo(3))
    expect(largoMinimo(3)('abc')).toBe('')
    expect(largoMaximo(3)('abcd')).toBe(MENSAJES_VALIDACION.largoMaximo(3))
    expect(largoMaximo(3)('abc')).toBe('')
    expect(minimo(10)(9)).toBe(MENSAJES_VALIDACION.minimo(10))
    expect(minimo(10)('11')).toBe('')
    expect(maximo(10)('11')).toBe(MENSAJES_VALIDACION.maximo(10))
    expect(maximo(10)('')).toBe('')
  })

  test('patrón y correo usan el mensaje de formato', () => {
    expect(patron(/^\d{4,6}$/)('12ab')).toBe(MENSAJES_VALIDACION.formato)
    expect(patron(/^\d{4,6}$/)('1234')).toBe('')
    expect(emailValido()('ana@mail')).toBe(MENSAJES_VALIDACION.email)
    expect(emailValido()('ana@mail.com')).toBe('')
    expect(emailValido()('')).toBe('')
    expect(EMAIL_RE.test('a@b.c')).toBe(true)
  })

  test('validarCampo acepta regla suelta, arreglo y null', () => {
    expect(validarCampo('', obligatorio())).toBe(MENSAJES_VALIDACION.obligatorio)
    expect(validarCampo('ab', [obligatorio(), largoMinimo(3)])).toBe(MENSAJES_VALIDACION.largoMinimo(3))
    expect(validarCampo('abc', null)).toBe('')
    expect(validarCampo('', undefined)).toBe('')
  })

  test('validarCampos devuelve errores, primer mensaje y orden de campos', () => {
    const reglas = {
      nombre: [obligatorio()],
      email: [obligatorio(), emailValido()],
      dias: [minimo(0), maximo(365)],
    }
    const resultado = validarCampos({ nombre: '', email: 'ana@mail', dias: 400 }, reglas)
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toEqual({
      nombre: MENSAJES_VALIDACION.obligatorio,
      email: MENSAJES_VALIDACION.email,
      dias: MENSAJES_VALIDACION.maximo(365),
    })
    expect(resultado.campos).toEqual(['nombre', 'email', 'dias'])
    expect(resultado.primerError).toBe(MENSAJES_VALIDACION.obligatorio)
    expect(validarCampos({ nombre: 'Ana', email: 'ana@mail.com', dias: 30 }, reglas).valido).toBe(true)
  })

  test('limpiarError devuelve un objeto nuevo y no muta el original', () => {
    const errores = { nombre: 'Falta', email: 'Revisá' }
    const sinNombre = limpiarError(errores, 'nombre')
    expect(sinNombre).toEqual({ email: 'Revisá' })
    expect(errores).toEqual({ nombre: 'Falta', email: 'Revisá' })
    expect(limpiarError(errores)).toEqual({})
    expect(limpiarError(errores, 'inexistente')).toEqual(errores)
  })
})

describe('useValidacionCampos (#323)', () => {
  function Formulario() {
    const { validar, limpiar, errorDe } = useValidacionCampos({
      nombre: [obligatorio()],
      email: [obligatorio(), emailValido()],
    })
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [estado, setEstado] = useState('')
    return (
      <form
        onSubmit={(evento) => {
          evento.preventDefault()
          const resultado = validar({ nombre, email })
          setEstado(resultado.valido ? 'ok' : `error:${resultado.primerError}`)
        }}
      >
        <FormField label="Nombre" htmlFor="nombre" error={errorDe('nombre')}>
          <Input id="nombre" value={nombre} onChange={(evento) => { setNombre(evento.target.value); limpiar('nombre') }} />
        </FormField>
        <FormField label="Correo" htmlFor="email" error={errorDe('email')}>
          <Input id="email" value={email} onChange={(evento) => { setEmail(evento.target.value); limpiar('email') }} />
        </FormField>
        <button type="submit">Validar</button>
        <p role="status">{estado}</p>
      </form>
    )
  }

  const tipear = async (id, valor) => {
    const input = contenedor.querySelector(`#${id}`)
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    await act(async () => {
      setter.call(input, valor)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  test('muestra el error junto al campo, lo limpia al corregir y valida al enviar', async () => {
    await act(async () => { raiz.render(<Formulario />) })
    await act(async () => {
      contenedor.querySelector('button[type="submit"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(contenedor.querySelectorAll('[role="alert"]')).toHaveLength(2)
    expect(contenedor.textContent).toContain(MENSAJES_VALIDACION.obligatorio)
    // El campo inválido queda marcado para lectura y estilo.
    expect(contenedor.querySelector('#nombre').getAttribute('aria-invalid')).toBe('true')
    expect(contenedor.querySelector('#nombre').getAttribute('aria-describedby')).toContain('nombre-descripcion')

    // Corregir el nombre limpia solo su error.
    await tipear('nombre', 'Ana')
    expect(contenedor.querySelectorAll('[role="alert"]')).toHaveLength(1)
    expect(contenedor.querySelector('#nombre').getAttribute('aria-invalid')).toBeNull()

    // El formato del correo se reclama al enviar, no con cada tecla.
    await tipear('email', 'ana@mail')
    await act(async () => {
      contenedor.querySelector('button[type="submit"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(contenedor.textContent).toContain(MENSAJES_VALIDACION.email)
    expect(contenedor.querySelectorAll('[role="alert"]')).toHaveLength(1)

    await tipear('email', 'ana@mail.com')
    expect(contenedor.querySelectorAll('[role="alert"]')).toHaveLength(0)
    await act(async () => {
      contenedor.querySelector('button[type="submit"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(contenedor.querySelector('[role="status"]').textContent).toBe('ok')
  })
})
