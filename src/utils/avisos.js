// Formato de notificaciones (#293): contrato canónico por canal. La bandeja es
// la fuente oficial (`CampanaAvisos`); de ahí se deriva push y el resto, sin
// lógica duplicada por canal. Estas funciones puras arman las piezas portables:
// la ruta interna de un aviso, el payload **genérico** del push (nada sensible
// en la pantalla bloqueada) y el horario silencioso.

/** Ruta interna del aviso: `href` es el nombre canónico; `destino` se tolera. */
export function rutaDeAviso(aviso = {}) {
  return String(aviso?.href ?? aviso?.destino ?? '').trim()
}

/**
 * Payload del push: **genérico** a propósito. En la pantalla bloqueada no
 * viajan datos sensibles (cliente, monto, motivo): van el nombre de la app o un
 * título propio, un cuerpo corto y la **ruta interna** para abrir la bandeja.
 */
export function payloadPush(aviso = {}, { app = '', title = '', body = '' } = {}) {
  return {
    title: String(title || app || 'Aviso').trim(),
    body: String(body || 'Tenés un aviso nuevo.').trim(),
    data: {
      ruta: rutaDeAviso(aviso),
      id: String(aviso?.id ?? ''),
      tono: String(aviso?.tono ?? ''),
    },
  }
}

/**
 * Horario silencioso (por defecto 22:00 → 08:00): el push no suena, pero el
 * aviso **sí** queda en la bandeja. Acepta ventanas nocturnas (`desde > hasta`)
 * y ventanas dentro del mismo día (`desde < hasta`).
 */
export function enHorarioSilencioso(fecha = new Date(), { desde = 22, hasta = 8 } = {}) {
  const momento = fecha instanceof Date ? fecha : new Date(fecha)
  const hora = momento?.getHours?.()
  if (!Number.isFinite(hora)) return false
  const inicio = Number(desde)
  const fin = Number(hasta)
  if (!Number.isFinite(inicio) || !Number.isFinite(fin)) return false
  if (inicio === fin) return true
  return inicio < fin ? hora >= inicio && hora < fin : hora >= inicio || hora < fin
}
