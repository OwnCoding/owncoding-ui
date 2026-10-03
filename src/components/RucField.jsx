import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Badge, Input } from './ui.jsx'
import BotonDentroCampo from './BotonDentroCampo.jsx'
import { cn } from '../utils/cn.js'

// Preserve synchronous client invalidation without invoking layout effects in SSR.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const LARGO_MAXIMO_RUC = 10

// RUC paraguayo editable: hasta 8 dígitos de base y, opcionalmente, un
// verificador. Si llega un noveno dígito sin guion (teclado numérico o pegado),
// lo formatea como verificador para que la UX móvil no dependa de una tecla "-".
function sanitizarRuc(value) {
  const entrada = String(value ?? '')
  const indiceGuion = entrada.indexOf('-')

  if (indiceGuion >= 0) {
    const base = entrada.slice(0, indiceGuion).replace(/\D/g, '').slice(0, 8)
    if (!base) return entrada.replace(/\D/g, '').slice(0, 8)
    const verificador = entrada.slice(indiceGuion + 1).replace(/\D/g, '').slice(0, 1)
    return `${base}-${verificador}`
  }

  const digitos = entrada.replace(/\D/g, '').slice(0, 9)
  return digitos.length > 8 ? `${digitos.slice(0, 8)}-${digitos[8]}` : digitos
}

// Campo RUC único del grupo: input con el botón **Extraer** adentro (trailing,
// con tooltip y estado «Consultando…») contra la consulta que pasa la app
// (`consultar` async → `{ name, fullRuc, simulado? }`). El resultado se ofrece
// con «Usar estos datos»: nunca pisa lo cargado sin confirmación y, si el
// proveedor no responde, el dato se completa a mano. La librería no consulta
// nada por su cuenta: sin `consultar` el botón no se muestra.
export default function RucField({
  id,
  value,
  onChange,
  onAplicar,
  consultar,
  disabled = false,
  consultarDisabled = false,
  mostrarExtractor = true,
  maxLength,
  maxBaseDigits = 8,
  placeholder = '80012345-6',
  autoComplete = 'off',
  ariaLabel,
  textoAyuda = 'La razón social se aplica solo si la confirmás.',
  className,
  ...inputProps
}) {
  const generado = useId()
  const inputId = id || generado
  const ayudaId = `${inputId}-ayuda`
  const errorId = `${inputId}-error`
  const [resultado, setResultado] = useState(null)
  const [consultando, setConsultando] = useState(false)
  const [error, setError] = useState('')
  const strictNine = maxBaseDigits === 9
  const limit = Math.min(strictNine ? 11 : LARGO_MAXIMO_RUC, Math.max(1, Number(maxLength) || (strictNine ? 11 : LARGO_MAXIMO_RUC)))
  // Nine-digit mode preserves exact controlled identity; malformed input never retargets lookup.
  const rucSanitizado = strictNine ? String(value ?? '') : sanitizarRuc(value).slice(0, limit)
  const hayRuc = strictNine ? /^[1-9][0-9]{0,8}(-[0-9])?$/.test(rucSanitizado) : Boolean(rucSanitizado)
  const puedeExtraer = mostrarExtractor && typeof consultar === 'function'

  const requestGeneration = useRef(0)
  const mounted = useRef(true)
  const currentScope = useRef(null)
  currentScope.current = { query: rucSanitizado, provider: consultar, disabled, consultarDisabled, puedeExtraer }

  function invalidateLookup() {
    requestGeneration.current += 1
    setConsultando(false)
    setResultado(null)
    setError('')
  }

  // Controlled updates and provider replacement invalidate even without an input event.
  useIsomorphicLayoutEffect(() => {
    invalidateLookup()
  }, [rucSanitizado, consultar, disabled, consultarDisabled, puedeExtraer])

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; requestGeneration.current += 1 }
  }, [])

  async function extraer() {
    const ruc = rucSanitizado
    if (!ruc || consultando || !puedeExtraer || disabled || consultarDisabled) return
    const generation = ++requestGeneration.current
    const provider = consultar
    const isCurrent = () => {
      const scope = currentScope.current
      return mounted.current && generation === requestGeneration.current &&
        scope.query === ruc && scope.provider === provider &&
        !scope.disabled && !scope.consultarDisabled && scope.puedeExtraer
    }
    setConsultando(true); setError(''); setResultado(null)
    try {
      const datos = await provider(ruc)
      if (!isCurrent()) return
      if (!datos?.name) throw new Error('No encontramos datos para ese RUC.')
      setResultado(datos)
    } catch (causa) {
      if (isCurrent()) setError(causa?.message || 'No se pudo consultar el RUC. Podés completar los datos manualmente.')
    } finally { if (isCurrent()) setConsultando(false) }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input
          {...inputProps}
          id={inputId}
          aria-label={ariaLabel}
          aria-describedby={[inputProps['aria-describedby'], puedeExtraer && textoAyuda ? ayudaId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
          aria-invalid={inputProps['aria-invalid'] ?? (error ? true : undefined)}
          className={puedeExtraer ? (consultando ? 'pr-32' : 'pr-11') : undefined}
          type="text"
          inputMode="numeric"
          pattern={strictNine ? "[1-9][0-9]{0,8}(-[0-9])?" : "[0-9]{0,8}(-[0-9]?)?"}
          spellCheck={false}
          maxLength={limit}
          autoComplete={autoComplete}
          disabled={disabled}
          value={rucSanitizado}
          onChange={(event) => { invalidateLookup(); onChange?.(strictNine ? event.target.value : sanitizarRuc(event.target.value)) }}
          onPaste={event => {
            inputProps.onPaste?.(event)
            if (!strictNine || event.defaultPrevented) return
            event.preventDefault()
            const input = event.currentTarget
            const candidate = rucSanitizado.slice(0, input.selectionStart ?? 0) + event.clipboardData.getData('text') + rucSanitizado.slice(input.selectionEnd ?? rucSanitizado.length)
            if (candidate.length <= limit && (!candidate || /^[1-9][0-9]{0,8}(-[0-9]?)?$/.test(candidate))) {
              invalidateLookup(); onChange?.(candidate)
            }
          }}
          placeholder={placeholder}
        />
        {puedeExtraer && (
          <BotonDentroCampo
            etiqueta="Extraer los datos del RUC"
            titulo={hayRuc ? 'Extraer los datos del RUC' : 'Ingresá el RUC para extraer los datos'}
            etiquetaOcupada="Consultando…"
            disabled={disabled || consultarDisabled || !hayRuc}
            ocupado={consultando}
            onClick={extraer}
          />
        )}
      </div>
      {puedeExtraer && textoAyuda && <span id={ayudaId} className="block text-xs text-mute">{textoAyuda}</span>}
      {resultado && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fono/25 bg-fono/5 p-3 text-sm">
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <b className="truncate">{resultado.name}</b>
              {resultado.simulado && <Badge color="blue">Simulada en demo</Badge>}
            </span>
            <span className="block text-mute">RUC {resultado.fullRuc}</span>
            {resultado.simulado && <span className="block text-xs text-mute">Resultado ficticio: la demo no consulta registros reales.</span>}
          </span>
          <button type="button" className="min-h-11 rounded-lg px-2 font-semibold text-fono-light" onClick={() => { onAplicar?.(resultado); setResultado(null) }}>Usar estos datos</button>
        </div>
      )}
      {error && <p id={errorId} role="alert" className="text-sm text-bad-text">{error}</p>}
    </div>
  )
}
