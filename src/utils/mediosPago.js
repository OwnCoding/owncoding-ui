// Marcas, redes, procesadores y productos de pago. No confundir este catálogo
// visual con tipos de cuenta genéricos como CARD o TRANSFER.
import { FECHA_VERIFICACION_MARCAS_FINANCIERAS } from './bancos.js'
import { AUTORIZACION_ASSETS_FINANCIEROS } from './financialAssets.js'
import { relacionFinancieraDe, buscarRelacionesFinancieras } from './relacionesFinancieras.js'

const EMPAQUETADO = (archivo, estado = 'oficial', presentacion = {}) => ({ tipo: 'archivo', archivo, estado, empaquetado: `pagos/${archivo}`, ...presentacion })
const CONTENIDO = (archivo, estado = 'oficial', presentacion = {}) => ({ ...EMPAQUETADO(archivo, estado, presentacion), tipo: 'horizontal-contained' })
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
      ? { ...extra.redistribucion, permitida: true }
      : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso
      ? FALLBACK('permiso-pendiente')
      : variantes || FALLBACK(estado === 'permiso-pendiente' ? 'permiso-pendiente' : 'fallback'),
    ...resto,
  }
}

function entradaRelacionada(marca, datos) {
  return entrada({ ...datos, relacionFinanciera: relacionFinancieraDe(marca) })
}

export const MARCAS_MEDIOS_PAGO = {
  Visa: entrada({
    categoria: 'red-tarjeta', monograma: 'V', color: '#1434CB', fuenteOficial: 'https://www.visa.com.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO('visa-marca.png', 'oficial', { fondo: '#ffffff', padding: true, descripcion: 'Wordmark oficial completo contenido en el espacio compacto; no es un símbolo independiente.' }), horizontal: EMPAQUETADO('visa-marca.png', 'oficial', { fondo: '#ffffff', padding: true }) },
  }),
  Mastercard: entrada({
    categoria: 'red-tarjeta', alias: ['master card'], monograma: 'MC', color: '#EB001B',
    fuenteOficial: 'https://newsroom.mastercard.com/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('mastercard-marca.svg'), horizontal: { ...EMPAQUETADO('mastercard-marca.svg'), tipo: 'marca-contained', descripcion: 'Símbolo oficial completo contenido en el espacio horizontal; no es un wordmark independiente.' } },
  }),
  'American Express': entrada({
    categoria: 'red-tarjeta', alias: ['amex', 'american express'], monograma: 'AX', color: '#006FCF',
    fuenteOficial: 'https://www.americanexpress.com/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('amex-compacto.svg'), horizontal: EMPAQUETADO('amex-horizontal.svg') },
  }),
  Bancard: entrada({
    categoria: 'procesador', monograma: 'B', color: '#0068B3', fuenteOficial: 'https://www.bancard.com.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('bancard-compacto.png'), horizontal: EMPAQUETADO('bancard-horizontal.png', 'oficial', { fondo: '#F8FAFC', padding: true }) },
  }),
  'Red Infonet': entrada({
    categoria: 'red-procesamiento', alias: ['infonet'], monograma: 'RI', color: '#263C8F',
    fuenteOficial: 'https://www.bancard.com.py/productos', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO('infonet-marca.png', 'oficial', { descripcion: 'Marca oficial completa contenida en el espacio compacto; no es un símbolo independiente.' }), horizontal: EMPAQUETADO('infonet-marca.png') },
  }),
  Dinelco: entrada({
    categoria: 'red-procesamiento', monograma: 'D', color: '#5E2A84', fuenteOficial: 'https://www.dinelco.com.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('dinelco-compacto.png'), horizontal: EMPAQUETADO('dinelco-horizontal.svg') },
  }),
  Pix: entrada({
    categoria: 'red-pago-instantaneo', monograma: 'PX', color: '#32BCAD', fuenteOficial: 'https://www.bcb.gov.br/estabilidadefinanceira/pix',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('pix-compacto.svg', 'oficial', { fondo: '#ffffff', padding: true }), horizontal: EMPAQUETADO('pix-horizontal.svg', 'oficial', { fondo: '#ffffff', padding: true }) },
  }),
  upay: entrada({
    categoria: 'procesador', alias: ['u pay'], monograma: 'U', color: '#5A31F4', fuenteOficial: 'https://upay.com.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('upay-compacto.svg'), horizontal: EMPAQUETADO('upay-horizontal.svg') },
  }),
  uPOS: entrada({
    categoria: 'terminal', alias: ['u pos'], monograma: 'UP', color: '#5A31F4', fuenteOficial: 'https://upay.com.py/',
    estado: 'producto-padre', marcaPadre: 'upay', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: { ...EMPAQUETADO('upay-compacto.svg', 'producto-padre'), marcaPadre: 'upay' },
      horizontal: { ...TEXTO('producto-padre'), marcaPadre: 'upay' },
    },
  }),
  Pagopar: entrada({
    categoria: 'producto', alias: ['pago par'], monograma: 'P', color: '#6446E8', fuenteOficial: 'https://upay.com.py/',
    estado: 'verificado', marcaPadre: 'upay', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO('pagopar-horizontal.svg', 'oficial', { fondo: '#0A507B', padding: true }), horizontal: EMPAQUETADO('pagopar-horizontal.svg', 'oficial', { fondo: '#0A507B', padding: true }) },
  }),
  Procard: entrada({
    categoria: 'procesador', alias: ['pro card'], monograma: 'P', color: '#1968A9', fuenteOficial: 'https://www.procard.com.py/procard_institucional/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('procard-compacto.png'), horizontal: EMPAQUETADO('procard-horizontal.png') },
  }),
  PayPro: entrada({
    categoria: 'producto', alias: ['pay pro'], monograma: 'PP', color: '#1968A9', marcaPadre: 'Procard',
    fuenteOficial: 'https://www.procard.com.py/procard_institucional/paypro/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO('paypro-horizontal.png'), horizontal: EMPAQUETADO('paypro-horizontal.png') },
  }),
  Wally: entrada({
    categoria: 'billetera', monograma: 'W', color: '#16A34A', fuenteOficial: 'https://www.wally.com.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('wally-compacto.ico'), horizontal: EMPAQUETADO('wally-horizontal.svg') },
  }),
  Zimple: entrada({
    categoria: 'billetera', monograma: 'Z', color: '#EA1D76', fuenteOficial: 'https://www.zimple.com.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('zimple-compacto.ico'), horizontal: EMPAQUETADO('zimple-horizontal.png') },
  }),
  'Personal Pay': entrada({
    categoria: 'billetera', alias: ['personalpay'], monograma: 'PP', color: '#111827', fuenteOficial: 'https://www.personalpay.com.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('personal-pay-compacto.png'), horizontal: EMPAQUETADO('personal-pay-horizontal.svg', 'oficial', { fondo: '#111827', padding: true }) },
  }),
  Mango: entradaRelacionada('Mango', {
    categoria: 'billetera', alias: ['billetera mango', 'mango app'], monograma: 'M', color: '#0B6FC7',
    fuenteOficial: 'https://mangoapp.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('mango-compacto.png', 'oficial', { fondo: '#0B6FC7', padding: true }),
      horizontal: EMPAQUETADO('mango-horizontal.svg', 'oficial', { fondo: '#0B6FC7', padding: true }),
    },
  }),
  Vaquita: entradaRelacionada('Vaquita', {
    categoria: 'billetera', alias: ['app vaquita'], monograma: 'V', color: '#35A64D',
    fuenteOficial: 'https://www.vaquita.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('vaquita-compacto.png', 'oficial', { fondo: '#173226', padding: true }),
      horizontal: EMPAQUETADO('vaquita-horizontal.png', 'oficial', { fondo: '#173226', padding: true }),
    },
  }),
  EKO: entradaRelacionada('EKO', {
    categoria: 'billetera', alias: ['eko', 'app eko', 'eko paraguay'], monograma: 'E', color: '#143CD2',
    fuenteOficial: 'https://www.eko.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('eko-compacto.svg'), horizontal: EMPAQUETADO('eko-horizontal.svg') },
  }),
  eCLUB: entradaRelacionada('eCLUB', {
    categoria: 'cuenta-digital', alias: ['eclub'], monograma: 'E', color: '#F00E51',
    fuenteOficial: 'https://eclub.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('eclub-compacto.svg'), horizontal: EMPAQUETADO('eclub-horizontal.svg') },
  }),
  Pik: entradaRelacionada('Pik', {
    categoria: 'cobros-comercios', alias: ['pik'], monograma: 'P', color: '#EC7000',
    fuenteOficial: 'https://www.pik.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('pik-compacto.png'), horizontal: EMPAQUETADO('pik-horizontal.svg') },
  }),
  Cabal: entrada({
    categoria: 'red-tarjeta', monograma: 'C', color: '#006A53', fuenteOficial: 'https://www.cabal.coop/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO('cabal-horizontal.png'), horizontal: EMPAQUETADO('cabal-horizontal.png') },
  }),
  Panal: entrada({
    categoria: 'red-tarjeta', monograma: 'P', color: '#A56A1C', fuenteOficial: 'https://www.bcp.gov.py/comisiones-por-intermediacion-cobradas-a-los-comercios-por-las-operaciones-con-tarjetas',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('panal-marca.png'), horizontal: { ...EMPAQUETADO('panal-marca.png'), tipo: 'marca-contained', descripcion: 'Marca oficial completa contenida en el espacio horizontal; no es un wordmark independiente.' } },
  }),
}

