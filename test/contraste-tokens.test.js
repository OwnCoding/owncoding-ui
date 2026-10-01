// Guarda de contraste del scope v2 (#241): los tonos SEMÁNTICOS del tema v2
// se usan como TEXTO sobre las superficies del shell y de las pantallas del
// piloto, así que tienen que cumplir AA (4.5:1) en claro y oscuro. Si alguien
// vuelve a los vivos de PhoneCheck (#16A34A, #DC2626, #D97706, #4D7CFE) para
// texto, este test lo frena. Medición de referencia: shell v2 de MobOS (DSN),
// tabla de contrastes en `docs/SHELL.md`.
import { describe, expect, test } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Badge, Button, ChipEstado, PageHeader, ThemeToggle, chipDeTono, puntoDeTono } from '../src/index.js'

const tokens = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')
const lineas = tokens.split('\n')

// Devuelve el bloque que ABRE con el selector pedido y contiene tokens `--c-*`.
// (Un `indexOf` a secas puede caer en un bloque sin tokens, como el
// `html.dark { color-scheme }` de las apps que precede a la paleta.)
function bloqueDe(apertura) {
  const inicios = lineas
    .map((linea, indice) => (linea.trim().startsWith(apertura) ? indice : -1))
    .filter((indice) => indice !== -1)
  for (const inicio of inicios) {
    let fin = inicio
    while (fin < lineas.length && !lineas[fin].includes('}')) fin++
    const bloque = lineas.slice(inicio, fin + 1).join('\n')
    // Solo cuenta como bloque de paleta si *define* tokens de color; las
    // referencias `rgb(var(--c-…))` (p. ej. dentro del sistema --ds-*) no.
    if (/--c-[\w-]+:\s*[\d]+\s+[\d]+\s+[\d]+/.test(bloque)) return bloque
  }
  throw new Error(`falta el bloque de tokens que abre con ${apertura}`)
}

function tokensDe(apertura) {
  const paleta = {}
  for (const match of bloqueDe(apertura).matchAll(/--c-([\w-]+):\s*([\d]+)\s+([\d]+)\s+([\d]+);/g)) {
    paleta[match[1]] = [Number(match[2]), Number(match[3]), Number(match[4])]
  }
  return paleta
}

// Paleta global (el lenguaje v2 es la base desde la ronda .21).
const PALETAS = {
  claro: [':root {'],
  oscuro: ['html.dark {'],
}

const efectiva = (bloques) => bloques.reduce((paleta, apertura) => ({ ...paleta, ...tokensDe(apertura) }), {})

