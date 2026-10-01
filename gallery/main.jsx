import React, { Component, useDeferredValue, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import packageJson from '../package.json'
import '../src/styles/tokens.css'
import '../src/styles/base.css'
import './styles.css'

import {
  Aviso,
  Badge,
  BancoLogo,
  Button,
  Card,
  CargaIA,
  Checkbox,
  Dot,
  EmptyState,
  ErrorState,
  Input,
  MedioPagoLogo,
  Money,
  PercentField,
  PhoneField,
  ProductFooter,
  ProductPrefooter,
  SearchField,
  Select,
  Skeleton,
  Stat,
  Switch,
  Textarea,
  ThemeToggle,
  crearIdentidadApp,
} from '../src/index.js'
import { CATALOGO_EXPORTS, CATEGORIAS_CATALOGO } from './catalog.js'

const METRICAS_CATALOGO = Object.freeze({
  total: CATALOGO_EXPORTS.length,
  visuales: CATALOGO_EXPORTS.filter((item) => item.tipo === 'visual').length,
  api: CATALOGO_EXPORTS.filter((item) => item.tipo === 'api').length,
  curadas: CATALOGO_EXPORTS.filter((item) => item.presentacion).length,
  categorias: CATEGORIAS_CATALOGO.length,
})

const IDENTIDAD = crearIdentidadApp({
  nombre: 'OwnCoding UI',
  version: packageJson.version,
  url: 'https://github.com/dariodeoli/owncoding-ui',
})

const ESQUEMA_IA_DEMO = {
  tipos: [{
    id: 'contactos',
    label: 'Contactos',
    singular: 'contacto',
    plural: 'contactos',
    campos: [
      { id: 'nombre', label: 'Nombre', tipo: 'texto', obligatorio: true },
      { id: 'telefono', label: 'Teléfono', tipo: 'texto' },
    ],
  }],
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return <ErrorState compact title="La vista no pudo renderizarse" description="El catálogo sigue disponible. Revisá el contrato del componente." />
    }
    return this.props.children
  }
}

function Presentacion({ id }) {
  const [activo, setActivo] = useState(true)
  const [porcentaje, setPorcentaje] = useState('18')
  const [telefono, setTelefono] = useState('981 123 456')
  const [pais, setPais] = useState('PY')

  switch (id) {
    case 'acciones':
      return <div className="flex flex-wrap gap-2"><Button>Primaria</Button><Button variant="outline">Secundaria</Button><Button variant="danger">Eliminar</Button></div>
    case 'campos':
      return <div className="grid gap-3"><Input aria-label="Nombre" defaultValue="Operación demo" /><Select aria-label="Estado" defaultValue="activo"><option value="activo">Activo</option><option value="pausado">Pausado</option></Select><Textarea aria-label="Nota" defaultValue="Información de ejemplo" /></div>
    case 'datos':
      return <div className="grid gap-3"><div className="flex flex-wrap items-center gap-2"><Badge color="green">Operativo</Badge><Badge color="orange">Pendiente</Badge><Dot color="green" pulse /><Money value={1250000} /></div><Stat label="Componentes" valor={METRICAS_CATALOGO.visuales} delta={12.5} sub="visuales" /></div>
    case 'estados':
      return <div className="grid gap-3"><Aviso tono="info">Estado informativo con acción clara.</Aviso><Skeleton className="h-10 w-full" /><EmptyState compact title="Sin resultados" description="Probá con otro término." /></div>
    case 'seleccion':
      return <div className="grid gap-2"><Checkbox checked={activo} onChange={(event) => setActivo(event.target.checked)} label="Recibir avisos" /><label className="flex min-h-11 items-center justify-between gap-4 text-sm"><span>Modo operativo</span><Switch checked={activo} onChange={(event) => setActivo(event.target.checked)} ariaLabel="Modo operativo" /></label><PercentField value={porcentaje} onChange={setPorcentaje} /></div>
    case 'bancos':
      return <div className="grid gap-3"><p className="text-xs leading-5 text-mute">Fallbacks tipográficos: no se distribuyen logos de terceros sin autorización auditable.</p><div className="flex min-h-12 items-center rounded-xl border border-ink-600 bg-ink-800 px-3"><BancoLogo banco="ueno bank" /></div><div className="grid grid-cols-3 gap-2"><div className="grid min-h-14 place-items-center rounded-xl border border-ink-600"><BancoLogo banco="Itaú" variante="compacto" /></div><div className="grid min-h-14 place-items-center rounded-xl border border-ink-600"><BancoLogo banco="Banco Continental" variante="compacto" /></div><div className="grid min-h-14 place-items-center rounded-xl border border-ink-600"><BancoLogo banco="Sudameris" variante="compacto" /></div></div></div>
    case 'pagos':
      return <div className="grid gap-3"><p className="text-xs leading-5 text-mute">Marcas identificadas por texto o monograma; bytes externos bloqueados por defecto.</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{['Visa', 'Mastercard', 'Bancard', 'Dinelco', 'upay', 'uPOS'].map((marca) => <div key={marca} className="grid min-h-14 place-items-center rounded-xl border border-ink-600 bg-ink-800 p-2"><MedioPagoLogo marca={marca} /></div>)}</div></div>
    case 'telefono':
      return <PhoneField country={pais} phone={telefono} onCountryChange={setPais} onChange={setTelefono} onInternationalChange={() => {}} />
    case 'footer':
      return <ProductFooter identidad={IDENTIDAD} modelo="apilado" enlaces={[{ href: '/status.json', etiqueta: 'Estado' }]} anio={2026} />
    case 'prefooter':
      return <ProductPrefooter className="rounded-2xl" modelo="completo" titulo="Construí con una base común" descripcion="Componentes, identidad y contratos verificables." columnas={[{ titulo: 'Recursos', enlaces: [{ href: '#catalogo', etiqueta: 'Catálogo' }] }]} accion={{ titulo: '¿Necesitás integrar?', enlace: { href: '#catalogo', etiqueta: 'Explorar objetos' } }} />
    case 'ia':
      return <div className="grid gap-3"><p className="text-xs leading-5 text-mute">Fixture local: analiza y confirma sin red ni persistencia.</p><CargaIA esquema={ESQUEMA_IA_DEMO} consultarConfig={async () => ({ configurada: true, modelo: 'demo', tipos: ['contactos'] })} analizar={async () => ({ registros: [{ tipo: 'contactos', incluido: true, valores: { nombre: 'Ana Demo', telefono: '0981 123 456' } }], avisos: [] })} crear={async (registros) => ({ creados: registros.length, errores: [] })} /></div>
    default:
      return null
  }
}

