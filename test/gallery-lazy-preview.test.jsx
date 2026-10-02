// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { DeferredPreview } from '../gallery/deferred-preview.jsx'
import { PREVIEW_GROUPS, previewGroup } from '../gallery/preview-registry.js'
import { SPECIALIZED_DEMOS } from '../gallery/specialized-previews.jsx'
import { SEARCH_BOARD_DEMOS } from '../gallery/search-board-previews.jsx'
import { RECEIVING_DEMOS } from '../gallery/receiving-previews.jsx'
import { DOCUMENT_DEMOS } from '../gallery/document-previews.jsx'
import { REVIEW_DEMOS } from '../gallery/review-previews.jsx'
import { SHELL_DEMOS } from '../gallery/shell-previews.jsx'
import { OPERATION_DEMOS } from '../gallery/operation-previews.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove(); vi.restoreAllMocks() })
const render = async props => { await act(async () => root.render(<DeferredPreview {...props} />)) }
const clickRetry = async () => { await act(async () => host.querySelector('button').click()) }

test('names-only registry matches every real secondary demo exactly once', () => {
  const maps = { specialized: SPECIALIZED_DEMOS, 'search-board': SEARCH_BOARD_DEMOS, receiving: RECEIVING_DEMOS, document: DOCUMENT_DEMOS, review: REVIEW_DEMOS, shell: SHELL_DEMOS, operation: OPERATION_DEMOS }
  for (const [group, demos] of Object.entries(maps)) expect(PREVIEW_GROUPS[group]).toEqual(Object.keys(demos))
  const names = Object.values(PREVIEW_GROUPS).flat()
  expect(new Set(names).size).toBe(names.length)
  for (const name of names) expect(previewGroup(name)).not.toBeNull()
  for (const name of ['PhoneField', 'BancoCombobox', 'CityAutocomplete', 'RucField', 'unknown']) expect(previewGroup(name)).toBeNull()
})

test('does not request a module before mounted; announces loading then renders real demo', async () => {
  let resolve
  const loader = vi.fn(() => new Promise(done => { resolve = done }))
  expect(loader).not.toHaveBeenCalled()
  await render({ name: 'Calendario', loader })
  expect(loader).toHaveBeenCalledTimes(1)
  expect(host.querySelector('[role="status"]').textContent).toContain('Cargando vista de Calendario')
  await act(async () => resolve(({ name }) => <p>{name} ready</p>))
  expect(host.textContent).toBe('Calendario ready')
  expect(host.querySelector('[role="status"]')).toBeNull()
})

test('failed import is local, actionable and retries with a new request', async () => {
  const loader = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(() => <p>Loaded demo</p>)
  await render({ name: 'Calendario', loader })
  expect(host.querySelector('[role="alert"]').textContent).toContain('El catálogo sigue disponible')
  await clickRetry()
  expect(loader).toHaveBeenCalledTimes(2)
  expect(host.textContent).toBe('Loaded demo')
})

test('late resolution after switching modules cannot replace the current demo', async () => {
  let resolve
  const first = () => new Promise(done => { resolve = done })
  const second = () => Promise.resolve(() => <p>Second demo</p>)
  await render({ name: 'Calendario', loader: first })
  await render({ name: 'Recepcion', loader: second })
  await act(async () => resolve(() => <p>Stale demo</p>))
  expect(host.textContent).toBe('Second demo')
})

test('loaded component failure stays inside preview and retry remounts it', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const suppressExpectedError = event => event.preventDefault()
  window.addEventListener('error', suppressExpectedError)
  let fail = true
  const loader = () => Promise.resolve(() => { if (fail) throw new Error('demo failed'); return <p>Recovered demo</p> })
  await render({ name: 'Calendario', loader })
  expect(host.querySelector('[role="alert"]')).not.toBeNull()
  fail = false
  await clickRetry()
  expect(host.textContent).toBe('Recovered demo')
  window.removeEventListener('error', suppressExpectedError)
})
