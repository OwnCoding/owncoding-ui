import { useId } from 'react'
import { Button, Card, Money } from './ui.jsx'
import AnimatedStatus from './AnimatedStatus.jsx'
import MotionSurface from './MotionSurface.jsx'
import { cn } from '../utils/cn.js'

/** Emits cart intentions; all prices, totals and stock limits belong to the app. */
export default function CartSummary({ items = [], totals = [], total, currency = 'PYG',
  onQuantityChange, onRemove, onCheckout, pending = false, disabled = false, motion = true,
  title = 'Carrito', emptyLabel = 'El carrito está vacío.', checkoutLabel = 'Continuar', message, className }) {
  const titleId = useId()
  const locked = disabled || pending
  const validMoney = value => typeof value === 'number' && Number.isFinite(value) && value >= 0
  const validQuantity = item => Number.isSafeInteger(item.quantity) && item.quantity >= 1 &&
    (item.maxQuantity === undefined || (Number.isSafeInteger(item.maxQuantity) && item.maxQuantity >= item.quantity))
  const ready = items.length > 0 && items.every(item => validQuantity(item) && validMoney(item.amount)) &&
    validMoney(total) && totals.every(row => validMoney(row.amount))
  return <Card className={cn('min-w-0 space-y-4', className)}>
    <section aria-labelledby={titleId} aria-busy={pending || undefined} className="min-w-0 space-y-4">
      <h3 id={titleId} className="text-lg font-semibold">{title}</h3>
      {items.length ? <ul className="space-y-4">{items.map(item => {
        const valid = validQuantity(item)
        const blocked = locked || item.unavailable || !valid
        return <li key={item.id} className="min-w-0 space-y-2 border-b border-interactivo pb-4">
          <div className="flex flex-wrap justify-between gap-2"><span className="min-w-0 break-words font-medium">{item.label}</span>
            <Money value={validMoney(item.amount) ? item.amount : NaN} currency={currency} /></div>
          {item.description && <p className="break-words text-sm text-mute">{item.description}</p>}
          <div role="group" aria-label={`Cantidad de ${item.label}`} className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" aria-label={`Reducir ${item.label}`} disabled={blocked || !onQuantityChange || item.quantity <= 1}
              onClick={() => { if (!blocked && item.quantity > 1) onQuantityChange?.(item.id, item.quantity - 1) }}>−</Button>
            <span className="tabular-nums">{valid ? item.quantity : 'Cantidad no válida'}</span>
            <Button type="button" variant="outline" aria-label={`Aumentar ${item.label}`} disabled={blocked || !onQuantityChange || item.quantity >= (item.maxQuantity ?? Number.MAX_SAFE_INTEGER)}
              onClick={() => { if (!blocked && item.quantity < (item.maxQuantity ?? Number.MAX_SAFE_INTEGER)) onQuantityChange?.(item.id, item.quantity + 1) }}>+</Button>
            {onRemove && <Button type="button" variant="ghost" disabled={locked} aria-label={`Quitar ${item.label}`}
              onClick={() => { if (!locked) onRemove(item.id) }}>Quitar</Button>}
          </div>
          {item.unavailable && <p className="text-sm text-mute">No disponible</p>}
        </li>
      })}</ul> : <p className="text-sm text-mute">{emptyLabel}</p>}
      <dl className="space-y-2">{totals.map(row => <div key={row.id} className="flex flex-wrap justify-between gap-2"><dt>{row.label}</dt><dd><Money value={validMoney(row.amount) ? row.amount : NaN} currency={currency} /></dd></div>)}
        <div className="flex flex-wrap justify-between gap-2 font-semibold"><dt>Total</dt><dd><Money value={validMoney(total) ? total : NaN} currency={currency} /></dd></div></dl>
      <AnimatedStatus state={pending ? 'loading' : 'idle'} motion={motion}>{message ?? (pending ? 'Actualizando carrito…' : 'Importes y disponibilidad confirmados por la aplicación.')}</AnimatedStatus>
      <MotionSurface press motion={motion}><Button type="button" className="w-full" disabled={locked || !ready || items.some(item => item.unavailable) || !onCheckout}
        onClick={() => { if (!locked && ready && !items.some(item => item.unavailable)) onCheckout?.() }}>{checkoutLabel}</Button></MotionSurface>
    </section>
  </Card>
}
