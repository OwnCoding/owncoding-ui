import React, { useId, useRef, useState } from 'react'
import {
  BuscadorDispositivo, Calendario, CodigoQr, BotonCargaIA, DialogoCargaIA,
  PegarEnlaceToken, SelectorCuentaCobro, TarjetaCuentaCobro, SubidaImagen,
  ToastProvider, useToast, Button,
} from '../src/index.js'

const accounts = [
  { id: 'cash', name: 'Caja ficticia', kind: 'CASH', currency: 'PYG', isActive: true },
  { id: 'transfer', name: 'Cuenta ficticia USD', kind: 'TRANSFER', currency: 'USD', accountNumber: 'DEMO-0001', isActive: true },
]
const deviceProfile = { campos: ['capacidad', 'color'], etiquetas: { modelo: 'Modelo ficticio', capacidad: 'Capacidad', color: 'Color' }, catalogo: { modelos: [
  { nombre: 'Equipo ficticio A', codigo: 'DEMO-A', capacidades: ['128 GB'], colores: ['Azul'] },
  { nombre: 'Equipo ficticio B', codigo: 'DEMO-B', capacidades: ['256 GB'], colores: ['Gris'] },
] } }
const calendarItems = [{ id: 'demo', fecha: '2026-10-02', titulo: 'Revisión ficticia', hora: '10:00', detalle: 'Sin reserva ni evento real' }]
const schema = { tipos: [{ id: 'notas', label: 'Notas ficticias', singular: 'nota ficticia', plural: 'notas ficticias', campos: [{ id: 'nombre', label: 'Título ficticio', tipo: 'texto', obligatorio: true }] }] }
// A single solid pixel fixture, not a photograph or a financial asset.
const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jS1sAAAAASUVORK5CYII='
const fakeToken = 'a'.repeat(64)

