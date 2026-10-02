import React, { useId, useState } from 'react'
import {
  FormActions, SaveActions, FormField, SeccionColapsable, Subtabs, Stepper,
  PeriodoTabs, NumericKeypad, ConfirmarConPalabra, TaxIdField, InstagramField,
  ChipEstado, EstadoBadge, FilaDato, GradoBadge, GraficoBarras, Cronologia,
  MedidorStock, ConteoChecklist, ContadorLote, ChipOrigen, ChipPrioridad,
  Vencimiento, Button, Input, Label, Modal,
} from '../src/index.js'

const bars = [{ etiqueta: 'Demo A', valor: 8 }, { etiqueta: 'Demo B', valor: 4 }, { etiqueta: 'Demo C', valor: 6 }]
const milestones = [{ id: 'demo-1', fecha: '2026-10-01T12:00:00Z', tipo: 'creado', titulo: 'Fixture creado', detalle: 'Evento ficticio; fecha fija.', actor: 'Persona Demo' }]
const options = [['resumen', 'Resumen', 2], ['actividad', 'Actividad', 1]]
function Advance({ count, setCount }) {
  return <Button variant="outline" onClick={() => setCount((count + 1) % 5)}>Avanzar muestra</Button>
}
function FormScene({ save, id, value, setValue, open, setOpen, setStatus }) {
  const Actions = save ? SaveActions : FormActions
  const form = <form onSubmit={event => { event.preventDefault(); setStatus('Formulario validado localmente; no guardado.'); setOpen(false) }} className="space-y-4"><FormField label="Nombre del fixture" htmlFor={id} hint="Dato local; no se guarda"><Input id={id} required value={value} onChange={event => setValue(event.target.value)} /></FormField><Actions><Button type="submit">Validar muestra</Button></Actions></form>
  return save ? <><Button onClick={() => setOpen(true)}>Abrir formulario local</Button><Modal open={open} onClose={() => setOpen(false)} title="Formulario de muestra">{form}</Modal></> : form
}

