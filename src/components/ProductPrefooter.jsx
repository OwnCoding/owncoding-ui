import { cn } from '../utils/cn.js'

const CLASE_ENLACE = 'toque-44 inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-medium text-fono-dark underline-offset-4 hover:underline dark:text-fono-light'

function Enlace({ enlace }) {
  if (!enlace?.href || !enlace?.etiqueta) return null
  const externo = enlace.externo ?? /^https?:\/\//i.test(enlace.href)
  return (
    <a
      href={enlace.href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noreferrer' : undefined}
      className={cn(CLASE_ENLACE, enlace.className)}
    >
      {enlace.etiqueta}
      {externo ? <span className="sr-only"> (se abre en otra pestaña)</span> : null}
    </a>
  )
}

export default function ProductPrefooter({
  modelo = 'enlaces',
  titulo = 'Más información',
  descripcion,
  columnas = [],
  accion,
  redes = [],
  children,
  className,
}) {
  const mostrarEnlaces = modelo === 'enlaces' || modelo === 'completo'
  const mostrarAccion = modelo === 'accion' || modelo === 'completo'

  return (
    <aside
      aria-label={titulo}
      data-testid="product-prefooter"
      data-modelo={modelo}
      className={cn('border-t border-fore/10 bg-ink-800 px-4 py-8 text-fore sm:px-6', className)}
    >
      <div className={cn("mx-auto grid w-full max-w-6xl gap-8", mostrarAccion && accion && "lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.42fr)]")}>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-fore">{titulo}</h2>
          {descripcion ? <p className="mt-2 max-w-2xl text-sm leading-6 text-mute">{descripcion}</p> : null}

          {mostrarEnlaces && columnas.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {columnas.map((columna, indice) => (
                <section key={columna.id ?? columna.titulo ?? indice} aria-label={columna.titulo}>
                  {columna.titulo ? <h3 className="text-sm font-bold text-fore">{columna.titulo}</h3> : null}
                  <ul className="mt-2 space-y-1">
                    {(columna.enlaces ?? []).map((enlace, enlaceIndice) => (
                      <li key={enlace.id ?? enlace.href ?? enlaceIndice}><Enlace enlace={enlace} /></li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : null}

          {redes.length > 0 ? (
            <nav aria-label="Redes sociales" className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
              {redes.map((enlace, indice) => <Enlace key={enlace.id ?? enlace.href ?? indice} enlace={{ ...enlace, externo: true }} />)}
            </nav>
          ) : null}
          {children ? <div className="mt-6 text-sm text-mute">{children}</div> : null}
        </div>

        {mostrarAccion && accion ? (
          <section className="self-start rounded-2xl border border-interactivo bg-ink p-5 shadow-card" aria-label={accion.titulo}>
            <h3 className="text-lg font-bold text-fore">{accion.titulo}</h3>
            {accion.descripcion ? <p className="mt-2 text-sm leading-6 text-mute">{accion.descripcion}</p> : null}
            {accion.enlace ? <div className="mt-4"><Enlace enlace={accion.enlace} /></div> : null}
          </section>
        ) : null}
      </div>
    </aside>
  )
}

export { ProductPrefooter }
