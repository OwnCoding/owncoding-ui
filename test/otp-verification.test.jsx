// @vitest-environment jsdom
import React, { useState } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { OtpVerification, PinInput } from '../src/index.js'
import { OtpPreview } from '../gallery/otp-previews.jsx'

afterEach(cleanup)
const verify = () => screen.getByRole('button', { name: 'Verificar código' })
const resend = () => screen.getByRole('button', { name: /Reenviar código/ })

it('requires a complete numeric code and explicit verification; never completes automatically', () => {
  const change = vi.fn(), submit = vi.fn()
  const { rerender } = render(<OtpVerification value="12" onChange={change} onVerify={submit} />)
  const input = screen.getByRole('textbox', { name: 'Código de verificación' })
  expect(verify().disabled).toBe(true)
  fireEvent.change(input, { target: { value: '12a3456' } })
  expect(change).toHaveBeenCalledWith('123456')
  expect(submit).not.toHaveBeenCalled()
  rerender(<OtpVerification value="123456" onChange={change} onVerify={submit} />)
  expect(verify().disabled).toBe(false)
  expect(fireEvent.keyDown(input, { key: 'Enter', cancelable: true })).toBe(false)
  expect(submit).not.toHaveBeenCalled()
  fireEvent.click(verify())
  expect(submit).toHaveBeenCalledWith('123456')
  expect(screen.getByRole('status').dataset.ocStatus).toBe('idle')
  rerender(<OtpVerification value="abcdef" onChange={change} onVerify={submit} />)
  expect(verify().disabled).toBe(true)
})

it('blocks input, verify and resend for loading and explicit disabled', () => {
  const change = vi.fn(), submit = vi.fn(), send = vi.fn()
  const { rerender } = render(<OtpVerification value="123456" onChange={change} onVerify={submit} onResend={send} status="loading" />)
  for (const props of [{ status: 'loading' }, { disabled: true }]) {
    rerender(<OtpVerification value="123456" onChange={change} onVerify={submit} onResend={send} {...props} />)
    const input = screen.getByRole('textbox')
    expect(input.disabled).toBe(true)
    expect(verify().disabled).toBe(true)
    expect(resend().disabled).toBe(true)
    fireEvent.change(input, { target: { value: '654321' } })
    fireEvent.click(verify()); fireEvent.click(resend())
  }
  expect(change).not.toHaveBeenCalled(); expect(submit).not.toHaveBeenCalled(); expect(send).not.toHaveBeenCalled()
})

it('uses only external cooldown values; invalid cooldown fails closed', () => {
  vi.useFakeTimers()
  try {
    const send = vi.fn()
    const props = { value: '', onChange: vi.fn(), onVerify: vi.fn(), onResend: send }
    const { rerender } = render(<OtpVerification {...props} secondsRemaining={2.2} />)
    expect(resend().textContent).toContain('3 s')
    vi.advanceTimersByTime(10000)
    expect(resend().disabled).toBe(true)
    fireEvent.click(resend()); expect(send).not.toHaveBeenCalled()
    rerender(<OtpVerification {...props} secondsRemaining={0} />)
    fireEvent.click(resend()); expect(send).toHaveBeenCalledOnce()
    rerender(<OtpVerification {...props} secondsRemaining={NaN} />)
    expect(screen.getByRole('button', { name: 'Reenvío no disponible' }).disabled).toBe(true)
  } finally { vi.useRealTimers() }
})

it('connects error/hint to the single native input and preserves SMS autofill', () => {
  const { rerender } = render(<OtpVerification value="1234" length={4} onChange={() => {}} onVerify={() => {}} hint="Código recibido" />)
  const input = screen.getByRole('textbox')
  expect(input.getAttribute('autocomplete')).toBe('one-time-code')
  expect(input.getAttribute('inputmode')).toBe('numeric')
  expect(document.getElementById(input.getAttribute('aria-describedby')).textContent).toBe('Código recibido')
  rerender(<OtpVerification value="1234" length={4} onChange={() => {}} onVerify={() => {}} status="error" error="Código vencido" motion={false} />)
  expect(input.getAttribute('aria-invalid')).toBe('true')
  expect(screen.getByRole('alert').id).toBe(input.getAttribute('aria-describedby'))
  expect(screen.getByRole('status').dataset.motion).toBe('off')
  expect(screen.getAllByRole('textbox')).toHaveLength(1)
})

it('preserves masked PIN default and optional completion, and handles formatted/partial paste in the shared input', () => {
  const done = vi.fn()
  function Demo({ masked = true }) { const [value, setValue] = useState('12'); return <PinInput value={value} onChange={setValue} onComplete={done} length={6} masked={masked} /> }
  const { container, rerender } = render(<Demo />)
  expect(container.querySelector('[aria-hidden="true"]').textContent).toBe('')
  const input = screen.getByRole('textbox')
  input.setSelectionRange(2, 2)
  fireEvent.paste(input, { clipboardData: { getData: () => '34 56' } })
  expect(input.value).toBe('123456'); expect(done).toHaveBeenCalledOnce()
  rerender(<Demo masked={false} />)
  expect(container.querySelector('[aria-hidden="true"]').textContent).toBe('123456')
  input.setSelectionRange(2, 4)
  fireEvent.paste(input, { clipboardData: { getData: () => '90' } })
  expect(input.value).toBe('129056')
})

it('demonstrates simulated result and resend without claiming delivery or authentication', () => {
  render(<OtpPreview name="OtpVerification" />)
  expect(screen.getByText(/Demo simulada/)).toBeTruthy()
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456' } })
  fireEvent.click(verify())
  fireEvent.click(screen.getByRole('button', { name: 'Simular éxito' }))
  expect(screen.getByRole('status').textContent).toContain('sin verificación real')
  fireEvent.click(resend())
  expect(screen.getByText(/no se envió ningún código/)).toBeTruthy()
})
