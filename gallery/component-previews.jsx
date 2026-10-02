import { previewGroup } from './preview-registry.js'
import { DeferredPreview } from './deferred-preview.jsx'
import React, { useId, useMemo, useState } from 'react'
import {
  PasswordInput, PinInput, SearchField, IconAction, Card, ErrorState, Nota, Input,
  EmailField, MoneyInput, Money, SerialField, RangoFecha, Label, ThemeToggle,
  BuscadorCliente, DataTable, SegmentedField, ListGridToggle, PageHeader,
  Modal, Drawer, ConfirmDialog, EstadoGuardado, BarraProgreso, ProgresoChecklist,
  ProductFooter, ProductPrefooter, Button, crearIdentidadApp,
} from '../src/index.js'
import { crearCorreoTransaccional, renderCorreoHtml, renderCorreoTexto } from '../src/email/index.js'
import packageJson from '../package.json'

const identity = crearIdentidadApp({ nombre: 'OwnCoding UI', version: packageJson.version })
const rows = [{ id: 'a', nombre: 'Pedido Demo A', estado: 'Pendiente' }, { id: 'b', nombre: 'Pedido Demo B', estado: 'Completo' }]

export function ComponentPreview({ name }) {
  const group = previewGroup(name)
  return group ? <DeferredPreview key={name} group={group} name={name} /> : <BasicPreview key={name} name={name} />
}

function BasicPreview({ name }) {
  const id = useId()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [count, setCount] = useState(1)
  const [mode, setMode] = useState('list')
  const [model, setModel] = useState('compacto')
  const [version, setVersion] = useState(packageJson.version)
  const [cambios, setCambios] = useState(false)
  const [muestra, setMuestra] = useState('')
  const field = (label, element) => <div><Label htmlFor={id}>{label}</Label>{element}</div>
  switch (name) {
    case 'PasswordInput': return field('Contraseña de muestra', <PasswordInput id={id} defaultValue="demo-only" />)
    case 'PinInput': return field('PIN de muestra', <PinInput id={id} ariaLabel="PIN de muestra" value={value} onChange={setValue} />)
    case 'SearchField': return <SearchField ariaLabel="Búsqueda de muestra" value={value} onChange={event => setValue(event.target.value)} />
    case 'IconAction': return <div className="flex items-center gap-3"><IconAction icon="plus" label="Sumar al fixture" onClick={() => setCount(count + 1)} /><span role="status">{count} acciones locales</span></div>
    case 'Card': return <Card className="p-4"><h4 className="font-bold">Tarjeta real</h4><p className="text-sm text-mute">Contenido de muestra dentro del export Card.</p></Card>
    case 'ErrorState': return confirmed ? <Nota tono="info">Reintento local completado.</Nota> : <ErrorState compact description="Error simulado; no se consulta ninguna API." onRetry={() => setConfirmed(true)} />
    case 'Nota': return <Nota tono="warn">Nota de muestra: verificá los datos antes de confirmar.</Nota>
    case 'EmailField': return field('Correo de muestra', <EmailField id={id} value={value} onChange={setValue} />)
    case 'MoneyInput': return field('Importe de muestra', <MoneyInput id={id} value={value} onValueChange={setValue} />)
    case 'Money': return <Money value={1250000} />
    case 'SerialField': return field('Serial de muestra', <SerialField id={id} value={value} onChange={setValue} />)
    case 'RangoFecha': return <RangoFecha periodoPorDefecto="este-mes" />
    case 'Label': return field('Etiqueta vinculada', <input id={id} className="min-h-11 rounded-lg border border-ink-600 bg-ink px-3" defaultValue="Campo de muestra" />)
    case 'ThemeToggle': return <ThemeToggle />
    case 'BuscadorCliente': return <BuscadorCliente clientes={[{ id: 'demo', name: 'Cliente ficticio', document: '4567890' }]} selectedId={value} onSelect={cliente => setValue(cliente?.id || '')} placeholder="Buscar 4567890 (fixture)" />
    case 'DataTable':
    case 'SegmentedField':
    case 'ListGridToggle':
    case 'PageHeader': return <div className="grid gap-3"><PageHeader title="Operaciones de muestra" subtitle="2 registros locales; sin persistencia" /><SegmentedField ariaLabel="Filtrar fixture" options={[[ 'todos', 'Todos' ], ['Pendiente', 'Pendientes']]} value={value || 'todos'} onChange={setValue} /><ListGridToggle value={mode} onChange={setMode} />{mode === 'list' ? <DataTable caption="Operaciones ficticias" columns={[{ key: 'nombre', label: 'Nombre' }, { key: 'estado', label: 'Estado' }]} rows={rows.filter(row => !value || value === 'todos' || row.estado === value)} /> : <div className="grid gap-2 sm:grid-cols-2">{rows.filter(row => !value || value === 'todos' || row.estado === value).map(row => <Card key={row.id} className="p-3">{row.nombre}<p className="text-xs text-mute">{row.estado}</p></Card>)}</div>}</div>
    case 'Modal':
    case 'Drawer':
    case 'ConfirmDialog': return <div className="grid gap-3"><Button onClick={() => { setCambios(false); setMuestra(''); setOpen(true) }}>Abrir {name}</Button><p role="status" className="text-sm text-mute">{confirmed ? 'Fixture confirmado; sin persistencia.' : 'No hay cambios aplicados.'}</p>{name === 'ConfirmDialog' ? <ConfirmDialog open={open} onCancel={() => setOpen(false)} onConfirm={() => { setConfirmed(true); setOpen(false) }} title="Confirmar fixture" description="Esta acción solo cambia el estado local de la muestra." /> : name === 'Modal' ? <Modal open={open} dirty={cambios} onClose={() => setOpen(false)} title="Modal de muestra"><Nota tono="info">Contenido local; Escape o cerrar restaura el foco. Si escribís, el cierre pide confirmación.</Nota><div className="mt-3"><Label htmlFor={`${id}-muestra`}>Campo de muestra</Label><Input id={`${id}-muestra`} value={muestra} onChange={(evento) => { setMuestra(evento.target.value); setCambios(true) }} /></div><Button className="mt-3" onClick={() => setOpen(false)}>Cerrar muestra</Button></Modal> : <Drawer open={open} dirty={cambios} onClose={() => setOpen(false)} title="Drawer de muestra"><Nota tono="info">Panel local sin solicitudes de red. Si escribís, el cierre pide confirmación.</Nota><div className="mt-3"><Label htmlFor={`${id}-muestra`}>Campo de muestra</Label><Input id={`${id}-muestra`} value={muestra} onChange={(evento) => { setMuestra(evento.target.value); setCambios(true) }} /></div><Button className="mt-3" onClick={() => setOpen(false)}>Cerrar muestra</Button></Drawer>}</div>
    case 'EstadoGuardado':
    case 'BarraProgreso':
    case 'ProgresoChecklist': return <div className="grid gap-3"><Button variant="outline" onClick={() => setCount((count + 1) % 5)}>Avanzar fixture</Button><ProgresoChecklist hechas={count} total={4} /><BarraProgreso valor={count} max={4} etiqueta="Avance local" /><EstadoGuardado estado={{ ok: count === 4, texto: count === 4 ? 'Fixture completado' : 'Simulación pendiente; no guardada' }} /></div>
    case 'ProductFooter': return <div className="grid gap-3"><SelectModel label="Modelo de pie" value={model} onChange={setModel} options={['compacto', 'distribuido', 'apilado']} /><Label htmlFor={id}>Versión de muestra</Label><input id={id} className="min-h-11 rounded-lg border border-ink-600 bg-ink px-3" value={version} onChange={event => setVersion(event.target.value)} /><ProductFooter identidad={identity} version={`v${version}`} modelo={model} anio={2026} /></div>
    case 'ProductPrefooter': return <div className="grid gap-3"><SelectModel label="Modelo de prefooter" value={model === 'compacto' ? 'enlaces' : model} onChange={setModel} options={['enlaces', 'accion', 'completo']} /><ProductPrefooter modelo={model === 'compacto' ? 'enlaces' : model} titulo="Base compartida" descripcion="Preview local del componente exportado." columnas={[{ titulo: 'Recursos', enlaces: [{ href: '#catalogo', etiqueta: 'Catálogo' }] }]} accion={{ titulo: 'Explorá la biblioteca', enlace: { href: '#catalogo', etiqueta: 'Ver exports' } }} /></div>
    default: return null
  }
}

