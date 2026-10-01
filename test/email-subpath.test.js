import { describe, expect, test } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import * as email from '../src/email/index.js'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const fuente = readFileSync(new URL('../src/email/index.js', import.meta.url), 'utf8')
const dts = readFileSync(new URL('../types/email.d.ts', import.meta.url), 'utf8')
const dist = new URL('../dist/email.js', import.meta.url)
const distDts = new URL('../dist/email.d.ts', import.meta.url)
const declarado = (nombre) => new RegExp(`export (function|const|type|interface|class) ${nombre}\\b`).test(dts)

describe('owncoding-ui/email (presentación pura)', () => {
  test('package.json publica JS y tipos del subpath', () => {
    expect(pkg.exports['./email']).toEqual({
      types: './dist/email.d.ts',
      default: './dist/email.js',
    })
  })

  test('el build genera un módulo puro sin React ni transporte', () => {
    expect(existsSync(dist)).toBe(true)
    expect(existsSync(distDts)).toBe(true)
    expect(readFileSync(distDts, 'utf8')).toBe(dts)
    const bundle = readFileSync(dist, 'utf8')
    expect(bundle.startsWith('"use client"')).toBe(false)
    expect(bundle).not.toMatch(/from\s*["']react/)
    expect(fuente).not.toMatch(/fetch\s*\(/)
  })

  test('cada export runtime tiene declaración exacta', () => {
    for (const nombre of Object.keys(email)) {
      expect(declarado(nombre), `falta el tipo de ${nombre}`).toBe(true)
    }
  })

  test('el subpath publicado conserva el contrato de render', async () => {
    const publicado = await import('../dist/email.js')
    const modelo = publicado.crearCorreoTransaccional({
      identidad: { nombre: 'App', version: '1.0.0' },
      asunto: 'Aviso',
      motivo: 'Tenés una acción pendiente.',
      accion: { etiqueta: 'Abrir', url: 'https://example.com/accion' },
    })
    expect(publicado.renderCorreoTexto(modelo)).toContain('https://example.com/accion')
    expect(publicado.renderCorreoHtml(modelo)).toContain('Si el botón no funciona')
  })
})
