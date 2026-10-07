const GS_FORMATTER = new Intl.NumberFormat('es-PY', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

// Símbolo de cada moneda: único lugar del paquete (lo usan `Money`, `MoneyInput`
// y los helpers). El guaraní va **sin punto**: `Gs 1.234.567`.
export const SIMBOLO_PYG = 'Gs'
export const SIMBOLOS_MONEDA = { PYG: 'Gs', USD: 'US$', BRL: 'R$', EUR: '€', USDT: 'USDT' }

// Opciones del símbolo: cadena suelta (`'₲'`) u objeto (`{ simbolo: 'Gs.' }`).
// Vacío o ausente → el símbolo por defecto. Se recorta y se une con un solo
// espacio, así `'Gs  '` no deja el monto separado de más.
function simboloDe(opciones) {
  const crudo = typeof opciones === 'string' ? opciones : opciones?.simbolo
  return String(crudo ?? '').trim() || SIMBOLO_PYG
}

// El vacío puede venir como segundo/tercer argumento (firma histórica) o dentro
// del objeto de opciones, igual que en `utils/fecha.js`.
function opcionesDeVacio(vacio, opciones) {
  if (vacio && typeof vacio === 'object') return { vacio: vacio.vacio ?? '—', simbolo: vacio.simbolo }
  return { vacio: vacio ?? '—', simbolo: opciones?.simbolo }
}

// Tamaños de monto de la app (épica #148, sección 9): el campo general
// soporta hasta 10.000.000.000 y las ventas hasta 99.000.000.000. El campo
// nunca recorta lo que se escribe; el formulario valida con estos límites.
export const LIMITE_MONTO_GENERAL = 10_000_000_000
export const LIMITE_MONTO_VENTAS = 99_000_000_000

// ¿El monto supera el límite? Se usa para marcar el campo (`aria-invalid`) y
// para validar antes de guardar; nunca para truncar el valor tipeado.
export function excedeMonto(value, limite = LIMITE_MONTO_GENERAL) {
  const texto = String(value ?? '').trim().replace(/\./g, '').replace(',', '.')
  if (!texto) return false
  const numero = Number(texto)
  return Number.isFinite(numero) && Math.abs(numero) > limite
}

// Tope real de almacenamiento: los importes viven en columnas enteras de 32
// bits, así que por encima de este valor el backend rechaza el guardado. Los
// campos marcan y los formularios bloquean con `errorMonto`; los límites de
// producto (10B/99B de #148) quedan como objetivo pendiente de migrar.
export const LIMITE_MONTO_ALMACENABLE = 2_147_483_647

/** Límite efectivo de un campo: el del contexto, acotado a lo almacenable. */
export function limiteMonto(max = LIMITE_MONTO_GENERAL) {
  const valor = Number(max)
  return Number.isFinite(valor) && valor > 0 ? Math.min(valor, LIMITE_MONTO_ALMACENABLE) : LIMITE_MONTO_ALMACENABLE
}

/** Mensaje para bloquear el guardado, o '' si el monto entra. */
export function errorMonto(value, max = LIMITE_MONTO_GENERAL) {
  const limite = limiteMonto(max)
  return excedeMonto(value, limite) ? `El monto supera el máximo que el sistema puede guardar (Gs ${formatoNumero(limite)}).` : ''
}

const USD_FORMATTER = new Intl.NumberFormat('es-PY', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// Formato único de guaraníes: `Gs 1.234.567`. El símbolo es configurable por
// app (`formatGs(1250000, { simbolo: 'Gs.' })` o `formatGs(1250000, '₲')`) sin
// cambiar la firma histórica `formatGs(valor)`; el default sigue siendo `Gs`.
export function formatGs(value, opciones) {
  const amount = Number(value)
  return `${simboloDe(opciones)} ${GS_FORMATTER.format(Number.isFinite(amount) ? Math.round(amount) : 0)}`
}

// Presentación editable: conserva solo dígitos y agrega separadores de miles.
// El valor guardado/calculado sigue siendo numérico mediante parseGsInput.
export function formatGsInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return digits ? GS_FORMATTER.format(Number(digits)) : ''
}

export function parseGsInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

const USD_INPUT_FORMATTER = new Intl.NumberFormat('es-PY', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// Presentación editable para monedas decimales (USD/BRL/EUR/USDT):
// separador de miles con punto y 2 decimales con coma (es-PY).
export function formatUsdInput(value) {
  const text = String(value ?? '').trim()
  if (!text) return ''
  const amount = Number(text)
  return Number.isFinite(amount) ? USD_INPUT_FORMATTER.format(amount) : ''
}

// Convierte el texto del campo a un string decimal limpio (punto como
// separador decimal), en el mismo estilo que parseGsInput para guaraníes.
export function parseUsdInput(value) {
  const text = String(value ?? '').trim()
  if (!text) return ''
  const normalized = text.replace(/\./g, '').replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(normalized)) return ''
  return String(Number(normalized))
}

// ── Edición de montos con caret estable (cosecha de ScaleOS, #2) ────────────
// El texto del campo (mientras se tipea o pega) se acepta en es-PY
// (`1.234,56`), en-US (`1,234.56`) o suelto (`1250.50`) y sale como valor de
// transporte: dígitos para PYG (`integerOnly` incluido), decimal con punto para
// el resto. Un grupo de miles convencional en cualquier locale (`1.234`,
// `1,234`, `1.234.567`) es un entero.
const GRUPO_MILES = /^\d{1,3}([.,])\d{3}(?:\1\d{3})*$/
const CONTINUACION_MILES = /^\d{1,3}([.,])\d{3,}(?:\1\d+)*$/

export function normalizarMontoInput(texto, moneda = 'PYG', { integerOnly = false } = {}) {
  const bruto = String(texto ?? '').replace(/[^0-9.,]/g, '')
  if (!bruto) return ''
  if (GRUPO_MILES.test(bruto)) return bruto.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  if (moneda === 'PYG' || integerOnly) return enteroDeMonto(bruto)
  // Un punto como último separador con 1-2 dígitos es decimal: se pasa a coma
  // es-PY y se descarta el resto. Si no, la coma manda.
  let display = bruto
  if (bruto.lastIndexOf('.') > bruto.lastIndexOf(',') && /\.\d{0,2}$/.test(bruto)) {
    const punto = bruto.lastIndexOf('.')
    display = bruto.slice(0, punto).replace(/[.,]/g, '') + ',' + bruto.slice(punto + 1)
  }
  const [entero = '', decimales] = display.replace(/[^0-9,]/g, '').split(',')
  const limpio = entero.replace(/^0+(?=\d)/, '')
  return decimales !== undefined ? `${limpio || '0'}.${decimales.slice(0, 2)}` : limpio
}

// PYG nunca lleva decimales: tipear más allá de un separador continúa el
// entero (`1.2345` → `12345`) y una cola decimal pegada después de un grupo de
// miles se descarta en vez de concatenarse.
function enteroDeMonto(bruto) {
  if (CONTINUACION_MILES.test(bruto)) return bruto.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  const ultimo = Math.max(bruto.lastIndexOf('.'), bruto.lastIndexOf(','))
  if (ultimo < 0) return bruto.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  return enteroDeMonto(bruto.slice(0, ultimo))
}

// Posición del caret después de N dígitos: se cuentan los dígitos del display
// nuevo (los separadores no cuentan), así el cursor no salta al final al
// insertar o borrar en el medio del monto.
export function caretTrasDigitos(display, digitos) {
  if (digitos <= 0) return 0
  let vistos = 0
  for (let indice = 0; indice < display.length; indice += 1) {
    if (/\d/.test(display[indice])) vistos += 1
    if (vistos === digitos) return indice + 1
  }
  return display.length
}

// Solo formatea un monto ya expresado en USD; nunca convierte desde PYG.
export function formatUsd(value) {
  const amount = Number(value)
  return `USD ${USD_FORMATTER.format(Number.isFinite(amount) ? amount : 0)}`
}

// Formato único de presentación. No convierte monedas: cada movimiento conserva
// su moneda y, cuando aplica, su cotización congelada en el backend. El símbolo
// del guaraní se puede pisar con `{ simbolo }` (misma opción que `formatGs`).
export function formatMoney(value, currency = 'PYG', opciones) {
  // Explicit locale opts into strict, generalized presentation. Legacy calls
  // retain their existing symbols, parsing and currency fallback unchanged.
  if (opciones && typeof opciones === 'object' && opciones.locale !== undefined) {
    const missing = opciones.vacio ?? '—'
    const numeric = typeof value === 'number' || (typeof value === 'string' &&
      /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()))
    if (!numeric || !Number.isFinite(Number(value)) || typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) return missing
    try {
      return new Intl.NumberFormat(opciones.locale, {
        ...opciones.numberFormatOptions,
        style: 'currency', currency,
        currencyDisplay: opciones.currencyDisplay ?? 'code',
      }).format(Number(value))
    } catch { return missing }
  }
  return currency === 'USD' ? formatUsd(value) : formatGs(value, opciones)
}

