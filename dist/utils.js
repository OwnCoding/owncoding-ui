// src/utils/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function primerNombre(nombre = "") {
  return String(nombre ?? "").trim().split(/\s+/)[0] || "";
}

// src/utils/nombre.js
var PARTICULAS = /* @__PURE__ */ new Set(["de", "del", "la", "las", "los", "y", "e", "da", "das", "do", "dos", "van", "von", "san", "santa"]);
var titulo = (palabra) => {
  const limpia = String(palabra || "").toLowerCase();
  if (!limpia) return "";
  if (PARTICULAS.has(limpia)) return limpia;
  return limpia.charAt(0).toUpperCase() + limpia.slice(1);
};
var estaEnMayusculas = (texto) => texto === texto.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(texto);
var TIPO_SOCIETARIO = /\b(S\.?A\.?|S\.?R\.?L\.?|S\.?A\.?C\.?I\.?|S\.?A\.?E\.?|S\.?A\.?S\.?|LTDA\.?|E\.?A\.?S\.?|C[IÍ]A\.?|SOCIEDAD|EMPRESA|COMPA[ÑN][IÍ]A|COOPERATIVA|FUNDACI[OÓ]N|ASOCIACI[OÓ]N|MUNICIPALIDAD|GOBERNACI[OÓ]N|MINISTERIO|UNIVERSIDAD|COLEGIO|CONSORCIO)\b/i;
function esRazonSocial(texto) {
  return TIPO_SOCIETARIO.test(String(texto || ""));
}
function nombrePartes(texto) {
  const limpio = String(texto ?? "").replace(/\s+/g, " ").trim();
  if (!limpio) return { nombres: [], apellidos: [], conComa: false };
  if (limpio.includes(",")) {
    const [apellidos, nombres] = limpio.split(",", 2).map((parte) => parte.trim());
    return {
      nombres: String(nombres || "").split(" ").filter(Boolean),
      apellidos: String(apellidos || "").split(" ").filter(Boolean),
      conComa: true
    };
  }
  return { nombres: limpio.split(" ").filter(Boolean), apellidos: [], conComa: false };
}
function normalizarNombre(texto, { apellidosPrimero = "auto" } = {}) {
  const original = String(texto ?? "").replace(/\s+/g, " ").trim();
  if (!original) return "";
  if (esRazonSocial(original)) return original;
  const partes = nombrePartes(original);
  const mayusculas = estaEnMayusculas(original);
  const reordenar = !partes.conComa && (apellidosPrimero === true || apellidosPrimero === "sifen" && mayusculas && partes.nombres.length >= 3);
  if (!partes.conComa && !reordenar && !mayusculas) return original;
  let ordenadas;
  if (partes.conComa) {
    ordenadas = [...partes.nombres, ...partes.apellidos];
  } else if (reordenar) {
    const corte = partes.nombres.length >= 4 ? 2 : partes.nombres.length - 1;
    ordenadas = [...partes.nombres.slice(corte), ...partes.nombres.slice(0, corte)];
  } else {
    ordenadas = partes.nombres;
  }
  return ordenadas.map(titulo).filter(Boolean).join(" ");
}
function esApellidosPrimero(texto) {
  return String(texto ?? "").includes(",");
}

// src/utils/financialAssets.js
var AUTORIZACION_ASSETS_FINANCIEROS = Object.freeze({
  permitida: true,
  evidencia: "docs/financial-assets-manifest.json",
  base: "autorizacion-escrita-proporcionada-por-el-usuario",
  confirmadaEn: "2026-10-01",
  alcance: Object.freeze(["github:dariodeoli/owncoding-ui", "web:Own UI/OwnCoding"])
});
var BLOQUEOS_ASSETS_FINANCIEROS = Object.freeze([
  { catalogo: "banco", id: "Banco do Brasil", motivo: "favicon-oficial-48px-bajo-minimo-64px-sin-lockup-horizontal-verificado" },
  { catalogo: "pago", id: "Pix", motivo: "kit-oficial-solo-participantes" },
  { catalogo: "pago", id: "Red Infonet", motivo: "original-bancard-canvas-transparente-excesivo-sin-derivado-autorizado" },
  { catalogo: "pago", id: "uPOS", variante: "horizontal", motivo: "producto-upay-sin-marca-independiente" },
  { catalogo: "pago", id: "Panal", motivo: "original-procesador-canvas-transparente-excesivo-sin-derivado-autorizado" }
]);

// src/utils/relacionesFinancieras.js
var FECHA_VERIFICACION_RELACIONES_FINANCIERAS = "2026-10-01";
var operador = (nombreLegal, fuenteOficial, extra = {}) => Object.freeze({
  nombreLegal,
  fuenteOficial,
  verificadoEn: FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  ...extra
});
var relacion = (marca, datos) => Object.freeze({
  marca,
  verificadoEnRelacion: FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  actividad: "activa",
  ...datos,
  alias: Object.freeze([...datos.alias || []])
});
var RELACIONES_FINANCIERAS = Object.freeze({
  Mango: relacion("Mango", {
    alias: ["Billetera Mango", "Mango App"],
    financialProvider: "Tu Financiera",
    fuenteRelacion: "https://mangoapp.com.py/terms-and-conditions/",
    fuenteActividad: "https://mangoapp.com.py/",
    operador: operador("Mango Payment S.A.", "https://mangoapp.com.py/terms-and-conditions/", { ruc: "80108618-3" })
  }),
  Vaquita: relacion("Vaquita", {
    alias: ["App Vaquita"],
    financialProvider: "Finlatina",
    fuenteRelacion: "https://www.vaquita.com.py/terminosycondiciones/",
    fuenteActividad: "https://www.vaquita.com.py/",
    operador: operador("MUTECH S.R.L.", "https://www.vaquita.com.py/terminosycondiciones/")
  }),
  EKO: relacion("EKO", {
    alias: ["Eko", "App Eko", "Eko Paraguay"],
    institucionPadre: "Banco Familiar",
    financialProvider: "Banco Familiar",
    fuenteRelacion: "https://www.eko.com.py/src/pdf/byc-billetera-eko.pdf",
    fuenteActividad: "https://www.eko.com.py/",
    operador: operador("Banco Familiar S.A.E.C.A.", "https://www.eko.com.py/src/pdf/byc-billetera-eko.pdf")
  }),
  eCLUB: relacion("eCLUB", {
    alias: ["eClub", "ECLUB"],
    financialProvider: "Interfisa Banco",
    fuenteRelacion: "https://eclub.com.py/",
    fuenteActividad: "https://eclub.com.py/",
    operador: operador("ECLUB Paraguay S.A.", "https://eclub.com.py/")
  }),
  Pik: relacion("Pik", {
    alias: ["PIK"],
    financialProvider: "Ita\xFA",
    fuenteRelacion: "https://www.pik.com.py/bases-y-condiciones-reintegros",
    fuenteActividad: "https://www.pik.com.py/",
    operador: operador("Pont S.A.", "https://www.pik.com.py/")
  })
});
var MARCAS_CON_RELACION_FINANCIERA = Object.freeze(Object.keys(RELACIONES_FINANCIERAS));
function normalizarRelacionFinanciera(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
var INDICE_RELACIONES = /* @__PURE__ */ new Map();
for (const [marca, registro] of Object.entries(RELACIONES_FINANCIERAS)) {
  for (const clave of [marca, ...registro.alias]) INDICE_RELACIONES.set(normalizarRelacionFinanciera(clave), marca);
}
function relacionFinancieraDe(marca) {
  const canonica = INDICE_RELACIONES.get(normalizarRelacionFinanciera(marca));
  return canonica && Object.hasOwn(RELACIONES_FINANCIERAS, canonica) ? RELACIONES_FINANCIERAS[canonica] : null;
}
function buscarRelacionesFinancieras(consulta = "") {
  const termino = normalizarRelacionFinanciera(consulta);
  if (!termino) return MARCAS_CON_RELACION_FINANCIERA.map((marca) => RELACIONES_FINANCIERAS[marca]);
  return MARCAS_CON_RELACION_FINANCIERA.map((marca) => RELACIONES_FINANCIERAS[marca]).filter((registro) => [
    registro.marca,
    ...registro.alias,
    registro.institucionPadre,
    registro.financialProvider,
    registro.operador.nombreLegal
  ].filter(Boolean).some((valor) => normalizarRelacionFinanciera(valor).includes(termino)));
}
function institucionesSugeridasPorMarca(consulta) {
  return [...new Set(buscarRelacionesFinancieras(consulta).flatMap((registro) => [
    registro.institucionPadre,
    registro.financialProvider
  ]).filter(Boolean))];
}
function marcasRelacionadasConInstitucion(institucion) {
  const termino = normalizarRelacionFinanciera(institucion);
  if (!termino) return [];
  return MARCAS_CON_RELACION_FINANCIERA.filter((marca) => {
    const registro = RELACIONES_FINANCIERAS[marca];
    return [registro.institucionPadre, registro.financialProvider].filter(Boolean).some((valor) => normalizarRelacionFinanciera(valor) === termino);
  });
}

// src/utils/bancos.js
var FECHA_VERIFICACION_MARCAS_FINANCIERAS = "2026-10-02";
var BANCOS_Y_FINANCIERAS_PARAGUAY = [
  "Banco Atlas",
  "Banco Basa",
  "Banco Continental",
  "Banco de la Naci\xF3n Argentina",
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
  "Universitaria",
  "Luque",
  "Coopeduc",
  "Capiat\xE1",
  "\xD1emby",
  "Lambar\xE9",
  "Coode\xF1e",
  "Mburica\xF3",
  "Mercado N\xBA 4",
  "San Lorenzo"
];
var BANCOS_PARAGUAY = [...BANCOS_Y_FINANCIERAS_PARAGUAY, ...COOPERATIVAS_PARAGUAY];
var EMPAQUETADO = (archivo, estado = "oficial", presentacion = {}) => ({ tipo: "archivo", archivo, estado, empaquetado: `bancos/${archivo}`, ...presentacion });
var CONTENIDO = (archivo, estado = "oficial", presentacion = {}) => ({ ...EMPAQUETADO(archivo, estado, presentacion), tipo: "horizontal-contained" });
var MARCA_CONTENIDA = (archivo, presentacion) => ({ ...EMPAQUETADO(archivo, "oficial", presentacion), tipo: "marca-contained" });
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
    redistribucion: permiso ? { ...redistribucion, permitida: true } : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso ? variantesFallback("permiso-pendiente") : variantes || variantesFallback(estado === "permiso-pendiente" ? "permiso-pendiente" : "fallback"),
    ...legacy
  };
}
function cooperativaOriginal(nombre, fuenteOficial, archivo, cuadrada = false, compacto) {
  const presentacion = { fondo: "#ffffff", padding: true };
  return entrada({
    categoria: "cooperativa",
    alias: [`cooperativa ${nombre}`, nombre.replace("N\xBA", "N\xB0")],
    monograma: nombre.slice(0, 1),
    color: "#15803d",
    fuenteOficial,
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: compacto || cuadrada ? EMPAQUETADO(compacto || archivo, "oficial", presentacion) : CONTENIDO(archivo, "oficial", { ...presentacion, descripcion: "Marca horizontal oficial completa contenida en el espacio compacto; no es un s\xEDmbolo independiente." }),
      horizontal: cuadrada ? MARCA_CONTENIDA(archivo, { ...presentacion, descripcion: "Marca oficial completa contenida en el espacio horizontal; no existe un lockup horizontal independiente verificado." }) : EMPAQUETADO(archivo, "oficial", presentacion)
    }
  });
}
var LOGOS_BANCOS = {
  "Banco Atlas": entrada({
    categoria: "banco",
    alias: ["atlas"],
    monograma: "BA",
    color: "#B20933",
    archivo: "atlas-horizontal-blanco.svg",
    fuenteOficial: "https://www.bancoatlas.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO("atlas-compacto.png", "oficial"),
      horizontal: EMPAQUETADO("atlas-horizontal-blanco.svg", "oficial", { fondo: "#B20933", padding: true })
    }
  }),
  "Banco Basa": entrada({
    categoria: "banco",
    monograma: "B",
    color: "#E94B35",
    archivo: "basa-horizontal.svg",
    fuenteOficial: "https://www.bancobasa.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("basa-compacto.svg"), horizontal: EMPAQUETADO("basa-horizontal.svg") }
  }),
  "Banco Continental": entrada({
    categoria: "banco",
    alias: ["continental"],
    monograma: "BC",
    color: "#1C4480",
    marca: "continental",
    fuenteOficial: "https://www.bancontinental.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("continental-compacto.png"), horizontal: EMPAQUETADO("continental-horizontal.svg") }
  }),
  "Banco de la Naci\xF3n Argentina": entrada({
    categoria: "banco",
    alias: ["banco nacion", "banco naci\xF3n", "bna"],
    monograma: "BNA",
    color: "#007894",
    fuenteOficial: "https://www.bna.com.ar/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO("bna-compacto.svg", "oficial", { fondo: "#007894", padding: true }),
      horizontal: EMPAQUETADO("bna-horizontal.svg", "oficial", { fondo: "#007894", padding: true })
    }
  }),
  "Banco do Brasil": entrada({
    categoria: "banco",
    alias: ["bb", "brasil"],
    monograma: "BB",
    color: "#173E91",
    fuenteOficial: "https://www.bb.com.br/docs/portal/dimac/CCBB-Manual-de-identidade-da-Marca.pdf",
    estado: "asset-bloqueado",
    variantes: { compacto: TEXTO("asset-bloqueado"), horizontal: TEXTO("asset-bloqueado") }
  }),
  "Banco Familiar": entrada({
    categoria: "banco",
    alias: ["familiar"],
    monograma: "BF",
    color: "#004B8D",
    marca: "familiar",
    archivo: "familiar-horizontal.webp",
    fuenteOficial: "https://www.familiar.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("familiar-compacto.png"), horizontal: EMPAQUETADO("familiar-horizontal.webp") }
  }),
  "Banco GNB Paraguay": entrada({
    categoria: "banco",
    alias: ["gnb", "banco gnb"],
    monograma: "GNB",
    color: "#00563F",
    fuenteOficial: "https://www.bancognb.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("gnb-compacto.png", "aportado-usuario", { descripcion: "Marca compacta proporcionada por el usuario; imagen original sin modificaciones." }), horizontal: EMPAQUETADO("gnb-horizontal.svg") }
  }),
  "Interfisa Banco": entrada({
    categoria: "banco",
    alias: ["interfisa", "banco interfisa"],
    monograma: "IB",
    color: "#00594C",
    archivo: "interfisa-horizontal.png",
    fuenteOficial: "https://www.interfisa.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("interfisa-compacto.png"), horizontal: EMPAQUETADO("interfisa-horizontal.png") }
  }),
  "Ita\xFA": entrada({
    categoria: "banco",
    alias: ["itau", "banco itau", "itau paraguay", "banco ita\xFA paraguay"],
    monograma: "I",
    color: "#EC7000",
    archivo: "itau-compacto.svg",
    fuenteOficial: "https://www.itau.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO("itau-compacto.svg", "oficial", { fondo: "#EC7000", padding: true }),
      horizontal: MARCA_CONTENIDA("itau-compacto.svg", { fondo: "#EC7000", padding: true, descripcion: "Marca cuadrada oficial contenida en el espacio horizontal; no es un lockup horizontal independiente." })
    }
  }),
  "Banco Nacional de Fomento": entrada({
    categoria: "banco",
    alias: ["bnf", "nacional de fomento"],
    monograma: "BNF",
    color: "#006A44",
    archivo: "bnf-horizontal.svg",
    fuenteOficial: "https://www.bnf.gov.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("bnf-compacto.png", "oficial", { fondo: "#0B1F3A", padding: true }), horizontal: EMPAQUETADO("bnf-horizontal.svg", "oficial", { fondo: "#0B1F3A", padding: true }) }
  }),
  "Sudameris": entrada({
    categoria: "banco",
    alias: ["banco sudameris"],
    monograma: "S",
    color: "#FF0000",
    archivo: "sudameris-horizontal.svg",
    fuenteOficial: "https://www.sudameris.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO("sudameris-compacto.svg", "oficial", { fondo: "#FF0000", padding: true }),
      horizontal: EMPAQUETADO("sudameris-horizontal.svg", "oficial", { fondo: "#FF0000", padding: true })
    }
  }),
  "Bancop": entrada({
    categoria: "banco",
    monograma: "B",
    color: "#006B3C",
    archivo: "bancop-horizontal.png",
    fuenteOficial: "https://www.bancop.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("bancop-compacto.png"), horizontal: EMPAQUETADO("bancop-horizontal.png") }
  }),
  "Citi": entrada({
    categoria: "banco",
    alias: ["citibank", "citibank paraguay"],
    monograma: "C",
    color: "#59636E",
    fuenteOficial: "https://www.citigroup.com/global/about-us/global-presence/paraguay",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO("citi-horizontal.svg", "oficial", { descripcion: "Marca horizontal oficial contenida en el espacio compacto; no es un s\xEDmbolo independiente." }), horizontal: EMPAQUETADO("citi-horizontal.svg") }
  }),
  "Financiera FIC": entrada({
    categoria: "financiera",
    alias: ["fic"],
    monograma: "FIC",
    color: "#C8102E",
    archivo: "fic-horizontal.png",
    fuenteOficial: "https://fic.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("fic-compacto.png"), horizontal: EMPAQUETADO("fic-horizontal.png") }
  }),
  "Financiera Paraguayo Japonesa": entrada({
    categoria: "financiera",
    alias: ["fpj", "paraguayo japonesa"],
    monograma: "FPJ",
    color: "#0066A4",
    archivo: "fpj-horizontal.png",
    fuenteOficial: "https://www.fpj.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO("fpj-compacto.png", "oficial", { fondo: "#0066A4", padding: true }),
      horizontal: EMPAQUETADO("fpj-horizontal.png", "oficial", { fondo: "#0066A4", padding: true })
    }
  }),
  "Finlatina": entrada({
    categoria: "financiera",
    alias: ["financiera finlatina"],
    monograma: "FL",
    color: "#24537A",
    archivo: "finlatina-horizontal.png",
    fuenteOficial: "https://www.finlatina.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("finlatina-compacto.png"), horizontal: EMPAQUETADO("finlatina-horizontal.png") }
  }),
  "Solar Banco": entrada({
    categoria: "banco",
    alias: ["solar", "solar ahorro y finanzas"],
    monograma: "S",
    color: "#F36F21",
    archivo: "solar-horizontal.svg",
    fuenteOficial: "https://solar.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("solar-compacto.png"), horizontal: EMPAQUETADO("solar-horizontal.svg") }
  }),
  "Tu Financiera": entrada({
    categoria: "financiera",
    alias: ["tu financiera"],
    monograma: "TF",
    color: "#314255",
    archivo: "tu-financiera-compacto.svg",
    fuenteOficial: "https://tu.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("tu-financiera-compacto.svg"), horizontal: MARCA_CONTENIDA("tu-financiera-compacto.svg", { descripcion: "Marca vertical oficial contenida en el espacio horizontal; no es un lockup horizontal independiente." }) }
  }),
  "ueno bank": entrada({
    categoria: "banco",
    alias: ["ueno", "ueno bank", "Ueno Bank"],
    monograma: "U",
    color: "#7B2CF5",
    marca: "ueno",
    archivo: "ueno-horizontal.svg",
    fuenteOficial: "https://www.ueno.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("ueno-compacto.svg"), horizontal: EMPAQUETADO("ueno-horizontal.svg") }
  }),
  "Zeta Banco": entrada({
    categoria: "banco",
    alias: ["zeta", "finexpar", "financiera finexpar"],
    monograma: "Z",
    color: "#2D3340",
    archivo: "zeta-horizontal.png",
    fuenteOficial: "https://www.zbanco.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("zeta-compacto.png"), horizontal: EMPAQUETADO("zeta-horizontal.png") }
  }),
  "Coomecipar": entrada({
    categoria: "cooperativa",
    monograma: "CO",
    color: "#0B6E4F",
    archivo: "coomecipar-horizontal.png",
    fuenteOficial: "https://www.coomecipar.coop.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO("coomecipar-compacto.png"),
      horizontal: EMPAQUETADO("coomecipar-horizontal.png", "oficial", { fondo: "#092959", padding: true })
    }
  }),
  "Medalla Milagrosa": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa medalla milagrosa"],
    monograma: "MM",
    color: "#6C3FA0",
    fuenteOficial: "https://www.medalla.coop.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("medalla-compacto.webp"), horizontal: EMPAQUETADO("medalla-horizontal.png") }
  }),
  "San Crist\xF3bal": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa san cristobal", "cooperativa san crist\xF3bal"],
    monograma: "SC",
    color: "#167A54",
    fuenteOficial: "https://www.sancristobal.coop.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO("san-cristobal-compacto.png", "aportado-usuario", { descripcion: "Marca compacta proporcionada por el usuario; imagen original sin modificaciones." }),
      horizontal: EMPAQUETADO("san-cristobal-horizontal.png", "oficial", { fondo: "#5FAD3E", padding: true })
    }
  }),
  "Universitaria": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa universitaria"],
    monograma: "U",
    color: "#1D4E9E",
    fuenteOficial: "https://www.universitaria.coop/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO("universitaria-compacto.png"), horizontal: EMPAQUETADO("universitaria-horizontal.svg") }
  }),
  "Luque": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa luque", "coop luque"],
    monograma: "L",
    color: "#17458F",
    fuenteOficial: "https://www.coopluque.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: CONTENIDO("luque-horizontal.svg", "oficial", { fondo: "#ffffff", padding: true, descripcion: "Marca horizontal oficial completa contenida en el espacio compacto; no es un s\xEDmbolo independiente." }),
      horizontal: EMPAQUETADO("luque-horizontal.svg", "oficial", { fondo: "#ffffff", padding: true })
    }
  }),
  "Coopeduc": entrada({
    categoria: "cooperativa",
    alias: ["cooperativa coopeduc", "coopeduc ltda"],
    monograma: "C",
    color: "#203866",
    fuenteOficial: "https://www.coopeduc.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: CONTENIDO("coopeduc-horizontal.png", "oficial", { fondo: "#ffffff", padding: true, descripcion: "Marca horizontal oficial completa contenida en el espacio compacto; no es un s\xEDmbolo independiente." }),
      horizontal: EMPAQUETADO("coopeduc-horizontal.png", "oficial", { fondo: "#ffffff", padding: true })
    }
  }),
  "Capiat\xE1": cooperativaOriginal("Capiat\xE1", "https://www.capiata.coop.py/", "capiata-horizontal.png", false),
  "\xD1emby": cooperativaOriginal("\xD1emby", "https://coopnemby.coop.py/", "nemby-horizontal.png", true, "nemby-compacto.png"),
  "Lambar\xE9": cooperativaOriginal("Lambar\xE9", "https://www.lambare.coop.py/", "lambare-horizontal.gif", true),
  "Coode\xF1e": cooperativaOriginal("Coode\xF1e", "https://coodene.coop.py/", "coodene-horizontal.png", false),
  "Mburica\xF3": cooperativaOriginal("Mburica\xF3", "https://mburicao.coop.py/", "mburicao-horizontal.png", false),
  "Mercado N\xBA 4": cooperativaOriginal("Mercado N\xBA 4", "https://coopmer4.coop.py/", "mercado-n4-horizontal.png", true),
  "San Lorenzo": cooperativaOriginal("San Lorenzo", "https://www.sanlorenzo.coop.py/", "san-lorenzo-compacto.png", true),
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
  const relacionadas = new Set(institucionesSugeridasPorMarca(texto));
  return catalogo.filter((banco) => {
    const busquedas = BUSQUEDAS_POR_BANCO.get(banco) || /* @__PURE__ */ new Set([normalizarBanco(banco)]);
    return relacionadas.has(banco) || [...busquedas].some((clave) => clave.includes(termino));
  });
}

