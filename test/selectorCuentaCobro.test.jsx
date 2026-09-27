// @vitest-environment jsdom
// Selector de cuenta de cobro (#262): comportamiento del navegador que el
// markup no puede probar — preselección, búsqueda que colapsa, teclado sin
// arrastrar la página y virtualización al desplazar la lista.
import { useState } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { SelectorCuentaCobro } from '../src/index.js'

// React exige el aviso de `act` en entornos de prueba.
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const CONTINENTAL = {
  id: 'c1', name: 'Continental', bank: 'Banco Continental', kind: 'TRANSFER', currency: 'PYG',
  holder: 'MobOS SA', accountNumber: '1234567890', isActive: true,
}
const PIX = {
  id: 'c2', name: 'Pix de Ana', bank: 'Banco Atlas', kind: 'PIX', currency: 'USD', pixKey: 'ana@mail.com', isActive: true,
}
const cien = () => Array.from({ length: 100 }, (_, i) => ({
  id: `c${i}`, name: `Cuenta ${String(i).padStart(3, '0')}`, kind: 'CASH', currency: 'PYG', isActive: true,
}))

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
  vi.restoreAllMocks()
})

async function montar(elemento) {
  await act(async () => { raiz.render(elemento) })
}

// Envoltorio controlado, como lo usa la pantalla: sin esto el selector no
// colapsa (es un objeto controlado por `cuentaId`).
function Envoltorio({ cuentas = [CONTINENTAL, PIX], inicial = '', onElegir, ...props }) {
  const [id, setId] = useState(inicial)
  return (
    <SelectorCuentaCobro
      cuentas={cuentas}
      cuentaId={id}
      onSelect={(cuenta) => { onElegir?.(cuenta); setId(cuenta?.id || '') }}
      {...props}
    />
  )
}

describe('SelectorCuentaCobro (navegador)', () => {
  test('preselecciona la última usada y, si no, la predeterminada', async () => {
    const elegidas = []
    await montar(<Envoltorio preseleccionar ultimoUsadoId="c2" predeterminadaId="c1" onElegir={(c) => elegidas.push(c.id)} />)
    expect(elegidas).toEqual(['c2'])
    expect(contenedor.textContent).toContain('Pix de Ana')

    elegidas.length = 0
    await act(async () => { raiz.unmount() })
    raiz = createRoot(contenedor)
    await montar(<Envoltorio preseleccionar ultimoUsadoId="borrada" predeterminadaId="c1" onElegir={(c) => elegidas.push(c.id)} />)
    expect(elegidas).toEqual(['c1'])

    elegidas.length = 0
    await act(async () => { raiz.unmount() })
    raiz = createRoot(contenedor)
    await montar(<Envoltorio ultimoUsadoId="c2" onElegir={(c) => elegidas.push(c.id)} />)
    expect(elegidas).toEqual([], 'sin preseleccionar no propone sola')
    expect(contenedor.querySelector('[role="combobox"]')).not.toBe(null)
  })

  test('buscar, elegir y colapsar: una sola tarjeta con los datos', async () => {
    const elegidas = []
    await montar(<Envoltorio onElegir={(c) => elegidas.push(c.id)} />)
    const input = contenedor.querySelector('[role="combobox"]')
    await act(async () => {
      // El setter nativo evita el tracker de React (con `input.value = …` no
      // llega el onChange).
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, 'atlas')
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
    const opciones = contenedor.querySelectorAll('[role="option"]')
    expect(opciones).toHaveLength(1)
    expect(opciones[0].textContent).toContain('Pix de Ana')

    await act(async () => {
      opciones[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(elegidas).toEqual(['c2'])
    expect(contenedor.querySelector('[role="combobox"]')).toBe(null, 'el buscador se colapsa')
    expect(contenedor.querySelector('[data-testid="cuenta-cobro-nombre"]').textContent).toBe('Pix de Ana')
    expect(contenedor.textContent).toContain('Cambiar cuenta')

    // «Cambiar cuenta» reabre el buscador (#262).
    await act(async () => {
      contenedor.querySelector('[data-testid="cuenta-cobro-cambiar"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(contenedor.querySelector('[role="combobox"]')).not.toBe(null)
  })

  test('con 100 cuentas la lista se virtualiza y sigue el scroll', async () => {
    await montar(<Envoltorio cuentas={cien()} />)
    const lista = contenedor.querySelector('[role="listbox"]')
    expect(contenedor.querySelectorAll('[role="option"]').length).toBeLessThanOrEqual(12)
    expect(contenedor.querySelector('[role="option"]').getAttribute('aria-setsize')).toBe('100')
    expect(contenedor.textContent).toContain('Cuenta 000')
    expect(contenedor.textContent).not.toContain('Cuenta 080')

    // Al desplazar la lista aparece el tramo nuevo (ventana + relleno).
    await act(async () => {
      lista.scrollTop = 20 * 48
      lista.dispatchEvent(new Event('scroll'))
    })
    expect(contenedor.textContent).toContain('Cuenta 020')
    expect(contenedor.textContent).not.toContain('Cuenta 000')
    expect(contenedor.querySelectorAll('[role="option"]').length).toBeLessThanOrEqual(12)
  })

  test('las flechas mueven el resaltado sin arrastrar la página', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    await montar(<Envoltorio cuentas={cien()} />)
    const input = contenedor.querySelector('[role="combobox"]')
    await act(async () => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    })
    const resaltada = contenedor.querySelector('[role="option"][aria-selected="true"]')
    expect(resaltada.getAttribute('aria-posinset')).toBe('2')
    expect(scrollIntoView).not.toHaveBeenCalled()

    // Cerrar con Escape limpia la búsqueda.
    await act(async () => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(input.value).toBe('')
  })
})
