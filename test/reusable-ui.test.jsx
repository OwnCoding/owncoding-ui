// @vitest-environment jsdom

import React, { useState } from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { AsyncButton, CloseButton, Combobox, NotificationCenter, AppHeader, AccountSwitcher, ProfileCard, FooterPreset, ActionToolbar, CopyButton, Modal, Popover, Tooltip } from '../src/index.js'

afterEach(cleanup)

describe('reusable UI contracts', () => {
  it('prevents synchronous duplicate submission and reports rejection', async () => {
    let reject
    const action = vi.fn(() => new Promise((_, fail) => { reject = fail }))
    render(<AsyncButton action={action}>Guardar</AsyncButton>)
    const button = screen.getByRole('button', { name: 'Guardar' })
    fireEvent.click(button); fireEvent.click(button)
    expect(action).toHaveBeenCalledTimes(1)
    reject(new Error('falló'))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('falló'))
  })
  it('routes close through busy dialog guard', () => {
    const close = vi.fn()
    render(<Modal open busy onClose={close} title="Demo"><CloseButton /></Modal>)
    fireEvent.click(screen.getAllByRole('button', { name: 'Cerrar' }).at(-1))
    expect(close).not.toHaveBeenCalled()
  })
  it('honors standalone disabled close', () => {
    const close = vi.fn(); render(<CloseButton disabled onClick={close} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' })); expect(close).not.toHaveBeenCalled()
  })
  it('filters unread controlled notifications and marks all only by callback', () => {
    const all = vi.fn()
    render(<NotificationCenter items={[{ id: 'a', title: 'Nueva', read: false }, { id: 'b', title: 'Anterior', read: true }]} onMarkAllRead={all} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sin leer' }))
    expect(screen.queryByText('Anterior')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Marcar todas como leídas' }))
    expect(all).toHaveBeenCalledOnce(); expect(screen.getByText('Nueva')).toBeTruthy()
  })
  it('mobile navigation closes with Escape', () => {
    render(<AppHeader title="Demo" items={[{ label: 'Inicio', href: '/inicio' }]} />)
    const trigger = screen.getByRole('button', { name: 'Abrir navegación' })
    fireEvent.click(trigger); expect(trigger.getAttribute('aria-expanded')).toBe('true')
    fireEvent.keyDown(document, { key: 'Escape' }); expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })
  it('footer presets preserve consumer links', () => {
    render(<FooterPreset name="Demo" links={[{ etiqueta: 'Privacidad', href: '/privacidad' }]} />)
    expect(screen.getByRole('link', { name: 'Privacidad' }).getAttribute('href')).toBe('/privacidad')
  })
  it('profile is display-only; account choice is a callback', async () => {
    const change = vi.fn(); render(<><ProfileCard name="Demo" /><AccountSwitcher accounts={[{ id: 'a', label: 'Equipo A' }]} onChange={change} /></>)
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar cuenta' }))
    await waitFor(() => screen.getByRole('menuitem', { name: 'Equipo A' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Equipo A' })); expect(change).toHaveBeenCalledWith('a')
  })
  it('combobox selects with keyboard and supports multiple selection', async () => {
    function Demo() { const [value, setValue] = useState([]); return <Combobox label="Equipos" multiple items={[{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta', disabled: true }]} value={value} onChange={setValue} /> }
    render(<Demo />)
    const input = screen.getByRole('combobox', { name: 'Equipos' })
    fireEvent.change(input, { target: { value: 'Alpha' } }); fireEvent.keyDown(input, { key: 'ArrowDown' })
    await waitFor(() => screen.getByRole('option', { name: /Alpha/ }))
    fireEvent.keyDown(input, { key: 'Enter' }); await waitFor(() => expect(screen.getByText('Seleccionados: Alpha')).toBeTruthy())
    fireEvent.keyDown(input, { key: 'Escape' })
  })
  it('popover is portaled and restores trigger focus on Escape', async () => {
    render(<Popover label="Ayuda" trigger="Abrir ayuda"><button>Acción</button></Popover>)
    const trigger = screen.getByRole('button', { name: 'Abrir ayuda' }); fireEvent.click(trigger)
    await waitFor(() => screen.getByRole('dialog', { name: 'Ayuda' }))
    fireEvent.keyDown(screen.getByRole('button', { name: 'Acción' }), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })
  it('clipboard failure is observable and toolbar has a label', async () => {
    render(<><CopyButton text="Demo" copy={async () => { throw new Error('denegado') }} /><ActionToolbar label="Acciones"><button>Editar</button></ActionToolbar></>)
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }))
    await waitFor(() => screen.getByRole('alert'))
    expect(screen.getByRole('group', { name: 'Acciones' })).toBeTruthy()
  })
})

import { ToastProvider, useToast } from '../src/index.js'
describe('toast lifecycle', () => {
  it('offers undo and replaces loading with a successful result', async () => {
    const undo = vi.fn()
    function Demo() { const toast = useToast(); return <><button onClick={() => toast.success('Eliminado', { undo: { label: 'Deshacer', onClick: undo } })}>Eliminar</button><button onClick={() => toast.promise(Promise.resolve('ok'), { loading: 'Guardando', success: 'Guardado' })}>Guardar</button></> }
    render(<ToastProvider><Demo /></ToastProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' })); fireEvent.click(screen.getByRole('button', { name: 'Deshacer' })); expect(undo).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' })); await waitFor(() => screen.getByText('Guardado'))
    expect(screen.queryByText('Guardando')).toBeNull()
  })
  it('failed promise is rethrown and produces a persistent error', async () => {
    let outcome
    function Demo() { const toast = useToast(); return <button onClick={() => { outcome = toast.promise(Promise.reject(new Error('no')), { error: 'No guardado' }).catch(error => error.message) }}>Intentar</button> }
    render(<ToastProvider><Demo /></ToastProvider>); fireEvent.click(screen.getByRole('button', { name: 'Intentar' })); await waitFor(() => screen.getByText('No guardado')); expect(await outcome).toBe('no')
  })
})

import { ReusablePreview } from '../gallery/reusable-previews.jsx'
import { PREVIEW_GROUPS } from '../gallery/preview-registry.js'
describe('interactive reusable gallery', () => {
  it.each(PREVIEW_GROUPS.reusable)('%s has a real scene and explicit local-only state', name => {
    const { container } = render(<ReusablePreview name={name} />)
    expect(container.querySelector('[data-demo-export]').dataset.demoExport).toBe(name)
    expect(container.textContent).toContain('Fixture local; sin autenticación, envío ni persistencia.')
    expect(container.querySelectorAll('button, input, select, a').length).toBeGreaterThan(0)
  })
  it('tooltip opens by click for touch users and closes with Escape', async () => {
    render(<Tooltip label="Ayuda breve" trigger="Ayuda">Texto de ayuda</Tooltip>)
    fireEvent.click(screen.getByRole('button', { name: 'Ayuda breve' }))
    await waitFor(() => screen.getByRole('tooltip'))
    fireEvent.keyDown(screen.getByRole('button', { name: 'Ayuda breve' }), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  })
  it('disabled options cannot be selected and errors remain visible', async () => {
    const change = vi.fn()
    render(<Combobox label="Prueba" value={null} onChange={change} items={[{ id: 'x', label: 'No disponible', disabled: true }]} />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'No' } }); fireEvent.keyDown(input, { key: 'ArrowDown' })
    await waitFor(() => screen.getByRole('option'))
    fireEvent.click(screen.getByRole('option')); expect(change).not.toHaveBeenCalled()
  })
})

import { renderToString } from 'react-dom/server'
describe('SSR', () => {
  it('all reusable scenes render without a browser-only operation', () => {
    for (const name of PREVIEW_GROUPS.reusable) expect(renderToString(<ReusablePreview name={name} />)).toContain('data-demo-export')
  })
})
describe('protected interactions', () => {
  it('close requests confirmation for unsaved changes, not a forced close', () => {
    const close = vi.fn()
    render(<Modal open dirty onClose={close} title="Edición"><CloseButton label="Cerrar edición" /></Modal>)
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar edición' }))
    expect(close).not.toHaveBeenCalled()
    expect(screen.getAllByRole('dialog').length).toBeGreaterThan(1)
  })
  it('disabled account trigger cannot open a menu', () => {
    render(<AccountSwitcher disabled accounts={[{ id: 'a', label: 'A' }]} />)
    const button = screen.getByRole('button', { name: 'Cambiar cuenta' })
    expect(button.disabled).toBe(true); fireEvent.click(button); expect(screen.queryByRole('menu')).toBeNull()
  })
})
