// Búsqueda y detección de duplicados de clientes (#268): un solo lugar para el
// texto buscable, el detalle de la fila y los motivos de «posible duplicado».
// Portable: sin API y sin sesión; la app aporta los clientes y la referencia a
// comparar (teléfono/documento/correo que se está por cargar).

const normalizar = (valor) =>
  String(valor ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/** Solo dígitos (para comparar teléfonos con formato libre). */
export const digitosCliente = (valor) => String(valor ?? '').replace(/\D/g, '')

/** Clave nacional del teléfono: sin prefijo país (595…) ni 0 inicial. */
export function claveTelefonoCliente(valor) {
  return digitosCliente(valor).replace(/^595/, '').replace(/^0+/, '')
}

const telefonosDeCliente = (cliente) => [
  cliente?.phone,
  ...(Array.isArray(cliente?.phones) ? cliente.phones : []),
].filter(Boolean)

/** Dos teléfonos coinciden por su clave nacional (o por terminación). */
export function coincideTelefonoCliente(a, b) {
  const claveA = claveTelefonoCliente(a)
  const claveB = claveTelefonoCliente(b)
  if (!claveA || !claveB) return false
  if (claveA === claveB) return true
  return claveA.length >= 6 && claveB.length >= 6 && (claveA.endsWith(claveB) || claveB.endsWith(claveA))
}

/** Texto buscable: nombre, teléfonos (crudo y en dígitos), CI/RUC, correo, facturación y tags. */
export function campoBuscableCliente(cliente) {
  const telefonos = telefonosDeCliente(cliente).flatMap((telefono) => [telefono, claveTelefonoCliente(telefono)])
  return normalizar([
    cliente?.name,
    cliente?.nombre,
    ...telefonos,
    cliente?.document,
    cliente?.email,
    cliente?.billingName,
    cliente?.billingDocument,
    ...(Array.isArray(cliente?.tags) ? cliente.tags : []),
  ].filter(Boolean).join(' '))
}

/** Clientes filtrados por el término (máx. `limite`). */
export function filtrarClientes(clientes = [], termino = '', { limite = 8 } = {}) {
  const lista = Array.isArray(clientes) ? clientes : []
  const q = normalizar(termino)
  if (!q) return lista.slice(0, limite)
  return lista.filter((cliente) => campoBuscableCliente(cliente).includes(q)).slice(0, limite)
}

/** Línea secundaria de la fila: teléfono · CI/RUC · correo (lo que haya). */
export function detalleCliente(cliente) {
  return telefonosDeCliente(cliente).slice(0, 1)
    .concat([cliente?.document, cliente?.email])
    .filter(Boolean)
    .join(' · ')
}

/**
 * Motivos por los que un cliente existente parece duplicado de los datos que se
 * están por cargar: mismo teléfono (solo dígitos), CI/RUC o correo exactos.
 * Devuelve [] cuando no hay coincidencias.
 */
export function motivosDuplicadoCliente(cliente, referencia = {}) {
  const motivos = []
  const telefono = referencia.telefono ?? referencia.phone
  if (claveTelefonoCliente(telefono)) {
    const coincide = telefonosDeCliente(cliente).some((valor) => coincideTelefonoCliente(valor, telefono))
    if (coincide) motivos.push('teléfono')
  }
  const documento = normalizar(referencia.documento ?? referencia.document)
  if (documento && normalizar(cliente?.document) === documento) motivos.push('documento')
  const correo = normalizar(referencia.correo ?? referencia.email)
  if (correo && normalizar(cliente?.email) === correo) motivos.push('correo')
  return motivos
}
