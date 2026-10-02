// @vitest-environment jsdom
// «Carga con IA» (#11): contrato puro, diálogo declarativo y las guardas que
// importan — nada se crea sin la confirmación, el texto pegado no se persiste,
// sin proveedor configurado avisa y no rompe. El caso interactivo usa un
// `analizar`/`crear` de prueba: sin red y sin proveedor real.
import { readFileSync } from 'node:fs'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, test, vi } from 'vitest'

import {
  BotonCargaIA,
  CAMPOS_IA,
  CargaIA,
  DialogoCargaIA,
  IA_BOTON,
  IA_DIALOGO_COMPLETO_CAMPOS,
  IA_DIALOGO_COMPLETO_REGISTROS,
  IA_RATE_LIMIT,
  IA_REGISTROS_MAX,
  IA_TEXTO_MAX,
  IA_TOOLTIP,
  normalizarAnalisisIA,
  normalizarResultadoIA,
  opcionesDeCampoIA,
  registrosIncluidosIA,
  tamanoDialogoIA,
  tituloDeRegistroIA,
  validarRegistrosIA,
} from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const ESQUEMA = {
  tipos: [
    {
      id: 'clientes',
      label: 'Clientes',
      singular: 'cliente',
      plural: 'clientes',
      campos: [
        { id: 'nombre', label: 'Nombre', tipo: 'texto', obligatorio: true },
        { id: 'empresa', label: 'Empresa', tipo: 'texto' },
        { id: 'tipo', label: 'Tipo', tipo: 'select', opciones: [{ value: 'FINAL', label: 'Cliente final' }] },
        { id: 'saldo', label: 'Saldo', tipo: 'moneda' },
        { id: 'alta', label: 'Alta', tipo: 'fecha' },
      ],
    },
    {
      id: 'equipos',
      label: 'Equipos',
      campos: [{ id: 'nombre', label: 'Nombre', tipo: 'texto', obligatorio: true }],
    },
  ],
}

// En jsdom `import.meta.url` no es `file:`: las guardas de fuente leen desde
// la raíz del repo (vitest corre con cwd en la raíz).
const leer = (ruta) => readFileSync(`${process.cwd()}/${ruta}`, 'utf8')
const fuente = leer('src/components/CargaIA.jsx')
const contrato = leer('src/utils/cargaIA.js')
const reglas = leer('docs/REGLAS.md')
const adopcion = leer('docs/ADOPCION-V2.md')
const changelog = leer('CHANGELOG.md')

