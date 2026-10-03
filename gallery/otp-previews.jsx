import React, { useState } from 'react'
import { OtpVerification, Button } from '../src/index.js'

export function OtpPreview({ name }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle')
  const [seconds, setSeconds] = useState(0)
  const [notice, setNotice] = useState('Fixture local: no se envían códigos ni se autentica una sesión.')
  return <div data-demo-family="otp" data-demo-export={name} className="min-w-0 space-y-4">
    <p className="text-xs text-mute">Demo simulada. Código de muestra: 123456. El resultado se elige manualmente.</p>
    <OtpVerification value={value} onChange={next => { setValue(next); setStatus('idle') }} status={status}
      secondsRemaining={seconds} error="Error simulado; podés reintentar." statusMessage={status === 'success' ? 'Éxito simulado; sin verificación real.' : undefined}
      onVerify={() => setStatus('loading')} onResend={() => { setSeconds(30); setNotice('Reenvío simulado; no se envió ningún código.') }} />
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" disabled={status !== 'loading'} onClick={() => setStatus('success')}>Simular éxito</Button>
      <Button type="button" variant="outline" disabled={status !== 'loading'} onClick={() => setStatus('error')}>Simular error</Button>
      <Button type="button" variant="ghost" onClick={() => setSeconds(0)}>Liberar espera demo</Button>
      <Button type="button" variant="ghost" onClick={() => { setValue(''); setStatus('idle'); setSeconds(0) }}>Reiniciar demo</Button>
    </div>
    <p className="text-xs text-mute">{notice}</p>
  </div>
}
