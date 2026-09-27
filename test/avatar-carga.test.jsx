// @vitest-environment jsdom
// Avatar compartido (#271): al cambiar la imagen no puede quedar pintada la
// anterior mientras carga la nueva, y si falla cae a las iniciales.
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Avatar } from '../src/index.js'

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

async function montar(elemento) {
  await act(async () => { raiz.render(elemento) })
}

const imagen = () => contenedor.querySelector('img')
const texto = () => contenedor.querySelector('span[aria-hidden="true"]')?.textContent

describe('Avatar: cambio de imagen sin pintar la anterior', () => {
  test('mientras carga la nueva se ve el placeholder y nunca la vieja', async () => {
    await montar(<Avatar nombre="Ana Pérez" src="foto-1.png" />)
    expect(imagen().getAttribute('src')).toBe('foto-1.png')
    expect(imagen().className).toContain('opacity-0')
    expect(texto()).toBe('AP')

    await act(async () => { imagen().dispatchEvent(new Event('load')) })
    expect(imagen().className).toContain('opacity-100')
    expect(contenedor.querySelector('span[aria-hidden="true"]')).toBe(null)

    // Cambia la foto: el nodo viejo se descarta (key) y vuelve el placeholder.
    await montar(<Avatar nombre="Ana Pérez" src="foto-2.png" />)
    const nodos = contenedor.querySelectorAll('img')
    expect(nodos).toHaveLength(1)
    expect(nodos[0].getAttribute('src')).toBe('foto-2.png')
    expect(contenedor.innerHTML).not.toContain('foto-1.png')
    expect(texto()).toBe('AP')
    expect(nodos[0].className).toContain('opacity-0')

    await act(async () => { nodos[0].dispatchEvent(new Event('load')) })
    expect(imagen().className).toContain('opacity-100')
  })

  test('si la imagen falla, quedan las iniciales y avisa por onError', async () => {
    const onError = vi.fn()
    await montar(<Avatar nombre="Ana Pérez" src="rota.png" onError={onError} />)
    await act(async () => { imagen().dispatchEvent(new Event('error')) })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(contenedor.querySelector('img')).toBe(null)
    expect(texto()).toBe('AP')

    // La misma URL rota no se vuelve a intentar; una nueva sí.
    await montar(<Avatar nombre="Ana Pérez" src="rota.png" onError={onError} />)
    expect(contenedor.querySelector('img')).toBe(null)
    await montar(<Avatar nombre="Ana Pérez" src="otra.png" onError={onError} />)
    expect(imagen().getAttribute('src')).toBe('otra.png')
  })
})
