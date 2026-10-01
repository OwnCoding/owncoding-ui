import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  ProductFooter,
  ProductPrefooter,
  crearIdentidadApp,
  esVersionApp,
  etiquetaVersionApp,
} from '../src/index.js'

describe('identidad visible de app', () => {
  test('acepta SemVer estricto y release candidates numeradas', () => {
    expect(esVersionApp('1.2.3')).toBe(true)
    expect(esVersionApp('1.2.3-rc.2')).toBe(true)
    expect(esVersionApp('v1.2.3')).toBe(false)
    expect(esVersionApp('1.2')).toBe(false)
    expect(esVersionApp('1.2.3-beta')).toBe(false)
    expect(etiquetaVersionApp('1.2.3-rc.2')).toBe('v1.2.3-rc.2')
  })

  test('crea una identidad inmutable sin leer package.json', () => {
    const identidad = crearIdentidadApp({ nombre: 'Controlaria', version: '0.1.0' })
    expect(identidad).toMatchObject({ nombre: 'Controlaria', version: '0.1.0', etiquetaVersion: 'v0.1.0' })
    expect(Object.isFrozen(identidad)).toBe(true)
    expect(() => crearIdentidadApp({ nombre: 'Controlaria', version: '0.1' })).toThrow(/X\.Y\.Z/)
  })
})

describe('modelos institucionales', () => {
  const identidad = crearIdentidadApp({ nombre: 'Controlaria', version: '0.1.0' })

  test('ProductFooter consume identidad, modelo y enlaces estructurados', () => {
    const html = renderToStaticMarkup(
      <ProductFooter
        identidad={identidad}
        modelo="distribuido"
        enlaces={[{ href: '/privacidad', etiqueta: 'Privacidad' }]}
      />,
    )
    expect(html).toContain('data-modelo="distribuido"')
    expect(html).toContain('Controlaria')
    expect(html).toContain('v0.1.0')
    expect(html).toContain('href="/privacidad"')
    expect(html).toContain('text-xs')
    expect(html).toContain('min-h-11')
  })

  test('ProductPrefooter cubre enlaces, acción y redes sin bajar de 12 px', () => {
    const html = renderToStaticMarkup(
      <ProductPrefooter
        modelo="completo"
        columnas={[{ titulo: 'Producto', enlaces: [{ href: '/estado', etiqueta: 'Estado' }] }]}
        accion={{ titulo: '¿Necesitás ayuda?', enlace: { href: '/soporte', etiqueta: 'Contactar' } }}
        redes={[{ href: 'https://example.com', etiqueta: 'LinkedIn' }]}
      />,
    )
    expect(html).toContain('data-testid="product-prefooter"')
    expect(html).toContain('data-modelo="completo"')
    expect(html).toContain('Producto')
    expect(html).toContain('¿Necesitás ayuda?')
    expect(html).toContain('aria-label="Redes sociales"')
    expect(html).not.toContain('text-[11px]')
  })
})
