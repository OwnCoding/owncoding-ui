// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { DestinoRecepcion, NavLateral, RangoFecha } from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let container
let root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})

async function render(element) {
  await act(async () => root.render(element))
}

async function click(node) {
  await act(async () => node.dispatchEvent(new MouseEvent('click', { bubbles: true })))
}

async function change(node, value) {
  await act(async () => {
    const descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, 'value')
    descriptor.set.call(node, value)
    node.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

describe('contratos controlados y no controlados', () => {
  test('NavLateral no muta el modo controlado y sí actualiza el no controlado', async () => {
    const onToggle = vi.fn()
    await render(<NavLateral items={[]} colapsado={false} onToggle={onToggle} />)
    await click(container.querySelector('button'))
    expect(onToggle).toHaveBeenCalledWith(true)
    expect(container.querySelector('nav').className).toContain('w-64')

    await render(<NavLateral items={[]} colapsado onToggle={onToggle} />)
    expect(container.querySelector('nav').className).toContain('w-[4.5rem]')

    await render(<NavLateral items={[]} defaultColapsado={false} onToggle={onToggle} />)
    await click(container.querySelector('button'))
    expect(container.querySelector('nav').className).toContain('w-[4.5rem]')
  })

  test('DestinoRecepcion reconcilia destino legado y respeta destinoId controlado', async () => {
    const depositos = [{ id: 'a', nombre: 'A' }, { id: 'b', nombre: 'B' }]
    await render(<DestinoRecepcion destino={depositos[0]} depositos={depositos} onRecibir={() => {}} />)
    expect(container.querySelector('select').value).toBe('a')
    await render(<DestinoRecepcion destino={depositos[1]} depositos={depositos} onRecibir={() => {}} />)
    expect(container.querySelector('select').value).toBe('b')

    const onDestinoChange = vi.fn()
    await render(<DestinoRecepcion destinoId="a" destino={depositos[0]} depositos={depositos} onDestinoChange={onDestinoChange} onRecibir={() => {}} />)
    await change(container.querySelector('select'), 'b')
    expect(onDestinoChange).toHaveBeenCalledWith('b')
    expect(container.querySelector('select').value).toBe('a')
    await render(<DestinoRecepcion destinoId="b" destino={depositos[0]} depositos={depositos} onDestinoChange={onDestinoChange} onRecibir={() => {}} />)
    expect(container.querySelector('select').value).toBe('b')
  })

  test('RangoFecha mantiene editable el extremo omitido y reconcilia el controlado', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onCambio = vi.fn()
    await render(<RangoFecha desde="2026-10-01" hastaPorDefecto="2026-10-05" onCambio={onCambio} atajos={[]} />)
    const [, hasta] = container.querySelectorAll('input[type="date"]')
    await change(hasta, '2026-10-08')
    expect(onCambio).toHaveBeenLastCalledWith('2026-10-01', '2026-10-08')
    expect(hasta.value).toBe('2026-10-08')
    expect(warn).toHaveBeenCalledTimes(1)

    await render(<RangoFecha desde="2026-10-02" hastaPorDefecto="2026-10-05" onCambio={onCambio} atajos={[]} />)
    const [desdeActual, hastaActual] = container.querySelectorAll('input[type="date"]')
    expect(desdeActual.value).toBe('2026-10-02')
    expect(hastaActual.value).toBe('2026-10-08')
  })

  test('DestinoRecepcion permite un harness controlado sin estado duplicado', async () => {
    const depositos = [{ id: 'a', nombre: 'A' }, { id: 'b', nombre: 'B' }]
    function Harness() {
      const [id, setId] = useState('a')
      return <DestinoRecepcion destinoId={id} destino={depositos[0]} depositos={depositos} onDestinoChange={setId} onRecibir={() => {}} />
    }
    await render(<Harness />)
    await change(container.querySelector('select'), 'b')
    expect(container.querySelector('select').value).toBe('b')
  })
})
