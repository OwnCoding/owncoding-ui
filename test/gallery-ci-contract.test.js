import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

import { CATALOGO_EXPORTS, CATEGORIAS_CATALOGO } from '../gallery/catalog.js'
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
    }).toEqual({ total: 531, visuales: 146, api: 385, curadas: 28, categorias: 14 })

    const galeria = readFileSync('gallery/main.jsx', 'utf8')
    expect(galeria).toContain('valor={METRICAS_CATALOGO.visuales}')
    expect(galeria).not.toMatch(/valor=["{]143/)
  })
})

describe('gates de CI', () => {
  test('el workflow conserva historial y ejecuta README y whitespace', () => {
    const workflow = readFileSync('.github/workflows/ci.yml', 'utf8')

    expect(workflow).toContain('fetch-depth: 0')
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
