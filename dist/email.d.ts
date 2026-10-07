import type { AppIdentity } from './utils.js'

export type DetalleCorreo = Readonly<{ etiqueta: string; valor: string }>
export type AccionCorreo = Readonly<{ etiqueta: string; url: string }>
export type CorreoTransaccional = Readonly<{
  identidad: AppIdentity
  tema?: 'editorial'
  idioma?: 'es' | 'en'
  asunto: string
  preheader: string
  motivo: string
  detalles: ReadonlyArray<DetalleCorreo>
  accion: AccionCorreo | null
  cierre: string
  firma: string
}>

export function crearCorreoTransaccional(datos: {
  identidad: AppIdentity | Parameters<typeof import('./utils.js').crearIdentidadApp>[0]
  tema?: 'editorial'
  idioma?: 'es' | 'en'
  asunto: string
  preheader?: string
  motivo: string
  detalles?: Array<{ etiqueta: unknown; valor: unknown }>
  accion?: { etiqueta: string; url: string } | null
  cierre?: string
  firma?: string
}): CorreoTransaccional
export function escaparCorreoHtml(valor?: unknown): string
export function renderCorreoTexto(correo: CorreoTransaccional | Parameters<typeof crearCorreoTransaccional>[0]): string
export function renderCorreoHtml(correo: CorreoTransaccional | Parameters<typeof crearCorreoTransaccional>[0]): string
