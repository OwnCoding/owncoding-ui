import { useEffect, useId, useState } from 'react'
import { Aviso, Button, Input, Label } from './ui.jsx'
import { cn } from '../utils/cn.js'

// Confirmación fuerte de una unificación (#268): resumen de lo que va a pasar,
// advertencia y la **palabra exacta** que hay que escribir para confirmar, con
// estado ocupado y error. Portable: el resumen entra como nodo y confirmar se
// avisa por callback.
//
//   <ConfirmarConPalabra resumen={<PreviewFusion … />} onConfirmar={unificar} onCancelar={cerrar} />
export default function ConfirmarConPalabra({
  titulo = 'Confirmar unificación',
  resumen,
  advertencia = 'La ficha fusionada queda archivada (no se borra) y no se puede deshacer desde la pantalla.',
  palabra = 'FUSIONAR',
  confirmLabel = 'Unificar',
  textoOcupado = 'Unificando…',
  onConfirmar,
  onCancelar,
  busy = false,
  error = '',
  testId = 'confirmar-palabra',
  className,
}) {
  const [texto, setTexto] = useState('')
  const campoId = useId()
  useEffect(() => { setTexto('') }, [palabra])
  const listo = texto.trim().toUpperCase() === String(palabra).toUpperCase()

  return (
    <form
      onSubmit={(event) => { event.preventDefault(); if (listo && !busy) onConfirmar?.() }}
      className={cn('space-y-3', className)}
      data-testid={testId}
    >
      <div className="rounded-xl border border-bad/30 bg-bad/5 p-3">
        <p className="text-sm font-semibold text-bad">{titulo}</p>
        {resumen ? <div className="mt-1 text-sm">{resumen}</div> : null}
        <p className="mt-1 text-xs text-mute">{advertencia}</p>
      </div>
      <div>
        <Label htmlFor={campoId}>
          Escribí <b>{palabra}</b> para confirmar
        </Label>
        <Input
          id={campoId}
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          autoComplete="off"
          disabled={busy}
          aria-label={`Escribí ${palabra} para confirmar`}
        />
      </div>
      {error ? <Aviso tono="error" compact>{error}</Aviso> : null}
      <div className="flex flex-wrap justify-end gap-2">
        {onCancelar ? <Button type="button" variant="ghost" onClick={onCancelar} disabled={busy}>Cancelar</Button> : null}
        <Button type="submit" variant="danger" disabled={!listo || busy} data-testid={`${testId}-confirmar`}>
          {busy ? textoOcupado : confirmLabel}
        </Button>
      </div>
    </form>
  )
}
