import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  ESPACIO_BARRA_INFERIOR,
  AyudaModulo,
  BarraInferior,
  NavLateral,
  PaletaComandos,
  agruparResultados,
  estadoPaleta,
} from '../src/index.js'

// Smoke de la navegación: buscador global, ayuda de pantalla y barra inferior.
// El estado cerrado no monta diálogos y el contrato de accesibilidad (rol,
// aria, foco del buscador) queda en el HTML.

describe('PaletaComandos', () => {
  test('cerrada no monta el diálogo; con botón deja el disparador del topbar', () => {
    expect(renderToStaticMarkup(<PaletaComandos abierta={false} buscar={async () => []} />)).toBe('')

    const conBoton = renderToStaticMarkup(<PaletaComandos buscar={async () => []} boton textoBoton="Buscar" />)
    expect(conBoton).toContain('Buscar')
    expect(conBoton).toContain('⌘K')
    expect(conBoton).toContain('aria-haspopup="dialog"')
    expect(conBoton).not.toContain('role="dialog"')
  })

  test('abierta: buscador con foco, ayuda del mínimo y atajos de teclado', () => {
    const html = renderToStaticMarkup(
      <PaletaComandos abierta buscar={async () => []} minimo={3} ariaLabel="Buscar en el panel" />,
    )
    expect(html).toContain('role="dialog"')
    expect(html).toContain('role="combobox"')
    expect(html).toContain('aria-label="Buscar en el panel"')
    expect(html).toContain('Seguí escribiendo: buscamos desde 3 caracteres.')
    expect(html).toContain('moverse')
    expect(html).toContain('Enter')
    expect(html).toContain('Esc')
    expect(html).not.toContain('Sin resultados')
  })

  test('los resultados se agrupan por tipo con la etiqueta del consumidor', () => {
    const resultados = [
      { id: '1', tipo: 'cliente', titulo: 'Ana Pérez' },
      { id: '2', tipo: 'evento', titulo: 'Boda Salón' },
      { id: '3', tipo: 'cliente', titulo: 'Carlos Díaz' },
    ]
    const grupos = agruparResultados(resultados, { etiquetasTipo: { cliente: 'Clientes', evento: 'Eventos' } })
    expect(grupos.map((grupo) => grupo.tipo)).toEqual(['cliente', 'evento'])
    expect(grupos[0].etiqueta).toBe('Clientes')
    expect(grupos[0].items).toHaveLength(2)
    expect(grupos[1].etiqueta).toBe('Eventos')
    expect(grupos[1].icono).toBe('search')

    const conIcono = agruparResultados(resultados, { iconosTipo: { cliente: 'users' } })
    expect(conIcono[0].icono).toBe('users')
    // Un tipo sin etiqueta conocida se muestra capitalizado, no crudo.
    expect(agruparResultados([{ tipo: 'presupuesto' }])[0].etiqueta).toBe('Presupuesto')
  })

  test('el estado de la paleta distingue seguir, cargar, sin resultados y error', () => {
    expect(estadoPaleta({ listo: false })).toBe('seguir')
    expect(estadoPaleta({ listo: true, cargando: true, total: 0 })).toBe('cargando')
    expect(estadoPaleta({ listo: true, total: 0 })).toBe('vacio')
    expect(estadoPaleta({ listo: true, total: 2 })).toBe('listo')
    expect(estadoPaleta({ listo: true, total: 0, error: 'Falló' })).toBe('error')
    expect(estadoPaleta({ listo: true, total: 2, cargando: true })).toBe('listo')
  })
})

describe('AyudaModulo', () => {
  const AYUDA = {
    titulo: 'Calendario',
    resumen: 'La agenda operativa que cruza eventos, cobros y vencimientos.',
    puntos: ['Vista de mes y de semana.', 'Cada día se abre en detalle.'],
    enlaces: [
      { href: '/eventos', etiqueta: 'Eventos y checklist' },
      { href: '/finanzas', etiqueta: 'Cobros y pagos' },
    ],
  }

  test('sin datos no monta nada; con datos deja el botón «?»', () => {
    expect(renderToStaticMarkup(<AyudaModulo />)).toBe('')

    const cerrada = renderToStaticMarkup(<AyudaModulo {...AYUDA} />)
    expect(cerrada).toContain('aria-label="¿Qué es esto? · Calendario"')
    expect(cerrada).toContain('aria-haspopup="dialog"')
    expect(cerrada).not.toContain('role="dialog"')
  })

  test('abierta: resumen, puntos y enlaces internos en el diálogo de la librería', () => {
    const html = renderToStaticMarkup(<AyudaModulo {...AYUDA} abierta />)
    expect(html).toContain('role="dialog"')
    expect(html).toContain('La agenda operativa que cruza eventos')
    expect(html).toContain('Vista de mes y de semana.')
    expect(html).toContain('Cada día se abre en detalle.')
    expect(html).toContain('href="/eventos"')
    expect(html).toContain('Cobros y pagos')
    expect(html).toContain('aria-label="Ir a otro módulo desde Calendario"')
    expect(html).toContain('Cerrar')
    // Mismo ancho de modal que el resto de los formularios de una columna.
    expect(html).toContain('max-w-xl')
  })
})

