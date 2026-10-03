// Tipos de la entrada pura `owncoding-ui/utils` (declaraciones escritas a mano,
// sin TypeScript en el paquete). Es el espejo sin React de la lógica
// compartida: sirve para server components, route handlers, jobs y scripts.
// `test/utils-subpath.test.js` verifica que todo export del runtime tenga su
// declaración acá y que el subpath no se despegue de `owncoding-ui`.

/** Tono semántico canónico del mapa compartido (`utils/tonos.js`). */
export type TonoCanonico = 'ok' | 'warn' | 'bad' | 'mute' | 'info' | 'pass' | 'fono'
/** Tono aceptado por los objetos: canónico o alias de otras apps. */
export type Tono = TonoCanonico | 'neutral' | 'neutro' | 'accent' | 'acento' | 'danger' | 'error' | 'success' | 'warning' | (string & {})
/** Moneda de los montos del sistema. */
export type Moneda = 'PYG' | 'USD' | 'BRL' | 'EUR' | 'USDT' | (string & {})

/** Identidad visible de la app. `version` usa X.Y.Z o X.Y.Z-rc.N. */
export type AppIdentity = Readonly<{
  nombre: string
  version: string
  etiquetaVersion: string
  url: string
  logoUrl: string
  soporteUrl: string
  color: string
  credito: string | null
  creditoUrl: string
}>
export const VERSION_APP_RE: RegExp
export function esVersionApp(version?: unknown): boolean
export function etiquetaVersionApp(version: string): string
export function crearIdentidadApp(identidad: {
  nombre: string
  version: string
  url?: string
  logoUrl?: string
  soporteUrl?: string
  color?: string
  credito?: string | null
  creditoUrl?: string
}): AppIdentity

// ── Lógica compartida ───────────────────────────────────────────────────────

export function cn(...inputs: any[]): string
export function primerNombre(nombre: string): string
export function normalizarNombre(nombre: string, opciones?: { apellidosPrimero?: 'sifen' | boolean }): string
export function nombrePartes(nombre: string): { nombres: string; apellidos: string }
export function esApellidosPrimero(nombre: string): boolean
export function esRazonSocial(nombre: string): boolean

/** Tratamiento visual verificable de una marca financiera. */
export type VisualFinanciero = {
  tipo: 'archivo' | 'horizontal-contained' | 'marca-contained' | 'monograma' | 'texto'
  estado: 'oficial' | 'fallback' | 'permiso-pendiente' | 'producto-padre' | string
  archivo?: string
  asset?: string
  empaquetado?: string
  descripcion?: string
  marcaPadre?: string
  fondo?: string
  padding?: boolean
}
export type EvidenciaRedistribucionMarca = Readonly<{
  permitida: boolean
  evidencia: string | null
  base?: string
  confirmadaEn?: string
  alcance?: readonly string[]
}>
export type OperadorMarcaFinanciera = Readonly<{
  nombreLegal: string
  fuenteOficial: string
  verificadoEn: string
  ruc?: string
}>
export type RelacionFinanciera = Readonly<{
  marca: string
  alias: readonly string[]
  institucionPadre?: string
  financialProvider?: string
  fuenteRelacion: string
  verificadoEnRelacion: string
  actividad: 'activa' | 'inactiva' | string
  fuenteActividad: string
  operador: OperadorMarcaFinanciera
  reguladores?: readonly string[]
}>

/** Nombres del catálogo financiero predeterminado de Paraguay. */
export type BancoParaguay = string
export type RegistroLogoBanco = ({
  banco: string
  categoria: 'banco' | 'financiera' | 'cooperativa' | 'desconocida' | string
  estado: string
  variante: 'compacto' | 'horizontal'
  visual: VisualFinanciero
  redistribucion?: EvidenciaRedistribucionMarca
  fuenteOficial?: string | null
  verificadoEn?: string | null
  aliasHistorico?: string
  generico?: boolean
} & (
  | { tipo: 'archivo'; archivo: string; chip?: boolean; marca?: string }
  | { tipo: 'marca'; marca: string }
  | { tipo: 'monograma'; iniciales: string; color: string }
))

export type EntradaLogoBanco =
  | {
      redirigeA?: never
      archivo?: string
      marca?: string
      monograma?: string
      color?: string
      chip?: boolean
      alias?: string[]
      categoria: string
      estado: string
      fuenteOficial?: string
      verificadoEn?: string
      redistribucion?: EvidenciaRedistribucionMarca
      variantes: { compacto: VisualFinanciero; horizontal: VisualFinanciero }
    }
  | {
      redirigeA: string
      alias?: string[]
      categoria: 'legado'
      estado: 'legado'
      verificadoEn?: string
      fuenteOficial?: string
      variantes?: never
    }

