// Catálogo explícito de la entrada raíz. No importa ni ejecuta exports:
// cada componente visual tiene una ficha y solo los IDs de presentación
// aprobados se renderizan en la galería. scripts/gallery-check.mjs exige paridad.

export const CATALOGO_EXPORTS = [
{"nombre": "Carousel", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "OtpVerification", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "AnimatedStatus", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "MotionSurface", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},

{"nombre": "Combobox", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "Popover", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "Tooltip", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "CloseButton", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "AppHeader", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "PublicHeader", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "ProfileCard", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "UserMenu", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "AccountSwitcher", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "NotificationCenter", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "AsyncButton", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "FooterPreset", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "CopyButton", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "ActionToolbar", "tipo": "visual", "categoria": "Componentes generales", "presentacion": "individual"},
{"nombre": "ImeiField", "tipo": "visual", "categoria": "Campos y formularios", "presentacion": "individual"},
{"nombre": "LARGO_IMEI", "tipo": "api", "categoria": "API y modelos", "presentacion": null},
{"nombre": "MENSAJES_IMEI", "tipo": "api", "categoria": "API y modelos", "presentacion": null},
{"nombre": "analizarImei", "tipo": "api", "categoria": "API y modelos", "presentacion": null},
{"nombre": "estadoImei", "tipo": "api", "categoria": "API y modelos", "presentacion": null},
{"nombre": "normalizarImei", "tipo": "api", "categoria": "API y modelos", "presentacion": null},
  {
    "nombre": "agregarEstado",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "agruparHitos",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "agruparPorDia",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "agruparResultados",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "agruparTarjetas",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "AjustesImpresion",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "anchoParaLargo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ANCHOS_PAPEL",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ANCHOS_PRUEBA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "aplicarTema",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "AuthLayout",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "AVANCES_FIRMA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Avatar",
    "tipo": "visual",
    "categoria": "Identidad y privacidad",
    "presentacion": "individual"
  },
  {
    "nombre": "Aviso",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "estados"
  },
  {
    "nombre": "AVISO_REFRESCO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "AvisoPrivacidad",
    "tipo": "visual",
    "categoria": "Identidad y privacidad",
    "presentacion": "individual"
  },
  {
    "nombre": "AyudaModulo",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "Badge",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "datos"
  },
  {
    "nombre": "BancoCombobox",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "bancos-pagos",
    "destacado": {
      "id": "bancos-pagos",
      "prioridad": 1,
      "etiqueta": "01 · Finanzas",
      "titulo": "Bancos y medios de pago",
      "descripcion": "Selección bancaria con variantes compacta y horizontal, más marcas de pago con procedencia y fallback seguro."
    }
  },
  {
    "nombre": "BancoLogo",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "bancos"
  },
  {
    "nombre": "BANCOS_PARAGUAY",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "BANCOS_Y_FINANCIERAS_PARAGUAY",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "BarraInferior",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "BarraLote",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "BarraProgreso",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "bloqueFirma",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "BloquePago",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "BotonCargaIA",
    "tipo": "visual",
    "categoria": "Carga con IA",
    "presentacion": "individual"
  },
  {
    "nombre": "BotonDentroCampo",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "BotonImprimir",
    "tipo": "visual",
    "categoria": "Documentos e impresión",
    "presentacion": "individual"
  },
  {
    "nombre": "BuscadorCliente",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "BuscadorDispositivo",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "BuscadorPersonas",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "BuscadorProveedor",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "buscarCiudad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "buscarDispositivo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "buscarEnCatalogo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "buscarPaisesTelefono",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "buscarRelacionesFinancieras",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Button",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "acciones"
  },
  {
    "nombre": "Calendario",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "CampanaAvisos",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "campoBuscableCliente",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "campoBuscableCuenta",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "campoDeTipoIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "CAMPOS_DISPOSITIVO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CAMPOS_IA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "CampoSeriales",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "campoVacio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CAPACIDADES_IPHONE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Card",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "caretTrasDigitos",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CargaIA",
    "tipo": "visual",
    "categoria": "Carga con IA",
    "presentacion": "ia"
  },
  {
    "nombre": "categoriaDe",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CATEGORIAS_ACCESORIOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CATEGORIAS_FUSION",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CATEGORIAS_PRODUCTO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "categoriasFusion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CELDA_DATO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CELDA_ENCABEZADO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CELDA_IDENTIDAD",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CELDA_IDENTIDAD_GRANDE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CELDA_NUMERO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CeldaMoneda",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "Checkbox",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "seleccion"
  },
  {
    "nombre": "chipDeTono",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ChipEstado",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "ChipFusion",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "ChipOrigen",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "ChipPrioridad",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "ChipsLocks",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "CIERRE_CON_CAMBIOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CityAutocomplete",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "ciudad-departamento",
    "destacado": {
      "id": "ciudad-departamento",
      "prioridad": 3,
      "etiqueta": "03 · Ubicación",
      "titulo": "Ciudad con departamento automático",
      "descripcion": "Autocompletado local de ciudades paraguayas que deriva el departamento al escribir o seleccionar."
    }
  },
  {
    "nombre": "CIUDADES_PARAGUAY",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CLAVE_USO_PERSONAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveColorDeNombre",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveDeEstado",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveDeEstadoCompra",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveDeEstadoEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveDeEstadoRecepcion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveDeMetodoEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveDePrioridad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveDia",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveRevision",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "claveTelefonoCliente",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "cn",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "coberturaBancos",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "coberturaMediosPago",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "codigoDeDispositivo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "codigoPais",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "CodigoQr",
    "tipo": "visual",
    "categoria": "Documentos e impresión",
    "presentacion": "individual"
  },
  {
    "nombre": "CODIGOS_PAIS",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "coincideTelefonoCliente",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "COLOR_BADGE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "COLOR_DE_TONO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "colorBadge",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "colorDeBanco",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "colorDeNombre",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "colorDeTono",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "COLORES_AVATAR",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "COLORES_BANCO_RESPALDO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "COLORES_IPHONE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "colorTrabajo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ColumnaLote",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "columnasDeAncho",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "columnasDelTablero",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "compararVersiones",
    "tipo": "api",
    "categoria": "Identidad y versión",
    "presentacion": null
  },
  {
    "nombre": "completeSave",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "componerTelefono",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "CONDICION_UNIDAD",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CONECTIVIDADES_MOVIL",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "conexionDeDestino",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ConfirmarConPalabra",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "ConfirmDialog",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "conFormulario",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ConsentimientoDatos",
    "tipo": "visual",
    "categoria": "Identidad y privacidad",
    "presentacion": "individual"
  },
  {
    "nombre": "ContadoresCompra",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "ContadorLote",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "contarSinLeer",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ConteoChecklist",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "COOPERATIVAS_PARAGUAY",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CORTES_PRUEBA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CountryPhoneSelect",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "telefono"
  },
  {
    "nombre": "crearEnvioUnico",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "crearIdentidadApp",
    "tipo": "api",
    "categoria": "Identidad y versión",
    "presentacion": null
  },
  {
    "nombre": "crearPilaCapas",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "crearRegistroPendientes",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "crearTicket",
    "tipo": "api",
    "categoria": "Impresión",
    "presentacion": null
  },
  {
    "nombre": "CREDITO_PIE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "CREDITO_PIE_URL",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Cronologia",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "CurrencySelect",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "DataTable",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "departamentoDe",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "DEPARTAMENTOS_PARAGUAY",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "destinoDeConexion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "destinoDeTab",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "DestinoRecepcion",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "destinosDeTarjeta",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "detalleCliente",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "detalleCuentaCobro",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "detalleProveedor",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "DialogoCargaIA",
    "tipo": "visual",
    "categoria": "Carga con IA",
    "presentacion": "individual"
  },
  {
    "nombre": "DIAS_SEMANA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "diasHasta",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "digitosCliente",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "DISPOSITIVOS_MOBILE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "DocumentoImpresion",
    "tipo": "visual",
    "categoria": "Documentos e impresión",
    "presentacion": "individual"
  },
  {
    "nombre": "DOMINIOS_EMAIL",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Dot",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "datos"
  },
  {
    "nombre": "Drawer",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "EMAIL_RE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "EmailField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "emailValido",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "EmptyState",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "estados"
  },
  {
    "nombre": "enHorarioSilencioso",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "envolver",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "errorMonto",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "ErrorState",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "esApellidosPrimero",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "esAtajo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "esClaveDia",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "esIncidencia",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESPACIO_BARRA_INFERIOR",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "esRazonSocial",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "esRuc",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADO_IMPRESORA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "EstadoBadge",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "estadoChip",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoCompra",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoDeDiagnostico",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "EstadoGuardado",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "estadoItem",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoLock",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoNecesidad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoPaleta",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoRecepcion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_CHIP",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_COMPRA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_CUOTA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_ENVIO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_ITEM",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_LOCK",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_NECESIDAD",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_PRESENCIA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_RECEPCION",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ESTADOS_REVISION",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "estadoVencimiento",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "esToken",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "esVersionApp",
    "tipo": "api",
    "categoria": "Identidad y versión",
    "presentacion": null
  },
  {
    "nombre": "ETIQUETA_ESTADO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ETIQUETA_PERIODO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ETIQUETA_TRABAJO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaCompra",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaCondicion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaDeCategoria",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaDeHito",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaDia",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaDiaCorta",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaDispositivo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "EtiquetaLote",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "etiquetaMedioCuenta",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaMes",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaMetodoEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaNecesidad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaOrigen",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaPersona",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaPluralRevision",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaPrioridad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaRecepcion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaRevision",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ETIQUETAS_HITO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaTrabajo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "etiquetaVersionApp",
    "tipo": "api",
    "categoria": "Identidad y versión",
    "presentacion": null
  },
  {
    "nombre": "excedeMonto",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "EXTENSION_IMAGEN",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "extractTokenFromUrl",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "extraerRuc",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Eyebrow",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "FECHA_VERIFICACION_MARCAS_FINANCIERAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "FECHA_VERIFICACION_RELACIONES_FINANCIERAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "fechaCorta",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "fechaDeClave",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "fechaDia",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "fechaHora",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "fechaHoraCorta",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "fechaLista",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "fechaListaCorta",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "fechaValida",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "FichaCertificado",
    "tipo": "visual",
    "categoria": "Documentos e impresión",
    "presentacion": "individual"
  },
  {
    "nombre": "FilaChecklist",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "FilaDato",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "FilaRevision",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "filtrarClientes",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "filtrarCuentasCobro",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "filtrarPersonas",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "filtrarProveedores",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "FormActions",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "formatGs",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "formatGsInput",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "formatMoney",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "formatoNumero",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "formatPercent",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "formatUsd",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "formatUsdInput",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "FormField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "GLIFOS_CATEGORIA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "GoogleButton",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "GoogleMark",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "GradoBadge",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "gradoCondicion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "GRADOS_CONDICION",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "GraficoBarras",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "GRILLA_DOS_COLUMNAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "GRILLA_DOS_COLUMNAS_COMPACTA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "hayFusion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "hayVersionNueva",
    "tipo": "api",
    "categoria": "Identidad y versión",
    "presentacion": null
  },
  {
    "nombre": "hoyClave",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "IA_BOTON",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_DIALOGO_COMPLETO_CAMPOS",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_DIALOGO_COMPLETO_REGISTROS",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_RATE_LIMIT",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_REGISTROS_MAX",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_TEXTO_MAX",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_TIMEOUT_MS",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_TITULO",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_TOKENS_MAX",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "IA_TOOLTIP",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "Icon",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "IconAction",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "ICONO_CATEGORIA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "IconoCategoria",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "iconoDeCategoria",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "iconoMedioCuenta",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "iconoMetodoEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "iconoOrigen",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ICONOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ICONOS_HITO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "identidadDeUsuario",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "imeiValido",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ImporteDelta",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "INCIDENCIAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "IndicadorConexion",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "indiceSemana",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "inicialesDeBanco",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "inicialesDeNombre",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Input",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "campos"
  },
  {
    "nombre": "InstagramField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "institucionesSugeridasPorMarca",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "internationalPhone",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Label",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "largoMaximo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "largoMaximoMonto",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "largoMinimo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "leerUsoPersonas",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "LIMITE_CUENTAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "LIMITE_MONTO_ALMACENABLE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "LIMITE_MONTO_GENERAL",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "LIMITE_MONTO_VENTAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "limiteMonto",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "limpiarDependientes",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "limpiarError",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "limpiarPercent",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "limpiarTaxId",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ListGridToggle",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "LoadingScreen",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "LOCKS_DISPOSITIVO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "logoDeBanco",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "logoDeMedioPago",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "LOGOS_BANCOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ManifiestoEnvio",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "MARCAS_ACCESORIOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MARCAS_CON_RELACION_FINANCIERA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MARCAS_MEDIOS_PAGO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "marcasRelacionadasConInstitucion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MARGEN_VENTANA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "maximo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "maximoDeBarras",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MedidorBateria",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "MedidorStock",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "MedioPagoLogo",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "pagos"
  },
  {
    "nombre": "MEDIOS_CUENTA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MEDIOS_PAGO_CON_MARCA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MENSAJE_RUC",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MENSAJE_RUC_CONSULTA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MENSAJE_RUC_SIN_DATOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MENSAJE_TELEFONO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "mensajeFallo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "mensajeResultado",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MENSAJES_VALIDACION",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MenuDesplegable",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "metodoEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "METODOS_ENVIO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "mimeDeImagen",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "MIMES_IMAGEN",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "minimo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "mismoMes",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Modal",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "MODELOS_IPHONE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Money",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "MoneyInput",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "montoConSigno",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "montoGs",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "montoTexto",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "montoUsd",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "motivoDeDiagnostico",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "motivosDuplicadoCliente",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "NavegacionSeccion",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "NavLateral",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "nombreDeDispositivo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "nombrePartes",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "nombreProveedor",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarAnalisisIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "normalizarBanco",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "normalizarBusqueda",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarCategoria",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarInstagram",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarMarcaPago",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "normalizarMontoInput",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "normalizarNombre",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarPersonaTexto",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarProveedor",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarRelacionFinanciera",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarResultadoIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "normalizarSerial",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarSeriales",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "normalizarTelefono",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "normalizeTaxId",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Nota",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "NumericKeypad",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "numeroParcialCuenta",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "OAuthDivider",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "obligatorio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "opcionesDeCampoIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "opcionesDependiente",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ordenarPersonas",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ordenarPorPrioridad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ordenDePrioridad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "origenDe",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ORIGENES_NECESIDAD",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PageHeader",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "paginaDePrueba",
    "tipo": "api",
    "categoria": "Impresión",
    "presentacion": null
  },
  {
    "nombre": "paginaDePruebaSimple",
    "tipo": "api",
    "categoria": "Impresión",
    "presentacion": null
  },
  {
    "nombre": "PAISES_TELEFONO",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "paisesDeCodigo",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "paisTelefonoPorIso",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "PaletaComandos",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "PanelDerecho",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "parseGsInput",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "parsePercent",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "parseTelefono",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "parseTelefonoInternacional",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "parseUsdInput",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "partesVersion",
    "tipo": "api",
    "categoria": "Identidad y versión",
    "presentacion": null
  },
  {
    "nombre": "partirSerial",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PASOS_ENVIO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PASOS_NECESIDAD",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PasosEquipo",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "PasswordInput",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "patron",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PATRON_RUC",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PATRON_TAX_ID_GENERICO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "payloadPush",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PegarEnlaceToken",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "PercentField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "seleccion"
  },
  {
    "nombre": "PERFILES_DISPOSITIVO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "periodoDeRango",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "PERIODOS_FECHA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PeriodoTabs",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "PersonaChip",
    "tipo": "visual",
    "categoria": "Identidad y privacidad",
    "presentacion": "individual"
  },
  {
    "nombre": "PhoneField",
    "tipo": "visual",
    "categoria": "Teléfono y países",
    "presentacion": "telefono-py",
    "destacado": {
      "id": "telefono-py",
      "prioridad": 2,
      "etiqueta": "02 · Mobile",
      "titulo": "Teléfono internacional",
      "descripcion": "Paraguay, +595 y bandera por defecto; búsqueda de países, salida E.164 y estados de validación."
    }
  },
  {
    "nombre": "PIE_ACCIONES",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PIE_ACCIONES_REVERSO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PilaPersonas",
    "tipo": "visual",
    "categoria": "Identidad y privacidad",
    "presentacion": "individual"
  },
  {
    "nombre": "PinInput",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "PlanPagos",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "PLANTILLA_PRUEBA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "plantillaDePrueba",
    "tipo": "api",
    "categoria": "Impresión",
    "presentacion": null
  },
  {
    "nombre": "porcentajeBarra",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "prepararImagen",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "preseleccionDeCuenta",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "PreviewFusion",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "primerNombre",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "prioridadDe",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "PRIORIDADES_COMPRA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ProductCombobox",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "ProductFooter",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "ProductPrefooter",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "progresoChecklist",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ProgresoChecklist",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "puntoDeTono",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "QR_OPCIONES",
    "tipo": "api",
    "categoria": "Impresión",
    "presentacion": null
  },
  {
    "nombre": "qrDataUrl",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "rangoDePeriodo",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "RangoFecha",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "rangoInvertido",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "rangoMes",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "rangoSemana",
    "tipo": "api",
    "categoria": "Fecha y agenda",
    "presentacion": null
  },
  {
    "nombre": "registrarUsoPersona",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "registroConsentimiento",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "registrosIncluidosIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "RELACIONES_FINANCIERAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "relacionFinancieraDe",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "repartirLinea",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "resolverRecientes",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "RESULTADOS_VALIDOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ResumenDestinos",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "ResumenIncidencias",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "resumenPresencia",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ResumenRecepcion",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "ROTULO_DATO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ROTULO_SECCION",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "RUC_RE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "RucField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "cliente-ci-ruc",
    "destacado": {
      "id": "cliente-ci-ruc",
      "prioridad": 4,
      "etiqueta": "04 · Clientes",
      "titulo": "Búsqueda por CI/RUC",
      "descripcion": "Encuentra clientes por documento y simula la extracción de datos de un RUC sin llamar proveedores reales."
    }
  },
  {
    "nombre": "rutaDeAviso",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "SaveActions",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "SearchField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "SeccionColapsable",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "SectionState",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "SegmentedField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "Select",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "campos"
  },
  {
    "nombre": "SELECTOR_ENFOCABLES",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "SelectorCuentaCobro",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "SelectorIncidencia",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "SemaforoItem",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "separarSeriales",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "serialEnmascarado",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "SerialField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "SerialTexto",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "signoDe",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "SIMBOLO_PYG",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "simboloCuenta",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "SIMBOLOS_CUENTA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "SIMBOLOS_MONEDA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Skeleton",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "estados"
  },
  {
    "nombre": "soloDigitos",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Stat",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "datos"
  },
  {
    "nombre": "Stepper",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "SubidaImagen",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "Subtabs",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "sugerenciasDe",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "sugerenciasDeBanco",
    "tipo": "api",
    "categoria": "Finanzas y pagos",
    "presentacion": null
  },
  {
    "nombre": "sugerenciasDeMarcaPago",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "sumarDias",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "sumarMeses",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Switch",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "seleccion"
  },
  {
    "nombre": "TableroKanban",
    "tipo": "visual",
    "categoria": "Datos y estados",
    "presentacion": "individual"
  },
  {
    "nombre": "TAMANO_MAXIMO_IMAGEN",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TAMANO_MODAL_PREDETERMINADO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TAMANO_OBJETIVO_IMAGEN",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tamanoDialogoIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "TAMANOS_AVATAR",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TAMANOS_CAMPO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TAMANOS_MODAL",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TarjetaAjuste",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "TarjetaCompra",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "TarjetaCuentaCobro",
    "tipo": "visual",
    "categoria": "Finanzas y pagos",
    "presentacion": "individual"
  },
  {
    "nombre": "TarjetaLote",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "TarjetaNecesidad",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "TarjetaRecepcion",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "TaxIdField",
    "tipo": "visual",
    "categoria": "Campos y formularios",
    "presentacion": "individual"
  },
  {
    "nombre": "taxIdGenericoValid",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "taxIdValid",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "taxIdValidoParaPais",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "telefonoE164",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "telefonoInternacionalValido",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "telefonoValido",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "telefonoVisible",
    "tipo": "api",
    "categoria": "Teléfono y países",
    "presentacion": null
  },
  {
    "nombre": "TEMA_CLARO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TEMA_OSCURO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Textarea",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "campos"
  },
  {
    "nombre": "textoContador",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "textoDeTono",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "textoVerificacion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ThemeToggle",
    "tipo": "visual",
    "categoria": "Shell y acceso",
    "presentacion": "individual"
  },
  {
    "nombre": "TileEquipo",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "TileRol",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "tipoDeEsquemaIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "TIPOS_PRUEBA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TIPOS_TICKET_PRUEBA",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tituloDeRegistroIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "ToastProvider",
    "tipo": "visual",
    "categoria": "Componentes generales",
    "presentacion": "individual"
  },
  {
    "nombre": "TONO_ESTADO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoBateria",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoCanonico",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoCompra",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoDelta",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoEnvio",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoNecesidad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoOrigen",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoPrioridad",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoRecepcion",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoRevision",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TONOS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TONOS_ALIAS",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "TONOS_HITO",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "tonoVencimiento",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "ultimos4",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "UMBRAL_BATERIA_ATENCION",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "UMBRAL_BATERIA_OK",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useComboboxNavigation",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useDialogClose",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useDialogDirty",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useDialogFocusTrap",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useDialogPending",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useResultado",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useSingleFlightSubmit",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useTableroOptimista",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useToast",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "useValidacionCampos",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "validarCampo",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "validarCampos",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "validarImagen",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "validarRegistrosIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "valorVacioIA",
    "tipo": "api",
    "categoria": "Carga con IA",
    "presentacion": null
  },
  {
    "nombre": "VARIANTES_CORTE",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "Vencimiento",
    "tipo": "visual",
    "categoria": "Operación",
    "presentacion": "individual"
  },
  {
    "nombre": "ventanaDeLista",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  },
  {
    "nombre": "VERSION_APP_RE",
    "tipo": "api",
    "categoria": "Identidad y versión",
    "presentacion": null
  },
  {
    "nombre": "VistaPreviaPapel",
    "tipo": "visual",
    "categoria": "Documentos e impresión",
    "presentacion": "individual"
  },
  {
    "nombre": "whatsappUrl",
    "tipo": "api",
    "categoria": "API y modelos",
    "presentacion": null
  }
]

export const DESTACADOS_CATALOGO = CATALOGO_EXPORTS
  .filter((item) => item.destacado)
  .sort((a, b) => a.destacado.prioridad - b.destacado.prioridad)

const prioridadPorCategoria = DESTACADOS_CATALOGO.reduce((mapa, item) => {
  const actual = mapa.get(item.categoria) ?? Number.POSITIVE_INFINITY
  mapa.set(item.categoria, Math.min(actual, item.destacado.prioridad))
  return mapa
}, new Map())

// Las categorías que contienen automatizaciones destacadas aparecen primero;
// el resto conserva el orden estable del catálogo raíz.
export const CATEGORIAS_CATALOGO = [...new Set(CATALOGO_EXPORTS.map((item) => item.categoria))]
  .map((categoria, indice) => ({ categoria, indice }))
  .sort((a, b) => (
    (prioridadPorCategoria.get(a.categoria) ?? Number.POSITIVE_INFINITY)
    - (prioridadPorCategoria.get(b.categoria) ?? Number.POSITIVE_INFINITY)
    || a.indice - b.indice
  ))
  .map(({ categoria }) => categoria)
