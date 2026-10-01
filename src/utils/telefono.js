import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import { PAISES_TELEFONO, paisTelefonoPorIso, paisesDeCodigo } from './paisesTelefono.js'

// Validación de teléfono para WhatsApp y clientes.
// Paraguay (+595): solo móviles 9XXXXXXXX (9 dígitos después del código).
// Otros países: entre 6 y 12 dígitos, sin formato estricto.
//
// Formato canónico: SIEMPRE con código de país y agrupado —
// `+595 981 123 456`—. `normalizarTelefono` lo fija y `componerTelefono` lo
// arma; `telefonoVisible` lo dibuja. Los dígitos sueltos (`internationalPhone`,
// `soloDigitos`) son para WhatsApp y para los campos de entrada.

// Códigos de país sugeridos por `PhoneField`. También son la pista para partir
// un pegado con prefijo internacional `00…` (el código más largo primero).
export const CODIGOS_PAIS = ['+595', '+55', '+54', '+56', '+591', '+598', '+1', '+34', '+44', '+351']

const CODIGOS_INTERNACIONALES_ORDENADOS = [...new Set(PAISES_TELEFONO.map((pais) => pais.countryCode.replace(/\D/g, '')))]
  .sort((a, b) => b.length - a.length)

// Teléfono en el formato canónico: `+595 981 123 456`. Sin teléfono devuelve
// ''; es el mismo texto que se guarda con `componerTelefono`.
export function normalizarTelefono(phone, countryCode = '+595') {
  return telefonoVisible(phone, countryCode)
}

// Devuelve el teléfono en formato internacional sin signos (para wa.me).
export function internationalPhone(value, countryCode = '+595') {
  let digits = String(value || '').replace(/\D/g, '')
  const code = String(countryCode || '+595').replace(/\D/g, '') || '595'
  if (!digits) return ''
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith(code)) return digits
  if (digits.startsWith('0')) digits = digits.slice(1)
  return `${code}${digits}`
}

// Enlace de WhatsApp: número en formato internacional y mensaje escapado.
// Sin teléfono no hay enlace (''). Es el único lugar donde se arma el `wa.me`.
export function whatsappUrl(phone, message = '', countryCode = '+595') {
  const numero = internationalPhone(phone, countryCode)
  return numero ? `https://wa.me/${numero}?text=${encodeURIComponent(String(message ?? ''))}` : ''
}

// Entrada de los campos de teléfono: sin letras, espacios ni separadores.
export function soloDigitos(value, max = 0) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return max > 0 ? digits.slice(0, max) : digits
}

// Código de país editable: siempre con "+" y hasta 4 dígitos (ej. +595, +55).
export function codigoPais(value) {
  const digits = soloDigitos(value, 4)
  return digits ? `+${digits}` : ''
}

// Teléfono visible en toda la plataforma: SIEMPRE con código de país.
// Paraguay se agrupa 3-3-3 (9 dígitos); el resto se muestra tal cual.
export function telefonoVisible(phone, countryCode = '+595') {
  const code = String(countryCode || '+595').replace(/\D/g, '') || '595'
  let digits = String(phone || '').replace(/\D/g, '')
  if (digits.startsWith(code)) digits = digits.slice(code.length)
  if (digits.startsWith('0')) digits = digits.slice(1)
  if (!digits) return ''
  const local = digits.length === 9 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : digits
  return `+${code} ${local}`
}

export function telefonoValido(value, countryCode = '+595') {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return false
  const code = String(countryCode || '+595').replace(/\D/g, '')
  const local = digits.startsWith(code) ? digits.slice(code.length) : digits.startsWith('0') ? digits.slice(1) : digits
  if (code === '595') return /^9\d{8}$/.test(local)
  return local.length >= 6 && local.length <= 12
}

// Parte los dígitos de un `00…` en código de país y parte local. Primero busca
// en los códigos sugeridos (los más largos primero, para no cortar +598 en
// +59); si no, prueba el código por defecto; por último asume 1–3 dígitos.
function partirCeroCero(digitos, countryCodePorDefecto) {
  if (!digitos) return null
  for (const codigo of CODIGOS_INTERNACIONALES_ORDENADOS) {
    if (digitos.startsWith(codigo)) return { countryCode: `+${codigo}`, phone: digitos.slice(codigo.length) }
  }
  const porDefecto = String(countryCodePorDefecto || '').replace(/\D/g, '')
  if (porDefecto && digitos.startsWith(porDefecto)) {
    return { countryCode: `+${porDefecto}`, phone: digitos.slice(porDefecto.length) }
  }
  return { countryCode: `+${digitos.slice(0, 3)}`, phone: digitos.slice(3) }
}

function partirConMas(texto) {
  const digitos = texto.replace(/\D/g, '')
  const codigo = CODIGOS_INTERNACIONALES_ORDENADOS.find((prefijo) => digitos.startsWith(prefijo))
  if (!codigo) return null
  const indiceCodigo = texto.indexOf(codigo)
  const resto = texto.slice(indiceCodigo + codigo.length).trim()
  return { countryCode: `+${codigo}`, phone: resto }
}

