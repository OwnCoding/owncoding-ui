import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'
import {
  filtrarPersonas,
  leerUsoPersonas,
  ordenarPersonas,
  registrarUsoPersona,
} from '../utils/personas.js'

// Selector de personas del equipo (#101): **input que filtra al escribir** y
// **lista visible debajo** (o flotante en toolbars con `desplegable`). No es un
// dropdown nativo: buscás por nombre o rol/especialidad, la lista va ordenada
// por **uso por usuario** (más usadas/recientes primero, fallback alfabético;
// inactivas al final), muestra **foto** y se navega con ↑↓ / Enter / Esc.
// Mobile-first y AA en claro/oscuro (tokens del sistema).
//
// #169: el valor seleccionado también se ve **con avatar** (foto o iniciales)
// en el trigger cerrado; al enfocar/editar se oculta para dejar lugar a la
// búsqueda. Se puede desactivar con `avatarSeleccionado={false}`.
//
//   <BuscadorPersonas
//     personas={profesionales.map((p) => ({ id: p.id, nombre: p.nombre, rol: p.especialidad, fotoUrl: p.fotoUrl, activo: p.activo }))}
//     valor={staffId}
//     onCambiar={(persona) => setStaffId(persona?.id ?? '')}
//     claveUso={`agenda:profesional:${usuarioId}`}
//     ariaLabel="Profesional"
//   />
//
// Los ids y las fotos los resuelve la app; acá solo se presentan y ordenan.

