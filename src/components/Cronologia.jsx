import Icon from './Icon.jsx'
import { Button, EmptyState, Skeleton } from './ui.jsx'
import { puntoDeTono } from '../utils/tonos.js'
import { fechaDia, fechaHora, fechaValida } from '../utils/fecha.js'
import { cn } from '../utils/cn.js'

// Cronología de hitos (portado del `AdminTimeline` de LedBox): una fila por
// hecho real con su ícono/tono por tipo, título, detalle, actor y fecha en
// es-PY 24 h. Los hitos llegan ya ordenados y con su fecha real; el objeto no
// interpreta nada, no ordena ni inventa lo que no está registrado.
//
// Portable: los tipos son textos libres del consumidor. `ICONOS_HITO`,
// `TONOS_HITO` y `ETIQUETAS_HITO` traen un vocabulario genérico razonable
// (creado, estado, enviado, pago, cancelado…) que se pisa por props.

/** Ícono por defecto de cada tipo de hito. */
export const ICONOS_HITO = {
  creado: 'plus',
  actualizado: 'edit',
  estado: 'refresh',
  enviado: 'send',
  visto: 'eye',
  solicitud: 'edit',
  revision: 'alert',
  resuelto: 'check',
  aprobado: 'check',
  rechazado: 'close',
  pago: 'money',
  cobro: 'money',
  comprobante: 'upload',
  tesoreria: 'wallet',
  inventario: 'box',
  retiro: 'truck',
  devolucion: 'download',
  tarea: 'list',
  tarea_cumplida: 'check',
  evento: 'calendar',
  cancelado: 'close',
  nota: 'info',
  gracias: 'sparkles',
}

/** Tono por defecto de cada tipo de hito (claves canónicas de `utils/tonos.js`). */
export const TONOS_HITO = {
  creado: 'mute',
  actualizado: 'mute',
  estado: 'info',
  enviado: 'info',
  visto: 'info',
  solicitud: 'warn',
  revision: 'warn',
  resuelto: 'ok',
  aprobado: 'ok',
  rechazado: 'bad',
  pago: 'ok',
  cobro: 'info',
  comprobante: 'info',
  tesoreria: 'info',
  inventario: 'info',
  retiro: 'info',
  devolucion: 'ok',
  tarea: 'mute',
  tarea_cumplida: 'ok',
  evento: 'info',
  cancelado: 'bad',
  nota: 'mute',
  gracias: 'ok',
}

/** Etiqueta legible por defecto del tipo (`creado` → «Creado»). */
export const ETIQUETAS_HITO = {
  creado: 'Creado',
  actualizado: 'Actualizado',
  estado: 'Cambio de estado',
  enviado: 'Enviado',
  visto: 'Visto',
  solicitud: 'Solicitud',
  revision: 'Revisión',
  resuelto: 'Resuelto',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  pago: 'Pago',
  cobro: 'Cobro',
  comprobante: 'Comprobante',
  tesoreria: 'Tesorería',
  inventario: 'Inventario',
  retiro: 'Retiro',
  devolucion: 'Devolución',
  tarea: 'Tarea',
  tarea_cumplida: 'Tarea cumplida',
  evento: 'Evento',
  cancelado: 'Cancelado',
  nota: 'Nota',
  gracias: 'Agradecimiento',
}

/** Fecha del hito ya formateada para mostrarla en la fila. */
function fechaDelHito(valor) {
  return valor ? fechaHora(valor) : ''
}

/** Título legible del tipo: la etiqueta conocida o el texto crudo tal cual. */
export function etiquetaDeHito(tipo, etiquetas = ETIQUETAS_HITO) {
  const clave = String(tipo ?? '').trim()
  if (!clave) return ''
  return etiquetas[clave] || clave.replace(/_/g, ' ')
}

/**
 * Hitos agrupados por día (en el orden en que llegan): cada grupo lleva la
 * clave y la etiqueta del día y su lista de hitos. Una fecha inválida cae en
 * «Sin fecha», nunca en «Invalid Date».
 */
export function agruparHitos(hitos = []) {
  const grupos = []
  for (const hito of hitos || []) {
    const valido = fechaValida(hito?.fecha)
    const clave = valido ? fechaDia(valido) : 'sin-fecha'
    let grupo = grupos[grupos.length - 1]
    if (!grupo || grupo.clave !== clave) {
      grupo = { clave, etiqueta: fechaDia(hito?.fecha, 'Sin fecha'), hitos: [] }
      grupos.push(grupo)
    }
    grupo.hitos.push(hito)
  }
  return grupos
}

