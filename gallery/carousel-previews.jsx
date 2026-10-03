import React, { useState } from 'react'
import { Carousel, Button } from '../src/index.js'

export function CarouselPreview({ name }) {
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(3)
  const [motion, setMotion] = useState(true)
  const [notice, setNotice] = useState('Acciones locales; sin consultas ni servicios externos.')
  const slides = [
    { id: 'operation', label: 'Operación de muestra', content: <div className="space-y-3"><h4 className="font-semibold">Operación Demo</h4><p>Contenido controlado, sin pedidos reales.</p><Button type="button" onClick={() => setNotice('Detalle del fixture abierto localmente.')}>Ver detalle demo</Button></div> },
    { id: 'review', label: 'Revisión de muestra', content: <div className="space-y-3"><h4 className="font-semibold">Revisión Demo</h4><p>Este segundo contenido sustituye al anterior; no queda un control oculto enfocable.</p><Button type="button" onClick={() => setNotice('Revisión simulada; ningún dato fue guardado.')}>Revisar fixture</Button></div> },
    { id: 'delivery', label: 'Entrega de muestra', content: <div className="space-y-3"><h4 className="font-semibold">Entrega Demo</h4><p>Los resultados y medios reales pertenecen a la aplicación.</p><Button type="button" onClick={() => setNotice('Entrega simulada; no se despachó nada.')}>Probar entrega demo</Button></div> },
  ].slice(0, count)
  return <div data-demo-family="carousel" data-demo-export={name} className="min-w-0 space-y-4">
    <p className="text-xs text-mute">Demo local con navegación manual. Sin autoplay ni gestos de swipe.</p>
    <div className="flex flex-wrap gap-3"><label>Elementos <select value={count} onChange={event => { setCount(Number(event.target.value)); setIndex(0) }} className="rounded border border-interactivo bg-ink p-2"><option value={3}>Tres</option><option value={1}>Uno</option><option value={0}>Vacío</option></select></label>
      <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={motion} onChange={event => setMotion(event.target.checked)} />Animar (respeta movimiento reducido)</label></div>
    <Carousel label="Contenido de muestra" slides={slides} index={index} onIndexChange={setIndex} motion={motion} />
    <p className="text-xs text-mute">{notice}</p>
  </div>
}
