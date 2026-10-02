export const AUTORIZACION_ASSETS_FINANCIEROS = Object.freeze({
  permitida: true,
  evidencia: 'docs/financial-assets-manifest.json',
  base: 'autorizacion-escrita-proporcionada-por-el-usuario',
  confirmadaEn: '2026-10-01',
  alcance: Object.freeze(['github:dariodeoli/owncoding-ui', 'web:Own UI/OwnCoding']),
})

export const BLOQUEOS_ASSETS_FINANCIEROS = Object.freeze([
  { catalogo: 'banco', id: 'Banco do Brasil', motivo: 'favicon-oficial-48px-bajo-minimo-64px-sin-lockup-horizontal-verificado' },
  { catalogo: 'pago', id: 'uPOS', variante: 'horizontal', motivo: 'producto-upay-sin-marca-independiente' },
])
