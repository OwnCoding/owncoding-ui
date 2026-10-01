// Catálogo financiero puro y apto para servidor. Solo declara procedencia,
// estado, alias y nombres de archivo; los bytes visuales viven exclusivamente
// en `owncoding-ui/financial` para no inflar `owncoding-ui/utils`.

export const FECHA_VERIFICACION_MARCAS_FINANCIERAS = '2026-10-01'

export const BANCOS_Y_FINANCIERAS_PARAGUAY = [
  'Banco Atlas',
  'Banco Basa',
  'Banco Continental',
  'Banco de la Nación Argentina',
  'Banco do Brasil',
  'Banco Familiar',
  'Banco GNB Paraguay',
  'Interfisa Banco',
  'Itaú',
  'Banco Nacional de Fomento',
  'Sudameris',
  'Bancop',
  'Citi',
  'Financiera FIC',
  'Financiera Paraguayo Japonesa',
  'Finlatina',
  'Solar Banco',
  'Tu Financiera',
  'ueno bank',
  'Zeta Banco',
]

export const COOPERATIVAS_PARAGUAY = [
  'Coomecipar',
  'Medalla Milagrosa',
  'San Cristóbal',
  'Universitaria',
]

// Conserva el nombre histórico de la exportación. La categoría real de cada
// entrada vive en LOGOS_BANCOS y también se publican los dos subconjuntos.
export const BANCOS_PARAGUAY = [...BANCOS_Y_FINANCIERAS_PARAGUAY, ...COOPERATIVAS_PARAGUAY]

const EMPAQUETADO = (archivo, estado = 'oficial', presentacion = {}) => ({ tipo: 'archivo', archivo, estado, empaquetado: `bancos/${archivo}`, ...presentacion })
const CONTENIDO = (archivo) => ({ ...EMPAQUETADO(archivo, 'fallback'), tipo: 'horizontal-contained' })
const MONOGRAMA = (estado = 'fallback') => ({ tipo: 'monograma', estado })
const TEXTO = (estado = 'fallback') => ({ tipo: 'texto', estado })

function variantesFallback(estado = 'fallback') {
  return { compacto: MONOGRAMA(estado), horizontal: TEXTO(estado) }
}

function tieneAssetEmpaquetado(variantes) {
  return Boolean(variantes && Object.values(variantes).some((visual) => visual?.empaquetado))
}

function entrada({ categoria, alias = [], monograma, color, fuenteOficial, estado = 'parcial', variantes, redistribucion, ...legacy }) {
  const permiso = redistribucion?.permitida === true && Boolean(redistribucion.evidencia)
  const requierePermiso = tieneAssetEmpaquetado(variantes)
  return {
    categoria,
    alias,
    monograma,
    color,
    fuenteOficial,
    verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS,
    estado: requierePermiso && !permiso ? 'permiso-pendiente' : estado,
    redistribucion: permiso
      ? { permitida: true, evidencia: redistribucion.evidencia }
      : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso
      ? variantesFallback('permiso-pendiente')
      : variantes || variantesFallback(estado === 'permiso-pendiente' ? 'permiso-pendiente' : 'fallback'),
    ...legacy,
  }
}

