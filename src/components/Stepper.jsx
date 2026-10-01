import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

// Stepper del flujo de trabajo (#241): pasos con hecho/actual/pendiente.
// Portable: `pasos` = `[{ id, etiqueta, detalle? }]` (o etiquetas sueltas),
// `actual` = id o índice, `hechos` = ids completados; la pantalla maneja el
// avance y las acciones.
//
// `variante="linea"` (predeterminada) dibuja la fila con conectores del modo
// taller; `variante="tarjetas"` dibuja la grilla de 2/4 tarjetas con el paso
// actual destacado (el flujo de entrega del pedido en la vista v2).
export default function Stepper({ pasos = [], actual = 0, hechos = [], variante = 'linea', ariaLabel = 'Flujo', className }) {
  if (!pasos.length) return null
  const etiquetaDe = (paso) => (typeof paso === 'string' ? paso : (paso.etiqueta ?? paso.label ?? ''))
  const claveDe = (paso, indice) => (typeof paso === 'string' ? indice : (paso.id ?? indice))
  const esHecho = (paso, indice) => hechos.includes(claveDe(paso, indice)) || (typeof actual === 'number' && indice < actual)
  const esActual = (paso, indice) => (typeof paso === 'string' || paso.id === undefined ? indice === actual : paso.id === actual)

  if (variante === 'tarjetas') {
    return (
      <ol className={cn('grid grid-cols-2 gap-2 sm:grid-flow-col sm:auto-cols-fr', className)} aria-label={ariaLabel}>
        {pasos.map((paso, indice) => {
          const hecho = esHecho(paso, indice)
          const activo = !hecho && esActual(paso, indice)
          return (
            <li key={claveDe(paso, indice)} aria-current={activo ? 'step' : undefined} className={cn('flex items-center gap-2.5 rounded-xl border p-2.5', activo ? 'border-info/40 bg-info/5' : 'border-ink-600')}>
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                  activo ? 'oc-paso-activo bg-info/15 text-info-text' : hecho ? 'bg-ok/15 text-ok-text' : 'bg-ink-700 text-mute',
                )}
                aria-hidden="true"
              >
                {hecho ? <Icon name="check" className="h-3.5 w-3.5" /> : indice + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold">{etiquetaDe(paso)}</span>
                {typeof paso === 'object' && paso.detalle ? <span className={cn('block truncate text-[11px]', activo ? 'text-info-text' : 'text-mute')}>{paso.detalle}</span> : null}
              </span>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol className={cn('flex flex-wrap items-center gap-x-2 gap-y-2', className)} aria-label={ariaLabel}>
      {pasos.map((paso, indice) => {
        const hecho = esHecho(paso, indice)
        const enCurso = esActual(paso, indice)
        return (
          <li key={claveDe(paso, indice)} aria-current={enCurso ? 'step' : undefined} className="flex items-center gap-2">
            <span
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-bold',
                hecho && 'border-pass/40 bg-pass/15 text-pass-text',
                !hecho && enCurso && 'oc-paso-activo border-fono bg-fono/10 text-fono-text',
                !hecho && !enCurso && 'border-ink-600 bg-ink-800 text-mute',
              )}
              aria-hidden="true"
            >
              {hecho ? <Icon name="check" className="h-3.5 w-3.5" /> : indice + 1}
            </span>
            <span className={cn('text-xs font-semibold', enCurso ? 'text-fore' : hecho ? 'text-pass-text' : 'text-mute')}>
              {etiquetaDe(paso)}
              {typeof paso === 'object' && paso.detalle && <span className="ml-1 font-normal text-mute">· {paso.detalle}</span>}
            </span>
            {indice < pasos.length - 1 && <span className="mx-1 h-px w-6 bg-ink-600" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