// src/utils/mediosPago.js
var EMPAQUETADO2 = (archivo, estado = "oficial", presentacion = {}) => ({ tipo: "archivo", archivo, estado, empaquetado: `pagos/${archivo}`, ...presentacion });
var CONTENIDO2 = (archivo, estado = "oficial", presentacion = {}) => ({ ...EMPAQUETADO2(archivo, estado, presentacion), tipo: "horizontal-contained" });
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
    redistribucion: permiso ? { ...extra.redistribucion, permitida: true } : { permitida: false, evidencia: null },
    variantes: requierePermiso && !permiso ? FALLBACK("permiso-pendiente") : variantes || FALLBACK(estado === "permiso-pendiente" ? "permiso-pendiente" : "fallback"),
    ...resto
  };
}
function entradaRelacionada(marca, datos) {
  return entrada2({ ...datos, relacionFinanciera: relacionFinancieraDe(marca) });
}
var MARCAS_MEDIOS_PAGO = {
  Visa: entrada2({
    categoria: "red-tarjeta",
    monograma: "V",
    color: "#1434CB",
    fuenteOficial: "https://www.visa.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO2("visa-marca.png", "oficial", { fondo: "#ffffff", padding: true, descripcion: "Wordmark oficial completo contenido en el espacio compacto; no es un s\xEDmbolo independiente." }), horizontal: EMPAQUETADO2("visa-marca.png", "oficial", { fondo: "#ffffff", padding: true }) }
  }),
  Mastercard: entrada2({
    categoria: "red-tarjeta",
    alias: ["master card"],
    monograma: "MC",
    color: "#EB001B",
    fuenteOficial: "https://newsroom.mastercard.com/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("mastercard-marca.svg"), horizontal: { ...EMPAQUETADO2("mastercard-marca.svg"), tipo: "marca-contained", descripcion: "S\xEDmbolo oficial completo contenido en el espacio horizontal; no es un wordmark independiente." } }
  }),
  "American Express": entrada2({
    categoria: "red-tarjeta",
    alias: ["amex", "american express"],
    monograma: "AX",
    color: "#006FCF",
    fuenteOficial: "https://www.americanexpress.com/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("amex-compacto.svg"), horizontal: EMPAQUETADO2("amex-horizontal.svg") }
  }),
  Bancard: entrada2({
    categoria: "procesador",
    monograma: "B",
    color: "#0068B3",
    fuenteOficial: "https://www.bancard.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("bancard-compacto.png"), horizontal: EMPAQUETADO2("bancard-horizontal.png", "oficial", { fondo: "#F8FAFC", padding: true }) }
  }),
  "Red Infonet": entrada2({
    categoria: "red-procesamiento",
    alias: ["infonet"],
    monograma: "RI",
    color: "#263C8F",
    fuenteOficial: "https://www.bancard.com.py/productos",
    estado: "asset-bloqueado",
    variantes: { compacto: TEXTO2("asset-bloqueado"), horizontal: TEXTO2("asset-bloqueado") }
  }),
  Dinelco: entrada2({
    categoria: "red-procesamiento",
    monograma: "D",
    color: "#5E2A84",
    fuenteOficial: "https://www.dinelco.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("dinelco-compacto.png"), horizontal: EMPAQUETADO2("dinelco-horizontal.svg") }
  }),
  Pix: entrada2({
    categoria: "red-pago-instantaneo",
    monograma: "PX",
    color: "#32BCAD",
    fuenteOficial: "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    estado: "asset-bloqueado",
    variantes: { compacto: TEXTO2("asset-bloqueado"), horizontal: TEXTO2("asset-bloqueado") }
  }),
  upay: entrada2({
    categoria: "procesador",
    alias: ["u pay"],
    monograma: "U",
    color: "#5A31F4",
    fuenteOficial: "https://upay.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("upay-compacto.svg"), horizontal: EMPAQUETADO2("upay-horizontal.svg") }
  }),
  uPOS: entrada2({
    categoria: "terminal",
    alias: ["u pos"],
    monograma: "UP",
    color: "#5A31F4",
    fuenteOficial: "https://upay.com.py/",
    estado: "producto-padre",
    marcaPadre: "upay",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: { ...EMPAQUETADO2("upay-compacto.svg", "producto-padre"), marcaPadre: "upay" },
      horizontal: { ...TEXTO2("producto-padre"), marcaPadre: "upay" }
    }
  }),
  Pagopar: entrada2({
    categoria: "producto",
    alias: ["pago par"],
    monograma: "P",
    color: "#6446E8",
    fuenteOficial: "https://upay.com.py/",
    estado: "verificado",
    marcaPadre: "upay",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO2("pagopar-horizontal.svg", "oficial", { fondo: "#0A507B", padding: true }), horizontal: EMPAQUETADO2("pagopar-horizontal.svg", "oficial", { fondo: "#0A507B", padding: true }) }
  }),
  Procard: entrada2({
    categoria: "procesador",
    alias: ["pro card"],
    monograma: "P",
    color: "#1968A9",
    fuenteOficial: "https://www.procard.com.py/procard_institucional/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("procard-compacto.png"), horizontal: EMPAQUETADO2("procard-horizontal.png") }
  }),
  PayPro: entrada2({
    categoria: "producto",
    alias: ["pay pro"],
    monograma: "PP",
    color: "#1968A9",
    marcaPadre: "Procard",
    fuenteOficial: "https://www.procard.com.py/procard_institucional/paypro/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO2("paypro-horizontal.png"), horizontal: EMPAQUETADO2("paypro-horizontal.png") }
  }),
  Wally: entrada2({
    categoria: "billetera",
    monograma: "W",
    color: "#16A34A",
    fuenteOficial: "https://www.wally.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("wally-compacto.ico"), horizontal: EMPAQUETADO2("wally-horizontal.svg") }
  }),
  Zimple: entrada2({
    categoria: "billetera",
    monograma: "Z",
    color: "#EA1D76",
    fuenteOficial: "https://www.zimple.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("zimple-compacto.ico"), horizontal: EMPAQUETADO2("zimple-horizontal.png") }
  }),
  "Personal Pay": entrada2({
    categoria: "billetera",
    alias: ["personalpay"],
    monograma: "PP",
    color: "#111827",
    fuenteOficial: "https://www.personalpay.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("personal-pay-compacto.png"), horizontal: EMPAQUETADO2("personal-pay-horizontal.svg", "oficial", { fondo: "#111827", padding: true }) }
  }),
  Mango: entradaRelacionada("Mango", {
    categoria: "billetera",
    alias: ["billetera mango", "mango app"],
    monograma: "M",
    color: "#0B6FC7",
    fuenteOficial: "https://mangoapp.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO2("mango-compacto.png", "oficial", { fondo: "#0B6FC7", padding: true }),
      horizontal: EMPAQUETADO2("mango-horizontal.svg", "oficial", { fondo: "#0B6FC7", padding: true })
    }
  }),
  Vaquita: entradaRelacionada("Vaquita", {
    categoria: "billetera",
    alias: ["app vaquita"],
    monograma: "V",
    color: "#35A64D",
    fuenteOficial: "https://www.vaquita.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: {
      compacto: EMPAQUETADO2("vaquita-compacto.png", "oficial", { fondo: "#173226", padding: true }),
      horizontal: EMPAQUETADO2("vaquita-horizontal.png", "oficial", { fondo: "#173226", padding: true })
    }
  }),
  EKO: entradaRelacionada("EKO", {
    categoria: "billetera",
    alias: ["eko", "app eko", "eko paraguay"],
    monograma: "E",
    color: "#143CD2",
    fuenteOficial: "https://www.eko.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("eko-compacto.svg"), horizontal: EMPAQUETADO2("eko-horizontal.svg") }
  }),
  eCLUB: entradaRelacionada("eCLUB", {
    categoria: "cuenta-digital",
    alias: ["eclub"],
    monograma: "E",
    color: "#F00E51",
    fuenteOficial: "https://eclub.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("eclub-compacto.svg"), horizontal: EMPAQUETADO2("eclub-horizontal.svg") }
  }),
  Pik: entradaRelacionada("Pik", {
    categoria: "cobros-comercios",
    alias: ["pik"],
    monograma: "P",
    color: "#EC7000",
    fuenteOficial: "https://www.pik.com.py/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: EMPAQUETADO2("pik-compacto.png"), horizontal: EMPAQUETADO2("pik-horizontal.svg") }
  }),
  Cabal: entrada2({
    categoria: "red-tarjeta",
    monograma: "C",
    color: "#006A53",
    fuenteOficial: "https://www.cabal.coop/",
    estado: "verificado",
    redistribucion: AUTORIZACION_ASSETS_FINANCIEROS,
    variantes: { compacto: CONTENIDO2("cabal-horizontal.png"), horizontal: EMPAQUETADO2("cabal-horizontal.png") }
  }),
  Panal: entrada2({
    categoria: "red-tarjeta",
    monograma: "P",
    color: "#A56A1C",
    fuenteOficial: "https://www.bcp.gov.py/comisiones-por-intermediacion-cobradas-a-los-comercios-por-las-operaciones-con-tarjetas",
    estado: "asset-bloqueado",
    variantes: { compacto: TEXTO2("asset-bloqueado"), horizontal: TEXTO2("asset-bloqueado") }
  })
};
var SOLUCIONES_PAGO_COMERCIOS = Object.freeze({
  id: "soluciones-pago-comercios",
  titulo: "Aceptaci\xF3n y pagos para comercios",
  descripcion: "Procesamiento, adquirencia y cobros digitales para operaciones comerciales.",
  marcas: Object.freeze(["Bancard", "Dinelco", "upay", "Pik"])
});
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
    ...registro.relacionFinanciera ? { relacionFinanciera: registro.relacionFinanciera } : {},
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
      relacionFinanciera: registro.relacionFinanciera || null,
      variantes: {
        compacto: { ...registro.variantes.compacto },
        horizontal: { ...registro.variantes.horizontal }
      }
    };
  });
}
function sugerenciasDeMarcaPago(texto, catalogo = MEDIOS_PAGO_CON_MARCA) {
  const termino = normalizarMarcaPago(texto);
  if (!termino) return catalogo;
  const relacionadas = new Set(buscarRelacionesFinancieras(texto).map((registro) => registro.marca));
  return catalogo.filter((marca) => {
    const registro = MARCAS_MEDIOS_PAGO[marca];
    return [marca, ...registro.alias || []].some((clave) => normalizarMarcaPago(clave).includes(termino)) || relacionadas.has(marca);
  });
}

// src/utils/tamanos.js
var TAMANOS_CAMPO = Object.freeze({
  // Anchos recomendados (Tailwind) por tipo de dato
  moneda: "w-36",
  // Gs 12.500.000
  monedaAmplia: "w-44",
  // montos de venta (hasta 99.000.000.000)
  porcentaje: "w-24",
  // 12,5
  cantidad: "w-20",
  // 999
  anio: "w-20",
  dias: "w-24",
  fecha: "w-40",
  // 17/09/2026
  fechaHora: "w-52",
  telefono: "w-44",
  codigoPostal: "w-28",
  ip: "w-40",
  puerto: "w-24",
  documento: "w-44",
  // RUC/CI
  ciudad: "w-56"
});
function anchoParaLargo(largoMax = 0) {
  if (largoMax <= 12) return "w-28";
  if (largoMax <= 24) return "w-40";
  if (largoMax <= 40) return "w-56";
  return "w-full";
}

// src/utils/modal.js
var TAMANOS_MODAL = {
  corto: "max-w-md",
  // avisos, confirmaciones y formularios de un solo campo
  formulario: "max-w-xl",
  // formularios de una columna
  amplio: "max-w-3xl",
  // formularios de dos columnas, tablas y contenido amplio
  completo: "max-w-5xl"
  // editores y pantallas grandes
};
var TAMANO_MODAL_PREDETERMINADO = "formulario";
var CIERRE_CON_CAMBIOS = {
  titulo: "\xBFDescartar los cambios?",
  descripcion: "Ten\xE9s cambios sin guardar en este formulario. Si cerr\xE1s ahora, se pierden.",
  confirmar: "Descartar y cerrar",
  seguir: "Seguir editando"
};

// src/utils/formulario.js
var GRILLA_DOS_COLUMNAS = "grid gap-3 sm:grid-cols-2";
var GRILLA_DOS_COLUMNAS_COMPACTA = "grid gap-2 sm:grid-cols-2";
var PIE_ACCIONES = "flex flex-wrap justify-end gap-2";
var PIE_ACCIONES_REVERSO = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end";

// src/utils/validacion.js
var MENSAJES_VALIDACION = {
  obligatorio: "Complet\xE1 este dato.",
  largoMinimo: (minimo2) => `Escrib\xED al menos ${minimo2} caracteres.`,
  largoMaximo: (maximo2) => `No superes ${maximo2} caracteres.`,
  formato: "Revis\xE1 el formato de este dato.",
  email: "Revis\xE1 el correo electr\xF3nico.",
  minimo: (limite) => `El valor no puede ser menor a ${limite}.`,
  maximo: (limite) => `El valor no puede ser mayor a ${limite}.`
};
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function campoVacio(valor) {
  if (valor === null || valor === void 0) return true;
  if (Array.isArray(valor)) return valor.length === 0;
  return String(valor).trim() === "";
}
var mensajeDe = (mensaje, respaldo) => typeof mensaje === "function" ? mensaje(respaldo) : mensaje || respaldo;
function obligatorio(mensaje) {
  return (valor) => campoVacio(valor) ? mensajeDe(mensaje, MENSAJES_VALIDACION.obligatorio) : "";
}
function largoMinimo(minimo2, mensaje) {
  return (valor) => {
    if (campoVacio(valor)) return "";
    return String(valor).length < minimo2 ? mensajeDe(mensaje, MENSAJES_VALIDACION.largoMinimo(minimo2)) : "";
  };
}
function largoMaximo(maximo2, mensaje) {
  return (valor) => {
    if (campoVacio(valor)) return "";
    return String(valor).length > maximo2 ? mensajeDe(mensaje, MENSAJES_VALIDACION.largoMaximo(maximo2)) : "";
  };
}
function patron(expresion, mensaje) {
  return (valor) => {
    if (campoVacio(valor)) return "";
    return expresion.test(String(valor)) ? "" : mensajeDe(mensaje, MENSAJES_VALIDACION.formato);
  };
}
function emailValido(mensaje) {
  return patron(EMAIL_RE, mensaje || MENSAJES_VALIDACION.email);
}
function minimo(limite, mensaje) {
  return (valor) => {
    if (campoVacio(valor) || Number.isNaN(Number(valor))) return "";
    return Number(valor) < limite ? mensajeDe(mensaje, MENSAJES_VALIDACION.minimo(limite)) : "";
  };
}
function maximo(limite, mensaje) {
  return (valor) => {
    if (campoVacio(valor) || Number.isNaN(Number(valor))) return "";
    return Number(valor) > limite ? mensajeDe(mensaje, MENSAJES_VALIDACION.maximo(limite)) : "";
  };
}
function validarCampo(valor, reglas) {
  const lista = (Array.isArray(reglas) ? reglas : [reglas]).filter(Boolean);
  for (const regla of lista) {
    const mensaje = typeof regla === "function" ? regla(valor) : "";
    if (mensaje) return mensaje;
  }
  return "";
}
function validarCampos(valores, reglas = {}) {
  const errores = {};
  const campos = [];
  for (const [campo, reglasCampo] of Object.entries(reglas)) {
    const mensaje = validarCampo(valores?.[campo], reglasCampo);
    if (mensaje) {
      errores[campo] = mensaje;
      campos.push(campo);
    }
  }
  return { valido: campos.length === 0, errores, primerError: errores[campos[0]] || "", campos };
}
function limpiarError(errores = {}, campo) {
  if (!campo) return {};
  if (!(campo in errores)) return errores;
  const siguiente = { ...errores };
  delete siguiente[campo];
  return siguiente;
}

// src/utils/resultado.js
var RESULTADOS_VALIDOS = ["guardar", "copiar", "imprimir", "enviar"];
var SIN_SUJETO = {
  guardar: "Cambios guardados",
  copiar: "Contenido copiado",
  imprimir: "Impresi\xF3n enviada",
  enviar: "Env\xEDo completado"
};
var CON_SUJETO = {
  guardar: (sujeto) => `${sujeto} se guard\xF3`,
  copiar: (sujeto) => `${sujeto} se copi\xF3`,
  imprimir: (sujeto) => `${sujeto} se envi\xF3 a la impresora`,
  enviar: (sujeto) => `${sujeto} se envi\xF3`
};
function mensajeResultado(accion, sujeto) {
  const texto = String(sujeto || "").trim();
  if (texto && CON_SUJETO[accion]) return CON_SUJETO[accion](texto);
  return SIN_SUJETO[accion] || "Listo";
}
function mensajeFallo(accion) {
  return RESULTADOS_VALIDOS.includes(accion) ? `No se pudo ${accion}` : "No se pudo completar";
}

// src/utils/tabla.js
var ROTULO_DATO = "text-[10px] font-bold uppercase tracking-wider text-mute";
var CELDA_ENCABEZADO = `truncate ${ROTULO_DATO}`;
var ROTULO_SECCION = "text-xs font-bold uppercase tracking-wider text-mute";
var CELDA_DATO = "truncate text-xs text-mute";
var CELDA_NUMERO = "text-right tabular-nums";
var CELDA_IDENTIDAD = "truncate text-[13px] font-semibold";
var CELDA_IDENTIDAD_GRANDE = "truncate text-sm font-semibold";

