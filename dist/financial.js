"use client"

// src/utils/bancos.js
var FECHA_VERIFICACION_MARCAS_FINANCIERAS = "2026-10-01";
var BANCOS_Y_FINANCIERAS_PARAGUAY = [
  "Banco Atlas",
  "Banco Basa",
  "Banco Continental",
  "Banco de la Naci\xF3n Argentina",
  "Banco do Brasil",
  "Banco Familiar",
  "Banco GNB Paraguay",
  "Interfisa Banco",
  "Ita\xFA",
  "Banco Nacional de Fomento",
  "Sudameris",
  "Bancop",
  "Citi",
  "Financiera FIC",
  "Financiera Paraguayo Japonesa",
  "Finlatina",
  "Solar Banco",
  "Tu Financiera",
  "ueno bank",
  "Zeta Banco"
];
var COOPERATIVAS_PARAGUAY = [
  "Coomecipar",
  "Medalla Milagrosa",
  "San Crist\xF3bal",
  "Universitaria"
];
var BANCOS_PARAGUAY = [...BANCOS_Y_FINANCIERAS_PARAGUAY, ...COOPERATIVAS_PARAGUAY];
var EMPAQUETADO = (archivo, estado = "oficial", presentacion = {}) => ({ tipo: "archivo", archivo, estado, empaquetado: `bancos/${archivo}`, ...presentacion });
var CONTENIDO = (archivo) => ({ ...EMPAQUETADO(archivo, "fallback"), tipo: "horizontal-contained" });
var MONOGRAMA = (estado = "fallback") => ({ tipo: "monograma", estado });
var TEXTO = (estado = "fallback") => ({ tipo: "texto", estado });
function variantesFallback(estado = "fallback") {
  return { compacto: MONOGRAMA(estado), horizontal: TEXTO(estado) };
}
function tieneAssetEmpaquetado(variantes) {
  return Boolean(variantes && Object.values(variantes).some((visual) => visual?.empaquetado));
}
function entrada({ categoria, alias = [], monograma, color, fuenteOficial, estado = "parcial", variantes, redistribucion, ...legacy }) {
  const permiso = redistribucion?.permitida === true && Boolean(redistribucion.evidencia);
  const requierePermiso = tieneAssetEmpaquetado(variantes);
  return {
    categoria,
    alias,
    monograma,
    color,
    fuenteOficial,
    verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS,
    estado: requierePermiso && !permiso ? "permiso-pendiente" : estado,
    redistribucion: permiso ? { permitida: true, evidencia: redistribucion.evidencia } : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso ? variantesFallback("permiso-pendiente") : variantes || variantesFallback(estado === "permiso-pendiente" ? "permiso-pendiente" : "fallback"),
    ...legacy
  };
}
var LOGOS_BANCOS = {
  "Banco Atlas": entrada({
    categoria: "banco",
    alias: ["atlas"],
    monograma: "BA",
    color: "#174A7E",
    fuenteOficial: "https://www.bancoatlas.com.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Banco Basa": entrada({
    categoria: "banco",
    monograma: "B",
    color: "#E94B35",
    archivo: "banco-basa.svg",
    fuenteOficial: "https://www.bancobasa.com.py/",
    estado: "verificado",
    variantes: {
      compacto: EMPAQUETADO("banco-basa-compacto.svg"),
      horizontal: EMPAQUETADO("banco-basa.svg")
    }
  }),
  "Banco Continental": entrada({
    categoria: "banco",
    alias: ["continental"],
    monograma: "BC",
    color: "#1C4480",
    marca: "continental",
    fuenteOficial: "https://www.bancontinental.com.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Banco de la Naci\xF3n Argentina": entrada({
    categoria: "banco",
    alias: ["banco nacion", "banco naci\xF3n", "bna"],
    monograma: "BNA",
    color: "#005F5B",
    archivo: "banco-nacion-argentina.svg",
    chip: true,
    fuenteOficial: "https://www.bna.com.ar/Downloads/Libro_Banco_Nacion.pdf",
    estado: "verificado",
    variantes: {
      compacto: EMPAQUETADO("banco-nacion-argentina-compacto.png"),
      horizontal: EMPAQUETADO("banco-nacion-argentina.svg")
    }
  }),
  "Banco do Brasil": entrada({
    categoria: "banco",
    alias: ["bb", "brasil"],
    monograma: "BB",
    color: "#173E91",
    fuenteOficial: "https://www.bb.com.br/docs/portal/dimac/CCBB-Manual-de-identidade-da-Marca.pdf",
    estado: "parcial",
    variantes: variantesFallback()
  }),
  "Banco Familiar": entrada({
    categoria: "banco",
    alias: ["familiar"],
    monograma: "BF",
    color: "#004B8D",
    marca: "familiar",
    fuenteOficial: "https://www.familiar.com.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Banco GNB Paraguay": entrada({
    categoria: "banco",
    alias: ["gnb", "banco gnb"],
    monograma: "GNB",
    color: "#00563F",
    archivo: "banco-gnb.svg",
    fuenteOficial: "https://www.bancognb.com.py/",
    estado: "parcial",
    variantes: {
      compacto: CONTENIDO("banco-gnb.svg"),
      horizontal: EMPAQUETADO("banco-gnb.svg")
    }
  }),
  "Interfisa Banco": entrada({
    categoria: "banco",
    alias: ["interfisa", "banco interfisa"],
    monograma: "IB",
    color: "#00594C",
    fuenteOficial: "https://www.interfisa.com.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Ita\xFA": entrada({
    categoria: "banco",
    alias: ["itau", "banco itau", "itau paraguay", "banco ita\xFA paraguay"],
    monograma: "I",
    color: "#EC7000",
    fuenteOficial: "https://www.itau.com.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Banco Nacional de Fomento": entrada({
    categoria: "banco",
    alias: ["bnf", "nacional de fomento"],
    monograma: "BNF",
    color: "#006A44",
    fuenteOficial: "https://www.bnf.gov.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Sudameris": entrada({
    categoria: "banco",
    alias: ["banco sudameris"],
    monograma: "S",
    color: "#009A49",
    archivo: "sudameris.svg",
    fuenteOficial: "https://www.sudameris.com.py/",
    estado: "parcial",
    variantes: {
      compacto: { ...CONTENIDO("sudameris.svg"), fondo: "#00583F", padding: true },
      horizontal: EMPAQUETADO("sudameris.svg", "oficial", { fondo: "#00583F", padding: true })
    }
  }),
  "Bancop": entrada({
    categoria: "banco",
    monograma: "B",
    color: "#006B3C",
    fuenteOficial: "https://www.bancop.com.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Citi": entrada({
    categoria: "banco",
    alias: ["citibank", "citibank paraguay"],
    monograma: "C",
    color: "#59636E",
    fuenteOficial: "https://www.citigroup.com/citi/about/countries-and-jurisdictions/paraguay.html",
    estado: "permiso-pendiente",
    variantes: variantesFallback("permiso-pendiente")
  }),
  "Financiera FIC": entrada({
    categoria: "financiera",
    alias: ["fic"],
    monograma: "FIC",
    color: "#C8102E",
    archivo: "financiera-fic.png",
    fuenteOficial: "https://fic.com.py/",
    estado: "parcial",
    variantes: {
      compacto: CONTENIDO("financiera-fic.png"),
      horizontal: EMPAQUETADO("financiera-fic.png")
    }
  }),
  "Financiera Paraguayo Japonesa": entrada({
    categoria: "financiera",
    alias: ["fpj", "paraguayo japonesa"],
    monograma: "FPJ",
    color: "#0066A4",
    archivo: "financiera-paraguayo-japonesa.png",
    fuenteOficial: "https://www.fpj.com.py/",
    estado: "verificado",
    variantes: {
      compacto: EMPAQUETADO("financiera-paraguayo-japonesa-compacto.png", "oficial", { fondo: "#0066A4", padding: true }),
      horizontal: EMPAQUETADO("financiera-paraguayo-japonesa.png", "oficial", { fondo: "#0066A4", padding: true })
    }
  }),
  "Finlatina": entrada({
    categoria: "financiera",
    alias: ["financiera finlatina"],
    monograma: "FL",
    color: "#24537A",
    fuenteOficial: "https://www.finlatina.com.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Solar Banco": entrada({
    categoria: "banco",
    alias: ["solar", "solar ahorro y finanzas"],
    monograma: "S",
    color: "#F36F21",
    archivo: "solar-banco.svg",
    fuenteOficial: "https://solar.com.py/",
    estado: "parcial",
    variantes: {
      compacto: CONTENIDO("solar-banco.svg"),
      horizontal: EMPAQUETADO("solar-banco.svg")
    }
  }),
  "Tu Financiera": entrada({
    categoria: "financiera",
    alias: ["tu financiera"],
    monograma: "TF",
    color: "#314255",
    fuenteOficial: "https://www.bcp.gov.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "ueno bank": entrada({
    categoria: "banco",
    alias: ["ueno", "ueno bank", "Ueno Bank"],
    monograma: "U",
    color: "#7B2CF5",
    marca: "ueno",
    archivo: "ueno-bank.svg",
    fuenteOficial: "https://www.ueno.com.py/",
    estado: "verificado",
    variantes: {
      compacto: EMPAQUETADO("ueno-bank-compacto.svg"),
      horizontal: EMPAQUETADO("ueno-bank.svg")
    }
  }),
  "Zeta Banco": entrada({
    categoria: "banco",
    alias: ["zeta", "finexpar", "financiera finexpar"],
    monograma: "Z",
    color: "#2D3340",
    fuenteOficial: "https://www.bcp.gov.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Coomecipar": entrada({
    categoria: "cooperativa",
    monograma: "CO",
    color: "#0B6E4F",
    fuenteOficial: "https://www.coomecipar.coop.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Medalla Milagrosa": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa medalla milagrosa"],
    monograma: "MM",
    color: "#6C3FA0",
    fuenteOficial: "https://www.medallamilagrosa.coop.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "San Crist\xF3bal": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa san cristobal", "cooperativa san crist\xF3bal"],
    monograma: "SC",
    color: "#167A54",
    fuenteOficial: "https://www.sancristobal.coop.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  "Universitaria": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa universitaria"],
    monograma: "U",
    color: "#1D4E9E",
    fuenteOficial: "https://www.cu.coop.py/",
    estado: "fallback",
    variantes: variantesFallback()
  }),
  // Compatibilidad histórica: no aparecen en sugerencias y resuelven a la
  // entidad sucesora en vez de fingir una marca que ya no está activa.
  "Financiera El Comercio": { redirigeA: "ueno bank", alias: ["el comercio"], categoria: "legado", estado: "legado", verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
  "Visi\xF3n Banco": { redirigeA: "ueno bank", alias: ["vision", "banco vision", "visi\xF3n"], categoria: "legado", estado: "legado", verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS },
  "Banco R\xEDo": { redirigeA: "Banco Continental", alias: ["rio", "banco rio", "banco r\xEDo"], categoria: "legado", estado: "legado", verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS }
};
var COLORES_BANCO_RESPALDO = ["#33414F", "#1D4E9E", "#0B6E4F", "#8A3A1B", "#6C3FA0", "#12659E"];
function normalizarBanco(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
var INDICE = /* @__PURE__ */ new Map();
for (const [nombre, entradaLogo] of Object.entries(LOGOS_BANCOS)) {
  for (const clave of [nombre, ...entradaLogo.alias || []]) {
    INDICE.set(normalizarBanco(clave), { nombre, entrada: entradaLogo });
  }
}
var BUSQUEDAS_POR_BANCO = new Map(BANCOS_PARAGUAY.map((nombre) => [nombre, /* @__PURE__ */ new Set([normalizarBanco(nombre)])]));
for (const [clave, encontrada] of INDICE) {
  const destino = encontrada.entrada.redirigeA || encontrada.nombre;
  BUSQUEDAS_POR_BANCO.get(destino)?.add(clave);
}
var VACIAS = /* @__PURE__ */ new Set(["banco", "financiera", "cooperativa", "banca", "de", "del", "la", "el", "y"]);
function inicialesDeBanco(nombre) {
  const palabras = String(nombre || "").split(/[\s/]+/).filter(Boolean);
  const utiles = palabras.filter((palabra) => !VACIAS.has(normalizarBanco(palabra)));
  const base = (utiles.length ? utiles : palabras).slice(0, 3);
  const iniciales2 = base.map((palabra) => palabra[0].toUpperCase()).join("");
  return iniciales2 || "?";
}
function colorDeBanco(nombre) {
  const texto = normalizarBanco(nombre);
  let hash = 0;
  for (const letra of texto) hash = (hash * 31 + letra.charCodeAt(0)) % 9973;
  return COLORES_BANCO_RESPALDO[hash % COLORES_BANCO_RESPALDO.length];
}
function varianteNormalizada(variante) {
  return variante === "compacto" || variante === "compact" ? "compacto" : "horizontal";
}
function resolverEntrada(nombre) {
  const encontrada = INDICE.get(normalizarBanco(nombre));
  if (!encontrada) return null;
  const destino = encontrada.entrada.redirigeA;
  if (!destino) return { nombre: encontrada.nombre, entrada: encontrada.entrada, aliasHistorico: null };
  return { nombre: destino, entrada: LOGOS_BANCOS[destino], aliasHistorico: encontrada.nombre };
}
function logoDeBanco(nombre, variante = "horizontal") {
  const texto = String(nombre || "").trim();
  if (!texto) return null;
  const resuelta = resolverEntrada(texto);
  if (!resuelta) {
    const iniciales2 = inicialesDeBanco(texto);
    const color = colorDeBanco(texto);
    const claveVariante2 = varianteNormalizada(variante);
    return {
      banco: texto,
      tipo: "monograma",
      iniciales: iniciales2,
      color,
      generico: true,
      categoria: "desconocida",
      estado: "fallback",
      variante: claveVariante2,
      visual: claveVariante2 === "compacto" ? MONOGRAMA() : TEXTO()
    };
  }
  const { nombre: canonico, entrada: registro, aliasHistorico } = resuelta;
  const claveVariante = varianteNormalizada(variante);
  const base = registro.archivo ? { tipo: "archivo", archivo: registro.archivo, chip: Boolean(registro.chip) } : registro.marca ? { tipo: "marca", marca: registro.marca } : { tipo: "monograma", iniciales: registro.monograma || inicialesDeBanco(canonico), color: registro.color || colorDeBanco(canonico) };
  return {
    banco: canonico,
    ...base,
    ...registro.marca ? { marca: registro.marca } : {},
    categoria: registro.categoria,
    estado: registro.estado,
    redistribucion: registro.redistribucion,
    fuenteOficial: registro.fuenteOficial || null,
    verificadoEn: registro.verificadoEn || null,
    variante: claveVariante,
    visual: registro.variantes[claveVariante],
    ...aliasHistorico ? { aliasHistorico } : {}
  };
}
function coberturaBancos(catalogo = BANCOS_PARAGUAY) {
  return catalogo.map((nombre) => {
    const entradaLogo = LOGOS_BANCOS[nombre];
    return {
      nombre,
      categoria: entradaLogo.categoria,
      estado: entradaLogo.estado,
      redistribucion: entradaLogo.redistribucion,
      fuenteOficial: entradaLogo.fuenteOficial || null,
      verificadoEn: entradaLogo.verificadoEn,
      variantes: {
        compacto: { ...entradaLogo.variantes.compacto },
        horizontal: { ...entradaLogo.variantes.horizontal }
      },
      // Campos históricos del diagnóstico.
      tipo: entradaLogo.archivo ? "archivo" : entradaLogo.marca ? "marca" : "monograma",
      archivo: entradaLogo.archivo || null,
      marca: entradaLogo.marca || null
    };
  });
}
function sugerenciasDeBanco(texto, catalogo = BANCOS_PARAGUAY) {
  const termino = normalizarBanco(texto);
  if (!termino) return catalogo;
  return catalogo.filter((banco) => {
    const busquedas = BUSQUEDAS_POR_BANCO.get(banco) || /* @__PURE__ */ new Set([normalizarBanco(banco)]);
    return [...busquedas].some((clave) => clave.includes(termino));
  });
}

// src/utils/mediosPago.js
var EMPAQUETADO2 = (archivo, estado = "oficial") => ({ tipo: "archivo", archivo, estado, empaquetado: `pagos/${archivo}` });
var MONOGRAMA2 = (estado = "fallback") => ({ tipo: "monograma", estado });
var TEXTO2 = (estado = "fallback") => ({ tipo: "texto", estado });
var FALLBACK = (estado = "fallback") => ({ compacto: MONOGRAMA2(estado), horizontal: TEXTO2(estado) });
function entrada2({ categoria, alias = [], monograma, color, fuenteOficial, estado = "parcial", variantes, ...extra }) {
  const permiso = extra.redistribucion?.permitida === true && Boolean(extra.redistribucion.evidencia);
  const requierePermiso = Boolean(variantes && Object.values(variantes).some((visual) => visual?.empaquetado));
  const { redistribucion: _redistribucion, ...resto } = extra;
  return {
    categoria,
    alias,
    monograma,
    color,
    fuenteOficial,
    verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS,
    estado: requierePermiso && !permiso ? "permiso-pendiente" : estado,
    redistribucion: permiso ? { permitida: true, evidencia: extra.redistribucion.evidencia } : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso ? FALLBACK("permiso-pendiente") : variantes || FALLBACK(estado === "permiso-pendiente" ? "permiso-pendiente" : "fallback"),
    ...resto
  };
}
var MARCAS_MEDIOS_PAGO = {
  Visa: entrada2({
    categoria: "red-tarjeta",
    monograma: "V",
    color: "#1434CB",
    fuenteOficial: "https://corporate.visa.com/en/about-visa/brand.html",
    estado: "permiso-pendiente",
    variantes: FALLBACK("permiso-pendiente")
  }),
  Mastercard: entrada2({
    categoria: "red-tarjeta",
    alias: ["master card"],
    monograma: "MC",
    color: "#EB001B",
    fuenteOficial: "https://www.mastercard.com/brandcenter/us/en/download-artwork.html",
    estado: "permiso-pendiente",
    variantes: FALLBACK("permiso-pendiente")
  }),
  "American Express": entrada2({
    categoria: "red-tarjeta",
    alias: ["amex", "american express"],
    monograma: "AX",
    color: "#2E77BC",
    fuenteOficial: "https://www.americanexpress.com/it/merchant/materiale-puntovendita/materialidigitali.html",
    estado: "permiso-pendiente",
    variantes: FALLBACK("permiso-pendiente")
  }),
  Bancard: entrada2({
    categoria: "procesador",
    monograma: "B",
    color: "#0068B3",
    fuenteOficial: "https://www.bancard.com.py/",
    estado: "permiso-pendiente",
    variantes: FALLBACK("permiso-pendiente")
  }),
  "Red Infonet": entrada2({
    categoria: "red-procesamiento",
    alias: ["infonet"],
    monograma: "RI",
    color: "#263C8F",
    fuenteOficial: "https://www.bancard.com.py/productos",
    estado: "fallback",
    variantes: FALLBACK()
  }),
  Dinelco: entrada2({
    categoria: "red-procesamiento",
    monograma: "D",
    color: "#D71920",
    fuenteOficial: "https://www.dinelco.com.py/",
    estado: "permiso-pendiente",
    variantes: FALLBACK("permiso-pendiente")
  }),
  upay: entrada2({
    categoria: "procesador",
    alias: ["u pay"],
    monograma: "U",
    color: "#5A31F4",
    fuenteOficial: "https://upay.com.py/",
    estado: "verificado",
    variantes: {
      compacto: EMPAQUETADO2("upay-compacto.svg"),
      horizontal: EMPAQUETADO2("upay.svg")
    }
  }),
  uPOS: entrada2({
    categoria: "terminal",
    alias: ["u pos"],
    monograma: "UP",
    color: "#5A31F4",
    fuenteOficial: "https://upay.com.py/",
    estado: "producto-padre",
    marcaPadre: "upay",
    variantes: {
      compacto: { ...EMPAQUETADO2("upay-compacto.svg", "producto-padre"), marcaPadre: "upay" },
      horizontal: { ...TEXTO2("producto-padre"), marcaPadre: "upay" }
    }
  }),
  Procard: entrada2({
    categoria: "procesador",
    alias: ["pro card"],
    monograma: "P",
    color: "#1968A9",
    fuenteOficial: "https://www.procard.com.py/procard_institucional/",
    estado: "permiso-pendiente",
    variantes: FALLBACK("permiso-pendiente")
  }),
  PayPro: entrada2({
    categoria: "producto",
    alias: ["pay pro"],
    monograma: "PP",
    color: "#1968A9",
    marcaPadre: "Procard",
    fuenteOficial: "https://www.procard.com.py/procard_institucional/paypro/",
    estado: "fallback",
    variantes: FALLBACK()
  }),
  Cabal: entrada2({
    categoria: "red-tarjeta",
    monograma: "C",
    color: "#006A53",
    fuenteOficial: "https://www.cabal.coop/comercios/servicios/senalizacion-de-tu-negocio?id=587",
    estado: "permiso-pendiente",
    variantes: FALLBACK("permiso-pendiente")
  }),
  Panal: entrada2({
    categoria: "red-tarjeta",
    monograma: "P",
    color: "#A56A1C",
    fuenteOficial: "https://www.bcp.gov.py/comisiones-por-intermediacion-cobradas-a-los-comercios-por-las-operaciones-con-tarjetas",
    estado: "fallback",
    variantes: FALLBACK()
  }),
  // Pagopar fue absorbida por la propuesta vigente de upay. Solo resuelve
  // datos históricos; no se publica como procesador independiente.
  Pagopar: { redirigeA: "upay", alias: ["pago par"], categoria: "legado", estado: "legado", verificadoEn: FECHA_VERIFICACION_MARCAS_FINANCIERAS }
};
var MEDIOS_PAGO_CON_MARCA = Object.keys(MARCAS_MEDIOS_PAGO).filter((nombre) => !MARCAS_MEDIOS_PAGO[nombre].redirigeA);
function normalizarMarcaPago(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
var INDICE_MARCAS_PAGO = /* @__PURE__ */ new Map();
for (const [nombre, registro] of Object.entries(MARCAS_MEDIOS_PAGO)) {
  for (const clave of [nombre, ...registro.alias || []]) {
    INDICE_MARCAS_PAGO.set(normalizarMarcaPago(clave), { nombre, registro });
  }
}
function varianteNormalizada2(variante) {
  return variante === "compacto" || variante === "compact" ? "compacto" : "horizontal";
}
function iniciales(nombre) {
  const partes = String(nombre || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return partes.map((parte) => parte[0]?.toUpperCase()).join("") || "?";
}
function logoDeMedioPago(nombre, variante = "horizontal") {
  const texto = String(nombre || "").trim();
  if (!texto) return null;
  const encontrada = INDICE_MARCAS_PAGO.get(normalizarMarcaPago(texto));
  const claveVariante = varianteNormalizada2(variante);
  if (!encontrada) {
    return {
      marca: texto,
      tipo: "monograma",
      iniciales: iniciales(texto),
      color: "#33414F",
      generico: true,
      categoria: "desconocida",
      estado: "fallback",
      variante: claveVariante,
      visual: claveVariante === "compacto" ? MONOGRAMA2() : TEXTO2()
    };
  }
  const aliasHistorico = encontrada.registro.redirigeA ? encontrada.nombre : null;
  const canonico = encontrada.registro.redirigeA || encontrada.nombre;
  const registro = MARCAS_MEDIOS_PAGO[canonico];
  return {
    marca: canonico,
    tipo: registro.variantes[claveVariante].tipo === "archivo" ? "archivo" : "monograma",
    iniciales: registro.monograma || iniciales(canonico),
    color: registro.color || "#33414F",
    categoria: registro.categoria,
    estado: registro.estado,
    redistribucion: registro.redistribucion,
    fuenteOficial: registro.fuenteOficial || null,
    verificadoEn: registro.verificadoEn || null,
    variante: claveVariante,
    visual: registro.variantes[claveVariante],
    ...registro.marcaPadre ? { marcaPadre: registro.marcaPadre } : {},
    ...aliasHistorico ? { aliasHistorico } : {}
  };
}
function coberturaMediosPago(catalogo = MEDIOS_PAGO_CON_MARCA) {
  return catalogo.map((nombre) => {
    const registro = MARCAS_MEDIOS_PAGO[nombre];
    return {
      nombre,
      categoria: registro.categoria,
      estado: registro.estado,
      redistribucion: registro.redistribucion,
      fuenteOficial: registro.fuenteOficial || null,
      verificadoEn: registro.verificadoEn,
      marcaPadre: registro.marcaPadre || null,
      variantes: {
        compacto: { ...registro.variantes.compacto },
        horizontal: { ...registro.variantes.horizontal }
      }
    };
  });
}

// src/financial/assets.js
var ASSETS_FINANCIEROS = Object.freeze({});
function adjuntarAssetFinanciero(visual) {
  if (!visual || !visual.empaquetado) return visual;
  const asset = ASSETS_FINANCIEROS[visual.empaquetado];
  return asset ? { ...visual, asset } : visual;
}
function adjuntarAssetsAlRegistro(registro) {
  if (!registro?.visual) return registro;
  return { ...registro, visual: adjuntarAssetFinanciero(registro.visual) };
}
function adjuntarAssetsACobertura(fila) {
  if (!fila?.variantes) return fila;
  return {
    ...fila,
    variantes: {
      compacto: adjuntarAssetFinanciero(fila.variantes.compacto),
      horizontal: adjuntarAssetFinanciero(fila.variantes.horizontal)
    }
  };
}

// src/financial/resolvers.js
function logoDeBanco2(nombre, variante) {
  return adjuntarAssetsAlRegistro(logoDeBanco(nombre, variante));
}
function coberturaBancos2(catalogo) {
  return coberturaBancos(catalogo).map(adjuntarAssetsACobertura);
}
function logoDeMedioPago2(nombre, variante) {
  return adjuntarAssetsAlRegistro(logoDeMedioPago(nombre, variante));
}
function coberturaMediosPago2(catalogo) {
  return coberturaMediosPago(catalogo).map(adjuntarAssetsACobertura);
}

// src/components/LogoFinanciero.jsx
import { useState } from "react";

// src/utils/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/LogoFinanciero.jsx
import { jsx, jsxs } from "react/jsx-runtime";
function fuenteDe(visual, baseAssets) {
  if (!visual?.archivo) return null;
  if (typeof baseAssets === "string" && baseAssets) {
    return `${baseAssets.replace(/\/$/, "")}/${visual.archivo}`;
  }
  return visual.asset || visual.archivo;
}
function Monograma({ iniciales: iniciales2, color, compacto }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      className: cn(
        "grid place-items-center rounded-[5px] px-1 text-[9px] font-bold leading-none tracking-tight text-white",
        compacto ? "h-full w-full" : "h-full min-w-[1.15rem]"
      ),
      style: { backgroundColor: color },
      children: iniciales2
    }
  );
}
function LogoFinanciero({
  nombre,
  registro,
  alto = "h-5",
  className,
  baseAssets,
  marcas = {},
  soloCatalogo = false,
  decorativo = false
}) {
  const [assetFallido, setAssetFallido] = useState(null);
  if (!registro || soloCatalogo && registro.generico) return null;
  const compacto = registro.variante === "compacto";
  const visual = registro.visual || { tipo: "monograma", estado: "fallback" };
  const fuente = fuenteDe(visual, baseAssets);
  const fallo = fuente && assetFallido === fuente;
  const iniciales2 = registro.iniciales || "?";
  const color = registro.color || "#33414F";
  const etiqueta = registro.banco || registro.marca || nombre;
  const semantica = decorativo ? { "aria-hidden": true } : { role: "img", "aria-label": etiqueta };
  const marcaPersonalizada = registro.marca && marcas[registro.marca];
  if (marcaPersonalizada) {
    const Logo = marcaPersonalizada;
    return /* @__PURE__ */ jsx(
      "span",
      {
        ...semantica,
        className: cn("inline-flex items-center", compacto && "aspect-square justify-center", alto, className),
        "data-logo-estado": visual.estado || registro.estado,
        "data-logo-variante": registro.variante,
        children: /* @__PURE__ */ jsx(Logo, {})
      }
    );
  }
  if (fuente && !fallo && (visual.tipo === "archivo" || visual.tipo === "horizontal-contained")) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        ...semantica,
        className: cn(
          "inline-flex items-center",
          compacto && "aspect-square shrink-0 justify-center overflow-hidden rounded-[5px]",
          visual.fondo && visual.padding && "rounded-md p-1",
          alto,
          className
        ),
        style: visual.fondo ? { backgroundColor: visual.fondo } : void 0,
        "data-logo-estado": visual.estado || registro.estado,
        "data-logo-variante": registro.variante,
        "data-logo-tipo": visual.tipo,
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: fuente,
            alt: "",
            loading: "lazy",
            onError: () => setAssetFallido(fuente),
            className: cn(
              "object-contain",
              compacto ? "h-full w-full" : "h-full w-auto max-w-[8rem]",
              registro.chip && "rounded-[4px] bg-white px-1 py-[1px]"
            )
          }
        )
      }
    );
  }
  if (!compacto && visual.tipo === "texto") {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        ...semantica,
        className: cn("inline-flex items-center gap-1.5 whitespace-nowrap", alto, className),
        "data-logo-estado": visual.estado || registro.estado,
        "data-logo-variante": registro.variante,
        "data-logo-tipo": "texto",
        children: [
          /* @__PURE__ */ jsx(Monograma, { iniciales: iniciales2, color, compacto: false }),
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-xs font-semibold leading-none text-current", children: etiqueta })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      ...semantica,
      className: cn("inline-flex items-center", compacto && "aspect-square shrink-0", alto, className),
      "data-logo-estado": visual.estado || registro.estado,
      "data-logo-variante": registro.variante,
      "data-logo-tipo": "monograma",
      children: /* @__PURE__ */ jsx(Monograma, { iniciales: iniciales2, color, compacto })
    }
  );
}

// src/components/BancoLogo.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
function BancoLogo({
  banco,
  variante = "horizontal",
  alto = "h-5",
  className,
  soloCatalogo = false,
  baseAssets,
  marcas = {},
  decorativo = false
}) {
  const texto = String(banco || "").trim();
  const registro = logoDeBanco2(texto, variante);
  if (!registro) return null;
  return /* @__PURE__ */ jsx2(
    LogoFinanciero,
    {
      nombre: texto,
      registro: {
        ...registro,
        iniciales: registro.iniciales || inicialesDeBanco(registro.banco || texto),
        color: registro.color || colorDeBanco(registro.banco || texto)
      },
      alto,
      className,
      soloCatalogo,
      baseAssets,
      marcas,
      decorativo
    }
  );
}

// src/components/MedioPagoLogo.jsx
import { jsx as jsx3 } from "react/jsx-runtime";
function MedioPagoLogo({
  marca,
  variante = "horizontal",
  alto = "h-5",
  className,
  soloCatalogo = false,
  baseAssets,
  decorativo = false
}) {
  const texto = String(marca || "").trim();
  const registro = logoDeMedioPago2(texto, variante);
  if (!registro) return null;
  return /* @__PURE__ */ jsx3(
    LogoFinanciero,
    {
      nombre: texto,
      registro,
      alto,
      className,
      soloCatalogo,
      baseAssets,
      decorativo
    }
  );
}
export {
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  BancoLogo,
  COLORES_BANCO_RESPALDO,
  COOPERATIVAS_PARAGUAY,
  FECHA_VERIFICACION_MARCAS_FINANCIERAS,
  LOGOS_BANCOS,
  LogoFinanciero,
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  MedioPagoLogo,
  coberturaBancos2 as coberturaBancos,
  coberturaMediosPago2 as coberturaMediosPago,
  colorDeBanco,
  inicialesDeBanco,
  logoDeBanco2 as logoDeBanco,
  logoDeMedioPago2 as logoDeMedioPago,
  normalizarBanco,
  normalizarMarcaPago,
  sugerenciasDeBanco
};
//# sourceMappingURL=financial.js.map
