import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  AuthLayout,
  EmailField,
  GoogleButton,
  GoogleMark,
  InstagramField,
  LoadingScreen,
  OAuthDivider,
  PegarEnlaceToken,
  PhoneField,
  ProductFooter,
  SerialField,
} from '../src/index.js'
import { normalizarInstagram } from '../src/index.js'
import { normalizarSerial } from '../src/index.js'
import { componerTelefono, parseTelefono, sugerenciasDe } from '../src/index.js'
import { esToken, extractTokenFromUrl } from '../src/index.js'

// Smoke de la familia de acceso y campos ampliados: render sin API ni sesión.

describe('acceso (sin API)', () => {
  test('el botón de Google dibuja la marca y el estado', () => {
    const continuar = renderToStaticMarkup(<GoogleButton />)
    expect(continuar).toContain('Continuar con Google')
    expect(continuar).toContain('<svg')
    expect(renderToStaticMarkup(<GoogleButton crear />)).toContain('Crear con Google')
    const busy = renderToStaticMarkup(<GoogleButton busy />)
    expect(busy).toContain('Conectando con Google…')
    expect(busy).toContain('disabled')
  })

  test('el divisor y la marca de Google son accesibles', () => {
    expect(renderToStaticMarkup(<OAuthDivider />)).toContain('>o<')
    expect(renderToStaticMarkup(<GoogleMark />)).toContain('aria-hidden="true"')
  })

  test('el layout de acceso acepta logo, copy, acciones y pie', () => {
    const html = renderToStaticMarkup(
      <AuthLayout logo={<span>LOGO</span>} aside={<h1>Vendé rápido</h1>} acciones={<button>Tema</button>} pie={<footer>Pie</footer>}>
        <form>Formulario</form>
      </AuthLayout>,
    )
    expect(html).toContain('LOGO')
    expect(html).toContain('Vendé rápido')
    expect(html).toContain('Formulario')
    expect(html).toContain('Pie')
  })

  test('el pie institucional se arma por props', () => {
    const html = renderToStaticMarkup(<ProductFooter nombre="Mi App" version="v1.2.3" credito="OwnCoding" creditoUrl="https://owncoding.example" />)
    expect(html).toContain('Mi App')
    expect(html).toContain('v1.2.3')
    expect(html).toContain('OwnCoding')
  })

  test('la pantalla de carga no consulta la API', () => {
    const html = renderToStaticMarkup(<LoadingScreen mensaje="Cargando tu tienda…" logo={<span>LOGO</span>} tienda={{ nombre: 'Aurora' }} etiqueta="MobOS" />)
    expect(html).toContain('role="status"')
    expect(html).toContain('Aurora')
    expect(html).toContain('MobOS')
    expect(renderToStaticMarkup(<LoadingScreen label="Alias compatible" />)).toContain('Alias compatible')
  })

  test('pegar enlace extrae el token sin llamar a nada', () => {
    const html = renderToStaticMarkup(<PegarEnlaceToken onToken={() => {}} />)
    expect(html).toContain('Pegá tu enlace completo')
    expect(html).toContain('https://…')
  })
})

describe('campos ampliados', () => {
  test('correo sugiere dominios', () => {
    expect(sugerenciasDe('ana@gm')).toEqual(['ana@gmail.com'])
    expect(sugerenciasDe('ana')).toHaveLength(4)
    expect(sugerenciasDe('')).toEqual([])
    expect(renderToStaticMarkup(<EmailField value="ana@gmail.com" onChange={() => {}} />)).toContain('type="email"')
  })

  test('teléfono separa código y número, incluido el pegado 00…', () => {
    expect(parseTelefono('+595 981 123 456')).toEqual({ countryCode: '+595', phone: '981 123 456' })
    expect(parseTelefono('981123456', '+55')).toEqual({ countryCode: '+55', phone: '981123456' })
    // El prefijo internacional `00…` se parte contra los códigos conocidos
    // (el más largo primero: +595, no +59 ni +5).
    expect(parseTelefono('00595 981 123 456')).toEqual({ countryCode: '+595', phone: '981123456' })
    expect(parseTelefono('005989123456')).toEqual({ countryCode: '+598', phone: '9123456' })
    expect(parseTelefono('0055 11 99999-9999')).toEqual({ countryCode: '+55', phone: '11999999999' })
    expect(componerTelefono({ countryCode: '+595', phone: '981 123 456' })).toBe('+595 981 123 456')
    expect(componerTelefono({ phone: '' })).toBe(null)
    expect(renderToStaticMarkup(<PhoneField phone="981123456" onChange={() => {}} />)).toContain('aria-label="Teléfono"')
  })

  test('serial normaliza y el Instagram deja el usuario pelado', () => {
    expect(normalizarSerial(' mob-123 456 ')).toBe('MOB123456')
    // El prefijo de las etiquetas del agente no forma parte del serial.
    expect(normalizarSerial('MOBOS: mob-123 456')).toBe('MOB123456')
    expect(renderToStaticMarkup(<SerialField value="abc123" onChange={() => {}} />)).toContain('autoCapitalize="characters"')
    expect(normalizarInstagram('https://instagram.com/ana.lopez?hl=es')).toBe('ana.lopez')
    expect(normalizarInstagram('@ana lopez')).toBe('analopez')
  })

  test('el token de un enlace se extrae en sus formatos', () => {
    const token = 'a'.repeat(64)
    expect(extractTokenFromUrl(`https://app.example/aceptar-invitacion/${token}`)).toBe(token)
    expect(extractTokenFromUrl(`https://app.example/ingresar#token=${token}`)).toBe(token)
    expect(extractTokenFromUrl(token)).toBe(token)
    expect(extractTokenFromUrl('https://app.example/sin-token')).toBe('')
    expect(esToken(token)).toBe(true)
    expect(esToken('corto')).toBe(false)
  })
})
