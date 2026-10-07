// @vitest-environment jsdom

import { createHash } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import * as banks from '../src/utils/bancos.js'
import * as cities from '../src/catalog/ciudades.js'
import BancoCombobox from '../src/components/BancoCombobox.jsx'
import CityAutocomplete from '../src/components/CityAutocomplete.jsx'

afterEach(cleanup)

// These pinned IDs are internal contracts, not official registration codes.
describe('stable institution identities', () => {
  it('derives selectable names from frozen canonical records', () => {
    const records = banks.INSTITUTIONS_PARAGUAY
    expect(records).toHaveLength(32)
    expect(new Set(records.map(row => row.id)).size).toBe(32)
    expect(records.map(row => row.name)).toEqual(banks.BANCOS_PARAGUAY)
    expect(records.every(row => Object.isFrozen(row) && Object.isFrozen(row.aliases))).toBe(true)
    expect(records.every(row => row.provenance.identifierScheme === 'owncoding-internal')).toBe(true)
    expect(records.every(row => row.provenance.sourceUrl.startsWith('https://'))).toBe(true)
    expect(banks.resolveInstitution('Banco Atlas').record.id).toBe('oc:institution:py:001')
  })
  it('resolves IDs, accent-insensitive aliases and historical names without discarding input', () => {
    expect(banks.resolveInstitution(' ITAU ')).toMatchObject({ status: 'resolved', input: ' ITAU ', matchedBy: 'alias', record: { name: 'Itaú', id: 'oc:institution:py:008' } })
    expect(banks.resolveInstitution('oc:institution:py:018').record.name).toBe('ueno bank')
    expect(banks.resolveInstitution('vision')).toMatchObject({ input: 'vision', matchedBy: 'historical', historicalName: 'Visión Banco', record: { id: 'oc:institution:py:018' } })
    expect(banks.resolveInstitution('Banco Río')).toMatchObject({ historicalName: 'Banco Río', record: { id: 'oc:institution:py:003' } })
  })
  it('preserves custom, unsupported and invalid values without fuzzy identification', () => {
    for (const input of ['My bank', 'Banco do Brasil', 'Itaú custom', '', null, {}, '__proto__']) {
      expect(banks.resolveInstitution(input)).toEqual({ status: 'unknown', input, record: null })
    }
  })
  it('keeps a custom selector value unresolved without changing the legacy callback', () => {
    const onSelect = vi.fn(), onIdentitySelect = vi.fn()
    render(<BancoCombobox value="Local lender" catalogo={['Local lender']} onSelect={onSelect} onIdentitySelect={onIdentitySelect} />)
    fireEvent.focus(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option'))
    expect(onSelect).toHaveBeenCalledWith('Local lender')
    expect(onIdentitySelect).toHaveBeenCalledWith({ status: 'unknown', input: 'Local lender', record: null })
  })
  it('retains one-argument legacy selection and exposes separate opt-in metadata', () => {
    const onSelect = vi.fn(), onIdentitySelect = vi.fn()
    render(<BancoCombobox value="vision" onSelect={onSelect} onIdentitySelect={onIdentitySelect} />)
    fireEvent.focus(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option'))
    expect(onSelect).toHaveBeenCalledWith('ueno bank')
    expect(onIdentitySelect).toHaveBeenCalledWith(expect.objectContaining({ status: 'resolved', record: expect.objectContaining({ id: 'oc:institution:py:018' }) }))
    cleanup()
  })
})

describe('stable locality identities', () => {
  it('preserves all 263 bilingual legacy rows and derives them from immutable records', () => {
    const records = cities.LOCALITIES_PARAGUAY
    expect(createHash('sha256').update(JSON.stringify(cities.CIUDADES_PARAGUAY)).digest('hex')).toBe('7be2185bea093a625fa14b0f2a33f726e335539f0f485deebd38de66cead8c87')
    expect(records).toHaveLength(263)
    expect(new Set(records.map(row => row.id)).size).toBe(263)
    expect(records.every(row => Object.isFrozen(row))).toBe(true)
    expect(records.every(row => row.provenance.identifierScheme === 'owncoding-internal' && row.provenance.status === 'inherited-catalog')).toBe(true)
    expect(records.map(({ city, department }) => ({ ciudad: city, departamento: department, city, department }))).toEqual(cities.CIUDADES_PARAGUAY)
    expect(cities.resolveLocality('Bahia Negra', 'Alto Paraguay').record.id).toBe('oc:locality:py:001')
    expect(cities.resolveLocality('oc:locality:py:033').record.city).toBe('Asunción')
  })
  it('requires department disambiguation and never picks a first ambiguous result', () => {
    // An injected catalog models future duplicate names without inventing municipalities.
    const catalog = [
      { id: 'test:1', city: 'Shared name', department: 'One' },
      { id: 'test:2', city: 'Shared name', department: 'Two' },
    ]
    expect(cities.resolveLocality('Shared name', undefined, catalog)).toMatchObject({ status: 'ambiguous', record: null })
    expect(cities.resolveLocality(' shared NAME ', 'two', catalog).record.id).toBe('test:2')
    expect(cities.resolveLocality('Shared name', 'Three', catalog).status).toBe('unknown')
    const renamed = [...catalog].reverse().map(row => ({ ...row, city: 'Renamed' }))
    expect(cities.resolveLocality('test:2', undefined, renamed).record).toMatchObject({ id: 'test:2', city: 'Renamed', department: 'Two' })
  })
  it('preserves custom input and does not ignore a conflicting department', () => {
    expect(cities.resolveLocality('My city', 'My department')).toEqual({ status: 'unknown', input: { city: 'My city', department: 'My department' }, record: null })
    expect(cities.resolveLocality('Asunción', 'Central').status).toBe('unknown')
    expect(cities.resolveLocality('oc:locality:py:033', 'Central').status).toBe('unknown')
    for (const value of [null, {}, '', '__proto__']) expect(cities.resolveLocality(value).status).toBe('unknown')
  })
  it('retains two-argument legacy callbacks and separate opt-in metadata', () => {
    const onSelect = vi.fn(), onIdentitySelect = vi.fn()
    render(<CityAutocomplete value="" onSelect={onSelect} onIdentitySelect={onIdentitySelect} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Asun' } })
    expect(onIdentitySelect).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'unknown', input: { city: 'Asun', department: undefined }, record: null }))
    fireEvent.click(screen.getByRole('option', { name: /^Asunción\s*Asunción$/ }))
    expect(onSelect).toHaveBeenLastCalledWith('Asunción', 'Asunción')
    expect(onIdentitySelect).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'resolved', record: expect.objectContaining({ id: 'oc:locality:py:033' }) }))
    cleanup()
  })
})
