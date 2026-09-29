// Pie institucional (#291): la regla exige el pie en todas las páginas con el
// contenido mínimo (© + nombre + versión + crédito con enlace). El objeto único
// es `ProductFooter`; la app inyecta marca y versión por props.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { CREDITO_PIE, CREDITO_PIE_URL, ProductFooter } from '../src/index.js'

const credito = (html) => html.slice(html.indexOf('<a '))

describe('ProductFooter', () => {
  test('contenido mínimo: © + nombre + versión + crédito con enlace', () => {
    const html = renderToStaticMarkup(<ProductFooter nombre="Mi App" version="v1.2.3" />)
    expect(html).toContain('data-testid="product-footer"')
    expect(html).toContain(`© ${new Date().getFullYear()} Mi App. Todos los derechos reservados. · v1.2.3`)
    expect(html).toContain(CREDITO_PIE)
    expect(credito(html)).toContain(`href="${CREDITO_PIE_URL}"`)
    expect(credito(html)).toContain('target="_blank"')
    expect(credito(html)).toContain('rel="noreferrer"')
  })

  test('el crédito va por defecto y se puede pisar', () => {
    const propio = renderToStaticMarkup(<ProductFooter nombre="Mi App" version="v9" credito="Hecho por OwnCoding" creditoUrl="https://owncoding.example" />)
    expect(propio).toContain('Hecho por OwnCoding')
    expect(propio).not.toContain(CREDITO_PIE)
    expect(propio).toContain('href="https://owncoding.example"')

    const sinCredito = renderToStaticMarkup(<ProductFooter nombre="Mi App" credito={null} />)
    expect(sinCredito).not.toContain('<a ')
  })

  test('el enlace del crédito tiene área táctil de 44 px', () => {
    expect(credito(renderToStaticMarkup(<ProductFooter nombre="Mi App" version="v1" />))).toContain('toque-44')
  })

  test('el año se puede fijar y sin nombre no queda un punto suelto', () => {
    const html = renderToStaticMarkup(<ProductFooter anio={2025} />)
    expect(html).toContain('© 2025. Todos los derechos reservados.')
    expect(html).not.toContain('© 2025 .')
  })

  test('la app suma sus textos propios (leading y children)', () => {
    const html = renderToStaticMarkup(
      <ProductFooter nombre="Mi App" version="v1" leading={<span>Estado del sistema · </span>}>
        <a href="/terminos">Términos</a>
      </ProductFooter>,
    )
    expect(html).toContain('Estado del sistema · ')
    expect(html).toContain('Términos')
  })
})
