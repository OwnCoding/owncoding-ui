// Identidad visible y portable de una app. La biblioteca no lee package.json:
// cada consumidor conecta su única fuente de verdad al crear este objeto.

export const VERSION_APP_RE = /^\d+\.\d+\.\d+(?:-rc\.[1-9]\d*)?$/

export function esVersionApp(version) {
  return VERSION_APP_RE.test(String(version ?? '').trim())
}

export function etiquetaVersionApp(version) {
  const valor = String(version ?? '').trim()
  if (!esVersionApp(valor)) {
    throw new TypeError('La versión debe usar X.Y.Z o X.Y.Z-rc.N')
  }
  return `v${valor}`
}

function textoRequerido(valor, campo) {
  const texto = String(valor ?? '').trim()
  if (!texto) throw new TypeError(`${campo} es obligatorio`)
  return texto
}

/**
 * Crea una identidad inmutable. `version` siempre llega sin el prefijo `v`;
 * `etiquetaVersion` es la representación lista para la interfaz.
 */
export function crearIdentidadApp({
  nombre,
  version,
  url = '',
  logoUrl = '',
  soporteUrl = '',
  color = '#047857',
  credito = 'Desarrollado por Owncoding',
  creditoUrl = 'https://owncoding.dev/',
} = {}) {
  const nombreSeguro = textoRequerido(nombre, 'nombre')
  const versionSegura = String(version ?? '').trim()
  const etiquetaVersion = etiquetaVersionApp(versionSegura)

  return Object.freeze({
    nombre: nombreSeguro,
    version: versionSegura,
    etiquetaVersion,
    url: String(url ?? '').trim(),
    logoUrl: String(logoUrl ?? '').trim(),
    soporteUrl: String(soporteUrl ?? '').trim(),
    color: /^#[0-9a-f]{6}$/i.test(String(color ?? '').trim()) ? String(color).trim() : '#047857',
    credito: credito == null ? null : String(credito).trim(),
    creditoUrl: String(creditoUrl ?? '').trim(),
  })
}