export const OPERATION_DEMOS = {
  FormActions: props => <FormScene {...props} />,
  SaveActions: props => <FormScene {...props} save />,
  FormField: ({ id, value, setValue }) => <FormField label="Referencia local" htmlFor={id} hint="Escribí al menos tres caracteres" error={value && value.length < 3 ? 'La referencia necesita tres caracteres.' : undefined}><Input id={id} value={value} onChange={event => setValue(event.target.value)} /></FormField>,
  SeccionColapsable: () => <SeccionColapsable titulo="Detalles opcionales" resumen="Expandir para ver el fixture" clave={null}><p className="p-4 text-sm text-mute">Contenido local. El estado no se persiste.</p></SeccionColapsable>,
  Subtabs: ({ active, setActive }) => <><Subtabs items={options} value={active} onChange={setActive} ariaLabel="Secciones del fixture" /><p className="text-sm">Contenido local: {active}</p></>,
  Stepper: props => <><Stepper pasos={['Datos', 'Revisión', 'Confirmación', 'Resultado']} actual={Math.min(props.count, 3)} variante="tarjetas" /><Advance {...props} /></>,
  PeriodoTabs: ({ active, setActive }) => <><PeriodoTabs periodo={active} setPeriodo={setActive} /><p className="text-sm">Período local: {active}</p></>,
  NumericKeypad: ({ value, setValue }) => <><output className="block text-2xl font-bold tabular-nums" aria-label="Número de muestra">{value || '0'}</output><NumericKeypad value={value} onChange={setValue} max={6} ariaLabel="Teclado de muestra; no cobro" /></>,
  ConfirmarConPalabra: ({ setStatus }) => <ConfirmarConPalabra titulo="Confirmar simulación" resumen="Solo cambia el mensaje de esta muestra." advertencia="No borra, fusiona ni guarda datos." palabra="DEMO" confirmLabel="Confirmar muestra" onConfirmar={() => setStatus('Muestra confirmada; no se modificaron datos.')} onCancelar={() => setStatus('Simulación cancelada.')} />,
  TaxIdField: ({ value, setValue }) => <TaxIdField value={value} onChange={setValue} hint="Validación de formato local. Sin consulta DNIT ni identificación real." />,
  InstagramField: ({ id, value, setValue }) => <div><Label htmlFor={id}>Usuario ficticio</Label><InstagramField id={id} value={value} onChange={setValue} /><p className="mt-2 text-xs text-mute">Normalización local; sin abrir Instagram.</p></div>,
  ChipEstado: props => <><ChipEstado estado={props.count === 4 ? 'completado' : 'pendiente'} etiqueta={props.count === 4 ? 'Muestra completa' : 'Muestra pendiente'} /><Advance {...props} /></>,
  EstadoBadge: props => <><EstadoBadge valor={props.count === 4 ? 'listo' : 'pendiente'} mapa={{ listo: { label: 'Listo', color: 'ok' }, pendiente: { label: 'Pendiente', color: 'warn' } }} /><Advance {...props} /></>,
  FilaDato: props => <><FilaDato etiqueta="Unidades de muestra" valor={props.count} /><Advance {...props} /></>,
  GradoBadge: ({ empty, setEmpty }) => <><GradoBadge grado={empty ? null : 'A'} conDescripcion /><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar sin grado</Button></>,
  GraficoBarras: ({ empty, setEmpty, expanded, setExpanded }) => <><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar sin datos</Button><Button variant="outline" onClick={() => setExpanded(!expanded)}>Alternar orientación</Button></div><GraficoBarras datos={empty ? [] : bars} orientacion={expanded ? 'horizontal' : 'vertical'} etiqueta="Unidades ficticias por grupo" /></>,
  Cronologia: ({ active, setActive }) => <><Subtabs items={['datos', 'vacio', 'cargando', 'error'].map(item => [item, item])} value={active} onChange={setActive} ariaLabel="Estado de la cronología" /><Cronologia hitos={active === 'vacio' ? [] : milestones} cargando={active === 'cargando'} error={active === 'error' ? 'Error de muestra; sin API.' : ''} onReintentar={() => setActive('datos')} /></>,
  MedidorStock: props => <><MedidorStock stock={props.count} umbral={2} variante="barra" etiqueta="Stock del fixture" /><Advance {...props} /></>,
  ConteoChecklist: props => <><ConteoChecklist pasan={props.count} total={4} sustantivo="verificaciones" /><Advance {...props} /></>,
  ContadorLote: props => <><ContadorLote recibidos={props.count} total={4} variante="barra" mostrarFaltan sufijo="unidades ficticias" /><Advance {...props} /></>,
  ChipOrigen: ({ empty, setEmpty }) => <><ChipOrigen origen={empty ? null : 'manual'} /><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar sin origen</Button></>,
  ChipPrioridad: ({ empty, setEmpty }) => <><ChipPrioridad prioridad={empty ? 'alta' : 'media'} /><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar prioridad</Button></>,
  Vencimiento: ({ empty, setEmpty }) => <><Vencimiento fecha={empty ? null : '2026-10-05'} hoy={new Date('2026-10-01T12:00:00Z')} variante="chip" /><p className="text-xs text-mute">Referencia fija: 1 de octubre de 2026; fecha de muestra, no plazo real.</p><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar sin fecha</Button></>,
}

export function OperationPreview({ name }) {
  const id = useId()
  const [value, setValue] = useState('')
  const [active, setActive] = useState(name === 'PeriodoTabs' ? 'dia' : name === 'Cronologia' ? 'datos' : 'resumen')
  const [count, setCount] = useState(1)
  const [empty, setEmpty] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('Fixture local; sin solicitudes ni persistencia.')
  const Demo = OPERATION_DEMOS[name]
  return Demo ? <div data-demo-family="operation" data-demo-export={name} className="space-y-4"><Demo {...{ id, value, setValue, active, setActive, count, setCount, empty, setEmpty, expanded, setExpanded, open, setOpen, setStatus }} /><p role="status" className="text-xs text-mute">{status}</p></div> : null
}
