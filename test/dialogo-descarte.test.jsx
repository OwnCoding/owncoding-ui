// @vitest-environment jsdom
// Cierre con cambios (#323): un diálogo con `dirty` (o con formularios que se
// registran con `useDialogDirty`) no descarta en silencio: la ×, el Esc y el
// clic afuera piden confirmación; «Seguir editando» vuelve y «Descartar y
// cerrar» cierra. Mientras guarda (`busy`/pendiente) no hay confirmación.
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { Button, CIERRE_CON_CAMBIOS, Modal, Drawer, useDialogDirty } from '../src/index.js'

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

async function click(texto) {
  const boton = [...contenedor.querySelectorAll('button')].find((nodo) => nodo.textContent.trim() === texto)
  if (!boton) throw new Error(`No encontré el botón «${texto}»`)
  await act(async () => { boton.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
  return boton
}

async function cerrarPorLaCruz() {
  const boton = contenedor.querySelector('[role="dialog"] [aria-label="Cerrar"]')
  await act(async () => { boton.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
}

async function escape() {
  await act(async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  })
}

function conDescarte({ dirty = true, descarte, enCierre } = {}) {
  function Formulario() {
    const [abierto, setAbierto] = useState(true)
    return (
      <Modal
        open={abierto}
        dirty={dirty}
        descarte={descarte}
        onClose={() => { setAbierto(false); enCierre?.() }}
        title="Editar cliente"
      >
        <p>Contenido con cambios locales.</p>
        <Button>Guardar</Button>
      </Modal>
    )
  }
  return <Formulario />
}

describe('cierre con cambios sin guardar (#323)', () => {
  test('el texto canónico vive en la biblioteca', () => {
    expect(CIERRE_CON_CAMBIOS.titulo).toBe('¿Descartar los cambios?')
    expect(CIERRE_CON_CAMBIOS.confirmar).toBe('Descartar y cerrar')
    expect(CIERRE_CON_CAMBIOS.seguir).toBe('Seguir editando')
  })

  test('la × pide confirmación y «Seguir editando» no cierra', async () => {
    let cerro = false
    await montar(conDescarte({ enCierre: () => { cerro = true } }))
    await cerrarPorLaCruz()
    expect(contenedor.textContent).toContain('¿Descartar los cambios?')
    await click('Seguir editando')
    expect(contenedor.textContent).not.toContain('¿Descartar los cambios?')
    expect(contenedor.textContent).toContain('Contenido con cambios locales.')
    expect(cerro).toBe(false)
  })

  test('«Descartar y cerrar» cierra una sola vez y desmonta el diálogo', async () => {
    let cierres = 0
    await montar(conDescarte({ enCierre: () => { cierres += 1 } }))
    await cerrarPorLaCruz()
    await click('Descartar y cerrar')
    expect(cierres).toBe(1)
    expect(contenedor.querySelector('[role="dialog"]')).toBeNull()
  })

  test('Escape también confirma cuando hay cambios', async () => {
    let cerro = false
    await montar(conDescarte({ enCierre: () => { cerro = true } }))
    await escape()
    expect(contenedor.textContent).toContain('¿Descartar los cambios?')
    await click('Seguir editando')
    expect(cerro).toBe(false)
    await escape()
    await click('Descartar y cerrar')
    expect(cerro).toBe(true)
  })

  test('sin cambios el cierre es directo, sin confirmación', async () => {
    let cerro = false
    await montar(conDescarte({ dirty: false, enCierre: () => { cerro = true } }))
    await cerrarPorLaCruz()
    expect(cerro).toBe(true)
    expect(contenedor.textContent).not.toContain('¿Descartar los cambios?')
  })

  test('los textos se pueden pisar por prop', async () => {
    await montar(
      <Modal open dirty onClose={() => {}} title="Editar" descarte={{ titulo: 'Se pierde lo tipeado', seguir: 'Volver al formulario' }}>
        <p>Contenido</p>
      </Modal>,
    )
    await cerrarPorLaCruz()
    expect(contenedor.textContent).toContain('Se pierde lo tipeado')
    expect(contenedor.textContent).toContain('Volver al formulario')
  })

  test('mientras el diálogo está busy el cierre queda bloqueado, no confirmado', async () => {
    let cerro = false
    await montar(
      <Modal open busy dirty onClose={() => { cerro = true }} title="Guardando">
        <p>Contenido</p>
      </Modal>,
    )
    await cerrarPorLaCruz()
    expect(contenedor.textContent).not.toContain('¿Descartar los cambios?')
    expect(cerro).toBe(false)
  })

  test('useDialogDirty registra los cambios del formulario y el Drawer los respeta', async () => {
    // El hook va DENTRO del diálogo (el contexto vive en el Modal/Drawer).
    function Formulario() {
      const [nombre, setNombre] = useState('')
      useDialogDirty(Boolean(nombre.trim()))
      return <input aria-label="Nombre" value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
    }
    function Contenedor() {
      const [abierto, setAbierto] = useState(true)
      return (
        <Drawer open={abierto} onClose={() => setAbierto(false)} title="Detalle">
          <Formulario />
        </Drawer>
      )
    }
    await montar(<Contenedor />)
    const tipear = async (valor) => {
      const input = contenedor.querySelector('input[aria-label="Nombre"]')
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      await act(async () => {
        setter.call(input, valor)
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })
    }

    // Sin cambios registrados, el cierre es directo.
    await montar(<Contenedor key="sin-cambios" />)
    await cerrarPorLaCruz()
    expect(contenedor.querySelector('[role="dialog"]')).toBeNull()

    // Con el formulario sucio, la misma × confirma antes de descartar.
    await montar(<Contenedor key="con-cambios" />)
    await tipear('Ana')
    expect(contenedor.textContent).not.toContain('¿Descartar los cambios?')
    await cerrarPorLaCruz()
    expect(contenedor.textContent).toContain('¿Descartar los cambios?')
  })
})