// src/catalog/ciudades.js
var MUNICIPIOS = [
  { ciudad: "Bah\xEDa Negra", departamento: "Alto Paraguay" },
  { ciudad: "Capit\xE1n Carmelo Peralta", departamento: "Alto Paraguay" },
  { ciudad: "Fuerte Olimpo", departamento: "Alto Paraguay" },
  { ciudad: "Puerto Casado", departamento: "Alto Paraguay" },
  { ciudad: "Ciudad del Este", departamento: "Alto Paran\xE1" },
  { ciudad: "Doctor Juan Le\xF3n Mallorqu\xEDn", departamento: "Alto Paran\xE1" },
  { ciudad: "Doctor Ra\xFAl Pe\xF1a", departamento: "Alto Paran\xE1" },
  { ciudad: "Domingo Mart\xEDnez de Irala", departamento: "Alto Paran\xE1" },
  { ciudad: "Hernandarias", departamento: "Alto Paran\xE1" },
  { ciudad: "Iru\xF1a", departamento: "Alto Paran\xE1" },
  { ciudad: "Itakyry", departamento: "Alto Paran\xE1" },
  { ciudad: "Juan Emiliano O''Leary", departamento: "Alto Paran\xE1" },
  { ciudad: "Los Cedrales", departamento: "Alto Paran\xE1" },
  { ciudad: "Mbaracay\xFA", departamento: "Alto Paran\xE1" },
  { ciudad: "Minga Guaz\xFA", departamento: "Alto Paran\xE1" },
  { ciudad: "Minga Por\xE1", departamento: "Alto Paran\xE1" },
  { ciudad: "Naranjal", departamento: "Alto Paran\xE1" },
  { ciudad: "\xD1acunday", departamento: "Alto Paran\xE1" },
  { ciudad: "Presidente Franco", departamento: "Alto Paran\xE1" },
  { ciudad: "San Alberto", departamento: "Alto Paran\xE1" },
  { ciudad: "San Crist\xF3bal", departamento: "Alto Paran\xE1" },
  { ciudad: "Santa Fe del Paran\xE1", departamento: "Alto Paran\xE1" },
  { ciudad: "Santa Rita", departamento: "Alto Paran\xE1" },
  { ciudad: "Santa Rosa del Monday", departamento: "Alto Paran\xE1" },
  { ciudad: "Tavapy", departamento: "Alto Paran\xE1" },
  { ciudad: "Yguaz\xFA", departamento: "Alto Paran\xE1" },
  { ciudad: "Bella Vista Norte", departamento: "Amambay" },
  { ciudad: "Capit\xE1n Bado", departamento: "Amambay" },
  { ciudad: "Cerro Cor\xE1", departamento: "Amambay" },
  { ciudad: "Karapa\xED", departamento: "Amambay" },
  { ciudad: "Pedro Juan Caballero", departamento: "Amambay" },
  { ciudad: "Zanja Pyt\xE1", departamento: "Amambay" },
  { ciudad: "Asunci\xF3n", departamento: "Asunci\xF3n" },
  { ciudad: "Boquer\xF3n", departamento: "Boquer\xF3n" },
  { ciudad: "Filadelfia", departamento: "Boquer\xF3n" },
  { ciudad: "Loma Plata", departamento: "Boquer\xF3n" },
  { ciudad: "Mariscal Jos\xE9 F\xE9lix Estigarribia", departamento: "Boquer\xF3n" },
  { ciudad: "Caaguaz\xFA", departamento: "Caaguaz\xFA" },
  { ciudad: "Caraya\xF3", departamento: "Caaguaz\xFA" },
  { ciudad: "Coronel Oviedo", departamento: "Caaguaz\xFA" },
  { ciudad: "Doctor Cecilio B\xE1ez", departamento: "Caaguaz\xFA" },
  { ciudad: "Doctor Juan Eulogio Estigarribia", departamento: "Caaguaz\xFA" },
  { ciudad: "Doctor Juan Manuel Frutos", departamento: "Caaguaz\xFA" },
  { ciudad: "Jos\xE9 Domingo Ocampos", departamento: "Caaguaz\xFA" },
  { ciudad: "La Pastora", departamento: "Caaguaz\xFA" },
  { ciudad: "Mariscal Francisco Solano L\xF3pez", departamento: "Caaguaz\xFA" },
  { ciudad: "Nueva Londres", departamento: "Caaguaz\xFA" },
  { ciudad: "Nueva Toledo", departamento: "Caaguaz\xFA" },
  { ciudad: "Ra\xFAl Arsenio Oviedo", departamento: "Caaguaz\xFA" },
  { ciudad: "Regimiento de Infanter\xEDa Tres Corrales", departamento: "Caaguaz\xFA" },
  { ciudad: "Repatriaci\xF3n", departamento: "Caaguaz\xFA" },
  { ciudad: "San Joaqu\xEDn", departamento: "Caaguaz\xFA" },
  { ciudad: "San Jos\xE9 de los Arroyos", departamento: "Caaguaz\xFA" },
  { ciudad: "Santa Rosa del Mbutuy", departamento: "Caaguaz\xFA" },
  { ciudad: "Sim\xF3n Bol\xEDvar", departamento: "Caaguaz\xFA" },
  { ciudad: "Tembiapor\xE1", departamento: "Caaguaz\xFA" },
  { ciudad: "Tres de Febrero", departamento: "Caaguaz\xFA" },
  { ciudad: "Vaquer\xEDa", departamento: "Caaguaz\xFA" },
  { ciudad: "Yh\xFA", departamento: "Caaguaz\xFA" },
  { ciudad: "Aba\xED", departamento: "Caazap\xE1" },
  { ciudad: "Buena Vista", departamento: "Caazap\xE1" },
  { ciudad: "Caazap\xE1", departamento: "Caazap\xE1" },
  { ciudad: "Doctor Mois\xE9s Santiago Bertoni", departamento: "Caazap\xE1" },
  { ciudad: "Fulgencio Yegros", departamento: "Caazap\xE1" },
  { ciudad: "General Higinio Mor\xEDnigo", departamento: "Caazap\xE1" },
  { ciudad: "Maciel", departamento: "Caazap\xE1" },
  { ciudad: "San Juan Nepomuceno", departamento: "Caazap\xE1" },
  { ciudad: "Tava\xED", departamento: "Caazap\xE1" },
  { ciudad: "Tres de Mayo", departamento: "Caazap\xE1" },
  { ciudad: "Yuty", departamento: "Caazap\xE1" },
  { ciudad: "Corpus Christi", departamento: "Canindey\xFA" },
  { ciudad: "Curuguaty", departamento: "Canindey\xFA" },
  { ciudad: "General Francisco Caballero \xC1lvarez", departamento: "Canindey\xFA" },
  { ciudad: "Itanar\xE1", departamento: "Canindey\xFA" },
  { ciudad: "Katuet\xE9", departamento: "Canindey\xFA" },
  { ciudad: "La Paloma del Esp\xEDritu Santo", departamento: "Canindey\xFA" },
  { ciudad: "Laurel", departamento: "Canindey\xFA" },
  { ciudad: "Maracan\xE1", departamento: "Canindey\xFA" },
  { ciudad: "Nueva Esperanza", departamento: "Canindey\xFA" },
  { ciudad: "Puerto Adela", departamento: "Canindey\xFA" },
  { ciudad: "Saltos del Guair\xE1", departamento: "Canindey\xFA" },
  { ciudad: "Villa Ygatim\xED", departamento: "Canindey\xFA" },
  { ciudad: "Yasy Ca\xF1y", departamento: "Canindey\xFA" },
  { ciudad: "Yby Pyt\xE1", departamento: "Canindey\xFA" },
  { ciudad: "Ybyraroban\xE1", departamento: "Canindey\xFA" },
  { ciudad: "Ypejh\xFA", departamento: "Canindey\xFA" },
  { ciudad: "Aregu\xE1", departamento: "Central" },
  { ciudad: "Capiat\xE1", departamento: "Central" },
  { ciudad: "Fernando de la Mora", departamento: "Central" },
  { ciudad: "Guarambar\xE9", departamento: "Central" },
  { ciudad: "It\xE1", departamento: "Central" },
  { ciudad: "Itaugu\xE1", departamento: "Central" },
  { ciudad: "Juli\xE1n Augusto Sald\xEDvar", departamento: "Central" },
  { ciudad: "Lambar\xE9", departamento: "Central" },
  { ciudad: "Limpio", departamento: "Central" },
  { ciudad: "Luque", departamento: "Central" },
  { ciudad: "Mariano Roque Alonso", departamento: "Central" },
  { ciudad: "Nueva Italia", departamento: "Central" },
  { ciudad: "\xD1emby", departamento: "Central" },
  { ciudad: "San Antonio", departamento: "Central" },
  { ciudad: "San Lorenzo", departamento: "Central" },
  { ciudad: "Villa Elisa", departamento: "Central" },
  { ciudad: "Villeta", departamento: "Central" },
  { ciudad: "Ypacara\xED", departamento: "Central" },
  { ciudad: "Ypan\xE9", departamento: "Central" },
  { ciudad: "Arroyito", departamento: "Concepci\xF3n" },
  { ciudad: "Azotey", departamento: "Concepci\xF3n" },
  { ciudad: "Bel\xE9n", departamento: "Concepci\xF3n" },
  { ciudad: "Concepci\xF3n", departamento: "Concepci\xF3n" },
  { ciudad: "Horqueta", departamento: "Concepci\xF3n" },
  { ciudad: "Itacu\xE1", departamento: "Concepci\xF3n" },
  { ciudad: "Loreto", departamento: "Concepci\xF3n" },
  { ciudad: "Paso Barreto", departamento: "Concepci\xF3n" },
  { ciudad: "Paso Horqueta", departamento: "Concepci\xF3n" },
  { ciudad: "San Alfredo", departamento: "Concepci\xF3n" },
  { ciudad: "San Carlos del Apa", departamento: "Concepci\xF3n" },
  { ciudad: "San L\xE1zaro", departamento: "Concepci\xF3n" },
  { ciudad: "Sargento Jos\xE9 F\xE9lix L\xF3pez", departamento: "Concepci\xF3n" },
  { ciudad: "Yby Ya\xFA", departamento: "Concepci\xF3n" },
  { ciudad: "Altos", departamento: "Cordillera" },
  { ciudad: "Arroyos y Esteros", departamento: "Cordillera" },
  { ciudad: "Atyr\xE1", departamento: "Cordillera" },
  { ciudad: "Caacup\xE9", departamento: "Cordillera" },
  { ciudad: "Caraguatay", departamento: "Cordillera" },
  { ciudad: "Emboscada", departamento: "Cordillera" },
  { ciudad: "Eusebio Ayala", departamento: "Cordillera" },
  { ciudad: "Isla Puc\xFA", departamento: "Cordillera" },
  { ciudad: "Itacurub\xED de la Cordillera", departamento: "Cordillera" },
  { ciudad: "Juan de Mena", departamento: "Cordillera" },
  { ciudad: "Loma Grande", departamento: "Cordillera" },
  { ciudad: "Mbocayaty del Yhaguy", departamento: "Cordillera" },
  { ciudad: "Nueva Colombia", departamento: "Cordillera" },
  { ciudad: "Piribebuy", departamento: "Cordillera" },
  { ciudad: "Primero de Marzo", departamento: "Cordillera" },
  { ciudad: "San Bernardino", departamento: "Cordillera" },
  { ciudad: "San Jos\xE9 Obrero", departamento: "Cordillera" },
  { ciudad: "Santa Elena", departamento: "Cordillera" },
  { ciudad: "Tobat\xED", departamento: "Cordillera" },
  { ciudad: "Valenzuela", departamento: "Cordillera" },
  { ciudad: "Borja", departamento: "Guair\xE1" },
  { ciudad: "Capit\xE1n Mauricio Jos\xE9 Troche", departamento: "Guair\xE1" },
  { ciudad: "Coronel Mart\xEDnez", departamento: "Guair\xE1" },
  { ciudad: "Doctor Botrell", departamento: "Guair\xE1" },
  { ciudad: "F\xE9lix P\xE9rez Cardozo", departamento: "Guair\xE1" },
  { ciudad: "General Eugenio Alejandrino Garay", departamento: "Guair\xE1" },
  { ciudad: "Independencia", departamento: "Guair\xE1" },
  { ciudad: "Itap\xE9", departamento: "Guair\xE1" },
  { ciudad: "Iturbe", departamento: "Guair\xE1" },
  { ciudad: "Jos\xE9 A. Fassardi", departamento: "Guair\xE1" },
  { ciudad: "Mbocayaty del Guair\xE1", departamento: "Guair\xE1" },
  { ciudad: "Natalicio Talavera", departamento: "Guair\xE1" },
  { ciudad: "\xD1um\xED", departamento: "Guair\xE1" },
  { ciudad: "Paso Yob\xE1i", departamento: "Guair\xE1" },
  { ciudad: "San Salvador", departamento: "Guair\xE1" },
  { ciudad: "Tebicuary", departamento: "Guair\xE1" },
  { ciudad: "Villarrica", departamento: "Guair\xE1" },
  { ciudad: "Yataity del Guair\xE1", departamento: "Guair\xE1" },
  { ciudad: "Alto Ver\xE1", departamento: "Itap\xFAa" },
  { ciudad: "Bella Vista", departamento: "Itap\xFAa" },
  { ciudad: "Cambyret\xE1", departamento: "Itap\xFAa" },
  { ciudad: "Capit\xE1n Meza", departamento: "Itap\xFAa" },
  { ciudad: "Capit\xE1n Miranda", departamento: "Itap\xFAa" },
  { ciudad: "Carlos Antonio L\xF3pez", departamento: "Itap\xFAa" },
  { ciudad: "Carmen del Paran\xE1", departamento: "Itap\xFAa" },
  { ciudad: "Coronel Jos\xE9 F\xE9lix Bogado", departamento: "Itap\xFAa" },
  { ciudad: "Edelira", departamento: "Itap\xFAa" },
  { ciudad: "Encarnaci\xF3n", departamento: "Itap\xFAa" },
  { ciudad: "Fram", departamento: "Itap\xFAa" },
  { ciudad: "General Artigas", departamento: "Itap\xFAa" },
  { ciudad: "General Delgado", departamento: "Itap\xFAa" },
  { ciudad: "Hohenau", departamento: "Itap\xFAa" },
  { ciudad: "Itap\xFAa Poty", departamento: "Itap\xFAa" },
  { ciudad: "Jes\xFAs de Tavarang\xFC\xE9", departamento: "Itap\xFAa" },
  { ciudad: "Jos\xE9 Leandro Oviedo", departamento: "Itap\xFAa" },
  { ciudad: "La Paz", departamento: "Itap\xFAa" },
  { ciudad: "Mayor Julio Dionisio Ota\xF1o", departamento: "Itap\xFAa" },
  { ciudad: "Natalio", departamento: "Itap\xFAa" },
  { ciudad: "Nueva Alborada", departamento: "Itap\xFAa" },
  { ciudad: "Obligado", departamento: "Itap\xFAa" },
  { ciudad: "Pirap\xF3", departamento: "Itap\xFAa" },
  { ciudad: "San Cosme y Dami\xE1n", departamento: "Itap\xFAa" },
  { ciudad: "San Juan del Paran\xE1", departamento: "Itap\xFAa" },
  { ciudad: "San Pedro del Paran\xE1", departamento: "Itap\xFAa" },
  { ciudad: "San Rafael del Paran\xE1", departamento: "Itap\xFAa" },
  { ciudad: "Tom\xE1s Romero Pereira", departamento: "Itap\xFAa" },
  { ciudad: "Trinidad", departamento: "Itap\xFAa" },
  { ciudad: "Yatytay", departamento: "Itap\xFAa" },
  { ciudad: "Ayolas", departamento: "Misiones" },
  { ciudad: "San Ignacio Guaz\xFA", departamento: "Misiones" },
  { ciudad: "San Juan Bautista", departamento: "Misiones" },
  { ciudad: "San Miguel", departamento: "Misiones" },
  { ciudad: "San Patricio", departamento: "Misiones" },
  { ciudad: "Santa Mar\xEDa de Fe", departamento: "Misiones" },
  { ciudad: "Santa Rosa de Lima", departamento: "Misiones" },
  { ciudad: "Santiago", departamento: "Misiones" },
  { ciudad: "Villa Florida", departamento: "Misiones" },
  { ciudad: "Yabebyry", departamento: "Misiones" },
  { ciudad: "Alberdi", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Cerrito", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Desmochados", departamento: "\xD1eembuc\xFA" },
  { ciudad: "General Jos\xE9 Eduvigis D\xEDaz", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Guaz\xFA Cu\xE1", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Humait\xE1", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Isla Umb\xFA", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Laureles", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Mayor Jos\xE9 Mart\xEDnez", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Paso de Patria", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Pilar", departamento: "\xD1eembuc\xFA" },
  { ciudad: "San Juan Bautista de \xD1eembuc\xFA", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Tacuaras", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Villa Franca", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Villa Oliva", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Villalb\xEDn", departamento: "\xD1eembuc\xFA" },
  { ciudad: "Acahay", departamento: "Paraguar\xED" },
  { ciudad: "Caapuc\xFA", departamento: "Paraguar\xED" },
  { ciudad: "Carapegu\xE1", departamento: "Paraguar\xED" },
  { ciudad: "Escobar", departamento: "Paraguar\xED" },
  { ciudad: "General Bernardino Caballero", departamento: "Paraguar\xED" },
  { ciudad: "La Colmena", departamento: "Paraguar\xED" },
  { ciudad: "Mar\xEDa Antonia", departamento: "Paraguar\xED" },
  { ciudad: "Mbuyapey", departamento: "Paraguar\xED" },
  { ciudad: "Paraguar\xED", departamento: "Paraguar\xED" },
  { ciudad: "Piray\xFA", departamento: "Paraguar\xED" },
  { ciudad: "Quiindy", departamento: "Paraguar\xED" },
  { ciudad: "Quyquyh\xF3", departamento: "Paraguar\xED" },
  { ciudad: "San Roque Gonz\xE1lez de Santa Cruz", departamento: "Paraguar\xED" },
  { ciudad: "Sapucai", departamento: "Paraguar\xED" },
  { ciudad: "Tebicuarym\xED", departamento: "Paraguar\xED" },
  { ciudad: "Yaguar\xF3n", departamento: "Paraguar\xED" },
  { ciudad: "Ybycu\xED", departamento: "Paraguar\xED" },
  { ciudad: "Ybytym\xED", departamento: "Paraguar\xED" },
  { ciudad: "Benjam\xEDn Aceval", departamento: "Presidente Hayes" },
  { ciudad: "Campo Aceval", departamento: "Presidente Hayes" },
  { ciudad: "General Jos\xE9 Mar\xEDa Bruguez", departamento: "Presidente Hayes" },
  { ciudad: "Jos\xE9 Falc\xF3n", departamento: "Presidente Hayes" },
  { ciudad: "Nanawa", departamento: "Presidente Hayes" },
  { ciudad: "Nueva Asunci\xF3n", departamento: "Presidente Hayes" },
  { ciudad: "Puerto Pinasco", departamento: "Presidente Hayes" },
  { ciudad: "Teniente Esteban Mart\xEDnez", departamento: "Presidente Hayes" },
  { ciudad: "Teniente Primero Manuel Irala Fern\xE1ndez", departamento: "Presidente Hayes" },
  { ciudad: "Villa Hayes", departamento: "Presidente Hayes" },
  { ciudad: "Antequera", departamento: "San Pedro" },
  { ciudad: "Capiibary", departamento: "San Pedro" },
  { ciudad: "Chor\xE9", departamento: "San Pedro" },
  { ciudad: "General Elizardo Aquino", departamento: "San Pedro" },
  { ciudad: "General Isidoro Resqu\xEDn", departamento: "San Pedro" },
  { ciudad: "Guayaib\xED", departamento: "San Pedro" },
  { ciudad: "Itacurub\xED del Rosario", departamento: "San Pedro" },
  { ciudad: "Liberaci\xF3n", departamento: "San Pedro" },
  { ciudad: "Lima", departamento: "San Pedro" },
  { ciudad: "Nueva Germania", departamento: "San Pedro" },
  { ciudad: "San Jos\xE9 del Rosario", departamento: "San Pedro" },
  { ciudad: "San Estanislao", departamento: "San Pedro" },
  { ciudad: "San Pablo", departamento: "San Pedro" },
  { ciudad: "San Pedro de Ycuamandiy\xFA", departamento: "San Pedro" },
  { ciudad: "San Vicente Pancholo", departamento: "San Pedro" },
  { ciudad: "Santa Rosa del Aguaray", departamento: "San Pedro" },
  { ciudad: "Tacuat\xED", departamento: "San Pedro" },
  { ciudad: "Uni\xF3n", departamento: "San Pedro" },
  { ciudad: "Veinticinco de Diciembre", departamento: "San Pedro" },
  { ciudad: "Villa del Rosario", departamento: "San Pedro" },
  { ciudad: "Yataity del Norte", departamento: "San Pedro" },
  { ciudad: "Yrybucu\xE1", departamento: "San Pedro" }
];
var CIUDADES_PARAGUAY = MUNICIPIOS.map(({ ciudad, departamento }) => ({
  ciudad,
  departamento,
  city: ciudad,
  department: departamento
}));
var DEPARTAMENTOS_PARAGUAY = [
  "Alto Paraguay",
  "Alto Paran\xE1",
  "Amambay",
  "Asunci\xF3n",
  "Boquer\xF3n",
  "Caaguaz\xFA",
  "Caazap\xE1",
  "Canindey\xFA",
  "Central",
  "Concepci\xF3n",
  "Cordillera",
  "Guair\xE1",
  "Itap\xFAa",
  "Misiones",
  "\xD1eembuc\xFA",
  "Paraguar\xED",
  "Presidente Hayes",
  "San Pedro"
];
var norm = (valor) => String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
function departamentoDe(ciudad) {
  const buscado = norm(ciudad);
  if (!buscado) return "";
  const fila = CIUDADES_PARAGUAY.find((item) => norm(item.ciudad) === buscado);
  return fila?.departamento || "";
}
function buscarCiudad(texto, limite = 8) {
  const q = norm(texto);
  if (q.length < 2) return [];
  return CIUDADES_PARAGUAY.filter(({ ciudad, departamento }) => norm(ciudad).includes(q) || norm(departamento).includes(q)).sort((a, b) => {
    const aInicio = norm(a.ciudad).startsWith(q) ? 0 : 1;
    const bInicio = norm(b.ciudad).startsWith(q) ? 0 : 1;
    return aInicio - bInicio || a.ciudad.localeCompare(b.ciudad, "es");
  }).slice(0, limite).map(({ ciudad, departamento, city, department }) => ({ ciudad, departamento, city, department }));
}

// src/catalog/productos.js
var MODELOS_IPHONE = [
  // Generación actual y anteriores (del más nuevo al más viejo)
  "iPhone 17 Pro Max",
  "iPhone 17 Pro",
  "iPhone 17 Plus",
  "iPhone 17",
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13 Pro",
  "iPhone 13 mini",
  "iPhone 13",
  "iPhone 12 Pro Max",
  "iPhone 12 Pro",
  "iPhone 12 mini",
  "iPhone 12",
  "iPhone 11 Pro Max",
  "iPhone 11 Pro",
  "iPhone 11",
  "iPhone XS Max",
  "iPhone XS",
  "iPhone XR",
  "iPhone X",
  "iPhone 8 Plus",
  "iPhone 8",
  "iPhone 7 Plus",
  "iPhone 7",
  "iPhone SE (3.\xAA generaci\xF3n)",
  "iPhone SE (2.\xAA generaci\xF3n)"
];
var CAPACIDADES_IPHONE = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];
var COLORES_IPHONE = [
  "Negro",
  "Blanco",
  "Plata",
  "Gris espacial",
  "Dorado",
  "Azul",
  "Verde",
  "Rojo",
  "Rosa",
  "Morado",
  "Amarillo",
  "Titanio natural",
  "Titanio azul",
  "Titanio blanco",
  "Titanio negro",
  "Titanio desierto"
];
var CATEGORIAS_ACCESORIOS = [
  "Fundas",
  "Vidrios templados",
  "Cargadores",
  "Cables",
  "Auriculares",
  "Bater\xEDas",
  "Parlantes",
  "Relojes y correas",
  "Soportes",
  "Power banks",
  "Adaptadores",
  "L\xE1pices y stylus",
  "Memorias y almacenamiento",
  "C\xE1maras y accesorios",
  "Repuestos",
  "Otros accesorios"
];
var MARCAS_ACCESORIOS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "JBL",
  "Baseus",
  "Anker",
  "Hoco",
  "Generic",
  "Otro"
];
function normalizarBusqueda(texto = "") {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function buscarEnCatalogo(catalogo = [], texto = "") {
  const q = normalizarBusqueda(texto);
  if (!q) return catalogo;
  return catalogo.filter((item) => normalizarBusqueda(item).includes(q));
}

// src/catalog/dispositivos.js
var CONECTIVIDADES_MOVIL = ["5G", "4G LTE", "WiFi", "WiFi + Cellular", "Bluetooth", "eSIM"];
var DISPOSITIVOS_MOBILE = MODELOS_IPHONE.map((nombre) => ({ nombre }));
var PERFILES_DISPOSITIVO = {
  // Celulares: modelo → capacidad, color y conectividad.
  mobile: {
    campos: ["capacidad", "color", "conectividad"],
    etiquetas: { modelo: "Modelo", capacidad: "Capacidad", color: "Color", conectividad: "Conectividad" },
    catalogo: { modelos: DISPOSITIVOS_MOBILE, capacidades: CAPACIDADES_IPHONE, colores: COLORES_IPHONE, conectividades: CONECTIVIDADES_MOVIL }
  },
  // Accesorios: marca → categoría (el modelo compatible es opcional).
  accesorios: {
    campos: ["marca", "categoria"],
    etiquetas: { modelo: "Producto o modelo compatible", marca: "Marca", categoria: "Categor\xEDa" },
    catalogo: { modelos: [], marcas: MARCAS_ACCESORIOS, categorias: CATEGORIAS_ACCESORIOS }
  },
  // Servicio técnico: modelo → capacidad y color (sin conectividad).
  servicio: {
    campos: ["capacidad", "color"],
    etiquetas: { modelo: "Modelo", capacidad: "Capacidad", color: "Color" },
    catalogo: { modelos: DISPOSITIVOS_MOBILE, capacidades: CAPACIDADES_IPHONE, colores: COLORES_IPHONE }
  }
};
var CAMPOS_DISPOSITIVO = ["capacidad", "color", "conectividad", "marca", "categoria"];
var CLAVES_DEPENDIENTE = { capacidad: "capacidades", color: "colores", conectividad: "conectividades", marca: "marcas", categoria: "categorias" };
function nombreDeDispositivo(modelo) {
  return typeof modelo === "string" ? modelo : modelo?.nombre || "";
}
function codigoDeDispositivo(modelo) {
  return typeof modelo === "string" ? "" : modelo?.codigo || "";
}
function buscarDispositivo(modelos = [], texto = "", { porCodigo = true, limite = 8 } = {}) {
  const q = normalizarBusqueda(texto);
  const lista = Array.isArray(modelos) ? modelos : [];
  if (!q) return lista.slice(0, limite);
  return lista.filter((modelo) => {
    const nombre = normalizarBusqueda(nombreDeDispositivo(modelo));
    if (nombre.includes(q)) return true;
    return porCodigo !== false && normalizarBusqueda(codigoDeDispositivo(modelo)).includes(q);
  }).slice(0, limite);
}
function opcionesDependiente(modelo, campo, perfil = PERFILES_DISPOSITIVO.mobile) {
  const clave = CLAVES_DEPENDIENTE[campo] || campo;
  const propias = typeof modelo === "object" && modelo ? modelo[clave] : null;
  if (Array.isArray(propias) && propias.length) return propias;
  return perfil?.catalogo?.[clave] || [];
}
function limpiarDependientes(valor = {}, modelo, perfil = PERFILES_DISPOSITIVO.mobile) {
  const siguiente = { ...valor, modelo: nombreDeDispositivo(modelo) };
  const mismosCampos = nombreDeDispositivo(modelo) && normalizarBusqueda(nombreDeDispositivo(modelo)) === normalizarBusqueda(valor.modelo);
  for (const campo of perfil?.campos || []) {
    if (!mismosCampos) {
      siguiente[campo] = "";
      continue;
    }
    const opciones = opcionesDependiente(modelo, campo, perfil);
    if (opciones.length && valor[campo] && !opciones.includes(valor[campo])) siguiente[campo] = "";
  }
  return siguiente;
}
function etiquetaDispositivo(valor = {}, { separador = " \xB7 " } = {}) {
  const partes = [valor.modelo, valor.capacidad, valor.color, valor.conectividad, valor.marca, valor.categoria];
  return partes.filter(Boolean).join(separador);
}

// src/utils/moneda.js
var GS_FORMATTER = new Intl.NumberFormat("es-PY", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});
var SIMBOLO_PYG = "Gs";
var SIMBOLOS_MONEDA = { PYG: "Gs", USD: "US$", BRL: "R$", EUR: "\u20AC", USDT: "USDT" };
function simboloDe(opciones) {
  const crudo = typeof opciones === "string" ? opciones : opciones?.simbolo;
  return String(crudo ?? "").trim() || SIMBOLO_PYG;
}
function opcionesDeVacio(vacio, opciones) {
  if (vacio && typeof vacio === "object") return { vacio: vacio.vacio ?? "\u2014", simbolo: vacio.simbolo };
  return { vacio: vacio ?? "\u2014", simbolo: opciones?.simbolo };
}
var LIMITE_MONTO_GENERAL = 1e10;
var LIMITE_MONTO_VENTAS = 99e9;
function excedeMonto(value, limite = LIMITE_MONTO_GENERAL) {
  const texto = String(value ?? "").trim().replace(/\./g, "").replace(",", ".");
  if (!texto) return false;
  const numero = Number(texto);
  return Number.isFinite(numero) && Math.abs(numero) > limite;
}
var LIMITE_MONTO_ALMACENABLE = 2147483647;
function limiteMonto(max = LIMITE_MONTO_GENERAL) {
  const valor = Number(max);
  return Number.isFinite(valor) && valor > 0 ? Math.min(valor, LIMITE_MONTO_ALMACENABLE) : LIMITE_MONTO_ALMACENABLE;
}
function errorMonto(value, max = LIMITE_MONTO_GENERAL) {
  const limite = limiteMonto(max);
  return excedeMonto(value, limite) ? `El monto supera el m\xE1ximo que el sistema puede guardar (Gs ${formatoNumero(limite)}).` : "";
}
var USD_FORMATTER = new Intl.NumberFormat("es-PY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function formatGs(value, opciones) {
  const amount = Number(value);
  return `${simboloDe(opciones)} ${GS_FORMATTER.format(Number.isFinite(amount) ? Math.round(amount) : 0)}`;
}
function formatGsInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? GS_FORMATTER.format(Number(digits)) : "";
}
function parseGsInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}
var USD_INPUT_FORMATTER = new Intl.NumberFormat("es-PY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function formatUsdInput(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const amount = Number(text);
  return Number.isFinite(amount) ? USD_INPUT_FORMATTER.format(amount) : "";
}
function parseUsdInput(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const normalized = text.replace(/\./g, "").replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return "";
  return String(Number(normalized));
}
var GRUPO_MILES = /^\d{1,3}([.,])\d{3}(?:\1\d{3})*$/;
var CONTINUACION_MILES = /^\d{1,3}([.,])\d{3,}(?:\1\d+)*$/;
function normalizarMontoInput(texto, moneda = "PYG", { integerOnly = false } = {}) {
  const bruto = String(texto ?? "").replace(/[^0-9.,]/g, "");
  if (!bruto) return "";
  if (GRUPO_MILES.test(bruto)) return bruto.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (moneda === "PYG" || integerOnly) return enteroDeMonto(bruto);
  let display = bruto;
  if (bruto.lastIndexOf(".") > bruto.lastIndexOf(",") && /\.\d{0,2}$/.test(bruto)) {
    const punto = bruto.lastIndexOf(".");
    display = bruto.slice(0, punto).replace(/[.,]/g, "") + "," + bruto.slice(punto + 1);
  }
  const [entero = "", decimales] = display.replace(/[^0-9,]/g, "").split(",");
  const limpio = entero.replace(/^0+(?=\d)/, "");
  return decimales !== void 0 ? `${limpio || "0"}.${decimales.slice(0, 2)}` : limpio;
}
function enteroDeMonto(bruto) {
  if (CONTINUACION_MILES.test(bruto)) return bruto.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  const ultimo = Math.max(bruto.lastIndexOf("."), bruto.lastIndexOf(","));
  if (ultimo < 0) return bruto.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  return enteroDeMonto(bruto.slice(0, ultimo));
}
function caretTrasDigitos(display, digitos) {
  if (digitos <= 0) return 0;
  let vistos = 0;
  for (let indice = 0; indice < display.length; indice += 1) {
    if (/\d/.test(display[indice])) vistos += 1;
    if (vistos === digitos) return indice + 1;
  }
  return display.length;
}
function formatUsd(value) {
  const amount = Number(value);
  return `USD ${USD_FORMATTER.format(Number.isFinite(amount) ? amount : 0)}`;
}
function formatMoney(value, currency = "PYG", opciones) {
  return currency === "USD" ? formatUsd(value) : formatGs(value, opciones);
}
function montoGs(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, simbolo } = opcionesDeVacio(vacio, opciones);
  const amount = numeroDe(value);
  return amount === null ? vacioFinal : formatGs(amount, { simbolo });
}
function montoUsd(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, simbolo } = opcionesDeVacio(vacio, opciones);
  const amount = numeroDe(value);
  const prefijo = String(simbolo ?? "").trim() || SIMBOLOS_MONEDA.USD;
  return amount === null ? vacioFinal : `${prefijo} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
function montoTexto(value, currency = "PYG", vacio = "\u2014", opciones) {
  return currency === "USD" ? montoUsd(value, vacio, opciones) : montoGs(value, vacio, opciones);
}
function numeroDe(value) {
  if (value === null || value === void 0 || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}
function largoMaximoMonto(max = LIMITE_MONTO_GENERAL, { decimales = false } = {}) {
  const digitos = String(Math.trunc(Math.abs(Number(max) || 0))).length;
  const separadores = Math.floor((digitos - 1) / 3);
  return digitos + separadores + (decimales ? 3 : 0);
}
var NUMEROS_FORMATTER = new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 });
var NUMEROS_DECIMALES = /* @__PURE__ */ new Map();
function formateadorNumero(decimales) {
  const clave = Number(decimales) || 0;
  if (clave <= 0) return NUMEROS_FORMATTER;
  if (!NUMEROS_DECIMALES.has(clave)) {
    NUMEROS_DECIMALES.set(clave, new Intl.NumberFormat("es-PY", { minimumFractionDigits: clave, maximumFractionDigits: clave }));
  }
  return NUMEROS_DECIMALES.get(clave);
}
function formatoNumero(value, { decimales = 0, vacio = "\u2014" } = {}) {
  const amount = numeroDe(value);
  return amount === null ? vacio : formateadorNumero(decimales).format(amount);
}
function signoDe(value) {
  const amount = numeroDe(value);
  if (amount === null || amount === 0) return "";
  return amount > 0 ? "+" : "\u2212";
}
function montoConSigno(value, currency = "PYG", vacio = "\u2014", opciones) {
  const { vacio: vacioFinal } = opcionesDeVacio(vacio, opciones);
  const amount = numeroDe(value);
  if (amount === null) return vacioFinal;
  const signo = signoDe(amount);
  return signo ? `${signo} ${montoTexto(Math.abs(amount), currency, "\u2014", opciones)}` : montoTexto(amount, currency, "\u2014", opciones);
}

// src/utils/fecha.js
var ES_PY = "es-PY";
var OPCIONES_HORA = { hour12: false };
var SOLO_DIA = /^(\d{4})-(\d{2})-(\d{2})$/;
function diaDeCalendario(value) {
  if (typeof value !== "string") return null;
  const partes = SOLO_DIA.exec(value.trim());
  if (!partes) return null;
  const anio = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  const real = fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
  return real ? fecha : null;
}
function fechaValida(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string") {
    const partes = SOLO_DIA.exec(value.trim());
    if (partes) {
      const anio = Number(partes[1]);
      const mes = Number(partes[2]);
      const dia = Number(partes[3]);
      const fecha2 = new Date(anio, mes - 1, dia);
      const real = fecha2.getFullYear() === anio && fecha2.getMonth() === mes - 1 && fecha2.getDate() === dia;
      return real ? fecha2 : null;
    }
  }
  const fecha = new Date(value);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}
function opcionesDe(vacio, opciones) {
  if (vacio && typeof vacio === "object") return { vacio: vacio.vacio, timeZone: vacio.timeZone, hora: vacio.hora };
  return { vacio, timeZone: opciones?.timeZone, hora: opciones?.hora };
}
function formateador(formato, timeZone) {
  return new Intl.DateTimeFormat(ES_PY, timeZone ? { ...formato, timeZone } : formato);
}
function textoFormateado(value, formato, { vacio = "\u2014", timeZone } = {}) {
  const dia = diaDeCalendario(value);
  if (dia) return formateador(formato, "UTC").format(dia);
  const fecha = fechaValida(value);
  if (!fecha) return vacio;
  return formateador(formato, timeZone).format(fecha);
}
function fechaHora(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, timeZone } = opcionesDe(vacio, opciones);
  return textoFormateado(value, { dateStyle: "short", timeStyle: "short", ...OPCIONES_HORA }, { vacio: vacioFinal ?? "\u2014", timeZone });
}
function fechaDia(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, timeZone } = opcionesDe(vacio, opciones);
  return textoFormateado(value, {}, { vacio: vacioFinal ?? "\u2014", timeZone });
}
function fechaHoraCorta(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, timeZone } = opcionesDe(vacio, opciones);
  return textoFormateado(value, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", ...OPCIONES_HORA }, { vacio: vacioFinal ?? "\u2014", timeZone });
}
function fechaCorta(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, timeZone } = opcionesDe(vacio, opciones);
  const vacioReal = vacioFinal ?? "\u2014";
  const dia = diaDeCalendario(value);
  const fecha = dia || fechaValida(value);
  if (!fecha) return vacioReal;
  const zona = dia ? "UTC" : timeZone;
  const parteDia = formateador({ day: "2-digit", month: "short" }, zona).format(fecha);
  const parteHora = formateador({ hour: "2-digit", minute: "2-digit", ...OPCIONES_HORA }, zona).format(fecha);
  return `${parteDia} \xB7 ${parteHora}`;
}
function fechaLista(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, timeZone, hora } = opcionesDe(vacio, opciones);
  const vacioReal = vacioFinal ?? "\u2014";
  const dia = diaDeCalendario(value);
  const fecha = dia || fechaValida(value);
  if (!fecha) return vacioReal;
  const zona = dia ? "UTC" : timeZone;
  const parteDia = formateador({ day: "2-digit", month: "short", year: "2-digit" }, zona).format(fecha).replace(/\./g, "");
  const reloj = String(
    hora ?? (dia ? "" : formateador({ hour: "2-digit", minute: "2-digit", ...OPCIONES_HORA }, zona).format(fecha))
  ).slice(0, 5);
  return reloj ? `${parteDia} \xB7 ${reloj}` : parteDia;
}
function fechaListaCorta(value, vacio = "\u2014", opciones) {
  const { vacio: vacioFinal, timeZone } = opcionesDe(vacio, opciones);
  const vacioReal = vacioFinal ?? "\u2014";
  const dia = diaDeCalendario(value);
  const fecha = dia || fechaValida(value);
  if (!fecha) return vacioReal;
  return formateador({ day: "2-digit", month: "short" }, dia ? "UTC" : timeZone).format(fecha).replace(/\./g, "").replace(/\s+/g, "-");
}
function claveDeDia(fecha, timeZone) {
  const dia = diaDeCalendario(fecha);
  if (dia) return dia.toISOString().slice(0, 10);
  const instante = fechaValida(fecha);
  if (!instante) return null;
  if (timeZone) {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instante);
  }
  const mes = String(instante.getMonth() + 1).padStart(2, "0");
  const diaMes = String(instante.getDate()).padStart(2, "0");
  return `${instante.getFullYear()}-${mes}-${diaMes}`;
}
function diasHasta(fecha, { hoy = /* @__PURE__ */ new Date(), timeZone } = {}) {
  const objetivo = claveDeDia(fecha, timeZone);
  const base = claveDeDia(hoy, timeZone);
  if (!objetivo || !base) return null;
  return Math.round((Date.parse(`${objetivo}T00:00:00Z`) - Date.parse(`${base}T00:00:00Z`)) / 864e5);
}
function tonoVencimiento(fecha, { hoy, diasAviso = 7 } = {}) {
  const dias = diasHasta(fecha, { hoy });
  if (dias === null) return "";
  if (dias < 0) return "bad";
  return dias <= diasAviso ? "warn" : "";
}

// src/utils/serial.js
function normalizarSerial(value = "") {
  return String(value ?? "").trim().replace(/^MOBOS:/i, "").replace(/[\s-]+/g, "").toUpperCase();
}
function ultimos4(serial) {
  return String(serial ?? "").slice(-4);
}
function partirSerial(serial) {
  const texto = String(serial ?? "");
  if (!texto) return { cabeza: "", cola: "" };
  return { cabeza: texto.slice(0, -4), cola: texto.slice(-4) };
}
function serialEnmascarado(serial) {
  const cola = ultimos4(serial);
  return cola ? `\u2022\u2022\u2022\u2022${cola}` : "";
}
function imeiValido(valor) {
  const imei = String(valor ?? "").replace(/\D/g, "");
  if (imei.length !== 15) return false;
  let suma = 0;
  for (let i = 0; i < 15; i += 1) {
    let digito = Number(imei[14 - i]);
    if (i % 2 === 1) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }
  return suma % 10 === 0;
}
function separarSeriales(texto, { maxLargo = 32 } = {}) {
  const vistos = /* @__PURE__ */ new Set();
  const seriales = [];
  for (const bruto of String(texto ?? "").split(/[\s,;|]+/)) {
    const serial = normalizarSerial(bruto).slice(0, maxLargo);
    if (!serial || vistos.has(serial)) continue;
    vistos.add(serial);
    seriales.push(serial);
  }
  return seriales;
}
function normalizarSeriales(texto, { validar, limite = 9999, maxLargo = 32 } = {}) {
  const vistos = /* @__PURE__ */ new Set();
  const repetidos = [];
  const invalidos = [];
  const seriales = [];
  for (const bruto of String(texto ?? "").split(/[\s,;|]+/)) {
    const serial = normalizarSerial(bruto).slice(0, maxLargo);
    if (!serial) continue;
    if (vistos.has(serial)) {
      repetidos.push(serial);
      continue;
    }
    vistos.add(serial);
    if (typeof validar === "function" && !validar(serial)) {
      invalidos.push(serial);
      continue;
    }
    if (seriales.length >= limite) continue;
    seriales.push(serial);
  }
  return { seriales, repetidos, invalidos };
}

// src/utils/ruc.js
var RUC_RE = /\d[\d.\s]{2,}-\d+/;
function extraerRuc(texto) {
  const encontrado = String(texto || "").match(RUC_RE);
  return encontrado ? encontrado[0].trim() : "";
}
function esRuc(valor) {
  return RUC_RE.test(String(valor || "").trim());
}

// src/utils/taxId.js
var PATRON_RUC = /^\d{5,8}(-\d)?$/;
var PATRON_TAX_ID_GENERICO = /^[\p{L}\p{N}./-]{3,32}$/u;
var MENSAJE_RUC = "RUC inv\xE1lido: us\xE1 5 a 8 d\xEDgitos, con o sin d\xEDgito verificador (ej: 80012345-6).";
var MENSAJE_RUC_SIN_DATOS = "No encontramos la raz\xF3n social de este RUC.";
var MENSAJE_RUC_CONSULTA = "No pudimos consultar el RUC. Intent\xE1 nuevamente.";
function taxIdValid(value) {
  return PATRON_RUC.test(String(value ?? "").trim());
}
function taxIdGenericoValid(value) {
  return PATRON_TAX_ID_GENERICO.test(String(value ?? "").trim());
}
function taxIdValidoParaPais(value, pais = "PY") {
  return String(pais).trim().toUpperCase() === "PY" ? taxIdValid(value) : taxIdGenericoValid(value);
}
function normalizeTaxId(value) {
  if (typeof value !== "string") return null;
  const taxId = value.replace(/[.\s]/g, "").trim();
  return taxId || null;
}
function limpiarTaxId(value, max = 32) {
  return String(value ?? "").replace(/[^\p{L}\p{N}./-]/gu, "").slice(0, max);
}

// src/utils/token.js
var RUTA_CON_TOKEN = /(?:^|\/)([^/?#]+)\/([a-f0-9]{64})(?:[/?#]|$)/i;
function extractTokenFromUrl(raw = "") {
  const texto = (() => {
    try {
      return decodeURIComponent(String(raw));
    } catch {
      return String(raw);
    }
  })();
  const porRuta = texto.match(RUTA_CON_TOKEN);
  if (porRuta) return porRuta[2];
  const match = texto.match(/[a-f0-9]{64}/i);
  return match ? match[0] : "";
}
function esToken(value) {
  return /^[a-f0-9]{64}$/i.test(String(value ?? "").trim());
}

// src/utils/telefono.js
import { parsePhoneNumberFromString } from "libphonenumber-js/min";

// src/utils/paisesTelefono.js
import { getCountries, getCountryCallingCode } from "libphonenumber-js/min";
var PAIS_PREDETERMINADO = "PY";
var PAIS_PRINCIPAL_POR_DDI = Object.freeze({
  "+1": "US",
  "+7": "RU",
  "+44": "GB"
});
var cacheCatalogos = /* @__PURE__ */ new Map();
function isoValido(value) {
  const iso = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(iso) && getCountries().includes(iso) ? iso : "";
}
function banderaDeIso(iso) {
  return [...iso].map((letra) => String.fromCodePoint(127397 + letra.charCodeAt(0))).join("");
}
function nombreDePais(iso, locale) {
  try {
    return new Intl.DisplayNames([locale || "es"], { type: "region" }).of(iso) || iso;
  } catch {
    return iso;
  }
}
function compararPaises(a, b, locale) {
  return a.name.localeCompare(b.name, locale || "es", { sensitivity: "base" });
}
function catalogoParaLocale(locale = "es") {
  const clave = String(locale || "es");
  if (cacheCatalogos.has(clave)) return cacheCatalogos.get(clave);
  const catalogo = getCountries().map((country) => Object.freeze({
    country,
    countryCode: `+${getCountryCallingCode(country)}`,
    name: nombreDePais(country, clave),
    flag: banderaDeIso(country)
  })).sort((a, b) => a.country === PAIS_PREDETERMINADO ? -1 : b.country === PAIS_PREDETERMINADO ? 1 : compararPaises(a, b, clave));
  const congelado = Object.freeze(catalogo);
  cacheCatalogos.set(clave, congelado);
  return congelado;
}
function textoBuscable(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}
function catalogoNormalizado(countries, locale) {
  const catalogo = catalogoParaLocale(locale);
  if (!Array.isArray(countries) || countries.length === 0) return [...catalogo];
  const porIso = new Map(catalogo.map((pais) => [pais.country, pais]));
  const vistos = /* @__PURE__ */ new Set();
  return countries.flatMap((entrada3) => {
    if (typeof entrada3 === "object" && entrada3?.custom === true) {
      const country = String(entrada3.country || "").trim();
      const countryCode = `+${String(entrada3.countryCode || "").replace(/\D/g, "")}`;
      if (!country || countryCode === "+" || vistos.has(country)) return [];
      vistos.add(country);
      return [Object.freeze({
        country,
        countryCode,
        name: String(entrada3.name || `C\xF3digo internacional ${countryCode}`),
        flag: String(entrada3.flag || "\u{1F310}"),
        custom: true
      })];
    }
    const iso = isoValido(typeof entrada3 === "string" ? entrada3 : entrada3?.country);
    if (!iso || vistos.has(iso)) return [];
    vistos.add(iso);
    const base = porIso.get(iso);
    return base ? [base] : [];
  });
}
var PAISES_TELEFONO = catalogoParaLocale("es");
function paisTelefonoPorIso(iso, locale = "es") {
  const country = isoValido(iso);
  return country ? catalogoParaLocale(locale).find((pais) => pais.country === country) || null : null;
}
function paisesDeCodigo(countryCode, locale = "es", countries = PAISES_TELEFONO) {
  const codigo = `+${String(countryCode || "").replace(/\D/g, "")}`;
  const principal = PAIS_PRINCIPAL_POR_DDI[codigo];
  return catalogoNormalizado(countries, locale).filter((pais) => pais.countryCode === codigo).sort((a, b) => {
    if (a.country === principal) return -1;
    if (b.country === principal) return 1;
    return compararPaises(a, b, locale);
  });
}
function buscarPaisesTelefono(consulta = "", countries = PAISES_TELEFONO, locale = "es") {
  const termino = textoBuscable(consulta);
  const digitos = termino.replace(/\D/g, "");
  const catalogo = catalogoNormalizado(countries, locale);
  const resultados = termino ? catalogo.filter((pais) => {
    const texto = textoBuscable(`${pais.name} ${pais.country} ${pais.countryCode}`);
    return texto.includes(termino) || digitos && pais.countryCode.replace(/\D/g, "").includes(digitos);
  }) : catalogo;
  return resultados.sort((a, b) => {
    if (!termino && a.country === PAIS_PREDETERMINADO) return -1;
    if (!termino && b.country === PAIS_PREDETERMINADO) return 1;
    return compararPaises(a, b, locale);
  });
}

// src/utils/telefono.js
var CODIGOS_PAIS = ["+595", "+55", "+54", "+56", "+591", "+598", "+1", "+34", "+44", "+351"];
var CODIGOS_INTERNACIONALES_ORDENADOS = [...new Set(PAISES_TELEFONO.map((pais) => pais.countryCode.replace(/\D/g, "")))].sort((a, b) => b.length - a.length);
function normalizarTelefono(phone, countryCode = "+595") {
  return telefonoVisible(phone, countryCode);
}
function internationalPhone(value, countryCode = "+595") {
  let digits = String(value || "").replace(/\D/g, "");
  const code = String(countryCode || "+595").replace(/\D/g, "") || "595";
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith(code)) return digits;
  if (digits.startsWith("0")) digits = digits.slice(1);
  return `${code}${digits}`;
}
function whatsappUrl(phone, message = "", countryCode = "+595") {
  const numero = internationalPhone(phone, countryCode);
  return numero ? `https://wa.me/${numero}?text=${encodeURIComponent(String(message ?? ""))}` : "";
}
function soloDigitos(value, max = 0) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return max > 0 ? digits.slice(0, max) : digits;
}
function codigoPais(value) {
  const digits = soloDigitos(value, 4);
  return digits ? `+${digits}` : "";
}
function telefonoVisible(phone, countryCode = "+595") {
  const code = String(countryCode || "+595").replace(/\D/g, "") || "595";
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith(code)) digits = digits.slice(code.length);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits) return "";
  const local = digits.length === 9 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : digits;
  return `+${code} ${local}`;
}
function telefonoValido(value, countryCode = "+595") {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return false;
  const code = String(countryCode || "+595").replace(/\D/g, "");
  const local = digits.startsWith(code) ? digits.slice(code.length) : digits.startsWith("0") ? digits.slice(1) : digits;
  if (code === "595") return /^9\d{8}$/.test(local);
  return local.length >= 6 && local.length <= 12;
}
function partirCeroCero(digitos, countryCodePorDefecto) {
  if (!digitos) return null;
  for (const codigo of CODIGOS_INTERNACIONALES_ORDENADOS) {
    if (digitos.startsWith(codigo)) return { countryCode: `+${codigo}`, phone: digitos.slice(codigo.length) };
  }
  const porDefecto = String(countryCodePorDefecto || "").replace(/\D/g, "");
  if (porDefecto && digitos.startsWith(porDefecto)) {
    return { countryCode: `+${porDefecto}`, phone: digitos.slice(porDefecto.length) };
  }
  return { countryCode: `+${digitos.slice(0, 3)}`, phone: digitos.slice(3) };
}
function partirConMas(texto) {
  const digitos = texto.replace(/\D/g, "");
  const codigo = CODIGOS_INTERNACIONALES_ORDENADOS.find((prefijo) => digitos.startsWith(prefijo));
  if (!codigo) return null;
  const indiceCodigo = texto.indexOf(codigo);
  const resto = texto.slice(indiceCodigo + codigo.length).trim();
  return { countryCode: `+${codigo}`, phone: resto };
}
function parseTelefono(value, countryCodePorDefecto = "+595") {
  const texto = String(value || "").trim();
  if (texto.startsWith("+")) {
    const partes = partirConMas(texto);
    if (partes) return partes;
  }
  const conCeroCero = texto.match(/^00[\s.-]*(.*)$/);
  if (conCeroCero) {
    const resto = conCeroCero[1].trim();
    const partes = partirCeroCero(resto.replace(/\D/g, ""), countryCodePorDefecto);
    if (partes) return partes;
  }
  return { countryCode: countryCodePorDefecto, phone: texto };
}
function paisCompatible(country, countryCode) {
  const preferido = paisTelefonoPorIso(country);
  return preferido?.countryCode === countryCode ? preferido.country : "";
}
function estadoInternacionalVacio(country = "PY") {
  const pais = paisTelefonoPorIso(country) || paisTelefonoPorIso("PY");
  return { country: pais.country, countryCode: pais.countryCode, phone: "", e164: "", isValid: false };
}
function parseTelefonoInternacional(value, country = "PY", countryCodePorDefecto = "") {
  const texto = String(value || "").trim();
  if (!texto) return estadoInternacionalVacio(country);
  const internacional = texto.startsWith("+") || /^00/.test(texto);
  const entrada3 = /^00/.test(texto) ? `+${texto.replace(/^00[\s.-]*/, "")}` : texto;
  const paisPreferido = paisTelefonoPorIso(country) || paisTelefonoPorIso("PY");
  const parsed = parsePhoneNumberFromString(entrada3, internacional ? void 0 : paisPreferido.country);
  if (parsed) {
    const countryCode = `+${parsed.countryCallingCode}`;
    const pais = paisCompatible(paisPreferido.country, countryCode) || parsed.country || paisesDeCodigo(countryCode)[0]?.country || paisPreferido.country;
    const phone = parsed.nationalNumber || "";
    const pyValido = pais !== "PY" || /^9\d{8}$/.test(phone);
    const isValid = parsed.isValid() && pyValido;
    return { country: pais, countryCode, phone, e164: isValid ? parsed.number : "", isValid };
  }
  if (internacional) {
    const digitos = entrada3.replace(/\D/g, "");
    const codigo = CODIGOS_INTERNACIONALES_ORDENADOS.find((prefijo) => digitos.startsWith(prefijo));
    if (codigo) {
      const countryCode = `+${codigo}`;
      const pais = paisCompatible(paisPreferido.country, countryCode) || paisesDeCodigo(countryCode)[0]?.country || paisPreferido.country;
      return { country: pais, countryCode, phone: digitos.slice(codigo.length), e164: "", isValid: false };
    }
    const codigoExplicito = codigoPais(countryCodePorDefecto);
    const codigoExplicitoDigitos = codigoExplicito.replace(/\D/g, "");
    const codigoDesconocido = codigoExplicitoDigitos && digitos.startsWith(codigoExplicitoDigitos) ? codigoExplicitoDigitos : digitos.slice(0, Math.min(3, digitos.length));
    if (codigoDesconocido) {
      return {
        country: "",
        countryCode: `+${codigoDesconocido}`,
        phone: digitos.slice(codigoDesconocido.length),
        e164: "",
        isValid: false
      };
    }
  }
  return { ...estadoInternacionalVacio(paisPreferido.country), phone: texto };
}
function telefonoE164(value, country = "PY") {
  return parseTelefonoInternacional(value, country).e164;
}
function telefonoInternacionalValido(value, country = "PY") {
  return parseTelefonoInternacional(value, country).isValid;
}
function componerTelefono({ countryCode = "+595", phone = "" } = {}) {
  const numero = String(phone || "").trim().replace(/\s+/g, " ");
  if (!numero) return null;
  const codigo = String(countryCode || "").replace(/\D/g, "") || "595";
  return `+${codigo} ${numero}`;
}
var MENSAJE_TELEFONO = "Tel\xE9fono inv\xE1lido. Para Paraguay us\xE1 un m\xF3vil de 9 d\xEDgitos, ej: 981 123 456 o +595 971 234567.";

