import { Button } from './ui.jsx'
import Icon from './Icon.jsx'
import { detalleCuentaCobro, etiquetaMedioCuenta, iconoMedioCuenta, simboloCuenta } from '../utils/cuentaCobro.js'
import { formatGs } from '../utils/moneda.js'
import { cn } from '../utils/cn.js'

// Tarjeta de la cuenta de cobro elegida (#262): UNA sola tarjeta limpia con el
// nombre, logo o ícono del medio, moneda, tipo de transferencia, banco (una
// sola vez: se omite si el nombre ya lo contiene) y el saldo pendiente de la
// venta, con la acción «Cambiar cuenta». Portable: la cuenta y los importes
// entran por props.
//
//   <TarjetaCuentaCobro cuenta={cuenta} logo={<BancoLogo banco={cuenta.bank} />}
//     saldoPendientePyg={pendiente} cotizacionPyg={cotizacion}
//     detalle={detalleCuentaCobro(cuenta)} onCambiar={reabrir} />
const normalizar = (valor) => String(valor ?? '').trim().toLowerCase()

export default function TarjetaCuentaCobro({
  cuenta,
  logo,
  saldoPendientePyg = 0,
  cotizacionPyg = 0,
  detalle,
  acciones,
  onCambiar,
  textoCambiar = 'Cambiar cuenta',
  testId = 'cuenta-cobro',
  className,
}) {
  if (!cuenta) return null
  const medio = etiquetaMedioCuenta(cuenta.kind)
  const moneda = simboloCuenta(cuenta.currency, cuenta.currencyLabel)
  const banco = String(cuenta.bank || '').trim()
  // El banco se muestra una sola vez: si el nombre ya lo dice, se omite.
  const mostrarBanco = Boolean(banco) && !normalizar(cuenta.name).includes(normalizar(banco))
  const detalleTexto = detalle ?? detalleCuentaCobro(cuenta)
  const pendiente = Math.max(0, Number(saldoPendientePyg) || 0)
  const cotizacion = Number(cotizacionPyg) || 0
  const equivalente = cuenta.currency !== 'PYG' && cotizacion > 0 ? pendiente / cotizacion : null

  return (
    <div
      data-testid={testId}
      className={cn('flex items-start gap-3 rounded-xl border border-fono/25 bg-fono/5 p-3', className)}
    >
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-800">
        {logo || <Icon name={iconoMedioCuenta(cuenta.kind)} className="h-4 w-4 text-fono-light" />}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <b className="min-w-0 truncate text-sm text-fore" data-testid={`${testId}-nombre`}>{cuenta.name}</b>
          <span className="rounded border border-ink-500 px-1.5 py-0.5 text-[10px] font-bold text-mute">{moneda}</span>
          <span className="text-[11px] font-semibold text-mute">{medio}</span>
        </div>
        {mostrarBanco ? <p className="truncate text-xs text-mute">{banco}</p> : null}
        {detalleTexto ? <p className="truncate text-xs text-mute" data-testid={`${testId}-detalle`}>{detalleTexto}</p> : null}
        {pendiente > 0 ? (
          <p className="text-xs text-mute" data-testid={`${testId}-saldo`}>
            Saldo pendiente de esta venta:{' '}
            <b className="tabular-nums text-warn-text">{formatGs(pendiente)}</b>
            {equivalente !== null ? (
              <span> · {moneda} {equivalente.toLocaleString('es-PY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            ) : null}
          </p>
        ) : null}
      </div>
      <span className="flex shrink-0 flex-wrap items-center gap-2">
        {acciones}
        {onCambiar ? <Button type="button" variant="ghost" onClick={onCambiar} data-testid={`${testId}-cambiar`}>{textoCambiar}</Button> : null}
      </span>
    </div>
  )
}
