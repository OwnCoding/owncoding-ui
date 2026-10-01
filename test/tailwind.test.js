// El `content` del preset (fix del piloto de LedBox): Tailwind 3.4 ignora el
// `content` que declara un preset, así que el paquete exporta `owncodingContent`
// y la app lo suma a su propia lista. Sin eso, los componentes se purgan en
// silencio (íconos gigantes, estilos perdidos).
import { describe, expect, test } from 'vitest'
import { readFileSync } from 'node:fs'
import preset, { owncodingContent } from '../tailwind-preset.js'

const fuente = readFileSync(new URL('../tailwind-preset.js', import.meta.url), 'utf8')
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')

describe('owncodingContent del preset', () => {
  test('existe, no está vacío y cubre el bundle y las fuentes', () => {
    expect(Array.isArray(owncodingContent)).toBe(true)
    expect(owncodingContent.length).toBeGreaterThan(0)
    const rutas = owncodingContent.join(' ')
    expect(rutas).toContain('owncoding-ui/dist/**/*.js')
    expect(rutas).toContain('owncoding-ui/src/**/*.jsx')
  })

  test('el preset la expone en `content` y el comentario avisa del bug de Tailwind 3.4', () => {
    expect(preset.content).toEqual(owncodingContent)
    expect(preset.content.length).toBeGreaterThan(0)
    expect(fuente).toContain('owncodingContent')
    expect(fuente).toMatch(/ignora/i)
  })

  test('el README documenta cómo sumarla al content de la app', () => {
    expect(readme).toContain('owncodingContent')
    expect(readme).toContain('content: [...owncodingContent')
  })

  test('el par de texto de los botones llenos (#13) está en el preset', () => {
    const colores = preset.theme.extend.colors
    expect(colores.onbrand).toContain('--c-onbrand')
    expect(colores['on-ok']).toContain('--c-on-ok')
    expect(colores['on-bad']).toContain('--c-on-bad')
  })
})
