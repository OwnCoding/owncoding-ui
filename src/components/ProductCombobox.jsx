import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import IconoCategoria from './IconoCategoria.jsx'
import { cn } from '../utils/cn.js'
import useComboboxNavigation from '../hooks/useComboboxNavigation.js'

const MAX_SUGGESTIONS = 8

function productName(product) {
  return product?.nombre || product?.name || ''
}

// Buscador de producto con sugerencias en flujo y creación desde el campo.
// Portable: los productos entran por props (`products`) y la pantalla decide si
// filtra en memoria o consulta al servidor (`onQueryChange`); elegir y crear se
// avisan por callback (`onSelect`, `onCreate` async → producto creado).
export default function ProductCombobox({ products = [], selectedId = '', onSelect, onCreate, onQueryChange, placeholder = 'Buscar producto…', disabled = false, className }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const rootRef = useRef(null)

  // El listado va en flujo (no superpuesto), así que se cierra solo con un clic
  // afuera. En `click` y no en `mousedown`: con la lista en flujo, cerrarla en
  // el mousedown la colapsa entre el mousedown y el mouseup y el clic deja de
  // contar como clic del elemento destino (el navegador lo manda al ancestro
  // común). Así el clic en la sugerencia suma el producto y recién después se
  // cierra la lista.
  useEffect(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return
      close()
    }
    document.addEventListener('click', cerrarFuera)
    return () => document.removeEventListener('click', cerrarFuera)
  }, [])

  const setearQuery = useCallback((next) => {
    setQuery(next)
    onQueryChange?.(next)
  }, [onQueryChange])

  useEffect(() => {
    if (!selectedId) return
    const selected = products.find((product) => product.id === selectedId)
    if (selected) setearQuery(productName(selected))
  }, [selectedId, products, setearQuery])

  const term = query.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (!term) return []
    // Coincidencia por lo que la persona ve y escribe: nombre, SKU, modelo,
    // capacidad y color. El filtro server-side completo es de la app.
    const coincide = (product) => [productName(product), product.sku, product.model, product.capacity, product.color]
      .some((valor) => String(valor || '').toLowerCase().includes(term))
    return products.filter(coincide).slice(0, MAX_SUGGESTIONS)
  }, [products, term])
  const canCreate = Boolean(term && onCreate && suggestions.length === 0)
  const options = useMemo(
    () => canCreate ? [...suggestions, { id: '__create__', __create: true }] : suggestions,
    [canCreate, suggestions],
  )

  function close() {
    setOpen(false)
  }
  function choose(product) {
    setearQuery(productName(product))
    setOpen(false)
    onSelect?.(product)
  }
  async function createNew() {
    if (!onCreate || creating) return
    setCreating(true)
    try {
      const created = await onCreate(query.trim())
      if (created?.id) {
        setearQuery(productName(created))
        onSelect?.(created)
      }
      setOpen(false)
    } catch {
      setOpen(false)
    } finally {
      setCreating(false)
    }
  }

  const listaVisible = open && Boolean(term)
  const navegacion = useComboboxNavigation({
    options,
    open: listaVisible,
    onOpenChange: setOpen,
    onSelect: (option) => { if (option.__create) void createNew(); else choose(option) },
    getOptionKey: (option) => option.id,
  })

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <Input
        type="text"
        ref={navegacion.inputRef}
        role="combobox"
        aria-expanded={listaVisible}
        aria-controls={navegacion.listboxId}
        aria-autocomplete="list"
        aria-activedescendant={navegacion.activeOptionId}
        autoComplete="off"
        disabled={disabled}
        value={query}
        placeholder={placeholder}
        onChange={(event) => {
          setearQuery(event.target.value)
          setOpen(true)
          navegacion.setActiveIndex(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(close, 120)}
        onKeyDown={navegacion.inputProps.onKeyDown}
      />
      {listaVisible && (
        <ul {...navegacion.listboxProps} className="mt-1 max-h-48 w-full overflow-auto rounded-lg border border-ink-500 bg-ink py-1 shadow-float">
          {suggestions.map((product, index) => (
            <li
              key={product.id}
              {...navegacion.getOptionProps(index)}
              className={cn('flex min-h-11 cursor-pointer items-baseline justify-between gap-2 px-3 py-2 text-left text-sm transition', index === navegacion.activeIndex ? 'bg-ink-700' : '')}
            >
              <span className="flex min-w-0 items-center gap-2"><IconoCategoria categoria={product.category || productName(product)} className="h-4 w-4 text-mute" /><span className="truncate text-fore">{productName(product)}</span></span>
              {product.sku ? <span className="shrink-0 text-xs text-mute">{product.sku}</span> : null}
            </li>
          ))}
          {canCreate && (
            <li
              {...navegacion.getOptionProps(suggestions.length)}
              aria-disabled={creating || undefined}
              className={cn('flex min-h-11 cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-fono-light transition', creating && 'pointer-events-none opacity-50', navegacion.activeIndex >= suggestions.length ? 'bg-ink-700' : '')}
            >
              {creating ? 'Creando…' : `＋ Agregar «${query.trim()}» como producto nuevo`}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
