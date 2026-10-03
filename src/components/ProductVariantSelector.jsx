import { useId } from 'react'
import { Button, Card } from './ui.jsx'
import { cn } from '../utils/cn.js'

/** Availability comes from the app's authoritative combination matrix. */
export default function ProductVariantSelector({ groups = [], variants = [], value = {}, onChange,
  disabled = false, pending = false, title = 'Variantes del producto', clearLabel = 'Limpiar selección', className }) {
  const id = useId()
  const locked = disabled || pending || !onChange
  const keys = groups.map(group => group.id)
  const matrix = variants.filter(variant => variant.available && groups.every(group => group.options.some(option => option.id === variant.values[group.id])))
  const matches = (variant, selection) => keys.every(key => !selection[key] || variant.values[key] === selection[key])
  const complete = groups.length > 0 && groups.every(group => group.options.some(option => option.id === value[group.id]))
  const available = matrix.some(variant => matches(variant, value))
  const selected = keys.some(key => value[key])
  return <Card className={cn('min-w-0 space-y-4', className)}>
    <section aria-labelledby={`${id}-title`} aria-busy={pending || undefined} className="space-y-4">
      <h3 id={`${id}-title`} className="text-lg font-semibold">{title}</h3>
      {groups.map(group => <fieldset key={group.id} disabled={locked} className="min-w-0 space-y-2">
        <legend className="font-medium">{group.label}</legend>
        <div className="flex flex-wrap gap-2">{group.options.map(option => {
          const candidate = { ...value, [group.id]: option.id }
          const enabled = !option.disabled && matrix.some(variant => matches(variant, candidate))
          return <label key={option.id} className={cn('flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-interactivo px-3 py-2', value[group.id] === option.id ? 'bg-fono/10' : 'bg-ink-800', !enabled && 'text-mute')}>
            <input type="radio" name={`${id}-${group.id}`} value={option.id} checked={value[group.id] === option.id} disabled={locked || !enabled}
              onChange={() => { if (!locked && enabled) onChange(candidate) }} />
            <span className="break-words">{option.label}{!enabled && ' — No disponible'}</span>
          </label>
        })}</div>
      </fieldset>)}
      {!groups.length && <p className="text-sm text-mute">No hay variantes para elegir.</p>}
      <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-mute">
        {pending ? 'Actualizando disponibilidad…' : selected && !available ? 'La combinación no está disponible. Limpie la selección.' : complete ? 'Combinación seleccionada.' : 'Seleccione las opciones del producto.'}
      </p>
      <Button type="button" variant="ghost" disabled={locked || !selected} onClick={() => { if (!locked && selected) onChange({}) }}>{clearLabel}</Button>
    </section>
  </Card>
}
