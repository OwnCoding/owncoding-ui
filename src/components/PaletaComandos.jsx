import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { Aviso, Button, EmptyState, Skeleton } from './ui.jsx'
import SearchField from './SearchField.jsx'
import { cn } from '../utils/cn.js'
import useDialogFocusTrap from '../hooks/useDialogFocusTrap.js'

// Buscador global del panel (⌘/Ctrl + K): buscador con foco automático y
// resultados agrupados por tipo, navegables con ↑↓/Enter y cerrables con Escape.
//
// Portable: la búsqueda la provee el consumidor (`buscar` async) y el resultado
// elegido se devuelve por `onElegir`; la librería no consulta nada, no navega y
// no conoce el router. El debounce y la cancelación de la consulta vieja viven
// acá: el consumidor solo resuelve la lista de resultados.
//
// Modelo de resultado: `{ id, tipo, titulo, detalle?, icono?, datos? }`.
// `tipo` agrupa (clientes, eventos, …) y las etiquetas se ajustan con
// `etiquetasTipo`/`iconosTipo`. El estado de la paleta (seguir escribiendo,
// cargando, sin resultados, error, listo) sale de `estadoPaleta`.

const CAPITALIZAR = (texto) => (texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto)

/** Agrupa resultados por `tipo`, en el orden en que aparecen. */
export function agruparResultados(resultados = [], { etiquetasTipo = {}, iconosTipo = {} } = {}) {
  const grupos = []
  const porTipo = new Map()
  for (const resultado of resultados) {
    const tipo = resultado?.tipo || 'otros'
    let grupo = porTipo.get(tipo)
    if (!grupo) {
      grupo = {
        tipo,
        etiqueta: etiquetasTipo[tipo] || CAPITALIZAR(tipo),
        icono: iconosTipo[tipo] || 'search',
        items: [],
      }
      porTipo.set(tipo, grupo)
      grupos.push(grupo)
    }
    grupo.items.push(resultado)
  }
  return grupos
}

/**
 * Estado de la paleta según la consulta y el resultado: `seguir` (todavía no
 * alcanza el mínimo), `error`, `listo` (hay resultados), `cargando` (primera
 * búsqueda) o `vacio`.
 */
export function estadoPaleta({ listo = false, cargando = false, error = '', total = 0 } = {}) {
  if (!listo) return 'seguir'
  if (error) return 'error'
  if (total > 0) return 'listo'
  if (cargando) return 'cargando'
  return 'vacio'
}

