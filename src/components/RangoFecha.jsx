import { useEffect, useId, useRef, useState } from 'react'
import { Aviso, Input, Label } from './ui.jsx'
import { cn } from '../utils/cn.js'
import { ETIQUETA_PERIODO, PERIODOS_FECHA, periodoDeRango, rangoDePeriodo, rangoInvertido } from '../utils/rangoFecha.js'

// Filtro de rango de fechas: atajos (Hoy · Esta semana · Este mes · Mes pasado ·
// Últimos 30 días) + campos desde/hasta. Muestra el atajo activo cuando el par
// coincide con uno; si no, marca «Personalizado».
//
// Portable: el consumidor decide si lo controla (`desde`/`hasta` + `onCambio`)
// o lo deja suelto (`desdePorDefecto`/`hastaPorDefecto`). El rango viaja como
// claves de día `YYYY-MM-DD` (ver `utils/calendario.js`): el filtro corta por
// día, no por instante, y `onCambio(desde, hasta)` entrega el par ya listo para
// la API. El rango invertido se marca en pantalla, pero no se corrige solo.

export default function RangoFecha(props) {
  const {
    desde,
    hasta,
    onCambio,
    desdePorDefecto,
    hastaPorDefecto,
    periodoPorDefecto = 'este-mes',
    atajos = PERIODOS_FECHA,
    hoy,
    ariaLabel = 'Filtro por rango de fechas',
    mostrarCampos = true,
    className,
  } = props
  const desdeControlado = Object.prototype.hasOwnProperty.call(props, 'desde')
  const hastaControlado = Object.prototype.hasOwnProperty.call(props, 'hasta')
  const [interno, setInterno] = useState(() => {
    if (desdePorDefecto !== undefined || hastaPorDefecto !== undefined) {
      return { desde: desdePorDefecto || '', hasta: hastaPorDefecto || '' }
    }
    return rangoDePeriodo(periodoPorDefecto, { hoy }) || { desde: '', hasta: '' }
  })
  const idDesde = useId()
  const idHasta = useId()
  const errorId = useId()
  const refDesde = useRef(null)

  useEffect(() => {
    if (desdeControlado === hastaControlado) return
    if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
      console.warn('RangoFecha: controlá `desde` y `hasta` juntos cuando sea posible. El campo omitido permanece no controlado por compatibilidad.')
    }
  }, [desdeControlado, hastaControlado])

  const actual = {
    desde: desdeControlado ? (desde ?? '') : interno.desde,
    hasta: hastaControlado ? (hasta ?? '') : interno.hasta,
  }
  const activo = periodoDeRango(actual.desde, actual.hasta, { hoy })
  const invertido = rangoInvertido(actual.desde, actual.hasta)

  function aplicar(siguienteDesde, siguienteHasta) {
    const par = { desde: siguienteDesde ?? '', hasta: siguienteHasta ?? '' }
    if (!desdeControlado || !hastaControlado) {
      setInterno((anterior) => ({
        desde: desdeControlado ? anterior.desde : par.desde,
        hasta: hastaControlado ? anterior.hasta : par.hasta,
      }))
    }
    onCambio?.(par.desde, par.hasta)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={ariaLabel}>
        {atajos.map((periodo) => {
          const esActivo = activo === periodo
          return (
            <button
              key={periodo}
              type="button"
              aria-pressed={esActivo}
              onClick={() => {
                const rango = rangoDePeriodo(periodo, { hoy })
                if (rango) aplicar(rango.desde, rango.hasta)
                else refDesde.current?.focus()
              }}
              className={cn(
                'min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition',
                esActivo
                  ? 'border-fono/30 bg-fono/15 text-fono-text'
                  : 'border-ink-600 text-mute hover:border-fono/40 hover:text-fore',
              )}
            >
              {ETIQUETA_PERIODO[periodo] || periodo}
            </button>
          )
        })}
      </div>

      {mostrarCampos && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <Label htmlFor={idDesde}>Desde</Label>
            <Input
              id={idDesde}
              ref={refDesde}
              type="date"
              value={actual.desde}
              max={actual.hasta || undefined}
              aria-invalid={invertido || undefined}
              aria-describedby={invertido ? errorId : undefined}
              onChange={(event) => aplicar(event.target.value, actual.hasta)}
              className="w-40 max-w-full tabular-nums"
            />
          </div>
          <div>
            <Label htmlFor={idHasta}>Hasta</Label>
            <Input
              id={idHasta}
              type="date"
              value={actual.hasta}
              min={actual.desde || undefined}
              aria-invalid={invertido || undefined}
              aria-describedby={invertido ? errorId : undefined}
              onChange={(event) => aplicar(actual.desde, event.target.value)}
              className="w-40 max-w-full tabular-nums"
            />
          </div>
        </div>
      )}

      {invertido && (
        <Aviso id={errorId} tono="warn" compact>
          El rango está invertido: «desde» es posterior a «hasta».
        </Aviso>
      )}
    </div>
  )
}
