import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

// Buscador de proveedor (#259): input search con **últimos usados por defecto**,
// filtro por **nombre o abreviatura** (`code`) y **alta rápida** desde el mismo
// campo. Portable: los proveedores entran por props y la pantalla decide si
// filtra en memoria o consulta al servidor (`onQueryChange`); elegir y crear se
// avisan por callback (`onSelect`, `onCreate` async → proveedor creado).
//
//   <BuscadorProveedor
//     proveedores={suppliers}                 // [{ id, name, code?, city?, phone? }]
//     selectedId={supplierId}
//     recientes={idsRecientes}                // últimos usados (ids o proveedores)
//     onSelect={(proveedor) => setSupplierId(proveedor?.id || '')}
//     onCreate={(nombre) => suppliersApi.create({ name: nombre })}
//   />
const MAX_RESULTADOS = 8

/** Normaliza para comparar: minúsculas y sin acentos. */
export function normalizarProveedor(valor) {
  return String(valor ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function nombreProveedor(proveedor) {
  return proveedor?.name || proveedor?.nombre || ''
}

// Ciudad y teléfono como dato secundario (la abreviatura va en su chip).
export function detalleProveedor(proveedor) {
  return [proveedor?.city, proveedor?.phone].filter(Boolean).join(' · ')
}

/** Filtra por nombre o abreviatura (`code`), sin acentos y con tope. */
export function filtrarProveedores(proveedores = [], termino = '', { limite = MAX_RESULTADOS } = {}) {
  const q = normalizarProveedor(termino)
  const lista = Array.isArray(proveedores) ? proveedores : []
  if (!q) return lista.slice(0, limite)
  return lista
    .filter((proveedor) => (
      normalizarProveedor(nombreProveedor(proveedor)).includes(q)
      || normalizarProveedor(proveedor?.code).includes(q)
    ))
    .slice(0, limite)
}

/** Resuelve los últimos usados (ids o proveedores) contra el catálogo actual. */
export function resolverRecientes(proveedores = [], recientes = [], { limite = MAX_RESULTADOS } = {}) {
  const catalogo = Array.isArray(proveedores) ? proveedores : []
  const porId = new Map(catalogo.map((proveedor) => [proveedor.id, proveedor]))
  const salida = []
  for (const referencia of Array.isArray(recientes) ? recientes : []) {
    const proveedor = typeof referencia === 'string' ? porId.get(referencia) : referencia
    if (proveedor?.id && !salida.some((item) => item.id === proveedor.id)) salida.push(proveedor)
    if (salida.length >= limite) break
  }
  return salida
}

export default function BuscadorProveedor({
  proveedores = [],
  selectedId = '',
  onSelect,
  onCreate,
  onQueryChange,
  recientes = [],
  placeholder = 'Buscar proveedor…',
  textoRecientes = 'Últimos usados',
  textoCrear = 'Crear proveedor',
  textoCreando = 'Creando…',
  vacio = 'Sin proveedores que coincidan.',
  disabled = false,
  required = false,
  id,
  ariaLabel = 'Proveedor',
  className,
  inputProps,
}) {
  const [query, setQuery] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [resaltado, setResaltado] = useState(0)
  const [creando, setCreando] = useState(false)
  const listaId = useId()
  const raiz = useRef(null)
  const lista = useRef(null)

  useEffect(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      setAbierto(false)
    }
    document.addEventListener('click', cerrarFuera)
    return () => document.removeEventListener('click', cerrarFuera)
  }, [])

  // El proveedor elegido se refleja en el campo (nombre visible).
  useEffect(() => {
    if (!selectedId) return
    const elegido = (Array.isArray(proveedores) ? proveedores : []).find((proveedor) => proveedor.id === selectedId)
    if (elegido) setQuery(nombreProveedor(elegido))
  }, [selectedId, proveedores])

  const termino = query.trim()
  const usados = useMemo(() => resolverRecientes(proveedores, recientes), [proveedores, recientes])
  const coincidencias = useMemo(() => filtrarProveedores(proveedores, termino), [proveedores, termino])
  // Sin texto: últimos usados (o el catálogo si no hay usados). Con texto: filtro.
  const enFoco = !termino && usados.length > 0 ? usados : coincidencias
  const encabezado = !termino && usados.length > 0 ? textoRecientes : null
  const exacto = useMemo(
    () => (Array.isArray(proveedores) ? proveedores : []).some((proveedor) => (
      normalizarProveedor(nombreProveedor(proveedor)) === normalizarProveedor(termino)
      || normalizarProveedor(proveedor?.code) === normalizarProveedor(termino)
    )),
    [proveedores, termino],
  )
  const puedeCrear = Boolean(termino.length >= 2 && onCreate && !exacto)
  const opciones = puedeCrear ? [...enFoco, { crear: termino }] : enFoco
  const listaVisible = abierto && !disabled && (opciones.length > 0 || Boolean(termino))

  // La opción resaltada con el teclado queda a la vista.
  useEffect(() => {
    if (!listaVisible) return
    lista.current?.querySelector(`#${CSS.escape(`${listaId}-${resaltado}`)}`)?.scrollIntoView({ block: 'nearest' })
  }, [listaVisible, resaltado, listaId])

  function cerrar() {
    setAbierto(false)
    setResaltado(0)
  }

  function elegir(opcion) {
    if (!opcion) return
    if (opcion.crear) return crearProveedor()
    setQuery(nombreProveedor(opcion))
    cerrar()
    onSelect?.(opcion)
  }

  async function crearProveedor() {
    if (creando || !puedeCrear) return
    setCreando(true)
    try {
      const creado = await onCreate?.(termino)
      if (creado?.id) {
        setQuery(nombreProveedor(creado))
        cerrar()
        onSelect?.(creado)
      } else {
        cerrar()
      }
    } finally {
      setCreando(false)
    }
  }

  function alTeclear(event) {
    if (event.key === 'Escape') { cerrar(); return }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!abierto) { setAbierto(true); return }
      if (!opciones.length) return
      const paso = event.key === 'ArrowDown' ? 1 : -1
      setResaltado((actual) => (actual + paso + opciones.length) % opciones.length)
      return
    }
    if (event.key === 'Enter' && abierto && opciones[resaltado]) {
      event.preventDefault()
      elegir(opciones[resaltado])
    }
  }

  return (
    <div ref={raiz} className={cn('relative', className)}>
      <Input
        id={id}
        role="combobox"
        aria-expanded={listaVisible}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-activedescendant={listaVisible ? `${listaId}-${resaltado}` : undefined}
        aria-label={ariaLabel}
        autoComplete="off"
        required={required}
        disabled={disabled}
        value={query}
        placeholder={placeholder}
        onChange={(event) => { setQuery(event.target.value); onQueryChange?.(event.target.value); setAbierto(true); setResaltado(0) }}
        onFocus={() => setAbierto(true)}
        onKeyDown={alTeclear}
        {...inputProps}
      />
      {listaVisible && (
        <ul
          id={listaId}
          ref={lista}
          role="listbox"
          aria-label="Proveedores"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float"
        >
          {encabezado ? (
            <li className="flex items-center gap-1.5 px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-mute" aria-hidden="true">
              <Icon name="clock" className="h-3 w-3" />
              {encabezado}
            </li>
          ) : null}
          {opciones.map((opcion, indice) => {
            const creado = Boolean(opcion.crear)
            return (
              <li
                key={creado ? `crear-${opcion.crear}` : opcion.id}
                id={`${listaId}-${indice}`}
                role="option"
                aria-selected={indice === resaltado}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setResaltado(indice)}
                onClick={() => elegir(opcion)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition',
                  indice === resaltado ? 'bg-fono/10 text-fore' : 'text-mute hover:bg-ink-700/60 hover:text-fore',
                )}
              >
                {creado ? (
                  <>
                    <Icon name="plus" className="h-4 w-4 shrink-0 text-fono-light" />
                    <span className="min-w-0 flex-1 truncate">
                      {creando ? textoCreando : `${textoCrear} «${opcion.crear}»`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-fore">{nombreProveedor(opcion)}</span>
                      {detalleProveedor(opcion) ? <span className="block truncate text-xs text-mute">{detalleProveedor(opcion)}</span> : null}
                    </span>
                    {opcion.code ? <span className="shrink-0 rounded border border-ink-500 bg-ink-700/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-fono-light">{opcion.code}</span> : null}
                  </>
                )}
              </li>
            )
          })}
          {!opciones.length && termino ? <li className="px-2.5 py-2 text-sm text-mute">{vacio}</li> : null}
        </ul>
      )}
    </div>
  )
}
