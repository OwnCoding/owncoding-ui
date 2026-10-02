import React, { useState } from 'react'
import {
  AjustesImpresion, BotonImprimir, DocumentoImpresion, VistaPreviaPapel,
  FichaCertificado, ManifiestoEnvio, EtiquetaLote, Button, SegmentedField,
} from '../src/index.js'

const serial = 'DEMO-SERIAL-001'
const printerFixture = { id: 'demo', nombre: 'Impresora ficticia', destino: 'cups:DEMO-NO-DEVICE', ancho: '80', activa: true }
const printStates = [['sin-trabajo', 'Sin trabajo'], ['pendiente', 'Pendiente'], ['impreso', 'Simulado completo'], ['fallido', 'Falla simulada']]

export const DOCUMENT_DEMOS = {
  AjustesImpresion: ({ printers, setPrinters, setStatus }) => <AjustesImpresion impresoras={printers} titulo="Impresoras · simulación" descripcion="Todos los callbacks son locales. No se conecta a LAN, USB, CUPS ni a un agente." onGuardar={printer => { setPrinters([...printers.filter(item => item.id !== printer.id), { ...printer, id: printer.id || `demo-${printers.length + 1}` }]); setStatus('Configuración de muestra actualizada; no guardada.') }} onEliminar={id => { setPrinters(printers.filter(item => item.id !== id)); setStatus('Impresora eliminada solo del fixture.') }} onProbar={() => setStatus('Prueba simulada. No se creó ni envió ningún trabajo.')} onVerificar={() => setStatus('Verificación simulada. Ningún dispositivo fue consultado.')} />,
  BotonImprimir: ({ state, setState, setStatus }) => <><SegmentedField value={state} onChange={setState} options={printStates} ariaLabel="Estado del trabajo ficticio" /><BotonImprimir estado={state === 'sin-trabajo' ? null : state} etiqueta="Simular impresión" onImprimir={() => { setState('impreso'); setStatus('Simulación completa; ningún papel impreso ni trabajo enviado.') }} /></>,
  DocumentoImpresion: ({ empty, setEmpty, setStatus }) => <><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar documento sin detalle</Button><DocumentoImpresion titulo="Documento de muestra" numero="DEMO-001" emisor={{ nombre: 'Emisor ficticio' }} receptor={{ nombre: 'Receptor ficticio' }} detalle={empty ? [] : [{ cantidad: 2, concepto: 'Producto ficticio', unitario: 50000, subtotal: 100000 }]} liquidacion={empty ? null : { subtotal: 100000, total: 100000 }} notas="Fixture sin validez comercial ni fiscal." etiquetaImprimir="Simular impresión" onImprimir={() => setStatus('Impresión simulada; no se abre el diálogo del sistema.')} /></>,
  VistaPreviaPapel: ({ empty, setEmpty, format, setFormat }) => <><SegmentedField options={[[ 'thermal-80', '80 mm' ], ['thermal-58', '58 mm' ], ['a4', 'A4']]} value={format} onChange={setFormat} ariaLabel="Formato del papel de muestra" /><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar contenido</Button><VistaPreviaPapel formato={format} titulo="Papel de muestra aislado" alto="h-80" sandbox="" referrerPolicy="no-referrer" contenido={`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px system-ui;padding:16px;color:#111;background:#fff}p{overflow-wrap:anywhere}</style><h1>Documento ficticio</h1><p>${empty ? 'Sin detalle' : '2 unidades de muestra · 100.000 Gs'}</p><p>Sin impresión ni scripts.</p></html>`} /></>,
  FichaCertificado: ({ empty, setEmpty }) => <><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar diagnóstico pendiente</Button><FichaCertificado empresa="Laboratorio ficticio" modelo="Equipo Demo" imei={serial} grado={empty ? null : 'A'} bateria={empty ? null : 95} aprobados={empty ? 0 : 4} total={4} estado={empty ? 'pendiente' : 'pass'} verificadoPor="Persona Demo" verificadoAt="2026-10-02T12:00:00Z" condicion="Fixture; no certificado real" /></>,
  ManifiestoEnvio: ({ empty, setEmpty }) => <><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar manifiesto vacío</Button><ManifiestoEnvio codigo="DEMO-ENV-001" origen="Depósito ficticio A" destino="Depósito ficticio B" responsable="Persona Demo" lineas={empty ? [] : [{ id: 'demo', producto: 'Equipo de muestra', capacidad: '128 GB', cantidad: 2, imeis: [serial], pendientes: 1 }]} notas="Simulación local; no despacho, envío ni documento real." /></>,
  EtiquetaLote: ({ empty, setEmpty }) => <><Button variant="outline" onClick={() => setEmpty(!empty)}>Alternar serial pendiente</Button><EtiquetaLote codigo="DEMO-ENV-001" numero={1} total={2} producto="Equipo de muestra" variante="128 GB · Demo" serial={empty ? null : serial} pendienteImei={empty} destino="Depósito ficticio" nota="Sin validez operativa; no imprimir." /></>,
}

export function DocumentPreview({ name }) {
  const [printers, setPrinters] = useState([printerFixture])
  const [state, setState] = useState('sin-trabajo')
  const [empty, setEmpty] = useState(false)
  const [format, setFormat] = useState('thermal-80')
  const [status, setStatus] = useState('Fixture local: sin envío, impresión real, solicitudes ni persistencia.')
  const Demo = DOCUMENT_DEMOS[name]
  return Demo ? <div data-demo-family="document" data-demo-export={name} className="space-y-4"><p className="rounded-xl border border-warn/30 bg-warn/5 p-3 text-sm text-warn-text">Simulación de documentos e impresión. No se utiliza ningún dispositivo ni agente.</p><Demo {...{ printers, setPrinters, state, setState, empty, setEmpty, format, setFormat, setStatus }} /><p role="status" className="text-xs text-mute">{status}</p></div> : null
}
