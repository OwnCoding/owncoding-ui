// Marcas, redes, procesadores y productos de pago. No confundir este catálogo
// visual con tipos de cuenta genéricos como CARD o TRANSFER.
import { FECHA_VERIFICACION_MARCAS_FINANCIERAS } from './bancos.js'

const EMPAQUETADO = (archivo, estado = 'oficial') => ({ tipo: 'archivo', archivo, estado, empaquetado: `pagos/${archivo}` })
const MONOGRAMA = (estado = 'fallback') => ({ tipo: 'monograma', estado })
const TEXTO = (estado = 'fallback') => ({ tipo: 'texto', estado })
const FALLBACK = (estado = 'fallback') => ({ compacto: MONOGRAMA(estado), horizontal: TEXTO(estado) })

function entrada({ categoria, alias = [], monograma, color, fuenteOficial, estado = 'parcial', variantes, ...extra }) {
  const permiso = extra.redistribucion?.permitida === true && Boolean(extra.redistribucion.evidencia)
  const requierePermiso = Boolean(variantes && Object.values(variantes).some((visual) => visual?.empaquetado))
  const { redistribucion: _redistribucion, ...resto } = extra
  return {
    categoria,
    alias,
    monograma,
    color,
    fuenteOficial,
    verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS,
    estado: requierePermiso && !permiso ? 'permiso-pendiente' : estado,
    redistribucion: permiso
      ? { permitida: true, evidencia: extra.redistribucion.evidencia }
      : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso
      ? FALLBACK('permiso-pendiente')
      : variantes || FALLBACK(estado === 'permiso-pendiente' ? 'permiso-pendiente' : 'fallback'),
    ...resto,
  }
}

