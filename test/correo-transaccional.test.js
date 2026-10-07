import { describe, expect, test } from 'vitest'

import {
  crearCorreoTransaccional,
  renderCorreoHtml,
  renderCorreoTexto,
} from '../src/email/index.js'

const correo = () => crearCorreoTransaccional({
  identidad: { nombre: 'Controlaria', version: '0.1.0' },
  asunto: 'Confirmá tu cuenta',
  preheader: 'Tu acceso está casi listo',
  motivo: 'Recibimos una solicitud para activar tu cuenta.',
  detalles: [{ etiqueta: 'Cuenta', valor: 'ana@example.com' }],
  accion: { etiqueta: 'Confirmar cuenta', url: 'https://controlaria.online/confirmar?token=abc&via=email' },
  cierre: 'Si no fuiste vos, ignorá este correo.',
})

describe('correo transaccional de presentación', () => {
  test('normaliza y congela el modelo completo', () => {
    const modelo = correo()
    expect(Object.isFrozen(modelo)).toBe(true)
    expect(Object.isFrozen(modelo.identidad)).toBe(true)
    expect(Object.isFrozen(modelo.detalles)).toBe(true)
    expect(modelo.identidad.etiquetaVersion).toBe('v0.1.0')
  })

  test('texto incluye CTA y URL visible de respaldo', () => {
    const texto = renderCorreoTexto(correo())
    expect(texto).toContain('Confirmar cuenta')
    expect(texto).toContain('https://controlaria.online/confirmar?token=abc&via=email')
    expect(texto).toContain('Controlaria · Desarrollado por Owncoding')
  })

  test('HTML escapa contenido y conserva un enlace visible', () => {
    const modelo = crearCorreoTransaccional({
      identidad: { nombre: 'Controlaria', version: '0.1.0' },
      asunto: '<script>alert(1)</script>',
      motivo: 'Hola <b>Ana</b>',
      accion: { etiqueta: 'Abrir', url: 'https://example.com/?a=1&b=2' },
    })
    const html = renderCorreoHtml(modelo)
    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('Hola &lt;b&gt;Ana&lt;/b&gt;')
    expect(html).toContain('https://example.com/?a=1&amp;b=2')
    expect(html).toContain('Si el botón no funciona')
  })

  test('rechaza URLs ejecutables y campos obligatorios vacíos', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)', 'http://example.com/inseguro']) {
      expect(() => crearCorreoTransaccional({
        identidad: { nombre: 'Controlaria', version: '0.1.0' },
        asunto: 'Acción',
        motivo: 'Probá esto',
        accion: { etiqueta: 'Abrir', url },
      }), url).toThrow(/https o mailto/)
    }
    expect(() => crearCorreoTransaccional({ identidad: { nombre: 'Controlaria', version: '0.1.0' } })).toThrow(/asunto/)
  })

  test('acepta CTA https y mailto normalizados', () => {
    expect(correo().accion.url).toBe('https://controlaria.online/confirmar?token=abc&via=email')
    const mailto = crearCorreoTransaccional({
      identidad: { nombre: 'Controlaria', version: '0.1.0' },
      asunto: 'Soporte',
      motivo: 'Escribinos si necesitás ayuda.',
      accion: { etiqueta: 'Contactar soporte', url: 'mailto:soporte@controlaria.online?subject=Ayuda' },
    })
    expect(mailto.accion.url).toBe('mailto:soporte@controlaria.online?subject=Ayuda')
    expect(renderCorreoHtml(mailto)).toContain('href="mailto:soporte@controlaria.online?subject=Ayuda"')
  })

  test('los renderers vuelven a validar modelos congelados forjados', () => {
    const forjado = Object.freeze({
      identidad: Object.freeze({ nombre: 'Controlaria', version: '0.1.0' }),
      asunto: 'Acción',
      preheader: 'Acción',
      motivo: '<img src=x onerror=alert(1)>',
      detalles: Object.freeze([]),
      accion: Object.freeze({ etiqueta: 'Abrir', url: 'javascript:alert(1)' }),
      cierre: '',
      firma: 'Controlaria',
    })

    expect(() => renderCorreoHtml(forjado)).toThrow(/https o mailto/)
    expect(() => renderCorreoTexto(forjado)).toThrow(/https o mailto/)

    const seguro = Object.freeze({
      ...forjado,
      accion: Object.freeze({ etiqueta: '<Abrir>', url: 'https://example.com/?a=1&b=2' }),
    })
    const html = renderCorreoHtml(seguro)
    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(html).toContain('&lt;Abrir&gt;')
    expect(html).toContain('https://example.com/?a=1&amp;b=2')
  })
})

describe('optional editorial email theme', () => {
  test('preserves defaults and plaintext while applying the shared palette', () => {
    const original = correo()
    const themed = crearCorreoTransaccional({ ...original, tema: 'editorial' })
    expect(renderCorreoTexto(themed)).toBe(renderCorreoTexto(original))
    expect(renderCorreoHtml(original)).toContain('background:#f1f4f8')
    expect(renderCorreoHtml(original)).not.toContain('#60A5FA')
    const html = renderCorreoHtml(themed)
    for (const color of ['#0B1220', '#F5F7FA', '#1D4ED8', '#60A5FA']) expect(html).toContain(color)
    expect(html).toContain('word-break:break-word')
    expect(html).toContain('>Controlaria</p>')
    expect(html).toContain('role="presentation"')
  })
  test('supports English without rewriting rendered HTML', () => {
    const themed = crearCorreoTransaccional({ ...correo(), tema: 'editorial', idioma: 'en' })
    expect(renderCorreoHtml(themed)).toContain('<html lang="en">')
    expect(renderCorreoHtml(themed)).toContain('If the button does not work')
    expect(renderCorreoTexto(themed)).toContain(themed.accion.url)
    const defaults = crearCorreoTransaccional({identidad:themed.identidad,asunto:'Subject',motivo:'Reason',idioma:'en'})
    expect(renderCorreoTexto(defaults)).toContain('If you did not request this action')
  })
  test('revalidates theme, locale, secure links and escaping', () => {
    for (const invalid of [{tema:'<style>'}, {idioma:'en" onload="alert(1)'}]) {
      expect(() => renderCorreoHtml(Object.freeze({...correo(),...invalid}))).toThrow()
      expect(() => renderCorreoTexto(Object.freeze({...correo(),...invalid}))).toThrow()
    }
    expect(() => renderCorreoHtml({...correo(),tema:'editorial',accion:{etiqueta:'x',url:'javascript:alert(1)'}})).toThrow()
    const html = renderCorreoHtml({...correo(),tema:'editorial',motivo:'<script>alert(1)</script>',identidad:{nombre:'<OwnData>',version:'1.0.0',logoUrl:'https://example.com/mark.png'}})
    expect(html).toContain('&lt;OwnData&gt;')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('src="https://example.com/mark.png"')
    expect(html).not.toContain('<script>')
  })
})
