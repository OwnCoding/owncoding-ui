// @vitest-environment jsdom
// Selector de personas (#101): búsqueda al escribir (nombre y rol, con
// acentos), lista visible debajo con foto, orden por uso por usuario
// (más usadas/recientes primero, fallback alfabético; inactivas al final),
// teclado ↑↓/Enter/Esc y mobile (ítems de 44 px).
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { BuscadorPersonas, CLAVE_USO_PERSONAS, filtrarPersonas, leerUsoPersonas, ordenarPersonas, registrarUsoPersona } from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const PERSONAS = [
  { id: 'p-ana', nombre: 'Ana Villalba', rol: 'Colorista', activo: true },
  { id: 'p-lucia', nombre: 'Lucía Benítez', rol: 'Barbería', activo: false },
  { id: 'p-beto', nombre: 'Beto Ramírez', rol: 'Recepción', activo: true },
]

function almacenFalso(inicial = {}) {
  const datos = { ...inicial }
  return {
    getItem: (clave) => (clave in datos ? datos[clave] : null),
    setItem: (clave, valor) => {
      datos[clave] = valor
    },
    _datos: datos,
  }
}

let contenedor
let raiz

beforeEach(() => {
  contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  raiz = createRoot(contenedor)
  window.localStorage.clear()
})

afterEach(() => {
  act(() => raiz.unmount())
  contenedor.remove()
})

async function montar(elemento) {
  await act(async () => {
    raiz.render(elemento)
  })
}

function tipear(input, texto) {
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, texto)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('BuscadorPersonas — utilidades', () => {
  test('filtra por nombre y rol tolerando acentos y mayúsculas', () => {
    expect(filtrarPersonas(PERSONAS, 'lucia').map((p) => p.id)).toEqual(['p-lucia'])
    expect(filtrarPersonas(PERSONAS, 'COLOR').map((p) => p.id)).toEqual(['p-ana'])
    expect(filtrarPersonas(PERSONAS, '')).toHaveLength(3)
  })

  test('ordena por uso, luego recencia, luego alfabético; inactivas al final', () => {
    const uso = {
      'p-beto': { usos: 3, ultima: 10 },
      'p-ana': { usos: 3, ultima: 20 },
    }
    expect(ordenarPersonas(PERSONAS, uso).map((p) => p.id)).toEqual(['p-ana', 'p-beto', 'p-lucia'])
    expect(ordenarPersonas(PERSONAS, {}, { priorizarActivos: false }).map((p) => p.id)).toEqual([
      'p-ana',
      'p-beto',
      'p-lucia',
    ])
  })

  test('el uso por usuario persiste en el almacén (usos + última vez)', () => {
    const almacen = almacenFalso()
    registrarUsoPersona('agenda:test', 'p-ana', almacen, 111)
    registrarUsoPersona('agenda:test', 'p-ana', almacen, 222)
    const uso = leerUsoPersonas('agenda:test', almacen)
    expect(uso['p-ana']).toEqual({ usos: 2, ultima: 222 })
  })
})

describe('BuscadorPersonas — componente', () => {
  test('muestra input + lista debajo con nombre y rol, y filtra al escribir', async () => {
    await montar(<BuscadorPersonas personas={PERSONAS} valor="" onCambiar={() => {}} ariaLabel="Profesional" />)
    const input = contenedor.querySelector('[role="combobox"]')
    expect(input).not.toBe(null)
    expect(contenedor.querySelectorAll('[role="option"]')).toHaveLength(3)
    expect(contenedor.textContent).toContain('Ana Villalba')
    expect(contenedor.textContent).toContain('Colorista')

    await act(async () => tipear(input, 'barber'))
    expect(contenedor.querySelectorAll('[role="option"]')).toHaveLength(1)
    expect(contenedor.textContent).toContain('Lucía Benítez')

    await act(async () => tipear(input, 'zzz'))
    expect(contenedor.textContent).toContain('Sin personas que coincidan.')
  })

  test('teclado: ↑↓ resalta y Enter elige; Esc limpia la búsqueda', async () => {
    const elegidas = []
    await montar(<BuscadorPersonas personas={PERSONAS} valor="" onCambiar={(p) => elegidas.push(p?.id)} ariaLabel="Profesional" />)
    const input = contenedor.querySelector('[role="combobox"]')
    await act(async () => {
      tipear(input, 'b')
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    })
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy()
    await act(async () => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })
    expect(elegidas).toHaveLength(1)
    expect(input.value).toBe('')

    await act(async () => tipear(input, 'ana'))
    await act(async () => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
    expect(input.value).toBe('')
    expect(contenedor.querySelectorAll('[role="option"]')).toHaveLength(3)
  })

  test('ordena por uso guardado y registra la selección', async () => {
    window.localStorage.setItem(`${CLAVE_USO_PERSONAS}agenda:test`, JSON.stringify({ 'p-beto': { usos: 9, ultima: 99 } }))
    const elegidas = []
    await montar(
      <BuscadorPersonas
        personas={PERSONAS}
        valor=""
        onCambiar={(p) => elegidas.push(p?.id)}
        claveUso="agenda:test"
        ariaLabel="Profesional"
      />,
    )
    const primera = contenedor.querySelectorAll('[role="option"]')[0]
    expect(primera.textContent).toContain('Beto Ramírez')

    await act(async () => primera.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(elegidas).toEqual(['p-beto'])
    expect(leerUsoPersonas('agenda:test')['p-beto'].usos).toBe(10)
  })

  test('opciones fijas y opción vacía para filtros y «sin asignar»', async () => {
    const elegidas = []
    await montar(
      <BuscadorPersonas
        personas={PERSONAS}
        valor="todos"
        onCambiar={(p) => elegidas.push(p === null ? null : p?.id ?? p?.valor)}
        opcionesFijas={[{ id: 'todos', valor: 'todos', nombre: 'Todos los profesionales', icono: 'users' }]}
        opcionVacia="Sin responsable"
        ariaLabel="Responsable"
      />,
    )
    const opciones = [...contenedor.querySelectorAll('[role="option"]')]
    expect(opciones[0].textContent).toContain('Todos los profesionales')
    expect(opciones[0].getAttribute('aria-selected')).toBe('true')
    expect(opciones[1].textContent).toContain('Sin responsable')

    await act(async () => opciones[1].dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(elegidas).toEqual([null])
  })
})
