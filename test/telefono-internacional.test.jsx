// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  PAISES_TELEFONO,
  PhoneField,
  buscarPaisesTelefono,
  paisTelefonoPorIso,
  paisesDeCodigo,
  parseTelefono,
  parseTelefonoInternacional,
  telefonoE164,
} from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

function cambiarInput(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('catálogo internacional de teléfonos', () => {
  test('incluye el catálogo completo con Paraguay primero y nombres en español', () => {
    expect(PAISES_TELEFONO.length).toBeGreaterThanOrEqual(240)
    expect(PAISES_TELEFONO[0]).toMatchObject({ country: 'PY', countryCode: '+595', name: 'Paraguay', flag: '🇵🇾' })
    expect(paisTelefonoPorIso('BR')).toMatchObject({ countryCode: '+55', name: 'Brasil', flag: '🇧🇷' })
  })

  test('busca sin acentos por nombre, ISO, +código y dígitos', () => {
    expect(buscarPaisesTelefono('republica dominicana')[0].country).toBe('DO')
    expect(buscarPaisesTelefono('br').some((pais) => pais.country === 'BR')).toBe(true)
    expect(buscarPaisesTelefono('+595').map((pais) => pais.country)).toContain('PY')
    expect(buscarPaisesTelefono('598').map((pais) => pais.country)).toContain('UY')
  })

  test('expone países con DDI compartido sin perder su ISO', () => {
    const nanp = paisesDeCodigo('+1').map((pais) => pais.country)
    expect(nanp).toContain('US')
    expect(nanp).toContain('CA')
    expect(parseTelefonoInternacional('+1 202 555 0123', 'CA')).toMatchObject({
      country: 'CA',
      countryCode: '+1',
      phone: '2025550123',
      e164: '+12025550123',
      isValid: true,
    })
  })

  test('los DDI compartidos sin ISO usan un país principal determinista', () => {
    expect(paisesDeCodigo('+1')[0].country).toBe('US')
    expect(paisesDeCodigo('+7')[0].country).toBe('RU')
    expect(paisesDeCodigo('+44')[0].country).toBe('GB')
    expect(parseTelefonoInternacional('+44 20 7946 0018')).toMatchObject({ country: 'GB', countryCode: '+44' })
    expect(parseTelefonoInternacional('+1 202 555 0123')).toMatchObject({ country: 'US', countryCode: '+1' })
  })

  test('produce E.164 válido y conserva la regla móvil estricta de Paraguay', () => {
    expect(telefonoE164('981 123 456', 'PY')).toBe('+595981123456')
    expect(telefonoE164('21 123 456', 'PY')).toBe('')
    expect(telefonoE164('11 99999-9999', 'BR')).toBe('+5511999999999')
    expect(parseTelefonoInternacional('005989123456', 'PY')).toMatchObject({ country: 'UY', countryCode: '+598', phone: '9123456' })
    expect(parseTelefono('+44 20 7946 0018')).toEqual({ countryCode: '+44', phone: '20 7946 0018' })
  })
})

describe('PhoneField internacional', () => {
  let container
  let root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  test('sale con PY/+595, bandera decorativa y atributos de teléfono', () => {
    const html = renderToStaticMarkup(<PhoneField phone="" />)
    expect(html).toContain('🇵🇾')
    expect(html).toContain('+595')
    expect(html).toContain('role="combobox"')
    expect(html).toContain('type="tel"')
    expect(html).toContain('inputMode="tel"')
    expect(html).toContain('autoComplete="tel"')
    expect(html).toContain('aria-hidden="true"')
  })

  test('country controlado tiene prioridad y disabled bloquea ambos controles', () => {
    const html = renderToStaticMarkup(<PhoneField country="BR" countryCode="+595" phone="" disabled />)
    expect(html).toContain('🇧🇷')
    expect(html).toContain('+55')
    expect((html.match(/disabled=""/g) || [])).toHaveLength(2)
  })

  test('un DDI legado desconocido se conserva y nunca se disfraza de Paraguay', () => {
    const onChange = vi.fn()
    const onCountryChange = vi.fn()
    const onCountryCodeChange = vi.fn()
    const onInternationalChange = vi.fn()
    act(() => root.render(
      <PhoneField
        countryCode="+999"
        phone="123456"
        onChange={onChange}
        onCountryChange={onCountryChange}
        onCountryCodeChange={onCountryCodeChange}
        onInternationalChange={onInternationalChange}
      />,
    ))

    const trigger = container.querySelector('button[role="combobox"]')
    expect(trigger.textContent).toContain('🌐')
    expect(trigger.textContent).toContain('+999')
    expect(trigger.textContent).not.toContain('🇵🇾')

    const input = container.querySelector('input[aria-label="Teléfono"]')
    act(() => cambiarInput(input, '654321'))
    expect(onChange).toHaveBeenLastCalledWith('654321')
    expect(onInternationalChange).toHaveBeenLastCalledWith('', {
      country: '', countryCode: '+999', phone: '654321', isValid: false,
    })

    act(() => cambiarInput(input, '+999 777 888'))
    expect(onChange).toHaveBeenLastCalledWith('777888')
    expect(onCountryChange).toHaveBeenLastCalledWith('')
    expect(onCountryCodeChange).not.toHaveBeenCalled()
    expect(onInternationalChange).toHaveBeenLastCalledWith('', {
      country: '', countryCode: '+999', phone: '777888', isValid: false,
    })
  })

  test('rerenderiza DDI legado a país principal y conserva ISO explícito', () => {
    act(() => root.render(<PhoneField countryCode="+999" phone="" />))
    expect(container.querySelector('button[role="combobox"]').textContent).toContain('+999')

    act(() => root.render(<PhoneField countryCode="+44" phone="" />))
    const gb = container.querySelector('button[role="combobox"]').textContent
    expect(gb).toContain('🇬🇧')
    expect(gb).toContain('+44')

    act(() => root.render(<PhoneField country="CA" countryCode="+1" phone="" />))
    const ca = container.querySelector('button[role="combobox"]').textContent
    expect(ca).toContain('🇨🇦')
    expect(ca).toContain('+1')
  })

  test('pegar un DDI compartido desde un estado desconocido emite el país principal', () => {
    const onChange = vi.fn()
    const onCountryChange = vi.fn()
    const onCountryCodeChange = vi.fn()
    const onInternationalChange = vi.fn()
    act(() => root.render(
      <PhoneField
        countryCode="+999"
        phone=""
        onChange={onChange}
        onCountryChange={onCountryChange}
        onCountryCodeChange={onCountryCodeChange}
        onInternationalChange={onInternationalChange}
      />,
    ))
    const input = container.querySelector('input[aria-label="Teléfono"]')
    act(() => cambiarInput(input, '+44 20 7946 0018'))
    expect(onChange).toHaveBeenLastCalledWith('2079460018')
    expect(onCountryChange).toHaveBeenLastCalledWith('GB')
    expect(onCountryCodeChange).toHaveBeenLastCalledWith('+44')
    expect(onInternationalChange).toHaveBeenLastCalledWith('+442079460018', {
      country: 'GB', countryCode: '+44', phone: '2079460018', isValid: true,
    })
  })

  test('pegar un internacional emite país, DDI, parte local y E.164', () => {
    const onChange = vi.fn()
    const onCountryChange = vi.fn()
    const onCountryCodeChange = vi.fn()
    const onInternationalChange = vi.fn()
    act(() => root.render(
      <PhoneField
        phone=""
        onChange={onChange}
        onCountryChange={onCountryChange}
        onCountryCodeChange={onCountryCodeChange}
        onInternationalChange={onInternationalChange}
      />,
    ))
    const input = container.querySelector('input[aria-label="Teléfono"]')
    act(() => cambiarInput(input, '+55 11 99999-9999'))
    expect(onChange).toHaveBeenLastCalledWith('11999999999')
    expect(onCountryChange).toHaveBeenLastCalledWith('BR')
    expect(onCountryCodeChange).toHaveBeenLastCalledWith('+55')
    expect(onInternationalChange).toHaveBeenLastCalledWith('+5511999999999', {
      country: 'BR', countryCode: '+55', phone: '11999999999', isValid: true,
    })
  })

  test('el selector se busca con teclado y devuelve el ISO elegido', async () => {
    const onCountryChange = vi.fn()
    const onCountryCodeChange = vi.fn()
    act(() => root.render(
      <PhoneField
        phone=""
        onCountryChange={onCountryChange}
        onCountryCodeChange={onCountryCodeChange}
      />,
    ))
    const trigger = container.querySelector('button[role="combobox"]')
    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    const search = container.querySelector('input[aria-label="Buscar país"]')
    expect(document.activeElement).toBe(search)
    act(() => cambiarInput(search, 'uruguay'))
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(1)
    act(() => search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })))
    expect(onCountryChange).toHaveBeenCalledWith('UY')
    expect(onCountryCodeChange).toHaveBeenCalledWith('+598')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })
})
