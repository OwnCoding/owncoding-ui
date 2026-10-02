export const AUTORIZACION_ASSETS_FINANCIEROS = Object.freeze({
  permitida: true,
  evidencia: 'docs/financial-assets-manifest.json',
  base: 'autorizacion-escrita-proporcionada-por-el-usuario',
  confirmadaEn: '2026-10-01',
  alcance: Object.freeze(['github:dariodeoli/owncoding-ui', 'web:Own UI/OwnCoding']),
})

export const BLOQUEOS_ASSETS_FINANCIEROS = Object.freeze([
  { catalogo: 'banco', id: 'Banco Continental', variante: 'horizontal', motivo: 'host-oficial-no-resuelve' },
  { catalogo: 'banco', id: 'Banco do Brasil', motivo: 'sitio-oficial-bloquea-descarga' },
  { catalogo: 'banco', id: 'Banco GNB Paraguay', motivo: 'sitio-oficial-http-403' },
  { catalogo: 'banco', id: 'Citi', motivo: 'sin-asset-paraguay-verificado' },
  { catalogo: 'banco', id: 'Itaú', variante: 'horizontal', motivo: 'variante-horizontal-oficial-no-publicada' },
  { catalogo: 'banco', id: 'San Cristóbal', variante: 'compacto', motivo: 'asset-oficial-solo-16px' },
  { catalogo: 'banco', id: 'Tu Financiera', variante: 'horizontal', motivo: 'fuente-oficial-solo-publica-version-vertical' },
  { catalogo: 'banco', id: 'Universitaria', motivo: 'sitio-oficial-http-403' },
  { catalogo: 'pago', id: 'Visa', motivo: 'kit-oficial-requiere-acceso' },
  { catalogo: 'pago', id: 'Mastercard', motivo: 'endpoint-oficial-bloqueado' },
  { catalogo: 'pago', id: 'Pix', motivo: 'kit-oficial-solo-participantes' },
  { catalogo: 'pago', id: 'Red Infonet', motivo: 'sin-marca-independiente-verificada' },
  { catalogo: 'pago', id: 'uPOS', variante: 'horizontal', motivo: 'producto-upay-sin-marca-independiente' },
  { catalogo: 'pago', id: 'Panal', motivo: 'sin-asset-directo-verificado' },
])
