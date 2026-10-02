export const AUTORIZACION_ASSETS_FINANCIEROS = Object.freeze({
  permitida: true,
  evidencia: 'docs/financial-assets-manifest.json',
  base: 'autorizacion-escrita-proporcionada-por-el-usuario',
  confirmadaEn: '2026-10-01',
  alcance: Object.freeze(['github:dariodeoli/owncoding-ui', 'web:Own UI/OwnCoding']),
})

export const BLOQUEOS_ASSETS_FINANCIEROS = Object.freeze([
  { catalogo: 'banco', id: 'Banco do Brasil', motivo: 'favicon-oficial-48px-bajo-minimo-64px-sin-lockup-horizontal-verificado' },
  { catalogo: 'pago', id: 'Pix', motivo: 'kit-oficial-ai-eps-pdf-sin-original-png-svg-gif-jpg-webp' },
  { catalogo: 'pago', id: 'Red Infonet', motivo: 'original-bancard-canvas-transparente-excesivo-sin-derivado-autorizado' },
  { catalogo: 'pago', id: 'uPOS', variante: 'horizontal', motivo: 'producto-upay-sin-marca-independiente' },
  { catalogo: 'pago', id: 'Panal', motivo: 'original-procesador-canvas-transparente-excesivo-sin-derivado-autorizado' },
])
