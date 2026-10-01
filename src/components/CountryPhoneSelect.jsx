import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import { buscarPaisesTelefono, paisTelefonoPorIso, resolverPaisesTelefono } from '../utils/paisesTelefono.js'

export default function CountryPhoneSelect({
  country = 'PY',
  onChange,
  countries,
  locale = 'es',
  disabled = false,
  ariaLabel = 'Código de país',
  searchPlaceholder = 'Buscar país o código',
  customCountry,
  id,
  className,
}) {
  const reactId = useId()
  const baseId = id || `pais-telefono-${reactId.replace(/:/g, '')}`
  const listId = `${baseId}-lista`
  const triggerRef = useRef(null)
  const searchRef = useRef(null)
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const catalog = useMemo(() => {
    const base = resolverPaisesTelefono(countries, locale)
    if (!customCountry?.countryCode) return base
    return [customCountry, ...base.filter((pais) => pais.country !== customCountry.country)]
  }, [countries, customCountry, locale])
  const selected = catalog.find((pais) => pais.country === country)
    || paisTelefonoPorIso(country, locale)
    || paisTelefonoPorIso('PY', locale)
  const options = useMemo(() => buscarPaisesTelefono(query, catalog, locale), [catalog, locale, query])
  const activeOption = options[activeIndex]

  const close = (restoreFocus = false) => {
    setOpen(false)
    setQuery('')
    if (restoreFocus) setTimeout(() => triggerRef.current?.focus(), 0)
  }

  const openPicker = () => {
    if (disabled) return
    setOpen(true)
    setQuery('')
    const selectedIndex = catalog.findIndex((pais) => pais.country === selected.country)
    setActiveIndex(Math.max(0, selectedIndex))
  }

  const choose = (pais) => {
    if (!pais) return
    onChange?.(pais.country)
    close(true)
  }

  useEffect(() => {
    if (!open) return undefined
    searchRef.current?.focus()
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(0, options.length - 1)))
  }, [options.length])

  const navigate = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
      return
    }
    if (event.key === 'Tab') {
      setTimeout(() => close(false), 0)
      return
    }
    if (!options.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + options.length) % options.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(activeOption)
    }
  }

  return (
    <div ref={rootRef} className={`relative w-24 shrink-0 ${className || ''}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => (open ? close(false) : openPicker())}
        onKeyDown={(event) => {
          if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
            event.preventDefault()
            openPicker()
          }
        }}
        className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-ink-500 bg-ink-800 px-2 text-sm text-fore outline-none transition hover:border-interactivo focus:border-fono focus:ring-1 focus:ring-fono/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span aria-hidden="true" className="text-base leading-none">{selected.flag}</span>
        <span className="tabular-nums">{selected.countryCode}</span>
        <span aria-hidden="true" className="text-[10px] text-mute">▾</span>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-ink-500 bg-ink-800 shadow-xl">
          <div className="p-2">
            <Input
              ref={searchRef}
              role="combobox"
              aria-label="Buscar país"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={activeOption ? `${baseId}-opcion-${activeOption.country}` : undefined}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={navigate}
              placeholder={searchPlaceholder}
              autoComplete="off"
            />
          </div>
          <ul id={listId} role="listbox" aria-label="Países" className="max-h-64 overflow-y-auto p-1">
            {options.map((pais, index) => (
              <li
                key={pais.country}
                id={`${baseId}-opcion-${pais.country}`}
                role="option"
                aria-selected={pais.country === selected.country}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(pais)}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${index === activeIndex ? 'bg-ink-700 text-fore' : 'text-mute hover:bg-ink-700 hover:text-fore'}`}
              >
                <span aria-hidden="true" className="text-lg leading-none">{pais.flag}</span>
                <span className="min-w-0 flex-1 truncate text-left">{pais.name}</span>
                <span className="text-xs font-medium uppercase text-mute">{pais.country}</span>
                <span className="tabular-nums text-fore">{pais.countryCode}</span>
              </li>
            ))}
          </ul>
          {!options.length ? <p role="status" aria-live="polite" className="px-3 py-4 text-center text-sm text-mute">No se encontraron países</p> : null}
        </div>
      ) : null}
    </div>
  )
}
