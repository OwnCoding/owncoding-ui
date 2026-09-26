// Buscador de proveedor (#259): filtro por nombre o abreviatura, últimos usados
// por defecto y alta rápida. Estos tests fijan los helpers y el contrato del
// campo (combobox accesible); la interacción vive en la app.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  BuscadorProveedor,
  detalleProveedor,
  filtrarProveedores,
  nombreProveedor,
  normalizarProveedor,
  resolverRecientes,
} from '../src/index.js'

const PROVEEDORES = [
  { id: 'p1', name: 'Distribuidora Ñandú', code: 'DISTRIN', city: 'Asunción', phone: '0981 000 000' },
  { id: 'p2', name: 'Importadora XYZ', code: 'IMPXYZ', city: 'CDE' },
  { id: 'p3', name: 'Tecno Paraguay', code: 'TECNOPY', city: 'Luque' },
]

describe('BuscadorProveedor', () => {
  test('filtra por nombre sin acentos y por abreviatura', () => {
    expect(filtrarProveedores(PROVEEDORES, 'nandu').map((p) => p.id)).toEqual(['p1'])
    expect(filtrarProveedores(PROVEEDORES, 'ÑANDÚ').map((p) => p.id)).toEqual(['p1'])
    expect(filtrarProveedores(PROVEEDORES, 'tecno').map((p) => p.id)).toEqual(['p3'])
    expect(filtrarProveedores(PROVEEDORES, 'IMPXYZ').map((p) => p.id)).toEqual(['p2'])
    expect(filtrarProveedores(PROVEEDORES, '')).toHaveLength(3)
    expect(filtrarProveedores(PROVEEDORES, '', { limite: 2 })).toHaveLength(2)
  })

  test('los últimos usados se resuelven por id, en orden y sin repetir', () => {
    expect(resolverRecientes(PROVEEDORES, ['p3', 'p1']).map((p) => p.id)).toEqual(['p3', 'p1'])
    expect(resolverRecientes(PROVEEDORES, ['p3', 'p3', 'nada', 'p2']).map((p) => p.id)).toEqual(['p3', 'p2'])
    expect(resolverRecientes(PROVEEDORES, [PROVEEDORES[1]]).map((p) => p.id)).toEqual(['p2'])
  })

  test('helpers de nombre y detalle (la abreviatura va en su chip)', () => {
    expect(nombreProveedor(PROVEEDORES[1])).toBe('Importadora XYZ')
    expect(detalleProveedor(PROVEEDORES[0])).toBe('Asunción · 0981 000 000')
    expect(detalleProveedor({ id: 'x', name: 'Solo nombre' })).toBe('')
    expect(normalizarProveedor('  Distribuidora ÑANDÚ ')).toBe('distribuidora nandu')
  })

  test('el campo expone el contrato de combobox', () => {
    const html = renderToStaticMarkup(<BuscadorProveedor proveedores={PROVEEDORES} ariaLabel="Proveedor de la compra" />)
    expect(html).toContain('role="combobox"')
    expect(html).toContain('aria-label="Proveedor de la compra"')
    expect(html).toContain('aria-autocomplete="list"')
    expect(html).toContain('autoComplete="off"')
    const deshabilitado = renderToStaticMarkup(<BuscadorProveedor proveedores={PROVEEDORES} disabled />)
    expect(deshabilitado).toContain('disabled=""')
  })
})
