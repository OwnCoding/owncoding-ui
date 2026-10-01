// src/utils/appIdentity.js
var VERSION_APP_RE = /^\d+\.\d+\.\d+(?:-rc\.[1-9]\d*)?$/;
function esVersionApp(version) {
  return VERSION_APP_RE.test(String(version ?? "").trim());
}
function etiquetaVersionApp(version) {
  const valor = String(version ?? "").trim();
  if (!esVersionApp(valor)) {
    throw new TypeError("La versi\xF3n debe usar X.Y.Z o X.Y.Z-rc.N");
  }
  return `v${valor}`;
}
function textoRequerido(valor, campo) {
  const texto = String(valor ?? "").trim();
  if (!texto) throw new TypeError(`${campo} es obligatorio`);
  return texto;
}
function crearIdentidadApp({
  nombre,
  version,
  url = "",
  logoUrl = "",
  soporteUrl = "",
  color = "#047857",
  credito = "Desarrollado por Owncoding",
  creditoUrl = "https://owncoding.dev/"
} = {}) {
  const nombreSeguro = textoRequerido(nombre, "nombre");
  const versionSegura = String(version ?? "").trim();
  const etiquetaVersion = etiquetaVersionApp(versionSegura);
  return Object.freeze({
    nombre: nombreSeguro,
    version: versionSegura,
    etiquetaVersion,
    url: String(url ?? "").trim(),
    logoUrl: String(logoUrl ?? "").trim(),
    soporteUrl: String(soporteUrl ?? "").trim(),
    color: /^#[0-9a-f]{6}$/i.test(String(color ?? "").trim()) ? String(color).trim() : "#047857",
    credito: credito == null ? null : String(credito).trim(),
    creditoUrl: String(creditoUrl ?? "").trim()
  });
}

// src/utils/version.js
function partesVersion(valor) {
  return String(valor ?? "").trim().replace(/^v/i, "").split("+")[0].split("-")[0].split(".").map((parte) => Number.parseInt(parte, 10)).map((numero) => Number.isFinite(numero) ? numero : 0);
}
function compararVersiones(a, b) {
  const partesA = partesVersion(a);
  const partesB = partesVersion(b);
  const largo = Math.max(partesA.length, partesB.length);
  for (let i = 0; i < largo; i += 1) {
    const diferencia = (partesA[i] || 0) - (partesB[i] || 0);
    if (diferencia !== 0) return diferencia > 0 ? 1 : -1;
  }
  return 0;
}
function hayVersionNueva(actual, publicada) {
  if (!String(actual ?? "").trim() || !String(publicada ?? "").trim()) return false;
  return compararVersiones(publicada, actual) > 0;
}
export {
  VERSION_APP_RE,
  compararVersiones,
  crearIdentidadApp,
  esVersionApp,
  etiquetaVersionApp,
  hayVersionNueva,
  partesVersion
};
//# sourceMappingURL=app-identity.js.map
