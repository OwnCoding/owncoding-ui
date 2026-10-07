// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Money } from '../src/components/ui.jsx'
import { formatMoney } from '../src/utils/moneda.js'
import * as components from '../src/index.js'
import { ComponentPreview } from '../gallery/component-previews.jsx'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })
const quote = {
  originalAmount: 1250.5, originalCurrency: 'EUR',
  convertedAmount: 77.25, convertedCurrency: 'BRL',
  rate: 0.06177529, source: 'Consumer fixture', asOf: '2026-10-07T12:00:00Z',
  status: 'fresh', locale: 'en-US', timeZone: 'UTC',
}
const mount = props => render(<components.CurrencyConversion {...quote} {...props} />)

describe('opt-in localized shared money formatting', () => {
  it('formats BRL and EUR with their own currencies without changing legacy defaults', () => {
    expect(formatMoney(1250.5, 'BRL', { locale: 'pt-BR' })).toBe(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', currencyDisplay: 'code' }).format(1250.5))
    expect(formatMoney(12, 'EUR', { locale: 'en-US' })).toContain('EUR')
    expect(formatMoney(12, 'BRL')).toBe('Gs 12')
    expect(renderToStaticMarkup(<Money value={null} />)).toBe('<span>Gs 0</span>')
    expect(renderToStaticMarkup(<Money value={12} currency="USD" />)).toBe('<span>US$ 12</span>')
  })
  it('never promotes missing, malformed or nonfinite localized input to zero', () => {
    for (const value of [null, undefined, '', '  ', NaN, Infinity, true, false, [], {}, '0x10', '1,25']) {
      expect(formatMoney(value, 'EUR', { locale: 'en-US' })).toBe('—')
    }
    expect(formatMoney(0, 'EUR', { locale: 'en-US' })).toContain('0.00')
    expect(formatMoney('1.25', 'EUR', { locale: 'en-US' })).toContain('1.25')
    expect(formatMoney(12, 'USDT', { locale: 'en-US' })).toBe('—')
    expect(formatMoney(12, 'EUR', { locale: 'invalid_locale' })).toBe('—')
    expect(renderToStaticMarkup(<Money value={null} currency="EUR" locale="en-US" />)).toBe('<span>—</span>')
  })
})

describe('caller-owned conversion presentation', () => {
  it('renders supplied amounts verbatim rather than calculating from the rate', () => {
    mount({ rate: 2 })
    expect(screen.getByLabelText('Original amount EUR').textContent).toContain('1,250.50')
    expect(screen.getByLabelText('Converted amount BRL').textContent).toContain('77.25')
    expect(screen.getByRole('status').textContent).toBe('Current quote')
    expect(screen.getByText('Consumer fixture')).toBeTruthy()
    expect(screen.getByText('1 EUR = 2 BRL')).toBeTruthy()
    expect(document.querySelector('time').dateTime).toBe(quote.asOf)
    expect(document.querySelector('time').textContent).toContain('UTC')
  })
  it.each(['stale', 'loading', 'unavailable'])('announces %s without hiding the original', status => {
    mount({ status })
    expect(screen.getByLabelText('Original amount EUR').textContent).toContain('1,250.50')
    expect(screen.getByRole('status').textContent).toBe({ stale: 'Stale quote', loading: 'Loading quote', unavailable: 'Quote unavailable' }[status])
    expect(screen.getByLabelText('Converted amount BRL').textContent).toBe(status === 'stale' ? 'BRL 77.25' : '—')
  })
  it.each([
    { convertedAmount: null }, { convertedAmount: ' ' }, { convertedAmount: false },
    { rate: null }, { rate: 0 }, { rate: -1 }, { source: '' }, { asOf: null },
    { asOf: 'not-a-date' }, { asOf: '2026-02-30T12:00:00Z' }, { asOf: '2026-10-07' },
    { originalCurrency: undefined }, { convertedCurrency: undefined }, { convertedCurrency: 'USDT' }, { originalAmount: undefined }, { timeZone: 'Invalid/Zone' },
  ])('fails closed on incomplete or invalid quote %j', props => {
    mount(props)
    expect(screen.getByRole('status').textContent).toBe('Quote unavailable')
    expect(screen.getByRole('region').querySelectorAll('dd')[1].textContent).toBe('—')
  })
  it('localizes labels, currency values and timestamp without a freshness clock', () => {
    mount({ locale: 'de-DE', timeZone: 'Europe/Berlin', status: 'stale', labels: { title: 'Umrechnung', original: 'Original', converted: 'Umgerechnet', stale: 'Veraltet' } })
    expect(screen.getByRole('region', { name: 'Umrechnung' })).toBeTruthy()
    expect(screen.getByLabelText('Original EUR').textContent).toContain('1.250,50')
    expect(screen.getByLabelText('Umgerechnet BRL').textContent).toContain('77,25')
    expect(screen.getByRole('status').textContent).toBe('Veraltet')
    expect(document.querySelector('time').textContent).toContain('14:00')
  })
  it('uses no network or timers and permits tiny positive rates and explicit zero amounts', () => {
    const fetch = vi.fn(() => { throw new Error('No network allowed') })
    vi.stubGlobal('fetch', fetch)
    const timer = vi.spyOn(globalThis, 'setInterval')
    mount({ originalAmount: 0, convertedAmount: 0, rate: 0.000000000001 })
    expect(screen.getByRole('status').textContent).toBe('Current quote')
    expect(screen.getByLabelText('Converted amount BRL').textContent).toContain('0.00')
    expect(screen.getByText(/0.000000000001/)).toBeTruthy()
    expect(fetch).not.toHaveBeenCalled()
    expect(timer).not.toHaveBeenCalled()
    timer.mockRestore()
  })
  it('keeps freshness classification and display precision caller-owned', () => {
    mount({ asOf: '2000-01-01T12:00:00Z', originalAmount: 1.2345, convertedAmount: 7.8912, amountFormatOptions: { minimumFractionDigits: 4, maximumFractionDigits: 4 } })
    expect(screen.getByRole('status').textContent).toBe('Current quote')
    expect(screen.getByLabelText('Original amount EUR').textContent).toContain('1.2345')
    expect(screen.getByLabelText('Converted amount BRL').textContent).toContain('7.8912')
  })
  it('has a real local gallery preview with no provider dependency', () => {
    render(<ComponentPreview name="CurrencyConversion" />)
    expect(screen.getByRole('region', { name: 'Conversión de muestra' })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe('Cotización desactualizada')
  })
})
