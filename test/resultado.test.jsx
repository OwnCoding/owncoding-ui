// @vitest-environment jsdom
// Toasts de resultado (#323): textos canónicos de guardar, copiar, imprimir y
// enviar, y el hook que los conecta al ToastProvider.
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import {
  Button,
  RESULTADOS_VALIDOS,
  ToastProvider,
  mensajeFallo,
  mensajeResultado,
  useResultado,
} from '../src/index.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let contenedor
let raiz

beforeEach(() => {
  contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  raiz = createRoot(contenedor)
})

afterEach(() => {
  act(() => raiz.unmount())
  contenedor.remove()
})

describe('mensajes de resultado (#323)', () => {
  test('los cuatro resultados tienen forma genérica y con sujeto', () => {
    expect(RESULTADOS_VALIDOS).toEqual(['guardar', 'copiar', 'imprimir', 'enviar'])
    expect(mensajeResultado('guardar')).toBe('Cambios guardados')
    expect(mensajeResultado('guardar', 'Cliente')).toBe('Cliente se guardó')
    expect(mensajeResultado('copiar', 'Enlace')).toBe('Enlace se copió')
    expect(mensajeResultado('imprimir', 'Comprobante')).toBe('Comprobante se envió a la impresora')
    expect(mensajeResultado('enviar')).toBe('Envío completado')
    expect(mensajeResultado('enviar', 'Correo')).toBe('Correo se envió')
    // El sujeto vacío no arma frases raras y una acción desconocida no rompe.
    expect(mensajeResultado('guardar', '   ')).toBe('Cambios guardados')
    expect(mensajeResultado('otra')).toBe('Listo')
  })

  test('el fallo comparte la forma nominal', () => {
    expect(mensajeFallo('guardar')).toBe('No se pudo guardar')
    expect(mensajeFallo('copiar')).toBe('No se pudo copiar')
    expect(mensajeFallo('imprimir')).toBe('No se pudo imprimir')
    expect(mensajeFallo('enviar')).toBe('No se pudo enviar')
    expect(mensajeFallo('otra')).toBe('No se pudo completar')
  })
})

describe('useResultado (#323)', () => {
  function Acciones() {
    const resultado = useResultado()
    return (
      <div>
        <Button onClick={() => resultado.guardado('Cliente')}>Guardar</Button>
        <Button onClick={() => resultado.copiado()}>Copiar</Button>
        <Button onClick={() => resultado.impreso('Comprobante')}>Imprimir</Button>
        <Button onClick={() => resultado.enviado('Correo')}>Enviar</Button>
        <Button onClick={() => resultado.fallo('guardar', 'Revisá los datos.')}>Fallar</Button>
      </div>
    )
  }

  const tocar = async (texto) => {
    const boton = [...contenedor.querySelectorAll('button')].find((nodo) => nodo.textContent === texto)
    await act(async () => { boton.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
  }

  test('emite los toasts con el texto canónico y el detalle', async () => {
    await act(async () => { raiz.render(<ToastProvider><Acciones /></ToastProvider>) })
    await tocar('Guardar')
    expect(contenedor.textContent).toContain('Cliente se guardó')
    await tocar('Copiar')
    expect(contenedor.textContent).toContain('Contenido copiado')
    await tocar('Imprimir')
    expect(contenedor.textContent).toContain('Comprobante se envió a la impresora')
    await tocar('Enviar')
    expect(contenedor.textContent).toContain('Correo se envió')
    await tocar('Fallar')
    expect(contenedor.textContent).toContain('No se pudo guardar')
    expect(contenedor.textContent).toContain('Revisá los datos.')
  })

  test('sin proveedor las acciones son seguras (no rompen)', async () => {
    await act(async () => { raiz.render(<Acciones />) })
    await tocar('Guardar')
    expect(contenedor.textContent).toContain('Guardar')
  })
})
