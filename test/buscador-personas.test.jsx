// @vitest-environment jsdom
// #104: en modo `desplegable` (toolbars/filtros) la lista es un menú: arranca
// cerrada, abre al enfocar/escribir y cierra al elegir, con clic afuera o Esc.
// La variante de formulario (lista debajo, #101) queda siempre visible.
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, test } from 'vitest'

import { BuscadorPersonas } from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const PERSONAS = [
  { id: 'ana', nombre: 'Ana López', rol: 'Corte', activo: true },
  { id: 'beto', nombre: 'Beto Ruiz', rol: 'Color', activo: true },
]

function montar(props = {}) {
  const contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  const root = createRoot(contenedor)
  act(() => {
    root.render(<BuscadorPersonas personas={PERSONAS} ariaLabel="Persona" {...props} />)
  })
  const input = contenedor.querySelector('input')
  const lista = () => contenedor.querySelector('[role="listbox"]')
  const opciones = () => [...contenedor.querySelectorAll('[role="option"]')]
  const enfocar = () => act(() => input.focus())
  const escribir = (valor) => {
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      setter.call(input, valor)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  const tecla = (key) => act(() => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  })
  const desmontar = () => act(() => root.unmount())
  return { contenedor, input, lista, opciones, enfocar, escribir, tecla, desmontar }
}

describe('BuscadorPersonas (#104)', () => {
  test('desplegable: arranca cerrado y abre al enfocar/escribir', () => {
    const ui = montar({ desplegable: true })
    expect(ui.lista()).toBeNull()
    expect(ui.input.getAttribute('aria-expanded')).toBe('false')

    ui.enfocar()
    expect(ui.lista()).not.toBeNull()
    expect(ui.input.getAttribute('aria-expanded')).toBe('true')
    expect(ui.opciones()).toHaveLength(2)

    ui.tecla('Escape')
    expect(ui.lista()).toBeNull()

    ui.escribir('ana')
    expect(ui.lista()).not.toBeNull()
    expect(ui.opciones()).toHaveLength(1)
    ui.desmontar()
  })

  test('desplegable: elegir cierra la lista y avisa la persona', () => {
    const elegidas = []
    const ui = montar({ desplegable: true, onCambiar: (persona) => elegidas.push(persona) })
    ui.enfocar()
    act(() => ui.opciones()[1].dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(elegidas[0]?.id).toBe('beto')
    expect(ui.lista()).toBeNull()
    ui.desmontar()
  })

  test('desplegable: un clic afuera cierra', () => {
    const ui = montar({ desplegable: true })
    ui.enfocar()
    expect(ui.lista()).not.toBeNull()
    act(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })))
    expect(ui.lista()).toBeNull()
    ui.desmontar()
  })

  test('lista debajo (formulario): siempre visible y no la cierra el clic afuera', () => {
    const ui = montar()
    expect(ui.lista()).not.toBeNull()
    expect(ui.input.getAttribute('aria-expanded')).toBe('true')
    act(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })))
    expect(ui.lista()).not.toBeNull()
    ui.desmontar()
  })
})

// #108: el input muestra el valor elegido (persona u opción fija) en vez de
// quedar con el placeholder; al enfocar se selecciona para reemplazar.
function Controlado({ inicial = '' }) {
  const [valor, setValor] = useState(inicial)
  return (
    <BuscadorPersonas
      personas={PERSONAS}
      valor={valor}
      onCambiar={(persona) => setValor(persona?.id ?? '')}
      desplegable
      opcionVacia="Todos"
      ariaLabel="Persona"
    />
  )
}

describe('BuscadorPersonas · valor visible (#108)', () => {
  test('muestra la selección y la repone tras escribir y con Escape', () => {
    const contenedor = document.createElement('div')
    document.body.appendChild(contenedor)
    const root = createRoot(contenedor)
    act(() => {
      root.render(<Controlado />)
    })
    const input = contenedor.querySelector('input')
    const escribir = (valor) =>
      act(() => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
        setter.call(input, valor)
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })
    const opcion = (texto) =>
      [...contenedor.querySelectorAll('[role="option"]')].find((li) => li.textContent.includes(texto))

    // Sin selección: se muestra el texto de la opción vacía.
    expect(input.value).toBe('Todos')

    // Escribir muestra la búsqueda…
    act(() => input.focus())
    escribir('bet')
    expect(input.value).toBe('bet')

    // …elegir por clic la reemplaza por el nombre.
    act(() => opcion('Beto').dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(input.value).toBe('Beto Ruiz')

    // Escape repone el valor elegido.
    act(() => input.focus())
    escribir('ana')
    act(() => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(input.value).toBe('Beto Ruiz')

    act(() => root.unmount())
  })
})

describe('BuscadorPersonas · limpiar y un solo desplegable (#108)', () => {
  test('con valor y opcionVacia aparece el limpiar y repone la opción vacía', () => {
    const contenedor = document.createElement('div')
    document.body.appendChild(contenedor)
    const root = createRoot(contenedor)
    act(() => {
      root.render(<Controlado inicial="beto" />)
    })
    const input = contenedor.querySelector('input')
    expect(input.value).toBe('Beto Ruiz')
    const limpiar = contenedor.querySelector('button[aria-label^="Limpiar"]')
    expect(limpiar).not.toBeNull()
    act(() => limpiar.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(input.value).toBe('Todos')
    expect(contenedor.querySelector('button[aria-label^="Limpiar"]')).toBeNull()
    act(() => root.unmount())
  })

  test('al salir del campo (focusout) se cierra la lista', () => {
    const ui = montar({ desplegable: true })
    ui.enfocar()
    expect(ui.lista()).not.toBeNull()
    act(() => {
      ui.input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }))
    })
    expect(ui.lista()).toBeNull()
    ui.desmontar()
  })
})

describe('BuscadorPersonas · clic en opciones con cierre por focusout (#108)', () => {
  test('el mousedown del option no roba el foco (la lista sigue hasta el click)', () => {
    const elegidas = []
    const ui = montar({ desplegable: true, onCambiar: (persona) => elegidas.push(persona) })
    ui.enfocar()
    const opcion = ui.opciones()[0]
    const evento = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    act(() => opcion.dispatchEvent(evento))
    expect(evento.defaultPrevented).toBe(true)
    act(() => opcion.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(elegidas).toHaveLength(1)
    ui.desmontar()
  })
})
