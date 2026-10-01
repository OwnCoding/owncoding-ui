import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  CampanaAvisos,
  GraficoBarras,
  ImporteDelta,
  IndicadorConexion,
  contarSinLeer,
  formatoNumero,
  maximoDeBarras,
  montoConSigno,
  porcentajeBarra,
  signoDe,
  textoContador,
  tonoDelta,
} from '../src/index.js'

// Smoke de las piezas de tablero: importe con signo, estado de conexión,
// campana de avisos y gráfico de barras. Todo props-driven.

describe('importes con signo', () => {
  test('montoConSigno y signoDe no convierten ni inventan ceros', () => {
    expect(montoConSigno(1500000)).toBe('+ Gs 1.500.000')
    expect(montoConSigno(-500000)).toBe('− Gs 500.000')
    expect(montoConSigno(1234.5, 'USD')).toBe('+ US$ 1,234.5')
    expect(montoConSigno(0)).toBe('Gs 0')
    expect(montoConSigno(null)).toBe('—')
    expect(signoDe(5)).toBe('+')
    expect(signoDe(-5)).toBe('−')
    expect(signoDe(0)).toBe('')
  })

  test('formatoNumero es-PY con vacío explícito', () => {
    expect(formatoNumero(1234567)).toBe('1.234.567')
    expect(formatoNumero(12.345, { decimales: 2 })).toBe('12,35')
    expect(formatoNumero(null)).toBe('—')
    expect(formatoNumero('nada', { vacio: '' })).toBe('')
  })
})

describe('ImporteDelta', () => {
  test('positivo en verde con +, negativo en rojo con −', () => {
    const sube = renderToStaticMarkup(<ImporteDelta valor={1500000} />)
    expect(sube).toContain('+ Gs 1.500.000')
    expect(sube).toContain('text-ok')
    expect(sube).toContain('tabular-nums')

    const baja = renderToStaticMarkup(<ImporteDelta valor={-500000} />)
    expect(baja).toContain('− Gs 500.000')
    expect(baja).toContain('text-bad')
  })

  test('el cero es neutro y el dato ausente es una raya', () => {
    const cero = renderToStaticMarkup(<ImporteDelta valor={0} />)
    expect(cero).toContain('Gs 0')
    expect(cero).toContain('text-mute')

    const ausente = renderToStaticMarkup(<ImporteDelta valor={null} />)
    expect(ausente).toContain('—')
    expect(ausente).toContain('text-mute')
  })

  test('invertir cambia el color del signo y el porcentaje se dibuja con coma', () => {
    const invertido = renderToStaticMarkup(<ImporteDelta valor={-500000} invertir />)
    expect(invertido).toContain('text-ok')

    const porcentaje = renderToStaticMarkup(<ImporteDelta valor={-12.5} formato="porcentaje" />)
    expect(porcentaje).toContain('− 12,5 %')
    expect(porcentaje).toContain('text-bad')

    expect(tonoDelta(10)).toBe('ok')
    expect(tonoDelta(-10)).toBe('bad')
    expect(tonoDelta(0)).toBe('mute')
    expect(tonoDelta(-10, { invertir: true })).toBe('ok')
  })
})

describe('IndicadorConexion', () => {
  test('en línea sin pendientes', () => {
    const html = renderToStaticMarkup(<IndicadorConexion />)
    expect(html).toContain('role="status"')
    expect(html).toContain('En línea')
    expect(html).not.toContain('pendientes de subir')
  })

  test('sin conexión y con pendientes: cuenta real y botón de sincronizar', () => {
    const html = renderToStaticMarkup(<IndicadorConexion enLinea={false} pendientes={3} onSincronizar={() => {}} />)
    expect(html).toContain('Sin conexión')
    expect(html).toContain('3 pendientes de subir')
    expect(html).toContain('aria-label="Sincronizar 3 pendientes"')
    expect(html).toContain('text-warn')
  })

  test('sincronizando avisa y deshabilita', () => {
    const html = renderToStaticMarkup(<IndicadorConexion sincronizando pendientes={1} onSincronizar={() => {}} />)
    expect(html).toContain('Sincronizando…')
    expect(html).toContain('animate-spin')
    expect(html).toContain('aria-label="Sincronizando…"')
  })
})

describe('CampanaAvisos', () => {
  const AVISOS = [
    { id: 'a', titulo: 'Cobro vencido', detalle: 'Cliente Ana', tono: 'bad', leido: false },
    { id: 'b', titulo: 'Tarea cumplida', tono: 'ok', leido: true },
  ]

  test('el contador sale de los no leídos y se limita a 99+', () => {
    expect(contarSinLeer(AVISOS)).toBe(1)
    expect(contarSinLeer([])).toBe(0)
    expect(contarSinLeer([{}, {}, {}])).toBe(3)
    expect(textoContador(120)).toBe('99+')
    expect(textoContador(4)).toBe('4')
  })

  test('la campana muestra el contador y el panel no se monta cerrado', () => {
    const html = renderToStaticMarkup(<CampanaAvisos avisos={AVISOS} />)
    expect(html).toContain('aria-label="Avisos, 1 sin leer"')
    expect(html).toContain('aria-haspopup="dialog"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('>1<')
    expect(html).not.toContain('Cobro vencido')
    // Superficie roja: en oscuro el rojo es claro y pide texto oscuro (#241).
    expect(html).toContain('text-white dark:text-onbrand')
  })

  test('sin avisos no hay contador', () => {
    const html = renderToStaticMarkup(<CampanaAvisos avisos={[]} />)
    expect(html).toContain('title="Avisos"')
    expect(html).toContain('aria-label="Avisos"')
    expect(html).not.toContain('bg-bad')
  })
})

describe('GraficoBarras', () => {
  const DATOS = [
    { etiqueta: 'Ene', valor: 10 },
    { etiqueta: 'Feb', valor: 40, tono: 'ok' },
  ]

  test('escala y porcentajes', () => {
    expect(maximoDeBarras(DATOS)).toBe(40)
    expect(maximoDeBarras(DATOS, 50)).toBe(50)
    expect(maximoDeBarras([], null)).toBe(1)
    expect(porcentajeBarra(20, 40)).toBe(50)
    expect(porcentajeBarra(-5, 40)).toBe(0)
    expect(porcentajeBarra(80, 40)).toBe(100)
  })

  test('vertical: barras con altura y valor a la vista', () => {
    const html = renderToStaticMarkup(<GraficoBarras datos={DATOS} altura={160} />)
    expect(html).toContain('role="img"')
    expect(html).toContain('height:25%')
    expect(html).toContain('height:100%')
    expect(html).toContain('Ene')
    expect(html).toContain('>40<')
    expect(html).toContain('bg-ok')
  })

  test('horizontal: filas con etiqueta, barra y valor', () => {
    const html = renderToStaticMarkup(<GraficoBarras datos={DATOS} orientacion="horizontal" />)
    expect(html).toContain('aria-label="Ene: 10"')
    expect(html).toContain('Feb: 40')
  })

  test('sin datos lo dice; un valor a medida se respeta', () => {
    expect(renderToStaticMarkup(<GraficoBarras datos={[]} />)).toContain('Sin datos para graficar')

    const html = renderToStaticMarkup(
      <GraficoBarras datos={[DATOS[0]]} formatoValor={(valor) => `Gs ${valor}`} etiqueta="Ventas" />,
    )
    expect(html).toContain('aria-label="Ventas"')
    expect(html).toContain('Gs 10')
  })
})
