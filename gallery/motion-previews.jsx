import React, { useState } from 'react'
import { AnimatedStatus, MotionSurface, Button, Card, Subtabs } from '../src/index.js'

const workflows = [['upload', 'Subida'], ['verification', 'Verificación'], ['payment', 'Pago']]
const labels = { idle: 'Fixture listo', loading: 'Procesando fixture…', success: 'Resultado exitoso simulado', error: 'Error simulado; reintentá' }

export function MotionPreview({ name }) {
  const [workflow, setWorkflow] = useState('upload')
  const [state, setState] = useState('idle')
  const [motion, setMotion] = useState(true)
  return <div data-demo-family="motion" data-demo-export={name} className="min-w-0 space-y-4">
    <p className="text-xs text-mute">Demo local: sin archivos, verificación ni cobros reales. Cada resultado se elige explícitamente.</p>
    <Subtabs value={workflow} onChange={value => { setWorkflow(value); setState('idle') }} items={workflows} ariaLabel="Flujo de muestra" />
    <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={motion} onChange={event => setMotion(event.target.checked)} />Animar (respeta movimiento reducido)</label>
    <MotionSurface hover={name === 'MotionSurface'} elevation={name === 'MotionSurface'} motion={motion}>
      <Card className="space-y-4">
        <h4 className="font-semibold">{workflows.find(([id]) => id === workflow)[1]} · demo</h4>
        <AnimatedStatus state={state} motion={motion}>{labels[state]}</AnimatedStatus>
        <div className="flex flex-wrap gap-2">
          <MotionSurface press={name === 'MotionSurface'} motion={motion}><Button type="button" disabled={state === 'loading'} onClick={() => setState('loading')}>Iniciar demo</Button></MotionSurface>
          <Button type="button" variant="outline" disabled={state !== 'loading'} onClick={() => setState('success')}>Simular éxito</Button>
          <Button type="button" variant="outline" disabled={state !== 'loading'} onClick={() => setState('error')}>Simular error</Button>
          <Button type="button" variant="ghost" onClick={() => setState('idle')}>Reiniciar demo</Button>
        </div>
      </Card>
    </MotionSurface>
  </div>
}
