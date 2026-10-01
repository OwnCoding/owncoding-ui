// Tipos publicados: el paquete declara `types` (y la condición del `exports`)
// apuntando a `dist/index.d.ts`, el build copia el archivo declarado a mano y
// los nombres clave de la API existen en las declaraciones. No es un test de
// TypeScript (no hay TS en el paquete): verifica el contrato publicado.
import { describe, expect, test } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import * as runtime from '../src/index.js'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const dts = readFileSync(new URL('../types/index.d.ts', import.meta.url), 'utf8')
const dist = new URL('../dist/index.d.ts', import.meta.url)
const presetDts = readFileSync(new URL('../types/tailwind-preset.d.ts', import.meta.url), 'utf8')

const exporta = (nombre) => new RegExp(`export (function|const|type|interface|class) ${nombre}\\b`).test(dts)

describe('tipos publicados (.d.ts)', () => {
  test('package.json los expone por `types` y por la condición del exports', () => {
    expect(pkg.types).toBe('./dist/index.d.ts')
    expect(pkg.exports['.'].types).toBe('./dist/index.d.ts')
    expect(pkg.exports['.'].default).toBe('./dist/index.js')
    expect(pkg.exports['./tailwind-preset'].types).toBe('./types/tailwind-preset.d.ts')
    expect(pkg.files).toContain('types')
  })

  test('el build copia las declaraciones al paquete (dist/index.d.ts)', () => {
    expect(existsSync(dist)).toBe(true)
    expect(readFileSync(dist, 'utf8')).toBe(dts)
  })

  test('los objetos principales y sus props están declarados', () => {
    for (const nombre of [
      // Primitivas y campos
      'Button', 'Input', 'MoneyInput', 'Money', 'Select', 'Textarea', 'Label', 'Card',
      'Modal', 'ConfirmDialog', 'Drawer', 'ToastProvider', 'useToast', 'EmptyState',
      'ErrorState', 'Aviso', 'Nota', 'DataTable', 'FormField', 'Stat', 'Subtabs',
      'FilaDato', 'CeldaMoneda', 'BarraProgreso', 'Icon',
      // Estados, tablas y dinero
      'ChipEstado', 'ESTADOS_CHIP', 'estadoChip', 'TONOS', 'tonoCanonico',
      'CELDA_DATO', 'CELDA_NUMERO', 'ROTULO_DATO', 'formatGs', 'montoTexto',
      'montoConSigno', 'SIMBOLOS_MONEDA', 'fechaHora', 'fechaDia', 'fechaCorta',
      'fechaHoraCorta', 'TAMANOS_CAMPO', 'TAMANOS_MODAL',
      // Lote 2
      'Calendario', 'RangoFecha', 'PaletaComandos', 'AyudaModulo', 'BarraInferior',
      'Avatar', 'ImporteDelta', 'IndicadorConexion', 'CampanaAvisos', 'GraficoBarras',
      // Lote LedBox
      'TableroKanban', 'useTableroOptimista', 'Cronologia', 'PlanPagos',
      'DocumentoImpresion', 'SubidaImagen', 'ProgresoChecklist', 'progresoChecklist',
      // Cosecha de PagaYa (#1)
      'TaxIdField', 'taxIdValid', 'normalizeTaxId', 'ThemeToggle', 'aplicarTema',
      'SectionState', 'useDialogFocusTrap',
      // Cosecha de ScaleOS (#2)
      'useSingleFlightSubmit', 'completeSave', 'crearEnvioUnico', 'AVISO_REFRESCO',
      'normalizarMontoInput', 'caretTrasDigitos', 'FormActions', 'SaveActions',
      'useDialogPending', 'crearPilaCapas', 'fechaLista', 'fechaListaCorta',
      'diasHasta', 'tonoVencimiento',
    ]) {
      expect(exporta(nombre), `falta el tipo de ${nombre}`).toBe(true)
    }
  })

  test('los tipos del preset cubren `owncodingContent`', () => {
    expect(presetDts).toContain('owncodingContent')
    expect(presetDts).toContain('export default')
  })

  test('los contratos aditivos coinciden con los valores que entrega el runtime', () => {
    expect(dts).toContain('LabelHTMLAttributes<HTMLLabelElement>')
    expect(dts).toMatch(/PercentField[\s\S]*onChange\?: \(value: string\)/)
    expect(dts).toMatch(/EmailField[\s\S]*onChange\?: \(value: string\)/)
    expect(dts).toMatch(/LoadingScreen[\s\S]*mensaje\?: string/)
    expect(dts).toMatch(/DataTableColumn[\s\S]*mobile\?: boolean/)
    expect(dts).toContain('getRowKey?: (row: Row, index: number) => string | number')
    expect(dts).toMatch(/MedidorBateria[\s\S]*mostrarEtiqueta\?: boolean/)
  })

  test('todo export del runtime está declarado y toda declaración de valor existe', () => {
    // La entrada principal no se vuelve a despegar del `.d.ts`: si un objeto
    // nuevo sale por `owncoding-ui`, tiene que quedar declarado acá.
    const sinDeclarar = Object.keys(runtime)
      .filter((nombre) => nombre !== 'default')
      .filter((nombre) => !exporta(nombre))
    expect(sinDeclarar, `sin declarar: ${sinDeclarar.join(', ')}`).toEqual([])

    // Al revés: un `function`/`const` declarado sin runtime es un tipo mentiroso
    // (`normalizarBusqueda` estaba en esa situación). `type`/`interface` son
    // solo del consumidor.
    const valores = [...dts.matchAll(/export (?:function|const|class) ([A-Za-z_$][\w$]*)/g)].map((match) => match[1])
    const sinRuntime = valores.filter((nombre) => !(nombre in runtime))
    expect(sinRuntime, `declarados sin runtime: ${sinRuntime.join(', ')}`).toEqual([])
  })
})
