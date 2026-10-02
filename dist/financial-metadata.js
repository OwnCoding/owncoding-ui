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
      compacto: EMPAQUETADO("atlas-compacto.svg", "oficial", { fondo: "#B20933", padding: true }),
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
export {
  AUTORIZACION_ASSETS_FINANCIEROS,
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  BLOQUEOS_ASSETS_FINANCIEROS,
  COLORES_BANCO_RESPALDO,
  COOPERATIVAS_PARAGUAY,
  FECHA_VERIFICACION_MARCAS_FINANCIERAS,
  FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  LOGOS_BANCOS,
  MARCAS_CON_RELACION_FINANCIERA,
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  RELACIONES_FINANCIERAS,
  SOLUCIONES_PAGO_COMERCIOS,
  buscarRelacionesFinancieras,
  coberturaBancos,
  coberturaMediosPago,
  colorDeBanco,
  inicialesDeBanco,
  institucionesSugeridasPorMarca,
  logoDeBanco,
  logoDeMedioPago,
  marcasRelacionadasConInstitucion,
  normalizarBanco,
  normalizarMarcaPago,
  normalizarRelacionFinanciera,
  relacionFinancieraDe,
  sugerenciasDeBanco,
  sugerenciasDeMarcaPago
};
//# sourceMappingURL=financial-metadata.js.map
