import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  Avatar,
  COLORES_AVATAR,
  ESTADOS_PRESENCIA,
  PersonaChip,
  PilaPersonas,
  TAMANOS_AVATAR,
  claveColorDeNombre,
  colorDeNombre,
  identidadDeUsuario,
  inicialesDeNombre,
  resumenPresencia,
} from '../src/index.js'

// Smoke de la identidad: iniciales, color estable y caída a iniciales cuando no
// hay imagen o la imagen falla. El objeto no inventa fotos ni nombres.

describe('iniciales y color del avatar', () => {
  test('iniciales de personas, empresas y vacíos', () => {
    expect(inicialesDeNombre('Ana Pérez')).toBe('AP')
    expect(inicialesDeNombre('juan carlos de la cruz')).toBe('JC')
    expect(inicialesDeNombre('LedBox S.A.')).toBe('LS')
    expect(inicialesDeNombre('LedBox')).toBe('L')
    expect(inicialesDeNombre('')).toBe('—')
    expect(inicialesDeNombre(null)).toBe('—')
  })

  test('el color es estable y sale de la paleta del avatar', () => {
    expect(claveColorDeNombre('Ana Pérez')).toBe(claveColorDeNombre('Ana Pérez'))
    expect(Object.keys(COLORES_AVATAR)).toContain(claveColorDeNombre('Ana Pérez'))
    const clases = colorDeNombre('Ana Pérez')
    expect(clases).toContain('bg-')
    expect(clases).toContain('text-')
  })
})

describe('Avatar', () => {
  test('persona: iniciales, color derivado y etiqueta accesible', () => {
    const html = renderToStaticMarkup(<Avatar nombre="Ana Pérez" />)
    expect(html).toContain('AP')
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Ana Pérez"')
    expect(html).toContain('rounded-full')
    expect(html).toContain(TAMANOS_AVATAR.md)
    expect(html).not.toContain('<img')
  })

  test('con imagen: la <img> usa la URL y el placeholder tapa la espera', () => {
    const html = renderToStaticMarkup(<Avatar nombre="Ana Pérez" src="https://cdn.test/ana.png" />)
    expect(html).toContain('src="https://cdn.test/ana.png"')
    expect(html).toContain('object-cover')
    // Sin `load` (SSR) la imagen va transparente sobre el placeholder neutro:
    // nunca se pinta la anterior mientras resuelve (#271).
    expect(html).toContain('>AP<')
    expect(html).toContain('opacity-0')
    expect(html).toContain('aria-hidden="true"')
  })

  test('empresa: cuadrado redondeado y tamaño grande', () => {
    const html = renderToStaticMarkup(<Avatar nombre="LedBox S.A." empresa tamano="lg" />)
    expect(html).toContain('LS')
    expect(html).toContain('rounded-lg')
    expect(html).toContain(TAMANOS_AVATAR.lg)
  })

  test('decorativo: sin rol ni etiqueta (el nombre ya está al lado)', () => {
    const html = renderToStaticMarkup(<Avatar nombre="Ana Pérez" decorativo />)
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('role="img"')
  })

  test('title y ariaLabel se pueden pisar', () => {
    const html = renderToStaticMarkup(<Avatar nombre="Ana Pérez" title="Ana P." ariaLabel="Perfil de Ana" />)
    expect(html).toContain('title="Ana P."')
    expect(html).toContain('aria-label="Perfil de Ana"')
  })
})

