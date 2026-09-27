import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input } from './ui.jsx'
import Icon from './Icon.jsx'
import TarjetaCuentaCobro from './TarjetaCuentaCobro.jsx'
import {
  LIMITE_CUENTAS,
  etiquetaMedioCuenta,
  filtrarCuentasCobro,
  iconoMedioCuenta,
  numeroParcialCuenta,
  preseleccionDeCuenta,
  simboloCuenta,
} from '../utils/cuentaCobro.js'
import { ventanaDeLista } from '../utils/ventana.js'
import { cn } from '../utils/cn.js'

// Alto de fila de la lista: la virtualización calcula la ventana con este
// valor y, al montar, se corrige con la fila real (zoom o tipografía del
// dispositivo). El respaldo de la vista es el `max-h` del contenedor.
const ALTO_OPCION = 48
const ALTO_VISTA = 224
const MARGEN = 2

// Selector de cuenta de cobro (#262): sin cuenta elegida es el buscador
// contextual (filtra por nombre, banco/procesadora, titular, número, medio y
// moneda); al elegir **colapsa el buscador** y muestra **una sola tarjeta**
// limpia con la acción «Cambiar cuenta», que reabre la búsqueda. Portable: las
// cuentas entran por props y el elegido se avisa por `onSelect(cuenta)`.
//
// Preselección (#262): con `preseleccionar` el selector propone solo la última
// cuenta usada (`ultimoUsadoId`) o, si no hay, la predeterminada
// (`predeterminadaId`) —la app guarda el último uso— y avisa por `onSelect`.
//
// Lista larga (#262): hasta `limite` cuentas (100 por defecto) con scroll y
// **virtualización**: solo se montan las filas visibles (más un margen), así la
// lista queda estable en mobile; las flechas mueven el resaltado sin arrastrar
// la página (`aria-posinset`/`aria-setsize` mantienen la posición real).
//
//   <SelectorCuentaCobro
//     cuentas={accounts}
//     cuentaId={payment.accountId}
//     onSelect={(cuenta) => onChange({ accountId: cuenta?.id || '' })}
//     preseleccionar
//     ultimoUsadoId={preferenciaPos('cuenta')}
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
  limite = LIMITE_CUENTAS,
  incluirInactivas = false,
  preseleccionar = false,
  ultimoUsadoId = '',
  predeterminadaId = '',
  disabled = false,
  testId = 'cuenta-cobro',
  className,
}) {
  const [eligiendo, setEligiendo] = useState(!cuentaId)
  const [consulta, setConsulta] = useState('')
  const [resaltado, setResaltado] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [altoVista, setAltoVista] = useState(ALTO_VISTA)
  const [altoOpcion, setAltoOpcion] = useState(ALTO_OPCION)
  const listaId = useId()
  const raiz = useRef(null)
  const lista = useRef(null)

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
    setScrollTop(0)
  }, [idSeleccionado])

  // Preselección (#262): sin cuenta elegida se propone la última usada o la
  // predeterminada. Se avisa una sola vez por cuenta propuesta: si la pantalla
  // ignora el aviso, no se repite en cada render.
  const sugeridaRef = useRef('')
  useEffect(() => {
    if (!preseleccionar) return
    if (idSeleccionado) { sugeridaRef.current = ''; return }
    const sugerida = preseleccionDeCuenta(cuentas, { ultimoUsadoId, predeterminadaId, incluirInactivas })
    if (!sugerida || sugerida.id === sugeridaRef.current) return
    sugeridaRef.current = sugerida.id
    onSelect?.(sugerida)
  }, [preseleccionar, idSeleccionado, cuentas, ultimoUsadoId, predeterminadaId, incluirInactivas, onSelect])

  // Clic afuera: se limpia la consulta y, si había una cuenta, vuelve la tarjeta.
  // Solo hace falta mientras se busca: en modo tarjeta el clic de «Cambiar
  // cuenta» reabre la búsqueda y este oyente (montado después del clic) no debe
  // volver a cerrarla.
  useEffect(() => {
    if (!eligiendo) return undefined
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      setConsulta('')
      setScrollTop(0)
      if (idSeleccionado) setEligiendo(false)
    }
    document.addEventListener('click', cerrarFuera)
    return () => document.removeEventListener('click', cerrarFuera)
  }, [eligiendo, idSeleccionado])

  const resultados = useMemo(
    () => filtrarCuentasCobro(cuentas, consulta, { limite, incluirInactivas }),
    [cuentas, consulta, limite, incluirInactivas],
  )
  const listaVisible = eligiendo && !disabled && resultados.length > 0
  const ventana = useMemo(
    () => ventanaDeLista({ total: resultados.length, scrollTop, altoVista, altoFila: altoOpcion, margen: MARGEN }),
    [resultados.length, scrollTop, altoVista, altoOpcion],
  )
  const visibles = resultados.slice(ventana.inicio, ventana.fin)

  // Medición real (fila y vista) para que la ventana coincida con lo pintado.
  useEffect(() => {
    const nodo = lista.current
    if (!nodo) return
    const fila = nodo.querySelector('[role="option"]')?.getBoundingClientRect().height
    if (fila && Math.round(fila) !== altoOpcion) setAltoOpcion(Math.round(fila))
    if (nodo.clientHeight > 0 && nodo.clientHeight !== altoVista) setAltoVista(nodo.clientHeight)
  }, [listaVisible, consulta, altoOpcion, altoVista])

  // El resaltado se mantiene a la vista desplazando solo la lista (nunca la
  // página): es lo que hacía saltar la pantalla con las flechas.
  useEffect(() => {
    if (!listaVisible) return
    const nodo = lista.current
    if (!nodo) return
    const arriba = resaltado * altoOpcion
    const abajo = arriba + altoOpcion
    if (arriba < nodo.scrollTop) nodo.scrollTop = arriba
    else if (abajo > nodo.scrollTop + nodo.clientHeight) nodo.scrollTop = abajo - nodo.clientHeight
  }, [resaltado, listaVisible, altoOpcion])

  function elegir(cuenta) {
    onSelect?.(cuenta)
    setEligiendo(false)
    setConsulta('')
    setResaltado(0)
    setScrollTop(0)
  }

  function alEscribir(event) {
    setConsulta(event.target.value)
    setResaltado(0)
    setScrollTop(0)
    if (lista.current) lista.current.scrollTop = 0
  }

  function alDesplazar(event) {
    setScrollTop(event.currentTarget.scrollTop)
    if (event.currentTarget.clientHeight > 0) setAltoVista(event.currentTarget.clientHeight)
  }

  function alTeclear(event) {
    if (event.key === 'Escape') {
      setConsulta('')
      setScrollTop(0)
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
        onChange={alEscribir}
        onFocus={() => setEligiendo(true)}
        onKeyDown={alTeclear}
      />
      {listaVisible && (
        <ul
          ref={lista}
          id={listaId}
          role="listbox"
          aria-label="Cuentas de cobro"
          onScroll={alDesplazar}
          style={{
            paddingTop: 4 + ventana.inicio * altoOpcion,
            paddingBottom: 4 + Math.max(0, resultados.length - ventana.fin) * altoOpcion,
          }}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[min(60vh,18rem)] overflow-y-auto overscroll-contain rounded-xl border border-ink-500 bg-ink p-1 shadow-float"
        >
          {visibles.map((cuenta, posicion) => {
            const indice = ventana.inicio + posicion
            const logoCuenta = typeof logo === 'function' ? logo(cuenta) : null
            const dato = [cuenta.holder, cuenta.accountNumber ? numeroParcialCuenta(cuenta.accountNumber) : null].filter(Boolean).join(' · ')
            return (
              <li
                key={cuenta.id}
                id={`${listaId}-${indice}`}
                role="option"
                aria-selected={indice === resaltado}
                aria-posinset={indice + 1}
                aria-setsize={resultados.length}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setResaltado(indice)}
                onClick={() => elegir(cuenta)}
                className={cn(
                  'flex h-12 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm transition',
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