// src/utils/tonos.js
var TONOS = {
  // El texto va por la familia `*-text` (#5): el tono base queda para el
  // relleno/punto/borde y el par de texto sostiene AA sobre el tinte.
  punto: {
    ok: "bg-ok/15 text-ok-text",
    warn: "bg-warn/15 text-warn-text",
    bad: "bg-bad/15 text-bad-text",
    mute: "bg-ink-700 text-mute",
    info: "bg-info/15 text-info-text",
    pass: "bg-pass/15 text-pass-text",
    fono: "bg-fono/15 text-fono-text"
  },
  chip: {
    ok: "border-ok/30 bg-ok/10 text-ok-text",
    warn: "border-warn/30 bg-warn/10 text-warn-text",
    bad: "border-bad/30 bg-bad/10 text-bad-text",
    mute: "border-ink-600 bg-ink-800/40 text-mute",
    info: "border-info/30 bg-info/10 text-info-text",
    pass: "border-pass/30 bg-pass/10 text-pass-text",
    fono: "border-fono/30 bg-fono/10 text-fono-text"
  },
  texto: {
    ok: "text-ok-text",
    warn: "text-warn-text",
    bad: "text-bad-text",
    mute: "text-mute",
    info: "text-info-text",
    pass: "text-pass-text",
    fono: "text-fono-light"
  }
};
var TONOS_ALIAS = {
  neutral: "mute",
  neutro: "mute",
  accent: "info",
  acento: "info",
  danger: "bad",
  error: "bad",
  success: "ok",
  warning: "warn"
};
function tonoCanonico(valor) {
  const clave = String(valor ?? "").trim().toLowerCase();
  if (!clave) return "mute";
  const canonico = TONOS_ALIAS[clave] || clave;
  return TONOS.punto[canonico] ? canonico : "mute";
}
function puntoDeTono(valor) {
  return TONOS.punto[tonoCanonico(valor)];
}
function chipDeTono(valor) {
  return TONOS.chip[tonoCanonico(valor)];
}
function textoDeTono(valor) {
  return TONOS.texto[tonoCanonico(valor)];
}

