import { logoDeMedioPago } from '../financial/resolvers.js'
import LogoFinanciero from './LogoFinanciero.jsx'

// Marca visual de una red, procesador o producto de pago. No representa el
// tipo genérico de una cuenta (CARD/TRANSFER): recibe el nombre de marca.
export default function MedioPagoLogo({
  marca,
  variante = 'horizontal',
  alto = 'h-5',
  className,
  soloCatalogo = false,
  baseAssets,
  decorativo = false,
}) {
  const texto = String(marca || '').trim()
  const registro = logoDeMedioPago(texto, variante)
  if (!registro) return null

  return (
    <LogoFinanciero
      nombre={texto}
      registro={registro}
      alto={alto}
      className={className}
      soloCatalogo={soloCatalogo}
      baseAssets={baseAssets}
      decorativo={decorativo}
    />
  )
}
