import { useId, useState } from 'react'
import { Badge, Input } from './ui.jsx'
import BotonDentroCampo from './BotonDentroCampo.jsx'
import { cn } from '../utils/cn.js'

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
  maxLength = LARGO_MAXIMO_RUC,
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
  const rucSanitizado = sanitizarRuc(value).slice(0, Math.min(LARGO_MAXIMO_RUC, Math.max(1, Number(maxLength) || LARGO_MAXIMO_RUC)))
  const hayRuc = Boolean(rucSanitizado)
  const puedeExtraer = mostrarExtractor && typeof consultar === 'function'

  async function extraer() {
    const ruc = rucSanitizado
    if (!ruc || consultando || !puedeExtraer) return
    setConsultando(true); setError(''); setResultado(null)
    try {
      const datos = await consultar(ruc)
      if (!datos?.name) throw new Error('No encontramos datos para ese RUC.')
      setResultado(datos)
    } catch (causa) {
      setError(causa?.message || 'No se pudo consultar el RUC. Podés completar los datos manualmente.')
    } finally { setConsultando(false) }
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
          pattern="[0-9]{0,8}(-[0-9]?)?"
          spellCheck={false}
          maxLength={Math.min(LARGO_MAXIMO_RUC, Math.max(1, Number(maxLength) || LARGO_MAXIMO_RUC))}
          autoComplete={autoComplete}
          disabled={disabled}
          value={rucSanitizado}
          onChange={(event) => { onChange?.(sanitizarRuc(event.target.value)); setResultado(null); setError('') }}
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
