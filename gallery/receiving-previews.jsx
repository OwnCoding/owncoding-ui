import React, { useId, useState } from 'react'
import {
  BloquePago, CeldaMoneda, DestinoRecepcion, Eyebrow, Icon, IconoCategoria,
  ImeiField, PanelDerecho, PlanPagos, PreviewFusion, ResumenDestinos,
  ResumenIncidencias, ResumenRecepcion, SectionState, SelectorIncidencia,
  TarjetaAjuste, TarjetaCompra, TarjetaLote, TarjetaNecesidad, TarjetaRecepcion,
  TileEquipo, TileRol, Button, Input, Label, SegmentedField,
} from '../src/index.js'

const destinations = [{ id: 'central', etiqueta: 'Depósito ficticio Central', cantidad: 2 }, { id: 'norte', etiqueta: 'Depósito ficticio Norte', cantidad: 1 }]
const entities = [{ id: 'a', titulo: 'Ficha ficticia A', datos: [{ etiqueta: 'Referencia', valor: 'DEMO-A' }] }, { id: 'b', titulo: 'Ficha ficticia B', datos: [{ etiqueta: 'Referencia', valor: 'DEMO-B' }] }]
const openFixture = setStatus => () => setStatus('Detalle local abierto; ningún registro real modificado.')