// Separa un teléfono guardado o pegado en código de país y parte local.
// Acepta `+595 981 123 456` (con `+`) y el prefijo internacional `00…`
// (`00595 981 123 456` → +595). Sin `+` ni `00`, la parte local va con el
// código por defecto y sin tocarla (puede traer espacios mientras se tipea).
export function parseTelefono(value, countryCodePorDefecto = '+595') {
  const texto = String(value || '').trim()
  if (texto.startsWith('+')) {
    const partes = partirConMas(texto)
    if (partes) return partes
  }
  const conCeroCero = texto.match(/^00[\s.-]*(.*)$/)
  if (conCeroCero) {
    const resto = conCeroCero[1].trim()
    const partes = partirCeroCero(resto.replace(/\D/g, ''), countryCodePorDefecto)
    if (partes) return partes
  }
  return { countryCode: countryCodePorDefecto, phone: texto }
}

function paisCompatible(country, countryCode) {
  const preferido = paisTelefonoPorIso(country)
  return preferido?.countryCode === countryCode ? preferido.country : ''
}

function estadoInternacionalVacio(country = 'PY') {
  const pais = paisTelefonoPorIso(country) || paisTelefonoPorIso('PY')
  return { country: pais.country, countryCode: pais.countryCode, phone: '', e164: '', isValid: false }
}

/**
 * Interpreta un teléfono local o internacional y devuelve su país, DDI, parte
 * nacional y E.164. En códigos compartidos (como +1) conserva el ISO elegido
 * cuando sigue siendo compatible.
 */
export function parseTelefonoInternacional(value, country = 'PY', countryCodePorDefecto = '') {
  const texto = String(value || '').trim()
  if (!texto) return estadoInternacionalVacio(country)
  const internacional = texto.startsWith('+') || /^00/.test(texto)
  const entrada = /^00/.test(texto) ? `+${texto.replace(/^00[\s.-]*/, '')}` : texto
  const paisPreferido = paisTelefonoPorIso(country) || paisTelefonoPorIso('PY')
  const parsed = parsePhoneNumberFromString(entrada, internacional ? undefined : paisPreferido.country)

  if (parsed) {
    const countryCode = `+${parsed.countryCallingCode}`
    const pais = paisCompatible(paisPreferido.country, countryCode) || parsed.country || paisesDeCodigo(countryCode)[0]?.country || paisPreferido.country
    const phone = parsed.nationalNumber || ''
    const pyValido = pais !== 'PY' || /^9\d{8}$/.test(phone)
    const isValid = parsed.isValid() && pyValido
    return { country: pais, countryCode, phone, e164: isValid ? parsed.number : '', isValid }
  }

  if (internacional) {
    const digitos = entrada.replace(/\D/g, '')
    const codigo = CODIGOS_INTERNACIONALES_ORDENADOS.find((prefijo) => digitos.startsWith(prefijo))
    if (codigo) {
      const countryCode = `+${codigo}`
      const pais = paisCompatible(paisPreferido.country, countryCode) || paisesDeCodigo(countryCode)[0]?.country || paisPreferido.country
      return { country: pais, countryCode, phone: digitos.slice(codigo.length), e164: '', isValid: false }
    }
    const codigoExplicito = codigoPais(countryCodePorDefecto)
    const codigoExplicitoDigitos = codigoExplicito.replace(/\D/g, '')
    const codigoDesconocido = codigoExplicitoDigitos && digitos.startsWith(codigoExplicitoDigitos)
      ? codigoExplicitoDigitos
      : digitos.slice(0, Math.min(3, digitos.length))
    if (codigoDesconocido) {
      return {
        country: '',
        countryCode: `+${codigoDesconocido}`,
        phone: digitos.slice(codigoDesconocido.length),
        e164: '',
        isValid: false,
      }
    }
  }

  return { ...estadoInternacionalVacio(paisPreferido.country), phone: texto }
}

/** Devuelve E.164 solo cuando el número es válido; inválido/incompleto da ''. */
export function telefonoE164(value, country = 'PY') {
  return parseTelefonoInternacional(value, country).e164
}

/** Valida con libphonenumber/min y mantiene la regla móvil estricta de PY. */
export function telefonoInternacionalValido(value, country = 'PY') {
  return parseTelefonoInternacional(value, country).isValid
}

// Arma el string canónico que se guarda: `+<código> <número>`. Sin número,
// devuelve null. Es la contracara de `parseTelefono`.
export function componerTelefono({ countryCode = '+595', phone = '' } = {}) {
  const numero = String(phone || '').trim().replace(/\s+/g, ' ')
  if (!numero) return null
  const codigo = String(countryCode || '').replace(/\D/g, '') || '595'
  return `+${codigo} ${numero}`
}

export const MENSAJE_TELEFONO = 'Teléfono inválido. Para Paraguay usá un móvil de 9 dígitos, ej: 981 123 456 o +595 971 234567.'