// El nombre canónico es la clave. `archivo`, `marca`, `monograma` y `color` se
// mantienen para que logoDeBanco y los consumidores existentes sigan siendo
// compatibles; `variantes` es el contrato nuevo y auditable.
export const LOGOS_BANCOS = {
  'Banco Atlas': entrada({
    categoria: 'banco', alias: ['atlas'], monograma: 'BA', color: '#174A7E',
    fuenteOficial: 'https://www.bancoatlas.com.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Banco Basa': entrada({
    categoria: 'banco', monograma: 'B', color: '#E94B35', archivo: 'banco-basa.svg',
    fuenteOficial: 'https://www.bancobasa.com.py/', estado: 'verificado',
    variantes: {
      compacto: EMPAQUETADO('banco-basa-compacto.svg'),
      horizontal: EMPAQUETADO('banco-basa.svg'),
    },
  }),
  'Banco Continental': entrada({
    categoria: 'banco', alias: ['continental'], monograma: 'BC', color: '#1C4480', marca: 'continental',
    fuenteOficial: 'https://www.bancontinental.com.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Banco de la Nación Argentina': entrada({
    categoria: 'banco', alias: ['banco nacion', 'banco nación', 'bna'], monograma: 'BNA', color: '#005F5B',
    archivo: 'banco-nacion-argentina.svg', chip: true,
    fuenteOficial: 'https://www.bna.com.ar/Downloads/Libro_Banco_Nacion.pdf', estado: 'verificado',
    variantes: {
      compacto: EMPAQUETADO('banco-nacion-argentina-compacto.png'),
      horizontal: EMPAQUETADO('banco-nacion-argentina.svg'),
    },
  }),
  'Banco do Brasil': entrada({
    categoria: 'banco', alias: ['bb', 'brasil'], monograma: 'BB', color: '#173E91',
    fuenteOficial: 'https://www.bb.com.br/docs/portal/dimac/CCBB-Manual-de-identidade-da-Marca.pdf', estado: 'parcial',
    variantes: variantesFallback(),
  }),
  'Banco Familiar': entrada({
    categoria: 'banco', alias: ['familiar'], monograma: 'BF', color: '#004B8D', marca: 'familiar',
    fuenteOficial: 'https://www.familiar.com.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Banco GNB Paraguay': entrada({
    categoria: 'banco', alias: ['gnb', 'banco gnb'], monograma: 'GNB', color: '#00563F', archivo: 'banco-gnb.svg',
    fuenteOficial: 'https://www.bancognb.com.py/', estado: 'parcial',
    variantes: {
      compacto: CONTENIDO('banco-gnb.svg'),
      horizontal: EMPAQUETADO('banco-gnb.svg'),
    },
  }),
  'Interfisa Banco': entrada({
    categoria: 'banco', alias: ['interfisa', 'banco interfisa'], monograma: 'IB', color: '#00594C',
    fuenteOficial: 'https://www.interfisa.com.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Itaú': entrada({
    categoria: 'banco', alias: ['itau', 'banco itau', 'itau paraguay', 'banco itaú paraguay'], monograma: 'I', color: '#EC7000',
    fuenteOficial: 'https://www.itau.com.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Banco Nacional de Fomento': entrada({
    categoria: 'banco', alias: ['bnf', 'nacional de fomento'], monograma: 'BNF', color: '#006A44',
    fuenteOficial: 'https://www.bnf.gov.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Sudameris': entrada({
    categoria: 'banco', alias: ['banco sudameris'], monograma: 'S', color: '#009A49', archivo: 'sudameris.svg',
    fuenteOficial: 'https://www.sudameris.com.py/', estado: 'parcial',
    variantes: {
      compacto: { ...CONTENIDO('sudameris.svg'), fondo: '#00583F', padding: true },
      horizontal: EMPAQUETADO('sudameris.svg', 'oficial', { fondo: '#00583F', padding: true }),
    },
  }),
  'Bancop': entrada({
    categoria: 'banco', monograma: 'B', color: '#006B3C', fuenteOficial: 'https://www.bancop.com.py/',
    estado: 'fallback', variantes: variantesFallback(),
  }),
  'Citi': entrada({
    categoria: 'banco', alias: ['citibank', 'citibank paraguay'], monograma: 'C', color: '#59636E',
    fuenteOficial: 'https://www.citigroup.com/citi/about/countries-and-jurisdictions/paraguay.html',
    estado: 'permiso-pendiente', variantes: variantesFallback('permiso-pendiente'),
  }),
  'Financiera FIC': entrada({
    categoria: 'financiera', alias: ['fic'], monograma: 'FIC', color: '#C8102E', archivo: 'financiera-fic.png',
    fuenteOficial: 'https://fic.com.py/', estado: 'parcial',
    variantes: {
      compacto: CONTENIDO('financiera-fic.png'),
      horizontal: EMPAQUETADO('financiera-fic.png'),
    },
  }),
  'Financiera Paraguayo Japonesa': entrada({
    categoria: 'financiera', alias: ['fpj', 'paraguayo japonesa'], monograma: 'FPJ', color: '#0066A4', archivo: 'financiera-paraguayo-japonesa.png',
    fuenteOficial: 'https://www.fpj.com.py/', estado: 'verificado',
    variantes: {
      compacto: EMPAQUETADO('financiera-paraguayo-japonesa-compacto.png', 'oficial', { fondo: '#0066A4', padding: true }),
      horizontal: EMPAQUETADO('financiera-paraguayo-japonesa.png', 'oficial', { fondo: '#0066A4', padding: true }),
    },
  }),
  'Finlatina': entrada({
    categoria: 'financiera', alias: ['financiera finlatina'], monograma: 'FL', color: '#24537A',
    fuenteOficial: 'https://www.finlatina.com.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Solar Banco': entrada({
    categoria: 'banco', alias: ['solar', 'solar ahorro y finanzas'], monograma: 'S', color: '#F36F21', archivo: 'solar-banco.svg',
    fuenteOficial: 'https://solar.com.py/', estado: 'parcial',
    variantes: {
      compacto: CONTENIDO('solar-banco.svg'),
      horizontal: EMPAQUETADO('solar-banco.svg'),
    },
  }),
  'Tu Financiera': entrada({
    categoria: 'financiera', alias: ['tu financiera'], monograma: 'TF', color: '#314255',
    fuenteOficial: 'https://www.bcp.gov.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'ueno bank': entrada({
    categoria: 'banco', alias: ['ueno', 'ueno bank', 'Ueno Bank'], monograma: 'U', color: '#7B2CF5', marca: 'ueno', archivo: 'ueno-bank.svg',
    fuenteOficial: 'https://www.ueno.com.py/', estado: 'verificado',
    variantes: {
      compacto: EMPAQUETADO('ueno-bank-compacto.svg'),
      horizontal: EMPAQUETADO('ueno-bank.svg'),
    },
  }),
  'Zeta Banco': entrada({
    categoria: 'banco', alias: ['zeta', 'finexpar', 'financiera finexpar'], monograma: 'Z', color: '#2D3340',
    fuenteOficial: 'https://www.bcp.gov.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Coomecipar': entrada({
    categoria: 'cooperativa', monograma: 'CO', color: '#0B6E4F', fuenteOficial: 'https://www.coomecipar.coop.py/',
    estado: 'fallback', variantes: variantesFallback(),
  }),
  'Medalla Milagrosa': entrada({
    categoria: 'cooperativa', alias: ['cooperativa medalla milagrosa'], monograma: 'MM', color: '#6C3FA0',
    fuenteOficial: 'https://www.medallamilagrosa.coop.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'San Cristóbal': entrada({
    categoria: 'cooperativa', alias: ['cooperativa san cristobal', 'cooperativa san cristóbal'], monograma: 'SC', color: '#167A54',
    fuenteOficial: 'https://www.sancristobal.coop.py/', estado: 'fallback', variantes: variantesFallback(),
  }),
  'Universitaria': entrada({
    categoria: 'cooperativa', alias: ['cooperativa universitaria'], monograma: 'U', color: '#1D4E9E',
    fuenteOficial: 'https://www.cu.coop.py/', estado: 'fallback', variantes: variantesFallback(),
  }),

  // Compatibilidad histórica: no aparecen en sugerencias y resuelven a la
  // entidad sucesora en vez de fingir una marca que ya no está activa.
  'Financiera El Comercio': { redirigeA: 'ueno bank', alias: ['el comercio'], categoria: 'legado', estado: 'legado', verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
  'Visión Banco': { redirigeA: 'ueno bank', alias: ['vision', 'banco vision', 'visión'], categoria: 'legado', estado: 'legado', verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
  'Banco Río': { redirigeA: 'Banco Continental', alias: ['rio', 'banco rio', 'banco río'], categoria: 'legado', estado: 'legado', verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
}

export const COLORES_BANCO_RESPALDO = ['#33414F', '#1D4E9E', '#0B6E4F', '#8A3A1B', '#6C3FA0', '#12659E']

export function normalizarBanco(texto) {
  return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

const INDICE = new Map()
for (const [nombre, entradaLogo] of Object.entries(LOGOS_BANCOS)) {
  for (const clave of [nombre, ...(entradaLogo.alias || [])]) {
    INDICE.set(normalizarBanco(clave), { nombre, entrada: entradaLogo })
  }
}

const BUSQUEDAS_POR_BANCO = new Map(BANCOS_PARAGUAY.map((nombre) => [nombre, new Set([normalizarBanco(nombre)])]))
for (const [clave, encontrada] of INDICE) {
  const destino = encontrada.entrada.redirigeA || encontrada.nombre
  BUSQUEDAS_POR_BANCO.get(destino)?.add(clave)
}

const VACIAS = new Set(['banco', 'financiera', 'cooperativa', 'banca', 'de', 'del', 'la', 'el', 'y'])

export function inicialesDeBanco(nombre) {
  const palabras = String(nombre || '').split(/[\s/]+/).filter(Boolean)
  const utiles = palabras.filter((palabra) => !VACIAS.has(normalizarBanco(palabra)))
  const base = (utiles.length ? utiles : palabras).slice(0, 3)
  const iniciales = base.map((palabra) => palabra[0].toUpperCase()).join('')
  return iniciales || '?'
}

export function colorDeBanco(nombre) {
  const texto = normalizarBanco(nombre)
  let hash = 0
  for (const letra of texto) hash = (hash * 31 + letra.charCodeAt(0)) % 9973
  return COLORES_BANCO_RESPALDO[hash % COLORES_BANCO_RESPALDO.length]
}

function varianteNormalizada(variante) {
  return variante === 'compacto' || variante === 'compact' ? 'compacto' : 'horizontal'
}

function resolverEntrada(nombre) {
  const encontrada = INDICE.get(normalizarBanco(nombre))
  if (!encontrada) return null
  const destino = encontrada.entrada.redirigeA
  if (!destino) return { nombre: encontrada.nombre, entrada: encontrada.entrada, aliasHistorico: null }
  return { nombre: destino, entrada: LOGOS_BANCOS[destino], aliasHistorico: encontrada.nombre }
}

// Compatible con el resultado histórico (tipo/archivo/marca/monograma) y
// enriquecido con `visual`, procedencia y estado por variante.
export function logoDeBanco(nombre, variante = 'horizontal') {
  const texto = String(nombre || '').trim()
  if (!texto) return null
  const resuelta = resolverEntrada(texto)
  if (!resuelta) {
    const iniciales = inicialesDeBanco(texto)
    const color = colorDeBanco(texto)
    const claveVariante = varianteNormalizada(variante)
    return {
      banco: texto, tipo: 'monograma', iniciales, color, generico: true, categoria: 'desconocida',
      estado: 'fallback', variante: claveVariante,
      visual: claveVariante === 'compacto' ? MONOGRAMA() : TEXTO(),
    }
  }

  const { nombre: canonico, entrada: registro, aliasHistorico } = resuelta
  const claveVariante = varianteNormalizada(variante)
  const base = registro.archivo
    ? { tipo: 'archivo', archivo: registro.archivo, chip: Boolean(registro.chip) }
    : registro.marca
      ? { tipo: 'marca', marca: registro.marca }
      : { tipo: 'monograma', iniciales: registro.monograma || inicialesDeBanco(canonico), color: registro.color || colorDeBanco(canonico) }

  return {
    banco: canonico,
    ...base,
    ...(registro.marca ? { marca: registro.marca } : {}),
    categoria: registro.categoria,
    estado: registro.estado,
    redistribucion: registro.redistribucion,
    fuenteOficial: registro.fuenteOficial || null,
    verificadoEn: registro.verificadoEn || null,
    variante: claveVariante,
    visual: registro.variantes[claveVariante],
    ...(aliasHistorico ? { aliasHistorico } : {}),
  }
}

// Diagnóstico completo: permite detectar assets oficiales, wordmarks
// contenidos y fallbacks deliberados sin confundirlos entre sí.
export function coberturaBancos(catalogo = BANCOS_PARAGUAY) {
  return catalogo.map((nombre) => {
    const entradaLogo = LOGOS_BANCOS[nombre]
    return {
      nombre,
      categoria: entradaLogo.categoria,
      estado: entradaLogo.estado,
      redistribucion: entradaLogo.redistribucion,
      fuenteOficial: entradaLogo.fuenteOficial || null,
      verificadoEn: entradaLogo.verificadoEn,
      variantes: {
        compacto: { ...entradaLogo.variantes.compacto },
        horizontal: { ...entradaLogo.variantes.horizontal },
      },
      // Campos históricos del diagnóstico.
      tipo: entradaLogo.archivo ? 'archivo' : entradaLogo.marca ? 'marca' : 'monograma',
      archivo: entradaLogo.archivo || null,
      marca: entradaLogo.marca || null,
    }
  })
}

export function sugerenciasDeBanco(texto, catalogo = BANCOS_PARAGUAY) {
  const termino = normalizarBanco(texto)
  if (!termino) return catalogo
  return catalogo.filter((banco) => {
    const busquedas = BUSQUEDAS_POR_BANCO.get(banco) || new Set([normalizarBanco(banco)])
    return [...busquedas].some((clave) => clave.includes(termino))
  })
}