// src/utils/estadoEquipo.js
var ESTADOS_ITEM = {
  ok: { etiqueta: "Bien", tono: "ok", icono: "check" },
  aviso: { etiqueta: "Con observaci\xF3n", tono: "warn", icono: "alert" },
  falla: { etiqueta: "Falla", tono: "bad", icono: "close" },
  sinVerificar: { etiqueta: "Sin verificar", tono: "mute", icono: "clock" }
};
var estadoItem = (clave) => ESTADOS_ITEM[clave] || ESTADOS_ITEM.sinVerificar;
var REVISION = { etiqueta: "En revisi\xF3n", tono: "info", icono: "refresh" };
var POR_COBRAR = { etiqueta: "Por cobrar", tono: "warn", icono: "clock" };
var ESTADOS_CHIP = {
  // — Dispositivos (#241) —
  pass: { etiqueta: "Certificado", tono: "pass", icono: "check" },
  revision: REVISION,
  enrevision: REVISION,
  pendiente: { etiqueta: "Pendiente", tono: "mute", icono: "clock" },
  falla: { etiqueta: "Con fallas", tono: "bad", icono: "alert" },
  // — Documentos y pipelines —
  borrador: { etiqueta: "Borrador", tono: "mute", icono: "edit" },
  enviado: { etiqueta: "Enviado", tono: "info", icono: "send" },
  aprobado: { etiqueta: "Aprobado", tono: "ok", icono: "check" },
  rechazado: { etiqueta: "Rechazado", tono: "bad", icono: "close" },
  anulado: { etiqueta: "Anulado", tono: "mute", icono: "close" },
  cancelado: { etiqueta: "Cancelado", tono: "bad", icono: "close" },
  // — Cobros y cuentas —
  cobrado: { etiqueta: "Cobrado", tono: "pass", icono: "money" },
  porcobrar: POR_COBRAR,
  pagado: { etiqueta: "Pagado", tono: "pass", icono: "check" },
  vencido: { etiqueta: "Vencido", tono: "bad", icono: "alert" },
  activo: { etiqueta: "Activo", tono: "ok", icono: "check" },
  pausado: { etiqueta: "Pausado", tono: "warn", icono: "clock" }
};
function claveDeEstado(valor) {
  return String(valor ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}
function estadoChip(clave) {
  const normalizada = claveDeEstado(clave);
  if (ESTADOS_CHIP[normalizada]) return ESTADOS_CHIP[normalizada];
  if (normalizada.endsWith("a")) {
    const masculina = `${normalizada.slice(0, -1)}o`;
    if (ESTADOS_CHIP[masculina]) return ESTADOS_CHIP[masculina];
  }
  return ESTADOS_CHIP.pendiente;
}
var LOCKS_DISPOSITIVO = {
  icloud: "iCloud / Find My",
  mdm: "MDM",
  esn: "ESN / lista negra",
  carrier: "Carrier / SIM lock",
  oem: "Repuesto no OEM"
};
var ESTADOS_LOCK = {
  libre: { etiqueta: "Libre", tono: "ok", icono: "unlock" },
  activo: { etiqueta: "Activo", tono: "bad", icono: "lock" },
  desconocido: { etiqueta: "Sin dato", tono: "mute", icono: "clock" }
};
var estadoLock = (clave) => ESTADOS_LOCK[clave] || ESTADOS_LOCK.desconocido;
var UMBRAL_BATERIA_OK = 90;
var UMBRAL_BATERIA_ATENCION = 80;
function tonoBateria(porcentaje) {
  if (porcentaje === null || porcentaje === void 0 || porcentaje === "") return "mute";
  const valor = Number(porcentaje);
  if (!Number.isFinite(valor)) return "mute";
  if (valor >= UMBRAL_BATERIA_OK) return "ok";
  if (valor >= UMBRAL_BATERIA_ATENCION) return "warn";
  return "bad";
}
var GRADOS_CONDICION = {
  A: { etiqueta: "Grado A", tono: "ok", descripcion: "Como nuevo, sin marcas visibles" },
  B: { etiqueta: "Grado B", tono: "warn", descripcion: "Marcas leves de uso" },
  C: { etiqueta: "Grado C", tono: "bad", descripcion: "Marcas o detalles visibles" }
};
var gradoCondicion = (clave) => GRADOS_CONDICION[String(clave || "").trim().toUpperCase()] || null;
var COLOR_BADGE = { ok: "green", warn: "orange", bad: "red", mute: "slate", info: "blue", pass: "green" };
var colorBadge = (tono) => COLOR_BADGE[tono] || "slate";
var CONDICION_UNIDAD = { NEW: "Nuevo", USED: "Seminuevo", REFURBISHED: "Reacondicionado" };
var etiquetaCondicion = (clave) => {
  const texto = String(clave ?? "").trim();
  return CONDICION_UNIDAD[texto.toUpperCase()] || texto || "\u2014";
};

// src/utils/categorias.js
var CATEGORIAS_PRODUCTO = [
  { clave: "iphone", etiqueta: "iPhone", icono: "mobile", alias: ["iphone", "mobile", "celular", "telefono", "smartphone"] },
  { clave: "macbook", etiqueta: "MacBook", icono: "laptop", alias: ["macbook", "mac", "laptop", "notebook", "computadora"] },
  { clave: "ipad", etiqueta: "iPad", icono: "tablet", alias: ["ipad", "tablet", "tableta"] },
  { clave: "watch", etiqueta: "Watch", icono: "watch", alias: ["watch", "reloj", "apple watch"] },
  { clave: "airpods", etiqueta: "AirPods", icono: "buds", alias: ["airpods", "auriculares", "audifonos", "buds", "earbuds"] },
  { clave: "accesorios", etiqueta: "Accesorios", icono: "cable", alias: ["accesorios", "cable", "cables", "cargador", "cargadores", "funda", "fundas", "vidrio", "lamina", "templado", "adaptador"] },
  { clave: "servicio", etiqueta: "Servicio", icono: "wrench", alias: ["servicio", "servicios", "reparacion"] },
  { clave: "otro", etiqueta: "Otro", icono: "box", alias: [] }
];
var ICONO_CATEGORIA = Object.fromEntries(CATEGORIAS_PRODUCTO.map(({ clave, icono }) => [clave, icono]));
var PALABRAS_ACCESORIO = ["funda", "cable", "cargador", "vidrio", "lamina", "templado", "adaptador", "protector", "soporte", "auriculares genericos"];
var sinAcentos = (texto) => String(texto ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
function normalizarCategoria(texto) {
  const limpio = sinAcentos(texto);
  const buscar = (clave) => CATEGORIAS_PRODUCTO.find((categoria) => categoria.clave === clave);
  if (!limpio) return buscar("otro");
  if (PALABRAS_ACCESORIO.some((palabra) => limpio.includes(palabra))) return buscar("accesorios");
  const exacta = CATEGORIAS_PRODUCTO.find((categoria) => categoria.alias.includes(limpio));
  if (exacta) return exacta;
  const contiene = CATEGORIAS_PRODUCTO.find((categoria) => categoria.alias.some((alias) => alias.length > 3 && limpio.includes(alias)));
  return contiene || buscar("otro");
}
var categoriaDe = (texto) => normalizarCategoria(texto).clave;
var iconoDeCategoria = (texto) => normalizarCategoria(texto).icono;
var etiquetaDeCategoria = (texto) => normalizarCategoria(texto).etiqueta;

// src/utils/avatar.js
var COLORES_AVATAR = {
  fono: "bg-fono/15 text-fono-text",
  ok: "bg-ok/15 text-ok-text",
  info: "bg-info/15 text-info-text",
  warn: "bg-warn/15 text-warn-text",
  bad: "bg-bad/15 text-bad-text",
  pass: "bg-pass/15 text-pass-text",
  reserved: "bg-reserved/15 text-reserved",
  mute: "bg-ink-600 text-mute"
};
var CLAVES_COLOR = Object.keys(COLORES_AVATAR);
var TIPO_SOCIETARIO2 = /^(sa|srl|saci|sae|sas|ltda|eas|cia|s|a)$/i;
var primeraLetra = (palabra) => [...String(palabra || "")][0] ?? "";
function inicialesDeNombre(nombre) {
  const palabras = String(nombre ?? "").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (!palabras.length) return "\u2014";
  const significativas = palabras.filter((palabra) => !TIPO_SOCIETARIO2.test(palabra));
  if (!significativas.length) return (primeraLetra(palabras[0]) + primeraLetra(palabras[1])).toUpperCase();
  if (significativas.length > 1) {
    return (primeraLetra(significativas[0]) + primeraLetra(significativas[significativas.length - 1])).toUpperCase();
  }
  const societario = palabras.find((palabra) => TIPO_SOCIETARIO2.test(palabra));
  return (primeraLetra(significativas[0]) + (societario ? primeraLetra(societario) : "")).toUpperCase();
}
function claveColorDeNombre(nombre) {
  const texto = String(nombre ?? "").trim().toLowerCase();
  let hash = 0;
  for (let indice = 0; indice < texto.length; indice += 1) {
    hash = (hash * 31 + texto.charCodeAt(indice)) % 1e5;
  }
  return CLAVES_COLOR[hash % CLAVES_COLOR.length];
}
function colorDeNombre(nombre) {
  return COLORES_AVATAR[claveColorDeNombre(nombre)] || COLORES_AVATAR.mute;
}

// src/utils/identidad.js
var primerTexto = (...valores) => {
  for (const valor of valores) {
    if (typeof valor === "string" && valor.trim()) return valor.trim();
  }
  return "";
};
function identidadDeUsuario(fuente = {}) {
  const objeto = fuente && typeof fuente === "object" ? fuente : {};
  const nombre = primerTexto(objeto.nombre, objeto.name, objeto.displayName, objeto.fullName) || primerTexto(objeto.email) || "Sistema";
  return {
    nombre,
    primerNombre: primerNombre(nombre) || "Sistema",
    // Foto local (subida): la app la resuelve por id y la pasa acá.
    fotoLocal: primerTexto(objeto.foto, objeto.avatarUrl, objeto.photoURL, objeto.fotoUrl),
    // Foto de la identidad (Google).
    picture: primerTexto(objeto.picture),
    hasAvatar: objeto.hasAvatar ?? objeto.tieneFoto ?? void 0,
    scope: primerTexto(objeto.scope)
  };
}
var ESTADOS_PRESENCIA = {
  "en-linea": { etiqueta: "En l\xEDnea", punto: "bg-ok" },
  ausente: { etiqueta: "Ausente", punto: "bg-warn" },
  ocupado: { etiqueta: "Ocupado", punto: "bg-bad" },
  offline: { etiqueta: "Sin conexi\xF3n", punto: "bg-mute" }
};
function resumenPresencia(personas = []) {
  const lista = Array.isArray(personas) ? personas : [];
  if (!lista.length) return "";
  if (lista.length === 1) {
    const { primerNombre: nombre } = identidadDeUsuario(lista[0]);
    return `${nombre} en l\xEDnea`;
  }
  return `${lista.length} en l\xEDnea`;
}

// src/utils/calendario.js
var ES_PY2 = "es-PY";
var UTC = "UTC";
var CLAVE = /^\d{4}-\d{2}-\d{2}$/;
var FORMATO_SEMANA = new Intl.DateTimeFormat(ES_PY2, { timeZone: UTC, weekday: "short" });
var FORMATO_MES = new Intl.DateTimeFormat(ES_PY2, { timeZone: UTC, month: "long", year: "numeric" });
var FORMATO_DIA = new Intl.DateTimeFormat(ES_PY2, { timeZone: UTC, weekday: "long", day: "numeric", month: "long" });
var FORMATO_DIA_NUMERO = new Intl.DateTimeFormat(ES_PY2, { timeZone: UTC, day: "2-digit" });
var FORMATO_MES_CORTO = new Intl.DateTimeFormat(ES_PY2, { timeZone: UTC, month: "short" });
var capitalizar = (texto) => texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
function esClaveDia(valor) {
  if (typeof valor !== "string" || !CLAVE.test(valor)) return false;
  const [anio, mes, dia] = valor.split("-").map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
}
function claveDia(valor) {
  if (typeof valor === "string" && esClaveDia(valor)) return valor;
  const fecha = valor instanceof Date ? valor : valor ? new Date(valor) : null;
  if (!fecha || Number.isNaN(fecha.getTime())) return "";
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}
function fechaDeClave(clave) {
  if (!esClaveDia(clave)) return null;
  const [anio, mes, dia] = clave.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia));
}
function hoyClave(hoy = /* @__PURE__ */ new Date()) {
  return claveDia(hoy);
}
function sumarDias(clave, dias) {
  const fecha = fechaDeClave(clave);
  if (!fecha) return "";
  return claveUTC(fechaConDias(fecha, Number(dias) || 0));
}
function sumarMeses(clave, meses) {
  const fecha = fechaDeClave(clave);
  if (!fecha) return "";
  const anio = fecha.getUTCFullYear();
  const mes = fecha.getUTCMonth() + (Number(meses) || 0);
  const ultimo = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  return claveUTC(new Date(Date.UTC(anio, mes, Math.min(fecha.getUTCDate(), ultimo))));
}
function indiceSemana(clave) {
  const fecha = fechaDeClave(clave);
  return fecha ? (fecha.getUTCDay() + 6) % 7 : 0;
}
function rangoSemana(clave) {
  const inicio = sumarDias(clave, -indiceSemana(clave));
  const dias = Array.from({ length: 7 }, (_, indice) => sumarDias(inicio, indice));
  return { desde: dias[0], hasta: dias[6], dias };
}
function rangoMes(clave) {
  const fecha = fechaDeClave(clave);
  if (!fecha) return { desde: "", hasta: "", dias: [] };
  const anio = fecha.getUTCFullYear();
  const mes = fecha.getUTCMonth();
  const primero = new Date(Date.UTC(anio, mes, 1));
  const ultimo = new Date(Date.UTC(anio, mes + 1, 0));
  const inicio = fechaConDias(primero, -indiceSemana(claveUTC(primero)));
  const fin = fechaConDias(ultimo, 6 - indiceSemana(claveUTC(ultimo)));
  const dias = [];
  for (let cursor = inicio.getTime(); cursor <= fin.getTime(); cursor += 864e5) {
    dias.push(claveUTC(new Date(cursor)));
  }
  return { desde: dias[0], hasta: dias[dias.length - 1], dias };
}
function mismoMes(clave, referencia) {
  return Boolean(clave) && Boolean(referencia) && clave.slice(0, 7) === referencia.slice(0, 7);
}
function etiquetaMes(clave) {
  const fecha = fechaDeClave(clave);
  return fecha ? capitalizar(FORMATO_MES.format(fecha)) : "\u2014";
}
function etiquetaDia(clave) {
  const fecha = fechaDeClave(clave);
  return fecha ? capitalizar(FORMATO_DIA.format(fecha)) : "\u2014";
}
function etiquetaDiaCorta(clave) {
  const fecha = fechaDeClave(clave);
  return fecha ? `${FORMATO_DIA_NUMERO.format(fecha)} ${FORMATO_MES_CORTO.format(fecha).replace(/\.$/, "")}` : "\u2014";
}
var DIAS_SEMANA = Array.from(
  { length: 7 },
  (_, indice) => capitalizar(FORMATO_SEMANA.format(new Date(Date.UTC(2024, 0, 1 + indice))).replace(/\.$/, ""))
);
function agruparPorDia(items = [], claveDe = (item) => item?.fecha) {
  const mapa = /* @__PURE__ */ new Map();
  for (const item of items) {
    const clave = claveDia(claveDe(item));
    if (!clave) continue;
    const lista = mapa.get(clave);
    if (lista) lista.push(item);
    else mapa.set(clave, [item]);
  }
  return mapa;
}
function fechaConDias(fecha, dias) {
  return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate() + dias));
}
function claveUTC(fecha) {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, "0")}-${String(fecha.getUTCDate()).padStart(2, "0")}`;
}

// src/utils/rangoFecha.js
var PERIODOS_FECHA = ["hoy", "esta-semana", "este-mes", "mes-pasado", "ultimos-30", "personalizado"];
var ETIQUETA_PERIODO = {
  hoy: "Hoy",
  "esta-semana": "Esta semana",
  "este-mes": "Este mes",
  "mes-pasado": "Mes pasado",
  "ultimos-30": "\xDAltimos 30 d\xEDas",
  personalizado: "Personalizado"
};
function esAtajo(periodo) {
  return PERIODOS_FECHA.includes(periodo) && periodo !== "personalizado";
}
function rangoDePeriodo(periodo, { hoy } = {}) {
  const clave = hoyClave(hoy);
  if (!clave) return null;
  switch (periodo) {
    case "hoy":
      return { desde: clave, hasta: clave };
    case "esta-semana": {
      const semana = rangoSemana(clave);
      return { desde: semana.desde, hasta: semana.hasta };
    }
    case "este-mes":
      return { desde: `${clave.slice(0, 7)}-01`, hasta: clave };
    case "mes-pasado": {
      const primeroDeEste = `${clave.slice(0, 7)}-01`;
      const ultimoDelAnterior = sumarDias(primeroDeEste, -1);
      return { desde: `${ultimoDelAnterior.slice(0, 7)}-01`, hasta: ultimoDelAnterior };
    }
    case "ultimos-30":
      return { desde: sumarDias(clave, -29), hasta: clave };
    default:
      return null;
  }
}
function periodoDeRango(desde, hasta, { hoy } = {}) {
  if (!desde || !hasta) return "personalizado";
  for (const periodo of PERIODOS_FECHA) {
    const rango = esAtajo(periodo) ? rangoDePeriodo(periodo, { hoy }) : null;
    if (rango && rango.desde === desde && rango.hasta === hasta) return periodo;
  }
  return "personalizado";
}
function rangoInvertido(desde, hasta) {
  return Boolean(desde) && Boolean(hasta) && desde > hasta;
}

// src/utils/abastecimiento.js
var normalizarClave = (clave) => String(clave ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
var PRIORIDADES_COMPRA = {
  urgente: { etiqueta: "Urgente", tono: "bad", orden: 0 },
  alta: { etiqueta: "Alta", tono: "warn", orden: 1 },
  normal: { etiqueta: "Normal", tono: "info", orden: 2 },
  baja: { etiqueta: "Baja", tono: "mute", orden: 3 }
};
var ALIAS_PRIORIDAD = { media: "normal", media_alta: "alta", media_baja: "baja" };
function claveDePrioridad(clave) {
  const k = normalizarClave(clave);
  return ALIAS_PRIORIDAD[k] || (PRIORIDADES_COMPRA[k] ? k : "normal");
}
var prioridadDe = (clave) => PRIORIDADES_COMPRA[claveDePrioridad(clave)];
var etiquetaPrioridad = (clave) => prioridadDe(clave).etiqueta;
var tonoPrioridad = (clave) => prioridadDe(clave).tono;
var ordenDePrioridad = (clave) => prioridadDe(clave).orden;
function ordenarPorPrioridad(lista = [], clave = "prioridad") {
  return [...Array.isArray(lista) ? lista : []].sort(
    (a, b) => ordenDePrioridad(a?.[clave]) - ordenDePrioridad(b?.[clave])
  );
}
var ORIGENES_NECESIDAD = {
  sale_no_stock: { etiqueta: "Venta sin stock", tono: "warn", icono: "cart" },
  reservation_no_stock: { etiqueta: "Reserva sin unidad", tono: "info", icono: "clock" },
  quantity_over_stock: { etiqueta: "Venta sobre stock", tono: "info", icono: "trending" },
  below_reorder: { etiqueta: "Bajo reposici\xF3n", tono: "warn", icono: "inventory" },
  order_committed: { etiqueta: "Pedido comprometido", tono: "info", icono: "receipt" },
  manual: { etiqueta: "Manual", tono: "mute", icono: "edit" }
};
function origenDe(clave) {
  const k = normalizarClave(clave);
  if (ORIGENES_NECESIDAD[k]) return ORIGENES_NECESIDAD[k];
  const texto = String(clave ?? "").trim();
  return { etiqueta: texto || "Sin origen", tono: "mute", icono: "tag" };
}
var etiquetaOrigen = (clave) => origenDe(clave).etiqueta;
var tonoOrigen = (clave) => origenDe(clave).tono;
var iconoOrigen = (clave) => origenDe(clave).icono;
var ESTADOS_NECESIDAD = {
  abierta: { etiqueta: "Por comprar", tono: "warn", icono: "cart" },
  asignada: { etiqueta: "Asignada", tono: "info", icono: "user" },
  comprada: { etiqueta: "Comprada", tono: "ok", icono: "check" },
  preparar_envio: { etiqueta: "Preparar env\xEDo", tono: "info", icono: "package" },
  en_transito: { etiqueta: "En tr\xE1nsito", tono: "info", icono: "truck" },
  recepcion: { etiqueta: "En recepci\xF3n", tono: "warn", icono: "box" },
  recibida: { etiqueta: "Recibida", tono: "ok", icono: "box" },
  incidencia: { etiqueta: "Con incidencia", tono: "bad", icono: "alert" },
  cancelada: { etiqueta: "Cancelada", tono: "mute", icono: "close" }
};
var ALIAS_ESTADO = {
  por_comprar: "abierta",
  comprando: "asignada",
  asignado: "asignada",
  comprado: "comprada",
  recibido: "recibida"
};
function claveDeEstado2(clave) {
  const k = normalizarClave(clave);
  return ALIAS_ESTADO[k] || (ESTADOS_NECESIDAD[k] ? k : "abierta");
}
var estadoNecesidad = (clave) => ESTADOS_NECESIDAD[claveDeEstado2(clave)];
var etiquetaNecesidad = (clave) => estadoNecesidad(clave).etiqueta;
var tonoNecesidad = (clave) => estadoNecesidad(clave).tono;
var PASOS_NECESIDAD = ["abierta", "asignada", "comprada", "preparar_envio", "en_transito", "recepcion", "recibida"];
function conClaves(mapa, defecto) {
  const porClave = new Map(Object.keys(mapa).map((clave) => [normalizarClave(clave), clave]));
  const canonica = (valor) => porClave.get(normalizarClave(valor)) || defecto;
  return { canonica, de: (valor) => mapa[canonica(valor)] };
}
var ESTADOS_COMPRA = {
  comprada: { etiqueta: "Comprada", tono: "info", icono: "check" },
  preparando: { etiqueta: "Preparando", tono: "info", icono: "package" },
  en_transito: { etiqueta: "En tr\xE1nsito", tono: "info", icono: "truck" },
  recibida: { etiqueta: "Recibida", tono: "ok", icono: "box" },
  cancelada: { etiqueta: "Cancelada", tono: "mute", icono: "close" }
};
var COMPRA = conClaves(ESTADOS_COMPRA, "comprada");
var claveDeEstadoCompra = COMPRA.canonica;
var estadoCompra = COMPRA.de;
var etiquetaCompra = (clave) => estadoCompra(clave).etiqueta;
var tonoCompra = (clave) => estadoCompra(clave).tono;
var ESTADOS_ENVIO = {
  borrador: { etiqueta: "Borrador", tono: "mute", icono: "edit" },
  preparando: { etiqueta: "Preparando", tono: "info", icono: "package" },
  despachado: { etiqueta: "Despachado", tono: "info", icono: "truck" },
  en_transito: { etiqueta: "En tr\xE1nsito", tono: "info", icono: "truck" },
  recepcion_parcial: { etiqueta: "Recepci\xF3n parcial", tono: "warn", icono: "box" },
  recibido: { etiqueta: "Recibido", tono: "ok", icono: "check" },
  con_incidencia: { etiqueta: "Con incidencia", tono: "bad", icono: "alert" },
  cancelado: { etiqueta: "Cancelado", tono: "mute", icono: "close" }
};
var ENVIO = conClaves(ESTADOS_ENVIO, "borrador");
var claveDeEstadoEnvio = ENVIO.canonica;
var estadoEnvio = ENVIO.de;
var etiquetaEnvio = (clave) => estadoEnvio(clave).etiqueta;
var tonoEnvio = (clave) => estadoEnvio(clave).tono;
var PASOS_ENVIO = ["borrador", "preparando", "despachado", "en_transito", "recibido"];
var METODOS_ENVIO = {
  bus: { etiqueta: "Bus", icono: "truck" },
  transportadora: { etiqueta: "Transportadora", icono: "truck" },
  aex: { etiqueta: "AEX", icono: "send" },
  importacion: { etiqueta: "Importaci\xF3n", icono: "globe" }
};
var METODO = conClaves(METODOS_ENVIO, "bus");
var claveDeMetodoEnvio = METODO.canonica;
var metodoEnvio = METODO.de;
var etiquetaMetodoEnvio = (clave) => metodoEnvio(clave).etiqueta;
var iconoMetodoEnvio = (clave) => metodoEnvio(clave).icono;
var ESTADOS_RECEPCION = {
  borrador: { etiqueta: "Borrador", tono: "mute", icono: "edit" },
  confirmada: { etiqueta: "Confirmada", tono: "ok", icono: "check" },
  cancelada: { etiqueta: "Cancelada", tono: "mute", icono: "close" }
};
var RECEPCION = conClaves(ESTADOS_RECEPCION, "borrador");
var claveDeEstadoRecepcion = RECEPCION.canonica;
var estadoRecepcion = RECEPCION.de;
var etiquetaRecepcion = (clave) => estadoRecepcion(clave).etiqueta;
var tonoRecepcion = (clave) => estadoRecepcion(clave).tono;
var COLOR_DE_TONO = { ok: "green", bad: "red", warn: "orange", info: "blue", mute: "slate" };
var colorDeTono = (tono) => COLOR_DE_TONO[tono] || "slate";

// src/utils/revision.js
var ESTADOS_REVISION = {
  ok: { etiqueta: "OK", etiquetaPlural: "OK", tono: "ok" },
  // Resultado del contrato de recepción (F5): `RECIBIDO` entra como estado ok.
  recibido: { etiqueta: "Recibido", etiquetaPlural: "Recibidos", tono: "ok" },
  pendiente: { etiqueta: "Pendiente", etiquetaPlural: "Pendientes", tono: "mute" },
  faltante: { etiqueta: "Falta", etiquetaPlural: "Faltan", tono: "bad" },
  sobrante: { etiqueta: "Sobra", etiquetaPlural: "Sobran", tono: "warn" },
  danado: { etiqueta: "Da\xF1ada", etiquetaPlural: "Da\xF1adas", tono: "bad" },
  incorrecto: { etiqueta: "Incorrecta", etiquetaPlural: "Incorrectas", tono: "warn" },
  sinImei: { etiqueta: "Sin IMEI", etiquetaPlural: "Sin IMEI", tono: "mute" },
  sinDocumentacion: { etiqueta: "Sin documentaci\xF3n", etiquetaPlural: "Sin documentaci\xF3n", tono: "warn" }
};
var INCIDENCIAS = ["faltante", "sobrante", "danado", "incorrecto", "sinImei", "sinDocumentacion"];
var normalizar = (valor) => String(valor ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
var POR_CLAVE = new Map(Object.keys(ESTADOS_REVISION).map((clave) => [normalizar(clave), clave]));
var claveRevision = (estado) => POR_CLAVE.get(normalizar(estado)) || String(estado ?? "");
var esIncidencia = (estado) => INCIDENCIAS.includes(claveRevision(estado));
var etiquetaRevision = (estado) => ESTADOS_REVISION[claveRevision(estado)]?.etiqueta || String(estado || "");
var etiquetaPluralRevision = (estado) => ESTADOS_REVISION[claveRevision(estado)]?.etiquetaPlural || String(estado || "");
var tonoRevision = (estado) => ESTADOS_REVISION[claveRevision(estado)]?.tono || "mute";

// src/printing/estadoImpresoras.js
var ESTADO_IMPRESORA = Object.freeze({
  SIN_VERIFICAR: "sin-verificar",
  VERIFICANDO: "verificando",
  OK: "ok",
  ERROR: "error"
});
var ETIQUETA_ESTADO = Object.freeze({
  "sin-verificar": "Sin verificar",
  "verificando": "Verificando\u2026",
  "ok": "Lista para imprimir",
  "error": "Sin respuesta"
});
var TONO_ESTADO = Object.freeze({
  "sin-verificar": "slate",
  "verificando": "slate",
  "ok": "ok",
  "error": "bad"
});
var MOTIVO_TEXTO = Object.freeze({
  red_cambiada: "La impresora no est\xE1 en esta red",
  permisos_red_local: "El sistema bloque\xF3 la salida a la red local",
  permiso_o_red: "Puede faltar el permiso de Red Local",
  impresora_apagada: "La impresora rechaz\xF3 la conexi\xF3n"
});
var ETIQUETA_TRABAJO = Object.freeze({
  pendiente: "Pendiente",
  reclamado: "En el puente",
  aceptado: "Aceptado (falta confirmar)",
  incierto: "Incierto",
  fallido: "Fallido",
  confirmado: "Confirmado en papel",
  cancelado: "Cancelado",
  impreso: "Impreso"
});
var TONO_TRABAJO = Object.freeze({
  pendiente: "orange",
  reclamado: "blue",
  aceptado: "blue",
  incierto: "orange",
  fallido: "red",
  confirmado: "green",
  cancelado: "slate",
  impreso: "green"
});
var etiquetaTrabajo = (estado) => ETIQUETA_TRABAJO[String(estado || "").toLowerCase()] || String(estado || "\u2014");
var colorTrabajo = (estado) => TONO_TRABAJO[String(estado || "").toLowerCase()] || "slate";
function conexionDeDestino(destino) {
  return /^(usb|cups):/.test(String(destino || "")) ? "cups" : "lan";
}
function destinoDeConexion({ conexion = "lan", ip = "", puerto = "", cola = "" } = {}) {
  if (conexion === "cups" || conexion === "usb") {
    const nombre = String(cola || "").trim();
    return nombre ? `cups:${nombre}` : "";
  }
  const host = String(ip || "").trim();
  if (!host) return "";
  return `lan:${host}:${String(puerto || "").trim() || "9100"}`;
}
function estadoDeDiagnostico(resultado) {
  if (!resultado || typeof resultado !== "object" || resultado.ok === false) return ESTADO_IMPRESORA.ERROR;
  if (resultado.alcance === true) return ESTADO_IMPRESORA.OK;
  if (resultado.metodo === "CUPS") return resultado.cupsUri ? ESTADO_IMPRESORA.OK : ESTADO_IMPRESORA.ERROR;
  return ESTADO_IMPRESORA.ERROR;
}
function motivoDeDiagnostico(resultado) {
  if (!resultado || typeof resultado !== "object") return "El agente no respondi\xF3";
  if (resultado.metodo === "CUPS" && !resultado.cupsUri) return "La cola local no existe en esta computadora";
  return MOTIVO_TEXTO[resultado.motivo] || String(resultado.error || "Sin respuesta de la impresora");
}
function textoVerificacion(registro, ahora = Date.now()) {
  if (!registro || registro.estado === ESTADO_IMPRESORA.SIN_VERIFICAR) return "Sin verificar";
  if (registro.estado === ESTADO_IMPRESORA.VERIFICANDO) return "Verificando\u2026";
  const segundos = Number.isFinite(registro.fecha) ? Math.max(0, Math.round((ahora - registro.fecha) / 1e3)) : 0;
  if (registro.estado === ESTADO_IMPRESORA.OK) return `Verificada hace ${segundos} s`;
  return registro.motivo ? `Sin respuesta: ${registro.motivo}` : "Sin respuesta";
}
function agregarEstado(impresoras = [], estados = {}) {
  const activas = (impresoras || []).filter((impresora) => impresora?.activa !== false);
  const total = activas.length;
  let ok = 0;
  let error = 0;
  for (const impresora of activas) {
    const estado = estados?.[impresora?.id]?.estado;
    if (estado === ESTADO_IMPRESORA.OK) ok += 1;
    else if (estado === ESTADO_IMPRESORA.ERROR) error += 1;
  }
  const sinVerificar = total - ok - error;
  if (!total) return { estado: "sin-verificar", label: "Sin verificar", tono: "slate", total, ok, error, sinVerificar, detalle: "Sin impresoras activas" };
  if (error > 0) return { estado: "con-problemas", label: "Con problemas", tono: "bad", total, ok, error, sinVerificar, detalle: `${error} de ${total} sin respuesta` };
  if (ok === total) return { estado: "listo", label: "Listo para imprimir", tono: "ok", total, ok, error, sinVerificar, detalle: `${total} de ${total} listas` };
  return { estado: "sin-verificar", label: "Sin verificar", tono: "slate", total, ok, error, sinVerificar, detalle: `${sinVerificar} de ${total} sin verificar` };
}

// src/printing/escpos.js
var CP850 = {
  "\xE1": 160,
  "\xE9": 130,
  "\xED": 161,
  "\xF3": 162,
  "\xFA": 163,
  "\xFC": 129,
  "\xF1": 164,
  "\xD1": 165,
  "\xC1": 181,
  "\xC9": 144,
  "\xCD": 214,
  "\xD3": 224,
  "\xDA": 233,
  "\xDC": 154,
  "\xBF": 168,
  "\xA1": 173,
  "\xB0": 248,
  "\xB7": 250,
  "\xAC": 172,
  "\xBC": 172,
  "\xBD": 171
};
var SUSTITUCIONES = { "\u2192": "->", "\u2190": "<-", "\u2026": "...", "\u2013": "-", "\u2014": "-", "\u2019": "'", "\u2018": "'", "\u201C": '"', "\u201D": '"', "\xD7": "x", "\u2022": "-", "\u2713": "v", "\xA0": " ", "\u202F": " " };
var normalizarParaImpresora = (texto) => String(texto ?? "").replace(/[→←…–—’‘“”×•✓\u00a0\u202f]/g, (caracter) => SUSTITUCIONES[caracter] ?? caracter);
var ESC = 27;
var GS = 29;
var CORTES = {
  "completo": [GS, 86, 0],
  "parcial": [GS, 86, 1],
  "avanza-completo": [GS, 86, 65, 0],
  "avanza-parcial": [GS, 86, 66, 0]
};
var VARIANTES_CORTE = Object.keys(CORTES);
var bytesDeTexto = (texto) => {
  const salida = [];
  for (const caracter of normalizarParaImpresora(texto)) {
    const codigo = CP850[caracter];
    if (codigo !== void 0) {
      salida.push(codigo);
      continue;
    }
    const punto = caracter.codePointAt(0);
    salida.push(punto > 255 ? 63 : punto);
  }
  return salida;
};
var columnasDeAncho = (ancho = 58) => Number(ancho) >= 80 ? 48 : 32;
function envolver(texto, columnas) {
  const lineas = [];
  for (const parrafo of String(texto ?? "").split("\n")) {
    let actual = "";
    for (const palabra of parrafo.split(/\s+/).filter(Boolean)) {
      let resto = palabra;
      while (resto.length > columnas) {
        if (actual) {
          lineas.push(actual);
          actual = "";
        }
        lineas.push(resto.slice(0, columnas));
        resto = resto.slice(columnas);
      }
      if (!actual) actual = resto;
      else if (actual.length + 1 + resto.length <= columnas) actual += ` ${resto}`;
      else {
        lineas.push(actual);
        actual = resto;
      }
    }
    lineas.push(actual);
  }
  return lineas;
}
function repartirLinea(izquierda, derecha, columnas) {
  const izq = String(izquierda ?? "");
  const der = String(derecha ?? "");
  if (izq.length + der.length + 1 > columnas) {
    const recorte = Math.max(0, columnas - der.length - 1);
    return `${izq.slice(0, recorte)} ${der}`.trimEnd();
  }
  return `${izq}${" ".repeat(columnas - izq.length - der.length)}${der}`;
}
function crearTicket({ ancho = 80, margen = 2 } = {}) {
  const columnasBase = columnasDeAncho(ancho);
  const sangria = Math.max(0, Math.min(6, Number(margen) || 0));
  const columnas = columnasBase - sangria * 2;
  const prefijo = " ".repeat(sangria);
  const partes = [];
  const espejo = [];
  let doble = false;
  let conCorte = false;
  const anchoActual = () => doble ? Math.floor(columnas / 2) : columnas;
  const escribir = (texto) => {
    const linea = `${prefijo}${texto}`;
    espejo.push(linea);
    partes.push(...bytesDeTexto(linea));
  };
  const centrar = (texto) => {
    const recorte = String(texto).slice(0, anchoActual());
    const aire = Math.max(0, Math.floor((anchoActual() - recorte.length) / 2));
    return `${" ".repeat(aire)}${recorte}`;
  };
  const espejoCentrado = (texto) => espejo.push(`${prefijo}${centrar(texto)}
