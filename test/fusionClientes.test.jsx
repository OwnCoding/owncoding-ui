// Unificar clientes (#268): buscador con aviso de posible duplicado, preview de
// la fusión y confirmación con palabra. Tests de helpers y contrato.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  BuscadorCliente,
  CATEGORIAS_FUSION,
  ChipFusion,
  ConfirmarConPalabra,
  PreviewFusion,
  categoriasFusion,
  detalleCliente,
  filtrarClientes,
  hayFusion,
  motivosDuplicadoCliente,
} from '../src/index.js'

const ANA = {
  id: 'c1', name: 'Ana Giménez', phone: '+595 981 000 000', document: '1234567-8', email: 'ana@mail.com', tags: ['vip'],
}
const BRUNO = {
  id: 'c2', name: 'Bruno Díaz', phone: '+595 971 111 222', document: '7654321-0', email: 'bruno@mail.com',
}

describe('unificar clientes', () => {
  test('filtra por nombre, teléfono, CI/RUC, correo o tag (sin acentos)', () => {
    const clientes = [ANA, BRUNO]
    expect(filtrarClientes(clientes, 'gimenez').map((c) => c.id)).toEqual(['c1'])
    expect(filtrarClientes(clientes, 'GIMÉNEZ').map((c) => c.id)).toEqual(['c1'])
    expect(filtrarClientes(clientes, '981000').map((c) => c.id)).toEqual(['c1'])
    expect(filtrarClientes(clientes, '7654321').map((c) => c.id)).toEqual(['c2'])
    expect(filtrarClientes(clientes, 'bruno@').map((c) => c.id)).toEqual(['c2'])
    expect(filtrarClientes(clientes, 'vip').map((c) => c.id)).toEqual(['c1'])
  })

  test('el detalle de la fila usa teléfono · CI/RUC · correo', () => {
    expect(detalleCliente(ANA)).toBe('+595 981 000 000 · 1234567-8 · ana@mail.com')
  })

  test('los motivos de posible duplicado comparan teléfono, documento y correo', () => {
    expect(motivosDuplicadoCliente(ANA, { telefono: '0981 000 000' })).toEqual(['teléfono'])
    expect(motivosDuplicadoCliente(ANA, { documento: '1234567-8', correo: 'ANA@MAIL.COM' })).toEqual(['documento', 'correo'])
    expect(motivosDuplicadoCliente(BRUNO, { telefono: '0981 000 000' })).toEqual([])
  })

  test('el buscador expone el contrato de combobox', () => {
    const html = renderToStaticMarkup(<BuscadorCliente clientes={[ANA, BRUNO]} ariaLabel="Cliente a unificar" />)
    expect(html).toContain('role="combobox"')
    expect(html).toContain('aria-label="Cliente a unificar"')
    expect(html).toContain('aria-autocomplete="list"')
    expect(renderToStaticMarkup(<BuscadorCliente clientes={[ANA]} disabled />)).toContain('disabled=""')
  })

  test('el preview elige principal y lista lo que se fusiona', () => {
    const html = renderToStaticMarkup(
      <PreviewFusion
        entidades={[
          { id: 'c1', titulo: 'Ana Giménez', subtitulo: '+595 981 000 000', datos: [{ etiqueta: 'CI/RUC', valor: '1234567-8' }] },
          { id: 'c2', titulo: 'A. Gimenez', subtitulo: 'ana@mail.com' },
        ]}
        principalId="c1"
        categorias={[{ id: 'pedidos', etiqueta: 'Pedidos', cantidad: 3 }, { id: 'notas', etiqueta: 'Notas', cantidad: 0 }]}
      />,
    )
    expect(html).toContain('Ana Giménez')
    expect(html).toContain('A. Gimenez')
    expect(html).toContain('Queda como principal')
    expect(html).toContain('type="radio"')
    expect(html).toContain('checked=""')
    expect(html).toContain('Se fusiona')
    expect(html).toContain('Pedidos')
    expect(html).toContain('Notas')
    expect(html).toContain('no se borra')
  })

  test('las categorías canónicas del preview llevan el orden y los conteos', () => {
    const filas = categoriasFusion({ pedidos: 3, notas: 0, contacto: 1 })
    expect(filas[0]).toMatchObject({ id: 'pedidos', etiqueta: 'Pedidos', cantidad: 3 })
    expect(filas.map((f) => f.id).slice(0, 3)).toEqual(['pedidos', 'pagos', 'creditos'])
    // Un id fuera del catálogo se agrega al final con su id como etiqueta.
    expect(filas.at(-1)).toMatchObject({ id: 'contacto', etiqueta: 'contacto', cantidad: 1 })
    expect(CATEGORIAS_FUSION.map((c) => c.id)).toContain('garantias')
    expect(hayFusion(filas)).toBe(true)
    expect(hayFusion(categoriasFusion({ notas: 0 }))).toBe(false)
  })

  test('el chip de ficha fusionada apunta a la principal', () => {
    const html = renderToStaticMarkup(
      <ChipFusion principal={{ id: 'c1', name: 'Ana Giménez' }} fusionadoEl="2026-09-26T12:00:00Z" por="Dario" onAbrirPrincipal={() => {}} />,
    )
    expect(html).toContain('Fusionado con')
    expect(html).toContain('Ana Giménez')
    expect(html).toContain('Ver la principal')
    expect(html).toContain('text-info-text')
    expect(renderToStaticMarkup(<ChipFusion principal={null} />)).toBe('')
  })

  test('la confirmación exige la palabra y ofrece el error', () => {
    const html = renderToStaticMarkup(
      <ConfirmarConPalabra resumen="3 pedidos y 2 pagos pasan a la ficha principal." onConfirmar={() => {}} onCancelar={() => {}} error="No se pudo unificar." />,
    )
    expect(html).toContain('Confirmar unificación')
    expect(html).toContain('3 pedidos y 2 pagos')
    expect(html).toContain('FUSIONAR')
    expect(html).toContain('role="alert"')
    const confirmar = html.match(/<button[^>]*data-testid="confirmar-palabra-confirmar"[^>]*>/)?.[0] || ''
    expect(confirmar).toContain('disabled')
  })
})
