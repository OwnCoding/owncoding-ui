// Tipos del subpath `owncoding-ui/ia` — motor server de «Carga con IA» (#12).
// Declaraciones escritas a mano (el paquete no usa TypeScript); el build las
// copia tal cual a `dist/ia.d.ts`.

// ── Esquema declarativo (el mismo que dibuja el diálogo) ────────────────────

export type TipoCampoIA = 'texto' | 'numero' | 'moneda' | 'fecha' | 'select' | (string & {})
export type OpcionIA = { value: string; label: string }
export type CampoEsquemaIA = {
  id: string
  label: string
  tipo: TipoCampoIA
  obligatorio?: boolean
  ayuda?: string
  opciones?: Array<OpcionIA | string>
  /** Moneda del campo `moneda` (por defecto `PYG`). */
  moneda?: string
  maxLargo?: number
}
export type TipoEsquemaIA = {
  id: string
  label: string
  singular?: string
  plural?: string
  icono?: string
  campos: CampoEsquemaIA[]
}
export type EsquemaIA = { tipos: TipoEsquemaIA[] }
/** Registro normalizado por tipo: los campos del esquema + `avisos` opcionales. */
export type RegistroIA = Record<string, unknown> & { avisos?: string[] }
/** Salida de `analizar`: un arreglo de registros por tipo + avisos globales. */
export type AnalisisIA = { avisos: string[]; [tipoId: string]: RegistroIA[] | string[] }

// ── Configuración y proveedor ───────────────────────────────────────────────

/** Modelo sugerido si no hay `IA_MODELO`. */
export const IA_MODELO_PREDETERMINADO: string
/** Base sugerida si no hay `IA_BASE_URL` (API compatible con OpenAI). */
export const IA_BASE_URL_PREDETERMINADA: string
/** Ventana del rate-limit por organización (15 min), en milisegundos. */
export const IA_VENTANA_MS: number
/** Largo máximo del texto pegado, en caracteres. */
export const IA_TEXTO_MAX: number
/** Máximo de registros por tipo en una pasada. */
export const IA_REGISTROS_MAX: number
/** Llamadas por organización dentro de la ventana de rate-limit. */
export const IA_RATE_LIMIT: number
/** Tope de tokens de la respuesta del proveedor. */
export const IA_TOKENS_MAX: number
/** Timeout de la llamada al proveedor, en milisegundos. */
export const IA_TIMEOUT_MS: number
/** Tipos de campo que entiende el esquema. */
export const CAMPOS_IA: readonly string[]

export type ConfigMotorIA = { apiKey: string; modelo: string; baseUrl: string }
export type MensajeIA = { role: 'system' | 'user'; content: string }
export interface ProveedorIA {
  readonly id: string
  readonly label: string
  analizar(mensajes: MensajeIA[], opciones?: { maxTokens?: number; timeoutMs?: number }): Promise<string>
}

/** Error con mensaje para mostrar; `codigo` para mapear la respuesta HTTP. */
export class IAError extends Error {
  constructor(mensaje?: string, codigo?: string)
  readonly codigo?: string
}

export function configIA(env?: Record<string, string | undefined>): ConfigMotorIA | null
export function estadoIA(env?: Record<string, string | undefined>): { configurada: boolean; modelo: string | null }
export function proveedorIA(config: ConfigMotorIA, fetchImpl?: typeof fetch): ProveedorIA

// ── Prompt, JSON y validación ───────────────────────────────────────────────

export function instruccionesIA(opciones?: { esquema?: EsquemaIA; tipos?: string[]; aplicacion?: string }): string
export function mensajesDeCargaIA(opciones?: { texto?: string; tipos?: string[]; esquema?: EsquemaIA; aplicacion?: string }): MensajeIA[]
export function parsearSalidaIA(crudo: string): unknown
export function fechaDeTextoIA(valor?: unknown): string | null
export function validarAnalisisIA(
  datos?: unknown,
  opciones?: { esquema?: EsquemaIA; tipos?: string[]; maxRegistros?: number },
): AnalisisIA

// ── Orquestador, motor y rate-limit ─────────────────────────────────────────

export function analizarCargaIA(opciones: {
  texto: string
  tipos?: string[]
  esquema?: EsquemaIA
  proveedor: ProveedorIA
  aplicacion?: string
  maxTexto?: number
  maxRegistros?: number
}): Promise<AnalisisIA>

export function motorIA(opciones?: {
  esquema?: EsquemaIA
  tipos?: string[]
  env?: Record<string, string | undefined>
  fetchImpl?: typeof fetch
  proveedor?: ProveedorIA
  aplicacion?: string
  maxTexto?: number
  maxRegistros?: number
}): {
  configurada: boolean
  modelo: string | null
  analizar(texto: string, tipos?: string[]): Promise<AnalisisIA>
}

export function crearLimitadorIA(opciones?: {
  limite?: number
  ventanaMs?: number
  ahora?: () => number
}): {
  permitir(clave: string): { permitido: boolean; restantes: number; esperaMs: number }
  limpiar(): void
  readonly tamano: number
}
