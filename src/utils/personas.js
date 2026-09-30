// Personas para los selectores de equipo (#101): búsqueda y orden.
//
// Puro y portable: sin React y sin storage. El componente `BuscadorPersonas`
// aplica el **uso por usuario** (más usados/recientes primero, fallback
// alfabético) con `leerUsoPersonas`/`registrarUsoPersona` sobre localStorage
// del navegador; en tests se puede inyectar un almacén.

/** Normaliza para buscar: sin acentos, minúsculas y espacios colapsados. */
export function normalizarPersonaTexto(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Texto buscable de una persona (nombre, rol/especialidad, correo, detalle). */
export function etiquetaPersona(persona) {
  return [persona?.nombre, persona?.rol, persona?.especialidad, persona?.email, persona?.detalle]
    .filter(Boolean)
    .join(' ')
}

/** Filtra por nombre o rol/especialidad, tolerando acentos y mayúsculas. */
export function filtrarPersonas(personas, termino) {
  const lista = Array.isArray(personas) ? personas : []
  const texto = normalizarPersonaTexto(termino)
  if (!texto) return lista
  return lista.filter((persona) => normalizarPersonaTexto(etiquetaPersona(persona)).includes(texto))
}

/**
 * Ordena por uso: más usadas primero, luego más recientes, luego alfabético.
 * Las personas inactivas van al final (si `priorizarActivos`), pero se siguen
 * mostrando. `uso` es `{ [id]: { usos, ultima } }`.
 */
export function ordenarPersonas(personas, uso = {}, opciones = {}) {
  const priorizarActivos = opciones.priorizarActivos !== false
  const lista = [...(Array.isArray(personas) ? personas : [])]
  const datos = (persona) => uso?.[persona?.id] ?? { usos: 0, ultima: 0 }
  return lista.sort((a, b) => {
    if (priorizarActivos) {
      const inactivaA = a?.activo === false ? 1 : 0
      const inactivaB = b?.activo === false ? 1 : 0
      if (inactivaA !== inactivaB) return inactivaA - inactivaB
    }
    const usoA = datos(a)
    const usoB = datos(b)
    if (usoA.usos !== usoB.usos) return usoB.usos - usoA.usos
    if (usoA.ultima !== usoB.ultima) return usoB.ultima - usoA.ultima
    return String(a?.nombre ?? '').localeCompare(String(b?.nombre ?? ''), 'es', { sensitivity: 'base' })
  })
}

/** Prefijo de la clave de uso por usuario/ámbito. */
export const CLAVE_USO_PERSONAS = 'owncoding:personas:uso:'

/** Uso guardado para un ámbito (`{}` si no hay storage o está roto). */
export function leerUsoPersonas(clave, almacen = globalThis?.localStorage) {
  if (!clave || !almacen) return {}
  try {
    const crudo = almacen.getItem(`${CLAVE_USO_PERSONAS}${clave}`)
    const valor = crudo ? JSON.parse(crudo) : {}
    return valor && typeof valor === 'object' ? valor : {}
  } catch {
    return {}
  }
}

/** Registra una selección (usos + última vez) para ordenar por uso. */
export function registrarUsoPersona(clave, id, almacen = globalThis?.localStorage, ahora = Date.now()) {
  if (!clave || !id || !almacen) return
  try {
    const actual = leerUsoPersonas(clave, almacen)[id] ?? { usos: 0, ultima: 0 }
    const siguiente = { ...leerUsoPersonas(clave, almacen), [id]: { usos: actual.usos + 1, ultima: ahora } }
    almacen.setItem(`${CLAVE_USO_PERSONAS}${clave}`, JSON.stringify(siguiente))
  } catch {
    // Sin storage disponible: el orden por uso simplemente no persiste.
  }
}