`);
  const api = {
    columnas,
    iniciar() {
      partes.push(ESC, 64);
      partes.push(ESC, 116, 2);
      partes.push(ESC, 97, 0);
      return api;
    },
    texto(texto = "") {
      for (const linea of envolver(texto, anchoActual())) {
        escribir(`${linea}
`);
      }
      return api;
    },
    linea(caracter = "-") {
      escribir(`${String(caracter).repeat(anchoActual())}
`);
      return api;
    },
    par(izquierda, derecha = "") {
      escribir(`${repartirLinea(izquierda, derecha, anchoActual())}
`);
      return api;
    },
    centrado(texto = "") {
      const anchoVisual = doble ? columnas : anchoActual();
      for (const linea of envolver(texto, anchoActual())) {
        const largo = doble ? linea.length * 2 : linea.length;
        const margen2 = Math.max(0, Math.floor((anchoVisual - largo) / 2));
        escribir(`${" ".repeat(margen2)}${linea}
`);
      }
      return api;
    },
    negrita(activo = true) {
      partes.push(ESC, 69, activo ? 1 : 0);
      return api;
    },
    doble(activo = true) {
      doble = Boolean(activo);
      partes.push(GS, 33, activo ? 17 : 0);
      return api;
    },
    // QR nativo de la impresora (modelo 2). `tamano` va de 1 a 16; `etiqueta`
    // imprime un rótulo centrado arriba del código.
    qr(datos, { tamano = 6, etiqueta = "" } = {}) {
      if (etiqueta) escribir(`${centrar(etiqueta)}