export type CoberturaMarcaFinanciera = {
  nombre: string
  categoria: string
  estado: string
  fuenteOficial: string | null
  verificadoEn?: string
  redistribucion?: EvidenciaRedistribucionMarca
  marcaPadre?: string | null
  relacionFinanciera?: RelacionFinanciera | null
  variantes: { compacto: VisualFinanciero; horizontal: VisualFinanciero }
}

export const BANCOS_PARAGUAY: string[]
export const BANCOS_Y_FINANCIERAS_PARAGUAY: string[]
export const COOPERATIVAS_PARAGUAY: string[]
export const LOGOS_BANCOS: Record<string, EntradaLogoBanco>
export const COLORES_BANCO_RESPALDO: string[]
export const FECHA_VERIFICACION_MARCAS_FINANCIERAS: string
export function normalizarBanco(nombre: string): string
export function inicialesDeBanco(nombre: string): string
export function colorDeBanco(nombre: string): string
/** @deprecated Usá `compacto`. Se mantendrá por al menos dos releases menores. */
export type VarianteLogoFinancieroLegacy = 'compact'
export type VarianteLogoFinanciero = 'compacto' | 'horizontal' | VarianteLogoFinancieroLegacy
export function logoDeBanco(nombre: string, variante?: VarianteLogoFinanciero): RegistroLogoBanco | null
export function coberturaBancos(catalogo?: readonly string[]): CoberturaMarcaFinanciera[]
export function sugerenciasDeBanco(consulta?: string, bancos?: readonly string[]): string[]

export type EntradaMarcaMedioPago =
  | {
      redirigeA?: never
      categoria: string
      alias?: string[]
      monograma?: string
      color?: string
      fuenteOficial?: string
      verificadoEn?: string
      estado: string
      redistribucion?: EvidenciaRedistribucionMarca
      marcaPadre?: string
      relacionFinanciera?: RelacionFinanciera
      variantes: { compacto: VisualFinanciero; horizontal: VisualFinanciero }
    }
  | {
      redirigeA: string
      categoria: 'legado'
      alias?: string[]
      estado: 'legado'
      verificadoEn?: string
      variantes?: never
    }
export type RegistroLogoMedioPago = {
  marca: string
  tipo: 'archivo' | 'monograma'
  iniciales: string
  color: string
  categoria: string
  estado: string
  redistribucion?: EvidenciaRedistribucionMarca
  variante: 'compacto' | 'horizontal'
  visual: VisualFinanciero
  fuenteOficial?: string | null
  verificadoEn?: string | null
  marcaPadre?: string
  relacionFinanciera?: RelacionFinanciera
  aliasHistorico?: string
  generico?: boolean
}
export const MARCAS_MEDIOS_PAGO: Record<string, EntradaMarcaMedioPago>
export const MEDIOS_PAGO_CON_MARCA: string[]
export function normalizarMarcaPago(nombre: string): string
export function logoDeMedioPago(nombre: string, variante?: VarianteLogoFinanciero): RegistroLogoMedioPago | null
export function coberturaMediosPago(catalogo?: readonly string[]): CoberturaMarcaFinanciera[]
export function sugerenciasDeMarcaPago(consulta?: string, catalogo?: readonly string[]): string[]

export const FECHA_VERIFICACION_RELACIONES_FINANCIERAS: string
export const RELACIONES_FINANCIERAS: Readonly<Record<string, RelacionFinanciera>>
export const MARCAS_CON_RELACION_FINANCIERA: readonly string[]
export function normalizarRelacionFinanciera(texto: string): string
export function relacionFinancieraDe(marca: string): RelacionFinanciera | null
export function buscarRelacionesFinancieras(consulta?: string): RelacionFinanciera[]
export function institucionesSugeridasPorMarca(consulta: string): string[]
export function marcasRelacionadasConInstitucion(institucion: string): string[]