function ImageFixture() {
  const container = useRef(null)
  const permitted = useRef(null)
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('Sin imagen local')
  function inject(invalid = false) {
    const bytes = invalid ? new Uint8Array(2048) : Uint8Array.from(atob(pixel.split(',')[1]), character => character.charCodeAt(0))
    const file = new File([bytes], 'pixel-demo.png', { type: 'image/png' })
    permitted.current = file
    const input = container.current.querySelector('input[type="file"]')
    Object.defineProperty(input, 'files', { configurable: true, value: [file] })
    input.dispatchEvent(new Event('change', { bubbles: true }))
    permitted.current = null
  }
  return <div ref={container} className="grid gap-3" onClickCapture={event => { if (event.target.matches('input[type="file"]')) event.preventDefault() }} onDropCapture={event => { event.preventDefault(); event.stopPropagation(); setStatus('Solo se admite el pixel ficticio de esta demo.') }} onChangeCapture={event => { if (event.target.type === 'file' && event.target.files?.[0] !== permitted.current) { event.stopPropagation(); setStatus('Solo se admite el pixel ficticio de esta demo.') } }}>
    <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => inject()}>Elegir pixel ficticio</Button><Button variant="outline" onClick={() => inject(true)}>Probar tamaño inválido</Button></div>
    <SubidaImagen etiqueta="Imagen ficticia local" descripcion="Use los botones del fixture; el selector personal y los drops están bloqueados. No se sube ni guarda nada." valor={image} comprimir={false} tamanoMaximo={1024} subirEtiqueta="Selector personal bloqueado" cambiarEtiqueta="Selector personal bloqueado" onImagen={() => { setImage(pixel); setStatus('Pixel ficticio validado en memoria; sin subida.') }} onLimpiar={() => { setImage(null); setStatus('Imagen ficticia retirada.') }} />
    <p role="status">{status}</p>
  </div>
}
function ToastControls() {
  const toast = useToast()
  const [shown, setShown] = useState(false)
  return <><Button disabled={shown} onClick={() => { toast.info('Aviso ficticio local', 'Cierre manual; sin guardado ni temporizador.', { persistent: true }); setShown(true) }}>Mostrar aviso local</Button><p className="text-xs">Un aviso por escena; cierre con «Cerrar aviso» o reinicie la escena.</p></>
}
function ToastFixture() {
  const [generation, setGeneration] = useState(0)
  return <><Button variant="outline" onClick={() => setGeneration(current => current + 1)}>Reiniciar avisos locales</Button><div className="gallery-toast-scene relative min-h-64 rounded-xl border border-ink-600 p-3" style={{ transform: 'translateZ(0)', contain: 'layout paint' }}><ToastProvider key={generation} demo={false}><ToastControls /></ToastProvider></div></>
}
function AiFixture({ buttonOnly = false }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('Sin análisis ni creación simulada')
  const analyze = async () => { setStatus('Análisis local listo; revise antes de confirmar.'); return { registros: [{ tipo: 'notas', valores: { nombre: 'Nota ficticia para revisar' } }], avisos: ['Simulación determinista; no hay proveedor ni red.'] } }
  const create = async records => { setStatus(`${records.length} notas simuladas confirmadas; ninguna escritura real.`); return { creados: records.length } }
  return <><p className="text-xs text-mute">Proveedor ficticio en memoria: las menciones al servidor/IA del diálogo son parte de su interfaz, no una conexión real.</p>{buttonOnly ? <BotonCargaIA texto="Abrir simulación IA" tooltip="Proveedor ficticio local" onAbrir={() => setOpen(true)} /> : <Button onClick={() => setOpen(true)}>Abrir diálogo IA local</Button>}<DialogoCargaIA abierto={open} onCerrar={() => setOpen(false)} esquema={schema} analizar={analyze} crear={create} enlacePrivacidad="" titulo="Revisión de notas ficticias — sin proveedor real" placeholder="Escriba una nota ficticia; el resultado es un fixture fijo." /><p role="status">{status}</p></>
}
export const SPECIALIZED_DEMOS = {
  BuscadorDispositivo: ({ device, setDevice }) => <><BuscadorDispositivo perfil={deviceProfile} valor={device} onCambio={setDevice} permitirLibre={false} /><p role="status">Modelo local: {device.modelo || 'Sin elegir'} · {device.capacidad || 'Sin capacidad'} · {device.color || 'Sin color'}</p></>,
  Calendario: ({ day, setDay, anchor, setAnchor, empty, setEmpty, setStatus }) => <><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar calendario vacío</Button><Calendario items={empty ? [] : calendarItems} vistas={['mes', 'semana', 'lista']} hoy="2026-10-02" ancla={anchor} onCambiarPeriodo={setAnchor} diaSeleccionado={day} onSeleccionarDia={setDay} onElegirItem={item => setStatus(`Evento local: ${item.titulo}`)} /><p role="status">Día local: {day || 'Sin elegir'}</p></>,
  CodigoQr: ({ empty, setEmpty }) => <><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar QR vacío</Button><CodigoQr valor={empty ? '' : 'OWNCODING-DEMO-ONLY:NOT-A-PAYMENT:001'} ancho={180} alt="QR ficticio local; no es un pago ni enlace" className="max-w-full" /><p className="text-xs">Contenido: OWNCODING-DEMO-ONLY:NOT-A-PAYMENT:001. Generación local con la dependencia opcional qrcode; sin ella no hay imagen.</p></>,
  BotonCargaIA: () => <AiFixture buttonOnly />,
  DialogoCargaIA: () => <AiFixture />,
  PegarEnlaceToken: ({ id, setStatus }) => <><p className="break-all text-xs">Fixture sin validez: https://fixture.invalid/demo/{fakeToken}</p><PegarEnlaceToken id={id} etiqueta="Enlace ficticio (no use enlaces reales)" textoBoton="Extraer código local" onToken={token => setStatus(token === fakeToken ? 'Código ficticio extraído; no se valida ni aplica.' : 'Formato extraído localmente; no se valida ni aplica.')} /></>,
  SelectorCuentaCobro: ({ accountId, setAccountId }) => <><SelectorCuentaCobro cuentas={accounts} cuentaId={accountId} onSelect={account => setAccountId(account?.id || '')} preseleccionar={false} ariaLabel="Cuenta ficticia de cobro" saldoPendientePyg={125000} cotizacionPyg={7500} /><p role="status">Selección local: {accountId || 'Sin cuenta'}; no se procesa ningún cobro.</p></>,
  TarjetaCuentaCobro: ({ accountId, setAccountId }) => <TarjetaCuentaCobro cuenta={accounts.find(account => account.id === accountId) || accounts[0]} saldoPendientePyg={125000} cotizacionPyg={7500} detalle="Cuenta y cotización ficticias; sin transferencia" onCambiar={() => setAccountId(accountId === 'transfer' ? 'cash' : 'transfer')} textoCambiar="Alternar cuenta ficticia" />,
  SubidaImagen: () => <ImageFixture />,
  ToastProvider: () => <ToastFixture />,
}
export function SpecializedPreview({ name }) {
  const id = useId()
  const [device, setDevice] = useState({})
  const [day, setDay] = useState(null)
  const [anchor, setAnchor] = useState('2026-10-02')
  const [empty, setEmpty] = useState(false)
  const [accountId, setAccountId] = useState('')
  const [status, setStatus] = useState('')
  const Demo = SPECIALIZED_DEMOS[name]
  return <div className="grid min-w-0 gap-3" data-demo-export={name} data-demo-family="specialized"><p className="text-xs text-mute">Simulación local: sin solicitudes, persistencia ni operaciones reales.</p><Demo {...{ id, device, setDevice, day, setDay, anchor, setAnchor, empty, setEmpty, accountId, setAccountId, setStatus }} />{status && <p role="status">{status}</p>}</div>
}
