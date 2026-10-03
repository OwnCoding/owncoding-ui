// @vitest-environment jsdom
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ProductVariantSelector } from '../src/index.js'
import { ProductVariantSelectorPreview } from '../gallery/variants-previews.jsx'
afterEach(cleanup)
const groups = [{ id: 'color', label: 'Color', options: [{ id: 'a', label: 'Azul' }, { id: 'b', label: 'Negro' }] }, { id: 'size', label: 'Tamaño', options: [{ id: 's', label: 'Pequeño' }, { id: 'l', label: 'Grande' }] }]
const variants = [{ id: 'as', values: { color: 'a', size: 's' }, available: true }, { id: 'bl', values: { color: 'b', size: 'l' }, available: true }]
it('native radio groups emit controlled selection without auto selection', () => {
  const change = vi.fn()
  const { rerender } = render(<ProductVariantSelector groups={groups} variants={variants} value={{}} onChange={change} />)
  expect(screen.getAllByRole('group')).toHaveLength(2); expect(change).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('radio', { name: 'Azul' })); expect(change).toHaveBeenCalledWith({ color: 'a' })
  expect(screen.getByRole('radio', { name: 'Azul' }).checked).toBe(false)
  rerender(<ProductVariantSelector groups={groups} variants={variants} value={{ color: 'a' }} onChange={change} />)
  expect(screen.getByRole('radio', { name: /Grande/ }).disabled).toBe(true)
  fireEvent.click(screen.getByRole('radio', { name: 'Pequeño' })); expect(change).toHaveBeenLastCalledWith({ color: 'a', size: 's' })
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar selección' })); expect(change).toHaveBeenLastCalledWith({})
})
it('pending, disabled, option restrictions, absent matrix and stale values fail closed', () => {
  const change = vi.fn()
  const { rerender } = render(<ProductVariantSelector groups={groups} variants={variants} value={{ color: 'unknown' }} onChange={change} />)
  expect(screen.getByRole('status').textContent).toContain('no está disponible')
  for (const extra of [{ pending: true }, { disabled: true }, { variants: [] }]) {
    rerender(<ProductVariantSelector groups={groups} variants={variants} value={{}} onChange={change} {...extra} />)
    expect(screen.getAllByRole('radio').every(input => input.disabled)).toBe(true)
  }
  rerender(<ProductVariantSelector groups={[]} variants={[]} value={{}} onChange={change} />)
  expect(screen.queryByRole('radio')).toBeNull(); expect(change).not.toHaveBeenCalled()
})
it('separate instances have unique radio names and demo exposes actual availability', () => {
  render(<><ProductVariantSelectorPreview name="ProductVariantSelector" /><ProductVariantSelector groups={groups} variants={variants} value={{}} onChange={() => {}} /></>)
  const radios = screen.getAllByRole('radio')
  expect(radios[0].name).not.toBe(radios[4].name)
  fireEvent.click(radios[0]); expect(radios[3].disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Alternar pendiente demo' })); expect(radios[0].disabled).toBe(true)
})

it('disabled options cannot fund an available combination, including stale controlled values', () => {
  const restricted = [{ ...groups[0], options: groups[0].options.map(option => ({ ...option, disabled: option.id === 'a' })) }, groups[1]]
  const matrix = variants.slice(0, 1)
  const change = vi.fn()
  const { rerender } = render(<ProductVariantSelector groups={restricted} variants={matrix} value={{}} onChange={change} />)
  expect(screen.getAllByRole('radio').every(input => input.disabled)).toBe(true)
  for (const value of [{ color: 'a' }, { color: 'a', size: 's' }]) {
    rerender(<ProductVariantSelector groups={restricted} variants={matrix} value={value} onChange={change} />)
    expect(screen.getByRole('status').textContent).toContain('no está disponible')
    expect(screen.getByRole('radio', { name: /Azul/ }).checked).toBe(true)
    expect(screen.getByRole('radio', { name: /Pequeño/ }).disabled).toBe(true)
  }
  expect(change).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar selección' })); expect(change).toHaveBeenCalledWith({})
})
