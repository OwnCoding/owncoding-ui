// Campos cortos sin truncar (bug de anchos): el teléfono reparte código de
// país (DDI) + número en una fila `flex`, y el contenedor de la app puede
// fijarle un ancho corto (`TAMANOS_CAMPO.telefono` = `w-44`). Con `min-w-0` el
// número se comprimía hasta recortar el texto; ahora conserva un mínimo
// legible y la fila envuelve en vez de aplastarlo. Mismo criterio para el
// código de país: su ancho fijo tiene que entrar `+` y hasta 6 dígitos.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { PhoneField, TAMANOS_CAMPO } from '../src/index.js'

// Clases del `<input>` que corresponde a la etiqueta accesible.
const claseDeCampo = (html, aria) => {
  const etiqueta = html.match(new RegExp(`<input[^>]*aria-label="${aria}"[^>]*>`))?.[0] || ''
  return (etiqueta.match(/class="([^"]*)"/)?.[1] || '').split(/\s+/).filter(Boolean)
}

// Clases de la fila que envuelve los dos campos (el primer div con `flex`).
const claseDeFila = (html) => html.match(/<div class="([^"]*\bflex\b[^"]*)"/)?.[1] || ''

describe('campos cortos sin truncar', () => {
  test('el número del teléfono conserva un mínimo legible (no se comprime a cero)', () => {
    const html = renderToStaticMarkup(<PhoneField phone="981 123 456" onChange={() => {}} />)
    const numero = claseDeCampo(html, 'Teléfono')
    // 8.5rem = 136 px: entran los 11 caracteres del placeholder en móvil
    // (text-base monoespaciado, ~9.6 px por dígito) sin recortar el dato.
    expect(numero).toContain('min-w-[8.5rem]')
    expect(numero).not.toContain('min-w-0')
    expect(numero).toContain('flex-1')
  })

  test('la fila código + número envuelve si el contenedor es angosto', () => {
    const html = renderToStaticMarkup(<PhoneField phone="981 123 456" onChange={() => {}} />)
    expect(claseDeFila(html)).toContain('flex-wrap')
    const codigo = claseDeCampo(html, 'Código de país')
    // 96 px (w-24) menos el padding del `Input` (px-3.5 = 28 px) dejan 68 px:
    // entran «+» y hasta 6 dígitos incluso con el `text-base` de móvil.
    expect(codigo).toContain('w-24')
    expect(codigo).toContain('shrink-0')
  })

  test('con el ancho recomendado (TAMANOS_CAMPO.telefono = w-44) el número no se recorta', () => {
    const html = renderToStaticMarkup(
      <PhoneField phone="981 123 456" onChange={() => {}} className={TAMANOS_CAMPO.telefono} />,
    )
    // El ancho de la app se respeta; el número mantiene su mínimo y la fila
    // envuelve: el campo crece a lo alto en vez de cortar el texto.
    expect(html).toContain(TAMANOS_CAMPO.telefono)
    expect(claseDeFila(html)).toContain('flex-wrap')
    const numero = claseDeCampo(html, 'Teléfono')
    expect(numero).toContain('min-w-[8.5rem]')
    expect(numero).not.toContain('min-w-0')
  })
})
