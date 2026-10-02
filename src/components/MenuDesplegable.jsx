import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

// Menú desplegable portable (usuario, acciones de fila, filtros):
//   items: [{ id?, label, icono?, onClick?, peligro?, disabled?, separador? }]
// Cierra con clic afuera y con Esc; `trigger` es el botón visible.

export default function MenuDesplegable({ trigger, items = [], alineacion = 'right', ariaLabel = 'Menú', disabled = false, className }) {
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const raiz = useRef(null)
  const disparador = useRef(null)
  const menu = useRef(null)
  const acciones = items.filter((item) => !item.separador && !item.disabled)

  function enfocar(indice) {
    const elementos = menu.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') || []
    if (!elementos.length) return
    const siguiente = (indice + elementos.length) % elementos.length
    setActivo(siguiente)
    elementos[siguiente]?.focus()
  }

  function cerrar({ devolverFoco = false } = {}) {
    setAbierto(false)
    if (devolverFoco) requestAnimationFrame(() => disparador.current?.focus())
  }

  function abrir(indice = 0) {
    if (disabled || !acciones.length) return
    setAbierto(true)
    requestAnimationFrame(() => enfocar(indice))
  }

  useEffect(() => {
    if (!abierto) return undefined
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      cerrar()
    }
    document.addEventListener('click', cerrarFuera)
    return () => {
      document.removeEventListener('click', cerrarFuera)
    }
  }, [abierto])

  function manejarMenu(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      cerrar({ devolverFoco: true })
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      enfocar(activo + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      enfocar(activo - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      enfocar(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      enfocar(-1)
    }
  }

  return (
    <div ref={raiz} className={cn('relative', className)}>
      <button
        ref={disparador}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => { if (abierto) cerrar(); else abrir(0) }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            abrir(event.key === 'ArrowDown' ? 0 : -1)
          }
        }}
        className="toque-44 inline-flex min-h-11 items-center gap-2 rounded-lg transition"
      >
        {trigger}
      </button>
      {abierto && (
        <div
          ref={menu}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={manejarMenu}
          className={cn('absolute z-30 mt-1 min-w-48 rounded-xl border border-ink-500 bg-ink p-1 shadow-float', alineacion === 'right' ? 'right-0' : 'left-0')}
        >
          {items.map((item, indice) => {
            if (item.separador) return <div key={`sep-${indice}`} role="separator" className="my-1 h-px bg-ink-600" />
            const indiceActivo = items.slice(0, indice).filter((candidato) => !candidato.separador && !candidato.disabled).length
            return (
              <button
                key={item.id ?? item.label ?? indice}
                type="button"
                role="menuitem"
                tabIndex={!item.disabled && indiceActivo === activo ? 0 : -1}
                disabled={item.disabled}
                onFocus={() => { if (!item.disabled) setActivo(indiceActivo) }}
                onClick={() => { cerrar({ devolverFoco: true }); item.onClick?.() }}
                className={cn(
                  'flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition',
                  item.peligro ? 'text-bad-text hover:bg-bad/10' : 'text-fore hover:bg-ink-700',
                  item.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {item.icono && <Icon name={item.icono} className="h-4 w-4 shrink-0" />}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.extra}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
