import { VARIANTES_CORTE, crearTicket } from './escpos.js'

// Página de prueba para verificar una impresora térmica: mismo texto en todas
// las impresoras para reconocer el papel, validación de 4 dígitos para el
// verificador y secciones por tipo de impresión. Es el modelo de prueba que ya
// funciona en producción, portable: la app pasa sus datos y, si quiere, un
// generador de QR (sin dependencia de red ni de librerías externas).

export const TIPOS_PRUEBA = {
  corta: 'Prueba corta',
  completa: 'Prueba completa',
  pedido: 'Ticket de pedido',
  qr: 'Ticket con QR',
  venta: 'Ticket completo de venta',
  caracteres: 'Caracteres y formato',
  corte: 'Prueba de corte',
}

export const TIPOS_TICKET_PRUEBA = TIPOS_PRUEBA

// Plantilla de la prueba (#277): qué tipo se imprime, el ancho del papel, si el
// ticket corto lleva fecha/hora, cómo corta y cuántas copias. La app decide
// dónde la persiste (último usado como predeterminado, patrón #209); acá vive
// la forma canónica y la normalización.
export const ANCHOS_PRUEBA = [58, 80]
export const CORTES_PRUEBA = VARIANTES_CORTE
export const PLANTILLA_PRUEBA = { tipo: 'corta', ancho: 80, incluyeFecha: false, corte: 'completo', copias: 1 }

/** Plantilla válida: completa lo que falte y descarta lo que no corresponde. */
export function plantillaDePrueba(datos = {}) {
  const base = datos && typeof datos === 'object' ? datos : {}
  const tipo = Object.hasOwn(TIPOS_PRUEBA, base.tipo) ? base.tipo : PLANTILLA_PRUEBA.tipo
  const ancho = ANCHOS_PRUEBA.includes(Number(base.ancho)) ? Number(base.ancho) : PLANTILLA_PRUEBA.ancho
  const copias = Number(base.copias)
  const corte = CORTES_PRUEBA.includes(base.corte) ? base.corte : PLANTILLA_PRUEBA.corte
  return {
    tipo,
    ancho,
    incluyeFecha: Boolean(base.incluyeFecha),
    corte,
    copias: Number.isSafeInteger(copias) && copias >= 1 && copias <= 5 ? copias : PLANTILLA_PRUEBA.copias,
  }
}

const azar = (max) => Math.floor(Math.random() * max)
const validacionDe = () => String(azar(10000)).padStart(4, '0')
const sufijoDe = () => String(azar(10))
const refDePrueba = () => `TEST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`
const fechaCorta = (iso) => new Date(iso).toLocaleString('es-PY', { dateStyle: 'short', timeStyle: 'short' })

/**
 * Arma la página de prueba.
 * @returns {{ base64: () => string, lineas: () => string[], ref: string, validacion: string, sufijo: string, validador: string, corte: string }}
 */