/**
 * Fila de un hito.
 * `hito` = `{ id, fecha, tipo, titulo, detalle?, actor?, tono?, icono? }`.
 */
function FilaHito({ hito, iconos, tonos, etiquetas, mostrarTipo }) {
  const tipo = String(hito.tipo ?? '').trim()
  const tono = hito.tono || tonos[tipo] || 'mute'
  const icono = hito.icono || iconos[tipo] || 'info'
  const etiqueta = mostrarTipo ? etiquetaDeHito(tipo, etiquetas) : ''
  return (
    <li className="flex gap-3">
      <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full', puntoDeTono(tono))} aria-hidden="true">
        <Icon name={icono} className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1 border-b border-ink-700 pb-2.5">
        <p className="text-sm font-semibold text-fore">
          <span className="break-words">{hito.titulo}</span>
          {hito.actor && <span className="font-normal text-mute"> · {hito.actor}</span>}
        </p>
        {hito.detalle && <p className="mt-0.5 text-xs leading-5 text-mute">{hito.detalle}</p>}
        <p className="mt-0.5 text-[11px] tabular-nums text-mute">
          {[fechaDelHito(hito.fecha), etiqueta].filter(Boolean).join(' · ')}
        </p>
      </div>
    </li>
  )
}

export default function Cronologia({
  /** Hitos: `[{ id, fecha, tipo, titulo, detalle?, actor?, tono?, icono? }]`. */
  hitos = [],
  /** Mapa `tipo → ícono` que pisa los defectos (`ICONOS_HITO`). */
  iconos = ICONOS_HITO,
  /** Mapa `tipo → tono` que pisa los defectos (`TONOS_HITO`). */
  tonos = TONOS_HITO,
  /** Mapa `tipo → etiqueta` que pisa los defectos (`ETIQUETAS_HITO`). */
  etiquetas = ETIQUETAS_HITO,
  /** Agrupa los hitos por día con el encabezado de fecha. */
  agrupar = false,
  /** Muestra la etiqueta del tipo al pie de cada hito. */
  mostrarTipo = false,
  /** Nombre de la lista para lectores de pantalla. */
  etiqueta = 'Cronología',
  /** Cargando: esqueleto honesto en lugar de una lista vacía. */
  cargando = false,
  /** Error de carga: se muestra con reintento si hay `onReintentar`. */
  error = '',
  errorTitulo = 'No se pudo cargar la cronología',
  onReintentar,
  /** Acción de actualizar + texto de la cabecera (opcional). */
  onActualizar,
  textoActualizar = 'Actualizar',
  textoCabecera = 'Movimientos más recientes primero.',
  vacioTitulo = 'Todavía no hay hitos',
  vacioDetalle,
  className,
}) {
  const fila = (hito) => (
    <FilaHito key={hito.id} hito={hito} iconos={iconos} tonos={tonos} etiquetas={etiquetas} mostrarTipo={mostrarTipo} />
  )

  const cabecera = onActualizar ? (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      {textoCabecera ? <p className="text-xs text-mute">{textoCabecera}</p> : null}
      <button
        type="button"
        disabled={cargando}
        onClick={onActualizar}
        className="rounded-lg border border-ink-500 px-3 py-1.5 text-xs font-semibold text-mute transition hover:border-fono hover:text-fore disabled:opacity-40"
      >
        {textoActualizar}
      </button>
    </div>
  ) : null

  if (cargando) {
    return (
      <div className={className}>
        {cabecera}
        <div className="space-y-2" aria-busy="true">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        {cabecera}
        <EmptyState
          compact
          icon="alert"
          title={errorTitulo}
          description={error}
          action={onReintentar ? <Button onClick={onReintentar}>Reintentar</Button> : undefined}
        />
      </div>
    )
  }

  if (!hitos?.length) {
    return (
      <div className={className}>
        {cabecera}
        <EmptyState compact icon="clock" title={vacioTitulo} description={vacioDetalle} />
      </div>
    )
  }

  return (
    <div className={className}>
      {cabecera}
      {agrupar ? (
        <div className="space-y-3">
          {agruparHitos(hitos).map((grupo) => (
            <section key={grupo.clave}>
              <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-mute">{grupo.etiqueta}</h3>
              <ol className="space-y-2.5" aria-label={`${etiqueta} · ${grupo.etiqueta}`}>
                {grupo.hitos.map(fila)}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <ol className="space-y-2.5" aria-label={etiqueta}>
          {hitos.map(fila)}
        </ol>
      )}
    </div>
  )
}
