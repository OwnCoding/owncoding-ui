import React, { useId, useState } from 'react'
import {
  CampoSeriales, CurrencySelect, BotonDentroCampo, ConsentimientoDatos,
  AvisoPrivacidad, FilaChecklist, FilaRevision, ImporteDelta, MedidorBateria,
  IndicadorConexion, SemaforoItem, SerialTexto, PasosEquipo, ChipFusion,
  ChipsLocks, ContadoresCompra, BarraLote, ColumnaLote, Button, Input, Label,
  SegmentedField, Nota,
} from '../src/index.js'

const serial = 'DEMO-SERIAL-001'
const states = [['sinVerificar', 'Sin verificar'], ['ok', 'Bien'], ['aviso', 'Observación'], ['falla', 'Falla']]
function Toggle({ label, checked, onChange }) {
  return <Button variant="outline" onClick={() => onChange(!checked)}>{label}</Button>
}
function ReviewState({ state, setState }) {
  return <SegmentedField options={states} value={state} onChange={setState} ariaLabel="Resultado del fixture" />
}

export const REVIEW_DEMOS = {
  CampoSeriales: ({ setStatus }) => <CampoSeriales valor={['DEMO-A', 'DEMO-B']} limite={4} ayuda="Seriales ficticios; incluye líneas duplicadas. No se carga ni consulta un equipo." onCambio={(list, result) => setStatus(`${list.length} seriales únicos locales; ${result.repetidos.length} duplicados.`)} />,
  CurrencySelect: ({ id, currency, setCurrency }) => <><Label htmlFor={id}>Moneda del fixture</Label><CurrencySelect id={id} value={currency} onChange={event => setCurrency(event.target.value)} /><p className="text-sm">Moneda local: {currency}. No convierte ni consulta cotizaciones.</p></>,
  BotonDentroCampo: ({ id, value, setValue, setStatus }) => <div><Label htmlFor={id}>Referencia ficticia</Label><div className="relative"><Input id={id} value={value} onChange={event => setValue(event.target.value)} className="pr-12" /><BotonDentroCampo etiqueta="Consultar fixture local" onClick={() => setStatus(value ? `Referencia local: ${value}` : 'Referencia de muestra requerida.')} /></div></div>,
  ConsentimientoDatos: ({ checked, setChecked }) => <><ConsentimientoDatos checked={checked} onChange={event => setChecked(event.target.checked)} finalidad="Acepto probar este fixture local" detalle="No se recopilan ni envían datos. No constituye consentimiento para un servicio real." version="DEMO" /><p role="status" className="text-sm">{checked ? 'Aceptación local de muestra' : 'Muestra sin aceptar'}</p></>,
  AvisoPrivacidad: ({ expanded, setExpanded }) => <><Toggle label="Alternar detalle de privacidad" checked={expanded} onChange={setExpanded} /><AvisoPrivacidad finalidad="Información de muestra; sin recopilación" detalle={expanded ? 'Los controles funcionan en memoria. Ningún dato se transmite o conserva.' : 'Este texto es un fixture, no una política legal.'} /></>,
  FilaChecklist: props => <><ReviewState {...props} /><FilaChecklist etiqueta="Pantalla del equipo ficticio" estado={props.state} nota="Resultado local seleccionado, no diagnóstico real." /></>,
  FilaRevision: props => <><ReviewState {...props} /><FilaRevision etiqueta="Equipo de muestra" serial={serial} estado={{ sinVerificar: 'pendiente', ok: 'ok', aviso: 'incorrecto', falla: 'danado' }[props.state]} detalle="Revisión simulada" /></>,
  ImporteDelta: ({ expanded, setExpanded, currency, setCurrency, id }) => <><Label htmlFor={id}>Moneda del delta ficticio</Label><CurrencySelect id={id} value={currency} onChange={event => setCurrency(event.target.value)} /><ImporteDelta valor={expanded ? -12500 : 12500} moneda={currency} /><Toggle label="Alternar signo del delta" checked={expanded} onChange={setExpanded} /></>,
  MedidorBateria: ({ empty, setEmpty, level, setLevel, id }) => <><Label htmlFor={id}>Batería ficticia: {level}%</Label><input id={id} type="range" min="0" max="100" value={level} onChange={event => setLevel(Number(event.target.value))} className="w-full" /><MedidorBateria porcentaje={empty ? null : level} ciclos={200} /><Toggle label="Alternar sin medición" checked={empty} onChange={setEmpty} /></>,
  IndicadorConexion: ({ expanded, setExpanded, count, setCount, setStatus }) => <><Toggle label="Alternar conexión simulada" checked={expanded} onChange={setExpanded} /><IndicadorConexion enLinea={!expanded} pendientes={count} variante="banner" onSincronizar={() => { setCount(0); setStatus('Pendientes retirados del fixture; nada sincronizado con un servidor.') }} /><Button variant="outline" onClick={() => setCount(2)}>Restaurar pendientes locales</Button></>,
  SemaforoItem: props => <><ReviewState {...props} /><SemaforoItem como="div" etiqueta="Verificación de muestra" estado={props.state} detalle="El color acompaña una etiqueta textual." /></>,
  SerialTexto: ({ expanded, setExpanded }) => <><SerialTexto serial={serial} enmascarar={expanded} /><Toggle label="Alternar serial enmascarado" checked={expanded} onChange={setExpanded} /></>,
  PasosEquipo: ({ count, setCount }) => <><PasosEquipo pasos={['Ingreso', 'Revisión', 'Resultado']} actual={count % 3} /><Button variant="outline" onClick={() => setCount((count + 1) % 3)}>Avanzar revisión local</Button></>,
  ChipFusion: ({ setStatus }) => <ChipFusion principal="Ficha Demo principal" fusionadoEl="2026-10-02" por="Persona Demo" texto="Relación ficticia con" onAbrirPrincipal={() => setStatus('Principal de muestra seleccionada; no se fusionó ninguna ficha.')} />,
  ChipsLocks: ({ expanded, setExpanded }) => <><ChipsLocks locks={[{ clave: 'icloud', estado: expanded ? 'activo' : 'libre' }, { clave: 'mdm', estado: 'desconocido' }]} conEstado /><Toggle label="Alternar lock ficticio" checked={expanded} onChange={setExpanded} /></>,
  ContadoresCompra: ({ count, setCount }) => <><ContadoresCompra pendiente={4 - count} comprado={count} faltan={4 - count} variante="chips" /><Button variant="outline" onClick={() => setCount((count + 1) % 5)}>Avanzar compra simulada</Button></>,
  BarraLote: ({ count, setCount, setStatus }) => <><Button variant="outline" onClick={() => setCount(2)}>Seleccionar dos fixtures</Button><BarraLote cantidad={count} onLimpiar={() => setCount(0)}><Button variant="outline" onClick={() => setStatus(`${count} fixtures revisados localmente.`)}>Revisar selección local</Button></BarraLote>{count === 0 && <Nota tono="info">Sin fixtures seleccionados.</Nota>}</>,
  ColumnaLote: ({ empty, setEmpty }) => <><Toggle label="Alternar columna vacía" checked={empty} onChange={setEmpty} /><ColumnaLote etiqueta="Revisión local" contador={empty ? 0 : 1} vacio="Sin fixtures en esta columna">{empty ? null : <FilaRevision etiqueta="Equipo Demo" serial={serial} estado="pendiente" />}</ColumnaLote></>,
}

export function ReviewPreview({ name }) {
  const id = useId()
  const [value, setValue] = useState('')
  const [currency, setCurrency] = useState('PYG')
  const [state, setState] = useState('sinVerificar')
  const [checked, setChecked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [level, setLevel] = useState(95)
  const [count, setCount] = useState(2)
  const [status, setStatus] = useState('Fixture local: sin diagnóstico real, solicitudes ni persistencia.')
  const Demo = REVIEW_DEMOS[name]
  return Demo ? <div data-demo-family="review" data-demo-export={name} className="space-y-4"><Demo {...{ id, value, setValue, currency, setCurrency, state, setState, checked, setChecked, expanded, setExpanded, empty, setEmpty, level, setLevel, count, setCount, setStatus }} /><p role="status" className="text-xs text-mute">{status}</p></div> : null
}
