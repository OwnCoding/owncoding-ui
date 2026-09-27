// Bloque de pago (#265): la papelera va dentro de la tarjeta del pago, con
// tooltip y área táctil, y el contenido gana el ancho completo.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { BloquePago } from '../src/index.js'

describe('BloquePago', () => {
  test('el contenido y el encabezado viven dentro de la tarjeta', () => {
    const html = renderToStaticMarkup(
      <BloquePago etiqueta="Pago 1" encabezado={<span>Pagado</span>}>
        <label>Monto</label>
      </BloquePago>,
    )
    expect(html).toContain('data-testid="bloque-pago"')
    expect(html).toContain('Pago 1')
    expect(html).toContain('Pagado')
    expect(html).toContain('Monto')
  })

  test('la papelera va adentro, con tooltip y toque de 44 px', () => {
    const html = renderToStaticMarkup(
      <BloquePago onQuitar={() => {}} etiquetaQuitar="Eliminar pago 2"><span>Medio</span></BloquePago>,
    )
    const articulo = html.slice(html.indexOf('<article'), html.indexOf('</article>'))
    expect(articulo).toContain('aria-label="Eliminar pago 2"')
    expect(articulo).toContain('title="Eliminar pago 2"')
    expect(articulo).toContain('toque-44')
    expect(articulo).toContain('Medio')
  })

  test('sin onQuitar no hay papelera y el acento pinta el borde izquierdo', () => {
    const sinQuitar = renderToStaticMarkup(<BloquePago><span>Medio</span></BloquePago>)
    expect(sinQuitar).not.toContain('Eliminar pago')
    const conAcento = renderToStaticMarkup(<BloquePago acento="warn"><span>Medio</span></BloquePago>)
    expect(conAcento).toContain('border-l-warn/70')
  })
})
