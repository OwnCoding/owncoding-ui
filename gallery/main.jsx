import React, { Component, useDeferredValue, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import packageJson from '../package.json'
import { galleryStateUrl, useGalleryUrlState } from './url-state.js'
import { OwnDataIntegrationPreview } from './owndata-ruc-preview.jsx'
import { BLOG_POSTS, articlePath } from './blog/metadata.js'
import '../src/styles/tokens.css'
import '../src/styles/base.css'
import './styles.css'
import './identity.css'
import './previews.css'

import {
  Aviso,
  Badge,
  BancoCombobox,
  BancoLogo,
  BuscadorCliente,
  Button,
  CargaIA,
  Card,
  Checkbox,
  CityAutocomplete,
  Dot,
  EmailField,
  EmptyState,
  ErrorState,
  Input,
  Label,
  MedioPagoLogo,
  Money,
  MoneyInput,
  PercentField,
  PhoneField,
  ProductFooter,
  ProductPrefooter,
  RangoFecha,
  RucField,
  SearchField,
  Select,
  SerialField,
  Skeleton,
  Stat,
  Switch,
  Textarea,
  ThemeToggle,
  crearIdentidadApp,
  departamentoDe,
  logoDeBanco,
  logoDeMedioPago,
  relacionFinancieraDe,
  telefonoE164,
  telefonoInternacionalValido,
} from '../src/index.js'
import { ComponentPreview, EmailPreview } from './component-previews.jsx'
import { CATALOGO_EXPORTS, CATEGORIAS_CATALOGO, DESTACADOS_CATALOGO } from './catalog.js'
import { COMPACT_SCENES, galleryCardIsWide, galleryEntryTier, hasInlineGalleryPreview, orderGalleryEntries } from './catalog-order.js'
import {
  BANCO_DESTACADO,
  BANCOS_PREVIEW,
  MARCAS_CONECTADAS_PREVIEW,
  MARCAS_PAGO_RESTO_PREVIEW,
  SOLUCIONES_PAGO_COMERCIOS_PREVIEW,
  bankReviewSize,
} from './financial-fixtures.js'

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

const CLIENTES_DEMO = Object.freeze([
  {
    id: 'cliente-demo-1',
    name: 'Cliente Demo S.A.',
    document: '80012345-6',
    phone: '+595 981 123 456',
    email: 'demo@ejemplo.com.py',
    tags: ['fixture', 'mayorista'],
  },
  {
    id: 'cliente-demo-2',
    name: 'Ana Ejemplo',
    document: '4567890',
    phone: '+595 971 555 010',
    email: 'ana@ejemplo.com.py',
    tags: ['fixture', 'persona'],
  },
])

export const RUC_FIXTURES_DEMO = Object.freeze([
  Object.freeze({
    ruc: '80012345-6',
    name: 'Comercial Horizonte Demo S.A.',
    phone: '+595 981 000 101',
    email: 'facturacion@horizonte-demo.test',
  }),
  Object.freeze({
    ruc: '80054321-2',
    name: 'Distribuidora Guaraní Demo S.R.L.',
    phone: '+595 971 000 202',
    email: 'administracion@guarani-demo.test',
  }),
  Object.freeze({
    ruc: '80123456-7',
    name: 'Servicios Ñandutí Demo E.A.S.',
    phone: '+595 991 000 303',
    email: 'clientes@nanduti-demo.test',
  }),
])

export async function consultarRucDemo(valor) {
  const ruc = String(valor ?? '').trim()
  const exacto = RUC_FIXTURES_DEMO.find((fixture) => fixture.ruc === ruc)
  const indiceDeterminista = [...ruc].reduce((total, caracter) => total + (Number(caracter) || 0), 0) % RUC_FIXTURES_DEMO.length
  const fixture = exacto || RUC_FIXTURES_DEMO[indiceDeterminista]
  return { ...fixture, fullRuc: ruc, simulado: true }
}

const MARCAS_PAGO_DEMO = MARCAS_PAGO_RESTO_PREVIEW

const ETIQUETA_ESTADO_MARCA = Object.freeze({
  verificado: 'Verificado',
  oficial: 'Oficial',
  parcial: 'Parcial',
  fallback: 'Fallback neutral',
  'permiso-pendiente': 'Permiso pendiente',
  'asset-bloqueado': 'Asset pendiente',
  'producto-padre': 'Marca padre',
  legado: 'Legado',
})

function etiquetaEstadoMarca(estado) {
  return ETIQUETA_ESTADO_MARCA[estado] || 'Fallback neutral'
}

function tonoEstadoMarca(estado) {
  if (estado === 'verificado' || estado === 'oficial') return 'green'
  if (estado === 'permiso-pendiente' || estado === 'parcial') return 'orange'
  return 'slate'
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

function EtiquetaFixture({ children = 'Fixture local' }) {
  return <span className="fixture-label">{children}</span>
}

function VistaVarianteBanco({ nombre, variante }) {
  const registro = logoDeBanco(nombre, variante)
  const disponible = Boolean(registro?.visual?.empaquetado)
  const contenida = ['horizontal-contained', 'marca-contained'].includes(registro?.visual?.tipo)
  const etiqueta = contenida ? 'Marca contenida' : variante === 'compacto' ? 'Logo compacto' : 'Logo horizontal'

  return (
    <div className={`bank-variant bank-variant--${variante}`}>
      <span className="bank-variant__label">{etiqueta}</span>
      <div
        className="bank-variant__surface"
        data-bank-review-size={bankReviewSize(nombre, variante)}
        style={registro?.visual?.fondo ? { backgroundColor: registro.visual.fondo } : undefined}
      >
        {disponible ? (
          <BancoLogo banco={nombre} variante={variante} alto={bankReviewSize(nombre, variante)} />
        ) : (
          <span className="bank-variant__pending" role="status">Sin asset redistribuible</span>
        )}
      </div>
      <span className={`bank-variant__state${disponible ? '' : ' bank-variant__state--pending'}`}>
        {disponible ? 'Asset disponible' : etiquetaEstadoMarca(registro?.visual?.estado)}
      </span>
    </div>
  )
}

function TarjetaBancoRevision({ nombre, seleccionado, onSelect }) {
  const registro = logoDeBanco(nombre, 'horizontal')

  return (
    <article className="bank-review-card" aria-current={seleccionado ? 'true' : undefined}>
      <header className="bank-review-card__header">
        <div>
          <h5>{nombre}</h5>
          <p>{registro?.categoria || 'entidad financiera'} · {etiquetaEstadoMarca(registro?.estado)}</p>
        </div>
        <button type="button" aria-label={`Seleccionar ${nombre}`} onClick={() => onSelect(nombre)}>
          {seleccionado ? 'Seleccionado' : 'Ver arriba'}
        </button>
      </header>
      <div className="bank-review-card__variants" data-bank-review-enlarged={bankReviewSize(nombre, 'compacto') !== 'h-12' ? 'true' : undefined}>
        <VistaVarianteBanco nombre={nombre} variante="compacto" />
        <VistaVarianteBanco nombre={nombre} variante="horizontal" />
      </div>
    </article>
  )
}

export function VistaBancosPagos() {
  const [banco, setBanco] = useState(BANCO_DESTACADO)
  const registro = logoDeBanco(banco, 'horizontal')

  return (
    <div className="preview-layout preview-layout--financial">
      <section className="preview-panel" aria-labelledby="preview-banco-titulo">
        <div className="preview-panel__heading">
          <div>
            <p className="preview-kicker">Selección bancaria</p>
            <h4 id="preview-banco-titulo">Todos los bancos, con logo compacto y horizontal</h4>
          </div>
          <Badge color={tonoEstadoMarca(registro?.estado)}>{etiquetaEstadoMarca(registro?.estado)}</Badge>
        </div>

        <Label htmlFor="gallery-banco">Banco o financiera</Label>
        <BancoCombobox
          id="gallery-banco"
          value={banco}
          onChange={setBanco}
          placeholder="Buscar por nombre o alias"
          logoProps={{ decorativo: true }}
        />

        <div className="brand-selection" aria-live="polite">
          <div className="brand-selection__compact" aria-label={`Variante compacta de ${banco}`}>
            <BancoLogo banco={banco} variante="compacto" alto="h-10" />
          </div>
          <div className="brand-selection__wordmark">
            <span className="brand-selection__eyebrow">Seleccionado</span>
            <BancoLogo banco={banco} variante="horizontal" alto="h-7" />
            <span className="brand-selection__meta">{registro?.categoria || 'entidad financiera'} · {registro?.verificadoEn || 'sin fecha'}</span>
          </div>
        </div>
        <p className="preview-note">
          Assets locales obtenidos de fuentes oficiales, con procedencia y hash auditables. Las marcas bloqueadas nunca se recrean.
        </p>

        <div className="bank-review-heading">
          <div>
            <p className="bank-picker__label" id="gallery-bancos-todos">Revisión completa · {BANCOS_PREVIEW.length} instituciones</p>
            <p>ueno bank aparece primero; el resto conserva el orden canónico del catálogo.</p>
          </div>
          <span>Compacto + horizontal</span>
        </div>
        <p className="bank-review-scroll-hint" id="gallery-bancos-scroll-ayuda">Desliza dentro de la lista para revisar todas las instituciones. Con teclado, enfoca la lista y usa las flechas.</p>
        <div className="bank-review-grid" role="region" tabIndex={0} aria-labelledby="gallery-bancos-todos" aria-describedby="gallery-bancos-scroll-ayuda">
          {BANCOS_PREVIEW.map((nombre) => (
            <TarjetaBancoRevision key={nombre} nombre={nombre} seleccionado={banco === nombre} onSelect={setBanco} />
          ))}
        </div>
      </section>

      <section className="preview-panel" aria-labelledby="preview-pagos-titulo">
        <div className="preview-panel__heading">
          <div>
            <p className="preview-kicker">Medios de pago</p>
            <h4 id="preview-pagos-titulo">Redes, billeteras y procesadores oficiales</h4>
          </div>
          <EtiquetaFixture>Assets autorizados</EtiquetaFixture>
        </div>
        <section className="payment-peer-group" aria-labelledby="gallery-soluciones-comercios">
          <div className="payment-peer-group__heading">
            <div>
              <p className="bank-picker__label" id="gallery-soluciones-comercios">{SOLUCIONES_PAGO_COMERCIOS_PREVIEW.titulo}</p>
              <p>{SOLUCIONES_PAGO_COMERCIOS_PREVIEW.descripcion}</p>
            </div>
            <span>Alternativas funcionales</span>
          </div>
          <ul className="payment-peer-grid" aria-labelledby="gallery-soluciones-comercios">
            {SOLUCIONES_PAGO_COMERCIOS_PREVIEW.marcas.map((marca) => {
              const marcaRegistro = logoDeMedioPago(marca, 'horizontal')
              return (
                <li key={marca}>
                  <strong>{marca}</strong>
                  <div className="payment-peer-grid__logos">
                    <span className="payment-peer-grid__compact" aria-label={`Logo compacto de ${marca}`}>
                      <MedioPagoLogo marca={marca} variante="compacto" alto="h-11" decorativo />
                    </span>
                    <span className="payment-peer-grid__horizontal" aria-label={`Logo horizontal de ${marca}`}>
                      <MedioPagoLogo marca={marca} variante="horizontal" alto="h-7" decorativo />
                    </span>
                  </div>
                  <span className="payment-grid__status">{etiquetaEstadoMarca(marcaRegistro?.estado)}</span>
                </li>
              )
            })}
          </ul>
          <p className="preview-note">Grupo funcional de soluciones para comercios. Pik mantiene, por separado, su relación corporativa verificada con Itaú.</p>
        </section>
        <p className="bank-picker__label" id="gallery-marcas-conectadas">Apps conectadas a instituciones</p>
        <ul className="connected-brand-grid" aria-labelledby="gallery-marcas-conectadas">
          {MARCAS_CONECTADAS_PREVIEW.map((marca) => {
            const relacion = relacionFinancieraDe(marca)
            const institucion = relacion?.institucionPadre || relacion?.financialProvider
            return (
              <li key={marca}>
                <div className="connected-brand-grid__logos">
                  <MedioPagoLogo marca={marca} variante="compacto" alto="h-9" decorativo />
                  <MedioPagoLogo marca={marca} variante="horizontal" alto="h-6" />
                </div>
                <div className="connected-brand-grid__relationship">
                  <span>{institucion ? `Con ${institucion}` : 'Relación verificada'}</span>
                  {institucion ? <BancoLogo banco={institucion} variante="horizontal" alto="h-5" decorativo /> : null}
                </div>
                <small>{relacion?.operador?.nombreLegal}</small>
              </li>
            )
          })}
        </ul>
        <p className="preview-note">Cada app conserva su propia identidad. La relación informa proveedor u organización matriz verificada, sin convertir la marca en banco ni sustituir logos.</p>
        <p className="bank-picker__label" id="gallery-medios-pago">Redes y medios de pago</p>
        <ul className="payment-grid" aria-labelledby="gallery-medios-pago">
          {MARCAS_PAGO_DEMO.map((marca) => {
            const marcaRegistro = logoDeMedioPago(marca, 'horizontal')
            return (
              <li key={marca}>
                <div className="payment-grid__logos">
                  <MedioPagoLogo marca={marca} variante="compacto" alto="h-8" decorativo />
                  <MedioPagoLogo marca={marca} variante="horizontal" alto="h-6" />
                </div>
                <span className="payment-grid__status">{etiquetaEstadoMarca(marcaRegistro?.estado)}</span>
              </li>
            )
          })}
        </ul>
        <p className="preview-note">Bancard, Dinelco, upay, Pagopar y otras marcas usan archivos locales oficiales. Los casos sin bytes verificables quedan registrados como bloqueos, no como logos falsos.</p>
      </section>
    </div>
  )
}

function VistaTelefono() {
  const [telefono, setTelefono] = useState('981 123 456')
  const [pais, setPais] = useState('PY')
  const valido = telefonoInternacionalValido(telefono, pais)
  const e164 = telefonoE164(telefono, pais)

  function ejemploValido() {
    setPais('PY')
    setTelefono('981 123 456')
  }

  function ejemploInvalido() {
    setPais('PY')
    setTelefono('12')
  }

  return (
    <div className="preview-layout preview-layout--phone">
      <section className="preview-panel">
        <div className="preview-panel__heading">
          <div>
            <p className="preview-kicker">PhoneField</p>
            <h4>Paraguay listo por defecto</h4>
          </div>
          <Badge color={valido ? 'green' : 'orange'}>{valido ? 'Válido' : 'Revisar'}</Badge>
        </div>
        <Label htmlFor="gallery-telefono">Teléfono</Label>
        <PhoneField
          id="gallery-telefono"
          inputProps={{ id: 'gallery-telefono' }}
          country={pais}
          phone={telefono}
          onCountryChange={(siguiente) => setPais(siguiente || 'PY')}
          onChange={setTelefono}
          onInternationalChange={() => {}}
          countryAriaLabel="Elegir país para el teléfono de muestra"
          phoneAriaLabel="Número telefónico de muestra"
        />
        <div className="phone-output" aria-live="polite">
          <span>Salida E.164</span>
          <code>{e164 || 'Sin salida válida'}</code>
          <strong>{valido ? 'Lista para guardar' : 'El número necesita más dígitos'}</strong>
        </div>
        <div className="preview-actions" aria-label="Estados del campo telefónico">
          <button type="button" onClick={ejemploValido} aria-pressed={valido}>Ejemplo válido</button>
          <button type="button" onClick={ejemploInvalido} aria-pressed={!valido}>Ver error</button>
        </div>
        <p className="preview-note">Abrí el selector para buscar por país, ISO o prefijo. También admite pegado internacional.</p>
      </section>
    </div>
  )
}

function VistaCiudadDepartamento() {
  const [ciudad, setCiudad] = useState('Encarnación')
  const [departamento, setDepartamento] = useState('Itapúa')

  function elegirEjemplo(siguiente) {
    setCiudad(siguiente)
    setDepartamento(departamentoDe(siguiente))
  }

  return (
    <div className="preview-layout preview-layout--city">
      <section className="preview-panel">
        <div className="preview-panel__heading">
          <div>
            <p className="preview-kicker">CityAutocomplete</p>
            <h4>Ciudad → departamento</h4>
          </div>
          <EtiquetaFixture>Catálogo local PY</EtiquetaFixture>
        </div>
        <Label htmlFor="gallery-ciudad">Ciudad</Label>
        <CityAutocomplete
          value={ciudad}
          onChange={setCiudad}
          onSelect={(siguienteCiudad, siguienteDepartamento) => {
            setCiudad(siguienteCiudad)
            setDepartamento(siguienteDepartamento)
          }}
          inputProps={{ id: 'gallery-ciudad' }}
        />
        <div className="derived-value" aria-live="polite">
          <span>Departamento derivado</span>
          <strong>{departamento || 'Elegí una ciudad del catálogo'}</strong>
        </div>
        <div className="preview-actions" aria-label="Ejemplos de ciudades">
          {['Asunción', 'Encarnación', 'Ciudad del Este'].map((item) => (
            <button key={item} type="button" onClick={() => elegirEjemplo(item)} aria-pressed={ciudad === item}>{item}</button>
          ))}
        </div>
        <p className="preview-note">Datos de muestra del catálogo incluido. No consulta ni representa un proveedor gubernamental en vivo.</p>
      </section>
    </div>
  )
}

function ResumenCliente({ cliente, titulo }) {
  return (
    <div className="customer-result" aria-live="polite">
      <span>{titulo}</span>
      {cliente ? (
        <>
          <strong>{cliente.name || cliente.nombre}</strong>
          <small>{cliente.document || cliente.fullRuc} · {cliente.phone || cliente.email || 'sin contacto'}</small>
        </>
      ) : <strong>Elegí un resultado para completar</strong>}
    </div>
  )
}

function VistaClienteDocumento() {
  const [cliente, setCliente] = useState(CLIENTES_DEMO[0])
  const [ruc, setRuc] = useState('80012345-6')
  const [extraido, setExtraido] = useState(null)

  return (
    <div className="preview-layout preview-layout--customer">
      <section className="preview-panel">
        <div className="preview-panel__heading">
          <div>
            <p className="preview-kicker">BuscadorCliente</p>
            <h4>Encontrar por CI, RUC o contacto</h4>
          </div>
          <EtiquetaFixture>2 clientes ficticios</EtiquetaFixture>
        </div>
        <Label htmlFor="gallery-cliente">Cliente</Label>
        <BuscadorCliente
          id="gallery-cliente"
          clientes={CLIENTES_DEMO}
          selectedId={cliente?.id || ''}
          onSelect={setCliente}
          placeholder="Probá 4567890 o Cliente Demo"
        />
        <ResumenCliente cliente={cliente} titulo="Datos completados desde el fixture" />
      </section>

      <section className="preview-panel">
        <div className="preview-panel__heading">
          <div>
            <p className="preview-kicker">RucField</p>
            <h4>Extracción confirmable</h4>
          </div>
          <EtiquetaFixture>Proveedor simulado</EtiquetaFixture>
        </div>
        <Label htmlFor="gallery-ruc">RUC</Label>
        <RucField
          id="gallery-ruc"
          value={ruc}
          onChange={setRuc}
          consultar={consultarRucDemo}
          onAplicar={setExtraido}
          textoAyuda="Fixture local: probá 80012345-6, 80054321-2 o 80123456-7. Revisá el resultado antes de aplicarlo."
        />
        <ResumenCliente cliente={extraido} titulo="Datos aplicados con confirmación" />
        <p className="preview-note">CI y RUC son búsquedas independientes: la demo nunca afirma que una CI se convierta universalmente en RUC.</p>
      </section>
      <OwnDataIntegrationPreview />
    </div>
  )
}

export function OtrosCamposInteligentes() {
  const [monto, setMonto] = useState(1250000)
  const [porcentaje, setPorcentaje] = useState('18')
  const [correo, setCorreo] = useState('ventas@')
  const [serial, setSerial] = useState('ABC123456')

  return (
    <details open className="smart-inputs">
      <summary>
        <span>
          <strong>Otros campos inteligentes</strong>
          <small>Moneda, porcentaje, correo, fechas y serial</small>
        </span>
        <span aria-hidden="true" className="smart-inputs__toggle">+</span>
      </summary>
      <div className="smart-inputs__grid">
        <div>
          <Label htmlFor="gallery-monto">Monto en guaraníes</Label>
          <MoneyInput id="gallery-monto" value={monto} onValueChange={setMonto} aria-label="Monto de muestra" />
        </div>
        <div>
          <Label htmlFor="gallery-porcentaje">Porcentaje</Label>
          <PercentField id="gallery-porcentaje" value={porcentaje} onChange={setPorcentaje} aria-label="Porcentaje de muestra" />
        </div>
        <div>
          <Label htmlFor="gallery-correo">Correo con sugerencias</Label>
          <EmailField id="gallery-correo" value={correo} onChange={setCorreo} aria-label="Correo de muestra" />
        </div>
        <div>
          <Label htmlFor="gallery-serial">IMEI o serial normalizado</Label>
          <SerialField id="gallery-serial" value={serial} onChange={setSerial} aria-label="Serial de muestra" />
        </div>
        <div className="smart-inputs__dates">
          <span className="block pb-1 text-xs font-semibold text-mute">Rango con atajos</span>
          <RangoFecha periodoPorDefecto="este-mes" mostrarCampos={false} />
        </div>
      </div>
    </details>
  )
}

function Presentacion({ id }) {
  const [activo, setActivo] = useState(true)
  const [porcentaje, setPorcentaje] = useState('18')
  const [telefono, setTelefono] = useState('981 123 456')
  const [pais, setPais] = useState('PY')

  switch (id) {
    case 'bancos-pagos':
      return <VistaBancosPagos />
    case 'telefono-py':
      return <VistaTelefono />
    case 'ciudad-departamento':
      return <VistaCiudadDepartamento />
    case 'cliente-ci-ruc':
      return <VistaClienteDocumento />
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
      return <div className="grid gap-3"><p className="text-xs leading-5 text-mute">Logos oficiales locales con autorización documentada y fallback seguro ante error.</p><div className="flex min-h-12 items-center rounded-xl border border-ink-600 bg-ink-800 px-3"><BancoLogo banco="ueno bank" /></div><div className="grid grid-cols-3 gap-2"><div className="grid min-h-14 place-items-center rounded-xl border border-ink-600"><BancoLogo banco="Itaú" variante="compacto" /></div><div className="grid min-h-14 place-items-center rounded-xl border border-ink-600"><BancoLogo banco="Banco Continental" variante="compacto" /></div><div className="grid min-h-14 place-items-center rounded-xl border border-ink-600"><BancoLogo banco="Sudameris" variante="compacto" /></div></div></div>
    case 'pagos':
      return <div className="grid gap-3"><p className="text-xs leading-5 text-mute">Marcas oficiales locales; sin hotlinks ni recursos remotos.</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{MARCAS_PAGO_DEMO.map((marca) => <div key={marca} className="grid min-h-14 place-items-center rounded-xl border border-ink-600 bg-ink-800 p-2"><MedioPagoLogo marca={marca} /></div>)}</div></div>
    case 'telefono':
      return <PhoneField country={pais} phone={telefono} onCountryChange={setPais} onChange={setTelefono} onInternationalChange={() => {}} />
    case 'footer':
      return <ProductFooter identidad={IDENTIDAD} modelo="apilado" enlaces={[{ href: '/blog/', etiqueta: 'Blog' }, { href: '/status.json', etiqueta: 'Estado' }]} anio={2026} />
    case 'prefooter':
      return <ProductPrefooter className="rounded-2xl" modelo="completo" titulo="Construí con una base común" descripcion="Componentes, identidad y contratos verificables." columnas={[{ titulo: 'Recursos', enlaces: [{ href: '#catalogo', etiqueta: 'Catálogo' }] }]} accion={{ titulo: '¿Necesitás integrar?', enlace: { href: '#catalogo', etiqueta: 'Explorar objetos' } }} />
    case 'ia':
      return <div className="grid gap-3"><p className="text-xs leading-5 text-mute">Fixture local: analiza y confirma sin red ni persistencia.</p><CargaIA esquema={ESQUEMA_IA_DEMO} consultarConfig={async () => ({ configurada: true, modelo: 'demo', tipos: ['contactos'] })} analizar={async () => ({ registros: [{ tipo: 'contactos', incluido: true, valores: { nombre: 'Ana Demo', telefono: '0981 123 456' } }], avisos: [] })} crear={async (registros) => ({ creados: registros.length, errores: [] })} /></div>
    default:
      return null
  }
}

function Destacado({ item }) {
  const { destacado } = item
  return (
    <article id={`preview-${destacado.id}`} className={`priority-card priority-card--${destacado.prioridad}`}>
      <header className="priority-card__header">
        <div>
          <p>{destacado.etiqueta}</p>
          <h3>{destacado.titulo}</h3>
          <span>{destacado.descripcion}</span>
        </div>
        <code>{item.nombre}</code>
      </header>
      <div className="priority-card__body">
        <ErrorBoundary><Presentacion id={destacado.id} /></ErrorBoundary>
      </div>
    </article>
  )
}

export function PriorityPreviews() {
  return (
    <div className="priority-grid">
      {DESTACADOS_CATALOGO.map((item) => <Destacado key={item.destacado.id} item={item} />)}
    </div>
  )
}

export function Ficha({ item, onAbrir }) {
  return (
    <article className={`gallery-card min-w-0 rounded-2xl border border-ink-600 bg-ink p-4 shadow-card${galleryCardIsWide(item) ? ' gallery-card--wide' : ''}`} data-export={item.nombre}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-fono-dark dark:text-fono-light">{item.categoria}</p>
          <h3 className="mt-1 break-words text-base font-bold text-fore">{item.nombre}</h3>
        </div>
        <Badge color={item.tipo === 'visual' ? 'green' : 'slate'}>{item.tipo === 'visual' ? 'Visual' : 'API'}</Badge>
      </div>
      {item.destacado ? (
        <a className="catalog-priority-link" href={`#preview-${item.destacado.id}`}>
          <span>Preview profesional #{item.destacado.prioridad}</span>
          <strong>{item.destacado.titulo}</strong>
        </a>
      ) : hasInlineGalleryPreview(item) ? (
        <div className="catalog-miniature"><span className="preview-kicker">Miniatura de primitivas compartidas</span><ErrorBoundary><Presentacion id={COMPACT_SCENES[item.nombre] || item.presentacion} /></ErrorBoundary></div>
      ) : item.presentacion === 'individual' ? (
        <div className="catalog-demo-ready"><span>Demo funcional</span><p>Abra la ficha para explorar el componente y sus estados.</p></div>
      ) : <p className="mt-3 text-sm text-mute">Contrato y utilidades para integrar en la aplicación.</p>}
      <button type="button" onClick={() => onAbrir(item)} className="mt-4 inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-fono-dark underline-offset-4 hover:underline dark:text-fono-light">Ver ficha del export</button>
    </article>
  )
}

export function App() {
  const [urlState, updateUrlState] = useGalleryUrlState()
  const { consulta, categoria, tipo, exportName } = urlState
  const consultaDiferida = useDeferredValue(consulta)
  const seleccionado = CATALOGO_EXPORTS.find(item => item.nombre === exportName) || null
  const shareHref = galleryStateUrl(typeof window === 'undefined' ? 'https://controlaria.online/' : window.location.href, urlState)
  const [limite, setLimite] = useState(60)

  const resultados = useMemo(() => {
    const termino = consultaDiferida.trim().toLocaleLowerCase('es')
    return orderGalleryEntries(CATALOGO_EXPORTS
      .filter((item) => {
        if (tipo !== 'todos' && item.tipo !== tipo) return false
        if (categoria !== 'Todas' && item.categoria !== categoria) return false
        return !termino || `${item.nombre} ${item.categoria} ${item.tipo} ${item.destacado?.titulo || ''}`.toLocaleLowerCase('es').includes(termino)
      }))
  }, [categoria, consultaDiferida, tipo])

  const { api, visuales } = METRICAS_CATALOGO

  function abrirFicha(item) {
    updateUrlState({ exportName: item.nombre })
    requestAnimationFrame(() => document.querySelector('#ficha-export')?.focus())
  }

  return (
    <div className="min-h-dvh bg-paper text-fore">
      <header className="gallery-header border-b border-fore/10 bg-ink/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="gallery-brand-group">
            <a href="#contenido" className="gallery-brand" aria-label="OwnCoding UI — Inicio"><img src="/favicon.svg" alt="" width="40" height="40" /><span className="gallery-wordmark">owncoding<span>/ui</span></span></a>
            <span className="gallery-version">{IDENTIDAD.etiquetaVersion}</span>
          </div>
          <nav aria-label="Acciones de la galería" className="flex flex-wrap items-center gap-2">
            <a className="toque-44 inline-flex min-h-11 items-center px-2 text-sm font-semibold" href="#catalogo">Catálogo</a>
            <a className="toque-44 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-fono-dark hover:underline dark:text-fono-light" href="/status.json">Estado</a>
            <a className="toque-44 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-fono-dark hover:underline dark:text-fono-light" href="/blog/">Blog</a>
            <ThemeToggle clave="owncoding-gallery-theme" />
          </nav>
        </div>
      </header>

      <main id="contenido" className="gallery-main mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        <section className="gallery-hero">
          <div>
            <Badge color="green">Catálogo verificable</Badge>
            <h1>Una base común.<br />Interfaces que funcionan.</h1>
            <p>Componentes reales, estados claros y contratos compartidos. Explore campos, operaciones y los {METRICAS_CATALOGO.total} exports del sistema.</p>
            <div className="hero-actions"><a className="hero-catalog-link" href="#catalogo">Explorar catálogo →</a><a className="hero-state-link" href="/status.json">Ver estado del build</a></div>
            <nav aria-label="Vistas principales" className="hero-priority-nav">
              {DESTACADOS_CATALOGO.map((item) => (
                <a key={item.destacado.id} href={`#preview-${item.destacado.id}`}>
                  <span>{String(item.destacado.prioridad).padStart(2, '0')}</span>
                  {item.destacado.titulo}
                </a>
              ))}
            </nav>
          </div>
          <aside className="hero-index" aria-label="Inventario de la biblioteca">
            <div className="hero-system-label"><span>INVENTARIO DEL SISTEMA</span><span>fixtures locales</span></div>
            <dl className="hero-metrics">{[['Exports', METRICAS_CATALOGO.total], ['Visuales', visuales], ['API', api]].map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{count}</dd></div>)}</dl>
            <p>Pruebe antes de integrar</p><ul><li>Formularios y datos locales</li><li>Composiciones de operación</li><li>Estados controlados por la app</li></ul>
            <span className="fixture-label">Fixtures locales · sin servicios externos</span>
          </aside>
        </section>

        <section aria-labelledby="titulo-destacados" className="priority-section">
          <div className="section-heading">
            <div>
              <p>Recorrido recomendado</p>
              <h2 id="titulo-destacados">Previews profesionales y funcionales</h2>
            </div>
            <span>Fixtures locales · sin llamadas externas</span>
          </div>
          <PriorityPreviews />
          <OtrosCamposInteligentes />
        </section>

        <section className="gallery-blog" aria-labelledby="titulo-blog">
          <div className="section-heading"><div><p>Del componente al producto</p><h2 id="titulo-blog">Guías para construir mejor</h2></div><a href="/blog/">Ver las 10 guías →</a></div>
          <div className="gallery-blog__grid">{BLOG_POSTS.slice(0, 3).map((article) => <article key={article.slug}><span>{article.category}</span><h3><a href={articlePath(article)}>{article.title}</a></h3><p>{article.description}</p><a href={articlePath(article)} className="gallery-blog__read">Leer guía <span aria-hidden="true">↗</span></a></article>)}</div>
        </section>

        <div id="catalogo" className="catalog-workspace">
        <section aria-label="Controles del catálogo" className="catalog-filters">
          <div className="catalog-search">
            <SearchField className="min-w-0 flex-1" value={consulta} onChange={(event) => { updateUrlState({ consulta: event.target.value.slice(0, 200) }, 'replace'); setLimite(60) }} placeholder="Buscar componente, automatización o API" />
            <div className="flex flex-wrap gap-2" aria-label="Tipo de export">
              {[['visual', 'Visuales'], ['api', 'API'], ['todos', 'Todos']].map(([valor, etiqueta]) => <button key={valor} type="button" aria-pressed={tipo === valor} onClick={() => { updateUrlState({ tipo: valor }); setLimite(60) }} className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${tipo === valor ? 'border-fono bg-fono/15 text-fono-text' : 'border-interactivo bg-ink text-mute hover:text-fore'}`}>{etiqueta}</button>)}
            </div>
          </div>
          <div className="catalog-categories" aria-label="Categorías">
            {['Todas', ...CATEGORIAS_CATALOGO].map((item) => <button key={item} type="button" aria-pressed={categoria === item} onClick={() => { updateUrlState({ categoria: item }); setLimite(60) }} className={`min-h-11 shrink-0 rounded-xl border px-3 text-sm font-medium ${categoria === item ? 'border-fono bg-fono/15 text-fono-text' : 'border-interactivo bg-ink text-mute hover:text-fore'}`}>{item}</button>)}
          </div>
        </section>

        <div className="catalog-content">
        {seleccionado ? (
          <section id="ficha-export" tabIndex="-1" aria-live="polite" className="selected-preview rounded-2xl border border-fono/30 bg-fono/10 p-4 outline-none">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-fono-text">Ficha seleccionada</p><h2 className="mt-1 text-xl font-bold">{seleccionado.nombre}</h2><p className="mt-2 text-sm text-mute">{seleccionado.categoria} · {seleccionado.tipo === 'visual' ? 'export visual disponible en la entrada raíz' : 'API documentada sin render visual'}.</p></div><button type="button" className="min-h-11 rounded-lg px-3 text-sm font-semibold text-fono-dark hover:underline dark:text-fono-light" onClick={() => updateUrlState({ exportName: null })}>Cerrar ficha</button></div>
            <a href={shareHref} aria-label={`Enlace directo a ${seleccionado.nombre}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-fono-dark underline dark:text-fono-light">Enlace a esta ficha</a>
            {seleccionado.presentacion ? <div key={seleccionado.nombre} className="mt-4 min-w-0"><ErrorBoundary>{seleccionado.presentacion === 'individual' ? <ComponentPreview name={seleccionado.nombre} /> : <Presentacion id={seleccionado.presentacion} />}</ErrorBoundary></div> : <p className="mt-3 text-sm text-mute">Sin preview curado todavía.</p>}
          </section>
        ) : null}

        <div className="catalog-email"><EmailPreview /></div>
        <section aria-labelledby="titulo-catalogo" className="catalog-results">
          <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 id="titulo-catalogo" className="text-2xl font-bold">Catálogo completo</h2><p className="text-sm text-mute" role="status">{resultados.length} resultados</p></div>
          {resultados.length > 0 ? (
            <><div className="catalog-grid">{resultados.slice(0, limite).map((item, index) => <React.Fragment key={item.nombre}>{index === 0 || galleryEntryTier(item) !== galleryEntryTier(resultados[index - 1]) ? <h3 className="col-span-full text-lg font-semibold">{['Vistas destacadas', 'Componentes con miniaturas', 'Demos disponibles al abrir la ficha', 'API, modelos y utilidades'][galleryEntryTier(item)]}</h3> : null}<Ficha item={item} onAbrir={abrirFicha} /></React.Fragment>)}</div>{resultados.length > limite ? <div className="mt-6 text-center"><Button variant="outline" onClick={() => setLimite((actual) => actual + 60)}>Mostrar más exports</Button></div> : null}</>
          ) : <div className="mt-5"><EmptyState title="No encontramos ese export" description="Probá otra palabra o cambiá los filtros." action={<Button variant="outline" onClick={() => { updateUrlState({ consulta: '', categoria: 'Todas', tipo: 'visual' }); setLimite(60) }}>Limpiar filtros</Button>} /></div>}
        </section>
        </div>
        </div>
      </main>

      <ProductPrefooter className="gallery-prefooter" modelo="completo" titulo="Adopción sin copias locales" descripcion="Usá el export compartido y extendé su contrato por props." columnas={[{ titulo: 'Biblioteca', enlaces: [{ href: '#catalogo', etiqueta: 'Todos los exports' }, { href: '/status.json', etiqueta: 'Estado del build' }, { href: '/blog/', etiqueta: 'Blog y guías' }] }, { titulo: 'Calidad', enlaces: [{ href: '#contenido', etiqueta: 'Volver arriba' }] }]} accion={{ titulo: 'Estado verificable', descripcion: `${visuales} exports visuales y ${api} exports de API catalogados.`, enlace: { href: '/status.json', etiqueta: 'Abrir status.json' } }} />
      <ProductFooter identidad={IDENTIDAD} modelo="distribuido" enlaces={[{ href: '/blog/', etiqueta: 'Blog' }, { href: '/status.json', etiqueta: 'Estado' }]} />
    </div>
  )
}

const galleryRoot = typeof document !== 'undefined' ? document.getElementById('root') : null
if (galleryRoot) createRoot(galleryRoot).render(<App />)
