// @vitest-environment jsdom
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { CartSummary } from '../src/index.js'
import { CartSummaryPreview } from '../gallery/cart-previews.jsx'
afterEach(cleanup)
const item = { id: 'a', label: 'Muestra', quantity: 1, maxQuantity: 2, amount: 777 }
it('emits bounded controlled intentions and never computes line money', () => {
  const quantity = vi.fn(), remove = vi.fn(), checkout = vi.fn()
  render(<CartSummary items={[item]} total={999} onQuantityChange={quantity} onRemove={remove} onCheckout={checkout} />)
  expect(screen.getByRole('button', { name: 'Reducir Muestra' }).disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Aumentar Muestra' })); expect(quantity).toHaveBeenCalledWith('a', 2)
  expect(screen.getByText('1')).toBeTruthy(); expect(screen.getByText(/777/)).toBeTruthy(); expect(screen.getByText(/999/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Quitar Muestra' })); expect(remove).toHaveBeenCalledWith('a')
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' })); expect(checkout).toHaveBeenCalledOnce()
})
it('fails closed for invalid quantity, limits, amounts, empty and unavailable', () => {
  const change = vi.fn(), checkout = vi.fn()
  const { rerender } = render(<CartSummary items={[]} total={0} onCheckout={checkout} />)
  expect(screen.getByRole('button', { name: 'Continuar' }).disabled).toBe(true)
  for (const bad of [{ quantity: NaN }, { quantity: 1.5 }, { maxQuantity: 0 }, { amount: NaN }, { unavailable: true }]) {
    rerender(<CartSummary items={[{ ...item, ...bad }]} total={100} onQuantityChange={change} onCheckout={checkout} />)
    expect(screen.getByRole('button', { name: 'Continuar' }).disabled).toBe(true)
  }
  expect(change).not.toHaveBeenCalled(); expect(checkout).not.toHaveBeenCalled()
})
it('pending and disabled block all actions; max, absent callbacks and static motion are respected', () => {
  const { rerender } = render(<CartSummary items={[{ ...item, quantity: 2 }]} total={100} motion={false} />)
  expect(screen.getAllByRole('button').every(button => button.disabled)).toBe(true)
  for (const lock of [{ pending: true }, { disabled: true }]) {
    rerender(<CartSummary items={[item]} total={100} onQuantityChange={vi.fn()} onRemove={vi.fn()} onCheckout={vi.fn()} {...lock} />)
    expect(screen.getAllByRole('button').every(button => button.disabled)).toBe(true)
  }
})
it('gallery fixture changes quantity, pending, removal and empty state locally', () => {
  render(<CartSummaryPreview name="CartSummary" />)
  fireEvent.click(screen.getByRole('button', { name: 'Aumentar Producto Demo' })); expect(screen.getByText('2')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Alternar pendiente demo' })); expect(screen.getByRole('button', { name: 'Quitar Producto Demo' }).disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Alternar pendiente demo' })); fireEvent.click(screen.getByRole('button', { name: 'Quitar Producto Demo' }))
  expect(screen.getByText('El carrito está vacío.')).toBeTruthy()
})
