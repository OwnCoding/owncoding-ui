// The compact card renders grouped scenes inline, but individual demos only on expansion.
// Keep this predicate shared with Ficha so ordering follows visible card content.
export function hasInlineGalleryPreview(item) {
  return item.tipo === 'visual' && !item.destacado && Boolean(item.presentacion) && item.presentacion !== 'individual'
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
