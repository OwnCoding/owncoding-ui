// Registro fail-closed. Un asset solo puede entrar acá junto con evidencia de
// redistribución explícita y auditable en los metadatos del repositorio. La
// procedencia oficial prueba autenticidad, no concede permiso para republicar.
// En v0.60.0 no existe todavía ninguna autorización que satisfaga ese contrato.
export const ASSETS_FINANCIEROS = Object.freeze({})

export function adjuntarAssetFinanciero(visual) {
  if (!visual || !visual.empaquetado) return visual
  const asset = ASSETS_FINANCIEROS[visual.empaquetado]
  return asset ? { ...visual, asset } : visual
}

export function adjuntarAssetsAlRegistro(registro) {
  if (!registro?.visual) return registro
  return { ...registro, visual: adjuntarAssetFinanciero(registro.visual) }
}

export function adjuntarAssetsACobertura(fila) {
  if (!fila?.variantes) return fila
  return {
    ...fila,
    variantes: {
      compacto: adjuntarAssetFinanciero(fila.variantes.compacto),
      horizontal: adjuntarAssetFinanciero(fila.variantes.horizontal),
    },
  }
}
