// @vitest-environment jsdom
import React, { useState } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { RucField, createOwnDataRucProvider, mapOwnDataRucResponse, mapOwnDataRucError } from '../src/index.js'
import { OwnDataIntegrationPreview, simulatedOwnDataEnvelope } from '../gallery/owndata-ruc-preview.jsx'
afterEach(() => { cleanup(); vi.restoreAllMocks() })
it.each([
  ['API_KEY_ENVIRONMENT_MISMATCH', 401, 'La clave de OwnData no corresponde al ambiente configurado. Complete los datos manualmente.'],
  ['FREE_API_DISABLED', 503, 'La API gratuita de OwnData está deshabilitada. Complete los datos manualmente.'],
])('maps current contract code %s to safe actionable text', (code, status, message) => {
  const error = mapOwnDataRucError({ error: { code, message: 'unsafe-provider-detail', retryAfter: 9 }, requestId: 'req-safe' })
  expect(error).toMatchObject({ code, status, message, requestId: 'req-safe' })
  expect(error.retryAfter).toBeUndefined()
  expect(String(error)).not.toContain('unsafe-provider-detail')
})
it.each([undefined, null, 401, {}, ['API_KEY_INVALID'], '__proto__', 'toString', 'unsafe-provider-detail'])('fails closed for unknown or non-string code %j', code => {
  const error = mapOwnDataRucError({ error: { code, message: 'unsafe-provider-detail' }, requestId: 'unsafe\nprovider-detail', body: 'unsafe-provider-detail' })
  expect(error).toMatchObject({ code: 'OWNDATA_INVALID_RESPONSE', status: 502 })
  expect(error.message).toBe('No se pudo consultar OwnData. Complete los datos manualmente.')
  expect(error).not.toHaveProperty('requestId')
  expect(error).not.toHaveProperty('body')
  expect(error).not.toHaveProperty('cause')
  expect(String(error)).not.toContain('unsafe-provider-detail')
})
it.each(['API_KEY_ENVIRONMENT_MISMATCH', 'FREE_API_DISABLED', 'ENVIRONMENT_MISMATCH', 'UNKNOWN_PROVIDER_ERROR'])('keeps manual entry available after %s without retrying or applying data', async code => {
  const lookup = vi.fn(async () => ({ error: { code, message: 'unsafe-provider-detail' } }))
  const provider = createOwnDataRucProvider({ lookup }), apply = vi.fn()
  function ManualEntry() {
    const [ruc, setRuc] = useState('80012345-6'), [name, setName] = useState('Manual name')
    return <><RucField ariaLabel="RUC" value={ruc} onChange={setRuc} consultar={provider} onAplicar={apply} />
      <input aria-label="Legal name" value={name} onChange={event => setName(event.target.value)} /></>
  }
  render(<ManualEntry />)
  fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' }))
  const alert = await screen.findByRole('alert')
  expect(alert.textContent).not.toContain('unsafe-provider-detail')
  expect(screen.getByRole('textbox', { name: 'RUC' }).disabled).toBe(false)
  expect(screen.getByRole('textbox', { name: 'Legal name' }).value).toBe('Manual name')
  fireEvent.change(screen.getByRole('textbox', { name: 'Legal name' }), { target: { value: 'Edited manually' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'RUC' }), { target: { value: '80054321-2' } })
  expect(screen.getByRole('textbox', { name: 'Legal name' }).value).toBe('Edited manually')
  expect(screen.getByRole('textbox', { name: 'RUC' }).value).toBe('80054321-2')
  expect(screen.queryByRole('button', { name: 'Usar estos datos' })).toBeNull()
  expect(apply).not.toHaveBeenCalled()
  expect(lookup).toHaveBeenCalledExactlyOnceWith('80012345-6')
})
it('preserves exact official identity, raw state and whitelisted snapshot metadata without inventing contacts', () => {
  const envelope = simulatedOwnDataEnvelope(); envelope.data.nameOfficial = '  RAZÓN OFICIAL, S.A.  '
  envelope.data.email = 'unexpected-secret'; envelope.meta.extraSecret = 'secret'
  for (const requested of ['80012345', '80012345-6']) {
    const mapped = mapOwnDataRucResponse(envelope, requested)
    expect(mapped.name).toBe(envelope.data.nameOfficial); expect(mapped.reviewRequired).toBe(true)
    expect(mapped.ownData.stateRaw).toBe('ESTADO DEMO'); expect(mapped.ownData.provenance).toEqual(envelope.meta.provenance)
    expect(mapped).not.toHaveProperty('email'); expect(mapped).not.toHaveProperty('phone'); expect(mapped).not.toHaveProperty('simulado')
    expect(JSON.stringify(mapped)).not.toContain('secret')
  }
})
it('rejects malformed requests before transport and never repairs an incorrect DV', async () => {
  const lookup = vi.fn(async () => simulatedOwnDataEnvelope()), provider = createOwnDataRucProvider({ lookup })
  for (const requested of ['080012345', ' 80012345', '80012345-', '80012345-66', 'x', '0', '1234567890']) {
    await expect(provider(requested)).rejects.toMatchObject({ code: 'INVALID_RUC_FORMAT' })
  }
  expect(lookup).not.toHaveBeenCalled()
  await expect(provider('80012345-7')).rejects.toMatchObject({ code: 'OWNDATA_INVALID_RESPONSE' })
  expect(lookup).toHaveBeenCalledExactlyOnceWith('80012345-7')
  const nine = simulatedOwnDataEnvelope(); nine.data.ruc = '123456789'; nine.data.fullRuc = '123456789-6'
  expect(mapOwnDataRucResponse(nine, '123456789').fullRuc).toBe('123456789-6')
})
it('fails closed for mismatched identities, empty name, malformed provenance, quota or environment', () => {
  for (const mutate of [e => { e.data.fullRuc = '80012345-7' }, e => { e.data.ruc = '80012346' }, e => { e.data.nameOfficial = ' ' }, e => { e.meta.provenance.source = 'sun' }, e => { delete e.meta.provenance.publicationDate }, e => { e.meta.provenance.snapshotHash = 'invalid' }, e => { e.meta.quota.used = NaN }, e => { e.meta.environment = 'unknown' }]) {
    const envelope = simulatedOwnDataEnvelope(); mutate(envelope)
    expect(() => mapOwnDataRucResponse(envelope, '80012345-6')).toThrow()
  }
  expect(() => mapOwnDataRucResponse(simulatedOwnDataEnvelope(), '80012344')).toThrow()
})
it('branches by known error codes, not upstream messages; exposes only bounded diagnostics', () => {
  const codes = { INVALID_RUC_FORMAT: 400, API_KEY_REQUIRED: 401, API_KEY_INVALID: 401, API_KEY_REVOKED: 401, API_KEY_EXPIRED: 401, ENVIRONMENT_MISMATCH: 401, INSUFFICIENT_SCOPE: 403, PLAN_REQUIRED: 403, REGISTERED_RUC_NOT_FOUND: 404, DAILY_QUOTA_REACHED: 429, COMMERCIAL_API_DISABLED: 503, COMMERCIAL_API_UNAVAILABLE: 503, DNIT_DATA_UNAVAILABLE: 503 }
  for (const [code, status] of Object.entries(codes)) {
    const error = mapOwnDataRucError({ error: { code, message: 'secret-key upstream', retryAfter: 30 }, requestId: 'req-safe', body: 'secret' })
    expect(error).toMatchObject({ code, status, requestId: 'req-safe' }); expect(error.message).not.toContain('secret')
    expect(error).not.toHaveProperty('body'); expect(error).not.toHaveProperty('cause')
    expect(error.retryAfter).toBe(code === 'DAILY_QUOTA_REACHED' ? 30 : undefined)
  }
  expect(mapOwnDataRucError({ error: { code: ['API_KEY_INVALID'] }, requestId: 'unsafe\nsecret' })).toMatchObject({ code: 'OWNDATA_INVALID_RESPONSE' })
  expect(mapOwnDataRucError({ error: { code: 'DAILY_QUOTA_REACHED', retryAfter: 'raw-secret' } }).retryAfter).toBeUndefined()
})
it('disabled envelopes and rejected transport never retry or expose their payload', async () => {
  const blocked = vi.fn(async () => ({ error: { code: 'COMMERCIAL_API_DISABLED', message: 'key' } }))
  await expect(createOwnDataRucProvider({ lookup: blocked })('80012345')).rejects.toMatchObject({ code: 'COMMERCIAL_API_DISABLED' })
  expect(blocked).toHaveBeenCalledOnce()
  const broken = vi.fn(async () => { throw new Error('upstream-secret-key') })
  await expect(createOwnDataRucProvider({ lookup: broken })('80012345')).rejects.toMatchObject({ code: 'OWNDATA_TRANSPORT_ERROR' })
  expect(broken).toHaveBeenCalledOnce()
})
it('RucField still requires explicit confirmation and drops stale adapter results on controlled updates', async () => {
  let resolve
  const provider = createOwnDataRucProvider({ lookup: () => new Promise(done => { resolve = done }) })
  const apply = vi.fn()
  const { rerender } = render(<RucField value="80012345-6" onChange={() => {}} consultar={provider} onAplicar={apply} />)
  fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' }))
  expect(apply).not.toHaveBeenCalled()
  rerender(<RucField value="80054321-2" onChange={() => {}} consultar={provider} onAplicar={apply} />)
  resolve(simulatedOwnDataEnvelope()); await waitFor(() => expect(screen.queryByText('Usar estos datos')).toBeNull())
  expect(apply).not.toHaveBeenCalled()
})
it('gallery succeeds by default, confirms manually, and recovers from opt-in failure', async () => {
  const fetcher = vi.spyOn(globalThis, 'fetch')
  render(<OwnDataIntegrationPreview />)
  const extract = () => fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' }))
  const failure = screen.getByRole('checkbox', { name: 'Probar error: API deshabilitada' })
  expect(failure.checked).toBe(false)
  extract()
  const confirm = await screen.findByRole('button', { name: 'Usar estos datos' })
  expect(screen.queryByText(/Confirmado solo en demo/)).toBeNull()
  fireEvent.click(confirm)
  expect(screen.getByText(/Confirmado solo en demo/)).toBeTruthy()
  fireEvent.click(failure)
  expect(screen.queryByText(/Confirmado solo en demo/)).toBeNull()
  extract()
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'La API comercial de OwnData está deshabilitada.')
  fireEvent.click(failure)
  extract()
  expect(await screen.findByRole('button', { name: 'Usar estos datos' })).toBeTruthy()
  expect(screen.queryByRole('alert')).toBeNull()
  expect(fetcher).not.toHaveBeenCalled()
})
it('gallery offers distinct local companies, invalidates previous confirmation, and rejects unknown demo RUCs', async () => {
  const fetcher = vi.spyOn(globalThis, 'fetch')
  render(<OwnDataIntegrationPreview />)
  const select = screen.getByRole('combobox', { name: 'Empresa de ejemplo' })
  const input = screen.getByRole('textbox', { name: 'RUC de ejemplo OwnData' })
  const names = new Set()
  for (const option of Array.from(select.options).filter(item => item.value)) {
    fireEvent.change(select, { target: { value: option.value } })
    expect(screen.queryByText(/Confirmado solo en demo/)).toBeNull()
    expect(input.value).toBe(option.value)
    fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' }))
    const confirm = await screen.findByRole('button', { name: 'Usar estos datos' })
    names.add(screen.getByText(/EMPRESA DEMO/, { selector: 'b' }).textContent)
    fireEvent.click(confirm)
    expect(screen.getByText(/Confirmado solo en demo/).textContent).toContain('DEMO')
  }
  expect(names.size).toBeGreaterThanOrEqual(3)
  fireEvent.change(input, { target: { value: '99999999-1' } })
  expect(screen.queryByText(/Confirmado solo en demo/)).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' }))
  expect((await screen.findByRole('alert')).textContent).toMatch(/RUC no incluido en esta demo/)
  expect(screen.queryByRole('button', { name: 'Usar estos datos' })).toBeNull()
  expect(fetcher).not.toHaveBeenCalled()
})
it('opt-in nine-digit RucField preserves base/full identity across controlled refeed and confirms without DV repair', async () => {
  const envelope = simulatedOwnDataEnvelope(); envelope.data.ruc = '123456789'; envelope.data.fullRuc = '123456789-6'
  const lookup = vi.fn(async () => envelope), provider = createOwnDataRucProvider({ lookup })
  const apply = vi.fn(), change = vi.fn()
  const { rerender } = render(<RucField ariaLabel="OwnData RUC" maxBaseDigits={9} value="123456789" onChange={change} consultar={provider} onAplicar={apply} />)
  const input = screen.getByRole('textbox', { name: 'OwnData RUC' })
  expect(input.value).toBe('123456789'); expect(input.maxLength).toBe(11)
  fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' }))
  const confirm = await screen.findByRole('button', { name: 'Usar estos datos' }); expect(lookup).toHaveBeenCalledExactlyOnceWith('123456789')
  expect(apply).not.toHaveBeenCalled(); fireEvent.click(confirm); expect(apply.mock.calls[0][0].fullRuc).toBe('123456789-6')
  rerender(<RucField ariaLabel="OwnData RUC" maxBaseDigits={9} value="123456789-6" onChange={change} consultar={provider} onAplicar={apply} />)
  expect(input.value).toBe('123456789-6'); expect(change).not.toHaveBeenCalled()
  rerender(<RucField ariaLabel="OwnData RUC" maxBaseDigits={9} value="123456789-7" onChange={change} consultar={provider} />)
  fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' })); expect(await screen.findByRole('alert')).toBeTruthy()
  expect(screen.queryByText('Usar estos datos')).toBeNull(); expect(input.value).toBe('123456789-7')
})
it('opt-in nine-digit invalid extras disable lookup; excessive paste is rejected rather than clipped', () => {
  const provider = vi.fn(), change = vi.fn()
  const { rerender } = render(<RucField ariaLabel="Exact RUC" maxBaseDigits={9} value="1234567890" onChange={change} consultar={provider} />)
  expect(screen.getByRole('textbox').value).toBe('1234567890'); expect(screen.getByRole('button').disabled).toBe(true)
  rerender(<RucField ariaLabel="Exact RUC" maxBaseDigits={9} value="123456789-6" onChange={change} consultar={provider} />)
  const input = screen.getByRole('textbox'); input.setSelectionRange(0, input.value.length)
  fireEvent.paste(input, { clipboardData: { getData: () => '1234567890-6' } }); expect(change).not.toHaveBeenCalled()
  fireEvent.paste(input, { clipboardData: { getData: () => '123456789' } }); expect(change).toHaveBeenCalledExactlyOnceWith('123456789')
  expect(provider).not.toHaveBeenCalled()
})

