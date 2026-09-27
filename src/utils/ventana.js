// Ventana de una lista larga (#262): dice qué tramo pintar para no montar 100
// filas cuando solo se ven unas pocas. Lógica pura: la pantalla mide el alto de
// la vista y de la fila, y el rango sale de acá. Si falta alguna medida,
// devuelve la lista completa (antes que esconder opciones, se pinta todo).
export const MARGEN_VENTANA = 2

export function ventanaDeLista({ total = 0, scrollTop = 0, altoVista = 0, altoFila = 0, margen = MARGEN_VENTANA } = {}) {
  const cantidad = Math.max(0, Math.floor(Number(total) || 0))
  if (cantidad === 0) return { inicio: 0, fin: 0 }
  const fila = Number(altoFila) || 0
  const vista = Number(altoVista) || 0
  if (fila <= 0 || vista <= 0) return { inicio: 0, fin: cantidad }
  const margenSeguro = Math.max(0, Math.floor(Number(margen) || 0))
  const visibles = Math.max(1, Math.ceil(vista / fila))
  const primero = Math.min(cantidad - 1, Math.max(0, Math.floor((Number(scrollTop) || 0) / fila)))
  return {
    inicio: Math.max(0, primero - margenSeguro),
    fin: Math.min(cantidad, primero + visibles + margenSeguro),
  }
}
