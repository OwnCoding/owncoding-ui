// Navegación de secciones (#267/#253): riel que colapsa a íconos, tira
// horizontal y descripción del grupo activo.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { NavegacionSeccion } from '../src/index.js'

const ITEMS = [
  { id: 'cuenta', label: 'Mi cuenta', icono: 'user', descripcion: 'Tu perfil y tus preferencias.' },
  { id: 'organizacion', label: 'Organización', icono: 'building' },
]

describe('NavegacionSeccion', () => {
  test('el riel expone tabs accesibles, activo y descripción', () => {
    const html = renderToStaticMarkup(
      <NavegacionSeccion items={ITEMS} value="cuenta" onChange={() => {}} ariaLabel="Secciones de Configuración" testId="config-grupos" testIdDescripcion="config-grupo-descripcion">
        <p>contenido</p>
      </NavegacionSeccion>,
    )
    expect(html).toContain('role="tablist"')
    expect(html).toContain('data-testid="config-grupos"')
    expect(html).toContain('aria-label="Secciones de Configuración"')
    expect(html.match(/role="tab"/g)).toHaveLength(2)
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1)
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('data-testid="config-grupo-descripcion"')
    expect(html).toContain('Tu perfil y tus preferencias.')
    expect(html).toContain('contenido')
  })

  test('el toggle refleja el colapso y libera el ancho', () => {
    const expandido = renderToStaticMarkup(
      <NavegacionSeccion items={ITEMS} value="cuenta" onToggle={() => {}} testId="config-grupos" />,
    )
    expect(expandido).toContain('data-testid="config-grupos-toggle"')
    expect(expandido).toContain('aria-expanded="true"')
    expect(expandido).toContain('lg:grid-cols-[16.5rem_minmax(0,1fr)]')

    const colapsado = renderToStaticMarkup(
      <NavegacionSeccion items={ITEMS} value="cuenta" colapsado onToggle={() => {}} testId="config-grupos" />,
    )
    expect(colapsado).toContain('aria-expanded="false"')
    expect(colapsado).toContain('lg:grid-cols-[4.75rem_minmax(0,1fr)]')
    expect(colapsado).toContain('lg:hidden')
  })

  test('la variante horizontal no tiene toggle ni riel', () => {
    const html = renderToStaticMarkup(
      <NavegacionSeccion items={ITEMS} value="cuenta" variante="horizontal" onToggle={() => {}} />,
    )
    expect(html).not.toContain('-toggle')
    expect(html).not.toContain('lg:grid-cols-[')
    expect(html).toContain('role="tablist"')
  })

  test('sin items no dibuja nada y la descripción se puede apagar', () => {
    expect(renderToStaticMarkup(<NavegacionSeccion items={[]} />)).toBe('')
    const sinDescripcion = renderToStaticMarkup(
      <NavegacionSeccion items={ITEMS} value="cuenta" mostrarDescripcion={false} />,
    )
    expect(sinDescripcion).not.toContain('Tu perfil y tus preferencias.')
  })
})
