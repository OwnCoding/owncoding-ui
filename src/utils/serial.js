// Serial/IMEI: el final identifica el equipo de un vistazo y nunca se recorta.

// Limpieza estándar: sin espacios ni guiones, en mayúsculas y sin el prefijo
// `MOBOS:` de las etiquetas del agente.
export function normalizarSerial(value = '') {
  return String(value ?? '')
    .trim()
    .replace(/^MOBOS:/i, '')
    .replace(/[\s-]+/g, '')
    .toUpperCase()
}

export function ultimos4(serial) {
  return String(serial ?? '').slice(-4)
}

export function partirSerial(serial) {
  const texto = String(serial ?? '')
  if (!texto) return { cabeza: '', cola: '' }
  return { cabeza: texto.slice(0, -4), cola: texto.slice(-4) }
}

// Máscara para las vistas donde el serial completo no aporta: "••••4821".
export function serialEnmascarado(serial) {
  const cola = ultimos4(serial)
  return cola ? `••••${cola}` : ''
}

// IMEI: 15 dígitos con dígito control (Luhn). El proveedor y el backend
// rechazan los que no pasan, así que la UI puede avisar antes de enviar.
// `normalizarImei` limpia y acota lo que se escribe o pega; `estadoImei` y
// `analizarImei` traducen el valor al estado que dibuja `ImeiField`.
export const LARGO_IMEI = 15

function soloDigitosImei(valor) {
  return String(valor ?? '').replace(/\D/g, '')
}

/** Solo dígitos, sin espacios ni guiones, acotado a 15 (para el input). */
export function normalizarImei(valor) {
  return soloDigitosImei(valor).slice(0, LARGO_IMEI)
}

export const MENSAJES_IMEI = {
  vacio: `El IMEI tiene ${LARGO_IMEI} dígitos.`,
  obligatorio: 'Completá el IMEI.',
  incompleto: (faltan) => (faltan === 1 ? 'Falta 1 dígito para completar el IMEI.' : `Faltan ${faltan} dígitos para completar el IMEI.`),
  invalido: 'El IMEI no es válido: revisá el dígito control.',
  valido: 'IMEI válido.',
  revisando: 'Revisando el IMEI…',
}

/**
 * Estado del IMEI para el feedback en vivo: `vacio` (sin dígitos),
 * `incompleto` (faltan dígitos), `invalido` (15 dígitos sin Luhn o de más) o
 * `valido`.
 */
export function estadoImei(valor) {
  const digitos = soloDigitosImei(valor)
  if (!digitos) return 'vacio'
  if (digitos.length < LARGO_IMEI) return 'incompleto'
  if (digitos.length > LARGO_IMEI) return 'invalido'
  return imeiValido(digitos) ? 'valido' : 'invalido'
}

/**
 * Análisis completo para la UI: el IMEI limpio, el largo, cuántos dígitos
 * faltan y los banderines `completo`/`valido` junto con el `estado`.
 */
export function analizarImei(valor) {
  const digitos = soloDigitosImei(valor)
  const estado = estadoImei(valor)
  return {
    imei: digitos.slice(0, LARGO_IMEI),
    largo: digitos.length,
    faltan: Math.max(0, LARGO_IMEI - digitos.length),
    completo: estado === 'valido' || estado === 'invalido',
    valido: estado === 'valido',
    estado,
  }
}

/** IMEI de 15 dígitos exactos con dígito control (Luhn). */
export function imeiValido(valor) {
  const imei = soloDigitosImei(valor)
  if (imei.length !== LARGO_IMEI) return false
  let suma = 0
  for (let i = 0; i < LARGO_IMEI; i += 1) {
    let digito = Number(imei[14 - i])
    if (i % 2 === 1) {
      digito *= 2
      if (digito > 9) digito -= 9
    }
    suma += digito
  }
  return suma % 10 === 0
}

// Separa un texto pegado o escaneado (líneas, comas, punto y coma, espacios o
// tabs) en seriales normalizados y únicos, en orden de aparición.
export function separarSeriales(texto, { maxLargo = 32 } = {}) {
  const vistos = new Set()
  const seriales = []
  for (const bruto of String(texto ?? '').split(/[\s,;|]+/)) {
    const serial = normalizarSerial(bruto).slice(0, maxLargo)
    if (!serial || vistos.has(serial)) continue
    vistos.add(serial)
    seriales.push(serial)
  }
  return seriales
}

// Normaliza una lista pegada con los conteos que necesita la UI: los válidos
// únicos, los repetidos (dentro del texto) y los que no pasan `validar`
// (por ejemplo `imeiValido` para IMEI). Sin `validar` no hay inválidos.
export function normalizarSeriales(texto, { validar, limite = 9999, maxLargo = 32 } = {}) {
  const vistos = new Set()
  const repetidos = []
  const invalidos = []
  const seriales = []
  for (const bruto of String(texto ?? '').split(/[\s,;|]+/)) {
    const serial = normalizarSerial(bruto).slice(0, maxLargo)
    if (!serial) continue
    if (vistos.has(serial)) {
      repetidos.push(serial)
      continue
    }
    vistos.add(serial)
    if (typeof validar === 'function' && !validar(serial)) {
      invalidos.push(serial)
      continue
    }
    if (seriales.length >= limite) continue
    seriales.push(serial)
  }
  return { seriales, repetidos, invalidos }
}
