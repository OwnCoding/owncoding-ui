import CodigoQr from './CodigoQr.jsx'
import { etiquetaMetodoEnvio } from '../utils/abastecimiento.js'
import { etiquetaCondicion } from '../utils/estadoEquipo.js'
import { cn } from '../utils/cn.js'

// Manifiesto de un lote/envío (#250 §11 / F4): el papel que viaja con el envío
// —código, origen → destino, método, empresa/conductor/guía, responsable,
// compra, fechas, el detalle por producto con los IMEI conocidos y pendientes,
// los totales y el QR del manifiesto público—. Es papel claro (igual que el
// resto de los imprimibles): se envuelve con `DocumentoImpresion` y usa las
// clases `oc-print-*`, sin colores del tema.
//
//   <ManifiestoEnvio codigo="ENV-CDE-ASU-0021" origen="CDE" destino="Asunción"
//     metodo="TRANSPORTADORA" empresa="AEX" guia="123" responsable="Ana"
//     compra="COM-CDE-0048" unidades={12} conImei={9} pendientes={3}
//     lineas={[{ producto: 'iPhone 15', capacidad: '128 GB', condicion: 'NEW',
//                cantidad: 6, imeis: ['356789104523178'], pendientes: 3 }]}
//     enlace="https://app.moboss.online/envio/abc123" />
function Dato({ etiqueta, valor }) {
  if (!valor) return null
  return (
    <p className="min-w-0">
      <span className="oc-print-suave block text-[9.5px] font-bold uppercase tracking-wider">{etiqueta}</span>
      <span className="block whitespace-pre-wrap text-[12.5px]">{valor}</span>
    </p>
  )
}

export default function ManifiestoEnvio({
  codigo,
  origen,
  destino,
  metodo,
  empresa,
  conductor,
  guia,
  responsable,
  compra,
  salida,
  eta,
  llegada,
  lineas = [],
  unidades,
  conImei,
  pendientes,
  enlace,
  qr,
  notas,
  className,
}) {
  const ruta = [origen, destino].filter(Boolean).join(' → ')
  const lista = Array.isArray(lineas) ? lineas : []
  const cantidadDe = (linea) => Number(linea?.cantidad) || (linea?.imeis?.length || 0) + (Number(linea?.pendientes) || 0)
  const totalUnidades = Number.isFinite(Number(unidades)) ? Number(unidades) : lista.reduce((suma, linea) => suma + cantidadDe(linea), 0)
  const totalConImei = Number.isFinite(Number(conImei)) ? Number(conImei) : lista.reduce((suma, linea) => suma + (linea?.imeis?.length || 0), 0)
  const totalPendientes = Number.isFinite(Number(pendientes)) ? Number(pendientes) : lista.reduce((suma, linea) => suma + (Number(linea?.pendientes) || 0), 0)

  return (
    <section className={cn('oc-print-bloque w-full bg-white p-4 text-[#10161a]', className)} aria-label={`Manifiesto del lote ${codigo || ''}`}>
      <div className="flex items-start justify-between gap-3 border-b-2 border-[#10161a] pb-2">
        <div className="min-w-0">
          <p className="oc-print-suave text-[10px] font-bold uppercase tracking-wider">Manifiesto de envío</p>
          <b className="block font-mono text-lg">{codigo || 'ENV-…'}</b>
          {ruta ? <span className="block text-sm font-semibold">{ruta}</span> : null}
        </div>
        {qr ? <img src={qr} alt="QR del manifiesto" className="h-20 w-20" /> : null}
        {!qr && enlace ? <CodigoQr valor={enlace} ancho={120} alt="QR del manifiesto" className="h-20 w-20 rounded-md bg-white p-0" /> : null}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        <Dato etiqueta="Método" valor={metodo ? etiquetaMetodoEnvio(metodo) : null} />
        <Dato etiqueta="Empresa" valor={empresa} />
        <Dato etiqueta="Conductor" valor={conductor} />
        <Dato etiqueta="Guía" valor={guia} />
        <Dato etiqueta="Responsable" valor={responsable} />
        <Dato etiqueta="Compra" valor={compra} />
        <Dato etiqueta="Salida" valor={salida} />
        <Dato etiqueta="ETA" valor={eta} />
        <Dato etiqueta="Llegada" valor={llegada} />
      </div>

      <table className="oc-print-tabla mt-3 w-full">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Variante</th>
            <th className="oc-print-num">Cantidad</th>
            <th>IMEI / serial</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((linea, indice) => {
            const imeis = Array.isArray(linea?.imeis) ? linea.imeis : []
            const pendientesLinea = Number(linea?.pendientes) || 0
            return (
              <tr key={linea?.id ?? `${linea?.producto || 'linea'}-${indice}`}>
                <td>{linea?.producto || '—'}</td>
                <td>{[linea?.capacidad, linea?.condicion ? etiquetaCondicion(linea.condicion) : null].filter(Boolean).join(' · ') || '—'}</td>
                <td className="oc-print-num">{cantidadDe(linea)}</td>
                <td>
                  {imeis.map((serial) => <span key={serial} className="block font-mono text-[11px]">{serial}</span>)}
                  {pendientesLinea > 0 ? <span className="oc-print-suave block text-[11px]">{pendientesLinea} IMEI pendiente{pendientesLinea === 1 ? '' : 's'}</span> : null}
                  {!imeis.length && !pendientesLinea ? <span className="oc-print-suave block text-[11px]">Sin IMEI registrados</span> : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-2 border-t border-[#dbe3e7] pt-2">
        <p className="text-[11.5px]">
          <b className="oc-print-num">{totalUnidades}</b> unidad{totalUnidades === 1 ? '' : 'es'} ·{' '}
          <b className="oc-print-num">{totalConImei}</b> con IMEI ·{' '}
          <b className="oc-print-num">{totalPendientes}</b> pendiente{totalPendientes === 1 ? '' : 's'}
        </p>
        {notas ? <p className="mt-1 whitespace-pre-wrap text-[11px]">{notas}</p> : null}
      </div>
    </section>
  )
}