export const RECEIVING_DEMOS = {
  BloquePago: ({ enabled, setEnabled }) => <>{enabled ? <BloquePago etiqueta="Pago ficticio" encabezado="Cuota de muestra" onQuitar={() => setEnabled(false)}><p>No se procesa ningún pago.</p><CeldaMoneda valor={125000} /></BloquePago> : <p role="status">Bloque retirado del fixture.</p>}<Button variant="outline" onClick={() => setEnabled(true)}>Restaurar bloque local</Button></>,
  CeldaMoneda: ({ enabled, setEnabled }) => <><CeldaMoneda valor={enabled ? 125000 : -125000} /><Button variant="outline" onClick={() => setEnabled(!enabled)}>Alternar signo local</Button></>,
  DestinoRecepcion: ({ selected, setSelected, setStatus }) => <DestinoRecepcion destinoId={selected} onDestinoChange={setSelected} depositos={[{ id: 'central', nombre: 'Central ficticio' }, { id: 'norte', nombre: 'Norte ficticio' }]} pendientes={3} onRecibir={() => setStatus(`Recepción simulada en ${selected}; no se recibe mercadería.`)} textoRecibir="Simular recepción local" />,
  Eyebrow: ({ text, setText, id }) => <><Label htmlFor={id}>Texto del encabezado</Label><Input id={id} value={text} onChange={event => setText(event.target.value)} /><Eyebrow>{text || 'Encabezado de muestra'}</Eyebrow></>,
  Icon: ({ selected, setSelected }) => <><SegmentedField ariaLabel="Glifo de muestra" options={[['box', 'Caja'], ['check', 'Confirmación'], ['search', 'Búsqueda']]} value={selected} onChange={setSelected} /><Icon name={selected === 'central' ? 'box' : selected} className="h-8 w-8" /></>,
  IconoCategoria: ({ enabled, setEnabled }) => <><IconoCategoria icono={enabled ? 'mobile' : 'laptop'} className="h-10 w-10" /><p>{enabled ? 'Teléfono ficticio' : 'Portátil ficticio'}</p><Button variant="outline" onClick={() => setEnabled(!enabled)}>Alternar categoría local</Button></>,
  ImeiField: ({ imei, setImei, reviewing, setReviewing }) => (
    <div className="space-y-3">
      <ImeiField label="IMEI de muestra" value={imei} onChange={setImei} required revisando={reviewing} />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => setImei('490154203237518')}>Cargar IMEI válido</Button>
        <Button variant="outline" onClick={() => setImei('490154203237510')}>Dígito control inválido</Button>
        <Button variant="outline" onClick={() => setImei('')}>Vaciar</Button>
        <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={reviewing} onChange={event => setReviewing(event.target.checked)} />Simular revisión externa</label>
      </div>
      <p className="text-xs text-mute">Luhn local con fixtures ficticios; no se consulta ningún proveedor ni se registra el IMEI.</p>
    </div>
  ),
  PanelDerecho: ({ text, setText, id }) => <PanelDerecho panel={<p role="status">Referencia local: {text || 'Sin referencia'}</p>}><Label htmlFor={id}>Referencia del panel</Label><Input id={id} value={text} onChange={event => setText(event.target.value)} /></PanelDerecho>,
  PlanPagos: ({ enabled, setEnabled }) => <><PlanPagos anticipo={50000} cuotas={[{ id: 'demo', etiqueta: 'Cuota ficticia', monto: 125000, vence: '2026-10-15', estado: enabled ? 'pendiente' : 'pagado', nota: 'Estado de muestra, no pago real' }]} total={175000} condiciones="Plan ficticio; no se transfiere ni cobra dinero." /><Button variant="outline" onClick={() => setEnabled(!enabled)}>Alternar cuota local</Button></>,
  PreviewFusion: ({ selected, setSelected }) => <PreviewFusion entidades={entities} principalId={selected === 'central' ? 'a' : selected} onElegirPrincipal={setSelected} categorias={[{ id: 'notas', etiqueta: 'Notas ficticias', cantidad: 2 }]} nota="Solo se elige una ficha principal en memoria. No se fusiona ni archiva información." />,
  ResumenDestinos: ({ enabled, setEnabled, setStatus }) => <><ResumenDestinos destinos={enabled ? destinations : []} onElegir={destination => setStatus(`Destino local: ${destination.etiqueta || destination}`)} />{!enabled && <p>Sin destinos en el fixture.</p>}<Button variant="outline" onClick={() => setEnabled(!enabled)}>Alternar destinos vacíos</Button></>,
  ResumenIncidencias: ({ enabled, setEnabled }) => <><ResumenIncidencias incidencias={enabled ? [{ tipo: 'faltante', cantidad: 2, detalle: 'Unidades ficticias' }] : []} /><Button variant="outline" onClick={() => setEnabled(!enabled)}>Alternar incidencias locales</Button></>,
  ResumenRecepcion: ({ enabled, setEnabled }) => <><ResumenRecepcion resumen={{ RECIBIDO: enabled ? 3 : 2, FALTANTE: enabled ? 0 : 1 }} /><Button variant="outline" onClick={() => setEnabled(!enabled)}>Alternar resultado local</Button></>,
  SectionState: ({ selected, setSelected, setStatus }) => <><SegmentedField ariaLabel="Estado del contenido" options={[['vacio', 'Vacío'], ['cargando', 'Cargando'], ['error', 'Error']]} value={selected === 'central' ? 'vacio' : selected} onChange={setSelected} /><SectionState compact estado={selected === 'central' ? 'vacio' : selected} description="Fixture local; no se consulta ningún servidor." onRetry={() => { setSelected('vacio'); setStatus('Reintento simulado sin solicitudes.') }} /></>,
  SelectorIncidencia: ({ incidence, setIncidence }) => <><SelectorIncidencia valor={incidence} onChange={setIncidence} /><p role="status">Incidencia local: {incidence || 'Ninguna'}</p></>,
  TarjetaAjuste: ({ enabled, setEnabled }) => <TarjetaAjuste titulo="Ajuste ficticio" descripcion="No modifica una configuración real." accion={<Button variant="outline" onClick={() => setEnabled(!enabled)}>{enabled ? 'Desactivar muestra' : 'Activar muestra'}</Button>}><p role="status">Muestra {enabled ? 'activa' : 'inactiva'}</p></TarjetaAjuste>,
  TarjetaCompra: ({ setStatus }) => <TarjetaCompra codigo="DEMO-COMPRA-001" proveedor="Proveedor ficticio" estado="pendiente" costo={125000} unidades={3} conImei={1} notas="Sin compra ni pago real" onAbrir={openFixture(setStatus)} />,
  TarjetaLote: ({ setStatus }) => <TarjetaLote codigo="DEMO-LOTE-001" estado="pendiente" origen="Origen ficticio" destino="Central ficticio" unidades={3} responsable="Equipo de muestra" notas="Sin transporte real" onAbrir={openFixture(setStatus)} />,
  TarjetaNecesidad: ({ setStatus }) => <TarjetaNecesidad producto="Equipo ficticio" variante="Azul / 128 GB" prioridad="alta" estado="pendiente" pendiente={3} comprado={1} faltan={2} destinos={destinations} onElegirDestino={destination => setStatus(`Destino de muestra: ${destination.etiqueta || destination}`)} observaciones="Sin reserva ni compra real" onAbrir={openFixture(setStatus)} />,
  TarjetaRecepcion: ({ setStatus }) => <TarjetaRecepcion codigo="DEMO-RECEPCION-001" estado="pendiente" origen="Origen ficticio" destino="Central ficticio" unidades={3} conImei={1} deposito="Depósito ficticio" notas="Sin ingreso de mercadería real" onAbrir={openFixture(setStatus)} />,
  TileEquipo: ({ setStatus }) => <TileEquipo modelo="Equipo ficticio" imei="DEMO-SERIAL-001" detalle="128 GB · Azul" estado="disponible" grado="A" bateria={90} onOpen={openFixture(setStatus)} />,
  TileRol: ({ enabled, setEnabled, setStatus }) => <><TileRol titulo="Rol ficticio" descripcion="No modifica permisos reales" cantidad={enabled ? 2 : 1} total={2} dominios={[{ id: 'demo', etiqueta: 'Operaciones de muestra', activo: enabled }]} onAbrir={openFixture(setStatus)} /><Button variant="outline" onClick={() => setEnabled(!enabled)}>Alternar dominio ficticio</Button></>,
}

export function ReceivingPreview({ name }) {
  const id = useId()
  const [enabled, setEnabled] = useState(true)
  const [selected, setSelected] = useState('central')
  const [text, setText] = useState('Referencia ficticia')
  const [incidence, setIncidence] = useState(null)
  const [imei, setImei] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const [status, setStatus] = useState('')
  const Demo = RECEIVING_DEMOS[name]
  return <div className="grid min-w-0 gap-3" data-demo-export={name} data-demo-family="receiving"><p className="text-xs text-mute">Simulación local con datos ficticios; sin envíos, cobros ni persistencia.</p><Demo {...{ id, enabled, setEnabled, selected, setSelected, text, setText, incidence, setIncidence, imei, setImei, reviewing, setReviewing, setStatus }} />{status && <p role="status" className="text-sm">{status}</p>}</div>
}
