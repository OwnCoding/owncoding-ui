import { useId } from 'react'
import { Button, FormField, PinInput } from './ui.jsx'
import AnimatedStatus from './AnimatedStatus.jsx'
import MotionSurface from './MotionSurface.jsx'
import { cn } from '../utils/cn.js'

const messages = {
  idle: 'Ingresá el código recibido.', loading: 'Verificando código…',
  success: 'Código verificado.', error: 'No se pudo verificar el código.',
}

/** Application-owned verification, result and cooldown; no timers or requests. */
export default function OtpVerification({
  value, onChange, onVerify, onResend, status = 'idle', length = 6,
  secondsRemaining = 0, disabled = false, masked = false, motion = true,
  label = 'Código de verificación', hint, error, statusMessage,
  verifyLabel = 'Verificar código', resendLabel = 'Reenviar código', id, className,
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const size = Number.isInteger(length) && length >= 4 && length <= 6 ? length : 6
  const current = Object.hasOwn(messages, status) ? status : 'idle'
  const locked = disabled || current === 'loading'
  const complete = new RegExp(`^\\d{${size}}$`).test(String(value ?? ''))
  const seconds = Number(secondsRemaining)
  const cooldownKnown = Number.isFinite(seconds)
  const wait = cooldownKnown ? Math.max(0, Math.ceil(seconds)) : 0
  const canResend = !locked && cooldownKnown && wait === 0
  return <div className={cn('min-w-0 space-y-4', className)}>
    <FormField htmlFor={inputId} label={label} hint={hint} error={current === 'error' ? error || messages.error : undefined}>
      <PinInput id={inputId} ariaLabel={label} value={value} length={size} masked={masked}
        disabled={locked} className="mx-0 focus-within:scale-100" onKeyDown={event => { if (event.key === 'Enter') event.preventDefault() }} onChange={next => { if (!locked) onChange(next) }} />
    </FormField>
    <AnimatedStatus state={current} motion={motion}>{statusMessage ?? messages[current]}</AnimatedStatus>
    <div className="flex flex-wrap gap-2">
      <MotionSurface press motion={motion}><Button type="button" disabled={locked || !complete || !onVerify}
        aria-busy={current === 'loading' || undefined} onClick={() => { if (!locked && complete) onVerify?.(value) }}>{verifyLabel}</Button></MotionSurface>
      {onResend && <MotionSurface press motion={motion}><Button type="button" variant="outline" disabled={!canResend}
        onClick={() => { if (canResend) onResend() }}>{!cooldownKnown ? 'Reenvío no disponible' : wait ? `${resendLabel} (${wait} s)` : resendLabel}</Button></MotionSurface>}
    </div>
  </div>
}
