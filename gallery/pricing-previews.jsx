import React, { useState } from 'react'
import { PricingCard, Button } from '../src/index.js'
export function PricingCardPreview({ name }) {
  const [selected, setSelected] = useState(null)
  const [pending, setPending] = useState(null)
  const plans = [
    { id: 'base', title: 'Base Demo', price: 10000, features: [{ id: 'reports', label: 'Informes de muestra', included: true }] },
    { id: 'team', title: 'Equipo Demo', price: 20000, badge: 'Fixture destacado', features: [{ id: 'team', label: 'Equipo de muestra', included: true }] },
    { id: 'unavailable', title: 'No disponible Demo', price: 30000, unavailable: true, features: [{ id: 'sample', label: 'Servicio de muestra', included: false }] },
  ]
  return <div data-demo-family="pricing" data-demo-export={name} className="min-w-0 space-y-3">
    <p className="text-xs text-mute">Precios ficticios; elegir no contrata ni cobra. Resultado manual, sin servicios externos.</p>
    <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={!pending} onClick={() => { setSelected(pending); setPending(null) }}>Confirmar selección demo</Button>
      <Button type="button" variant="outline" onClick={() => { setSelected(null); setPending(null) }}>Restablecer demo</Button></div>
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">{plans.map(plan => <PricingCard key={plan.id} {...plan} period="/ mes demo" selected={selected === plan.id}
      pending={pending === plan.id} disabled={!!pending} onSelect={() => setPending(plan.id)} />)}</div>
  </div>
}
