import { useMemo, useState } from 'react'
import { Input } from './ui.jsx'
import CountryPhoneSelect from './CountryPhoneSelect.jsx'
import { cn } from '../utils/cn.js'
import { paisTelefonoPorIso, paisesDeCodigo, resolverPaisesTelefono } from '../utils/paisesTelefono.js'
import {
  MENSAJE_TELEFONO,
  codigoPais,
  parseTelefonoInternacional,
  telefonoE164,
  telefonoInternacionalValido,
  telefonoValido,
} from '../utils/telefono.js'

// Campo internacional compatible con la API histórica: `onChange` sigue
// entregando solamente la parte local y `onCountryCodeChange` el DDI. La API
// aditiva expone ISO y E.164 sin obligar a migrar consumidores existentes.
const MAX_NUMERO = 30

function soloNumero(value) {
  return String(value || '').replace(/[^\d\s()-]/g, '').slice(0, MAX_NUMERO)
}

function catalogoDelCampo(countries, codigos, locale) {
  if (countries) return resolverPaisesTelefono(countries, locale)
  const catalogo = resolverPaisesTelefono(undefined, locale)
  if (!codigos) return catalogo
  const permitidos = new Set(codigos.map((codigo) => codigoPais(codigo)).filter(Boolean))
  return catalogo.filter((pais) => permitidos.has(pais.countryCode))
}

export default function PhoneField({
  countryCode = '+595',
  country,
  phone = '',
  onChange,
  onCountryCodeChange,
  onCountryChange,
  onInternationalChange,
  countries,
  locale = 'es',
  searchPlaceholder = 'Buscar país o código',
  autoComplete = 'tel',
  name,
  inputProps,
  disabled = false,
  placeholder = '981 123 456',
  countryAriaLabel = 'Código de país',
  phoneAriaLabel = 'Teléfono',
  codigos,
  mensajeInvalido = MENSAJE_TELEFONO,
  id = 'telefono-codigos',
  className,
}) {
  const catalog = useMemo(() => catalogoDelCampo(countries, codigos, locale), [codigos, countries, locale])
  const paisControlado = country === undefined ? null : paisTelefonoPorIso(country, locale)
  const codigoSolicitado = codigoPais(countryCode) || '+595'
  const codigoControlado = paisControlado?.countryCode || codigoSolicitado
  const paisesCompatibles = paisesDeCodigo(codigoControlado, locale, catalog)
  const paisDesconocido = !paisControlado && paisesCompatibles.length === 0
    ? {
        country: `ZZ-${codigoControlado.replace(/\D/g, '')}`,
        countryCode: codigoControlado,
        name: `Código internacional ${codigoControlado}`,
        flag: '🌐',
        custom: true,
      }
    : null
  const [paisInterno, setPaisInterno] = useState(() => (
    paisControlado?.country || paisesCompatibles[0]?.country || paisDesconocido?.country || 'PY'
  ))
  const paisInternoCompatible = paisTelefonoPorIso(paisInterno, locale)?.countryCode === codigoControlado
  const paisSeleccionado = paisControlado?.country
    || (paisDesconocido ? paisDesconocido.country : null)
    || (paisInternoCompatible ? paisInterno : paisesCompatibles[0]?.country)
    || 'PY'
  const [tocado, setTocado] = useState(false)
  const invalido = tocado && Boolean(String(phone).trim()) && !(paisDesconocido
    ? telefonoValido(phone, codigoControlado)
    : telefonoInternacionalValido(phone, paisSeleccionado))
  const errorId = `${id}-error`
  const {
    className: inputClassName,
    onBlur: inputOnBlur,
    'aria-describedby': inputDescribedBy,
    ...safeInputProps
  } = inputProps || {}
  const describedBy = [inputDescribedBy, invalido ? errorId : ''].filter(Boolean).join(' ') || undefined

  const emitirInternacional = (local, iso, estado) => {
    if (!onInternationalChange) return
    if (iso === paisDesconocido?.country || !paisTelefonoPorIso(iso, locale)) {
      onInternationalChange('', {
        country: '',
        countryCode: estado?.countryCode || codigoControlado,
        phone: local,
        isValid: false,
      })
      return
    }
    const countryData = paisTelefonoPorIso(iso, locale) || paisTelefonoPorIso('PY', locale)
    const e164 = estado?.e164 ?? telefonoE164(local, countryData.country)
    const isValid = estado?.isValid ?? Boolean(e164)
    onInternationalChange(isValid ? e164 : '', {
      country: countryData.country,
      countryCode: estado?.countryCode || countryData.countryCode,
      phone: local,
      isValid,
    })
  }

  const cambiarPais = (iso) => {
    if (iso === paisDesconocido?.country) {
      setPaisInterno(iso)
      onCountryChange?.('')
      emitirInternacional(phone, iso, { countryCode: codigoControlado, isValid: false, e164: '' })
      return
    }
    const siguiente = paisTelefonoPorIso(iso, locale)
    if (!siguiente) return
    setPaisInterno(siguiente.country)
    onCountryChange?.(siguiente.country)
    if (siguiente.countryCode !== codigoControlado) onCountryCodeChange?.(siguiente.countryCode)
    emitirInternacional(phone, siguiente.country)
  }

  const cambiarNumero = (event) => {
    const raw = event.target.value
    if (/^(\+|00)/.test(raw.trimStart())) {
      const parsed = parseTelefonoInternacional(raw, paisDesconocido ? '' : paisSeleccionado, codigoControlado)
      const siguientePais = parsed.country || (parsed.countryCode === codigoControlado ? paisDesconocido?.country : '')
      if (siguientePais) setPaisInterno(siguientePais)
      onCountryChange?.(parsed.country)
      if (parsed.countryCode !== codigoControlado) onCountryCodeChange?.(parsed.countryCode)
      onChange?.(parsed.phone)
      emitirInternacional(parsed.phone, parsed.country, parsed)
      return
    }
    const local = soloNumero(raw)
    onChange?.(local)
    emitirInternacional(local, paisSeleccionado)
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <CountryPhoneSelect
          id={`${id}-pais`}
          country={paisSeleccionado}
          customCountry={paisDesconocido}
          onChange={cambiarPais}
          countries={catalog}
          locale={locale}
          disabled={disabled}
          ariaLabel={countryAriaLabel}
          searchPlaceholder={searchPlaceholder}
        />
        <Input
          {...safeInputProps}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          name={name}
          maxLength={MAX_NUMERO}
          disabled={disabled}
          value={phone}
          onChange={cambiarNumero}
          placeholder={placeholder}
          aria-label={phoneAriaLabel}
          aria-invalid={invalido || undefined}
          aria-describedby={describedBy}
          onBlur={(event) => {
            setTocado(true)
            inputOnBlur?.(event)
          }}
          className={cn('min-w-[8.5rem] flex-1', inputClassName)}
        />
      </div>
      {invalido ? <span id={errorId} role="alert" className="block pt-1 text-[11px] text-bad-text">{mensajeInvalido}</span> : null}
    </div>
  )
}
