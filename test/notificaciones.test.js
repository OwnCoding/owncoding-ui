// Formato de notificaciones (#293): contrato por canal. La bandeja es la fuente
// oficial; el push sale genérico (nada sensible en la pantalla bloqueada) y el
// silencio es un horario. La versión publicada que avisa novedades se compara
// con la de la app.
import { describe, expect, test } from 'vitest'

import {
  compararVersiones,
  enHorarioSilencioso,
  hayVersionNueva,
  partesVersion,
  payloadPush,
  rutaDeAviso,
} from '../src/index.js'

describe('ruta interna y payload del push', () => {
  test('la ruta sale de href y tolera destino', () => {
    expect(rutaDeAviso({ href: '/pedidos/P-1' })).toBe('/pedidos/P-1')
    expect(rutaDeAviso({ destino: '#vencimientos' })).toBe('#vencimientos')
    expect(rutaDeAviso({})).toBe('')
    expect(rutaDeAviso()).toBe('')
  })

  test('el payload es genérico: no viaja nada sensible', () => {
    const payload = payloadPush(
      { id: 'a1', titulo: 'Pago vencido de Ana', detalle: 'Gs 1.500.000', tono: 'bad', href: '/pedidos/P-1' },
      { app: 'MobOS' },
    )
    expect(payload.title).toBe('MobOS')
    expect(payload.body).toBe('Tenés un aviso nuevo.')
    expect(payload.data).toEqual({ ruta: '/pedidos/P-1', id: 'a1', tono: 'bad' })
    expect(JSON.stringify(payload)).not.toContain('Ana')
    expect(JSON.stringify(payload)).not.toContain('1.500.000')
  })

  test('el título y el cuerpo se pueden pisar', () => {
    const payload = payloadPush({}, { title: 'Novedades', body: 'Abrí la app para verlas.' })
    expect(payload.title).toBe('Novedades')
    expect(payload.body).toBe('Abrí la app para verlas.')
    expect(payloadPush({}).title).toBe('Aviso')
  })
})

describe('horario silencioso', () => {
  const aLas = (hora) => new Date(2026, 8, 29, hora, 0, 0)

  test('por defecto calla de 22 a 8 y el aviso igual queda en la bandeja', () => {
    expect(enHorarioSilencioso(aLas(23))).toBe(true)
    expect(enHorarioSilencioso(aLas(7))).toBe(true)
    expect(enHorarioSilencioso(aLas(22))).toBe(true)
    expect(enHorarioSilencioso(aLas(8))).toBe(false)
    expect(enHorarioSilencioso(aLas(14))).toBe(false)
  })

  test('acepta ventanas dentro del día y datos raros', () => {
    expect(enHorarioSilencioso(aLas(14), { desde: 13, hasta: 15 })).toBe(true)
    expect(enHorarioSilencioso(aLas(16), { desde: 13, hasta: 15 })).toBe(false)
    expect(enHorarioSilencioso(aLas(3), { desde: 8, hasta: 8 })).toBe(true)
    expect(enHorarioSilencioso('no-es-fecha')).toBe(false)
    expect(enHorarioSilencioso(aLas(10), { desde: 'x', hasta: 8 })).toBe(false)
  })
})

describe('aviso de versión nueva', () => {
  test('compara con y sin prefijo, e ignorando el build', () => {
    expect(partesVersion('v1.0.190')).toEqual([1, 0, 190])
    expect(partesVersion('1.2')).toEqual([1, 2])
    expect(partesVersion('1.2.3+abc123')).toEqual([1, 2, 3])
    expect(compararVersiones('1.0.190', 'v1.0.191')).toBe(-1)
    expect(compararVersiones('v1.0.190', '1.0.190')).toBe(0)
    expect(compararVersiones('1.2.0', '1.1.9')).toBe(1)
  })

  test('solo avisa si la publicada es mayor', () => {
    expect(hayVersionNueva('v1.0.190', 'v1.0.191')).toBe(true)
    expect(hayVersionNueva('1.0.190', '1.0.190')).toBe(false)
    expect(hayVersionNueva('1.0.190', '1.0.189')).toBe(false)
    expect(hayVersionNueva('', '1.0.1')).toBe(false)
    expect(hayVersionNueva('1.0.190', '1.0.190+abc123')).toBe(false)
  })
})
