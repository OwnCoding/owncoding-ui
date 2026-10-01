import { cn } from '../utils/cn.js'

// Pantalla de carga institucional: logo (slot), mensaje, línea indeterminada y
// un chip opcional con la tienda. Portable: no consulta sesión ni API; la app
// pasa el logo de su tema y, si quiere, `tienda={{ nombre, logo }}`.

export default function LoadingScreen({ mensaje, label, logo, tienda = null, etiqueta = '', className }) {
  const texto = mensaje ?? label ?? 'Cargando…'
  const nombreTienda = tienda?.nombre || ''
  const imagenTienda = tienda?.logo || ''
  return (
    <div
      className={cn('relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-paper px-6 text-fore', className)}
      role="status"
      aria-busy="true"
      aria-label={texto}
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-[62%] rounded-full bg-fono/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fono/50 to-transparent" />

      <div className="relative flex w-full max-w-xs flex-col items-center">
        <div className="drop-shadow-[0_10px_30px_rgba(12,136,118,0.25)] motion-safe:animate-[oc-respira_2.6s_ease-in-out_infinite]">{logo}</div>

        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[.22em] text-mute">{texto}</p>

        <div className="mt-4 h-[3px] w-44 overflow-hidden rounded-full bg-ink-600/70" aria-hidden>
          <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-fono/40 via-fono to-fono-light motion-safe:animate-[oc-carga_1.25s_ease-in-out_infinite]" />
        </div>
      </div>

      {nombreTienda && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center px-6">
          <span className="flex max-w-[22rem] items-center gap-2.5 rounded-full border border-fore/10 bg-ink-800/70 px-3 py-1.5 shadow-card backdrop-blur">
            {imagenTienda ? (
              <img src={imagenTienda} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fono/15 text-[10px] font-bold text-fono-text">{nombreTienda.charAt(0).toUpperCase()}</span>
            )}
            <span className="min-w-0 truncate text-xs font-semibold">{nombreTienda}</span>
            {etiqueta && <span className="shrink-0 rounded-full border border-ink-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-mute">{etiqueta}</span>}
          </span>
        </div>
      )}
    </div>
  )
}
