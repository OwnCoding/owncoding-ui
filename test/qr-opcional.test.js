// `qrcode` es peer opcional: importar el paquete no puede depender de que esté
// instalada. El módulo se mockea con un error para simular la app que no la
// tiene; `qrDataUrl` la importa de forma dinámica y resuelve `''`.
import { describe, expect, test, vi } from 'vitest'

vi.mock('qrcode', () => {
  throw new Error('qrcode no está instalado (peer opcional)')
})

describe('el paquete se importa sin `qrcode`', () => {
  test('el índice carga igual y el QR vacío devuelve cadena vacía', async () => {
    const modulo = await import('../src/index.js')
    expect(typeof modulo.CodigoQr).toBe('function')
    expect(typeof modulo.qrDataUrl).toBe('function')
    // Sin la peer: nunca lanza y el objeto QR se queda sin imagen.
    expect(await modulo.qrDataUrl('https://ledbox.online/u/DEMO0001')).toBe('')
    expect(modulo.QR_OPCIONES).toEqual({ nivel: 'M', margen: 1, ancho: 220 })
  }, 15_000)
})