// ── Montos de pantalla (el formato que ya usan ui/Money y las listas) ────────// "Gs 12.500" y "US$ 1,234.56": es la presentación dominante del repo (la de
// `Money`, `gs()` y `formatGs`). Los montos se escriben con estos helpers y no
// con `toLocaleString` a mano; el vacío es explícito ('—' por defecto) para no
// mostrar 0 cuando falta el dato. No convierten moneda.
//
// `montoGs(1250000, '—', { simbolo: 'Gs.' })` y `montoTexto(total, 'PYG', '')`
// siguen funcionando: el vacío mantiene su lugar y las opciones van al final (o
// dentro del objeto de vacío).
export function montoGs(value, vacio = '—', opciones) {
  const { vacio: vacioFinal, simbolo } = opcionesDeVacio(vacio, opciones)
  const amount = numeroDe(value)
  return amount === null ? vacioFinal : formatGs(amount, { simbolo })
}

export function montoUsd(value, vacio = '—', opciones) {
  const { vacio: vacioFinal, simbolo } = opcionesDeVacio(vacio, opciones)
  const amount = numeroDe(value)
  const prefijo = String(simbolo ?? '').trim() || SIMBOLOS_MONEDA.USD
  return amount === null ? vacioFinal : `${prefijo} ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export function montoTexto(value, currency = 'PYG', vacio = '—', opciones) {
  return currency === 'USD' ? montoUsd(value, vacio, opciones) : montoGs(value, vacio, opciones)
}

// null / undefined / '' no son 0: son dato ausente.
function numeroDe(value) {
  if (value === null || value === undefined || value === '') return null
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : null
}

// Largo máximo del texto de un monto: dígitos del tope + separadores de miles
// (+ 3 si la moneda lleva decimales). El campo lo usa como `maxLength`, así el
// monto más grande documentado entra completo y no se puede escribir de más.
export function largoMaximoMonto(max = LIMITE_MONTO_GENERAL, { decimales = false } = {}) {
  const digitos = String(Math.trunc(Math.abs(Number(max) || 0))).length
  const separadores = Math.floor((digitos - 1) / 3)
  return digitos + separadores + (decimales ? 3 : 0)
}

// ── Números y signos (tableros, deltas) ─────────────────────────────────────
// Cantidades con el formato es-PY (separa miles con punto): la usan los
// gráficos y los contadores para no armar `toLocaleString` por pantalla.

const NUMEROS_FORMATTER = new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 })
const NUMEROS_DECIMALES = new Map()

function formateadorNumero(decimales) {
  const clave = Number(decimales) || 0
  if (clave <= 0) return NUMEROS_FORMATTER
  if (!NUMEROS_DECIMALES.has(clave)) {
    NUMEROS_DECIMALES.set(clave, new Intl.NumberFormat('es-PY', { minimumFractionDigits: clave, maximumFractionDigits: clave }))
  }
  return NUMEROS_DECIMALES.get(clave)
}

/** Cantidad con separador de miles es-PY; el vacío es explícito (no es 0). */
export function formatoNumero(value, { decimales = 0, vacio = '—' } = {}) {
  const amount = numeroDe(value)
  return amount === null ? vacio : formateadorNumero(decimales).format(amount)
}

/** Signo tipográfico de un importe: `+`, `−` (menos real) o vacío si es 0/ausente. */
export function signoDe(value) {
  const amount = numeroDe(value)
  if (amount === null || amount === 0) return ''
  return amount > 0 ? '+' : '−'
}

/**
 * Importe con signo: `+ Gs 1.200.000` / `− Gs 500.000`. El cero no lleva signo;
 * un dato ausente devuelve el texto de vacío. No convierte moneda. El símbolo
 * del guaraní se puede pisar con las mismas opciones que `formatGs`.
 */
export function montoConSigno(value, currency = 'PYG', vacio = '—', opciones) {
  const { vacio: vacioFinal } = opcionesDeVacio(vacio, opciones)
  const amount = numeroDe(value)
  if (amount === null) return vacioFinal
  const signo = signoDe(amount)
  return signo ? `${signo} ${montoTexto(Math.abs(amount), currency, '—', opciones)}` : montoTexto(amount, currency, '—', opciones)
}
