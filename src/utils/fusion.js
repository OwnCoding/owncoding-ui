// Unificación de entidades (#268): las categorías canónicas de lo que se
// fusiona, en orden, para que el preview no invente etiquetas. Portable: sin
// API; la app aporta los conteos reales.

export const CATEGORIAS_FUSION = [
  { id: 'pedidos', etiqueta: 'Pedidos' },
  { id: 'pagos', etiqueta: 'Pagos y cuotas' },
  { id: 'creditos', etiqueta: 'Créditos y saldo' },
  { id: 'notas', etiqueta: 'Notas' },
  { id: 'direcciones', etiqueta: 'Direcciones' },
  { id: 'contactos', etiqueta: 'Teléfonos y correos' },
  { id: 'tags', etiqueta: 'Tags' },
  { id: 'seguro', etiqueta: 'Seguro de ventas' },
  { id: 'portal', etiqueta: 'Portal' },
  { id: 'garantias', etiqueta: 'Garantías y servicio' },
]

/**
 * Categorías del preview con sus conteos, en el orden canónico: acepta un mapa
 * `{ pedidos: 3, notas: 0 }` o una lista `[{ id, cantidad }]`. Los ids que no
 * estén en el catálogo se agregan al final con su id como etiqueta.
 */
export function categoriasFusion(conteos = {}) {
  const mapa = Array.isArray(conteos)
    ? Object.fromEntries(conteos.map((item) => [item?.id, item?.cantidad]))
    : (conteos && typeof conteos === 'object' ? conteos : {})
  const conocidas = new Set(CATEGORIAS_FUSION.map((categoria) => categoria.id))
  const filas = CATEGORIAS_FUSION.map(({ id, etiqueta }) => ({
    id,
    etiqueta,
    cantidad: Math.max(0, Number(mapa[id]) || 0),
  }))
  for (const [id, cantidad] of Object.entries(mapa)) {
    if (conocidas.has(id)) continue
    filas.push({ id, etiqueta: id, cantidad: Math.max(0, Number(cantidad) || 0) })
  }
  return filas
}

/** Verdadero si hay algo para mover (algún conteo mayor a cero). */
export function hayFusion(categorias = []) {
  return (Array.isArray(categorias) ? categorias : []).some((categoria) => Number(categoria?.cantidad) > 0)
}
