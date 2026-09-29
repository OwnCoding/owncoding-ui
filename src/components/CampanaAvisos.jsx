import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { EmptyState } from './ui.jsx'
import { cn } from '../utils/cn.js'
import { TONOS } from '../utils/estadoEquipo.js'

// Campana de avisos (#293): bandeja oficial del panel. Botón con contador
// (99+) + panel. Cada aviso es `{ id, titulo, detalle?, tono?, fecha?, href?,
// onClick?, leido? }` —`tono` es uno de los de `TONOS` (ok/warn/bad/info/mute),
// `fecha` llega ya formateada («hace 5 min») y `href`/`destino` es la **ruta
// interna**—. El panel no marca nada solo: avisar que se abrió es `onAbrir` y
// elegir un aviso es `onElegir` (la app decide qué se marca como leído). Vacío
// con acción, siempre.
//
// Portable: sin fetch ni router; los avisos son datos. El contador sale de los
// avisos no leídos cuando traen `leido`; si no, cuenta todos. Cierra con Escape
// y con clic afuera.

/** Avisos sin leer: los que traen `leido: false`; si ninguno lo trae, cuenta todos. */
export function contarSinLeer(avisos = []) {
  const conEstado = avisos.filter((aviso) => aviso && typeof aviso.leido === 'boolean')
  if (conEstado.length) return conEstado.filter((aviso) => !aviso.leido).length
  return avisos.length
}

/** Contador visible: hasta 99; de ahí en adelante, `99+`. */
export function textoContador(total) {
  const cuenta = Number(total) || 0
  return cuenta > 99 ? '99+' : String(cuenta)
}

export default function CampanaAvisos({
  avisos = [],
  onAbrir,
  onElegir,
  titulo = 'Avisos',
  ariaLabel = 'Avisos',
  anclaje = 'right',
  vacioTitulo = 'Sin avisos',
  vacioDetalle = 'No hay novedades para mostrar.',
  vacioAccion,
  pie,
  className,
}) {
  const [abierto, setAbierto] = useState(false)
  const raiz = useRef(null)
  const sinLeer = contarSinLeer(avisos)

  useEffect(() => {
    if (!abierto) return undefined
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      setAbierto(false)
    }
    const cerrarEsc = (event) => {
      if (event.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', cerrarFuera)
    document.addEventListener('keydown', cerrarEsc)
    return () => {
      document.removeEventListener('mousedown', cerrarFuera)
      document.removeEventListener('keydown', cerrarEsc)
    }
  }, [abierto])

  function alternar() {
    setAbierto((actual) => {
      if (!actual) onAbrir?.()
      return !actual
    })
  }

  return (
    <div ref={raiz} className={cn('relative', className)}>
      <button
        type="button"
        onClick={alternar}
        data-testid="campana-avisos"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={abierto}
        title={sinLeer > 0 ? `${ariaLabel} · ${sinLeer} sin leer` : ariaLabel}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-ink-500 text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore"
      >
        <Icon name="bell" className="h-4 w-4" />
        {sinLeer > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-bad px-1 text-[10px] font-bold tabular-nums text-white dark:text-onbrand">
            {textoContador(sinLeer)}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="menu"
          aria-label={titulo}
          className={cn(
            'absolute z-30 mt-1 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-ink-500 bg-ink shadow-float',
            anclaje === 'left' ? 'left-0' : 'right-0',
          )}
        >
          <header className="flex items-center justify-between gap-2 border-b border-ink-600 px-3 py-2">
            <p className="text-sm font-semibold text-fore">{titulo}</p>
            {sinLeer > 0 && <span className="text-xs tabular-nums text-mute">{textoContador(sinLeer)} sin leer</span>}
          </header>

          <div className="max-h-80 overflow-y-auto p-1">
            {avisos.length === 0 ? (
              <EmptyState compact icon="bell" title={vacioTitulo} description={vacioDetalle} action={vacioAccion} />
            ) : (
              avisos.map((aviso) => {
                const tono = TONOS.punto[aviso.tono] || TONOS.punto.mute
                const contenido = (
                  <>
                    <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full', tono)}>
                      <Icon name={aviso.icono || 'bell'} className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block truncate text-sm', aviso.leido === false ? 'font-semibold text-fore' : 'font-medium text-fore')}>
                        {aviso.titulo}
                      </span>
                      {aviso.detalle && <span className="mt-0.5 block text-xs leading-5 text-mute">{aviso.detalle}</span>}
                      {aviso.fecha && <span className="mt-1 block text-[10px] uppercase tracking-wide text-mute">{aviso.fecha}</span>}
                    </span>
                  </>
                )
                const clases = 'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-ink-700/60'
                const ruta = aviso.href ?? aviso.destino
                return ruta ? (
                  <a
                    key={aviso.id ?? aviso.titulo}
                    role="menuitem"
                    href={ruta}
                    className={clases}
                    onClick={() => {
                      setAbierto(false)
                      onElegir?.(aviso)
                      aviso.onClick?.()
                    }}
                  >
                    {contenido}
                  </a>
                ) : (
                  <button
                    key={aviso.id ?? aviso.titulo}
                    type="button"
                    role="menuitem"
                    className={clases}
                    onClick={() => {
                      setAbierto(false)
                      onElegir?.(aviso)
                      aviso.onClick?.()
                    }}
                  >
                    {contenido}
                  </button>
                )
              })
            )}
          </div>

          {pie && <div className="border-t border-ink-600 p-2">{pie}</div>}
        </div>
      )}
    </div>
  )
}
