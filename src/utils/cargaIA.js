// «Carga con IA»: contrato puro del asistente (issue #11).
//
// Módulo sin React y sin red: la app describe sus tipos y campos con un
// **esquema declarativo**, inyecta `analizar(texto, tipos)` y
// `crear(registros)`, y la biblioteca dibuja la entrada, la revisión por
// tarjetas y el resultado. Acá viven los límites, las etiquetas y la
// normalización: el objeto de interfaz (`DialogoCargaIA`) no conoce endpoints,
// permisos ni proveedores.
//
// Reglas (docs/REGLAS.md §18): nada se crea sin confirmación humana, el texto
// pegado no se persiste y sin proveedor configurado el asistente avisa y no
// rompe. La app mantiene sus permisos, su aislamiento y su auditoría.

/** Largo máximo del texto pegado, en caracteres. */
export const IA_TEXTO_MAX = 20_000

/** Máximo de registros por tipo en una pasada (el prompt de la app también lo pide). */
export const IA_REGISTROS_MAX = 25

/** Llamadas por organización dentro de la ventana de rate-limit (15 min). */
export const IA_RATE_LIMIT = 10

/** Tope de tokens de la respuesta del proveedor. */
export const IA_TOKENS_MAX = 4_000

/** Timeout de la llamada al proveedor, en milisegundos. */
export const IA_TIMEOUT_MS = 30_000

/** Rótulos por defecto del botón y del diálogo. */
export const IA_BOTON = 'Carga con IA'
export const IA_TOOLTIP = 'Carga con IA · pegá un texto y revisá antes de crear'
export const IA_TITULO = 'Carga con IA'

/** Tipos de campo que el esquema entiende (se dibujan con los objetos de §1). */
export const CAMPOS_IA = ['texto', 'numero', 'moneda', 'fecha', 'select']

/** Registros a partir de los que la revisión usa el ancho completo (#16). */
export const IA_DIALOGO_COMPLETO_REGISTROS = 6

/** Campos de un tipo a partir de los que la revisión usa el ancho completo (#16). */
export const IA_DIALOGO_COMPLETO_CAMPOS = 6

/**
 * Ancho adaptativo del diálogo por fase (#16): entrada y resultado van en
 * `amplio`; la revisión pide `completo` solo cuando el contenido lo justifica
 * (varias tarjetas o tipos con muchos campos). La app lo pisa con `size`.
 */
export function tamanoDialogoIA(fase, { registros = [], esquema } = {}) {
  if (fase !== 'revision') return 'amplio'
  const variasTarjetas = (registros?.length ?? 0) >= IA_DIALOGO_COMPLETO_REGISTROS
  const tipoDenso = (esquema?.tipos ?? []).some((tipo) => (tipo?.campos?.length ?? 0) >= IA_DIALOGO_COMPLETO_CAMPOS)
  return variasTarjetas || tipoDenso ? 'completo' : 'amplio'
}

const textoDe = (valor) => (valor === null || valor === undefined ? '' : String(valor)).trim()

/** Tipo del esquema por id; `null` si no está. */
export function tipoDeEsquemaIA(esquema, tipoId) {
  return (esquema?.tipos ?? []).find((tipo) => tipo?.id === tipoId) ?? null
}

/** Campo del tipo por id; `null` si no está. */
export function campoDeTipoIA(tipo, campoId) {
  return (tipo?.campos ?? []).find((campo) => campo?.id === campoId) ?? null
}

/** Campo «principal» del tipo: el primer obligatorio o el primero. */
function campoPrincipal(tipo) {
  const campos = tipo?.campos ?? []
  return campos.find((campo) => campo?.obligatorio) ?? campos[0] ?? null
}

/** ¿El valor está vacío para un campo obligatorio? */
export function valorVacioIA(valor) {
  if (valor === null || valor === undefined) return true
  if (typeof valor === 'number') return !Number.isFinite(valor)
  return String(valor).trim() === ''
}

/**
 * Título visible de la tarjeta: el dato que identifica el registro
 * (`titulo` propio, el primer campo obligatorio o la etiqueta del tipo).
 */
export function tituloDeRegistroIA(registro, tipo) {
  const propio = textoDe(registro?.titulo)
  if (propio) return propio
  const principal = campoPrincipal(tipo)
  if (principal) {
    const valor = textoDe(registro?.valores?.[principal.id])
    if (valor) return valor
  }
  return tipo?.label || textoDe(registro?.tipo) || 'Registro'
}

/** Opciones de un campo select, tolerando textos sueltos. */
export function opcionesDeCampoIA(campo) {
  return (campo?.opciones ?? []).map((opcion) =>
    typeof opcion === 'string'
      ? { value: opcion, label: opcion }
      : { value: String(opcion?.value ?? ''), label: textoDe(opcion?.label) || String(opcion?.value ?? '') },
  )
}

/** Registros crudos del análisis: forma plana (`registros`) o por tipo (`{ clientes: [...] }`). */
function registrosCrudosIA(analisis, esquema) {
  if (Array.isArray(analisis?.registros)) return analisis.registros
  // Respuesta por tipo: el registro puede traer `valores` o los campos planos
  // (adopción desde LedBox/ScaleOS, que devuelven `{ nombre, empresa, … }`).
  return (esquema?.tipos ?? []).flatMap((tipo) =>
    Array.isArray(analisis?.[tipo.id])
      ? analisis[tipo.id].map((registro) => ({
          ...registro,
          tipo: registro?.tipo || tipo.id,
          valores: registro?.valores && typeof registro.valores === 'object' ? registro.valores : registro,
        }))
      : [],
  )
}

