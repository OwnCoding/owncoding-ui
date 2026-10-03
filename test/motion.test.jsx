// @vitest-environment jsdom
import React from 'react'
import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { AnimatedStatus, MotionSurface, Button, Card } from '../src/index.js'
import { MotionPreview } from '../gallery/motion-previews.jsx'

afterEach(cleanup)

describe('shared controlled motion', () => {
  it('keeps one polite live region and decorative icons across state changes', () => {
    const { rerender } = render(<AnimatedStatus>Ready</AnimatedStatus>)
    const region = screen.getByRole('status')
    for (const state of ['loading', 'success', 'error', 'idle']) {
      rerender(<AnimatedStatus state={state}>{state}</AnimatedStatus>)
      expect(screen.getByRole('status')).toBe(region)
      expect(region.getAttribute('aria-live')).toBe('polite')
      expect(region.getAttribute('aria-atomic')).toBe('true')
      expect(region.textContent).toBe(state)
      expect(region.querySelector('svg').getAttribute('aria-hidden')).toBe('true')
    }
  })
  it('uses idle for unknown runtime states; explicit motion opt-out keeps feedback', () => {
    render(<AnimatedStatus state="unknown" motion={false}>Ready</AnimatedStatus>)
    const region = screen.getByRole('status')
    expect(region.dataset.ocStatus).toBe('idle')
    expect(region.dataset.motion).toBe('off')
    expect(region.querySelector('svg')).toBeTruthy()
  })
  it('composes cards without adding an interactive wrapper or changing child props', () => {
    const { container } = render(<MotionSurface hover elevation><Card id="fixture" className="original">Details</Card></MotionSurface>)
    expect(container.children).toHaveLength(1)
    expect(container.firstElementChild.id).toBe('fixture')
    expect(container.firstElementChild.className).toContain('original')
    expect(container.firstElementChild.dataset.ocHover).toBe('on')
    expect(screen.queryByRole('button')).toBeNull()
    expect(container.firstElementChild.hasAttribute('tabindex')).toBe(false)
  })
  it('preserves native disabled semantics and never delays click handlers', () => {
    const click = vi.fn()
    const { rerender } = render(<MotionSurface press><Button disabled onClick={click}>Submit</Button></MotionSurface>)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(click).not.toHaveBeenCalled()
    rerender(<MotionSurface press><Button onClick={click}>Submit</Button></MotionSurface>)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(click).toHaveBeenCalledOnce()
  })
  it('ships static reduced-motion icons and no transforms for keyboard/disabled surfaces', () => {
    const css = readFileSync('src/styles/base.css', 'utf8')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('[data-oc-status] path { animation: none !important;')
    expect(css).toContain('.oc-motion-surface { transform: none !important; transition: none !important; }')
    expect(css).toContain(':not(:focus-visible):active')
    expect(css).toContain('@media (hover: hover) and (pointer: fine)')
  })
  it.each(['AnimatedStatus', 'MotionSurface'])('shows explicit local fixture states for %s', name => {
    render(<MotionPreview name={name} />)
    expect(screen.getByText(/Demo local: sin archivos/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar demo' }))
    expect(screen.getByRole('status').textContent).toContain('Procesando fixture')
    expect(screen.getByRole('button', { name: 'Iniciar demo' }).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Simular error' }))
    expect(screen.getByRole('status').textContent).toContain('Error simulado')
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar demo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Simular éxito' }))
    expect(screen.getByRole('status').textContent).toContain('exitoso simulado')
    fireEvent.click(screen.getByRole('tab', { name: 'Pago' }))
    expect(screen.getByRole('status').textContent).toContain('Fixture listo')
  })
})
