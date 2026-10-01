import { describe, expect, test } from 'vitest'

import { obtenerAssetFinanciero } from '../src/financial/assets.js'
import { auditSvg } from '../scripts/financial-svg-audit.mjs'

describe('seguridad del catálogo financiero', () => {
  test('el registro visual solo resuelve claves propias', () => {
    expect(obtenerAssetFinanciero('bancos/ueno-compacto.svg')).toMatch(/^(?:data:image\/|\/src\/assets\/financial\/)/)
    expect(obtenerAssetFinanciero('__proto__')).toBeNull()
    expect(obtenerAssetFinanciero('constructor')).toBeNull()
    expect(obtenerAssetFinanciero('toString')).toBeNull()
    expect(obtenerAssetFinanciero(null)).toBeNull()
  })

  test('el auditor acepta SVG pasivo y rechaza XML malformado y contenido activo', () => {
    expect(auditSvg('safe.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path d="M0 0h1v1z"/></svg>')).toEqual([])
    expect(auditSvg('broken.svg', '<svg viewBox="0 0 1 1"><g></svg>')).toContain('broken.svg: XML/SVG malformado')
    expect(auditSvg('smil.svg', '<svg viewBox="0 0 1 1"><set attributeName="href" to="https://example.com/x"/></svg>')).toContain('smil.svg: elemento activo SVG no permitido')
  })

  test('rechaza elementos activos con namespace y tokens CSS escapados', () => {
    const namespaceScript = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><s:script/></svg>'
    const escapedImport = String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><style>@im\70ort "https://example.com/x.css";</style></svg>`
    const escapedUrl = String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path style="fill:u\72l(https://example.com/x)"/></svg>`

    expect(auditSvg('namespace-script.svg', namespaceScript)).toContain('namespace-script.svg: elemento activo SVG no permitido')
    expect(auditSvg('escaped-import.svg', escapedImport)).toContain('escaped-import.svg: CSS @import no permitido')
    expect(auditSvg('escaped-url.svg', escapedUrl)).toContain('escaped-url.svg: CSS url externo https://example.com/x')
    expect(auditSvg('malformed-prefixed.svg', '<svg xmlns:s="urn:test" viewBox="0 0 1 1"><s:script></svg>')).toContain('malformed-prefixed.svg: XML/SVG malformado')
  })

  test('el auditor inspecciona SVG anidado dentro de data URLs', () => {
    const nested = Buffer.from('<svg viewBox="0 0 1 1"><script>alert(1)</script></svg>').toString('base64')
    const source = `<svg viewBox="0 0 1 1"><image href="data:image/svg+xml;base64,${nested}"/></svg>`
    expect(auditSvg('nested.svg', source)).toContain('nested.svg#data-svg: elemento activo SVG no permitido')
  })
})
