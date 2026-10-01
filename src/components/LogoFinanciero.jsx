import { useState } from 'react'
import { cn } from '../utils/cn.js'

function fuenteDe(visual, baseAssets) {
  if (!visual?.archivo) return null
  if (typeof baseAssets === 'string' && baseAssets) {
    return `${baseAssets.replace(/\/$/, '')}/${visual.archivo}`
  }
  return visual.asset || visual.archivo
}

function Monograma({ iniciales, color, compacto }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid place-items-center rounded-[5px] px-1 text-[9px] font-bold leading-none tracking-tight text-white',
        compacto ? 'h-full w-full' : 'h-full min-w-[1.15rem]',
      )}
      style={{ backgroundColor: color }}
    >
      {iniciales}
    </span>
  )
}

// Render común para bancos y marcas de pago. La entrada ya viene resuelta por
// la utilidad pura correspondiente; el componente solo aplica presentación y
// fallback seguro ante un asset ausente o roto.
export default function LogoFinanciero({
  nombre,
  registro,
  alto = 'h-5',
  className,
  baseAssets,
  marcas = {},
  soloCatalogo = false,
  decorativo = false,
}) {
  const [assetFallido, setAssetFallido] = useState(null)
  if (!registro || (soloCatalogo && registro.generico)) return null

  const compacto = registro.variante === 'compacto'
  const visual = registro.visual || { tipo: 'monograma', estado: 'fallback' }
  const fuente = fuenteDe(visual, baseAssets)
  const fallo = fuente && assetFallido === fuente
  const iniciales = registro.iniciales || '?'
  const color = registro.color || '#33414F'
  const etiqueta = registro.banco || registro.marca || nombre
  const semantica = decorativo
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': etiqueta }

  const marcaPersonalizada = registro.marca && marcas[registro.marca]
  if (marcaPersonalizada) {
    const Logo = marcaPersonalizada
    return (
      <span
        {...semantica}
        className={cn('inline-flex items-center', compacto && 'aspect-square justify-center', alto, className)}
        data-logo-estado={visual.estado || registro.estado}
        data-logo-variante={registro.variante}
      >
        <Logo />
      </span>
    )
  }

  if (fuente && !fallo && (visual.tipo === 'archivo' || visual.tipo === 'horizontal-contained')) {
    return (
      <span
        {...semantica}
        className={cn(
          'inline-flex items-center',
          compacto && 'aspect-square shrink-0 justify-center overflow-hidden rounded-[5px]',
          visual.fondo && visual.padding && 'rounded-md p-1',
          alto,
          className,
        )}
        style={visual.fondo ? { backgroundColor: visual.fondo } : undefined}
        data-logo-estado={visual.estado || registro.estado}
        data-logo-variante={registro.variante}
        data-logo-tipo={visual.tipo}
      >
        <img
          src={fuente}
          alt=""
          loading="lazy"
          onError={() => setAssetFallido(fuente)}
          className={cn(
            'object-contain',
            compacto ? 'h-full w-full' : 'h-full w-auto max-w-[8rem]',
            registro.chip && 'rounded-[4px] bg-white px-1 py-[1px]',
          )}
        />
      </span>
    )
  }

  if (!compacto && visual.tipo === 'texto') {
    return (
      <span
        {...semantica}
        className={cn('inline-flex items-center gap-1.5 whitespace-nowrap', alto, className)}
        data-logo-estado={visual.estado || registro.estado}
        data-logo-variante={registro.variante}
        data-logo-tipo="texto"
      >
        <Monograma iniciales={iniciales} color={color} compacto={false} />
        <span aria-hidden="true" className="text-xs font-semibold leading-none text-current">{etiqueta}</span>
      </span>
    )
  }

  return (
    <span
      {...semantica}
      className={cn('inline-flex items-center', compacto && 'aspect-square shrink-0', alto, className)}
      data-logo-estado={visual.estado || registro.estado}
      data-logo-variante={registro.variante}
      data-logo-tipo="monograma"
    >
      <Monograma iniciales={iniciales} color={color} compacto={compacto} />
    </span>
  )
}
