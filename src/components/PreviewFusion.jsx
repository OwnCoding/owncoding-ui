import { useId } from 'react'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

// Preview de una unificación (#268): las dos fichas candidatas con sus datos,
// la elección de **cuál queda como principal** y el **checklist de lo que se
// fusiona** por categoría (pedidos, pagos y cuotas, créditos/saldo, notas,
// direcciones, teléfonos/correos, tags, seguro, portal, garantías/servicio…).
// Portable: entidades, categorías y elección entran por props.
//
//   <PreviewFusion
//     entidades={[{ id: principal.id, titulo: principal.name, datos: [...] }, { id: duplicado.id, titulo: duplicado.name, datos: [...] }]}
//     principalId={principalId}
//     onElegirPrincipal={setPrincipalId}
//     categorias={[{ id: 'pedidos', etiqueta: 'Pedidos', cantidad: 3 }, { id: 'notas', etiqueta: 'Notas', cantidad: 0 }]}
//   />
export default function PreviewFusion({
  entidades = [],
  principalId,
  onElegirPrincipal,
  categorias = [],
  tituloCategorias = 'Se fusiona',
  textoPrincipal = 'Queda como principal',
  nota = 'La otra ficha no se borra: queda archivada con un puntero al principal, así sus enlaces, tokens e historial siguen funcionando.',
  acciones,
  testId = 'preview-fusion',
  className,
}) {
  const lista = (Array.isArray(entidades) ? entidades : []).slice(0, 2)
  const grupo = useId()

  return (
    <div className={cn('space-y-3', className)} data-testid={testId}>
      <div className="grid gap-2 sm:grid-cols-2">
        {lista.map((entidad) => {
          const principal = entidad.id === principalId
          return (
            <label
              key={entidad.id}
              className={cn(
                'flex cursor-pointer flex-col gap-2 rounded-xl border p-3 transition',
                principal ? 'border-fono/50 bg-fono/5' : 'border-ink-600 hover:border-fono/40',
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{entidad.titulo || 'Sin nombre'}</span>
                  {entidad.subtitulo ? <span className="block truncate text-xs text-mute">{entidad.subtitulo}</span> : null}
                </span>
                <input
                  type="radio"
                  name={grupo}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-fono"
                  checked={principal}
                  onChange={() => onElegirPrincipal?.(entidad.id)}
                  aria-label={`${textoPrincipal}: ${entidad.titulo || ''}`}
                />
              </span>
              {principal ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-fono-light">
                  <Icon name="check" className="h-3.5 w-3.5" />
                  {textoPrincipal}
                </span>
              ) : null}
              {Array.isArray(entidad.datos) && entidad.datos.length > 0 ? (
                <dl className="space-y-0.5">
                  {entidad.datos.map((dato, indice) => (
                    <div key={`${dato.etiqueta}-${indice}`} className="flex items-baseline justify-between gap-2 text-xs">
                      <dt className="shrink-0 text-mute">{dato.etiqueta}</dt>
                      <dd className="min-w-0 truncate text-right">{dato.valor ?? '—'}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </label>
          )
        })}
      </div>

      {Array.isArray(categorias) && categorias.length > 0 ? (
        <section className="rounded-xl border border-ink-600 bg-ink-800/40 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-mute">{tituloCategorias}</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {categorias.map((categoria) => {
              const cantidad = Math.max(0, Number(categoria?.cantidad) || 0)
              return (
                <li key={categoria.id} className="flex items-center gap-2 text-sm">
                  <Icon
                    name={cantidad > 0 ? 'check' : 'close'}
                    className={cn('h-4 w-4 shrink-0', cantidad > 0 ? 'text-ok-text' : 'text-mute')}
                  />
                  <span className={cn('min-w-0 flex-1 truncate', cantidad > 0 ? 'text-fore' : 'text-mute')}>{categoria.etiqueta}</span>
                  {categoria.detalle ? <span className="min-w-0 truncate text-xs text-mute">{categoria.detalle}</span> : null}
                  <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums', cantidad > 0 ? 'bg-ink-700 text-fore' : 'bg-ink-700/50 text-mute')}>
                    {cantidad}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {nota ? <p className="text-xs text-mute">{nota}</p> : null}
      {acciones ? <div className="flex flex-wrap items-center justify-end gap-2">{acciones}</div> : null}
    </div>
  )
}