export const TAMANOS_CAMPO: Record<string, string>
export function anchoParaLargo(largo: number): string
export type TamanoModal = 'corto' | 'formulario' | 'amplio' | 'completo'
export const TAMANOS_MODAL: Record<TamanoModal, string>
export const TAMANO_MODAL_PREDETERMINADO: TamanoModal
export const CIERRE_CON_CAMBIOS: { titulo: string; descripcion: string; confirmar: string; seguir: string }
export const GRILLA_DOS_COLUMNAS: string
export const GRILLA_DOS_COLUMNAS_COMPACTA: string
export const PIE_ACCIONES: string
export const PIE_ACCIONES_REVERSO: string
export type ReglaValidacion = (valor: any) => string
export const MENSAJES_VALIDACION: {
  obligatorio: string
  largoMinimo: (minimo: number) => string
  largoMaximo: (maximo: number) => string
  formato: string
  email: string
  minimo: (limite: number) => string
  maximo: (limite: number) => string
}
export const EMAIL_RE: RegExp
export function campoVacio(valor: any): boolean
export function obligatorio(mensaje?: string | ((respaldo: string) => string)): ReglaValidacion
export function largoMinimo(minimo: number, mensaje?: string | ((respaldo: string) => string)): ReglaValidacion
export function largoMaximo(maximo: number, mensaje?: string | ((respaldo: string) => string)): ReglaValidacion
export function patron(expresion: RegExp, mensaje?: string | ((respaldo: string) => string)): ReglaValidacion
export function emailValido(mensaje?: string | ((respaldo: string) => string)): ReglaValidacion
export function minimo(limite: number, mensaje?: string | ((respaldo: string) => string)): ReglaValidacion
export function maximo(limite: number, mensaje?: string | ((respaldo: string) => string)): ReglaValidacion
export function validarCampo(valor: any, reglas?: ReglaValidacion | ReglaValidacion[] | null): string
export function validarCampos(valores: Record<string, any>, reglas?: Record<string, ReglaValidacion | ReglaValidacion[]>): { valido: boolean; errores: Record<string, string>; primerError: string; campos: string[] }
export function limpiarError(errores?: Record<string, string>, campo?: string): Record<string, string>
export const RESULTADOS_VALIDOS: string[]
export function mensajeResultado(accion: 'guardar' | 'copiar' | 'imprimir' | 'enviar', sujeto?: string): string
export function mensajeFallo(accion: 'guardar' | 'copiar' | 'imprimir' | 'enviar'): string
export const ROTULO_DATO: string
export const CELDA_ENCABEZADO: string
export const ROTULO_SECCION: string
export const CELDA_DATO: string
export const CELDA_NUMERO: string
export const CELDA_IDENTIDAD: string
export const CELDA_IDENTIDAD_GRANDE: string

// ── Catálogos por defecto ───────────────────────────────────────────────────

/** Fila bilingüe: español (`ciudad`/`departamento`) e inglés (`city`/`department`). */
export type CiudadParaguay = {
  ciudad: string
  departamento: string
  city: string
  department: string
}
export const CIUDADES_PARAGUAY: CiudadParaguay[]
export const DEPARTAMENTOS_PARAGUAY: string[]
/** Departamento de una ciudad por nombre exacto; `''` si no está en el catálogo. */
export function departamentoDe(ciudad: string): string
export function buscarCiudad(consulta: string, limite?: number): CiudadParaguay[]

export const MODELOS_IPHONE: string[]
export const CAPACIDADES_IPHONE: string[]
export const COLORES_IPHONE: string[]
export const CATEGORIAS_ACCESORIOS: string[]
export const MARCAS_ACCESORIOS: string[]
export function buscarEnCatalogo(consulta: string, catalogo?: any[]): any[]
export function normalizarBusqueda(texto?: string): string

export const PERFILES_DISPOSITIVO: Record<string, { campos: string[]; etiquetas: Record<string, string>; catalogo: Record<string, any> }>
export const CAMPOS_DISPOSITIVO: string[]
export const DISPOSITIVOS_MOBILE: Array<{ nombre: string; codigo?: string }>
export const CONECTIVIDADES_MOVIL: string[]
export function buscarDispositivo(modelos?: any[], texto?: string, opciones?: { porCodigo?: boolean; limite?: number }): any[]
export function opcionesDependiente(modelo: any, campo: string, perfil?: any): string[]
export function limpiarDependientes(valor?: any, modelo?: any, perfil?: any): any
export function etiquetaDispositivo(valor?: any, opciones?: { separador?: string }): string
export function nombreDeDispositivo(modelo?: any): string
export function codigoDeDispositivo(modelo?: any): string

// ── Dinero, fechas, seriales, RUC y teléfono ────────────────────────────────

