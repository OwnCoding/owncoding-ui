// Versión visible y aviso de novedades (#293, regla 10): comparar la versión
// publicada con la de la app para avisar «hay una versión nueva». Puro y
// tolerante: acepta `v1.2.3`, `1.2.3` y sufijos de build (`1.2.3+abc`).

/** Números de una versión, ignorando prefijos y metadatos de build. */
export function partesVersion(valor) {
  return String(valor ?? '')
    .trim()
    .replace(/^v/i, '')
    .split('+')[0]
    .split('-')[0]
    .split('.')
    .map((parte) => Number.parseInt(parte, 10))
    .map((numero) => (Number.isFinite(numero) ? numero : 0))
}

/** Compara dos versiones: `-1` si `a < b`, `0` si son iguales, `1` si `a > b`. */
export function compararVersiones(a, b) {
  const partesA = partesVersion(a)
  const partesB = partesVersion(b)
  const largo = Math.max(partesA.length, partesB.length)
  for (let i = 0; i < largo; i += 1) {
    const diferencia = (partesA[i] || 0) - (partesB[i] || 0)
    if (diferencia !== 0) return diferencia > 0 ? 1 : -1
  }
  return 0
}

/** ¿La versión publicada es más nueva que la de la app? (para el aviso) */
export function hayVersionNueva(actual, publicada) {
  if (!String(actual ?? '').trim() || !String(publicada ?? '').trim()) return false
  return compararVersiones(publicada, actual) > 0
}
