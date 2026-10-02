// Toasts de resultado (#323): mensajes canónicos de guardar, copiar, imprimir
// y enviar. La frase se arma una sola vez acá y el hook `useResultado` la
// conecta al sistema de toasts; ninguna pantalla escribe el texto a mano, así
// el mismo resultado se lee igual en toda la app.
//
// El sujeto va antes del verbo («La venta se guardó»), nunca pospuesto como
// adjetivo («La venta guardado»): la frase sirve para cualquier género.

export const RESULTADOS_VALIDOS = ['guardar', 'copiar', 'imprimir', 'enviar']

const SIN_SUJETO = {
  guardar: 'Cambios guardados',
  copiar: 'Contenido copiado',
  imprimir: 'Impresión enviada',
  enviar: 'Envío completado',
}

const CON_SUJETO = {
  guardar: (sujeto) => `${sujeto} se guardó`,
  copiar: (sujeto) => `${sujeto} se copió`,
  imprimir: (sujeto) => `${sujeto} se envió a la impresora`,
  enviar: (sujeto) => `${sujeto} se envió`,
}

/**
 * Título canónico de un resultado. `accion` es la forma nominal del verbo
 * (`guardar`, `copiar`, `imprimir`, `enviar`) y `sujeto` es opcional: sin él
 * el mensaje queda genérico. Una acción desconocida cae en «Listo».
 */
export function mensajeResultado(accion, sujeto) {
  const texto = String(sujeto || '').trim()
  if (texto && CON_SUJETO[accion]) return CON_SUJETO[accion](texto)
  return SIN_SUJETO[accion] || 'Listo'
}

/**
 * Título del fallo con la misma forma nominal: «No se pudo guardar». El
 * detalle (qué revisar) viaja aparte, como descripción del toast.
 */
export function mensajeFallo(accion) {
  return RESULTADOS_VALIDOS.includes(accion) ? `No se pudo ${accion}` : 'No se pudo completar'
}
