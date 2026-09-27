import { useEffect, useState } from 'react'
import { cn } from '../utils/cn.js'
import { colorDeNombre, inicialesDeNombre } from '../utils/avatar.js'

// Avatar de identidad (persona o empresa): imagen opcional con caída a las
// iniciales pintadas con un color estable derivado del nombre. Nunca queda un
// cuadro roto: si la imagen falla, se muestran las iniciales.
//
// Al cambiar `src` (otra persona, otra versión de la foto) **no se pinta la
// imagen anterior**: se monta un nodo nuevo y, hasta que la nueva carga, queda
// el placeholder neutro de iniciales (#271). El nodo anterior se descarta
// (`key={src}`) porque el navegador mantiene la imagen vieja en el mismo `<img>`.
//
// Portable: recibe el nombre y la URL de la imagen por props (la app resuelve
// si tiene foto, logo o ninguna). `forma="cuadrado"` es para empresas/logos;
// `forma="redondo"` (predeterminado) para personas. `tamano`: `xs`…`xl`.
// `onError` avisa cuando la imagen falla (además de caer a iniciales), para que
// la app pueda intentar la siguiente fuente (foto local → Google).
//
// Accesible: el marco es `role="img"` con `aria-label` (nombre o el que se
// pase). Si el avatar solo acompaña a un texto que ya dice el nombre, se usa
// `decorativo` para no repetirlo al lector de pantalla.

export const TAMANOS_AVATAR = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
}

export default function Avatar({
  nombre,
  src,
  tamano = 'md',
  forma,
  empresa = false,
  title,
  ariaLabel,
  decorativo = false,
  onError,
  className,
}) {
  // `cargada`/`fallo` se guardan por URL: al cambiar la imagen, la anterior no
  // puede quedar pintada (el navegador mantiene la vieja en el mismo nodo)
  // mientras la nueva carga, y el placeholder de iniciales la tapa (#271).
  const [cargada, setCargada] = useState('')
  const [fallo, setFallo] = useState('')
  const url = String(src || '')

  useEffect(() => {
    setCargada('')
    setFallo('')
  }, [url])

  const cuadro = empresa ? 'cuadrado' : forma || 'redondo'
  const redondo = cuadro !== 'cuadrado'
  const etiqueta = ariaLabel || title || String(nombre ?? '').trim() || 'Identidad'
  const conImagen = Boolean(url) && fallo !== url
  const visible = conImagen && cargada === url

  return (
    <span
      role={decorativo ? undefined : 'img'}
      aria-label={decorativo ? undefined : etiqueta}
      aria-hidden={decorativo || undefined}
      title={title}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden font-bold uppercase',
        redondo ? 'rounded-full' : 'rounded-lg',
        !visible && colorDeNombre(nombre),
        TAMANOS_AVATAR[tamano] || TAMANOS_AVATAR.md,
        className,
      )}
    >
      {visible ? null : <span aria-hidden="true">{inicialesDeNombre(nombre)}</span>}
      {conImagen ? (
        <img
          key={url}
          src={url}
          alt=""
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setCargada(url)}
          onError={(event) => { setFallo(url); onError?.(event) }}
          className={cn(
            'absolute inset-0 h-full w-full',
            redondo ? 'object-cover' : 'object-contain',
            visible ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : null}
    </span>
  )
}