export default function PaletaComandos({
  abierta,
  onAbrir,
  onCerrar,
  buscar,
  onElegir,
  etiquetasTipo,
  iconosTipo,
  titulo = 'Buscar',
  placeholder = 'Buscar…',
  ariaLabel,
  atajo = 'k',
  atajoTexto = '⌘K',
  conAtajo = true,
  minimo = 2,
  espera = 220,
  mensajeError = 'No pudimos buscar. Reintentá.',
  textoSeguir,
  textoSinResultados = 'Sin resultados',
  descripcionVacio,
  boton = false,
  textoBoton = 'Buscar',
  mostrarAtajoEnBoton = true,
  className,
}) {
  const [interna, setInterna] = useState(false)
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [activo, setActivo] = useState(0)
  const [intento, setIntento] = useState(0)

  const raiz = useRef(null)
  const entrada = useRef(null)
  const buscarRef = useRef(buscar)
  buscarRef.current = buscar
  const onAbrirRef = useRef(onAbrir)
  onAbrirRef.current = onAbrir
  const idLista = useId()

  const controlada = abierta !== undefined
  const visible = controlada ? Boolean(abierta) : interna

  function abrir() {
    if (!controlada) setInterna(true)
    onAbrir?.()
  }

  function cerrar() {
    if (!controlada) setInterna(false)
    onCerrar?.()
  }

  const { esSuperior, requestClose } = useDialogFocusTrap(visible, cerrar, raiz, {
    initialFocus: () => entrada.current,
  })

  // Atajo global (⌘/Ctrl + tecla): abre la paleta desde cualquier pantalla.
  useEffect(() => {
    if (!conAtajo) return undefined
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.altKey || event.shiftKey) return
      if (!(event.metaKey || event.ctrlKey)) return
      if (String(event.key).toLowerCase() !== String(atajo).toLowerCase()) return
      event.preventDefault()
      if (!controlada) setInterna(true)
      onAbrirRef.current?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [conAtajo, atajo, controlada])

  // Al abrir: consulta limpia y selección en el primero. El foco inicial,
  // la trampa, el bloqueo de scroll y el retorno viven en el hook compartido.
  useEffect(() => {
    if (!visible) return undefined
    setConsulta('')
    setResultados(null)
    setError('')
    setCargando(false)
    setActivo(0)
    setIntento(0)
    return undefined
  }, [visible])

  // Búsqueda con espera y cancelación: la consulta vieja no pisa a la nueva.
  useEffect(() => {
    if (!visible) return undefined
    const termino = consulta.trim()
    if (termino.length < minimo) {
      setResultados(null)
      setCargando(false)
      setError('')
      return undefined
    }
    let vigente = true
    setCargando(true)
    setError('')
    const timer = setTimeout(async () => {
      try {
        const siguiente = await buscarRef.current?.(termino)
        if (!vigente) return
        setResultados(Array.isArray(siguiente) ? siguiente : [])
        setCargando(false)
      } catch {
        if (!vigente) return
        setError(mensajeError)
        setCargando(false)
      }
    }, Math.max(0, Number(espera) || 0))
    return () => {
      vigente = false
      clearTimeout(timer)
    }
  }, [visible, consulta, intento, minimo, espera, mensajeError])

  const termino = consulta.trim()
  const listo = termino.length >= minimo
  const grupos = useMemo(
    () => agruparResultados(resultados || [], { etiquetasTipo, iconosTipo }),
    [resultados, etiquetasTipo, iconosTipo],
  )
  const planos = useMemo(() => grupos.flatMap((grupo) => grupo.items), [grupos])
  const estado = estadoPaleta({ listo, cargando, error, total: planos.length })
  const indice = useMemo(() => new Map(planos.map((item, posicion) => [item, posicion])), [planos])

  // La selección vuelve al primer resultado con cada búsqueda nueva.
  useEffect(() => {
    setActivo(0)
  }, [resultados])

  // La opción activa se mantiene a la vista al mover con el teclado.
  useEffect(() => {
    if (!visible) return
    raiz.current?.querySelector(`[data-paleta-index="${activo}"]`)?.scrollIntoView?.({ block: 'nearest' })
  }, [activo, visible, planos.length])

  function mover(delta) {
    if (!planos.length) return
    setActivo((actual) => {
      const siguiente = actual + delta
      if (siguiente < 0) return planos.length - 1
      if (siguiente >= planos.length) return 0
      return siguiente
    })
  }

  function elegir(resultado) {
    if (!resultado) return
    cerrar()
    onElegir?.(resultado)
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      mover(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      mover(-1)
    } else if (event.key === 'Enter') {
      const elegido = planos[activo]
      if (elegido) {
        event.preventDefault()
        elegir(elegido)
      }
    }
  }

  const textoContinuar = textoSeguir || `Seguí escribiendo: buscamos desde ${minimo} caracteres.`
  // Patrón combobox: el foco queda en el campo y `aria-activedescendant` apunta
  // a la opción resaltada (los ids salen de la lista de resultados).
  const idOpcion = (posicion) => `${idLista}-opcion-${posicion}`

  return (
    <>
      {boton && (
        <button
          type="button"
          onClick={abrir}
          aria-label={`${titulo} · ${atajoTexto}`}
          aria-haspopup="dialog"
          title={`${titulo} · ${atajoTexto}`}
          className="toque-44 inline-flex min-h-11 items-center gap-2 rounded-lg border border-interactivo px-3 text-sm text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore"
        >
          <Icon name="search" className="h-4 w-4" />
          <span className="hidden sm:inline">{textoBoton}</span>
          {mostrarAtajoEnBoton && (
            <kbd className="rounded border border-ink-600 bg-ink-700 px-1.5 py-0.5 text-[10px] font-semibold text-mute" aria-hidden="true">
              {atajoTexto}
            </kbd>
          )}
        </button>
      )}

      {visible && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-3 sm:p-6"
          onMouseDown={(event) => event.target === event.currentTarget && requestClose()}
          onKeyDown={onKeyDown}
        >
          <div
            ref={raiz}
            role="dialog"
            aria-modal={esSuperior ? 'true' : undefined}
            aria-label={titulo}
            tabIndex={-1}
            className={cn('mt-[8vh] w-full max-w-xl overflow-hidden rounded-2xl border border-ink-600 bg-ink shadow-float', className)}
          >
            <div className="border-b border-ink-600 p-3">
              <SearchField
                ref={entrada}
                value={consulta}
                onChange={(event) => setConsulta(event.target.value)}
                placeholder={placeholder}
                ariaLabel={ariaLabel || placeholder}
                aria-controls={idLista}
                aria-expanded={estado === 'listo'}
                aria-activedescendant={estado === 'listo' ? idOpcion(activo) : undefined}
                role="combobox"
                aria-autocomplete="list"
                autoComplete="off"
              />
            </div>

            <div id={idLista} className="max-h-[50vh] min-h-[9rem] overflow-y-auto p-2">
              {estado === 'seguir' && <p role="status" className="px-2 py-6 text-center text-sm text-mute">{textoContinuar}</p>}

              {estado === 'error' && (
                <div className="space-y-2 p-2">
                  <Aviso tono="error" compact>{error}</Aviso>
                  <Button type="button" variant="outline" onClick={() => setIntento((actual) => actual + 1)}>
                    Reintentar
                  </Button>
                </div>
              )}

              {estado === 'cargando' && (
                <div className="space-y-2 p-2" role="status" aria-live="polite" aria-busy="true">
                  <span className="sr-only">Buscando…</span>
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              )}

              {estado === 'vacio' && (
                <div role="status">
                  <EmptyState
                    compact
                    icon="search"
                    title={textoSinResultados}
                    description={descripcionVacio || `No encontramos nada para «${termino}». Probá con otro nombre o número.`}
                  />
                </div>
              )}

              {estado === 'listo' && (
                <>
                  <span className="sr-only" role="status" aria-live="polite">{planos.length} resultado{planos.length === 1 ? '' : 's'}</span>
                  <div role="listbox" aria-label="Resultados de la búsqueda">
                    {grupos.map((grupo) => (
                    <section key={grupo.tipo} role="group" aria-label={grupo.etiqueta}>
                      <p className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-mute">{grupo.etiqueta}</p>
                      {grupo.items.map((item) => {
                        const posicion = indice.get(item) ?? 0
                        const esActivo = posicion === activo
                        return (
                          <button
                            key={item.id ?? `${grupo.tipo}-${posicion}`}
                            id={idOpcion(posicion)}
                            type="button"
                            role="option"
                            aria-selected={esActivo}
                            data-paleta-index={posicion}
                            data-activo={esActivo ? 'true' : undefined}
                            onMouseEnter={() => setActivo(posicion)}
                            onClick={() => elegir(item)}
                            className={cn(
                              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition',
                              esActivo ? 'bg-fono/10 text-fore' : 'text-mute hover:bg-ink-700/60 hover:text-fore',
                            )}
                          >
                            <Icon name={item.icono || grupo.icono} className="h-4 w-4 shrink-0" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-fore">{item.titulo}</span>
                              {item.detalle && <span className="block truncate text-xs text-mute">{item.detalle}</span>}
                            </span>
                            <Icon name="back" className="h-3.5 w-3.5 shrink-0 rotate-180 text-mute" />
                          </button>
                        )
                      })}
                    </section>
                    ))}
                  </div>
                </>
              )}
            </div>

            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-600 px-3 py-2 text-[11px] text-mute">
              <span>
                <kbd className="rounded border border-ink-600 bg-ink-700 px-1">↑</kbd>{' '}
                <kbd className="rounded border border-ink-600 bg-ink-700 px-1">↓</kbd> moverse
              </span>
              <span>
                <kbd className="rounded border border-ink-600 bg-ink-700 px-1">Enter</kbd> abrir
              </span>
              <span>
                <kbd className="rounded border border-ink-600 bg-ink-700 px-1">Esc</kbd> cerrar
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