function SelectModel({ label, value, onChange, options }) {
  const id = useId()
  return <div><Label htmlFor={id}>{label}</Label><select id={id} className="min-h-11 w-full rounded-lg border border-ink-600 bg-ink px-3" value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></div>
}

export function EmailPreview() {
  const [format, setFormat] = useState('html')
  const email = useMemo(() => crearCorreoTransaccional({ identidad: identity, asunto: 'Operación de muestra', motivo: 'Tu operación ficticia está lista para revisar.', detalles: [{ etiqueta: 'Referencia', valor: 'DEMO-001' }], cierre: 'Preview local. No se envió ningún correo.' }), [])
  return <details open className="rounded-2xl border border-ink-600 bg-ink p-4"><summary className="min-h-11 cursor-pointer font-bold">Correo transaccional · HTML y texto</summary><div className="grid gap-3 pt-3"><p className="text-sm text-mute">Renderer existente del subpath owncoding-ui/email. Fixture local, sin envío ni API.</p><SegmentedField ariaLabel="Formato del correo" value={format} onChange={setFormat} options={[[ 'html', 'HTML' ], ['text', 'Texto']]} />{format === 'html' ? <iframe title="Correo HTML de muestra" sandbox="" srcDoc={renderCorreoHtml(email)} className="h-96 w-full rounded-xl border border-ink-600 bg-white" /> : <pre className="whitespace-pre-wrap break-words text-sm">{renderCorreoTexto(email)}</pre>}</div></details>
}
