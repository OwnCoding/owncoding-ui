import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

import { CATALOGO_EXPORTS, CATEGORIAS_CATALOGO, DESTACADOS_CATALOGO } from '../gallery/catalog.js'
import { diffSelection, validateSha } from '../scripts/ci-diff-check.mjs'

const SHA = {
  base: '1'.repeat(40),
  before: '2'.repeat(40),
  head: '3'.repeat(40),
  fallback: '4'.repeat(40),
  empty: '5'.repeat(40),
  zero: '0'.repeat(40),
}

describe('contrato publico de la galeria', () => {
  test('las metricas verificadas permanecen sincronizadas con el catalogo', () => {
    const visuales = CATALOGO_EXPORTS.filter((item) => item.tipo === 'visual').length
    const api = CATALOGO_EXPORTS.filter((item) => item.tipo === 'api').length
    const curadas = CATALOGO_EXPORTS.filter((item) => item.presentacion).length

    expect({
      total: CATALOGO_EXPORTS.length,
      visuales,
      api,
      curadas,
      categorias: CATEGORIAS_CATALOGO.length,
    }).toEqual({ total: 586, visuales: 164, api: 422, curadas: 164, categorias: 14 })

    expect(DESTACADOS_CATALOGO.map((item) => item.destacado.id)).toEqual([
      'bancos-pagos',
      'telefono-py',
      'ciudad-departamento',
      'cliente-ci-ruc',
    ])

    const galeria = readFileSync('gallery/main.jsx', 'utf8')
    expect(galeria).toContain('valor={METRICAS_CATALOGO.visuales}')
    expect(galeria).not.toMatch(/valor=["{]143/)

    const vistaTelefono = galeria.match(/function VistaTelefono\(\) \{([\s\S]*?)\n\}\n\nfunction VistaCiudadDepartamento/)?.[1]
    expect(vistaTelefono).toBeTruthy()
    const labelId = vistaTelefono.match(/<Label htmlFor="([^"]+)">Teléfono<\/Label>/)?.[1]
    const inputId = vistaTelefono.match(/inputProps=\{\{ id: '([^']+)' \}\}/)?.[1]
    expect(labelId).toBe('gallery-telefono')
    expect(inputId).toBe(labelId)

    const vistaBancos = galeria.match(/function VistaBancosPagos\(\) \{([\s\S]*?)\n\}\n\nfunction VistaTelefono/)?.[1]
    expect(vistaBancos).toContain('useState(BANCO_DESTACADO)')
    expect(vistaBancos).toContain('BANCOS_PREVIEW.map')
    expect(vistaBancos).toContain('seleccionado={banco === nombre}')
    expect(galeria).toContain('Sin asset redistribuible')
    expect(vistaBancos).toContain('variante="compacto"')
    expect(vistaBancos).toContain('variante="horizontal"')
    expect(galeria).toContain("style={registro?.visual?.fondo ? { backgroundColor: registro.visual.fondo } : undefined}")
    expect(vistaBancos).toContain('MARCAS_CONECTADAS_PREVIEW.map')
    expect(vistaBancos).toContain('BancoLogo banco={institucion}')
    expect(vistaBancos).toContain('SOLUCIONES_PAGO_COMERCIOS_PREVIEW.marcas.map')
    expect(vistaBancos.indexOf('SOLUCIONES_PAGO_COMERCIOS_PREVIEW.marcas.map')).toBeLessThan(vistaBancos.indexOf('MARCAS_CONECTADAS_PREVIEW.map'))
    expect(vistaBancos).toContain('Pik mantiene, por separado, su relación corporativa verificada con Itaú')
  })
})

describe('gates de CI', () => {
  test('el workflow conserva historial y ejecuta README y whitespace', () => {
    const workflow = readFileSync('.github/workflows/ci.yml', 'utf8')

    expect(workflow).toContain('fetch-depth: 0')
    expect(workflow).toContain('npm run financial-assets:check')
    expect(workflow).toContain('npm run readme:check')
    expect(workflow).toContain('node scripts/ci-diff-check.mjs')
  })

  test('selecciona rangos seguros para pull requests y pushes', () => {
    expect(diffSelection({ eventName: 'pull_request', baseSha: SHA.base, headSha: SHA.head })).toEqual({
      base: SHA.base,
      head: SHA.head,
      separator: '...',
    })
    expect(diffSelection({ eventName: 'push', beforeSha: SHA.before, headSha: SHA.head })).toEqual({
      base: SHA.before,
      head: SHA.head,
      separator: '..',
    })
    expect(diffSelection({ eventName: 'push', beforeSha: SHA.zero, headSha: SHA.head, emptyTreeSha: SHA.empty })).toEqual({
      base: SHA.empty,
      head: SHA.head,
      separator: '..',
    })
  })

  test('rechaza valores que podrian alterar argumentos de Git', () => {
    expect(() => validateSha('HEAD; rm -rf /', 'head SHA')).toThrow(/head SHA/)
    expect(() => diffSelection({ eventName: 'pull_request', baseSha: '--output=/tmp/x', headSha: SHA.head })).toThrow(/base SHA/)
  })
})
