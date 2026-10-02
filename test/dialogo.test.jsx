import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { Button, Drawer, Modal, SaveActions, SELECTOR_ENFOCABLES, destinoDeTab, useDialogFocusTrap } from '../src/index.js'

// El comportamiento de los diálogos vive en un solo hook: scroll bloqueado,
// foco inicial, ciclo de Tab, Esc y devolución del foco.

const fuente = readFileSync(new URL('../src/components/ui.jsx', import.meta.url), 'utf8')
const hook = readFileSync(new URL('../src/hooks/useDialogFocusTrap.js', import.meta.url), 'utf8')
const reglas = readFileSync(new URL('../docs/REGLAS.md', import.meta.url), 'utf8')

describe('useDialogFocusTrap (#1)', () => {
  test('el ciclo de Tab decide el extremo y no interviene en el medio', () => {
    const primero = { id: 'primero' }
    const ultimo = { id: 'ultimo' }
    const contenedor = { id: 'contenedor' }
    const base = { primero, ultimo, contenedor }

    // Tab desde el último vuelve al primero; Shift+Tab desde el primero (o el
    // contenedor, que tiene tabIndex -1) va al último.
    expect(destinoDeTab({ ...base, activo: ultimo, shiftKey: false })).toBe(primero)
    expect(destinoDeTab({ ...base, activo: primero, shiftKey: true })).toBe(ultimo)
    expect(destinoDeTab({ ...base, activo: contenedor, shiftKey: true })).toBe(ultimo)
    // Si el foco se escapó del contenedor, se lo devuelve adentro.
    expect(destinoDeTab({ ...base, activo: {}, shiftKey: false, fuera: true })).toBe(primero)
    expect(destinoDeTab({ ...base, activo: {}, shiftKey: true, fuera: true })).toBe(ultimo)
    // En el medio no se mete: lo maneja el navegador.
    expect(destinoDeTab({ ...base, activo: {}, shiftKey: false })).toBe(null)
    // Sin enfocables no hay a dónde saltar.
    expect(destinoDeTab({ ...base, primero: undefined, activo: ultimo, shiftKey: false })).toBe(null)
  })

  test('Modal y Drawer comparten el hook, sin la copia inline', () => {
    expect(typeof useDialogFocusTrap).toBe('function')
    expect(SELECTOR_ENFOCABLES).toContain('button:not(:disabled)')
    expect(fuente).toContain('useDialogFocusTrap(open, cerrar, dialog')
    expect(fuente).toContain('useDialogFocusTrap(open, cerrar, panel')
    expect(fuente).not.toContain("document.body.style.overflow = 'hidden'")
    expect(fuente).not.toContain("querySelectorAll('button:not(:disabled)")
  })

  test('el hook cubre pila, scroll, foco inicial, Tab, Esc y retorno del foco', () => {
    expect(hook).toContain("document.body.style.overflow = 'hidden'")
    expect(hook).toContain("evento.key === 'Escape'")
    expect(hook).toContain('initialFocus')
    expect(hook).toContain('anterior?.isConnected')
    expect(hook).toContain('bloquearScroll')
    expect(hook).toContain('crearPilaCapas')
    expect(hook).toContain('esSuperior')
  })

  test('Modal y Drawer siguen renderizando el diálogo accesible', () => {
    const modal = renderToStaticMarkup(<Modal open title="Proveedores">…</Modal>)
    expect(modal).toContain('role="dialog"')
    expect(modal).toContain('aria-modal="true"')
    expect(modal).toContain('Proveedores')

    const drawer = renderToStaticMarkup(<Drawer open title="Detalle" side="left">…</Drawer>)
    expect(drawer).toContain('role="dialog"')
    expect(drawer).toContain('left-0 border-r')

    expect(renderToStaticMarkup(<Modal open={false} title="Cerrado" />)).toBe('')
    expect(renderToStaticMarkup(<Drawer open={false} title="Cerrado" />)).toBe('')
  })

  test('la regla queda documentada', () => {
    expect(reglas).toContain('`useDialogFocusTrap(open, onClose, ref, opciones)`')
    expect(reglas).toContain('pila de capas')
    expect(reglas).toContain('`useDialogPending(pendiente)`')
    expect(reglas).toContain('`FormActions`')
  })

  test('el cierre interactivo queda bloqueado mientras el diálogo está busy', () => {
    const ocupado = renderToStaticMarkup(<Modal open busy title="Guardando">…</Modal>)
    expect(ocupado).toContain('aria-busy="true"')
    expect(ocupado).toContain('disabled=""')
    const libre = renderToStaticMarkup(<Modal open title="Libre">…</Modal>)
    expect(libre).not.toContain('aria-busy')
    expect(libre).not.toContain('disabled=""')
  })

  test('el estándar de cierre con cambios queda en el objeto y en la regla (#323)', () => {
    expect(fuente).toContain('useDialogDirty')
    expect(fuente).toContain('CIERRE_CON_CAMBIOS')
    expect(reglas).toContain('Modal/drawer estándar (#323)')
    expect(reglas).toContain('`useValidacionCampos`')
    expect(reglas).toContain('`useResultado()`')
  })

  test('FormActions/SaveActions usan el pie del diálogo y el <form> real', () => {
    expect(fuente).toContain('createPortal(acciones, pie)')
    expect(fuente).toContain("ancla.current?.closest('form')")
    expect(fuente).toContain('conFormulario(children, formId)')
    const html = renderToStaticMarkup(
      <Modal open title="Editar">
        <form>
          <SaveActions pendiente><Button type="submit">Guardar</Button></SaveActions>
        </form>
      </Modal>,
    )
    expect(html).toContain('Cancelar')
    expect(html).toContain('Guardar')
    expect(html).toContain('disabled=""')
  })
})
