import { useId } from 'react'
import { Badge, Button, Card, Money } from './ui.jsx'
import AnimatedStatus from './AnimatedStatus.jsx'
import MotionSurface from './MotionSurface.jsx'
import { cn } from '../utils/cn.js'

/** Readonly commercial presentation; selection and service fulfillment belong to the app. */
export default function PricingCard({ title, description, price, currency = 'PYG', period,
  features = [], badge, selected = false, unavailable = false, pending = false, disabled = false,
  onSelect, selectLabel = 'Elegir plan', selectedLabel = 'Plan seleccionado', unavailableLabel = 'No disponible',
  message, motion = true, className }) {
  const id = useId()
  const validPrice = typeof price === 'number' && Number.isFinite(price) && price >= 0
  const locked = disabled || unavailable || pending || selected || !validPrice || !onSelect
  return <MotionSurface hover elevation motion={motion}><Card className={cn('min-w-0 space-y-4', selected && 'ring-2 ring-fono', className)}>
    <section aria-labelledby={`${id}-title`} aria-busy={pending || undefined} className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2"><h3 id={`${id}-title`} className="min-w-0 break-words text-lg font-semibold">{title}</h3>
        {badge && <Badge>{badge}</Badge>}</div>
      {description && <p className="break-words text-sm text-mute">{description}</p>}
      <p className="min-w-0 break-words"><Money value={validPrice ? price : NaN} currency={currency} className="text-3xl font-semibold tabular-nums" />
        {period && <span className="ml-2 text-sm text-mute">{period}</span>}</p>
      <ul className="space-y-2">{features.map(feature => <li key={feature.id} className="min-w-0 break-words text-sm">
        <span className={cn(!feature.included && 'text-mute')}>{feature.label}</span>
        <span className="ml-2 text-xs text-mute">{feature.included ? 'Incluido' : 'No incluido'}</span>
      </li>)}</ul>
      <AnimatedStatus state={pending ? 'loading' : 'idle'} motion={motion}>{message ?? (pending ? 'Procesando selección…' : unavailable ? unavailableLabel : selected ? selectedLabel : 'Condiciones proporcionadas por la aplicación.')}</AnimatedStatus>
      <MotionSurface press motion={motion}><Button type="button" className="w-full" variant={selected ? 'outline' : 'primary'} disabled={locked}
        onClick={() => { if (!locked) onSelect() }}>{unavailable ? unavailableLabel : selected ? selectedLabel : selectLabel}</Button></MotionSurface>
    </section>
  </Card></MotionSurface>
}
