import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import Switch from './Switch.jsx'
import {
  Aviso,
  Button,
  EmptyState,
  FormActions,
  FormField,
  Input,
  Modal,
  MoneyInput,
  Nota,
  Select,
  Skeleton,
  Textarea,
} from './ui.jsx'
import { cn } from '../utils/cn.js'
import {
  IA_BOTON,
  IA_REGISTROS_MAX,
  IA_TEXTO_MAX,
  IA_TITULO,
  IA_TOOLTIP,
  normalizarAnalisisIA,
  normalizarResultadoIA,
  opcionesDeCampoIA,
  registrosIncluidosIA,
  tipoDeEsquemaIA,
  tituloDeRegistroIA,
  validarRegistrosIA,
} from '../utils/cargaIA.js'

// «Carga con IA» (issue #11): botón de topbar + diálogo de pegado, revisión y
// creación. La app aporta el **esquema declarativo** de tipos/campos y los
// callbacks `analizar(texto, tipos)` y `crear(registros)`; acá no hay proveedor,
// endpoints ni persistencia. Nada se crea sin la confirmación de la persona
// («Crear todo») y el diálogo llega montado recién al abrirlo.
//
// Reglas y contrato: docs/REGLAS.md §18; contrato puro en `utils/cargaIA.js`.

const PLACEHOLDER =
  'Ejemplo:\nNombre Apellido — 0981 123 456, correo@ejemplo.com\nProducto: pantalla LED 3x2, cantidad 4, precio 1.500.000'

const listar = (cantidad, singular, plural) => `${cantidad} ${cantidad === 1 ? singular : plural}`

function mensajeDeError(falla, respaldo) {
  const texto = falla instanceof Error ? falla.message : typeof falla === 'string' ? falla : ''
  return texto.trim() || respaldo
}

/** Botón de topbar del asistente: solo abre; el diálogo lo elige la app. */
export function BotonCargaIA({ onAbrir, texto = IA_BOTON, tooltip = IA_TOOLTIP, className, ...props }) {
  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label={texto}
      aria-haspopup="dialog"
      title={tooltip}
      className={cn(
        'inline-flex h-11 select-none items-center gap-2 rounded-lg border border-ink-500 px-3 text-sm text-mute transition md:h-9',
        'hover:border-fono hover:bg-fono/10 hover:text-fore',
        className,
      )}
      {...props}
    >
      <Icon name="sparkles" className="h-4 w-4" />
      <span className="hidden sm:inline">{texto}</span>
    </button>
  )
}

/**
 * Botón + diálogo juntos, con **montaje diferido**: la forma corta de adopción
 * (la app pasa el mismo `esquema` y los callbacks que usaría sueltos). El
 * diálogo no se monta hasta el primer clic en el botón.
 */
export function CargaIA({
  esquema,
  analizar,
  crear,
  consultarConfig,
  enlacePrivacidad,
  texto,
  tooltip,
  titulo,
  placeholder,
  maxTexto,
  maxRegistros,
  className,
  classNameBoton,
}) {
  const [abierto, setAbierto] = useState(false)
  const [montado, setMontado] = useState(false)
  function abrir() {
    setMontado(true)
    setAbierto(true)
  }
  return (
    <>
      <BotonCargaIA onAbrir={abrir} texto={texto} tooltip={tooltip} className={classNameBoton} />
      {montado ? (
        <DialogoCargaIA
          abierto={abierto}
          onCerrar={() => setAbierto(false)}
          esquema={esquema}
          analizar={analizar}
          crear={crear}
          consultarConfig={consultarConfig}
          enlacePrivacidad={enlacePrivacidad}
          titulo={titulo}
          placeholder={placeholder}
          maxTexto={maxTexto}
          maxRegistros={maxRegistros}
          className={className}
        />
      ) : null}
    </>
  )
}

