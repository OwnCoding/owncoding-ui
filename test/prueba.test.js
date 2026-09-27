// Ticket de prueba (#277): el corto es el predeterminado y sale solo con el
// título y la validación (fecha/hora opcional); el completo conserva la
// trazabilidad y los códigos. La plantilla fija ancho, tipo de corte y copias.
import { describe, expect, test } from 'vitest'

import {
  ANCHOS_PRUEBA,
  CORTES_PRUEBA,
  PLANTILLA_PRUEBA,
  TIPOS_TICKET_PRUEBA,
  paginaDePrueba,
  plantillaDePrueba,
} from '../src/index.js'

const lineas = (opciones) => paginaDePrueba(opciones).lineas().join('\n')

describe('ticket de prueba', () => {
  test('el corto es el predeterminado: título + validación y nada más', () => {
    const prueba = paginaDePrueba({ nombreApp: 'MobOS' })
    const texto = prueba.lineas().join('\n')

    expect(texto).toContain('TICKET DE PRUEBA MobOS')
    expect(texto).toContain(`VALIDACIÓN ${prueba.validador}`)
    expect(prueba.validador).toMatch(/^\d{4}-\d$/)
    expect(prueba.corte).toBe(true, 'corta el papel')
    // Sin pie de trazabilidad, códigos ni acentos: es el ticket corto.
    expect(texto).not.toContain('Puente')
    expect(texto).not.toContain('Trabajo')
    expect(texto).not.toContain('Escanear')
    expect(texto).not.toContain('Acentos')
    expect(texto).not.toContain('Fecha')
    expect(prueba.lineas().length).toBeLessThan(12)
  })

  test('el corto puede incluir la fecha/hora', () => {
    const texto = lineas({ tipo: 'corta', incluyeFecha: true })
    expect(texto).toContain('Fecha')
  })

  test('el completo conserva trazabilidad, códigos y corte elegido', () => {
    const prueba = paginaDePrueba({
      tipo: 'completa',
      impresora: 'lan:192.168.1.50:9100',
      nombre: 'Mostrador',
      usuario: 'Ana',
      puente: 'Mac local',
      marca: 'A',
      corte: 'parcial',
    })
    const texto = prueba.lineas().join('\n')
    expect(texto).toContain('TICKET DE PRUEBA')
    expect(texto).toContain('Prueba completa')
    expect(texto).toContain('Comparativa A')
    expect(texto).toContain('Escanear')
    expect(texto).toContain('Acentos')
    expect(texto).toContain('Mostrador')
    expect(texto).toContain('Ana')
    expect(texto).toContain('Puente')
    expect(texto).toContain('[CORTE: parcial]')
  })

  test('los tipos siguen disponibles con sus etiquetas', () => {
    expect(TIPOS_TICKET_PRUEBA.corta).toBe('Prueba corta')
    expect(TIPOS_TICKET_PRUEBA.completa).toBe('Prueba completa')
    expect(TIPOS_TICKET_PRUEBA.venta).toBe('Ticket completo de venta')
    expect(Object.keys(TIPOS_TICKET_PRUEBA)).toEqual(['corta', 'completa', 'pedido', 'qr', 'venta', 'caracteres', 'corte'])
  })

  test('la plantilla valida el tipo, el ancho, el corte y las copias', () => {
    expect(PLANTILLA_PRUEBA).toEqual({ tipo: 'corta', ancho: 80, incluyeFecha: false, corte: 'completo', copias: 1 })
    expect(plantillaDePrueba()).toEqual(PLANTILLA_PRUEBA)
    expect(ANCHOS_PRUEBA).toEqual([58, 80])
    expect(CORTES_PRUEBA).toContain('parcial')

    expect(plantillaDePrueba({ tipo: 'completa', ancho: 58, incluyeFecha: true, corte: 'parcial', copias: 3 }))
      .toEqual({ tipo: 'completa', ancho: 58, incluyeFecha: true, corte: 'parcial', copias: 3 })
    // Basura: cae al default en vez de romper la impresión.
    expect(plantillaDePrueba({ tipo: 'inventado', ancho: 100, corte: 'raro', copias: 0 })).toEqual(PLANTILLA_PRUEBA)
    expect(plantillaDePrueba({ copias: 99 }).copias).toBe(1)
  })

  test('la plantilla se aplica al armar el ticket', () => {
    const plantilla = plantillaDePrueba({ tipo: 'completa', ancho: 58, corte: 'avanza-parcial', copias: 2 })
    const texto = paginaDePrueba(plantilla).lineas().join('\n')
    expect(texto).toContain('Prueba completa')
    expect(texto).toContain('[CORTE: avanza-parcial]')
    expect(texto).toContain('Copias')
  })
})