function montar(ui) {
  const contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  const root = createRoot(contenedor)
  act(() => {
    root.render(ui)
  })
  const espera = () => act(async () => {
    await Promise.resolve()
  })
  const boton = (etiqueta) => [...contenedor.querySelectorAll('button')].find((nodo) => (nodo.textContent || '').includes(etiqueta))
  const escribir = (nodo, valor) =>
    act(() => {
      const prototipo = nodo.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(prototipo, 'value').set.call(nodo, valor)
      nodo.dispatchEvent(new Event('input', { bubbles: true }))
    })
  const clic = (nodo) =>
    act(() => {
      nodo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
  const clicAsync = async (nodo) => {
    await act(async () => {
      nodo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
  }
  const enviarAsync = async (formulario) => {
    await act(async () => {
      formulario.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
  }
  const desmontar = () =>
    act(() => {
      root.unmount()
    })
  return { contenedor, espera, boton, escribir, clic, clicAsync, enviarAsync, desmontar }
}

describe('contrato puro de Carga con IA', () => {
  test('los límites y rótulos por defecto son los de la casa', () => {
    expect(IA_TEXTO_MAX).toBe(20_000)
    expect(IA_REGISTROS_MAX).toBe(25)
    expect(IA_RATE_LIMIT).toBe(10)
    expect(CAMPOS_IA).toEqual(['texto', 'numero', 'moneda', 'fecha', 'select'])
    expect(IA_BOTON).toBe('Carga con IA')
    expect(IA_TOOLTIP).toContain('revisá antes de crear')
  })

  test('normaliza la forma plana y también la respuesta por tipo', () => {
    const plana = normalizarAnalisisIA(
      {
        registros: [
          { tipo: 'clientes', valores: { nombre: ' Ana ', empresa: 'Sur', desconocido: 'x' }, avisos: [' Sin RUC '] },
          { tipo: 'fantasma', valores: { nombre: 'Nadie' } },
        ],
        avisos: ['Nota global'],
      },
      ESQUEMA,
    )
    expect(plana.registros).toHaveLength(1)
    expect(plana.registros[0]).toMatchObject({
      tipo: 'clientes',
      incluir: true,
      avisos: ['Sin RUC'],
      valores: { nombre: ' Ana ', empresa: 'Sur', tipo: null, saldo: null, alta: null },
    })
    expect(plana.avisos).toContain('Nota global')
    expect(plana.avisos.some((aviso) => aviso.includes('sin tipo conocido'))).toBe(true)

    const porTipo = normalizarAnalisisIA(
      { clientes: [{ nombre: 'Ana', avisos: ['Sin RUC'] }], equipos: [{ nombre: 'LED 3x2' }] },
      ESQUEMA,
    )
    expect(porTipo.registros.map((registro) => registro.tipo)).toEqual(['clientes', 'equipos'])
    expect(porTipo.registros[0].valores.nombre).toBe('Ana')
    expect(porTipo.registros[1].id).toContain('ia-equipos')
  })

  test('recorta a los máximos por tipo con aviso y conserva ids únicos', () => {
    const muchos = Array.from({ length: IA_REGISTROS_MAX + 3 }, () => ({ tipo: 'clientes', id: 'repetido', valores: {} }))
    const salida = normalizarAnalisisIA({ registros: muchos }, ESQUEMA)
    expect(salida.registros).toHaveLength(IA_REGISTROS_MAX)
    expect(new Set(salida.registros.map((registro) => registro.id)).size).toBe(IA_REGISTROS_MAX)
    expect(salida.avisos.some((aviso) => aviso.includes('Recortamos'))).toBe(true)

    const corto = normalizarAnalisisIA({ registros: muchos }, ESQUEMA, { maxRegistros: 2 })
    expect(corto.registros).toHaveLength(2)
    expect(corto.avisos.some((aviso) => aviso.includes('2 registros'))).toBe(true)
  })

  test('los obligatorios se validan solo en los registros incluidos', () => {
    const registros = normalizarAnalisisIA(
      {
        registros: [
          { tipo: 'clientes', valores: { nombre: 'Ana' } },
          { tipo: 'clientes', valores: { empresa: 'Sin nombre' } },
          { tipo: 'clientes', valores: {}, incluir: false },
        ],
      },
      ESQUEMA,
    ).registros
    const revision = validarRegistrosIA(registros, ESQUEMA)
    expect(revision.valido).toBe(false)
    expect(revision.errores.size).toBe(1)
    expect(revision.errores.get(registros[1].id)).toHaveProperty('nombre')
    expect(registrosIncluidosIA(registros)).toHaveLength(2)
  })

  test('el título de la tarjeta sale del primer obligatorio', () => {
    const tipo = ESQUEMA.tipos[0]
    expect(tituloDeRegistroIA({ valores: { nombre: 'Ana' } }, tipo)).toBe('Ana')
    expect(tituloDeRegistroIA({ valores: {} }, tipo)).toBe('Clientes')
    expect(tituloDeRegistroIA({ titulo: 'Propio', valores: { nombre: 'Ana' } }, tipo)).toBe('Propio')
  })

  test('el resultado no inventa el conteo cuando la app no lo informa', () => {
    expect(normalizarResultadoIA(undefined, { total: 3 })).toEqual({
      creados: null,
      total: 3,
      errores: [],
      advertencias: [],
    })
    expect(normalizarResultadoIA({ creados: 2, errores: [' Uno '], advertencias: 'ignorada' }, { total: 3 })).toEqual({
      creados: 2,
      total: 3,
      errores: ['Uno'],
      advertencias: [],
    })
  })

  test('las opciones del select toleran textos sueltos', () => {
    expect(opcionesDeCampoIA({ opciones: ['FINAL', { value: 'RESELLER', label: 'Mayorista' }] })).toEqual([
      { value: 'FINAL', label: 'FINAL' },
      { value: 'RESELLER', label: 'Mayorista' },
    ])
  })

  test('el ancho del diálogo se adapta a la fase y al contenido (#16)', () => {
    expect(tamanoDialogoIA('entrada', { registros: [], esquema: ESQUEMA })).toBe('amplio')
    expect(tamanoDialogoIA('listo', { registros: [], esquema: ESQUEMA })).toBe('amplio')
    expect(tamanoDialogoIA('revision', { registros: [], esquema: ESQUEMA })).toBe('amplio')
    const pocos = Array.from({ length: IA_DIALOGO_COMPLETO_REGISTROS - 1 }, (_, indice) => ({ id: `r${indice}` }))
    const varios = Array.from({ length: IA_DIALOGO_COMPLETO_REGISTROS }, (_, indice) => ({ id: `r${indice}` }))
    expect(tamanoDialogoIA('revision', { registros: pocos, esquema: ESQUEMA })).toBe('amplio')
    expect(tamanoDialogoIA('revision', { registros: varios, esquema: ESQUEMA })).toBe('completo')
    // Un tipo denso también pide el ancho completo aunque haya pocas tarjetas.
    const denso = {
      tipos: [
        {
          id: 'x',
          label: 'X',
          campos: Array.from({ length: IA_DIALOGO_COMPLETO_CAMPOS }, (_, indice) => ({
            id: `c${indice}`,
            label: `C${indice}`,
            tipo: 'texto',
          })),
        },
      ],
    }
    expect(tamanoDialogoIA('revision', { registros: [{ id: 'r' }], esquema: denso })).toBe('completo')
  })
})

describe('BotonCargaIA y DialogoCargaIA', () => {
  test('el botón del topbar abre con tooltip y sin montar el diálogo', () => {
    const abrir = vi.fn()
    const ui = montar(<BotonCargaIA onAbrir={abrir} />)
    const boton = ui.contenedor.querySelector('button')
    expect(boton.getAttribute('aria-haspopup')).toBe('dialog')
    expect(boton.getAttribute('title')).toBe(IA_TOOLTIP)
    expect(boton.textContent).toContain(IA_BOTON)
    expect(boton.querySelector('svg')).not.toBeNull()
    ui.clic(boton)
    expect(abrir).toHaveBeenCalledTimes(1)
    ui.desmontar()
  })

  test('CargaIA monta el diálogo recién al primer clic (apertura diferida)', async () => {
    const consultarConfig = vi.fn(async () => ({ configurada: true, modelo: 'mock' }))
    const ui = montar(
      <CargaIA esquema={ESQUEMA} consultarConfig={consultarConfig} analizar={async () => ({})} crear={async () => ({})} />,
    )
    expect(ui.contenedor.querySelector('textarea')).toBeNull()
    expect(ui.contenedor.querySelector('[role="dialog"]')).toBeNull()
    expect(consultarConfig).not.toHaveBeenCalled()

    await ui.clicAsync(ui.boton(IA_BOTON))
    await ui.espera()
    expect(ui.contenedor.querySelector('[role="dialog"]')).not.toBeNull()
    expect(ui.contenedor.querySelector('textarea')).not.toBeNull()
    expect(consultarConfig).toHaveBeenCalledTimes(1)
    ui.desmontar()
  })

  test('cerrado no dibuja nada; abierto pide el texto con contador y aviso de privacidad', () => {
    const cerrado = montar(<DialogoCargaIA abierto={false} onCerrar={() => {}} esquema={ESQUEMA} analizar={async () => ({})} crear={async () => ({})} />)
    expect(cerrado.contenedor.innerHTML).toBe('')
    cerrado.desmontar()

    const ui = montar(
      <DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} analizar={async () => ({})} crear={async () => ({})} />,
    )
    const area = ui.contenedor.querySelector('textarea')
    expect(area.getAttribute('maxlength')).toBe(String(IA_TEXTO_MAX))
    // #16: alto acotado y redimensionable, con el contador en la fila del hint.
    expect(area.getAttribute('rows')).toBe('5')
    expect(area.className).toContain('min-h-28')
    expect(area.className).toContain('max-h-56')
    expect(ui.contenedor.querySelector('[role="dialog"]').className).toContain('max-w-3xl')
    expect(ui.contenedor.textContent).toContain('0 / 20.000')
    expect(ui.contenedor.textContent).toContain('Se manda solo este texto al proveedor de IA')
    expect(ui.contenedor.querySelector('a[href="/privacidad"]')).not.toBeNull()
    expect(ui.boton('Analizar con IA').disabled).toBe(true)
    ui.escribir(area, 'Ana — 0981 123 456')
    expect(ui.boton('Analizar con IA').disabled).toBe(false)
    ui.desmontar()
  })

  test('la revisión con varias tarjetas usa el ancho completo y `size` lo pisa (#16)', async () => {
    const muchos = Array.from({ length: IA_DIALOGO_COMPLETO_REGISTROS }, (_, indice) => ({
      tipo: 'clientes',
      valores: { nombre: `Cliente ${indice}` },
    }))
    const ui = montar(
      <DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} analizar={async () => ({ registros: muchos })} crear={async () => ({})} />,
    )
    ui.escribir(ui.contenedor.querySelector('textarea'), 'texto')
    await ui.enviarAsync(ui.contenedor.querySelector('form'))
    expect(ui.contenedor.querySelectorAll('article')).toHaveLength(IA_DIALOGO_COMPLETO_REGISTROS)
    expect(ui.contenedor.querySelector('[role="dialog"]').className).toContain('max-w-5xl')
    ui.desmontar()

    // Una revisión chica queda en `amplio`…
    const chica = montar(
      <DialogoCargaIA
        abierto
        onCerrar={() => {}}
        esquema={ESQUEMA}
        analizar={async () => ({ registros: [{ tipo: 'clientes', valores: { nombre: 'Ana' } }] })}
        crear={async () => ({})}
      />,
    )
    chica.escribir(chica.contenedor.querySelector('textarea'), 'texto')
    await chica.enviarAsync(chica.contenedor.querySelector('form'))
    expect(chica.contenedor.querySelector('[role="dialog"]').className).toContain('max-w-3xl')
    chica.desmontar()

    // …y la prop aditiva la fija.
    const fija = montar(
      <DialogoCargaIA abierto onCerrar={() => {}} size="formulario" esquema={ESQUEMA} analizar={async () => ({})} crear={async () => ({})} />,
    )
    expect(fija.contenedor.querySelector('[role="dialog"]').className).toContain('max-w-xl')
    fija.desmontar()
  })

  test('sin proveedor configurado avisa, no rompe y permite volver a chequear', async () => {
    const consultarConfig = vi.fn(async () => ({ configurada: false, modelo: null }))
    const crear = vi.fn()
    const ui = montar(
      <DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} consultarConfig={consultarConfig} analizar={async () => ({})} crear={crear} />,
    )
    await ui.espera()
    expect(ui.contenedor.textContent).toContain('La IA no está configurada en este servidor')
    expect(ui.contenedor.querySelector('textarea')).toBeNull()
    await ui.clicAsync(ui.boton('Volver a chequear'))
    expect(consultarConfig).toHaveBeenCalledTimes(2)
    expect(crear).not.toHaveBeenCalled()
    ui.desmontar()
  })

  test('el error de configuración se muestra con reintento', async () => {
    const consultarConfig = vi.fn(async () => {
      throw new Error('No pudimos consultar el estado.')
    })
    const ui = montar(
      <DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} consultarConfig={consultarConfig} analizar={async () => ({})} crear={async () => ({})} />,
    )
    await ui.espera()
    expect(ui.contenedor.textContent).toContain('No pudimos consultar el estado.')
    await ui.clicAsync(ui.boton('Reintentar'))
    expect(consultarConfig).toHaveBeenCalledTimes(2)
    ui.desmontar()
  })

  test('nada se crea sin confirmación: analizar muestra la revisión y «Crear todo» recién llama a crear', async () => {
    const analizar = vi.fn(async () => ({
      registros: [{ tipo: 'clientes', valores: { nombre: 'Ana', empresa: 'Sur' }, avisos: ['Sin RUC: completalo si aplica.'] }],
      avisos: ['Se descartó un registro ilegible.'],
    }))
    const crear = vi.fn(async () => ({ creados: 1 }))
    const ui = montar(<DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} analizar={analizar} crear={crear} />)

    ui.escribir(ui.contenedor.querySelector('textarea'), '  Ana de Constructora Sur  ')
    await ui.enviarAsync(ui.contenedor.querySelector('form'))

    expect(analizar).toHaveBeenCalledWith('Ana de Constructora Sur', ['clientes', 'equipos'])
    expect(crear).not.toHaveBeenCalled()
    expect(ui.contenedor.textContent).toContain('Ana')
    expect(ui.contenedor.textContent).toContain('Sin RUC: completalo si aplica.')
    expect(ui.contenedor.textContent).toContain('Se descartó un registro ilegible.')
    expect(ui.contenedor.textContent).toContain('Detectamos 1 cliente')
    expect(ui.contenedor.textContent).toContain('nada se crea sin tu confirmación')

    await ui.clicAsync(ui.boton('Crear todo (1)'))
    expect(crear).toHaveBeenCalledTimes(1)
    const payload = crear.mock.calls[0][0]
    expect(payload).toHaveLength(1)
    expect(payload[0].tipo).toBe('clientes')
    expect(payload[0].valores.nombre).toBe('Ana')
    expect(payload[0]).not.toHaveProperty('texto')
    expect(ui.contenedor.textContent).toContain('Creamos 1 registro.')
    ui.desmontar()
  })

  test('un obligatorio vacío bloquea la creación y se marca en la tarjeta', async () => {
    const analizar = vi.fn(async () => ({ registros: [{ tipo: 'clientes', valores: { empresa: 'Solo empresa' } }] }))
    const crear = vi.fn(async () => ({ creados: 1 }))
    const ui = montar(<DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} analizar={analizar} crear={crear} />)
    ui.escribir(ui.contenedor.querySelector('textarea'), 'texto')
    await ui.enviarAsync(ui.contenedor.querySelector('form'))

    await ui.clicAsync(ui.boton('Crear todo (1)'))
    expect(crear).not.toHaveBeenCalled()
    expect(ui.contenedor.textContent).toContain('Completá los campos obligatorios marcados.')
    expect(ui.contenedor.textContent).toContain('Completá este campo para crear el registro.')

    const nombre = ui.contenedor.querySelector('article input:not([type])')
    expect(nombre).not.toBeNull()
    ui.escribir(nombre, 'Ana')
    await ui.clicAsync(ui.boton('Crear todo (1)'))
    expect(crear).toHaveBeenCalledTimes(1)
    expect(crear.mock.calls[0][0][0].valores.nombre).toBe('Ana')
    ui.desmontar()
  })

  test('descartar una tarjeta la saca del alta', async () => {
    const analizar = vi.fn(async () => ({
      registros: [
        { tipo: 'clientes', valores: { nombre: 'Ana' } },
        { tipo: 'clientes', valores: { nombre: 'Beto' } },
      ],
    }))
    const crear = vi.fn(async () => ({ creados: 1 }))
    const ui = montar(<DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} analizar={analizar} crear={crear} />)
    ui.escribir(ui.contenedor.querySelector('textarea'), 'texto')
    await ui.enviarAsync(ui.contenedor.querySelector('form'))

    const tarjetas = ui.contenedor.querySelectorAll('article')
    expect(tarjetas).toHaveLength(2)
    ui.clic(tarjetas[1].querySelector('input[role="switch"]'))
    expect(ui.contenedor.textContent).toContain('Crear todo (1)')

    await ui.clicAsync(ui.boton('Crear todo (1)'))
    expect(crear.mock.calls[0][0]).toHaveLength(1)
    expect(crear.mock.calls[0][0][0].valores.nombre).toBe('Ana')
    ui.desmontar()
  })

  test('un analizar que falla se muestra y deja reintentar', async () => {
    const analizar = vi.fn(async () => {
      throw new Error('El proveedor de IA respondió 429.')
    })
    const ui = montar(<DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} analizar={analizar} crear={async () => ({})} />)
    ui.escribir(ui.contenedor.querySelector('textarea'), 'texto')
    await ui.enviarAsync(ui.contenedor.querySelector('form'))
    expect(ui.contenedor.textContent).toContain('El proveedor de IA respondió 429.')
    expect(ui.contenedor.querySelector('textarea')).not.toBeNull()
    ui.desmontar()
  })

  test('sin detalle de creación el resultado no inventa el conteo', async () => {
    const analizar = vi.fn(async () => ({ registros: [{ tipo: 'clientes', valores: { nombre: 'Ana' } }] }))
    const ui = montar(<DialogoCargaIA abierto onCerrar={() => {}} esquema={ESQUEMA} analizar={analizar} crear={async () => {}} />)
    ui.escribir(ui.contenedor.querySelector('textarea'), 'texto')
    await ui.enviarAsync(ui.contenedor.querySelector('form'))
    await ui.clicAsync(ui.boton('Crear todo (1)'))
    expect(ui.contenedor.textContent).toContain('La app terminó el alta; el detalle queda en su módulo.')
    expect(ui.contenedor.textContent).not.toContain('Creamos 1 registro')
    ui.desmontar()
  })
})