/** Campo del preview dibujado con el objeto de §1 que corresponde al tipo. */
function CampoRegistroIA({ campo, registro, error, disabled, onCambiar }) {
  const id = useId()
  const htmlFor = `${id}-${campo.id}`
  const descripcionId = campo.ayuda || error ? `${htmlFor}-descripcion` : undefined
  const valor = registro.valores?.[campo.id]
  const obligatorio = Boolean(campo.obligatorio)
  const comunes = {
    id: htmlFor,
    disabled,
    required: obligatorio,
    'aria-describedby': descripcionId,
  }

  let control
  if (campo.tipo === 'moneda') {
    control = (
      <MoneyInput
        {...comunes}
        currency={campo.moneda || 'PYG'}
        value={valor ?? ''}
        onValueChange={(siguiente) => onCambiar(siguiente)}
      />
    )
  } else if (campo.tipo === 'select') {
    control = (
      <Select
        {...comunes}
        value={valor === null || valor === undefined ? '' : String(valor)}
        onChange={(evento) => onCambiar(evento.target.value)}
      >
        <option value="">— Elegí —</option>
        {opcionesDeCampoIA(campo).map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </Select>
    )
  } else if (campo.tipo === 'fecha') {
    control = <Input {...comunes} type="date" value={valor || ''} onChange={(evento) => onCambiar(evento.target.value)} />
  } else if (campo.tipo === 'numero') {
    control = (
      <Input
        {...comunes}
        inputMode="numeric"
        value={valor ?? ''}
        maxLength={campo.maxLargo}
        onChange={(evento) => onCambiar(evento.target.value.replace(/[^\d]/g, ''))}
      />
    )
  } else {
    control = (
      <Input
        {...comunes}
        value={valor ?? ''}
        maxLength={campo.maxLargo}
        onChange={(evento) => onCambiar(evento.target.value)}
      />
    )
  }

  return (
    <FormField
      label={
        <>
          {campo.label}
          {obligatorio ? (
            <span aria-hidden="true" className="text-bad-text">
              {' '}
              *
            </span>
          ) : null}
        </>
      }
      hint={campo.ayuda}
      error={error}
      htmlFor={htmlFor}
      descripcionId={descripcionId}
    >
      {control}
    </FormField>
  )
}

/** Tarjeta de un registro detectado: título, avisos, incluir/descartar y campos. */
function TarjetaRegistroIA({ registro, tipo, errores, onCambiar, onIncluir }) {
  const titulo = tituloDeRegistroIA(registro, tipo)
  return (
    <article
      aria-label={titulo}
      className={cn('rounded-xl border border-ink-600 bg-ink-800/40 p-3 sm:p-4', !registro.incluir && 'opacity-60')}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 break-words text-sm font-semibold text-fore">{titulo}</p>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-mute">
          <span className="hidden sm:inline">{registro.incluir ? 'Incluir' : 'Descartado'}</span>
          <Switch
            checked={Boolean(registro.incluir)}
            ariaLabel={`Incluir ${titulo}`}
            onChange={(evento) => onIncluir(evento.target.checked)}
          />
        </label>
      </header>
      {registro.avisos?.length > 0 ? (
        <Nota tono="warn" compact className="mb-3">
          {registro.avisos.join(' ')}
        </Nota>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {(tipo?.campos ?? []).map((campo) => (
          <CampoRegistroIA
            key={campo.id}
            campo={campo}
            registro={registro}
            error={errores?.[campo.id]}
            disabled={!registro.incluir}
            onCambiar={(valor) => onCambiar(campo.id, valor)}
          />
        ))}
      </div>
    </article>
  )
}

/**
 * Diálogo del asistente. La app inyecta `consultarConfig` (opcional: sin él se
 * asume configurado), `analizar` y `crear`; `crear` recibe solo los registros
 * incluidos y **solo se llama desde «Crear todo»**.
 */
export default function DialogoCargaIA({
  abierto,
  onCerrar,
  esquema,
  analizar,
  crear,
  consultarConfig,
  enlacePrivacidad = '/privacidad',
  titulo = IA_TITULO,
  placeholder = PLACEHOLDER,
  maxTexto = IA_TEXTO_MAX,
  maxRegistros = IA_REGISTROS_MAX,
  className,
}) {
  const idTexto = useId()
  const consultarRef = useRef(consultarConfig)
  consultarRef.current = consultarConfig

  const [config, setConfig] = useState(() => (consultarConfig ? null : { configurada: true, modelo: null }))
  const [configError, setConfigError] = useState('')
  const [reintento, setReintento] = useState(0)
  const [entrada, setEntrada] = useState('')
  const [fase, setFase] = useState('entrada')
  const [analizando, setAnalizando] = useState(false)
  const [creando, setCreando] = useState(false)
  const [error, setError] = useState('')
  const [avisos, setAvisos] = useState([])
  const [registros, setRegistros] = useState([])
  const [resultado, setResultado] = useState(null)
  const [intento, setIntento] = useState(false)

  const topeTexto = Number.isFinite(Number(maxTexto)) && Number(maxTexto) > 0 ? Math.floor(Number(maxTexto)) : IA_TEXTO_MAX
  const topeRegistros =
    Number.isFinite(Number(maxRegistros)) && Number(maxRegistros) > 0 ? Math.floor(Number(maxRegistros)) : IA_REGISTROS_MAX

  const idsEsquema = (esquema?.tipos ?? []).map((tipo) => tipo?.id).filter(Boolean)
  const permitidos = config?.tipos ? config.tipos.filter((id) => idsEsquema.includes(id)) : idsEsquema

  // Al abrir (y al reintentar la config) el diálogo arranca limpio y consulta el
  // estado. `esquema` no entra en dependencias: un esquema nuevo por render no
  // debe reiniciar la revisión.
  useEffect(() => {
    if (!abierto) return undefined
    setEntrada('')
    setFase('entrada')
    setAnalizando(false)
    setCreando(false)
    setError('')
    setAvisos([])
    setRegistros([])
    setResultado(null)
    setIntento(false)
    setConfigError('')

    const consultar = consultarRef.current
    if (!consultar) {
      setConfig({ configurada: true, modelo: null })
      return undefined
    }
    setConfig(null)
    let vigente = true
    Promise.resolve()
      .then(() => consultar())
      .then((respuesta) => {
        if (!vigente) return
        setConfig({
          configurada: Boolean(respuesta?.configurada),
          modelo: respuesta?.modelo ?? null,
          tipos: Array.isArray(respuesta?.tipos) ? respuesta.tipos : undefined,
        })
      })
      .catch((falla) => {
        if (!vigente) return
        setConfigError(mensajeDeError(falla, 'No pudimos consultar el estado del asistente.'))
      })
    return () => {
      vigente = false
    }
  }, [abierto, reintento])

  const grupos = useMemo(
    () =>
      (esquema?.tipos ?? [])
        .map((tipo) => ({ tipo, registros: registros.filter((registro) => registro.tipo === tipo.id) }))
        .filter((grupo) => grupo.registros.length > 0),
    [esquema, registros],
  )
  const incluidos = registrosIncluidosIA(registros)
  const totalIncluidos = incluidos.length
  const valido = useMemo(() => validarRegistrosIA(registros, esquema), [registros, esquema])
  const partes = grupos.map(({ tipo, registros: delTipo }) =>
    listar(delTipo.length, tipo.singular || tipo.label.toLowerCase(), tipo.plural || tipo.label.toLowerCase()),
  )

  function cambiarValor(registroId, campoId, valor) {
    setRegistros((actuales) =>
      actuales.map((registro) =>
        registro.id === registroId ? { ...registro, valores: { ...registro.valores, [campoId]: valor } } : registro,
      ),
    )
  }

  function cambiarInclusion(registroId, incluir) {
    setRegistros((actuales) => actuales.map((registro) => (registro.id === registroId ? { ...registro, incluir } : registro)))
  }

  async function analizarTexto() {
    const limpio = entrada.trim()
    if (!limpio || analizando) return
    setAnalizando(true)
    setError('')
    try {
      const respuesta = await analizar?.(limpio, permitidos)
      const normalizado = normalizarAnalisisIA(respuesta, esquema, { maxRegistros: topeRegistros })
      setAvisos(normalizado.avisos)
      setRegistros(normalizado.registros)
      setResultado(null)
      setIntento(false)
      setFase('revision')
    } catch (falla) {
      setError(mensajeDeError(falla, 'No pudimos analizar el texto. Probá de nuevo.'))
    } finally {
      setAnalizando(false)
    }
  }

  async function crearTodo() {
    if (creando) return
    const mandados = registrosIncluidosIA(registros)
    if (mandados.length === 0) return
    setIntento(true)
    const revision = validarRegistrosIA(registros, esquema)
    if (!revision.valido) {
      setError('Completá los campos obligatorios marcados.')
      return
    }
    setCreando(true)
    setError('')
    try {
      const limpios = mandados.map((registro) => ({
        id: registro.id,
        tipo: registro.tipo,
        valores: { ...registro.valores },
      }))
      const respuesta = await crear?.(limpios)
      setResultado(normalizarResultadoIA(respuesta, { total: limpios.length }))
      setFase('listo')
    } catch (falla) {
      setError(mensajeDeError(falla, 'No pudimos crear los registros. Probá de nuevo.'))
    } finally {
      setCreando(false)
    }
  }

  function cargarOtroTexto() {
    setEntrada('')
    setRegistros([])
    setAvisos([])
    setResultado(null)
    setError('')
    setIntento(false)
    setFase('entrada')
  }

  const pista = [
    'Pegá mensajes, listas o catálogos',
    permitidos.length > 0
      ? `(${permitidos
          .map((id) => tipoDeEsquemaIA(esquema, id)?.label?.toLowerCase())
          .filter(Boolean)
          .join(', ')} a la vez).`
      : '',
    `Máximo ${topeTexto.toLocaleString('es-PY')} caracteres.`,
  ]
    .filter(Boolean)
    .join(' ')

  const resumen = resultado
    ? {
        creados: resultado.creados,
        total: resultado.total,
        errores: resultado.errores,
        advertencias: resultado.advertencias,
      }
    : null

  return (
    <Modal
      open={Boolean(abierto)}
      onClose={onCerrar}
      title={titulo}
      size="completo"
      busy={analizando || creando}
      className={className}
    >
      {config === null && !configError ? (
        <div className="space-y-3" role="status" aria-busy="true">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-24 w-full" />
          <p className="text-sm text-mute">Consultando la configuración…</p>
        </div>
      ) : null}

      {configError ? (
        <div className="space-y-4">
          <Aviso tono="error">{configError}</Aviso>
          <FormActions>
            <Button type="button" variant="ghost" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={() => setReintento((valor) => valor + 1)}>
              Reintentar
            </Button>
          </FormActions>
        </div>
      ) : null}

      {config && !config.configurada ? (
        <div className="space-y-4">
          <Nota tono="warn">
            La IA no está configurada en este servidor. Mientras tanto, los registros se cargan a mano desde cada
            módulo, sin perder nada.
          </Nota>
          <p className="text-sm text-mute">Cuando la app tenga proveedor configurado, este asistente vuelve solo.</p>
          <FormActions>
            {consultarConfig ? (
              <Button type="button" variant="outline" onClick={() => setReintento((valor) => valor + 1)}>
                Volver a chequear
              </Button>
            ) : null}
            <Button type="button" variant="primary" onClick={onCerrar}>
              Entendido
            </Button>
          </FormActions>
        </div>
      ) : null}

      {config?.configurada && permitidos.length === 0 ? (
        <div className="space-y-4">
          <Nota tono="warn">No tenés permiso para crear ninguno de los tipos de este asistente.</Nota>
          <FormActions>
            <Button type="button" variant="primary" onClick={onCerrar}>
              Entendido
            </Button>
          </FormActions>
        </div>
      ) : null}

      {config?.configurada && permitidos.length > 0 && fase === 'entrada' ? (
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            void analizarTexto()
          }}
        >
          <div>
            <FormField label="Texto para cargar" htmlFor={idTexto} hint={pista}>
              <Textarea
                id={idTexto}
                rows={10}
                maxLength={topeTexto}
                value={entrada}
                disabled={analizando}
                placeholder={placeholder}
                aria-describedby={`${idTexto}-descripcion`}
                onChange={(evento) => setEntrada(evento.target.value)}
              />
            </FormField>
            <p className="mt-1.5 text-right text-xs text-mute">
              {entrada.length.toLocaleString('es-PY')} / {topeTexto.toLocaleString('es-PY')}
            </p>
          </div>
          <p className="text-xs leading-5 text-mute">
            Se manda solo este texto al proveedor de IA configurado{config.modelo ? ` (${config.modelo})` : ''} para
            armar la vista previa; no se guarda ni se toca la base.{' '}
            {enlacePrivacidad ? (
              <a
                className="font-medium text-fono-light underline-offset-2 hover:underline"
                href={enlacePrivacidad}
                target="_blank"
                rel="noreferrer"
              >
                Política de privacidad
              </a>
            ) : null}
          </p>
          {error ? <Aviso tono="error">{error}</Aviso> : null}
          <FormActions>
            <Button type="button" variant="ghost" onClick={onCerrar} disabled={analizando}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={!entrada.trim() || analizando}>
              {analizando ? 'Analizando…' : 'Analizar con IA'}
            </Button>
          </FormActions>
        </form>
      ) : null}

      {config?.configurada && permitidos.length > 0 && fase === 'revision' ? (
        <div className="space-y-4">
          <p className="text-sm text-mute">
            {grupos.length > 0 ? (
              <>
                Detectamos <strong className="text-fore">{partes.join(', ')}</strong>. Revisá, corregí o descartá: nada
                se crea sin tu confirmación.
              </>
            ) : (
              'No detectamos registros en el texto.'
            )}
          </p>
          {avisos.length > 0 ? <Nota tono="warn">{avisos.join(' ')}</Nota> : null}
          {error ? <Aviso tono="error">{error}</Aviso> : null}

          {grupos.length === 0 ? (
            <EmptyState
              icon="sparkles"
              title="No detectamos registros"
              description="Probá con un texto más completo (nombres, fechas o precios) o volvé a pegar."
            />
          ) : null}

          {grupos.map(({ tipo, registros: delTipo }) => (
            <section key={tipo.id} aria-label={`${tipo.label} detectados (${delTipo.length})`} className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-mute">
                {tipo.label} <span className="text-mute/80">{delTipo.length}</span>
              </h3>
              {delTipo.map((registro) => (
                <TarjetaRegistroIA
                  key={registro.id}
                  registro={registro}
                  tipo={tipo}
                  errores={intento ? valido.errores.get(registro.id) : undefined}
                  onCambiar={(campoId, valor) => cambiarValor(registro.id, campoId, valor)}
                  onIncluir={(incluir) => cambiarInclusion(registro.id, incluir)}
                />
              ))}
            </section>
          ))}

          <FormActions>
            <Button type="button" variant="ghost" onClick={() => setFase('entrada')} disabled={creando}>
              Volver
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => void crearTodo()}
              disabled={creando || totalIncluidos === 0}
            >
              {creando ? 'Creando…' : `Crear todo (${totalIncluidos})`}
            </Button>
          </FormActions>
        </div>
      ) : null}

      {config?.configurada && permitidos.length > 0 && fase === 'listo' && resumen ? (
        <div className="space-y-4">
          {resumen.creados === null ? (
            <Nota tono="info">La app terminó el alta; el detalle queda en su módulo.</Nota>
          ) : resumen.creados > 0 ? (
            <Aviso tono="ok">
              {resumen.total !== null && resumen.creados < resumen.total
                ? `Creamos ${resumen.creados} de ${resumen.total} registros.`
                : `Creamos ${listar(resumen.creados, 'registro', 'registros')}.`}
            </Aviso>
          ) : resumen.errores.length === 0 ? (
            <Nota tono="neutro">No se creó ningún registro.</Nota>
          ) : null}
          {resumen.advertencias.length > 0 ? <Nota tono="warn">{resumen.advertencias.join(' ')}</Nota> : null}
          {resumen.errores.length > 0 ? (
            <Aviso tono="error">
              {`No pudimos crear ${listar(resumen.errores.length, 'registro', 'registros')}: ${resumen.errores.join(' · ')}`}
            </Aviso>
          ) : null}
          <FormActions>
            <Button type="button" variant="ghost" onClick={cargarOtroTexto}>
              Cargar otro texto
            </Button>
            <Button type="button" variant="primary" onClick={onCerrar}>
              Listo
            </Button>
          </FormActions>
        </div>
      ) : null}
    </Modal>
  )
}
