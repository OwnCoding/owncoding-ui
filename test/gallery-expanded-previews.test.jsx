// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { SHELL_DEMOS } from '../gallery/shell-previews.jsx'
import { OPERATION_DEMOS } from '../gallery/operation-previews.jsx'
import { ComponentPreview } from '../gallery/component-previews.jsx'
import { CATALOGO_EXPORTS } from '../gallery/catalog.js'

const observed = vi.hoisted(() => new Set())
vi.mock('../src/index.js', async importOriginal => {
  const actual = await importOriginal()
  const names = ['AuthLayout', 'AyudaModulo', 'BarraInferior', 'CampanaAvisos', 'GoogleButton', 'GoogleMark', 'LoadingScreen', 'MenuDesplegable', 'NavegacionSeccion', 'NavLateral', 'OAuthDivider', 'PaletaComandos', 'Avatar', 'PersonaChip', 'PilaPersonas', 'FormActions', 'SaveActions', 'FormField', 'SeccionColapsable', 'Subtabs', 'Stepper', 'PeriodoTabs', 'NumericKeypad', 'ConfirmarConPalabra', 'TaxIdField', 'InstagramField', 'ChipEstado', 'EstadoBadge', 'FilaDato', 'GradoBadge', 'GraficoBarras', 'Cronologia', 'MedidorStock', 'ConteoChecklist', 'ContadorLote', 'ChipOrigen', 'ChipPrioridad', 'Vencimiento']
  return { ...actual, ...Object.fromEntries(names.map(name => [name, props => { observed.add(name); return React.createElement(actual[name], props) }])) }
})
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let host, root
beforeEach(() => { observed.clear(); host = document.createElement('div'); document.body.append(host); root = createRoot(host) })
afterEach(() => { act(() => root.unmount()); host.remove() })
const render = async name => { await act(async () => root.render(<ComponentPreview key={name} name={name} />)) }
const click = label => act(() => [...document.querySelectorAll('button')].find(button => button.textContent === label || button.getAttribute('aria-label') === label).click())

test.each([...Object.keys(SHELL_DEMOS), ...Object.keys(OPERATION_DEMOS)])('%s mapping instantiates its actual named export', async name => {
  await render(name)
  if (name === 'SaveActions') click('Abrir formulario local')
  expect(observed.has(name)).toBe(true)
  expect(CATALOGO_EXPORTS.find(item => item.nombre === name).presentacion).toBe('individual')
  expect(host.querySelector('[data-demo-export]').dataset.demoExport).toBe(name)
})
test('numeric keypad changes local output and supports deletion', async () => {
  await render('NumericKeypad'); click('Agregar 7'); click('Agregar 2')
  expect(host.querySelector('output').textContent).toBe('72')
  click('Borrar último dígito')
  expect(host.querySelector('output').textContent).toBe('7')
})
test('menu selection and navigation affect local status only', async () => {
  await render('MenuDesplegable'); click('Acciones de muestra'); click('Ver detalle local')
  expect(host.textContent).toContain('Detalle local seleccionado.')
  expect(host.querySelector('[role="menu"]')).toBeNull()
  await render('BarraInferior'); click('Actividad')
  expect(host.querySelector('[aria-current="page"]').textContent).toContain('Actividad')
})
test('OAuth simulation never authenticates and has deterministic busy state', async () => {
  await render('GoogleButton'); click('Continuar con Google')
  expect(host.textContent).toContain('no autenticación OAuth')
  click('Alternar ocupado')
  expect(host.querySelector('[aria-busy="true"]').disabled).toBe(true)
})
test('empty chart fixture and local completion are controllable', async () => {
  await render('GraficoBarras'); click('Alternar sin datos')
  expect(host.textContent).toContain('Sin datos para graficar')
  await render('ConteoChecklist'); click('Avanzar muestra'); click('Avanzar muestra'); click('Avanzar muestra')
  expect(host.textContent).toContain('4 de 4 verificaciones')
})
test('collapsible demo explicitly disables session persistence', async () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem')
  await render('SeccionColapsable')
  act(() => host.querySelector('button').click())
  expect(host.querySelector('button').getAttribute('aria-expanded')).toBe('true')
  expect(spy).not.toHaveBeenCalled()
  spy.mockRestore()
})
test('Itaú contained slot has targeted larger sizing without changing other marks', async () => {
  const source = readFileSync('gallery/financial-fixtures.js', 'utf8')
  expect(source).toContain("nombre === 'Itaú' && variante === 'horizontal' && contenida ? 'h-16'")
  expect(source).toContain("variante === 'compacto' ? 'h-12' : 'h-10'")
})

test('every curated mapping is auditable against actual JSX or documented composition', async () => {
  const source = ['gallery/reusable-previews.jsx', 'gallery/main.jsx', 'gallery/component-previews.jsx', 'gallery/shell-previews.jsx', 'gallery/operation-previews.jsx', 'gallery/document-previews.jsx', 'gallery/review-previews.jsx', 'gallery/receiving-previews.jsx', 'gallery/search-board-previews.jsx', 'gallery/specialized-previews.jsx'].map(path => readFileSync(path, 'utf8')).join('\n')
  const composed = {
    CountryPhoneSelect: readFileSync('src/components/PhoneField.jsx', 'utf8'),
    FormActions: source,
    SaveActions: source,
  }
  for (const entry of CATALOGO_EXPORTS.filter(item => item.presentacion)) {
    const direct = new RegExp(`<${entry.nombre}(?:\\s|/|>)`).test(source)
    if (['FormActions', 'SaveActions'].includes(entry.nombre)) {
      expect(source).toContain('const Actions = save ? SaveActions : FormActions')
    } else if (entry.nombre === 'CountryPhoneSelect') {
      expect(source).toMatch(/<PhoneField[\s>]/)
      expect(composed.CountryPhoneSelect).toMatch(/<CountryPhoneSelect[\s>]/)
    } else {
      expect(direct, `${entry.nombre} needs an actual render, not a family claim`).toBe(true)
    }
  }
})

test('supplied financial originals preserve byte identities and provenance', async () => {
  const manifest = JSON.parse(readFileSync('docs/financial-assets-manifest.json', 'utf8'))
  for (const [file, digest, dimension] of [
    ['bancos/gnb-compacto.png', 'cf652c79268aeb719b033cd5ce84d26a57a0e45d31828a55913b4eaa9d262db6', 920],
    ['bancos/san-cristobal-compacto.png', '91c1f82e91adf268bdc22507331d0525cb4204b7485eb3aa82f8b5397219ed5b', 512],
  ]) {
    const record = manifest.assets.find(asset => asset.file === file)
    expect(record.sourceKind).toBe('user-provided-reference')
    expect(record.sourceUrl).toBeUndefined()
    expect(record.sha256).toBe(digest)
    expect(record.dimensions).toEqual({ width: dimension, height: dimension })
  }
})
