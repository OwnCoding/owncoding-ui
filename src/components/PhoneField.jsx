import { useState } from 'react'
import { Input } from './ui.jsx'
import { CODIGOS_PAIS, telefonoValido, MENSAJE_TELEFONO } from '../utils/telefono.js'

// Teléfono unificado: el código de país es editable (por defecto +595) y el
// número acepta espacios, guiones y paréntesis. Portable: los códigos
// sugeridos se pasan por prop y el mensaje de error es configurable. Los
// helpers puros (`parseTelefono`, `componerTelefono`, `CODIGOS_PAIS`) viven en
// `utils/telefono.js` y también salen por `owncoding-ui/utils`.
//
// Anchos: el código de país entra «+» y hasta `MAX_CODIGO` dígitos (w-24) y el
// número conserva un mínimo legible en vez de comprimirse con `min-w-0`. La
// fila envuelve (`flex-wrap`), así un contenedor corto —el `w-44` de
// `TAMANOS_CAMPO.telefono`, una grilla de dos columnas— manda el número a la
// línea siguiente en lugar de recortarlo.

const MAX_CODIGO = 6
const MAX_NUMERO = 30

function soloDigitos(value) {
  return String(value || '').replace(/\D/g, '').slice(0, MAX_CODIGO)
}

function soloNumero(value) {
  return String(value || '').replace(/[^\d\s()-]/g, '').slice(0, MAX_NUMERO)
}

export default function PhoneField({
  countryCode = '+595',
  phone = '',
  onChange,
  onCountryCodeChange,
  disabled = false,
  placeholder = '981 123 456',
  countryAriaLabel = 'Código de país',
  phoneAriaLabel = 'Teléfono',
  codigos = CODIGOS_PAIS,
  mensajeInvalido = MENSAJE_TELEFONO,
  id = 'telefono-codigos',
  className,
}) {
  // El mensaje aparece recién cuando el usuario sale del campo (touched):
  // mientras escribe no lo interrumpimos.
  const [tocado, setTocado] = useState(false)
  const invalido = tocado && Boolean(String(phone).trim()) && !telefonoValido(phone, countryCode)
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          inputMode="numeric"
          list={id}
          disabled={disabled}
          value={`+${soloDigitos(countryCode)}`}
          onChange={(event) => onCountryCodeChange?.(`+${soloDigitos(event.target.value)}`)}
          aria-label={countryAriaLabel}
          className="w-24 shrink-0 text-center"
        />
        <datalist id={id}>
          {codigos.map((codigo) => <option key={codigo} value={codigo} />)}
        </datalist>
        <Input
          type="tel"
          inputMode="tel"
          maxLength={MAX_NUMERO}
          disabled={disabled}
          value={phone}
          onChange={(event) => onChange?.(soloNumero(event.target.value))}
          placeholder={placeholder}
          aria-label={phoneAriaLabel}
          onBlur={() => setTocado(true)}
          className="min-w-[8.5rem] flex-1"
        />
      </div>
      {invalido && <span className="block pt-1 text-[11px] text-bad-text">{mensajeInvalido}</span>}
    </div>
  )
}
