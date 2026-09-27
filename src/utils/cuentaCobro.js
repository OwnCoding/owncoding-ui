// Cuentas de cobro (#142/#262): etiquetas, íconos, símbolos y búsqueda en un
// solo lugar para el selector del POS y los listados de Finanzas. Portable: sin
// API y sin saldos; la app aporta las cuentas y los importes.

export const MEDIOS_CUENTA = {
  CASH: { etiqueta: 'Efectivo', icono: 'money' },
  TRANSFER: { etiqueta: 'Transferencia', icono: 'send' },
  CARD: { etiqueta: 'Tarjeta', icono: 'wallet' },
  TRADE_IN: { etiqueta: 'Canje', icono: 'refresh' },
  PIX: { etiqueta: 'Pix', icono: 'grid' },
  CRYPTO: { etiqueta: 'USDT - Cripto', icono: 'trending' },
}

export const SIMBOLOS_CUENTA = { PYG: 'Gs', USD: 'US$', BRL: 'R$', EUR: '€', USDT: 'USDT' }

export const etiquetaMedioCuenta = (kind) => MEDIOS_CUENTA[String(kind || '').toUpperCase()]?.etiqueta || String(kind || 'Otro')
export const iconoMedioCuenta = (kind) => MEDIOS_CUENTA[String(kind || '').toUpperCase()]?.icono || 'wallet'

/** Símbolo de la moneda; `currencyLabel` (personalizada) pisa el default. */
export function simboloCuenta(currency, currencyLabel) {
  const etiqueta = String(currencyLabel || '').trim()
  if (etiqueta) return etiqueta
  return SIMBOLOS_CUENTA[String(currency || '').toUpperCase()] || String(currency || '')
}

/** Número de cuenta enmascarado: solo los últimos 4 dígitos. */
export function numeroParcialCuenta(numero) {
  const limpio = String(numero || '').replace(/\s+/g, '')
  if (limpio.length <= 4) return limpio
  return `••••${limpio.slice(-4)}`
}

/** Normaliza para comparar: minúsculas y sin acentos. */
const normalizar = (valor) =>
  String(valor ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/** Texto buscable de una cuenta: nombre, banco/procesadora, titular, número y medio. */
export function campoBuscableCuenta(cuenta) {
  return normalizar([
    cuenta?.name,
    cuenta?.bank,
    cuenta?.holder,
    cuenta?.accountNumber,
    etiquetaMedioCuenta(cuenta?.kind),
    cuenta?.currency,
    cuenta?.currencyLabel,
  ].filter(Boolean).join(' '))
}

/** Tope de la lista del selector (#262): hasta 100 cuentas con scroll estable. */
export const LIMITE_CUENTAS = 100

/** Cuentas activas filtradas por el término (máx. `limite`). */
export function filtrarCuentasCobro(cuentas = [], termino = '', { limite = LIMITE_CUENTAS, incluirInactivas = false } = {}) {
  const lista = (Array.isArray(cuentas) ? cuentas : []).filter((cuenta) => incluirInactivas || cuenta?.isActive !== false)
  const q = normalizar(termino)
  if (!q) return lista.slice(0, limite)
  return lista.filter((cuenta) => campoBuscableCuenta(cuenta).includes(q)).slice(0, limite)
}

/**
 * Cuenta que el selector propone sin elegir (#262): la **última usada** de este
 * dispositivo manda (es la mejor pista del vendedor) y, si no hay, la
 * **predeterminada** que marque la app. Una cuenta inactiva no se propone nunca
 * (salvo `incluirInactivas`). Devuelve `null` si no hay nada que proponer.
 */
export function preseleccionDeCuenta(cuentas = [], { ultimoUsadoId = '', predeterminadaId = '', incluirInactivas = false } = {}) {
  const lista = Array.isArray(cuentas) ? cuentas : []
  const elegible = (id) => (id ? lista.find((cuenta) => cuenta?.id === id && (incluirInactivas || cuenta.isActive !== false)) || null : null)
  return elegible(ultimoUsadoId) || elegible(predeterminadaId) || null
}

/** Línea secundaria de una cuenta (sin el banco, que va aparte): titular, número, llave, referencia. */
export function detalleCuentaCobro(cuenta) {
  if (!cuenta) return ''
  const partes = []
  if (cuenta.holder) partes.push(`Titular ${cuenta.holder}`)
  if (cuenta.kind === 'TRANSFER' && cuenta.accountNumber) partes.push(`Nro ${numeroParcialCuenta(cuenta.accountNumber)}`)
  else if (cuenta.accountNumber) partes.push(numeroParcialCuenta(cuenta.accountNumber))
  if (cuenta.kind === 'PIX' && cuenta.pixKey) partes.push(`Llave ${cuenta.pixKey}`)
  if (cuenta.kind === 'CARD' && cuenta.processor) partes.push(cuenta.processor)
  if (['CRYPTO', 'CASH', 'TRADE_IN'].includes(cuenta.kind) && cuenta.reference) partes.push(cuenta.reference)
  return partes.join(' · ')
}
