import { Input } from './ui.jsx'
import { cn } from '../utils/cn.js'

// Instagram con "@" fijo, sin espacios: se guarda el usuario pelado para armar
// el link directo (https://instagram.com/<usuario>). Portable: el adorno no
// forma parte del valor y no se puede borrar.

const MAX_USERNAME = 30

// Acepta "@usuario", "usuario", "instagram.com/usuario" o una URL completa y
// devuelve solo el usuario: sin @, sin espacios y sin caracteres inválidos.
export function normalizarInstagram(value) {
  const texto = String(value || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/^instagram\.com\//i, '')
    .replace(/^@+/, '')
  return texto
    .split(/[/?#]/)[0]
    .replace(/\s+/g, '')
    .replace(/[^A-Za-z0-9._]/g, '')
    .slice(0, MAX_USERNAME)
}

export default function InstagramField({ value = '', onChange, disabled = false, placeholder = 'usuario', className, inputClassName, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-mute">@</span>
      <Input
        {...props}
        maxLength={MAX_USERNAME}
        disabled={disabled}
        value={normalizarInstagram(value)}
        onChange={(event) => onChange?.(normalizarInstagram(event.target.value))}
        placeholder={placeholder}
        className={cn('pl-8', inputClassName)}
      />
    </div>
  )
}
