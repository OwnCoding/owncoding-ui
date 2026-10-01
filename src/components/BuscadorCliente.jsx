import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import Icon from './Icon.jsx'
import { detalleCliente, filtrarClientes } from '../utils/cliente.js'
import { cn } from '../utils/cn.js'

// Buscador de cliente (#268): input search por nombre, teléfono, CI/RUC,
// correo, facturación o tags, con **alta rápida** y marca de **«posible
// duplicado»**. Portable: los clientes entran por props y la pantalla decide si
// filtra en memoria o consulta al servidor (`onQueryChange`); elegir y crear se
// avisan por callback.
//
//   <BuscadorCliente
//     clientes={clientes}
//     selectedId={clienteId}
//     onSelect={(cliente) => setClienteId(cliente?.id || '')}
//     detectarDuplicado={(cliente) => motivosDuplicadoCliente(cliente, form)}
//   />
const MAX_RESULTADOS = 8

export default function BuscadorCliente({
  clientes = [],
  selectedId = '',
  onSelect,
  onCreate,
  onQueryChange,
  detectarDuplicado,
  placeholder = 'Buscar cliente…',
  textoCrear = 'Crear cliente',
  textoCreando = 'Creando…',
  textoDuplicado = 'Posible duplicado',
  vacio = 'Sin clientes que coincidan.',
  disabled = false,
  required = false,
  id,
  ariaLabel = 'Cliente',
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

  useEffect(() => {
    if (!selectedId) return
    const elegido = (Array.isArray(clientes) ? clientes : []).find((cliente) => cliente.id === selectedId)
    if (elegido) setQuery(elegido.name || elegido.nombre || '')
  }, [selectedId, clientes])

  const termino = query.trim()
  const coincidencias = useMemo(() => filtrarClientes(clientes, termino, { limite: MAX_RESULTADOS }), [clientes, termino])
  const exacto = useMemo(
    () => (Array.isArray(clientes) ? clientes : []).some((cliente) => (
      String(cliente?.name || cliente?.nombre || '').trim().toLowerCase() === termino.toLowerCase()
    )),
    [clientes, termino],
  )
  const puedeCrear = Boolean(termino.length >= 2 && onCreate && !exacto)
  const opciones = puedeCrear ? [...coincidencias, { crear: termino }] : coincidencias
  const listaVisible = abierto && !disabled && (opciones.length > 0 || Boolean(termino))

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
    if (opcion.crear) return crearCliente()
    setQuery(opcion.name || opcion.nombre || '')
    cerrar()
    onSelect?.(opcion)
  }

  async function crearCliente() {
    if (creando || !puedeCrear) return
    setCreando(true)
    try {
      const creado = await onCreate?.(termino)
      if (creado?.id) {
        setQuery(creado.name || creado.nombre || termino)
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
          aria-label="Clientes"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float"
        >
          {opciones.map((opcion, indice) => {
            const creandoOpcion = Boolean(opcion.crear)
            const motivos = creandoOpcion ? [] : (typeof detectarDuplicado === 'function' ? detectarDuplicado(opcion) : null)
            const listaMotivos = Array.isArray(motivos) ? motivos : (motivos ? ['datos coincidentes'] : [])
            return (
              <li
                key={creandoOpcion ? `crear-${opcion.crear}` : opcion.id}
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
                {creandoOpcion ? (
                  <>
                    <Icon name="plus" className="h-4 w-4 shrink-0 text-fono-light" />
                    <span className="min-w-0 flex-1 truncate">{creando ? textoCreando : `${textoCrear} «${opcion.crear}»`}</span>
                  </>
                ) : (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="block min-w-0 truncate font-medium text-fore">{opcion.name || opcion.nombre || 'Sin nombre'}</span>
                        {listaMotivos.length > 0 ? (
                          <span
                            className="inline-flex shrink-0 items-center gap-1 rounded border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-[10px] font-bold text-warn-text"
                            title={`Coincide en ${listaMotivos.join(', ')}`}
                          >
                            <Icon name="alert" className="h-3 w-3" />
                            {textoDuplicado}
                          </span>
                        ) : null}
                      </span>
                      {detalleCliente(opcion) ? <span className="block truncate text-xs text-mute">{detalleCliente(opcion)}</span> : null}
                    </span>
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
