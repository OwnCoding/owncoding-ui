import { cn } from '../utils/cn.js'
import Icon from './Icon.jsx'

const OPTIONS = [
  { key: 'list', icon: 'list', label: 'Ver como lista' },
  { key: 'grid', icon: 'grid', label: 'Ver como cuadrícula' },
]

// Selector lista/cuadrícula solo con íconos: sin texto, accesible con etiqueta.
export default function ListGridToggle({ value, onChange, className }) {
  return (
    <div className={cn('flex select-none overflow-hidden rounded-lg border border-ink-600 bg-ink-800', className)} role="group" aria-label="Cambiar vista">
      {OPTIONS.map(option => (
        <button
          key={option.key}
          type="button"
          title={option.label}
          aria-label={option.label}
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
          className={cn('toque-44 grid h-9 w-9 place-items-center transition', value === option.key ? 'bg-fono/15 text-fono-text' : 'text-mute hover:text-fore')}
        >
          <Icon name={option.icon} className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
