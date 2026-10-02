// Lightweight editorial metadata shared with the gallery.
export const BLOG_POSTS = [
  {
    "slug": "sistema-diseno-react-compartido",
    "title": "Un sistema de diseño React compartido, sin copias locales",
    "description": "Cómo adoptar OwnCoding UI mediante componentes, tokens y contratos compartidos, sin duplicar interfaces en cada aplicación.",
    "category": "Arquitectura",
    "demo": "#catalogo",
    "published": "2026-10-02"
  },
  {
    "slug": "logos-bancos-compacto-horizontal",
    "title": "Logos bancarios: cuándo usar compacto y horizontal",
    "description": "Criterios para mostrar marcas bancarias reales sin deformarlas y elegir variantes compactas u horizontales en OwnCoding UI.",
    "category": "Marcas",
    "demo": "#preview-bancos-pagos",
    "published": "2026-10-02"
  },
  {
    "slug": "pagos-billeteras-marcas",
    "title": "Medios de pago, billeteras y marcas: separar funciones",
    "description": "Cómo organizar marcas de pago en una interfaz sin confundir un logo disponible con una integración comercial activa.",
    "category": "Pagos",
    "demo": "#preview-bancos-pagos",
    "published": "2026-10-02"
  },
  {
    "slug": "telefono-paraguay-595",
    "title": "Teléfonos de Paraguay: +595 por defecto, sin cerrar otros países",
    "description": "Diseñar un campo internacional con banderas, búsqueda de país y valor normalizado usando PhoneField de OwnCoding UI.",
    "category": "Formularios",
    "demo": "#preview-telefono-py",
    "published": "2026-10-02"
  },
  {
    "slug": "ciudad-departamento-paraguay",
    "title": "Ciudad y departamento: autocompletar sin inventar direcciones",
    "description": "Cómo usar CityAutocomplete para derivar un departamento al elegir una ciudad y manejar entradas que no tienen coincidencia.",
    "category": "Automatización",
    "demo": "#preview-ciudad-departamento",
    "published": "2026-10-02"
  },
  {
    "slug": "ruc-extraccion-confirmable",
    "title": "RUC con extracción confirmable: ayudar sin sobrescribir datos",
    "description": "Implementar RucField con entradas numéricas, proveedor explícito y revisión del resultado antes de completar un cliente.",
    "category": "Datos",
    "demo": "#preview-cliente-ci-ruc",
    "published": "2026-10-02"
  },
  {
    "slug": "formularios-validacion-accesibilidad",
    "title": "Formularios accesibles: etiquetas, errores y control del estado",
    "description": "Un recorrido práctico para componer campos de OwnCoding UI y revisar mensajes, teclado y validación sin depender solo del color.",
    "category": "Accesibilidad",
    "demo": "#catalogo",
    "published": "2026-10-02"
  },
  {
    "slug": "estados-vacio-carga-error",
    "title": "Vacío, carga y error: tres estados que no deben confundirse",
    "description": "Cómo presentar Skeleton, EmptyState y ErrorState según lo que realmente conoce la aplicación y ofrecer una siguiente acción útil.",
    "category": "Experiencia",
    "demo": "#catalogo",
    "published": "2026-10-02"
  },
  {
    "slug": "footers-prefooters-version-app",
    "title": "Footers, prefooters y versión: cerrar una pantalla con información útil",
    "description": "Organizar enlaces, acciones e identidad de aplicación con ProductFooter, ProductPrefooter y crearIdentidadApp.",
    "category": "Composición",
    "demo": "#catalogo",
    "published": "2026-10-02"
  },
  {
    "slug": "galeria-componentes-adopcion-pruebas",
    "title": "De la galería a la aplicación: adoptar componentes con pruebas",
    "description": "Usar las previews de OwnCoding UI para revisar contratos, integrar una tarea real y distinguir demo, código y despliegue.",
    "category": "Calidad",
    "demo": "#catalogo",
    "published": "2026-10-02"
  }
]

export const articlePath = (article) => `/blog/${article.slug}/`