/**
 * Salida de `analizar(...)` → contrato de la vista. Tolerante para la
 * adopción: acepta la forma plana (`{ registros }`) o la respuesta por tipo
 * (`{ clientes: [...], equipos: [...] }`), descarta registros de tipos que no
 * están en el esquema y campos desconocidos, completa `id`/`incluir`/`avisos`
 * y recorta a `maxRegistros` por tipo con aviso global.
 */
export function normalizarAnalisisIA(analisis, esquema, opciones = {}) {
  const maxRegistros =
    Number.isFinite(Number(opciones.maxRegistros)) && Number(opciones.maxRegistros) > 0
      ? Math.floor(Number(opciones.maxRegistros))
      : IA_REGISTROS_MAX
  const tipos = esquema?.tipos ?? []
  const idsValidos = new Set(tipos.map((tipo) => tipo?.id))
  const registros = []
  const usados = new Set()
  const avisos = Array.isArray(analisis?.avisos) ? analisis.avisos.map(textoDe).filter(Boolean) : []
  const contador = new Map()
  let descartados = 0
  let recortados = false

  for (const crudo of registrosCrudosIA(analisis, esquema)) {
    const tipoId = textoDe(crudo?.tipo)
    if (!idsValidos.has(tipoId)) {
      descartados += 1
      continue
    }
    const tipo = tipoDeEsquemaIA(esquema, tipoId)
    const cantidad = (contador.get(tipoId) ?? 0) + 1
    contador.set(tipoId, cantidad)
    if (cantidad > maxRegistros) {
      recortados = true
      continue
    }

    const valores = {}
    for (const campo of tipo?.campos ?? []) {
      const valor = crudo?.valores?.[campo.id]
      valores[campo.id] = valor === undefined ? null : valor
    }

    // Clave estable para React y para el mapeo de la app: la del análisis si
    // viene (se tolera `clave` de las apps que ya usan ese nombre) y no choca;
    // si no, una derivada del tipo y la posición.
    let id = textoDe(crudo?.id) || textoDe(crudo?.clave)
    if (!id || usados.has(id)) {
      let numero = cantidad
      id = `ia-${tipoId}-${numero}`
      while (usados.has(id)) {
        numero += 1
        id = `ia-${tipoId}-${numero}`
      }
    }
    usados.add(id)

    registros.push({
      id,
      tipo: tipoId,
      valores,
      incluir: crudo?.incluir === undefined ? true : Boolean(crudo.incluir),
      titulo: textoDe(crudo?.titulo) || undefined,
      avisos: Array.isArray(crudo?.avisos) ? crudo.avisos.map(textoDe).filter(Boolean) : [],
    })
  }

  if (descartados > 0) {
    avisos.push(`Descartamos ${descartados} registro${descartados === 1 ? '' : 's'} sin tipo conocido.`)
  }
  if (recortados) avisos.push(`Recortamos la vista previa a ${maxRegistros} registros por tipo.`)
  return { registros, avisos }
}

/** Registros marcados para crear (los descartados no viajan a `crear`). */
export function registrosIncluidosIA(registros) {
  return (registros ?? []).filter((registro) => registro?.incluir)
}

/**
 * Errores de los obligatorios vacíos, por registro y campo. Solo mira los
 * registros incluidos: un descartado no bloquea la creación.
 * Devuelve `{ valido, errores: Map<idRegistro, { [idCampo]: mensaje }> }`.
 */
export function validarRegistrosIA(registros, esquema) {
  const errores = new Map()
  for (const registro of registros ?? []) {
    if (!registro?.incluir) continue
    const tipo = tipoDeEsquemaIA(esquema, registro.tipo)
    const porCampo = {}
    for (const campo of tipo?.campos ?? []) {
      if (!campo?.obligatorio) continue
      if (valorVacioIA(registro.valores?.[campo.id])) {
        porCampo[campo.id] = 'Completá este campo para crear el registro.'
      }
    }
    if (Object.keys(porCampo).length > 0) errores.set(registro.id, porCampo)
  }
  return { valido: errores.size === 0, errores }
}

/**
 * Resultado de `crear(...)` → contrato de la vista. `creados` queda en `null`
 * cuando la app no informó el detalle: la vista no inventa el conteo (§15.1,
 * cero éxito falso). `total` es cuántos registros se mandaron a crear.
 */
export function normalizarResultadoIA(resultado, opciones = {}) {
  const errores = Array.isArray(resultado?.errores) ? resultado.errores.map(textoDe).filter(Boolean) : []
  const advertencias = Array.isArray(resultado?.advertencias) ? resultado.advertencias.map(textoDe).filter(Boolean) : []
  const bruto = resultado?.creados
  const numero = bruto === undefined || bruto === null || bruto === '' ? null : Number(bruto)
  const total = Number.isFinite(Number(opciones.total)) ? Number(opciones.total) : null
  return {
    creados: numero !== null && Number.isFinite(numero) ? Math.max(0, numero) : null,
    total,
    errores,
    advertencias,
  }
}
