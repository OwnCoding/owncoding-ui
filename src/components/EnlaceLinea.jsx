import { cn } from '../utils/cn.js'

// Enlace en línea de la casa (política, derechos, ayuda): un solo estilo para
// los enlaces de texto, con foco visible y sin depender del router. Sin `href`
// dibuja el texto sin enlace (la app todavía no tiene la página publicada).
// Es interno: los objetos públicos lo usan y la app no lo importa.
export default function EnlaceLinea({ href, onClick, children, className }) {
  if (!href) return <span className={cn('font-medium', className)}>{children}</span>
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'font-medium text-fono underline underline-offset-2 hover:no-underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fono/40',
        className,
      )}
    >
      {children}
    </a>
  )
}