describe('guardas de fuente y reglas', () => {
  test('el objeto no hace fetch, no persiste ni loguea el texto pegado', () => {
    expect(fuente).not.toMatch(/\bfetch\s*\(/)
    expect(fuente).not.toMatch(/localStorage|sessionStorage|indexedDB/)
    expect(fuente).not.toMatch(/console\.(log|info|warn|error)/)
    expect(contrato).not.toMatch(/console\./)
    expect(contrato).not.toMatch(/\bfetch\s*\(/)
  })

  test('crear solo se dispara desde el botón de confirmación', () => {
    expect(fuente).toContain('onClick={() => void crearTodo()}')
    expect(fuente).toContain('Crear todo (')
  })

  test('las reglas §18 y el checklist de adopción documentan el asistente', () => {
    expect(reglas).toContain('## 18.')
    expect(reglas).toContain('Carga con IA')
    expect(reglas).toContain('nada se crea sin confirmación')
    expect(reglas).toContain('No se persiste el texto pegado')
    expect(reglas).toContain('Ley 7593/2025')
    expect(reglas).toContain('IA_RATE_LIMIT')
    expect(reglas).toContain('IA_DIALOGO_COMPLETO_REGISTROS')
    expect(reglas).toContain('confianza')
    expect(reglas).toContain('#131')
    expect(adopcion).toContain('Carga con IA')
    expect(changelog).toContain('«Carga con IA» (#11)')
    expect(changelog).toContain('#16')
  })
})