export const MARCAS_MEDIOS_PAGO = {
  Visa: entrada({
    categoria: 'red-tarjeta', monograma: 'V', color: '#1434CB', fuenteOficial: 'https://corporate.visa.com/en/about-visa/brand.html',
    estado: 'permiso-pendiente', variantes: FALLBACK('permiso-pendiente'),
  }),
  Mastercard: entrada({
    categoria: 'red-tarjeta', alias: ['master card'], monograma: 'MC', color: '#EB001B',
    fuenteOficial: 'https://www.mastercard.com/brandcenter/us/en/download-artwork.html',
    estado: 'permiso-pendiente', variantes: FALLBACK('permiso-pendiente'),
  }),
  'American Express': entrada({
    categoria: 'red-tarjeta', alias: ['amex', 'american express'], monograma: 'AX', color: '#2E77BC',
    fuenteOficial: 'https://www.americanexpress.com/it/merchant/materiale-puntovendita/materialidigitali.html',
    estado: 'permiso-pendiente', variantes: FALLBACK('permiso-pendiente'),
  }),
  Bancard: entrada({
    categoria: 'procesador', monograma: 'B', color: '#0068B3', fuenteOficial: 'https://www.bancard.com.py/',
    estado: 'permiso-pendiente', variantes: FALLBACK('permiso-pendiente'),
  }),
  'Red Infonet': entrada({
    categoria: 'red-procesamiento', alias: ['infonet'], monograma: 'RI', color: '#263C8F',
    fuenteOficial: 'https://www.bancard.com.py/productos', estado: 'fallback', variantes: FALLBACK(),
  }),
  Dinelco: entrada({
    categoria: 'red-procesamiento', monograma: 'D', color: '#D71920', fuenteOficial: 'https://www.dinelco.com.py/',
    estado: 'permiso-pendiente', variantes: FALLBACK('permiso-pendiente'),
  }),
  upay: entrada({
    categoria: 'procesador', alias: ['u pay'], monograma: 'U', color: '#5A31F4', fuenteOficial: 'https://upay.com.py/', estado: 'verificado',
    variantes: {
      compacto: EMPAQUETADO('upay-compacto.svg'),
      horizontal: EMPAQUETADO('upay.svg'),
    },
  }),
  uPOS: entrada({
    categoria: 'terminal', alias: ['u pos'], monograma: 'UP', color: '#5A31F4', fuenteOficial: 'https://upay.com.py/',
    estado: 'producto-padre', marcaPadre: 'upay',
    variantes: {
      compacto: { ...EMPAQUETADO('upay-compacto.svg', 'producto-padre'), marcaPadre: 'upay' },
      horizontal: { ...TEXTO('producto-padre'), marcaPadre: 'upay' },
    },
  }),
  Procard: entrada({
    categoria: 'procesador', alias: ['pro card'], monograma: 'P', color: '#1968A9', fuenteOficial: 'https://www.procard.com.py/procard_institucional/',
    estado: 'permiso-pendiente', variantes: FALLBACK('permiso-pendiente'),
  }),
  PayPro: entrada({
    categoria: 'producto', alias: ['pay pro'], monograma: 'PP', color: '#1968A9', marcaPadre: 'Procard',
    fuenteOficial: 'https://www.procard.com.py/procard_institucional/paypro/', estado: 'fallback', variantes: FALLBACK(),
  }),
  Cabal: entrada({
    categoria: 'red-tarjeta', monograma: 'C', color: '#006A53',
    fuenteOficial: 'https://www.cabal.coop/comercios/servicios/senalizacion-de-tu-negocio?id=587', estado: 'permiso-pendiente',
    variantes: FALLBACK('permiso-pendiente'),
  }),
  Panal: entrada({
    categoria: 'red-tarjeta', monograma: 'P', color: '#A56A1C', fuenteOficial: 'https://www.bcp.gov.py/comisiones-por-intermediacion-cobradas-a-los-comercios-por-las-operaciones-con-tarjetas',
    estado: 'fallback', variantes: FALLBACK(),
  }),

  // Pagopar fue absorbida por la propuesta vigente de upay. Solo resuelve
  // datos históricos; no se publica como procesador independiente.
  Pagopar: { redirigeA: 'upay', alias: ['pago par'], categoria: 'legado', estado: 'legado', verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
}

export const MEDIOS_PAGO_CON_MARCA = Object.keys(MARCAS_MEDIOS_PAGO).filter((nombre) => !MARCAS_MEDIOS_PAGO[nombre].redirigeA)

export function normalizarMarcaPago(texto) {
  return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

const INDICE_MARCAS_PAGO = new Map()
for (const [nombre, registro] of Object.entries(MARCAS_MEDIOS_PAGO)) {
  for (const clave of [nombre, ...(registro.alias || [])]) {
    INDICE_MARCAS_PAGO.set(normalizarMarcaPago(clave), { nombre, registro })
  }
}

function varianteNormalizada(variante) {
  return variante === 'compacto' || variante === 'compact' ? 'compacto' : 'horizontal'
}

function iniciales(nombre) {
  const partes = String(nombre || '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
  return partes.map((parte) => parte[0]?.toUpperCase()).join('') || '?'
}

export function logoDeMedioPago(nombre, variante = 'horizontal') {
  const texto = String(nombre || '').trim()
  if (!texto) return null
  const encontrada = INDICE_MARCAS_PAGO.get(normalizarMarcaPago(texto))
  const claveVariante = varianteNormalizada(variante)
  if (!encontrada) {
    return {
      marca: texto, tipo: 'monograma', iniciales: iniciales(texto), color: '#33414F', generico: true,
      categoria: 'desconocida', estado: 'fallback', variante: claveVariante,
      visual: claveVariante === 'compacto' ? MONOGRAMA() : TEXTO(),
    }
  }

  const aliasHistorico = encontrada.registro.redirigeA ? encontrada.nombre : null
  const canonico = encontrada.registro.redirigeA || encontrada.nombre
  const registro = MARCAS_MEDIOS_PAGO[canonico]
  return {
    marca: canonico,
    tipo: registro.variantes[claveVariante].tipo === 'archivo' ? 'archivo' : 'monograma',
    iniciales: registro.monograma || iniciales(canonico),
    color: registro.color || '#33414F',
    categoria: registro.categoria,
    estado: registro.estado,
    redistribucion: registro.redistribucion,
    fuenteOficial: registro.fuenteOficial || null,
    verificadoEn: registro.verificadoEn || null,
    variante: claveVariante,
    visual: registro.variantes[claveVariante],
    ...(registro.marcaPadre ? { marcaPadre: registro.marcaPadre } : {}),
    ...(aliasHistorico ? { aliasHistorico } : {}),
  }
}

export function coberturaMediosPago(catalogo = MEDIOS_PAGO_CON_MARCA) {
  return catalogo.map((nombre) => {
    const registro = MARCAS_MEDIOS_PAGO[nombre]
    return {
      nombre,
      categoria: registro.categoria,
      estado: registro.estado,
      redistribucion: registro.redistribucion,
      fuenteOficial: registro.fuenteOficial || null,
      verificadoEn: registro.verificadoEn,
      marcaPadre: registro.marcaPadre || null,
      variantes: {
        compacto: { ...registro.variantes.compacto },
        horizontal: { ...registro.variantes.horizontal },
      },
    }
  })
}