export default function BuscadorPersonas({
  personas = [],
  valor = '',
  onCambiar,
  placeholder = 'Buscar persona…',
  ariaLabel = 'Persona',
  vacio = 'Sin personas que coincidan.',
  etiquetaLista,
  /** Ámbito del uso por usuario (localStorage); vacío = orden base. */
  claveUso = '',
  /** Lista flotante (toolbars) en vez de empujar el contenido. */
  desplegable = false,
  /** Opciones fijas siempre visibles (p. ej. «Todos» o «Sin responsable»). */
  opcionesFijas = [],
  /** Texto de la opción «sin asignar»; al elegirla se llama `onCambiar(null)`. */
  opcionVacia,
  /** 0 = sin límite. */
  maxResultados = 0,
  disabled = false,
  /** #169: avatar (foto/iniciales) del seleccionado en el trigger cerrado. */
  avatarSeleccionado = true,
  required = false,
  id,
  className,
}) {
  const [query, setQuery] = useState('')
  const [resaltado, setResaltado] = useState(0)
  const [uso, setUso] = useState(() => leerUsoPersonas(claveUso))
  const listaId = useId()
  const lista = useRef(null)
  const raiz = useRef(null)
  const [abierto, setAbierto] = useState(false)
  // #108: fuera de la edición, el input muestra el valor elegido (persona u
  // opción fija) en vez de quedar vacío con el placeholder.
  const [editando, setEditando] = useState(false)

  const opciones = useMemo(() => {
    const fijas = (Array.isArray(opcionesFijas) ? opcionesFijas : []).map((opcion) => ({ ...opcion, fija: true }))
    const vacia = opcionVacia ? [{ id: '__vacia__', vacia: true, nombre: opcionVacia, icono: 'user' }] : []
    const filtradas = ordenarPersonas(filtrarPersonas(personas, query), uso)
    const limite = Number(maxResultados) > 0 ? filtradas.slice(0, Number(maxResultados)) : filtradas
    return [...fijas, ...vacia, ...limite]
  }, [personas, opcionesFijas, opcionVacia, query, uso, maxResultados])

  // En toolbars (`desplegable`) la lista es un menú: se abre al enfocar o
  // escribir y se cierra al elegir, con clic afuera o Esc (#104). En formularios
  // la lista vive debajo del input y queda siempre visible (#101).
  const listaVisible = (!desplegable || abierto) && (opciones.length > 0 || Boolean(query))

  useEffect(() => {
    if (!desplegable || !abierto) return
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      setAbierto(false)
      setEditando(false)
    }
    const cerrarEscape = (event) => {
      if (event.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', cerrarFuera)
    document.addEventListener('keydown', cerrarEscape)
    return () => {
      document.removeEventListener('mousedown', cerrarFuera)
      document.removeEventListener('keydown', cerrarEscape)
    }
  }, [desplegable, abierto])

  /** Etiqueta visible del valor elegido (persona, opción fija o «sin asignar»). */
  const etiquetaSeleccion = useMemo(() => {
    const fijas = Array.isArray(opcionesFijas) ? opcionesFijas : []
    const fija = fijas.find((opcion) =>
      opcion.valor !== undefined ? opcion.valor === valor : opcion.id === valor,
    )
    if (fija) return fija.nombre ?? fija.label ?? ''
    if (opcionVacia && (valor === '' || valor == null)) return opcionVacia
    const persona = (Array.isArray(personas) ? personas : []).find((p) => p.id === valor)
    return persona?.nombre ?? ''
  }, [opcionesFijas, opcionVacia, personas, valor])

  // #169: persona seleccionada (no opción fija/vacía) para el avatar del trigger.
  const personaSeleccionada = useMemo(() => {
    if (valor === '' || valor == null) return null
    const fijas = Array.isArray(opcionesFijas) ? opcionesFijas : []
    if (fijas.some((opcion) => (opcion.valor !== undefined ? opcion.valor === valor : opcion.id === valor))) {
      return null
    }
    return (Array.isArray(personas) ? personas : []).find((persona) => persona.id === valor) ?? null
  }, [opcionesFijas, personas, valor])

  const mostrarAvatar = Boolean(avatarSeleccionado && !editando && personaSeleccionada)

  function elegir(opcion) {
    if (!opcion) return
    setAbierto(false)
    setQuery('')
    setEditando(false)
    if (opcion.fija) {
      onCambiar?.(opcion.valor !== undefined ? opcion.valor : opcion)
      return
    }
    if (opcion.vacia) {
      onCambiar?.(null)
      return
    }
    registrarUsoPersona(claveUso, opcion.id)
    setUso(leerUsoPersonas(claveUso))
    onCambiar?.(opcion)
  }

  function alTeclear(event) {
    if (event.key === 'Escape') {
      // #108: `type=search` limpia el valor solo en Chrome (dispara onChange y
      // dejaba el campo vacío); se previene el default y se repone el valor.
      event.preventDefault()
      setQuery('')
      setEditando(false)
      setAbierto(false)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!opciones.length) return
      if (desplegable && !abierto) {
        setResaltado(0)
        setAbierto(true)
        return
      }
      const paso = event.key === 'ArrowDown' ? 1 : -1
      const siguiente = (resaltado + paso + opciones.length) % opciones.length
      setResaltado(siguiente)
      lista.current
        ?.querySelector(`#${CSS.escape(`${listaId}-${siguiente}`)}`)
        ?.scrollIntoView?.({ block: 'nearest' })
      return
    }
    if (event.key === 'Enter' && opciones[resaltado]) {
      event.preventDefault()
      elegir(opciones[resaltado])
    }
  }

  function esElegida(opcion) {
    if (opcion.fija) return opcion.valor === valor
    if (opcion.vacia) return valor === '' || valor == null
    return opcion.id === valor
  }

  // #108: limpiar explícito solo donde el campo admite vacío (`opcionVacia`).
  const limpiarVisible = Boolean(opcionVacia) && valor !== '' && valor != null && !disabled

  return (
    <div ref={raiz} className={cn('relative', className)}>
      {mostrarAvatar ? (
        <span
          data-testid="buscador-persona-seleccionada"
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2"
        >
          <Avatar
            nombre={personaSeleccionada.nombre ?? ''}
            src={personaSeleccionada.fotoUrl}
            tamano="sm"
            decorativo
          />
        </span>
      ) : null}
      <Input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={listaVisible}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-activedescendant={listaVisible && opciones[resaltado] ? `${listaId}-${resaltado}` : undefined}
        aria-label={ariaLabel}
        aria-required={required || undefined}
        autoComplete="off"
        enterKeyHint="done"
        disabled={disabled}
        value={editando ? query : etiquetaSeleccion}
        placeholder={placeholder}
        onFocus={(evento) => {
          setEditando(true)
          // Selección completa: escribir reemplaza el valor mostrado.
          evento.target.select?.()
          if (!desplegable) return
          setAbierto(true)
          setResaltado(0)
        }}
        // #108: con el foco ya en el input, el clic vuelve a abrir la lista.
        onClick={() => {
          if (!desplegable) return
          setAbierto(true)
        }}
        onChange={(event) => {
          setQuery(event.target.value)
          setEditando(true)
          setResaltado(0)
          if (desplegable) setAbierto(true)
        }}
        onBlur={(evento) => {
          setEditando(false)
          // Un solo desplegable a la vez: al salir del campo (Tab/clic fuera),
          // se cierra la lista.
          if (desplegable && !raiz.current?.contains(evento.relatedTarget)) setAbierto(false)
        }}
        onKeyDown={alTeclear}
        className={cn(mostrarAvatar && 'pl-10', limpiarVisible && 'pr-9')}
      />
      {limpiarVisible ? (
        <button
          type="button"
          aria-label={etiquetaLista ? `Limpiar ${etiquetaLista}` : 'Limpiar selección'}
          title="Limpiar"
          onMouseDown={(evento) => evento.preventDefault()}
          onClick={() => {
            onCambiar?.(null)
            setQuery('')
            setEditando(false)
            setAbierto(false)
          }}
          className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-mute transition hover:bg-ink-700 hover:text-fore"
        >
          <Icon name="close" className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
      {listaVisible ? (
        <ul
          id={listaId}
          ref={lista}
          role="listbox"
          aria-label={etiquetaLista ?? ariaLabel}
          className={cn(
            'mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float',
            desplegable ? 'absolute left-0 right-0 top-full z-30' : 'w-full',
          )}
        >
          {opciones.map((opcion, indice) => {
            const elegida = esElegida(opcion)
            const inactiva = !opcion.fija && !opcion.vacia && opcion.activo === false
            return (
              <li
                key={opcion.fija || opcion.vacia ? `fija-${opcion.id ?? opcion.valor ?? opcion.nombre}` : opcion.id}
                id={`${listaId}-${indice}`}
                role="option"
                aria-selected={elegida}
                // #108: evita que el mousedown saque el foco del input (y que el
                // cierre por focusout desmonte la lista antes del click).
                onMouseDown={(evento) => evento.preventDefault()}
                onMouseEnter={() => setResaltado(indice)}
                onClick={() => elegir(opcion)}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition',
                  indice === resaltado ? 'bg-fono/10 text-fore' : 'text-mute hover:bg-ink-700/60 hover:text-fore',
                )}
              >
                {opcion.fija ? (
                  <Icon name={opcion.icono ?? 'user'} className="h-4 w-4 shrink-0 text-mute" aria-hidden />
                ) : (
                  <Avatar nombre={opcion.nombre ?? ''} src={opcion.fotoUrl} tamano="sm" decorativo />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-fore">{opcion.nombre}</span>
                  {opcion.rol || opcion.detalle ? (
                    <span className="block truncate text-xs text-mute">{opcion.rol ?? opcion.detalle}</span>
                  ) : null}
                </span>
                {inactiva ? (
                  <span className="shrink-0 rounded border border-ink-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mute">
                    Inactiva
                  </span>
                ) : null}
                {elegida ? <Icon name="check" className="h-4 w-4 shrink-0 text-ok-text" aria-hidden /> : null}
              </li>
            )
          })}
          {!opciones.length && query ? <li className="px-2.5 py-2 text-sm text-mute">{vacio}</li> : null}
        </ul>
      ) : null}
    </div>
  )
}
