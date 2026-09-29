// @vitest-environment jsdom
// Bandeja de avisos (#293): el contrato de la campana se prueba abriendo el
// panel — vacío con acción, ruta interna (`href` o `destino`) y elegir avisa.
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { CampanaAvisos } from '../src/index.js'

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

async function abrir() {
  await act(async () => {
    contenedor.querySelector('[data-testid="campana-avisos"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

describe('CampanaAvisos (bandeja)', () => {
  test('la campana expone su testid y el contador 99+', async () => {
    const avisos = Array.from({ length: 120 }, (_, i) => ({ id: `a${i}`, titulo: `Aviso ${i}`, leido: false }))
    await montar(<CampanaAvisos avisos={avisos} />)
    const campana = contenedor.querySelector('[data-testid="campana-avisos"]')
    expect(campana).not.toBe(null)
    expect(campana.textContent).toContain('99+')
  })

  test('el vacío lleva acción: nunca queda un cartel sin salida', async () => {
    const onAccion = vi.fn()
    await montar(<CampanaAvisos avisos={[]} vacioAccion={<button type="button" onClick={onAccion}>Ver novedades</button>} />)
    await abrir()
    const boton = [...contenedor.querySelectorAll('button')].find((nodo) => nodo.textContent === 'Ver novedades')
    expect(boton).toBeTruthy()
    await act(async () => { boton.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
    expect(onAccion).toHaveBeenCalledTimes(1)
  })

  test('la ruta interna sale de href y también de destino', async () => {
    const elegidos = []
    const avisos = [
      { id: 'a', titulo: 'Pedido en camino', href: '/pedidos/P-1', tono: 'info' },
      { id: 'b', titulo: 'Pago vencido', destino: '#vencimientos', tono: 'bad', leido: false },
    ]
    await montar(<CampanaAvisos avisos={avisos} onElegir={(aviso) => elegidos.push(aviso.id)} />)
    await abrir()
    const enlaces = [...contenedor.querySelectorAll('a[role="menuitem"]')]
    expect(enlaces.map((nodo) => nodo.getAttribute('href'))).toEqual(['/pedidos/P-1', '#vencimientos'])
    await act(async () => { enlaces[1].dispatchEvent(new MouseEvent('click', { bubbles: true })) })
    expect(elegidos).toEqual(['b'])
    expect(contenedor.querySelector('[role="menu"]')).toBe(null, 'elegir cierra el panel')
  })
})
