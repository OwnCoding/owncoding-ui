import { useEffect, useRef } from 'react'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

// Riel de secciones de una pantalla (#267/#253): en escritorio es una barra
// lateral que se puede **colapsar a solo íconos** (tooltip + `aria-label`) y en
// mobile una tira horizontal desplazable; `variante="horizontal"` la deja
// horizontal en todas las medidas. Mantiene `role="tab"`/`aria-selected` y
// `aria-current` en el activo, centra la sección activa al entrar por enlace
// directo y muestra la descripción del grupo arriba del contenido. Portable: el
// estado colapsado es **controlado** (la app lo recuerda) y el contenido entra
// por children.
//
//   <NavegacionSeccion items={[{ id, label, icono, descripcion }]} value={seccion}
//     onChange={ir} colapsado={colapsado} onToggle={() => setColapsado(!colapsado)}>
//     …contenido de la sección…
//   </NavegacionSeccion>
export default function NavegacionSeccion({
  items = [],
  value,
  onChange,
  colapsado = false,
  onToggle,
  variante = 'auto',
  ariaLabel = 'Secciones',
  textoExpandir = 'Expandir el menú',
  textoColapsar = 'Colapsar el menú',
  mostrarDescripcion = true,
  testId = 'navegacion-seccion',
  testIdDescripcion,
  className,
  classNameContenido,
  children,
}) {
  const activoRef = useRef(null)
  const lista = (Array.isArray(items) ? items : [])
    .map((item) => (Array.isArray(item) ? { id: item[0], label: item[1] } : item))
    .filter((item) => item && item.id)
  const activo = lista.find((item) => item.id === value) || lista[0]
  const conRiel = variante !== 'horizontal'

  useEffect(() => {
    // En mobile la tira puede dejar la sección activa fuera de vista al entrar
    // por un enlace directo: la centramos sin mover la página.
    activoRef.current?.scrollIntoView?.({ inline: 'center', block: 'nearest' })
  }, [value])

  if (!lista.length) return null

  return (
    <div
      className={cn(
        'min-w-0',
        conRiel && 'lg:grid lg:items-start lg:gap-5',
        conRiel && (colapsado ? 'lg:grid-cols-[4.75rem_minmax(0,1fr)]' : 'lg:grid-cols-[16.5rem_minmax(0,1fr)]'),
        className,
      )}
    >
      <div className={cn(conRiel && 'lg:sticky lg:top-3')}>
        {onToggle && conRiel ? (
          <div className={cn('mb-1.5 hidden lg:flex', colapsado ? 'lg:justify-center' : 'lg:justify-end')}>
            <button
              type="button"
              data-testid={`${testId}-toggle`}
              onClick={() => onToggle(!colapsado)}
              aria-expanded={!colapsado}
              aria-controls={testId}
              title={colapsado ? textoExpandir : textoColapsar}
              aria-label={colapsado ? textoExpandir : textoColapsar}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-mute transition hover:bg-ink-700 hover:text-fore"
            >
              <Icon name="chevron" className={cn('h-4 w-4 transition-transform', colapsado ? '-rotate-90' : 'rotate-90')} />
            </button>
          </div>
        ) : null}
        <nav
          id={testId}
          role="tablist"
          aria-label={ariaLabel}
          data-testid={testId}
          className={cn(
            'mb-3 flex gap-1.5 overflow-x-auto rounded-2xl border border-fore/10 bg-ink p-2',
            conRiel && 'lg:mb-0 lg:flex-col lg:gap-0.5 lg:overflow-visible',
            conRiel && colapsado && 'lg:items-center lg:p-1.5',
          )}
        >
          {lista.map((item) => {
            const esta = item.id === value
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={esta}
                aria-current={esta ? 'page' : undefined}
                aria-label={item.label}
                title={item.label}
                ref={esta ? activoRef : undefined}
                onClick={() => onChange?.(item.id)}
                className={cn(
                  'group relative flex min-h-11 shrink-0 items-center gap-2 rounded-[10px] border px-3 text-left text-[13px] leading-snug transition',
                  conRiel && (colapsado ? 'lg:w-12 lg:justify-center lg:px-0' : 'lg:w-full'),
                  esta
                    ? 'border-fono/30 bg-gradient-to-r from-fono/[.16] to-fono/[.05] font-semibold text-fore'
                    : 'border-transparent text-mute hover:bg-ink-700/70 hover:text-fore',
                )}
              >
                {esta && <span aria-hidden className={cn('absolute left-0 top-1/2 hidden h-5 w-[2px] -translate-y-1/2 rounded-full bg-fono', conRiel && 'lg:block')} />}
                {item.icono ? <Icon name={item.icono} className={cn('h-4 w-4 shrink-0', esta ? 'text-fono-light' : 'group-hover:text-fore')} /> : null}
                <span className={cn('truncate', conRiel && colapsado && 'lg:hidden')}>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className={cn('min-w-0 space-y-3', classNameContenido)}>
        {mostrarDescripcion && activo?.descripcion ? (
          <p data-testid={testIdDescripcion || `${testId}-descripcion`} className="flex items-start gap-2 px-0.5 text-sm text-mute">
            <Icon name={activo.icono} className="mt-0.5 h-4 w-4 shrink-0 text-fono-light" />
            <span>{activo.descripcion}</span>
          </p>
        ) : null}
        {children}
      </div>
    </div>
  )
}
