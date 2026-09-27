// Selector de cuenta de cobro (#262): la tarjeta limpia (sin repetir el banco ni
// superponer elementos) y el selector que colapsa el buscador al elegir.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  LIMITE_CUENTAS,
  SelectorCuentaCobro,
  TarjetaCuentaCobro,
  detalleCuentaCobro,
  etiquetaMedioCuenta,
  filtrarCuentasCobro,
  iconoMedioCuenta,
  numeroParcialCuenta,
  preseleccionDeCuenta,
  simboloCuenta,
} from '../src/index.js'

const CONTINENTAL = {
  id: 'c1', name: 'Continental', bank: 'Banco Continental', kind: 'TRANSFER', currency: 'PYG',
  holder: 'MobOS SA', accountNumber: '1234567890', isActive: true,
}
const PIX = {
  id: 'c2', name: 'Pix de Ana', bank: 'Banco Atlas', kind: 'PIX', currency: 'USD', pixKey: 'ana@mail.com', isActive: true,
}
const INACTIVA = { id: 'c3', name: 'Vieja', kind: 'CASH', currency: 'PYG', isActive: false }

describe('cuenta de cobro', () => {
  test('etiquetas, íconos y símbolos', () => {
    expect(etiquetaMedioCuenta('TRANSFER')).toBe('Transferencia')
    expect(etiquetaMedioCuenta('pix')).toBe('Pix')
    expect(etiquetaMedioCuenta('OTRO')).toBe('OTRO')
    expect(iconoMedioCuenta('CARD')).toBe('wallet')
    expect(simboloCuenta('USD')).toBe('US$')
    expect(simboloCuenta('PYG', 'Guaraníes')).toBe('Guaraníes')
  })

  test('filtra activas por nombre, banco, titular o número', () => {
    const cuentas = [CONTINENTAL, PIX, INACTIVA]
    expect(filtrarCuentasCobro(cuentas, '').map((c) => c.id)).toEqual(['c1', 'c2'])
    expect(filtrarCuentasCobro(cuentas, 'atlas').map((c) => c.id)).toEqual(['c2'])
    expect(filtrarCuentasCobro(cuentas, 'MobOS').map((c) => c.id)).toEqual(['c1'])
    expect(filtrarCuentasCobro(cuentas, '7890').map((c) => c.id)).toEqual(['c1'])
    expect(filtrarCuentasCobro(cuentas, 'vieja', { incluirInactivas: true }).map((c) => c.id)).toEqual(['c3'])
  })

  test('detalle y número parcial sin repetir el banco', () => {
    expect(detalleCuentaCobro(CONTINENTAL)).toBe('Titular MobOS SA · Nro ••••7890')
    expect(detalleCuentaCobro(PIX)).toBe('Llave ana@mail.com')
    expect(numeroParcialCuenta('1234567890')).toBe('••••7890')
    expect(numeroParcialCuenta('123')).toBe('123')
  })

  test('la tarjeta muestra el banco una sola vez y el saldo pendiente', () => {
    const html = renderToStaticMarkup(
      <TarjetaCuentaCobro cuenta={CONTINENTAL} saldoPendientePyg={150000} onCambiar={() => {}} />,
    )
    expect(html).toContain('Continental')
    expect(html).toContain('Gs 150.000')
    expect(html.match(/Banco Continental/g)).toHaveLength(1)
    expect(html).toContain('Transferencia')
    expect(html).toContain('Cambiar cuenta')

    // Si el nombre ya dice el banco, no se repite.
    const sinRepetir = renderToStaticMarkup(<TarjetaCuentaCobro cuenta={{ ...CONTINENTAL, name: 'Banco Continental' }} />)
    expect(sinRepetir.match(/Banco Continental/g)).toHaveLength(1)

    // Cuenta en USD con cotización: muestra el equivalente.
    const usd = renderToStaticMarkup(<TarjetaCuentaCobro cuenta={PIX} saldoPendientePyg={730000} cotizacionPyg={7300} />)
    expect(usd).toContain('US$ 100,00')
  })

  test('el selector colapsa el buscador al haber cuenta y lo reabre con Cambiar cuenta', () => {
    const conCuenta = renderToStaticMarkup(
      <SelectorCuentaCobro cuentas={[CONTINENTAL, PIX]} cuentaId="c1" saldoPendientePyg={50000} />,
    )
    expect(conCuenta).toContain('data-testid="cuenta-cobro"')
    expect(conCuenta).toContain('cuenta-cobro-nombre')
    expect(conCuenta).not.toContain('role="combobox"')

    const sinCuenta = renderToStaticMarkup(<SelectorCuentaCobro cuentas={[CONTINENTAL, PIX]} />)
    expect(sinCuenta).toContain('role="combobox"')
    expect(sinCuenta).toContain('data-testid="cuenta-cobro-buscar"')
  })

  test('preselección: la última usada manda y, si no, la predeterminada', () => {
    const cuentas = [CONTINENTAL, PIX, INACTIVA]
    expect(preseleccionDeCuenta(cuentas, { ultimoUsadoId: 'c2' })?.id).toBe('c2')
    expect(preseleccionDeCuenta(cuentas, { predeterminadaId: 'c1' })?.id).toBe('c1')
    expect(preseleccionDeCuenta(cuentas, { ultimoUsadoId: 'c2', predeterminadaId: 'c1' })?.id).toBe('c2')
    // Una cuenta que ya no está (o está inactiva) no se propone: cae a la otra.
    expect(preseleccionDeCuenta(cuentas, { ultimoUsadoId: 'borrada', predeterminadaId: 'c1' })?.id).toBe('c1')
    expect(preseleccionDeCuenta(cuentas, { ultimoUsadoId: 'c3', predeterminadaId: 'c1' })?.id).toBe('c1')
    expect(preseleccionDeCuenta(cuentas, { ultimoUsadoId: 'c3', incluirInactivas: true })?.id).toBe('c3')
    expect(preseleccionDeCuenta(cuentas, {})).toBe(null)
    expect(preseleccionDeCuenta([], { ultimoUsadoId: 'c1' })).toBe(null)
  })

  test('la lista admite hasta 100 cuentas y respeta el límite pedido', () => {
    expect(LIMITE_CUENTAS).toBe(100)
    const muchas = Array.from({ length: 130 }, (_, i) => ({ id: `n${i}`, name: `Cuenta ${i}`, kind: 'CASH', currency: 'PYG', isActive: true }))
    expect(filtrarCuentasCobro(muchas, '')).toHaveLength(100)
    expect(filtrarCuentasCobro(muchas, 'Cuenta 12')).toHaveLength(11) // 12, 120-129
    expect(filtrarCuentasCobro(muchas, '', { limite: 25 })).toHaveLength(25)
  })

  test('la lista larga se virtualiza: solo se montan las filas visibles', () => {
    const cuentas = Array.from({ length: 100 }, (_, i) => ({ id: `c${i}`, name: `Cuenta ${String(i).padStart(3, '0')}`, kind: 'CASH', currency: 'PYG', isActive: true }))
    const html = renderToStaticMarkup(<SelectorCuentaCobro cuentas={cuentas} />)

    const filas = html.match(/role="option"/g) || []
    expect(filas.length).toBeLessThanOrEqual(12)
    expect(html).toContain('aria-setsize="100"')
    expect(html).toContain('aria-posinset="1"')
    expect(html).toContain('Cuenta 000')
    expect(html).not.toContain('Cuenta 050')
    // El alto de lo que falta se reserva con el relleno de la lista (scroll estable).
    expect(html).toMatch(/padding-bottom:\s*\d{3,}px/)
  })

  test('con 100 cuentas sigue colapsando al elegir y buscando', () => {
    const cuentas = Array.from({ length: 100 }, (_, i) => ({ id: `c${i}`, name: `Cuenta ${i}`, kind: 'CASH', currency: 'PYG', isActive: true }))
    const conCuenta = renderToStaticMarkup(<SelectorCuentaCobro cuentas={cuentas} cuentaId="c42" />)
    expect(conCuenta).toContain('Cuenta 42')
    expect(conCuenta).not.toContain('role="combobox"')
    expect(renderToStaticMarkup(<SelectorCuentaCobro cuentas={cuentas} />)).toContain('role="combobox"')
  })
})
