// Ventana de listas largas (#262): el rango que se pinta se calcula con la
// posición del scroll, el alto de la vista y el alto de la fila.
import { describe, expect, test } from 'vitest'

import { ventanaDeLista } from '../src/index.js'

describe('ventanaDeLista', () => {
  test('al inicio muestra lo visible más el margen', () => {
    expect(ventanaDeLista({ total: 100, scrollTop: 0, altoVista: 224, altoFila: 48 })).toEqual({ inicio: 0, fin: 7 })
  })

  test('sigue el scroll y se corre el margen', () => {
    // Fila 10 (scrollTop 480): 5 visibles + 2 de margen arriba y abajo.
    expect(ventanaDeLista({ total: 100, scrollTop: 480, altoVista: 224, altoFila: 48 })).toEqual({ inicio: 8, fin: 17 })
  })

  test('al final no se pasa del total', () => {
    expect(ventanaDeLista({ total: 100, scrollTop: 99 * 48, altoVista: 224, altoFila: 48 })).toEqual({ inicio: 97, fin: 100 })
    expect(ventanaDeLista({ total: 5, scrollTop: 0, altoVista: 224, altoFila: 48, margen: 10 })).toEqual({ inicio: 0, fin: 5 })
  })

  test('sin medidas pinta todo (antes que esconder opciones)', () => {
    expect(ventanaDeLista({ total: 40, scrollTop: 0, altoVista: 0, altoFila: 48 })).toEqual({ inicio: 0, fin: 40 })
    expect(ventanaDeLista({ total: 40, scrollTop: 0, altoVista: 224, altoFila: 0 })).toEqual({ inicio: 0, fin: 40 })
    expect(ventanaDeLista({ total: 0, scrollTop: 0, altoVista: 224, altoFila: 48 })).toEqual({ inicio: 0, fin: 0 })
  })

  test('un scroll negativo o una vista más chica que una fila se acotan', () => {
    expect(ventanaDeLista({ total: 30, scrollTop: -500, altoVista: 224, altoFila: 48 })).toEqual({ inicio: 0, fin: 7 })
    expect(ventanaDeLista({ total: 30, scrollTop: 0, altoVista: 40, altoFila: 48 })).toEqual({ inicio: 0, fin: 3 })
  })
})