it('accepts actual numeric source partitions, optional absence and empty published text faithfully', () => {
  for (const partition of [0, 9]) {
    const envelope = simulatedOwnDataEnvelope(); envelope.data.sourcePartition = partition
    envelope.meta.provenance.publishedText = ''
    const mapped = mapOwnDataRucResponse(envelope, '80012345-6')
    expect(mapped.ownData.sourcePartition).toBe(partition)
    expect(mapped.ownData.provenance.publishedText).toBe('')
  }
  const envelope = simulatedOwnDataEnvelope(); delete envelope.data.sourcePartition
  expect(mapOwnDataRucResponse(envelope, '80012345').ownData).not.toHaveProperty('sourcePartition')
})
it('rejects invalid present source partitions and non-string published text', () => {
  for (const partition of ['0', 'fixture', null, undefined, -1, 10, 0.5, NaN, Infinity]) {
    const envelope = simulatedOwnDataEnvelope(); envelope.data.sourcePartition = partition
    expect(() => mapOwnDataRucResponse(envelope, '80012345')).toThrow()
  }
  for (const publishedText of [null, undefined, 0, {}]) {
    const envelope = simulatedOwnDataEnvelope(); envelope.meta.provenance.publishedText = publishedText
    expect(() => mapOwnDataRucResponse(envelope, '80012345')).toThrow()
  }
})

