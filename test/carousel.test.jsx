// @vitest-environment jsdom
import React, { useState } from 'react'
import { readFileSync } from 'node:fs'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Carousel } from '../src/index.js'
import { CarouselPreview } from '../gallery/carousel-previews.jsx'

afterEach(cleanup)
const slides = [
  { id: 'one', label: 'Primero', content: <button>Acción uno</button> },
  { id: 'two', label: 'Segundo', content: <a href="#local">Enlace dos</a> },
  { id: 'three', label: 'Tercero', content: <img alt="Contenido aportado por la app" /> },
]
const next = () => screen.getByRole('button', { name: 'Siguiente' })

it('is controlled and announces only a fulfilled manual request, not initial/external changes', () => {
  const change = vi.fn()
  const { rerender } = render(<Carousel slides={slides} index={0} onIndexChange={change} label="Muestras" />)
  expect(screen.getByRole('group', { name: 'Muestras' }).getAttribute('aria-roledescription')).toBe('carrusel')
  expect(screen.getByRole('status').textContent).toBe('')
  fireEvent.click(next(), { detail: 1 })
  expect(change).toHaveBeenCalledWith(1)
  expect(screen.getByRole('button', { name: 'Acción uno' })).toBeTruthy()
  expect(screen.getByRole('status').textContent).toBe('')
  rerender(<Carousel slides={slides} index={1} onIndexChange={change} />)
  expect(screen.getByRole('status').textContent).toBe('2 de 3: Segundo')
  rerender(<Carousel slides={slides} index={2} onIndexChange={change} />)
  expect(screen.getByRole('status').textContent).toBe('')
})

it('unmounts inactive interactive content and preserves application-owned image alt', () => {
  const { rerender } = render(<Carousel slides={slides} index={1} onIndexChange={() => {}} />)
  expect(screen.queryByRole('button', { name: 'Acción uno' })).toBeNull()
  expect(screen.getByRole('link', { name: 'Enlace dos' })).toBeTruthy()
  expect(screen.queryByRole('img')).toBeNull()
  rerender(<Carousel slides={slides} index={2} onIndexChange={() => {}} />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByRole('img', { name: 'Contenido aportado por la app' })).toBeTruthy()
})

it('wraps navigation without stealing focus, and uses real picker buttons rather than tabs', () => {
  function Demo() { const [index, setIndex] = useState(0); return <Carousel slides={slides} index={index} onIndexChange={setIndex} /> }
  render(<Demo />)
  const button = next(); button.focus()
  for (let i = 0; i < 3; i++) { fireEvent.click(button); expect(document.activeElement).toBe(button) }
  expect(screen.getByRole('button', { name: 'Acción uno' })).toBeTruthy()
  const current = screen.getByRole('button', { name: 'Mostrar Primero' })
  expect(current.getAttribute('aria-current')).toBe('true')
  expect(current.getAttribute('aria-disabled')).toBe('true')
  expect(current.disabled).toBe(false)
  fireEvent.click(current)
  expect(screen.getByRole('button', { name: 'Acción uno' })).toBeTruthy()
  expect(screen.queryByRole('tab')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Anterior' }))
  expect(screen.getByRole('img')).toBeTruthy()
})

it('handles empty, singleton, disabled and out-of-range indexes without firing corrections', () => {
  const change = vi.fn()
  const { rerender } = render(<Carousel slides={[]} index={999} onIndexChange={change} />)
  expect(screen.getByText('No hay elementos para mostrar.')).toBeTruthy()
  expect(next().disabled).toBe(true)
  rerender(<Carousel slides={slides.slice(0, 1)} index={999} onIndexChange={change} />)
  expect(screen.getByRole('button', { name: 'Acción uno' })).toBeTruthy(); expect(next().disabled).toBe(true)
  rerender(<Carousel slides={slides} index={999} onIndexChange={change} disabled />)
  expect(screen.getByRole('img')).toBeTruthy(); expect(next().disabled).toBe(true)
  fireEvent.click(next()); expect(change).not.toHaveBeenCalled()
  rerender(<Carousel slides={slides} index={NaN} onIndexChange={change} />)
  expect(screen.getByRole('button', { name: 'Acción uno' })).toBeTruthy()
})

it('uses optional pointer CSS transitions and instant keyboard/reduced-motion presentation', () => {
  function Demo({ motion = true }) { const [index, setIndex] = useState(0); return <Carousel slides={slides} index={index} onIndexChange={setIndex} motion={motion} /> }
  const { container, rerender } = render(<Demo />)
  fireEvent.click(next(), { detail: 1 })
  expect(container.querySelector('.oc-carousel-slide').dataset.motion).toBe('on')
  fireEvent.transitionEnd(screen.getByRole('link'))
  expect(container.querySelector('.oc-carousel-slide').dataset.motion).toBe('on')
  fireEvent.transitionEnd(container.querySelector('.oc-carousel-slide'))
  expect(container.querySelector('.oc-carousel-slide').dataset.motion).toBe('off')
  fireEvent.click(next(), { detail: 0 })
  expect(container.querySelector('.oc-carousel-slide').dataset.motion).toBe('off')
  rerender(<Demo motion={false} />)
  fireEvent.click(next(), { detail: 1 })
  expect(container.querySelector('.oc-carousel-slide').dataset.motion).toBe('off')
  const css = readFileSync('src/styles/base.css', 'utf8')
  expect(css).toContain('@starting-style { .oc-carousel-slide[data-motion="on"] { opacity: 0; } }')
  expect(css).toContain('.oc-carousel-slide { transition: none !important; }')
})

it('never auto-advances or intercepts touch; demo controls real local content', () => {
  vi.useFakeTimers()
  try {
    render(<CarouselPreview name="Carousel" />)
    expect(screen.getByText(/Sin autoplay ni gestos de swipe/)).toBeTruthy()
    vi.advanceTimersByTime(60000)
    expect(screen.getByRole('button', { name: 'Ver detalle demo' })).toBeTruthy()
    fireEvent.click(next())
    fireEvent.click(screen.getByRole('button', { name: 'Revisar fixture' }))
    expect(screen.getByText('Revisión simulada; ningún dato fue guardado.')).toBeTruthy()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } })
    expect(screen.getByText('No hay elementos para mostrar.')).toBeTruthy()
  } finally { vi.useRealTimers() }
})
