import { AUTORIZACION_ASSETS_FINANCIEROS } from './financialAssets.js'
import { institucionesSugeridasPorMarca } from './relacionesFinancieras.js'

// Catálogo financiero puro y apto para servidor. Solo declara procedencia,
// estado, alias y nombres de archivo; los bytes visuales viven exclusivamente
// en `owncoding-ui/financial` para no inflar `owncoding-ui/utils`.

export const FECHA_VERIFICACION_MARCAS_FINANCIERAS = '2026-10-02'

// Internal IDs are explicit, never derived from display labels or row positions.
// Keep an existing ID when renaming a label; append new identities, never reuse IDs.
const INSTITUTION_IDENTITIES = [
  ['oc:institution:py:001', 'Banco Atlas'],
  ['oc:institution:py:002', 'Banco Basa'],
  ['oc:institution:py:003', 'Banco Continental'],
  ['oc:institution:py:004', 'Banco de la Nación Argentina'],
  ['oc:institution:py:005', 'Banco Familiar'],
  ['oc:institution:py:006', 'Banco GNB Paraguay'],
  ['oc:institution:py:007', 'Interfisa Banco'],
  ['oc:institution:py:008', 'Itaú'],
  ['oc:institution:py:009', 'Banco Nacional de Fomento'],
  ['oc:institution:py:010', 'Sudameris'],
  ['oc:institution:py:011', 'Bancop'],
  ['oc:institution:py:012', 'Citi'],
  ['oc:institution:py:013', 'Financiera FIC'],
  ['oc:institution:py:014', 'Financiera Paraguayo Japonesa'],
  ['oc:institution:py:015', 'Finlatina'],
  ['oc:institution:py:016', 'Solar Banco'],
  ['oc:institution:py:017', 'Tu Financiera'],
  ['oc:institution:py:018', 'ueno bank'],
  ['oc:institution:py:019', 'Zeta Banco'],
  ['oc:institution:py:020', 'Coomecipar'],
  ['oc:institution:py:021', 'Medalla Milagrosa'],
  ['oc:institution:py:022', 'San Cristóbal'],
  ['oc:institution:py:023', 'Universitaria'],
  ['oc:institution:py:024', 'Luque'],
  ['oc:institution:py:025', 'Coopeduc'],
  ['oc:institution:py:026', 'Capiatá'],
  ['oc:institution:py:027', 'Ñemby'],
  ['oc:institution:py:028', 'Lambaré'],
  ['oc:institution:py:029', 'Coodeñe'],
  ['oc:institution:py:030', 'Mburicaó'],
  ['oc:institution:py:031', 'Mercado Nº 4'],
  ['oc:institution:py:032', 'San Lorenzo'],
]

const EMPAQUETADO = (archivo, estado = 'oficial', presentacion = {}) => ({ tipo: 'archivo', archivo, estado, empaquetado: `bancos/${archivo}`, ...presentacion })
const CONTENIDO = (archivo, estado = 'oficial', presentacion = {}) => ({ ...EMPAQUETADO(archivo, estado, presentacion), tipo: 'horizontal-contained' })
const MARCA_CONTENIDA = (archivo, presentacion) => ({ ...EMPAQUETADO(archivo, 'oficial', presentacion), tipo: 'marca-contained' })
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
      ? { ...redistribucion, permitida: true }
      : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso
      ? variantesFallback('permiso-pendiente')
      : variantes || variantesFallback(estado === 'permiso-pendiente' ? 'permiso-pendiente' : 'fallback'),
    ...legacy,
  }
}