// Agrupación funcional para experiencias de selección e integración comercial.
// No expresa propiedad, afiliación corporativa ni reemplaza relaciones verificadas.
export const SOLUCIONES_PAGO_COMERCIOS = Object.freeze({
  id: 'soluciones-pago-comercios',
  titulo: 'Aceptación y pagos para comercios',
  descripcion: 'Procesamiento, adquirencia y cobros digitales para operaciones comerciales.',
  marcas: Object.freeze(['Bancard', 'Dinelco', 'upay', 'Pik']),
})

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
    ...(registro.relacionFinanciera ? { relacionFinanciera: registro.relacionFinanciera } : {}),
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
      relacionFinanciera: registro.relacionFinanciera || null,
      variantes: {
        compacto: { ...registro.variantes.compacto },
        horizontal: { ...registro.variantes.horizontal },
      },
    }
  })
}

export function sugerenciasDeMarcaPago(texto, catalogo = MEDIOS_PAGO_CON_MARCA) {
  const termino = normalizarMarcaPago(texto)
  if (!termino) return catalogo
  const relacionadas = new Set(buscarRelacionesFinancieras(texto).map((registro) => registro.marca))
  return catalogo.filter((marca) => {
    const registro = MARCAS_MEDIOS_PAGO[marca]
    return [marca, ...(registro.alias || [])].some((clave) => normalizarMarcaPago(clave).includes(termino)) || relacionadas.has(marca)
  })
}
