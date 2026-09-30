import { cn } from '../utils/cn.js'

// Set de íconos de línea (reemplazan a los emojis). Trazo uniforme de 1.75,
// heredan el color del texto y escalan con la clase que se les pase. Los
// glifos no se renombran: si falta uno, se suma acá; las equivalencias con el
// set de PagaYa (components/app-icon.tsx) están documentadas en
// docs/REGLAS.md §8 (iconos).
const PATHS = {
  // Navegación / estructura
  menu: 'M3 6h18M3 12h18M3 18h18',
  back: 'M19 12H5M12 19l-7-7 7-7',
  chevron: 'M6 9l6 6 6-6',
  close: 'M18 6L6 18M6 6l12 12',
  external: 'M7 17L17 7M8 7h9v9',
  home: 'M3 11l9-8 9 8M5 10v10h14V10M9 20v-6h6v6',
  arrow: 'M5 12h14M14 7l5 5-5 5',
  link: 'M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1',

  // Análisis
  chart: 'M3 3v18h18M8 16V9M13 16V5M18 16v-4',
  trending: 'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
  sparkles:
    'M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3ZM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z',
  pulse: 'M3 12h4l3-8 4 16 3-8h4',
  report: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M9 13h6M9 17h4',

  // Operación
  box: 'M21 8l-9-5-9 5 9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM11 18h2',
  refresh: 'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6',
  tag: 'M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM7.5 7.5h.01',
  play: 'M9 7l8 5-8 5z',
  pause: 'M9 7v10M15 7v10',
  archive: 'M4 7h16M6 7v12h12V7M9 11h6M5 4h14v3H5z',
  call: 'M8.2 3.7 5.7 5.1c-1.1.6-1.5 1.9-1 3.1 2 5 6 9 11 11 1.2.5 2.5.1 3.1-1l1.4-2.5-4.2-2-1.3 1.7c-2.8-1.2-4.9-3.3-6.1-6.1L10.2 8l-2-4.3Z',

  // Finanzas
  receipt: 'M6 2h12v20l-3-2-3 2-3-2-3 2V2ZM10 8h4M9 12h6',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h3l7 4V6L7 10H4a1 1 0 0 0-1 1ZM18 9a3 3 0 0 1 0 6',
  wallet:
    'M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M21 10h-5a2 2 0 0 0 0 4h5v-4Z',
  money: 'M2 6h20v12H2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M5 9h.01M19 15h.01',
  // Pago y cobro (cosecha de PagaYa)
  qr: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 20h2',
  transfer: 'M4 7h15M15 3l4 4-4 4M20 17H5M9 13l-4 4 4 4',
  subscription: 'M20 7h-7M17 4l3 3-3 3M4 17h7M7 14l-3 3 3 3M6 11a7 7 0 0 1 11-5M18 13a7 7 0 0 1-11 5',
  card: 'M3 5h18v14H3zM3 10h18M7 15h4',
  terminal: 'M12 3 3 8v2h18V8l-9-5ZM5 12v6H3v3h18v-3h-2v-6h-2v6h-4v-6h-2v6H7v-6H5Z',
  nfc: 'M5.25 9a4.5 4.5 0 0 1 0 6M9 6.4a8.25 8.25 0 0 1 0 11.2M13.1 3.75a12 12 0 0 1 0 16.5',

  // Equipo
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3.7 8a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H8a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V8a1.7 1.7 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',

  // Acciones
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  copy: 'M9 9h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2ZM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  share: 'M8.6 13.5l6.8 3.5M15.4 7L8.6 10.5M18.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM5.5 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 22a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  plus: 'M12 5v14M5 12h14',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6',
  backspace: 'M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM18 9l-6 6M12 9l6 6',
  save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2ZM17 21v-8H7v8M7 3v5h8',
  edit: 'M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  eyeOff:
    'M10.6 5.1A9.9 9.9 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-2.4 3.2M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  calendar:
    'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5L22 3Z',
  pin: 'M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0ZM12 10a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  code: 'M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14',
  check: 'M20 6L9 17l-5-5',
  alert:
    'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-4M12 8h.01',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  unlock: 'M5 11h14v10H5zM9 11V7a4 4 0 0 1 7.7-1.5',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  truck:    'M1 3h15v13H1zM16 8h4l3 3v5h-7V8ZM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z',
  store: 'M3 9 4.5 4h15L21 9M3 9h18M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M9 21v-6h6v6',
  printer: 'M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  scissors: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  dots: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  package:
    'M16.5 9.4 7.5 4.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  cart: 'M2.5 3h1.6l2.2 10.4a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L19.5 7H6M9 19.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM18 19.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',

  // ── Módulos y acciones portados del panel de LedBox (AdminIcons, 22-09-2026)
  // Los nombres son estables y la app no necesita un mapa propio; el mapa
  // LedBox → librería está en el README.
  overview:
    'M4.5 3h6A1.5 1.5 0 0 1 12 4.5v6A1.5 1.5 0 0 1 10.5 12h-6A1.5 1.5 0 0 1 3 10.5v-6A1.5 1.5 0 0 1 4.5 3ZM15 3h6a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 21 12h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 15 3ZM15 13.5h6a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5ZM4.5 13.5h6A1.5 1.5 0 0 1 12 15v6a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 3 21v-6a1.5 1.5 0 0 1 1.5-1.5Z',
  events:
    'M4.5 5h15A1.5 1.5 0 0 1 21 6.5v14a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.5v-14A1.5 1.5 0 0 1 4.5 5ZM8 3v4M16 3v4M3 10.5h18',
  clients:
    'M12.2 8a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0ZM3.5 20a5.5 5.5 0 0 1 11 0M16 10.8a3 3 0 1 0 0-5.6M18 19.8a5.4 5.4 0 0 0-2.8-4.6',
  leads: 'M4 5h16l-6.2 7.2V20l-3.6-2v-5.8z',
  budgets: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12.5h6M9 16h4',
  finance:
    'M4.5 6h15A2 2 0 0 1 21.5 8v8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2ZM12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM6 9.8v4.4M18 9.8v4.4',
  inventory: 'M3.5 8 12 4l8.5 4v8L12 20l-8.5-4zM3.5 8 12 12l8.5-4M12 12v8',
  suppliers:
    'M3 7h11v9H3zM14 10h3.6L21 13.2V16h-7zM8.7 18.4a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0ZM18.7 18.4a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0Z',
  promoters: 'M4 10v4h2.6l7.4 4V6l-7.4 4H4zM17 9.2a4 4 0 0 1 0 5.6',
  building:
    'M5 20V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V20M15 10h3.5A1.5 1.5 0 0 1 20 11.5V20M3 20h18M8 8h4M8 12h4M8 16h4',
  plan: 'M12 3.6 20 8l-8 4.4L4 8zM4 12.4 12 16.8l8-4.4M4 16.4 12 20.8l8-4.4',
  audit: 'M7 4h8.5L19 7.5V20H7zM15.5 4v3.5H19M9.8 13.6l1.7 1.8 3-3.6M9.8 17.6h4.4',
  arrowRight: 'M4 12h15M13.5 6.5 19.5 12l-6 5.5',
  arrowLeft: 'M20 12H5M10.5 6.5 4.5 12l6 5.5',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6',
  moon: 'M20 14.6A8.6 8.6 0 0 1 9.4 4 8.6 8.6 0 1 0 20 14.6z',
  power: 'M12 4v7.5M7.6 7a6.8 6.8 0 1 0 8.8 0',
  // `mail` conserva el trazo que la app ya tenía en producción (esquinas
  // rectas); el redondeado anterior queda reemplazado por paridad (#253).
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 2 8 6 8-6',
  bank: 'M3.5 9.5 12 4l8.5 5.5M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3 19.5h18',
  checkin: 'M4 12h11M10.5 7.5 15 12l-4.5 4.5M20 4.5v15',
  globe: 'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM4 12h16M15.6 12a3.6 8 0 1 1-7.2 0 3.6 8 0 0 1 7.2 0Z',
  database:
    'M19.6 6.2a7.6 2.9 0 1 1-15.2 0 7.6 2.9 0 0 1 15.2 0ZM4.4 6.2v11.6c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V6.2M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9',
  instagram:
    'M8.1 3.5h7.8a4.6 4.6 0 0 1 4.6 4.6v7.8a4.6 4.6 0 0 1-4.6 4.6H8.1a4.6 4.6 0 0 1-4.6-4.6V8.1a4.6 4.6 0 0 1 4.6-4.6ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.2 6.9h.01',
}

/** Nombres de ícono disponibles (el set es estable: no se renombran glifos). */
export const ICONOS = Object.keys(PATHS)

export default function Icon({ name, className, ...props }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4 shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      {d
        .split('M')
        .filter(Boolean)
        .map((seg, i) => (
          <path key={i} d={'M' + seg} />
        ))}
    </svg>
  )
}
