// #271: lo que un componente pinta sale de sus props. Un `Map`/`Set`/`let` a
// nivel de módulo es una caché que puede servir datos viejos (fotos, logos,
// listas) y sobrevivir a los cambios; si hace falta uno, se justifica acá.
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

const DIR = fileURLToPath(new URL('../src/components', import.meta.url))

// Excepciones revisadas: no guardan datos para pintar.
const PERMITIDOS = new Map([
  ['ThemeToggle.jsx', ['suscriptores']], // lista de suscriptores del tema
  ['TableroKanban.jsx', ['SIN_MOVIMIENTOS']], // Set constante y vacío
])

// Declaración a nivel de módulo (columna 0) con una colección: acumula estado.
const CACHE = /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*new\s+(?:Map|Set|WeakMap|WeakSet)\s*\(/

describe('componentes sin caché de módulo', () => {
  test('ningún componente guarda datos fuera de sus props', () => {
    const culpables = []
    for (const archivo of readdirSync(DIR).filter((nombre) => nombre.endsWith('.jsx'))) {
      const permitidos = PERMITIDOS.get(archivo) || []
      for (const linea of readFileSync(`${DIR}/${archivo}`, 'utf8').split('\n')) {
        const match = CACHE.exec(linea)
        if (match && !permitidos.includes(match[1])) culpables.push(`${archivo}: ${linea.trim()}`)
      }
    }
    expect(culpables, `cachés de módulo sin justificar:\n${culpables.join('\n')}`).toEqual([])
  })
})
