// @vitest-environment jsdom
// Protección de datos (Ley 7593/2025): aviso de finalidad, consentimiento
// explícito y registro. El contrato que se fija: la casilla nunca viene
// marcada, el enlace de la política va fuera del label (no alterna la
// casilla), el error se anuncia y el registro guarda versión/fecha/canal.
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { AvisoPrivacidad, ConsentimientoDatos, registroConsentimiento } from '../src/index.js'

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

describe('ConsentimientoDatos', () => {
  test('no viene pre-tildada y muestra finalidad, versión y política', async () => {
    await montar(
      <ConsentimientoDatos
        finalidad="Acepto que ScaleOS use mis datos para avisos de mi cuenta."
        politicaUrl="/privacidad"
        version="2026-09"
        onChange={() => {}}
      />,
    )
    const casilla = contenedor.querySelector('input[type="checkbox"]')
    expect(casilla).not.toBe(null)
    expect(casilla.checked).toBe(false)
    expect(contenedor.textContent).toContain('Acepto que ScaleOS use mis datos para avisos de mi cuenta.')
    expect(contenedor.textContent).toContain('versión 2026-09')
    const enlace = contenedor.querySelector('a[href="/privacidad"]')
    expect(enlace).not.toBe(null)
    expect(enlace.textContent).toBe('Política de privacidad')
    // El enlace vive fuera del label: tocarlo no alterna la casilla.
    expect(contenedor.querySelector('label a')).toBe(null)
  })

  test('solo cambia por onChange (nunca sola)', async () => {
    const cambios = []
    await montar(
      <ConsentimientoDatos
        finalidad="Acepto el aviso de privacidad."
        onChange={(evento) => cambios.push(evento.target.checked)}
      />,
    )
    const casilla = contenedor.querySelector('input[type="checkbox"]')
    expect(casilla.checked).toBe(false)
    await act(async () => { casilla.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
    expect(cambios).toEqual([true])
  })

  test('el error se anuncia y describe la casilla', async () => {
    await montar(<ConsentimientoDatos finalidad="Acepto el aviso." error="Necesitás aceptar para continuar." onChange={() => {}} />)
    const casilla = contenedor.querySelector('input[type="checkbox"]')
    expect(casilla.getAttribute('aria-invalid')).toBe('true')
    const alerta = contenedor.querySelector('[role="alert"]')
    expect(alerta.textContent).toBe('Necesitás aceptar para continuar.')
    expect(casilla.getAttribute('aria-describedby')).toContain(alerta.id)
  })
})

describe('AvisoPrivacidad', () => {
  test('finalidad + enlaces a la política y a los derechos', async () => {
    await montar(
      <AvisoPrivacidad
        finalidad="Usamos tus datos para gestionar tu reserva."
        politicaUrl="/privacidad"
        derechosUrl="/privacidad/derechos"
      />,
    )
    expect(contenedor.textContent).toContain('Usamos tus datos para gestionar tu reserva.')
    expect(contenedor.querySelector('a[href="/privacidad"]').textContent).toBe('Política de privacidad')
    expect(contenedor.querySelector('a[href="/privacidad/derechos"]').textContent).toBe('Tus derechos')
    expect(contenedor.querySelector('[data-testid="aviso-privacidad"]')).not.toBe(null)
  })

  test('sin finalidad ni contenido no monta nada', () => {
    expect(renderToStaticMarkup(<AvisoPrivacidad />)).toBe('')
  })
})

describe('registroConsentimiento', () => {
  test('normaliza el registro para aceptar y revocar', () => {
    const aceptado = registroConsentimiento({
      finalidad: 'Avisos',
      version: 3,
      fecha: new Date('2026-09-30T12:00:00.000Z'),
      titular: 'u-1',
    })
    expect(aceptado).toEqual({
      finalidad: 'Avisos',
      aceptado: true,
      version: '3',
      canal: 'web',
      fecha: '2026-09-30T12:00:00.000Z',
      titular: 'u-1',
    })

    const revocado = registroConsentimiento({
      finalidad: 'Avisos',
      aceptado: false,
      canal: 'whatsapp',
      fecha: new Date('2026-09-30T12:00:00.000Z'),
    })
    expect(revocado.aceptado).toBe(false)
    expect(revocado.canal).toBe('whatsapp')
  })

  test('sin fecha válida el campo va vacío (nunca se inventa)', () => {
    expect(registroConsentimiento({ fecha: 'no-es-fecha' }).fecha).toBe('')
  })
})
