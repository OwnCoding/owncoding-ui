import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  COOPERATIVAS_PARAGUAY,
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  BancoLogo,
  MedioPagoLogo,
  coberturaBancos,
  coberturaMediosPago,
  logoDeBanco,
  logoDeMedioPago,
} from '../src/index.js'

function visualesEmpaquetados(cobertura) {
  return cobertura.flatMap((entrada) => Object.values(entrada.variantes)).filter((visual) => visual.empaquetado)
}

describe('catálogo de instituciones financieras', () => {
  test('refleja las correcciones vigentes y separa cooperativas', () => {
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).toContain('Zeta Banco')
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).toContain('Finlatina')
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).toContain('Tu Financiera')
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).not.toContain('Financiera Finexpar')
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).not.toContain('Financiera El Comercio')
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).not.toContain('Visión Banco')
    expect(COOPERATIVAS_PARAGUAY).toEqual(['Coomecipar', 'Medalla Milagrosa', 'San Cristóbal', 'Universitaria'])
    expect(BANCOS_PARAGUAY).toHaveLength(BANCOS_Y_FINANCIERAS_PARAGUAY.length + COOPERATIVAS_PARAGUAY.length)
  })

  test('resuelve alias históricos y acentos a la entidad sucesora', () => {
    expect(logoDeBanco('FINANCIERA FINEXPAR')).toMatchObject({ banco: 'Zeta Banco' })
    expect(logoDeBanco('Visión Banco')).toMatchObject({ banco: 'ueno bank', aliasHistorico: 'Visión Banco' })
    expect(logoDeBanco('financiera el comercio')).toMatchObject({ banco: 'ueno bank', aliasHistorico: 'Financiera El Comercio' })
    expect(logoDeBanco('Banco Rio')).toMatchObject({ banco: 'Banco Continental', aliasHistorico: 'Banco Río' })
    expect(logoDeBanco('ITAU')).toMatchObject({ banco: 'Itaú' })
  })

  test('las sugerencias buscan nombres canónicos y alias, pero devuelven activos', async () => {
    const { sugerenciasDeBanco } = await import('../src/utils/bancos.js')
    expect(sugerenciasDeBanco('Banco Itaú Paraguay')).toEqual(['Itaú'])
    expect(sugerenciasDeBanco('Citibank Paraguay')).toEqual(['Citi'])
    expect(sugerenciasDeBanco('Finexpar')).toEqual(['Zeta Banco'])
    expect(sugerenciasDeBanco('Visión Banco')).toEqual(['ueno bank'])
    expect(sugerenciasDeBanco('Banco Río')).toEqual(['Banco Continental'])
  })

  test('cada entrada activa declara compacto y horizontal con procedencia', () => {
    const cobertura = coberturaBancos()
    expect(cobertura).toHaveLength(BANCOS_PARAGUAY.length)
    for (const entrada of cobertura) {
      expect(entrada.categoria).toMatch(/^(banco|financiera|cooperativa)$/)
      expect(entrada.fuenteOficial).toMatch(/^https:\/\//)
      expect(entrada.verificadoEn).toBe('2026-10-01')
      expect(entrada.variantes.compacto?.tipo).toBeTruthy()
      expect(entrada.variantes.compacto?.estado).toBeTruthy()
      expect(entrada.variantes.horizontal?.tipo).toBeTruthy()
      expect(entrada.variantes.horizontal?.estado).toBeTruthy()
    }
    expect(logoDeBanco('Citi', 'compacto')).toMatchObject({ estado: 'permiso-pendiente', visual: { estado: 'permiso-pendiente' } })
  })

  test('las marcas sin evidencia de redistribución usan fallback neutral', () => {
    for (const nombre of ['Banco Basa', 'Banco de la Nación Argentina', 'Banco GNB Paraguay', 'Sudameris', 'Financiera FIC', 'Financiera Paraguayo Japonesa', 'Solar Banco', 'ueno bank']) {
      for (const variante of ['compacto', 'horizontal']) {
        const logo = logoDeBanco(nombre, variante)
        expect(logo.redistribucion).toEqual({ permitida: false, evidencia: null })
        expect(logo.visual.empaquetado).toBeUndefined()
        expect(logo.visual.tipo).toBe(variante === 'compacto' ? 'monograma' : 'texto')
        expect(logo.visual.estado).toBe('permiso-pendiente')
      }
    }
    const html = renderToStaticMarkup(<BancoLogo banco="Sudameris" variante="horizontal" />)
    expect(html).toContain('data-logo-estado="permiso-pendiente"')
    expect(html).not.toContain('<img')
  })

  test('renderiza fallback compacto cuadrado y tratamiento horizontal legible', () => {
    const compacto = renderToStaticMarkup(<BancoLogo banco="ueno" variante="compacto" alto="h-6" />)
    const horizontal = renderToStaticMarkup(<BancoLogo banco="ueno" variante="horizontal" alto="h-6" />)
    expect(compacto).toContain('data-logo-variante="compacto"')
    expect(compacto).toContain('aspect-square')
    expect(compacto).toContain('data-logo-tipo="monograma"')
    expect(compacto).not.toContain('<img')
    expect(horizontal).toContain('data-logo-variante="horizontal"')
    expect(horizontal).toContain('data-logo-tipo="texto"')
    expect(horizontal).toContain('ueno bank')

    const combo = readFileSync(join(process.cwd(), 'src/components/BancoCombobox.jsx'), 'utf8')
    expect(combo).toContain('variante="compacto"')
  })
})

