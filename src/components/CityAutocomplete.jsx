import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import { buscarCiudad, departamentoDe, resolveLocality } from '../catalog/ciudades.js'
import { cn } from '../utils/cn.js'
import useComboboxNavigation from '../hooks/useComboboxNavigation.js'

// Preserve synchronous client invalidation without invoking layout effects in SSR.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// Ciudad con autocompletado y departamento automático: el departamento es
// dependiente de la ciudad, así que se resuelve solo (al tipear una coincidencia
// exacta y al elegir una sugerencia). El texto libre sigue permitido.
//
// Por defecto usa el catálogo bilingüe de Paraguay de la librería (sin API),
// que trae `ciudad`/`departamento` y `city`/`department`. Si la app tiene su
// propio buscador pasa `buscar(texto) => Promise<[{city, department}]>` (o las
// claves en español; se aceptan las dos) y el resto se comporta igual.

// Las filas del catálogo (y de un `buscar` propio) pueden venir con las claves
// en inglés o en español; se leen las dos.
function ciudadDe(fila) {
  return fila?.city ?? fila?.ciudad ?? ''
}

function departamentoDeFila(fila) {
  return fila?.department ?? fila?.departamento ?? ''
}

export default function CityAutocomplete({
  value = '',
  onSelect,
  onIdentitySelect,
  onChange,
  placeholder = 'Ej: Asunción, Ciudad del Este…',
  disabled = false,
  className,
  buscar,
  limite = 8,
  maxLength = 100,
  inputProps,
  mensajeError = 'No se pudieron cargar las sugerencias.',
}) {
  const [sugerencias, setSugerencias] = useState([])
  const [abierto, setAbierto] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef(null)
  const raiz = useRef(null)
  const errorId = useId()
  const requestGeneration = useRef(0)
  const mounted = useRef(true)
  const activeQuery = useRef(String(value || '').trim())
  const previousProvider = useRef(buscar)
  const previousLimit = useRef(limite)
  const previousDisabled = useRef(disabled)
  const currentScope = useRef(null)
  currentScope.current = { query: String(value || '').trim(), provider: buscar, limite, disabled }

  function invalidateSearch() {
    requestGeneration.current += 1
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
  }

  useIsomorphicLayoutEffect(() => {
    const query = String(value || '').trim()
    if (query !== activeQuery.current || buscar !== previousProvider.current ||
      limite !== previousLimit.current || disabled !== previousDisabled.current) {
      invalidateSearch()
      activeQuery.current = query
      setSugerencias([])
      setAbierto(false)
      setError('')
    }
    previousProvider.current = buscar
    previousLimit.current = limite
    previousDisabled.current = disabled
  }, [value, buscar, limite, disabled])

  useEffect(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      invalidateSearch()
      setAbierto(false)
    }
    document.addEventListener('mousedown', cerrarFuera)
    return () => document.removeEventListener('mousedown', cerrarFuera)
  }, [])

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; invalidateSearch() }
  }, [])

  function resolver(texto) {
    // Cancellation precedes all early returns, including a cleared/short query.
    invalidateSearch()
    const q = String(texto || '').trim()
    activeQuery.current = q
    setSugerencias([])
    setAbierto(false)
    setError('')
    if (q.length < 2 || disabled) return
    if (!buscar) {
      setSugerencias(buscarCiudad(q, limite))
      setAbierto(true)
      return
    }
    const generation = requestGeneration.current
    const provider = buscar
    const limit = limite
    const isCurrent = () => {
      const scope = currentScope.current
      return mounted.current && generation === requestGeneration.current &&
        scope.query === q && scope.provider === provider && scope.limite === limit && !scope.disabled
    }
    timer.current = setTimeout(async () => {
      timer.current = null
      if (!isCurrent()) return
      try {
        const filas = await provider(q)
        if (!isCurrent()) return
        setSugerencias(Array.isArray(filas) ? filas.slice(0, limit) : [])
        setAbierto(true)
        setError('')
      } catch {
        if (!isCurrent()) return
        setSugerencias([])
        setAbierto(false)
        setError(mensajeError)
      }
    }, 250)
  }

  function change(texto) {
    // Al escribir se resuelve el departamento si la ciudad coincide exacta;
    // si no, queda vacío hasta que el usuario elija una sugerencia.
    onChange?.(texto)
    onSelect?.(texto, departamentoDe(texto))
    onIdentitySelect?.(resolveLocality(texto))
    resolver(texto)
  }

  function elegir(fila) {
    invalidateSearch()
    const ciudad = ciudadDe(fila)
    const departamento = departamentoDeFila(fila) || departamentoDe(ciudad)
    activeQuery.current = String(ciudad || '').trim()
    onChange?.(ciudad)
    onSelect?.(ciudad, departamento)
    onIdentitySelect?.(resolveLocality(ciudad, departamento))
    setSugerencias([])
    setAbierto(false)
  }

  const listaVisible = abierto && sugerencias.length > 0
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: (open) => { if (!open) invalidateSearch(); setAbierto(open) },
    onSelect: elegir,
    getOptionKey: (fila) => `${ciudadDe(fila)}-${departamentoDeFila(fila)}`,
  })

  function alPerderFoco() {
    // Al salir del campo, si tipearon una ciudad del catálogo, el departamento
    // se completa igual (dependiente de la ciudad).
    const departamento = departamentoDe(value)
    if (departamento) {
      onSelect?.(value, departamento)
      onIdentitySelect?.(resolveLocality(value, departamento))
    }
  }

  return (
    <div ref={raiz} className={cn('relative', className)}>
      <Input
        {...inputProps}
        ref={navegacion.inputRef}
        maxLength={maxLength}
        disabled={disabled}
        value={value}
        onChange={(event) => { inputProps?.onChange?.(event); change(event.target.value); navegacion.setActiveIndex(0) }}
        onFocus={(event) => { inputProps?.onFocus?.(event); if (value.trim().length >= 2 && sugerencias.length) setAbierto(true) }}
        onBlur={(event) => { inputProps?.onBlur?.(event); alPerderFoco() }}
        onKeyDown={(event) => { inputProps?.onKeyDown?.(event); if (!event.defaultPrevented) navegacion.inputProps.onKeyDown(event) }}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Ciudad"
        role="combobox"
        aria-expanded={listaVisible}
        aria-controls={navegacion.listboxId}
        aria-autocomplete="list"
        aria-activedescendant={navegacion.activeOptionId}
        aria-describedby={[inputProps?.['aria-describedby'], error ? errorId : null].filter(Boolean).join(' ') || undefined}
        aria-invalid={inputProps?.['aria-invalid'] ?? (error ? true : undefined)}
      />
      {listaVisible && (
        <ul {...navegacion.listboxProps} aria-label="Ciudades" className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-ink-500 bg-ink shadow-float">
          {sugerencias.map((fila, indice) => (
            <li
              key={`${ciudadDe(fila)}-${departamentoDeFila(fila)}`}
              {...navegacion.getOptionProps(indice)}
              className={cn(
                'flex min-h-11 cursor-pointer items-baseline justify-between gap-3 px-3 py-2 text-left text-sm transition',
                indice === navegacion.activeIndex ? 'bg-ink-700' : 'hover:bg-ink-700',
              )}
            >
              <span className="truncate font-medium text-fore">{ciudadDe(fila)}</span>
              <span className="shrink-0 text-xs text-mute">{departamentoDeFila(fila)}</span>
            </li>
          ))}
        </ul>
      )}
      {error ? <p id={errorId} role="alert" className="mt-1 text-xs text-bad-text">{error}</p> : null}
    </div>
  )
}
