import Icon from './Icon.jsx'
import { fechaCorta } from '../utils/fecha.js'
import { cn } from '../utils/cn.js'

// Ficha fusionada (#268): el registro que se unificó queda archivado (no se
// borra) y muestra con quién, cuándo y quién lo hizo, con acceso a la ficha
// principal. Portable: los datos entran por props; `principal` acepta el objeto
// de la ficha o su nombre.
//
//   <ChipFusion principal={principal} fusionadoEl={cliente.mergedAt} por={cliente.mergedBy?.name}
//     onAbrirPrincipal={() => abrir(principal.id)} />
export default function ChipFusion({
  principal,
  fusionadoEl,
  por,
  onAbrirPrincipal,
  texto = 'Fusionado con',
  textoAbrir = 'Ver la principal',
  testId = 'chip-fusion',
  className,
}) {
  if (!principal) return null
  const nombre = typeof principal === 'string'
    ? principal
    : (principal.name || principal.nombre || 'la ficha principal')
  const fecha = fusionadoEl ? fechaCorta(fusionadoEl, '') : ''

  return (
    <span
      data-testid={testId}
      className={cn('inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-xl border border-info/30 bg-info/10 px-3 py-1.5 text-xs text-info-text', className)}
    >
      <Icon name="refresh" className="h-3.5 w-3.5 shrink-0" />
      <span className="min-w-0">
        {texto} <b className="text-fore">{nombre}</b>
        {fecha ? ` · ${fecha}` : ''}
        {por ? ` · ${por}` : ''}
      </span>
      {onAbrirPrincipal ? (
        <button type="button" onClick={onAbrirPrincipal} className="shrink-0 font-semibold underline-offset-2 hover:underline">
          {textoAbrir}
        </button>
      ) : null}
    </span>
  )
}
