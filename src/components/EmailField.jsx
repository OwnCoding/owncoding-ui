import { useRef, useState } from 'react'
import { Input } from './ui.jsx'
import { cn } from '../utils/cn.js'
import useComboboxNavigation from '../hooks/useComboboxNavigation.js'

// Correo con sugerencias: mientras se escribe con teclado sugiere dominios
// frecuentes y completa el valor al elegir uno. No interfiere con pegado,
// autocompletado del navegador ni con el submit del formulario. Portable: los
// dominios se pueden pasar por prop (`dominios`).

export const DOMINIOS_EMAIL = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'hotmail.es',
  'outlook.es',
]

const MAX_SUGERENCIAS = 4

export function sugerenciasDe(value, dominios = DOMINIOS_EMAIL, max = MAX_SUGERENCIAS) {
  const texto = String(value || '').trim()
  const arroba = texto.indexOf('@')
  const usuario = arroba === -1 ? texto : texto.slice(0, arroba)
  const dominio = arroba === -1 ? '' : texto.slice(arroba + 1).toLowerCase()
  if (!usuario) return []
  if (dominio.includes(' ')) return []
  const coincidencias = dominio
    ? dominios.filter((candidato) => candidato.startsWith(dominio) && candidato !== dominio)
    : dominios
  return coincidencias.slice(0, max).map((d) => `${usuario}@${d}`)
}

export default function EmailField({
  value = '',
  onChange,
  disabled = false,
  placeholder = 'vos@tutienda.com',
  dominios = DOMINIOS_EMAIL,
  sugerir = true,
  className,
  inputClassName,
  onKeyDown,
  onBlur,
  ...props
}) {
  const [open, setOpen] = useState(false)
  const tecleando = useRef(false)
  const tipeoReciente = useRef(false)
  const inputRef = useRef(null)
  const sugerencias = sugerenciasDe(value, dominios)

  function elegir(sugerencia) {
    onChange?.(sugerencia)
    tecleando.current = false
    setOpen(false)
    inputRef.current?.focus()
  }

  const listaVisible = sugerir && open && tecleando.current && sugerencias.length > 0
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: setOpen,
    onSelect: elegir,
    getOptionKey: (sugerencia) => sugerencia,
  })

  function asignarInput(node) {
    inputRef.current = node
    navegacion.inputRef.current = node
  }

  // Las sugerencias solo aparecen cuando el valor llegó por teclado: pegado o
  // autocompletado del navegador no activa el flag y el desplegable no estorba.
  function manejarKeyDown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') tecleando.current = true
    navegacion.inputProps.onKeyDown(event)
    if (event.key === 'Escape') {
      tecleando.current = false
      return
    }
    if (['Enter', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'Tab'].includes(event.key)) return
    tecleando.current = true
    tipeoReciente.current = true
  }

  function manejarChange(event) {
    onChange?.(event.target.value)
    if (tipeoReciente.current) {
      tipeoReciente.current = false
      setOpen(sugerir && sugerenciasDe(event.target.value, dominios).length > 0)
    }
  }

  function perderFoco(event) {
    onBlur?.(event)
    tecleando.current = false
    setOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        {...props}
        ref={asignarInput}
        type="email"
        className={cn('w-full', inputClassName)}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={manejarChange}
        onKeyDown={manejarKeyDown}
        onBlur={perderFoco}
        role="combobox"
        aria-expanded={listaVisible}
        aria-controls={navegacion.listboxId}
        aria-autocomplete="list"
        aria-activedescendant={navegacion.activeOptionId}
      />
      {listaVisible && (
        <ul
          {...navegacion.listboxProps}
          aria-label="Sugerencias de correo"
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-ink-500 bg-ink shadow-float"
        >
          {sugerencias.map((sugerencia, indice) => (
            <li
              key={sugerencia}
              {...navegacion.getOptionProps(indice)}
              className={cn(
                'min-h-11 cursor-pointer px-3 py-2 text-left text-sm text-fore transition',
                indice === navegacion.activeIndex ? 'bg-ink-700' : 'hover:bg-ink-700',
              )}
            >
              {sugerencia}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