// Verified original cooperative marks; contained variants reuse one physical
// asset without claiming that a separate symbol/wordmark exists.
function cooperativaOriginal(nombre, fuenteOficial, archivo, cuadrada = false, compacto) {
  const presentacion = { fondo: '#ffffff', padding: true }
  return entrada({
    categoria: 'cooperativa', alias: [`cooperativa ${nombre}`, nombre.replace('Nº', 'N°')], monograma: nombre.slice(0, 1), color: '#15803d',
    fuenteOficial, estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: compacto || cuadrada
        ? EMPAQUETADO(compacto || archivo, 'oficial', presentacion)
        : CONTENIDO(archivo, 'oficial', { ...presentacion, descripcion: 'Marca horizontal oficial completa contenida en el espacio compacto; no es un símbolo independiente.' }),
      horizontal: cuadrada
        ? MARCA_CONTENIDA(archivo, { ...presentacion, descripcion: 'Marca oficial completa contenida en el espacio horizontal; no existe un lockup horizontal independiente verificado.' })
        : EMPAQUETADO(archivo, 'oficial', presentacion),
    },
  })
}

// El nombre canónico es la clave. `archivo`, `marca`, `monograma` y `color` se
// mantienen para que logoDeBanco y los consumidores existentes sigan siendo
// compatibles; `variantes` es el contrato nuevo y auditable.
export const LOGOS_BANCOS = {
  'Banco Atlas': entrada({
    categoria: 'banco', alias: ['atlas'], monograma: 'BA', color: '#B20933', archivo: 'atlas-horizontal-blanco.svg',
    fuenteOficial: 'https://www.bancoatlas.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('atlas-compacto.png', 'oficial'),
      horizontal: EMPAQUETADO('atlas-horizontal-blanco.svg', 'oficial', { fondo: '#B20933', padding: true }),
    },
  }),
  'Banco Basa': entrada({
    categoria: 'banco', monograma: 'B', color: '#E94B35', archivo: 'basa-horizontal.svg',
    fuenteOficial: 'https://www.bancobasa.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('basa-compacto.svg'), horizontal: EMPAQUETADO('basa-horizontal.svg') },
  }),
  'Banco Continental': entrada({
    categoria: 'banco', alias: ['continental'], monograma: 'BC', color: '#1C4480', marca: 'continental',
    fuenteOficial: 'https://www.bancontinental.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('continental-compacto.png'), horizontal: EMPAQUETADO('continental-horizontal.svg') },
  }),
  'Banco de la Nación Argentina': entrada({
    categoria: 'banco', alias: ['banco nacion', 'banco nación', 'bna'], monograma: 'BNA', color: '#007894',
    fuenteOficial: 'https://www.bna.com.ar/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('bna-compacto.svg', 'oficial', { fondo: '#007894', padding: true }),
      horizontal: EMPAQUETADO('bna-horizontal.svg', 'oficial', { fondo: '#007894', padding: true }),
    },
  }),
  'Banco do Brasil': entrada({
    categoria: 'banco', alias: ['bb', 'brasil'], monograma: 'BB', color: '#173E91',
    fuenteOficial: 'https://www.bb.com.br/docs/portal/dimac/CCBB-Manual-de-identidade-da-Marca.pdf', estado: 'asset-bloqueado', variantes: { compacto: TEXTO('asset-bloqueado'), horizontal: TEXTO('asset-bloqueado') },
  }),
  'Banco Familiar': entrada({
    categoria: 'banco', alias: ['familiar'], monograma: 'BF', color: '#004B8D', marca: 'familiar', archivo: 'familiar-horizontal.webp',
    fuenteOficial: 'https://www.familiar.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('familiar-compacto.png'), horizontal: EMPAQUETADO('familiar-horizontal.webp') },
  }),
  'Banco GNB Paraguay': entrada({
    categoria: 'banco', alias: ['gnb', 'banco gnb'], monograma: 'GNB', color: '#00563F',
    fuenteOficial: 'https://www.bancognb.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('gnb-compacto.png', 'aportado-usuario', { descripcion: 'Marca compacta proporcionada por el usuario; imagen original sin modificaciones.' }), horizontal: EMPAQUETADO('gnb-horizontal.svg') },
  }),
  'Interfisa Banco': entrada({
    categoria: 'banco', alias: ['interfisa', 'banco interfisa'], monograma: 'IB', color: '#00594C', archivo: 'interfisa-horizontal.png',
    fuenteOficial: 'https://www.interfisa.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('interfisa-compacto.png'), horizontal: EMPAQUETADO('interfisa-horizontal.png') },
  }),
  'Itaú': entrada({
    categoria: 'banco', alias: ['itau', 'banco itau', 'itau paraguay', 'banco itaú paraguay'], monograma: 'I', color: '#EC7000', archivo: 'itau-compacto.svg',
    fuenteOficial: 'https://www.itau.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('itau-compacto.svg', 'oficial', { fondo: '#EC7000', padding: true }),
      horizontal: MARCA_CONTENIDA('itau-compacto.svg', { fondo: '#EC7000', padding: true, descripcion: 'Marca cuadrada oficial contenida en el espacio horizontal; no es un lockup horizontal independiente.' }),
    },
  }),
  'Banco Nacional de Fomento': entrada({
    categoria: 'banco', alias: ['bnf', 'nacional de fomento'], monograma: 'BNF', color: '#006A44', archivo: 'bnf-horizontal.svg',
    fuenteOficial: 'https://www.bnf.gov.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('bnf-compacto.png', 'oficial', { fondo: '#0B1F3A', padding: true }), horizontal: EMPAQUETADO('bnf-horizontal.svg', 'oficial', { fondo: '#0B1F3A', padding: true }) },
  }),
  'Sudameris': entrada({
    categoria: 'banco', alias: ['banco sudameris'], monograma: 'S', color: '#FF0000', archivo: 'sudameris-horizontal.svg',
    fuenteOficial: 'https://www.sudameris.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('sudameris-compacto.svg', 'oficial', { fondo: '#FF0000', padding: true }),
      horizontal: EMPAQUETADO('sudameris-horizontal.svg', 'oficial', { fondo: '#FF0000', padding: true }),
    },
  }),
  'Bancop': entrada({
    categoria: 'banco', monograma: 'B', color: '#006B3C', archivo: 'bancop-horizontal.png',
    fuenteOficial: 'https://www.bancop.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('bancop-compacto.png'), horizontal: EMPAQUETADO('bancop-horizontal.png') },
  }),
  'Citi': entrada({
    categoria: 'banco', alias: ['citibank', 'citibank paraguay'], monograma: 'C', color: '#59636E',
    fuenteOficial: 'https://www.citigroup.com/global/about-us/global-presence/paraguay',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO('citi-horizontal.svg', 'oficial', { descripcion: 'Marca horizontal oficial contenida en el espacio compacto; no es un símbolo independiente.' }), horizontal: EMPAQUETADO('citi-horizontal.svg') },
  }),
  'Financiera FIC': entrada({
    categoria: 'financiera', alias: ['fic'], monograma: 'FIC', color: '#C8102E', archivo: 'fic-horizontal.png',
    fuenteOficial: 'https://fic.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('fic-compacto.png'), horizontal: EMPAQUETADO('fic-horizontal.png') },
  }),
  'Financiera Paraguayo Japonesa': entrada({
    categoria: 'financiera', alias: ['fpj', 'paraguayo japonesa'], monograma: 'FPJ', color: '#0066A4', archivo: 'fpj-horizontal.png',
    fuenteOficial: 'https://www.fpj.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('fpj-compacto.png', 'oficial', { fondo: '#0066A4', padding: true }),
      horizontal: EMPAQUETADO('fpj-horizontal.png', 'oficial', { fondo: '#0066A4', padding: true }),
    },
  }),
  'Finlatina': entrada({
    categoria: 'financiera', alias: ['financiera finlatina'], monograma: 'FL', color: '#24537A', archivo: 'finlatina-horizontal.png',
    fuenteOficial: 'https://www.finlatina.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('finlatina-compacto.png'), horizontal: EMPAQUETADO('finlatina-horizontal.png') },
  }),
  'Solar Banco': entrada({
    categoria: 'banco', alias: ['solar', 'solar ahorro y finanzas'], monograma: 'S', color: '#F36F21', archivo: 'solar-horizontal.svg',
    fuenteOficial: 'https://solar.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('solar-compacto.png'), horizontal: EMPAQUETADO('solar-horizontal.svg') },
  }),
  'Tu Financiera': entrada({
    categoria: 'financiera', alias: ['tu financiera'], monograma: 'TF', color: '#314255', archivo: 'tu-financiera-compacto.svg',
    fuenteOficial: 'https://tu.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('tu-financiera-compacto.svg'), horizontal: MARCA_CONTENIDA('tu-financiera-compacto.svg', { descripcion: 'Marca vertical oficial contenida en el espacio horizontal; no es un lockup horizontal independiente.' }) },
  }),
  'ueno bank': entrada({
    categoria: 'banco', alias: ['ueno', 'ueno bank', 'Ueno Bank'], monograma: 'U', color: '#7B2CF5', marca: 'ueno', archivo: 'ueno-horizontal.svg',
    fuenteOficial: 'https://www.ueno.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('ueno-compacto.svg'), horizontal: EMPAQUETADO('ueno-horizontal.svg') },
  }),
  'Zeta Banco': entrada({
    categoria: 'banco', alias: ['zeta', 'finexpar', 'financiera finexpar'], monograma: 'Z', color: '#2D3340', archivo: 'zeta-horizontal.png',
    fuenteOficial: 'https://www.zbanco.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('zeta-compacto.png'), horizontal: EMPAQUETADO('zeta-horizontal.png') },
  }),
  'Coomecipar': entrada({
    categoria: 'cooperativa', monograma: 'CO', color: '#0B6E4F', archivo: 'coomecipar-horizontal.png', fuenteOficial: 'https://www.coomecipar.coop.py/',
    estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('coomecipar-compacto.png'),
      horizontal: EMPAQUETADO('coomecipar-horizontal.png', 'oficial', { fondo: '#092959', padding: true }),
    },
  }),
  'Medalla Milagrosa': entrada({
    categoria: 'cooperativa', alias: ['cooperativa medalla milagrosa'], monograma: 'MM', color: '#6C3FA0',
    fuenteOficial: 'https://www.medalla.coop.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('medalla-compacto.webp'), horizontal: EMPAQUETADO('medalla-horizontal.png') },
  }),
  'San Cristóbal': entrada({
    categoria: 'cooperativa', alias: ['cooperativa san cristobal', 'cooperativa san cristóbal'], monograma: 'SC', color: '#167A54',
    fuenteOficial: 'https://www.sancristobal.coop.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO('san-cristobal-compacto.png', 'aportado-usuario', { descripcion: 'Marca compacta proporcionada por el usuario; imagen original sin modificaciones.' }),
      horizontal: EMPAQUETADO('san-cristobal-horizontal.png', 'oficial', { fondo: '#5FAD3E', padding: true }),
    },
  }),
  'Universitaria': entrada({
    categoria: 'cooperativa', alias: ['cooperativa universitaria'], monograma: 'U', color: '#1D4E9E',
    fuenteOficial: 'https://www.universitaria.coop/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO('universitaria-compacto.png'), horizontal: EMPAQUETADO('universitaria-horizontal.svg') },
  }),

  'Luque': entrada({
    categoria: 'cooperativa', alias: ['cooperativa luque', 'coop luque'], monograma: 'L', color: '#17458F',
    fuenteOficial: 'https://www.coopluque.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: CONTENIDO('luque-horizontal.svg', 'oficial', { fondo: '#ffffff', padding: true, descripcion: 'Marca horizontal oficial completa contenida en el espacio compacto; no es un símbolo independiente.' }),
      horizontal: EMPAQUETADO('luque-horizontal.svg', 'oficial', { fondo: '#ffffff', padding: true }),
    },
  }),
  'Coopeduc': entrada({
    categoria: 'cooperativa', alias: ['cooperativa coopeduc', 'coopeduc ltda'], monograma: 'C', color: '#203866',
    fuenteOficial: 'https://www.coopeduc.com.py/', estado: 'verificado', redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: CONTENIDO('coopeduc-horizontal.png', 'oficial', { fondo: '#ffffff', padding: true, descripcion: 'Marca horizontal oficial completa contenida en el espacio compacto; no es un símbolo independiente.' }),
      horizontal: EMPAQUETADO('coopeduc-horizontal.png', 'oficial', { fondo: '#ffffff', padding: true }),
    },
  }),

  'Capiatá': cooperativaOriginal('Capiatá', 'https://www.capiata.coop.py/', 'capiata-horizontal.png', false),
  'Ñemby': cooperativaOriginal('Ñemby', 'https://coopnemby.coop.py/', 'nemby-horizontal.png', true, 'nemby-compacto.png'),
  'Lambaré': cooperativaOriginal('Lambaré', 'https://www.lambare.coop.py/', 'lambare-horizontal.gif', true),
  'Coodeñe': cooperativaOriginal('Coodeñe', 'https://coodene.coop.py/', 'coodene-horizontal.png', false),
  'Mburicaó': cooperativaOriginal('Mburicaó', 'https://mburicao.coop.py/', 'mburicao-horizontal.png', false),
  'Mercado Nº 4': cooperativaOriginal('Mercado Nº 4', 'https://coopmer4.coop.py/', 'mercado-n4-horizontal.png', true),
  'San Lorenzo': cooperativaOriginal('San Lorenzo', 'https://www.sanlorenzo.coop.py/', 'san-lorenzo-compacto.png', true),

  'Financiera El Comercio': { redirigeA: 'ueno bank', alias: ['el comercio'], categoria: 'legado', estado: 'legado', verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
  'Visión Banco': { redirigeA: 'ueno bank', alias: ['vision', 'banco vision', 'visión'], categoria: 'legado', estado: 'legado', verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
  'Banco Río': { redirigeA: 'Banco Continental', alias: ['rio', 'banco rio', 'banco río'], categoria: 'legado', estado: 'legado', verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
}

// Metadata reuses the existing institution source, aliases and historical redirects.
export const INSTITUTIONS_PARAGUAY = Object.freeze(INSTITUTION_IDENTITIES.map(([id, name]) => {
  const metadata = LOGOS_BANCOS[name]
  return Object.freeze({
    id, name, category: metadata.categoria,
    aliases: Object.freeze([...(metadata.alias || [])]),
    provenance: Object.freeze({
      identifierScheme: 'owncoding-internal',
      sourceUrl: metadata.fuenteOficial,
      verifiedAt: metadata.verificadoEn,
    }),
  })
}))

// Preserve legacy ordering and shapes, deriving subsets from category, not row position.
export const BANCOS_Y_FINANCIERAS_PARAGUAY = INSTITUTIONS_PARAGUAY.filter(record => record.category !== 'cooperativa').map(record => record.name)
export const COOPERATIVAS_PARAGUAY = INSTITUTIONS_PARAGUAY.filter(record => record.category === 'cooperativa').map(record => record.name)
export const BANCOS_PARAGUAY = INSTITUTIONS_PARAGUAY.map(record => record.name)

const INSTITUTIONS_BY_ID = new Map(INSTITUTIONS_PARAGUAY.map(record => [record.id, record]))
const INSTITUTIONS_BY_NAME = new Map(INSTITUTIONS_PARAGUAY.map(record => [record.name, record]))

export function resolveInstitution(input) {
  const unknown = { status: 'unknown', input, record: null }
  if (typeof input !== 'string' || !input.trim()) return unknown
  const byId = INSTITUTIONS_BY_ID.get(input)
  if (byId) return { status: 'resolved', input, record: byId, matchedBy: 'id' }
  const resolved = resolverEntrada(input)
  const record = resolved && INSTITUTIONS_BY_NAME.get(resolved.nombre)
  if (!record) return unknown
  return {
    status: 'resolved', input, record,
    matchedBy: resolved.aliasHistorico ? 'historical' : input.trim() === record.name ? 'name' : 'alias',
    ...(resolved.aliasHistorico ? { historicalName: resolved.aliasHistorico } : {}),
  }
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
  const relacionadas = new Set(institucionesSugeridasPorMarca(texto))
  return catalogo.filter((banco) => {
    const busquedas = BUSQUEDAS_POR_BANCO.get(banco) || new Set([normalizarBanco(banco)])
    return relacionadas.has(banco) || [...busquedas].some((clave) => clave.includes(termino))
  })
}
