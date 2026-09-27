import { IconAction } from './ui.jsx'
import { cn } from '../utils/cn.js'

// Bloque de un medio de pago (#265): la tarjeta que contiene el contenido del
// pago (medio/cuenta/monto) con la **papelera adentro**, arriba a la derecha y
// alineada, así la fila gana el ancho completo para el contenido. El ícono usa
// `IconAction` (tooltip + `aria-label`, área táctil de 44 px en móvil). Portable:
// el contenido entra por children y quitar se avisa por `onQuitar`; la
// confirmación (si hace falta) es de la pantalla.
//
//   <BloquePago acento={p.noPagado ? 'warn' : 'ok'} encabezado={<ChipPagado />}
//     onQuitar={() => quitar(i)} etiquetaQuitar={`Eliminar pago ${i + 1}`}>
//     …medio, cuenta y monto…
//   </BloquePago>
const ACENTO = {
  ok: 'border-l-2 border-l-ok/60',
  warn: 'border-l-2 border-l-warn/70',
  bad: 'border-l-2 border-l-bad/60',
  fono: 'border-l-2 border-l-fono/60',
}

export default function BloquePago({
  etiqueta,
  encabezado,
  acento,
  onQuitar,
  etiquetaQuitar = 'Eliminar pago',
  deshabilitado = false,
  testId = 'bloque-pago',
  className,
  children,
}) {
  return (
    <article
      data-testid={testId}
      data-estado={acento || undefined}
      className={cn(
        'relative rounded-2xl border border-ink-600 bg-ink-800/30 p-3',
        acento && ACENTO[acento],
        onQuitar && 'pr-12',
        className,
      )}
    >
      {etiqueta || encabezado ? (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {etiqueta ? <span className="text-[11px] font-semibold uppercase tracking-wider text-mute">{etiqueta}</span> : null}
          {encabezado}
        </div>
      ) : null}
      <div className="min-w-0">{children}</div>
      {onQuitar ? (
        <span className="absolute right-1.5 top-1.5">
          <IconAction icon="trash" tone="bad" size="touch" label={etiquetaQuitar} disabled={deshabilitado} onClick={onQuitar} />
        </span>
      ) : null}
    </article>
  )
}