describe('marcas y productos de pago', () => {
  test('separa marcas de tipos genéricos y cubre el P0', () => {
    for (const nombre of ['Visa', 'Mastercard', 'American Express', 'Bancard', 'Red Infonet', 'Dinelco', 'upay', 'uPOS', 'Procard', 'PayPro', 'Cabal', 'Panal']) {
      expect(MEDIOS_PAGO_CON_MARCA).toContain(nombre)
    }
    expect(MARCAS_MEDIOS_PAGO.CARD).toBeUndefined()
    expect(MARCAS_MEDIOS_PAGO.TRANSFER).toBeUndefined()
    expect(MARCAS_MEDIOS_PAGO.uPOS).toMatchObject({ categoria: 'terminal', marcaPadre: 'upay' })
    expect(logoDeMedioPago('Pagopar')).toMatchObject({ marca: 'upay', aliasHistorico: 'Pagopar' })
    for (const marca of ['Bancard', 'Dinelco', 'Procard']) {
      expect(logoDeMedioPago(marca, 'compacto')).toMatchObject({ estado: 'permiso-pendiente', visual: { tipo: 'monograma', estado: 'permiso-pendiente' } })
    }
  })

  test('cada marca activa tiene ambas variantes y un fallback explícito', () => {
    const cobertura = coberturaMediosPago()
    expect(cobertura).toHaveLength(MEDIOS_PAGO_CON_MARCA.length)
    for (const entrada of cobertura) {
      expect(entrada.fuenteOficial).toMatch(/^https:\/\//)
      expect(entrada.verificadoEn).toBe('2026-10-01')
      expect(entrada.variantes.compacto?.tipo).toBeTruthy()
      expect(entrada.variantes.horizontal?.tipo).toBeTruthy()
    }
    expect(logoDeMedioPago('Visa', 'compacto')).toMatchObject({ visual: { tipo: 'monograma', estado: 'permiso-pendiente' } })
    expect(logoDeMedioPago('Visa', 'horizontal')).toMatchObject({ visual: { tipo: 'texto', estado: 'permiso-pendiente' } })
  })

  test('MedioPagoLogo respeta forma y revela el estado del tratamiento', () => {
    const compacto = renderToStaticMarkup(<MedioPagoLogo marca="upay" variante="compacto" alto="h-6" />)
    const fallback = renderToStaticMarkup(<MedioPagoLogo marca="Visa" variante="horizontal" alto="h-6" />)
    expect(compacto).toContain('aspect-square')
    expect(compacto).toContain('data-logo-tipo="monograma"')
    expect(compacto).toContain('data-logo-estado="permiso-pendiente"')
    expect(fallback).toContain('data-logo-estado="permiso-pendiente"')
    expect(fallback).toContain('Visa')
  })
})

describe('assets financieros empaquetados', () => {
  test('los bundles publicados no emiten bytes ni data URLs de marcas de terceros', async () => {
    const { BancoLogo: BancoLogoPublicado } = await import('../dist/index.js')
    const html = renderToStaticMarkup(<BancoLogoPublicado banco="ueno bank" variante="compacto" />)
    expect(html).not.toMatch(/src="data:image\//)
    expect(html).not.toContain('<img')
    expect(existsSync(join(process.cwd(), 'dist/assets/financial'))).toBe(false)
    for (const archivo of ['dist/index.js', 'dist/financial.js', 'dist/financial-metadata.js']) {
      const bundle = readFileSync(join(process.cwd(), archivo), 'utf8')
      expect(bundle, archivo).not.toMatch(/data:image\/svg\+xml,[^`"']{100,}/i)
      expect(bundle, archivo).not.toMatch(/data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]{100,}/i)
      expect(bundle, archivo).not.toContain('ASSETS_FINANCIEROS["')
    }
  })

  test('ningún asset queda habilitado sin licencia o autorización auditable', () => {
    const visuales = [...visualesEmpaquetados(coberturaBancos()), ...visualesEmpaquetados(coberturaMediosPago())]
    expect(visuales).toEqual([])
    for (const entrada of [...coberturaBancos(), ...coberturaMediosPago()]) {
      expect(entrada.redistribucion).toEqual({ permitida: false, evidencia: null })
    }
  })
})
