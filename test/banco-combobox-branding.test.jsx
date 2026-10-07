// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import BancoCombobox from '../src/components/BancoCombobox.jsx'
afterEach(cleanup)

test('shows actual selected and option logos without changing accessible names or callbacks', () => {
  const change = vi.fn(), select = vi.fn()
  const { container } = render(<BancoCombobox value="Atlas" onChange={change} onSelect={select} />)
  expect(container.querySelector('[data-bank-selected] img')).not.toBeNull()
  fireEvent.focus(screen.getByRole('combobox'))
  const option = screen.getByRole('option', { name: 'Banco Atlas' })
  expect(option.querySelectorAll('img')).toHaveLength(2)
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
  expect(change).toHaveBeenCalledWith('Banco Atlas')
  expect(select).toHaveBeenCalledWith('Banco Atlas')
})
test('allows compact-only and legacy text fields, and never invents a selected custom logo', () => {
  const { container, rerender } = render(<BancoCombobox value="Atlas" showSelectedLogo={false} showHorizontalLogo={false} />)
  expect(container.querySelector('[data-bank-selected]')).toBeNull()
  fireEvent.focus(screen.getByRole('combobox'))
  expect(screen.getByRole('option').querySelectorAll('img')).toHaveLength(1)
  rerender(<BancoCombobox value="My own lender" catalogo={['My own lender']} />)
  expect(container.querySelector('[data-bank-selected]')).toBeNull()
})
