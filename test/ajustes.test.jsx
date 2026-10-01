import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  AjustesImpresion,
  BANCOS_PARAGUAY,
  BancoCombobox,
  BancoLogo,
  BotonImprimir,
  LIMITE_MONTO_ALMACENABLE,
  MenuDesplegable,
  MoneyInput,
  NavLateral,
  PanelDerecho,
  TarjetaAjuste,
  agregarEstado,
  destinoDeConexion,
  errorMonto,
  esApellidosPrimero,
  etiquetaTrabajo,
  largoMaximoMonto,
  limiteMonto,
  logoDeBanco,
  normalizarNombre,
  sugerenciasDeBanco,
  textoVerificacion,
} from '../src/index.js'

describe('nombres y documentos', () => {
  test('ordena apellidos primero en los formatos del proveedor', () => {
    expect(normalizarNombre('PEREZ GOMEZ, JUAN CARLOS')).toBe('Juan Carlos Perez Gomez')
    expect(normalizarNombre('PEREZ GOMEZ JUAN CARLOS', { apellidosPrimero: 'sifen' })).toBe('Juan Carlos Perez Gomez')
    expect(normalizarNombre('PEREZ GOMEZ JUAN', { apellidosPrimero: 'sifen' })).toBe('Juan Perez Gomez')
    // Un nombre escrito por el vendedor se respeta; en mayúsculas se capitaliza.
    expect(normalizarNombre('Cliente E2E 4f2')).toBe('Cliente E2E 4f2')
    expect(normalizarNombre('JUAN PEREZ')).toBe('Juan Perez')
    expect(esApellidosPrimero('Perez, Juan')).toBe(true)
  })
})

describe('bancos de Paraguay', () => {
  test('el catálogo por defecto y sus sugerencias', () => {
    expect(BANCOS_PARAGUAY).toContain('Banco Atlas')
    expect(BANCOS_PARAGUAY).toContain('ueno bank')
    expect(BANCOS_PARAGUAY).not.toContain('Visión Banco')
    expect(BANCOS_PARAGUAY).toContain('Financiera FIC')
    expect(sugerenciasDeBanco('continental')).toEqual(['Banco Continental'])
    expect(sugerenciasDeBanco('basa')).toEqual(['Banco Basa'])
    expect(sugerenciasDeBanco('')).toHaveLength(BANCOS_PARAGUAY.length)
  })

  test('los alias que resolvía LedBox vuelven al nombre canónico', () => {
    const esperado = {
      continental: 'Banco Continental',
      bnf: 'Banco Nacional de Fomento',
      interfisa: 'Interfisa Banco',
      atlas: 'Banco Atlas',
      familiar: 'Banco Familiar',
      vision: 'ueno bank',
      sudameris: 'Sudameris',
      fic: 'Financiera FIC',
      rio: 'Banco Continental',
      ueno: 'ueno bank',
    }
    for (const [alias, banco] of Object.entries(esperado)) {
      expect(logoDeBanco(alias), `${alias} → ${banco}`).toMatchObject({ banco })
    }
    // Los alias históricos sugieren la entidad activa que los sucedió.
    expect(sugerenciasDeBanco('rio')).toEqual(['Banco Continental'])
  })

  test('el registro resuelve archivo, marca y monograma', () => {
    expect(logoDeBanco('Banco Basa')).toMatchObject({ tipo: 'archivo', archivo: 'banco-basa.svg' })
    expect(logoDeBanco('Banco Continental')).toMatchObject({ tipo: 'marca', marca: 'continental' })
    expect(logoDeBanco('Coomecipar')).toMatchObject({ tipo: 'monograma', iniciales: 'CO' })
    expect(logoDeBanco('Banco Inventado')).toMatchObject({ tipo: 'monograma', generico: true })
    expect(logoDeBanco('')).toBe(null)
  })

  test('el logo y el combo se renderizan', () => {
    const basa = renderToStaticMarkup(<BancoLogo banco="Banco Basa" />)
    expect(basa).toContain('Banco Basa')
    expect(basa).toContain('data-logo-estado="permiso-pendiente"')
    expect(basa).not.toContain('<img')
    expect(renderToStaticMarkup(<BancoLogo banco="Coomecipar" />)).toContain('CO')
    expect(renderToStaticMarkup(<BancoCombobox value="Banco At" onChange={() => {}} />)).toContain('role="combobox"')
  })
})

describe('nombre y plata', () => {
  test('el largo máximo del monto sale del tope', () => {
    expect(largoMaximoMonto(10_000_000_000)).toBe(14) // 11 dígitos + 3 separadores
    expect(largoMaximoMonto(99_000_000_000)).toBe(14)
    expect(largoMaximoMonto(10_000_000_000, { decimales: true })).toBe(17)
    expect(largoMaximoMonto(1000)).toBe(5) // 1.000
  })

  test('el límite efectivo del campo se acota a lo almacenable (#148)', () => {
    expect(LIMITE_MONTO_ALMACENABLE).toBe(2_147_483_647)
    expect(limiteMonto(5_000)).toBe(5_000)
    expect(limiteMonto(99_000_000_000)).toBe(LIMITE_MONTO_ALMACENABLE)
    expect(limiteMonto(0)).toBe(LIMITE_MONTO_ALMACENABLE)
    expect(errorMonto(1_000)).toBe('')
    expect(errorMonto(99_000_000_000, 10_000_000_000)).toContain('Gs 2.147.483.647')
  })

  test('el campo de monto no deja escribir más que el tope', () => {
    const html = renderToStaticMarkup(<MoneyInput value={1000} onValueChange={() => {}} />)
    expect(html).toContain('maxLength="14"')
    const usd = renderToStaticMarkup(<MoneyInput currency="USD" value="10" onValueChange={() => {}} />)
    expect(usd).toContain('maxLength="17"')
  })
})

