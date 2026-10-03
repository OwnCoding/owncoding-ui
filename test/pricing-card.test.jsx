// @vitest-environment jsdom
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { PricingCard } from '../src/index.js'
import { PricingCardPreview } from '../gallery/pricing-previews.jsx'
afterEach(cleanup)
it('uses provided price/features and explicit controlled selection, not clickable card', () => {
  const select = vi.fn()
  const { rerender } = render(<PricingCard title="Plan" price={123} currency="USD" period="/ periodo" badge="Etiqueta" features={[{ id: 'one', label: 'Informe', included: true }, { id: 'two', label: 'Servicio', included: false }]} onSelect={select} />)
  expect(screen.getByRole('heading', { name: 'Plan' })).toBeTruthy(); expect(screen.getByText('US$ 123')).toBeTruthy()
  expect(screen.getByText('No incluido')).toBeTruthy(); expect(screen.getAllByRole('button')).toHaveLength(1)
  fireEvent.click(screen.getByRole('button', { name: 'Elegir plan' })); expect(select).toHaveBeenCalledOnce()
  expect(screen.queryByText('Plan seleccionado')).toBeNull()
  rerender(<PricingCard title="Plan" price={123} selected onSelect={select} />)
  expect(screen.getByRole('button', { name: 'Plan seleccionado' }).disabled).toBe(true)
})
it('fails closed for invalid price, unavailable, busy, disabled or absent callback', () => {
  const select = vi.fn()
  const { rerender } = render(<PricingCard title="Plan" price={0} onSelect={select} />)
  expect(screen.getByRole('button').disabled).toBe(false)
  for (const extra of [{ price: NaN }, { price: -1 }, { unavailable: true }, { pending: true }, { disabled: true }, { onSelect: undefined }]) {
    rerender(<PricingCard title="Plan" price={100} onSelect={select} {...extra} />)
    expect(screen.getByRole('button').disabled).toBe(true); fireEvent.click(screen.getByRole('button'))
  }
  expect(select).not.toHaveBeenCalled()
})
it('static motion and pending state are accessible; fixture confirms selection only manually', () => {
  const { unmount, container } = render(<PricingCard title="Plan" price={100} motion={false} pending />)
  expect(container.querySelector('[aria-busy="true"]')).toBeTruthy()
  expect(container.querySelector('[data-motion="off"]')).toBeTruthy()
  unmount(); render(<PricingCardPreview name="PricingCard" />)
  const choose = screen.getAllByRole('button', { name: 'Elegir plan' })
  fireEvent.click(choose[0]); expect(choose.every(button => button.disabled)).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar selección demo' }))
  expect(screen.getByRole('button', { name: 'Plan seleccionado' }).disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Restablecer demo' }))
  expect(screen.getAllByRole('button', { name: 'Elegir plan' }).every(button => !button.disabled)).toBe(true)
})
