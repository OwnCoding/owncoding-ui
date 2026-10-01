import { Fragment, useState } from 'react'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

// Navegación lateral colapsable. Modelo de items portable:
//   [{ id, label, icono, contador? }]
// El estado colapsado es controlado (`colapsado` + `onToggle`) para que la app
// decida si lo recuerda; `cabecera` y `pie` son slots (logo, usuario, etc.).
//
// Con grupos (`grupos: [{ titulo, items }]`), cada grupo lleva su rótulo
// plegable: `gruposPlegados` + `onToggleGrupo(titulo)` lo controlan (como
// `colapsado`) y, sin ellos, el objeto recuerda el estado solo. Cuando el menú
// está colapsado los rótulos no se dibujan y los ítems quedan siempre visibles.
// Un ítem puede llevar `hijos` (subítems indentados, p. ej. «Mi página →
// Personalización / Contenido»); se ocultan al colapsar el riel.
// Dentro del scope `tema-v2` el activo usa el azul de acción AA y los rótulos
// van en verde sólido (`styles.css`); la app no repite esas reglas.

function ItemNav({ item, activo, colapsado, onSelect, hijo = false }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(item.id)}
        aria-current={activo ? 'page' : undefined}
        title={colapsado ? item.label : undefined}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
          hijo && 'px-2.5 py-1.5 text-[13px]',
          activo ? 'bg-fono/15 text-fono-text' : 'text-mute hover:bg-ink-700 hover:text-fore',
          colapsado && 'justify-center px-2',
        )}
      >
        {item.icono && <Icon name={item.icono} className={cn('shrink-0', hijo ? 'h-3.5 w-3.5' : 'h-4 w-4')} />}
        {!colapsado && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
        {!colapsado && item.contador != null && (
          <span className="shrink-0 rounded-full bg-ink-700 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-mute">{item.contador}</span>
        )}
        {colapsado && item.contador != null && <span className="sr-only">{item.contador}</span>}
      </button>
    </li>
  )
}

export default function NavLateral({
  items = [],
  grupos,
  gruposPlegados,
  onToggleGrupo,
  activeId,
  onSelect,
  colapsado = false,
  onToggle,
  cabecera,
  pie,
  ancho = 'w-64',
  ariaLabel = 'Navegación principal',
  className,
}) {
  const [plegadosInterno, setPlegadosInterno] = useState({})
  const plegados = gruposPlegados ?? plegadosInterno
  const alternarGrupo = (titulo) => {
    if (onToggleGrupo) onToggleGrupo(titulo)
    else setPlegadosInterno((previos) => ({ ...previos, [titulo]: !previos[titulo] }))
  }

  const lista = (listaItems) => (
    <ul className="space-y-1">
      {listaItems.map((item) => (
        <Fragment key={item.id}>
          <ItemNav item={item} activo={item.id === activeId} colapsado={colapsado} onSelect={onSelect} />
          {!colapsado && item.hijos?.length ? (
            <li>
              <ul className="mt-0.5 space-y-0.5 pl-7">
                {item.hijos.map((hijo) => (
                  <ItemNav
                    key={hijo.id}
                    item={hijo}
                    activo={hijo.id === activeId}
                    colapsado={false}
                    onSelect={onSelect}
                    hijo
                  />
                ))}
              </ul>
            </li>
          ) : null}
        </Fragment>
      ))}
    </ul>
  )

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('flex h-dvh flex-col border-r border-ink-600 bg-ink-900 transition-[width] duration-200', colapsado ? 'w-[4.5rem]' : ancho, className)}
    >
      <div className={cn('flex items-center gap-2 px-3 py-3', colapsado && 'justify-center')}>
        {cabecera && <div className="min-w-0 flex-1">{cabecera}</div>}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={colapsado ? 'Expandir menú' : 'Contraer menú'}
            aria-expanded={!colapsado}
            className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg text-mute transition hover:bg-ink-700 hover:text-fore', colapsado && 'w-full')}
          >
            <Icon name="back" className={cn('h-4 w-4 transition-transform', colapsado && 'rotate-180')} />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2 py-2">
        {grupos
          ? grupos.map(({ titulo, items: itemsGrupo = [] }) => {
              const plegado = Boolean(plegados[titulo])
              const tieneActivo = itemsGrupo.some((item) => item.id === activeId)
              return (
                <div key={titulo} className="flex flex-col">
                  {!colapsado && (
                    <button
                      type="button"
                      onClick={() => alternarGrupo(titulo)}
                      aria-expanded={!plegado}
                      title={plegado ? `Mostrar ${titulo}` : `Ocultar ${titulo}`}
                      className="mb-0.5 flex w-full items-center justify-between gap-1 rounded-md px-2.5 py-0.5 text-left transition hover:bg-fore/5"
                    >
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-mute">
                        {titulo}
                        {plegado && tieneActivo && <span className="h-1.5 w-1.5 rounded-full bg-fono" aria-hidden />}
                      </span>
                      <Icon
                        name="chevron"
                        className={cn('h-3 w-3 shrink-0 text-mute transition-transform duration-200', plegado && '-rotate-90')}
                      />
                    </button>
                  )}
                  {(!plegado || colapsado) && lista(itemsGrupo)}
                </div>
              )
            })
          : lista(items)}
      </div>

      {pie && <div className="border-t border-ink-600 p-2">{pie}</div>}
    </nav>
  )
}
