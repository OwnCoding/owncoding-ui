// Tipos de OwnCoding UI (declaraciones escritas a mano, sin TypeScript en el
// paquete). Cubren la superficie que las apps usan de verdad: los objetos de
// los lotes LedBox/lote 2, los campos, los estados, las tablas y el dinero.
// Un objeto sin props documentadas se declara con índices abiertos: se puede
// usar igual y las props se van tipando cuando la app las adopta.
//
// Los `.d.ts` son solo del consumidor: el paquete sigue distribuyéndose en
// JS/JSX. Build: `scripts/build.mjs` copia este archivo a `dist/index.d.ts`.

import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  RefAttributes,
  RefObject,
  SelectHTMLAttributes,
  SVGProps,
  TextareaHTMLAttributes,
} from 'react'

/** Tono semántico canónico del mapa compartido (`utils/tonos.js`). */
export type TonoCanonico = 'ok' | 'warn' | 'bad' | 'mute' | 'info' | 'pass' | 'fono'
/** Tono aceptado por los objetos: canónico o alias de otras apps. */
export type Tono = TonoCanonico | 'neutral' | 'neutro' | 'accent' | 'acento' | 'danger' | 'error' | 'success' | 'warning' | (string & {})
/** Moneda de los montos del sistema. */
export type Moneda = 'PYG' | 'USD' | 'BRL' | 'EUR' | 'USDT' | (string & {})
/** Vistas de tablero/lista. */
export type Vista = 'lista' | 'tablero' | (string & {})

// ── Primitivas y contenedores ───────────────────────────────────────────────

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'success' | 'danger' | 'outline' | 'ghost'
}
export function Button(props: ButtonProps): ReactElement

export type InputProps = InputHTMLAttributes<HTMLInputElement>
export const Input: ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>>

export function PasswordInput(props: InputProps): ReactElement

export function PinInput(props: {
  value: string
  onChange: (value: string) => void
  onComplete?: () => void
  length?: number
  autoFocus?: boolean
  disabled?: boolean
  inputRef?: Ref<HTMLInputElement>
  ariaLabel?: string
  className?: string
  id?: string
}): ReactElement

export const MoneyInput: ForwardRefExoticComponent<
  Omit<InputProps, 'value' | 'onChange'> & {
    currency?: Moneda
    /** Pisa el prefijo del campo (por defecto el de `SIMBOLOS_MONEDA`). */
    symbol?: string
    value: number | string | null
    onValueChange?: (value: number | '' | string) => void
    max?: number
    maxLength?: number
    /** Fuerza enteros aunque la moneda admita decimales (#2). */
    integerOnly?: boolean
  } & RefAttributes<HTMLInputElement>
>

export function Money(props: { value: number | string | null | undefined; currency?: Moneda; simbolo?: string; className?: string }): ReactElement

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>
export function Select(props: SelectProps): ReactElement
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>
export function Textarea(props: TextareaProps): ReactElement
export type LabelProps = HTMLAttributes<HTMLLabelElement>
export function Label(props: LabelProps): ReactElement
export function Eyebrow(props: HTMLAttributes<HTMLDivElement>): ReactElement
export function Card(props: HTMLAttributes<HTMLDivElement>): ReactElement

export type TamanoModal = 'corto' | 'formulario' | 'amplio' | 'completo'
export function Modal(props: { open: boolean; onClose?: () => void; title?: ReactNode; children?: ReactNode; size?: TamanoModal; className?: string; busy?: boolean }): ReactElement | null
export function FormActions(props: { children?: ReactNode; className?: string }): ReactElement
export function SaveActions(props: { pendiente?: boolean; children?: ReactNode; cancelLabel?: string | false; className?: string }): ReactElement
export function useDialogClose(): (() => void) | undefined
export function useDialogPending(pendiente: boolean): void
export function conFormulario(children: ReactNode, formId?: string): ReactNode
export function ConfirmDialog(props: {
  open: boolean
  onCancel?: () => void
  onConfirm?: () => void
  title?: string
  description?: ReactNode
  confirmLabel?: string
  variant?: 'primary' | 'danger' | 'success' | 'outline' | 'ghost'
  busy?: boolean
}): ReactElement

export function Badge(props: HTMLAttributes<HTMLSpanElement> & { color?: 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'slate' }): ReactElement
export function Dot(props: { color?: 'green' | 'red' | 'blue' | 'slate' | 'orange'; pulse?: boolean; className?: string }): ReactElement
export function IconAction(props: { icon: string; label: string; tone?: Tono; onClick?: () => void; disabled?: boolean; size?: 'sm' | 'touch' }): ReactElement
export function Drawer(props: { open: boolean; onClose?: () => void; title?: ReactNode; children?: ReactNode; side?: 'left' | 'right'; className?: string; busy?: boolean }): ReactElement | null
export function ToastProvider(props: { children?: ReactNode; demo?: boolean }): ReactElement
export function useToast(): { success: (title: string, description?: string) => void; error: (title: string, description?: string) => void; info: (title: string, description?: string) => void }
export function Skeleton(props: { className?: string }): ReactElement
export function EmptyState(props: { icon?: string; title?: ReactNode; description?: ReactNode; action?: ReactNode; compact?: boolean; className?: string }): ReactElement
export function ErrorState(props: { title?: string; description?: ReactNode; onRetry?: () => void }): ReactElement
export function Aviso(props: HTMLAttributes<HTMLElement> & { tono?: 'error' | 'ok' | 'warn'; como?: 'p' | 'div'; compact?: boolean }): ReactElement
export function Nota(props: HTMLAttributes<HTMLElement> & { tono?: 'warn' | 'info' | 'neutro'; como?: 'p' | 'div'; compact?: boolean }): ReactElement
export function PageHeader(props: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; backTo?: () => void; eyebrow?: ReactNode; migas?: Array<{ etiqueta: ReactNode; href?: string }> }): ReactElement
export function FormField(props: { label?: ReactNode; hint?: ReactNode; error?: ReactNode; children?: ReactNode; htmlFor?: string; descripcionId?: string }): ReactElement
export function SectionState(props: { estado?: 'vacio' | 'cargando' | 'error'; title?: ReactNode; description?: ReactNode; icon?: string; action?: ReactNode; compact?: boolean; onRetry?: () => void; className?: string }): ReactElement

export type DataTableColumn<Row = Record<string, unknown>> = {
  key: string
  label: ReactNode
  align?: 'left' | 'right' | 'center'
  render?: (row: Row) => ReactNode
}
export function DataTable<Row = Record<string, unknown>>(props: {
  columns: DataTableColumn<Row>[]
  rows: Row[]
  emptyLabel?: string
  loading?: boolean
  mobileCard?: (row: Row) => ReactNode
  className?: string
}): ReactElement