export type OpcionesSimbolo = { simbolo?: string } | string
/** `opciones` puede ser un vacío (`string`) o `{ vacio, simbolo }`. */
export type OpcionesMonto = { vacio?: string; simbolo?: string }
export const SIMBOLO_PYG: string
export const SIMBOLOS_MONEDA: Record<string, string>
export const LIMITE_MONTO_GENERAL: number
export const LIMITE_MONTO_VENTAS: number
export const LIMITE_MONTO_ALMACENABLE: number
export function formatGs(value: unknown, opciones?: OpcionesSimbolo): string
export function formatGsInput(value: unknown): string
export function parseGsInput(value: unknown): number
export function formatUsd(value: unknown): string
export function formatUsdInput(value: unknown): string
export function parseUsdInput(value: unknown): string
export function formatMoney(value: unknown, currency?: Moneda, opciones?: OpcionesSimbolo): string
export function montoGs(value: unknown, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function montoUsd(value: unknown, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function montoTexto(value: unknown, currency?: Moneda, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function montoConSigno(value: unknown, currency?: Moneda, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function excedeMonto(value: unknown, limite?: number): boolean
export function limiteMonto(max?: number): number
export function errorMonto(value: unknown, max?: number): string
export function largoMaximoMonto(max?: number, opciones?: { decimales?: boolean }): number
export function formatoNumero(value: unknown, opciones?: { decimales?: number; vacio?: string }): string
export function signoDe(value: unknown): '' | '+' | '−'
/** Máscara del campo de monto (conserva el caret al tipear/pegar). */
export function normalizarMontoInput(texto: unknown, moneda?: Moneda, opciones?: { integerOnly?: boolean }): string
export function caretTrasDigitos(display: string, digitos: number): number

/** Opciones de formato: vacío, huso horario (`America/Asuncion`) y hora aparte. */
export type OpcionesFecha = { timeZone?: string; vacio?: string; hora?: string }
export function fechaValida(value: unknown): Date | null
export function fechaHora(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaDia(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaHoraCorta(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaCorta(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
/** Listas densas: `17 sept 26 · 14:30` (la hora aparte con `{ hora }`). */
export function fechaLista(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
/** Listas densas sin hora: `17-sept`. */
export function fechaListaCorta(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
/** Días de calendario hasta la fecha (negativo si ya venció); sin dato, `null`. */
export function diasHasta(fecha: unknown, opciones?: { hoy?: unknown; timeZone?: string }): number | null
/** Tono del vencimiento: `bad` vencido, `warn` dentro de `diasAviso`. */
export function tonoVencimiento(fecha: unknown, opciones?: { hoy?: unknown; diasAviso?: number }): '' | 'bad' | 'warn'

export function imeiValido(valor?: string | null): boolean
export function normalizarImei(valor?: string | null): string
export const LARGO_IMEI: number
export const MENSAJES_IMEI: {
  vacio: string
  obligatorio: string
  incompleto: (faltan: number) => string
  invalido: string
  valido: string
  revisando: string
}
export type EstadoImei = 'vacio' | 'incompleto' | 'invalido' | 'valido'
export function estadoImei(valor?: string | null): EstadoImei
export function analizarImei(valor?: string | null): {
  imei: string
  largo: number
  faltan: number
  completo: boolean
  valido: boolean
  estado: EstadoImei
}
export function separarSeriales(texto?: string, opciones?: { maxLargo?: number }): string[]
export function normalizarSeriales(texto?: string, opciones?: { validar?: (serial: string) => boolean; limite?: number; maxLargo?: number }): { seriales: string[]; repetidos: string[]; invalidos: string[] }
export function ultimos4(serial: string): string
export function partirSerial(serial: string): { prefijo: string; ultimos: string }
export function serialEnmascarado(serial: string): string

export function extraerRuc(texto: string): string
export function esRuc(valor: string): boolean
export const RUC_RE: RegExp

// Identificación fiscal (cosecha de PagaYa, #1).
export const PATRON_RUC: RegExp
export const PATRON_TAX_ID_GENERICO: RegExp
export const MENSAJE_RUC: string
export const MENSAJE_RUC_SIN_DATOS: string
export const MENSAJE_RUC_CONSULTA: string
export function taxIdValid(value: unknown): boolean
export function taxIdGenericoValid(value: unknown): boolean
export function taxIdValidoParaPais(value: unknown, pais?: string): boolean
export function normalizeTaxId(value: unknown): string | null
export function limpiarTaxId(value: unknown, max?: number): string

export function extractTokenFromUrl(url: string): string
export function esToken(valor: string): boolean

export const CODIGOS_PAIS: string[]
export type PaisTelefono = { country: string; countryCode: string; name: string; flag: string; custom?: boolean }
export type TelefonoInternacional = { country: string; countryCode: string; phone: string; e164: string; isValid: boolean }
export const PAISES_TELEFONO: readonly PaisTelefono[]
export function paisTelefonoPorIso(iso: string, locale?: string): PaisTelefono | null
export function paisesDeCodigo(countryCode: string, locale?: string, countries?: readonly (string | PaisTelefono)[]): PaisTelefono[]
export function buscarPaisesTelefono(consulta?: string, countries?: readonly (string | PaisTelefono)[], locale?: string): PaisTelefono[]
/** Parte `+595 981 123 456`, `+595981123456` o el pegado `00595 …`. */
export function parseTelefono(valor: string, countryCodePorDefecto?: string): { countryCode: string; phone: string }
/** Interpreta un valor local/internacional y conserva el ISO en DDI compartidos. */
export function parseTelefonoInternacional(valor: string, country?: string, countryCodePorDefecto?: string): TelefonoInternacional
/** Arma `+<código> <número>`; sin número devuelve `null`. */
export function componerTelefono(datos?: { countryCode?: string; phone?: string }): string | null
/** Devuelve E.164 cuando es válido; inválido/incompleto devuelve `''`. */
export function telefonoE164(valor: string, country?: string): string
export function telefonoInternacionalValido(valor: string, country?: string): boolean
/** Formato canónico agrupado: `+595 981 123 456`; sin teléfono, `''`. */
export function normalizarTelefono(telefono: string, countryCode?: string): string
export function internationalPhone(telefono: string, countryCode?: string): string
export function whatsappUrl(telefono: string, mensaje?: string, countryCode?: string): string
export function soloDigitos(valor: string, max?: number): string
export function codigoPais(telefono: string): string
export function telefonoVisible(telefono: string, countryCode?: string): string
/** Móvil PY (9 dígitos tras +595); otros países, 6–12 dígitos. */
export function telefonoValido(telefono: string, countryCode?: string): boolean
export const MENSAJE_TELEFONO: string

// ── Estados y tonos ─────────────────────────────────────────────────────────

export const TONOS: { punto: Record<string, string>; chip: Record<string, string>; texto: Record<string, string> }
export const TONOS_ALIAS: Record<string, TonoCanonico>
export function tonoCanonico(valor: string | null | undefined): TonoCanonico
export function puntoDeTono(valor: string | null | undefined): string
export function chipDeTono(valor: string | null | undefined): string
export function textoDeTono(valor: string | null | undefined): string

export type EstadoChipConfig = { etiqueta: string; tono: TonoCanonico; icono: string }
export const ESTADOS_ITEM: Record<string, EstadoChipConfig>
export const ESTADOS_CHIP: Record<string, EstadoChipConfig>
export const ESTADOS_LOCK: Record<string, EstadoChipConfig>
export const LOCKS_DISPOSITIVO: Record<string, string>
export const GRADOS_CONDICION: Record<string, { etiqueta: string; tono: TonoCanonico; descripcion: string }>
export const CONDICION_UNIDAD: Record<'NEW' | 'USED' | 'REFURBISHED', string>
export function etiquetaCondicion(clave?: string): string
export const COLOR_BADGE: Record<string, string>
export const UMBRAL_BATERIA_OK: number
export const UMBRAL_BATERIA_ATENCION: number
export function estadoItem(clave: string): EstadoChipConfig
export function estadoChip(clave: string): EstadoChipConfig
export function estadoLock(clave: string): EstadoChipConfig
export function gradoCondicion(clave: string): { etiqueta: string; tono: TonoCanonico; descripcion: string } | null
export function colorBadge(tono: string): string
export function tonoBateria(porcentaje: number | string | null | undefined): TonoCanonico

export const CATEGORIAS_PRODUCTO: Array<{ id?: string; etiqueta: string; icono: string; alias?: string[] }>
export const ICONO_CATEGORIA: Record<string, string>
export function normalizarCategoria(texto: string): string
export function categoriaDe(texto: string): string
export function iconoDeCategoria(texto: string): string
export function etiquetaDeCategoria(texto: string): string

export const COLORES_AVATAR: Record<string, string>
export function inicialesDeNombre(nombre: string): string
export function claveColorDeNombre(nombre: string): string
export function colorDeNombre(nombre: string): string
export function identidadDeUsuario(fuente?: any): { nombre: string; primerNombre: string; fotoLocal: string; picture: string; hasAvatar?: boolean; scope: string }
export function resumenPresencia(personas?: any[]): string
export const ESTADOS_PRESENCIA: Record<string, { etiqueta: string; punto: string }>

// ── Agenda y rangos ─────────────────────────────────────────────────────────

export const DIAS_SEMANA: string[]
export function esClaveDia(valor: unknown): boolean
export function claveDia(fecha: Date | string): string
export function fechaDeClave(clave: string): Date | null
export function hoyClave(): string
export function sumarDias(clave: string, dias: number): string
export function sumarMeses(clave: string, meses: number): string
export function indiceSemana(clave: string): number
export function rangoSemana(clave: string): { desde: string; hasta: string; dias: string[] }
export function rangoMes(clave: string): { desde: string; hasta: string; dias: string[] }
export function mismoMes(a: string, b: string): boolean
export function etiquetaMes(clave: string): string
export function etiquetaDia(clave: string): string
export function etiquetaDiaCorta(clave: string): string
export type ItemCalendario = { id: string; fecha: string; titulo: string; hora?: string; detalle?: string; tono?: Tono; href?: string }
export function agruparPorDia(items: ItemCalendario[], claveDe?: (item: ItemCalendario) => string): Map<string, ItemCalendario[]>

export const PERIODOS_FECHA: string[]
export const ETIQUETA_PERIODO: Record<string, string>
export function esAtajo(periodo: string): boolean
export function rangoDePeriodo(periodo: string, hoy?: string): { desde: string; hasta: string }
export function periodoDeRango(desde: string, hasta: string, hoy?: string): string | null
export function rangoInvertido(desde: string, hasta: string): boolean

// ── Abastecimiento y recepción ──────────────────────────────────────────────

export const PRIORIDADES_COMPRA: Record<string, { etiqueta: string; tono: string; orden: number }>
export function claveDePrioridad(clave?: string): string
export function prioridadDe(clave?: string): { etiqueta: string; tono: string; orden: number }
export function etiquetaPrioridad(clave?: string): string
export function tonoPrioridad(clave?: string): string
export function ordenDePrioridad(clave?: string): number
export function ordenarPorPrioridad<T>(lista?: T[], clave?: string): T[]
export const ORIGENES_NECESIDAD: Record<string, { etiqueta: string; tono: string; icono: string }>
export function origenDe(clave?: string): { etiqueta: string; tono: string; icono: string }
export function etiquetaOrigen(clave?: string): string
export function tonoOrigen(clave?: string): string
export function iconoOrigen(clave?: string): string
export const ESTADOS_NECESIDAD: Record<string, { etiqueta: string; tono: string; icono: string }>
export function claveDeEstado(clave?: string): string
export function estadoNecesidad(clave?: string): { etiqueta: string; tono: string; icono: string }
export function etiquetaNecesidad(clave?: string): string
export function tonoNecesidad(clave?: string): string
export const PASOS_NECESIDAD: string[]
export const ESTADOS_COMPRA: Record<string, { etiqueta: string; tono: string; icono: string }>
export function claveDeEstadoCompra(clave?: string): string
export function estadoCompra(clave?: string): { etiqueta: string; tono: string; icono: string }
export function etiquetaCompra(clave?: string): string
export function tonoCompra(clave?: string): string
export const ESTADOS_ENVIO: Record<string, { etiqueta: string; tono: string; icono: string }>
export function claveDeEstadoEnvio(clave?: string): string
export function estadoEnvio(clave?: string): { etiqueta: string; tono: string; icono: string }
export function etiquetaEnvio(clave?: string): string
export function tonoEnvio(clave?: string): string
export const PASOS_ENVIO: string[]
export const METODOS_ENVIO: Record<string, { etiqueta: string; icono: string }>
export function claveDeMetodoEnvio(clave?: string): string
export function metodoEnvio(clave?: string): { etiqueta: string; icono: string }
export function etiquetaMetodoEnvio(clave?: string): string
export function iconoMetodoEnvio(clave?: string): string
export const ESTADOS_RECEPCION: Record<string, { etiqueta: string; tono: string; icono: string }>
export function claveDeEstadoRecepcion(clave?: string): string
export function estadoRecepcion(clave?: string): { etiqueta: string; tono: string; icono: string }
export function etiquetaRecepcion(clave?: string): string
export function tonoRecepcion(clave?: string): string
export const COLOR_DE_TONO: Record<string, string>
export function colorDeTono(tono?: string): string

export const ESTADOS_REVISION: Record<string, { etiqueta: string; etiquetaPlural: string; tono: string }>
export const INCIDENCIAS: string[]
export function claveRevision(estado?: string): string
export function esIncidencia(estado?: string): boolean
export function etiquetaRevision(estado?: string): string
export function etiquetaPluralRevision(estado?: string): string
export function tonoRevision(estado?: string): string

// ── Impresión (modelos de texto, sin browser) ───────────────────────────────

export const ESTADO_IMPRESORA: Record<string, string>
export const ETIQUETA_ESTADO: Record<string, string>
export const TONO_ESTADO: Record<string, Tono>
export const ETIQUETA_TRABAJO: Record<string, string>
export function etiquetaTrabajo(estado: string): string
export function colorTrabajo(estado: string): string
export function conexionDeDestino(destino: string): { tipo: string; direccion: string } | null
export function destinoDeConexion(conexion: { tipo: string; direccion: string }): string
export function estadoDeDiagnostico(resultado: unknown): string
export function motivoDeDiagnostico(resultado: unknown): string
export function textoVerificacion(estado: string): string
export function agregarEstado(estado: any, nuevo: any): any
export function crearTicket(datos: any, opciones?: any): string
export function columnasDeAncho(ancho: number): number
export function envolver(texto: string, ancho: number): string[]
export function repartirLinea(izquierda: string, derecha: string, ancho: number): string
export function bloqueFirma(opciones?: any): string
export const AVANCES_FIRMA: any
export const VARIANTES_CORTE: any
export function paginaDePrueba(opciones?: any): { base64: () => string; lineas: () => string[]; ref: string; validacion: string; sufijo: string; validador: string; corte: string }
export function paginaDePruebaSimple(opciones?: any): { base64: () => string; lineas: () => string[]; ref: string; validacion: string; sufijo: string; validador: string; corte: string }
export const TIPOS_PRUEBA: Record<string, string>
export const TIPOS_TICKET_PRUEBA: Record<string, string>
export const ANCHOS_PRUEBA: number[]
export const CORTES_PRUEBA: string[]
export const PLANTILLA_PRUEBA: { tipo: string; ancho: number; incluyeFecha: boolean; corte: string; copias: number }
export function plantillaDePrueba(datos?: Record<string, any>): { tipo: string; ancho: number; incluyeFecha: boolean; corte: string; copias: number }

// ── Ciclo de guardado y overlays (cosecha de ScaleOS) ───────────────────────

export const AVISO_REFRESCO: string
export function crearEnvioUnico(enviar: (evento?: unknown) => unknown): { readonly enCurso: boolean; ejecutar(evento?: unknown): Promise<unknown> }
export function completeSave(cerrar?: () => void, refrescar?: () => void | Promise<void>, opciones?: { avisar?: (mensaje: string) => void }): Promise<boolean>
export function crearPilaCapas(): {
  agregar(id: symbol): void
  insertar(id: symbol, indice: number): void
  quitar(id: symbol): void
  esSuperior(id: symbol): boolean
  readonly tamano: number
  ids(): symbol[]
}
export function crearRegistroPendientes(): { registrar(id: symbol, pendiente: boolean): number; readonly bloqueado: boolean; readonly cantidad: number }

// ── Utilidades puntuales ────────────────────────────────────────────────────

export function registroConsentimiento(datos?: { finalidad?: string; aceptado?: boolean; version?: string | number; canal?: string; fecha?: Date | string | number; titular?: string }): { finalidad: string; aceptado: boolean; version: string; canal: string; fecha: string; titular: string }
export function rutaDeAviso(aviso?: Record<string, any>): string
export function payloadPush(aviso?: Record<string, any>, opciones?: { app?: string; title?: string; body?: string }): { title: string; body: string; data: { ruta: string; id: string; tono: string } }
export function enHorarioSilencioso(fecha?: Date | string | number, opciones?: { desde?: number; hasta?: number }): boolean
export function partesVersion(valor?: string): number[]
export function compararVersiones(a?: string, b?: string): -1 | 0 | 1
export function hayVersionNueva(actual?: string, publicada?: string): boolean

export const QR_OPCIONES: { ancho: number; nivel: string; margen: number }
export function qrDataUrl(valor: string, opciones?: { ancho?: number; nivel?: string; margen?: number }): Promise<string>

export function normalizarPersonaTexto(texto?: unknown): string
export function etiquetaPersona(persona?: Record<string, any>): string
export function filtrarPersonas(personas?: Array<Record<string, any>>, termino?: string): Array<Record<string, any>>
export function ordenarPersonas(personas?: Array<Record<string, any>>, uso?: Record<string, { usos: number; ultima: number }>, opciones?: { priorizarActivos?: boolean }): Array<Record<string, any>>
export const CLAVE_USO_PERSONAS: string
export function leerUsoPersonas(clave?: string, almacen?: Storage | null): Record<string, { usos: number; ultima: number }>
export function registrarUsoPersona(clave?: string, id?: string, almacen?: Storage | null, ahora?: number): void

// ── «Carga con IA»: contrato puro (#11) ─────────────────────────────────────

export const IA_TEXTO_MAX: number
export const IA_REGISTROS_MAX: number
export const IA_RATE_LIMIT: number
export const IA_TOKENS_MAX: number
export const IA_TIMEOUT_MS: number
export const IA_BOTON: string
export const IA_TOOLTIP: string
export const IA_TITULO: string
export const CAMPOS_IA: readonly string[]
/** Umbrales del ancho adaptativo del diálogo (#16). */
export const IA_DIALOGO_COMPLETO_REGISTROS: number
export const IA_DIALOGO_COMPLETO_CAMPOS: number

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
export type RegistroIA = {
  id?: string
  tipo: string
  valores: Record<string, unknown>
  incluir?: boolean
  titulo?: string
  avisos?: string[]
}
export type RegistroNormalizadoIA = {
  id: string
  tipo: string
  valores: Record<string, unknown>
  incluir: boolean
  titulo?: string
  avisos: string[]
}
export type AnalisisIA = { registros?: RegistroIA[]; avisos?: string[] } & Record<string, unknown>
export type ResultadoCreacionIA = { creados?: number | null; errores?: string[]; advertencias?: string[] }
export type ConfigIA = { configurada: boolean; modelo?: string | null; tipos?: string[] }
export type ResultadoIA = { creados: number | null; total: number | null; errores: string[]; advertencias: string[] }

export function tipoDeEsquemaIA(esquema?: EsquemaIA | null, tipoId?: string): TipoEsquemaIA | null
export function campoDeTipoIA(tipo?: TipoEsquemaIA | null, campoId?: string): CampoEsquemaIA | null
export function opcionesDeCampoIA(campo?: CampoEsquemaIA | null): OpcionIA[]
export function tituloDeRegistroIA(registro?: Partial<RegistroIA> | null, tipo?: TipoEsquemaIA | null): string
export function valorVacioIA(valor?: unknown): boolean
export function tamanoDialogoIA(
  fase?: string,
  opciones?: { registros?: unknown[]; esquema?: EsquemaIA | null },
): 'amplio' | 'completo'
export function normalizarAnalisisIA(
  analisis?: unknown,
  esquema?: EsquemaIA | null,
  opciones?: { maxRegistros?: number },
): { registros: RegistroNormalizadoIA[]; avisos: string[] }
export function registrosIncluidosIA(registros?: RegistroNormalizadoIA[] | null): RegistroNormalizadoIA[]
export function validarRegistrosIA(
  registros?: RegistroNormalizadoIA[] | null,
  esquema?: EsquemaIA | null,
): { valido: boolean; errores: Map<string, Record<string, string>> }
export function normalizarResultadoIA(resultado?: ResultadoCreacionIA | null, opciones?: { total?: number }): ResultadoIA

/** OwnData snapshot metadata is preserved, not interpreted as contact/stock authority. */
export type OwnDataRucResult = {
  name: string; fullRuc: string; reviewRequired: true
  ownData: {
    ruc: string; dv: string | number; nameOfficial: string; equivalenceRaw: string | null; stateRaw: string | null; sourcePartition?: number
    requestId?: string; environment: 'test' | 'live'
    quota: { limit: number; used: number; remaining: number; day: string; resetAfter: number }
    provenance: { source: 'dnit_official_snapshot'; sourcePage: string; publicationDate: string; publishedText: string; importedAt: string; snapshotHash: string }
  }
}
export type OwnDataRucError = Error & { code: string; status: number; retryAfter?: number; requestId?: string }
export function mapOwnDataRucResponse(envelope: unknown, requestedRuc: string): OwnDataRucResult
export function mapOwnDataRucError(envelope: unknown): OwnDataRucError
export function createOwnDataRucProvider(options: { lookup: (ruc: string) => Promise<unknown> }): (ruc: string) => Promise<OwnDataRucResult>
