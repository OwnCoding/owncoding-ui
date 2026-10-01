import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { BANCO_DESTACADO, BANCOS_PREVIEW, MARCAS_PAGO_PREVIEW } from '../gallery/financial-fixtures.js'
import {
  ASSET_KEYS_FINANCIEROS,
  BLOQUEOS_ASSETS_FINANCIEROS,
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
} from '../src/financial/index.js'

const manifest = JSON.parse(readFileSync(join(process.cwd(), 'docs/financial-assets-manifest.json'), 'utf8'))

function variantesEmpaquetadas(entrada) {
  return Object.values(entrada.variantes).filter((visual) => visual.empaquetado)
}

function htmlLogo(Componente, prop, nombre, variante) {
  return renderToStaticMarkup(<Componente {...{ [prop]: nombre }} variante={variante} />)
}

describe('catálogo de instituciones financieras', () => {
  test('la muestra prioritaria destaca ueno y usa imágenes auténticas locales', () => {
    expect(BANCO_DESTACADO).toBe('ueno bank')
    expect(BANCOS_PREVIEW[0]).toBe(BANCO_DESTACADO)
    expect(BANCOS_PREVIEW.length).toBeGreaterThanOrEqual(15)

    for (const nombre of BANCOS_PREVIEW) {
      expect(BANCOS_PARAGUAY).toContain(nombre)
      for (const variante of ['compacto', 'horizontal']) {
        const registro = logoDeBanco(nombre, variante)
        expect(registro).toMatchObject({ banco: nombre, redistribucion: { permitida: true } })
        expect(registro.visual.asset).toMatch(/^(?:data:image\/|\/src\/assets\/financial\/)/)
        const html = htmlLogo(BancoLogo, 'banco', nombre, variante)
        expect(html).toContain('<img')
        expect(html).toMatch(/src="(?:data:image\/|\/src\/assets\/financial\/)/)
        expect(html).not.toMatch(/src="https?:/)
        expect(html).not.toContain('data-logo-tipo="monograma"')
      }
    }
  })

  test('mantiene metadatos, alias y URLs oficiales corregidas', async () => {
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).toContain('Zeta Banco')
    expect(COOPERATIVAS_PARAGUAY).toEqual(['Coomecipar', 'Medalla Milagrosa', 'San Cristóbal', 'Universitaria'])
    expect(logoDeBanco('FINANCIERA FINEXPAR')).toMatchObject({ banco: 'Zeta Banco' })
    expect(logoDeBanco('Visión Banco')).toMatchObject({ banco: 'ueno bank', aliasHistorico: 'Visión Banco' })
    expect(logoDeBanco('Banco Rio')).toMatchObject({ banco: 'Banco Continental', aliasHistorico: 'Banco Río' })
    expect(logoDeBanco('ITAU')).toMatchObject({ banco: 'Itaú' })

    const { LOGOS_BANCOS, sugerenciasDeBanco } = await import('../src/utils/bancos.js')
    expect(LOGOS_BANCOS['Medalla Milagrosa'].fuenteOficial).toBe('https://www.medalla.coop.py/')
    expect(LOGOS_BANCOS.Universitaria.fuenteOficial).toBe('https://www.universitaria.coop/')
    expect(LOGOS_BANCOS['Tu Financiera'].fuenteOficial).toBe('https://tu.com.py/')
    expect(LOGOS_BANCOS['Zeta Banco'].fuenteOficial).toBe('https://www.zbanco.com.py/')
    expect(sugerenciasDeBanco('Banco Itaú Paraguay')).toEqual(['Itaú'])
  })

  test('cada entidad conocida usa un asset oficial o un bloqueo textual explícito, nunca iniciales', () => {
    const bloqueados = new Set(BLOQUEOS_ASSETS_FINANCIEROS.filter((item) => item.catalogo === 'banco').map((item) => item.id))
    for (const entrada of coberturaBancos()) {
      expect(entrada.fuenteOficial).toMatch(/^https:\/\//)
      expect(entrada.verificadoEn).toBe('2026-10-01')
      for (const [variante, visual] of Object.entries(entrada.variantes)) {
        expect(visual.tipo).not.toBe('monograma')
        if (!visual.empaquetado) {
          expect(bloqueados).toContain(entrada.nombre)
          expect(visual.tipo).toBe('texto')
          expect(htmlLogo(BancoLogo, 'banco', entrada.nombre, variante)).not.toContain('data-logo-tipo="monograma"')
        }
      }
    }
  })
})

describe('marcas y productos de pago', () => {
  test('Pagopar está activo bajo upay y uPOS no inventa una marca independiente', () => {
    expect(MEDIOS_PAGO_CON_MARCA).toContain('Pagopar')
    expect(MARCAS_MEDIOS_PAGO.Pagopar).toMatchObject({ categoria: 'producto', marcaPadre: 'upay', estado: 'verificado' })
    expect(logoDeMedioPago('Pagopar')).toMatchObject({ marca: 'Pagopar', marcaPadre: 'upay' })
    expect(MARCAS_MEDIOS_PAGO.uPOS).toMatchObject({ categoria: 'terminal', marcaPadre: 'upay' })
    expect(logoDeMedioPago('uPOS', 'horizontal').visual).toMatchObject({ tipo: 'texto', estado: 'producto-padre' })
    expect(BLOQUEOS_ASSETS_FINANCIEROS).toContainEqual(expect.objectContaining({ catalogo: 'pago', id: 'uPOS', variante: 'horizontal' }))
  })

  test('la muestra de pagos incluye marcas reales y ambas variantes como imágenes', () => {
    for (const nombre of ['Bancard', 'Dinelco', 'upay', 'Pagopar', 'Procard', 'PayPro', 'Wally', 'Zimple', 'Personal Pay', 'American Express', 'Cabal', 'Mango', 'Vaquita', 'EKO', 'eCLUB', 'Pik']) {
      expect(MARCAS_PAGO_PREVIEW).toContain(nombre)
      for (const variante of ['compacto', 'horizontal']) {
        const registro = logoDeMedioPago(nombre, variante)
        expect(registro.visual.asset).toMatch(/^(?:data:image\/|\/src\/assets\/financial\/)/)
        const html = htmlLogo(MedioPagoLogo, 'marca', nombre, variante)
        expect(html).toContain('<img')
        expect(html).not.toMatch(/src="https?:/)
      }
    }
    expect(logoDeMedioPago('Dinelco')).toMatchObject({ color: '#5E2A84', estado: 'verificado' })
  })

  test('cada marca conocida usa un asset oficial, texto de producto o bloqueo explícito, nunca monograma', () => {
    const bloqueados = new Set(BLOQUEOS_ASSETS_FINANCIEROS.filter((item) => item.catalogo === 'pago').map((item) => item.id))
    for (const entrada of coberturaMediosPago()) {
      for (const [variante, visual] of Object.entries(entrada.variantes)) {
        expect(visual.tipo).not.toBe('monograma')
        if (!visual.empaquetado && visual.estado !== 'producto-padre') expect(bloqueados).toContain(entrada.nombre)
        expect(htmlLogo(MedioPagoLogo, 'marca', entrada.nombre, variante)).not.toContain('data-logo-tipo="monograma"')
      }
    }
  })
})

describe('manifest y bundles financieros', () => {
  test('el API visual coincide con el manifest autorizado y cada archivo tiene una variante', () => {
    expect([...ASSET_KEYS_FINANCIEROS].sort()).toEqual(manifest.assets.map((asset) => asset.file).sort())
    expect(manifest.assets).toHaveLength(63)
    const referencias = new Set([
      ...coberturaBancos().flatMap(variantesEmpaquetadas),
      ...coberturaMediosPago().flatMap(variantesEmpaquetadas),
    ].map((visual) => visual.empaquetado))
    expect([...referencias].sort()).toEqual([...ASSET_KEYS_FINANCIEROS].sort())
    expect(manifest.blockers.map((item) => item.id).sort()).toEqual(BLOQUEOS_ASSETS_FINANCIEROS.map((item) => item.id).sort())
  })

  test('el bundle visual contiene imágenes locales y metadata permanece sin bytes', async () => {
    const { BancoLogo: BancoLogoPublicado } = await import('../dist/index.js')
    const html = renderToStaticMarkup(<BancoLogoPublicado banco="ueno bank" variante="compacto" />)
    expect(html).toContain('<img')
    expect(html).toContain('src="data:image/')
    const metadataBundle = readFileSync(join(process.cwd(), 'dist/financial-metadata.js'), 'utf8')
    expect(metadataBundle).not.toMatch(/data:image\//)
  })
})