const luminancia = ([r, g, b]) => {
  const f = (valor) => { const v = valor / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const contraste = (a, b) => {
  const [alto, bajo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (alto + 0.05) / (bajo + 0.05)
}
// Composición de un color con alfa sobre un fondo opaco.
const sobre = (color, alfa, fondo) => color.map((valor, indice) => valor * alfa + fondo[indice] * (1 - alfa))

// Tokens con rol de texto + superficies donde se apoyan en el shell/pantallas.
const TEXTO = ['fore', 'mute', 'fono-dark', 'fono-light', 'ok', 'warn', 'bad', 'info']
const SUPERFICIES = ['paper', 'ink', 'ink-900', 'ink-800']

describe('contraste AA de la paleta global (lenguaje v2)', () => {
  test('los tonos de texto cumplen AA sobre las superficies en claro y oscuro', () => {
    for (const [tema, bloques] of Object.entries(PALETAS)) {
      const paleta = efectiva(bloques)
      for (const rol of TEXTO) {
        for (const superficie of SUPERFICIES) {
          const texto = paleta[rol]
          const fondo = paleta[superficie]
          if (!texto || !fondo) continue
          const ratio = contraste(texto, fondo)
          expect(ratio, `${tema}: --c-${rol} sobre --c-${superficie} da ${ratio.toFixed(2)}:1 (AA exige 4.5)`).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })

  test('el ítem activo de la navegación cumple AA sobre su propio tinte (#241)', () => {
    // Claro: azul de acción como texto sobre `rgb(var(--c-info) / .14)`.
    const claro = efectiva(PALETAS.claro)
    const fondoClaro = sobre(claro.info, 0.14, claro['ink-800'])
    const ratioClaro = contraste(claro.info, fondoClaro)
    expect(ratioClaro, `claro: texto activo sobre su tinte da ${ratioClaro.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)

    // Oscuro: texto de primer nivel sobre `rgb(var(--c-info) / .20)`.
    const oscuro = efectiva(PALETAS.oscuro)
    const fondoOscuro = sobre(oscuro.info, 0.2, oscuro['ink-800'])
    const ratioOscuro = contraste(oscuro.fore, fondoOscuro)
    expect(ratioOscuro, `oscuro: texto activo sobre su tinte da ${ratioOscuro.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
  })
})

// ── #5: texto de chips sobre relleno tenue ──────────────────────────────────
// `Badge` y `ChipEstado` pintan TEXTO sobre `bg-*/15` (Badge) y `bg-*/10`
// (TONOS.chip). El tono base queda para rellenos, puntos y bordes; la familia
// `--c-*-text` es la que se usa como texto y se mide ≥4.5:1 sobre el tinte en
// blanco y canvas (claro) y en las superficies oscuras.

const TONOS_TEXTO = ['ok', 'warn', 'bad', 'info', 'pass', 'fono']

const superficiesDeTinte = (tema, paleta) => tema === 'claro'
  ? { blanco: paleta.ink, canvas: paleta.paper }
  : { panel: paleta.ink, canvas: paleta.paper, 'ink-800': paleta['ink-800'] }

describe('texto de chips sobre relleno tenue (#5)', () => {
  test('los seis tonos usan su familia *-text y cumplen AA sobre el tinte', () => {
    const claro = efectiva(PALETAS.claro)
    for (const [tema, paleta] of [['claro', claro], ['oscuro', efectiva(PALETAS.oscuro)]]) {
      for (const tono of TONOS_TEXTO) {
        const texto = paleta[`${tono}-text`]
        // `pass` no se redefine por tema: hereda el valor claro.
        const base = paleta[tono] ?? claro[tono]
        expect(texto, `falta --c-${tono}-text en ${tema}`).toBeDefined()
        expect(base, `falta --c-${tono} en ${tema}`).toBeDefined()
        for (const alfa of [0.15, 0.1]) {
          for (const [nombre, fondo] of Object.entries(superficiesDeTinte(tema, paleta))) {
            const ratio = contraste(texto, sobre(base, alfa, fondo))
            expect(
              ratio,
              `${tema}: --c-${tono}-text sobre ${tono}/${alfa * 100} en ${nombre} da ${ratio.toFixed(2)}:1`,
            ).toBeGreaterThanOrEqual(4.5)
          }
        }
      }
    }
  })

  test('el tono base queda intacto: rellenos, puntos y bordes no cambian', () => {
    const claro = efectiva(PALETAS.claro)
    expect(claro.ok).toEqual([22, 101, 52])
    expect(claro.warn).toEqual([146, 64, 14])
    expect(claro.bad).toEqual([185, 28, 28])
    expect(claro.info).toEqual([32, 89, 190])
    expect(claro.pass).toEqual([22, 197, 94])
    expect(claro['fono-light']).toEqual([4, 120, 87])
  })

  test('Badge y StateChip emiten la clase de texto, no el tono base', () => {
    for (const [color, tono] of [
      ['green', 'ok'], ['red', 'bad'], ['orange', 'warn'], ['yellow', 'warn'], ['blue', 'fono'],
    ]) {
      expect(renderToStaticMarkup(h(Badge, { color }, 'Estado')), color).toContain(`text-${tono}-text`)
    }
    expect(renderToStaticMarkup(h(ChipEstado, { estado: 'aprobado' }))).toContain('text-ok-text')
    expect(renderToStaticMarkup(h(ChipEstado, { estado: 'pagado' }))).toContain('text-pass-text')
    expect(renderToStaticMarkup(h(ChipEstado, { estado: 'vencido' }))).toContain('text-bad-text')
    expect(chipDeTono('warn')).toContain('text-warn-text')
    expect(chipDeTono('pass')).toContain('text-pass-text')
    expect(puntoDeTono('fono')).toContain('text-fono-text')
  })

  test('ningún mapa de la librería pinta texto con el tono base sobre su tinte', () => {
    for (const archivo of ['../src/utils/tonos.js', '../src/components/ui.jsx']) {
      const fuente = readFileSync(new URL(archivo, import.meta.url), 'utf8')
      const par = /bg-(ok|warn|bad|info|pass|fono)\/\d+ text-\1(?!-)/g
      expect(fuente.match(par), `${archivo} usa el tono base como texto`).toBeNull()
    }
  })

  test('una app con paleta propia mapea su familia de texto (Scale OS AA)', () => {
    // La paleta AA de Scale OS como TEXTO de chip queda apenas bajo AA (4.26 y
    // 4.47:1, medido en su QA); mapeando `--c-ok-text`/`--c-warn-text` a un paso
    // más oscuro el mismo chip pasa sin tocar los rellenos.
    const ok = [29, 122, 98] // #1D7A62
    const warn = [138, 98, 7] // #8A6207
    expect(contraste(ok, sobre(ok, 0.15, [255, 255, 255]))).toBeLessThan(4.5)
    expect(contraste(warn, sobre(warn, 0.15, [255, 255, 255]))).toBeLessThan(4.5)

    const okTexto = [17, 107, 53] // #116B35
    const warnTexto = [126, 90, 6] // #7E5A06
    expect(contraste(okTexto, sobre(ok, 0.15, [255, 255, 255]))).toBeGreaterThanOrEqual(4.5)
    expect(contraste(warnTexto, sobre(warn, 0.15, [255, 255, 255]))).toBeGreaterThanOrEqual(4.5)
  })

  test('el borde interactivo cumple 3:1 en los dos temas', () => {
    const claro = efectiva(PALETAS.claro)
    const oscuro = efectiva(PALETAS.oscuro)
    const casos = [
      ['claro', claro.interactivo, [claro.ink, claro.paper, claro['ink-800']]],
      ['oscuro', oscuro.interactivo, [oscuro.ink, oscuro.paper, oscuro['ink-800']]],
    ]
    for (const [tema, borde, fondos] of casos) {
      expect(borde, `falta --c-interactivo en ${tema}`).toBeDefined()
      for (const fondo of fondos) {
        const ratio = contraste(borde, fondo)
        expect(ratio, `${tema}: borde interactivo da ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3)
      }
    }
  })

  test('los controles con borde de affordance emiten border-interactivo', () => {
    expect(renderToStaticMarkup(h(Button, { variant: 'outline' }, 'Cancelar'))).toContain('border-interactivo')
    expect(renderToStaticMarkup(h(PageHeader, { title: 'Clientes', backTo: () => {} }))).toContain('border-interactivo')
    expect(renderToStaticMarkup(h(ThemeToggle, {}))).toContain('border-interactivo')
  })
})

// ── Ronda 13 de a11y (#13) ──────────────────────────────────────────────────
// Verificación de los hallazgos de scale-os#60 sobre la versión actual: el par
// de los botones llenos (primary en hover, success y danger), el enlace en
// línea (`text-fono` en claro daba 2.54:1) y el target del `IconAction` por
// defecto (28 px). El chip ya estaba en la familia `*-text` desde #5.

const COMPONENTES = new URL('../src/components/', import.meta.url)

describe('ronda 13 de a11y (#13)', () => {
  test('los botones llenos y su hover cumplen AA en los dos temas', () => {
    // El hover de la casa aclara con `brightness-110` (no cambia de tono), así
    // el par texto/relleno se mantiene. Success/danger usan el par `on-ok`/
    // `on-bad`, que invierte la tinta con el tema.
    const aclarar = (color) => color.map((valor) => Math.min(255, Math.round(valor * 1.1)))
    for (const [tema, paleta] of [['claro', efectiva(PALETAS.claro)], ['oscuro', efectiva(PALETAS.oscuro)]]) {
      expect(contraste(paleta.onbrand, paleta.fono), `${tema}: primary`).toBeGreaterThanOrEqual(4.5)
      expect(contraste(paleta.onbrand, aclarar(paleta.fono)), `${tema}: primary hover`).toBeGreaterThanOrEqual(4.5)
      expect(contraste(paleta['on-ok'], paleta.ok), `${tema}: success`).toBeGreaterThanOrEqual(4.5)
      expect(contraste(paleta['on-ok'], aclarar(paleta.ok)), `${tema}: success hover`).toBeGreaterThanOrEqual(4.5)
      expect(contraste(paleta['on-bad'], paleta.bad), `${tema}: danger`).toBeGreaterThanOrEqual(4.5)
      expect(contraste(paleta['on-bad'], aclarar(paleta.bad)), `${tema}: danger hover`).toBeGreaterThanOrEqual(4.5)
    }
    // El scope consola pisa `--c-ink`/`--c-fono` pero no los tonos base: el par
    // de ok/bad se define ahí explícitamente (tinta clara sobre relleno oscuro).
    const consola = { ...efectiva(PALETAS.claro), ...tokensDe('.consola {') }
    expect(contraste(consola['on-ok'], consola.ok), 'consola: success').toBeGreaterThanOrEqual(4.5)
    expect(contraste(consola['on-bad'], consola.bad), 'consola: danger').toBeGreaterThanOrEqual(4.5)
    const fuente = readFileSync(new URL('../src/components/ui.jsx', import.meta.url), 'utf8')
    expect(fuente).toContain("primary: 'bg-fono text-onbrand hover:brightness-110'")
    expect(fuente).toContain("success: 'bg-ok text-on-ok hover:brightness-110'")
    expect(fuente).toContain("danger: 'bg-bad text-on-bad hover:brightness-110'")
    expect(fuente).not.toContain('hover:bg-fono-light')
  })

  test('el enlace en línea usa el rol de texto AA (no el verde vivo)', () => {
    const fuente = readFileSync(new URL('../src/components/EnlaceLinea.jsx', import.meta.url), 'utf8')
    expect(fuente).toContain('text-fono-light')
    expect(fuente).not.toMatch(/text-fono(?![\w-])/)
    for (const [tema, paleta] of [['claro', efectiva(PALETAS.claro)], ['oscuro', efectiva(PALETAS.oscuro)]]) {
      expect(contraste(paleta['fono-light'], paleta.ink), `${tema}: enlace`).toBeGreaterThanOrEqual(4.5)
    }
  })

  test('ningún componente pinta texto con el tono base', () => {
    const archivos = readdirSync(COMPONENTES).filter((nombre) => nombre.endsWith('.jsx'))
    expect(archivos.length).toBeGreaterThan(50)
    const base = /text-(ok|warn|bad|info|pass|fono)(?![\w-])/g
    for (const archivo of archivos) {
      const fuente = readFileSync(new URL(archivo, COMPONENTES), 'utf8')
      const hallazgos = fuente.match(base)
      expect(hallazgos, `${archivo} usa el tono base como texto: ${hallazgos?.join(', ')}`).toBeNull()
    }
    expect(readFileSync(new URL('../src/utils/tonos.js', import.meta.url), 'utf8')).not.toMatch(base)
  })

  test('el ámbar de una app se mide sobre su chip compuesto', () => {
    // OPS midió el chip real de Scale OS en rgb(231 224 212): el #8A6207
    // propuesto queda en 4.18:1 ✗; un paso más oscuro (#7E5A06) pasa (4.78:1).
    // La app mapea `--c-warn-text` sin tocar los rellenos.
    expect(contraste([138, 98, 7], [231, 224, 212])).toBeLessThan(4.5)
    expect(contraste([126, 90, 6], [231, 224, 212])).toBeGreaterThanOrEqual(4.5)
  })
})
