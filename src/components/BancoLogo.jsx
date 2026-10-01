import { colorDeBanco, inicialesDeBanco } from '../utils/bancos.js'
import { logoDeBanco } from '../financial/resolvers.js'
import LogoFinanciero from './LogoFinanciero.jsx'

// Logo de banco con variante horizontal (predeterminada) o compacta. Los props
// históricos se conservan. Los assets de terceros solo se publican cuando el
// registro contiene evidencia explícita de redistribución; si no, se usa el
// fallback tipográfico aun cuando exista una fuente oficial.
export default function BancoLogo({
  banco,
  variante = 'horizontal',
  alto = 'h-5',
  className,
  soloCatalogo = false,
  baseAssets,
  marcas = {},
  decorativo = false,
}) {
  const texto = String(banco || '').trim()
  const registro = logoDeBanco(texto, variante)
  if (!registro) return null

  return (
    <LogoFinanciero
      nombre={texto}
      registro={{
        ...registro,
        iniciales: registro.iniciales || inicialesDeBanco(registro.banco || texto),
        color: registro.color || colorDeBanco(registro.banco || texto),
      }}
      alto={alto}
      className={className}
      soloCatalogo={soloCatalogo}
      baseAssets={baseAssets}
      marcas={marcas}
      decorativo={decorativo}
    />
  )
}
