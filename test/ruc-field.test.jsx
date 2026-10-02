// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { consultarRucDemo } from '../gallery/main.jsx'
import { RucField } from '../src/index.js'

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

async function click(node) {
  await act(async () => node.dispatchEvent(new MouseEvent('click', { bubbles: true })))
}

describe('RucField numérico y confirmable', () => {
  test('sanitiza letras y separadores al escribir o pegar, y emite el RUC formateado', async () => {
    const onChange = vi.fn()

    function Harness() {
      const [value, setValue] = useState('')
      return <RucField value={value} onChange={(next) => { onChange(next); setValue(next) }} />
    }

    await render(<Harness />)
    const input = container.querySelector('input')
    await cambiar(input, '80A0.12B345-z6')

    expect(onChange).toHaveBeenLastCalledWith('80012345-6')
    expect(input.value).toBe('80012345-6')
    expect(input.inputMode).toBe('numeric')
    expect(input.pattern).toBe('[0-9]{0,8}(-[0-9]?)?')
  })

  test('sanitiza valores programáticos y nunca consulta ni aplica datos sin confirmación', async () => {
    const consultar = vi.fn(async (ruc) => ({ name: 'Empresa Demo', fullRuc: ruc, simulado: true }))
    const onAplicar = vi.fn()
    await render(<RucField value="80A012345x6" onChange={() => {}} consultar={consultar} onAplicar={onAplicar} />)

    const input = container.querySelector('input')
    expect(input.value).toBe('80012345-6')
    await click(container.querySelector('button[aria-label="Extraer los datos del RUC"]'))

    expect(consultar).toHaveBeenCalledWith('80012345-6')
    expect(onAplicar).not.toHaveBeenCalled()
    expect(container.textContent).toContain('Empresa Demo')

    await click([...container.querySelectorAll('button')].find((button) => button.textContent === 'Usar estos datos'))
    expect(onAplicar).toHaveBeenCalledWith(expect.objectContaining({ name: 'Empresa Demo', fullRuc: '80012345-6' }))
  })
})

describe('fixtures RUC de la galería', () => {
  test('entrega empresas demo diferentes y deterministas para distintos RUC', async () => {
    const horizonte = await consultarRucDemo('80012345-6')
    const guarani = await consultarRucDemo('80054321-2')

    expect(horizonte.name).toBe('Comercial Horizonte Demo S.A.')
    expect(guarani.name).toBe('Distribuidora Guaraní Demo S.R.L.')
    expect(guarani.name).not.toBe(horizonte.name)
    expect(await consultarRucDemo('80012345-6')).toEqual(horizonte)
    expect(horizonte).toMatchObject({ fullRuc: '80012345-6', simulado: true })
  })
})