`);
      espejoCentrado(`[QR] ${String(datos).slice(0, 48)}`);
      partes.push(ESC, 97, 1);
      const contenido = bytesDeTexto(datos);
      const parameterLength = contenido.length + 3;
      const parameterLengthLow = parameterLength % 256;
      const parameterLengthHigh = Math.floor(parameterLength / 256);
      const modulo = Math.min(16, Math.max(1, Number(tamano) || 6));
      partes.push(GS, 40, 107, 4, 0, 49, 65, 50, 0);
      partes.push(GS, 40, 107, 3, 0, 49, 67, modulo);
      partes.push(GS, 40, 107, 3, 0, 49, 69, 49);
      partes.push(GS, 40, 107, parameterLengthLow, parameterLengthHigh, 49, 80, 48, ...contenido);
      partes.push(GS, 40, 107, 3, 0, 49, 81, 48);
      partes.push(ESC, 97, 0);
      return api;
    },
    // Código de barras. CODE128 (GS k 73: incluye el largo) con el juego de
    // códigos B declarado como {B, o EAN-13 nativo (GS k 67: 12 dígitos, la
    // impresora calcula el verificador). `datos` ya viene normalizado por quien
    // llama (ver codigos.js): módulo 2 = barras legibles por lectores de local.
    barcode(datos, { etiqueta = "", formato = "code128" } = {}) {
      if (etiqueta) escribir(`${centrar(etiqueta)}
`);
      espejoCentrado(`[BARRA] ${datos}`);
      partes.push(ESC, 97, 1);
      partes.push(GS, 104, 80);
      partes.push(GS, 119, 2);
      partes.push(GS, 72, 2);
      if (String(formato).toLowerCase() === "ean13") {
        const contenido = bytesDeTexto(String(datos).replace(/\D/g, "").slice(0, 12));
        if (contenido.length === 12) partes.push(GS, 107, 67, 12, ...contenido);
      } else {
        const contenido = [123, 66, ...bytesDeTexto(datos)];
        if (contenido.length && contenido.length <= 255) partes.push(GS, 107, 73, contenido.length, ...contenido);
      }
      partes.push(ESC, 97, 0);
      return api;
    },
    // Imagen raster monocroma (GS v 0): `bytes` viene empaquetado en filas de
    // ancho/8 bytes con 1 = punto negro. `ancho` en píxeles (múltiplo de 8).
    imagenRaster(bytes, { ancho: ancho2 = 0, alto = 0 } = {}) {
      const anchoBytes = Math.ceil(Number(ancho2) / 8);
      const filas = Number(alto);
      if (!bytes?.length || !anchoBytes || !filas || bytes.length < anchoBytes * filas) return api;
      espejoCentrado("[LOGO]");
      partes.push(ESC, 97, 1);
      partes.push(GS, 118, 48, 0, anchoBytes % 256, Math.floor(anchoBytes / 256), filas % 256, Math.floor(filas / 256), ...bytes.slice(0, anchoBytes * filas));
      partes.push(ESC, 97, 0);
      return api;
    },
    avanza(lineas = 1) {
      const cuantas = Math.min(255, Math.max(1, Number(lineas) || 1));
      partes.push(ESC, 100, cuantas);
      espejo.push("\n".repeat(cuantas));
      return api;
    },
    // Corte GS V según el estándar ESC/POS (sin `ESC i`): alimenta 4 líneas y
    // corta. `variante` permite probar la que soporte el firmware:
    // completo · parcial · avanza-completo · avanza-parcial.
    corte(variante = "completo") {
      conCorte = true;
      espejoCentrado(variante === "completo" ? "[CORTE]" : `[CORTE: ${variante}]`);
      partes.push(ESC, 100, 4);
      partes.push(...CORTES[variante] || CORTES.completo);
      return api;
    },
    corteEnviado() {
      return conCorte;
    },
    bytes() {
      return new Uint8Array(partes);
    },
    base64() {
      let binario = "";
      for (const byte of partes) binario += String.fromCharCode(byte);
      return btoa(binario);
    },
    lineas() {
      return [...espejo];
    }
  };
  return api;
}
var AVANCES_FIRMA = 3;
function bloqueFirma(t, roles = [], { ancho = 80, observaciones = true } = {}) {
  const corto = Number(ancho) <= 58;
  for (const rol of roles) {
    t.avanza(1);
    t.texto(`${rol}:`);
    t.avanza(AVANCES_FIRMA);
    t.linea();
    t.texto(corto ? "Aclaraci\xF3n: ______________" : "Aclaraci\xF3n: ______________________________");
    if (corto) {
      t.texto("CI: ______________________");
      t.texto("Fecha: ____/____/_________");
    } else {
      t.texto("CI: __________________  Fecha: ___/___/______");
    }
  }
  if (observaciones) {
    t.avanza(1);
    t.texto("Observaciones:");
    t.avanza(2);
  }
}

// src/printing/prueba.js
var TIPOS_PRUEBA = {
  corta: "Prueba corta",
  completa: "Prueba completa",
  pedido: "Ticket de pedido",
  qr: "Ticket con QR",
  venta: "Ticket completo de venta",
  caracteres: "Caracteres y formato",
  corte: "Prueba de corte"
};
var TIPOS_TICKET_PRUEBA = TIPOS_PRUEBA;
var ANCHOS_PRUEBA = [58, 80];
var CORTES_PRUEBA = VARIANTES_CORTE;
var PLANTILLA_PRUEBA = { tipo: "corta", ancho: 80, incluyeFecha: false, corte: "completo", copias: 1 };
function plantillaDePrueba(datos = {}) {
  const base = datos && typeof datos === "object" ? datos : {};
  const tipo = Object.hasOwn(TIPOS_PRUEBA, base.tipo) ? base.tipo : PLANTILLA_PRUEBA.tipo;
  const ancho = ANCHOS_PRUEBA.includes(Number(base.ancho)) ? Number(base.ancho) : PLANTILLA_PRUEBA.ancho;
  const copias = Number(base.copias);
  const corte = CORTES_PRUEBA.includes(base.corte) ? base.corte : PLANTILLA_PRUEBA.corte;
  return {
    tipo,
    ancho,
    incluyeFecha: Boolean(base.incluyeFecha),
    corte,
    copias: Number.isSafeInteger(copias) && copias >= 1 && copias <= 5 ? copias : PLANTILLA_PRUEBA.copias
  };
}
var azar = (max) => Math.floor(Math.random() * max);
var validacionDe = () => String(azar(1e4)).padStart(4, "0");
var sufijoDe = () => String(azar(10));
var refDePrueba = () => `TEST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
var fechaCorta2 = (iso) => new Date(iso).toLocaleString("es-PY", { dateStyle: "short", timeStyle: "short" });
function paginaDePrueba({
  tipo = "corta",
  ancho = 80,
  impresora = "",
  nombre = "",
  equipo = "",
  copias = 1,
  metodo = "",
  conexion = "",
  puente = "",
  tokenPista = "",
  usuario = "",
  marca = "",
  nombreApp = "OwnCoding",
  validacion: validacionFija = "",
  incluyeFecha = false,
  corte = PLANTILLA_PRUEBA.corte,
  qr = null
} = {}) {
  const metodoReal = metodo || (/^(usb|cups):/.test(String(impresora || "")) ? "CUPS (cola local)" : "LAN (TCP directo)");
  const conexionReal = /^(usb|cups)/.test(String(conexion || "")) ? "Cola CUPS local" : "LAN (TCP directo)";
  const validacion = validacionFija || validacionDe();
  const sufijo = sufijoDe();
  const validador = `${validacion}-${sufijo}`;
  const ref = refDePrueba();
  const ahora = (/* @__PURE__ */ new Date()).toISOString();
  const t = crearTicket({ ancho }).iniciar();
  const minimo2 = tipo === "corta";
  const pie = () => {
    t.linea();
    t.negrita().centrado(`VALIDACI\xD3N ${validador}`).negrita(false);
    t.linea();
    t.par("Impresora", nombre || "\u2014");
    t.par("M\xE9todo", metodoReal);
    t.par("Conexi\xF3n", conexionReal);
    t.par("Destino", impresora || "\u2014");
    t.par("Puente", puente || "\u2014");
    t.par("Token", tokenPista || "sin token");
    t.par("Ancho", `${ancho} mm`);
    t.par("Copias", String(copias));
    t.par("Usuario", usuario || "\u2014");
    t.par("Fecha", fechaCorta2(ahora));
    t.par("Equipo", equipo || "\u2014");
    t.par("Trabajo", ref);
  };
  const codigos = (etiqueta) => {
    t.linea();
    t.centrado("Escanear");
    const contenido = qr ? qr({ destino: impresora, validacion, fecha: ahora, tipo }) : `OWNCODING:PRUEBA:${etiqueta}:${validacion}`;
    if (contenido) t.qr(contenido, { tamano: 6, etiqueta: "QR" });
    t.barcode(`OC-${etiqueta}-${validacion}`, { etiqueta: "C\xF3digo de barras" });
    t.linea();
    t.texto("Acentos: \xE1 \xE9 \xED \xF3 \xFA \xFC \xF1 \xD1 \xBF? \xA1!");
  };
  if (minimo2) {
    t.negrita().centrado(`TICKET DE PRUEBA ${nombreApp}`).negrita(false);
    t.linea();
    t.negrita().doble().centrado(`VALIDACI\xD3N ${validador}`).doble(false).negrita(false);
    if (incluyeFecha) t.par("Fecha", fechaCorta2(ahora));
    t.linea();
  } else {
    t.centrado(nombreApp).negrita().doble().centrado("TICKET DE PRUEBA").doble(false).negrita(false);
    t.centrado(TIPOS_PRUEBA[tipo] || "Prueba");
    if (marca) t.centrado(`Comparativa ${marca}`);
    t.linea();
    t.negrita().doble().centrado(`VALIDACI\xD3N ${validador}`).doble(false).negrita(false);
    t.linea();
  }
  if (tipo === "completa") {
    t.par("Prueba", metodoReal);
    t.par("Destino", impresora || "\u2014");
    t.par("Resultado", "PENDIENTE");
    codigos("COMPLETA");
  }
  if (tipo === "pedido") {
    t.par("Pedido", `P-${validacionDe()}`);
    t.par("Cliente", "Cliente de prueba");
    t.linea();
    t.texto("iPhone 16 Pro 128GB");
    t.par("  x1", "7.950.000");
    t.texto("Case MagSafe silicona");
    t.par("  x1", "180.000");
    t.texto("L\xE1mina 9H");
    t.par("  x2", "60.000");
    t.linea();
    t.par("Subtotal", "8.250.000");
    t.par("Descuento", "-250.000");
    t.negrita().par("Total", "8.000.000").negrita(false);
    t.par("Medio de pago", "Efectivo");
    t.par("Vendedor", "Vendedor de prueba");
    codigos("PEDIDO");
  }
  if (tipo === "qr") {
    t.par("Pedido", `P-${validacionDe()}`);
    t.par("Cliente", "Cliente de prueba");
    t.negrita().par("Total", "1.234.000").negrita(false);
    codigos("QR");
  }
  if (tipo === "venta") {
    t.centrado(`${nombreApp} \xB7 SUCURSAL CENTRAL`).centrado("Comprobante de venta");
    t.linea();
    t.par("Fecha", fechaCorta2(ahora));
    t.par("Vendedor", "Vendedor de prueba");
    t.par("Cliente", "Cliente de prueba");
    t.linea();
    t.texto("iPhone 16 Pro 128GB");
    t.par("  x1", "7.950.000");
    t.texto("Case MagSafe silicona");
    t.par("  x1", "180.000");
    t.linea();
    t.par("Subtotal", "8.130.000");
    t.par("IVA 10%", "813.000");
    t.negrita().par("Total", "8.943.000").negrita(false);
    t.par("Medio de pago", "Transferencia");
    codigos("VENTA");
  }
  if (tipo === "caracteres") {
    t.texto("Texto normal");
    t.negrita().texto("Negrita").negrita(false);
    t.doble().par("DOBLE", "123").doble(false);
    t.centrado("Centrado");
    t.par("Columna izquierda", "derecha");
    codigos("CHARS");
  }
  if (tipo === "corte") {
    t.par("Prueba", "Corte f\xEDsico por variantes");
    t.linea();
    t.texto("Cada secci\xF3n etiquetada intenta un corte distinto: mir\xE1 en qu\xE9 secci\xF3n se separ\xF3 el papel.");
    t.linea();
    t.centrado("1) GS V 0 \xB7 completo");
    t.texto("Corte completo puro (el est\xE1ndar de recibos).");
    t.avanza(1).corte("completo");
    t.centrado("2) GS V 1 \xB7 parcial");
    t.texto("Corte parcial: deja una tirita sin cortar.");
    t.avanza(1).corte("parcial");
    t.centrado("3) GS V 65 0 \xB7 avanza + completo");
    t.texto("Primero avanza hasta la cuchilla y despu\xE9s corta todo.");
    t.avanza(1).corte("avanza-completo");
    t.centrado("4) GS V 66 0 \xB7 avanza + parcial");
    t.texto("Avanza hasta la cuchilla y corta parcial.");
    t.avanza(1).corte("avanza-parcial");
    t.linea();
    t.texto("Si ninguna cort\xF3, revis\xE1 Cutter Enable: YES y que el rollo est\xE9 bien cargado.");
    codigos("CORTE");
  }
  if (!minimo2) pie();
  t.avanza(2).corte(corte);
  return { base64: () => t.base64(), lineas: () => t.lineas(), ref, validacion, sufijo, validador, corte: t.corteEnviado() };
}
function paginaDePruebaSimple(opciones = {}) {
  return paginaDePrueba({ ...opciones, tipo: "caracteres" });
}

// src/utils/guardado.js
var AVISO_REFRESCO = "Se guard\xF3 correctamente, pero no se pudo actualizar la lista. Recarg\xE1 la p\xE1gina para ver los cambios; no hace falta guardar otra vez.";
function crearEnvioUnico(enviar) {
  let enCurso = false;
  return {
    get enCurso() {
      return enCurso;
    },
    async ejecutar(evento) {
      if (enCurso) return void 0;
      enCurso = true;
      try {
        return await enviar(evento);
      } finally {
        enCurso = false;
      }
    }
  };
}
async function completeSave(cerrar, refrescar, { avisar } = {}) {
  cerrar?.();
  try {
    await refrescar?.();
    return true;
  } catch {
    avisar?.(AVISO_REFRESCO);
    return false;
  }
}

// src/utils/pilaOverlays.js
function crearPilaCapas() {
  const capas = [];
  return {
    agregar(id) {
      if (!capas.includes(id)) capas.push(id);
    },
    insertar(id, indice) {
      if (capas.includes(id)) return;
      capas.splice(Math.max(0, Math.min(indice, capas.length)), 0, id);
    },
    quitar(id) {
      const indice = capas.indexOf(id);
      if (indice >= 0) capas.splice(indice, 1);
    },
    esSuperior(id) {
      return capas[capas.length - 1] === id;
    },
    get tamano() {
      return capas.length;
    },
    ids() {
      return [...capas];
    }
  };
}
function crearRegistroPendientes() {
  const pendientes = /* @__PURE__ */ new Set();
  return {
    registrar(id, pendiente) {
      if (pendiente) pendientes.add(id);
      else pendientes.delete(id);
      return pendientes.size;
    },
    get bloqueado() {
      return pendientes.size > 0;
    },
    get cantidad() {
      return pendientes.size;
    }
  };
}

// src/utils/consentimiento.js
function registroConsentimiento({
  finalidad = "",
  aceptado = true,
  version = "",
  canal = "web",
  fecha = /* @__PURE__ */ new Date(),
  titular = ""
} = {}) {
  const momento = fecha instanceof Date ? fecha : new Date(fecha);
  return {
    finalidad: String(finalidad || ""),
    aceptado: Boolean(aceptado),
    version: String(version || ""),
    canal: String(canal || "web"),
    fecha: Number.isNaN(momento.getTime()) ? "" : momento.toISOString(),
    titular: String(titular || "")
  };
}

// src/utils/avisos.js
function rutaDeAviso(aviso = {}) {
  return String(aviso?.href ?? aviso?.destino ?? "").trim();
}
function payloadPush(aviso = {}, { app = "", title = "", body = "" } = {}) {
  return {
    title: String(title || app || "Aviso").trim(),
    body: String(body || "Ten\xE9s un aviso nuevo.").trim(),
    data: {
      ruta: rutaDeAviso(aviso),
      id: String(aviso?.id ?? ""),
      tono: String(aviso?.tono ?? "")
    }
  };
}
function enHorarioSilencioso(fecha = /* @__PURE__ */ new Date(), { desde = 22, hasta = 8 } = {}) {
  const momento = fecha instanceof Date ? fecha : new Date(fecha);
  const hora = momento?.getHours?.();
  if (!Number.isFinite(hora)) return false;
  const inicio = Number(desde);
  const fin = Number(hasta);
  if (!Number.isFinite(inicio) || !Number.isFinite(fin)) return false;
  if (inicio === fin) return true;
  return inicio < fin ? hora >= inicio && hora < fin : hora >= inicio || hora < fin;
}

