// @vitest-environment jsdom
// Buscador global del shell (#241, lote 33): agrupa por tipo conservando el
// orden de los resultados, resuelve los estados honestos y expone el contrato
// combobox (foco en el campo + `aria-activedescendant` sobre la opción activa).
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { PaletaComandos, agruparResultados, estadoPaleta } from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const RESULTADOS = [
  { id: 'c1', tipo: 'clientes', titulo: 'Ana Giménez', detalle: '0981 000 000' },
  { id: 'p1', tipo: 'pedidos', titulo: 'P-000123' },
  { id: 'c2', tipo: 'clientes', titulo: 'Bruno Díaz' },
]

describe('PaletaComandos', () => {
  test('agrupa por tipo conservando el orden, con etiquetas e íconos por props', () => {
    const grupos = agruparResultados(RESULTADOS, {
      etiquetasTipo: { clientes: 'Clientes' },
      iconosTipo: { clientes: 'users' },
    })
    expect(grupos.map((grupo) => grupo.tipo)).toEqual(['clientes', 'pedidos'])
    expect(grupos[0].items).toHaveLength(2)
    expect(grupos[0].etiqueta).toBe('Clientes')
    expect(grupos[0].icono).toBe('users')
    // Sin rótulo propio, el tipo se capitaliza y usa la lupa.
    expect(grupos[1].etiqueta).toBe('Pedidos')
    expect(grupos[1].icono).toBe('search')
  })

  test('los estados honestos de la búsqueda', () => {
    expect(estadoPaleta({ listo: false })).toBe('seguir')
    expect(estadoPaleta({ listo: true, cargando: true })).toBe('cargando')
    expect(estadoPaleta({ listo: true, error: 'falló' })).toBe('error')
    expect(estadoPaleta({ listo: true, total: 2 })).toBe('listo')
    expect(estadoPaleta({ listo: true })).toBe('vacio')
  })

  test('abierta dibuja el diálogo y el contrato combobox', () => {
    const html = renderToStaticMarkup(
      <PaletaComandos
        abierta
        titulo="Búsqueda global"
        ariaLabel="Buscar en toda la tienda"
        conAtajo={false}
      />,
    )
    expect(html).toContain('role="dialog"')
    expect(html).toContain('aria-label="Búsqueda global"')
    expect(html).toContain('role="combobox"')
    expect(html).toContain('aria-label="Buscar en toda la tienda"')
    // Con menos del mínimo no se consulta: estado «seguir» con el texto propio.
    expect(html).toContain('Seguí escribiendo: buscamos desde 2 caracteres.')
  })

  test('cerrada no dibuja la paleta y el botón respeta el atajo', () => {
    expect(renderToStaticMarkup(<PaletaComandos conAtajo={false} />)).toBe('')
    const boton = renderToStaticMarkup(
      <PaletaComandos boton textoBoton="Buscar" atajoTexto="⌘K" conAtajo={false} />,
    )
    expect(boton).toContain('aria-haspopup="dialog"')
    expect(boton).toContain('Buscar · ⌘K')
  })

  test('gestiona foco, scroll, Escape único y retorno al disparador', async () => {
    const contenedor = document.createElement('div')
    document.body.appendChild(contenedor)
    const root = createRoot(contenedor)
    let cierres = 0
    await act(async () => {
      root.render(<PaletaComandos boton conAtajo={false} onCerrar={() => { cierres += 1 }} />)
    })
    const disparador = contenedor.querySelector('button')
    disparador.focus()
    await act(async () => {
      disparador.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    const campo = contenedor.querySelector('[role="combobox"]')
    expect(document.activeElement).toBe(campo)
    expect(document.body.style.overflow).toBe('hidden')
    await act(async () => {
      campo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(cierres).toBe(1)
    expect(contenedor.querySelector('[role="dialog"]')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(disparador)
    act(() => root.unmount())
    contenedor.remove()
  })
})
