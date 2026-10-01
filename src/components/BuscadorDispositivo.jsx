import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Input, Label, Select } from './ui.jsx'
import { PERFILES_DISPOSITIVO, buscarDispositivo, codigoDeDispositivo, limpiarDependientes, nombreDeDispositivo, opcionesDependiente } from '../catalog/dispositivos.js'
import { cn } from '../utils/cn.js'
import useComboboxNavigation from '../hooks/useComboboxNavigation.js'

// Buscador dependiente de dispositivos (#241/#250): se elige el modelo (por
// nombre o código) y recién ahí se despliegan sus variantes —capacidad, color,
// conectividad, marca o categoría— según el **tipo de tienda** (`mobile`,
// `accesorios`, `servicio`) o un perfil propio. Es el patrón de
// `CityAutocomplete` (ciudad → departamento) aplicado a equipos.
//
// Portable: el catálogo y el perfil entran por props (los predeterminados son
// los catálogos de la librería), el valor es controlado y los cambios avisan
// por `onCambio(valor, { campo })`. Cambiar de modelo limpia las variantes que
// ya no aplican.
//
//   <BuscadorDispositivo valor={dispositivo} onCambio={setDispositivo} tipo="mobile" />
export default function BuscadorDispositivo({
  valor = {},
  onCambio,
  tipo = 'mobile',
  perfil,
  catalogo,
  buscarPorCodigo = true,
  permitirLibre = true,
  limite = 8,
  disabled = false,
  etiquetas,
  className,
}) {
  const base = perfil || PERFILES_DISPOSITIVO[tipo] || PERFILES_DISPOSITIVO.mobile
  const config = useMemo(() => ({
    ...base,
    catalogo: { ...(base.catalogo || {}), ...(catalogo || {}) },
    etiquetas: { ...(base.etiquetas || {}), ...(etiquetas || {}) },
  }), [base, catalogo, etiquetas])
  const modelos = config.catalogo.modelos || []
  const campos = config.campos || []
  const etiqueta = (campo) => config.etiquetas?.[campo] || campo.charAt(0).toUpperCase() + campo.slice(1)

  const [texto, setTexto] = useState(() => valor.modelo || '')
  const [abierto, setAbierto] = useState(false)
  const campoId = useId()
  const raiz = useRef(null)

  useEffect(() => { setTexto(valor.modelo || '') }, [valor.modelo])
  useEffect(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      setAbierto(false)
    }
    document.addEventListener('click', cerrarFuera)
    return () => document.removeEventListener('click', cerrarFuera)
  }, [])

  const sugerencias = useMemo(() => buscarDispositivo(modelos, texto, { porCodigo: buscarPorCodigo, limite }), [modelos, texto, buscarPorCodigo, limite])
  const modeloElegido = useMemo(() => {
    const q = String(valor.modelo || '').trim().toLowerCase()
    return modelos.find((modelo) => nombreDeDispositivo(modelo).toLowerCase() === q) || null
  }, [modelos, valor.modelo])

  function emitir(siguiente, campo) {
    onCambio?.(siguiente, campo ? { campo } : undefined)
  }
  function elegir(modelo) {
    emitir(limpiarDependientes(valor, modelo, config))
    setTexto(nombreDeDispositivo(modelo))
    setAbierto(false)
  }
  function confirmarLibre() {
    if (!permitirLibre) return
    const limpio = texto.trim()
    if (!limpio || limpio === valor.modelo) return
    emitir(limpiarDependientes(valor, limpio, config))
  }
  function cambiarDependiente(campo, valorCampo) {
    emitir({ ...valor, [campo]: valorCampo }, campo)
  }
  const listaVisible = abierto && Boolean(texto.trim()) && sugerencias.length > 0
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: setAbierto,
    onSelect: elegir,
    getOptionKey: (modelo) => `${nombreDeDispositivo(modelo)}-${codigoDeDispositivo(modelo)}`,
    listboxId: `${campoId}-lista`,
  })

  function onKeyDown(event) {
    navegacion.inputProps.onKeyDown(event)
    if (event.key === 'Enter' && !event.defaultPrevented) {
      event.preventDefault()
      confirmarLibre()
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div ref={raiz} className="relative">
        <Label htmlFor={campoId}>{etiqueta('modelo')}</Label>
        <Input
          id={campoId}
          ref={navegacion.inputRef}
          type="text"
          role="combobox"
          aria-expanded={listaVisible}
          aria-controls={navegacion.listboxId}
          aria-autocomplete="list"
          aria-activedescendant={navegacion.activeOptionId}
          autoComplete="off"
          disabled={disabled}
          value={texto}
          placeholder={permitirLibre ? 'Buscar por nombre o código…' : 'Buscar modelo…'}
          onChange={(event) => { setTexto(event.target.value); setAbierto(true); navegacion.setActiveIndex(0); if (!event.target.value) emitir(limpiarDependientes(valor, '', config)) }}
          onFocus={() => setAbierto(true)}
          onBlur={() => { setTimeout(() => { setAbierto(false); confirmarLibre() }, 120) }}
          onKeyDown={onKeyDown}
        />
        {listaVisible && (
          <ul {...navegacion.listboxProps} className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-ink-500 bg-ink py-1 shadow-float">
            {sugerencias.map((modelo, indice) => (
              <li
                key={nombreDeDispositivo(modelo)}
                {...navegacion.getOptionProps(indice)}
                className={cn('flex min-h-11 cursor-pointer items-baseline justify-between gap-2 px-3 py-2 text-left text-sm transition', indice === navegacion.activeIndex && 'bg-ink-700')}
              >
                <span className="min-w-0 truncate">{nombreDeDispositivo(modelo)}</span>
                {codigoDeDispositivo(modelo) ? <span className="shrink-0 font-mono text-[11px] text-mute">{codigoDeDispositivo(modelo)}</span> : null}
              </li>
            ))}
          </ul>
        )}
        {abierto && texto.trim() && permitirLibre && sugerencias.length === 0 && (
          <p className="mt-1 text-xs text-mute">No está en el catálogo: se guarda «{texto.trim()}» tal cual.</p>
        )}
      </div>

      {valor.modelo && campos.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {campos.map((campo) => {
            const opciones = opcionesDependiente(modeloElegido, campo, config)
            const id = `${campoId}-${campo}`
            return (
              <div key={campo} className="space-y-1">
                <Label htmlFor={id}>{etiqueta(campo)}</Label>
                <Select id={id} value={valor[campo] || ''} disabled={disabled} onChange={(event) => cambiarDependiente(campo, event.target.value)}>
                  <option value="">Elegir…</option>
                  {opciones.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                </Select>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