export function paginaDePrueba({
  tipo = 'corta',
  ancho = 80,
  impresora = '',
  nombre = '',
  equipo = '',
  copias = 1,
  metodo = '',
  conexion = '',
  puente = '',
  tokenPista = '',
  usuario = '',
  marca = '',
  nombreApp = 'OwnCoding',
  validacion: validacionFija = '',
  incluyeFecha = false,
  corte = PLANTILLA_PRUEBA.corte,
  qr = null,
} = {}) {
  const metodoReal = metodo || (/^(usb|cups):/.test(String(impresora || '')) ? 'CUPS (cola local)' : 'LAN (TCP directo)')
  const conexionReal = /^(usb|cups)/.test(String(conexion || '')) ? 'Cola CUPS local' : 'LAN (TCP directo)'
  const validacion = validacionFija || validacionDe()
  const sufijo = sufijoDe()
  const validador = `${validacion}-${sufijo}`
  const ref = refDePrueba()
  const ahora = new Date().toISOString()
  const t = crearTicket({ ancho }).iniciar()
  // El ticket corto (#277) es solo el título y la validación (con fecha/hora
  // opcional): menos papel y más rápido. El resto de los tipos conserva la
  // cabecera completa, los códigos y el pie auditable.
  const minimo = tipo === 'corta'

  // Pie común: todo lo que hace auditable la prueba desde el papel.
  const pie = () => {
    t.linea()
    t.negrita().centrado(`VALIDACIÓN ${validador}`).negrita(false)
    t.linea()
    t.par('Impresora', nombre || '—')
    t.par('Método', metodoReal)
    t.par('Conexión', conexionReal)
    t.par('Destino', impresora || '—')
    t.par('Puente', puente || '—')
    t.par('Token', tokenPista || 'sin token')
    t.par('Ancho', `${ancho} mm`)
    t.par('Copias', String(copias))
    t.par('Usuario', usuario || '—')
    t.par('Fecha', fechaCorta(ahora))
    t.par('Equipo', equipo || '—')
    t.par('Trabajo', ref)
  }

  // Códigos de la prueba: QR (si la app pasa generador) + barras con rótulo.
  const codigos = (etiqueta) => {
    t.linea()
    t.centrado('Escanear')
    const contenido = qr ? qr({ destino: impresora, validacion, fecha: ahora, tipo }) : `OWNCODING:PRUEBA:${etiqueta}:${validacion}`
    if (contenido) t.qr(contenido, { tamano: 6, etiqueta: 'QR' })
    t.barcode(`OC-${etiqueta}-${validacion}`, { etiqueta: 'Código de barras' })
    t.linea()
    t.texto('Acentos: á é í ó ú ü ñ Ñ ¿? ¡!')
  }

  if (minimo) {
    // Ticket corto (#277): solo título + validación (+ fecha/hora opcional).
    t.negrita().centrado(`TICKET DE PRUEBA ${nombreApp}`).negrita(false)
    t.linea()
    t.negrita().doble().centrado(`VALIDACIÓN ${validador}`).doble(false).negrita(false)
    if (incluyeFecha) t.par('Fecha', fechaCorta(ahora))
    t.linea()
  } else {
    t.centrado(nombreApp).negrita().doble().centrado('TICKET DE PRUEBA').doble(false).negrita(false)
    t.centrado(TIPOS_PRUEBA[tipo] || 'Prueba')
    if (marca) t.centrado(`Comparativa ${marca}`)
    t.linea()
    t.negrita().doble().centrado(`VALIDACIÓN ${validador}`).doble(false).negrita(false)
    t.linea()
  }

  if (tipo === 'completa') {
    t.par('Prueba', metodoReal)
    t.par('Destino', impresora || '—')
    t.par('Resultado', 'PENDIENTE')
    codigos('COMPLETA')
  }

  if (tipo === 'pedido') {
    t.par('Pedido', `P-${validacionDe()}`)
    t.par('Cliente', 'Cliente de prueba')
    t.linea()
    t.texto('iPhone 16 Pro 128GB')
    t.par('  x1', '7.950.000')
    t.texto('Case MagSafe silicona')
    t.par('  x1', '180.000')
    t.texto('Lámina 9H')
    t.par('  x2', '60.000')
    t.linea()
    t.par('Subtotal', '8.250.000')
    t.par('Descuento', '-250.000')
    t.negrita().par('Total', '8.000.000').negrita(false)
    t.par('Medio de pago', 'Efectivo')
    t.par('Vendedor', 'Vendedor de prueba')
    codigos('PEDIDO')
  }

  if (tipo === 'qr') {
    t.par('Pedido', `P-${validacionDe()}`)
    t.par('Cliente', 'Cliente de prueba')
    t.negrita().par('Total', '1.234.000').negrita(false)
    codigos('QR')
  }

  if (tipo === 'venta') {
    t.centrado(`${nombreApp} · SUCURSAL CENTRAL`).centrado('Comprobante de venta')
    t.linea()
    t.par('Fecha', fechaCorta(ahora))
    t.par('Vendedor', 'Vendedor de prueba')
    t.par('Cliente', 'Cliente de prueba')
    t.linea()
    t.texto('iPhone 16 Pro 128GB')
    t.par('  x1', '7.950.000')
    t.texto('Case MagSafe silicona')
    t.par('  x1', '180.000')
    t.linea()
    t.par('Subtotal', '8.130.000')
    t.par('IVA 10%', '813.000')
    t.negrita().par('Total', '8.943.000').negrita(false)
    t.par('Medio de pago', 'Transferencia')
    codigos('VENTA')
  }

  if (tipo === 'caracteres') {
    t.texto('Texto normal')
    t.negrita().texto('Negrita').negrita(false)
    t.doble().par('DOBLE', '123').doble(false)
    t.centrado('Centrado')
    t.par('Columna izquierda', 'derecha')
    codigos('CHARS')
  }

  if (tipo === 'corte') {
    t.par('Prueba', 'Corte físico por variantes')
    t.linea()
    t.texto('Cada sección etiquetada intenta un corte distinto: mirá en qué sección se separó el papel.')
    t.linea()
    t.centrado('1) GS V 0 · completo')
    t.texto('Corte completo puro (el estándar de recibos).')
    t.avanza(1).corte('completo')
    t.centrado('2) GS V 1 · parcial')
    t.texto('Corte parcial: deja una tirita sin cortar.')
    t.avanza(1).corte('parcial')
    t.centrado('3) GS V 65 0 · avanza + completo')
    t.texto('Primero avanza hasta la cuchilla y después corta todo.')
    t.avanza(1).corte('avanza-completo')
    t.centrado('4) GS V 66 0 · avanza + parcial')
    t.texto('Avanza hasta la cuchilla y corta parcial.')
    t.avanza(1).corte('avanza-parcial')
    t.linea()
    t.texto('Si ninguna cortó, revisá Cutter Enable: YES y que el rollo esté bien cargado.')
    codigos('CORTE')
  }

  if (!minimo) pie()
  t.avanza(2).corte(corte)
  return { base64: () => t.base64(), lineas: () => t.lineas(), ref, validacion, sufijo, validador, corte: t.corteEnviado() }
}

// Prueba clásica: caracteres y formato.
export function paginaDePruebaSimple(opciones = {}) {
  return paginaDePrueba({ ...opciones, tipo: 'caracteres' })
}
