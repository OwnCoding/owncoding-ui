// Alto táctil de 44 px (#249, H3 del QA responsive mobile): los controles
// agrupados que pueden crecer usan `min-h-11` (44 px) y los que no pueden
// cambiar su dibujo suman el patrón `.toque-44` (área de toque centrada de
// 44×44). Si alguien lo revierte, este test lo frena.
import { describe, expect, test } from 'vitest'
import { readFileSync } from 'node:fs'

const leer = (ruta) => readFileSync(new URL(`../src/${ruta}`, import.meta.url), 'utf8')
const distStyles = readFileSync(new URL('../dist/styles.css', import.meta.url), 'utf8')

describe('alto táctil de 44 px (#249)', () => {
  test('la utilidad .toque-44 vive en base.css y viaja al paquete', () => {
    const base = leer('styles/base.css')
    expect(base).toContain('.toque-44 {')
    expect(base).toContain('width: max(100%, 44px)')
    expect(base).toContain('height: max(100%, 44px)')
    expect(distStyles).toContain('.toque-44')
    expect(distStyles).toContain('width: max(100%, 44px)')
  })

  test('los controles agrupados usan min-h-11 (44 px)', () => {
    expect(leer('components/SegmentedField.jsx')).toContain('min-h-11')
    expect(leer('components/ui.jsx')).toContain('min-h-11 rounded-xl px-3 py-2')
    expect(leer('components/BarraInferior.jsx')).toContain('min-h-11')
  })

  test('los que no cambian su dibujo suman toque-44', () => {
    expect(leer('components/ListGridToggle.jsx')).toContain('toque-44')
    expect(leer('components/ui.jsx')).toContain("'toque-44 h-9 w-9'")
  })

  test('IconAction chico: 44 px reales en móvil y 28 px en escritorio (#13)', () => {
    // El hallazgo de la ronda 13 medía el target del IconAction por defecto en
    // 28 px; ahora el área es real (sin pseudo-elemento, sin solaparse con las
    // acciones vecinas) y la densidad de escritorio no cambia.
    expect(leer('components/ui.jsx')).toContain("'h-11 w-11 md:h-7 md:w-7'")
  })
})
