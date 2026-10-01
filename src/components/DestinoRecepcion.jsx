import { useEffect, useId, useRef, useState } from 'react'
import { Button, Select } from './ui.jsx'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

// Cierre de una recepción (#250 F5): recibir todo en el depósito
// predeterminado en un clic o elegir otro depósito de la lista. Avisa por
// callback (`onRecibir(id)`); mientras trabaja se muestra ocupado y los IMEI
// pendientes quedan a la vista para no recibirlos «a ciegas».
//
//   <DestinoRecepcion destino={{ id: 'dep-1', nombre: 'Depósito 1' }} depositos={DEPOSITOS}
//     pendientes={3} onRecibir={(id) => recibir(id)} />
export default function DestinoRecepcion(props) {
  const {
    destino,
    destinoId,
    defaultDestinoId,
    onDestinoChange,
    depositos = [],
    pendientes = 0,
    recibiendo = false,
    onRecibir,
    etiqueta = 'Recibir en',
    textoRecibir = 'Recibir todo',
    className,
  } = props
  const controlado = Object.prototype.hasOwnProperty.call(props, 'destinoId')
  const [elegidoInterno, setElegidoInterno] = useState(defaultDestinoId ?? destino?.id ?? depositos[0]?.id ?? '')
  const destinoAnterior = useRef(destino?.id)
  useEffect(() => {
    if (controlado || destinoAnterior.current === destino?.id) return
    destinoAnterior.current = destino?.id
    setElegidoInterno(destino?.id ?? defaultDestinoId ?? depositos[0]?.id ?? '')
  }, [controlado, defaultDestinoId, depositos, destino?.id])
  const elegido = controlado ? (destinoId ?? '') : elegidoInterno
  const id = useId()
  const actual = depositos.find((deposito) => deposito.id === elegido) || destino || null
  const alternativas = depositos.filter((deposito) => deposito.id !== actual?.id)

  const elegir = (siguiente) => {
    if (!controlado) setElegidoInterno(siguiente)
    onDestinoChange?.(siguiente)
  }

  return (
    <section className={cn('rounded-xl border border-ink-600 bg-ink-800 p-3', className)} aria-label="Cierre de la recepción">
      <div className="flex flex-wrap items-end gap-3">
        <label htmlFor={id} className="min-w-0 flex-1 space-y-1 text-xs text-mute">
          <span className="block font-semibold">{etiqueta}</span>
          {alternativas.length > 0 ? (
            <Select id={id} value={elegido} onChange={(event) => elegir(event.target.value)} className="w-full">
              {actual ? <option value={actual.id}>{actual.nombre}</option> : null}
              {alternativas.map((deposito) => <option key={deposito.id} value={deposito.id}>{deposito.nombre}</option>)}
            </Select>
          ) : (
            <span className="flex h-9 items-center gap-2 rounded-lg border border-ink-600 px-3 text-sm font-semibold text-fore">
              <Icon name="box" className="h-4 w-4 text-mute" />
              {actual?.nombre || 'Sin depósito'}
            </span>
          )}
        </label>
        <Button type="button" disabled={recibiendo || !actual?.id || !onRecibir} onClick={() => onRecibir?.(actual.id)}>
          {recibiendo ? 'Recibiendo…' : textoRecibir}
        </Button>
      </div>
      {Number(pendientes) > 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-warn-text">
          <Icon name="alert" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {Number(pendientes)} unidad(es) sin IMEI: se reciben igual y el IMEI se completa después.
        </p>
      )}
    </section>
  )
}
