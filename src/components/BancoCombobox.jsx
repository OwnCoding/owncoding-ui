import { useEffect, useMemo, useRef, useState } from 'react'
import { BANCOS_PARAGUAY, normalizarBanco, sugerenciasDeBanco } from '../utils/bancos.js'
import { Input } from './ui.jsx'
import BancoLogo from './BancoLogo.jsx'
import { cn } from '../utils/cn.js'
import useComboboxNavigation from '../hooks/useComboboxNavigation.js'

// Campo de banco con sugerencias ilustradas: al abrir muestra el catálogo
// completo (lista scrollable) y mientras se escribe filtra al instante.
// Mantiene el contrato del campo de texto: entrega el string por onChange.
// El catálogo por defecto es el de Paraguay (`BANCOS_PARAGUAY`).
export default function BancoCombobox({
  id,
  value = '',
  onChange,
  onSelect,
  required = false,
  disabled = false,
  placeholder,
  className,
  catalogo = BANCOS_PARAGUAY,
  logoProps,
}) {
  const [abierto, setAbierto] = useState(false)
  const raiz = useRef(null)

  useEffect(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return
      setAbierto(false)
    }
    document.addEventListener('click', cerrarFuera)
    return () => document.removeEventListener('click', cerrarFuera)
  }, [])

  const sugerencias = useMemo(() => sugerenciasDeBanco(value, catalogo), [value, catalogo])

  function elegir(banco) {
    onChange?.(banco)
    onSelect?.(banco)
    setAbierto(false)
  }

  const listaVisible = abierto && sugerencias.length > 0
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: setAbierto,
    onSelect: elegir,
    getOptionKey: (banco) => banco,
  })

  return (
    <div ref={raiz} className={cn('relative', className)}>
      <Input
        id={id}
        ref={navegacion.inputRef}
        role="combobox"
        aria-expanded={listaVisible}
        aria-controls={navegacion.listboxId}
        aria-autocomplete="list"
        aria-activedescendant={navegacion.activeOptionId}
        autoComplete="off"
        required={required}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(event) => { onChange?.(event.target.value); setAbierto(true); navegacion.setActiveIndex(0) }}
        onFocus={() => setAbierto(true)}
        onKeyDown={navegacion.inputProps.onKeyDown}
      />
      {listaVisible && (
        <ul
          {...navegacion.listboxProps}
          aria-label="Bancos"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float"
        >
          {sugerencias.map((banco, indice) => (
            <li
              key={banco}
              {...navegacion.getOptionProps(indice)}
              className={cn(
                'flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition',
                indice === navegacion.activeIndex ? 'bg-ink-700 text-fore' : 'text-mute hover:bg-ink-700 hover:text-fore',
              )}
            >
              <BancoLogo banco={banco} variante="compacto" alto="h-4" decorativo {...logoProps} />
              <span className="min-w-0 flex-1 truncate">{banco}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { normalizarBanco }
