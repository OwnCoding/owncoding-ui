// Lightweight scenes use existing primitives, never deferred provider demos.
export const COMPACT_SCENES = Object.freeze({
  Button: 'acciones', Input: 'campos', Select: 'campos', Textarea: 'campos',
  Badge: 'datos', Dot: 'datos', Money: 'datos', Stat: 'datos',
  Aviso: 'estados', Skeleton: 'estados', EmptyState: 'estados',
  Checkbox: 'seleccion', Switch: 'seleccion', PercentField: 'seleccion',
})
export function galleryCardIsWide(item) {
  return item.tipo === 'visual' && /Tabla|Table|Calendario|Kanban|Board|Shell|AuthLayout|NavLateral|Documento|Manifiesto|Stepper|CargaIA|Carousel|CartSummary|ProductVariantSelector|PricingCard/.test(item.nombre)
}

// The compact card renders grouped scenes inline, but individual demos only on expansion.
// Keep this predicate shared with Ficha so ordering follows visible card content.
export function hasInlineGalleryPreview(item) {
  return item.tipo === 'visual' && !item.destacado && Boolean(item.presentacion) && (item.presentacion !== 'individual' || Boolean(COMPACT_SCENES[item.nombre]))
}

export function galleryEntryTier(item) {
  if (item.tipo !== 'visual') return 3
  if (item.destacado) return 0
  return hasInlineGalleryPreview(item) ? 1 : 2
}

// Sort a filtered copy: public catalog/URL identity remains unchanged.
// Featured links lead, then inline miniatures, deferred visual demos, and textual API.
export function orderGalleryEntries(entries) {
  return [...entries].sort((a, b) => (
    galleryEntryTier(a) - galleryEntryTier(b)
    || (a.destacado?.prioridad ?? Number.POSITIVE_INFINITY) - (b.destacado?.prioridad ?? Number.POSITIVE_INFINITY)
    || a.nombre.localeCompare(b.nombre, 'es')
  ))
}