describe('NavLateral con grupos', () => {
  const GRUPOS = [
    { titulo: 'Operación', items: [{ id: 'cargar', label: 'Cargar', icono: 'cart' }] },
    { titulo: 'Stock', items: [{ id: 'inventario', label: 'Inventario', icono: 'box' }] },
  ]

  test('los grupos llevan rótulo plegable y avisan por callback', () => {
    const html = renderToStaticMarkup(<NavLateral grupos={GRUPOS} activeId="inventario" />)
    expect(html).toContain('aria-expanded="true"')
    expect(html).toContain('Operación')
    expect(html).toContain('Stock')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('Inventario')
  })

  test('un grupo plegado esconde sus ítems y lo dice en aria-expanded', () => {
    const html = renderToStaticMarkup(<NavLateral grupos={GRUPOS} gruposPlegados={{ Stock: true }} />)
    expect(html).toContain('aria-expanded="false"')
    expect(html).not.toContain('Inventario')
    expect(html).toContain('Cargar')
  })

  test('sin grupos sigue siendo la lista plana de siempre', () => {
    const html = renderToStaticMarkup(<NavLateral items={GRUPOS[0].items} activeId="cargar" />)
    expect(html).toContain('aria-current="page"')
    expect(html).not.toContain('aria-expanded="true"')
  })
})

describe('BarraInferior', () => {
  const ITEMS = [
    { id: 'resumen', etiqueta: 'Resumen', icono: 'chart' },
    { id: 'eventos', etiqueta: 'Eventos', icono: 'calendar', href: '/eventos' },
    { id: 'finanzas', etiqueta: 'Finanzas', icono: 'money' },
    { id: 'inventario', etiqueta: 'Inventario', icono: 'box' },
  ]

  test('hasta cuatro ítems + «Más», con el activo marcado', () => {
    const html = renderToStaticMarkup(<BarraInferior items={ITEMS} activo="eventos" onMas={() => {}} />)
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('href="/eventos"')
    expect(html).toContain('Resumen')
    expect(html).toContain('Más')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('md:hidden')
    expect(ESPACIO_BARRA_INFERIOR).toContain('md:pb-0')
  })

  test('el quinto ítem no entra y «Más» puede ir abierto', () => {
    const items = [...ITEMS, { id: 'clientes', etiqueta: 'Clientes', icono: 'users' }]
    const html = renderToStaticMarkup(<BarraInferior items={items} menuAbierto onMas={() => {}} />)
    expect(html).not.toContain('Clientes')
    expect(html).toContain('aria-expanded="true"')
  })

  test('sin ítems ni «Más» no monta la barra', () => {
    expect(renderToStaticMarkup(<BarraInferior />)).toBe('')
  })
})

describe('NavLateral con subítems (#107)', () => {
  const grupos = [
    {
      titulo: 'Configuración',
      items: [
        {
          id: 'micrositio',
          label: 'Mi página',
          icono: 'image',
          hijos: [
            { id: 'personalizacion', label: 'Personalización', icono: 'sliders' },
            { id: 'micrositio-contenido', label: 'Contenido', icono: 'image' },
          ],
        },
      ],
    },
  ]

  test('los hijos se renderizan indentados y el activo queda en el hijo', () => {
    const html = renderToStaticMarkup(<NavLateral grupos={grupos} activeId="personalizacion" />)
    expect(html).toContain('Personalización')
    expect(html).toContain('Contenido')
    expect(html).toContain('pl-7')
    expect(html.match(/aria-current="page"/g)).toHaveLength(1)
    // El `aria-current` va antes del rótulo del hijo activo (y después del padre).
    const activo = html.indexOf('aria-current="page"')
    const padre = html.indexOf('Mi página')
    const hijo = html.indexOf('Personalización')
    expect(activo).toBeGreaterThan(padre)
    expect(activo).toBeLessThan(hijo)
  })

  test('al colapsar el riel no se dibujan los hijos', () => {
    const html = renderToStaticMarkup(<NavLateral grupos={grupos} colapsado />)
    expect(html).not.toContain('Personalización')
    expect(html).not.toContain('Contenido')
  })
})