// src/utils/version.js
function partesVersion(valor) {
  return String(valor ?? "").trim().replace(/^v/i, "").split("+")[0].split("-")[0].split(".").map((parte) => Number.parseInt(parte, 10)).map((numero) => Number.isFinite(numero) ? numero : 0);
}
function compararVersiones(a, b) {
  const partesA = partesVersion(a);
  const partesB = partesVersion(b);
  const largo = Math.max(partesA.length, partesB.length);
  for (let i = 0; i < largo; i += 1) {
    const diferencia = (partesA[i] || 0) - (partesB[i] || 0);
    if (diferencia !== 0) return diferencia > 0 ? 1 : -1;
  }
  return 0;
}
function hayVersionNueva(actual, publicada) {
  if (!String(actual ?? "").trim() || !String(publicada ?? "").trim()) return false;
  return compararVersiones(publicada, actual) > 0;
}

// src/utils/appIdentity.js
var VERSION_APP_RE = /^\d+\.\d+\.\d+(?:-rc\.[1-9]\d*)?$/;
function esVersionApp(version) {
  return VERSION_APP_RE.test(String(version ?? "").trim());
}
function etiquetaVersionApp(version) {
  const valor = String(version ?? "").trim();
  if (!esVersionApp(valor)) {
    throw new TypeError("La versi\xF3n debe usar X.Y.Z o X.Y.Z-rc.N");
  }
  return `v${valor}`;
}
function textoRequerido(valor, campo) {
  const texto = String(valor ?? "").trim();
  if (!texto) throw new TypeError(`${campo} es obligatorio`);
  return texto;
}
function crearIdentidadApp({
  nombre,
  version,
  url = "",
  logoUrl = "",
  soporteUrl = "",
  color = "#047857",
  credito = "Desarrollado por Owncoding",
  creditoUrl = "https://owncoding.dev/"
} = {}) {
  const nombreSeguro = textoRequerido(nombre, "nombre");
  const versionSegura = String(version ?? "").trim();
  const etiquetaVersion = etiquetaVersionApp(versionSegura);
  return Object.freeze({
    nombre: nombreSeguro,
    version: versionSegura,
    etiquetaVersion,
    url: String(url ?? "").trim(),
    logoUrl: String(logoUrl ?? "").trim(),
    soporteUrl: String(soporteUrl ?? "").trim(),
    color: /^#[0-9a-f]{6}$/i.test(String(color ?? "").trim()) ? String(color).trim() : "#047857",
    credito: credito == null ? null : String(credito).trim(),
    creditoUrl: String(creditoUrl ?? "").trim()
  });
}

// src/utils/qr.js
var QR_OPCIONES = { nivel: "M", margen: 1, ancho: 220 };
async function qrDataUrl(valor, { ancho = QR_OPCIONES.ancho, nivel = QR_OPCIONES.nivel, margen = QR_OPCIONES.margen } = {}) {
  const texto = String(valor ?? "").trim();
  if (!texto) return "";
  try {
    const { default: QRCode } = await import("qrcode");
    return await QRCode.toDataURL(texto, { errorCorrectionLevel: nivel, margin: margen, width: ancho });
  } catch {
    return "";
  }
}

// src/utils/cargaIA.js
var IA_TEXTO_MAX = 2e4;
var IA_REGISTROS_MAX = 25;
var IA_RATE_LIMIT = 10;
var IA_TOKENS_MAX = 4e3;
var IA_TIMEOUT_MS = 3e4;
var IA_BOTON = "Carga con IA";
var IA_TOOLTIP = "Carga con IA \xB7 peg\xE1 un texto y revis\xE1 antes de crear";
var IA_TITULO = "Carga con IA";
var CAMPOS_IA = ["texto", "numero", "moneda", "fecha", "select"];
var IA_DIALOGO_COMPLETO_REGISTROS = 6;
var IA_DIALOGO_COMPLETO_CAMPOS = 6;
function tamanoDialogoIA(fase, { registros = [], esquema } = {}) {
  if (fase !== "revision") return "amplio";
  const variasTarjetas = (registros?.length ?? 0) >= IA_DIALOGO_COMPLETO_REGISTROS;
  const tipoDenso = (esquema?.tipos ?? []).some((tipo) => (tipo?.campos?.length ?? 0) >= IA_DIALOGO_COMPLETO_CAMPOS);
  return variasTarjetas || tipoDenso ? "completo" : "amplio";
}
var textoDe = (valor) => (valor === null || valor === void 0 ? "" : String(valor)).trim();
function tipoDeEsquemaIA(esquema, tipoId) {
  return (esquema?.tipos ?? []).find((tipo) => tipo?.id === tipoId) ?? null;
}
function campoDeTipoIA(tipo, campoId) {
  return (tipo?.campos ?? []).find((campo) => campo?.id === campoId) ?? null;
}
function campoPrincipal(tipo) {
  const campos = tipo?.campos ?? [];
  return campos.find((campo) => campo?.obligatorio) ?? campos[0] ?? null;
}
function valorVacioIA(valor) {
  if (valor === null || valor === void 0) return true;
  if (typeof valor === "number") return !Number.isFinite(valor);
  return String(valor).trim() === "";
}
function tituloDeRegistroIA(registro, tipo) {
  const propio = textoDe(registro?.titulo);
  if (propio) return propio;
  const principal = campoPrincipal(tipo);
  if (principal) {
    const valor = textoDe(registro?.valores?.[principal.id]);
    if (valor) return valor;
  }
  return tipo?.label || textoDe(registro?.tipo) || "Registro";
}
function opcionesDeCampoIA(campo) {
  return (campo?.opciones ?? []).map(
    (opcion) => typeof opcion === "string" ? { value: opcion, label: opcion } : { value: String(opcion?.value ?? ""), label: textoDe(opcion?.label) || String(opcion?.value ?? "") }
  );
}
function registrosCrudosIA(analisis, esquema) {
  if (Array.isArray(analisis?.registros)) return analisis.registros;
  return (esquema?.tipos ?? []).flatMap(
    (tipo) => Array.isArray(analisis?.[tipo.id]) ? analisis[tipo.id].map((registro) => ({
      ...registro,
      tipo: registro?.tipo || tipo.id,
      valores: registro?.valores && typeof registro.valores === "object" ? registro.valores : registro
    })) : []
  );
}
function normalizarAnalisisIA(analisis, esquema, opciones = {}) {
  const maxRegistros = Number.isFinite(Number(opciones.maxRegistros)) && Number(opciones.maxRegistros) > 0 ? Math.floor(Number(opciones.maxRegistros)) : IA_REGISTROS_MAX;
  const tipos = esquema?.tipos ?? [];
  const idsValidos = new Set(tipos.map((tipo) => tipo?.id));
  const registros = [];
  const usados = /* @__PURE__ */ new Set();
  const avisos = Array.isArray(analisis?.avisos) ? analisis.avisos.map(textoDe).filter(Boolean) : [];
  const contador = /* @__PURE__ */ new Map();
  let descartados = 0;
  let recortados = false;
  for (const crudo of registrosCrudosIA(analisis, esquema)) {
    const tipoId = textoDe(crudo?.tipo);
    if (!idsValidos.has(tipoId)) {
      descartados += 1;
      continue;
    }
    const tipo = tipoDeEsquemaIA(esquema, tipoId);
    const cantidad = (contador.get(tipoId) ?? 0) + 1;
    contador.set(tipoId, cantidad);
    if (cantidad > maxRegistros) {
      recortados = true;
      continue;
    }
    const valores = {};
    for (const campo of tipo?.campos ?? []) {
      const valor = crudo?.valores?.[campo.id];
      valores[campo.id] = valor === void 0 ? null : valor;
    }
    let id = textoDe(crudo?.id) || textoDe(crudo?.clave);
    if (!id || usados.has(id)) {
      let numero = cantidad;
      id = `ia-${tipoId}-${numero}`;
      while (usados.has(id)) {
        numero += 1;
        id = `ia-${tipoId}-${numero}`;
      }
    }
    usados.add(id);
    registros.push({
      id,
      tipo: tipoId,
      valores,
      incluir: crudo?.incluir === void 0 ? true : Boolean(crudo.incluir),
      titulo: textoDe(crudo?.titulo) || void 0,
      avisos: Array.isArray(crudo?.avisos) ? crudo.avisos.map(textoDe).filter(Boolean) : []
    });
  }
  if (descartados > 0) {
    avisos.push(`Descartamos ${descartados} registro${descartados === 1 ? "" : "s"} sin tipo conocido.`);
  }
  if (recortados) avisos.push(`Recortamos la vista previa a ${maxRegistros} registros por tipo.`);
  return { registros, avisos };
}
function registrosIncluidosIA(registros) {
  return (registros ?? []).filter((registro) => registro?.incluir);
}
function validarRegistrosIA(registros, esquema) {
  const errores = /* @__PURE__ */ new Map();
  for (const registro of registros ?? []) {
    if (!registro?.incluir) continue;
    const tipo = tipoDeEsquemaIA(esquema, registro.tipo);
    const porCampo = {};
    for (const campo of tipo?.campos ?? []) {
      if (!campo?.obligatorio) continue;
      if (valorVacioIA(registro.valores?.[campo.id])) {
        porCampo[campo.id] = "Complet\xE1 este campo para crear el registro.";
      }
    }
    if (Object.keys(porCampo).length > 0) errores.set(registro.id, porCampo);
  }
  return { valido: errores.size === 0, errores };
}
function normalizarResultadoIA(resultado, opciones = {}) {
  const errores = Array.isArray(resultado?.errores) ? resultado.errores.map(textoDe).filter(Boolean) : [];
  const advertencias = Array.isArray(resultado?.advertencias) ? resultado.advertencias.map(textoDe).filter(Boolean) : [];
  const bruto = resultado?.creados;
  const numero = bruto === void 0 || bruto === null || bruto === "" ? null : Number(bruto);
  const total = Number.isFinite(Number(opciones.total)) ? Number(opciones.total) : null;
  return {
    creados: numero !== null && Number.isFinite(numero) ? Math.max(0, numero) : null,
    total,
    errores,
    advertencias
  };
}

// src/utils/personas.js
function normalizarPersonaTexto(texto) {
  return String(texto ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function etiquetaPersona(persona) {
  return [persona?.nombre, persona?.rol, persona?.especialidad, persona?.email, persona?.detalle].filter(Boolean).join(" ");
}
function filtrarPersonas(personas, termino) {
  const lista = Array.isArray(personas) ? personas : [];
  const texto = normalizarPersonaTexto(termino);
  if (!texto) return lista;
  return lista.filter((persona) => normalizarPersonaTexto(etiquetaPersona(persona)).includes(texto));
}
function ordenarPersonas(personas, uso = {}, opciones = {}) {
  const priorizarActivos = opciones.priorizarActivos !== false;
  const lista = [...Array.isArray(personas) ? personas : []];
  const datos = (persona) => uso?.[persona?.id] ?? { usos: 0, ultima: 0 };
  return lista.sort((a, b) => {
    if (priorizarActivos) {
      const inactivaA = a?.activo === false ? 1 : 0;
      const inactivaB = b?.activo === false ? 1 : 0;
      if (inactivaA !== inactivaB) return inactivaA - inactivaB;
    }
    const usoA = datos(a);
    const usoB = datos(b);
    if (usoA.usos !== usoB.usos) return usoB.usos - usoA.usos;
    if (usoA.ultima !== usoB.ultima) return usoB.ultima - usoA.ultima;
    return String(a?.nombre ?? "").localeCompare(String(b?.nombre ?? ""), "es", { sensitivity: "base" });
  });
}
var CLAVE_USO_PERSONAS = "owncoding:personas:uso:";
function leerUsoPersonas(clave, almacen = globalThis?.localStorage) {
  if (!clave || !almacen) return {};
  try {
    const crudo = almacen.getItem(`${CLAVE_USO_PERSONAS}${clave}`);
    const valor = crudo ? JSON.parse(crudo) : {};
    return valor && typeof valor === "object" ? valor : {};
  } catch {
    return {};
  }
}
function registrarUsoPersona(clave, id, almacen = globalThis?.localStorage, ahora = Date.now()) {
  if (!clave || !id || !almacen) return;
  try {
    const actual = leerUsoPersonas(clave, almacen)[id] ?? { usos: 0, ultima: 0 };
    const siguiente = { ...leerUsoPersonas(clave, almacen), [id]: { usos: actual.usos + 1, ultima: ahora } };
    almacen.setItem(`${CLAVE_USO_PERSONAS}${clave}`, JSON.stringify(siguiente));
  } catch {
  }
}
export {
  ANCHOS_PRUEBA,
  AVANCES_FIRMA,
  AVISO_REFRESCO,
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  CAMPOS_DISPOSITIVO,
  CAMPOS_IA,
  CAPACIDADES_IPHONE,
  CATEGORIAS_ACCESORIOS,
  CATEGORIAS_PRODUCTO,
  CELDA_DATO,
  CELDA_ENCABEZADO,
  CELDA_IDENTIDAD,
  CELDA_IDENTIDAD_GRANDE,
  CELDA_NUMERO,
  CIERRE_CON_CAMBIOS,
  CIUDADES_PARAGUAY,
  CLAVE_USO_PERSONAS,
  CODIGOS_PAIS,
  COLORES_AVATAR,
  COLORES_BANCO_RESPALDO,
  COLORES_IPHONE,
  COLOR_BADGE,
  COLOR_DE_TONO,
  CONDICION_UNIDAD,
  CONECTIVIDADES_MOVIL,
  COOPERATIVAS_PARAGUAY,
  CORTES_PRUEBA,
  DEPARTAMENTOS_PARAGUAY,
  DIAS_SEMANA,
  DISPOSITIVOS_MOBILE,
  EMAIL_RE,
  ESTADOS_CHIP,
  ESTADOS_COMPRA,
  ESTADOS_ENVIO,
  ESTADOS_ITEM,
  ESTADOS_LOCK,
  ESTADOS_NECESIDAD,
  ESTADOS_PRESENCIA,
  ESTADOS_RECEPCION,
  ESTADOS_REVISION,
  ESTADO_IMPRESORA,
  ETIQUETA_ESTADO,
  ETIQUETA_PERIODO,
  ETIQUETA_TRABAJO,
  FECHA_VERIFICACION_MARCAS_FINANCIERAS,
  FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  GRADOS_CONDICION,
  GRILLA_DOS_COLUMNAS,
  GRILLA_DOS_COLUMNAS_COMPACTA,
  IA_BOTON,
  IA_DIALOGO_COMPLETO_CAMPOS,
  IA_DIALOGO_COMPLETO_REGISTROS,
  IA_RATE_LIMIT,
  IA_REGISTROS_MAX,
  IA_TEXTO_MAX,
  IA_TIMEOUT_MS,
  IA_TITULO,
  IA_TOKENS_MAX,
  IA_TOOLTIP,
  ICONO_CATEGORIA,
  INCIDENCIAS,
  LIMITE_MONTO_ALMACENABLE,
  LIMITE_MONTO_GENERAL,
  LIMITE_MONTO_VENTAS,
  LOCKS_DISPOSITIVO,
  LOGOS_BANCOS,
  MARCAS_ACCESORIOS,
  MARCAS_CON_RELACION_FINANCIERA,
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  MENSAJES_VALIDACION,
  MENSAJE_RUC,
  MENSAJE_RUC_CONSULTA,
  MENSAJE_RUC_SIN_DATOS,
  MENSAJE_TELEFONO,
  METODOS_ENVIO,
  MODELOS_IPHONE,
  ORIGENES_NECESIDAD,
  PAISES_TELEFONO,
  PASOS_ENVIO,
  PASOS_NECESIDAD,
  PATRON_RUC,
  PATRON_TAX_ID_GENERICO,
  PERFILES_DISPOSITIVO,
  PERIODOS_FECHA,
  PIE_ACCIONES,
  PIE_ACCIONES_REVERSO,
  PLANTILLA_PRUEBA,
  PRIORIDADES_COMPRA,
  QR_OPCIONES,
  RELACIONES_FINANCIERAS,
  RESULTADOS_VALIDOS,
  ROTULO_DATO,
  ROTULO_SECCION,
  RUC_RE,
  SIMBOLOS_MONEDA,
  SIMBOLO_PYG,
  TAMANOS_CAMPO,
  TAMANOS_MODAL,
  TAMANO_MODAL_PREDETERMINADO,
  TIPOS_PRUEBA,
  TIPOS_TICKET_PRUEBA,
  TONOS,
  TONOS_ALIAS,
  TONO_ESTADO,
  UMBRAL_BATERIA_ATENCION,
  UMBRAL_BATERIA_OK,
  VARIANTES_CORTE,
  VERSION_APP_RE,
  agregarEstado,
  agruparPorDia,
  anchoParaLargo,
  bloqueFirma,
  buscarCiudad,
  buscarDispositivo,
  buscarEnCatalogo,
  buscarPaisesTelefono,
  buscarRelacionesFinancieras,
  campoDeTipoIA,
  campoVacio,
  caretTrasDigitos,
  categoriaDe,
  chipDeTono,
  claveColorDeNombre,
  claveDeEstado2 as claveDeEstado,
  claveDeEstadoCompra,
  claveDeEstadoEnvio,
  claveDeEstadoRecepcion,
  claveDeMetodoEnvio,
  claveDePrioridad,
  claveDia,
  claveRevision,
  cn,
  coberturaBancos,
  coberturaMediosPago,
  codigoDeDispositivo,
  codigoPais,
  colorBadge,
  colorDeBanco,
  colorDeNombre,
  colorDeTono,
  colorTrabajo,
  columnasDeAncho,
  compararVersiones,
  completeSave,
  componerTelefono,
  conexionDeDestino,
  crearEnvioUnico,
  crearIdentidadApp,
  crearPilaCapas,
  crearRegistroPendientes,
  crearTicket,
  departamentoDe,
  destinoDeConexion,
  diasHasta,
  emailValido,
  enHorarioSilencioso,
  envolver,
  errorMonto,
  esApellidosPrimero,
  esAtajo,
  esClaveDia,
  esIncidencia,
  esRazonSocial,
  esRuc,
  esToken,
  esVersionApp,
  estadoChip,
  estadoCompra,
  estadoDeDiagnostico,
  estadoEnvio,
  estadoItem,
  estadoLock,
  estadoNecesidad,
  estadoRecepcion,
  etiquetaCompra,
  etiquetaCondicion,
  etiquetaDeCategoria,
  etiquetaDia,
  etiquetaDiaCorta,
  etiquetaDispositivo,
  etiquetaEnvio,
  etiquetaMes,
  etiquetaMetodoEnvio,
  etiquetaNecesidad,
  etiquetaOrigen,
  etiquetaPersona,
  etiquetaPluralRevision,
  etiquetaPrioridad,
  etiquetaRecepcion,
  etiquetaRevision,
  etiquetaTrabajo,
  etiquetaVersionApp,
  excedeMonto,
  extractTokenFromUrl,
  extraerRuc,
  fechaCorta,
  fechaDeClave,
  fechaDia,
  fechaHora,
  fechaHoraCorta,
  fechaLista,
  fechaListaCorta,
  fechaValida,
  filtrarPersonas,
  formatGs,
  formatGsInput,
  formatMoney,
  formatUsd,
  formatUsdInput,
  formatoNumero,
  gradoCondicion,
  hayVersionNueva,
  hoyClave,
  iconoDeCategoria,
  iconoMetodoEnvio,
  iconoOrigen,
  identidadDeUsuario,
  imeiValido,
  indiceSemana,
  inicialesDeBanco,
  inicialesDeNombre,
  institucionesSugeridasPorMarca,
  internationalPhone,
  largoMaximo,
  largoMaximoMonto,
  largoMinimo,
  leerUsoPersonas,
  limiteMonto,
  limpiarDependientes,
  limpiarError,
  limpiarTaxId,
  logoDeBanco,
  logoDeMedioPago,
  marcasRelacionadasConInstitucion,
  maximo,
  mensajeFallo,
  mensajeResultado,
  metodoEnvio,
  minimo,
  mismoMes,
  montoConSigno,
  montoGs,
  montoTexto,
  montoUsd,
  motivoDeDiagnostico,
  nombreDeDispositivo,
  nombrePartes,
  normalizarAnalisisIA,
  normalizarBanco,
  normalizarBusqueda,
  normalizarCategoria,
  normalizarMarcaPago,
  normalizarMontoInput,
  normalizarNombre,
  normalizarPersonaTexto,
  normalizarRelacionFinanciera,
  normalizarResultadoIA,
  normalizarSeriales,
  normalizarTelefono,
  normalizeTaxId,
  obligatorio,
  opcionesDeCampoIA,
  opcionesDependiente,
  ordenDePrioridad,
  ordenarPersonas,
  ordenarPorPrioridad,
  origenDe,
  paginaDePrueba,
  paginaDePruebaSimple,
  paisTelefonoPorIso,
  paisesDeCodigo,
  parseGsInput,
  parseTelefono,
  parseTelefonoInternacional,
  parseUsdInput,
  partesVersion,
  partirSerial,
  patron,
  payloadPush,
  periodoDeRango,
  plantillaDePrueba,
  primerNombre,
  prioridadDe,
  puntoDeTono,
  qrDataUrl,
  rangoDePeriodo,
  rangoInvertido,
  rangoMes,
  rangoSemana,
  registrarUsoPersona,
  registroConsentimiento,
  registrosIncluidosIA,
  relacionFinancieraDe,
  repartirLinea,
  resumenPresencia,
  rutaDeAviso,
  separarSeriales,
  serialEnmascarado,
  signoDe,
  soloDigitos,
  sugerenciasDeBanco,
  sugerenciasDeMarcaPago,
  sumarDias,
  sumarMeses,
  tamanoDialogoIA,
  taxIdGenericoValid,
  taxIdValid,
  taxIdValidoParaPais,
  telefonoE164,
  telefonoInternacionalValido,
  telefonoValido,
  telefonoVisible,
  textoDeTono,
  textoVerificacion,
  tipoDeEsquemaIA,
  tituloDeRegistroIA,
  tonoBateria,
  tonoCanonico,
  tonoCompra,
  tonoEnvio,
  tonoNecesidad,
  tonoOrigen,
  tonoPrioridad,
  tonoRecepcion,
  tonoRevision,
  tonoVencimiento,
  ultimos4,
  validarCampo,
  validarCampos,
  validarRegistrosIA,
  valorVacioIA,
  whatsappUrl
};
//# sourceMappingURL=utils.js.map