it('links the existing authenticated account surface without turning the gallery fixture into a live provider', () => {
  const fetcher = vi.spyOn(globalThis, 'fetch')
  render(<OwnDataIntegrationPreview />)
  const link = screen.getByRole('link', { name: 'Abrir consulta autenticada en OwnData' })
  expect(link.getAttribute('href')).toBe('https://app.controlaria.online/panel/ruc')
  expect(link.getAttribute('target')).toBe('_blank')
  expect(screen.getByText(/La consulta real requiere iniciar sesión en OwnData/)).toBeTruthy()
  expect(screen.getByText(/no realiza consultas reales ni incluye claves/)).toBeTruthy()
  expect(screen.getByRole('checkbox', { name: 'Probar error: API deshabilitada' }).checked).toBe(false)
  expect(fetcher).not.toHaveBeenCalled()
  fetcher.mockRestore()
})

it('local fixtures preserve request identity and never repair a mismatched DV', () => {
  for (const fullRuc of ['80012345-6', '80054321-2', '80098765-4']) {
    const base = fullRuc.split('-')[0]
    for (const requested of [base, fullRuc]) {
      const envelope = simulatedOwnDataEnvelope(requested)
      expect(mapOwnDataRucResponse(envelope, requested).fullRuc).toBe(fullRuc)
      expect(envelope.meta.provenance.sourcePage).toBe('urn:owncoding-ui:local-demo')
      expect(envelope.meta.provenance.publishedText).toContain('no publicación real')
    }
  }
  expect(simulatedOwnDataEnvelope('80012345-7').error.code).toBe('REGISTERED_RUC_NOT_FOUND')
})
it('demo rejects letters and discards pending results when the company changes', async () => {
  render(<OwnDataIntegrationPreview />)
  const input = screen.getByRole('textbox', { name: 'RUC de ejemplo OwnData' })
  fireEvent.change(input, { target: { value: 'letters' } })
  expect(input.value).toBe('80012345-6')
  fireEvent.click(screen.getByRole('button', { name: 'Extraer los datos del RUC' }))
  await screen.findByRole('button', { name: 'Usar estos datos' })
  fireEvent.change(screen.getByRole('combobox', { name: 'Empresa de ejemplo' }), { target: { value: '80054321-2' } })
  expect(screen.queryByRole('button', { name: 'Usar estos datos' })).toBeNull()
  expect(screen.queryByText(/Confirmado solo en demo/)).toBeNull()
})