describe('ajustes e impresión', () => {
  test('el panel derecho y la tarjeta de ajuste', () => {
    const panel = renderToStaticMarkup(<PanelDerecho panel={<div>FORM</div>}><div>LISTA</div></PanelDerecho>)
    expect(panel).toContain('FORM')
    expect(panel).toContain('LISTA')
    const tarjeta = renderToStaticMarkup(<TarjetaAjuste titulo="Seguridad" descripcion="Claves y sesiones" accion={<button>Acción</button>}><p>cuerpo</p></TarjetaAjuste>)
    expect(tarjeta).toContain('Seguridad')
    expect(tarjeta).toContain('Acción')
  })

  test('la tarjeta de ajuste cubre ícono y tono peligro (#253)', () => {
    const normal = renderToStaticMarkup(<TarjetaAjuste titulo="Con ícono" icono="lock" descripcion="Claves"><p>x</p></TarjetaAjuste>)
    expect(normal).toContain('Con ícono')
    expect(normal).toContain('<svg')
    expect(normal).not.toContain('border-bad/30')
    const peligro = renderToStaticMarkup(<TarjetaAjuste titulo="Eliminar empresa" tono="peligro"><p>x</p></TarjetaAjuste>)
    expect(peligro).toContain('border-bad/30')
    expect(peligro).toContain('text-bad')
  })

  test('la navegación lateral colapsa y el menú despliega', () => {
    const nav = renderToStaticMarkup(
      <NavLateral items={[{ id: 'a', label: 'Ventas', icono: 'chart' }, { id: 'b', label: 'Caja', icono: 'money' }]} activeId="a" onToggle={() => {}} />,
    )
    expect(nav).toContain('aria-current="page"')
    expect(nav).toContain('Contraer menú')
    const menu = renderToStaticMarkup(<MenuDesplegable trigger={<span>Cuenta</span>} items={[{ label: 'Salir' }]} />)
    expect(menu).toContain('aria-haspopup="menu"')
    expect(menu).toContain('Cuenta')
  })

  test('los estados de impresora y trabajo son honestos', () => {
    expect(etiquetaTrabajo('ACEPTADO')).toBe('Aceptado (falta confirmar)')
    expect(etiquetaTrabajo('CONFIRMADO')).toBe('Confirmado en papel')
    expect(textoVerificacion({ estado: 'ok', fecha: Date.now() - 3000 }, Date.now())).toBe('Verificada hace 3 s')
    expect(textoVerificacion({ estado: 'error', motivo: 'La impresora rechazó la conexión' })).toContain('Sin respuesta')
    const resumen = agregarEstado([{ id: 1, activa: true }, { id: 2 }], { 1: { estado: 'ok' }, 2: { estado: 'error' } })
    expect(resumen).toMatchObject({ label: 'Con problemas', error: 1 })
  })

  test('el destino LAN/USB se compone y se lee igual que el agente', () => {
    expect(destinoDeConexion({ conexion: 'lan', ip: '192.168.1.50', puerto: '9100' })).toBe('lan:192.168.1.50:9100')
    expect(destinoDeConexion({ conexion: 'lan', ip: '10.0.0.2' })).toBe('lan:10.0.0.2:9100')
    expect(destinoDeConexion({ conexion: 'cups', cola: 'EPSON_TM_T20' })).toBe('cups:EPSON_TM_T20')
    expect(destinoDeConexion({ conexion: 'lan' })).toBe('')
  })

  test('los ajustes de impresión listan, prueban y guardan por callbacks', () => {
    const html = renderToStaticMarkup(
      <AjustesImpresion
        impresoras={[{ id: 'p1', nombre: 'Mostrador', destino: 'lan:192.168.1.50:9100', ancho: '80', predeterminada: true }]}
        estado={{ p1: { estado: 'ok', fecha: Date.now() } }}
        onGuardar={() => {}}
        onProbar={() => {}}
        onEliminar={() => {}}
      />,
    )
    expect(html).toContain('Mostrador')
    expect(html).toContain('Predeterminada')
    expect(html).toContain('LAN · lan:192.168.1.50:9100')
    expect(html).toContain('Imprimir prueba')
    expect(html).toContain('agente local')
  })

  test('el botón de imprimir refleja el estado del trabajo', () => {
    expect(renderToStaticMarkup(<BotonImprimir onImprimir={() => {}} />)).toContain('Imprimir')
    expect(renderToStaticMarkup(<BotonImprimir onImprimir={() => {}} estado="pendiente" />)).toContain('Pendiente')
    const listo = renderToStaticMarkup(<BotonImprimir onImprimir={() => {}} estado="confirmado" />)
    expect(listo).toContain('Confirmado en papel')
  })
})
