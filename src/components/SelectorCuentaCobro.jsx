import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import Icon from './Icon.jsx'
import TarjetaCuentaCobro from './TarjetaCuentaCobro.jsx'
import { etiquetaMedioCuenta, filtrarCuentasCobro, iconoMedioCuenta, numeroParcialCuenta, simboloCuenta } from '../utils/cuentaCobro.js'
import { cn } from '../utils/cn.js'

// Selector de cuenta de cobro (#262): sin cuenta elegida es el buscador
// contextual (filtra por nombre, banco/procesadora, titular, número, medio y
// moneda); al elegir **colapsa el buscador** y muestra **una sola tarjeta**
// limpia con la acción «Cambiar cuenta», que reabre la búsqueda. Portable: las
// cuentas entran por props y el elegido se avisa por `onSelect(cuenta)`.
//
//   <SelectorCuentaCobro
//     cuentas={accounts}
//     cuentaId={payment.accountId}
//     onSelect={(cuenta) => onChange({ accountId: cuenta?.id || '' })}
//     saldoPendientePyg={pendientePyg}
//     cotizacionPyg={Number(payment.exchangeRatePyg) || 0}
//     logo={(cuenta) => <BancoLogo banco={cuenta.bank} alto="h-4" />}
//   />
export default function SelectorCuentaCobro({
  cuentas = [],
  cuentaId = '',
  onSelect,
  onCambiar,
  saldoPendientePyg = 0,
  cotizacionPyg = 0,
  logo,
  detalle,
  textoCambiar = 'Cambiar cuenta',
  placeholder = 'Buscar cuenta…',
  ariaLabel = 'Cuenta de cobro',
  vacio = 'Sin cuentas que coincidan.',
  limite = 8,
  incluirInactivas = false,
  disabled = false,
  testId = 'cuenta-cobro',
  className,
}) {
  const [eligiendo, setEligiendo] = useState(!cuentaId)
  const [consulta, setConsulta] = useState('')
  const [resaltado, setResaltado] = useState(0)
  const listaId = useId()
  const raiz = useRef(null)

  const seleccionada = useMemo(
    () => (Array.isArray(cuentas) ? cuentas : []).find((cuenta) => cuenta.id === cuentaId) || null,
    [cuentas, cuentaId],
  )
  const idSeleccionado = seleccionada?.id || ''

  // El estado sigue a la selección: con cuenta elegida se muestra la tarjeta;
  // «Cambiar cuenta» reabre el buscador y elegir otra lo vuelve a colapsar.
  useEffect(() => {
    setEligiendo(!idSeleccionado)
    setConsulta('')
  }, [idSeleccionado])

  // Clic afuera: se limpia la consulta y, si había una cuenta, vuelve la tarjeta.
  useEffect(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      setConsulta('')
      if (idSeleccionado) setEligiendo(false)
    }
    document.addEventListener('click', cerrarFuera)
    return () => document.removeEventListener('click', cerrarFuera)
  }, [idSeleccionado])

  const resultados = useMemo(
    () => filtrarCuentasCobro(cuentas, consulta, { limite, incluirInactivas }),
    [cuentas, consulta, limite, incluirInactivas],
  )
  const listaVisible = eligiendo && !disabled && resultados.length > 0

  useEffect(() => {
    if (!listaVisible) return
    raiz.current?.querySelector(`#${CSS.escape(`${listaId}-${resaltado}`)}`)?.scrollIntoView({ block: 'nearest' })
  }, [listaVisible, resaltado, listaId])

  function elegir(cuenta) {
    onSelect?.(cuenta)
    setEligiendo(false)
    setConsulta('')
    setResaltado(0)
  }

  function alTeclear(event) {
    if (event.key === 'Escape') {
      setConsulta('')
      if (idSeleccionado) setEligiendo(false)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!resultados.length) return
      const paso = event.key === 'ArrowDown' ? 1 : -1
      setResaltado((actual) => (actual + paso + resultados.length) % resultados.length)
      return
    }
    if (event.key === 'Enter' && listaVisible && resultados[resaltado]) {
      event.preventDefault()
      elegir(resultados[resaltado])
    }
  }

  if (seleccionada && !eligiendo) {
    return (
      <TarjetaCuentaCobro
        cuenta={seleccionada}
        logo={typeof logo === 'function' ? logo(seleccionada) : logo}
        detalle={typeof detalle === 'function' ? detalle(seleccionada) : detalle}
        saldoPendientePyg={saldoPendientePyg}
        cotizacionPyg={cotizacionPyg}
        onCambiar={() => { setEligiendo(true); onCambiar?.() }}
        textoCambiar={textoCambiar}
        testId={testId}
        className={className}
      />
    )
  }

  return (
    <div ref={raiz} className={cn('relative', className)}>
      <Input
        role="combobox"
        aria-expanded={listaVisible}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-activedescendant={listaVisible ? `${listaId}-${resaltado}` : undefined}
        aria-label={ariaLabel}
        autoComplete="off"
        disabled={disabled}
        value={consulta}
        placeholder={placeholder}
        data-testid={`${testId}-buscar`}
        onChange={(event) => { setConsulta(event.target.value); setResaltado(0) }}
        onFocus={() => setEligiendo(true)}
        onKeyDown={alTeclear}
      />
      {listaVisible && (
        <ul
          id={listaId}
          role="listbox"
          aria-label="Cuentas de cobro"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float"
        >
          {resultados.map((cuenta, indice) => {
            const logoCuenta = typeof logo === 'function' ? logo(cuenta) : null
            const dato = [cuenta.holder, cuenta.accountNumber ? numeroParcialCuenta(cuenta.accountNumber) : null].filter(Boolean).join(' · ')
            return (
              <li
                key={cuenta.id}
                id={`${listaId}-${indice}`}
                role="option"
                aria-selected={indice === resaltado}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setResaltado(indice)}
                onClick={() => elegir(cuenta)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition',
                  indice === resaltado ? 'bg-fono/10 text-fore' : 'text-mute hover:bg-ink-700/60 hover:text-fore',
                )}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-800">
                  {logoCuenta || <Icon name={iconoMedioCuenta(cuenta.kind)} className="h-3.5 w-3.5 text-fono-light" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-fore">{cuenta.name}</span>
                  <span className="block truncate text-xs text-mute">
                    {[etiquetaMedioCuenta(cuenta.kind), simboloCuenta(cuenta.currency, cuenta.currencyLabel), dato].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
      {eligiendo && !disabled && !resultados.length && consulta ? <p className="mt-1 text-xs text-mute">{vacio}</p> : null}
    </div>
  )
}
