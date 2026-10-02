// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import {
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  MedioPagoLogo,
  RELACIONES_FINANCIERAS,
  buscarRelacionesFinancieras,
  institucionesSugeridasPorMarca,
  logoDeBanco,
  logoDeMedioPago,
  marcasRelacionadasConInstitucion,
  normalizarRelacionFinanciera,
  relacionFinancieraDe,
  sugerenciasDeBanco,
  sugerenciasDeMarcaPago,
} from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let contenedor
let raiz

beforeEach(() => {
  contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  raiz = createRoot(contenedor)
})

afterEach(() => {
  act(() => raiz.unmount())
  contenedor.remove()
})

async function montar(elemento) {
  await act(async () => { raiz.render(elemento) })
}

describe('relaciones entre instituciones y marcas de consumo', () => {
  test('mantiene operador, proveedor, actividad y fuentes como conceptos separados', () => {
    expect(relacionFinancieraDe('Billetera Mango')).toMatchObject({
      marca: 'Mango', financialProvider: 'Tu Financiera', actividad: 'activa',
      operador: { nombreLegal: 'Mango Payment S.A.', ruc: '80108618-3' },
    })
    expect(relacionFinancieraDe('App Vaquita')).toMatchObject({
      marca: 'Vaquita', financialProvider: 'Finlatina', operador: { nombreLegal: 'MUTECH S.R.L.' },
    })
    expect(relacionFinancieraDe('Eko Paraguay')).toMatchObject({
      marca: 'EKO', institucionPadre: 'Banco Familiar', financialProvider: 'Banco Familiar',
      operador: { nombreLegal: 'Banco Familiar S.A.E.C.A.' },
    })
    expect(relacionFinancieraDe('eCLUB')).toMatchObject({
      financialProvider: 'Interfisa Banco', operador: { nombreLegal: 'ECLUB Paraguay S.A.' },
    })
    expect(relacionFinancieraDe('PIK')).toMatchObject({
      financialProvider: 'Itaú', operador: { nombreLegal: 'Pont S.A.' },
    })

    for (const relacion of Object.values(RELACIONES_FINANCIERAS)) {
      expect(relacion.fuenteRelacion).toMatch(/^https:\/\//)
      expect(relacion.fuenteActividad).toMatch(/^https:\/\//)
      expect(relacion.verificadoEnRelacion).toBe('2026-10-01')
      expect(relacion.operador.fuenteOficial).toMatch(/^https:\/\//)
      expect(relacion.operador.verificadoEn).toBe('2026-10-01')
      expect(MARCAS_MEDIOS_PAGO[relacion.marca].estado).toBe('verificado')
      expect(MARCAS_MEDIOS_PAGO[relacion.marca].relacionFinanciera).toBe(relacion)
    }
  })

  test('la búsqueda asocia padre e hijo sin convertir la marca en banco ni sustituir logos', () => {
    expect(sugerenciasDeBanco('Mango App')).toContain('Tu Financiera')
    expect(sugerenciasDeBanco('App Vaquita')).toContain('Finlatina')
    expect(sugerenciasDeBanco('EKO')).toContain('Banco Familiar')
    expect(sugerenciasDeMarcaPago('Tu Financiera')).toEqual(['Mango'])
    expect(sugerenciasDeMarcaPago('Banco Familiar')).toEqual(['EKO'])
    expect(marcasRelacionadasConInstitucion('Interfisa Banco')).toEqual(['eCLUB'])
    expect(institucionesSugeridasPorMarca('PIK')).toEqual(['Itaú'])
    expect(buscarRelacionesFinancieras('MUTECH')).toHaveLength(1)

    expect(logoDeBanco('Mango')).toMatchObject({ banco: 'Mango', generico: true })
    expect(logoDeMedioPago('Tu Financiera')).toMatchObject({ marca: 'Tu Financiera', generico: true })
    expect(logoDeMedioPago('Mango')).toMatchObject({ marca: 'Mango', categoria: 'billetera' })
    expect(logoDeMedioPago('Mango').visual.empaquetado).toBe('pagos/mango-horizontal.svg')
  })

  test('no introduce alias conflictivos ni ciclos de jerarquía', () => {
    const alias = new Map()
    const marcas = new Set(Object.keys(RELACIONES_FINANCIERAS).map(normalizarRelacionFinanciera))
    for (const [marca, relacion] of Object.entries(RELACIONES_FINANCIERAS)) {
      for (const clave of [marca, ...relacion.alias]) {
        const normalizada = normalizarRelacionFinanciera(clave)
        const anterior = alias.get(normalizada)
        expect(anterior === undefined || anterior === marca).toBe(true)
        alias.set(normalizada, marca)
      }
      for (const institucion of [relacion.institucionPadre, relacion.financialProvider].filter(Boolean)) {
        expect(marcas.has(normalizarRelacionFinanciera(institucion))).toBe(false)
      }
    }
    expect(MEDIOS_PAGO_CON_MARCA).toEqual(expect.arrayContaining(['Mango', 'Vaquita', 'EKO', 'eCLUB', 'Pik']))
  })
})

describe('fallback accesible de marcas conocidas', () => {
  test('un asset roto muestra el nombre canónico completo, nunca iniciales', async () => {
    await montar(<MedioPagoLogo marca="Mango" variante="compacto" />)
    const imagen = contenedor.querySelector('img')
    expect(imagen).not.toBeNull()
    await act(async () => { imagen.dispatchEvent(new Event('error')) })
    const fallback = contenedor.querySelector('[data-logo-tipo="texto"]')
    expect(fallback?.getAttribute('role')).toBe('img')
    expect(fallback?.getAttribute('aria-label')).toBe('Mango, logo compacto')
    expect(fallback?.textContent).toBe('Mango')
    expect(contenedor.querySelector('[data-logo-tipo="monograma"]')).toBeNull()
  })

  test('las claves heredadas no resuelven relaciones', () => {
    for (const hostil of ['__proto__', 'constructor', 'toString']) expect(relacionFinancieraDe(hostil)).toBeNull()
  })
})