export function Stat(props: { label?: ReactNode; valor?: ReactNode; delta?: number; sub?: ReactNode; nota?: ReactNode; tono?: Tono; destacado?: boolean; deltaComo?: 'texto' | 'chip'; barra?: 'fono' | 'ok' | 'bad' | 'warn' | 'info'; className?: string }): ReactElement
export function Subtabs(props: { value: string; onChange: (id: string) => void; items?: Array<[string, ReactNode, number?]>; className?: string }): ReactElement | null
export function FilaDato(props: {
  etiqueta?: ReactNode
  valor?: ReactNode
  tono?: '' | Tono
  etiquetaComo?: 'span' | 'dt'
  valorComo?: 'span' | 'dd'
  className?: string
  valorClassName?: string
  children?: ReactNode
}): ReactElement
export function CeldaMoneda(props: { valor?: number | string | null; tono?: '' | Tono; currency?: Moneda; simbolo?: string; className?: string; children?: ReactNode }): ReactElement
export function BarraProgreso(props: {
  valor?: number
  max?: number
  tono?: 'fono' | 'ok' | 'warn' | 'bad' | 'mute' | 'onbrand'
  alto?: 'sm' | 'md' | 'lg'
  etiqueta?: string
  pista?: string
  relleno?: string
  className?: string
}): ReactElement

// ── Íconos ─────────────────────────────────────────────────────────────────

export const ICONOS: string[]
export function Icon(props: { name: string; className?: string } & SVGProps<SVGSVGElement>): ReactElement | null

// ── Campos ─────────────────────────────────────────────────────────────────

export function Switch(props: { checked?: boolean; onChange?: (event: any) => void; disabled?: boolean; id?: string; ariaLabel?: string; className?: string }): ReactElement
export const SearchField: ForwardRefExoticComponent<
  Omit<InputProps, 'value' | 'onChange'> & { value?: string; onChange?: (event: any) => void; onClear?: () => void; ariaLabel?: string } & RefAttributes<HTMLInputElement>
>
export function BotonDentroCampo(props: { etiqueta: string; onClick?: () => void; icono?: string; ocupado?: boolean; disabled?: boolean; className?: string }): ReactElement
export function SegmentedField(props: { value: string; onChange: (id: string) => void; options?: Array<[string, ReactNode, string?, number?]>; ariaLabel?: string; className?: string }): ReactElement | null
export function PercentField(props: Omit<InputProps, 'value' | 'onChange'> & { value?: string; onValueChange?: (value: string) => void; className?: string }): ReactElement
export function parsePercent(valor: unknown): number | null
export function formatPercent(numero: unknown): string
export function limpiarPercent(valor: unknown): string
export function CurrencySelect(props: SelectProps & { excluir?: string[] }): ReactElement
export function ListGridToggle(props: { value: 'list' | 'grid' | (string & {}); onChange: (value: string) => void; className?: string }): ReactElement
export function EmailField(props: Omit<InputProps, 'onChange'> & { value?: string; onChange?: (event: any) => void; dominios?: string[]; sugerir?: boolean }): ReactElement
export const DOMINIOS_EMAIL: string[]
export function sugerenciasDe(valor: string, dominios?: string[]): string[]
export function PhoneField(props: {
  countryCode?: string
  phone?: string
  onChange?: (valor: string) => void
  onCountryCodeChange?: (codigo: string) => void
  disabled?: boolean
  placeholder?: string
  countryAriaLabel?: string
  phoneAriaLabel?: string
  codigos?: string[]
  mensajeInvalido?: string
  id?: string
  className?: string
}): ReactElement
/** Parte `+595 981 123 456`, `+595981123456` o el pegado `00595 …`. */
export function parseTelefono(valor: string, countryCodePorDefecto?: string): { countryCode: string; phone: string }
/** Arma `+<código> <número>`; sin número devuelve `null`. */
export function componerTelefono(datos?: { countryCode?: string; phone?: string }): string | null
export const CODIGOS_PAIS: string[]
export function SerialField(props: Omit<InputProps, 'onChange'> & { value?: string; onChange?: (event: any) => void; normalizar?: (valor: string) => string }): ReactElement
export function normalizarSerial(valor: string): string
export function InstagramField(props: Omit<InputProps, 'onChange'> & { value?: string; onChange?: (event: any) => void }): ReactElement
export function normalizarInstagram(valor: string): string

// ── Identificación fiscal (cosecha de PagaYa, #1) ─────────────────────────

export type TaxIdFieldProps = Omit<InputProps, 'value' | 'onChange'> & {
  label?: ReactNode
  value?: string
  onChange?: (valor: string) => void
  pais?: string
  onBuscarRazonSocial?: (taxId: string) => Promise<string | null | undefined> | string | null | undefined
  onAplicarRazonSocial?: (razonSocial: string) => void
  etiquetaConsulta?: string
  mensajeInvalido?: string
  mensajeSinDatos?: string
  mensajeError?: string
  hint?: ReactNode
  error?: ReactNode
}
export function TaxIdField(props: TaxIdFieldProps): ReactElement
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

// ── Tema (cosecha de PagaYa, #1) ──────────────────────────────────────────

