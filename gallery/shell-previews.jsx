import React, { useState } from 'react'
import {
  AuthLayout, AyudaModulo, BarraInferior, CampanaAvisos, GoogleButton, GoogleMark,
  LoadingScreen, MenuDesplegable, NavegacionSeccion, NavLateral, OAuthDivider,
  PaletaComandos, Avatar, PersonaChip, PilaPersonas, Button, Card, Nota,
} from '../src/index.js'

const sections = [
  { id: 'resumen', label: 'Resumen', etiqueta: 'Resumen', icono: 'home', descripcion: 'Estado del espacio de muestra.' },
  { id: 'actividad', label: 'Actividad', etiqueta: 'Actividad', icono: 'clock', descripcion: 'Movimientos ficticios sin conexión.' },
]
const people = ['Persona Demo A', 'Persona Demo B', 'Persona Demo C'].map((name, index) => ({ id: index, name, estado: 'en-linea' }))

export const SHELL_DEMOS = {
  AuthLayout: ({ setStatus }) => <AuthLayout className="gallery-auth-scene" aside={<p>Espacio de muestra</p>} pie={<p className="p-3 text-center text-xs text-mute">Sin sesión ni proveedor</p>}><Card className="space-y-4 p-5"><h4 className="font-bold">Acceso de muestra</h4><p className="text-sm text-mute">Escena acotada del layout real. No se inicia una sesión.</p><GoogleButton onClick={() => setStatus('Acceso simulado; no autenticado.')} /><OAuthDivider texto="o explorá sin sesión" /><Button onClick={() => setStatus('Exploración local seleccionada.')}>Explorar muestra</Button></Card></AuthLayout>,
  AyudaModulo: () => <AyudaModulo titulo="Operaciones de muestra" resumen="Este espacio funciona solo con datos locales." puntos={['Los cambios no se guardan.', 'No se llama a servicios externos.', 'Escape cierra la ayuda.']} />,
  BarraInferior: ({ active, setActive, expanded, setExpanded }) => <div className="gallery-mobile-scene"><Card className="p-4"><h4 className="font-bold">{sections.find(item => item.id === active)?.label}</h4><p className="text-sm text-mute">Navegación móvil simulada</p>{expanded && <Nota tono="info">Más módulos: solo muestra local.</Nota>}</Card><BarraInferior className="gallery-bottom-nav" items={sections} activo={active} onSelect={setActive} onMas={() => setExpanded(!expanded)} menuAbierto={expanded} ariaLabel="Navegación móvil de muestra" /></div>,
  CampanaAvisos: ({ empty, setEmpty, notices, setNotices, setStatus }) => <div className="space-y-3"><Button variant="outline" onClick={() => setEmpty(!empty)}>{empty ? 'Restaurar avisos' : 'Mostrar bandeja vacía'}</Button><div className="flex justify-end"><CampanaAvisos avisos={empty ? [] : notices} onElegir={notice => { setNotices(notices.map(item => item.id === notice.id ? { ...item, leido: true } : item)); setStatus(`Leído localmente: ${notice.titulo}`) }} vacioDetalle="No hay avisos en este fixture." /></div></div>,
  GoogleButton: ({ expanded, setExpanded, setStatus }) => <div className="space-y-3"><GoogleButton busy={expanded} etiquetaBusy="Estado ocupado simulado" onClick={() => setStatus('Clic local; no autenticación OAuth.')} /><Button variant="outline" onClick={() => setExpanded(!expanded)}>Alternar ocupado</Button></div>,
  GoogleMark: () => <div className="flex items-center gap-3"><GoogleMark /><span className="text-sm">Marca del export; no conexión OAuth</span></div>,
  LoadingScreen: () => <LoadingScreen className="gallery-loading-scene" mensaje="Carga simulada" tienda={{ nombre: 'Espacio Demo' }} etiqueta="Fixture" />,
  MenuDesplegable: ({ setStatus }) => <MenuDesplegable alineacion="left" trigger={<span className="rounded-lg border border-ink-600 px-3 py-2">Acciones de muestra</span>} items={[{ label: 'Ver detalle local', icono: 'eye', onClick: () => setStatus('Detalle local seleccionado.') }, { label: 'Duplicar fixture', icono: 'copy', onClick: () => setStatus('Duplicación simulada; sin persistencia.') }, { separador: true }, { label: 'Acción no disponible', disabled: true }]} />,
  NavegacionSeccion: ({ active, setActive, expanded, setExpanded }) => <NavegacionSeccion items={sections} value={active} onChange={setActive} colapsado={expanded} onToggle={setExpanded}><Card className="p-4">Contenido de {active}; fixture local.</Card></NavegacionSeccion>,
  NavLateral: ({ active, setActive, expanded, setExpanded }) => <div className="flex min-w-0 gap-3"><NavLateral className="gallery-side-scene" ancho="w-44" items={sections} activeId={active} onSelect={setActive} colapsado={expanded} onToggle={setExpanded} cabecera={!expanded && <span className="text-xs font-bold">Espacio Demo</span>} /><p className="min-w-0 py-4 text-sm text-mute">Sección local: {active}</p></div>,
  OAuthDivider: () => <OAuthDivider texto="o continuar con otro método" />,
  PaletaComandos: ({ setStatus }) => <PaletaComandos boton conAtajo={false} mostrarAtajoEnBoton={false} titulo="Buscar en la muestra" placeholder="Buscar resumen o actividad" espera={0} buscar={query => sections.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).map(item => ({ id: item.id, tipo: 'modulo', titulo: item.label, detalle: 'Resultado local ficticio' }))} onElegir={item => setStatus(`Resultado local: ${item.titulo}`)} />,
  Avatar: ({ expanded, setExpanded }) => <div className="flex items-center gap-4"><Avatar nombre="Persona Demo" tamano="lg" empresa={expanded} /><Button variant="outline" onClick={() => setExpanded(!expanded)}>Alternar persona / empresa</Button></div>,
  PersonaChip: ({ expanded, setExpanded }) => <div className="space-y-3"><PersonaChip user={people[0]} estado={expanded ? 'ausente' : 'en-linea'} /><Button variant="outline" onClick={() => setExpanded(!expanded)}>Alternar presencia</Button></div>,
  PilaPersonas: ({ setStatus }) => <PilaPersonas personas={people} max={2} onMas={() => setStatus('Equipo ficticio: Persona Demo A, Persona Demo B y Persona Demo C.')} />,
}

export function ShellPreview({ name }) {
  const [active, setActive] = useState('resumen')
  const [expanded, setExpanded] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [status, setStatus] = useState('Simulación local; sin solicitudes ni persistencia.')
  const [notices, setNotices] = useState([{ id: 'demo', titulo: 'Operación Demo lista', detalle: 'Aviso ficticio para probar la bandeja.', leido: false, tono: 'info' }])
  const Demo = SHELL_DEMOS[name]
  return Demo ? <div data-demo-family="shell" data-demo-export={name} className="space-y-4"><Demo {...{ active, setActive, expanded, setExpanded, empty, setEmpty, notices, setNotices, setStatus }} /><p role="status" className="text-xs text-mute">{status}</p></div> : null
}
