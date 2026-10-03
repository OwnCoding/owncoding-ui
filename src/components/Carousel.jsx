import { useEffect, useRef, useState } from 'react'
import { Button, Card } from './ui.jsx'
import Icon from './Icon.jsx'
import { cn } from '../utils/cn.js'

/** Manual controlled content navigation; no autoplay or gesture interception. */
export default function Carousel({
  slides = [], index = 0, onIndexChange, label = 'Destacados',
  previousLabel = 'Anterior', nextLabel = 'Siguiente',
  emptyLabel = 'No hay elementos para mostrar.', disabled = false, motion = true, className,
}) {
  const count = slides.length
  const selected = count ? Math.min(count - 1, Math.max(0, Number.isFinite(index) ? Math.trunc(index) : 0)) : 0
  const active = slides[selected]
  const pending = useRef(null)
  const [announcement, setAnnouncement] = useState('')
  const [motionTarget, setMotionTarget] = useState(null)
  const locked = disabled || count < 2 || !onIndexChange
  useEffect(() => {
    if (active && pending.current === active.id) {
      setAnnouncement(`${selected + 1} de ${count}: ${active.label}`)
      pending.current = null
    } else setAnnouncement('')
    if (!active) pending.current = null
  }, [active?.id, active?.label, selected, count])
  function choose(next, event) {
    if (locked || next === selected) return
    pending.current = slides[next].id
    setMotionTarget(event.detail > 0 ? slides[next].id : null)
    onIndexChange(next)
  }
  return <div role="group" aria-roledescription="carrusel" aria-label={label} className={cn('min-w-0 space-y-3', className)}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Button type="button" variant="outline" aria-label={previousLabel} disabled={locked}
        onClick={event => choose((selected - 1 + count) % count, event)}><Icon name="back" />{previousLabel}</Button>
      <span className="text-sm tabular-nums text-mute">{count ? selected + 1 : 0} de {count}</span>
      <Button type="button" variant="outline" aria-label={nextLabel} disabled={locked}
        onClick={event => choose((selected + 1) % count, event)}>{nextLabel}<Icon name="arrow" /></Button>
    </div>
    {active ? <div key={active.id} role="group" aria-roledescription="diapositiva"
      aria-label={`${selected + 1} de ${count}: ${active.label}`} className="oc-carousel-slide"
      data-motion={motion && motionTarget === active.id ? 'on' : 'off'} onTransitionEnd={event => { if (event.target === event.currentTarget) setMotionTarget(null) }}>
      <Card className="min-w-0">{active.content}</Card>
    </div> : <Card><p className="text-sm text-mute">{emptyLabel}</p></Card>}
    {count > 0 && <div role="group" aria-label="Elegir elemento" className="flex flex-wrap justify-center gap-2">
      {slides.map((slide, position) => <Button key={slide.id} type="button" variant="ghost" disabled={locked}
        aria-label={`Mostrar ${slide.label}`} aria-current={selected === position ? 'true' : undefined}
        aria-disabled={selected === position || disabled ? 'true' : undefined}
        onClick={event => choose(position, event)} className="min-w-11 px-3">
        <span aria-hidden="true" className={cn('h-2.5 w-2.5 rounded-full', selected === position ? 'bg-fono' : 'bg-mute/40')} />
      </Button>)}
    </div>}
    <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</span>
  </div>
}
