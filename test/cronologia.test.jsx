// Cronología (lote LedBox): ícono/tono por tipo, actor, fecha es-PY 24 h,
// agrupación por día, mapeos por props y estado vacío.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { Cronologia, ETIQUETAS_HITO, ICONOS_HITO, TONOS_HITO, agruparHitos, etiquetaDeHito } from '../src/index.js'

const HITOS = [
  { id: 'a', fecha: '2026-09-21T10:30:00', tipo: 'creado', titulo: 'Presupuesto creado', detalle: 'Ana Giménez', actor: 'Dario' },
  { id: 'b', fecha: '2026-09-22T15:05:00', tipo: 'aprobado', titulo: 'Aprobación digital del cliente', actor: 'Cliente (portal)' },
  { id: 'c', fecha: '2026-09-22T18:40:00', tipo: 'pago', titulo: 'Cobro recibido: Gs 500.000' },
]

describe('Cronologia', () => {
  test('una fila por hito con ícono, actor y fecha en 24 h', () => {
    const html = renderToStaticMarkup(<Cronologia hitos={HITOS} />)
    expect(html).toContain('aria-label="Cronología"')
    expect(html).toContain('Presupuesto creado')
    expect(html).toContain('Dario')
    expect(html).toContain('Aprobación digital del cliente')
    expect(html).toContain('Cliente (portal)')
    expect(html).toContain('15:05')
    expect(html).not.toContain('p. m.')
    // El punto del hito toma el tono del tipo (`aprobado` = ok, `creado` = mute).
    expect(html).toContain('bg-ok/15 text-ok')
    expect(html).toContain('bg-ink-700 text-mute')
  })

  test('los mapeos por props pisan los defectos y el tipo se puede rotular', () => {
    const html = renderToStaticMarkup(
      <Cronologia
        hitos={[{ id: 'x', fecha: '2026-09-22T09:00:00', tipo: 'mi_tipo', titulo: 'Hito propio' }]}
        tonos={{ mi_tipo: 'bad' }}
        iconos={{ mi_tipo: 'alert' }}
        mostrarTipo
      />,
    )
    expect(html).toContain('bg-bad/15 text-bad')
    expect(html).toContain('Hito propio')
    expect(html).toContain('mi tipo')
  })

  test('agrupa por día con el encabezado de fecha', () => {
    const grupos = agruparHitos(HITOS)
    expect(grupos.map((grupo) => grupo.hitos.length)).toEqual([1, 2])
    const html = renderToStaticMarkup(<Cronologia hitos={HITOS} agrupar />)
    expect(html).toContain('21/9/2026')
    expect(html).toContain('22/9/2026')
    expect(html).toContain('Cronología · 22/9/2026')
  })

  test('los estados honestos de carga y error (#268)', () => {
    const cargando = renderToStaticMarkup(<Cronologia hitos={HITOS} cargando onActualizar={() => {}} />)
    expect(cargando).toContain('aria-busy="true"')
    expect(cargando).toContain('Actualizar')
    expect(cargando).toContain('Movimientos más recientes primero.')
    expect(cargando).not.toContain('Presupuesto creado')

    const error = renderToStaticMarkup(<Cronologia error="Falló la red." onReintentar={() => {}} />)
    expect(error).toContain('No se pudo cargar la cronología')
    expect(error).toContain('Falló la red.')
    expect(error).toContain('Reintentar')
  })

  test('el vacío y los mapas compartidos', () => {
    const vacio = renderToStaticMarkup(<Cronologia vacioTitulo="Sin movimientos" vacioDetalle="Aparecen solos." />)
    expect(vacio).toContain('Sin movimientos')
    expect(vacio).toContain('Aparecen solos.')
    expect(ICONOS_HITO.pago).toBe('money')
    expect(TONOS_HITO.cancelado).toBe('bad')
    expect(ETIQUETAS_HITO.pago).toBe('Pago')
    expect(etiquetaDeHito('pago')).toBe('Pago')
    expect(etiquetaDeHito('tipo_nuevo')).toBe('tipo nuevo')
  })
})
