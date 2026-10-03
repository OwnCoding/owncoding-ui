import { useId, useState } from 'react'
import { FormField, Input } from './ui.jsx'
import { cn } from '../utils/cn.js'
import { LARGO_IMEI, MENSAJES_IMEI, analizarImei, normalizarImei } from '../utils/serial.js'

// IMEI check: input de 15 dígitos con validación Luhn EN VIVO. Limpia lo que
// se escribe o pega (solo dígitos) y avisa en el lugar del campo:
//   - vacío → ayuda de 15 dígitos, sin error;
//   - incompleto → cuántos dígitos faltan (error recién al salir del campo);
//   - inválido → error junto al campo con `role="alert"`;
//   - válido → confirmación `role="status"` en verde;
//   - `revisando` → estado «Revisando…» para las apps que consultan un
//     proveedor después de la validación local (la librería no consulta nada).
//
//   <ImeiField value={imei} onChange={setImei} required revisando={consultando} />
export default function ImeiField({
  label = 'IMEI',
  value = '',
  onChange,
  onBlur,
  hint,
  error,
  required = false,
  revisando = false,
  disabled = false,
  id,
  name,
  placeholder = `${LARGO_IMEI} dígitos`,
  className,
  inputClassName,
  ...props
}) {
  const generado = useId()
  const inputId = id || generado
  const descripcionId = `${inputId}-descripcion`
  const [tocado, setTocado] = useState(false)
  const analisis = analizarImei(value)
  const errorVisible = error ?? (
    analisis.estado === 'invalido' ? MENSAJES_IMEI.invalido
      : tocado && required && analisis.estado === 'vacio' ? MENSAJES_IMEI.obligatorio
        : tocado && analisis.estado === 'incompleto' ? MENSAJES_IMEI.incompleto(analisis.faltan)
          : null
  )
  // El conteo de dígitos pendientes es el feedback propio del chequeo: manda
  // mientras se escribe; el `hint` de la app describe el campo en reposo.
  const ayudaVisible = errorVisible ? null : (
    analisis.estado === 'incompleto' ? MENSAJES_IMEI.incompleto(analisis.faltan)
      : hint ?? (analisis.estado === 'vacio' ? MENSAJES_IMEI.vacio : null)
  )
  const estadoVisible = !errorVisible && analisis.valido ? (revisando ? MENSAJES_IMEI.revisando : MENSAJES_IMEI.valido) : null

  return (
    <FormField label={label} hint={ayudaVisible} error={errorVisible} htmlFor={inputId} descripcionId={descripcionId} className={className}>
      <Input
        {...props}
        id={inputId}
        name={name}
        type="text"
        value={normalizarImei(value)}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={LARGO_IMEI}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        placeholder={placeholder}
        aria-busy={revisando || undefined}
        className={cn('tabular-nums tracking-wide', inputClassName)}
        onChange={(event) => onChange?.(normalizarImei(event.target.value))}
        onBlur={(event) => { setTocado(true); onBlur?.(event) }}
      />
      {estadoVisible ? (
        <p role="status" className={cn('mt-1.5 text-xs', revisando ? 'text-mute' : 'text-ok-text')}>{estadoVisible}</p>
      ) : null}
    </FormField>
  )
}
