// Registro de consentimiento (Ley 7593/2025): deja constancia de qué se
// aceptó o revocó, con la versión de la política, la fecha y el canal. La app
// lo persiste en su backend al confirmar la acción; la biblioteca no guarda
// nada ni conoce el modelo de datos. Sin fecha válida el campo viaja vacío
// (nunca se inventa un momento).
export function registroConsentimiento({
  finalidad = '',
  aceptado = true,
  version = '',
  canal = 'web',
  fecha = new Date(),
  titular = '',
} = {}) {
  const momento = fecha instanceof Date ? fecha : new Date(fecha)
  return {
    finalidad: String(finalidad || ''),
    aceptado: Boolean(aceptado),
    version: String(version || ''),
    canal: String(canal || 'web'),
    fecha: Number.isNaN(momento.getTime()) ? '' : momento.toISOString(),
    titular: String(titular || ''),
  }
}