export type Tema = 'claro' | 'oscuro'
export const TEMA_CLARO: 'claro'
export const TEMA_OSCURO: 'oscuro'
export function aplicarTema(tema: Tema, clave?: string | null): void
export function ThemeToggle(props: { clave?: string | null; alCambiar?: (tema: Tema) => void; etiquetaClaro?: string; etiquetaOscuro?: string; className?: string }): ReactElement
export function NavegacionSeccion(props: {
  items?: Array<{ id: string; label: ReactNode; icono?: string; descripcion?: ReactNode } | [string, ReactNode]>
  value?: string
  onChange?: (id: string) => void
  colapsado?: boolean
  onToggle?: (siguiente: boolean) => void
  variante?: 'auto' | 'riel' | 'horizontal'
  ariaLabel?: string
  textoExpandir?: string
  textoColapsar?: string
  mostrarDescripcion?: boolean
  testId?: string
  testIdDescripcion?: string
  className?: string
  classNameContenido?: string
  children?: ReactNode
}): ReactElement | null
export function BloquePago(props: {
  etiqueta?: ReactNode
  encabezado?: ReactNode
  acento?: 'ok' | 'warn' | 'bad' | 'fono' | null
  onQuitar?: () => void
  etiquetaQuitar?: string
  deshabilitado?: boolean
  testId?: string
  className?: string
  children?: ReactNode
}): ReactElement
export function BuscadorCliente(props: {
  clientes?: Array<Record<string, any>>
  selectedId?: string
  onSelect?: (cliente: any) => void
  onCreate?: (nombre: string) => Promise<any> | any
  onQueryChange?: (texto: string) => void
  detectarDuplicado?: (cliente: any) => string[] | boolean | null
  placeholder?: string
  textoCrear?: string
  textoCreando?: string
  textoDuplicado?: string
  vacio?: string
  disabled?: boolean
  required?: boolean
  id?: string
  ariaLabel?: string
  className?: string
  inputProps?: Record<string, any>
}): ReactElement
export function PreviewFusion(props: {
  entidades?: Array<{ id: string; titulo?: ReactNode; subtitulo?: ReactNode; datos?: Array<{ etiqueta: ReactNode; valor?: ReactNode }> }>
  principalId?: string
  onElegirPrincipal?: (id: string) => void
  categorias?: Array<{ id: string; etiqueta: ReactNode; cantidad?: number; detalle?: ReactNode }>
  tituloCategorias?: ReactNode
  textoPrincipal?: ReactNode
  nota?: ReactNode
  acciones?: ReactNode
  testId?: string
  className?: string
}): ReactElement
export function ChipFusion(props: {
  principal?: string | Record<string, any> | null
  fusionadoEl?: string | number | Date | null
  por?: ReactNode
  onAbrirPrincipal?: () => void
  texto?: ReactNode
  textoAbrir?: ReactNode
  testId?: string
  className?: string
}): ReactElement | null
export const CATEGORIAS_FUSION: Array<{ id: string; etiqueta: string }>
export function categoriasFusion(conteos?: Record<string, number> | Array<{ id: string; cantidad?: number }>): Array<{ id: string; etiqueta: string; cantidad: number }>
export function hayFusion(categorias?: Array<{ cantidad?: number }>): boolean
export function ConfirmarConPalabra(props: {
  titulo?: ReactNode
  resumen?: ReactNode
  advertencia?: ReactNode
  palabra?: string
  confirmLabel?: ReactNode
  textoOcupado?: ReactNode
  onConfirmar?: () => void
  onCancelar?: () => void
  busy?: boolean
  error?: ReactNode
  testId?: string
  className?: string
}): ReactElement
export function campoBuscableCliente(cliente?: Record<string, any>): string
export function filtrarClientes(clientes?: any[], termino?: string, opciones?: { limite?: number }): any[]
export function detalleCliente(cliente?: Record<string, any>): string
export function motivosDuplicadoCliente(cliente?: Record<string, any>, referencia?: Record<string, any>): string[]
export function digitosCliente(valor?: string | null): string
export function claveTelefonoCliente(valor?: string | null): string
export function coincideTelefonoCliente(a?: string | null, b?: string | null): boolean
export function SelectorCuentaCobro(props: {
  cuentas?: Array<Record<string, any>>
  cuentaId?: string
  onSelect?: (cuenta: any) => void
  onCambiar?: () => void
  saldoPendientePyg?: number
  cotizacionPyg?: number
  logo?: ReactNode | ((cuenta: any) => ReactNode)
  detalle?: ReactNode | ((cuenta: any) => ReactNode)
  textoCambiar?: string
  placeholder?: string
  ariaLabel?: string
  vacio?: string
  limite?: number
  incluirInactivas?: boolean
  preseleccionar?: boolean
  ultimoUsadoId?: string
  predeterminadaId?: string
  disabled?: boolean
  testId?: string
  className?: string
}): ReactElement | null
export function TarjetaCuentaCobro(props: {
  cuenta?: Record<string, any> | null
  logo?: ReactNode
  saldoPendientePyg?: number
  cotizacionPyg?: number
  detalle?: ReactNode
  acciones?: ReactNode
  onCambiar?: () => void
  textoCambiar?: string
  testId?: string
  className?: string
}): ReactElement | null
export function BuscadorProveedor(props: {
  proveedores?: Array<{ id: string; name?: string; nombre?: string; code?: string | null; city?: string | null; phone?: string | null }>
  selectedId?: string
  onSelect?: (proveedor: any) => void
  onCreate?: (nombre: string) => Promise<any> | any
  onQueryChange?: (texto: string) => void
  recientes?: Array<string | any>
  placeholder?: string
  textoRecientes?: string
  textoCrear?: string
  textoCreando?: string
  vacio?: string
  disabled?: boolean
  required?: boolean
  id?: string
  ariaLabel?: string
  className?: string
  inputProps?: Record<string, any>
}): ReactElement
export const MEDIOS_CUENTA: Record<string, { etiqueta: string; icono: string }>
export const SIMBOLOS_CUENTA: Record<string, string>
export const LIMITE_CUENTAS: number
export function etiquetaMedioCuenta(kind?: string): string
export function iconoMedioCuenta(kind?: string): string
export function simboloCuenta(currency?: string, currencyLabel?: string | null): string
export function numeroParcialCuenta(numero?: string | null): string
export function campoBuscableCuenta(cuenta?: Record<string, any>): string
export function filtrarCuentasCobro(cuentas?: any[], termino?: string, opciones?: { limite?: number; incluirInactivas?: boolean }): any[]
export function preseleccionDeCuenta(cuentas?: any[], opciones?: { ultimoUsadoId?: string; predeterminadaId?: string; incluirInactivas?: boolean }): any
export function detalleCuentaCobro(cuenta?: Record<string, any> | null): string
export const MARGEN_VENTANA: number
export function ventanaDeLista(opciones?: { total?: number; scrollTop?: number; altoVista?: number; altoFila?: number; margen?: number }): { inicio: number; fin: number }
export function normalizarProveedor(valor?: string): string
export function nombreProveedor(proveedor?: any): string
export function detalleProveedor(proveedor?: any): string
export function filtrarProveedores(proveedores?: any[], termino?: string, opciones?: { limite?: number }): any[]
export function resolverRecientes(proveedores?: any[], recientes?: any[], opciones?: { limite?: number }): any[]
export function ProductCombobox(props: Record<string, any> & {
  products?: Array<{ id: string; nombre?: string; name?: string; sku?: string; model?: string; capacity?: string; color?: string; category?: string; [clave: string]: any }>
  selectedId?: string
  onSelect?: (product: any) => void
  onCreate?: (nombre: string) => Promise<any>
  onQueryChange?: (consulta: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}): ReactElement
export function BuscadorDispositivo(props: {
  valor?: { modelo?: string; capacidad?: string; color?: string; conectividad?: string; marca?: string; categoria?: string; [clave: string]: any }
  onCambio?: (valor: any, meta?: { campo?: string }) => void
  tipo?: 'mobile' | 'accesorios' | 'servicio' | (string & {})
  perfil?: { campos?: string[]; etiquetas?: Record<string, string>; catalogo?: Record<string, any> }
  catalogo?: Record<string, any>
  buscarPorCodigo?: boolean
  permitirLibre?: boolean
  limite?: number
  disabled?: boolean
  etiquetas?: Record<string, string>
  className?: string
}): ReactElement
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
export function normalizarBusqueda(texto?: string): string
export function RucField(props: Record<string, any> & {
  id?: string
  value?: string
  onChange: (valor: string) => void
  onAplicar?: (resultado: { name: string; fullRuc?: string; simulado?: boolean }) => void
  consultar?: (ruc: string) => Promise<{ name: string; fullRuc?: string; simulado?: boolean }>
  disabled?: boolean
  consultarDisabled?: boolean
  mostrarExtractor?: boolean
  maxLength?: number
  placeholder?: string
  autoComplete?: string
  ariaLabel?: string
  textoAyuda?: string
}): ReactElement
export function extraerRuc(texto: string): string
export function esRuc(valor: string): boolean
export const RUC_RE: RegExp
export function SerialTexto(props: { serial?: string; className?: string; tonoCola?: string; vacio?: string; enmascarar?: boolean }): ReactElement
export function imeiValido(valor?: string | null): boolean
export function separarSeriales(texto?: string, opciones?: { maxLargo?: number }): string[]
export function normalizarSeriales(texto?: string, opciones?: { validar?: (serial: string) => boolean; limite?: number; maxLargo?: number }): { seriales: string[]; repetidos: string[]; invalidos: string[] }
export function CampoSeriales(props: {
  valor?: string[] | string
  onCambio?: (seriales: string[], resultado: { seriales: string[]; repetidos: string[]; invalidos: string[] }) => void
  validar?: (serial: string) => boolean
  limite?: number
  maxLargo?: number
  etiqueta?: string
  placeholder?: string
  ayuda?: string
  disabled?: boolean
  className?: string
}): ReactElement
export function MedidorStock(props: { stock?: number | null; umbral?: number | null; variante?: 'texto' | 'chip' | 'barra'; etiqueta?: string; mostrarUmbral?: boolean; vacio?: string; className?: string }): ReactElement
export function ContadorLote(props: { recibidos?: number | null; total?: number | null; variante?: 'texto' | 'chip' | 'barra'; sufijo?: string; mostrarFaltan?: boolean; vacio?: string; className?: string }): ReactElement
export function ChipPrioridad(props: { prioridad?: 'urgente' | 'alta' | 'normal' | 'baja' | string; etiqueta?: ReactNode; title?: string; className?: string }): ReactElement
export function ChipOrigen(props: { origen?: string; etiqueta?: ReactNode; title?: string; className?: string }): ReactElement
export function ContadoresCompra(props: { pendiente?: number; comprado?: number; faltan?: number; variante?: 'texto' | 'chips'; className?: string }): ReactElement
export function TarjetaNecesidad(props: {
  producto?: ReactNode
  variante?: ReactNode
  prioridad?: 'urgente' | 'alta' | 'normal' | 'baja' | string
  estado?: string
  origen?: string
  centro?: ReactNode
  fechaPrometida?: string | number | Date | null
  diasAviso?: number
  vinculo?: { etiqueta?: ReactNode; onClick?: () => void } | null
  destinos?: Array<{ id?: string; etiqueta: ReactNode; cantidad: number; detalle?: string }>
  onElegirDestino?: (destino: any) => void
  observaciones?: ReactNode
  pendiente?: number
  comprado?: number
  faltan?: number
  onAbrir?: () => void
  acciones?: ReactNode
  className?: string
}): ReactElement
export function TarjetaCompra(props: {
  codigo?: string
  proveedor?: ReactNode
  referencia?: ReactNode
  moneda?: string
  simbolo?: string
  costo?: number | string | null
  estado?: string
  unidades?: number
  conImei?: number
  origen?: ReactNode
  destino?: ReactNode
  notas?: ReactNode
  onAbrir?: () => void
  acciones?: ReactNode
  className?: string
}): ReactElement
export function ManifiestoEnvio(props: {
  codigo?: string
  origen?: ReactNode
  destino?: ReactNode
  metodo?: string
  empresa?: ReactNode
  conductor?: ReactNode
  guia?: ReactNode
  responsable?: ReactNode
  compra?: ReactNode
  salida?: ReactNode
  eta?: ReactNode
  llegada?: ReactNode
  lineas?: Array<{ id?: string; producto?: ReactNode; capacidad?: ReactNode; condicion?: string; cantidad?: number; imeis?: string[]; pendientes?: number }>
  unidades?: number
  conImei?: number
  pendientes?: number
  enlace?: string
  qr?: string
  notas?: ReactNode
  className?: string
}): ReactElement
export function TarjetaRecepcion(props: {
  codigo?: string
  estado?: string
  origen?: ReactNode
  destino?: ReactNode
  metodo?: string
  eta?: string | number | Date | null
  unidades?: number
  conImei?: number
  deposito?: ReactNode
  depositoSugerido?: ReactNode
  llegada?: ReactNode
  notas?: ReactNode
  onAbrir?: () => void
  acciones?: ReactNode
  className?: string
}): ReactElement
export function ResumenRecepcion(props: {
  resumen?: Record<string, number>
  items?: Array<{ resultado?: string }>
  className?: string
}): ReactElement | null
export function claveRevision(estado?: string): string
export function TarjetaLote(props: {
  codigo?: string
  estado?: string
  origen?: ReactNode
  destino?: ReactNode
  metodo?: string
  empresa?: ReactNode
  guia?: ReactNode
  responsable?: ReactNode
  eta?: string | number | Date | null
  unidades?: number
  conImei?: number
  notas?: ReactNode
  onAbrir?: () => void
  acciones?: ReactNode
  className?: string
}): ReactElement
export function EtiquetaLote(props: {
  codigo?: string
  numero?: number
  total?: number
  producto?: ReactNode
  variante?: ReactNode
  serial?: string | null
  pendienteImei?: boolean
  pedido?: ReactNode
  destino?: ReactNode
  qr?: string
  qrValor?: string
  nota?: ReactNode
  className?: string
}): ReactElement
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
export const COLOR_DE_TONO: Record<string, string>
export function colorDeTono(tono?: string): string
export function ResumenDestinos(props: { destinos?: Array<{ id?: string; etiqueta: ReactNode; cantidad: number; detalle?: string }>; ariaLabel?: string; onElegir?: (destino: any) => void; className?: string }): ReactElement | null
export function ResumenIncidencias(props: { incidencias?: Array<{ tipo?: string; etiqueta?: ReactNode; cantidad?: number; tono?: string; detalle?: string }>; sinIncidencias?: string; className?: string }): ReactElement
export function FilaRevision(props: { etiqueta: ReactNode; serial?: string | null; estado?: string; detalle?: ReactNode; acciones?: ReactNode; compact?: boolean; className?: string }): ReactElement
export function SelectorIncidencia(props: { valor?: string | null; onChange?: (tipo: string | null) => void; tipos?: string[]; permitirQuitar?: boolean; disabled?: boolean; ariaLabel?: string; className?: string }): ReactElement
export function DestinoRecepcion(props: { destino?: { id: string; nombre: ReactNode } | null; depositos?: Array<{ id: string; nombre: ReactNode }>; pendientes?: number; recibiendo?: boolean; onRecibir?: (depositoId: string) => void; etiqueta?: string; textoRecibir?: string; className?: string }): ReactElement
export const ESTADOS_REVISION: Record<string, { etiqueta: string; etiquetaPlural: string; tono: string }>
export const INCIDENCIAS: string[]
export function esIncidencia(estado?: string): boolean
export function etiquetaRevision(estado?: string): string
export function etiquetaPluralRevision(estado?: string): string
export function tonoRevision(estado?: string): string
export function EstadoBadge(props: { mapa?: Record<string, { label: ReactNode; color?: string }>; valor?: string; vacio?: string }): ReactElement
export function SeccionColapsable(props: { titulo: ReactNode; resumen?: ReactNode; icono?: string; abierta?: boolean; clave?: string; className?: string; children?: ReactNode }): ReactElement

// ── Acceso y shell ─────────────────────────────────────────────────────────

export function GoogleButton(props: Record<string, any> & { onClick?: () => void; texto?: string; className?: string }): ReactElement
export function GoogleMark(props: { className?: string }): ReactElement
export function OAuthDivider(props: { texto?: string; className?: string }): ReactElement
export function AuthLayout(props: Record<string, any> & { children?: ReactNode; className?: string }): ReactElement
export function ProductFooter(props: Record<string, any> & { className?: string }): ReactElement
export function LoadingScreen(props: { label?: string; logo?: ReactNode; className?: string }): ReactElement
export function PegarEnlaceToken(props: Record<string, any> & { onToken?: (token: string) => void }): ReactElement
export const NavLateral: ForwardRefExoticComponent<
  {
    items?: Array<{ id: string; label?: ReactNode; etiqueta?: ReactNode; icono?: string; contador?: number; href?: string; roles?: string[]; [clave: string]: any }>
    grupos?: Array<{ titulo: string; items: Array<{ id: string; label?: ReactNode; icono?: string; contador?: number; [clave: string]: any }> }>
    gruposPlegados?: Record<string, boolean>
    onToggleGrupo?: (titulo: string) => void
    activeId?: string
    onSelect?: (id: string) => void
    colapsado?: boolean
    onToggle?: (colapsado: boolean) => void
    cabecera?: ReactNode
    pie?: ReactNode
    ancho?: string
    ariaLabel?: string
    className?: string
  } & Record<string, any>
>
export function MenuDesplegable(props: Record<string, any> & { etiqueta?: ReactNode; items?: any[]; className?: string }): ReactElement

// ── Ajustes, impresión y bancos ────────────────────────────────────────────

export function PanelDerecho(props: { children?: ReactNode; panel?: ReactNode; id?: string; className?: string; classNamePanel?: string }): ReactElement
export function TarjetaAjuste(props: { titulo?: ReactNode; descripcion?: ReactNode; accion?: ReactNode; icono?: string; tono?: 'normal' | 'peligro'; children?: ReactNode; className?: string; id?: string }): ReactElement
export function EstadoGuardado(props: { testId?: string; estado?: { ok: boolean; texto: ReactNode } | null; className?: string }): ReactElement
export function Checkbox(props: { checked?: boolean; onChange?: (event: any) => void; label?: ReactNode; descripcion?: ReactNode; variante?: 'simple' | 'tarjeta'; tono?: 'fono' | 'bad'; disabled?: boolean; id?: string; ariaLabel?: string; className?: string; [clave: string]: any }): ReactElement
export function AjustesImpresion(props: Record<string, any> & { impresoras?: any[]; onGuardar?: (ajustes: any) => void }): ReactElement
export function BotonImprimir(props: Record<string, any> & { onImprimir?: () => void; etiqueta?: string }): ReactElement
export function BancoCombobox(props: Record<string, any> & { value?: string; onChange?: (valor: string) => void; onSelect?: (banco: any) => void }): ReactElement
export function BancoLogo(props: Record<string, any> & { banco?: string; logo?: string | null; className?: string }): ReactElement
export function CityAutocomplete(props: Record<string, any> & { value?: string; onSelect?: (ciudad: string, departamento?: string) => void; onChange?: (valor: string) => void }): ReactElement

// ── Clases de tabla ────────────────────────────────────────────────────────

export const ROTULO_DATO: string
export const CELDA_ENCABEZADO: string
export const ROTULO_SECCION: string
export const CELDA_DATO: string
export const CELDA_NUMERO: string
export const CELDA_IDENTIDAD: string
export const CELDA_IDENTIDAD_GRANDE: string

// ── Estados de equipos ─────────────────────────────────────────────────────

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

export function SemaforoItem(props: { estado?: 'ok' | 'aviso' | 'falla' | 'sinVerificar' | (string & {}); etiqueta: string; detalle?: ReactNode; como?: 'li' | 'div'; className?: string }): ReactElement
export function FilaChecklist(props: { etiqueta: ReactNode; estado?: string; nota?: ReactNode; accion?: ReactNode; className?: string }): ReactElement
export function ConteoChecklist(props: { pasan?: number; total?: number; fallas?: number; sustantivo?: string; className?: string }): ReactElement
export function ChipEstado(props: { estado?: string; etiqueta?: ReactNode; icono?: string; tono?: Tono; title?: string; className?: string }): ReactElement
export function ChipsLocks(props: { locks?: Array<{ clave: string; estado: string; etiqueta?: string; detalle?: string }>; conEstado?: boolean; className?: string }): ReactElement
export function MedidorBateria(props: { porcentaje?: number | null; ciclos?: number | null; etiqueta?: string; variante?: 'barra' | 'chip'; compact?: boolean; className?: string }): ReactElement
export function GradoBadge(props: { grado: string; conDescripcion?: boolean; className?: string }): ReactElement
export function TileEquipo(props: Record<string, any> & { modelo?: string; imei?: string; detalle?: ReactNode; foto?: string; estado?: string; grado?: string; bateria?: number | null; ciclos?: number | null; locks?: any[]; acciones?: ReactNode; onOpen?: () => void }): ReactElement
export function ColumnaLote(props: { etiqueta: ReactNode; tono?: string; contador?: number; acciones?: ReactNode; children?: ReactNode; vacio?: string; testId?: string; className?: string }): ReactElement
export function Vencimiento(props: { fecha?: string | number | Date | null; variante?: 'texto' | 'chip'; diasAviso?: number; hoy?: Date; texto?: ReactNode; vacio?: string; className?: string }): ReactElement
export function estadoVencimiento(fecha?: string | number | Date | null, opciones?: { hoy?: Date; diasAviso?: number }): { texto: string; tono: string; vencido: boolean; dias: number | null; titulo: string }
export function PasosEquipo(props: { pasos?: Array<string | { id?: string; etiqueta?: ReactNode }>; actual?: string | number; etiqueta?: string; testId?: string; className?: string }): ReactElement | null
export function TileRol(props: { titulo: ReactNode; descripcion?: ReactNode; cantidad?: number; total?: number; dominios?: Array<{ id?: string; etiqueta: ReactNode; activo?: boolean }>; onAbrir?: () => void; className?: string }): ReactElement
export function Stepper(props: { pasos?: Array<string | { id?: string; etiqueta?: ReactNode; detalle?: ReactNode }>; actual?: string | number; hechos?: Array<string | number>; variante?: 'linea' | 'tarjetas'; ariaLabel?: string; className?: string }): ReactElement | null
export function CodigoQr(props: { valor?: string; ancho?: number; nivel?: string; margen?: number; alt?: string; className?: string }): ReactElement | null
export const QR_OPCIONES: { ancho: number; nivel: string; margen: number }
export function qrDataUrl(valor: string, opciones?: { ancho?: number; nivel?: string; margen?: number }): Promise<string>
export function FichaCertificado(props: Record<string, any> & {
  empresa?: string
  modelo?: string
  imei?: string
  grado?: string
  bateria?: number | null
  ciclos?: number | null
  locks?: any[]
  aprobados?: number
  total?: number
  verificadoPor?: string
  verificadoAt?: string
  enlace?: string
  etiquetaQr?: string
  estado?: string
  puntaje?: number | string | null
  condicion?: ReactNode
  repuestosNoOem?: ReactNode
  repuestosNoOemNota?: ReactNode
  acciones?: ReactNode
  className?: string
}): ReactElement

// ── Categorías de producto ─────────────────────────────────────────────────

export function IconoCategoria(props: { categoria?: string; icono?: string; className?: string }): ReactElement | null
export const GLIFOS_CATEGORIA: Record<string, string>
export const CATEGORIAS_PRODUCTO: Array<{ id?: string; etiqueta: string; icono: string; alias?: string[] }>
export const ICONO_CATEGORIA: Record<string, string>
export function normalizarCategoria(texto: string): string
export function categoriaDe(texto: string): string
export function iconoDeCategoria(texto: string): string
export function etiquetaDeCategoria(texto: string): string

// ── Agenda, filtros, shell e identidad (lote 2) ────────────────────────────

export type ItemCalendario = { id: string; fecha: string; titulo: ReactNode; hora?: string; detalle?: ReactNode; tono?: Tono; href?: string }
export function Calendario(props: {
  items?: ItemCalendario[]
  vistas?: Array<'mes' | 'semana' | (string & {})>
  vista?: string
  vistaPorDefecto?: string
  onCambiarVista?: (vista: string) => void
  ancla?: string
  anclaPorDefecto?: string
  onCambiarPeriodo?: (ancla: string, rango: { desde: string; hasta: string }) => void
  diaSeleccionado?: string
  onSeleccionarDia?: (dia: string) => void
  onElegirItem?: (item: ItemCalendario) => void
  renderItem?: (item: ItemCalendario, contexto: { vista: string; dia: string }) => ReactNode
  maxPorDia?: number
  cargando?: boolean
  mostrarDetalle?: boolean
  hoy?: string
  className?: string
}): ReactElement
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
export function agruparPorDia(items: ItemCalendario[], claveDe?: (item: ItemCalendario) => string): Map<string, ItemCalendario[]>

export function RangoFecha(props: {
  desde?: string
  hasta?: string
  onCambio?: (desde: string, hasta: string) => void
  desdePorDefecto?: string
  hastaPorDefecto?: string
  periodoPorDefecto?: string
  atajos?: string[]
  hoy?: string
  mostrarCampos?: boolean
  className?: string
}): ReactElement
export const PERIODOS_FECHA: string[]
export const ETIQUETA_PERIODO: Record<string, string>
export function esAtajo(periodo: string): boolean
export function rangoDePeriodo(periodo: string, hoy?: string): { desde: string; hasta: string }
export function periodoDeRango(desde: string, hasta: string, hoy?: string): string | null
export function rangoInvertido(desde: string, hasta: string): boolean

export function PaletaComandos(props: {
  abierta?: boolean
  onAbrir?: () => void
  onCerrar?: () => void
  buscar?: (consulta: string) => Promise<any[]> | any[]
  onElegir?: (resultado: any) => void
  etiquetasTipo?: Record<string, string>
  iconosTipo?: Record<string, string>
  titulo?: string
  placeholder?: string
  ariaLabel?: string
  atajo?: string
  atajoTexto?: string
  conAtajo?: boolean
  minimo?: number
  espera?: number
  mensajeError?: string
  textoSeguir?: string
  textoSinResultados?: string
  descripcionVacio?: string
  boton?: boolean
  textoBoton?: string
  mostrarAtajoEnBoton?: boolean
  className?: string
}): ReactElement
export function agruparResultados(resultados: any[]): Array<{ tipo: string; resultados: any[] }>
export function estadoPaleta(props: { consulta?: string; cargando?: boolean; error?: unknown; resultados?: any[]; minimo?: number }): string
export function AyudaModulo(props: { titulo?: ReactNode; resumen?: ReactNode; puntos?: ReactNode[]; enlaces?: Array<{ href: string; etiqueta: ReactNode; onClick?: () => void }>; abierta?: boolean; onAbrir?: () => void; onCerrar?: () => void; className?: string }): ReactElement | null
export function BarraInferior(props: { items?: Array<{ id: string; etiqueta: ReactNode; icono?: string; href?: string }>; activo?: string; onSelect?: (item: any) => void; onMas?: () => void; masEtiqueta?: string; menuAbierto?: boolean; menuId?: string; maxItems?: number; className?: string }): ReactElement | null
export const ESPACIO_BARRA_INFERIOR: string
export function Avatar(props: { nombre?: string; src?: string | null; tamano?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; forma?: 'redondo' | 'cuadrado'; empresa?: boolean | string; title?: string; ariaLabel?: string; decorativo?: boolean; onError?: (event: any) => void; className?: string }): ReactElement
export function PersonaChip(props: {
  user?: string | { name?: string; nombre?: string; email?: string; id?: string; picture?: string; foto?: string; avatarUrl?: string; photoURL?: string; hasAvatar?: boolean; tieneFoto?: boolean; scope?: string; [clave: string]: any }
  foto?: string
  picture?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  nombre?: boolean
  nombreCorto?: boolean
  estado?: 'en-linea' | 'ausente' | 'ocupado' | 'offline' | (string & {})
  title?: string
  className?: string
  textoClassName?: string
  avatarClassName?: string
  children?: ReactNode
}): ReactElement
export function identidadDeUsuario(fuente?: any): { nombre: string; primerNombre: string; fotoLocal: string; picture: string; hasAvatar?: boolean; scope: string }
export function PilaPersonas(props: {
  personas?: Array<string | { id?: string; name?: string; nombre?: string; foto?: string; avatarUrl?: string; picture?: string; hasAvatar?: boolean; estado?: string; active?: boolean; scope?: string; [clave: string]: any }>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onMas?: () => void
  resumen?: boolean
  ariaLabel?: string
  title?: string
  className?: string
}): ReactElement | null
export function resumenPresencia(personas?: any[]): string
export const ESTADOS_PRESENCIA: Record<string, { etiqueta: string; punto: string }>
export function BarraLote(props: { cantidad?: number; onLimpiar?: () => void; children?: ReactNode; etiqueta?: string; className?: string }): ReactElement | null
export function PeriodoTabs(props: { periodo: string; setPeriodo: (id: string) => void; periodos?: Array<[string, ReactNode, string?, number?]>; ariaLabel?: string; className?: string }): ReactElement | null
export function NumericKeypad(props: { value?: string; onChange: (valor: string) => void; max?: number; className?: string; ariaLabel?: string }): ReactElement
export const TAMANOS_AVATAR: Record<string, string>
export const COLORES_AVATAR: Record<string, string>
export function inicialesDeNombre(nombre: string): string
export function claveColorDeNombre(nombre: string): string
export function colorDeNombre(nombre: string): string

export function ImporteDelta(props: { valor?: number | string | null; moneda?: Moneda; formato?: 'moneda' | 'porcentaje'; invertir?: boolean; vacio?: string; simbolo?: string; className?: string }): ReactElement
export function tonoDelta(valor: unknown, opciones?: { invertir?: boolean }): TonoCanonico
export function IndicadorConexion(props: { enLinea?: boolean; pendientes?: number; sincronizando?: boolean; onSincronizar?: () => void; variante?: 'chip' | 'banner'; mensaje?: string; etiquetaEnLinea?: string; etiquetaSinConexion?: string; etiquetaSincronizando?: string; className?: string }): ReactElement
export function CampanaAvisos(props: Record<string, any> & { avisos?: any[]; onAbrir?: (abierta: boolean) => void; onElegir?: (aviso: any) => void; pie?: ReactNode; anclaje?: string; className?: string }): ReactElement
export function contarSinLeer(avisos?: any[]): number
export function textoContador(total: number): string
export function GraficoBarras(props: { datos?: Array<{ etiqueta: ReactNode; valor: number; tono?: Tono }>; max?: number; orientacion?: 'vertical' | 'horizontal'; altura?: number; tono?: Tono; formatoValor?: (valor: number) => ReactNode; etiqueta?: string; mostrarValores?: boolean; className?: string }): ReactElement
export function maximoDeBarras(datos: Array<{ valor: number }>, max?: number): number
export function porcentajeBarra(valor: number, max: number): number

// ── Pipeline, documentos y avance (lote LedBox) ────────────────────────────

export type ColumnaTablero = { valor: string; titulo: ReactNode; tono?: Tono }
export type TarjetaTablero = {
  id: string
  estado: string
  titulo: ReactNode
  subtitulo?: ReactNode
  chips?: Array<{ etiqueta: ReactNode; tono?: Tono }>
  monto?: number | string | null
  montoNota?: ReactNode
  fecha?: string | Date | null
  detalle?: ReactNode
  acciones?: ReactNode
  destinos?: string[]
}
export function TableroKanban(props: {
  etiqueta?: string
  columnas?: ColumnaTablero[]
  tarjetas?: TarjetaTablero[]
  puedeMover?: boolean
  etiquetaMover?: string
  textoVacio?: string
  onMover?: (id: string, destino: string) => { ok: boolean } | Promise<{ ok: boolean }> | void
  onError?: (mensaje: string) => void
  className?: string
}): ReactElement
export function useTableroOptimista(props: { tarjetas?: TarjetaTablero[]; onMover?: (id: string, destino: string) => any; onError?: (mensaje: string) => void }): {
  tarjetas: TarjetaTablero[]
  moviendo: string | null
  mover: (id: string, destino: string) => Promise<void>
}
export const SELECTOR_ENFOCABLES: string
export function destinoDeTab(opciones: { shiftKey: boolean; activo: Element | null; primero: Element | null; ultimo: Element | null; contenedor: Element | null; fuera?: boolean }): Element | null
export function useDialogFocusTrap(open: boolean, onClose: (() => void) | undefined, ref: RefObject<HTMLElement>, opciones?: { initialFocus?: () => HTMLElement | null; bloquearScroll?: boolean; busy?: boolean }): { esSuperior: boolean; requestClose: () => void }
export function crearPilaCapas(): { agregar(id: symbol): void; insertar(id: symbol, indice: number): void; quitar(id: symbol): void; esSuperior(id: symbol): boolean; readonly tamano: number; ids(): symbol[] }
export function crearRegistroPendientes(): { registrar(id: symbol, pendiente: boolean): number; readonly bloqueado: boolean; readonly cantidad: number }
export const AVISO_REFRESCO: string
export function crearEnvioUnico(enviar: (evento?: unknown) => unknown): { readonly enCurso: boolean; ejecutar(evento?: unknown): Promise<unknown> }
export function completeSave(cerrar?: () => void, refrescar?: () => void | Promise<void>, opciones?: { avisar?: (mensaje: string) => void }): Promise<boolean>
export function useSingleFlightSubmit(enviar: (evento?: any) => Promise<void> | void): { pendiente: boolean; onSubmit: (evento?: any) => Promise<void> }
export function columnasDelTablero(columnas: ColumnaTablero[], tarjetas: TarjetaTablero[]): Array<ColumnaTablero & { tarjetas: TarjetaTablero[] }>
export function agruparTarjetas(columnas: ColumnaTablero[], tarjetas: TarjetaTablero[]): Record<string, TarjetaTablero[]>
export function destinosDeTarjeta(tarjeta: TarjetaTablero): string[]

export type Hito = { id: string; fecha: string | Date; tipo: string; titulo: ReactNode; detalle?: ReactNode; actor?: string; tono?: Tono; icono?: string }
export function Cronologia(props: {
  hitos?: Hito[]
  iconos?: Record<string, string>
  tonos?: Record<string, Tono>
  etiquetas?: Record<string, string>
  agrupar?: boolean
  mostrarTipo?: boolean
  etiqueta?: string
  vacioTitulo?: string
  vacioDetalle?: string
  className?: string
}): ReactElement
export const ICONOS_HITO: Record<string, string>
export const TONOS_HITO: Record<string, Tono>
export const ETIQUETAS_HITO: Record<string, string>
export function etiquetaDeHito(tipo: string, etiquetas?: Record<string, string>): string
export function agruparHitos(hitos: Hito[]): Array<{ clave: string; etiqueta: string; hitos: Hito[] }>

export function PlanPagos(props: {
  anticipo?: number
  anticipoEtiqueta?: string
  anticipoVence?: string | Date | null
  cuotas?: Array<{ id?: string; etiqueta: ReactNode; monto: number; vence?: string | Date | null; estado?: string; nota?: ReactNode }>
  aTransferir?: { id?: string; etiqueta: ReactNode; monto: number } | null
  total?: number | null
  totalEtiqueta?: string
  saldoSinCuota?: number
  saldoEtiqueta?: string
  condiciones?: ReactNode
  moneda?: Moneda
  simbolo?: string
  estados?: Record<string, { chip: string; etiqueta: string; icono: string; tono?: Tono }>
  vacio?: string
  className?: string
}): ReactElement
export const ESTADOS_CUOTA: Record<string, { chip: string; etiqueta: string; icono: string; tono?: Tono }>

export const ANCHOS_PAPEL: Record<'thermal-80' | 'thermal-58' | 'thermal-55' | 'thermal' | 'a4', string>
export function VistaPreviaPapel(props: {
  formato?: 'thermal-80' | 'thermal-58' | 'thermal-55' | 'thermal' | 'a4' | (string & {})
  contenido?: string
  titulo?: string
  alto?: string
  className?: string
} & Record<string, any>): ReactElement

export type ItemDocumento = { id?: string; cantidad: number; concepto: ReactNode; unitario: number; subtotal: number; nota?: ReactNode }
export function DocumentoImpresion(props: {
  titulo?: string
  numero?: string | null
  etiquetaNumero?: string
  emisor?: { nombre?: string; documento?: string; etiquetaDocumento?: string; direccion?: string; telefono?: string; correo?: string; logo?: string } | null
  receptor?: { nombre?: string; documento?: string; etiquetaDocumento?: string; direccion?: string; telefono?: string; correo?: string; logo?: string } | null
  meta?: Array<{ etiqueta: ReactNode; valor: ReactNode }>
  estado?: ReactNode
  estadoTono?: Tono
  detalle?: ItemDocumento[]
  liquidacion?: {
    subtotal?: number
    descuento?: number
    descuentoEtiqueta?: string
    iva?: Array<{ tasa: number; base?: number; monto: number }>
    otros?: Array<{ etiqueta: ReactNode; monto: number }>
    total?: number
  } | null
  notas?: ReactNode
  notasEtiqueta?: string
  pie?: ReactNode
  onImprimir?: () => void
  etiquetaImprimir?: string
  moneda?: Moneda
  simbolo?: string
  etiquetaDetalle?: string
  etiquetaEmisor?: string
  etiquetaReceptor?: string
  etiquetaLiquidacion?: string
  etiquetaMeta?: string
  vacioDetalle?: string
  className?: string
}): ReactElement

export function SubidaImagen(props: {
  etiqueta?: ReactNode
  descripcion?: ReactNode
  valor?: string | null
  error?: ReactNode
  tipos?: string[]
  tamanoMaximo?: number
  comprimir?: boolean
  cuadrado?: boolean
  ladoMaximo?: number
  tamanoObjetivo?: number
  onImagen?: (imagen: { base64: string; tipo: string; ancho?: number; alto?: number }) => void
  onLimpiar?: () => void
  limpiarEtiqueta?: string
  subirEtiqueta?: string
  cambiarEtiqueta?: string
  disabled?: boolean
  ocupado?: boolean
  className?: string
}): ReactElement
export const MIMES_IMAGEN: string[]
export const EXTENSION_IMAGEN: Record<string, string>
export const TAMANO_MAXIMO_IMAGEN: number
export const TAMANO_OBJETIVO_IMAGEN: number
export function mimeDeImagen(bytes: Uint8Array): string | null
export function validarImagen(file: { type?: string; size?: number } | null, opciones?: { tipos?: string[]; tamanoMaximo?: number }): { ok: boolean; error?: string; tipo?: string }
export function prepararImagen(file: any, opciones?: { cuadrado?: boolean; ladoMaximo?: number; tamanoObjetivo?: number }): Promise<{ ok: boolean; error?: string; imagen?: any }>

export function ProgresoChecklist(props: { hechas?: number; total?: number; vencidas?: number; riesgo?: boolean; sustantivo?: string; porcentaje?: number; mostrarDetalle?: boolean; alto?: 'sm' | 'md' | 'lg'; textoVacio?: string; className?: string }): ReactElement
export function progresoChecklist(props: { hechas?: number; total?: number; vencidas?: number; riesgo?: boolean; sustantivo?: string }): { hechas: number; total: number; pendientes: number; vencidas: number; riesgo: boolean; completo: boolean; tono: TonoCanonico; porcentaje: number; etiqueta: string; detalle: string }

export const TONOS: { punto: Record<string, string>; chip: Record<string, string>; texto: Record<string, string> }
export const TONOS_ALIAS: Record<string, TonoCanonico>
export function tonoCanonico(valor: string | null | undefined): TonoCanonico
export function puntoDeTono(valor: string | null | undefined): string
export function chipDeTono(valor: string | null | undefined): string
export function textoDeTono(valor: string | null | undefined): string

// ── Lógica compartida ──────────────────────────────────────────────────────

export function cn(...inputs: any[]): string
export function primerNombre(nombre: string): string
export function normalizarNombre(nombre: string, opciones?: { apellidosPrimero?: 'sifen' | boolean }): string
export function nombrePartes(nombre: string): { nombres: string; apellidos: string }
export function esApellidosPrimero(nombre: string): boolean
export function esRazonSocial(nombre: string): boolean

/** Nombres del catálogo por defecto (`BANCOS_PARAGUAY`, listado vigente del BCP). */
export type BancoParaguay = string

/** Registro de logo: archivo del host, marca vectorial o monograma. */
export type RegistroLogoBanco =
  | { banco: string; tipo: 'archivo'; archivo: string; chip?: boolean }
  | { banco: string; tipo: 'marca'; marca: string }
  | { banco: string; tipo: 'monograma'; iniciales: string; color: string; generico?: boolean }

/** Entrada del registro `LOGOS_BANCOS` (el nombre canónico es la clave). */
export type EntradaLogoBanco = {
  archivo?: string
  marca?: string
  monograma?: string
  color?: string
  chip?: boolean
  alias?: string[]
}

export const BANCOS_PARAGUAY: string[]
export const LOGOS_BANCOS: Record<string, EntradaLogoBanco>
export const COLORES_BANCO_RESPALDO: string[]
export function normalizarBanco(nombre: string): string
export function inicialesDeBanco(nombre: string): string
export function colorDeBanco(nombre: string): string
/** Resuelve archivo/marca/monograma por nombre o alias; sin nombre, `null`. */
export function logoDeBanco(nombre: string): RegistroLogoBanco | null
export function sugerenciasDeBanco(consulta?: string, bancos?: readonly string[]): string[]

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
export function paginaDePrueba(opciones?: any): string
export function paginaDePruebaSimple(opciones?: any): string
export const TIPOS_PRUEBA: any
export const TIPOS_TICKET_PRUEBA: any

export const TAMANOS_CAMPO: Record<string, string>
export function anchoParaLargo(largo: number): string
export const TAMANOS_MODAL: Record<TamanoModal, string>
export const TAMANO_MODAL_PREDETERMINADO: TamanoModal
export const GRILLA_DOS_COLUMNAS: string
export const GRILLA_DOS_COLUMNAS_COMPACTA: string
export const PIE_ACCIONES: string
export const PIE_ACCIONES_REVERSO: string

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

// ── Dinero ─────────────────────────────────────────────────────────────────

export type OpcionesSimbolo = { simbolo?: string } | string
/** `opciones` puede ser un vacío (`string`) o `{ vacio, simbolo }`. */
export type OpcionesMonto = { vacio?: string; simbolo?: string }

export const SIMBOLO_PYG: string
export const SIMBOLOS_MONEDA: Record<string, string>
export const LIMITE_MONTO_GENERAL: number
export const LIMITE_MONTO_VENTAS: number
/** Tope real de almacenamiento (columnas enteras de 32 bits). */
export const LIMITE_MONTO_ALMACENABLE: number
/** Límite efectivo del campo: el del contexto acotado a lo almacenable. */
export function limiteMonto(max?: number): number
/** Mensaje para bloquear el guardado, o `''` si el monto entra. */
export function errorMonto(value: unknown, max?: number): string
export function formatGs(value: unknown, opciones?: OpcionesSimbolo): string
export function formatGsInput(value: unknown): string
export function parseGsInput(value: unknown): number
export function formatUsd(value: unknown): string
export function formatUsdInput(value: unknown): string
export function parseUsdInput(value: unknown): string
export function normalizarMontoInput(texto: unknown, moneda?: Moneda, opciones?: { integerOnly?: boolean }): string
export function caretTrasDigitos(display: string, digitos: number): number
export function formatMoney(value: unknown, currency?: Moneda, opciones?: OpcionesSimbolo): string
export function montoGs(value: unknown, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function montoUsd(value: unknown, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function montoTexto(value: unknown, currency?: Moneda, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function montoConSigno(value: unknown, currency?: Moneda, vacio?: string | OpcionesMonto, opciones?: OpcionesMonto): string
export function excedeMonto(value: unknown, limite?: number): boolean
export function largoMaximoMonto(max?: number, opciones?: { decimales?: boolean }): number
export function formatoNumero(value: unknown, opciones?: { decimales?: number; vacio?: string }): string
export function signoDe(value: unknown): '' | '+' | '−'

// ── Fechas ─────────────────────────────────────────────────────────────────

/** Opciones de formato: vacío y huso horario (`America/Asuncion`). */
export type OpcionesFecha = { timeZone?: string; vacio?: string; hora?: string }
export function fechaValida(value: unknown): Date | null
export function fechaHora(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaDia(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaHoraCorta(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaCorta(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaLista(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function fechaListaCorta(value: unknown, vacio?: string | OpcionesFecha, opciones?: OpcionesFecha): string
export function diasHasta(fecha: unknown, opciones?: { hoy?: unknown; timeZone?: string }): number | null
export function tonoVencimiento(fecha: unknown, opciones?: { hoy?: unknown; diasAviso?: number }): '' | 'bad' | 'warn'

// ── Seriales, tokens y teléfono ────────────────────────────────────────────

export function ultimos4(serial: string): string
export function partirSerial(serial: string): { prefijo: string; ultimos: string }
export function serialEnmascarado(serial: string): string
export function extractTokenFromUrl(url: string): string
export function esToken(valor: string): boolean
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

/** Props de los objetos con superficie abierta (se tipan al adoptarse). */
export type PropsAbiertas = Record<string, any> & { className?: string; children?: ReactNode }
