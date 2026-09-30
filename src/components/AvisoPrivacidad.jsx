import { Nota } from './ui.jsx'
import EnlaceLinea from './EnlaceLinea.jsx'

// Aviso de finalidad + política (Ley 7593/2025): la pieza que va en todo punto
// de recolección de datos personales. Compone `Nota` y no pide nada: la app
// pasa la finalidad y sus enlaces (política y derechos), la biblioteca no
// conoce rutas ni trata los datos.
export default function AvisoPrivacidad({
  finalidad,
  detalle,
  politicaUrl,
  politicaTexto = 'Política de privacidad',
  onPolitica,
  derechosUrl,
  derechosTexto = 'Tus derechos',
  onDerechos,
  tono = 'info',
  compact = false,
  className,
  children,
}) {
  if (!finalidad && !detalle && !children) return null
  const enlaces = [
    { clave: 'politica', href: politicaUrl, onClick: onPolitica, texto: politicaTexto },
    { clave: 'derechos', href: derechosUrl, onClick: onDerechos, texto: derechosTexto },
  ].filter((enlace) => enlace.href)
  return (
    <Nota tono={tono} como="div" compact={compact} className={className} data-testid="aviso-privacidad">
      {finalidad && <span className="block">{finalidad}</span>}
      {detalle && <span className="mt-0.5 block text-xs text-mute">{detalle}</span>}
      {children}
      {enlaces.length > 0 && (
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          {enlaces.map((enlace, indice) => (
            <span key={enlace.clave} className="inline-flex items-center gap-2">
              {indice > 0 && <span aria-hidden="true">·</span>}
              <EnlaceLinea href={enlace.href} onClick={enlace.onClick}>
                {enlace.texto}
              </EnlaceLinea>
            </span>
          ))}
        </span>
      )}
    </Nota>
  )
}
