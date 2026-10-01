import { crearIdentidadApp } from '../utils/appIdentity.js'

const COLOR_TEXTO = '#10161a'
const COLOR_SUAVE = '#5d6f78'
const COLOR_BORDE = '#dbe3e7'

function texto(valor, campo, requerido = false) {
  const resultado = String(valor ?? '').trim()
  if (requerido && !resultado) throw new TypeError(`${campo} es obligatorio`)
  return resultado
}

function urlSegura(valor, campo) {
  const cadena = texto(valor, campo, true)
  let url
  try {
    url = new URL(cadena)
  } catch {
    throw new TypeError(`${campo} debe ser una URL absoluta`)
  }
  if (!['https:', 'mailto:'].includes(url.protocol)) {
    throw new TypeError(`${campo} debe usar https o mailto`)
  }
  return url.toString()
}

function congelarDetalle(detalle = {}) {
  return Object.freeze({
    etiqueta: texto(detalle.etiqueta, 'detalle.etiqueta', true),
    valor: texto(detalle.valor, 'detalle.valor', true),
  })
}

function normalizarIdentidad(identidad) {
  return crearIdentidadApp(identidad)
}

function colorSobre(hex) {
  const componentes = String(hex).slice(1).match(/.{2}/g)?.map((parte) => Number.parseInt(parte, 16) / 255) ?? [0, 0, 0]
  const luminancia = componentes
    .map((canal) => (canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4))
    .reduce((suma, canal, indice) => suma + canal * [0.2126, 0.7152, 0.0722][indice], 0)
  return luminancia > 0.179 ? '#10161a' : '#ffffff'
}

/** Modelo de presentación; el envío y su estado pertenecen al backend. */
export function crearCorreoTransaccional({
  identidad,
  asunto,
  preheader,
  motivo,
  detalles = [],
  accion,
  cierre = 'Si no solicitaste esta acción, podés ignorar este correo.',
  firma,
} = {}) {
  const app = normalizarIdentidad(identidad)
  const asuntoSeguro = texto(asunto, 'asunto', true)
  const motivoSeguro = texto(motivo, 'motivo', true)
  const accionSegura = accion
    ? Object.freeze({
        etiqueta: texto(accion.etiqueta, 'accion.etiqueta', true),
        url: urlSegura(accion.url, 'accion.url'),
      })
    : null

  return Object.freeze({
    identidad: app,
    asunto: asuntoSeguro,
    preheader: texto(preheader || motivoSeguro, 'preheader'),
    motivo: motivoSeguro,
    detalles: Object.freeze((Array.isArray(detalles) ? detalles : []).map(congelarDetalle)),
    accion: accionSegura,
    cierre: texto(cierre, 'cierre'),
    firma: texto(firma || `${app.nombre} · Desarrollado por Owncoding`, 'firma', true),
  })
}

function correoSeguro(correo) {
  // `Object.freeze()` solo impide mutaciones: no demuestra que el modelo haya
  // pasado por este módulo. Normalizamos siempre el límite público para que un
  // objeto congelado construido por un consumidor no pueda eludir la política
  // de URLs ni el escape de campos.
  return crearCorreoTransaccional(correo)
}

export function escaparCorreoHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function renderCorreoTexto(correo) {
  const modelo = correoSeguro(correo)
  const lineas = [modelo.asunto, '', modelo.motivo]
  if (modelo.detalles.length > 0) {
    lineas.push('', ...modelo.detalles.map(({ etiqueta, valor }) => `${etiqueta}: ${valor}`))
  }
  if (modelo.accion) {
    lineas.push('', modelo.accion.etiqueta, modelo.accion.url)
  }
  if (modelo.cierre) lineas.push('', modelo.cierre)
  lineas.push('', modelo.firma, modelo.identidad.etiquetaVersion)
  return lineas.join('\n')
}

export function renderCorreoHtml(correo) {
  const modelo = correoSeguro(correo)
  const app = modelo.identidad
  const e = escaparCorreoHtml
  const colorAccion = colorSobre(app.color)
  const detalles = modelo.detalles.length > 0
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border-collapse:collapse">${modelo.detalles.map(({ etiqueta, valor }) => `<tr><th scope="row" align="left" style="padding:10px 12px;border-bottom:1px solid ${COLOR_BORDE};color:${COLOR_SUAVE};font-size:13px;font-weight:600">${e(etiqueta)}</th><td align="right" style="padding:10px 12px;border-bottom:1px solid ${COLOR_BORDE};color:${COLOR_TEXTO};font-size:14px">${e(valor)}</td></tr>`).join('')}</table>`
    : ''
  const accion = modelo.accion
    ? `<div style="margin:28px 0;text-align:center"><a href="${e(modelo.accion.url)}" style="display:inline-block;min-height:44px;box-sizing:border-box;border-radius:10px;background:${e(app.color)};color:${colorAccion};font-size:15px;font-weight:700;line-height:24px;padding:10px 20px;text-decoration:none">${e(modelo.accion.etiqueta)}</a><p style="margin:16px 0 0;color:${COLOR_SUAVE};font-size:12px;line-height:18px;overflow-wrap:anywhere">Si el botón no funciona, abrí este enlace:<br><a href="${e(modelo.accion.url)}" style="color:${e(app.color)}">${e(modelo.accion.url)}</a></p></div>`
    : ''
  const logo = app.logoUrl && /^https?:\/\//i.test(app.logoUrl)
    ? `<img src="${e(app.logoUrl)}" width="48" height="48" alt="" style="display:block;margin:0 0 16px;border:0;border-radius:12px">`
    : ''

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(modelo.asunto)}</title></head>
<body style="margin:0;background:#f1f4f8;color:${COLOR_TEXTO};font-family:Inter,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(modelo.preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border:1px solid ${COLOR_BORDE};border-radius:16px;background:#ffffff"><tr><td style="padding:32px">
${logo}<p style="margin:0 0 8px;color:${COLOR_SUAVE};font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase">${e(app.nombre)}</p>
<h1 style="margin:0 0 18px;color:${COLOR_TEXTO};font-size:24px;line-height:32px">${e(modelo.asunto)}</h1>
<p style="margin:0;color:${COLOR_TEXTO};font-size:16px;line-height:26px">${e(modelo.motivo)}</p>
${detalles}${accion}
${modelo.cierre ? `<p style="margin:24px 0 0;color:${COLOR_SUAVE};font-size:14px;line-height:22px">${e(modelo.cierre)}</p>` : ''}
<p style="margin:28px 0 0;border-top:1px solid ${COLOR_BORDE};padding-top:20px;color:${COLOR_SUAVE};font-size:12px;line-height:19px">${e(modelo.firma)} · ${e(app.etiquetaVersion)}</p>
</td></tr></table>
</td></tr></table></body></html>`
}
