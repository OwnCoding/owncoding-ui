// Validación de formularios (#323): reglas puras y mensajes canónicos.
// La pantalla arma sus reglas una vez y el formulario reutiliza el mismo
// contrato: `validarCampos` devuelve los errores por campo, `FormField` los
// dibuja junto al campo y `useValidacionCampos` (hook) guarda el estado.
// Nada de esto toca el DOM: es lógica portable y testeable.

export const MENSAJES_VALIDACION = {
  obligatorio: 'Completá este dato.',
  largoMinimo: (minimo) => `Escribí al menos ${minimo} caracteres.`,
  largoMaximo: (maximo) => `No superes ${maximo} caracteres.`,
  formato: 'Revisá el formato de este dato.',
  email: 'Revisá el correo electrónico.',
  minimo: (limite) => `El valor no puede ser menor a ${limite}.`,
  maximo: (limite) => `El valor no puede ser mayor a ${limite}.`,
}

// Correo liviano (mismo contrato que `EmailField`): una arroba y un punto en el
// dominio. La verificación real la hace el envío; acá solo se frena el error de
// tipeo antes de mandar.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Vacío universal: `null`/`undefined`, texto en blanco o arreglo sin ítems.
export function campoVacio(valor) {
  if (valor === null || valor === undefined) return true
  if (Array.isArray(valor)) return valor.length === 0
  return String(valor).trim() === ''
}

const mensajeDe = (mensaje, respaldo) =>
  typeof mensaje === 'function' ? mensaje(respaldo) : mensaje || respaldo

/** Campo obligatorio. */
export function obligatorio(mensaje) {
  return (valor) => (campoVacio(valor) ? mensajeDe(mensaje, MENSAJES_VALIDACION.obligatorio) : '')
}

/** Largo mínimo del texto (se cuenta el valor tal como llega, sin recortar). */
export function largoMinimo(minimo, mensaje) {
  return (valor) => {
    if (campoVacio(valor)) return ''
    return String(valor).length < minimo ? mensajeDe(mensaje, MENSAJES_VALIDACION.largoMinimo(minimo)) : ''
  }
}

/** Largo máximo del texto. */
export function largoMaximo(maximo, mensaje) {
  return (valor) => {
    if (campoVacio(valor)) return ''
    return String(valor).length > maximo ? mensajeDe(mensaje, MENSAJES_VALIDACION.largoMaximo(maximo)) : ''
  }
}

/** Formato contra una expresión regular (no toca el valor: no normaliza). */
export function patron(expresion, mensaje) {
  return (valor) => {
    if (campoVacio(valor)) return ''
    return expresion.test(String(valor)) ? '' : mensajeDe(mensaje, MENSAJES_VALIDACION.formato)
  }
}

/** Correo electrónico: una arroba y un punto en el dominio. */
export function emailValido(mensaje) {
  return patron(EMAIL_RE, mensaje || MENSAJES_VALIDACION.email)
}

/** Mínimo numérico. */
export function minimo(limite, mensaje) {
  return (valor) => {
    if (campoVacio(valor) || Number.isNaN(Number(valor))) return ''
    return Number(valor) < limite ? mensajeDe(mensaje, MENSAJES_VALIDACION.minimo(limite)) : ''
  }
}

/** Máximo numérico. */
export function maximo(limite, mensaje) {
  return (valor) => {
    if (campoVacio(valor) || Number.isNaN(Number(valor))) return ''
    return Number(valor) > limite ? mensajeDe(mensaje, MENSAJES_VALIDACION.maximo(limite)) : ''
  }
}

/**
 * Corre las reglas de un campo en orden y devuelve el primer mensaje; '' si
 * pasa. Acepta una regla suelta o un arreglo; tolera `null` y `undefined`.
 */
export function validarCampo(valor, reglas) {
  const lista = (Array.isArray(reglas) ? reglas : [reglas]).filter(Boolean)
  for (const regla of lista) {
    const mensaje = typeof regla === 'function' ? regla(valor) : ''
    if (mensaje) return mensaje
  }
  return ''
}

/**
 * Valida un objeto de valores contra un mapa `{ campo: regla | reglas[] }`.
 * Devuelve `{ valido, errores, primerError, campos }`: los errores por campo
 * para `FormField`, el primer mensaje para el resumen y `campos` con el orden
 * de revisión (el formulario puede enfocar el primero).
 */
export function validarCampos(valores, reglas = {}) {
  const errores = {}
  const campos = []
  for (const [campo, reglasCampo] of Object.entries(reglas)) {
    const mensaje = validarCampo(valores?.[campo], reglasCampo)
    if (mensaje) {
      errores[campo] = mensaje
      campos.push(campo)
    }
  }
  return { valido: campos.length === 0, errores, primerError: errores[campos[0]] || '', campos }
}

/**
 * Saca un campo de los errores (al corregirlo) o los limpia todos. Devuelve un
 * objeto nuevo: el estado de React no se muta.
 */
export function limpiarError(errores = {}, campo) {
  if (!campo) return {}
  if (!(campo in errores)) return errores
  const siguiente = { ...errores }
  delete siguiente[campo]
  return siguiente
}
