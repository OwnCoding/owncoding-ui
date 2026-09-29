import { cn } from '../utils/cn.js'

// Pie institucional (#291): © + nombre + versión + crédito «Desarrollado por
// Owncoding» con enlace. **Obligatorio en TODAS las páginas** —panel, auth y
// públicas/tokenizadas—: la app inyecta marca y versión por props (la
// biblioteca no conoce la marca) y el crédito viene por defecto. Regla y
// checklist: `docs/REGLAS.md` §14 y `docs/SHELL.md` §6.

/** Crédito institucional por defecto: la app puede pisarlo, no quitarlo. */
export const CREDITO_PIE = 'Desarrollado por Owncoding'
export const CREDITO_PIE_URL = 'https://owncoding.dev/'

export default function ProductFooter({
  nombre = '',
  version = '',
  credito = CREDITO_PIE,
  creditoUrl = CREDITO_PIE_URL,
  anio = new Date().getFullYear(),
  leading,
  children,
  className,
}) {
  return (
    <footer
      data-testid="product-footer"
      className={cn('border-t border-fore/10 bg-transparent px-4 py-3 text-center text-[11px] text-mute', className)}
    >
      {leading}
      <span>© {anio}{nombre ? ` ${nombre}` : ''}. Todos los derechos reservados.{version ? ` · ${version}` : ''}</span>
      {children && <>{' · '}{children}</>}
      {credito && (
        <>
          {' · '}
          <a
            href={creditoUrl}
            target="_blank"
            rel="noreferrer"
            className="toque-44 font-medium text-fono-dark hover:underline"
          >
            {credito}
          </a>
        </>
      )}
    </footer>
  )
}

export { ProductFooter }
