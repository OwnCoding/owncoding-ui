// Selector de cuenta de cobro (#262): la tarjeta limpia (sin repetir el banco ni
// superponer elementos) y el selector que colapsa el buscador al elegir.
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  SelectorCuentaCobro,
  TarjetaCuentaCobro,
  detalleCuentaCobro,
  etiquetaMedioCuenta,
  filtrarCuentasCobro,
  iconoMedioCuenta,
  numeroParcialCuenta,
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
})