function Ficha({ item, onAbrir }) {
  return (
    <article className="gallery-card min-w-0 rounded-2xl border border-ink-600 bg-ink p-4 shadow-card">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-fono-dark dark:text-fono-light">{item.categoria}</p>
          <h3 className="mt-1 break-words text-base font-bold text-fore">{item.nombre}</h3>
        </div>
        <Badge color={item.tipo === 'visual' ? 'green' : 'slate'}>{item.tipo === 'visual' ? 'Visual' : 'API'}</Badge>
      </div>
      {item.presentacion ? <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-ink-600 bg-ink-800 p-3"><ErrorBoundary><Presentacion id={item.presentacion} /></ErrorBoundary></div> : null}
      <button type="button" onClick={() => onAbrir(item)} className="mt-4 inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-fono-dark underline-offset-4 hover:underline dark:text-fono-light">Ver ficha del export</button>
    </article>
  )
}

function App() {
  const [consulta, setConsulta] = useState('')
  const consultaDiferida = useDeferredValue(consulta)
  const [categoria, setCategoria] = useState('Todas')
  const [tipo, setTipo] = useState('visual')
  const [seleccionado, setSeleccionado] = useState(null)
  const [limite, setLimite] = useState(60)

  const resultados = useMemo(() => {
    const termino = consultaDiferida.trim().toLocaleLowerCase('es')
    return CATALOGO_EXPORTS.filter((item) => {
      if (tipo !== 'todos' && item.tipo !== tipo) return false
      if (categoria !== 'Todas' && item.categoria !== categoria) return false
      return !termino || `${item.nombre} ${item.categoria} ${item.tipo}`.toLocaleLowerCase('es').includes(termino)
    })
  }, [categoria, consultaDiferida, tipo])

  const { api, visuales } = METRICAS_CATALOGO

  function abrirFicha(item) {
    setSeleccionado(item)
    requestAnimationFrame(() => document.querySelector('#ficha-export')?.focus())
  }

  return (
    <div className="min-h-dvh bg-paper text-fore">
      <header className="border-b border-fore/10 bg-ink/95 px-4 py-5 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-fono-dark dark:text-fono-light">OwnCoding ecosystem</p>
            <p className="mt-1 text-lg font-bold">UI Gallery <span className="font-normal text-mute">{IDENTIDAD.etiquetaVersion}</span></p>
          </div>
          <nav aria-label="Acciones de la galería" className="flex items-center gap-2">
            <a className="toque-44 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-fono-dark hover:underline dark:text-fono-light" href="/status.json">Estado</a>
            <ThemeToggle clave="owncoding-gallery-theme" />
          </nav>
        </div>
      </header>

      <main id="contenido" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <section className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.52fr)]">
          <div>
            <Badge color="green">Catálogo verificable</Badge>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-fore sm:text-5xl">Una vista para encontrar cada objeto de OwnCoding UI.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-mute">Explorá componentes, estados, marcas financieras y API pura. Las vistas vivas usan fixtures controlados; ningún export arbitrario se ejecuta.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Total" valor={METRICAS_CATALOGO.total} />
            <Stat label="Visuales" valor={visuales} tono="ok" />
            <Stat label="API" valor={api} tono="info" />
          </div>
        </section>

        <section aria-label="Controles del catálogo" className="sticky top-0 z-20 -mx-4 mt-10 border-y border-fore/10 bg-paper/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center">
            <SearchField className="min-w-0 flex-1" value={consulta} onChange={(event) => { setConsulta(event.target.value); setLimite(60) }} placeholder="Buscar componente o API" />
            <div className="flex flex-wrap gap-2" aria-label="Tipo de export">
              {[['visual', 'Visuales'], ['api', 'API'], ['todos', 'Todos']].map(([valor, etiqueta]) => <button key={valor} type="button" aria-pressed={tipo === valor} onClick={() => { setTipo(valor); setLimite(60) }} className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${tipo === valor ? 'border-fono bg-fono/15 text-fono-text' : 'border-interactivo bg-ink text-mute hover:text-fore'}`}>{etiqueta}</button>)}
            </div>
          </div>
          <div className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1" aria-label="Categorías">
            {['Todas', ...CATEGORIAS_CATALOGO].map((item) => <button key={item} type="button" aria-pressed={categoria === item} onClick={() => { setCategoria(item); setLimite(60) }} className={`min-h-11 shrink-0 rounded-xl border px-3 text-sm font-medium ${categoria === item ? 'border-fono bg-fono/15 text-fono-text' : 'border-interactivo bg-ink text-mute hover:text-fore'}`}>{item}</button>)}
          </div>
        </section>

        {seleccionado ? (
          <section id="ficha-export" tabIndex="-1" aria-live="polite" className="mt-6 rounded-2xl border border-fono/30 bg-fono/10 p-5 outline-none">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-fono-text">Ficha seleccionada</p><h2 className="mt-1 text-xl font-bold">{seleccionado.nombre}</h2><p className="mt-2 text-sm text-mute">{seleccionado.categoria} · {seleccionado.tipo === 'visual' ? 'export visual disponible en la entrada raíz' : 'API documentada sin render visual'}.</p></div><button type="button" className="min-h-11 rounded-lg px-3 text-sm font-semibold text-fono-dark hover:underline dark:text-fono-light" onClick={() => setSeleccionado(null)}>Cerrar ficha</button></div>
          </section>
        ) : null}

        <section id="catalogo" aria-labelledby="titulo-catalogo" className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 id="titulo-catalogo" className="text-2xl font-bold">Catálogo</h2><p className="text-sm text-mute" role="status">{resultados.length} resultados</p></div>
          {resultados.length > 0 ? (
            <><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{resultados.slice(0, limite).map((item) => <Ficha key={item.nombre} item={item} onAbrir={abrirFicha} />)}</div>{resultados.length > limite ? <div className="mt-6 text-center"><Button variant="outline" onClick={() => setLimite((actual) => actual + 60)}>Mostrar más exports</Button></div> : null}</>
          ) : <div className="mt-5"><EmptyState title="No encontramos ese export" description="Probá otra palabra o cambiá los filtros." action={<Button variant="outline" onClick={() => { setConsulta(''); setCategoria('Todas'); setTipo('visual'); setLimite(60) }}>Limpiar filtros</Button>} /></div>}
        </section>
      </main>

      <ProductPrefooter modelo="completo" titulo="Adopción sin copias locales" descripcion="Usá el export compartido y extendé su contrato por props." columnas={[{ titulo: 'Biblioteca', enlaces: [{ href: '#catalogo', etiqueta: 'Todos los exports' }, { href: '/status.json', etiqueta: 'Estado del build' }] }, { titulo: 'Calidad', enlaces: [{ href: '#contenido', etiqueta: 'Volver arriba' }] }]} accion={{ titulo: 'Estado verificable', descripcion: `${visuales} exports visuales y ${api} exports de API catalogados.`, enlace: { href: '/status.json', etiqueta: 'Abrir status.json' } }} />
      <ProductFooter identidad={IDENTIDAD} modelo="distribuido" enlaces={[{ href: '/status.json', etiqueta: 'Estado' }]} />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