// Identidad de usuario unificada (#211): un solo objeto para mostrar a alguien,
// con la cadena de foto en un orden (local → Google → iniciales), nombre corto
// y presencia. El adaptador normaliza los campos habituales.
describe('PersonaChip e identidad', () => {
  const ANA = { id: 'u1', name: 'Ana Pérez', picture: 'https://google.test/ana.png', scope: 'Sucursal Centro' }

  test('resuelve la cadena de foto: local → Google → iniciales', () => {
    const local = renderToStaticMarkup(<PersonaChip user={ANA} foto="https://cdn.test/ana.png" />)
    expect(local).toContain('src="https://cdn.test/ana.png"')
    const google = renderToStaticMarkup(<PersonaChip user={ANA} />)
    expect(google).toContain('src="https://google.test/ana.png"')
    const iniciales = renderToStaticMarkup(<PersonaChip user={{ name: 'Ana Pérez' }} />)
    expect(iniciales).toContain('AP')
    expect(iniciales).not.toContain('<img')
  })

  test('hasAvatar=false apaga la local y deja pasar la de Google', () => {
    const html = renderToStaticMarkup(<PersonaChip user={{ ...ANA, hasAvatar: false, avatarUrl: 'https://cdn.test/ana.png' }} />)
    expect(html).not.toContain('https://cdn.test/ana.png')
    expect(html).toContain('https://google.test/ana.png')
  })

  test('nombreCorto usa solo el primer nombre y el tooltip suma la presencia', () => {
    const html = renderToStaticMarkup(<PersonaChip user={ANA} nombreCorto estado="en-linea" />)
    expect(html).toContain('Ana')
    expect(html).not.toContain('>Ana Pérez<')
    expect(html).toContain('title="Ana Pérez · En línea · Sucursal Centro"')
    expect(html).toContain('bg-ok')
    expect(html).toContain('data-testid="persona-chip"')
  })

  test('nombre=false deja solo el avatar (píldora de presencia)', () => {
    const html = renderToStaticMarkup(<PersonaChip user={ANA} nombre={false} estado="en-linea" />)
    expect(html).not.toContain('>Ana Pérez<')
    expect(html).toContain('aria-hidden="true"')
  })

  test('acepta un texto suelto y children (fecha)', () => {
    const html = renderToStaticMarkup(<PersonaChip user="Sistema" nombreCorto>hace 2 min</PersonaChip>)
    expect(html).toContain('Sistema')
    expect(html).toContain('hace 2 min')
  })

  test('el adaptador normaliza los campos habituales', () => {
    expect(identidadDeUsuario({ nombre: 'Juan', foto: 'https://x/1.png' })).toMatchObject({ nombre: 'Juan', primerNombre: 'Juan', fotoLocal: 'https://x/1.png' })
    expect(identidadDeUsuario({ name: 'Ana Pérez', avatarUrl: 'https://x/2.png', picture: 'https://x/3.png' })).toMatchObject({ nombre: 'Ana Pérez', primerNombre: 'Ana', fotoLocal: 'https://x/2.png', picture: 'https://x/3.png' })
    expect(identidadDeUsuario({ email: 'a@b.com' }).nombre).toBe('a@b.com')
    expect(identidadDeUsuario({}).nombre).toBe('Sistema')
  })

  test('los estados de presencia traen etiqueta y punto', () => {
    expect(ESTADOS_PRESENCIA['en-linea']).toEqual({ etiqueta: 'En línea', punto: 'bg-ok' })
    expect(ESTADOS_PRESENCIA.offline.etiqueta).toBe('Sin conexión')
  })
})

// Lote 23: la pila de personas del shell y la miga de sección.
describe('PilaPersonas', () => {
  const PERSONAS = [
    { id: 'u1', name: 'Ana Pérez', active: true },
    { id: 'u2', name: 'Juan Gómez', estado: 'ausente' },
    { id: 'u3', name: 'Luis Ríos' },
    { id: 'u4', name: 'Eva Díaz' },
    { id: 'u5', name: 'Sofi Vera' },
  ]

  test('apila avatares con presencia y resume la presencia', () => {
    const html = renderToStaticMarkup(<PilaPersonas personas={PERSONAS} />)
    expect(html).toContain('role="group"')
    expect(html).toContain('aria-label="5 en línea"')
    expect(html).toContain('+1')
    expect(html).toContain('5 en línea')
  })

  test('con una sola persona el resumen usa el primer nombre', () => {
    const html = renderToStaticMarkup(<PilaPersonas personas={[PERSONAS[0]]} />)
    expect(html).toContain('Ana en línea')
    expect(html).toContain('title="Ana Pérez"')
  })

  test('sin personas no monta nada; con onMas es un botón', () => {
    expect(renderToStaticMarkup(<PilaPersonas personas={[]} />)).toBe('')
    const boton = renderToStaticMarkup(<PilaPersonas personas={PERSONAS} onMas={() => {}} />)
    expect(boton).toContain('<button')
    expect(boton).toContain('aria-label="5 en línea"')
  })

  test('el resumen visible se puede apagar (la etiqueta accesible queda)', () => {
    const html = renderToStaticMarkup(<PilaPersonas personas={[PERSONAS[0]]} resumen={false} />)
    expect(html).not.toContain('whitespace-nowrap text-xs font-semibold text-mute')
    expect(html).toContain('aria-label="Ana en línea"')
  })

  test('resumenPresencia en texto plano', () => {
    expect(resumenPresencia([])).toBe('')
    expect(resumenPresencia([{ name: 'Ana Pérez' }])).toBe('Ana en línea')
    expect(resumenPresencia([{ name: 'Ana' }, { name: 'Juan' }])).toBe('2 en línea')
  })
})
