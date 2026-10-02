// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, test, vi } from 'vitest'
import { ComponentPreview } from '../gallery/component-previews.jsx'
const pending = vi.hoisted(() => [])
vi.mock('../src/utils/qr.js', () => ({ qrDataUrl: vi.fn(() => new Promise(resolve => pending.push(resolve))), QR_OPCIONES: { ancho: 220, nivel: 'M', margen: 1 } }))
globalThis.IS_REACT_ACT_ENVIRONMENT = true
test('actual QR effect ignores late generation after leaving its scene', async () => {
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host)
  try {
    await act(async () => root.render(<ComponentPreview key="qr" name="CodigoQr" />))
    expect(pending).toHaveLength(1)
    await act(async () => root.render(<ComponentPreview key="text" name="Eyebrow" />))
    await act(async () => pending[0]('data:image/png;base64,fixture'))
    expect(host.querySelector('img')).toBeNull()
    expect(host.querySelector('[data-demo-export]').dataset.demoExport).toBe('Eyebrow')
  } finally { act(() => root.unmount()); host.remove() }
})
