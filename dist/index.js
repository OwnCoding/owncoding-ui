"use client"

// src/components/ui.jsx
import { Children, cloneElement, createContext, forwardRef, isValidElement, useCallback as useCallback2, useContext, useEffect as useEffect2, useId, useLayoutEffect, useMemo, useRef as useRef2, useState as useState2 } from "react";
import { createPortal } from "react-dom";

// src/utils/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function primerNombre(nombre = "") {
  return String(nombre ?? "").trim().split(/\s+/)[0] || "";
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

// src/hooks/useDialogFocusTrap.js
import { useCallback, useEffect, useRef, useState } from "react";

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

// src/hooks/useDialogFocusTrap.js
var SELECTOR_ENFOCABLES = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]';
function destinoDeTab({ shiftKey, activo, primero, ultimo, contenedor, fuera = false }) {
  if (!primero) return null;
  const enPrimero = activo === primero || activo === contenedor;
  const enUltimo = activo === ultimo;
  if (shiftKey && (enPrimero || fuera)) return ultimo;
  if (!shiftKey && (enUltimo || fuera)) return primero;
  return null;
}
var pila = crearPilaCapas();
var paneles = /* @__PURE__ */ new Map();
var oyentes = /* @__PURE__ */ new Set();
var bloqueosScroll = 0;
var overflowOriginal = "";
function avisar() {
  for (const oyente of oyentes) oyente();
}
function useDialogFocusTrap(open, onClose, ref, { initialFocus, bloquearScroll = true, busy = false } = {}) {
  const id = useRef(/* @__PURE__ */ Symbol("capa")).current;
  const [esSuperior, setEsSuperior] = useState(true);
  const cerrar = useRef(onClose);
  const opciones = useRef({ initialFocus, bloquearScroll, busy });
  useEffect(() => {
    cerrar.current = onClose;
  }, [onClose]);
  useEffect(() => {
    opciones.current = { initialFocus, bloquearScroll, busy };
  }, [initialFocus, bloquearScroll, busy]);
  const requestClose = useCallback(() => {
    if (pila.esSuperior(id) && !opciones.current.busy) cerrar.current?.();
  }, [id]);
  useEffect(() => {
    if (!open) return void 0;
    const contenedor = ref.current;
    const bloquear = opciones.current.bloquearScroll;
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    paneles.set(id, ref);
    const indice = pila.ids().findIndex((otra) => {
      const panelOtra = paneles.get(otra)?.current;
      return contenedor && panelOtra && contenedor.contains(panelOtra);
    });
    if (indice >= 0) pila.insertar(id, indice);
    else pila.agregar(id);
    if (bloquear) {
      bloqueosScroll += 1;
      if (bloqueosScroll === 1) overflowOriginal = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    const actualizar = () => setEsSuperior(pila.esSuperior(id));
    oyentes.add(actualizar);
    actualizar();
    const inicial = opciones.current.initialFocus?.() ?? contenedor;
    if (pila.esSuperior(id)) inicial?.focus?.();
    const alTeclear = (evento) => {
      if (!pila.esSuperior(id)) return;
      if (evento.key === "Escape") {
        if (evento.isComposing || evento.repeat || evento.target?.tagName === "SELECT") return;
        evento.preventDefault();
        if (!opciones.current.busy) cerrar.current?.();
        return;
      }
      if (evento.key !== "Tab" || !contenedor) return;
      const nodos = [...contenedor.querySelectorAll(SELECTOR_ENFOCABLES)].filter((el) => el.getClientRects().length);
      if (!nodos.length) {
        evento.preventDefault();
        contenedor.focus?.();
        return;
      }
      const destino = destinoDeTab({
        shiftKey: evento.shiftKey,
        activo: document.activeElement,
        primero: nodos[0],
        ultimo: nodos[nodos.length - 1],
        contenedor,
        fuera: !contenedor.contains(document.activeElement)
      });
      if (destino) {
        evento.preventDefault();
        destino.focus();
      }
    };
    const alEnfocar = (evento) => {
      if (!pila.esSuperior(id) || !contenedor) return;
      if (evento.target instanceof Node && contenedor.contains(evento.target)) return;
      const primero = opciones.current.initialFocus?.() ?? contenedor;
      primero?.focus?.();
    };
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("focusin", alEnfocar);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("focusin", alEnfocar);
      oyentes.delete(actualizar);
      const eraSuperior = pila.esSuperior(id);
      pila.quitar(id);
      paneles.delete(id);
      avisar();
      if (bloquear) {
        bloqueosScroll = Math.max(0, bloqueosScroll - 1);
        if (bloqueosScroll === 0) document.body.style.overflow = overflowOriginal;
      }
      if (eraSuperior) {
        const superior = pila.ids().at(-1);
        const panelSuperior = superior ? paneles.get(superior)?.current : null;
        if (anterior?.isConnected) anterior.focus();
        else panelSuperior?.focus?.();
      }
    };
  }, [open, ref, id]);
  return { esSuperior, requestClose };
}

// src/utils/formulario.js
var GRILLA_DOS_COLUMNAS = "grid gap-3 sm:grid-cols-2";
var GRILLA_DOS_COLUMNAS_COMPACTA = "grid gap-2 sm:grid-cols-2";
var PIE_ACCIONES = "flex flex-wrap justify-end gap-2";
var PIE_ACCIONES_REVERSO = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end";

// src/components/Icon.jsx
import { jsx } from "react/jsx-runtime";
var PATHS = {
  // Navegación / estructura
  menu: "M3 6h18M3 12h18M3 18h18",
  back: "M19 12H5M12 19l-7-7 7-7",
  chevron: "M6 9l6 6 6-6",
  close: "M18 6L6 18M6 6l12 12",
  external: "M7 17L17 7M8 7h9v9",
  home: "M3 11l9-8 9 8M5 10v10h14V10M9 20v-6h6v6",
  arrow: "M5 12h14M14 7l5 5-5 5",
  link: "M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1",
  // Análisis
  chart: "M3 3v18h18M8 16V9M13 16V5M18 16v-4",
  trending: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
  sparkles: "M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3ZM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z",
  pulse: "M3 12h4l3-8 4 16 3-8h4",
  report: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M9 13h6M9 17h4",
  // Operación
  box: "M21 8l-9-5-9 5 9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8",
  phone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM11 18h2",
  refresh: "M21 12a9 9 0 1 1-3-6.7M21 4v5h-5",
  image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6",
  tag: "M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM7.5 7.5h.01",
  play: "M9 7l8 5-8 5z",
  pause: "M9 7v10M15 7v10",
  archive: "M4 7h16M6 7v12h12V7M9 11h6M5 4h14v3H5z",
  call: "M8.2 3.7 5.7 5.1c-1.1.6-1.5 1.9-1 3.1 2 5 6 9 11 11 1.2.5 2.5.1 3.1-1l1.4-2.5-4.2-2-1.3 1.7c-2.8-1.2-4.9-3.3-6.1-6.1L10.2 8l-2-4.3Z",
  // Finanzas
  receipt: "M6 2h12v20l-3-2-3 2-3-2-3 2V2ZM10 8h4M9 12h6",
  megaphone: "M3 11v2a1 1 0 0 0 1 1h3l7 4V6L7 10H4a1 1 0 0 0-1 1ZM18 9a3 3 0 0 1 0 6",
  wallet: "M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M21 10h-5a2 2 0 0 0 0 4h5v-4Z",
  money: "M2 6h20v12H2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M5 9h.01M19 15h.01",
  // Pago y cobro (cosecha de PagaYa)
  qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 20h2",
  transfer: "M4 7h15M15 3l4 4-4 4M20 17H5M9 13l-4 4 4 4",
  subscription: "M20 7h-7M17 4l3 3-3 3M4 17h7M7 14l-3 3 3 3M6 11a7 7 0 0 1 11-5M18 13a7 7 0 0 1-11 5",
  card: "M3 5h18v14H3zM3 10h18M7 15h4",
  terminal: "M12 3 3 8v2h18V8l-9-5ZM5 12v6H3v3h18v-3h-2v-6h-2v6h-4v-6h-2v6H7v-6H5Z",
  nfc: "M5.25 9a4.5 4.5 0 0 1 0 6M9 6.4a8.25 8.25 0 0 1 0 11.2M13.1 3.75a12 12 0 0 1 0 16.5",
  // Equipo
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3.7 8a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H8a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V8a1.7 1.7 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  // Acciones
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3",
  copy: "M9 9h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2ZM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  share: "M8.6 13.5l6.8 3.5M15.4 7L8.6 10.5M18.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM5.5 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 22a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6",
  backspace: "M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM18 9l-6 6M12 9l6 6",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2ZM17 21v-8H7v8M7 3v5h8",
  edit: "M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  eyeOff: "M10.6 5.1A9.9 9.9 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-2.4 3.2M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  filter: "M22 3H2l8 9.5V19l4 2v-8.5L22 3Z",
  pin: "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0ZM12 10a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z",
  code: "M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14",
  check: "M20 6L9 17l-5-5",
  alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-4M12 8h.01",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  unlock: "M5 11h14v10H5zM9 11V7a4 4 0 0 1 7.7-1.5",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8ZM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z",
  store: "M3 9 4.5 4h15L21 9M3 9h18M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M9 21v-6h6v6",
  printer: "M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  dots: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  package: "M16.5 9.4 7.5 4.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  cart: "M2.5 3h1.6l2.2 10.4a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L19.5 7H6M9 19.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM18 19.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  // ── Módulos y acciones portados del panel de LedBox (AdminIcons, 22-09-2026)
  // Los nombres son estables y la app no necesita un mapa propio; el mapa
  // LedBox → librería está en el README.
  overview: "M4.5 3h6A1.5 1.5 0 0 1 12 4.5v6A1.5 1.5 0 0 1 10.5 12h-6A1.5 1.5 0 0 1 3 10.5v-6A1.5 1.5 0 0 1 4.5 3ZM15 3h6a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 21 12h-6a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 15 3ZM15 13.5h6a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5ZM4.5 13.5h6A1.5 1.5 0 0 1 12 15v6a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 3 21v-6a1.5 1.5 0 0 1 1.5-1.5Z",
  events: "M4.5 5h15A1.5 1.5 0 0 1 21 6.5v14a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.5v-14A1.5 1.5 0 0 1 4.5 5ZM8 3v4M16 3v4M3 10.5h18",
  clients: "M12.2 8a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0ZM3.5 20a5.5 5.5 0 0 1 11 0M16 10.8a3 3 0 1 0 0-5.6M18 19.8a5.4 5.4 0 0 0-2.8-4.6",
  leads: "M4 5h16l-6.2 7.2V20l-3.6-2v-5.8z",
  budgets: "M6 3h8l4 4v14H6zM14 3v4h4M9 12.5h6M9 16h4",
  finance: "M4.5 6h15A2 2 0 0 1 21.5 8v8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2ZM12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM6 9.8v4.4M18 9.8v4.4",
  inventory: "M3.5 8 12 4l8.5 4v8L12 20l-8.5-4zM3.5 8 12 12l8.5-4M12 12v8",
  suppliers: "M3 7h11v9H3zM14 10h3.6L21 13.2V16h-7zM8.7 18.4a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0ZM18.7 18.4a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0Z",
  promoters: "M4 10v4h2.6l7.4 4V6l-7.4 4H4zM17 9.2a4 4 0 0 1 0 5.6",
  building: "M5 20V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V20M15 10h3.5A1.5 1.5 0 0 1 20 11.5V20M3 20h18M8 8h4M8 12h4M8 16h4",
  plan: "M12 3.6 20 8l-8 4.4L4 8zM4 12.4 12 16.8l8-4.4M4 16.4 12 20.8l8-4.4",
  audit: "M7 4h8.5L19 7.5V20H7zM15.5 4v3.5H19M9.8 13.6l1.7 1.8 3-3.6M9.8 17.6h4.4",
  arrowRight: "M4 12h15M13.5 6.5 19.5 12l-6 5.5",
  arrowLeft: "M20 12H5M10.5 6.5 4.5 12l6 5.5",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6",
  moon: "M20 14.6A8.6 8.6 0 0 1 9.4 4 8.6 8.6 0 1 0 20 14.6z",
  power: "M12 4v7.5M7.6 7a6.8 6.8 0 1 0 8.8 0",
  // `mail` conserva el trazo que la app ya tenía en producción (esquinas
  // rectas); el redondeado anterior queda reemplazado por paridad (#253).
  mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 2 8 6 8-6",
  bank: "M3.5 9.5 12 4l8.5 5.5M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3 19.5h18",
  checkin: "M4 12h11M10.5 7.5 15 12l-4.5 4.5M20 4.5v15",
  globe: "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM4 12h16M15.6 12a3.6 8 0 1 1-7.2 0 3.6 8 0 0 1 7.2 0Z",
  database: "M19.6 6.2a7.6 2.9 0 1 1-15.2 0 7.6 2.9 0 0 1 15.2 0ZM4.4 6.2v11.6c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V6.2M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9",
  instagram: "M8.1 3.5h7.8a4.6 4.6 0 0 1 4.6 4.6v7.8a4.6 4.6 0 0 1-4.6 4.6H8.1a4.6 4.6 0 0 1-4.6-4.6V8.1a4.6 4.6 0 0 1 4.6-4.6ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.2 6.9h.01"
};
var ICONOS = Object.keys(PATHS);
function Icon({ name, className, ...props }) {
  const d = PATHS[name];
  if (!d) return null;
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: cn("h-4 w-4 shrink-0", className),
      "aria-hidden": "true",
      ...props,
      children: d.split("M").filter(Boolean).map((seg, i) => /* @__PURE__ */ jsx("path", { d: "M" + seg }, i))
    }
  );
}

// src/components/ui.jsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var VARIANTS = {
  primary: "bg-fono text-onbrand hover:brightness-110",
  success: "bg-ok text-on-ok hover:brightness-110",
  danger: "bg-bad text-on-bad hover:brightness-110",
  outline: "bg-transparent text-fore border border-interactivo hover:border-fono hover:bg-fono/10",
  ghost: "bg-transparent text-mute hover:bg-ink-700 hover:text-fore"
};
function Button({ className, variant = "primary", ...props }) {
  return /* @__PURE__ */ jsx2(
    "button",
    {
      className: cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-lg px-4 font-semibold transition",
        "h-11 md:h-9 text-sm disabled:opacity-30 disabled:cursor-not-allowed active:scale-[.98]",
        VARIANTS[variant],
        className
      ),
      ...props
    }
  );
}
var Input = forwardRef(function Input2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx2(
    "input",
    {
      ref,
      className: cn(
        "w-full rounded-lg border border-interactivo bg-ink-800 px-3.5 text-fore",
        "h-11 md:h-9 text-base md:text-sm outline-none transition",
        "focus:border-fono focus:ring-1 focus:ring-fono/40 placeholder:text-mute/60",
        className
      ),
      ...props
    }
  );
});
function PasswordInput({ className, ...props }) {
  const [visible, setVisible] = useState2(false);
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx2(Input, { ...props, type: visible ? "text" : "password", className: cn("pr-11", className) }),
    /* @__PURE__ */ jsx2(
      "button",
      {
        type: "button",
        onClick: () => setVisible((current) => !current),
        className: "absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-mute transition hover:text-fore focus-visible:z-10",
        "aria-label": visible ? "Ocultar contrase\xF1a" : "Mostrar contrase\xF1a",
        "aria-pressed": visible,
        title: visible ? "Ocultar contrase\xF1a" : "Mostrar contrase\xF1a",
        children: /* @__PURE__ */ jsx2(Icon, { name: visible ? "eyeOff" : "eye", className: "h-4 w-4" })
      }
    )
  ] });
}
function PinInput({ value, onChange, onComplete, length = 4, autoFocus = false, disabled = false, inputRef, ariaLabel, className, id }) {
  const largoMax = Math.min(6, Math.max(4, Number(length) || 4));
  const largo = String(value || "").length;
  return /* @__PURE__ */ jsxs("span", { className: cn("relative mx-auto block h-16 w-44 transition-transform duration-150 focus-within:scale-[1.03]", disabled && "opacity-50", className), children: [
    /* @__PURE__ */ jsx2(
      "input",
      {
        ref: inputRef,
        id,
        type: "text",
        inputMode: "numeric",
        autoComplete: "one-time-code",
        maxLength: largoMax,
        value,
        autoFocus,
        disabled,
        onChange: (event) => {
          const next = event.target.value.replace(/\D/g, "").slice(0, largoMax);
          onChange(next);
          if (next.length === largoMax) onComplete?.();
        },
        placeholder: "",
        "aria-label": ariaLabel || `PIN de ${largoMax} d\xEDgitos`,
        className: "pin-oculto h-full w-full rounded-2xl border border-interactivo bg-paper text-center text-3xl font-bold tracking-[.45em] shadow-card transition-all duration-150 focus:border-fono focus:ring-2 focus:ring-fono/30 focus:outline-none"
      }
    ),
    /* @__PURE__ */ jsx2("span", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0 flex items-center justify-center gap-[.5em]", children: Array.from({ length: largoMax }, (_, indice) => /* @__PURE__ */ jsx2(
      "span",
      {
        className: cn("h-2.5 w-2.5 rounded-full transition-colors", indice < largo ? "bg-fore" : "bg-mute/25")
      },
      indice
    )) })
  ] });
}
var MoneyInput = forwardRef(function MoneyInput2({ currency = "PYG", symbol, value, onValueChange, className, max = LIMITE_MONTO_GENERAL, maxLength, integerOnly = false, onKeyDown, ...props }, ref) {
  const soloEnteros = currency === "PYG" || integerOnly;
  const prefix = String(symbol ?? "").trim() || SIMBOLOS_MONEDA[currency] || currency;
  const display = soloEnteros ? formatGsInput(String(value ?? "").split(".")[0]) : formatUsdInput(value);
  const excede = excedeMonto(value, max);
  const inputRef = useRef2(null);
  const establecerRef = useCallback2((node) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);
  const topeLargo = maxLength ?? largoMaximoMonto(max, { decimales: !soloEnteros });
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx2("span", { className: "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-xs font-semibold text-mute", children: prefix }),
    /* @__PURE__ */ jsx2(
      Input,
      {
        ...props,
        ref: establecerRef,
        "aria-invalid": excede || void 0,
        title: excede ? `El monto supera el m\xE1ximo permitido (${max.toLocaleString("es-PY")})` : props.title,
        inputMode: soloEnteros ? "numeric" : "decimal",
        maxLength: topeLargo,
        value: display,
        onKeyDown: (evento) => {
          onKeyDown?.(evento);
          if (evento.defaultPrevented || evento.ctrlKey || evento.metaKey || evento.altKey) return;
          const permitidos = soloEnteros ? "0123456789" : "0123456789.,";
          if (evento.key.length === 1 && !permitidos.includes(evento.key)) evento.preventDefault();
        },
        onChange: (evento) => {
          const input = evento.currentTarget ?? evento.target;
          const antes = input.value.slice(0, input.selectionStart ?? input.value.length);
          const digitosAntes = (antes.match(/\d/g) || []).length;
          const normalizado = normalizarMontoInput(input.value, currency, { integerOnly });
          onValueChange?.(soloEnteros ? normalizado ? Number(normalizado) : "" : normalizado);
          if (typeof requestAnimationFrame !== "function") return;
          requestAnimationFrame(() => {
            const nodo = inputRef.current;
            if (!nodo || document.activeElement !== nodo) return;
            const caret = caretTrasDigitos(nodo.value, digitosAntes);
            nodo.setSelectionRange?.(caret, caret);
          });
        },
        className: cn(TAMANOS_CAMPO.moneda, prefix.length > 3 ? "pl-14" : "pl-12", "tabular-nums", className)
      }
    )
  ] });
});
function Money({ value, currency = "PYG", simbolo, className }) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return /* @__PURE__ */ jsx2("span", { className, children: "\u2014" });
  return /* @__PURE__ */ jsx2("span", { className, children: currency === "USD" ? `${String(simbolo ?? "").trim() || SIMBOLOS_MONEDA.USD} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : formatGs(amount, { simbolo }) });
}
function Select({ className, children, ...props }) {
  return /* @__PURE__ */ jsx2(
    "select",
    {
      className: cn(
        "w-full rounded-lg border border-interactivo bg-ink-800 px-3 text-fore",
        "h-11 md:h-9 text-base md:text-sm outline-none transition cursor-pointer",
        "focus:border-fono focus:ring-1 focus:ring-fono/40",
        "[&>option]:bg-ink-800 [&>option]:text-fore",
        className
      ),
      ...props,
      children
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "textarea",
    {
      className: cn(
        "w-full rounded-lg border border-interactivo bg-ink-800 px-3.5 py-2.5 text-fore",
        "text-base md:text-sm outline-none transition focus:border-fono focus:ring-1 focus:ring-fono/40",
        "placeholder:text-mute/60 resize-none",
        className
      ),
      ...props
    }
  );
}
function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "label",
    {
      className: cn(
        "block text-[11px] font-medium uppercase tracking-wider text-mute mb-1.5",
        className
      ),
      ...props
    }
  );
}
function Eyebrow({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: cn("text-xs font-bold uppercase tracking-[.18em] text-fono-light", className),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx2("div", { className: cn("rounded-2xl border border-ink-600 bg-ink p-5 shadow-card", className), ...props });
}
var ContextoDialogo = createContext(null);
var ContextoPie = createContext(null);
var useEfectoLayout = typeof window === "undefined" ? useEffect2 : useLayoutEffect;
function useDialogClose() {
  return useContext(ContextoDialogo)?.requestClose;
}
function useDialogPending(pendiente) {
  const contexto = useContext(ContextoDialogo);
  const id = useRef2(/* @__PURE__ */ Symbol("formulario")).current;
  useEfectoLayout(() => {
    contexto?.registrar(id, Boolean(pendiente));
    return () => contexto?.registrar(id, false);
  }, [contexto, id, pendiente]);
}
function conFormulario(children, formId) {
  return Children.map(
    children,
    (hijo) => isValidElement(hijo) && !hijo.props?.form && (hijo.type === "button" || typeof hijo.type === "function") ? cloneElement(hijo, { form: formId || void 0 }) : hijo
  );
}
function FormActions({ children, className }) {
  const pie = useContext(ContextoPie);
  const ancla = useRef2(null);
  const id = useId();
  const [formId, setFormId] = useState2("");
  useEfectoLayout(() => {
    const formulario = ancla.current?.closest("form");
    if (!formulario) {
      setFormId("");
      return;
    }
    if (!formulario.id) formulario.id = id;
    setFormId(formulario.id);
  }, [id, pie]);
  const acciones = /* @__PURE__ */ jsx2("div", { className: cn(PIE_ACCIONES, className), children: conFormulario(children, formId) });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx2("span", { hidden: true, ref: ancla }),
    pie ? createPortal(acciones, pie) : acciones
  ] });
}
function SaveActions({ pendiente = false, children, cancelLabel = "Cancelar", className }) {
  const requestClose = useDialogClose();
  useDialogPending(pendiente);
  return /* @__PURE__ */ jsxs(FormActions, { className, children: [
    requestClose && cancelLabel ? /* @__PURE__ */ jsx2(Button, { type: "button", variant: "ghost", disabled: pendiente, onClick: () => {
      if (!pendiente) requestClose();
    }, children: cancelLabel }) : null,
    children
  ] });
}
function Modal({ open, onClose, title, children, className, size = TAMANO_MODAL_PREDETERMINADO, busy = false }) {
  const dialog = useRef2(null);
  const titleId = useId();
  const [pie, setPie] = useState2(null);
  const pendientes = useRef2(crearRegistroPendientes()).current;
  const [hayPendientes, setHayPendientes] = useState2(false);
  const bloqueado = Boolean(busy || hayPendientes);
  const cerrar = useCallback2(() => {
    if (!busy && !pendientes.bloqueado) onClose?.();
  }, [busy, onClose, pendientes]);
  const { esSuperior, requestClose } = useDialogFocusTrap(open, cerrar, dialog, { busy: bloqueado });
  const registrar = useCallback2((id, pendiente) => {
    pendientes.registrar(id, pendiente);
    setHayPendientes(pendientes.bloqueado);
  }, [pendientes]);
  const contexto = useMemo(() => ({ requestClose, registrar }), [requestClose, registrar]);
  if (!open) return null;
  return /* @__PURE__ */ jsx2("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6", onMouseDown: (e) => e.target === e.currentTarget && requestClose(), children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: dialog,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": esSuperior ? "true" : void 0,
      "aria-labelledby": titleId,
      "aria-busy": bloqueado || void 0,
      className: cn("flex max-h-[min(90dvh,720px)] w-full flex-col overflow-hidden rounded-2xl border border-ink-600 bg-ink shadow-float", TAMANOS_MODAL[size] || TAMANOS_MODAL[TAMANO_MODAL_PREDETERMINADO], className),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-ink-600 p-4 sm:px-6", children: [
          /* @__PURE__ */ jsx2("h2", { id: titleId, className: "text-base font-bold text-fore", children: title }),
          /* @__PURE__ */ jsx2("button", { type: "button", onClick: requestClose, disabled: bloqueado, className: "toque-44 rounded-lg p-2 text-mute transition hover:bg-ink-700 hover:text-fore disabled:pointer-events-none disabled:opacity-40", "aria-label": "Cerrar", children: "\xD7" })
        ] }),
        /* @__PURE__ */ jsx2(ContextoDialogo.Provider, { value: contexto, children: /* @__PURE__ */ jsx2(ContextoPie.Provider, { value: pie, children: /* @__PURE__ */ jsx2("div", { className: "min-h-0 flex-1 overflow-y-auto p-4 sm:p-6", children }) }) }),
        /* @__PURE__ */ jsx2("div", { ref: setPie, className: "border-t border-ink-600 p-4 empty:hidden sm:px-6" })
      ]
    }
  ) });
}
function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = "Confirmar acci\xF3n",
  description,
  confirmLabel = "Confirmar",
  variant = "primary",
  busy = false
}) {
  return /* @__PURE__ */ jsx2(Modal, { open, onClose: onCancel, busy, title, size: "corto", children: /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx2("div", { className: cn("flex h-11 w-11 items-center justify-center rounded-2xl", variant === "danger" ? "bg-bad/10 text-bad-text" : "bg-fono/10 text-fono-text"), children: /* @__PURE__ */ jsx2(Icon, { name: variant === "danger" ? "alert" : "check", className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx2("p", { className: "text-sm leading-6 text-mute", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", children: [
      /* @__PURE__ */ jsx2(Button, { type: "button", variant: "ghost", onClick: onCancel, disabled: busy, children: "Cancelar" }),
      /* @__PURE__ */ jsx2(Button, { type: "button", variant, onClick: onConfirm, disabled: busy, children: busy ? "Procesando\u2026" : confirmLabel })
    ] })
  ] }) });
}
var BADGE = {
  blue: "bg-fono/15 text-fono-text border-fono/25",
  green: "bg-ok/15 text-ok-text border-ok/25",
  red: "bg-bad/15 text-bad-text border-bad/25",
  orange: "bg-warn/15 text-warn-text border-warn/25",
  yellow: "bg-warn/15 text-warn-text border-warn/25",
  slate: "bg-ink-600 text-mute border-ink-500"
};
function Badge({ className, color = "slate", ...props }) {
  return /* @__PURE__ */ jsx2(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        // Dentro del scope v2 el chip va tipo pill (micro-rótulo), como el mock.
        "v2-chip",
        BADGE[color],
        className
      ),
      ...props
    }
  );
}
var DOT = { green: "bg-ok", red: "bg-bad", blue: "bg-fono", slate: "bg-mute", orange: "bg-warn", ok: "bg-ok", warn: "bg-warn", bad: "bg-bad", info: "bg-info", mute: "bg-mute" };
function Dot({ color = "slate", pulse = false, className }) {
  return /* @__PURE__ */ jsxs("span", { className: cn("relative inline-flex h-2 w-2 shrink-0", className), children: [
    pulse && /* @__PURE__ */ jsx2(
      "span",
      {
        className: cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
          DOT[color]
        )
      }
    ),
    /* @__PURE__ */ jsx2("span", { className: cn("relative inline-flex h-2 w-2 rounded-full", DOT[color]) })
  ] });
}
var ICON_ACTION_TONE = {
  ok: "border-ok/30 text-ok-text hover:bg-ok/10",
  warn: "border-warn/30 text-warn-text hover:bg-warn/10",
  fono: "border-fono/30 text-fono-light hover:bg-fono/10",
  bad: "border-bad/30 text-bad-text hover:bg-bad/10",
  mute: "border-transparent text-mute hover:bg-ink-700 hover:text-fore"
};
function IconAction({ icon, label, tone = "mute", onClick, disabled = false, size = "sm" }) {
  return /* @__PURE__ */ jsx2(
    "button",
    {
      type: "button",
      title: label,
      "aria-label": label,
      disabled,
      onClick,
      className: cn(
        "inline-flex items-center justify-center rounded-lg border transition active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        size === "touch" ? "toque-44 h-9 w-9" : "h-11 w-11 md:h-7 md:w-7",
        ICON_ACTION_TONE[tone]
      ),
      children: /* @__PURE__ */ jsx2(Icon, { name: icon, className: "h-4 w-4" })
    }
  );
}
function Drawer({ open, onClose, title, children, side = "right", className, busy = false }) {
  const panel = useRef2(null);
  const titleId = useId();
  const [pie, setPie] = useState2(null);
  const pendientes = useRef2(crearRegistroPendientes()).current;
  const [hayPendientes, setHayPendientes] = useState2(false);
  const bloqueado = Boolean(busy || hayPendientes);
  const cerrar = useCallback2(() => {
    if (!busy && !pendientes.bloqueado) onClose?.();
  }, [busy, onClose, pendientes]);
  const { esSuperior, requestClose } = useDialogFocusTrap(open, cerrar, panel, { busy: bloqueado });
  const registrar = useCallback2((id, pendiente) => {
    pendientes.registrar(id, pendiente);
    setHayPendientes(pendientes.bloqueado);
  }, [pendientes]);
  const contexto = useMemo(() => ({ requestClose, registrar }), [requestClose, registrar]);
  if (!open) return null;
  return /* @__PURE__ */ jsx2("div", { className: "fixed inset-0 z-50 bg-black/60", onMouseDown: (e) => e.target === e.currentTarget && requestClose(), children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: panel,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": esSuperior ? "true" : void 0,
      "aria-labelledby": titleId,
      "aria-busy": bloqueado || void 0,
      className: cn(
        "absolute inset-y-0 flex max-h-full w-full max-w-md flex-col overflow-hidden border-ink-600 bg-ink shadow-float",
        side === "left" ? "left-0 border-r" : "right-0 border-l",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-ink-600 p-4", children: [
          /* @__PURE__ */ jsx2("h2", { id: titleId, className: "text-base font-bold text-fore", children: title }),
          /* @__PURE__ */ jsx2("button", { type: "button", onClick: requestClose, disabled: bloqueado, className: "toque-44 rounded-lg p-2 text-mute transition hover:bg-ink-700 hover:text-fore disabled:pointer-events-none disabled:opacity-40", "aria-label": "Cerrar", children: "\xD7" })
        ] }),
        /* @__PURE__ */ jsx2(ContextoDialogo.Provider, { value: contexto, children: /* @__PURE__ */ jsx2(ContextoPie.Provider, { value: pie, children: /* @__PURE__ */ jsx2("div", { className: "flex-1 overflow-y-auto p-4 sm:p-5", children }) }) }),
        /* @__PURE__ */ jsx2("div", { ref: setPie, className: "border-t border-ink-600 p-4 empty:hidden" })
      ]
    }
  ) });
}
var ToastContext = createContext(null);
var toastCounter = 0;
var TOAST_ICON = { success: "check", error: "alert", info: "info" };
var TOAST_TONE = { success: "text-ok-text", error: "text-bad-text", info: "text-fono-light" };
function ToastItem({ toast, dismiss, demo }) {
  const timer = useRef2(null);
  const startedAt = useRef2(0);
  const remaining = useRef2(toast.duration);
  const pause = useCallback2(() => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
  }, []);
  const resume = useCallback2(() => {
    if (toast.persistent || timer.current || remaining.current <= 0) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => dismiss(toast.id), remaining.current);
  }, [dismiss, toast.id, toast.persistent]);
  useEffect2(() => {
    resume();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [resume]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: toast.variant === "error" ? "alert" : "status",
      "aria-live": toast.variant === "error" ? "assertive" : "polite",
      onMouseEnter: pause,
      onMouseLeave: resume,
      onFocusCapture: pause,
      onBlurCapture: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) resume();
      },
      className: cn("pointer-events-auto flex items-start gap-3 rounded-xl border bg-ink-700 p-3.5 shadow-card", toast.variant === "error" ? "border-bad/40" : toast.variant === "success" ? "border-ok/40" : "border-ink-500"),
      children: [
        /* @__PURE__ */ jsx2(Icon, { name: TOAST_ICON[toast.variant], className: cn("mt-0.5 h-4 w-4", TOAST_TONE[toast.variant]), "aria-hidden": true }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx2("p", { className: "text-sm font-semibold text-fore", children: toast.title }),
          toast.description && /* @__PURE__ */ jsx2("p", { className: "mt-0.5 text-xs text-mute", children: toast.description }),
          demo && /* @__PURE__ */ jsx2("p", { className: "mt-1 inline-flex rounded border border-fono/40 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fono-light", children: "Demo \xB7 no se guard\xF3 en la tienda" })
        ] }),
        /* @__PURE__ */ jsx2("button", { type: "button", onClick: () => dismiss(toast.id), className: "toque-44 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-mute transition hover:bg-ink-600 hover:text-fore", "aria-label": "Cerrar aviso", children: "\xD7" })
      ]
    }
  );
}
function ToastProvider({ children, demo = false }) {
  const [toasts, setToasts] = useState2([]);
  const [mounted, setMounted] = useState2(false);
  useEffect2(() => setMounted(true), []);
  const dismiss = useCallback2((id) => setToasts((current) => current.filter((toast2) => toast2.id !== id)), []);
  const toast = useCallback2((variant, title, description, options) => {
    const detalles = description && typeof description === "object" && !isValidElement(description) ? description : options;
    const texto = detalles === description ? void 0 : description;
    const id = `toast-${++toastCounter}`;
    const variantResolved = TOAST_ICON[variant] ? variant : "info";
    const persistent = detalles?.persistent ?? variantResolved === "error";
    const duration = Math.max(0, Number(detalles?.duration ?? 4e3));
    setToasts((current) => [...current, { id, variant: variantResolved, title, description: texto, persistent, duration }]);
  }, []);
  useEffect2(() => {
    if (!demo) return void 0;
    let ultimo = 0;
    const aviso = () => {
      const ahora = Date.now();
      if (ahora - ultimo < 2500) return;
      ultimo = ahora;
      toast("info", "Cambio simulado en la demo", "El dato qued\xF3 solo en este navegador: no se guard\xF3 en la tienda real.");
    };
    window.addEventListener("mobos:demo-guardado", aviso);
    return () => window.removeEventListener("mobos:demo-guardado", aviso);
  }, [demo, toast]);
  const value = useMemo(() => ({
    success: (title, description, options) => toast("success", title, description, options),
    error: (title, description, options) => toast("error", title, description, options),
    info: (title, description, options) => toast("info", title, description, options)
  }), [toast]);
  if (!mounted) return children;
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsx2("div", { className: "pointer-events-none fixed bottom-4 left-4 right-4 z-[60] flex max-w-sm flex-col gap-2 sm:left-auto sm:w-full", children: toasts.map((item) => /* @__PURE__ */ jsx2(ToastItem, { toast: item, dismiss, demo }, item.id)) })
  ] });
}
function useToast() {
  const context = useContext(ToastContext);
  if (!context) return { success: () => {
  }, error: () => {
  }, info: () => {
  } };
  return context;
}
function Skeleton({ className }) {
  return /* @__PURE__ */ jsx2("div", { className: cn("animate-pulse rounded-lg bg-fore/5", className), "aria-hidden": "true" });
}
function EmptyState({ icon = "box", title, description, action, compact = false, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col items-center justify-center px-6 text-center", compact ? "py-6" : "py-12", className), children: [
    /* @__PURE__ */ jsx2("div", { className: "grid h-12 w-12 place-items-center rounded-2xl border border-ink-500 bg-ink-700 text-mute", children: /* @__PURE__ */ jsx2(Icon, { name: icon, className: "h-5 w-5" }) }),
    title && /* @__PURE__ */ jsx2("p", { className: "mt-3 text-sm font-semibold text-fore", children: title }),
    description && /* @__PURE__ */ jsx2("p", { className: "mt-1 max-w-xs text-xs leading-5 text-mute", children: description }),
    action && /* @__PURE__ */ jsx2("div", { className: "mt-4", children: action })
  ] });
}
function ErrorState({ title = "Algo sali\xF3 mal", description, onRetry, compact = false, role, className }) {
  return /* @__PURE__ */ jsxs("div", { role, className: cn("flex flex-col items-center justify-center px-6 text-center", compact ? "py-6" : "py-12", className), children: [
    /* @__PURE__ */ jsx2("div", { className: "grid h-12 w-12 place-items-center rounded-2xl border border-bad/25 bg-bad/10 text-bad-text", children: /* @__PURE__ */ jsx2(Icon, { name: "alert", className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx2("p", { className: "mt-3 text-sm font-semibold text-fore", children: title }),
    description && /* @__PURE__ */ jsx2("p", { className: "mt-1 max-w-xs text-xs leading-5 text-mute", children: description }),
    onRetry && /* @__PURE__ */ jsx2(Button, { type: "button", variant: "outline", onClick: onRetry, className: "mt-4", children: "Reintentar" })
  ] });
}
function SectionState({ estado = "vacio", title, description, icon = "box", action, compact = false, onRetry, className }) {
  if (estado === "cargando") {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        role: "status",
        "aria-busy": "true",
        "aria-label": title || "Cargando\u2026",
        className: cn("flex flex-col items-center justify-center px-6 text-center", compact ? "py-6" : "py-12", className),
        children: [
          /* @__PURE__ */ jsx2(Skeleton, { className: "h-12 w-12 rounded-2xl" }),
          /* @__PURE__ */ jsx2(Skeleton, { className: "mt-3 h-4 w-36" }),
          description ? /* @__PURE__ */ jsx2(Skeleton, { className: "mt-2 h-3 w-52" }) : null
        ]
      }
    );
  }
  if (estado === "error") {
    return /* @__PURE__ */ jsx2(ErrorState, { title, description, onRetry, compact, role: "alert", className });
  }
  return /* @__PURE__ */ jsx2(EmptyState, { icon, title, description, action, compact, className });
}
var AVISOS = {
  error: "border-bad/30 bg-bad/10 text-bad-text",
  ok: "border-ok/30 bg-ok/10 text-ok-text",
  warn: "border-warn/30 bg-warn/10 text-warn-text"
};
function Aviso({ tono = "error", como = "p", compact = false, className, children, ...props }) {
  const Etiqueta = como === "div" ? "div" : "p";
  return /* @__PURE__ */ jsx2(
    Etiqueta,
    {
      role: tono === "error" ? "alert" : "status",
      className: cn("rounded-lg border", compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-sm", AVISOS[tono], className),
      ...props,
      children
    }
  );
}
var NOTAS = {
  warn: "border-warn/30 bg-warn/10",
  info: "border-info/25 bg-info/10",
  neutro: "border-ink-600 bg-ink-800/40"
};
function Nota({ tono = "warn", como = "p", compact = false, className, children, ...props }) {
  const Etiqueta = como === "div" ? "div" : "p";
  return /* @__PURE__ */ jsx2(
    Etiqueta,
    {
      className: cn("border text-mute", compact ? "rounded-lg p-2 text-xs" : "rounded-xl p-3 text-sm", NOTAS[tono] || NOTAS.warn, className),
      ...props,
      children
    }
  );
}
function PageHeader({ title, subtitle, actions, backTo, eyebrow, migas }) {
  const camino = Array.isArray(migas) ? migas.filter((paso) => paso?.etiqueta) : [];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
      backTo && /* @__PURE__ */ jsx2(
        "button",
        {
          type: "button",
          onClick: backTo,
          className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-interactivo text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore",
          "aria-label": "Volver",
          children: /* @__PURE__ */ jsx2(Icon, { name: "back", className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        camino.length > 0 && /* @__PURE__ */ jsx2("nav", { "aria-label": "Miga de secci\xF3n", className: "mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-mute", children: camino.map((paso, indice) => {
          const ultimo = indice === camino.length - 1;
          return /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-1.5", children: [
            paso.href && !ultimo ? /* @__PURE__ */ jsx2("a", { href: paso.href, className: "truncate transition hover:text-fore", children: paso.etiqueta }) : /* @__PURE__ */ jsx2("span", { className: cn("truncate", ultimo && "font-semibold text-fore"), "aria-current": ultimo ? "page" : void 0, children: paso.etiqueta }),
            !ultimo && /* @__PURE__ */ jsx2(Icon, { name: "chevron", className: "h-3 w-3 shrink-0 -rotate-90 text-mute", "aria-hidden": true })
          ] }, `${paso.etiqueta}-${indice}`);
        }) }),
        eyebrow && /* @__PURE__ */ jsx2(Eyebrow, { children: eyebrow }),
        /* @__PURE__ */ jsx2("h1", { className: "truncate text-2xl font-bold", children: title }),
        subtitle && /* @__PURE__ */ jsx2("p", { className: "mt-1 truncate text-sm text-mute", children: subtitle })
      ] })
    ] }),
    actions && /* @__PURE__ */ jsx2("div", { className: "flex shrink-0 flex-wrap items-center gap-2", children: actions })
  ] });
}
function DataTable({ columns, rows, emptyLabel = "Sin datos para mostrar.", loading = false, mobileCard, encabezadoFijo = false, caption = "Datos", getRowKey, className }) {
  const claveDeFila = (row, index) => getRowKey?.(row, index) ?? row?.id ?? row?.key ?? index;
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: cn("space-y-2 p-4", className), role: "status", "aria-busy": "true", children: [
      /* @__PURE__ */ jsx2("span", { className: "sr-only", children: "Cargando datos\u2026" }),
      /* @__PURE__ */ jsx2(Skeleton, { className: "h-4 w-1/3" }),
      /* @__PURE__ */ jsx2(Skeleton, { className: "h-10 w-full" }),
      /* @__PURE__ */ jsx2(Skeleton, { className: "h-10 w-full" }),
      /* @__PURE__ */ jsx2(Skeleton, { className: "h-10 w-full" })
    ] });
  }
  if (!rows?.length) return /* @__PURE__ */ jsx2(EmptyState, { title: emptyLabel, description: "", className });
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx2("div", { className: "hidden overflow-x-auto md:block", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      caption ? /* @__PURE__ */ jsx2("caption", { className: "sr-only", children: caption }) : null,
      /* @__PURE__ */ jsx2("thead", { className: cn("select-none bg-ink-800", encabezadoFijo && "sticky top-12 z-10"), children: /* @__PURE__ */ jsx2("tr", { className: "border-b border-ink-600 text-left text-xs uppercase tracking-wider text-mute", children: columns.map((column) => /* @__PURE__ */ jsx2("th", { scope: "col", className: cn("px-2.5 py-1.5 font-medium", column.align === "right" && "text-right", column.align === "center" && "text-center"), children: column.label }, column.key)) }) }),
      /* @__PURE__ */ jsx2("tbody", { children: rows.map((row, index) => /* @__PURE__ */ jsx2("tr", { className: "border-b border-ink-600/60 last:border-0", children: columns.map((column) => /* @__PURE__ */ jsx2("td", { className: cn("px-2.5 py-1.5 text-fore", column.align === "right" && "text-right", column.align === "center" && "text-center"), children: column.render ? column.render(row) : row[column.key] }, column.key)) }, claveDeFila(row, index))) })
    ] }) }),
    /* @__PURE__ */ jsx2("div", { className: "grid grid-cols-1 gap-2 p-2.5 md:hidden", children: mobileCard ? rows.map((row, index) => /* @__PURE__ */ jsx2("div", { children: mobileCard(row) }, claveDeFila(row, index))) : rows.map((row, index) => /* @__PURE__ */ jsx2("dl", { className: "rounded-xl border border-ink-600 bg-ink-800 p-3 shadow-card", children: columns.filter((column) => column.mobile !== false).map((column) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 border-b border-ink-600/60 py-2 first:pt-0 last:border-0 last:pb-0", children: [
      /* @__PURE__ */ jsx2("dt", { className: "text-xs font-medium text-mute", children: column.label }),
      /* @__PURE__ */ jsx2("dd", { className: cn("min-w-0 text-right text-sm text-fore", column.align === "left" && "text-left"), children: column.render ? column.render(row) : row[column.key] })
    ] }, column.key)) }, claveDeFila(row, index))) })
  ] });
}
function mergeIds(...values) {
  return [...new Set(values.flatMap((value) => String(value || "").split(/\s+/)).filter(Boolean))].join(" ") || void 0;
}
function relacionarControl(children, { htmlFor, mensajeId, error }, estado = { aplicado: false }) {
  return Children.map(children, (child) => {
    if (!isValidElement(child) || estado.aplicado) return child;
    const esNativo = ["input", "select", "textarea"].includes(child.type);
    const coincideId = Boolean(htmlFor && child.props.id === htmlFor);
    const esComponenteDirecto = typeof child.type !== "string" && !child.props.children;
    if (coincideId || !htmlFor && (esNativo || esComponenteDirecto)) {
      estado.aplicado = true;
      return cloneElement(child, {
        "aria-describedby": mensajeId ? mergeIds(child.props["aria-describedby"], mensajeId) : child.props["aria-describedby"],
        "aria-invalid": error ? true : child.props["aria-invalid"]
      });
    }
    if (child.props.children) {
      return cloneElement(child, void 0, relacionarControl(child.props.children, { htmlFor, mensajeId, error }, estado));
    }
    return child;
  });
}
function FormField({ label, hint, error, children, htmlFor, descripcionId, accion, className }) {
  const mensajeId = descripcionId || (htmlFor ? `${htmlFor}-descripcion` : void 0);
  const control = (error || hint) && mensajeId ? relacionarControl(children, { htmlFor, mensajeId, error }) : children;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    label && /* @__PURE__ */ jsx2(Label, { htmlFor, children: label }),
    accion ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-stretch gap-2", children: [
      /* @__PURE__ */ jsx2("div", { className: "min-w-0 flex-1", children: control }),
      /* @__PURE__ */ jsx2("div", { className: "flex shrink-0 items-stretch", children: accion })
    ] }) : control,
    error ? /* @__PURE__ */ jsx2("p", { id: mensajeId, role: "alert", className: "mt-1.5 text-xs text-bad-text", children: error }) : hint ? /* @__PURE__ */ jsx2("p", { id: mensajeId, className: "mt-1.5 text-xs text-mute", children: hint }) : null
  ] });
}
function Stat({ label, valor, delta, sub, nota, tono, destacado = false, deltaComo = "texto", barra, className }) {
  const sube = typeof delta === "number" && delta >= 0;
  const colorValor = destacado ? "text-onbrand" : tono ? textoDeTono(tono) : "text-fore";
  const colorBarra = { fono: "bg-fono", ok: "bg-ok", bad: "bg-bad", warn: "bg-warn", info: "bg-info" }[barra] || "bg-fono";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative overflow-hidden rounded-xl border p-4",
        destacado ? "border-fono/30 bg-gradient-to-br from-fono-dark via-fono to-fono" : "border-ink-600 bg-ink-800",
        className
      ),
      children: [
        /* @__PURE__ */ jsx2("div", { className: cn("text-[11px] font-medium uppercase tracking-wider", destacado ? "text-onbrand/75" : "text-mute"), children: label }),
        /* @__PURE__ */ jsx2("div", { className: cn("v2-numero mt-1.5 text-2xl font-semibold md:text-3xl", colorValor), children: valor }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-2 text-xs", children: [
          typeof delta === "number" && (deltaComo === "chip" ? /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium", sube ? "bg-ok/15 text-ok-text" : "bg-bad/15 text-bad-text"), children: [
            sube ? "\u2191" : "\u2193",
            " ",
            Math.abs(delta).toFixed(1),
            "%"
          ] }) : /* @__PURE__ */ jsxs("span", { className: cn("font-medium", sube ? "text-ok-text" : "text-bad-text"), children: [
            sube ? "\u2191" : "\u2193",
            " ",
            Math.abs(delta).toFixed(1),
            "%"
          ] })),
          typeof delta !== "number" && barra && /* @__PURE__ */ jsx2("span", { className: cn("h-0.5 w-4 rounded-full", colorBarra), "aria-hidden": "true" }),
          sub && /* @__PURE__ */ jsx2("span", { className: destacado ? "text-onbrand/75" : "text-mute", children: sub })
        ] }),
        nota && /* @__PURE__ */ jsx2("div", { className: cn("mt-1 text-[11px]", destacado ? "text-onbrand/75" : "text-mute"), children: nota })
      ]
    }
  );
}
function Subtabs({ value, onChange, items = [], className, ariaLabel = "Secciones" }) {
  const baseId = useId();
  const refs = useRef2([]);
  if (!items.length) return null;
  function mover(event, indice) {
    let siguiente;
    if (event.key === "ArrowRight") siguiente = (indice + 1) % items.length;
    else if (event.key === "ArrowLeft") siguiente = (indice - 1 + items.length) % items.length;
    else if (event.key === "Home") siguiente = 0;
    else if (event.key === "End") siguiente = items.length - 1;
    else return;
    event.preventDefault();
    const id = items[siguiente]?.[0];
    onChange?.(id);
    requestAnimationFrame(() => refs.current[siguiente]?.focus());
  }
  return /* @__PURE__ */ jsx2("div", { className: cn("mb-5 flex flex-wrap gap-2 rounded-2xl border border-fore/10 bg-ink p-2", className), role: "tablist", "aria-label": ariaLabel, children: items.map(([id, label, contador], indice) => {
    const numero = Number(contador);
    const tieneContador = contador !== void 0 && contador !== null && contador !== "" && Number.isFinite(numero);
    return /* @__PURE__ */ jsxs(
      "button",
      {
        id: `${baseId}-tab-${id}`,
        ref: (node) => {
          refs.current[indice] = node;
        },
        type: "button",
        role: "tab",
        "aria-selected": value === id,
        tabIndex: value === id ? 0 : -1,
        onKeyDown: (event) => mover(event, indice),
        onClick: () => onChange(id),
        className: cn(
          "min-h-11 rounded-xl px-3 py-2 text-sm font-medium transition",
          value === id ? "bg-fono text-onbrand" : "text-mute hover:bg-fore/5 hover:text-fore"
        ),
        children: [
          label,
          tieneContador && /* @__PURE__ */ jsx2("span", { className: cn("ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums", value === id ? "bg-black/10" : "bg-ink-700 text-mute"), children: numero })
        ]
      },
      id
    );
  }) });
}
var TONOS_VALOR = { ok: "text-ok-text", warn: "text-warn-text", bad: "text-bad-text", mute: "text-mute" };
function FilaDato({ etiqueta, valor, tono = "", etiquetaComo: Etiqueta = "span", valorComo: Valor = "span", className, valorClassName, children }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center justify-between gap-3", className), children: [
    /* @__PURE__ */ jsx2(Etiqueta, { className: "min-w-0 text-mute", children: etiqueta ?? children }),
    /* @__PURE__ */ jsx2(Valor, { className: cn("shrink-0 font-semibold tabular-nums", TONOS_VALOR[tono], valorClassName), children: valor })
  ] });
}
function CeldaMoneda({ valor, tono = "", currency = "PYG", simbolo, className, children }) {
  return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex shrink-0 items-center justify-end gap-1 font-semibold tabular-nums", TONOS_VALOR[tono], className), children: [
    /* @__PURE__ */ jsx2(Money, { value: Number(valor || 0), currency, simbolo }),
    children
  ] });
}
var TONOS_BARRA = { fono: "bg-fono", ok: "bg-ok", warn: "bg-warn", bad: "bg-bad", mute: "bg-mute", onbrand: "bg-onbrand" };
var ALTURAS_BARRA = { sm: "h-1", md: "h-1.5", lg: "h-2.5" };
function BarraProgreso({ valor = 0, max = 100, tono = "fono", alto = "md", etiqueta, pista, relleno, className }) {
  const total = Number(max) > 0 ? Number(max) : 100;
  const porcentaje = Math.min(100, Math.max(0, (Number(valor) || 0) / total * 100));
  return /* @__PURE__ */ jsx2(
    "div",
    {
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(porcentaje),
      "aria-label": etiqueta,
      className: cn("overflow-hidden rounded-full bg-fore/10", ALTURAS_BARRA[alto] || ALTURAS_BARRA.md, pista, className),
      children: /* @__PURE__ */ jsx2("span", { className: cn("block h-full rounded-full transition-[width] duration-500 ease-out", TONOS_BARRA[tono] || TONOS_BARRA.fono, relleno), style: { width: `${porcentaje}%` } })
    }
  );
}

// src/hooks/useComboboxNavigation.js
import { useEffect as useEffect3, useId as useId2, useMemo as useMemo2, useRef as useRef3, useState as useState3 } from "react";
function hashOption(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
function useComboboxNavigation({
  options = [],
  open,
  onOpenChange,
  onSelect,
  getOptionKey = (option, index) => option?.id ?? option?.value ?? option?.label ?? index,
  selectedKey,
  listboxId,
  defaultActiveIndex = 0
} = {}) {
  const generatedId = useId2();
  const resolvedListboxId = listboxId || `${generatedId}-listbox`;
  const [activeIndex, setActiveIndex] = useState3(defaultActiveIndex);
  const listRef = useRef3(null);
  const inputRef = useRef3(null);
  const optionIds = useMemo2(() => {
    const seen = /* @__PURE__ */ new Map();
    return options.map((option, index) => {
      const base = hashOption(getOptionKey(option, index));
      const occurrence = seen.get(base) || 0;
      seen.set(base, occurrence + 1);
      return `${resolvedListboxId}-option-${base}${occurrence ? `-${occurrence}` : ""}`;
    });
  }, [options, getOptionKey, resolvedListboxId]);
  useEffect3(() => {
    if (!options.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((current) => Math.min(Math.max(0, current), options.length - 1));
  }, [options.length]);
  useEffect3(() => {
    if (!open) return;
    const optionId = optionIds[activeIndex];
    if (!optionId) return;
    document.getElementById(optionId)?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, open, optionIds]);
  function selectIndex(index) {
    const option = options[index];
    if (option === void 0) return false;
    onSelect?.(option, index);
    return true;
  }
  function onKeyDown(event) {
    const count = options.length;
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        onOpenChange?.(false);
      }
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        const next = event.key === "ArrowDown" ? 0 : Math.max(0, count - 1);
        setActiveIndex(next);
        onOpenChange?.(true);
        return;
      }
      if (!count) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + delta + count) % count);
      return;
    }
    if (!open || !count) return;
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : count - 1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      selectIndex(activeIndex);
    }
  }
  const activeOptionId = open ? optionIds[activeIndex] : void 0;
  return {
    activeIndex,
    activeOptionId,
    inputRef,
    listRef,
    listboxId: resolvedListboxId,
    setActiveIndex,
    selectIndex,
    inputProps: {
      ref: inputRef,
      role: "combobox",
      "aria-expanded": Boolean(open),
      "aria-controls": resolvedListboxId,
      "aria-autocomplete": "list",
      "aria-activedescendant": activeOptionId,
      onKeyDown
    },
    listboxProps: {
      id: resolvedListboxId,
      ref: listRef,
      role: "listbox"
    },
    getOptionProps(index) {
      const option = options[index];
      const key = getOptionKey(option, index);
      return {
        id: optionIds[index],
        role: "option",
        "aria-selected": selectedKey !== void 0 ? key === selectedKey : index === activeIndex,
        onMouseDown: (event) => event.preventDefault(),
        onMouseEnter: () => setActiveIndex(index),
        onClick: () => selectIndex(index)
      };
    }
  };
}

// src/components/Switch.jsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Switch({ checked, onChange, disabled = false, id, ariaLabel, className, ...props }) {
  return /* @__PURE__ */ jsxs2("span", { className: cn("relative inline-flex h-5 w-9 shrink-0 items-center", className), children: [
    /* @__PURE__ */ jsx3(
      "input",
      {
        id,
        type: "checkbox",
        role: "switch",
        "aria-checked": Boolean(checked),
        "aria-label": ariaLabel,
        checked: Boolean(checked),
        disabled,
        onChange,
        className: "peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed",
        ...props
      }
    ),
    /* @__PURE__ */ jsx3(
      "span",
      {
        "aria-hidden": "true",
        className: cn(
          "pointer-events-none absolute inset-0 rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-fono/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper",
          checked ? "border-fono bg-fono" : "border-ink-500 bg-ink-600",
          disabled && "opacity-50"
        )
      }
    ),
    /* @__PURE__ */ jsx3(
      "span",
      {
        "aria-hidden": "true",
        className: cn(
          "pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4"
        )
      }
    )
  ] });
}

// src/components/Checkbox.jsx
import { useId as useId3 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function Checkbox({
  checked,
  onChange,
  label,
  descripcion,
  variante = "simple",
  tono = "fono",
  disabled = false,
  id,
  ariaLabel,
  className,
  ...props
}) {
  const generado = useId3();
  const campoId = id || generado;
  const control = /* @__PURE__ */ jsx4(
    "input",
    {
      id: campoId,
      type: "checkbox",
      checked: Boolean(checked),
      disabled,
      onChange,
      "aria-label": label ? void 0 : ariaLabel,
      className: cn(
        "h-4 w-4 shrink-0 rounded border-ink-500 accent-fono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fono/40 disabled:cursor-not-allowed disabled:opacity-50",
        tono === "bad" && "accent-bad"
      ),
      ...props
    }
  );
  if (!label) return /* @__PURE__ */ jsx4("span", { className: cn("inline-flex items-center", className), children: control });
  if (variante === "tarjeta") {
    return /* @__PURE__ */ jsxs3(
      "label",
      {
        htmlFor: campoId,
        className: cn(
          "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-ink-600 p-3 transition has-[:focus-visible]:border-fono",
          disabled && "cursor-not-allowed opacity-60",
          className
        ),
        children: [
          /* @__PURE__ */ jsx4("span", { className: "mt-0.5 flex shrink-0", children: control }),
          /* @__PURE__ */ jsxs3("span", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx4("span", { className: "block text-sm font-semibold", children: label }),
            descripcion && /* @__PURE__ */ jsx4("span", { className: "mt-0.5 block text-xs text-mute", children: descripcion })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs3(
    "label",
    {
      htmlFor: campoId,
      className: cn(
        "flex min-h-11 cursor-pointer items-center gap-2 text-sm",
        disabled && "cursor-not-allowed opacity-60",
        className
      ),
      children: [
        control,
        /* @__PURE__ */ jsx4("span", { className: "min-w-0", children: label })
      ]
    }
  );
}

// src/components/SearchField.jsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var SearchField = forwardRef2(function SearchField2({ value = "", onChange, onClear, placeholder, ariaLabel, className, disabled = false, ...props }, ref) {
  function limpiar() {
    if (onClear) onClear();
    else onChange?.({ target: { value: "" } });
  }
  return /* @__PURE__ */ jsxs4("div", { className: cn("relative min-w-0", className), children: [
    /* @__PURE__ */ jsx5(Icon, { name: "search", className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx5(
      Input,
      {
        ref,
        value,
        onChange,
        placeholder,
        "aria-label": ariaLabel || placeholder,
        disabled,
        className: "pl-9 pr-9",
        ...props
      }
    ),
    value ? /* @__PURE__ */ jsx5(
      "button",
      {
        type: "button",
        onClick: limpiar,
        disabled,
        className: "absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-mute transition hover:bg-ink-700 hover:text-fore disabled:opacity-40",
        "aria-label": "Limpiar b\xFAsqueda",
        title: "Limpiar b\xFAsqueda",
        children: /* @__PURE__ */ jsx5(Icon, { name: "close", className: "h-3.5 w-3.5" })
      }
    ) : null
  ] });
});
var SearchField_default = SearchField;

// src/components/BotonDentroCampo.jsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function BotonDentroCampo({
  etiqueta,
  titulo: titulo2,
  etiquetaOcupada = "Consultando\u2026",
  icono = "search",
  ocupado = false,
  disabled = false,
  onClick,
  className = ""
}) {
  return /* @__PURE__ */ jsx6(
    "button",
    {
      type: "button",
      onClick,
      disabled: disabled || ocupado,
      "aria-label": ocupado ? etiquetaOcupada : etiqueta,
      "aria-busy": ocupado || void 0,
      title: ocupado ? etiquetaOcupada : titulo2 || etiqueta,
      className: cn(
        "absolute inset-y-0 right-0 flex items-center rounded-r-lg text-mute transition hover:text-fore focus-visible:z-10",
        "disabled:cursor-not-allowed disabled:opacity-40",
        ocupado ? "gap-2 bg-ink-700 px-3 text-xs font-semibold text-fono-light" : "w-11 justify-center",
        className
      ),
      children: ocupado ? /* @__PURE__ */ jsxs5(Fragment2, { children: [
        /* @__PURE__ */ jsx6("span", { "aria-hidden": "true", className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink-500 border-t-fono-light" }),
        etiquetaOcupada
      ] }) : /* @__PURE__ */ jsx6(Icon, { name: icono, className: "h-4 w-4" })
    }
  );
}

// src/components/SegmentedField.jsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function SegmentedField({ value, onChange, options = [], ariaLabel, className }) {
  if (!options.length) return null;
  return /* @__PURE__ */ jsx7("div", { className: cn("flex flex-wrap gap-1 rounded-xl border border-ink-600 bg-ink-800 p-1", className), role: "group", "aria-label": ariaLabel, children: options.map(([id, label, icon, contador]) => {
    const activo = value === id;
    return /* @__PURE__ */ jsxs6(
      "button",
      {
        type: "button",
        "aria-pressed": activo,
        "aria-label": contador === void 0 ? label : `${label} (${contador})`,
        title: label,
        onClick: () => onChange(id),
        className: cn(
          "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition",
          activo ? "bg-fono/15 text-fono-text" : "text-mute hover:bg-fore/5 hover:text-fore"
        ),
        children: [
          icon && /* @__PURE__ */ jsx7(Icon, { name: icon, className: "h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsx7("span", { className: "min-w-0 truncate", children: label }),
          contador !== void 0 && /* @__PURE__ */ jsx7("span", { className: "text-xs opacity-75", children: contador })
        ]
      },
      id
    );
  }) });
}

// src/components/PercentField.jsx
import { jsx as jsx8 } from "react/jsx-runtime";
function parsePercent(valor) {
  const texto = String(valor ?? "").trim().replace(",", ".");
  if (texto === "" || texto === ".") return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}
function formatPercent(valor) {
  if (valor === null || valor === void 0 || valor === "") return "";
  const numero = Number(String(valor).replace(",", "."));
  if (!Number.isFinite(numero)) return "";
  return String(Math.round(numero * 100) / 100).replace(".", ",");
}
function limpiarPercent(valor, max = 100) {
  const texto = String(valor ?? "").replace(/\./g, ",").replace(/[^\d,]/g, "");
  const [entera = "", ...resto] = texto.split(",");
  const digitos = entera.slice(0, String(max).length);
  if (!resto.length) return digitos.slice(0, 6);
  return `${digitos},${resto.join("").slice(0, 2)}`.slice(0, 6);
}
function PercentField({
  value = "",
  onChange,
  onValueChange,
  disabled = false,
  placeholder = "0",
  max = 100,
  className,
  id,
  ...props
}) {
  function notificar(siguiente) {
    onChange?.(siguiente);
    if (onValueChange && onValueChange !== onChange) onValueChange(siguiente);
  }
  return /* @__PURE__ */ jsx8(
    Input,
    {
      id,
      className: cn(TAMANOS_CAMPO.porcentaje, className),
      type: "text",
      inputMode: "decimal",
      autoComplete: "off",
      maxLength: 6,
      disabled,
      placeholder,
      ...props,
      value: limpiarPercent(value, max),
      onChange: (event) => notificar(limpiarPercent(event.target.value, max))
    }
  );
}

// src/components/CurrencySelect.jsx
import { jsx as jsx9 } from "react/jsx-runtime";
var MONEDAS = [
  ["PYG", "PYG \xB7 Gs"],
  ["USD", "USD \xB7 D\xF3lares"],
  ["BRL", "BRL \xB7 Reales"],
  ["EUR", "EUR \xB7 Euros"],
  ["USDT", "USDT \xB7 Tether"]
];
function CurrencySelect({ value, onChange, className, excluir = [], ...props }) {
  const monedas = MONEDAS.filter(([code]) => !excluir.includes(code));
  return /* @__PURE__ */ jsx9(Select, { value, onChange, className, ...props, children: monedas.map(([code, label]) => /* @__PURE__ */ jsx9("option", { value: code, children: label }, code)) });
}

// src/components/ListGridToggle.jsx
import { jsx as jsx10 } from "react/jsx-runtime";
var OPTIONS = [
  { key: "list", icon: "list", label: "Ver como lista" },
  { key: "grid", icon: "grid", label: "Ver como cuadr\xEDcula" }
];
function ListGridToggle({ value, onChange, className }) {
  return /* @__PURE__ */ jsx10("div", { className: cn("flex select-none overflow-hidden rounded-lg border border-ink-600 bg-ink-800", className), role: "group", "aria-label": "Cambiar vista", children: OPTIONS.map((option) => /* @__PURE__ */ jsx10(
    "button",
    {
      type: "button",
      title: option.label,
      "aria-label": option.label,
      "aria-pressed": value === option.key,
      onClick: () => onChange(option.key),
      className: cn("toque-44 grid h-9 w-9 place-items-center transition", value === option.key ? "bg-fono/15 text-fono-text" : "text-mute hover:text-fore"),
      children: /* @__PURE__ */ jsx10(Icon, { name: option.icon, className: "h-4 w-4" })
    },
    option.key
  )) });
}

// src/components/PeriodoTabs.jsx
import { jsx as jsx11 } from "react/jsx-runtime";
var PERIODOS = [
  ["dia", "D\xEDa"],
  ["semana", "Semana"],
  ["mes", "Mes"],
  ["anio", "A\xF1o"]
];
function PeriodoTabs({ periodo, setPeriodo, periodos = PERIODOS, ariaLabel = "Per\xEDodo", className }) {
  return /* @__PURE__ */ jsx11(SegmentedField, { value: periodo, onChange: setPeriodo, options: periodos, ariaLabel, className });
}

// src/components/NumericKeypad.jsx
import { jsx as jsx12, jsxs as jsxs7 } from "react/jsx-runtime";
var TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"];
function NumericKeypad({ value = "", onChange, max, className, ariaLabel = "Teclado num\xE9rico de cobro" }) {
  function agregar(tecla) {
    const siguiente = `${value || ""}${tecla}`.replace(/^0+(?=\d)/, "");
    onChange(max ? siguiente.slice(0, max) : siguiente);
  }
  return /* @__PURE__ */ jsxs7("div", { role: "group", className: className ?? "mt-2 grid max-w-[19rem] grid-cols-3 gap-2", "aria-label": ariaLabel, children: [
    TECLAS.map((tecla) => /* @__PURE__ */ jsx12(
      "button",
      {
        type: "button",
        onClick: () => agregar(tecla),
        className: "min-h-11 rounded-xl border border-fore/10 bg-fore/[.04] text-lg font-semibold text-fore transition hover:border-fono/60 hover:bg-fono/10 active:scale-[.97]",
        "aria-label": `Agregar ${tecla}`,
        children: tecla
      },
      tecla
    )),
    /* @__PURE__ */ jsx12(
      "button",
      {
        type: "button",
        onClick: () => onChange((value || "").slice(0, -1)),
        className: "min-h-11 rounded-xl border border-fore/10 bg-fore/[.04] text-mute transition hover:border-fono/60 hover:bg-fono/10 active:scale-[.97]",
        "aria-label": "Borrar \xFAltimo d\xEDgito",
        children: /* @__PURE__ */ jsx12(Icon, { name: "backspace", className: "mx-auto h-5 w-5" })
      }
    )
  ] });
}

// src/components/BarraLote.jsx
import { jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
function BarraLote({ cantidad = 0, onLimpiar, children, etiqueta, className }) {
  if (!cantidad) return null;
  return /* @__PURE__ */ jsxs8("div", { className: className ?? "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-fono/30 bg-fono/5 px-3 py-2 text-sm", children: [
    /* @__PURE__ */ jsx13("span", { className: "font-medium", children: etiqueta ?? `${cantidad} seleccionada(s)` }),
    /* @__PURE__ */ jsxs8("span", { className: "flex flex-wrap items-center gap-2", children: [
      children,
      onLimpiar ? /* @__PURE__ */ jsx13(Button, { variant: "ghost", className: "h-8 px-2 text-xs", onClick: onLimpiar, children: "Limpiar" }) : null
    ] })
  ] });
}

// src/components/EmailField.jsx
import { useRef as useRef4, useState as useState4 } from "react";
import { jsx as jsx14, jsxs as jsxs9 } from "react/jsx-runtime";
var DOMINIOS_EMAIL = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "hotmail.es",
  "outlook.es"
];
var MAX_SUGERENCIAS = 4;
function sugerenciasDe(value, dominios = DOMINIOS_EMAIL, max = MAX_SUGERENCIAS) {
  const texto = String(value || "").trim();
  const arroba = texto.indexOf("@");
  const usuario = arroba === -1 ? texto : texto.slice(0, arroba);
  const dominio = arroba === -1 ? "" : texto.slice(arroba + 1).toLowerCase();
  if (!usuario) return [];
  if (dominio.includes(" ")) return [];
  const coincidencias = dominio ? dominios.filter((candidato) => candidato.startsWith(dominio) && candidato !== dominio) : dominios;
  return coincidencias.slice(0, max).map((d) => `${usuario}@${d}`);
}
function EmailField({
  value = "",
  onChange,
  disabled = false,
  placeholder = "vos@tutienda.com",
  dominios = DOMINIOS_EMAIL,
  sugerir = true,
  className,
  inputClassName,
  onKeyDown,
  onBlur,
  ...props
}) {
  const [open, setOpen] = useState4(false);
  const tecleando = useRef4(false);
  const tipeoReciente = useRef4(false);
  const inputRef = useRef4(null);
  const sugerencias = sugerenciasDe(value, dominios);
  function elegir(sugerencia) {
    onChange?.(sugerencia);
    tecleando.current = false;
    setOpen(false);
    inputRef.current?.focus();
  }
  const listaVisible = sugerir && open && tecleando.current && sugerencias.length > 0;
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: setOpen,
    onSelect: elegir,
    getOptionKey: (sugerencia) => sugerencia
  });
  function asignarInput(node) {
    inputRef.current = node;
    navegacion.inputRef.current = node;
  }
  function manejarKeyDown(event) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") tecleando.current = true;
    navegacion.inputProps.onKeyDown(event);
    if (event.key === "Escape") {
      tecleando.current = false;
      return;
    }
    if (["Enter", "ArrowDown", "ArrowUp", "Home", "End", "Tab"].includes(event.key)) return;
    tecleando.current = true;
    tipeoReciente.current = true;
  }
  function manejarChange(event) {
    onChange?.(event.target.value);
    if (tipeoReciente.current) {
      tipeoReciente.current = false;
      setOpen(sugerir && sugerenciasDe(event.target.value, dominios).length > 0);
    }
  }
  function perderFoco(event) {
    onBlur?.(event);
    tecleando.current = false;
    setOpen(false);
  }
  return /* @__PURE__ */ jsxs9("div", { className: cn("relative", className), children: [
    /* @__PURE__ */ jsx14(
      Input,
      {
        ...props,
        ref: asignarInput,
        type: "email",
        className: cn("w-full", inputClassName),
        value,
        disabled,
        placeholder,
        onChange: manejarChange,
        onKeyDown: manejarKeyDown,
        onBlur: perderFoco,
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": navegacion.listboxId,
        "aria-autocomplete": "list",
        "aria-activedescendant": navegacion.activeOptionId
      }
    ),
    listaVisible && /* @__PURE__ */ jsx14(
      "ul",
      {
        ...navegacion.listboxProps,
        "aria-label": "Sugerencias de correo",
        className: "absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-ink-500 bg-ink shadow-float",
        children: sugerencias.map((sugerencia, indice) => /* @__PURE__ */ jsx14(
          "li",
          {
            ...navegacion.getOptionProps(indice),
            className: cn(
              "min-h-11 cursor-pointer px-3 py-2 text-left text-sm text-fore transition",
              indice === navegacion.activeIndex ? "bg-ink-700" : "hover:bg-ink-700"
            ),
            children: sugerencia
          },
          sugerencia
        ))
      }
    )
  ] });
}

// src/components/PhoneField.jsx
import { useMemo as useMemo4, useState as useState6 } from "react";

// src/components/CountryPhoneSelect.jsx
import { useEffect as useEffect4, useId as useId4, useMemo as useMemo3, useRef as useRef5, useState as useState5 } from "react";

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
function resolverPaisesTelefono(countries, locale = "es") {
  return buscarPaisesTelefono("", countries, locale);
}

// src/components/CountryPhoneSelect.jsx
import { jsx as jsx15, jsxs as jsxs10 } from "react/jsx-runtime";
function CountryPhoneSelect({
  country = "PY",
  onChange,
  countries,
  locale = "es",
  disabled = false,
  ariaLabel = "C\xF3digo de pa\xEDs",
  searchPlaceholder = "Buscar pa\xEDs o c\xF3digo",
  customCountry,
  id,
  className
}) {
  const reactId = useId4();
  const baseId = id || `pais-telefono-${reactId.replace(/:/g, "")}`;
  const listId = `${baseId}-lista`;
  const triggerRef = useRef5(null);
  const searchRef = useRef5(null);
  const rootRef = useRef5(null);
  const [open, setOpen] = useState5(false);
  const [query, setQuery] = useState5("");
  const [activeIndex, setActiveIndex] = useState5(0);
  const catalog = useMemo3(() => {
    const base = resolverPaisesTelefono(countries, locale);
    if (!customCountry?.countryCode) return base;
    return [customCountry, ...base.filter((pais) => pais.country !== customCountry.country)];
  }, [countries, customCountry, locale]);
  const selected = catalog.find((pais) => pais.country === country) || paisTelefonoPorIso(country, locale) || paisTelefonoPorIso("PY", locale);
  const options = useMemo3(() => buscarPaisesTelefono(query, catalog, locale), [catalog, locale, query]);
  const activeOption = options[activeIndex];
  const close = (restoreFocus = false) => {
    setOpen(false);
    setQuery("");
    if (restoreFocus) setTimeout(() => triggerRef.current?.focus(), 0);
  };
  const openPicker = () => {
    if (disabled) return;
    setOpen(true);
    setQuery("");
    const selectedIndex = catalog.findIndex((pais) => pais.country === selected.country);
    setActiveIndex(Math.max(0, selectedIndex));
  };
  const choose = (pais) => {
    if (!pais) return;
    onChange?.(pais.country);
    close(true);
  };
  useEffect4(() => {
    if (!open) return void 0;
    searchRef.current?.focus();
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);
  useEffect4(() => {
    setActiveIndex((current) => Math.min(current, Math.max(0, options.length - 1)));
  }, [options.length]);
  const navigate = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key === "Tab") {
      setTimeout(() => close(false), 0);
      return;
    }
    if (!options.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + options.length) % options.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(activeOption);
    }
  };
  return /* @__PURE__ */ jsxs10("div", { ref: rootRef, className: `relative w-24 shrink-0 ${className || ""}`.trim(), children: [
    /* @__PURE__ */ jsxs10(
      "button",
      {
        ref: triggerRef,
        type: "button",
        role: "combobox",
        "aria-label": ariaLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": listId,
        disabled,
        onClick: () => open ? close(false) : openPicker(),
        onKeyDown: (event) => {
          if (["Enter", " ", "ArrowDown"].includes(event.key)) {
            event.preventDefault();
            openPicker();
          }
        },
        className: "flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-ink-500 bg-ink-800 px-2 text-sm text-fore outline-none transition hover:border-interactivo focus:border-fono focus:ring-1 focus:ring-fono/40 disabled:cursor-not-allowed disabled:opacity-50",
        children: [
          /* @__PURE__ */ jsx15("span", { "aria-hidden": "true", className: "text-base leading-none", children: selected.flag }),
          /* @__PURE__ */ jsx15("span", { className: "tabular-nums", children: selected.countryCode }),
          /* @__PURE__ */ jsx15("span", { "aria-hidden": "true", className: "text-[10px] text-mute", children: "\u25BE" })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsxs10("div", { className: "absolute left-0 top-full z-50 mt-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-ink-500 bg-ink-800 shadow-xl", children: [
      /* @__PURE__ */ jsx15("div", { className: "p-2", children: /* @__PURE__ */ jsx15(
        Input,
        {
          ref: searchRef,
          role: "combobox",
          "aria-label": "Buscar pa\xEDs",
          "aria-autocomplete": "list",
          "aria-expanded": "true",
          "aria-controls": listId,
          "aria-activedescendant": activeOption ? `${baseId}-opcion-${activeOption.country}` : void 0,
          value: query,
          onChange: (event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          },
          onKeyDown: navigate,
          placeholder: searchPlaceholder,
          autoComplete: "off"
        }
      ) }),
      /* @__PURE__ */ jsx15("ul", { id: listId, role: "listbox", "aria-label": "Pa\xEDses", className: "max-h-64 overflow-y-auto p-1", children: options.map((pais, index) => /* @__PURE__ */ jsxs10(
        "li",
        {
          id: `${baseId}-opcion-${pais.country}`,
          role: "option",
          "aria-selected": pais.country === selected.country,
          onMouseDown: (event) => event.preventDefault(),
          onMouseEnter: () => setActiveIndex(index),
          onClick: () => choose(pais),
          className: `flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${index === activeIndex ? "bg-ink-700 text-fore" : "text-mute hover:bg-ink-700 hover:text-fore"}`,
          children: [
            /* @__PURE__ */ jsx15("span", { "aria-hidden": "true", className: "text-lg leading-none", children: pais.flag }),
            /* @__PURE__ */ jsx15("span", { className: "min-w-0 flex-1 truncate text-left", children: pais.name }),
            /* @__PURE__ */ jsx15("span", { className: "text-xs font-medium uppercase text-mute", children: pais.country }),
            /* @__PURE__ */ jsx15("span", { className: "tabular-nums text-fore", children: pais.countryCode })
          ]
        },
        pais.country
      )) }),
      !options.length ? /* @__PURE__ */ jsx15("p", { role: "status", "aria-live": "polite", className: "px-3 py-4 text-center text-sm text-mute", children: "No se encontraron pa\xEDses" }) : null
    ] }) : null
  ] });
}

// src/utils/telefono.js
import { parsePhoneNumberFromString } from "libphonenumber-js/min";
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

// src/components/PhoneField.jsx
import { jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
var MAX_NUMERO = 30;
function soloNumero(value) {
  return String(value || "").replace(/[^\d\s()-]/g, "").slice(0, MAX_NUMERO);
}
function catalogoDelCampo(countries, codigos, locale) {
  if (countries) return resolverPaisesTelefono(countries, locale);
  const catalogo = resolverPaisesTelefono(void 0, locale);
  if (!codigos) return catalogo;
  const permitidos = new Set(codigos.map((codigo) => codigoPais(codigo)).filter(Boolean));
  return catalogo.filter((pais) => permitidos.has(pais.countryCode));
}
function PhoneField({
  countryCode = "+595",
  country,
  phone = "",
  onChange,
  onCountryCodeChange,
  onCountryChange,
  onInternationalChange,
  countries,
  locale = "es",
  searchPlaceholder = "Buscar pa\xEDs o c\xF3digo",
  autoComplete = "tel",
  name,
  inputProps,
  disabled = false,
  placeholder = "981 123 456",
  countryAriaLabel = "C\xF3digo de pa\xEDs",
  phoneAriaLabel = "Tel\xE9fono",
  codigos,
  mensajeInvalido = MENSAJE_TELEFONO,
  id = "telefono-codigos",
  className
}) {
  const catalog = useMemo4(() => catalogoDelCampo(countries, codigos, locale), [codigos, countries, locale]);
  const paisControlado = country === void 0 ? null : paisTelefonoPorIso(country, locale);
  const codigoSolicitado = codigoPais(countryCode) || "+595";
  const codigoControlado = paisControlado?.countryCode || codigoSolicitado;
  const paisesCompatibles = paisesDeCodigo(codigoControlado, locale, catalog);
  const paisDesconocido = !paisControlado && paisesCompatibles.length === 0 ? {
    country: `ZZ-${codigoControlado.replace(/\D/g, "")}`,
    countryCode: codigoControlado,
    name: `C\xF3digo internacional ${codigoControlado}`,
    flag: "\u{1F310}",
    custom: true
  } : null;
  const [paisInterno, setPaisInterno] = useState6(() => paisControlado?.country || paisesCompatibles[0]?.country || paisDesconocido?.country || "PY");
  const paisInternoCompatible = paisTelefonoPorIso(paisInterno, locale)?.countryCode === codigoControlado;
  const paisSeleccionado = paisControlado?.country || (paisDesconocido ? paisDesconocido.country : null) || (paisInternoCompatible ? paisInterno : paisesCompatibles[0]?.country) || "PY";
  const [tocado, setTocado] = useState6(false);
  const invalido = tocado && Boolean(String(phone).trim()) && !(paisDesconocido ? telefonoValido(phone, codigoControlado) : telefonoInternacionalValido(phone, paisSeleccionado));
  const errorId = `${id}-error`;
  const {
    className: inputClassName,
    onBlur: inputOnBlur,
    "aria-describedby": inputDescribedBy,
    ...safeInputProps
  } = inputProps || {};
  const describedBy = [inputDescribedBy, invalido ? errorId : ""].filter(Boolean).join(" ") || void 0;
  const emitirInternacional = (local, iso, estado) => {
    if (!onInternationalChange) return;
    if (iso === paisDesconocido?.country || !paisTelefonoPorIso(iso, locale)) {
      onInternationalChange("", {
        country: "",
        countryCode: estado?.countryCode || codigoControlado,
        phone: local,
        isValid: false
      });
      return;
    }
    const countryData = paisTelefonoPorIso(iso, locale) || paisTelefonoPorIso("PY", locale);
    const e164 = estado?.e164 ?? telefonoE164(local, countryData.country);
    const isValid = estado?.isValid ?? Boolean(e164);
    onInternationalChange(isValid ? e164 : "", {
      country: countryData.country,
      countryCode: estado?.countryCode || countryData.countryCode,
      phone: local,
      isValid
    });
  };
  const cambiarPais = (iso) => {
    if (iso === paisDesconocido?.country) {
      setPaisInterno(iso);
      onCountryChange?.("");
      emitirInternacional(phone, iso, { countryCode: codigoControlado, isValid: false, e164: "" });
      return;
    }
    const siguiente = paisTelefonoPorIso(iso, locale);
    if (!siguiente) return;
    setPaisInterno(siguiente.country);
    onCountryChange?.(siguiente.country);
    if (siguiente.countryCode !== codigoControlado) onCountryCodeChange?.(siguiente.countryCode);
    emitirInternacional(phone, siguiente.country);
  };
  const cambiarNumero = (event) => {
    const raw = event.target.value;
    if (/^(\+|00)/.test(raw.trimStart())) {
      const parsed = parseTelefonoInternacional(raw, paisDesconocido ? "" : paisSeleccionado, codigoControlado);
      const siguientePais = parsed.country || (parsed.countryCode === codigoControlado ? paisDesconocido?.country : "");
      if (siguientePais) setPaisInterno(siguientePais);
      onCountryChange?.(parsed.country);
      if (parsed.countryCode !== codigoControlado) onCountryCodeChange?.(parsed.countryCode);
      onChange?.(parsed.phone);
      emitirInternacional(parsed.phone, parsed.country, parsed);
      return;
    }
    const local = soloNumero(raw);
    onChange?.(local);
    emitirInternacional(local, paisSeleccionado);
  };
  return /* @__PURE__ */ jsxs11("div", { className, children: [
    /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx16(
        CountryPhoneSelect,
        {
          id: `${id}-pais`,
          country: paisSeleccionado,
          customCountry: paisDesconocido,
          onChange: cambiarPais,
          countries: catalog,
          locale,
          disabled,
          ariaLabel: countryAriaLabel,
          searchPlaceholder
        }
      ),
      /* @__PURE__ */ jsx16(
        Input,
        {
          ...safeInputProps,
          type: "tel",
          inputMode: "tel",
          autoComplete,
          name,
          maxLength: MAX_NUMERO,
          disabled,
          value: phone,
          onChange: cambiarNumero,
          placeholder,
          "aria-label": phoneAriaLabel,
          "aria-invalid": invalido || void 0,
          "aria-describedby": describedBy,
          onBlur: (event) => {
            setTocado(true);
            inputOnBlur?.(event);
          },
          className: cn("min-w-[8.5rem] flex-1", inputClassName)
        }
      )
    ] }),
    invalido ? /* @__PURE__ */ jsx16("span", { id: errorId, role: "alert", className: "block pt-1 text-[11px] text-bad-text", children: mensajeInvalido }) : null
  ] });
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

// src/components/SerialField.jsx
import { jsx as jsx17 } from "react/jsx-runtime";
function SerialField({
  value = "",
  onChange,
  disabled = false,
  placeholder = "IMEI o serial",
  normalizar: normalizar5 = normalizarSerial,
  maxLength = 32,
  ...props
}) {
  return /* @__PURE__ */ jsx17(
    Input,
    {
      autoCapitalize: "characters",
      autoCorrect: "off",
      spellCheck: false,
      maxLength,
      disabled,
      placeholder,
      ...props,
      value: normalizar5(value),
      onChange: (event) => onChange?.(normalizar5(event.target.value))
    }
  );
}

// src/components/InstagramField.jsx
import { jsx as jsx18, jsxs as jsxs12 } from "react/jsx-runtime";
var MAX_USERNAME = 30;
function normalizarInstagram(value) {
  const texto = String(value || "").trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/^instagram\.com\//i, "").replace(/^@+/, "");
  return texto.split(/[/?#]/)[0].replace(/\s+/g, "").replace(/[^A-Za-z0-9._]/g, "").slice(0, MAX_USERNAME);
}
function InstagramField({ value = "", onChange, disabled = false, placeholder = "usuario", className, inputClassName, ...props }) {
  return /* @__PURE__ */ jsxs12("div", { className: cn("relative", className), children: [
    /* @__PURE__ */ jsx18("span", { "aria-hidden": "true", className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-mute", children: "@" }),
    /* @__PURE__ */ jsx18(
      Input,
      {
        ...props,
        maxLength: MAX_USERNAME,
        disabled,
        value: normalizarInstagram(value),
        onChange: (event) => onChange?.(normalizarInstagram(event.target.value)),
        placeholder,
        className: cn("pl-8", inputClassName)
      }
    )
  ] });
}

// src/components/ProductCombobox.jsx
import { useCallback as useCallback3, useEffect as useEffect5, useMemo as useMemo5, useRef as useRef6, useState as useState7 } from "react";

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

// src/components/IconoCategoria.jsx
import { jsx as jsx19 } from "react/jsx-runtime";
var GLIFOS_CATEGORIA = {
  // Celular: marco redondeado con parlante y botón.
  mobile: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM10 5h4M11 18.5h2",
  // Laptop: pantalla arriba, base ancha.
  laptop: "M5 5h14v10H5zM2.5 19h19M9 15l-.5 4M15 15l.5 4",
  // Tablet: marco redondeado más ancho que el celular.
  tablet: "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM11 18.5h2",
  // Reloj: caja central con correas.
  watch: "M9 2h6l.8 4H8.2L9 2ZM8.2 18h7.6l-.8 4H9l-.8-4ZM6 8h12v8H6zM12 10.5v3l2 1",
  // Auriculares: dos buds con su tallo.
  buds: "M7 3.5a3 3 0 0 1 3 3v7a3 3 0 1 1-6 0v-7a3 3 0 0 1 3-3ZM7 16.5V21M17 3.5a3 3 0 0 1 3 3v7a3 3 0 1 1-6 0v-7a3 3 0 0 1 3-3ZM17 16.5V21",
  // Cable: curva con conectores en los extremos.
  cable: "M4 3v5a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v5M2 3h4M18 21h4"
};
function IconoCategoria({ categoria, icono, className, ...props }) {
  const glifo = icono || iconoDeCategoria(categoria);
  const clases = cn("shrink-0", className || "h-5 w-5");
  if (!GLIFOS_CATEGORIA[glifo]) return /* @__PURE__ */ jsx19(Icon, { name: glifo, className: clases, ...props });
  return /* @__PURE__ */ jsx19(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className: clases,
      ...props,
      children: /* @__PURE__ */ jsx19("path", { d: GLIFOS_CATEGORIA[glifo] })
    }
  );
}

// src/components/ProductCombobox.jsx
import { jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";
var MAX_SUGGESTIONS = 8;
function productName(product) {
  return product?.nombre || product?.name || "";
}
function ProductCombobox({ products = [], selectedId = "", onSelect, onCreate, onQueryChange, placeholder = "Buscar producto\u2026", disabled = false, className }) {
  const [query, setQuery] = useState7("");
  const [open, setOpen] = useState7(false);
  const [creating, setCreating] = useState7(false);
  const rootRef = useRef6(null);
  useEffect5(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return;
      close();
    };
    document.addEventListener("click", cerrarFuera);
    return () => document.removeEventListener("click", cerrarFuera);
  }, []);
  const setearQuery = useCallback3((next) => {
    setQuery(next);
    onQueryChange?.(next);
  }, [onQueryChange]);
  useEffect5(() => {
    if (!selectedId) return;
    const selected = products.find((product) => product.id === selectedId);
    if (selected) setearQuery(productName(selected));
  }, [selectedId, products, setearQuery]);
  const term = query.trim().toLowerCase();
  const suggestions = useMemo5(() => {
    if (!term) return [];
    const coincide = (product) => [productName(product), product.sku, product.model, product.capacity, product.color].some((valor) => String(valor || "").toLowerCase().includes(term));
    return products.filter(coincide).slice(0, MAX_SUGGESTIONS);
  }, [products, term]);
  const canCreate = Boolean(term && onCreate && suggestions.length === 0);
  const options = useMemo5(
    () => canCreate ? [...suggestions, { id: "__create__", __create: true }] : suggestions,
    [canCreate, suggestions]
  );
  function close() {
    setOpen(false);
  }
  function choose(product) {
    setearQuery(productName(product));
    setOpen(false);
    onSelect?.(product);
  }
  async function createNew() {
    if (!onCreate || creating) return;
    setCreating(true);
    try {
      const created = await onCreate(query.trim());
      if (created?.id) {
        setearQuery(productName(created));
        onSelect?.(created);
      }
      setOpen(false);
    } catch {
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }
  const listaVisible = open && Boolean(term);
  const navegacion = useComboboxNavigation({
    options,
    open: listaVisible,
    onOpenChange: setOpen,
    onSelect: (option) => {
      if (option.__create) void createNew();
      else choose(option);
    },
    getOptionKey: (option) => option.id
  });
  return /* @__PURE__ */ jsxs13("div", { ref: rootRef, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx20(
      Input,
      {
        type: "text",
        ref: navegacion.inputRef,
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": navegacion.listboxId,
        "aria-autocomplete": "list",
        "aria-activedescendant": navegacion.activeOptionId,
        autoComplete: "off",
        disabled,
        value: query,
        placeholder,
        onChange: (event) => {
          setearQuery(event.target.value);
          setOpen(true);
          navegacion.setActiveIndex(0);
        },
        onFocus: () => setOpen(true),
        onBlur: () => setTimeout(close, 120),
        onKeyDown: navegacion.inputProps.onKeyDown
      }
    ),
    listaVisible && /* @__PURE__ */ jsxs13("ul", { ...navegacion.listboxProps, className: "mt-1 max-h-48 w-full overflow-auto rounded-lg border border-ink-500 bg-ink py-1 shadow-float", children: [
      suggestions.map((product, index) => /* @__PURE__ */ jsxs13(
        "li",
        {
          ...navegacion.getOptionProps(index),
          className: cn("flex min-h-11 cursor-pointer items-baseline justify-between gap-2 px-3 py-2 text-left text-sm transition", index === navegacion.activeIndex ? "bg-ink-700" : ""),
          children: [
            /* @__PURE__ */ jsxs13("span", { className: "flex min-w-0 items-center gap-2", children: [
              /* @__PURE__ */ jsx20(IconoCategoria, { categoria: product.category || productName(product), className: "h-4 w-4 text-mute" }),
              /* @__PURE__ */ jsx20("span", { className: "truncate text-fore", children: productName(product) })
            ] }),
            product.sku ? /* @__PURE__ */ jsx20("span", { className: "shrink-0 text-xs text-mute", children: product.sku }) : null
          ]
        },
        product.id
      )),
      canCreate && /* @__PURE__ */ jsx20(
        "li",
        {
          ...navegacion.getOptionProps(suggestions.length),
          "aria-disabled": creating || void 0,
          className: cn("flex min-h-11 cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-fono-light transition", creating && "pointer-events-none opacity-50", navegacion.activeIndex >= suggestions.length ? "bg-ink-700" : ""),
          children: creating ? "Creando\u2026" : `\uFF0B Agregar \xAB${query.trim()}\xBB como producto nuevo`
        }
      )
    ] })
  ] });
}

// src/components/BuscadorProveedor.jsx
import { useEffect as useEffect6, useId as useId5, useMemo as useMemo6, useRef as useRef7, useState as useState8 } from "react";
import { Fragment as Fragment3, jsx as jsx21, jsxs as jsxs14 } from "react/jsx-runtime";
var MAX_RESULTADOS = 8;
function normalizarProveedor(valor) {
  return String(valor ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function nombreProveedor(proveedor) {
  return proveedor?.name || proveedor?.nombre || "";
}
function detalleProveedor(proveedor) {
  return [proveedor?.city, proveedor?.phone].filter(Boolean).join(" \xB7 ");
}
function filtrarProveedores(proveedores = [], termino = "", { limite = MAX_RESULTADOS } = {}) {
  const q = normalizarProveedor(termino);
  const lista = Array.isArray(proveedores) ? proveedores : [];
  if (!q) return lista.slice(0, limite);
  return lista.filter((proveedor) => normalizarProveedor(nombreProveedor(proveedor)).includes(q) || normalizarProveedor(proveedor?.code).includes(q)).slice(0, limite);
}
function resolverRecientes(proveedores = [], recientes = [], { limite = MAX_RESULTADOS } = {}) {
  const catalogo = Array.isArray(proveedores) ? proveedores : [];
  const porId = new Map(catalogo.map((proveedor) => [proveedor.id, proveedor]));
  const salida = [];
  for (const referencia of Array.isArray(recientes) ? recientes : []) {
    const proveedor = typeof referencia === "string" ? porId.get(referencia) : referencia;
    if (proveedor?.id && !salida.some((item) => item.id === proveedor.id)) salida.push(proveedor);
    if (salida.length >= limite) break;
  }
  return salida;
}
function BuscadorProveedor({
  proveedores = [],
  selectedId = "",
  onSelect,
  onCreate,
  onQueryChange,
  recientes = [],
  placeholder = "Buscar proveedor\u2026",
  textoRecientes = "\xDAltimos usados",
  textoCrear = "Crear proveedor",
  textoCreando = "Creando\u2026",
  vacio = "Sin proveedores que coincidan.",
  disabled = false,
  required = false,
  id,
  ariaLabel = "Proveedor",
  className,
  inputProps
}) {
  const [query, setQuery] = useState8("");
  const [abierto, setAbierto] = useState8(false);
  const [resaltado, setResaltado] = useState8(0);
  const [creando, setCreando] = useState8(false);
  const listaId = useId5();
  const raiz = useRef7(null);
  const lista = useRef7(null);
  useEffect6(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      setAbierto(false);
    };
    document.addEventListener("click", cerrarFuera);
    return () => document.removeEventListener("click", cerrarFuera);
  }, []);
  useEffect6(() => {
    if (!selectedId) return;
    const elegido = (Array.isArray(proveedores) ? proveedores : []).find((proveedor) => proveedor.id === selectedId);
    if (elegido) setQuery(nombreProveedor(elegido));
  }, [selectedId, proveedores]);
  const termino = query.trim();
  const usados = useMemo6(() => resolverRecientes(proveedores, recientes), [proveedores, recientes]);
  const coincidencias = useMemo6(() => filtrarProveedores(proveedores, termino), [proveedores, termino]);
  const enFoco = !termino && usados.length > 0 ? usados : coincidencias;
  const encabezado = !termino && usados.length > 0 ? textoRecientes : null;
  const exacto = useMemo6(
    () => (Array.isArray(proveedores) ? proveedores : []).some((proveedor) => normalizarProveedor(nombreProveedor(proveedor)) === normalizarProveedor(termino) || normalizarProveedor(proveedor?.code) === normalizarProveedor(termino)),
    [proveedores, termino]
  );
  const puedeCrear = Boolean(termino.length >= 2 && onCreate && !exacto);
  const opciones = puedeCrear ? [...enFoco, { crear: termino }] : enFoco;
  const listaVisible = abierto && !disabled && (opciones.length > 0 || Boolean(termino));
  useEffect6(() => {
    if (!listaVisible) return;
    lista.current?.querySelector(`#${CSS.escape(`${listaId}-${resaltado}`)}`)?.scrollIntoView({ block: "nearest" });
  }, [listaVisible, resaltado, listaId]);
  function cerrar() {
    setAbierto(false);
    setResaltado(0);
  }
  function elegir(opcion) {
    if (!opcion) return;
    if (opcion.crear) return crearProveedor();
    setQuery(nombreProveedor(opcion));
    cerrar();
    onSelect?.(opcion);
  }
  async function crearProveedor() {
    if (creando || !puedeCrear) return;
    setCreando(true);
    try {
      const creado = await onCreate?.(termino);
      if (creado?.id) {
        setQuery(nombreProveedor(creado));
        cerrar();
        onSelect?.(creado);
      } else {
        cerrar();
      }
    } finally {
      setCreando(false);
    }
  }
  function alTeclear(event) {
    if (event.key === "Escape") {
      cerrar();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!abierto) {
        setAbierto(true);
        return;
      }
      if (!opciones.length) return;
      const paso = event.key === "ArrowDown" ? 1 : -1;
      setResaltado((actual) => (actual + paso + opciones.length) % opciones.length);
      return;
    }
    if (event.key === "Enter" && abierto && opciones[resaltado]) {
      event.preventDefault();
      elegir(opciones[resaltado]);
    }
  }
  return /* @__PURE__ */ jsxs14("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx21(
      Input,
      {
        id,
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": listaId,
        "aria-autocomplete": "list",
        "aria-activedescendant": listaVisible ? `${listaId}-${resaltado}` : void 0,
        "aria-label": ariaLabel,
        autoComplete: "off",
        required,
        disabled,
        value: query,
        placeholder,
        onChange: (event) => {
          setQuery(event.target.value);
          onQueryChange?.(event.target.value);
          setAbierto(true);
          setResaltado(0);
        },
        onFocus: () => setAbierto(true),
        onKeyDown: alTeclear,
        ...inputProps
      }
    ),
    listaVisible && /* @__PURE__ */ jsxs14(
      "ul",
      {
        id: listaId,
        ref: lista,
        role: "listbox",
        "aria-label": "Proveedores",
        className: "absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float",
        children: [
          encabezado ? /* @__PURE__ */ jsxs14("li", { className: "flex items-center gap-1.5 px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-mute", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx21(Icon, { name: "clock", className: "h-3 w-3" }),
            encabezado
          ] }) : null,
          opciones.map((opcion, indice) => {
            const creado = Boolean(opcion.crear);
            return /* @__PURE__ */ jsx21(
              "li",
              {
                id: `${listaId}-${indice}`,
                role: "option",
                "aria-selected": indice === resaltado,
                onMouseDown: (event) => event.preventDefault(),
                onMouseEnter: () => setResaltado(indice),
                onClick: () => elegir(opcion),
                className: cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition",
                  indice === resaltado ? "bg-fono/10 text-fore" : "text-mute hover:bg-ink-700/60 hover:text-fore"
                ),
                children: creado ? /* @__PURE__ */ jsxs14(Fragment3, { children: [
                  /* @__PURE__ */ jsx21(Icon, { name: "plus", className: "h-4 w-4 shrink-0 text-fono-light" }),
                  /* @__PURE__ */ jsx21("span", { className: "min-w-0 flex-1 truncate", children: creando ? textoCreando : `${textoCrear} \xAB${opcion.crear}\xBB` })
                ] }) : /* @__PURE__ */ jsxs14(Fragment3, { children: [
                  /* @__PURE__ */ jsxs14("span", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx21("span", { className: "block truncate font-medium text-fore", children: nombreProveedor(opcion) }),
                    detalleProveedor(opcion) ? /* @__PURE__ */ jsx21("span", { className: "block truncate text-xs text-mute", children: detalleProveedor(opcion) }) : null
                  ] }),
                  opcion.code ? /* @__PURE__ */ jsx21("span", { className: "shrink-0 rounded border border-ink-500 bg-ink-700/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-fono-light", children: opcion.code }) : null
                ] })
              },
              creado ? `crear-${opcion.crear}` : opcion.id
            );
          }),
          !opciones.length && termino ? /* @__PURE__ */ jsx21("li", { className: "px-2.5 py-2 text-sm text-mute", children: vacio }) : null
        ]
      }
    )
  ] });
}

// src/components/BloquePago.jsx
import { jsx as jsx22, jsxs as jsxs15 } from "react/jsx-runtime";
var ACENTO = {
  ok: "border-l-2 border-l-ok/60",
  warn: "border-l-2 border-l-warn/70",
  bad: "border-l-2 border-l-bad/60",
  fono: "border-l-2 border-l-fono/60"
};
function BloquePago({
  etiqueta,
  encabezado,
  acento,
  onQuitar,
  etiquetaQuitar = "Eliminar pago",
  deshabilitado = false,
  testId = "bloque-pago",
  className,
  children
}) {
  return /* @__PURE__ */ jsxs15(
    "article",
    {
      "data-testid": testId,
      "data-estado": acento || void 0,
      className: cn(
        "relative rounded-2xl border border-ink-600 bg-ink-800/30 p-3",
        acento && ACENTO[acento],
        onQuitar && "pr-12",
        className
      ),
      children: [
        etiqueta || encabezado ? /* @__PURE__ */ jsxs15("div", { className: "mb-2 flex flex-wrap items-center gap-2", children: [
          etiqueta ? /* @__PURE__ */ jsx22("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-mute", children: etiqueta }) : null,
          encabezado
        ] }) : null,
        /* @__PURE__ */ jsx22("div", { className: "min-w-0", children }),
        onQuitar ? /* @__PURE__ */ jsx22("span", { className: "absolute right-1.5 top-1.5", children: /* @__PURE__ */ jsx22(IconAction, { icon: "trash", tone: "bad", size: "touch", label: etiquetaQuitar, disabled: deshabilitado, onClick: onQuitar }) }) : null
      ]
    }
  );
}

// src/components/NavegacionSeccion.jsx
import { useEffect as useEffect7, useId as useId6, useRef as useRef8 } from "react";
import { jsx as jsx23, jsxs as jsxs16 } from "react/jsx-runtime";
function NavegacionSeccion({
  items = [],
  value,
  onChange,
  colapsado = false,
  onToggle,
  variante = "auto",
  ariaLabel = "Secciones",
  textoExpandir = "Expandir el men\xFA",
  textoColapsar = "Colapsar el men\xFA",
  mostrarDescripcion = true,
  testId = "navegacion-seccion",
  testIdDescripcion,
  className,
  classNameContenido,
  children
}) {
  const activoRef = useRef8(null);
  const tabsRef = useRef8([]);
  const baseId = useId6();
  const lista = (Array.isArray(items) ? items : []).map((item) => Array.isArray(item) ? { id: item[0], label: item[1] } : item).filter((item) => item && item.id);
  const activo = lista.find((item) => item.id === value) || lista[0];
  const activeId = activo?.id;
  const conRiel = variante !== "horizontal";
  function mover(event, indice) {
    let siguiente;
    if (event.key === "ArrowRight") siguiente = (indice + 1) % lista.length;
    else if (event.key === "ArrowLeft") siguiente = (indice - 1 + lista.length) % lista.length;
    else if (event.key === "Home") siguiente = 0;
    else if (event.key === "End") siguiente = lista.length - 1;
    else return;
    event.preventDefault();
    onChange?.(lista[siguiente].id);
    requestAnimationFrame(() => tabsRef.current[siguiente]?.focus());
  }
  useEffect7(() => {
    activoRef.current?.scrollIntoView?.({ inline: "center", block: "nearest" });
  }, [value]);
  if (!lista.length) return null;
  return /* @__PURE__ */ jsxs16(
    "div",
    {
      className: cn(
        "min-w-0",
        conRiel && "lg:grid lg:items-start lg:gap-5",
        conRiel && (colapsado ? "lg:grid-cols-[4.75rem_minmax(0,1fr)]" : "lg:grid-cols-[16.5rem_minmax(0,1fr)]"),
        className
      ),
      children: [
        /* @__PURE__ */ jsxs16("div", { className: cn(conRiel && "lg:sticky lg:top-3"), children: [
          onToggle && conRiel ? /* @__PURE__ */ jsx23("div", { className: cn("mb-1.5 hidden lg:flex", colapsado ? "lg:justify-center" : "lg:justify-end"), children: /* @__PURE__ */ jsx23(
            "button",
            {
              type: "button",
              "data-testid": `${testId}-toggle`,
              onClick: () => onToggle(!colapsado),
              "aria-expanded": !colapsado,
              "aria-controls": testId,
              title: colapsado ? textoExpandir : textoColapsar,
              "aria-label": colapsado ? textoExpandir : textoColapsar,
              className: "toque-44 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-mute transition hover:bg-ink-700 hover:text-fore",
              children: /* @__PURE__ */ jsx23(Icon, { name: "chevron", className: cn("h-4 w-4 transition-transform", colapsado ? "-rotate-90" : "rotate-90") })
            }
          ) }) : null,
          /* @__PURE__ */ jsx23(
            "nav",
            {
              id: testId,
              role: "tablist",
              "aria-label": ariaLabel,
              "data-testid": testId,
              className: cn(
                "mb-3 flex gap-1.5 overflow-x-auto rounded-2xl border border-fore/10 bg-ink p-2",
                conRiel && "lg:mb-0 lg:flex-col lg:gap-0.5 lg:overflow-visible",
                conRiel && colapsado && "lg:items-center lg:p-1.5"
              ),
              children: lista.map((item, indice) => {
                const esta = item.id === activeId;
                return /* @__PURE__ */ jsxs16(
                  "button",
                  {
                    id: `${baseId}-tab-${item.id}`,
                    type: "button",
                    role: "tab",
                    "aria-selected": esta,
                    "aria-current": esta ? "page" : void 0,
                    "aria-controls": `${baseId}-panel-${item.id}`,
                    tabIndex: esta ? 0 : -1,
                    "aria-label": item.label,
                    title: item.label,
                    ref: (node) => {
                      tabsRef.current[indice] = node;
                      if (esta) activoRef.current = node;
                    },
                    onClick: () => onChange?.(item.id),
                    onKeyDown: (event) => mover(event, indice),
                    className: cn(
                      "group relative flex min-h-11 shrink-0 items-center gap-2 rounded-[10px] border px-3 text-left text-[13px] leading-snug transition",
                      conRiel && (colapsado ? "lg:w-12 lg:justify-center lg:px-0" : "lg:w-full"),
                      esta ? "border-fono/30 bg-gradient-to-r from-fono/[.16] to-fono/[.05] font-semibold text-fore" : "border-transparent text-mute hover:bg-ink-700/70 hover:text-fore"
                    ),
                    children: [
                      esta && /* @__PURE__ */ jsx23("span", { "aria-hidden": true, className: cn("absolute left-0 top-1/2 hidden h-5 w-[2px] -translate-y-1/2 rounded-full bg-fono", conRiel && "lg:block") }),
                      item.icono ? /* @__PURE__ */ jsx23(Icon, { name: item.icono, className: cn("h-4 w-4 shrink-0", esta ? "text-fono-light" : "group-hover:text-fore") }) : null,
                      /* @__PURE__ */ jsx23("span", { className: cn("truncate", conRiel && colapsado && "lg:hidden"), children: item.label })
                    ]
                  },
                  item.id
                );
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs16(
          "div",
          {
            id: `${baseId}-panel-${activeId}`,
            role: "tabpanel",
            "aria-labelledby": `${baseId}-tab-${activeId}`,
            tabIndex: 0,
            className: cn("min-w-0 space-y-3", classNameContenido),
            children: [
              mostrarDescripcion && activo?.descripcion ? /* @__PURE__ */ jsxs16("p", { "data-testid": testIdDescripcion || `${testId}-descripcion`, className: "flex items-start gap-2 px-0.5 text-sm text-mute", children: [
                /* @__PURE__ */ jsx23(Icon, { name: activo.icono, className: "mt-0.5 h-4 w-4 shrink-0 text-fono-light" }),
                /* @__PURE__ */ jsx23("span", { children: activo.descripcion })
              ] }) : null,
              children
            ]
          }
        )
      ]
    }
  );
}

// src/components/BuscadorCliente.jsx
import { useEffect as useEffect8, useId as useId7, useMemo as useMemo7, useRef as useRef9, useState as useState9 } from "react";

// src/utils/cliente.js
var normalizar = (valor) => String(valor ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
var digitosCliente = (valor) => String(valor ?? "").replace(/\D/g, "");
function claveTelefonoCliente(valor) {
  return digitosCliente(valor).replace(/^595/, "").replace(/^0+/, "");
}
var telefonosDeCliente = (cliente) => [
  cliente?.phone,
  ...Array.isArray(cliente?.phones) ? cliente.phones : []
].filter(Boolean);
function coincideTelefonoCliente(a, b) {
  const claveA = claveTelefonoCliente(a);
  const claveB = claveTelefonoCliente(b);
  if (!claveA || !claveB) return false;
  if (claveA === claveB) return true;
  return claveA.length >= 6 && claveB.length >= 6 && (claveA.endsWith(claveB) || claveB.endsWith(claveA));
}
function campoBuscableCliente(cliente) {
  const telefonos = telefonosDeCliente(cliente).flatMap((telefono) => [telefono, claveTelefonoCliente(telefono)]);
  return normalizar([
    cliente?.name,
    cliente?.nombre,
    ...telefonos,
    cliente?.document,
    cliente?.email,
    cliente?.billingName,
    cliente?.billingDocument,
    ...Array.isArray(cliente?.tags) ? cliente.tags : []
  ].filter(Boolean).join(" "));
}
function filtrarClientes(clientes = [], termino = "", { limite = 8 } = {}) {
  const lista = Array.isArray(clientes) ? clientes : [];
  const q = normalizar(termino);
  if (!q) return lista.slice(0, limite);
  return lista.filter((cliente) => campoBuscableCliente(cliente).includes(q)).slice(0, limite);
}
function detalleCliente(cliente) {
  return telefonosDeCliente(cliente).slice(0, 1).concat([cliente?.document, cliente?.email]).filter(Boolean).join(" \xB7 ");
}
function motivosDuplicadoCliente(cliente, referencia = {}) {
  const motivos = [];
  const telefono = referencia.telefono ?? referencia.phone;
  if (claveTelefonoCliente(telefono)) {
    const coincide = telefonosDeCliente(cliente).some((valor) => coincideTelefonoCliente(valor, telefono));
    if (coincide) motivos.push("tel\xE9fono");
  }
  const documento = normalizar(referencia.documento ?? referencia.document);
  if (documento && normalizar(cliente?.document) === documento) motivos.push("documento");
  const correo = normalizar(referencia.correo ?? referencia.email);
  if (correo && normalizar(cliente?.email) === correo) motivos.push("correo");
  return motivos;
}

// src/components/BuscadorCliente.jsx
import { Fragment as Fragment4, jsx as jsx24, jsxs as jsxs17 } from "react/jsx-runtime";
var MAX_RESULTADOS2 = 8;
function BuscadorCliente({
  clientes = [],
  selectedId = "",
  onSelect,
  onCreate,
  onQueryChange,
  detectarDuplicado,
  placeholder = "Buscar cliente\u2026",
  textoCrear = "Crear cliente",
  textoCreando = "Creando\u2026",
  textoDuplicado = "Posible duplicado",
  vacio = "Sin clientes que coincidan.",
  disabled = false,
  required = false,
  id,
  ariaLabel = "Cliente",
  className,
  inputProps
}) {
  const [query, setQuery] = useState9("");
  const [abierto, setAbierto] = useState9(false);
  const [resaltado, setResaltado] = useState9(0);
  const [creando, setCreando] = useState9(false);
  const listaId = useId7();
  const raiz = useRef9(null);
  const lista = useRef9(null);
  useEffect8(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      setAbierto(false);
    };
    document.addEventListener("click", cerrarFuera);
    return () => document.removeEventListener("click", cerrarFuera);
  }, []);
  useEffect8(() => {
    if (!selectedId) return;
    const elegido = (Array.isArray(clientes) ? clientes : []).find((cliente) => cliente.id === selectedId);
    if (elegido) setQuery(elegido.name || elegido.nombre || "");
  }, [selectedId, clientes]);
  const termino = query.trim();
  const coincidencias = useMemo7(() => filtrarClientes(clientes, termino, { limite: MAX_RESULTADOS2 }), [clientes, termino]);
  const exacto = useMemo7(
    () => (Array.isArray(clientes) ? clientes : []).some((cliente) => String(cliente?.name || cliente?.nombre || "").trim().toLowerCase() === termino.toLowerCase()),
    [clientes, termino]
  );
  const puedeCrear = Boolean(termino.length >= 2 && onCreate && !exacto);
  const opciones = puedeCrear ? [...coincidencias, { crear: termino }] : coincidencias;
  const listaVisible = abierto && !disabled && (opciones.length > 0 || Boolean(termino));
  useEffect8(() => {
    if (!listaVisible) return;
    lista.current?.querySelector(`#${CSS.escape(`${listaId}-${resaltado}`)}`)?.scrollIntoView({ block: "nearest" });
  }, [listaVisible, resaltado, listaId]);
  function cerrar() {
    setAbierto(false);
    setResaltado(0);
  }
  function elegir(opcion) {
    if (!opcion) return;
    if (opcion.crear) return crearCliente();
    setQuery(opcion.name || opcion.nombre || "");
    cerrar();
    onSelect?.(opcion);
  }
  async function crearCliente() {
    if (creando || !puedeCrear) return;
    setCreando(true);
    try {
      const creado = await onCreate?.(termino);
      if (creado?.id) {
        setQuery(creado.name || creado.nombre || termino);
        cerrar();
        onSelect?.(creado);
      } else {
        cerrar();
      }
    } finally {
      setCreando(false);
    }
  }
  function alTeclear(event) {
    if (event.key === "Escape") {
      cerrar();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!abierto) {
        setAbierto(true);
        return;
      }
      if (!opciones.length) return;
      const paso = event.key === "ArrowDown" ? 1 : -1;
      setResaltado((actual) => (actual + paso + opciones.length) % opciones.length);
      return;
    }
    if (event.key === "Enter" && abierto && opciones[resaltado]) {
      event.preventDefault();
      elegir(opciones[resaltado]);
    }
  }
  return /* @__PURE__ */ jsxs17("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx24(
      Input,
      {
        id,
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": listaId,
        "aria-autocomplete": "list",
        "aria-activedescendant": listaVisible ? `${listaId}-${resaltado}` : void 0,
        "aria-label": ariaLabel,
        autoComplete: "off",
        required,
        disabled,
        value: query,
        placeholder,
        onChange: (event) => {
          setQuery(event.target.value);
          onQueryChange?.(event.target.value);
          setAbierto(true);
          setResaltado(0);
        },
        onFocus: () => setAbierto(true),
        onKeyDown: alTeclear,
        ...inputProps
      }
    ),
    listaVisible && /* @__PURE__ */ jsxs17(
      "ul",
      {
        id: listaId,
        ref: lista,
        role: "listbox",
        "aria-label": "Clientes",
        className: "absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float",
        children: [
          opciones.map((opcion, indice) => {
            const creandoOpcion = Boolean(opcion.crear);
            const motivos = creandoOpcion ? [] : typeof detectarDuplicado === "function" ? detectarDuplicado(opcion) : null;
            const listaMotivos = Array.isArray(motivos) ? motivos : motivos ? ["datos coincidentes"] : [];
            return /* @__PURE__ */ jsx24(
              "li",
              {
                id: `${listaId}-${indice}`,
                role: "option",
                "aria-selected": indice === resaltado,
                onMouseDown: (event) => event.preventDefault(),
                onMouseEnter: () => setResaltado(indice),
                onClick: () => elegir(opcion),
                className: cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition",
                  indice === resaltado ? "bg-fono/10 text-fore" : "text-mute hover:bg-ink-700/60 hover:text-fore"
                ),
                children: creandoOpcion ? /* @__PURE__ */ jsxs17(Fragment4, { children: [
                  /* @__PURE__ */ jsx24(Icon, { name: "plus", className: "h-4 w-4 shrink-0 text-fono-light" }),
                  /* @__PURE__ */ jsx24("span", { className: "min-w-0 flex-1 truncate", children: creando ? textoCreando : `${textoCrear} \xAB${opcion.crear}\xBB` })
                ] }) : /* @__PURE__ */ jsx24(Fragment4, { children: /* @__PURE__ */ jsxs17("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxs17("span", { className: "flex min-w-0 items-center gap-2", children: [
                    /* @__PURE__ */ jsx24("span", { className: "block min-w-0 truncate font-medium text-fore", children: opcion.name || opcion.nombre || "Sin nombre" }),
                    listaMotivos.length > 0 ? /* @__PURE__ */ jsxs17(
                      "span",
                      {
                        className: "inline-flex shrink-0 items-center gap-1 rounded border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-[10px] font-bold text-warn-text",
                        title: `Coincide en ${listaMotivos.join(", ")}`,
                        children: [
                          /* @__PURE__ */ jsx24(Icon, { name: "alert", className: "h-3 w-3" }),
                          textoDuplicado
                        ]
                      }
                    ) : null
                  ] }),
                  detalleCliente(opcion) ? /* @__PURE__ */ jsx24("span", { className: "block truncate text-xs text-mute", children: detalleCliente(opcion) }) : null
                ] }) })
              },
              creandoOpcion ? `crear-${opcion.crear}` : opcion.id
            );
          }),
          !opciones.length && termino ? /* @__PURE__ */ jsx24("li", { className: "px-2.5 py-2 text-sm text-mute", children: vacio }) : null
        ]
      }
    )
  ] });
}

// src/components/BuscadorPersonas.jsx
import { useEffect as useEffect10, useId as useId8, useMemo as useMemo8, useRef as useRef10, useState as useState11 } from "react";

// src/components/Avatar.jsx
import { useEffect as useEffect9, useState as useState10 } from "react";

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
var TIPO_SOCIETARIO = /^(sa|srl|saci|sae|sas|ltda|eas|cia|s|a)$/i;
var primeraLetra = (palabra) => [...String(palabra || "")][0] ?? "";
function inicialesDeNombre(nombre) {
  const palabras = String(nombre ?? "").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (!palabras.length) return "\u2014";
  const significativas = palabras.filter((palabra) => !TIPO_SOCIETARIO.test(palabra));
  if (!significativas.length) return (primeraLetra(palabras[0]) + primeraLetra(palabras[1])).toUpperCase();
  if (significativas.length > 1) {
    return (primeraLetra(significativas[0]) + primeraLetra(significativas[significativas.length - 1])).toUpperCase();
  }
  const societario = palabras.find((palabra) => TIPO_SOCIETARIO.test(palabra));
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

// src/components/Avatar.jsx
import { jsx as jsx25, jsxs as jsxs18 } from "react/jsx-runtime";
var TAMANOS_AVATAR = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl"
};
function Avatar({
  nombre,
  src,
  tamano = "md",
  forma,
  empresa = false,
  title,
  ariaLabel,
  decorativo = false,
  onError,
  className
}) {
  const [cargada, setCargada] = useState10("");
  const [fallo, setFallo] = useState10("");
  const url = String(src || "");
  useEffect9(() => {
    setCargada("");
    setFallo("");
  }, [url]);
  const cuadro = empresa ? "cuadrado" : forma || "redondo";
  const redondo = cuadro !== "cuadrado";
  const etiqueta = ariaLabel || title || String(nombre ?? "").trim() || "Identidad";
  const conImagen = Boolean(url) && fallo !== url;
  const visible = conImagen && cargada === url;
  return /* @__PURE__ */ jsxs18(
    "span",
    {
      role: decorativo ? void 0 : "img",
      "aria-label": decorativo ? void 0 : etiqueta,
      "aria-hidden": decorativo || void 0,
      title,
      className: cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-bold uppercase",
        redondo ? "rounded-full" : "rounded-lg",
        !visible && colorDeNombre(nombre),
        TAMANOS_AVATAR[tamano] || TAMANOS_AVATAR.md,
        className
      ),
      children: [
        visible ? null : /* @__PURE__ */ jsx25("span", { "aria-hidden": "true", children: inicialesDeNombre(nombre) }),
        conImagen ? /* @__PURE__ */ jsx25(
          "img",
          {
            src: url,
            alt: "",
            decoding: "async",
            referrerPolicy: "no-referrer",
            onLoad: () => setCargada(url),
            onError: (event) => {
              setFallo(url);
              onError?.(event);
            },
            className: cn(
              "absolute inset-0 h-full w-full",
              redondo ? "object-cover" : "object-contain",
              visible ? "opacity-100" : "opacity-0"
            )
          },
          url
        ) : null
      ]
    }
  );
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

// src/components/BuscadorPersonas.jsx
import { jsx as jsx26, jsxs as jsxs19 } from "react/jsx-runtime";
function BuscadorPersonas({
  personas = [],
  valor = "",
  onCambiar,
  placeholder = "Buscar persona\u2026",
  ariaLabel = "Persona",
  vacio = "Sin personas que coincidan.",
  etiquetaLista,
  /** Ámbito del uso por usuario (localStorage); vacío = orden base. */
  claveUso = "",
  /** Lista flotante (toolbars) en vez de empujar el contenido. */
  desplegable = false,
  /** Opciones fijas siempre visibles (p. ej. «Todos» o «Sin responsable»). */
  opcionesFijas = [],
  /** Texto de la opción «sin asignar»; al elegirla se llama `onCambiar(null)`. */
  opcionVacia,
  /** 0 = sin límite. */
  maxResultados = 0,
  disabled = false,
  required = false,
  id,
  className
}) {
  const [query, setQuery] = useState11("");
  const [resaltado, setResaltado] = useState11(0);
  const [uso, setUso] = useState11(() => leerUsoPersonas(claveUso));
  const listaId = useId8();
  const lista = useRef10(null);
  const raiz = useRef10(null);
  const [abierto, setAbierto] = useState11(false);
  const [editando, setEditando] = useState11(false);
  const opciones = useMemo8(() => {
    const fijas = (Array.isArray(opcionesFijas) ? opcionesFijas : []).map((opcion) => ({ ...opcion, fija: true }));
    const vacia = opcionVacia ? [{ id: "__vacia__", vacia: true, nombre: opcionVacia, icono: "user" }] : [];
    const filtradas = ordenarPersonas(filtrarPersonas(personas, query), uso);
    const limite = Number(maxResultados) > 0 ? filtradas.slice(0, Number(maxResultados)) : filtradas;
    return [...fijas, ...vacia, ...limite];
  }, [personas, opcionesFijas, opcionVacia, query, uso, maxResultados]);
  const listaVisible = (!desplegable || abierto) && (opciones.length > 0 || Boolean(query));
  useEffect10(() => {
    if (!desplegable || !abierto) return;
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      setAbierto(false);
      setEditando(false);
    };
    const cerrarEscape = (event) => {
      if (event.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", cerrarFuera);
    document.addEventListener("keydown", cerrarEscape);
    return () => {
      document.removeEventListener("mousedown", cerrarFuera);
      document.removeEventListener("keydown", cerrarEscape);
    };
  }, [desplegable, abierto]);
  const etiquetaSeleccion = useMemo8(() => {
    const fijas = Array.isArray(opcionesFijas) ? opcionesFijas : [];
    const fija = fijas.find(
      (opcion) => opcion.valor !== void 0 ? opcion.valor === valor : opcion.id === valor
    );
    if (fija) return fija.nombre ?? fija.label ?? "";
    if (opcionVacia && (valor === "" || valor == null)) return opcionVacia;
    const persona = (Array.isArray(personas) ? personas : []).find((p) => p.id === valor);
    return persona?.nombre ?? "";
  }, [opcionesFijas, opcionVacia, personas, valor]);
  function elegir(opcion) {
    if (!opcion) return;
    setAbierto(false);
    setQuery("");
    setEditando(false);
    if (opcion.fija) {
      onCambiar?.(opcion.valor !== void 0 ? opcion.valor : opcion);
      return;
    }
    if (opcion.vacia) {
      onCambiar?.(null);
      return;
    }
    registrarUsoPersona(claveUso, opcion.id);
    setUso(leerUsoPersonas(claveUso));
    onCambiar?.(opcion);
  }
  function alTeclear(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      setQuery("");
      setEditando(false);
      setAbierto(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!opciones.length) return;
      if (desplegable && !abierto) {
        setResaltado(0);
        setAbierto(true);
        return;
      }
      const paso = event.key === "ArrowDown" ? 1 : -1;
      const siguiente = (resaltado + paso + opciones.length) % opciones.length;
      setResaltado(siguiente);
      lista.current?.querySelector(`#${CSS.escape(`${listaId}-${siguiente}`)}`)?.scrollIntoView?.({ block: "nearest" });
      return;
    }
    if (event.key === "Enter" && opciones[resaltado]) {
      event.preventDefault();
      elegir(opciones[resaltado]);
    }
  }
  function esElegida(opcion) {
    if (opcion.fija) return opcion.valor === valor;
    if (opcion.vacia) return valor === "" || valor == null;
    return opcion.id === valor;
  }
  const limpiarVisible = Boolean(opcionVacia) && valor !== "" && valor != null && !disabled;
  return /* @__PURE__ */ jsxs19("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx26(
      Input,
      {
        id,
        type: "search",
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": listaId,
        "aria-autocomplete": "list",
        "aria-activedescendant": listaVisible && opciones[resaltado] ? `${listaId}-${resaltado}` : void 0,
        "aria-label": ariaLabel,
        "aria-required": required || void 0,
        autoComplete: "off",
        enterKeyHint: "done",
        disabled,
        value: editando ? query : etiquetaSeleccion,
        placeholder,
        onFocus: (evento) => {
          setEditando(true);
          evento.target.select?.();
          if (!desplegable) return;
          setAbierto(true);
          setResaltado(0);
        },
        onClick: () => {
          if (!desplegable) return;
          setAbierto(true);
        },
        onChange: (event) => {
          setQuery(event.target.value);
          setEditando(true);
          setResaltado(0);
          if (desplegable) setAbierto(true);
        },
        onBlur: (evento) => {
          setEditando(false);
          if (desplegable && !raiz.current?.contains(evento.relatedTarget)) setAbierto(false);
        },
        onKeyDown: alTeclear,
        className: limpiarVisible ? "pr-9" : void 0
      }
    ),
    limpiarVisible ? /* @__PURE__ */ jsx26(
      "button",
      {
        type: "button",
        "aria-label": etiquetaLista ? `Limpiar ${etiquetaLista}` : "Limpiar selecci\xF3n",
        title: "Limpiar",
        onMouseDown: (evento) => evento.preventDefault(),
        onClick: () => {
          onCambiar?.(null);
          setQuery("");
          setEditando(false);
          setAbierto(false);
        },
        className: "absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-mute transition hover:bg-ink-700 hover:text-fore",
        children: /* @__PURE__ */ jsx26(Icon, { name: "close", className: "h-3.5 w-3.5", "aria-hidden": true })
      }
    ) : null,
    listaVisible ? /* @__PURE__ */ jsxs19(
      "ul",
      {
        id: listaId,
        ref: lista,
        role: "listbox",
        "aria-label": etiquetaLista ?? ariaLabel,
        className: cn(
          "mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float",
          desplegable ? "absolute left-0 right-0 top-full z-30" : "w-full"
        ),
        children: [
          opciones.map((opcion, indice) => {
            const elegida = esElegida(opcion);
            const inactiva = !opcion.fija && !opcion.vacia && opcion.activo === false;
            return /* @__PURE__ */ jsxs19(
              "li",
              {
                id: `${listaId}-${indice}`,
                role: "option",
                "aria-selected": elegida,
                onMouseDown: (evento) => evento.preventDefault(),
                onMouseEnter: () => setResaltado(indice),
                onClick: () => elegir(opcion),
                className: cn(
                  "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition",
                  indice === resaltado ? "bg-fono/10 text-fore" : "text-mute hover:bg-ink-700/60 hover:text-fore"
                ),
                children: [
                  opcion.fija ? /* @__PURE__ */ jsx26(Icon, { name: opcion.icono ?? "user", className: "h-4 w-4 shrink-0 text-mute", "aria-hidden": true }) : /* @__PURE__ */ jsx26(Avatar, { nombre: opcion.nombre ?? "", src: opcion.fotoUrl, tamano: "sm", decorativo: true }),
                  /* @__PURE__ */ jsxs19("span", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx26("span", { className: "block truncate font-medium text-fore", children: opcion.nombre }),
                    opcion.rol || opcion.detalle ? /* @__PURE__ */ jsx26("span", { className: "block truncate text-xs text-mute", children: opcion.rol ?? opcion.detalle }) : null
                  ] }),
                  inactiva ? /* @__PURE__ */ jsx26("span", { className: "shrink-0 rounded border border-ink-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mute", children: "Inactiva" }) : null,
                  elegida ? /* @__PURE__ */ jsx26(Icon, { name: "check", className: "h-4 w-4 shrink-0 text-ok-text", "aria-hidden": true }) : null
                ]
              },
              opcion.fija || opcion.vacia ? `fija-${opcion.id ?? opcion.valor ?? opcion.nombre}` : opcion.id
            );
          }),
          !opciones.length && query ? /* @__PURE__ */ jsx26("li", { className: "px-2.5 py-2 text-sm text-mute", children: vacio }) : null
        ]
      }
    ) : null
  ] });
}

// src/components/PreviewFusion.jsx
import { useId as useId9 } from "react";
import { jsx as jsx27, jsxs as jsxs20 } from "react/jsx-runtime";
function PreviewFusion({
  entidades = [],
  principalId,
  onElegirPrincipal,
  categorias = [],
  tituloCategorias = "Se fusiona",
  textoPrincipal = "Queda como principal",
  nota = "La otra ficha no se borra: queda archivada con un puntero al principal, as\xED sus enlaces, tokens e historial siguen funcionando.",
  acciones,
  testId = "preview-fusion",
  className
}) {
  const lista = (Array.isArray(entidades) ? entidades : []).slice(0, 2);
  const grupo = useId9();
  return /* @__PURE__ */ jsxs20("div", { className: cn("space-y-3", className), "data-testid": testId, children: [
    /* @__PURE__ */ jsx27("div", { className: "grid gap-2 sm:grid-cols-2", children: lista.map((entidad) => {
      const principal = entidad.id === principalId;
      return /* @__PURE__ */ jsxs20(
        "label",
        {
          className: cn(
            "flex cursor-pointer flex-col gap-2 rounded-xl border p-3 transition",
            principal ? "border-fono/50 bg-fono/5" : "border-ink-600 hover:border-fono/40"
          ),
          children: [
            /* @__PURE__ */ jsxs20("span", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxs20("span", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx27("span", { className: "block truncate font-semibold", children: entidad.titulo || "Sin nombre" }),
                entidad.subtitulo ? /* @__PURE__ */ jsx27("span", { className: "block truncate text-xs text-mute", children: entidad.subtitulo }) : null
              ] }),
              /* @__PURE__ */ jsx27(
                "input",
                {
                  type: "radio",
                  name: grupo,
                  className: "mt-0.5 h-4 w-4 shrink-0 accent-fono",
                  checked: principal,
                  onChange: () => onElegirPrincipal?.(entidad.id),
                  "aria-label": `${textoPrincipal}: ${entidad.titulo || ""}`
                }
              )
            ] }),
            principal ? /* @__PURE__ */ jsxs20("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-fono-light", children: [
              /* @__PURE__ */ jsx27(Icon, { name: "check", className: "h-3.5 w-3.5" }),
              textoPrincipal
            ] }) : null,
            Array.isArray(entidad.datos) && entidad.datos.length > 0 ? /* @__PURE__ */ jsx27("dl", { className: "space-y-0.5", children: entidad.datos.map((dato, indice) => /* @__PURE__ */ jsxs20("div", { className: "flex items-baseline justify-between gap-2 text-xs", children: [
              /* @__PURE__ */ jsx27("dt", { className: "shrink-0 text-mute", children: dato.etiqueta }),
              /* @__PURE__ */ jsx27("dd", { className: "min-w-0 truncate text-right", children: dato.valor ?? "\u2014" })
            ] }, `${dato.etiqueta}-${indice}`)) }) : null
          ]
        },
        entidad.id
      );
    }) }),
    Array.isArray(categorias) && categorias.length > 0 ? /* @__PURE__ */ jsxs20("section", { className: "rounded-xl border border-ink-600 bg-ink-800/40 p-3", children: [
      /* @__PURE__ */ jsx27("p", { className: "text-[10px] font-bold uppercase tracking-wider text-mute", children: tituloCategorias }),
      /* @__PURE__ */ jsx27("ul", { className: "mt-2 grid gap-1.5 sm:grid-cols-2", children: categorias.map((categoria) => {
        const cantidad = Math.max(0, Number(categoria?.cantidad) || 0);
        return /* @__PURE__ */ jsxs20("li", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx27(
            Icon,
            {
              name: cantidad > 0 ? "check" : "close",
              className: cn("h-4 w-4 shrink-0", cantidad > 0 ? "text-ok-text" : "text-mute")
            }
          ),
          /* @__PURE__ */ jsx27("span", { className: cn("min-w-0 flex-1 truncate", cantidad > 0 ? "text-fore" : "text-mute"), children: categoria.etiqueta }),
          categoria.detalle ? /* @__PURE__ */ jsx27("span", { className: "min-w-0 truncate text-xs text-mute", children: categoria.detalle }) : null,
          /* @__PURE__ */ jsx27("span", { className: cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums", cantidad > 0 ? "bg-ink-700 text-fore" : "bg-ink-700/50 text-mute"), children: cantidad })
        ] }, categoria.id);
      }) })
    ] }) : null,
    nota ? /* @__PURE__ */ jsx27("p", { className: "text-xs text-mute", children: nota }) : null,
    acciones ? /* @__PURE__ */ jsx27("div", { className: "flex flex-wrap items-center justify-end gap-2", children: acciones }) : null
  ] });
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

// src/components/ChipFusion.jsx
import { jsx as jsx28, jsxs as jsxs21 } from "react/jsx-runtime";
function ChipFusion({
  principal,
  fusionadoEl,
  por,
  onAbrirPrincipal,
  texto = "Fusionado con",
  textoAbrir = "Ver la principal",
  testId = "chip-fusion",
  className
}) {
  if (!principal) return null;
  const nombre = typeof principal === "string" ? principal : principal.name || principal.nombre || "la ficha principal";
  const fecha = fusionadoEl ? fechaCorta(fusionadoEl, "") : "";
  return /* @__PURE__ */ jsxs21(
    "span",
    {
      "data-testid": testId,
      className: cn("inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-xl border border-info/30 bg-info/10 px-3 py-1.5 text-xs text-info-text", className),
      children: [
        /* @__PURE__ */ jsx28(Icon, { name: "refresh", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxs21("span", { className: "min-w-0", children: [
          texto,
          " ",
          /* @__PURE__ */ jsx28("b", { className: "text-fore", children: nombre }),
          fecha ? ` \xB7 ${fecha}` : "",
          por ? ` \xB7 ${por}` : ""
        ] }),
        onAbrirPrincipal ? /* @__PURE__ */ jsx28("button", { type: "button", onClick: onAbrirPrincipal, className: "shrink-0 font-semibold underline-offset-2 hover:underline", children: textoAbrir }) : null
      ]
    }
  );
}

// src/utils/fusion.js
var CATEGORIAS_FUSION = [
  { id: "pedidos", etiqueta: "Pedidos" },
  { id: "pagos", etiqueta: "Pagos y cuotas" },
  { id: "creditos", etiqueta: "Cr\xE9ditos y saldo" },
  { id: "notas", etiqueta: "Notas" },
  { id: "direcciones", etiqueta: "Direcciones" },
  { id: "contactos", etiqueta: "Tel\xE9fonos y correos" },
  { id: "tags", etiqueta: "Tags" },
  { id: "seguro", etiqueta: "Seguro de ventas" },
  { id: "portal", etiqueta: "Portal" },
  { id: "garantias", etiqueta: "Garant\xEDas y servicio" }
];
function categoriasFusion(conteos = {}) {
  const mapa = Array.isArray(conteos) ? Object.fromEntries(conteos.map((item) => [item?.id, item?.cantidad])) : conteos && typeof conteos === "object" ? conteos : {};
  const conocidas = new Set(CATEGORIAS_FUSION.map((categoria) => categoria.id));
  const filas = CATEGORIAS_FUSION.map(({ id, etiqueta }) => ({
    id,
    etiqueta,
    cantidad: Math.max(0, Number(mapa[id]) || 0)
  }));
  for (const [id, cantidad] of Object.entries(mapa)) {
    if (conocidas.has(id)) continue;
    filas.push({ id, etiqueta: id, cantidad: Math.max(0, Number(cantidad) || 0) });
  }
  return filas;
}
function hayFusion(categorias = []) {
  return (Array.isArray(categorias) ? categorias : []).some((categoria) => Number(categoria?.cantidad) > 0);
}

// src/components/ConfirmarConPalabra.jsx
import { useEffect as useEffect11, useId as useId10, useState as useState12 } from "react";
import { jsx as jsx29, jsxs as jsxs22 } from "react/jsx-runtime";
function ConfirmarConPalabra({
  titulo: titulo2 = "Confirmar unificaci\xF3n",
  resumen,
  advertencia = "La ficha fusionada queda archivada (no se borra) y no se puede deshacer desde la pantalla.",
  palabra = "FUSIONAR",
  confirmLabel = "Unificar",
  textoOcupado = "Unificando\u2026",
  onConfirmar,
  onCancelar,
  busy = false,
  error = "",
  testId = "confirmar-palabra",
  className
}) {
  const [texto, setTexto] = useState12("");
  const campoId = useId10();
  useEffect11(() => {
    setTexto("");
  }, [palabra]);
  const listo = texto.trim().toUpperCase() === String(palabra).toUpperCase();
  return /* @__PURE__ */ jsxs22(
    "form",
    {
      onSubmit: (event) => {
        event.preventDefault();
        if (listo && !busy) onConfirmar?.();
      },
      className: cn("space-y-3", className),
      "data-testid": testId,
      children: [
        /* @__PURE__ */ jsxs22("div", { className: "rounded-xl border border-bad/30 bg-bad/5 p-3", children: [
          /* @__PURE__ */ jsx29("p", { className: "text-sm font-semibold text-bad-text", children: titulo2 }),
          resumen ? /* @__PURE__ */ jsx29("div", { className: "mt-1 text-sm", children: resumen }) : null,
          /* @__PURE__ */ jsx29("p", { className: "mt-1 text-xs text-mute", children: advertencia })
        ] }),
        /* @__PURE__ */ jsxs22("div", { children: [
          /* @__PURE__ */ jsxs22(Label, { htmlFor: campoId, children: [
            "Escrib\xED ",
            /* @__PURE__ */ jsx29("b", { children: palabra }),
            " para confirmar"
          ] }),
          /* @__PURE__ */ jsx29(
            Input,
            {
              id: campoId,
              value: texto,
              onChange: (event) => setTexto(event.target.value),
              autoComplete: "off",
              disabled: busy,
              "aria-label": `Escrib\xED ${palabra} para confirmar`
            }
          )
        ] }),
        error ? /* @__PURE__ */ jsx29(Aviso, { tono: "error", compact: true, children: error }) : null,
        /* @__PURE__ */ jsxs22("div", { className: "flex flex-wrap justify-end gap-2", children: [
          onCancelar ? /* @__PURE__ */ jsx29(Button, { type: "button", variant: "ghost", onClick: onCancelar, disabled: busy, children: "Cancelar" }) : null,
          /* @__PURE__ */ jsx29(Button, { type: "submit", variant: "danger", disabled: !listo || busy, "data-testid": `${testId}-confirmar`, children: busy ? textoOcupado : confirmLabel })
        ] })
      ]
    }
  );
}

// src/components/SelectorCuentaCobro.jsx
import { useEffect as useEffect12, useId as useId11, useMemo as useMemo9, useRef as useRef11, useState as useState13 } from "react";

// src/utils/cuentaCobro.js
var MEDIOS_CUENTA = {
  CASH: { etiqueta: "Efectivo", icono: "money" },
  TRANSFER: { etiqueta: "Transferencia", icono: "send" },
  CARD: { etiqueta: "Tarjeta", icono: "wallet" },
  TRADE_IN: { etiqueta: "Canje", icono: "refresh" },
  PIX: { etiqueta: "Pix", icono: "grid" },
  CRYPTO: { etiqueta: "USDT - Cripto", icono: "trending" }
};
var SIMBOLOS_CUENTA = { PYG: "Gs", USD: "US$", BRL: "R$", EUR: "\u20AC", USDT: "USDT" };
var etiquetaMedioCuenta = (kind) => MEDIOS_CUENTA[String(kind || "").toUpperCase()]?.etiqueta || String(kind || "Otro");
var iconoMedioCuenta = (kind) => MEDIOS_CUENTA[String(kind || "").toUpperCase()]?.icono || "wallet";
function simboloCuenta(currency, currencyLabel) {
  const etiqueta = String(currencyLabel || "").trim();
  if (etiqueta) return etiqueta;
  return SIMBOLOS_CUENTA[String(currency || "").toUpperCase()] || String(currency || "");
}
function numeroParcialCuenta(numero) {
  const limpio = String(numero || "").replace(/\s+/g, "");
  if (limpio.length <= 4) return limpio;
  return `\u2022\u2022\u2022\u2022${limpio.slice(-4)}`;
}
var normalizar2 = (valor) => String(valor ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function campoBuscableCuenta(cuenta) {
  return normalizar2([
    cuenta?.name,
    cuenta?.bank,
    cuenta?.holder,
    cuenta?.accountNumber,
    etiquetaMedioCuenta(cuenta?.kind),
    cuenta?.currency,
    cuenta?.currencyLabel
  ].filter(Boolean).join(" "));
}
var LIMITE_CUENTAS = 100;
function filtrarCuentasCobro(cuentas = [], termino = "", { limite = LIMITE_CUENTAS, incluirInactivas = false } = {}) {
  const lista = (Array.isArray(cuentas) ? cuentas : []).filter((cuenta) => incluirInactivas || cuenta?.isActive !== false);
  const q = normalizar2(termino);
  if (!q) return lista.slice(0, limite);
  return lista.filter((cuenta) => campoBuscableCuenta(cuenta).includes(q)).slice(0, limite);
}
function preseleccionDeCuenta(cuentas = [], { ultimoUsadoId = "", predeterminadaId = "", incluirInactivas = false } = {}) {
  const lista = Array.isArray(cuentas) ? cuentas : [];
  const elegible = (id) => id ? lista.find((cuenta) => cuenta?.id === id && (incluirInactivas || cuenta.isActive !== false)) || null : null;
  return elegible(ultimoUsadoId) || elegible(predeterminadaId) || null;
}
function detalleCuentaCobro(cuenta) {
  if (!cuenta) return "";
  const partes = [];
  if (cuenta.holder) partes.push(`Titular ${cuenta.holder}`);
  if (cuenta.kind === "TRANSFER" && cuenta.accountNumber) partes.push(`Nro ${numeroParcialCuenta(cuenta.accountNumber)}`);
  else if (cuenta.accountNumber) partes.push(numeroParcialCuenta(cuenta.accountNumber));
  if (cuenta.kind === "PIX" && cuenta.pixKey) partes.push(`Llave ${cuenta.pixKey}`);
  if (cuenta.kind === "CARD" && cuenta.processor) partes.push(cuenta.processor);
  if (["CRYPTO", "CASH", "TRADE_IN"].includes(cuenta.kind) && cuenta.reference) partes.push(cuenta.reference);
  return partes.join(" \xB7 ");
}

// src/components/TarjetaCuentaCobro.jsx
import { jsx as jsx30, jsxs as jsxs23 } from "react/jsx-runtime";
var normalizar3 = (valor) => String(valor ?? "").trim().toLowerCase();
function TarjetaCuentaCobro({
  cuenta,
  logo,
  saldoPendientePyg = 0,
  cotizacionPyg = 0,
  detalle,
  acciones,
  onCambiar,
  textoCambiar = "Cambiar cuenta",
  testId = "cuenta-cobro",
  className
}) {
  if (!cuenta) return null;
  const medio = etiquetaMedioCuenta(cuenta.kind);
  const moneda = simboloCuenta(cuenta.currency, cuenta.currencyLabel);
  const banco = String(cuenta.bank || "").trim();
  const mostrarBanco = Boolean(banco) && !normalizar3(cuenta.name).includes(normalizar3(banco));
  const detalleTexto = detalle ?? detalleCuentaCobro(cuenta);
  const pendiente = Math.max(0, Number(saldoPendientePyg) || 0);
  const cotizacion = Number(cotizacionPyg) || 0;
  const equivalente = cuenta.currency !== "PYG" && cotizacion > 0 ? pendiente / cotizacion : null;
  return /* @__PURE__ */ jsxs23(
    "div",
    {
      "data-testid": testId,
      className: cn("flex items-start gap-3 rounded-xl border border-fono/25 bg-fono/5 p-3", className),
      children: [
        /* @__PURE__ */ jsx30("span", { className: "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-800", children: logo || /* @__PURE__ */ jsx30(Icon, { name: iconoMedioCuenta(cuenta.kind), className: "h-4 w-4 text-fono-light" }) }),
        /* @__PURE__ */ jsxs23("div", { className: "min-w-0 flex-1 space-y-1", children: [
          /* @__PURE__ */ jsxs23("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-1", children: [
            /* @__PURE__ */ jsx30("b", { className: "min-w-0 truncate text-sm text-fore", "data-testid": `${testId}-nombre`, children: cuenta.name }),
            /* @__PURE__ */ jsx30("span", { className: "rounded border border-ink-500 px-1.5 py-0.5 text-[10px] font-bold text-mute", children: moneda }),
            /* @__PURE__ */ jsx30("span", { className: "text-[11px] font-semibold text-mute", children: medio })
          ] }),
          mostrarBanco ? /* @__PURE__ */ jsx30("p", { className: "truncate text-xs text-mute", children: banco }) : null,
          detalleTexto ? /* @__PURE__ */ jsx30("p", { className: "truncate text-xs text-mute", "data-testid": `${testId}-detalle`, children: detalleTexto }) : null,
          pendiente > 0 ? /* @__PURE__ */ jsxs23("p", { className: "text-xs text-mute", "data-testid": `${testId}-saldo`, children: [
            "Saldo pendiente de esta venta:",
            " ",
            /* @__PURE__ */ jsx30("b", { className: "tabular-nums text-warn-text", children: formatGs(pendiente) }),
            equivalente !== null ? /* @__PURE__ */ jsxs23("span", { children: [
              " \xB7 ",
              moneda,
              " ",
              equivalente.toLocaleString("es-PY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ] }) : null
          ] }) : null
        ] }),
        /* @__PURE__ */ jsxs23("span", { className: "flex shrink-0 flex-wrap items-center gap-2", children: [
          acciones,
          onCambiar ? /* @__PURE__ */ jsx30(Button, { type: "button", variant: "ghost", onClick: onCambiar, "data-testid": `${testId}-cambiar`, children: textoCambiar }) : null
        ] })
      ]
    }
  );
}

// src/utils/ventana.js
var MARGEN_VENTANA = 2;
function ventanaDeLista({ total = 0, scrollTop = 0, altoVista = 0, altoFila = 0, margen = MARGEN_VENTANA } = {}) {
  const cantidad = Math.max(0, Math.floor(Number(total) || 0));
  if (cantidad === 0) return { inicio: 0, fin: 0 };
  const fila = Number(altoFila) || 0;
  const vista = Number(altoVista) || 0;
  if (fila <= 0 || vista <= 0) return { inicio: 0, fin: cantidad };
  const margenSeguro = Math.max(0, Math.floor(Number(margen) || 0));
  const visibles = Math.max(1, Math.ceil(vista / fila));
  const primero = Math.min(cantidad - 1, Math.max(0, Math.floor((Number(scrollTop) || 0) / fila)));
  return {
    inicio: Math.max(0, primero - margenSeguro),
    fin: Math.min(cantidad, primero + visibles + margenSeguro)
  };
}

// src/components/SelectorCuentaCobro.jsx
import { jsx as jsx31, jsxs as jsxs24 } from "react/jsx-runtime";
var ALTO_OPCION = 48;
var ALTO_VISTA = 224;
var MARGEN = 2;
function SelectorCuentaCobro({
  cuentas = [],
  cuentaId = "",
  onSelect,
  onCambiar,
  saldoPendientePyg = 0,
  cotizacionPyg = 0,
  logo,
  detalle,
  textoCambiar = "Cambiar cuenta",
  placeholder = "Buscar cuenta\u2026",
  ariaLabel = "Cuenta de cobro",
  vacio = "Sin cuentas que coincidan.",
  limite = LIMITE_CUENTAS,
  incluirInactivas = false,
  preseleccionar = false,
  ultimoUsadoId = "",
  predeterminadaId = "",
  disabled = false,
  testId = "cuenta-cobro",
  className
}) {
  const [eligiendo, setEligiendo] = useState13(!cuentaId);
  const [consulta, setConsulta] = useState13("");
  const [resaltado, setResaltado] = useState13(0);
  const [scrollTop, setScrollTop] = useState13(0);
  const [altoVista, setAltoVista] = useState13(ALTO_VISTA);
  const [altoOpcion, setAltoOpcion] = useState13(ALTO_OPCION);
  const listaId = useId11();
  const raiz = useRef11(null);
  const lista = useRef11(null);
  const seleccionada = useMemo9(
    () => (Array.isArray(cuentas) ? cuentas : []).find((cuenta) => cuenta.id === cuentaId) || null,
    [cuentas, cuentaId]
  );
  const idSeleccionado = seleccionada?.id || "";
  useEffect12(() => {
    setEligiendo(!idSeleccionado);
    setConsulta("");
    setScrollTop(0);
  }, [idSeleccionado]);
  const sugeridaRef = useRef11("");
  useEffect12(() => {
    if (!preseleccionar) return;
    if (idSeleccionado) {
      sugeridaRef.current = "";
      return;
    }
    const sugerida = preseleccionDeCuenta(cuentas, { ultimoUsadoId, predeterminadaId, incluirInactivas });
    if (!sugerida || sugerida.id === sugeridaRef.current) return;
    sugeridaRef.current = sugerida.id;
    onSelect?.(sugerida);
  }, [preseleccionar, idSeleccionado, cuentas, ultimoUsadoId, predeterminadaId, incluirInactivas, onSelect]);
  useEffect12(() => {
    if (!eligiendo) return void 0;
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      setConsulta("");
      setScrollTop(0);
      if (idSeleccionado) setEligiendo(false);
    };
    document.addEventListener("click", cerrarFuera);
    return () => document.removeEventListener("click", cerrarFuera);
  }, [eligiendo, idSeleccionado]);
  const resultados = useMemo9(
    () => filtrarCuentasCobro(cuentas, consulta, { limite, incluirInactivas }),
    [cuentas, consulta, limite, incluirInactivas]
  );
  const listaVisible = eligiendo && !disabled && resultados.length > 0;
  const ventana = useMemo9(
    () => ventanaDeLista({ total: resultados.length, scrollTop, altoVista, altoFila: altoOpcion, margen: MARGEN }),
    [resultados.length, scrollTop, altoVista, altoOpcion]
  );
  const visibles = resultados.slice(ventana.inicio, ventana.fin);
  useEffect12(() => {
    const nodo = lista.current;
    if (!nodo) return;
    const fila = nodo.querySelector('[role="option"]')?.getBoundingClientRect().height;
    if (fila && Math.round(fila) !== altoOpcion) setAltoOpcion(Math.round(fila));
    if (nodo.clientHeight > 0 && nodo.clientHeight !== altoVista) setAltoVista(nodo.clientHeight);
  }, [listaVisible, consulta, altoOpcion, altoVista]);
  useEffect12(() => {
    if (!listaVisible) return;
    const nodo = lista.current;
    if (!nodo) return;
    const arriba = resaltado * altoOpcion;
    const abajo = arriba + altoOpcion;
    if (arriba < nodo.scrollTop) nodo.scrollTop = arriba;
    else if (abajo > nodo.scrollTop + nodo.clientHeight) nodo.scrollTop = abajo - nodo.clientHeight;
  }, [resaltado, listaVisible, altoOpcion]);
  function elegir(cuenta) {
    onSelect?.(cuenta);
    setEligiendo(false);
    setConsulta("");
    setResaltado(0);
    setScrollTop(0);
  }
  function alEscribir(event) {
    setConsulta(event.target.value);
    setResaltado(0);
    setScrollTop(0);
    if (lista.current) lista.current.scrollTop = 0;
  }
  function alDesplazar(event) {
    setScrollTop(event.currentTarget.scrollTop);
    if (event.currentTarget.clientHeight > 0) setAltoVista(event.currentTarget.clientHeight);
  }
  function alTeclear(event) {
    if (event.key === "Escape") {
      setConsulta("");
      setScrollTop(0);
      if (idSeleccionado) setEligiendo(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!resultados.length) return;
      const paso = event.key === "ArrowDown" ? 1 : -1;
      setResaltado((actual) => (actual + paso + resultados.length) % resultados.length);
      return;
    }
    if (event.key === "Enter" && listaVisible && resultados[resaltado]) {
      event.preventDefault();
      elegir(resultados[resaltado]);
    }
  }
  if (seleccionada && !eligiendo) {
    return /* @__PURE__ */ jsx31(
      TarjetaCuentaCobro,
      {
        cuenta: seleccionada,
        logo: typeof logo === "function" ? logo(seleccionada) : logo,
        detalle: typeof detalle === "function" ? detalle(seleccionada) : detalle,
        saldoPendientePyg,
        cotizacionPyg,
        onCambiar: () => {
          setEligiendo(true);
          onCambiar?.();
        },
        textoCambiar,
        testId,
        className
      }
    );
  }
  return /* @__PURE__ */ jsxs24("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx31(
      Input,
      {
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": listaId,
        "aria-autocomplete": "list",
        "aria-activedescendant": listaVisible ? `${listaId}-${resaltado}` : void 0,
        "aria-label": ariaLabel,
        autoComplete: "off",
        disabled,
        value: consulta,
        placeholder,
        "data-testid": `${testId}-buscar`,
        onChange: alEscribir,
        onFocus: () => setEligiendo(true),
        onKeyDown: alTeclear
      }
    ),
    listaVisible && /* @__PURE__ */ jsx31(
      "ul",
      {
        ref: lista,
        id: listaId,
        role: "listbox",
        "aria-label": "Cuentas de cobro",
        onScroll: alDesplazar,
        style: {
          paddingTop: 4 + ventana.inicio * altoOpcion,
          paddingBottom: 4 + Math.max(0, resultados.length - ventana.fin) * altoOpcion
        },
        className: "absolute left-0 right-0 top-full z-30 mt-1 max-h-[min(60vh,18rem)] overflow-y-auto overscroll-contain rounded-xl border border-ink-500 bg-ink p-1 shadow-float",
        children: visibles.map((cuenta, posicion) => {
          const indice = ventana.inicio + posicion;
          const logoCuenta = typeof logo === "function" ? logo(cuenta) : null;
          const dato = [cuenta.holder, cuenta.accountNumber ? numeroParcialCuenta(cuenta.accountNumber) : null].filter(Boolean).join(" \xB7 ");
          return /* @__PURE__ */ jsxs24(
            "li",
            {
              id: `${listaId}-${indice}`,
              role: "option",
              "aria-selected": indice === resaltado,
              "aria-posinset": indice + 1,
              "aria-setsize": resultados.length,
              onMouseDown: (event) => event.preventDefault(),
              onMouseEnter: () => setResaltado(indice),
              onClick: () => elegir(cuenta),
              className: cn(
                "flex h-12 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm transition",
                indice === resaltado ? "bg-fono/10 text-fore" : "text-mute hover:bg-ink-700/60 hover:text-fore"
              ),
              children: [
                /* @__PURE__ */ jsx31("span", { className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-800", children: logoCuenta || /* @__PURE__ */ jsx31(Icon, { name: iconoMedioCuenta(cuenta.kind), className: "h-3.5 w-3.5 text-fono-light" }) }),
                /* @__PURE__ */ jsxs24("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx31("span", { className: "block truncate font-medium text-fore", children: cuenta.name }),
                  /* @__PURE__ */ jsx31("span", { className: "block truncate text-xs text-mute", children: [etiquetaMedioCuenta(cuenta.kind), simboloCuenta(cuenta.currency, cuenta.currencyLabel), dato].filter(Boolean).join(" \xB7 ") })
                ] })
              ]
            },
            cuenta.id
          );
        })
      }
    ),
    eligiendo && !disabled && !resultados.length && consulta ? /* @__PURE__ */ jsx31("p", { className: "mt-1 text-xs text-mute", children: vacio }) : null
  ] });
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

// src/components/BuscadorDispositivo.jsx
import { useEffect as useEffect13, useId as useId12, useMemo as useMemo10, useRef as useRef12, useState as useState14 } from "react";

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

// src/components/BuscadorDispositivo.jsx
import { jsx as jsx32, jsxs as jsxs25 } from "react/jsx-runtime";
function BuscadorDispositivo({
  valor = {},
  onCambio,
  tipo = "mobile",
  perfil,
  catalogo,
  buscarPorCodigo = true,
  permitirLibre = true,
  limite = 8,
  disabled = false,
  etiquetas,
  className
}) {
  const base = perfil || PERFILES_DISPOSITIVO[tipo] || PERFILES_DISPOSITIVO.mobile;
  const config = useMemo10(() => ({
    ...base,
    catalogo: { ...base.catalogo || {}, ...catalogo || {} },
    etiquetas: { ...base.etiquetas || {}, ...etiquetas || {} }
  }), [base, catalogo, etiquetas]);
  const modelos = config.catalogo.modelos || [];
  const campos = config.campos || [];
  const etiqueta = (campo) => config.etiquetas?.[campo] || campo.charAt(0).toUpperCase() + campo.slice(1);
  const [texto, setTexto] = useState14(() => valor.modelo || "");
  const [abierto, setAbierto] = useState14(false);
  const campoId = useId12();
  const raiz = useRef12(null);
  useEffect13(() => {
    setTexto(valor.modelo || "");
  }, [valor.modelo]);
  useEffect13(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      setAbierto(false);
    };
    document.addEventListener("click", cerrarFuera);
    return () => document.removeEventListener("click", cerrarFuera);
  }, []);
  const sugerencias = useMemo10(() => buscarDispositivo(modelos, texto, { porCodigo: buscarPorCodigo, limite }), [modelos, texto, buscarPorCodigo, limite]);
  const modeloElegido = useMemo10(() => {
    const q = String(valor.modelo || "").trim().toLowerCase();
    return modelos.find((modelo) => nombreDeDispositivo(modelo).toLowerCase() === q) || null;
  }, [modelos, valor.modelo]);
  function emitir(siguiente, campo) {
    onCambio?.(siguiente, campo ? { campo } : void 0);
  }
  function elegir(modelo) {
    emitir(limpiarDependientes(valor, modelo, config));
    setTexto(nombreDeDispositivo(modelo));
    setAbierto(false);
  }
  function confirmarLibre() {
    if (!permitirLibre) return;
    const limpio = texto.trim();
    if (!limpio || limpio === valor.modelo) return;
    emitir(limpiarDependientes(valor, limpio, config));
  }
  function cambiarDependiente(campo, valorCampo) {
    emitir({ ...valor, [campo]: valorCampo }, campo);
  }
  const listaVisible = abierto && Boolean(texto.trim()) && sugerencias.length > 0;
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: setAbierto,
    onSelect: elegir,
    getOptionKey: (modelo) => `${nombreDeDispositivo(modelo)}-${codigoDeDispositivo(modelo)}`,
    listboxId: `${campoId}-lista`
  });
  function onKeyDown(event) {
    navegacion.inputProps.onKeyDown(event);
    if (event.key === "Enter" && !event.defaultPrevented) {
      event.preventDefault();
      confirmarLibre();
    }
  }
  return /* @__PURE__ */ jsxs25("div", { className: cn("space-y-3", className), children: [
    /* @__PURE__ */ jsxs25("div", { ref: raiz, className: "relative", children: [
      /* @__PURE__ */ jsx32(Label, { htmlFor: campoId, children: etiqueta("modelo") }),
      /* @__PURE__ */ jsx32(
        Input,
        {
          id: campoId,
          ref: navegacion.inputRef,
          type: "text",
          role: "combobox",
          "aria-expanded": listaVisible,
          "aria-controls": navegacion.listboxId,
          "aria-autocomplete": "list",
          "aria-activedescendant": navegacion.activeOptionId,
          autoComplete: "off",
          disabled,
          value: texto,
          placeholder: permitirLibre ? "Buscar por nombre o c\xF3digo\u2026" : "Buscar modelo\u2026",
          onChange: (event) => {
            setTexto(event.target.value);
            setAbierto(true);
            navegacion.setActiveIndex(0);
            if (!event.target.value) emitir(limpiarDependientes(valor, "", config));
          },
          onFocus: () => setAbierto(true),
          onBlur: () => {
            setTimeout(() => {
              setAbierto(false);
              confirmarLibre();
            }, 120);
          },
          onKeyDown
        }
      ),
      listaVisible && /* @__PURE__ */ jsx32("ul", { ...navegacion.listboxProps, className: "absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-ink-500 bg-ink py-1 shadow-float", children: sugerencias.map((modelo, indice) => /* @__PURE__ */ jsxs25(
        "li",
        {
          ...navegacion.getOptionProps(indice),
          className: cn("flex min-h-11 cursor-pointer items-baseline justify-between gap-2 px-3 py-2 text-left text-sm transition", indice === navegacion.activeIndex && "bg-ink-700"),
          children: [
            /* @__PURE__ */ jsx32("span", { className: "min-w-0 truncate", children: nombreDeDispositivo(modelo) }),
            codigoDeDispositivo(modelo) ? /* @__PURE__ */ jsx32("span", { className: "shrink-0 font-mono text-[11px] text-mute", children: codigoDeDispositivo(modelo) }) : null
          ]
        },
        nombreDeDispositivo(modelo)
      )) }),
      abierto && texto.trim() && permitirLibre && sugerencias.length === 0 && /* @__PURE__ */ jsxs25("p", { className: "mt-1 text-xs text-mute", children: [
        "No est\xE1 en el cat\xE1logo: se guarda \xAB",
        texto.trim(),
        "\xBB tal cual."
      ] })
    ] }),
    valor.modelo && campos.length > 0 && /* @__PURE__ */ jsx32("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: campos.map((campo) => {
      const opciones = opcionesDependiente(modeloElegido, campo, config);
      const id = `${campoId}-${campo}`;
      return /* @__PURE__ */ jsxs25("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx32(Label, { htmlFor: id, children: etiqueta(campo) }),
        /* @__PURE__ */ jsxs25(Select, { id, value: valor[campo] || "", disabled, onChange: (event) => cambiarDependiente(campo, event.target.value), children: [
          /* @__PURE__ */ jsx32("option", { value: "", children: "Elegir\u2026" }),
          opciones.map((opcion) => /* @__PURE__ */ jsx32("option", { value: opcion, children: opcion }, opcion))
        ] })
      ] }, campo);
    }) })
  ] });
}

// src/components/RucField.jsx
import { useId as useId13, useState as useState15 } from "react";
import { jsx as jsx33, jsxs as jsxs26 } from "react/jsx-runtime";
function RucField({
  id,
  value,
  onChange,
  onAplicar,
  consultar,
  disabled = false,
  consultarDisabled = false,
  mostrarExtractor = true,
  maxLength = 100,
  placeholder = "80012345-6",
  autoComplete = "off",
  ariaLabel,
  textoAyuda = "La raz\xF3n social se aplica solo si la confirm\xE1s.",
  className,
  ...inputProps
}) {
  const generado = useId13();
  const inputId = id || generado;
  const ayudaId = `${inputId}-ayuda`;
  const errorId = `${inputId}-error`;
  const [resultado, setResultado] = useState15(null);
  const [consultando, setConsultando] = useState15(false);
  const [error, setError] = useState15("");
  const hayRuc = Boolean(String(value || "").trim());
  const puedeExtraer = mostrarExtractor && typeof consultar === "function";
  async function extraer() {
    const ruc = String(value || "").trim();
    if (!ruc || consultando || !puedeExtraer) return;
    setConsultando(true);
    setError("");
    setResultado(null);
    try {
      const datos = await consultar(ruc);
      if (!datos?.name) throw new Error("No encontramos datos para ese RUC.");
      setResultado(datos);
    } catch (causa) {
      setError(causa?.message || "No se pudo consultar el RUC. Pod\xE9s completar los datos manualmente.");
    } finally {
      setConsultando(false);
    }
  }
  return /* @__PURE__ */ jsxs26("div", { className: cn("space-y-2", className), children: [
    /* @__PURE__ */ jsxs26("div", { className: "relative", children: [
      /* @__PURE__ */ jsx33(
        Input,
        {
          ...inputProps,
          id: inputId,
          "aria-label": ariaLabel,
          "aria-describedby": [inputProps["aria-describedby"], puedeExtraer && textoAyuda ? ayudaId : null, error ? errorId : null].filter(Boolean).join(" ") || void 0,
          "aria-invalid": inputProps["aria-invalid"] ?? (error ? true : void 0),
          className: puedeExtraer ? consultando ? "pr-32" : "pr-11" : void 0,
          maxLength,
          autoComplete,
          disabled,
          value,
          onChange: (event) => {
            onChange(event.target.value);
            setResultado(null);
            setError("");
          },
          placeholder
        }
      ),
      puedeExtraer && /* @__PURE__ */ jsx33(
        BotonDentroCampo,
        {
          etiqueta: "Extraer los datos del RUC",
          titulo: hayRuc ? "Extraer los datos del RUC" : "Ingres\xE1 el RUC para extraer los datos",
          etiquetaOcupada: "Consultando\u2026",
          disabled: disabled || consultarDisabled || !hayRuc,
          ocupado: consultando,
          onClick: extraer
        }
      )
    ] }),
    puedeExtraer && textoAyuda && /* @__PURE__ */ jsx33("span", { id: ayudaId, className: "block text-xs text-mute", children: textoAyuda }),
    resultado && /* @__PURE__ */ jsxs26("div", { role: "status", className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fono/25 bg-fono/5 p-3 text-sm", children: [
      /* @__PURE__ */ jsxs26("span", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs26("span", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx33("b", { className: "truncate", children: resultado.name }),
          resultado.simulado && /* @__PURE__ */ jsx33(Badge, { color: "blue", children: "Simulada en demo" })
        ] }),
        /* @__PURE__ */ jsxs26("span", { className: "block text-mute", children: [
          "RUC ",
          resultado.fullRuc
        ] }),
        resultado.simulado && /* @__PURE__ */ jsx33("span", { className: "block text-xs text-mute", children: "Resultado ficticio: la demo no consulta registros reales." })
      ] }),
      /* @__PURE__ */ jsx33("button", { type: "button", className: "min-h-11 rounded-lg px-2 font-semibold text-fono-light", onClick: () => {
        onAplicar?.(resultado);
        setResultado(null);
      }, children: "Usar estos datos" })
    ] }),
    error && /* @__PURE__ */ jsx33("p", { id: errorId, role: "alert", className: "text-sm text-bad-text", children: error })
  ] });
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

// src/components/SerialTexto.jsx
import { jsx as jsx34, jsxs as jsxs27 } from "react/jsx-runtime";
function SerialTexto({ serial, className, tonoCola = "text-fore", vacio = "\u2014", enmascarar = false }) {
  if (enmascarar) {
    const mascara = serialEnmascarado(serial);
    if (!mascara) return /* @__PURE__ */ jsx34("span", { className: cn("font-mono", className), children: vacio });
    return /* @__PURE__ */ jsx34("span", { className: cn("font-mono", className), title: String(serial), children: mascara });
  }
  const { cabeza, cola } = partirSerial(serial);
  if (!cola) return /* @__PURE__ */ jsx34("span", { className: cn("font-mono", className), children: vacio });
  return /* @__PURE__ */ jsxs27("span", { className: cn("flex min-w-0 font-mono", className), title: String(serial), children: [
    /* @__PURE__ */ jsx34("span", { className: "min-w-0 truncate", children: cabeza }),
    /* @__PURE__ */ jsx34("b", { className: cn("shrink-0", tonoCola), children: cola })
  ] });
}

// src/components/CampoSeriales.jsx
import { useMemo as useMemo11, useState as useState16 } from "react";
import { jsx as jsx35, jsxs as jsxs28 } from "react/jsx-runtime";
function CampoSeriales({
  valor,
  onCambio,
  validar,
  limite = 9999,
  maxLargo = 32,
  etiqueta = "Seriales / IMEI",
  placeholder = "Peg\xE1 o escane\xE1 los seriales (uno por l\xEDnea)",
  ayuda,
  disabled = false,
  className
}) {
  const [texto, setTexto] = useState16(() => Array.isArray(valor) ? valor.join("\n") : valor || "");
  const resultado = useMemo11(() => normalizarSeriales(texto, { validar, limite, maxLargo }), [texto, validar, limite, maxLargo]);
  function cambiar(siguiente) {
    setTexto(siguiente);
    const limpio = normalizarSeriales(siguiente, { validar, limite, maxLargo });
    onCambio?.(limpio.seriales, limpio);
  }
  const hay = resultado.seriales.length > 0;
  return /* @__PURE__ */ jsxs28("div", { className: cn("space-y-2", className), children: [
    etiqueta ? /* @__PURE__ */ jsx35("span", { className: "block text-xs font-semibold text-mute", children: etiqueta }) : null,
    /* @__PURE__ */ jsx35(
      Textarea,
      {
        rows: 4,
        value: texto,
        disabled,
        placeholder,
        onChange: (event) => cambiar(event.target.value),
        spellCheck: false,
        autoCapitalize: "characters"
      }
    ),
    /* @__PURE__ */ jsxs28("p", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", role: "status", children: [
      /* @__PURE__ */ jsxs28("span", { className: hay ? "font-semibold text-ok-text" : "text-mute", children: [
        resultado.seriales.length,
        " listo(s) para cargar"
      ] }),
      resultado.repetidos.length > 0 && /* @__PURE__ */ jsxs28("span", { className: "text-warn-text", children: [
        resultado.repetidos.length,
        " repetido(s)"
      ] }),
      resultado.invalidos.length > 0 && /* @__PURE__ */ jsxs28("span", { className: "text-bad-text", children: [
        resultado.invalidos.length,
        " inv\xE1lido(s)"
      ] })
    ] }),
    resultado.invalidos.length > 0 && /* @__PURE__ */ jsxs28("p", { className: "break-words text-[11px] text-mute", title: resultado.invalidos.join(" \xB7 "), children: [
      "Revis\xE1: ",
      resultado.invalidos.slice(0, 5).join(" \xB7 "),
      resultado.invalidos.length > 5 ? " \u2026" : ""
    ] }),
    ayuda ? /* @__PURE__ */ jsx35("p", { className: "text-[11px] text-mute", children: ayuda }) : null
  ] });
}

// src/components/EstadoBadge.jsx
import { jsx as jsx36 } from "react/jsx-runtime";
function EstadoBadge({ mapa, valor, vacio = "Sin estado" }) {
  const item = mapa?.[valor];
  if (item) return /* @__PURE__ */ jsx36(Badge, { color: item.color, children: item.label });
  return /* @__PURE__ */ jsx36(Badge, { children: valor || vacio });
}

// src/components/SeccionColapsable.jsx
import { useId as useId14, useState as useState17 } from "react";

// src/utils/tabla.js
var ROTULO_DATO = "text-[10px] font-bold uppercase tracking-wider text-mute";
var CELDA_ENCABEZADO = `truncate ${ROTULO_DATO}`;
var ROTULO_SECCION = "text-xs font-bold uppercase tracking-wider text-mute";
var CELDA_DATO = "truncate text-xs text-mute";
var CELDA_NUMERO = "text-right tabular-nums";
var CELDA_IDENTIDAD = "truncate text-[13px] font-semibold";
var CELDA_IDENTIDAD_GRANDE = "truncate text-sm font-semibold";

// src/components/SeccionColapsable.jsx
import { jsx as jsx37, jsxs as jsxs29 } from "react/jsx-runtime";
function SeccionColapsable({ id, titulo: titulo2, resumen, icono, abierta = false, clave = id, className = "", children }) {
  const autoId = useId14();
  const panelId = `seccion-panel-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [expandida, setExpandida] = useState17(() => {
    if (!clave) return abierta;
    try {
      const guardado = window.sessionStorage.getItem(clave);
      return guardado == null ? abierta : guardado === "1";
    } catch {
      return abierta;
    }
  });
  function alternar() {
    setExpandida((actual) => {
      const siguiente = !actual;
      if (clave) {
        try {
          window.sessionStorage.setItem(clave, siguiente ? "1" : "0");
        } catch {
        }
      }
      return siguiente;
    });
  }
  return /* @__PURE__ */ jsxs29("section", { className: cn("rounded-2xl border border-ink-600 bg-ink-900", className), children: [
    /* @__PURE__ */ jsxs29(
      "button",
      {
        type: "button",
        "aria-expanded": expandida,
        "aria-controls": panelId,
        onClick: alternar,
        className: "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-ink-800/60",
        children: [
          icono ? /* @__PURE__ */ jsx37(Icon, { name: icono, className: "h-4 w-4 shrink-0 text-mute" }) : null,
          /* @__PURE__ */ jsxs29("span", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx37("span", { className: cn("block", ROTULO_SECCION), children: titulo2 }),
            resumen ? /* @__PURE__ */ jsx37("span", { className: "mt-0.5 block truncate text-sm", children: resumen }) : null
          ] }),
          /* @__PURE__ */ jsx37(Icon, { name: "chevron", className: cn("h-4 w-4 shrink-0 text-mute transition-transform", expandida && "rotate-180") })
        ]
      }
    ),
    /* @__PURE__ */ jsx37("div", { id: panelId, hidden: !expandida, className: "border-t border-ink-600/70 px-4 pb-4 pt-3", children })
  ] });
}

// src/components/TaxIdField.jsx
import { useId as useId15, useState as useState18 } from "react";

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

// src/components/TaxIdField.jsx
import { jsx as jsx38, jsxs as jsxs30 } from "react/jsx-runtime";
function TaxIdField({
  label = "RUC / identificaci\xF3n fiscal",
  value = "",
  onChange,
  pais = "PY",
  onBuscarRazonSocial,
  onAplicarRazonSocial,
  etiquetaConsulta = "Consultar RUC",
  mensajeInvalido = MENSAJE_RUC,
  mensajeSinDatos = MENSAJE_RUC_SIN_DATOS,
  mensajeError = MENSAJE_RUC_CONSULTA,
  hint,
  error,
  required = false,
  disabled = false,
  maxLength = 32,
  id,
  name,
  className,
  ...props
}) {
  const generado = useId15();
  const inputId = id || generado;
  const descripcionId = `${inputId}-descripcion`;
  const [tocado, setTocado] = useState18(false);
  const [consulta, setConsulta] = useState18({ estado: "inicial" });
  const esRucPy = String(pais).trim().toUpperCase() === "PY";
  const normalizado = normalizeTaxId(value);
  const invalido = normalizado !== null && !taxIdValidoParaPais(normalizado, pais);
  const errorVisible = error ?? (tocado && invalido ? mensajeInvalido : null);
  const consultando = consulta.estado === "consultando";
  const consultable = Boolean(normalizado) && !invalido;
  async function consultar() {
    const taxId = normalizeTaxId(value);
    if (!taxId || !taxIdValidoParaPais(taxId, pais)) {
      setConsulta({ estado: "error", mensaje: mensajeInvalido });
      return;
    }
    setConsulta({ estado: "consultando" });
    try {
      const razonSocial = await onBuscarRazonSocial(taxId);
      const texto = typeof razonSocial === "string" ? razonSocial.trim() : "";
      if (!texto) {
        setConsulta({ estado: "error", mensaje: mensajeSinDatos });
        return;
      }
      setConsulta({ estado: "encontrada", razonSocial: texto });
    } catch {
      setConsulta({ estado: "error", mensaje: mensajeError });
    }
  }
  function aplicar() {
    onAplicarRazonSocial?.(consulta.razonSocial);
    setConsulta({ estado: "inicial" });
  }
  return /* @__PURE__ */ jsxs30(FormField, { label, hint, error: errorVisible, htmlFor: inputId, descripcionId, children: [
    /* @__PURE__ */ jsxs30("div", { className: "relative", children: [
      /* @__PURE__ */ jsx38(
        Input,
        {
          id: inputId,
          name,
          value,
          disabled,
          required,
          inputMode: esRucPy ? "numeric" : "text",
          autoComplete: "off",
          spellCheck: false,
          placeholder: esRucPy ? "80012345-6" : "",
          onBlur: () => setTocado(true),
          "aria-invalid": errorVisible ? true : void 0,
          "aria-describedby": errorVisible || hint ? descripcionId : void 0,
          onChange: (event) => {
            setConsulta({ estado: "inicial" });
            onChange?.(limpiarTaxId(event.target.value, maxLength));
          },
          className: cn(onBuscarRazonSocial && (consultando ? "pr-32" : "pr-11"), className),
          ...props
        }
      ),
      onBuscarRazonSocial ? /* @__PURE__ */ jsx38(
        BotonDentroCampo,
        {
          etiqueta: etiquetaConsulta,
          titulo: etiquetaConsulta,
          ocupado: consultando,
          disabled: disabled || !consultable,
          onClick: () => void consultar()
        }
      ) : null
    ] }),
    consulta.estado === "encontrada" ? /* @__PURE__ */ jsxs30("div", { role: "status", className: "mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-xs", children: [
      /* @__PURE__ */ jsxs30("span", { className: "text-mute", children: [
        "Raz\xF3n social: ",
        /* @__PURE__ */ jsx38("b", { className: "font-semibold text-fore", children: consulta.razonSocial })
      ] }),
      onAplicarRazonSocial ? /* @__PURE__ */ jsx38(
        "button",
        {
          type: "button",
          onClick: aplicar,
          className: "rounded-md px-2 py-1 text-xs font-semibold text-fono-light transition hover:bg-fono/10",
          children: "Usar raz\xF3n social"
        }
      ) : null
    ] }) : null,
    consulta.estado === "error" ? /* @__PURE__ */ jsx38("p", { role: "alert", className: "mt-1.5 text-xs text-bad-text", children: consulta.mensaje }) : null
  ] });
}

// src/components/GoogleButton.jsx
import { jsx as jsx39, jsxs as jsxs31 } from "react/jsx-runtime";
function GoogleMark({ className }) {
  return /* @__PURE__ */ jsxs31("svg", { "aria-hidden": "true", viewBox: "0 0 18 18", className: cn("h-[18px] w-[18px] shrink-0", className), children: [
    /* @__PURE__ */ jsx39("path", { fill: "#EA4335", d: "M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.909c1.703-1.568 2.683-3.878 2.683-6.615Z" }),
    /* @__PURE__ */ jsx39("path", { fill: "#4285F4", d: "M9 18c2.43 0 4.467-.806 5.957-2.18l-2.91-2.258c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.037-3.71H.956v2.331A9 9 0 0 0 9 18Z" }),
    /* @__PURE__ */ jsx39("path", { fill: "#FBBC05", d: "M3.963 10.712A5.412 5.412 0 0 1 3.681 9c0-.594.102-1.171.282-1.712V4.957H.956A9 9 0 0 0 0 9c0 1.452.348 2.827.956 4.043l3.007-2.331Z" }),
    /* @__PURE__ */ jsx39("path", { fill: "#34A853", d: "M9 3.578c1.322 0 2.508.454 3.441 1.345l2.581-2.582C13.463.891 11.426 0 9 0A9 9 0 0 0 .956 4.957l3.007 2.331C4.672 5.162 6.656 3.578 9 3.578Z" })
  ] });
}
function OAuthDivider({ texto = "o", className }) {
  return /* @__PURE__ */ jsxs31("div", { className: cn("flex items-center gap-4 py-1 text-sm font-medium text-mute", className), children: [
    /* @__PURE__ */ jsx39("span", { className: "h-px flex-1 bg-fore/10" }),
    texto,
    /* @__PURE__ */ jsx39("span", { className: "h-px flex-1 bg-fore/10" })
  ] });
}
function GoogleButton({
  crear = false,
  busy = false,
  onClick,
  etiquetaCrear = "Crear con Google",
  etiquetaContinuar = "Continuar con Google",
  etiquetaBusy = "Conectando con Google\u2026",
  className
}) {
  return /* @__PURE__ */ jsxs31(
    "button",
    {
      type: "button",
      onClick,
      disabled: busy,
      "aria-busy": busy,
      className: cn(
        "group flex h-14 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-base font-semibold text-slate-900 shadow-sm transition",
        "hover:-translate-y-px hover:border-white hover:bg-slate-50 hover:shadow-lg",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fono",
        "disabled:cursor-wait disabled:opacity-70 sm:rounded-full",
        className
      ),
      children: [
        busy ? /* @__PURE__ */ jsx39("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#4285F4]" }) : /* @__PURE__ */ jsx39(GoogleMark, {}),
        /* @__PURE__ */ jsx39("span", { className: "ml-3", children: busy ? etiquetaBusy : crear ? etiquetaCrear : etiquetaContinuar })
      ]
    }
  );
}

// src/components/AuthLayout.jsx
import { jsx as jsx40, jsxs as jsxs32 } from "react/jsx-runtime";
function AuthLayout({ logo, aside, acciones, pie, children, className }) {
  return /* @__PURE__ */ jsxs32("main", { className: cn("relative flex min-h-dvh flex-col overflow-x-hidden bg-paper text-fore", className), children: [
    acciones && /* @__PURE__ */ jsx40("div", { className: "absolute right-4 top-4 z-20", children: acciones }),
    /* @__PURE__ */ jsx40("div", { "aria-hidden": true, className: "pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-fono/15 blur-3xl" }),
    /* @__PURE__ */ jsxs32("div", { className: "mx-auto grid w-full max-w-[1380px] flex-1 items-center gap-12 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_520px] lg:px-12", children: [
      /* @__PURE__ */ jsxs32("section", { className: "hidden lg:block", children: [
        logo,
        aside
      ] }),
      children
    ] }),
    pie && /* @__PURE__ */ jsx40("div", { className: "shrink-0", children: pie })
  ] });
}

// src/components/ProductFooter.jsx
import { jsx as jsx41, jsxs as jsxs33 } from "react/jsx-runtime";
var CREDITO_PIE = "Desarrollado por Owncoding";
var CREDITO_PIE_URL = "https://owncoding.dev/";
function ProductFooter({
  identidad,
  nombre,
  version,
  modelo = "compacto",
  enlaces = [],
  credito,
  creditoUrl,
  anio = (/* @__PURE__ */ new Date()).getFullYear(),
  leading,
  children,
  className
}) {
  const nombreVisible = nombre ?? identidad?.nombre ?? "";
  const versionVisible = version ?? identidad?.etiquetaVersion ?? (identidad?.version ? `v${identidad.version}` : "");
  const creditoVisible = credito === void 0 ? identidad?.credito ?? CREDITO_PIE : credito;
  const creditoHref = creditoUrl ?? identidad?.creditoUrl ?? CREDITO_PIE_URL;
  const distribuido = modelo === "distribuido";
  const apilado = modelo === "apilado";
  return /* @__PURE__ */ jsxs33(
    "footer",
    {
      "data-testid": "product-footer",
      "data-modelo": modelo,
      className: cn(
        "border-t border-fore/10 bg-transparent px-4 py-4 text-xs leading-5 text-mute",
        distribuido ? "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-left" : "text-center",
        apilado && "flex flex-col items-center gap-1",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs33("div", { className: cn("flex min-w-0 flex-wrap items-center justify-center gap-x-2", distribuido && "justify-start"), children: [
          leading,
          /* @__PURE__ */ jsxs33("span", { children: [
            "\xA9 ",
            anio,
            nombreVisible ? ` ${nombreVisible}` : "",
            ". Todos los derechos reservados.",
            versionVisible ? ` \xB7 ${versionVisible}` : ""
          ] }),
          children ? /* @__PURE__ */ jsx41("span", { children }) : null
        ] }),
        enlaces.length > 0 || creditoVisible ? /* @__PURE__ */ jsxs33("nav", { "aria-label": "Informaci\xF3n institucional", className: "flex flex-wrap items-center justify-center gap-x-3 gap-y-1", children: [
          enlaces.map((enlace, indice) => {
            const externo = enlace.externo ?? /^https?:\/\//i.test(enlace.href ?? "");
            return enlace?.href && enlace?.etiqueta ? /* @__PURE__ */ jsxs33(
              "a",
              {
                href: enlace.href,
                target: externo ? "_blank" : void 0,
                rel: externo ? "noreferrer" : void 0,
                className: "toque-44 inline-flex min-h-11 items-center rounded-lg px-1 font-medium text-fono-dark underline-offset-4 hover:underline dark:text-fono-light",
                children: [
                  enlace.etiqueta,
                  externo ? /* @__PURE__ */ jsx41("span", { className: "sr-only", children: " (se abre en otra pesta\xF1a)" }) : null
                ]
              },
              enlace.id ?? enlace.href ?? indice
            ) : null;
          }),
          creditoVisible ? /* @__PURE__ */ jsxs33(
            "a",
            {
              href: creditoHref,
              target: "_blank",
              rel: "noreferrer",
              className: "toque-44 inline-flex min-h-11 items-center rounded-lg px-1 font-medium text-fono-dark underline-offset-4 hover:underline dark:text-fono-light",
              children: [
                creditoVisible,
                /* @__PURE__ */ jsx41("span", { className: "sr-only", children: " (se abre en otra pesta\xF1a)" })
              ]
            }
          ) : null
        ] }) : null
      ]
    }
  );
}

// src/components/ProductPrefooter.jsx
import { jsx as jsx42, jsxs as jsxs34 } from "react/jsx-runtime";
var CLASE_ENLACE = "toque-44 inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-medium text-fono-dark underline-offset-4 hover:underline dark:text-fono-light";
function Enlace({ enlace }) {
  if (!enlace?.href || !enlace?.etiqueta) return null;
  const externo = enlace.externo ?? /^https?:\/\//i.test(enlace.href);
  return /* @__PURE__ */ jsxs34(
    "a",
    {
      href: enlace.href,
      target: externo ? "_blank" : void 0,
      rel: externo ? "noreferrer" : void 0,
      className: cn(CLASE_ENLACE, enlace.className),
      children: [
        enlace.etiqueta,
        externo ? /* @__PURE__ */ jsx42("span", { className: "sr-only", children: " (se abre en otra pesta\xF1a)" }) : null
      ]
    }
  );
}
function ProductPrefooter({
  modelo = "enlaces",
  titulo: titulo2 = "M\xE1s informaci\xF3n",
  descripcion,
  columnas = [],
  accion,
  redes = [],
  children,
  className
}) {
  const mostrarEnlaces = modelo === "enlaces" || modelo === "completo";
  const mostrarAccion = modelo === "accion" || modelo === "completo";
  return /* @__PURE__ */ jsx42(
    "aside",
    {
      "aria-label": titulo2,
      "data-testid": "product-prefooter",
      "data-modelo": modelo,
      className: cn("border-t border-fore/10 bg-ink-800 px-4 py-8 text-fore sm:px-6", className),
      children: /* @__PURE__ */ jsxs34("div", { className: "mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.42fr)]", children: [
        /* @__PURE__ */ jsxs34("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx42("h2", { className: "text-xl font-bold text-fore", children: titulo2 }),
          descripcion ? /* @__PURE__ */ jsx42("p", { className: "mt-2 max-w-2xl text-sm leading-6 text-mute", children: descripcion }) : null,
          mostrarEnlaces && columnas.length > 0 ? /* @__PURE__ */ jsx42("div", { className: "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: columnas.map((columna, indice) => /* @__PURE__ */ jsxs34("section", { "aria-label": columna.titulo, children: [
            columna.titulo ? /* @__PURE__ */ jsx42("h3", { className: "text-sm font-bold text-fore", children: columna.titulo }) : null,
            /* @__PURE__ */ jsx42("ul", { className: "mt-2 space-y-1", children: (columna.enlaces ?? []).map((enlace, enlaceIndice) => /* @__PURE__ */ jsx42("li", { children: /* @__PURE__ */ jsx42(Enlace, { enlace }) }, enlace.id ?? enlace.href ?? enlaceIndice)) })
          ] }, columna.id ?? columna.titulo ?? indice)) }) : null,
          redes.length > 0 ? /* @__PURE__ */ jsx42("nav", { "aria-label": "Redes sociales", className: "mt-6 flex flex-wrap gap-x-4 gap-y-1", children: redes.map((enlace, indice) => /* @__PURE__ */ jsx42(Enlace, { enlace: { ...enlace, externo: true } }, enlace.id ?? enlace.href ?? indice)) }) : null,
          children ? /* @__PURE__ */ jsx42("div", { className: "mt-6 text-sm text-mute", children }) : null
        ] }),
        mostrarAccion && accion ? /* @__PURE__ */ jsxs34("section", { className: "self-start rounded-2xl border border-interactivo bg-ink p-5 shadow-card", "aria-label": accion.titulo, children: [
          /* @__PURE__ */ jsx42("h3", { className: "text-lg font-bold text-fore", children: accion.titulo }),
          accion.descripcion ? /* @__PURE__ */ jsx42("p", { className: "mt-2 text-sm leading-6 text-mute", children: accion.descripcion }) : null,
          accion.enlace ? /* @__PURE__ */ jsx42("div", { className: "mt-4", children: /* @__PURE__ */ jsx42(Enlace, { enlace: accion.enlace }) }) : null
        ] }) : null
      ] })
    }
  );
}

// src/components/LoadingScreen.jsx
import { jsx as jsx43, jsxs as jsxs35 } from "react/jsx-runtime";
function LoadingScreen({ mensaje, label, logo, tienda = null, etiqueta = "", className }) {
  const texto = mensaje ?? label ?? "Cargando\u2026";
  const nombreTienda = tienda?.nombre || "";
  const imagenTienda = tienda?.logo || "";
  return /* @__PURE__ */ jsxs35(
    "div",
    {
      className: cn("relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-paper px-6 text-fore", className),
      role: "status",
      "aria-busy": "true",
      "aria-label": texto,
      children: [
        /* @__PURE__ */ jsx43("div", { "aria-hidden": true, className: "pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-[62%] rounded-full bg-fono/20 blur-3xl" }),
        /* @__PURE__ */ jsx43("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fono/50 to-transparent" }),
        /* @__PURE__ */ jsxs35("div", { className: "relative flex w-full max-w-xs flex-col items-center", children: [
          /* @__PURE__ */ jsx43("div", { className: "drop-shadow-[0_10px_30px_rgba(12,136,118,0.25)] motion-safe:animate-[oc-respira_2.6s_ease-in-out_infinite]", children: logo }),
          /* @__PURE__ */ jsx43("p", { className: "mt-7 text-[11px] font-semibold uppercase tracking-[.22em] text-mute", children: texto }),
          /* @__PURE__ */ jsx43("div", { className: "mt-4 h-[3px] w-44 overflow-hidden rounded-full bg-ink-600/70", "aria-hidden": true, children: /* @__PURE__ */ jsx43("span", { className: "block h-full w-1/3 rounded-full bg-gradient-to-r from-fono/40 via-fono to-fono-light motion-safe:animate-[oc-carga_1.25s_ease-in-out_infinite]" }) })
        ] }),
        nombreTienda && /* @__PURE__ */ jsx43("div", { className: "absolute inset-x-0 bottom-8 flex justify-center px-6", children: /* @__PURE__ */ jsxs35("span", { className: "flex max-w-[22rem] items-center gap-2.5 rounded-full border border-fore/10 bg-ink-800/70 px-3 py-1.5 shadow-card backdrop-blur", children: [
          imagenTienda ? /* @__PURE__ */ jsx43("img", { src: imagenTienda, alt: "", className: "h-6 w-6 shrink-0 rounded-full object-cover", referrerPolicy: "no-referrer" }) : /* @__PURE__ */ jsx43("span", { className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fono/15 text-[10px] font-bold text-fono-text", children: nombreTienda.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsx43("span", { className: "min-w-0 truncate text-xs font-semibold", children: nombreTienda }),
          etiqueta && /* @__PURE__ */ jsx43("span", { className: "shrink-0 rounded-full border border-ink-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-mute", children: etiqueta })
        ] }) })
      ]
    }
  );
}

// src/components/PegarEnlaceToken.jsx
import { useState as useState19 } from "react";

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

// src/components/PegarEnlaceToken.jsx
import { jsx as jsx44, jsxs as jsxs36 } from "react/jsx-runtime";
function PegarEnlaceToken({
  onToken,
  etiqueta = "Peg\xE1 tu enlace completo",
  textoBoton = "Usar este enlace",
  errorMensaje = "No encontramos el c\xF3digo en ese enlace. Peg\xE1 el enlace completo de tu correo.",
  id = "pegar-enlace",
  className
}) {
  const [enlace, setEnlace] = useState19("");
  const [error, setError] = useState19("");
  function aplicar(event) {
    event.preventDefault();
    setError("");
    const token = extractTokenFromUrl(enlace);
    if (!token) return setError(errorMensaje);
    onToken?.(token);
  }
  return /* @__PURE__ */ jsxs36("form", { onSubmit: aplicar, className: className ?? "space-y-3 rounded-xl border border-fono/25 bg-fono/5 p-4", children: [
    /* @__PURE__ */ jsxs36("div", { children: [
      /* @__PURE__ */ jsx44(Label, { htmlFor: id, children: etiqueta }),
      /* @__PURE__ */ jsx44(
        Input,
        {
          id,
          value: enlace,
          onChange: (event) => {
            setEnlace(event.target.value);
            setError("");
          },
          placeholder: "https://\u2026",
          autoComplete: "off",
          className: "mt-1.5"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx44(Aviso, { tono: "error", children: error }),
    /* @__PURE__ */ jsx44(Button, { type: "submit", disabled: !enlace.trim(), children: textoBoton })
  ] });
}

// src/components/NavLateral.jsx
import { Fragment as Fragment5, useState as useState20 } from "react";
import { jsx as jsx45, jsxs as jsxs37 } from "react/jsx-runtime";
function ItemNav({ item, activo, colapsado, onSelect, hijo = false }) {
  return /* @__PURE__ */ jsx45("li", { children: /* @__PURE__ */ jsxs37(
    "button",
    {
      type: "button",
      onClick: () => onSelect?.(item.id),
      "aria-current": activo ? "page" : void 0,
      title: colapsado ? item.label : void 0,
      className: cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
        hijo && "px-2.5 py-1.5 text-[13px]",
        activo ? "bg-fono/15 text-fono-text" : "text-mute hover:bg-ink-700 hover:text-fore",
        colapsado && "justify-center px-2"
      ),
      children: [
        item.icono && /* @__PURE__ */ jsx45(Icon, { name: item.icono, className: cn("shrink-0", hijo ? "h-3.5 w-3.5" : "h-4 w-4") }),
        !colapsado && /* @__PURE__ */ jsx45("span", { className: "min-w-0 flex-1 truncate text-left", children: item.label }),
        !colapsado && item.contador != null && /* @__PURE__ */ jsx45("span", { className: "shrink-0 rounded-full bg-ink-700 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-mute", children: item.contador }),
        colapsado && item.contador != null && /* @__PURE__ */ jsx45("span", { className: "sr-only", children: item.contador })
      ]
    }
  ) });
}
function NavLateral(props) {
  const {
    items = [],
    grupos,
    gruposPlegados,
    defaultGruposPlegados = {},
    onToggleGrupo,
    activeId,
    onSelect,
    colapsado: colapsadoProp,
    defaultColapsado = false,
    onToggle,
    cabecera,
    pie,
    ancho = "w-64",
    ariaLabel = "Navegaci\xF3n principal",
    className
  } = props;
  const gruposControlados = Object.prototype.hasOwnProperty.call(props, "gruposPlegados");
  const colapsoControlado = Object.prototype.hasOwnProperty.call(props, "colapsado");
  const [plegadosInterno, setPlegadosInterno] = useState20(defaultGruposPlegados);
  const [colapsadoInterno, setColapsadoInterno] = useState20(defaultColapsado);
  const plegados = gruposControlados ? gruposPlegados || {} : plegadosInterno;
  const colapsado = colapsoControlado ? Boolean(colapsadoProp) : colapsadoInterno;
  const alternarGrupo = (titulo2) => {
    const siguiente = !Boolean(plegados[titulo2]);
    if (!gruposControlados) setPlegadosInterno((previos) => ({ ...previos, [titulo2]: siguiente }));
    onToggleGrupo?.(titulo2, siguiente);
  };
  const alternarColapso = () => {
    const siguiente = !colapsado;
    if (!colapsoControlado) setColapsadoInterno(siguiente);
    onToggle?.(siguiente);
  };
  const lista = (listaItems) => /* @__PURE__ */ jsx45("ul", { className: "space-y-1", children: listaItems.map((item) => /* @__PURE__ */ jsxs37(Fragment5, { children: [
    /* @__PURE__ */ jsx45(ItemNav, { item, activo: item.id === activeId, colapsado, onSelect }),
    !colapsado && item.hijos?.length ? /* @__PURE__ */ jsx45("li", { children: /* @__PURE__ */ jsx45("ul", { className: "mt-0.5 space-y-0.5 pl-7", children: item.hijos.map((hijo) => /* @__PURE__ */ jsx45(
      ItemNav,
      {
        item: hijo,
        activo: hijo.id === activeId,
        colapsado: false,
        onSelect,
        hijo: true
      },
      hijo.id
    )) }) }) : null
  ] }, item.id)) });
  return /* @__PURE__ */ jsxs37(
    "nav",
    {
      "aria-label": ariaLabel,
      className: cn("flex h-dvh flex-col border-r border-ink-600 bg-ink-900 transition-[width] duration-200", colapsado ? "w-[4.5rem]" : ancho, className),
      children: [
        /* @__PURE__ */ jsxs37("div", { className: cn("flex items-center gap-2 px-3 py-3", colapsado && "justify-center"), children: [
          cabecera && /* @__PURE__ */ jsx45("div", { className: "min-w-0 flex-1", children: cabecera }),
          onToggle && /* @__PURE__ */ jsx45(
            "button",
            {
              type: "button",
              onClick: alternarColapso,
              "aria-label": colapsado ? "Expandir men\xFA" : "Contraer men\xFA",
              "aria-expanded": !colapsado,
              className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-mute transition hover:bg-ink-700 hover:text-fore", colapsado && "w-full"),
              children: /* @__PURE__ */ jsx45(Icon, { name: "back", className: cn("h-4 w-4 transition-transform", colapsado && "rotate-180") })
            }
          )
        ] }),
        /* @__PURE__ */ jsx45("div", { className: "min-h-0 flex-1 space-y-2 overflow-y-auto px-2 py-2", children: grupos ? grupos.map(({ titulo: titulo2, items: itemsGrupo = [] }) => {
          const plegado = Boolean(plegados[titulo2]);
          const tieneActivo = itemsGrupo.some((item) => item.id === activeId);
          return /* @__PURE__ */ jsxs37("div", { className: "flex flex-col", children: [
            !colapsado && /* @__PURE__ */ jsxs37(
              "button",
              {
                type: "button",
                onClick: () => alternarGrupo(titulo2),
                "aria-expanded": !plegado,
                title: plegado ? `Mostrar ${titulo2}` : `Ocultar ${titulo2}`,
                className: "mb-0.5 flex w-full items-center justify-between gap-1 rounded-md px-2.5 py-0.5 text-left transition hover:bg-fore/5",
                children: [
                  /* @__PURE__ */ jsxs37("span", { className: "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-mute", children: [
                    titulo2,
                    plegado && tieneActivo && /* @__PURE__ */ jsx45("span", { className: "h-1.5 w-1.5 rounded-full bg-fono", "aria-hidden": true })
                  ] }),
                  /* @__PURE__ */ jsx45(
                    Icon,
                    {
                      name: "chevron",
                      className: cn("h-3 w-3 shrink-0 text-mute transition-transform duration-200", plegado && "-rotate-90")
                    }
                  )
                ]
              }
            ),
            (!plegado || colapsado) && lista(itemsGrupo)
          ] }, titulo2);
        }) : lista(items) }),
        pie && /* @__PURE__ */ jsx45("div", { className: "border-t border-ink-600 p-2 text-fore", children: pie })
      ]
    }
  );
}

// src/components/MenuDesplegable.jsx
import { useEffect as useEffect14, useRef as useRef13, useState as useState21 } from "react";
import { jsx as jsx46, jsxs as jsxs38 } from "react/jsx-runtime";
function MenuDesplegable({ trigger, items = [], alineacion = "right", ariaLabel = "Men\xFA", className }) {
  const [abierto, setAbierto] = useState21(false);
  const [activo, setActivo] = useState21(0);
  const raiz = useRef13(null);
  const disparador = useRef13(null);
  const menu = useRef13(null);
  const acciones = items.filter((item) => !item.separador && !item.disabled);
  function enfocar(indice) {
    const elementos = menu.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') || [];
    if (!elementos.length) return;
    const siguiente = (indice + elementos.length) % elementos.length;
    setActivo(siguiente);
    elementos[siguiente]?.focus();
  }
  function cerrar({ devolverFoco = false } = {}) {
    setAbierto(false);
    if (devolverFoco) requestAnimationFrame(() => disparador.current?.focus());
  }
  function abrir(indice = 0) {
    if (!acciones.length) return;
    setAbierto(true);
    requestAnimationFrame(() => enfocar(indice));
  }
  useEffect14(() => {
    if (!abierto) return void 0;
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      cerrar();
    };
    document.addEventListener("click", cerrarFuera);
    return () => {
      document.removeEventListener("click", cerrarFuera);
    };
  }, [abierto]);
  function manejarMenu(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      cerrar({ devolverFoco: true });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      enfocar(activo + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      enfocar(activo - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      enfocar(0);
    } else if (event.key === "End") {
      event.preventDefault();
      enfocar(-1);
    }
  }
  return /* @__PURE__ */ jsxs38("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx46(
      "button",
      {
        ref: disparador,
        type: "button",
        "aria-haspopup": "menu",
        "aria-expanded": abierto,
        onClick: () => {
          if (abierto) cerrar();
          else abrir(0);
        },
        onKeyDown: (event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            abrir(event.key === "ArrowDown" ? 0 : -1);
          }
        },
        className: "toque-44 inline-flex min-h-11 items-center gap-2 rounded-lg transition",
        children: trigger
      }
    ),
    abierto && /* @__PURE__ */ jsx46(
      "div",
      {
        ref: menu,
        role: "menu",
        "aria-label": ariaLabel,
        onKeyDown: manejarMenu,
        className: cn("absolute z-30 mt-1 min-w-48 rounded-xl border border-ink-500 bg-ink p-1 shadow-float", alineacion === "right" ? "right-0" : "left-0"),
        children: items.map((item, indice) => {
          if (item.separador) return /* @__PURE__ */ jsx46("div", { role: "separator", className: "my-1 h-px bg-ink-600" }, `sep-${indice}`);
          const indiceActivo = items.slice(0, indice).filter((candidato) => !candidato.separador && !candidato.disabled).length;
          return /* @__PURE__ */ jsxs38(
            "button",
            {
              type: "button",
              role: "menuitem",
              tabIndex: !item.disabled && indiceActivo === activo ? 0 : -1,
              disabled: item.disabled,
              onFocus: () => {
                if (!item.disabled) setActivo(indiceActivo);
              },
              onClick: () => {
                cerrar({ devolverFoco: true });
                item.onClick?.();
              },
              className: cn(
                "flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition",
                item.peligro ? "text-bad-text hover:bg-bad/10" : "text-fore hover:bg-ink-700",
                item.disabled && "cursor-not-allowed opacity-40"
              ),
              children: [
                item.icono && /* @__PURE__ */ jsx46(Icon, { name: item.icono, className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ jsx46("span", { className: "min-w-0 flex-1 truncate", children: item.label }),
                item.extra
              ]
            },
            item.id ?? item.label ?? indice
          );
        })
      }
    )
  ] });
}

// src/components/EnlaceLinea.jsx
import { jsx as jsx47 } from "react/jsx-runtime";
function EnlaceLinea({ href, onClick, children, className }) {
  if (!href) return /* @__PURE__ */ jsx47("span", { className: cn("font-medium", className), children });
  return /* @__PURE__ */ jsx47(
    "a",
    {
      href,
      onClick,
      className: cn(
        "font-medium text-fono-light underline underline-offset-2 hover:no-underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fono/40",
        className
      ),
      children
    }
  );
}

// src/components/AvisoPrivacidad.jsx
import { jsx as jsx48, jsxs as jsxs39 } from "react/jsx-runtime";
function AvisoPrivacidad({
  finalidad,
  detalle,
  politicaUrl,
  politicaTexto = "Pol\xEDtica de privacidad",
  onPolitica,
  derechosUrl,
  derechosTexto = "Tus derechos",
  onDerechos,
  tono = "info",
  compact = false,
  className,
  children
}) {
  if (!finalidad && !detalle && !children) return null;
  const enlaces = [
    { clave: "politica", href: politicaUrl, onClick: onPolitica, texto: politicaTexto },
    { clave: "derechos", href: derechosUrl, onClick: onDerechos, texto: derechosTexto }
  ].filter((enlace) => enlace.href);
  return /* @__PURE__ */ jsxs39(Nota, { tono, como: "div", compact, className, "data-testid": "aviso-privacidad", children: [
    finalidad && /* @__PURE__ */ jsx48("span", { className: "block", children: finalidad }),
    detalle && /* @__PURE__ */ jsx48("span", { className: "mt-0.5 block text-xs text-mute", children: detalle }),
    children,
    enlaces.length > 0 && /* @__PURE__ */ jsx48("span", { className: "mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs", children: enlaces.map((enlace, indice) => /* @__PURE__ */ jsxs39("span", { className: "inline-flex items-center gap-2", children: [
      indice > 0 && /* @__PURE__ */ jsx48("span", { "aria-hidden": "true", children: "\xB7" }),
      /* @__PURE__ */ jsx48(EnlaceLinea, { href: enlace.href, onClick: enlace.onClick, children: enlace.texto })
    ] }, enlace.clave)) })
  ] });
}

// src/components/ConsentimientoDatos.jsx
import { useId as useId16 } from "react";
import { jsx as jsx49, jsxs as jsxs40 } from "react/jsx-runtime";
function ConsentimientoDatos({
  checked = false,
  onChange,
  finalidad,
  detalle,
  politicaUrl,
  politicaTexto = "Pol\xEDtica de privacidad",
  onPolitica,
  version,
  error,
  disabled = false,
  required = false,
  id,
  className,
  ...props
}) {
  const generado = useId16();
  const campoId = id || generado;
  const politicaId = `${campoId}-politica`;
  const errorId = `${campoId}-error`;
  return /* @__PURE__ */ jsxs40("div", { className: cn("space-y-1.5", className), "data-testid": "consentimiento-datos", children: [
    /* @__PURE__ */ jsx49(
      Checkbox,
      {
        id: campoId,
        checked: Boolean(checked),
        onChange,
        label: finalidad,
        descripcion: detalle,
        variante: "tarjeta",
        disabled,
        required,
        "aria-invalid": error ? true : void 0,
        "aria-describedby": error ? `${politicaId} ${errorId}` : politicaId,
        ...props
      }
    ),
    /* @__PURE__ */ jsxs40("p", { id: politicaId, className: "text-xs leading-relaxed text-mute", children: [
      politicaUrl ? /* @__PURE__ */ jsxs40("span", { children: [
        "Le\xE9 la ",
        /* @__PURE__ */ jsx49(EnlaceLinea, { href: politicaUrl, onClick: onPolitica, children: politicaTexto }),
        version ? " \xB7 " : null
      ] }) : null,
      version ? /* @__PURE__ */ jsxs40("span", { children: [
        "versi\xF3n ",
        version,
        " \xB7 "
      ] }) : null,
      "pod\xE9s revocarlo cuando quieras."
    ] }),
    error && /* @__PURE__ */ jsx49("p", { id: errorId, role: "alert", className: "text-xs text-bad-text", children: error })
  ] });
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

// src/components/ThemeToggle.jsx
import { useSyncExternalStore } from "react";
import { jsx as jsx50 } from "react/jsx-runtime";
var TEMA_CLARO = "claro";
var TEMA_OSCURO = "oscuro";
var CLAVE_PREDETERMINADA = "owncoding-theme";
var suscriptores = /* @__PURE__ */ new Set();
function suscribir(listener) {
  suscriptores.add(listener);
  return () => {
    suscriptores.delete(listener);
  };
}
function leerTema() {
  return document.documentElement.classList.contains("dark") ? TEMA_OSCURO : TEMA_CLARO;
}
function aplicarTema(tema, clave = CLAVE_PREDETERMINADA) {
  const oscuro = tema === TEMA_OSCURO;
  document.documentElement.classList.toggle("dark", oscuro);
  if (clave) {
    try {
      window.localStorage.setItem(clave, oscuro ? TEMA_OSCURO : TEMA_CLARO);
    } catch {
    }
  }
  for (const listener of suscriptores) listener();
}
function ThemeToggle({
  clave = CLAVE_PREDETERMINADA,
  alCambiar,
  etiquetaClaro = "Cambiar a modo claro",
  etiquetaOscuro = "Cambiar a modo oscuro",
  className
}) {
  const tema = useSyncExternalStore(suscribir, leerTema, () => TEMA_CLARO);
  const oscuro = tema === TEMA_OSCURO;
  const etiqueta = oscuro ? etiquetaClaro : etiquetaOscuro;
  return /* @__PURE__ */ jsx50(
    "button",
    {
      type: "button",
      onClick: () => {
        const siguiente = oscuro ? TEMA_CLARO : TEMA_OSCURO;
        aplicarTema(siguiente, clave);
        alCambiar?.(siguiente);
      },
      "aria-label": etiqueta,
      title: etiqueta,
      "aria-pressed": oscuro,
      className: cn(
        "grid h-9 w-9 place-items-center rounded-lg border border-interactivo text-mute transition",
        "hover:border-fono hover:bg-fono/10 hover:text-fore",
        className
      ),
      children: /* @__PURE__ */ jsx50(Icon, { name: oscuro ? "sun" : "moon", className: "h-4 w-4" })
    }
  );
}

// src/components/PanelDerecho.jsx
import { jsx as jsx51, jsxs as jsxs41 } from "react/jsx-runtime";
function PanelDerecho({ children, panel, id, className, classNamePanel }) {
  return /* @__PURE__ */ jsxs41("div", { className: cn("grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]", className), children: [
    /* @__PURE__ */ jsx51("div", { className: "min-w-0 space-y-4", children }),
    /* @__PURE__ */ jsx51("aside", { id, className: cn("min-w-0 lg:sticky lg:top-24", classNamePanel), children: panel })
  ] });
}

// src/components/TarjetaAjuste.jsx
import { jsx as jsx52, jsxs as jsxs42 } from "react/jsx-runtime";
function TarjetaAjuste({ titulo: titulo2, descripcion, accion, icono, tono = "normal", children, className, id }) {
  const peligro = tono === "peligro";
  return /* @__PURE__ */ jsxs42(Card, { id, className: cn("space-y-3", peligro && "border-bad/30", className), children: [
    /* @__PURE__ */ jsxs42("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs42("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs42("h2", { className: cn("flex items-center gap-2 font-semibold", peligro && "text-bad-text"), children: [
          icono && /* @__PURE__ */ jsx52(Icon, { name: icono, className: "h-4 w-4 text-mute" }),
          titulo2
        ] }),
        descripcion && /* @__PURE__ */ jsx52("p", { className: "mt-1 text-sm text-mute", children: descripcion })
      ] }),
      accion && /* @__PURE__ */ jsx52("div", { className: "shrink-0", children: accion })
    ] }),
    children
  ] });
}

// src/components/EstadoGuardado.jsx
import { jsx as jsx53 } from "react/jsx-runtime";
function EstadoGuardado({ testId, estado, className }) {
  return /* @__PURE__ */ jsx53("div", { "data-testid": testId, "aria-live": "polite", className: cn("min-w-0", className), children: estado && (estado.ok ? /* @__PURE__ */ jsx53(Badge, { color: "green", children: estado.texto }) : /* @__PURE__ */ jsx53(Aviso, { tono: "error", compact: true, className: "max-w-xl", children: estado.texto })) });
}

// src/components/AjustesImpresion.jsx
import { useState as useState22 } from "react";

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

// src/components/AjustesImpresion.jsx
import { jsx as jsx54, jsxs as jsxs43 } from "react/jsx-runtime";
var VACIO = () => ({
  id: null,
  nombre: "",
  ubicacion: "",
  conexion: "lan",
  ip: "",
  puerto: "9100",
  cola: "",
  ancho: "80",
  copias: "1",
  predeterminada: false,
  activa: true
});
var ANCHOS = [
  { id: "80", label: "80 mm (t\xE9rmica)" },
  { id: "58", label: "58 mm (t\xE9rmica chica)" },
  { id: "a4", label: "A4 (l\xE1ser/inyecci\xF3n)" }
];
function aFormulario(impresora) {
  if (!impresora) return VACIO();
  const conexion = impresora.conexion === "cups" || conexionDeDestino(impresora.destino) === "cups" ? "cups" : "lan";
  const destino = String(impresora.destino || "");
  const [, ip = "", puerto = "9100"] = destino.match(/^lan:([^:]+):?(\d+)?/) || [];
  return {
    ...VACIO(),
    ...impresora,
    conexion,
    ip: impresora.ip || ip,
    puerto: impresora.puerto || puerto || "9100",
    cola: impresora.cola || (destino.startsWith("cups:") ? destino.slice(5) : ""),
    copias: String(impresora.copias ?? "1")
  };
}
function AjustesImpresion({
  impresoras = [],
  estado = {},
  guardando = false,
  probando = null,
  onGuardar,
  onEliminar,
  onProbar,
  onVerificar,
  anchoOpciones = ANCHOS,
  titulo: titulo2 = "Impresoras",
  descripcion = "Eleg\xED c\xF3mo sale el papel: por red (LAN) o por una cola local (USB). La app verifica cada impresora antes de usarla.",
  className
}) {
  const [form, setForm] = useState22(null);
  const resumen = agregarEstado(impresoras, estado);
  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }
  function enviar(event) {
    event.preventDefault();
    if (!form) return;
    const destino = destinoDeConexion(form);
    if (!destino) return;
    onGuardar?.({ ...form, destino, copias: Number(form.copias) || 1 });
    setForm(null);
  }
  return /* @__PURE__ */ jsxs43(Card, { className: cn("space-y-4", className), children: [
    /* @__PURE__ */ jsxs43("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs43("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs43("h2", { className: "flex items-center gap-2 font-semibold", children: [
          /* @__PURE__ */ jsx54(Icon, { name: "printer", className: "h-4 w-4" }),
          titulo2
        ] }),
        /* @__PURE__ */ jsx54("p", { className: "mt-1 text-sm text-mute", children: descripcion })
      ] }),
      /* @__PURE__ */ jsxs43("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx54(Badge, { color: resumen.tono, className: "w-fit whitespace-nowrap", title: resumen.detalle, children: resumen.label }),
        onVerificar && /* @__PURE__ */ jsxs43(Button, { type: "button", variant: "outline", onClick: onVerificar, children: [
          /* @__PURE__ */ jsx54(Icon, { name: "refresh", className: "h-3.5 w-3.5" }),
          "Verificar"
        ] }),
        /* @__PURE__ */ jsxs43(Button, { type: "button", onClick: () => setForm(VACIO()), children: [
          /* @__PURE__ */ jsx54(Icon, { name: "plus", className: "h-4 w-4" }),
          "Agregar impresora"
        ] })
      ] })
    ] }),
    impresoras.length === 0 && /* @__PURE__ */ jsx54("p", { className: "rounded-xl border border-ink-600 p-4 text-sm text-mute", children: "Todav\xEDa no hay impresoras configuradas." }),
    /* @__PURE__ */ jsx54("ul", { className: "space-y-2", children: impresoras.map((impresora) => {
      const registro = estado?.[impresora.id];
      const tono = TONO_ESTADO[registro?.estado] || "slate";
      return /* @__PURE__ */ jsxs43("li", { className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink-600 p-3", children: [
        /* @__PURE__ */ jsxs43("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs43("p", { className: "flex items-center gap-2 font-medium", children: [
            /* @__PURE__ */ jsx54(Dot, { color: tono }),
            impresora.nombre || "Impresora",
            impresora.predeterminada && /* @__PURE__ */ jsx54(Badge, { color: "fono", children: "Predeterminada" }),
            impresora.activa === false && /* @__PURE__ */ jsx54(Badge, { color: "slate", children: "Inactiva" })
          ] }),
          /* @__PURE__ */ jsxs43("p", { className: "mt-0.5 truncate text-xs text-mute", title: impresora.destino, children: [
            conexionDeDestino(impresora.destino) === "cups" ? "USB / cola local" : "LAN",
            " \xB7 ",
            impresora.destino || "sin destino",
            " \xB7 ",
            impresora.ancho || "80",
            " mm",
            registro ? ` \xB7 ${textoVerificacion(registro)}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxs43("div", { className: "flex flex-wrap items-center gap-1", children: [
          onProbar && /* @__PURE__ */ jsx54(Button, { type: "button", variant: "outline", disabled: probando === impresora.id, onClick: () => onProbar(impresora), children: probando === impresora.id ? "Probando\u2026" : "Imprimir prueba" }),
          /* @__PURE__ */ jsx54(Button, { type: "button", variant: "ghost", onClick: () => setForm(aFormulario(impresora)), children: "Editar" }),
          onEliminar && /* @__PURE__ */ jsx54(Button, { type: "button", variant: "ghost", className: "text-bad-text", onClick: () => onEliminar(impresora.id), children: "Eliminar" })
        ] })
      ] }, impresora.id);
    }) }),
    form && /* @__PURE__ */ jsxs43("form", { onSubmit: enviar, className: "space-y-3 rounded-xl border border-fono/25 bg-fono/5 p-3", children: [
      /* @__PURE__ */ jsxs43("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs43("div", { children: [
          /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-nombre", children: "Nombre" }),
          /* @__PURE__ */ jsx54(Input, { id: "imp-nombre", required: true, value: form.nombre, onChange: (event) => cambiar("nombre", event.target.value), placeholder: "Mostrador" })
        ] }),
        /* @__PURE__ */ jsxs43("div", { children: [
          /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-ubicacion", children: "Ubicaci\xF3n (opcional)" }),
          /* @__PURE__ */ jsx54(Input, { id: "imp-ubicacion", value: form.ubicacion, onChange: (event) => cambiar("ubicacion", event.target.value), placeholder: "Caja 1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs43("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs43("div", { children: [
          /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-conexion", children: "Conexi\xF3n" }),
          /* @__PURE__ */ jsxs43(Select, { id: "imp-conexion", value: form.conexion, onChange: (event) => cambiar("conexion", event.target.value), children: [
            /* @__PURE__ */ jsx54("option", { value: "lan", children: "LAN (impresora de red)" }),
            /* @__PURE__ */ jsx54("option", { value: "cups", children: "USB / cola local (CUPS)" })
          ] })
        ] }),
        form.conexion === "lan" ? /* @__PURE__ */ jsxs43("div", { className: "grid grid-cols-[minmax(0,1fr)_6rem] gap-2", children: [
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-ip", children: "IP" }),
            /* @__PURE__ */ jsx54(Input, { id: "imp-ip", required: true, value: form.ip, onChange: (event) => cambiar("ip", event.target.value), placeholder: "192.168.1.50", inputMode: "decimal" })
          ] }),
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-puerto", children: "Puerto" }),
            /* @__PURE__ */ jsx54(Input, { id: "imp-puerto", value: form.puerto, onChange: (event) => cambiar("puerto", event.target.value.replace(/\D/g, "")), placeholder: "9100", inputMode: "numeric" })
          ] })
        ] }) : /* @__PURE__ */ jsxs43("div", { children: [
          /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-cola", children: "Cola local" }),
          /* @__PURE__ */ jsx54(Input, { id: "imp-cola", required: true, value: form.cola, onChange: (event) => cambiar("cola", event.target.value), placeholder: "Nombre exacto en el sistema" }),
          /* @__PURE__ */ jsx54("p", { className: "mt-1 text-xs text-mute", children: "En Windows/macOS el nombre de la cola es el que ves en Impresoras del sistema." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs43("div", { className: "grid gap-3 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxs43("div", { children: [
          /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-ancho", children: "Ancho de papel" }),
          /* @__PURE__ */ jsx54(Select, { id: "imp-ancho", value: form.ancho, onChange: (event) => cambiar("ancho", event.target.value), children: anchoOpciones.map((opcion) => /* @__PURE__ */ jsx54("option", { value: opcion.id, children: opcion.label }, opcion.id)) })
        ] }),
        /* @__PURE__ */ jsxs43("div", { children: [
          /* @__PURE__ */ jsx54(Label, { htmlFor: "imp-copias", children: "Copias" }),
          /* @__PURE__ */ jsx54(Input, { id: "imp-copias", value: form.copias, onChange: (event) => cambiar("copias", event.target.value.replace(/\D/g, "")), inputMode: "numeric", maxLength: 2 })
        ] }),
        /* @__PURE__ */ jsxs43("label", { className: "flex items-end gap-2 pb-2 text-sm", children: [
          /* @__PURE__ */ jsx54("input", { type: "checkbox", className: "h-4 w-4 accent-fono", checked: form.predeterminada, onChange: (event) => cambiar("predeterminada", event.target.checked) }),
          "Predeterminada"
        ] })
      ] }),
      /* @__PURE__ */ jsx54("p", { className: "text-xs text-mute", children: form.conexion === "lan" ? `Se guardar\xE1 como lan:${form.ip || "<ip>"}:${form.puerto || "9100"}` : `Se guardar\xE1 como cups:${form.cola || "<cola>"}` }),
      /* @__PURE__ */ jsxs43("div", { className: "flex flex-wrap justify-end gap-2", children: [
        /* @__PURE__ */ jsx54(Button, { type: "button", variant: "ghost", onClick: () => setForm(null), children: "Cancelar" }),
        /* @__PURE__ */ jsx54(Button, { type: "submit", disabled: guardando, children: guardando ? "Guardando\u2026" : "Guardar impresora" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs43("p", { className: "text-xs text-mute", children: [
      "La impresi\xF3n sale por el ",
      /* @__PURE__ */ jsx54("b", { className: "text-fore", children: "agente local" }),
      ": instalalo en la computadora que tiene la impresora (LAN o USB conectada) y vinculala con el c\xF3digo. Con el agente ca\xEDdo, los trabajos quedan en cola; nunca se pierden. Ver ",
      /* @__PURE__ */ jsx54("b", { className: "text-fore", children: "docs/IMPRESION.md" }),
      "."
    ] })
  ] });
}

// src/components/BotonImprimir.jsx
import { jsx as jsx55, jsxs as jsxs44 } from "react/jsx-runtime";
function BotonImprimir({
  onImprimir,
  estado = null,
  etiqueta = "Imprimir",
  icono = "printer",
  variant = "outline",
  disabled = false,
  className
}) {
  const enCurso = estado === "pendiente" || estado === "reclamado";
  const texto = enCurso ? etiquetaTrabajo(estado) : etiqueta;
  return /* @__PURE__ */ jsxs44("span", { className: cn("inline-flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsxs44(Button, { type: "button", variant, disabled: disabled || enCurso, onClick: onImprimir, "aria-busy": enCurso, children: [
      /* @__PURE__ */ jsx55(Icon, { name: icono, className: "h-4 w-4" }),
      texto
    ] }),
    estado && !enCurso && /* @__PURE__ */ jsx55(Badge, { color: colorTrabajo(estado), className: "whitespace-nowrap", children: etiquetaTrabajo(estado) })
  ] });
}

// src/components/BancoCombobox.jsx
import { useEffect as useEffect15, useMemo as useMemo12, useRef as useRef14, useState as useState24 } from "react";

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

// src/financial/resolvers.js
function logoDeBanco2(nombre, variante) {
  return adjuntarAssetsAlRegistro(logoDeBanco(nombre, variante));
}
function logoDeMedioPago2(nombre, variante) {
  return adjuntarAssetsAlRegistro(logoDeMedioPago(nombre, variante));
}

// src/components/LogoFinanciero.jsx
import { useState as useState23 } from "react";
import { jsx as jsx56, jsxs as jsxs45 } from "react/jsx-runtime";
function fuenteDe(visual, baseAssets) {
  if (!visual?.archivo) return null;
  if (typeof baseAssets === "string" && baseAssets) {
    return `${baseAssets.replace(/\/$/, "")}/${visual.archivo}`;
  }
  return visual.asset || visual.archivo;
}
function Monograma({ iniciales: iniciales2, color, compacto }) {
  return /* @__PURE__ */ jsx56(
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
  const [assetFallido, setAssetFallido] = useState23(null);
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
    return /* @__PURE__ */ jsx56(
      "span",
      {
        ...semantica,
        className: cn("inline-flex items-center", compacto && "aspect-square justify-center", alto, className),
        "data-logo-estado": visual.estado || registro.estado,
        "data-logo-variante": registro.variante,
        children: /* @__PURE__ */ jsx56(Logo, {})
      }
    );
  }
  if (fuente && !fallo && (visual.tipo === "archivo" || visual.tipo === "horizontal-contained")) {
    return /* @__PURE__ */ jsx56(
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
        children: /* @__PURE__ */ jsx56(
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
    return /* @__PURE__ */ jsxs45(
      "span",
      {
        ...semantica,
        className: cn("inline-flex items-center gap-1.5 whitespace-nowrap", alto, className),
        "data-logo-estado": visual.estado || registro.estado,
        "data-logo-variante": registro.variante,
        "data-logo-tipo": "texto",
        children: [
          /* @__PURE__ */ jsx56(Monograma, { iniciales: iniciales2, color, compacto: false }),
          /* @__PURE__ */ jsx56("span", { "aria-hidden": "true", className: "text-xs font-semibold leading-none text-current", children: etiqueta })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx56(
    "span",
    {
      ...semantica,
      className: cn("inline-flex items-center", compacto && "aspect-square shrink-0", alto, className),
      "data-logo-estado": visual.estado || registro.estado,
      "data-logo-variante": registro.variante,
      "data-logo-tipo": "monograma",
      children: /* @__PURE__ */ jsx56(Monograma, { iniciales: iniciales2, color, compacto })
    }
  );
}

// src/components/BancoLogo.jsx
import { jsx as jsx57 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx57(
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

// src/components/BancoCombobox.jsx
import { jsx as jsx58, jsxs as jsxs46 } from "react/jsx-runtime";
function BancoCombobox({
  id,
  value = "",
  onChange,
  onSelect,
  required = false,
  disabled = false,
  placeholder,
  className,
  catalogo = BANCOS_PARAGUAY,
  logoProps
}) {
  const [abierto, setAbierto] = useState24(false);
  const raiz = useRef14(null);
  useEffect15(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      setAbierto(false);
    };
    document.addEventListener("click", cerrarFuera);
    return () => document.removeEventListener("click", cerrarFuera);
  }, []);
  const sugerencias = useMemo12(() => sugerenciasDeBanco(value, catalogo), [value, catalogo]);
  function elegir(banco) {
    onChange?.(banco);
    onSelect?.(banco);
    setAbierto(false);
  }
  const listaVisible = abierto && sugerencias.length > 0;
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: setAbierto,
    onSelect: elegir,
    getOptionKey: (banco) => banco
  });
  return /* @__PURE__ */ jsxs46("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx58(
      Input,
      {
        id,
        ref: navegacion.inputRef,
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": navegacion.listboxId,
        "aria-autocomplete": "list",
        "aria-activedescendant": navegacion.activeOptionId,
        autoComplete: "off",
        required,
        disabled,
        value,
        placeholder,
        onChange: (event) => {
          onChange?.(event.target.value);
          setAbierto(true);
          navegacion.setActiveIndex(0);
        },
        onFocus: () => setAbierto(true),
        onKeyDown: navegacion.inputProps.onKeyDown
      }
    ),
    listaVisible && /* @__PURE__ */ jsx58(
      "ul",
      {
        ...navegacion.listboxProps,
        "aria-label": "Bancos",
        className: "absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-ink-500 bg-ink p-1 shadow-float",
        children: sugerencias.map((banco, indice) => /* @__PURE__ */ jsxs46(
          "li",
          {
            ...navegacion.getOptionProps(indice),
            className: cn(
              "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition",
              indice === navegacion.activeIndex ? "bg-ink-700 text-fore" : "text-mute hover:bg-ink-700 hover:text-fore"
            ),
            children: [
              /* @__PURE__ */ jsx58(BancoLogo, { banco, variante: "compacto", alto: "h-4", decorativo: true, ...logoProps }),
              /* @__PURE__ */ jsx58("span", { className: "min-w-0 flex-1 truncate", children: banco })
            ]
          },
          banco
        ))
      }
    )
  ] });
}

// src/components/MedioPagoLogo.jsx
import { jsx as jsx59 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx59(
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

// src/components/CityAutocomplete.jsx
import { useEffect as useEffect16, useId as useId17, useRef as useRef15, useState as useState25 } from "react";

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

// src/components/CityAutocomplete.jsx
import { jsx as jsx60, jsxs as jsxs47 } from "react/jsx-runtime";
function ciudadDe(fila) {
  return fila?.city ?? fila?.ciudad ?? "";
}
function departamentoDeFila(fila) {
  return fila?.department ?? fila?.departamento ?? "";
}
function CityAutocomplete({
  value = "",
  onSelect,
  onChange,
  placeholder = "Ej: Asunci\xF3n, Ciudad del Este\u2026",
  disabled = false,
  className,
  buscar,
  limite = 8,
  maxLength = 100,
  inputProps,
  mensajeError = "No se pudieron cargar las sugerencias."
}) {
  const [sugerencias, setSugerencias] = useState25([]);
  const [abierto, setAbierto] = useState25(false);
  const [error, setError] = useState25("");
  const timer = useRef15(null);
  const raiz = useRef15(null);
  const errorId = useId17();
  useEffect16(() => {
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      setAbierto(false);
    };
    document.addEventListener("mousedown", cerrarFuera);
    return () => document.removeEventListener("mousedown", cerrarFuera);
  }, []);
  useEffect16(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  function resolver(texto) {
    const q = String(texto || "").trim();
    if (q.length < 2) {
      setSugerencias([]);
      setAbierto(false);
      setError("");
      return;
    }
    if (!buscar) {
      setSugerencias(buscarCiudad(q, limite));
      setAbierto(true);
      setError("");
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const filas = await buscar(q);
        setSugerencias(Array.isArray(filas) ? filas.slice(0, limite) : []);
        setAbierto(true);
        setError("");
      } catch {
        setSugerencias([]);
        setAbierto(false);
        setError(mensajeError);
      }
    }, 250);
  }
  function change(texto) {
    onChange?.(texto);
    onSelect?.(texto, departamentoDe(texto));
    resolver(texto);
  }
  function elegir(fila) {
    if (timer.current) clearTimeout(timer.current);
    const ciudad = ciudadDe(fila);
    const departamento = departamentoDeFila(fila) || departamentoDe(ciudad);
    onChange?.(ciudad);
    onSelect?.(ciudad, departamento);
    setSugerencias([]);
    setAbierto(false);
  }
  const listaVisible = abierto && sugerencias.length > 0;
  const navegacion = useComboboxNavigation({
    options: sugerencias,
    open: listaVisible,
    onOpenChange: setAbierto,
    onSelect: elegir,
    getOptionKey: (fila) => `${ciudadDe(fila)}-${departamentoDeFila(fila)}`
  });
  function alPerderFoco() {
    const departamento = departamentoDe(value);
    if (departamento) onSelect?.(value, departamento);
  }
  return /* @__PURE__ */ jsxs47("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx60(
      Input,
      {
        ...inputProps,
        ref: navegacion.inputRef,
        maxLength,
        disabled,
        value,
        onChange: (event) => {
          inputProps?.onChange?.(event);
          change(event.target.value);
          navegacion.setActiveIndex(0);
        },
        onFocus: (event) => {
          inputProps?.onFocus?.(event);
          if (value.trim().length >= 2 && sugerencias.length) setAbierto(true);
        },
        onBlur: (event) => {
          inputProps?.onBlur?.(event);
          alPerderFoco();
        },
        onKeyDown: (event) => {
          inputProps?.onKeyDown?.(event);
          if (!event.defaultPrevented) navegacion.inputProps.onKeyDown(event);
        },
        placeholder,
        autoComplete: "off",
        "aria-label": "Ciudad",
        role: "combobox",
        "aria-expanded": listaVisible,
        "aria-controls": navegacion.listboxId,
        "aria-autocomplete": "list",
        "aria-activedescendant": navegacion.activeOptionId,
        "aria-describedby": [inputProps?.["aria-describedby"], error ? errorId : null].filter(Boolean).join(" ") || void 0,
        "aria-invalid": inputProps?.["aria-invalid"] ?? (error ? true : void 0)
      }
    ),
    listaVisible && /* @__PURE__ */ jsx60("ul", { ...navegacion.listboxProps, "aria-label": "Ciudades", className: "absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-ink-500 bg-ink shadow-float", children: sugerencias.map((fila, indice) => /* @__PURE__ */ jsxs47(
      "li",
      {
        ...navegacion.getOptionProps(indice),
        className: cn(
          "flex min-h-11 cursor-pointer items-baseline justify-between gap-3 px-3 py-2 text-left text-sm transition",
          indice === navegacion.activeIndex ? "bg-ink-700" : "hover:bg-ink-700"
        ),
        children: [
          /* @__PURE__ */ jsx60("span", { className: "truncate font-medium text-fore", children: ciudadDe(fila) }),
          /* @__PURE__ */ jsx60("span", { className: "shrink-0 text-xs text-mute", children: departamentoDeFila(fila) })
        ]
      },
      `${ciudadDe(fila)}-${departamentoDeFila(fila)}`
    )) }),
    error ? /* @__PURE__ */ jsx60("p", { id: errorId, role: "alert", className: "mt-1 text-xs text-bad-text", children: error }) : null
  ] });
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

// src/components/SemaforoItem.jsx
import { jsx as jsx61, jsxs as jsxs48 } from "react/jsx-runtime";
function SemaforoItem({ estado = "sinVerificar", etiqueta, detalle, como = "li", className, ...props }) {
  const config = estadoItem(estado);
  const Etiqueta = como === "div" ? "div" : "li";
  return /* @__PURE__ */ jsxs48(
    Etiqueta,
    {
      className: cn("flex items-center gap-2.5", className),
      "aria-label": etiqueta ? `${etiqueta}: ${config.etiqueta}` : config.etiqueta,
      ...props,
      children: [
        /* @__PURE__ */ jsx61("span", { className: cn("grid h-6 w-6 shrink-0 place-items-center rounded-full", TONOS.punto[config.tono]), title: config.etiqueta, "aria-hidden": "true", children: /* @__PURE__ */ jsx61(Icon, { name: config.icono, className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxs48("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx61("span", { className: "block truncate text-sm", children: etiqueta }),
          detalle && /* @__PURE__ */ jsx61("span", { className: "block truncate text-xs text-mute", children: detalle })
        ] })
      ]
    }
  );
}

// src/components/FilaChecklist.jsx
import { jsx as jsx62, jsxs as jsxs49 } from "react/jsx-runtime";
function FilaChecklist({ etiqueta, estado = "sinVerificar", nota, accion, className }) {
  const config = estadoItem(estado);
  return /* @__PURE__ */ jsxs49("div", { className: cn("flex items-start gap-2.5 rounded-xl border border-ink-600 p-2.5", className), children: [
    /* @__PURE__ */ jsx62("span", { className: cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", TONOS.punto[config.tono]), title: config.etiqueta, "aria-hidden": "true", children: /* @__PURE__ */ jsx62(Icon, { name: config.icono, className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ jsxs49("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx62("p", { className: "truncate text-sm", children: etiqueta }),
      nota && /* @__PURE__ */ jsx62("p", { className: "mt-0.5 text-xs text-mute", children: nota })
    ] }),
    /* @__PURE__ */ jsx62("span", { className: "shrink-0 text-[11px] font-semibold text-mute", title: config.etiqueta, children: config.etiqueta }),
    accion
  ] });
}
function ConteoChecklist({ pasan = 0, total = 0, fallas = 0, sustantivo = "pass", className }) {
  const completo = total > 0 && pasan === total;
  return /* @__PURE__ */ jsxs49("span", { className: cn("inline-flex flex-wrap items-center gap-2 text-xs font-semibold", className), children: [
    /* @__PURE__ */ jsxs49("span", { className: completo ? "text-pass-text" : "text-mute", children: [
      pasan,
      " de ",
      total,
      " ",
      sustantivo
    ] }),
    fallas > 0 && /* @__PURE__ */ jsxs49("span", { className: "text-bad-text", children: [
      fallas,
      " ",
      fallas === 1 ? "falla" : "fallas"
    ] })
  ] });
}

// src/components/ChipEstado.jsx
import { jsx as jsx63, jsxs as jsxs50 } from "react/jsx-runtime";
function ChipEstado({ estado = "pendiente", etiqueta, icono, tono, title, className }) {
  const config = estadoChip(estado);
  const texto = etiqueta || config.etiqueta;
  return /* @__PURE__ */ jsxs50(
    "span",
    {
      "data-estado": estado,
      title: title ?? texto,
      className: cn("inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-semibold", TONOS.chip[tonoCanonico(tono || config.tono)], className),
      children: [
        /* @__PURE__ */ jsx63(Icon, { name: icono || config.icono, className: "h-3 w-3", "aria-hidden": "true" }),
        texto
      ]
    }
  );
}

// src/components/ChipsLocks.jsx
import { jsx as jsx64, jsxs as jsxs51 } from "react/jsx-runtime";
function ChipsLocks({ locks = [], conEstado = false, className }) {
  if (!locks.length) return null;
  return /* @__PURE__ */ jsx64("ul", { className: cn("flex flex-wrap items-center gap-1.5", className), children: locks.map((lock) => {
    const config = estadoLock(lock.estado);
    const etiqueta = lock.etiqueta || LOCKS_DISPOSITIVO[lock.clave] || lock.clave;
    return /* @__PURE__ */ jsxs51(
      "li",
      {
        className: cn("inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-semibold", TONOS.chip[config.tono]),
        title: lock.detalle || `${etiqueta}: ${config.etiqueta}`,
        children: [
          /* @__PURE__ */ jsx64(Icon, { name: config.icono, className: "h-3 w-3", "aria-hidden": "true" }),
          etiqueta,
          conEstado ? ` \xB7 ${config.etiqueta}` : ""
        ]
      },
      lock.clave || etiqueta
    );
  }) });
}

// src/components/MedidorBateria.jsx
import { jsx as jsx65, jsxs as jsxs52 } from "react/jsx-runtime";
function MedidorBateria({ porcentaje, ciclos, etiqueta = "Bater\xEDa", variante = "barra", compact = false, mostrarEtiqueta = false, className }) {
  const hay = porcentaje !== null && porcentaje !== void 0 && porcentaje !== "" && Number.isFinite(Number(porcentaje));
  const valor = hay ? Number(porcentaje) : null;
  const tono = tonoBateria(hay ? valor : null);
  const texto = hay ? `${valor}%` : "\u2014";
  const title = hay ? `${etiqueta}: ${valor}%${ciclos ? ` \xB7 ${ciclos} ciclos` : ""}` : `${etiqueta}: sin dato`;
  if (variante === "chip") {
    return /* @__PURE__ */ jsxs52("span", { className: cn("inline-flex shrink-0 items-center rounded border border-ink-600 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums", TONOS.texto[tono], className), title, children: [
      texto,
      mostrarEtiqueta ? ` ${etiqueta.toLowerCase()}` : ""
    ] });
  }
  return /* @__PURE__ */ jsxs52("div", { className: cn("space-y-1", className), title, children: [
    /* @__PURE__ */ jsxs52("div", { className: "flex items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ jsx65("span", { className: cn("text-xs text-mute", compact && "text-[11px]"), children: etiqueta }),
      /* @__PURE__ */ jsx65("span", { className: cn("font-semibold tabular-nums", TONOS.texto[tono], compact && "text-xs"), children: texto })
    ] }),
    hay ? /* @__PURE__ */ jsx65(BarraProgreso, { valor, tono, alto: compact ? "sm" : "md", pista: "bg-ink-700", etiqueta: `${etiqueta} ${valor}%` }) : /* @__PURE__ */ jsx65(Badge, { color: "slate", children: "Sin dato" })
  ] });
}

// src/components/MedidorStock.jsx
import { jsx as jsx66, jsxs as jsxs53 } from "react/jsx-runtime";
function MedidorStock({
  stock,
  umbral,
  variante = "texto",
  etiqueta,
  mostrarUmbral = true,
  vacio = "Sin dato",
  className
}) {
  const sinDato = stock === null || stock === void 0 || stock === "";
  const n = Number(stock);
  const u = Number(umbral);
  if (sinDato || !Number.isFinite(n)) {
    return /* @__PURE__ */ jsx66("span", { className: cn("text-xs text-mute", className), children: vacio });
  }
  const tieneUmbral = Number.isFinite(u);
  const agotado = n <= 0;
  const bajo = !agotado && tieneUmbral && n <= u;
  const tono = agotado ? "bad" : bajo ? "warn" : "ok";
  const texto = agotado ? "Agotado" : bajo ? "Reponer" : "En stock";
  const detalle = tieneUmbral ? `${n} de ${u}` : String(n);
  if (variante === "barra") {
    const techo = tieneUmbral ? Math.max(u, n) : n;
    const porcentaje = techo > 0 ? Math.min(100, Math.round(n / techo * 100)) : 0;
    return /* @__PURE__ */ jsxs53("span", { className: cn("block min-w-0 space-y-1", className), children: [
      /* @__PURE__ */ jsxs53("span", { className: "flex items-baseline justify-between gap-2 text-xs", children: [
        /* @__PURE__ */ jsx66("span", { className: cn("font-semibold", tono === "bad" ? "text-bad-text" : tono === "warn" ? "text-warn-text" : "text-ok-text"), children: texto }),
        /* @__PURE__ */ jsx66("span", { className: "tabular-nums text-mute", children: detalle })
      ] }),
      /* @__PURE__ */ jsx66("span", { role: "progressbar", "aria-label": etiqueta ?? `Stock ${detalle}`, "aria-valuenow": porcentaje, "aria-valuemin": 0, "aria-valuemax": 100, className: "block h-1.5 overflow-hidden rounded-full bg-ink-700", children: /* @__PURE__ */ jsx66("span", { className: cn("block h-full rounded-full transition-[width]", tono === "bad" ? "bg-bad" : tono === "warn" ? "bg-warn" : "bg-ok"), style: { width: `${porcentaje}%` } }) })
    ] });
  }
  return /* @__PURE__ */ jsxs53(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold",
        variante === "chip" && "rounded-lg border px-2 py-0.5",
        variante === "chip" && (tono === "bad" ? "border-bad/30 bg-bad/10 text-bad-text" : tono === "warn" ? "border-warn/30 bg-warn/10 text-warn-text" : "border-ok/30 bg-ok/10 text-ok-text"),
        variante === "texto" && (tono === "bad" ? "text-bad-text" : tono === "warn" ? "text-warn-text" : "text-ok-text"),
        className
      ),
      title: etiqueta ?? `${texto} \xB7 ${detalle}`,
      children: [
        variante !== "chip" && /* @__PURE__ */ jsx66("span", { className: cn("h-1.5 w-1.5 rounded-full", tono === "bad" ? "bg-bad" : tono === "warn" ? "bg-warn" : "bg-ok"), "aria-hidden": "true" }),
        /* @__PURE__ */ jsx66("span", { className: "tabular-nums", children: detalle }),
        mostrarUmbral && /* @__PURE__ */ jsx66("span", { className: "font-normal text-mute", children: texto })
      ]
    }
  );
}

// src/components/ContadorLote.jsx
import { jsx as jsx67, jsxs as jsxs54 } from "react/jsx-runtime";
function ContadorLote({ recibidos, total, variante = "texto", sufijo, mostrarFaltan = false, vacio = "Sin dato", className }) {
  const r = Number(recibidos);
  const t = Number(total);
  if (recibidos === null || recibidos === void 0 || !Number.isFinite(t) || t <= 0 || !Number.isFinite(r)) {
    return /* @__PURE__ */ jsx67("span", { className: cn("text-xs text-mute", className), children: vacio });
  }
  const hechas = Math.max(0, Math.min(t, Math.trunc(r)));
  const completo = hechas >= t;
  const tono = completo ? "ok" : hechas > 0 ? "warn" : "mute";
  const faltan = t - hechas;
  const texto = sufijo ? `${hechas} de ${t} ${sufijo}` : `${hechas} de ${t}`;
  if (variante === "barra") {
    const porcentaje = Math.round(hechas / t * 100);
    return /* @__PURE__ */ jsxs54("span", { className: cn("block min-w-0 space-y-1", className), children: [
      /* @__PURE__ */ jsxs54("span", { className: "flex items-baseline justify-between gap-2 text-xs", children: [
        /* @__PURE__ */ jsx67("span", { className: cn("font-semibold", tono === "ok" ? "text-ok-text" : tono === "warn" ? "text-warn-text" : "text-mute"), children: texto }),
        mostrarFaltan && !completo && /* @__PURE__ */ jsxs54("span", { className: "text-mute", children: [
          "faltan ",
          faltan
        ] })
      ] }),
      /* @__PURE__ */ jsx67(
        "span",
        {
          role: "progressbar",
          "aria-label": sufijo ? `${hechas} de ${t} ${sufijo}` : `${hechas} de ${t}`,
          "aria-valuenow": hechas,
          "aria-valuemin": 0,
          "aria-valuemax": t,
          className: "block h-1.5 overflow-hidden rounded-full bg-ink-700",
          children: /* @__PURE__ */ jsx67("span", { className: cn("block h-full rounded-full transition-[width]", tono === "ok" ? "bg-ok" : tono === "warn" ? "bg-warn" : "bg-mute"), style: { width: `${porcentaje}%` } })
        }
      )
    ] });
  }
  if (variante === "chip") {
    return /* @__PURE__ */ jsxs54(
      "span",
      {
        className: cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-0.5 text-xs font-semibold",
          tono === "ok" ? "border-ok/30 bg-ok/10 text-ok-text" : tono === "warn" ? "border-warn/30 bg-warn/10 text-warn-text" : "border-ink-500 bg-ink-700 text-mute",
          className
        ),
        title: texto,
        children: [
          /* @__PURE__ */ jsx67("span", { className: "tabular-nums", children: texto }),
          mostrarFaltan && !completo && /* @__PURE__ */ jsxs54("span", { className: "font-normal", children: [
            "\xB7 faltan ",
            faltan
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs54("span", { className: cn("inline-flex items-baseline gap-1.5 whitespace-nowrap text-xs", className), title: texto, children: [
    /* @__PURE__ */ jsx67("span", { className: cn("font-semibold tabular-nums", tono === "ok" ? "text-ok-text" : tono === "warn" ? "text-warn-text" : "text-mute"), children: texto }),
    mostrarFaltan && !completo && /* @__PURE__ */ jsxs54("span", { className: "text-mute", children: [
      "faltan ",
      faltan
    ] })
  ] });
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

// src/components/ChipPrioridad.jsx
import { jsx as jsx68 } from "react/jsx-runtime";
function ChipPrioridad({ prioridad = "media", etiqueta, title, className }) {
  const tono = tonoPrioridad(prioridad);
  const texto = etiqueta || etiquetaPrioridad(prioridad);
  const CLASES3 = {
    bad: "border-bad/30 bg-bad/10 text-bad-text",
    warn: "border-warn/30 bg-warn/10 text-warn-text",
    ok: "border-ok/30 bg-ok/10 text-ok-text",
    info: "border-info/30 bg-info/10 text-info-text",
    mute: "border-ink-500 bg-ink-700 text-mute"
  };
  return /* @__PURE__ */ jsx68(
    "span",
    {
      className: cn("inline-flex items-center whitespace-nowrap rounded-lg border px-2 py-0.5 text-xs font-semibold", CLASES3[tono] || CLASES3.mute, className),
      title: title || `Prioridad ${String(texto).toLowerCase()}`,
      children: texto
    }
  );
}

// src/components/ChipOrigen.jsx
import { jsx as jsx69, jsxs as jsxs55 } from "react/jsx-runtime";
function ChipOrigen({ origen, etiqueta, title, className }) {
  const tono = tonoOrigen(origen);
  const texto = etiqueta || etiquetaOrigen(origen);
  const CLASES3 = {
    bad: "border-bad/30 bg-bad/10 text-bad-text",
    warn: "border-warn/30 bg-warn/10 text-warn-text",
    ok: "border-ok/30 bg-ok/10 text-ok-text",
    info: "border-info/30 bg-info/10 text-info-text",
    mute: "border-ink-500 bg-ink-700 text-mute"
  };
  return /* @__PURE__ */ jsxs55(
    "span",
    {
      className: cn("inline-flex min-w-0 items-center gap-1 whitespace-nowrap rounded-lg border px-2 py-0.5 text-xs font-semibold", CLASES3[tono] || CLASES3.mute, className),
      title: title || texto,
      children: [
        /* @__PURE__ */ jsx69(Icon, { name: iconoOrigen(origen), className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx69("span", { className: "truncate", children: texto })
      ]
    }
  );
}

// src/components/ContadoresCompra.jsx
import { jsx as jsx70, jsxs as jsxs56 } from "react/jsx-runtime";
function ContadoresCompra({ pendiente = 0, comprado = 0, faltan = 0, variante = "texto", className }) {
  const conteo = (valor) => Math.max(0, Math.trunc(Number(valor) || 0));
  const datos = [
    { clave: "pendiente", etiqueta: "pendiente", valor: conteo(pendiente), tono: conteo(pendiente) > 0 ? "text-warn-text" : "text-mute" },
    { clave: "comprado", etiqueta: "comprado", valor: conteo(comprado), tono: "text-ok-text" },
    { clave: "faltan", etiqueta: "faltan", valor: conteo(faltan), tono: conteo(faltan) > 0 ? "text-bad-text" : "text-mute" }
  ];
  if (variante === "chips") {
    return /* @__PURE__ */ jsx70("span", { className: cn("flex min-w-0 flex-wrap items-center gap-1.5", className), children: datos.map((dato) => /* @__PURE__ */ jsxs56("span", { className: "inline-flex items-center gap-1 rounded-lg border border-ink-600 bg-ink-800 px-2 py-0.5 text-[11px] text-mute", children: [
      /* @__PURE__ */ jsx70("b", { className: cn("tabular-nums", dato.tono), children: dato.valor }),
      dato.etiqueta
    ] }, dato.clave)) });
  }
  return /* @__PURE__ */ jsx70("span", { className: cn("flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-mute", className), "aria-label": "Conteo de la necesidad", children: datos.map((dato) => /* @__PURE__ */ jsxs56("span", { children: [
    /* @__PURE__ */ jsx70("b", { className: cn("tabular-nums", dato.tono), children: dato.valor }),
    " ",
    dato.etiqueta
  ] }, dato.clave)) });
}

// src/components/ResumenDestinos.jsx
import { jsx as jsx71, jsxs as jsxs57 } from "react/jsx-runtime";
function ResumenDestinos({ destinos = [], ariaLabel = "Destinos", onElegir, className }) {
  const lista = (Array.isArray(destinos) ? destinos : []).filter((destino) => destino && Number(destino.cantidad) > 0);
  if (!lista.length) return null;
  return /* @__PURE__ */ jsx71("span", { className: cn("flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-mute", className), "aria-label": ariaLabel, children: lista.map((destino, indice) => /* @__PURE__ */ jsxs57("span", { className: "flex min-w-0 items-center gap-1.5", children: [
    indice > 0 && /* @__PURE__ */ jsx71("span", { "aria-hidden": "true", children: "\xB7" }),
    onElegir ? /* @__PURE__ */ jsxs57(
      "button",
      {
        type: "button",
        onClick: () => onElegir(destino),
        title: destino.detalle || void 0,
        className: "min-w-0 truncate transition hover:text-fore",
        children: [
          /* @__PURE__ */ jsx71("b", { className: "tabular-nums text-fore", children: Number(destino.cantidad) }),
          " ",
          destino.etiqueta
        ]
      }
    ) : /* @__PURE__ */ jsxs57("span", { className: "min-w-0 truncate", title: destino.detalle || void 0, children: [
      /* @__PURE__ */ jsx71("b", { className: "tabular-nums text-fore", children: Number(destino.cantidad) }),
      " ",
      destino.etiqueta
    ] })
  ] }, destino.id ?? `${destino.etiqueta}-${indice}`)) });
}

// src/components/Vencimiento.jsx
import { jsx as jsx72 } from "react/jsx-runtime";
var SOLO_DIA2 = /^\d{4}-\d{2}-\d{2}$/;
function estadoVencimiento(fecha, { hoy = /* @__PURE__ */ new Date(), diasAviso = 7 } = {}) {
  const vence = fechaValida(fecha);
  if (!vence) return { texto: "\u2014", tono: "mute", vencido: false, dias: null, titulo: "Sin vencimiento cargado" };
  const dias = diasHasta(fecha, { hoy });
  const tono = tonoVencimiento(fecha, { hoy, diasAviso }) || "mute";
  const titulo2 = `Vence el ${vence.toLocaleDateString("es-PY")}`;
  if (dias < 0) return { texto: "venci\xF3", tono: "bad", vencido: true, dias, titulo: titulo2 };
  if (dias <= diasAviso) return { texto: dias === 0 ? "hoy" : `en ${dias} d`, tono: "warn", vencido: false, dias, titulo: titulo2 };
  const pura = typeof fecha === "string" && SOLO_DIA2.test(fecha.trim());
  return { texto: pura ? fechaDia(fecha) : fechaCorta(vence), tono: "mute", vencido: false, dias, titulo: titulo2 };
}
var CLASES = {
  bad: "text-bad-text",
  warn: "text-warn-text",
  ok: "text-ok-text",
  mute: "text-mute"
};
var CHIP = {
  bad: "border-bad/30 bg-bad/10 text-bad-text",
  warn: "border-warn/30 bg-warn/10 text-warn-text",
  ok: "border-ok/30 bg-ok/10 text-ok-text",
  mute: "border-ink-500 bg-ink-700 text-mute"
};
function Vencimiento({ fecha, variante = "texto", diasAviso = 7, hoy, texto, vacio = "\u2014", className }) {
  if (!fecha) return /* @__PURE__ */ jsx72("span", { className: cn("text-xs text-mute", className), children: vacio });
  const estado = estadoVencimiento(fecha, { hoy, diasAviso });
  const contenido = texto || estado.texto;
  if (variante === "chip") {
    return /* @__PURE__ */ jsx72("span", { className: cn("inline-flex items-center whitespace-nowrap rounded-lg border px-2 py-0.5 text-xs font-semibold tabular-nums", CHIP[estado.tono] || CHIP.mute, className), title: estado.titulo, children: contenido });
  }
  return /* @__PURE__ */ jsx72("span", { className: cn("whitespace-nowrap text-xs font-medium tabular-nums", CLASES[estado.tono] || CLASES.mute, className), title: estado.titulo, children: contenido });
}

// src/components/TarjetaNecesidad.jsx
import { Fragment as Fragment6, jsx as jsx73, jsxs as jsxs58 } from "react/jsx-runtime";
function TarjetaNecesidad({
  producto,
  variante,
  prioridad,
  estado,
  origen,
  centro,
  fechaPrometida,
  diasAviso,
  vinculo,
  destinos,
  onElegirDestino,
  observaciones,
  pendiente,
  comprado,
  faltan,
  onAbrir,
  acciones,
  className
}) {
  const est = estadoNecesidad(estado);
  const titulo2 = /* @__PURE__ */ jsxs58(Fragment6, { children: [
    /* @__PURE__ */ jsx73("span", { className: "block truncate font-semibold", children: producto || "Sin producto" }),
    variante ? /* @__PURE__ */ jsx73("span", { className: "block truncate text-xs text-mute", children: variante }) : null
  ] });
  return /* @__PURE__ */ jsxs58("article", { className: cn("rounded-xl border border-ink-600 bg-ink-800 p-3 text-sm", className), "data-estado": estado, children: [
    /* @__PURE__ */ jsxs58("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsx73("div", { className: "min-w-0", children: onAbrir ? /* @__PURE__ */ jsx73("button", { type: "button", onClick: () => onAbrir(), className: "block max-w-full text-left", children: titulo2 }) : titulo2 }),
      /* @__PURE__ */ jsx73(ChipPrioridad, { prioridad, className: "shrink-0" })
    ] }),
    /* @__PURE__ */ jsxs58("div", { className: "mt-2 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-mute", children: [
      /* @__PURE__ */ jsx73(Badge, { color: colorDeTono(est.tono), children: est.etiqueta }),
      origen ? /* @__PURE__ */ jsx73(ChipOrigen, { origen }) : null,
      centro ? /* @__PURE__ */ jsxs58("span", { className: "inline-flex min-w-0 items-center gap-1", children: [
        /* @__PURE__ */ jsx73(Icon, { name: "building", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx73("span", { className: "truncate", children: centro })
      ] }) : null,
      fechaPrometida ? /* @__PURE__ */ jsxs58("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx73(Icon, { name: "calendar", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx73(Vencimiento, { fecha: fechaPrometida, diasAviso })
      ] }) : null,
      vinculo?.etiqueta ? vinculo.onClick ? /* @__PURE__ */ jsxs58("button", { type: "button", onClick: vinculo.onClick, className: "inline-flex min-w-0 items-center gap-1 transition hover:text-fore", children: [
        /* @__PURE__ */ jsx73(Icon, { name: "receipt", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx73("span", { className: "truncate", children: vinculo.etiqueta })
      ] }) : /* @__PURE__ */ jsxs58("span", { className: "inline-flex min-w-0 items-center gap-1", children: [
        /* @__PURE__ */ jsx73(Icon, { name: "receipt", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx73("span", { className: "truncate", children: vinculo.etiqueta })
      ] }) : null
    ] }),
    /* @__PURE__ */ jsx73(ContadoresCompra, { className: "mt-2", pendiente, comprado, faltan }),
    Array.isArray(destinos) && destinos.length > 0 ? /* @__PURE__ */ jsx73("div", { className: "mt-1.5", children: /* @__PURE__ */ jsx73(ResumenDestinos, { destinos, onElegir: onElegirDestino }) }) : null,
    observaciones ? /* @__PURE__ */ jsx73("p", { className: "mt-1.5 text-xs text-mute", children: observaciones }) : null,
    acciones ? /* @__PURE__ */ jsx73("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: acciones }) : null
  ] });
}

// src/components/TarjetaCompra.jsx
import { Fragment as Fragment7, jsx as jsx74, jsxs as jsxs59 } from "react/jsx-runtime";
function TarjetaCompra({
  codigo,
  proveedor,
  referencia,
  moneda = "PYG",
  simbolo,
  costo,
  estado,
  unidades,
  conImei,
  origen,
  destino,
  notas,
  onAbrir,
  acciones,
  className
}) {
  const est = estadoCompra(estado);
  const titulo2 = /* @__PURE__ */ jsxs59(Fragment7, { children: [
    /* @__PURE__ */ jsx74("span", { className: "block truncate font-mono text-xs font-bold text-fono-light", children: codigo || "Sin c\xF3digo" }),
    /* @__PURE__ */ jsx74("span", { className: "block truncate font-semibold", children: proveedor || "Sin proveedor" })
  ] });
  return /* @__PURE__ */ jsxs59("article", { className: cn("rounded-xl border border-ink-600 bg-ink-800 p-3 text-sm", className), "data-estado": estado, children: [
    /* @__PURE__ */ jsxs59("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs59("div", { className: "min-w-0", children: [
        onAbrir ? /* @__PURE__ */ jsx74("button", { type: "button", onClick: () => onAbrir(), className: "block max-w-full text-left", children: titulo2 }) : titulo2,
        referencia ? /* @__PURE__ */ jsxs59("span", { className: "mt-0.5 block truncate text-xs text-mute", children: [
          "Ref. ",
          referencia
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx74(Badge, { color: colorDeTono(est.tono), className: "shrink-0", children: est.etiqueta })
    ] }),
    /* @__PURE__ */ jsxs59("div", { className: "mt-2 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-mute", children: [
      Number.isFinite(Number(unidades)) ? /* @__PURE__ */ jsx74(ContadorLote, { recibidos: conImei, total: unidades, variante: "chip", sufijo: "con IMEI", mostrarFaltan: true }) : null,
      costo !== null && costo !== void 0 && costo !== "" ? /* @__PURE__ */ jsxs59("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx74(Icon, { name: "money", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx74(Money, { value: costo, currency: moneda, simbolo })
      ] }) : null,
      origen ? /* @__PURE__ */ jsxs59("span", { className: "inline-flex min-w-0 items-center gap-1", children: [
        /* @__PURE__ */ jsx74(Icon, { name: "building", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx74("span", { className: "truncate", children: origen })
      ] }) : null,
      destino ? /* @__PURE__ */ jsxs59("span", { className: "inline-flex min-w-0 items-center gap-1", children: [
        /* @__PURE__ */ jsx74(Icon, { name: "arrowRight", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx74("span", { className: "truncate", children: destino })
      ] }) : null
    ] }),
    notas ? /* @__PURE__ */ jsx74("p", { className: "mt-1.5 text-xs text-mute", children: notas }) : null,
    acciones ? /* @__PURE__ */ jsx74("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: acciones }) : null
  ] });
}

// src/components/TarjetaLote.jsx
import { Fragment as Fragment8, jsx as jsx75, jsxs as jsxs60 } from "react/jsx-runtime";
function TarjetaLote({
  codigo,
  estado,
  origen,
  destino,
  metodo,
  empresa,
  guia,
  responsable,
  eta,
  unidades,
  conImei,
  notas,
  onAbrir,
  acciones,
  className
}) {
  const est = estadoEnvio(estado);
  const ruta = [origen, destino].filter(Boolean).join(" \u2192 ");
  const titulo2 = /* @__PURE__ */ jsxs60(Fragment8, { children: [
    /* @__PURE__ */ jsx75("span", { className: "block truncate font-mono text-xs font-bold text-fono-light", children: codigo || "Sin c\xF3digo" }),
    /* @__PURE__ */ jsx75("span", { className: "block truncate font-semibold", children: ruta || "Sin origen ni destino" })
  ] });
  return /* @__PURE__ */ jsxs60("article", { className: cn("rounded-xl border border-ink-600 bg-ink-800 p-3 text-sm", className), "data-estado": estado, children: [
    /* @__PURE__ */ jsxs60("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs60("div", { className: "min-w-0", children: [
        onAbrir ? /* @__PURE__ */ jsx75("button", { type: "button", onClick: () => onAbrir(), className: "block max-w-full text-left", children: titulo2 }) : titulo2,
        empresa || guia ? /* @__PURE__ */ jsx75("span", { className: "mt-0.5 block truncate text-xs text-mute", children: [empresa, guia ? `Gu\xEDa ${guia}` : null].filter(Boolean).join(" \xB7 ") }) : null
      ] }),
      /* @__PURE__ */ jsx75(Badge, { color: colorDeTono(est.tono), className: "shrink-0", children: est.etiqueta })
    ] }),
    /* @__PURE__ */ jsxs60("div", { className: "mt-2 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-mute", children: [
      metodo ? /* @__PURE__ */ jsxs60("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx75(Icon, { name: iconoMetodoEnvio(metodo), className: "h-3.5 w-3.5 shrink-0" }),
        etiquetaMetodoEnvio(metodo)
      ] }) : null,
      responsable ? /* @__PURE__ */ jsxs60("span", { className: "inline-flex min-w-0 items-center gap-1", children: [
        /* @__PURE__ */ jsx75(Icon, { name: "user", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx75("span", { className: "truncate", children: responsable })
      ] }) : null,
      eta ? /* @__PURE__ */ jsxs60("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx75(Icon, { name: "calendar", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx75(Vencimiento, { fecha: eta })
      ] }) : null,
      Number.isFinite(Number(unidades)) ? /* @__PURE__ */ jsx75(ContadorLote, { recibidos: conImei, total: unidades, variante: "chip", sufijo: "con IMEI", mostrarFaltan: true }) : null
    ] }),
    notas ? /* @__PURE__ */ jsx75("p", { className: "mt-1.5 text-xs text-mute", children: notas }) : null,
    acciones ? /* @__PURE__ */ jsx75("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: acciones }) : null
  ] });
}

// src/components/TarjetaRecepcion.jsx
import { Fragment as Fragment9, jsx as jsx76, jsxs as jsxs61 } from "react/jsx-runtime";
function TarjetaRecepcion({
  codigo,
  estado,
  origen,
  destino,
  metodo,
  eta,
  unidades,
  conImei,
  deposito,
  depositoSugerido,
  llegada,
  notas,
  onAbrir,
  acciones,
  className
}) {
  const est = estadoEnvio(estado);
  const ruta = [origen, destino].filter(Boolean).join(" \u2192 ");
  const depositoTexto = deposito ?? depositoSugerido;
  const titulo2 = /* @__PURE__ */ jsxs61(Fragment9, { children: [
    /* @__PURE__ */ jsx76("span", { className: "block truncate font-mono text-xs font-bold text-fono-light", children: codigo || "Sin c\xF3digo" }),
    /* @__PURE__ */ jsx76("span", { className: "block truncate font-semibold", children: ruta || "Sin origen ni destino" })
  ] });
  return /* @__PURE__ */ jsxs61("article", { className: cn("rounded-xl border border-ink-600 bg-ink-800 p-3 text-sm", className), "data-estado": estado, children: [
    /* @__PURE__ */ jsxs61("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs61("div", { className: "min-w-0", children: [
        onAbrir ? /* @__PURE__ */ jsx76("button", { type: "button", onClick: () => onAbrir(), className: "block max-w-full text-left", children: titulo2 }) : titulo2,
        llegada ? /* @__PURE__ */ jsxs61("span", { className: "mt-0.5 block truncate text-xs text-mute", children: [
          "Lleg\xF3 ",
          llegada
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx76(Badge, { color: colorDeTono(est.tono), className: "shrink-0", children: est.etiqueta })
    ] }),
    /* @__PURE__ */ jsxs61("div", { className: "mt-2 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-mute", children: [
      metodo ? /* @__PURE__ */ jsxs61("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx76(Icon, { name: iconoMetodoEnvio(metodo), className: "h-3.5 w-3.5 shrink-0" }),
        etiquetaMetodoEnvio(metodo)
      ] }) : null,
      eta ? /* @__PURE__ */ jsxs61("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx76(Icon, { name: "calendar", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx76(Vencimiento, { fecha: eta })
      ] }) : null,
      depositoTexto ? /* @__PURE__ */ jsxs61("span", { className: "inline-flex min-w-0 items-center gap-1", children: [
        /* @__PURE__ */ jsx76(Icon, { name: "box", className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx76("span", { className: "truncate", children: depositoTexto })
      ] }) : null,
      Number.isFinite(Number(unidades)) ? /* @__PURE__ */ jsx76(ContadorLote, { recibidos: conImei, total: unidades, variante: "chip", sufijo: "con IMEI", mostrarFaltan: true }) : null
    ] }),
    notas ? /* @__PURE__ */ jsx76("p", { className: "mt-1.5 text-xs text-mute", children: notas }) : null,
    acciones ? /* @__PURE__ */ jsx76("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: acciones }) : null
  ] });
}

// src/components/CodigoQr.jsx
import { useEffect as useEffect17, useState as useState26 } from "react";

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

// src/components/CodigoQr.jsx
import { jsx as jsx77 } from "react/jsx-runtime";
function CodigoQr({ valor, ancho = 220, nivel = "M", margen = 1, alt = "C\xF3digo QR", className, ...props }) {
  const [imagen, setImagen] = useState26("");
  useEffect17(() => {
    let activo = true;
    qrDataUrl(valor, { ancho, nivel, margen }).then((data) => {
      if (activo) setImagen(data);
    });
    return () => {
      activo = false;
    };
  }, [valor, ancho, nivel, margen]);
  if (!imagen) return null;
  return /* @__PURE__ */ jsx77("img", { src: imagen, alt, title: alt, className: cn("rounded-xl bg-white p-2", className), ...props });
}

// src/components/EtiquetaLote.jsx
import { jsx as jsx78, jsxs as jsxs62 } from "react/jsx-runtime";
function EtiquetaLote({
  codigo,
  numero,
  total,
  producto,
  variante,
  serial,
  pendienteImei = false,
  pedido,
  destino,
  qr,
  qrValor,
  nota,
  className
}) {
  return /* @__PURE__ */ jsxs62("div", { className: cn("w-full max-w-[320px] rounded-xl border-2 border-[#10161a] bg-white p-3 text-[#10161a]", className), children: [
    /* @__PURE__ */ jsxs62("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsx78("b", { className: "font-mono text-sm", children: codigo || "ENV-\u2026" }),
      qr ? /* @__PURE__ */ jsx78("img", { src: qr, alt: "QR del lote", className: "h-16 w-16" }) : null,
      !qr && qrValor ? /* @__PURE__ */ jsx78(CodigoQr, { valor: qrValor, ancho: 96, alt: "QR del lote", className: "h-16 w-16 rounded-md bg-white p-0" }) : null
    ] }),
    total ? /* @__PURE__ */ jsxs62("p", { className: "mt-1 text-center text-xs font-bold uppercase tracking-wider", children: [
      "Producto ",
      numero,
      " de ",
      total
    ] }) : null,
    /* @__PURE__ */ jsx78("p", { className: "mt-1 text-center text-base font-bold leading-tight", children: producto || "Producto" }),
    variante ? /* @__PURE__ */ jsx78("p", { className: "text-center text-[11px]", children: variante }) : null,
    /* @__PURE__ */ jsx78("p", { className: "mt-1 text-center font-mono text-sm", children: serial || (pendienteImei ? "IMEI pendiente" : "\u2014") }),
    pedido || destino ? /* @__PURE__ */ jsxs62("div", { className: "mt-1 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wide", children: [
      /* @__PURE__ */ jsx78("span", { className: "min-w-0 truncate", children: pedido || "" }),
      /* @__PURE__ */ jsx78("span", { className: "min-w-0 truncate text-right", children: destino || "" })
    ] }) : null,
    nota ? /* @__PURE__ */ jsx78("p", { className: "mt-1 text-[10px]", children: nota }) : null
  ] });
}

// src/components/ManifiestoEnvio.jsx
import { jsx as jsx79, jsxs as jsxs63 } from "react/jsx-runtime";
function Dato({ etiqueta, valor }) {
  if (!valor) return null;
  return /* @__PURE__ */ jsxs63("p", { className: "min-w-0", children: [
    /* @__PURE__ */ jsx79("span", { className: "oc-print-suave block text-[9.5px] font-bold uppercase tracking-wider", children: etiqueta }),
    /* @__PURE__ */ jsx79("span", { className: "block whitespace-pre-wrap text-[12.5px]", children: valor })
  ] });
}
function ManifiestoEnvio({
  codigo,
  origen,
  destino,
  metodo,
  empresa,
  conductor,
  guia,
  responsable,
  compra,
  salida,
  eta,
  llegada,
  lineas = [],
  unidades,
  conImei,
  pendientes,
  enlace,
  qr,
  notas,
  className
}) {
  const ruta = [origen, destino].filter(Boolean).join(" \u2192 ");
  const lista = Array.isArray(lineas) ? lineas : [];
  const cantidadDe = (linea) => Number(linea?.cantidad) || (linea?.imeis?.length || 0) + (Number(linea?.pendientes) || 0);
  const totalUnidades = Number.isFinite(Number(unidades)) ? Number(unidades) : lista.reduce((suma, linea) => suma + cantidadDe(linea), 0);
  const totalConImei = Number.isFinite(Number(conImei)) ? Number(conImei) : lista.reduce((suma, linea) => suma + (linea?.imeis?.length || 0), 0);
  const totalPendientes = Number.isFinite(Number(pendientes)) ? Number(pendientes) : lista.reduce((suma, linea) => suma + (Number(linea?.pendientes) || 0), 0);
  return /* @__PURE__ */ jsxs63("section", { className: cn("oc-print-bloque w-full bg-white p-4 text-[#10161a]", className), "aria-label": `Manifiesto del lote ${codigo || ""}`, children: [
    /* @__PURE__ */ jsxs63("div", { className: "flex items-start justify-between gap-3 border-b-2 border-[#10161a] pb-2", children: [
      /* @__PURE__ */ jsxs63("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx79("p", { className: "oc-print-suave text-[10px] font-bold uppercase tracking-wider", children: "Manifiesto de env\xEDo" }),
        /* @__PURE__ */ jsx79("b", { className: "block font-mono text-lg", children: codigo || "ENV-\u2026" }),
        ruta ? /* @__PURE__ */ jsx79("span", { className: "block text-sm font-semibold", children: ruta }) : null
      ] }),
      qr ? /* @__PURE__ */ jsx79("img", { src: qr, alt: "QR del manifiesto", className: "h-20 w-20" }) : null,
      !qr && enlace ? /* @__PURE__ */ jsx79(CodigoQr, { valor: enlace, ancho: 120, alt: "QR del manifiesto", className: "h-20 w-20 rounded-md bg-white p-0" }) : null
    ] }),
    /* @__PURE__ */ jsxs63("div", { className: "mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "M\xE9todo", valor: metodo ? etiquetaMetodoEnvio(metodo) : null }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "Empresa", valor: empresa }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "Conductor", valor: conductor }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "Gu\xEDa", valor: guia }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "Responsable", valor: responsable }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "Compra", valor: compra }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "Salida", valor: salida }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "ETA", valor: eta }),
      /* @__PURE__ */ jsx79(Dato, { etiqueta: "Llegada", valor: llegada })
    ] }),
    /* @__PURE__ */ jsxs63("table", { className: "oc-print-tabla mt-3 w-full", children: [
      /* @__PURE__ */ jsx79("caption", { className: "sr-only", children: "Detalle de productos, variantes, cantidades e identificadores del env\xEDo" }),
      /* @__PURE__ */ jsx79("thead", { children: /* @__PURE__ */ jsxs63("tr", { children: [
        /* @__PURE__ */ jsx79("th", { scope: "col", children: "Producto" }),
        /* @__PURE__ */ jsx79("th", { scope: "col", children: "Variante" }),
        /* @__PURE__ */ jsx79("th", { scope: "col", className: "oc-print-num", children: "Cantidad" }),
        /* @__PURE__ */ jsx79("th", { scope: "col", children: "IMEI / serial" })
      ] }) }),
      /* @__PURE__ */ jsx79("tbody", { children: lista.map((linea, indice) => {
        const imeis = Array.isArray(linea?.imeis) ? linea.imeis : [];
        const pendientesLinea = Number(linea?.pendientes) || 0;
        return /* @__PURE__ */ jsxs63("tr", { children: [
          /* @__PURE__ */ jsx79("td", { children: linea?.producto || "\u2014" }),
          /* @__PURE__ */ jsx79("td", { children: [linea?.capacidad, linea?.condicion ? etiquetaCondicion(linea.condicion) : null].filter(Boolean).join(" \xB7 ") || "\u2014" }),
          /* @__PURE__ */ jsx79("td", { className: "oc-print-num", children: cantidadDe(linea) }),
          /* @__PURE__ */ jsxs63("td", { children: [
            imeis.map((serial) => /* @__PURE__ */ jsx79("span", { className: "block font-mono text-[11px]", children: serial }, serial)),
            pendientesLinea > 0 ? /* @__PURE__ */ jsxs63("span", { className: "oc-print-suave block text-[11px]", children: [
              pendientesLinea,
              " IMEI pendiente",
              pendientesLinea === 1 ? "" : "s"
            ] }) : null,
            !imeis.length && !pendientesLinea ? /* @__PURE__ */ jsx79("span", { className: "oc-print-suave block text-[11px]", children: "Sin IMEI registrados" }) : null
          ] })
        ] }, linea?.id ?? `${linea?.producto || "linea"}-${indice}`);
      }) })
    ] }),
    /* @__PURE__ */ jsxs63("div", { className: "mt-2 border-t border-[#dbe3e7] pt-2", children: [
      /* @__PURE__ */ jsxs63("p", { className: "text-[11.5px]", children: [
        /* @__PURE__ */ jsx79("b", { className: "oc-print-num", children: totalUnidades }),
        " unidad",
        totalUnidades === 1 ? "" : "es",
        " \xB7",
        " ",
        /* @__PURE__ */ jsx79("b", { className: "oc-print-num", children: totalConImei }),
        " con IMEI \xB7",
        " ",
        /* @__PURE__ */ jsx79("b", { className: "oc-print-num", children: totalPendientes }),
        " pendiente",
        totalPendientes === 1 ? "" : "s"
      ] }),
      notas ? /* @__PURE__ */ jsx79("p", { className: "mt-1 whitespace-pre-wrap text-[11px]", children: notas }) : null
    ] })
  ] });
}

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
var normalizar4 = (valor) => String(valor ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
var POR_CLAVE = new Map(Object.keys(ESTADOS_REVISION).map((clave) => [normalizar4(clave), clave]));
var claveRevision = (estado) => POR_CLAVE.get(normalizar4(estado)) || String(estado ?? "");
var esIncidencia = (estado) => INCIDENCIAS.includes(claveRevision(estado));
var etiquetaRevision = (estado) => ESTADOS_REVISION[claveRevision(estado)]?.etiqueta || String(estado || "");
var etiquetaPluralRevision = (estado) => ESTADOS_REVISION[claveRevision(estado)]?.etiquetaPlural || String(estado || "");
var tonoRevision = (estado) => ESTADOS_REVISION[claveRevision(estado)]?.tono || "mute";

// src/components/ResumenIncidencias.jsx
import { jsx as jsx80, jsxs as jsxs64 } from "react/jsx-runtime";
var CLASES2 = {
  bad: "border-bad/30 bg-bad/10 text-bad-text",
  warn: "border-warn/30 bg-warn/10 text-warn-text",
  mute: "border-ink-500 bg-ink-700 text-mute",
  ok: "border-ok/30 bg-ok/10 text-ok-text"
};
function ResumenIncidencias({ incidencias = [], sinIncidencias = "Sin incidencias", className }) {
  const lista = (Array.isArray(incidencias) ? incidencias : []).map((incidencia) => ({ ...incidencia, cantidad: Math.trunc(Number(incidencia?.cantidad) || 0) })).filter((incidencia) => incidencia.cantidad > 0);
  if (!lista.length) {
    return /* @__PURE__ */ jsx80("span", { className: cn("inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold", CLASES2.ok, className), children: sinIncidencias });
  }
  return /* @__PURE__ */ jsx80("span", { className: cn("flex min-w-0 flex-wrap items-center gap-1.5", className), role: "list", "aria-label": "Incidencias de la recepci\xF3n", children: lista.map((incidencia, indice) => {
    const tono = incidencia.tono || tonoRevision(incidencia.tipo);
    return /* @__PURE__ */ jsxs64(
      "span",
      {
        role: "listitem",
        title: incidencia.detalle || void 0,
        className: cn("inline-flex items-center gap-1 whitespace-nowrap rounded-lg border px-2 py-0.5 text-xs font-semibold", CLASES2[tono] || CLASES2.mute),
        children: [
          incidencia.etiqueta || etiquetaPluralRevision(incidencia.tipo),
          /* @__PURE__ */ jsx80("span", { className: "tabular-nums", children: incidencia.cantidad })
        ]
      },
      `${incidencia.tipo}-${indice}`
    );
  }) });
}

// src/components/ResumenRecepcion.jsx
import { jsx as jsx81, jsxs as jsxs65 } from "react/jsx-runtime";
var ORDEN = ["recibido", "faltante", "sobrante", "danado", "incorrecto"];
var CHIP2 = {
  ok: "border-ok/30 bg-ok/10 text-ok-text",
  warn: "border-warn/30 bg-warn/10 text-warn-text",
  bad: "border-bad/30 bg-bad/10 text-bad-text",
  mute: "border-ink-500 bg-ink-700 text-mute"
};
function ResumenRecepcion({ resumen, items, className }) {
  const conteos = resumen && typeof resumen === "object" && !Array.isArray(resumen) ? Object.fromEntries(Object.entries(resumen).map(([clave, valor]) => [claveRevision(clave), Number(valor) || 0])) : Array.isArray(items) ? items.reduce((acumulado, item) => {
    const clave = claveRevision(item?.resultado);
    if (clave) acumulado[clave] = (acumulado[clave] || 0) + 1;
    return acumulado;
  }, {}) : {};
  const filas = ORDEN.filter((clave) => (conteos[clave] || 0) > 0);
  if (!filas.length) return null;
  return /* @__PURE__ */ jsx81("span", { className: cn("flex min-w-0 flex-wrap items-center gap-1.5", className), "aria-label": "Resumen de la recepci\xF3n", children: filas.map((clave) => /* @__PURE__ */ jsxs65("span", { className: cn("inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-semibold", CHIP2[tonoRevision(clave)] || CHIP2.mute), children: [
    /* @__PURE__ */ jsx81("b", { className: "tabular-nums", children: conteos[clave] }),
    etiquetaPluralRevision(clave).toLowerCase()
  ] }, clave)) });
}

// src/components/FilaRevision.jsx
import { jsx as jsx82, jsxs as jsxs66 } from "react/jsx-runtime";
var TONOS2 = {
  ok: "border-ok/30 bg-ok/5",
  warn: "border-warn/25 bg-warn/5",
  bad: "border-bad/25 bg-bad/5",
  mute: "border-ink-600"
};
var CHIP3 = {
  ok: "border-ok/30 bg-ok/10 text-ok-text",
  warn: "border-warn/30 bg-warn/10 text-warn-text",
  bad: "border-bad/30 bg-bad/10 text-bad-text",
  mute: "border-ink-500 bg-ink-700 text-mute"
};
function FilaRevision({ etiqueta, serial, estado = "ok", detalle, acciones, compact = false, className }) {
  const tono = tonoRevision(estado);
  return /* @__PURE__ */ jsxs66("div", { className: cn("flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border px-3", compact ? "py-1.5" : "py-2.5", TONOS2[tono] || TONOS2.mute, className), children: [
    /* @__PURE__ */ jsxs66("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx82("span", { className: "block truncate text-sm font-semibold", children: etiqueta }),
      /* @__PURE__ */ jsxs66("span", { className: "mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-mute", children: [
        serial ? /* @__PURE__ */ jsx82(SerialTexto, { serial, className: "text-[11px]" }) : /* @__PURE__ */ jsx82("span", { children: "IMEI pendiente" }),
        detalle ? /* @__PURE__ */ jsx82("span", { className: CELDA_DATO, title: String(detalle), children: detalle }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsx82("span", { className: cn("shrink-0 rounded-lg border px-2 py-0.5 text-xs font-semibold", CHIP3[tono] || CHIP3.mute), "data-estado": estado, children: etiquetaRevision(estado) }),
    acciones ? /* @__PURE__ */ jsx82("span", { className: "flex shrink-0 flex-wrap items-center gap-2", children: acciones }) : null
  ] });
}

// src/components/SelectorIncidencia.jsx
import { jsx as jsx83 } from "react/jsx-runtime";
var CHIP4 = {
  ok: "border-ok/40 bg-ok/10 text-ok-text",
  warn: "border-warn/40 bg-warn/10 text-warn-text",
  bad: "border-bad/40 bg-bad/10 text-bad-text",
  mute: "border-ink-500 bg-ink-700 text-mute"
};
var CHIP_APAGADO = "border-ink-500 text-mute hover:border-fono hover:text-fore";
function SelectorIncidencia({ valor, onChange, tipos = INCIDENCIAS, permitirQuitar = true, disabled = false, ariaLabel = "Incidencia de la unidad", className }) {
  return /* @__PURE__ */ jsx83("span", { role: "group", "aria-label": ariaLabel, className: cn("flex flex-wrap items-center gap-1.5", className), children: tipos.map((tipo) => {
    const activo = valor === tipo;
    const tono = tonoRevision(tipo);
    return /* @__PURE__ */ jsx83(
      "button",
      {
        type: "button",
        disabled,
        "aria-pressed": activo,
        title: activo && permitirQuitar ? "Quitar la incidencia" : etiquetaRevision(tipo),
        onClick: () => onChange?.(activo && permitirQuitar ? null : tipo),
        className: cn(
          "rounded-lg border px-2 py-0.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
          activo ? CHIP4[tono] || CHIP4.mute : CHIP_APAGADO
        ),
        children: ESTADOS_REVISION[tipo]?.etiqueta || tipo
      },
      tipo
    );
  }) });
}

// src/components/DestinoRecepcion.jsx
import { useEffect as useEffect18, useId as useId18, useRef as useRef16, useState as useState27 } from "react";
import { jsx as jsx84, jsxs as jsxs67 } from "react/jsx-runtime";
function DestinoRecepcion(props) {
  const {
    destino,
    destinoId,
    defaultDestinoId,
    onDestinoChange,
    depositos = [],
    pendientes = 0,
    recibiendo = false,
    onRecibir,
    etiqueta = "Recibir en",
    textoRecibir = "Recibir todo",
    className
  } = props;
  const controlado = Object.prototype.hasOwnProperty.call(props, "destinoId");
  const [elegidoInterno, setElegidoInterno] = useState27(defaultDestinoId ?? destino?.id ?? depositos[0]?.id ?? "");
  const destinoAnterior = useRef16(destino?.id);
  useEffect18(() => {
    if (controlado || destinoAnterior.current === destino?.id) return;
    destinoAnterior.current = destino?.id;
    setElegidoInterno(destino?.id ?? defaultDestinoId ?? depositos[0]?.id ?? "");
  }, [controlado, defaultDestinoId, depositos, destino?.id]);
  const elegido = controlado ? destinoId ?? "" : elegidoInterno;
  const id = useId18();
  const actual = depositos.find((deposito) => deposito.id === elegido) || destino || null;
  const alternativas = depositos.filter((deposito) => deposito.id !== actual?.id);
  const elegir = (siguiente) => {
    if (!controlado) setElegidoInterno(siguiente);
    onDestinoChange?.(siguiente);
  };
  return /* @__PURE__ */ jsxs67("section", { className: cn("rounded-xl border border-ink-600 bg-ink-800 p-3", className), "aria-label": "Cierre de la recepci\xF3n", children: [
    /* @__PURE__ */ jsxs67("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ jsxs67("label", { htmlFor: id, className: "min-w-0 flex-1 space-y-1 text-xs text-mute", children: [
        /* @__PURE__ */ jsx84("span", { className: "block font-semibold", children: etiqueta }),
        alternativas.length > 0 ? /* @__PURE__ */ jsxs67(Select, { id, value: elegido, onChange: (event) => elegir(event.target.value), className: "w-full", children: [
          actual ? /* @__PURE__ */ jsx84("option", { value: actual.id, children: actual.nombre }) : null,
          alternativas.map((deposito) => /* @__PURE__ */ jsx84("option", { value: deposito.id, children: deposito.nombre }, deposito.id))
        ] }) : /* @__PURE__ */ jsxs67("span", { className: "flex h-9 items-center gap-2 rounded-lg border border-ink-600 px-3 text-sm font-semibold text-fore", children: [
          /* @__PURE__ */ jsx84(Icon, { name: "box", className: "h-4 w-4 text-mute" }),
          actual?.nombre || "Sin dep\xF3sito"
        ] })
      ] }),
      /* @__PURE__ */ jsx84(Button, { type: "button", disabled: recibiendo || !actual?.id || !onRecibir, onClick: () => onRecibir?.(actual.id), children: recibiendo ? "Recibiendo\u2026" : textoRecibir })
    ] }),
    Number(pendientes) > 0 && /* @__PURE__ */ jsxs67("p", { className: "mt-2 flex items-center gap-1.5 text-xs text-warn-text", children: [
      /* @__PURE__ */ jsx84(Icon, { name: "alert", className: "h-3.5 w-3.5 shrink-0", "aria-hidden": "true" }),
      Number(pendientes),
      " unidad(es) sin IMEI: se reciben igual y el IMEI se completa despu\xE9s."
    ] })
  ] });
}

// src/components/GradoBadge.jsx
import { jsx as jsx85, jsxs as jsxs68 } from "react/jsx-runtime";
function GradoBadge({ grado, conDescripcion = false, className }) {
  const config = gradoCondicion(grado);
  if (!config) return /* @__PURE__ */ jsx85(Badge, { className, children: grado || "Sin grado" });
  return /* @__PURE__ */ jsxs68("span", { className: cn("inline-flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsx85(Badge, { color: colorBadge(config.tono), className: "whitespace-nowrap", title: config.descripcion, children: config.etiqueta }),
    conDescripcion && /* @__PURE__ */ jsx85("span", { className: "text-xs text-mute", children: config.descripcion })
  ] });
}

// src/components/TileEquipo.jsx
import { Fragment as Fragment10, jsx as jsx86, jsxs as jsxs69 } from "react/jsx-runtime";
function TileEquipo({
  modelo,
  imei,
  detalle,
  foto,
  estado,
  grado,
  bateria,
  ciclos,
  locks,
  acciones,
  onOpen,
  className
}) {
  const raiz = cn("w-full space-y-2.5 rounded-2xl border border-ink-600 bg-ink-800 p-3 text-left", onOpen && "transition hover:border-fono active:scale-[.995]", className);
  const contenido = /* @__PURE__ */ jsxs69(Fragment10, { children: [
    /* @__PURE__ */ jsxs69("div", { className: "flex items-start gap-3", children: [
      foto ? /* @__PURE__ */ jsx86("img", { src: foto, alt: modelo || "Equipo", className: "h-12 w-12 shrink-0 rounded-xl border border-ink-600 object-cover" }) : /* @__PURE__ */ jsx86("span", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-ink-600 bg-ink-700 text-mute", children: /* @__PURE__ */ jsx86(IconoCategoria, { categoria: modelo, className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxs69("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx86("p", { className: "truncate text-sm font-semibold", children: modelo || "Equipo" }),
        imei && /* @__PURE__ */ jsx86("p", { className: "mt-0.5 truncate font-mono text-[11px] text-mute", "data-serial": true, children: imei }),
        detalle && /* @__PURE__ */ jsx86("p", { className: "mt-0.5 truncate text-[11px] text-mute", children: detalle })
      ] }),
      estado && /* @__PURE__ */ jsx86(ChipEstado, { estado })
    ] }),
    /* @__PURE__ */ jsxs69("div", { className: "flex flex-wrap items-center gap-2", children: [
      grado && /* @__PURE__ */ jsx86(GradoBadge, { grado }),
      bateria !== void 0 && bateria !== null && /* @__PURE__ */ jsx86(MedidorBateria, { porcentaje: bateria, ciclos, variante: "chip" }),
      locks?.length ? /* @__PURE__ */ jsx86(ChipsLocks, { locks }) : null
    ] }),
    acciones && /* @__PURE__ */ jsx86("div", { className: "flex flex-wrap gap-2", children: acciones })
  ] });
  if (onOpen) {
    return /* @__PURE__ */ jsx86("button", { type: "button", onClick: onOpen, className: raiz, children: contenido });
  }
  return /* @__PURE__ */ jsx86("article", { className: raiz, children: contenido });
}

// src/components/PasosEquipo.jsx
import { jsx as jsx87, jsxs as jsxs70 } from "react/jsx-runtime";
function PasosEquipo({ pasos = [], actual = 0, etiqueta, testId, className }) {
  if (!pasos.length) return null;
  const etiquetaDe = (paso) => typeof paso === "string" ? paso : paso.etiqueta ?? paso.label ?? "";
  const claveDe = (paso, indice) => typeof paso === "string" ? indice : paso.id ?? indice;
  const indiceActual = (() => {
    const i = pasos.findIndex((paso, indice) => claveDe(paso, indice) === actual);
    if (i >= 0) return i;
    const numero = Number(actual);
    return Number.isInteger(numero) ? Math.min(Math.max(0, numero), pasos.length - 1) : 0;
  })();
  const texto = etiqueta || etiquetaDe(pasos[indiceActual]) || String(actual);
  return /* @__PURE__ */ jsxs70(
    "span",
    {
      className: cn("flex items-center gap-1", className),
      "data-testid": testId,
      "data-paso": indiceActual + 1,
      "aria-label": `Paso ${indiceActual + 1} de ${pasos.length}: ${texto}`,
      children: [
        pasos.map((paso, orden) => /* @__PURE__ */ jsx87(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "h-1.5 rounded-full transition-all",
              orden < indiceActual ? "w-3 bg-fono/60" : orden === indiceActual ? "w-5 bg-fono" : "w-1.5 bg-ink-600"
            )
          },
          claveDe(paso, orden)
        )),
        /* @__PURE__ */ jsx87("span", { className: "text-[10px] font-semibold text-mute", children: texto })
      ]
    }
  );
}

// src/components/ColumnaLote.jsx
import { jsx as jsx88, jsxs as jsxs71 } from "react/jsx-runtime";
function ColumnaLote({ etiqueta, tono = "slate", contador, acciones, children, vacio = "Sin equipos", testId, className }) {
  const lista = Array.isArray(children) ? children.filter(Boolean) : children;
  const vacia = !lista || Array.isArray(lista) && lista.length === 0;
  return /* @__PURE__ */ jsxs71("section", { "data-testid": testId, className: cn("rounded-2xl border border-ink-600 bg-ink-800/40 p-3", className), children: [
    /* @__PURE__ */ jsxs71("header", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs71("span", { className: "flex min-w-0 items-center gap-2", children: [
        /* @__PURE__ */ jsx88(Badge, { color: tono, children: etiqueta }),
        contador !== void 0 && contador !== null && /* @__PURE__ */ jsx88("span", { className: "text-xs tabular-nums text-mute", children: contador })
      ] }),
      acciones ? /* @__PURE__ */ jsx88("span", { className: "flex flex-wrap items-center gap-2", children: acciones }) : null
    ] }),
    /* @__PURE__ */ jsx88("div", { className: "mt-3 space-y-2", children: vacia ? /* @__PURE__ */ jsx88(EmptyState, { compact: true, title: vacio }) : lista })
  ] });
}

// src/components/TileRol.jsx
import { Fragment as Fragment11, jsx as jsx89, jsxs as jsxs72 } from "react/jsx-runtime";
function TileRol({ titulo: titulo2, descripcion, cantidad, total, dominios = [], onAbrir, className }) {
  const contenido = /* @__PURE__ */ jsxs72(Fragment11, { children: [
    /* @__PURE__ */ jsxs72("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs72("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx89("b", { className: "block truncate text-sm", children: titulo2 }),
        descripcion ? /* @__PURE__ */ jsx89("p", { className: "mt-0.5 text-[11px] leading-4 text-mute", children: descripcion }) : null
      ] }),
      Number.isFinite(Number(total)) && Number(total) > 0 ? /* @__PURE__ */ jsxs72("span", { className: "v2-numero shrink-0 text-2xl font-bold tabular-nums", children: [
        Number(cantidad) || 0,
        /* @__PURE__ */ jsxs72("span", { className: "text-sm font-semibold text-mute", children: [
          "/",
          Number(total)
        ] })
      ] }) : null
    ] }),
    dominios.length > 0 && /* @__PURE__ */ jsx89("div", { className: "mt-2 flex flex-wrap gap-1", children: dominios.map((dominio, indice) => /* @__PURE__ */ jsx89(Badge, { color: dominio.activo ? "green" : "slate", children: dominio.etiqueta }, dominio.id ?? `${dominio.etiqueta}-${indice}`)) })
  ] });
  const clases = "block w-full rounded-2xl border border-ink-600 bg-ink-800 p-3 text-left";
  if (!onAbrir) return /* @__PURE__ */ jsx89("div", { className: cn(clases, className), children: contenido });
  return /* @__PURE__ */ jsx89("button", { type: "button", onClick: onAbrir, className: cn(clases, "transition hover:border-fono/60", className), children: contenido });
}

// src/components/Stepper.jsx
import { jsx as jsx90, jsxs as jsxs73 } from "react/jsx-runtime";
function Stepper({ pasos = [], actual = 0, hechos = [], variante = "linea", ariaLabel = "Flujo", className }) {
  if (!pasos.length) return null;
  const etiquetaDe = (paso) => typeof paso === "string" ? paso : paso.etiqueta ?? paso.label ?? "";
  const claveDe = (paso, indice) => typeof paso === "string" ? indice : paso.id ?? indice;
  const esHecho = (paso, indice) => hechos.includes(claveDe(paso, indice)) || typeof actual === "number" && indice < actual;
  const esActual = (paso, indice) => typeof paso === "string" || paso.id === void 0 ? indice === actual : paso.id === actual;
  if (variante === "tarjetas") {
    return /* @__PURE__ */ jsx90("ol", { className: cn("grid grid-cols-2 gap-2 sm:grid-flow-col sm:auto-cols-fr", className), "aria-label": ariaLabel, children: pasos.map((paso, indice) => {
      const hecho = esHecho(paso, indice);
      const activo = !hecho && esActual(paso, indice);
      return /* @__PURE__ */ jsxs73("li", { "aria-current": activo ? "step" : void 0, className: cn("flex items-center gap-2.5 rounded-xl border p-2.5", activo ? "border-info/40 bg-info/5" : "border-ink-600"), children: [
        /* @__PURE__ */ jsx90(
          "span",
          {
            className: cn(
              "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
              activo ? "oc-paso-activo bg-info/15 text-info-text" : hecho ? "bg-ok/15 text-ok-text" : "bg-ink-700 text-mute"
            ),
            "aria-hidden": "true",
            children: hecho ? /* @__PURE__ */ jsx90(Icon, { name: "check", className: "h-3.5 w-3.5" }) : indice + 1
          }
        ),
        /* @__PURE__ */ jsxs73("span", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx90("span", { className: "block truncate text-xs font-semibold", children: etiquetaDe(paso) }),
          typeof paso === "object" && paso.detalle ? /* @__PURE__ */ jsx90("span", { className: cn("block truncate text-[11px]", activo ? "text-info-text" : "text-mute"), children: paso.detalle }) : null
        ] })
      ] }, claveDe(paso, indice));
    }) });
  }
  return /* @__PURE__ */ jsx90("ol", { className: cn("flex flex-wrap items-center gap-x-2 gap-y-2", className), "aria-label": ariaLabel, children: pasos.map((paso, indice) => {
    const hecho = esHecho(paso, indice);
    const enCurso = esActual(paso, indice);
    return /* @__PURE__ */ jsxs73("li", { "aria-current": enCurso ? "step" : void 0, className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx90(
        "span",
        {
          className: cn(
            "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-bold",
            hecho && "border-pass/40 bg-pass/15 text-pass-text",
            !hecho && enCurso && "oc-paso-activo border-fono bg-fono/10 text-fono-text",
            !hecho && !enCurso && "border-ink-600 bg-ink-800 text-mute"
          ),
          "aria-hidden": "true",
          children: hecho ? /* @__PURE__ */ jsx90(Icon, { name: "check", className: "h-3.5 w-3.5" }) : indice + 1
        }
      ),
      /* @__PURE__ */ jsxs73("span", { className: cn("text-xs font-semibold", enCurso ? "text-fore" : hecho ? "text-pass-text" : "text-mute"), children: [
        etiquetaDe(paso),
        typeof paso === "object" && paso.detalle && /* @__PURE__ */ jsxs73("span", { className: "ml-1 font-normal text-mute", children: [
          "\xB7 ",
          paso.detalle
        ] })
      ] }),
      indice < pasos.length - 1 && /* @__PURE__ */ jsx90("span", { className: "mx-1 h-px w-6 bg-ink-600", "aria-hidden": "true" })
    ] }, claveDe(paso, indice));
  }) });
}

// src/components/FichaCertificado.jsx
import { jsx as jsx91, jsxs as jsxs74 } from "react/jsx-runtime";
function FichaCertificado({
  empresa,
  modelo,
  imei,
  grado,
  bateria,
  ciclos,
  locks = [],
  aprobados,
  total,
  puntaje,
  condicion,
  repuestosNoOem,
  repuestosNoOemNota,
  verificadoPor,
  verificadoAt,
  enlace,
  etiquetaQr = "Escane\xE1 para ver el informe completo",
  estado = "pass",
  acciones,
  className
}) {
  const hayChecklist = Number(total) > 0;
  const completo = hayChecklist && Number(aprobados) === Number(total);
  return /* @__PURE__ */ jsxs74("article", { className: cn("overflow-hidden rounded-2xl border border-ink-600 bg-ink-800", className), children: [
    /* @__PURE__ */ jsxs74("header", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-ink-600 p-4", children: [
      /* @__PURE__ */ jsxs74("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx91("p", { className: "text-[11px] font-bold uppercase tracking-wider text-mute", children: empresa || "Informe de dispositivo" }),
        /* @__PURE__ */ jsx91("h2", { className: "truncate text-lg font-bold", children: modelo || "Equipo" })
      ] }),
      /* @__PURE__ */ jsx91(ChipEstado, { estado })
    ] }),
    /* @__PURE__ */ jsxs74("div", { className: "grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto]", children: [
      /* @__PURE__ */ jsxs74("div", { className: "min-w-0 space-y-3", children: [
        /* @__PURE__ */ jsxs74("dl", { className: "grid gap-x-4 gap-y-2 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx91(FilaDato, { etiqueta: "IMEI / serial", valor: imei || "\u2014", valorClassName: "font-mono text-xs" }),
          /* @__PURE__ */ jsx91(FilaDato, { etiqueta: "Grado", valor: grado ? /* @__PURE__ */ jsx91(GradoBadge, { grado }) : "Sin grado asignado" }),
          /* @__PURE__ */ jsx91(FilaDato, { etiqueta: "Bater\xEDa", valor: /* @__PURE__ */ jsx91(MedidorBateria, { porcentaje: bateria, ciclos, variante: "barra", compact: true }), className: "items-end" }),
          /* @__PURE__ */ jsx91(
            FilaDato,
            {
              etiqueta: "Checklist",
              valor: hayChecklist ? /* @__PURE__ */ jsxs74("span", { className: completo ? "text-pass-text" : "text-mute", children: [
                aprobados,
                " de ",
                total,
                " pass"
              ] }) : "Sin verificaci\xF3n f\xEDsica"
            }
          ),
          puntaje !== null && puntaje !== void 0 && puntaje !== "" && /* @__PURE__ */ jsx91(FilaDato, { etiqueta: "Puntaje", valor: /* @__PURE__ */ jsx91("span", { className: "tabular-nums", children: Number.isFinite(Number(puntaje)) ? `${Number(puntaje)}%` : puntaje }) }),
          condicion ? /* @__PURE__ */ jsx91(FilaDato, { etiqueta: "Condici\xF3n", valor: condicion }) : null
        ] }),
        locks.length ? /* @__PURE__ */ jsx91(ChipsLocks, { locks, conEstado: true }) : null,
        repuestosNoOem ? /* @__PURE__ */ jsxs74("div", { className: "rounded-xl border border-warn/25 bg-warn/5 p-3 text-sm", children: [
          /* @__PURE__ */ jsx91("p", { className: "text-[11px] font-bold uppercase tracking-wider text-mute", children: "Repuestos no OEM" }),
          /* @__PURE__ */ jsx91("p", { className: "mt-0.5 break-words", children: repuestosNoOem }),
          repuestosNoOemNota ? /* @__PURE__ */ jsx91("p", { className: "mt-0.5 text-xs text-mute", children: repuestosNoOemNota }) : null
        ] }) : null,
        /* @__PURE__ */ jsxs74("p", { className: "text-xs text-mute", children: [
          verificadoPor ? `Verificado por ${verificadoPor}` : "Verificaci\xF3n pendiente",
          verificadoAt ? ` \xB7 ${verificadoAt}` : ""
        ] })
      ] }),
      enlace ? /* @__PURE__ */ jsxs74("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx91(CodigoQr, { valor: enlace, ancho: 180, alt: "QR del informe del dispositivo" }),
        /* @__PURE__ */ jsx91("p", { className: "max-w-[12rem] break-all text-center text-[11px] text-mute", children: etiquetaQr })
      ] }) : null
    ] }),
    acciones ? /* @__PURE__ */ jsx91("footer", { className: "flex flex-wrap gap-2 border-t border-ink-600 p-4", children: acciones }) : null
  ] });
}

// src/components/VistaPreviaPapel.jsx
import { jsx as jsx92 } from "react/jsx-runtime";
var ANCHOS_PAPEL = {
  "thermal-80": "max-w-[302px]",
  "thermal-58": "max-w-[219px]",
  "thermal-55": "max-w-[208px]",
  thermal: "max-w-[219px]",
  a4: "max-w-[794px]"
};
function VistaPreviaPapel({ formato = "thermal-80", contenido, titulo: titulo2 = "Vista previa del documento", alto = "h-[60vh]", className, ...props }) {
  const ancho = ANCHOS_PAPEL[formato];
  return /* @__PURE__ */ jsx92(
    "iframe",
    {
      title: titulo2,
      srcDoc: contenido,
      className: cn("w-full rounded-xl border border-ink-600 bg-white", alto, ancho ? `mx-auto ${ancho}` : "", className),
      ...props
    }
  );
}

// src/components/Calendario.jsx
import { useMemo as useMemo13, useState as useState28 } from "react";

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

// src/components/Calendario.jsx
import { Fragment as Fragment12, jsx as jsx93, jsxs as jsxs75 } from "react/jsx-runtime";
var TONO_ITEM = { info: TONOS.chip.info, ok: TONOS.chip.ok, warn: TONOS.chip.warn, bad: TONOS.chip.bad };
function ItemCalendario({ item, contexto, onElegir }) {
  const tono = TONO_ITEM[item.tono] || TONOS.chip.mute;
  const titulo2 = [item.hora, item.titulo].filter(Boolean).join(" \xB7 ");
  const clases = cn(
    "flex w-full items-center gap-1.5 rounded-md border text-left transition hover:brightness-110",
    contexto.vista === "lista" ? "px-2.5 py-1.5 text-xs" : "px-1.5 py-0.5 text-[11px]",
    tono
  );
  const contenido = /* @__PURE__ */ jsxs75(Fragment12, { children: [
    item.hora && /* @__PURE__ */ jsx93("span", { className: "shrink-0 tabular-nums opacity-80", children: item.hora }),
    /* @__PURE__ */ jsxs75("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx93("span", { className: "block truncate font-medium", children: item.titulo }),
      contexto.vista === "lista" && item.detalle && /* @__PURE__ */ jsx93("span", { className: "block truncate opacity-80", children: item.detalle })
    ] })
  ] });
  const etiqueta = [titulo2, item.detalle].filter(Boolean).join(" \u2014 ");
  return item.href ? /* @__PURE__ */ jsx93("a", { href: item.href, title: etiqueta, className: clases, onClick: () => onElegir?.(item), children: contenido }) : /* @__PURE__ */ jsx93("button", { type: "button", title: etiqueta, className: clases, onClick: () => onElegir?.(item), children: contenido });
}
function ListaDias({ dias, porDia, hoy, onElegir, renderItem, soloConItems }) {
  const visibles = soloConItems ? dias.filter((dia) => (porDia.get(dia)?.length ?? 0) > 0 || dia === hoy) : dias;
  if (!visibles.length) return /* @__PURE__ */ jsx93(EmptyState, { compact: true, icon: "calendar", title: "Sin movimientos en el per\xEDodo" });
  return /* @__PURE__ */ jsx93("div", { className: "divide-y divide-ink-600/60", children: visibles.map((dia) => {
    const delDia = porDia.get(dia) || [];
    return /* @__PURE__ */ jsxs75("section", { className: "py-2", children: [
      /* @__PURE__ */ jsxs75("header", { className: "flex items-center justify-between gap-2 px-1", children: [
        /* @__PURE__ */ jsx93("span", { className: "text-xs font-semibold text-fore", children: etiquetaDia(dia) }),
        dia === hoy && /* @__PURE__ */ jsx93("span", { className: "rounded-full bg-fono/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fono-text", children: "Hoy" })
      ] }),
      /* @__PURE__ */ jsx93("div", { className: "mt-1 space-y-1", children: delDia.length === 0 ? /* @__PURE__ */ jsx93("p", { className: "px-1 text-xs text-mute", children: "Sin movimientos" }) : delDia.map(
        (item, indice) => renderItem ? /* @__PURE__ */ jsx93("div", { children: renderItem(item, { vista: "lista", dia }) }, item.id ?? indice) : /* @__PURE__ */ jsx93(ItemCalendario, { item, contexto: { vista: "lista", dia }, onElegir }, item.id ?? indice)
      ) })
    ] }, dia);
  }) });
}
function Calendario({
  items = [],
  vistas = ["mes"],
  vista,
  vistaPorDefecto = "mes",
  onCambiarVista,
  ancla,
  anclaPorDefecto,
  onCambiarPeriodo,
  diaSeleccionado,
  onSeleccionarDia,
  onElegirItem,
  renderItem,
  maxPorDia = 2,
  cargando = false,
  mostrarDetalle = true,
  soloConItemsEnLista = true,
  hoy,
  ariaLabel = "Calendario",
  className
}) {
  const claveHoy = useMemo13(() => hoyClave(hoy), [hoy]);
  const [vistaInterna, setVistaInterna] = useState28(vistaPorDefecto);
  const [anclaInterna, setAnclaInterna] = useState28(() => anclaPorDefecto || ancla || claveHoy);
  const [seleccionInterna, setSeleccionInterna] = useState28(null);
  const vistaActual = vistas.includes(vista) ? vista : vistas.includes(vistaInterna) ? vistaInterna : vistas[0] || "mes";
  const anclaActual = String(ancla || anclaInterna || claveHoy).slice(0, 10);
  const seleccion = diaSeleccionado !== void 0 ? diaSeleccionado : seleccionInterna;
  const rango = useMemo13(
    () => vistaActual === "semana" ? rangoSemana(anclaActual) : rangoMes(anclaActual),
    [vistaActual, anclaActual]
  );
  const porDia = useMemo13(() => agruparPorDia(items), [items]);
  const totalEnRango = useMemo13(
    () => rango.dias.reduce((suma, dia) => suma + (porDia.get(dia)?.length ?? 0), 0),
    [rango, porDia]
  );
  const delSeleccionado = seleccion ? porDia.get(seleccion) || [] : [];
  const periodo = vistaActual === "semana" ? `${etiquetaDiaCorta(rango.desde)} \u2013 ${etiquetaDiaCorta(rango.hasta)}` : etiquetaMes(anclaActual);
  function cambiarVista(siguiente) {
    if (vista === void 0) setVistaInterna(siguiente);
    onCambiarVista?.(siguiente);
    cambiarSeleccion(null);
  }
  function mover(delta) {
    const siguiente = vistaActual === "semana" ? sumarDias(anclaActual, delta * 7) : sumarMeses(anclaActual, delta);
    if (ancla === void 0) setAnclaInterna(siguiente);
    onCambiarPeriodo?.(siguiente, vistaActual === "semana" ? rangoSemana(siguiente) : rangoMes(siguiente));
    cambiarSeleccion(null);
  }
  function irHoy() {
    if (ancla === void 0) setAnclaInterna(claveHoy);
    onCambiarPeriodo?.(claveHoy, vistaActual === "semana" ? rangoSemana(claveHoy) : rangoMes(claveHoy));
    cambiarSeleccion(claveHoy);
  }
  function cambiarSeleccion(dia) {
    if (diaSeleccionado === void 0) setSeleccionInterna(dia);
    onSeleccionarDia?.(dia);
  }
  return /* @__PURE__ */ jsxs75("section", { className: cn("space-y-3", className), "aria-label": ariaLabel, children: [
    /* @__PURE__ */ jsxs75("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs75("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx93(
          "button",
          {
            type: "button",
            onClick: () => mover(-1),
            "aria-label": vistaActual === "semana" ? "Semana anterior" : "Mes anterior",
            title: vistaActual === "semana" ? "Semana anterior" : "Mes anterior",
            className: "toque-44 grid h-11 w-11 place-items-center rounded-lg border border-interactivo text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore",
            children: /* @__PURE__ */ jsx93(Icon, { name: "back", className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx93(Button, { type: "button", variant: "outline", onClick: irHoy, title: "Ir al d\xEDa de hoy", children: "Hoy" }),
        /* @__PURE__ */ jsx93(
          "button",
          {
            type: "button",
            onClick: () => mover(1),
            "aria-label": vistaActual === "semana" ? "Semana siguiente" : "Mes siguiente",
            title: vistaActual === "semana" ? "Semana siguiente" : "Mes siguiente",
            className: "toque-44 grid h-11 w-11 place-items-center rounded-lg border border-interactivo text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore",
            children: /* @__PURE__ */ jsx93(Icon, { name: "back", className: "h-4 w-4 rotate-180" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx93("p", { className: "order-last w-full text-sm font-semibold text-fore sm:order-none sm:w-auto", "aria-live": "polite", children: periodo }),
      vistas.length > 1 && /* @__PURE__ */ jsx93(
        SegmentedField,
        {
          value: vistaActual,
          onChange: cambiarVista,
          ariaLabel: "Vista del calendario",
          options: [
            ["mes", "Mes", "calendar"],
            ["semana", "Semana", "list"]
          ]
        }
      )
    ] }),
    cargando ? /* @__PURE__ */ jsxs75("div", { className: "grid grid-cols-7 gap-1 p-1", role: "status", "aria-live": "polite", "aria-busy": "true", children: [
      /* @__PURE__ */ jsx93("span", { className: "sr-only", children: "Cargando calendario\u2026" }),
      Array.from({ length: 35 }, (_, indice) => /* @__PURE__ */ jsx93(Skeleton, { className: "h-20" }, indice))
    ] }) : /* @__PURE__ */ jsxs75(Fragment12, { children: [
      /* @__PURE__ */ jsxs75("div", { className: "hidden overflow-hidden rounded-xl border border-ink-600 md:block", children: [
        /* @__PURE__ */ jsx93("div", { className: "grid grid-cols-7 border-b border-ink-600 bg-ink-900/60", children: DIAS_SEMANA.map((dia) => /* @__PURE__ */ jsx93("span", { className: "px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-mute", children: dia }, dia)) }),
        /* @__PURE__ */ jsx93("div", { className: "grid grid-cols-7", children: rango.dias.map((dia) => {
          const delDia = porDia.get(dia) || [];
          const ocultos = delDia.length - maxPorDia;
          const esHoy = dia === claveHoy;
          const esSeleccionado = dia === seleccion;
          return /* @__PURE__ */ jsxs75(
            "div",
            {
              "data-fuera": mismoMes(dia, anclaActual) ? void 0 : "true",
              "data-hoy": esHoy ? "true" : void 0,
              "data-seleccionado": esSeleccionado ? "true" : void 0,
              className: cn(
                "flex min-h-[6.5rem] flex-col gap-1 border-b border-r border-ink-600/60 p-1 last:border-r-0",
                !mismoMes(dia, anclaActual) && "bg-ink-800/40",
                esSeleccionado && "bg-fono/5"
              ),
              children: [
                /* @__PURE__ */ jsxs75(
                  "button",
                  {
                    type: "button",
                    onClick: () => cambiarSeleccion(esSeleccionado ? null : dia),
                    "aria-label": `Ver el detalle de ${etiquetaDia(dia)}`,
                    "aria-pressed": esSeleccionado,
                    title: etiquetaDia(dia),
                    className: cn(
                      "flex items-center justify-between rounded-md px-1 py-0.5 text-xs transition",
                      esHoy ? "bg-fono/15 font-bold text-fono-text" : "text-mute hover:bg-ink-700 hover:text-fore"
                    ),
                    children: [
                      /* @__PURE__ */ jsx93("span", { className: "tabular-nums", children: Number(dia.slice(8, 10)) }),
                      delDia.length > 0 && /* @__PURE__ */ jsx93("span", { className: "rounded-full bg-ink-600 px-1 text-[10px] font-semibold tabular-nums text-mute", title: `${delDia.length} movimientos`, children: delDia.length })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx93("div", { className: "space-y-0.5", children: delDia.slice(0, maxPorDia).map(
                  (item, indice) => renderItem ? /* @__PURE__ */ jsx93("div", { children: renderItem(item, { vista: "grilla", dia }) }, item.id ?? indice) : /* @__PURE__ */ jsx93(ItemCalendario, { item, contexto: { vista: "grilla", dia }, onElegir: onElegirItem }, item.id ?? indice)
                ) }),
                ocultos > 0 && /* @__PURE__ */ jsxs75(
                  "button",
                  {
                    type: "button",
                    onClick: () => cambiarSeleccion(dia),
                    title: `Ver ${delDia.length} movimientos`,
                    className: "rounded-md px-1 text-left text-[10px] font-semibold text-fono-light transition hover:bg-fono/10",
                    children: [
                      "+",
                      ocultos,
                      " m\xE1s"
                    ]
                  }
                )
              ]
            },
            dia
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx93("div", { className: "md:hidden", children: /* @__PURE__ */ jsx93(
        ListaDias,
        {
          dias: rango.dias,
          porDia,
          hoy: claveHoy,
          onElegir: onElegirItem,
          renderItem,
          soloConItems: soloConItemsEnLista
        }
      ) })
    ] }),
    !cargando && totalEnRango === 0 && /* @__PURE__ */ jsx93("div", { role: "status", children: /* @__PURE__ */ jsx93(EmptyState, { compact: true, icon: "calendar", title: "Sin movimientos en el per\xEDodo" }) }),
    mostrarDetalle && seleccion && /* @__PURE__ */ jsxs75("section", { className: "rounded-xl border border-ink-600 bg-ink-800 p-3", "aria-label": `Detalle de ${etiquetaDia(seleccion)}`, children: [
      /* @__PURE__ */ jsxs75("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx93("p", { className: "text-sm font-semibold text-fore", children: etiquetaDia(seleccion) }),
        /* @__PURE__ */ jsxs75("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs75("span", { className: "text-xs tabular-nums text-mute", children: [
            delSeleccionado.length,
            " ",
            delSeleccionado.length === 1 ? "movimiento" : "movimientos"
          ] }),
          /* @__PURE__ */ jsx93(Button, { type: "button", variant: "ghost", onClick: () => cambiarSeleccion(null), title: "Cerrar el detalle del d\xEDa", children: "Cerrar" })
        ] })
      ] }),
      delSeleccionado.length === 0 ? /* @__PURE__ */ jsx93(EmptyState, { compact: true, icon: "calendar", title: "Sin movimientos", description: "Eleg\xED otro d\xEDa o naveg\xE1 a otro per\xEDodo." }) : /* @__PURE__ */ jsx93("div", { className: "mt-2 space-y-1", children: delSeleccionado.map(
        (item, indice) => renderItem ? /* @__PURE__ */ jsx93("div", { children: renderItem(item, { vista: "lista", dia: seleccion }) }, item.id ?? indice) : /* @__PURE__ */ jsx93(ItemCalendario, { item, contexto: { vista: "lista", dia: seleccion }, onElegir: onElegirItem }, item.id ?? indice)
      ) })
    ] })
  ] });
}

// src/components/RangoFecha.jsx
import { useEffect as useEffect19, useId as useId19, useRef as useRef17, useState as useState29 } from "react";

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

// src/components/RangoFecha.jsx
import { jsx as jsx94, jsxs as jsxs76 } from "react/jsx-runtime";
function RangoFecha(props) {
  const {
    desde,
    hasta,
    onCambio,
    desdePorDefecto,
    hastaPorDefecto,
    periodoPorDefecto = "este-mes",
    atajos = PERIODOS_FECHA,
    hoy,
    ariaLabel = "Filtro por rango de fechas",
    mostrarCampos = true,
    className
  } = props;
  const desdeControlado = Object.prototype.hasOwnProperty.call(props, "desde");
  const hastaControlado = Object.prototype.hasOwnProperty.call(props, "hasta");
  const [interno, setInterno] = useState29(() => {
    if (desdePorDefecto !== void 0 || hastaPorDefecto !== void 0) {
      return { desde: desdePorDefecto || "", hasta: hastaPorDefecto || "" };
    }
    return rangoDePeriodo(periodoPorDefecto, { hoy }) || { desde: "", hasta: "" };
  });
  const idDesde = useId19();
  const idHasta = useId19();
  const errorId = useId19();
  const refDesde = useRef17(null);
  useEffect19(() => {
    if (desdeControlado === hastaControlado) return;
    if (typeof process === "undefined" || process.env.NODE_ENV !== "production") {
      console.warn("RangoFecha: control\xE1 `desde` y `hasta` juntos cuando sea posible. El campo omitido permanece no controlado por compatibilidad.");
    }
  }, [desdeControlado, hastaControlado]);
  const actual = {
    desde: desdeControlado ? desde ?? "" : interno.desde,
    hasta: hastaControlado ? hasta ?? "" : interno.hasta
  };
  const activo = periodoDeRango(actual.desde, actual.hasta, { hoy });
  const invertido = rangoInvertido(actual.desde, actual.hasta);
  function aplicar(siguienteDesde, siguienteHasta) {
    const par = { desde: siguienteDesde ?? "", hasta: siguienteHasta ?? "" };
    if (!desdeControlado || !hastaControlado) {
      setInterno((anterior) => ({
        desde: desdeControlado ? anterior.desde : par.desde,
        hasta: hastaControlado ? anterior.hasta : par.hasta
      }));
    }
    onCambio?.(par.desde, par.hasta);
  }
  return /* @__PURE__ */ jsxs76("div", { className: cn("space-y-2", className), children: [
    /* @__PURE__ */ jsx94("div", { className: "flex flex-wrap items-center gap-1.5", role: "group", "aria-label": ariaLabel, children: atajos.map((periodo) => {
      const esActivo = activo === periodo;
      return /* @__PURE__ */ jsx94(
        "button",
        {
          type: "button",
          "aria-pressed": esActivo,
          onClick: () => {
            const rango = rangoDePeriodo(periodo, { hoy });
            if (rango) aplicar(rango.desde, rango.hasta);
            else refDesde.current?.focus();
          },
          className: cn(
            "min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
            esActivo ? "border-fono/30 bg-fono/15 text-fono-text" : "border-ink-600 text-mute hover:border-fono/40 hover:text-fore"
          ),
          children: ETIQUETA_PERIODO[periodo] || periodo
        },
        periodo
      );
    }) }),
    mostrarCampos && /* @__PURE__ */ jsxs76("div", { className: "flex flex-wrap items-end gap-2", children: [
      /* @__PURE__ */ jsxs76("div", { children: [
        /* @__PURE__ */ jsx94(Label, { htmlFor: idDesde, children: "Desde" }),
        /* @__PURE__ */ jsx94(
          Input,
          {
            id: idDesde,
            ref: refDesde,
            type: "date",
            value: actual.desde,
            max: actual.hasta || void 0,
            "aria-invalid": invertido || void 0,
            "aria-describedby": invertido ? errorId : void 0,
            onChange: (event) => aplicar(event.target.value, actual.hasta),
            className: "w-40 max-w-full tabular-nums"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs76("div", { children: [
        /* @__PURE__ */ jsx94(Label, { htmlFor: idHasta, children: "Hasta" }),
        /* @__PURE__ */ jsx94(
          Input,
          {
            id: idHasta,
            type: "date",
            value: actual.hasta,
            min: actual.desde || void 0,
            "aria-invalid": invertido || void 0,
            "aria-describedby": invertido ? errorId : void 0,
            onChange: (event) => aplicar(actual.desde, event.target.value),
            className: "w-40 max-w-full tabular-nums"
          }
        )
      ] })
    ] }),
    invertido && /* @__PURE__ */ jsx94(Aviso, { id: errorId, tono: "warn", compact: true, children: "El rango est\xE1 invertido: \xABdesde\xBB es posterior a \xABhasta\xBB." })
  ] });
}

// src/components/PaletaComandos.jsx
import { useEffect as useEffect20, useId as useId20, useMemo as useMemo14, useRef as useRef18, useState as useState30 } from "react";
import { Fragment as Fragment13, jsx as jsx95, jsxs as jsxs77 } from "react/jsx-runtime";
var CAPITALIZAR = (texto) => texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
function agruparResultados(resultados = [], { etiquetasTipo = {}, iconosTipo = {} } = {}) {
  const grupos = [];
  const porTipo = /* @__PURE__ */ new Map();
  for (const resultado of resultados) {
    const tipo = resultado?.tipo || "otros";
    let grupo = porTipo.get(tipo);
    if (!grupo) {
      grupo = {
        tipo,
        etiqueta: etiquetasTipo[tipo] || CAPITALIZAR(tipo),
        icono: iconosTipo[tipo] || "search",
        items: []
      };
      porTipo.set(tipo, grupo);
      grupos.push(grupo);
    }
    grupo.items.push(resultado);
  }
  return grupos;
}
function estadoPaleta({ listo = false, cargando = false, error = "", total = 0 } = {}) {
  if (!listo) return "seguir";
  if (error) return "error";
  if (total > 0) return "listo";
  if (cargando) return "cargando";
  return "vacio";
}
function PaletaComandos({
  abierta,
  onAbrir,
  onCerrar,
  buscar,
  onElegir,
  etiquetasTipo,
  iconosTipo,
  titulo: titulo2 = "Buscar",
  placeholder = "Buscar\u2026",
  ariaLabel,
  atajo = "k",
  atajoTexto = "\u2318K",
  conAtajo = true,
  minimo = 2,
  espera = 220,
  mensajeError = "No pudimos buscar. Reintent\xE1.",
  textoSeguir,
  textoSinResultados = "Sin resultados",
  descripcionVacio,
  boton = false,
  textoBoton = "Buscar",
  mostrarAtajoEnBoton = true,
  className
}) {
  const [interna, setInterna] = useState30(false);
  const [consulta, setConsulta] = useState30("");
  const [resultados, setResultados] = useState30(null);
  const [cargando, setCargando] = useState30(false);
  const [error, setError] = useState30("");
  const [activo, setActivo] = useState30(0);
  const [intento, setIntento] = useState30(0);
  const raiz = useRef18(null);
  const entrada3 = useRef18(null);
  const buscarRef = useRef18(buscar);
  buscarRef.current = buscar;
  const onAbrirRef = useRef18(onAbrir);
  onAbrirRef.current = onAbrir;
  const idLista = useId20();
  const controlada = abierta !== void 0;
  const visible = controlada ? Boolean(abierta) : interna;
  function abrir() {
    if (!controlada) setInterna(true);
    onAbrir?.();
  }
  function cerrar() {
    if (!controlada) setInterna(false);
    onCerrar?.();
  }
  const { esSuperior, requestClose } = useDialogFocusTrap(visible, cerrar, raiz, {
    initialFocus: () => entrada3.current
  });
  useEffect20(() => {
    if (!conAtajo) return void 0;
    const onKeyDown2 = (event) => {
      if (event.defaultPrevented || event.altKey || event.shiftKey) return;
      if (!(event.metaKey || event.ctrlKey)) return;
      if (String(event.key).toLowerCase() !== String(atajo).toLowerCase()) return;
      event.preventDefault();
      if (!controlada) setInterna(true);
      onAbrirRef.current?.();
    };
    document.addEventListener("keydown", onKeyDown2);
    return () => document.removeEventListener("keydown", onKeyDown2);
  }, [conAtajo, atajo, controlada]);
  useEffect20(() => {
    if (!visible) return void 0;
    setConsulta("");
    setResultados(null);
    setError("");
    setCargando(false);
    setActivo(0);
    setIntento(0);
    return void 0;
  }, [visible]);
  useEffect20(() => {
    if (!visible) return void 0;
    const termino2 = consulta.trim();
    if (termino2.length < minimo) {
      setResultados(null);
      setCargando(false);
      setError("");
      return void 0;
    }
    let vigente = true;
    setCargando(true);
    setError("");
    const timer = setTimeout(async () => {
      try {
        const siguiente = await buscarRef.current?.(termino2);
        if (!vigente) return;
        setResultados(Array.isArray(siguiente) ? siguiente : []);
        setCargando(false);
      } catch {
        if (!vigente) return;
        setError(mensajeError);
        setCargando(false);
      }
    }, Math.max(0, Number(espera) || 0));
    return () => {
      vigente = false;
      clearTimeout(timer);
    };
  }, [visible, consulta, intento, minimo, espera, mensajeError]);
  const termino = consulta.trim();
  const listo = termino.length >= minimo;
  const grupos = useMemo14(
    () => agruparResultados(resultados || [], { etiquetasTipo, iconosTipo }),
    [resultados, etiquetasTipo, iconosTipo]
  );
  const planos = useMemo14(() => grupos.flatMap((grupo) => grupo.items), [grupos]);
  const estado = estadoPaleta({ listo, cargando, error, total: planos.length });
  const indice = useMemo14(() => new Map(planos.map((item, posicion) => [item, posicion])), [planos]);
  useEffect20(() => {
    setActivo(0);
  }, [resultados]);
  useEffect20(() => {
    if (!visible) return;
    raiz.current?.querySelector(`[data-paleta-index="${activo}"]`)?.scrollIntoView?.({ block: "nearest" });
  }, [activo, visible, planos.length]);
  function mover(delta) {
    if (!planos.length) return;
    setActivo((actual) => {
      const siguiente = actual + delta;
      if (siguiente < 0) return planos.length - 1;
      if (siguiente >= planos.length) return 0;
      return siguiente;
    });
  }
  function elegir(resultado) {
    if (!resultado) return;
    cerrar();
    onElegir?.(resultado);
  }
  function onKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      mover(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      mover(-1);
    } else if (event.key === "Enter") {
      const elegido = planos[activo];
      if (elegido) {
        event.preventDefault();
        elegir(elegido);
      }
    }
  }
  const textoContinuar = textoSeguir || `Segu\xED escribiendo: buscamos desde ${minimo} caracteres.`;
  const idOpcion = (posicion) => `${idLista}-opcion-${posicion}`;
  return /* @__PURE__ */ jsxs77(Fragment13, { children: [
    boton && /* @__PURE__ */ jsxs77(
      "button",
      {
        type: "button",
        onClick: abrir,
        "aria-label": `${titulo2} \xB7 ${atajoTexto}`,
        "aria-haspopup": "dialog",
        title: `${titulo2} \xB7 ${atajoTexto}`,
        className: "toque-44 inline-flex min-h-11 items-center gap-2 rounded-lg border border-interactivo px-3 text-sm text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore",
        children: [
          /* @__PURE__ */ jsx95(Icon, { name: "search", className: "h-4 w-4" }),
          /* @__PURE__ */ jsx95("span", { className: "hidden sm:inline", children: textoBoton }),
          mostrarAtajoEnBoton && /* @__PURE__ */ jsx95("kbd", { className: "rounded border border-ink-600 bg-ink-700 px-1.5 py-0.5 text-[10px] font-semibold text-mute", "aria-hidden": "true", children: atajoTexto })
        ]
      }
    ),
    visible && /* @__PURE__ */ jsx95(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-3 sm:p-6",
        onMouseDown: (event) => event.target === event.currentTarget && requestClose(),
        onKeyDown,
        children: /* @__PURE__ */ jsxs77(
          "div",
          {
            ref: raiz,
            role: "dialog",
            "aria-modal": esSuperior ? "true" : void 0,
            "aria-label": titulo2,
            tabIndex: -1,
            className: cn("mt-[8vh] w-full max-w-xl overflow-hidden rounded-2xl border border-ink-600 bg-ink shadow-float", className),
            children: [
              /* @__PURE__ */ jsx95("div", { className: "border-b border-ink-600 p-3", children: /* @__PURE__ */ jsx95(
                SearchField_default,
                {
                  ref: entrada3,
                  value: consulta,
                  onChange: (event) => setConsulta(event.target.value),
                  placeholder,
                  ariaLabel: ariaLabel || placeholder,
                  "aria-controls": idLista,
                  "aria-expanded": estado === "listo",
                  "aria-activedescendant": estado === "listo" ? idOpcion(activo) : void 0,
                  role: "combobox",
                  "aria-autocomplete": "list",
                  autoComplete: "off"
                }
              ) }),
              /* @__PURE__ */ jsxs77("div", { id: idLista, className: "max-h-[50vh] min-h-[9rem] overflow-y-auto p-2", children: [
                estado === "seguir" && /* @__PURE__ */ jsx95("p", { role: "status", className: "px-2 py-6 text-center text-sm text-mute", children: textoContinuar }),
                estado === "error" && /* @__PURE__ */ jsxs77("div", { className: "space-y-2 p-2", children: [
                  /* @__PURE__ */ jsx95(Aviso, { tono: "error", compact: true, children: error }),
                  /* @__PURE__ */ jsx95(Button, { type: "button", variant: "outline", onClick: () => setIntento((actual) => actual + 1), children: "Reintentar" })
                ] }),
                estado === "cargando" && /* @__PURE__ */ jsxs77("div", { className: "space-y-2 p-2", role: "status", "aria-live": "polite", "aria-busy": "true", children: [
                  /* @__PURE__ */ jsx95("span", { className: "sr-only", children: "Buscando\u2026" }),
                  /* @__PURE__ */ jsx95(Skeleton, { className: "h-4 w-1/3" }),
                  /* @__PURE__ */ jsx95(Skeleton, { className: "h-9 w-full" }),
                  /* @__PURE__ */ jsx95(Skeleton, { className: "h-9 w-full" })
                ] }),
                estado === "vacio" && /* @__PURE__ */ jsx95("div", { role: "status", children: /* @__PURE__ */ jsx95(
                  EmptyState,
                  {
                    compact: true,
                    icon: "search",
                    title: textoSinResultados,
                    description: descripcionVacio || `No encontramos nada para \xAB${termino}\xBB. Prob\xE1 con otro nombre o n\xFAmero.`
                  }
                ) }),
                estado === "listo" && /* @__PURE__ */ jsxs77(Fragment13, { children: [
                  /* @__PURE__ */ jsxs77("span", { className: "sr-only", role: "status", "aria-live": "polite", children: [
                    planos.length,
                    " resultado",
                    planos.length === 1 ? "" : "s"
                  ] }),
                  /* @__PURE__ */ jsx95("div", { role: "listbox", "aria-label": "Resultados de la b\xFAsqueda", children: grupos.map((grupo) => /* @__PURE__ */ jsxs77("section", { role: "group", "aria-label": grupo.etiqueta, children: [
                    /* @__PURE__ */ jsx95("p", { className: "px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-mute", children: grupo.etiqueta }),
                    grupo.items.map((item) => {
                      const posicion = indice.get(item) ?? 0;
                      const esActivo = posicion === activo;
                      return /* @__PURE__ */ jsxs77(
                        "button",
                        {
                          id: idOpcion(posicion),
                          type: "button",
                          role: "option",
                          "aria-selected": esActivo,
                          "data-paleta-index": posicion,
                          "data-activo": esActivo ? "true" : void 0,
                          onMouseEnter: () => setActivo(posicion),
                          onClick: () => elegir(item),
                          className: cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
                            esActivo ? "bg-fono/10 text-fore" : "text-mute hover:bg-ink-700/60 hover:text-fore"
                          ),
                          children: [
                            /* @__PURE__ */ jsx95(Icon, { name: item.icono || grupo.icono, className: "h-4 w-4 shrink-0" }),
                            /* @__PURE__ */ jsxs77("span", { className: "min-w-0 flex-1", children: [
                              /* @__PURE__ */ jsx95("span", { className: "block truncate font-medium text-fore", children: item.titulo }),
                              item.detalle && /* @__PURE__ */ jsx95("span", { className: "block truncate text-xs text-mute", children: item.detalle })
                            ] }),
                            /* @__PURE__ */ jsx95(Icon, { name: "back", className: "h-3.5 w-3.5 shrink-0 rotate-180 text-mute" })
                          ]
                        },
                        item.id ?? `${grupo.tipo}-${posicion}`
                      );
                    })
                  ] }, grupo.tipo)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs77("p", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-600 px-3 py-2 text-[11px] text-mute", children: [
                /* @__PURE__ */ jsxs77("span", { children: [
                  /* @__PURE__ */ jsx95("kbd", { className: "rounded border border-ink-600 bg-ink-700 px-1", children: "\u2191" }),
                  " ",
                  /* @__PURE__ */ jsx95("kbd", { className: "rounded border border-ink-600 bg-ink-700 px-1", children: "\u2193" }),
                  " moverse"
                ] }),
                /* @__PURE__ */ jsxs77("span", { children: [
                  /* @__PURE__ */ jsx95("kbd", { className: "rounded border border-ink-600 bg-ink-700 px-1", children: "Enter" }),
                  " abrir"
                ] }),
                /* @__PURE__ */ jsxs77("span", { children: [
                  /* @__PURE__ */ jsx95("kbd", { className: "rounded border border-ink-600 bg-ink-700 px-1", children: "Esc" }),
                  " cerrar"
                ] })
              ] })
            ]
          }
        )
      }
    )
  ] });
}

// src/components/AyudaModulo.jsx
import { useState as useState31 } from "react";
import { jsx as jsx96, jsxs as jsxs78 } from "react/jsx-runtime";
function AyudaModulo({
  titulo: titulo2,
  resumen,
  puntos = [],
  enlaces = [],
  etiquetaBoton = "\xBFQu\xE9 es esto?",
  tituloDialogo,
  abierta,
  onAbrir,
  onCerrar,
  className
}) {
  const [interna, setInterna] = useState31(false);
  if (!titulo2 && !resumen) return null;
  const controlada = abierta !== void 0;
  const visible = controlada ? Boolean(abierta) : interna;
  const abrir = () => {
    if (!controlada) setInterna(true);
    onAbrir?.();
  };
  const cerrar = () => {
    if (!controlada) setInterna(false);
    onCerrar?.();
  };
  const encabezado = tituloDialogo || `${etiquetaBoton} \xB7 ${titulo2 || "Ayuda"}`;
  return /* @__PURE__ */ jsxs78("div", { className: cn("inline-flex", className), children: [
    /* @__PURE__ */ jsx96(
      "button",
      {
        type: "button",
        onClick: abrir,
        "aria-label": encabezado,
        "aria-haspopup": "dialog",
        title: encabezado,
        className: "grid h-9 w-9 place-items-center rounded-lg border border-ink-500 text-sm font-bold text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore",
        children: /* @__PURE__ */ jsx96("span", { "aria-hidden": "true", children: "?" })
      }
    ),
    /* @__PURE__ */ jsx96(Modal, { open: visible, onClose: cerrar, title: encabezado, size: "formulario", children: /* @__PURE__ */ jsxs78("div", { className: "space-y-4", children: [
      resumen && /* @__PURE__ */ jsx96("p", { className: "text-sm leading-6 text-mute", children: resumen }),
      puntos.length > 0 && /* @__PURE__ */ jsx96("ul", { className: "space-y-2", children: puntos.map((punto) => /* @__PURE__ */ jsxs78("li", { className: "flex items-start gap-2 text-sm leading-5 text-fore", children: [
        /* @__PURE__ */ jsx96(Icon, { name: "check", className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-ok-text" }),
        /* @__PURE__ */ jsx96("span", { className: "min-w-0", children: punto })
      ] }, punto)) }),
      enlaces.length > 0 && /* @__PURE__ */ jsx96("nav", { "aria-label": `Ir a otro m\xF3dulo desde ${titulo2 || "la ayuda"}`, className: "grid gap-1.5 border-t border-ink-600 pt-3", children: enlaces.map((enlace) => /* @__PURE__ */ jsxs78(
        "a",
        {
          href: enlace.href,
          onClick: (event) => {
            enlace.onClick?.(event);
            cerrar();
          },
          className: "flex items-center justify-between gap-2 rounded-lg border border-ink-600 px-3 py-2 text-sm font-medium text-fore transition hover:border-fono hover:bg-fono/10",
          children: [
            /* @__PURE__ */ jsx96("span", { className: "min-w-0 truncate", children: enlace.etiqueta }),
            /* @__PURE__ */ jsx96(Icon, { name: "external", className: "h-3.5 w-3.5 shrink-0 text-mute" })
          ]
        },
        enlace.href || enlace.etiqueta
      )) }),
      /* @__PURE__ */ jsx96("div", { className: "flex justify-end border-t border-ink-600 pt-3", children: /* @__PURE__ */ jsx96(Button, { type: "button", variant: "outline", onClick: cerrar, children: "Cerrar" }) })
    ] }) })
  ] });
}

// src/components/BarraInferior.jsx
import { Fragment as Fragment14, jsx as jsx97, jsxs as jsxs79 } from "react/jsx-runtime";
var ESPACIO_BARRA_INFERIOR = "pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0";
function BarraInferior({
  items = [],
  activo,
  onSelect,
  onMas,
  masEtiqueta = "M\xE1s",
  masIcono = "menu",
  menuAbierto = false,
  menuId,
  maxItems = 4,
  ariaLabel = "Navegaci\xF3n inferior",
  className
}) {
  const visibles = items.slice(0, maxItems);
  if (!visibles.length && !onMas) return null;
  const claseItem = (esActivo) => cn(
    "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-semibold transition",
    esActivo ? "text-fono-light" : "text-mute hover:text-fore"
  );
  return /* @__PURE__ */ jsxs79(
    "nav",
    {
      "aria-label": ariaLabel,
      className: cn(
        "fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-600 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden",
        className
      ),
      children: [
        visibles.map((item) => {
          const esActivo = item.id === activo;
          const contenido = /* @__PURE__ */ jsxs79(Fragment14, { children: [
            /* @__PURE__ */ jsxs79("span", { className: "relative", children: [
              item.icono && /* @__PURE__ */ jsx97(Icon, { name: item.icono, className: "h-[18px] w-[18px]" }),
              item.contador != null && item.contador !== 0 && /* @__PURE__ */ jsx97("span", { className: "absolute -right-2 -top-1.5 rounded-full bg-fono px-1 text-[9px] font-bold tabular-nums text-onbrand", children: item.contador })
            ] }),
            /* @__PURE__ */ jsx97("span", { className: "max-w-full truncate", children: item.etiqueta })
          ] });
          const titulo2 = item.title || item.etiqueta;
          const clase = cn(claseItem(esActivo), "h-14");
          return item.href ? /* @__PURE__ */ jsx97(
            "a",
            {
              href: item.href,
              onClick: item.onClick,
              "aria-current": esActivo ? "page" : void 0,
              "aria-label": item.ariaLabel || item.etiqueta,
              title: titulo2,
              className: clase,
              children: contenido
            },
            item.id ?? item.href
          ) : /* @__PURE__ */ jsx97(
            "button",
            {
              type: "button",
              onClick: () => {
                onSelect?.(item.id);
                item.onClick?.();
              },
              "aria-current": esActivo ? "page" : void 0,
              "aria-label": item.ariaLabel || item.etiqueta,
              title: titulo2,
              className: clase,
              children: contenido
            },
            item.id ?? item.etiqueta
          );
        }),
        onMas && /* @__PURE__ */ jsxs79(
          "button",
          {
            type: "button",
            onClick: onMas,
            "aria-label": masEtiqueta,
            "aria-controls": menuId,
            "aria-expanded": menuAbierto,
            title: masEtiqueta,
            className: cn(claseItem(menuAbierto), "h-14"),
            children: [
              /* @__PURE__ */ jsx97(Icon, { name: masIcono, className: "h-[18px] w-[18px]" }),
              /* @__PURE__ */ jsx97("span", { className: "max-w-full truncate", children: masEtiqueta })
            ]
          }
        )
      ]
    }
  );
}

// src/components/PersonaChip.jsx
import { useEffect as useEffect21, useState as useState32 } from "react";

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

// src/components/PersonaChip.jsx
import { jsx as jsx98, jsxs as jsxs80 } from "react/jsx-runtime";
function PersonaChip({
  user,
  foto,
  picture,
  size = "md",
  nombre = true,
  nombreCorto = false,
  estado,
  title,
  className,
  textoClassName,
  avatarClassName,
  children
}) {
  const fuente = typeof user === "string" ? { name: user } : user || {};
  const identidad = identidadDeUsuario(fuente);
  const visible = nombreCorto ? identidad.primerNombre : identidad.nombre;
  const presencia = ESTADOS_PRESENCIA[estado] || null;
  const local = foto ?? (identidad.hasAvatar === false ? "" : identidad.fotoLocal);
  const google = picture ?? identidad.picture;
  const [localRota, setLocalRota] = useState32(false);
  useEffect21(() => {
    setLocalRota(false);
  }, [local]);
  const src = !localRota && local ? local : google;
  const etiqueta = title || [identidad.nombre, presencia?.etiqueta, identidad.scope].filter(Boolean).join(" \xB7 ");
  return /* @__PURE__ */ jsxs80("span", { "data-testid": "persona-chip", className: cn("inline-flex min-w-0 items-center gap-2", className), title: etiqueta, children: [
    /* @__PURE__ */ jsxs80("span", { className: "relative inline-flex shrink-0", children: [
      /* @__PURE__ */ jsx98(
        Avatar,
        {
          nombre: identidad.nombre,
          src,
          tamano: size,
          onError: () => setLocalRota(true),
          className: avatarClassName,
          decorativo: !nombre && !children,
          title: etiqueta
        }
      ),
      presencia ? /* @__PURE__ */ jsx98("i", { "aria-hidden": true, className: cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-1 ring-paper", presencia.punto) }) : null
    ] }),
    nombre ? /* @__PURE__ */ jsx98("span", { className: cn("min-w-0", CELDA_IDENTIDAD_GRANDE, textoClassName), children: visible }) : null,
    children ? /* @__PURE__ */ jsx98("span", { className: CELDA_DATO, children }) : null
  ] });
}

// src/components/PilaPersonas.jsx
import { Fragment as Fragment15, jsx as jsx99, jsxs as jsxs81 } from "react/jsx-runtime";
function PilaPersonas({
  personas = [],
  max = 4,
  size = "md",
  onMas,
  resumen = true,
  ariaLabel = "Personas en l\xEDnea",
  title,
  className
}) {
  const lista = Array.isArray(personas) ? personas : [];
  if (!lista.length) return null;
  const visibles = lista.slice(0, Math.max(0, max));
  const restantes = lista.length - visibles.length;
  const texto = title || resumenPresencia(lista);
  const contenido = /* @__PURE__ */ jsxs81(Fragment15, { children: [
    /* @__PURE__ */ jsxs81("span", { className: "flex -space-x-2", children: [
      visibles.map((persona, indice) => {
        const fuente = typeof persona === "string" ? { name: persona } : persona || {};
        const identidad = identidadDeUsuario(fuente);
        return /* @__PURE__ */ jsx99(
          PersonaChip,
          {
            user: fuente,
            foto: fuente.foto,
            picture: fuente.picture,
            size,
            nombre: false,
            estado: fuente.estado ?? (fuente.active ? "en-linea" : void 0),
            title: `${identidad.nombre}${identidad.scope ? ` \xB7 ${identidad.scope}` : ""}`,
            avatarClassName: "border-paper"
          },
          fuente.id ?? `${identidad.nombre}-${indice}`
        );
      }),
      restantes > 0 && /* @__PURE__ */ jsxs81(
        "span",
        {
          className: cn(
            "grid place-items-center rounded-full border border-paper bg-ink-700 font-bold text-mute",
            size === "sm" ? "h-6 w-6 text-[10px]" : size === "lg" ? "h-14 w-14 text-sm" : size === "xs" ? "h-5 w-5 text-[9px]" : size === "xl" ? "h-20 w-20 text-lg" : "h-9 w-9 text-xs"
          ),
          "aria-hidden": onMas ? void 0 : "true",
          children: [
            "+",
            restantes
          ]
        }
      )
    ] }),
    resumen && texto ? /* @__PURE__ */ jsx99("span", { className: "whitespace-nowrap text-xs font-semibold text-mute", children: texto }) : null
  ] });
  const clases = "flex items-center gap-2 rounded-full border border-fore/10 bg-ink-700/60 px-2.5 py-1";
  return onMas ? /* @__PURE__ */ jsx99("button", { type: "button", onClick: onMas, className: cn(clases, className), "aria-label": texto || ariaLabel, title: texto, children: contenido }) : /* @__PURE__ */ jsx99("div", { role: "group", "aria-label": texto || ariaLabel, title: texto, className: cn(clases, className), children: contenido });
}

// src/components/ImporteDelta.jsx
import { jsx as jsx100 } from "react/jsx-runtime";
function tonoDelta(valor, { invertir = false } = {}) {
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero === 0) return "mute";
  const positivo = numero > 0;
  const bueno = invertir ? !positivo : positivo;
  return bueno ? "ok" : "bad";
}
var TONO_TEXTO = { ok: "text-ok-text", bad: "text-bad-text", mute: "text-mute" };
function ImporteDelta({
  valor,
  moneda = "PYG",
  formato = "moneda",
  invertir = false,
  vacio = "\u2014",
  simbolo,
  className
}) {
  const numero = Number(valor);
  const ausente = valor === null || valor === void 0 || valor === "" || !Number.isFinite(numero);
  if (ausente) return /* @__PURE__ */ jsx100("span", { className: cn("tabular-nums text-mute", className), children: vacio });
  const texto = formato === "porcentaje" ? `${signoDe(numero) ? `${signoDe(numero)} ` : ""}${formatPercent(Math.abs(numero))} %` : montoConSigno(numero, moneda, vacio, { simbolo });
  return /* @__PURE__ */ jsx100(
    "span",
    {
      className: cn(
        "inline-flex items-center justify-end whitespace-nowrap font-semibold tabular-nums",
        TONO_TEXTO[tonoDelta(numero, { invertir })],
        className
      ),
      children: texto
    }
  );
}

// src/components/IndicadorConexion.jsx
import { jsx as jsx101, jsxs as jsxs82 } from "react/jsx-runtime";
function IndicadorConexion({
  enLinea = true,
  pendientes = 0,
  sincronizando = false,
  onSincronizar,
  variante = "chip",
  mensaje,
  etiquetaEnLinea = "En l\xEDnea",
  etiquetaSinConexion = "Sin conexi\xF3n",
  etiquetaSincronizando = "Sincronizando\u2026",
  className
}) {
  const cuenta = Number.isFinite(Number(pendientes)) && Number(pendientes) > 0 ? Math.trunc(Number(pendientes)) : 0;
  const texto = sincronizando ? etiquetaSincronizando : enLinea ? etiquetaEnLinea : etiquetaSinConexion;
  const detalle = cuenta > 0 ? `${formatoNumero(cuenta)} ${cuenta === 1 ? "pendiente" : "pendientes"} de subir` : "";
  const titulo2 = [texto, detalle].filter(Boolean).join(" \xB7 ");
  const boton = onSincronizar && cuenta > 0 && /* @__PURE__ */ jsxs82(
    "button",
    {
      type: "button",
      onClick: onSincronizar,
      disabled: sincronizando,
      "aria-label": sincronizando ? etiquetaSincronizando : `Sincronizar ${formatoNumero(cuenta)} pendientes`,
      title: sincronizando ? etiquetaSincronizando : "Sincronizar ahora",
      className: cn(
        "inline-flex h-6 items-center gap-1 rounded-md border px-1.5 font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variante === "banner" ? "border-current/40 hover:bg-fore/10" : "border-ink-500 text-mute hover:border-fono hover:text-fore"
      ),
      children: [
        /* @__PURE__ */ jsx101(Icon, { name: "refresh", className: cn("h-3.5 w-3.5", sincronizando && "animate-spin") }),
        "Sincronizar"
      ]
    }
  );
  if (variante === "banner") {
    return /* @__PURE__ */ jsxs82(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        title: titulo2,
        className: cn(
          "flex flex-wrap items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium",
          enLinea ? "bg-ink-800 text-mute" : "bg-bad text-white dark:text-onbrand",
          className
        ),
        children: [
          /* @__PURE__ */ jsx101(Icon, { name: enLinea ? "refresh" : "alert", className: "h-4 w-4 shrink-0", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs82("span", { children: [
            mensaje || texto,
            !mensaje && detalle ? ` \xB7 ${detalle}` : ""
          ] }),
          !enLinea && !mensaje && /* @__PURE__ */ jsx101("span", { className: "hidden sm:inline", children: "Se sincroniza al reconectar." }),
          boton
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs82(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      title: titulo2,
      className: cn(
        "inline-flex min-w-0 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-xs",
        enLinea ? "text-mute" : "text-warn-text",
        className
      ),
      children: [
        /* @__PURE__ */ jsx101(Dot, { color: enLinea ? "green" : "orange", pulse: sincronizando || !enLinea }),
        /* @__PURE__ */ jsxs82("span", { className: "min-w-0 truncate font-medium", children: [
          texto,
          detalle && /* @__PURE__ */ jsxs82("span", { className: "text-mute", children: [
            " \xB7 ",
            detalle
          ] })
        ] }),
        boton
      ]
    }
  );
}

// src/components/CampanaAvisos.jsx
import { useEffect as useEffect22, useId as useId21, useRef as useRef19, useState as useState33 } from "react";
import { Fragment as Fragment16, jsx as jsx102, jsxs as jsxs83 } from "react/jsx-runtime";
function contarSinLeer(avisos = []) {
  const conEstado = avisos.filter((aviso) => aviso && typeof aviso.leido === "boolean");
  if (conEstado.length) return conEstado.filter((aviso) => !aviso.leido).length;
  return avisos.length;
}
function textoContador(total) {
  const cuenta = Number(total) || 0;
  return cuenta > 99 ? "99+" : String(cuenta);
}
function CampanaAvisos({
  avisos = [],
  onAbrir,
  onElegir,
  titulo: titulo2 = "Avisos",
  ariaLabel = "Avisos",
  anclaje = "right",
  vacioTitulo = "Sin avisos",
  vacioDetalle = "No hay novedades para mostrar.",
  vacioAccion,
  pie,
  className
}) {
  const [abierto, setAbierto] = useState33(false);
  const raiz = useRef19(null);
  const disparador = useRef19(null);
  const panel = useRef19(null);
  const tituloId = useId21();
  const sinLeer = contarSinLeer(avisos);
  function cerrar({ devolverFoco = false } = {}) {
    setAbierto(false);
    if (devolverFoco) requestAnimationFrame(() => disparador.current?.focus());
  }
  useEffect22(() => {
    if (!abierto) return void 0;
    const cerrarFuera = (event) => {
      if (event.target instanceof Node && raiz.current?.contains(event.target)) return;
      cerrar();
    };
    const cerrarEsc = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cerrar({ devolverFoco: true });
      }
    };
    document.addEventListener("mousedown", cerrarFuera);
    document.addEventListener("keydown", cerrarEsc);
    return () => {
      document.removeEventListener("mousedown", cerrarFuera);
      document.removeEventListener("keydown", cerrarEsc);
    };
  }, [abierto]);
  useEffect22(() => {
    if (!abierto) return;
    requestAnimationFrame(() => {
      const primero = panel.current?.querySelector('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])');
      (primero || panel.current)?.focus();
    });
  }, [abierto]);
  function alternar() {
    setAbierto((actual) => {
      if (!actual) onAbrir?.(true);
      return !actual;
    });
  }
  return /* @__PURE__ */ jsxs83("div", { ref: raiz, className: cn("relative", className), children: [
    /* @__PURE__ */ jsxs83(
      "button",
      {
        ref: disparador,
        type: "button",
        onClick: alternar,
        "data-testid": "campana-avisos",
        "aria-label": sinLeer > 0 ? `${ariaLabel}, ${sinLeer} sin leer` : ariaLabel,
        "aria-haspopup": "dialog",
        "aria-expanded": abierto,
        title: sinLeer > 0 ? `${ariaLabel} \xB7 ${sinLeer} sin leer` : ariaLabel,
        className: "toque-44 relative grid h-11 w-11 place-items-center rounded-lg border border-interactivo text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore",
        children: [
          /* @__PURE__ */ jsx102(Icon, { name: "bell", className: "h-4 w-4" }),
          sinLeer > 0 && /* @__PURE__ */ jsx102("span", { className: "absolute -right-1 -top-1 rounded-full bg-bad px-1 text-[10px] font-bold tabular-nums text-white dark:text-onbrand", children: textoContador(sinLeer) })
        ]
      }
    ),
    abierto && /* @__PURE__ */ jsxs83(
      "div",
      {
        ref: panel,
        role: "dialog",
        "aria-labelledby": tituloId,
        tabIndex: -1,
        className: cn(
          "absolute z-30 mt-1 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-ink-500 bg-ink shadow-float",
          anclaje === "left" ? "left-0" : "right-0"
        ),
        children: [
          /* @__PURE__ */ jsxs83("header", { className: "flex items-center justify-between gap-2 border-b border-ink-600 px-3 py-2", children: [
            /* @__PURE__ */ jsx102("p", { id: tituloId, className: "text-sm font-semibold text-fore", children: titulo2 }),
            sinLeer > 0 && /* @__PURE__ */ jsxs83("span", { className: "text-xs tabular-nums text-mute", children: [
              textoContador(sinLeer),
              " sin leer"
            ] })
          ] }),
          /* @__PURE__ */ jsx102("div", { className: "max-h-80 overflow-y-auto p-1", children: avisos.length === 0 ? /* @__PURE__ */ jsx102(EmptyState, { compact: true, icon: "bell", title: vacioTitulo, description: vacioDetalle, action: vacioAccion }) : avisos.map((aviso) => {
            const tono = TONOS.punto[aviso.tono] || TONOS.punto.mute;
            const contenido = /* @__PURE__ */ jsxs83(Fragment16, { children: [
              /* @__PURE__ */ jsx102("span", { className: cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", tono), children: /* @__PURE__ */ jsx102(Icon, { name: aviso.icono || "bell", className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxs83("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx102("span", { className: cn("block truncate text-sm", aviso.leido === false ? "font-semibold text-fore" : "font-medium text-fore"), children: aviso.titulo }),
                aviso.detalle && /* @__PURE__ */ jsx102("span", { className: "mt-0.5 block text-xs leading-5 text-mute", children: aviso.detalle }),
                aviso.fecha && /* @__PURE__ */ jsx102("span", { className: "mt-1 block text-[10px] uppercase tracking-wide text-mute", children: aviso.fecha })
              ] })
            ] });
            const clases = "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-ink-700/60";
            const ruta = aviso.href ?? aviso.destino;
            return ruta ? /* @__PURE__ */ jsx102(
              "a",
              {
                href: ruta,
                className: clases,
                onClick: () => {
                  cerrar({ devolverFoco: true });
                  onElegir?.(aviso);
                  aviso.onClick?.();
                },
                children: contenido
              },
              aviso.id ?? aviso.titulo
            ) : /* @__PURE__ */ jsx102(
              "button",
              {
                type: "button",
                className: clases,
                onClick: () => {
                  cerrar({ devolverFoco: true });
                  onElegir?.(aviso);
                  aviso.onClick?.();
                },
                children: contenido
              },
              aviso.id ?? aviso.titulo
            );
          }) }),
          pie && /* @__PURE__ */ jsx102("div", { className: "border-t border-ink-600 p-2", children: pie })
        ]
      }
    )
  ] });
}

// src/components/GraficoBarras.jsx
import { jsx as jsx103, jsxs as jsxs84 } from "react/jsx-runtime";
var COLORES = {
  fono: "bg-fono",
  ok: "bg-ok",
  bad: "bg-bad",
  warn: "bg-warn",
  info: "bg-info",
  pass: "bg-pass",
  accion: "bg-accion",
  mute: "bg-mute"
};
function maximoDeBarras(datos = [], max) {
  const pedido = Number(max);
  if (Number.isFinite(pedido) && pedido > 0) return pedido;
  return datos.reduce((tope, dato) => Math.max(tope, Number(dato?.valor) || 0), 0) || 1;
}
function porcentajeBarra(valor, max) {
  const numero = Number(valor);
  const tope = Number(max) > 0 ? Number(max) : 1;
  if (!Number.isFinite(numero) || numero <= 0) return 0;
  return Math.min(100, numero / tope * 100);
}
function GraficoBarras({
  datos = [],
  max,
  orientacion = "vertical",
  altura = 160,
  tono = "fono",
  formatoValor,
  etiqueta = "Gr\xE1fico de barras",
  mostrarValores = true,
  className
}) {
  const formatear = formatoValor || ((valor) => formatoNumero(valor));
  if (!datos.length) return /* @__PURE__ */ jsx103(EmptyState, { compact: true, icon: "chart", title: "Sin datos para graficar", className });
  const tope = maximoDeBarras(datos, max);
  const colorDe = (dato) => COLORES[dato.tono] || COLORES[tono] || COLORES.fono;
  const listaAccesible = /* @__PURE__ */ jsx103("ul", { className: "sr-only", children: datos.map((dato, indice) => /* @__PURE__ */ jsx103("li", { children: `${dato.etiqueta}: ${formatear(dato.valor)}` }, dato.id ?? indice)) });
  if (orientacion === "horizontal") {
    return /* @__PURE__ */ jsxs84("div", { className: cn("space-y-1.5", className), children: [
      datos.map((dato, indice) => /* @__PURE__ */ jsxs84("div", { className: "flex items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx103("span", { className: "w-28 shrink-0 truncate text-mute", title: dato.etiqueta, children: dato.etiqueta }),
        /* @__PURE__ */ jsx103(
          "span",
          {
            className: "h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-fore/10",
            role: "img",
            "aria-label": `${dato.etiqueta}: ${formatear(dato.valor)}`,
            title: `${dato.etiqueta}: ${formatear(dato.valor)}`,
            children: /* @__PURE__ */ jsx103("span", { className: cn("block h-full rounded-full transition-[width] duration-500", colorDe(dato)), style: { width: `${porcentajeBarra(dato.valor, tope)}%` } })
          }
        ),
        mostrarValores && /* @__PURE__ */ jsx103("span", { className: "w-24 shrink-0 text-right font-semibold tabular-nums text-fore", children: formatear(dato.valor) })
      ] }, dato.id ?? indice)),
      listaAccesible
    ] });
  }
  return /* @__PURE__ */ jsxs84("div", { className: cn("space-y-1", className), children: [
    /* @__PURE__ */ jsx103("div", { className: "flex items-end gap-2", style: { height: altura }, role: "img", "aria-label": etiqueta, children: datos.map((dato, indice) => /* @__PURE__ */ jsx103("div", { className: "relative h-full min-w-0 flex-1", children: /* @__PURE__ */ jsx103(
      "span",
      {
        className: cn("absolute inset-x-0 bottom-0 rounded-t-md transition-[height] duration-500", colorDe(dato)),
        style: { height: `${porcentajeBarra(dato.valor, tope)}%` },
        title: `${dato.etiqueta}: ${formatear(dato.valor)}`,
        children: mostrarValores && /* @__PURE__ */ jsx103("span", { className: "absolute inset-x-0 -top-4 truncate text-center text-[10px] font-semibold tabular-nums text-mute", children: formatear(dato.valor) })
      }
    ) }, dato.id ?? indice)) }),
    /* @__PURE__ */ jsx103("div", { className: "flex gap-2", children: datos.map((dato, indice) => /* @__PURE__ */ jsx103("span", { className: "min-w-0 flex-1 truncate text-center text-[10px] text-mute", title: dato.etiqueta, children: dato.etiqueta }, dato.id ?? indice)) }),
    listaAccesible
  ] });
}

// src/components/TableroKanban.jsx
import { useCallback as useCallback4, useEffect as useEffect23, useMemo as useMemo15, useRef as useRef20, useState as useState34 } from "react";
import { jsx as jsx104, jsxs as jsxs85 } from "react/jsx-runtime";
var SIN_MOVIMIENTOS = /* @__PURE__ */ new Set();
function columnasDelTablero(columnas = [], tarjetas = []) {
  const declaradas = [...columnas || []];
  const valores = new Set(declaradas.map((columna) => columna.valor));
  const extras = [...new Set((tarjetas || []).map((tarjeta) => tarjeta.estado).filter((estado) => estado !== null && estado !== void 0 && estado !== "" && !valores.has(estado)))].sort();
  return [...declaradas, ...extras.map((valor) => ({ valor, titulo: valor, tono: "mute" }))];
}
function agruparTarjetas(columnas = [], tarjetas = []) {
  const grupos = {};
  for (const columna of columnas) grupos[columna.valor] = [];
  for (const tarjeta of tarjetas || []) {
    if (grupos[tarjeta.estado]) grupos[tarjeta.estado].push(tarjeta);
  }
  return grupos;
}
function destinosDeTarjeta(tarjeta, columnas = []) {
  const permitidos = tarjeta?.destinos ?? columnas.map((columna) => columna.valor);
  return (permitidos || []).filter((valor, indice) => valor !== tarjeta?.estado && permitidos.indexOf(valor) === indice);
}
function useTableroOptimista({ tarjetas = [], onMover, onError } = {}) {
  const [overrides, setOverrides] = useState34({});
  const [moviendo, setMoviendo] = useState34(SIN_MOVIMIENTOS);
  const tarjetasRef = useRef20(tarjetas);
  const overridesRef = useRef20(overrides);
  const enVueloRef = useRef20(/* @__PURE__ */ new Set());
  useEffect23(() => {
    tarjetasRef.current = tarjetas;
  }, [tarjetas]);
  useEffect23(() => {
    overridesRef.current = overrides;
  }, [overrides]);
  useEffect23(() => {
    setOverrides((actual) => {
      const entradas = Object.entries(actual);
      if (entradas.length === 0) return actual;
      const siguiente = {};
      for (const [id, estado] of entradas) {
        const tarjeta = (tarjetas || []).find((candidata) => candidata.id === id);
        if (tarjeta && tarjeta.estado !== estado) siguiente[id] = estado;
      }
      return Object.keys(siguiente).length === entradas.length ? actual : siguiente;
    });
  }, [tarjetas]);
  const efectivas = useMemo15(
    () => (tarjetas || []).map((tarjeta) => {
      const optimista = overrides[tarjeta.id];
      return optimista && optimista !== tarjeta.estado ? { ...tarjeta, estado: optimista } : tarjeta;
    }),
    [tarjetas, overrides]
  );
  const revertir = useCallback4(
    (id, mensaje) => {
      setOverrides((actual) => {
        if (!(id in actual)) return actual;
        const siguiente = { ...actual };
        delete siguiente[id];
        return siguiente;
      });
      if (mensaje) onError?.(mensaje);
    },
    [onError]
  );
  const moverA = useCallback4(
    (id, estadoDestino) => {
      if (!onMover || !id || !estadoDestino) return;
      const tarjeta = tarjetasRef.current.find((candidata) => candidata.id === id);
      const vigente = overridesRef.current[id] ?? tarjeta?.estado;
      if (!tarjeta || vigente === estadoDestino || enVueloRef.current.has(id)) return;
      const liberar = () => {
        enVueloRef.current.delete(id);
        setMoviendo((actual) => {
          if (!actual.has(id)) return actual;
          const siguiente = new Set(actual);
          siguiente.delete(id);
          return siguiente;
        });
      };
      const terminar = (resultado) => {
        if (resultado && resultado.ok === false) revertir(id, resultado.error || "No se pudo mover la tarjeta.");
      };
      enVueloRef.current.add(id);
      setOverrides((actual) => ({ ...actual, [id]: estadoDestino }));
      setMoviendo((actual) => new Set(actual).add(id));
      try {
        const resultado = onMover(id, estadoDestino);
        if (resultado && typeof resultado.then === "function") {
          resultado.then(terminar).catch(() => revertir(id, "No se pudo mover la tarjeta.")).finally(liberar);
        } else {
          terminar(resultado);
          liberar();
        }
      } catch {
        revertir(id, "No se pudo mover la tarjeta.");
        liberar();
      }
    },
    [onMover, revertir]
  );
  return { tarjetas: efectivas, moverA, moviendo };
}
function TableroKanban({
  /** Nombre del tablero para lectores de pantalla («Presupuestos», «Trabajos»). */
  etiqueta = "Tablero",
  /** Columnas del pipeline: `[{ valor, titulo, tono? }]`. */
  columnas = [],
  /**
   * Tarjetas: `[{ id, estado, titulo, subtitulo?, chips?, monto?, montoNota?,
   * fecha?, detalle?, acciones?, destinos? }]`.
   */
  tarjetas = [],
  /** Rol con permiso de escritura: sin él no hay arrastre ni «Mover a…». */
  puedeMover = false,
  etiquetaMover = "Mover a\u2026",
  textoVacio = "Sin tarjetas",
  /** `(id, estadoDestino) => void | { ok: true } | { ok: false, error } | Promise<…>`. */
  onMover,
  /** Aviso del revert (por ejemplo, el toast de la pantalla). */
  onError,
  className
}) {
  const { tarjetas: efectivas, moverA, moviendo } = useTableroOptimista({ tarjetas, onMover, onError });
  const [arrastrandoId, setArrastrandoId] = useState34("");
  const [sobreColumna, setSobreColumna] = useState34("");
  const columnasReales = useMemo15(() => columnasDelTablero(columnas, efectivas), [columnas, efectivas]);
  const grupos = useMemo15(() => agruparTarjetas(columnasReales, efectivas), [columnasReales, efectivas]);
  const arrastrando = arrastrandoId ? efectivas.find((tarjeta) => tarjeta.id === arrastrandoId) ?? null : null;
  const acepta = (tarjeta, valor) => Boolean(onMover && puedeMover && tarjeta && !moviendo.has(tarjeta.id) && destinosDeTarjeta(tarjeta, columnasReales).includes(valor));
  function terminarArrastre() {
    setArrastrandoId("");
    setSobreColumna("");
  }
  const tituloDe = (valor) => columnasReales.find((columna) => columna.valor === valor)?.titulo ?? valor;
  return /* @__PURE__ */ jsx104("div", { className: cn("flex snap-x gap-3 overflow-x-auto pb-2", className), role: "group", "aria-label": etiqueta, children: columnasReales.map((columna) => {
    const deLaColumna = grupos[columna.valor] ?? [];
    const sobre = sobreColumna === columna.valor && acepta(arrastrando, columna.valor);
    return /* @__PURE__ */ jsxs85(
      "section",
      {
        "aria-label": `${columna.titulo}: ${deLaColumna.length}`,
        className: cn(
          "flex w-[17.5rem] shrink-0 snap-start flex-col rounded-2xl border border-ink-600 bg-ink-900/60 transition",
          sobre && "border-fono/60 ring-2 ring-fono/30"
        ),
        onDragOver: (event) => {
          if (!acepta(arrastrando, columna.valor)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          setSobreColumna(columna.valor);
        },
        onDragLeave: () => setSobreColumna((actual) => actual === columna.valor ? "" : actual),
        onDrop: (event) => {
          if (!acepta(arrastrando, columna.valor)) return;
          event.preventDefault();
          const id = event.dataTransfer.getData("text/plain") || arrastrandoId;
          terminarArrastre();
          if (id) moverA(id, columna.valor);
        },
        children: [
          /* @__PURE__ */ jsxs85("header", { className: "flex items-center gap-2 border-b border-ink-600 px-3 py-2", children: [
            /* @__PURE__ */ jsx104("span", { className: cn("h-2 w-2 shrink-0 rounded-full", puntoDeTono(columna.tono)), "aria-hidden": "true" }),
            /* @__PURE__ */ jsx104("h3", { className: "min-w-0 flex-1 truncate text-[11px] font-bold uppercase tracking-wider text-mute", children: columna.titulo }),
            /* @__PURE__ */ jsx104("span", { className: "shrink-0 rounded-md bg-ink-700 px-1.5 text-[11px] font-bold tabular-nums text-mute", title: `${deLaColumna.length} tarjeta${deLaColumna.length === 1 ? "" : "s"}`, children: deLaColumna.length })
          ] }),
          /* @__PURE__ */ jsxs85("div", { className: "flex min-h-[3rem] flex-col gap-2 p-2", children: [
            deLaColumna.map((tarjeta) => {
              const destinos = destinosDeTarjeta(tarjeta, columnasReales);
              const movible = Boolean(onMover && puedeMover && destinos.length > 0 && !moviendo.has(tarjeta.id));
              const tieneMonto = tarjeta.monto !== null && tarjeta.monto !== void 0;
              return /* @__PURE__ */ jsxs85(
                "article",
                {
                  className: cn(
                    "rounded-xl border border-ink-600 bg-ink p-2.5 transition",
                    arrastrandoId === tarjeta.id && "opacity-60",
                    moviendo.has(tarjeta.id) && "opacity-70"
                  ),
                  "aria-busy": moviendo.has(tarjeta.id) || void 0,
                  draggable: movible,
                  onDragStart: (event) => {
                    if (!movible) {
                      event.preventDefault();
                      return;
                    }
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", tarjeta.id);
                    setArrastrandoId(tarjeta.id);
                  },
                  onDragEnd: terminarArrastre,
                  children: [
                    /* @__PURE__ */ jsxs85("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsx104("strong", { className: "min-w-0 flex-1 truncate text-sm font-semibold text-fore", title: tarjeta.titulo, children: tarjeta.titulo }),
                      tarjeta.acciones && /* @__PURE__ */ jsx104("span", { className: "shrink-0", children: tarjeta.acciones })
                    ] }),
                    tarjeta.subtitulo && /* @__PURE__ */ jsx104("p", { className: "mt-0.5 truncate text-xs text-mute", title: tarjeta.subtitulo, children: tarjeta.subtitulo }),
                    tarjeta.chips?.length > 0 && /* @__PURE__ */ jsx104("div", { className: "mt-1.5 flex flex-wrap items-center gap-1", children: tarjeta.chips.map((chip, indice) => /* @__PURE__ */ jsxs85(
                      "span",
                      {
                        title: chip.titulo ?? chip.etiqueta,
                        className: cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold", chipDeTono(chip.tono)),
                        children: [
                          chip.icono && /* @__PURE__ */ jsx104(Icon, { name: chip.icono, className: "h-3 w-3", "aria-hidden": "true" }),
                          chip.etiqueta
                        ]
                      },
                      chip.etiqueta ?? indice
                    )) }),
                    (tieneMonto || tarjeta.fecha) && /* @__PURE__ */ jsxs85("div", { className: "mt-1.5 flex items-baseline justify-between gap-2", children: [
                      tieneMonto && /* @__PURE__ */ jsxs85("span", { className: "min-w-0 truncate text-xs font-semibold tabular-nums text-fore", children: [
                        /* @__PURE__ */ jsx104(Money, { value: tarjeta.monto }),
                        tarjeta.montoNota && /* @__PURE__ */ jsx104("small", { className: "ml-1 font-normal text-mute", children: tarjeta.montoNota })
                      ] }),
                      tarjeta.fecha && /* @__PURE__ */ jsx104("span", { className: cn("shrink-0 text-[11px] tabular-nums text-mute", !tieneMonto && "ml-auto"), title: tarjeta.fechaTitulo, children: fechaDia(tarjeta.fecha) })
                    ] }),
                    tarjeta.detalle && /* @__PURE__ */ jsx104("p", { className: "mt-1 text-[11px] leading-4 text-mute", children: tarjeta.detalle }),
                    movible && /* @__PURE__ */ jsxs85("div", { className: "mt-2", onDragStart: (event) => event.preventDefault(), children: [
                      /* @__PURE__ */ jsx104("label", { className: "sr-only", htmlFor: `mover-${tarjeta.id}`, children: `Mover ${tarjeta.titulo} a otro estado` }),
                      /* @__PURE__ */ jsxs85(
                        "select",
                        {
                          id: `mover-${tarjeta.id}`,
                          value: "",
                          onChange: (event) => {
                            if (event.target.value) moverA(tarjeta.id, event.target.value);
                          },
                          title: etiquetaMover,
                          className: cn(
                            "h-8 w-full cursor-pointer rounded-lg border border-ink-500 bg-ink-800 px-2 text-xs text-fore",
                            "outline-none transition focus:border-fono focus:ring-1 focus:ring-fono/40 [&>option]:bg-ink-800 [&>option]:text-fore"
                          ),
                          children: [
                            /* @__PURE__ */ jsx104("option", { value: "", children: etiquetaMover }),
                            destinos.map((valor) => /* @__PURE__ */ jsx104("option", { value: valor, children: tituloDe(valor) }, valor))
                          ]
                        }
                      )
                    ] })
                  ]
                },
                tarjeta.id
              );
            }),
            deLaColumna.length === 0 && /* @__PURE__ */ jsx104("p", { className: "px-2 py-6 text-center text-xs text-mute", children: textoVacio })
          ] })
        ]
      },
      columna.valor
    );
  }) });
}

// src/components/Cronologia.jsx
import { jsx as jsx105, jsxs as jsxs86 } from "react/jsx-runtime";
var ICONOS_HITO = {
  creado: "plus",
  actualizado: "edit",
  estado: "refresh",
  enviado: "send",
  visto: "eye",
  solicitud: "edit",
  revision: "alert",
  resuelto: "check",
  aprobado: "check",
  rechazado: "close",
  pago: "money",
  cobro: "money",
  comprobante: "upload",
  tesoreria: "wallet",
  inventario: "box",
  retiro: "truck",
  devolucion: "download",
  tarea: "list",
  tarea_cumplida: "check",
  evento: "calendar",
  cancelado: "close",
  nota: "info",
  gracias: "sparkles"
};
var TONOS_HITO = {
  creado: "mute",
  actualizado: "mute",
  estado: "info",
  enviado: "info",
  visto: "info",
  solicitud: "warn",
  revision: "warn",
  resuelto: "ok",
  aprobado: "ok",
  rechazado: "bad",
  pago: "ok",
  cobro: "info",
  comprobante: "info",
  tesoreria: "info",
  inventario: "info",
  retiro: "info",
  devolucion: "ok",
  tarea: "mute",
  tarea_cumplida: "ok",
  evento: "info",
  cancelado: "bad",
  nota: "mute",
  gracias: "ok"
};
var ETIQUETAS_HITO = {
  creado: "Creado",
  actualizado: "Actualizado",
  estado: "Cambio de estado",
  enviado: "Enviado",
  visto: "Visto",
  solicitud: "Solicitud",
  revision: "Revisi\xF3n",
  resuelto: "Resuelto",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  pago: "Pago",
  cobro: "Cobro",
  comprobante: "Comprobante",
  tesoreria: "Tesorer\xEDa",
  inventario: "Inventario",
  retiro: "Retiro",
  devolucion: "Devoluci\xF3n",
  tarea: "Tarea",
  tarea_cumplida: "Tarea cumplida",
  evento: "Evento",
  cancelado: "Cancelado",
  nota: "Nota",
  gracias: "Agradecimiento"
};
function fechaDelHito(valor) {
  return valor ? fechaHora(valor) : "";
}
function etiquetaDeHito(tipo, etiquetas = ETIQUETAS_HITO) {
  const clave = String(tipo ?? "").trim();
  if (!clave) return "";
  return etiquetas[clave] || clave.replace(/_/g, " ");
}
function agruparHitos(hitos = []) {
  const grupos = [];
  for (const hito of hitos || []) {
    const valido = fechaValida(hito?.fecha);
    const clave = valido ? fechaDia(valido) : "sin-fecha";
    let grupo = grupos[grupos.length - 1];
    if (!grupo || grupo.clave !== clave) {
      grupo = { clave, etiqueta: fechaDia(hito?.fecha, "Sin fecha"), hitos: [] };
      grupos.push(grupo);
    }
    grupo.hitos.push(hito);
  }
  return grupos;
}
function FilaHito({ hito, iconos, tonos, etiquetas, mostrarTipo }) {
  const tipo = String(hito.tipo ?? "").trim();
  const tono = hito.tono || tonos[tipo] || "mute";
  const icono = hito.icono || iconos[tipo] || "info";
  const etiqueta = mostrarTipo ? etiquetaDeHito(tipo, etiquetas) : "";
  return /* @__PURE__ */ jsxs86("li", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsx105("span", { className: cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", puntoDeTono(tono)), "aria-hidden": "true", children: /* @__PURE__ */ jsx105(Icon, { name: icono, className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ jsxs86("div", { className: "min-w-0 flex-1 border-b border-ink-700 pb-2.5", children: [
      /* @__PURE__ */ jsxs86("p", { className: "text-sm font-semibold text-fore", children: [
        /* @__PURE__ */ jsx105("span", { className: "break-words", children: hito.titulo }),
        hito.actor && /* @__PURE__ */ jsxs86("span", { className: "font-normal text-mute", children: [
          " \xB7 ",
          hito.actor
        ] })
      ] }),
      hito.detalle && /* @__PURE__ */ jsx105("p", { className: "mt-0.5 text-xs leading-5 text-mute", children: hito.detalle }),
      /* @__PURE__ */ jsx105("p", { className: "mt-0.5 text-[11px] tabular-nums text-mute", children: [fechaDelHito(hito.fecha), etiqueta].filter(Boolean).join(" \xB7 ") })
    ] })
  ] });
}
function Cronologia({
  /** Hitos: `[{ id, fecha, tipo, titulo, detalle?, actor?, tono?, icono? }]`. */
  hitos = [],
  /** Mapa `tipo → ícono` que pisa los defectos (`ICONOS_HITO`). */
  iconos = ICONOS_HITO,
  /** Mapa `tipo → tono` que pisa los defectos (`TONOS_HITO`). */
  tonos = TONOS_HITO,
  /** Mapa `tipo → etiqueta` que pisa los defectos (`ETIQUETAS_HITO`). */
  etiquetas = ETIQUETAS_HITO,
  /** Agrupa los hitos por día con el encabezado de fecha. */
  agrupar = false,
  /** Muestra la etiqueta del tipo al pie de cada hito. */
  mostrarTipo = false,
  /** Nombre de la lista para lectores de pantalla. */
  etiqueta = "Cronolog\xEDa",
  /** Cargando: esqueleto honesto en lugar de una lista vacía. */
  cargando = false,
  /** Error de carga: se muestra con reintento si hay `onReintentar`. */
  error = "",
  errorTitulo = "No se pudo cargar la cronolog\xEDa",
  onReintentar,
  /** Acción de actualizar + texto de la cabecera (opcional). */
  onActualizar,
  textoActualizar = "Actualizar",
  textoCabecera = "Movimientos m\xE1s recientes primero.",
  vacioTitulo = "Todav\xEDa no hay hitos",
  vacioDetalle,
  className
}) {
  const fila = (hito) => /* @__PURE__ */ jsx105(FilaHito, { hito, iconos, tonos, etiquetas, mostrarTipo }, hito.id);
  const cabecera = onActualizar ? /* @__PURE__ */ jsxs86("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-2", children: [
    textoCabecera ? /* @__PURE__ */ jsx105("p", { className: "text-xs text-mute", children: textoCabecera }) : null,
    /* @__PURE__ */ jsx105(
      "button",
      {
        type: "button",
        disabled: cargando,
        onClick: onActualizar,
        className: "min-h-11 rounded-lg border border-interactivo px-3 py-1.5 text-xs font-semibold text-mute transition hover:border-fono hover:text-fore disabled:opacity-40",
        children: textoActualizar
      }
    )
  ] }) : null;
  if (cargando) {
    return /* @__PURE__ */ jsxs86("div", { className, children: [
      cabecera,
      /* @__PURE__ */ jsxs86("div", { className: "space-y-2", role: "status", "aria-live": "polite", "aria-busy": "true", children: [
        /* @__PURE__ */ jsx105("span", { className: "sr-only", children: "Cargando cronolog\xEDa\u2026" }),
        /* @__PURE__ */ jsx105(Skeleton, { className: "h-16" }),
        /* @__PURE__ */ jsx105(Skeleton, { className: "h-16" }),
        /* @__PURE__ */ jsx105(Skeleton, { className: "h-16" })
      ] })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs86("div", { className, children: [
      cabecera,
      /* @__PURE__ */ jsx105("div", { role: "alert", children: /* @__PURE__ */ jsx105(
        EmptyState,
        {
          compact: true,
          icon: "alert",
          title: errorTitulo,
          description: error,
          action: onReintentar ? /* @__PURE__ */ jsx105(Button, { onClick: onReintentar, children: "Reintentar" }) : void 0
        }
      ) })
    ] });
  }
  if (!hitos?.length) {
    return /* @__PURE__ */ jsxs86("div", { className, children: [
      cabecera,
      /* @__PURE__ */ jsx105("div", { role: "status", children: /* @__PURE__ */ jsx105(EmptyState, { compact: true, icon: "clock", title: vacioTitulo, description: vacioDetalle }) })
    ] });
  }
  return /* @__PURE__ */ jsxs86("div", { className, children: [
    cabecera,
    agrupar ? /* @__PURE__ */ jsx105("div", { className: "space-y-3", children: agruparHitos(hitos).map((grupo) => /* @__PURE__ */ jsxs86("section", { children: [
      /* @__PURE__ */ jsx105("h3", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-mute", children: grupo.etiqueta }),
      /* @__PURE__ */ jsx105("ol", { className: "space-y-2.5", "aria-label": `${etiqueta} \xB7 ${grupo.etiqueta}`, children: grupo.hitos.map(fila) })
    ] }, grupo.clave)) }) : /* @__PURE__ */ jsx105("ol", { className: "space-y-2.5", "aria-label": etiqueta, children: hitos.map(fila) })
  ] });
}

// src/components/PlanPagos.jsx
import { jsx as jsx106, jsxs as jsxs87 } from "react/jsx-runtime";
var ESTADOS_CUOTA = {
  pendiente: { chip: "pendiente", etiqueta: "Pendiente", icono: "clock" },
  revision: { chip: "revision", etiqueta: "En revisi\xF3n", icono: "refresh" },
  pagada: { chip: "pass", etiqueta: "Pagada", icono: "check" },
  cancelada: { chip: "pendiente", etiqueta: "Cancelada", icono: "close", tono: "mute" }
};
function ChipCuota({ estado, estados }) {
  const config = estados[estado];
  if (!config) return null;
  return /* @__PURE__ */ jsx106(ChipEstado, { estado: config.chip, etiqueta: config.etiqueta, icono: config.icono, tono: config.tono });
}
function FilaPlan({ etiqueta, monto, vence, estado, nota, moneda, simbolo, estados, destacada, conEstado }) {
  return /* @__PURE__ */ jsxs87("tr", { className: "border-t border-ink-700", children: [
    /* @__PURE__ */ jsxs87("td", { className: cn(CELDA_DATO, "py-1.5 pr-3 text-xs text-fore"), children: [
      /* @__PURE__ */ jsx106("span", { className: "font-semibold", children: etiqueta }),
      destacada && /* @__PURE__ */ jsx106("small", { className: "ml-1.5 font-medium text-fono-light", children: "A transferir ahora" }),
      nota && /* @__PURE__ */ jsx106("small", { className: "mt-0.5 block text-[11px] text-mute", children: nota })
    ] }),
    /* @__PURE__ */ jsx106("td", { className: cn(CELDA_NUMERO, "py-1.5 pr-3 text-xs font-semibold text-fore"), children: /* @__PURE__ */ jsx106(Money, { value: monto, currency: moneda, simbolo }) }),
    /* @__PURE__ */ jsx106("td", { className: cn(CELDA_DATO, "py-1.5 pr-3 whitespace-nowrap text-xs"), children: vence ? fechaDia(vence) : "\u2014" }),
    conEstado && /* @__PURE__ */ jsx106("td", { className: cn(CELDA_DATO, "py-1.5 text-xs"), children: estado ? /* @__PURE__ */ jsx106(ChipCuota, { estado, estados }) : null })
  ] });
}
function PlanPagos({
  /** Monto del anticipo (0 o `null` = no hay anticipo separado). */
  anticipo = 0,
  anticipoEtiqueta = "Anticipo",
  anticipoVence,
  /** Cuotas: `[{ id?, etiqueta, monto, vence?, estado?, nota? }]`. */
  cuotas = [],
  /**
   * Lo que corresponde transferir ahora: `{ id?, etiqueta, monto }`. Con `id`
   * se marca además la cuota correspondiente en la tabla.
   */
  aTransferir = null,
  /** Total del plan; `null` no dibuja el pie. */
  total = null,
  totalEtiqueta = "Total",
  /** Saldo del plan sin cuota agendada (0 = el plan cubre todo). */
  saldoSinCuota = 0,
  saldoEtiqueta = "Saldo sin cuota agendada",
  /** Condiciones de pago escritas por el equipo. */
  condiciones = null,
  /** Moneda de los montos (`PYG` entero o `USD` con decimales). */
  moneda = "PYG",
  /** Símbolo del guaraní para el panel de la app (p. ej. `'Gs.'` o `'₲'`). */
  simbolo,
  /** Mapa `estado → chip`; pisa `ESTADOS_CUOTA`. */
  estados = ESTADOS_CUOTA,
  /** Texto del vacío: no hay anticipo ni cuotas. */
  vacio = "El presupuesto se paga en un solo pago.",
  className
}) {
  const montoAnticipo = Number(anticipo) || 0;
  const hayAnticipo = montoAnticipo > 0;
  const conEstado = (cuotas || []).some((cuota) => Boolean(cuota.estado));
  const vacioPlan = !hayAnticipo && !(cuotas || []).length;
  if (vacioPlan && total === null && !condiciones && !aTransferir) {
    return /* @__PURE__ */ jsx106(EmptyState, { compact: true, icon: "receipt", title: vacio, className });
  }
  return /* @__PURE__ */ jsxs87("div", { className: cn("space-y-2.5", className), children: [
    aTransferir && /* @__PURE__ */ jsxs87("div", { className: "flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-fono/40 bg-fono/10 px-3 py-2", children: [
      /* @__PURE__ */ jsx106("span", { className: "text-xs font-semibold text-fono-light", children: aTransferir.etiqueta || "A transferir ahora" }),
      /* @__PURE__ */ jsx106("strong", { className: "text-lg font-bold tabular-nums text-fore", children: /* @__PURE__ */ jsx106(Money, { value: aTransferir.monto, currency: moneda, simbolo }) })
    ] }),
    vacioPlan ? /* @__PURE__ */ jsx106("p", { className: "text-xs text-mute", children: vacio }) : /* @__PURE__ */ jsxs87("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx106("caption", { className: "sr-only", children: "Plan de pagos" }),
      /* @__PURE__ */ jsx106("thead", { children: /* @__PURE__ */ jsxs87("tr", { children: [
        /* @__PURE__ */ jsx106("th", { className: cn(CELDA_ENCABEZADO, "pb-1 text-left"), scope: "col", children: "Cuota" }),
        /* @__PURE__ */ jsx106("th", { className: cn(CELDA_ENCABEZADO, "pb-1 text-right"), scope: "col", children: "Monto" }),
        /* @__PURE__ */ jsx106("th", { className: cn(CELDA_ENCABEZADO, "pb-1 text-left"), scope: "col", children: "Vencimiento" }),
        conEstado && /* @__PURE__ */ jsx106("th", { className: cn(CELDA_ENCABEZADO, "pb-1 text-left"), scope: "col", children: "Estado" })
      ] }) }),
      /* @__PURE__ */ jsxs87("tbody", { children: [
        hayAnticipo && /* @__PURE__ */ jsx106(
          FilaPlan,
          {
            etiqueta: anticipoEtiqueta,
            monto: montoAnticipo,
            vence: anticipoVence,
            moneda,
            simbolo,
            estados,
            conEstado: false,
            destacada: aTransferir?.id === "anticipo"
          }
        ),
        (cuotas || []).map((cuota, indice) => /* @__PURE__ */ jsx106(
          FilaPlan,
          {
            etiqueta: cuota.etiqueta,
            monto: cuota.monto,
            vence: cuota.vence,
            estado: cuota.estado,
            nota: cuota.nota,
            moneda,
            simbolo,
            estados,
            conEstado,
            destacada: Boolean(aTransferir?.id && aTransferir.id === cuota.id)
          },
          cuota.id ?? `${cuota.etiqueta}-${indice}`
        ))
      ] }),
      total !== null && /* @__PURE__ */ jsx106("tfoot", { children: /* @__PURE__ */ jsxs87("tr", { className: "border-t border-ink-500", children: [
        /* @__PURE__ */ jsx106("td", { className: cn(CELDA_DATO, "py-2 text-xs font-semibold text-fore"), colSpan: conEstado ? 3 : 2, children: totalEtiqueta }),
        /* @__PURE__ */ jsx106("td", { className: cn(CELDA_NUMERO, "py-2 text-sm font-bold text-fore"), children: /* @__PURE__ */ jsx106(Money, { value: total, currency: moneda, simbolo }) })
      ] }) })
    ] }),
    vacioPlan && total !== null && /* @__PURE__ */ jsxs87("div", { className: "flex items-baseline justify-between gap-2 border-t border-ink-700 pt-2", children: [
      /* @__PURE__ */ jsx106("span", { className: "text-xs font-semibold text-fore", children: totalEtiqueta }),
      /* @__PURE__ */ jsx106("span", { className: "text-sm font-bold tabular-nums text-fore", children: /* @__PURE__ */ jsx106(Money, { value: total, currency: moneda, simbolo }) })
    ] }),
    saldoSinCuota > 0 && /* @__PURE__ */ jsxs87("p", { className: "text-xs text-mute", children: [
      saldoEtiqueta,
      ":",
      " ",
      /* @__PURE__ */ jsx106("span", { className: "font-semibold tabular-nums text-fore", children: /* @__PURE__ */ jsx106(Money, { value: saldoSinCuota, currency: moneda, simbolo }) })
    ] }),
    condiciones && /* @__PURE__ */ jsx106(Nota, { tono: "info", compact: true, children: condiciones })
  ] });
}

// src/components/DocumentoImpresion.jsx
import { Fragment as Fragment17, jsx as jsx107, jsxs as jsxs88 } from "react/jsx-runtime";
var CANTIDAD_FORMATTER = new Intl.NumberFormat("es-PY", { maximumFractionDigits: 3 });
function cantidadTexto(cantidad) {
  if (cantidad === null || cantidad === void 0 || cantidad === "") return "";
  return typeof cantidad === "number" ? CANTIDAD_FORMATTER.format(cantidad) : cantidad;
}
function Dato2({ etiqueta, valor, className }) {
  if (!valor) return null;
  return /* @__PURE__ */ jsxs88("p", { className: cn("min-w-0", className), children: [
    /* @__PURE__ */ jsx107("span", { className: "block text-[9.5px] font-bold uppercase tracking-wider oc-print-suave", children: etiqueta }),
    /* @__PURE__ */ jsx107("span", { className: "block whitespace-pre-wrap text-[12.5px]", children: valor })
  ] });
}
function Identidad({ titulo: titulo2, datos, logo, monograma }) {
  if (!datos) return null;
  return /* @__PURE__ */ jsxs88("section", { className: "oc-print-bloque", children: [
    /* @__PURE__ */ jsx107("h2", { className: "mb-1.5 border-b pb-1 text-[10.5px] font-bold uppercase tracking-wider oc-print-suave oc-print-linea", children: titulo2 }),
    /* @__PURE__ */ jsxs88("div", { className: "flex items-start gap-3", children: [
      (logo || monograma) && /* @__PURE__ */ jsx107("span", { className: "shrink-0", children: logo ? /* @__PURE__ */ jsx107("img", { src: logo, alt: "", "aria-hidden": "true", className: "h-9 w-9 object-contain" }) : /* @__PURE__ */ jsx107("span", { className: "grid h-9 w-9 place-items-center rounded-lg border text-[11px] font-bold oc-print-linea oc-print-suave", "aria-hidden": "true", children: monograma }) }),
      /* @__PURE__ */ jsxs88("div", { className: "grid min-w-0 flex-1 gap-1.5 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx107(Dato2, { etiqueta: "Nombre", valor: datos.nombre, className: "sm:col-span-2" }),
        /* @__PURE__ */ jsx107(Dato2, { etiqueta: datos.etiquetaDocumento || "RUC", valor: datos.documento }),
        /* @__PURE__ */ jsx107(Dato2, { etiqueta: "Tel\xE9fono", valor: datos.telefono }),
        /* @__PURE__ */ jsx107(Dato2, { etiqueta: "Correo", valor: datos.correo }),
        /* @__PURE__ */ jsx107(Dato2, { etiqueta: "Direcci\xF3n", valor: datos.direccion, className: "sm:col-span-2" })
      ] })
    ] })
  ] });
}
function FilaLiquidacion({ etiqueta, valor, moneda, simbolo, nota, fuerte = false }) {
  const numero = Number(valor);
  const negativo = Number.isFinite(numero) && numero < 0;
  return /* @__PURE__ */ jsxs88("div", { className: cn("oc-print-fila", fuerte ? "oc-print-fila--total" : "oc-print-linea"), children: [
    /* @__PURE__ */ jsxs88("span", { className: "min-w-0", children: [
      etiqueta,
      nota && /* @__PURE__ */ jsxs88("small", { className: "oc-print-suave", children: [
        " ",
        nota
      ] })
    ] }),
    /* @__PURE__ */ jsxs88("span", { className: "oc-print-num shrink-0 font-semibold", children: [
      negativo && "\u2212 ",
      /* @__PURE__ */ jsx107(Money, { value: negativo ? Math.abs(numero) : valor, currency: moneda, simbolo })
    ] })
  ] });
}
function DocumentoImpresion({
  /** Título del documento («Presupuesto», «Factura», «Orden de trabajo»). */
  titulo: titulo2 = "Documento",
  /** Número o referencia visible junto al título. */
  numero = null,
  etiquetaNumero = "N.\xBA",
  /**
   * Datos del emisor: `{ nombre, documento?, etiquetaDocumento?, direccion?,
   * telefono?, correo?, logo? }`. El logo es una URL servida por la app.
   */
  emisor = null,
  /** Datos del receptor, con la misma forma que el emisor. */
  receptor = null,
  /** Meta del documento: `[{ etiqueta, valor }]` (fechas, validez, depósito…). */
  meta = [],
  /** Estado visible del documento («Aprobado», «Anulado»…). */
  estado = null,
  estadoTono = "mute",
  /** Detalle: `[{ cantidad, concepto, unitario, subtotal, nota? }]`. */
  detalle = [],
  /**
   * Liquidación: `{ subtotal, descuento?, descuentoEtiqueta?, iva?, otros?,
   * total }`. `iva` = `[{ tasa, base?, monto }]` y `otros` =
   * `[{ etiqueta, monto }]` (flete, ajustes).
   */
  liquidacion = null,
  /** Notas del pie del documento (texto o nodo). */
  notas = null,
  notasEtiqueta = "Notas",
  /** Pie de la hoja (texto o nodo). */
  pie = null,
  /** Callback del botón «Imprimir»; sin él no se dibuja el botón. */
  onImprimir,
  etiquetaImprimir = "Imprimir",
  /** Moneda de los montos (`PYG` entero o `USD` con decimales). */
  moneda = "PYG",
  /** Símbolo del guaraní para el panel de la app (p. ej. `Gs.`). */
  simbolo,
  etiquetaDetalle = "Detalle",
  etiquetaEmisor = "Emisor",
  etiquetaReceptor = "Receptor",
  etiquetaLiquidacion = "Liquidaci\xF3n",
  etiquetaMeta = "Documento",
  vacioDetalle = "Sin \xEDtems cargados",
  className
}) {
  const monograma = String(emisor?.nombre ?? "").trim().slice(0, 2).toUpperCase() || "\xB7\xB7";
  const tieneLiquidacion = Boolean(liquidacion && (liquidacion.subtotal !== void 0 || liquidacion.total !== void 0));
  return /* @__PURE__ */ jsxs88("div", { className: cn("oc-print min-h-screen px-3 py-4 md:px-6", className), children: [
    onImprimir && /* @__PURE__ */ jsx107("div", { className: "oc-print-oculto mx-auto mb-3 flex w-full max-w-[210mm] justify-end", children: /* @__PURE__ */ jsxs88(Button, { type: "button", variant: "outline", onClick: onImprimir, children: [
      /* @__PURE__ */ jsx107(Icon, { name: "printer", className: "h-4 w-4" }),
      etiquetaImprimir
    ] }) }),
    /* @__PURE__ */ jsxs88("article", { className: "oc-print-hoja", children: [
      /* @__PURE__ */ jsxs88("header", { className: "oc-print-bloque flex flex-wrap items-start justify-between gap-4 border-b-2 pb-2.5 oc-print-linea", children: [
        /* @__PURE__ */ jsxs88("div", { className: "flex min-w-0 items-center gap-2.5", children: [
          emisor?.logo ? /* @__PURE__ */ jsx107("img", { src: emisor.logo, alt: "", "aria-hidden": "true", className: "h-8 w-8 object-contain" }) : /* @__PURE__ */ jsx107("span", { className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-[11px] font-bold oc-print-linea oc-print-suave", "aria-hidden": "true", children: monograma }),
          /* @__PURE__ */ jsxs88("span", { className: "grid min-w-0 gap-0.5", children: [
            /* @__PURE__ */ jsx107("strong", { className: "truncate text-[13px] font-bold tracking-wider", children: emisor?.nombre || "\u2014" }),
            emisor?.direccion && /* @__PURE__ */ jsx107("span", { className: "truncate text-[10.5px] uppercase tracking-wider oc-print-suave", children: emisor.direccion })
          ] })
        ] }),
        /* @__PURE__ */ jsxs88("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx107("h1", { className: "text-lg font-bold uppercase tracking-wide", children: titulo2 }),
          numero && /* @__PURE__ */ jsxs88("p", { className: "text-[12px] font-bold", children: [
            etiquetaNumero,
            " ",
            numero
          ] }),
          estado && /* @__PURE__ */ jsx107("span", { className: cn("mt-0.5 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold", chipDeTono(estadoTono)), children: estado })
        ] })
      ] }),
      (emisor || receptor) && /* @__PURE__ */ jsxs88("div", { className: "mt-3.5 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx107(Identidad, { titulo: etiquetaEmisor, datos: emisor, logo: emisor?.logo, monograma }),
        /* @__PURE__ */ jsx107(Identidad, { titulo: etiquetaReceptor, datos: receptor ? { ...receptor, etiquetaDocumento: receptor.etiquetaDocumento || "RUC" } : null })
      ] }),
      meta?.length > 0 && /* @__PURE__ */ jsxs88("section", { className: "oc-print-bloque mt-3.5", children: [
        /* @__PURE__ */ jsx107("h2", { className: "mb-1.5 border-b pb-1 text-[10.5px] font-bold uppercase tracking-wider oc-print-suave oc-print-linea", children: etiquetaMeta }),
        /* @__PURE__ */ jsx107("div", { className: "grid gap-1.5 sm:grid-cols-3", children: meta.map((dato, indice) => /* @__PURE__ */ jsx107(Dato2, { etiqueta: dato.etiqueta, valor: dato.valor }, dato.etiqueta ?? indice)) })
      ] }),
      /* @__PURE__ */ jsxs88("section", { className: "oc-print-bloque mt-3.5", children: [
        /* @__PURE__ */ jsx107("h2", { className: "mb-1.5 border-b pb-1 text-[10.5px] font-bold uppercase tracking-wider oc-print-suave oc-print-linea", children: etiquetaDetalle }),
        detalle?.length > 0 ? /* @__PURE__ */ jsxs88("table", { className: "oc-print-tabla", children: [
          /* @__PURE__ */ jsx107("thead", { children: /* @__PURE__ */ jsxs88("tr", { children: [
            /* @__PURE__ */ jsx107("th", { scope: "col", children: "Cantidad" }),
            /* @__PURE__ */ jsx107("th", { scope: "col", children: "Concepto" }),
            /* @__PURE__ */ jsx107("th", { scope: "col", className: "oc-print-num", children: "Unitario" }),
            /* @__PURE__ */ jsx107("th", { scope: "col", className: "oc-print-num", children: "Subtotal" })
          ] }) }),
          /* @__PURE__ */ jsx107("tbody", { children: detalle.map((item, indice) => /* @__PURE__ */ jsxs88("tr", { children: [
            /* @__PURE__ */ jsx107("td", { className: "oc-print-num w-16", children: cantidadTexto(item.cantidad) }),
            /* @__PURE__ */ jsxs88("td", { children: [
              item.concepto,
              item.nota && /* @__PURE__ */ jsx107("small", { className: "block oc-print-suave", children: item.nota })
            ] }),
            /* @__PURE__ */ jsx107("td", { className: "oc-print-num", children: /* @__PURE__ */ jsx107(Money, { value: item.unitario, currency: moneda, simbolo }) }),
            /* @__PURE__ */ jsx107("td", { className: "oc-print-num", children: /* @__PURE__ */ jsx107(Money, { value: item.subtotal, currency: moneda, simbolo }) })
          ] }, item.id ?? indice)) })
        ] }) : /* @__PURE__ */ jsx107("p", { className: "rounded-md border border-dashed px-2.5 py-2 text-[11.5px] oc-print-linea oc-print-suave", children: vacioDetalle })
      ] }),
      tieneLiquidacion && /* @__PURE__ */ jsxs88("section", { className: "oc-print-totales oc-print-bloque mt-3 ml-auto w-full max-w-[86mm]", children: [
        /* @__PURE__ */ jsx107("h2", { className: "mb-1.5 border-b pb-1 text-[10.5px] font-bold uppercase tracking-wider oc-print-suave oc-print-linea", children: etiquetaLiquidacion }),
        liquidacion.subtotal !== void 0 && /* @__PURE__ */ jsx107(FilaLiquidacion, { etiqueta: "Subtotal", valor: liquidacion.subtotal, moneda, simbolo }),
        liquidacion.descuento ? /* @__PURE__ */ jsx107(FilaLiquidacion, { etiqueta: liquidacion.descuentoEtiqueta || "Descuento", valor: -Number(liquidacion.descuento), moneda, simbolo }) : null,
        liquidacion.otros?.map((otro, indice) => /* @__PURE__ */ jsx107(FilaLiquidacion, { etiqueta: otro.etiqueta, valor: otro.monto, moneda, simbolo }, otro.etiqueta ?? indice)),
        liquidacion.iva?.map((iva, indice) => /* @__PURE__ */ jsx107(
          FilaLiquidacion,
          {
            etiqueta: `IVA ${iva.tasa}%`,
            nota: iva.base !== void 0 ? /* @__PURE__ */ jsxs88(Fragment17, { children: [
              "sobre ",
              /* @__PURE__ */ jsx107(Money, { value: iva.base, currency: moneda, simbolo })
            ] }) : null,
            valor: iva.monto,
            moneda,
            simbolo
          },
          `${iva.tasa}-${indice}`
        )),
        liquidacion.total !== void 0 && /* @__PURE__ */ jsx107(FilaLiquidacion, { etiqueta: "Total", valor: liquidacion.total, moneda, simbolo, fuerte: true })
      ] }),
      notas && /* @__PURE__ */ jsxs88("section", { className: "oc-print-bloque mt-3.5", children: [
        /* @__PURE__ */ jsx107("h2", { className: "mb-1.5 border-b pb-1 text-[10.5px] font-bold uppercase tracking-wider oc-print-suave oc-print-linea", children: notasEtiqueta }),
        /* @__PURE__ */ jsx107("div", { className: "oc-print-nota", children: notas })
      ] }),
      pie && /* @__PURE__ */ jsx107("footer", { className: "oc-print-bloque mt-5 flex flex-wrap items-baseline justify-between gap-3 border-t pt-2 text-[10px] oc-print-linea oc-print-suave", children: pie })
    ] })
  ] });
}

// src/components/SubidaImagen.jsx
import { useId as useId22, useRef as useRef21, useState as useState35 } from "react";
import { jsx as jsx108, jsxs as jsxs89 } from "react/jsx-runtime";
var MIMES_IMAGEN = ["image/jpeg", "image/png", "image/webp"];
var EXTENSION_IMAGEN = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
var TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;
var TAMANO_OBJETIVO_IMAGEN = 1024 * 1024;
var ETIQUETA_TIPO = { "image/jpeg": "JPG", "image/png": "PNG", "image/webp": "WebP" };
function asciiEn(bytes, offset, length) {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}
function mimeDeImagen(bytes) {
  if (!bytes || bytes.length < 4) return null;
  const empiezaCon = (...firma) => firma.every((byte, indice) => bytes[indice] === byte);
  if (empiezaCon(255, 216, 255)) return "image/jpeg";
  if (empiezaCon(137, 80, 78, 71, 13, 10, 26, 10)) return "image/png";
  if (bytes.length >= 12 && asciiEn(bytes, 0, 4) === "RIFF" && asciiEn(bytes, 8, 4) === "WEBP") return "image/webp";
  return null;
}
function pesoLegible(bytes) {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
function validarImagen(archivo, { tipos = MIMES_IMAGEN, tamanoMaximo = TAMANO_MAXIMO_IMAGEN } = {}) {
  if (!archivo) return { ok: false, error: "No se eligi\xF3 ning\xFAn archivo." };
  if (!archivo.size) return { ok: false, error: "El archivo est\xE1 vac\xEDo; prob\xE1 de nuevo." };
  if (archivo.size > tamanoMaximo) {
    return { ok: false, error: `El archivo supera los ${pesoLegible(tamanoMaximo)}; prob\xE1 con una imagen m\xE1s chica.` };
  }
  const mime = String(archivo.type ?? "").toLowerCase();
  if (mime && !tipos.includes(mime)) {
    return { ok: false, error: `Solo se aceptan im\xE1genes ${tipos.map((tipo) => ETIQUETA_TIPO[tipo] || tipo).join(", ")}.` };
  }
  return { ok: true };
}
async function cargarFuente(archivo) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" });
      return { imagen: bitmap, ancho: bitmap.width, alto: bitmap.height, liberar: () => bitmap.close() };
    } catch {
    }
  }
  const url = URL.createObjectURL(archivo);
  try {
    const imagen = await new Promise((resolve, reject) => {
      const elemento = new Image();
      elemento.onload = () => resolve(elemento);
      elemento.onerror = () => reject(new Error("No pudimos leer la imagen."));
      elemento.src = url;
    });
    return { imagen, ancho: imagen.naturalWidth, alto: imagen.naturalHeight, liberar: () => URL.revokeObjectURL(url) };
  } catch {
    URL.revokeObjectURL(url);
    return null;
  }
}
function blobABase64(blob) {
  return new Promise((resolve) => {
    const lector = new FileReader();
    lector.onload = () => {
      const resultado = typeof lector.result === "string" ? lector.result : "";
      const coma = resultado.indexOf(",");
      resolve(coma >= 0 ? resultado.slice(coma + 1) : null);
    };
    lector.onerror = () => resolve(null);
    lector.readAsDataURL(blob);
  });
}
function canvasABlob(canvas, calidad) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", calidad));
}
var CALIDADES = [0.86, 0.7, 0.55];
async function prepararImagen(archivo, { cuadrado = false, ladoMaximo = 1024, objetivo = TAMANO_OBJETIVO_IMAGEN } = {}) {
  const rapida = validarImagen(archivo);
  if (!rapida.ok) return rapida;
  if (typeof document === "undefined") return { ok: false, error: "La imagen se prepara en el navegador." };
  const cabecera = new Uint8Array(await archivo.slice(0, 16).arrayBuffer());
  const tipo = mimeDeImagen(cabecera);
  if (!tipo) return { ok: false, error: "El archivo no es un JPG, PNG o WebP real: revis\xE1 que no est\xE9 renombrado." };
  const fuente = await cargarFuente(archivo);
  if (!fuente || fuente.ancho < 1 || fuente.alto < 1) {
    fuente?.liberar();
    return { ok: false, error: "No pudimos leer la imagen; prob\xE1 con otro archivo." };
  }
  try {
    const escala = Math.min(1, ladoMaximo / Math.max(fuente.ancho, fuente.alto));
    const lado = cuadrado ? Math.min(fuente.ancho, fuente.alto) : 0;
    const ancho = cuadrado ? Math.max(1, Math.round(lado * escala)) : Math.max(1, Math.round(fuente.ancho * escala));
    const alto = cuadrado ? ancho : Math.max(1, Math.round(fuente.alto * escala));
    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    const contexto = canvas.getContext("2d");
    if (!contexto) return { ok: false, error: "No pudimos procesar la imagen en este navegador." };
    if (cuadrado) {
      const origen = Math.min(fuente.ancho, fuente.alto);
      contexto.drawImage(fuente.imagen, (fuente.ancho - origen) / 2, (fuente.alto - origen) / 2, origen, origen, 0, 0, ancho, alto);
    } else {
      contexto.drawImage(fuente.imagen, 0, 0, ancho, alto);
    }
    let blob = null;
    for (const calidad of CALIDADES) {
      blob = await canvasABlob(canvas, calidad);
      if (blob && blob.size > 0 && blob.size <= objetivo) break;
    }
    if (!blob || blob.size === 0) return { ok: false, error: "No pudimos comprimir la imagen; prob\xE1 con otra." };
    if (blob.size > objetivo) return { ok: false, error: `La imagen sigue superando ${pesoLegible(objetivo)} despu\xE9s de comprimirla; prob\xE1 con una m\xE1s chica.` };
    const base64 = await blobABase64(blob);
    if (!base64) return { ok: false, error: "No pudimos leer la imagen; prob\xE1 de nuevo." };
    return {
      ok: true,
      imagen: {
        base64,
        tipo: "image/webp",
        ancho,
        alto,
        tamano: blob.size,
        dataUrl: `data:image/webp;base64,${base64}`
      }
    };
  } finally {
    fuente.liberar();
  }
}
function SubidaImagen({
  /** Etiqueta del campo. */
  etiqueta,
  /** Aclaración debajo del campo (nunca junto al error). */
  descripcion,
  /** Vista previa de una imagen ya guardada (data URL servida por la app). */
  valor = null,
  /** Error externo (del API); se muestra con `role="alert"`. */
  error = null,
  /** Tipos aceptados; por defecto JPG, PNG y WebP. */
  tipos = MIMES_IMAGEN,
  /** Tamaño máximo del archivo elegido, en bytes. */
  tamanoMaximo = TAMANO_MAXIMO_IMAGEN,
  /** Comprime en el navegador antes de avisar (canvas, sin librerías). */
  comprimir = true,
  /** Recorta cuadrado desde el centro (avatar) o conserva la relación (logo). */
  cuadrado = false,
  /** Lado máximo de la imagen final, en px. */
  ladoMaximo = 1024,
  /** Tamaño objetivo de la imagen comprimida, en bytes. */
  tamanoObjetivo = TAMANO_OBJETIVO_IMAGEN,
  /** Recibe `{ archivo, dataUrl, tipo, ancho, alto, tamano, base64?, preparada }`. */
  onImagen,
  /** Quita la imagen (limpia la vista previa y avisa al consumidor). */
  onLimpiar,
  limpiarEtiqueta = "Quitar imagen",
  subirEtiqueta = "Subir imagen",
  cambiarEtiqueta = "Cambiar imagen",
  disabled = false,
  /** Ocupado externo (por ejemplo, mientras el API guarda). */
  ocupado = false,
  className
}) {
  const inputRef = useRef21(null);
  const campoId = useId22();
  const errorId = `${campoId}-error`;
  const ayudaId = `${campoId}-ayuda`;
  const [preparando, setPreparando] = useState35(false);
  const [errorLocal, setErrorLocal] = useState35("");
  const [vistaLocal, setVistaLocal] = useState35(null);
  const [arrastrando, setArrastrando] = useState35(false);
  const mensaje = error || errorLocal;
  const trabajando = Boolean(ocupado) || preparando;
  const vista = vistaLocal ?? valor;
  const acepta = tipos.map((tipo) => EXTENSION_IMAGEN[tipo] ? `.${EXTENSION_IMAGEN[tipo]}` : tipo).join(",");
  async function elegir(archivo) {
    if (!archivo || trabajando || disabled) return;
    setErrorLocal("");
    const rapida = validarImagen(archivo, { tipos, tamanoMaximo });
    if (!rapida.ok) {
      setErrorLocal(rapida.error);
      return;
    }
    if (!comprimir) {
      onImagen?.({ archivo, tipo: archivo.type, tamano: archivo.size, preparada: false });
      return;
    }
    setPreparando(true);
    const resultado = await prepararImagen(archivo, { cuadrado, ladoMaximo, objetivo: tamanoObjetivo });
    setPreparando(false);
    if (!resultado.ok) {
      setErrorLocal(resultado.error);
      return;
    }
    setVistaLocal(resultado.imagen.dataUrl);
    onImagen?.({ archivo, ...resultado.imagen, preparada: true });
  }
  function limpiar() {
    setVistaLocal(null);
    setErrorLocal("");
    if (inputRef.current) inputRef.current.value = "";
    onLimpiar?.();
  }
  return /* @__PURE__ */ jsxs89("div", { className: cn("min-w-0", className), children: [
    etiqueta && /* @__PURE__ */ jsx108("span", { className: "mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-mute", children: etiqueta }),
    /* @__PURE__ */ jsxs89(
      "div",
      {
        className: cn(
          "flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed p-3 transition",
          arrastrando ? "border-fono/70 bg-fono/5" : "border-ink-500",
          (disabled || trabajando) && "opacity-70"
        ),
        onDragOver: (event) => {
          if (disabled || trabajando) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setArrastrando(true);
        },
        onDragLeave: () => setArrastrando(false),
        onDrop: (event) => {
          if (disabled || trabajando) return;
          event.preventDefault();
          setArrastrando(false);
          void elegir(event.dataTransfer.files?.[0] ?? null);
        },
        children: [
          vista ? /* @__PURE__ */ jsx108("span", { className: cn("grid shrink-0 place-items-center overflow-hidden rounded-xl border border-ink-500 bg-ink-800", cuadrado ? "h-20 w-20" : "h-20 w-28"), children: /* @__PURE__ */ jsx108("img", { src: vista, alt: "", className: cn("h-full w-full", cuadrado ? "object-cover" : "object-contain") }) }) : /* @__PURE__ */ jsx108("span", { className: "grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-ink-600 bg-ink-800 text-mute", "aria-hidden": "true", children: /* @__PURE__ */ jsx108(Icon, { name: "image", className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs89("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx108("p", { className: "text-xs text-mute", children: vista ? "La imagen est\xE1 lista." : "Arrastr\xE1 una imagen o eleg\xED un archivo." }),
            /* @__PURE__ */ jsxs89("p", { className: "mt-0.5 text-[11px] text-mute", children: [
              tipos.map((tipo) => ETIQUETA_TIPO[tipo] || tipo).join(" \xB7 "),
              " \xB7 hasta ",
              pesoLegible(tamanoMaximo)
            ] }),
            /* @__PURE__ */ jsxs89("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxs89(Button, { type: "button", variant: "outline", disabled: disabled || trabajando, onClick: () => inputRef.current?.click(), "aria-describedby": mensaje ? errorId : descripcion ? ayudaId : void 0, children: [
                /* @__PURE__ */ jsx108(Icon, { name: "upload", className: "h-4 w-4" }),
                trabajando ? "Procesando\u2026" : vista ? cambiarEtiqueta : subirEtiqueta
              ] }),
              (vista || vistaLocal) && /* @__PURE__ */ jsx108(IconAction, { icon: "trash", label: limpiarEtiqueta, disabled: disabled || trabajando, onClick: limpiar })
            ] })
          ] }),
          /* @__PURE__ */ jsx108(
            "input",
            {
              ref: inputRef,
              className: "sr-only",
              type: "file",
              accept: acepta,
              "aria-label": etiqueta || subirEtiqueta,
              disabled: disabled || trabajando,
              onChange: (event) => {
                void elegir(event.target.files?.[0] ?? null);
                event.target.value = "";
              }
            }
          )
        ]
      }
    ),
    mensaje ? /* @__PURE__ */ jsx108("p", { className: "mt-1.5 text-xs text-bad-text", id: errorId, role: "alert", children: mensaje }) : descripcion ? /* @__PURE__ */ jsx108("p", { className: "mt-1.5 text-xs text-mute", id: ayudaId, children: descripcion }) : null
  ] });
}

// src/components/ProgresoChecklist.jsx
import { jsx as jsx109, jsxs as jsxs90 } from "react/jsx-runtime";
function progresoChecklist({
  hechas = 0,
  total = 0,
  vencidas = 0,
  riesgo = false,
  sustantivo = "tareas",
  textoVacio = "Sin datos"
} = {}) {
  const totalNum = Math.max(0, Math.floor(Number(total) || 0));
  const hechasNum = Math.min(totalNum, Math.max(0, Math.floor(Number(hechas) || 0)));
  const vencidasNum = Math.min(totalNum - hechasNum, Math.max(0, Math.floor(Number(vencidas) || 0)));
  const pendientes = totalNum - hechasNum;
  const completo = totalNum > 0 && hechasNum === totalNum;
  const enRiesgo = Boolean(riesgo) && totalNum > 0 && hechasNum === 0;
  const tono = enRiesgo ? "bad" : vencidasNum > 0 ? "warn" : completo ? "ok" : "fono";
  const porcentaje = totalNum > 0 ? Math.round(hechasNum / totalNum * 100) : 0;
  const etiqueta = totalNum > 0 ? `${hechasNum} de ${totalNum} ${sustantivo}` : textoVacio;
  const partes = totalNum > 0 ? [`${hechasNum} de ${totalNum} ${sustantivo} cumplidas`] : [textoVacio];
  if (pendientes > 0) partes.push(`${pendientes} pendiente${pendientes === 1 ? "" : "s"}`);
  if (vencidasNum > 0) partes.push(`${vencidasNum} vencida${vencidasNum === 1 ? "" : "s"}`);
  if (enRiesgo) partes.push("sin avance: riesgo");
  return {
    hechas: hechasNum,
    total: totalNum,
    pendientes,
    vencidas: vencidasNum,
    riesgo: enRiesgo,
    completo,
    tono: tonoCanonico(tono),
    porcentaje,
    etiqueta,
    detalle: partes.join(" \xB7 ")
  };
}
function ProgresoChecklist({
  hechas = 0,
  total = 0,
  /** Pendientes ya vencidas (la pantalla las cuenta con su calendario real). */
  vencidas = 0,
  /** Checklist de un trabajo próximo sin ningún avance. */
  riesgo = false,
  /** Sustantivo del conteo («tareas», «ítems», «pass»). */
  sustantivo = "tareas",
  /** Muestra el porcentaje a la derecha del conteo. */
  porcentaje = true,
  /** Muestra el detalle de pendientes/vencidas debajo de la barra. */
  mostrarDetalle = true,
  /** Altura de la barra (`sm`, `md`, `lg`). */
  alto = "md",
  textoVacio = "Sin datos",
  className
}) {
  const avance = progresoChecklist({ hechas, total, vencidas, riesgo, sustantivo, textoVacio });
  const tonoTexto = avance.tono === "ok" ? "text-ok-text" : avance.tono === "bad" ? "text-bad-text" : avance.tono === "warn" ? "text-warn-text" : "text-fore";
  const hayDetalle = avance.vencidas > 0 || avance.riesgo;
  return /* @__PURE__ */ jsxs90("div", { className: cn("min-w-0", className), children: [
    /* @__PURE__ */ jsxs90("div", { className: "flex items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ jsx109("span", { className: cn("min-w-0 truncate text-xs font-semibold", avance.total > 0 ? tonoTexto : "text-mute"), title: avance.detalle, children: avance.etiqueta }),
      porcentaje && avance.total > 0 && /* @__PURE__ */ jsxs90("span", { className: "shrink-0 text-xs tabular-nums text-mute", children: [
        avance.porcentaje,
        "%"
      ] })
    ] }),
    avance.total > 0 && /* @__PURE__ */ jsx109(BarraProgreso, { valor: avance.hechas, max: avance.total, tono: avance.tono, alto, etiqueta: avance.detalle, className: "mt-1.5" }),
    mostrarDetalle && hayDetalle && /* @__PURE__ */ jsxs90("p", { className: "mt-1 text-[11px] text-mute", children: [
      avance.riesgo && /* @__PURE__ */ jsx109("span", { className: "text-bad-text", children: "Sin avance" }),
      avance.riesgo && avance.vencidas > 0 && " \xB7 ",
      avance.vencidas > 0 && /* @__PURE__ */ jsxs90("span", { className: "text-warn-text", children: [
        avance.vencidas,
        " vencida",
        avance.vencidas === 1 ? "" : "s"
      ] })
    ] })
  ] });
}

// src/components/CargaIA.jsx
import { useEffect as useEffect24, useId as useId23, useMemo as useMemo16, useRef as useRef22, useState as useState36 } from "react";

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

// src/components/CargaIA.jsx
import { Fragment as Fragment18, jsx as jsx110, jsxs as jsxs91 } from "react/jsx-runtime";
var PLACEHOLDER = "Ejemplo:\nNombre Apellido \u2014 0981 123 456, correo@ejemplo.com\nProducto: pantalla LED 3x2, cantidad 4, precio 1.500.000";
var listar = (cantidad, singular, plural) => `${cantidad} ${cantidad === 1 ? singular : plural}`;
function mensajeDeError(falla, respaldo) {
  const texto = falla instanceof Error ? falla.message : typeof falla === "string" ? falla : "";
  return texto.trim() || respaldo;
}
function BotonCargaIA({ onAbrir, texto = IA_BOTON, tooltip = IA_TOOLTIP, className, ...props }) {
  return /* @__PURE__ */ jsxs91(
    "button",
    {
      type: "button",
      onClick: onAbrir,
      "aria-label": texto,
      "aria-haspopup": "dialog",
      title: tooltip,
      className: cn(
        "inline-flex h-11 select-none items-center gap-2 rounded-lg border border-ink-500 px-3 text-sm text-mute transition md:h-9",
        "hover:border-fono hover:bg-fono/10 hover:text-fore",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx110(Icon, { name: "sparkles", className: "h-4 w-4" }),
        /* @__PURE__ */ jsx110("span", { className: "hidden sm:inline", children: texto })
      ]
    }
  );
}
function CargaIA({
  esquema,
  analizar,
  crear,
  consultarConfig,
  enlacePrivacidad,
  texto,
  tooltip,
  titulo: titulo2,
  placeholder,
  maxTexto,
  maxRegistros,
  className,
  classNameBoton
}) {
  const [abierto, setAbierto] = useState36(false);
  const [montado, setMontado] = useState36(false);
  function abrir() {
    setMontado(true);
    setAbierto(true);
  }
  return /* @__PURE__ */ jsxs91(Fragment18, { children: [
    /* @__PURE__ */ jsx110(BotonCargaIA, { onAbrir: abrir, texto, tooltip, className: classNameBoton }),
    montado ? /* @__PURE__ */ jsx110(
      DialogoCargaIA,
      {
        abierto,
        onCerrar: () => setAbierto(false),
        esquema,
        analizar,
        crear,
        consultarConfig,
        enlacePrivacidad,
        titulo: titulo2,
        placeholder,
        maxTexto,
        maxRegistros,
        className
      }
    ) : null
  ] });
}
function CampoRegistroIA({ campo, registro, error, disabled, onCambiar }) {
  const id = useId23();
  const htmlFor = `${id}-${campo.id}`;
  const descripcionId = campo.ayuda || error ? `${htmlFor}-descripcion` : void 0;
  const valor = registro.valores?.[campo.id];
  const obligatorio = Boolean(campo.obligatorio);
  const comunes = {
    id: htmlFor,
    disabled,
    required: obligatorio,
    "aria-describedby": descripcionId
  };
  let control;
  if (campo.tipo === "moneda") {
    control = /* @__PURE__ */ jsx110(
      MoneyInput,
      {
        ...comunes,
        currency: campo.moneda || "PYG",
        value: valor ?? "",
        onValueChange: (siguiente) => onCambiar(siguiente)
      }
    );
  } else if (campo.tipo === "select") {
    control = /* @__PURE__ */ jsxs91(
      Select,
      {
        ...comunes,
        value: valor === null || valor === void 0 ? "" : String(valor),
        onChange: (evento) => onCambiar(evento.target.value),
        children: [
          /* @__PURE__ */ jsx110("option", { value: "", children: "\u2014 Eleg\xED \u2014" }),
          opcionesDeCampoIA(campo).map((opcion) => /* @__PURE__ */ jsx110("option", { value: opcion.value, children: opcion.label }, opcion.value))
        ]
      }
    );
  } else if (campo.tipo === "fecha") {
    control = /* @__PURE__ */ jsx110(Input, { ...comunes, type: "date", value: valor || "", onChange: (evento) => onCambiar(evento.target.value) });
  } else if (campo.tipo === "numero") {
    control = /* @__PURE__ */ jsx110(
      Input,
      {
        ...comunes,
        inputMode: "numeric",
        value: valor ?? "",
        maxLength: campo.maxLargo,
        onChange: (evento) => onCambiar(evento.target.value.replace(/[^\d]/g, ""))
      }
    );
  } else {
    control = /* @__PURE__ */ jsx110(
      Input,
      {
        ...comunes,
        value: valor ?? "",
        maxLength: campo.maxLargo,
        onChange: (evento) => onCambiar(evento.target.value)
      }
    );
  }
  return /* @__PURE__ */ jsx110(
    FormField,
    {
      label: /* @__PURE__ */ jsxs91(Fragment18, { children: [
        campo.label,
        obligatorio ? /* @__PURE__ */ jsxs91("span", { "aria-hidden": "true", className: "text-bad-text", children: [
          " ",
          "*"
        ] }) : null
      ] }),
      hint: campo.ayuda,
      error,
      htmlFor,
      descripcionId,
      children: control
    }
  );
}
function TarjetaRegistroIA({ registro, tipo, errores, onCambiar, onIncluir }) {
  const titulo2 = tituloDeRegistroIA(registro, tipo);
  return /* @__PURE__ */ jsxs91(
    "article",
    {
      "aria-label": titulo2,
      className: cn("rounded-xl border border-ink-600 bg-ink-800/40 p-3 sm:p-4", !registro.incluir && "opacity-60"),
      children: [
        /* @__PURE__ */ jsxs91("header", { className: "mb-3 flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsx110("p", { className: "min-w-0 flex-1 break-words text-sm font-semibold text-fore", children: titulo2 }),
          /* @__PURE__ */ jsxs91("label", { className: "flex shrink-0 cursor-pointer items-center gap-2 text-xs text-mute", children: [
            /* @__PURE__ */ jsx110("span", { className: "hidden sm:inline", children: registro.incluir ? "Incluir" : "Descartado" }),
            /* @__PURE__ */ jsx110(
              Switch,
              {
                checked: Boolean(registro.incluir),
                ariaLabel: `Incluir ${titulo2}`,
                onChange: (evento) => onIncluir(evento.target.checked)
              }
            )
          ] })
        ] }),
        registro.avisos?.length > 0 ? /* @__PURE__ */ jsx110(Nota, { tono: "warn", compact: true, className: "mb-3", children: registro.avisos.join(" ") }) : null,
        /* @__PURE__ */ jsx110("div", { className: "grid gap-3 sm:grid-cols-2", children: (tipo?.campos ?? []).map((campo) => /* @__PURE__ */ jsx110(
          CampoRegistroIA,
          {
            campo,
            registro,
            error: errores?.[campo.id],
            disabled: !registro.incluir,
            onCambiar: (valor) => onCambiar(campo.id, valor)
          },
          campo.id
        )) })
      ]
    }
  );
}
function DialogoCargaIA({
  abierto,
  onCerrar,
  esquema,
  analizar,
  crear,
  consultarConfig,
  enlacePrivacidad = "/privacidad",
  titulo: titulo2 = IA_TITULO,
  placeholder = PLACEHOLDER,
  maxTexto = IA_TEXTO_MAX,
  maxRegistros = IA_REGISTROS_MAX,
  className
}) {
  const idTexto = useId23();
  const consultarRef = useRef22(consultarConfig);
  consultarRef.current = consultarConfig;
  const [config, setConfig] = useState36(() => consultarConfig ? null : { configurada: true, modelo: null });
  const [configError, setConfigError] = useState36("");
  const [reintento, setReintento] = useState36(0);
  const [entrada3, setEntrada] = useState36("");
  const [fase, setFase] = useState36("entrada");
  const [analizando, setAnalizando] = useState36(false);
  const [creando, setCreando] = useState36(false);
  const [error, setError] = useState36("");
  const [avisos, setAvisos] = useState36([]);
  const [registros, setRegistros] = useState36([]);
  const [resultado, setResultado] = useState36(null);
  const [intento, setIntento] = useState36(false);
  const topeTexto = Number.isFinite(Number(maxTexto)) && Number(maxTexto) > 0 ? Math.floor(Number(maxTexto)) : IA_TEXTO_MAX;
  const topeRegistros = Number.isFinite(Number(maxRegistros)) && Number(maxRegistros) > 0 ? Math.floor(Number(maxRegistros)) : IA_REGISTROS_MAX;
  const idsEsquema = (esquema?.tipos ?? []).map((tipo) => tipo?.id).filter(Boolean);
  const permitidos = config?.tipos ? config.tipos.filter((id) => idsEsquema.includes(id)) : idsEsquema;
  useEffect24(() => {
    if (!abierto) return void 0;
    setEntrada("");
    setFase("entrada");
    setAnalizando(false);
    setCreando(false);
    setError("");
    setAvisos([]);
    setRegistros([]);
    setResultado(null);
    setIntento(false);
    setConfigError("");
    const consultar = consultarRef.current;
    if (!consultar) {
      setConfig({ configurada: true, modelo: null });
      return void 0;
    }
    setConfig(null);
    let vigente = true;
    Promise.resolve().then(() => consultar()).then((respuesta) => {
      if (!vigente) return;
      setConfig({
        configurada: Boolean(respuesta?.configurada),
        modelo: respuesta?.modelo ?? null,
        tipos: Array.isArray(respuesta?.tipos) ? respuesta.tipos : void 0
      });
    }).catch((falla) => {
      if (!vigente) return;
      setConfigError(mensajeDeError(falla, "No pudimos consultar el estado del asistente."));
    });
    return () => {
      vigente = false;
    };
  }, [abierto, reintento]);
  const grupos = useMemo16(
    () => (esquema?.tipos ?? []).map((tipo) => ({ tipo, registros: registros.filter((registro) => registro.tipo === tipo.id) })).filter((grupo) => grupo.registros.length > 0),
    [esquema, registros]
  );
  const incluidos = registrosIncluidosIA(registros);
  const totalIncluidos = incluidos.length;
  const valido = useMemo16(() => validarRegistrosIA(registros, esquema), [registros, esquema]);
  const partes = grupos.map(
    ({ tipo, registros: delTipo }) => listar(delTipo.length, tipo.singular || tipo.label.toLowerCase(), tipo.plural || tipo.label.toLowerCase())
  );
  function cambiarValor(registroId, campoId, valor) {
    setRegistros(
      (actuales) => actuales.map(
        (registro) => registro.id === registroId ? { ...registro, valores: { ...registro.valores, [campoId]: valor } } : registro
      )
    );
  }
  function cambiarInclusion(registroId, incluir) {
    setRegistros((actuales) => actuales.map((registro) => registro.id === registroId ? { ...registro, incluir } : registro));
  }
  async function analizarTexto() {
    const limpio = entrada3.trim();
    if (!limpio || analizando) return;
    setAnalizando(true);
    setError("");
    try {
      const respuesta = await analizar?.(limpio, permitidos);
      const normalizado = normalizarAnalisisIA(respuesta, esquema, { maxRegistros: topeRegistros });
      setAvisos(normalizado.avisos);
      setRegistros(normalizado.registros);
      setResultado(null);
      setIntento(false);
      setFase("revision");
    } catch (falla) {
      setError(mensajeDeError(falla, "No pudimos analizar el texto. Prob\xE1 de nuevo."));
    } finally {
      setAnalizando(false);
    }
  }
  async function crearTodo() {
    if (creando) return;
    const mandados = registrosIncluidosIA(registros);
    if (mandados.length === 0) return;
    setIntento(true);
    const revision = validarRegistrosIA(registros, esquema);
    if (!revision.valido) {
      setError("Complet\xE1 los campos obligatorios marcados.");
      return;
    }
    setCreando(true);
    setError("");
    try {
      const limpios = mandados.map((registro) => ({
        id: registro.id,
        tipo: registro.tipo,
        valores: { ...registro.valores }
      }));
      const respuesta = await crear?.(limpios);
      setResultado(normalizarResultadoIA(respuesta, { total: limpios.length }));
      setFase("listo");
    } catch (falla) {
      setError(mensajeDeError(falla, "No pudimos crear los registros. Prob\xE1 de nuevo."));
    } finally {
      setCreando(false);
    }
  }
  function cargarOtroTexto() {
    setEntrada("");
    setRegistros([]);
    setAvisos([]);
    setResultado(null);
    setError("");
    setIntento(false);
    setFase("entrada");
  }
  const pista = [
    "Peg\xE1 mensajes, listas o cat\xE1logos",
    permitidos.length > 0 ? `(${permitidos.map((id) => tipoDeEsquemaIA(esquema, id)?.label?.toLowerCase()).filter(Boolean).join(", ")} a la vez).` : "",
    `M\xE1ximo ${topeTexto.toLocaleString("es-PY")} caracteres.`
  ].filter(Boolean).join(" ");
  const resumen = resultado ? {
    creados: resultado.creados,
    total: resultado.total,
    errores: resultado.errores,
    advertencias: resultado.advertencias
  } : null;
  return /* @__PURE__ */ jsxs91(
    Modal,
    {
      open: Boolean(abierto),
      onClose: onCerrar,
      title: titulo2,
      size: "completo",
      busy: analizando || creando,
      className,
      children: [
        config === null && !configError ? /* @__PURE__ */ jsxs91("div", { className: "space-y-3", role: "status", "aria-busy": "true", children: [
          /* @__PURE__ */ jsx110(Skeleton, { className: "h-4 w-40" }),
          /* @__PURE__ */ jsx110(Skeleton, { className: "h-24 w-full" }),
          /* @__PURE__ */ jsx110("p", { className: "text-sm text-mute", children: "Consultando la configuraci\xF3n\u2026" })
        ] }) : null,
        configError ? /* @__PURE__ */ jsxs91("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx110(Aviso, { tono: "error", children: configError }),
          /* @__PURE__ */ jsxs91(FormActions, { children: [
            /* @__PURE__ */ jsx110(Button, { type: "button", variant: "ghost", onClick: onCerrar, children: "Cancelar" }),
            /* @__PURE__ */ jsx110(Button, { type: "button", variant: "primary", onClick: () => setReintento((valor) => valor + 1), children: "Reintentar" })
          ] })
        ] }) : null,
        config && !config.configurada ? /* @__PURE__ */ jsxs91("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx110(Nota, { tono: "warn", children: "La IA no est\xE1 configurada en este servidor. Mientras tanto, los registros se cargan a mano desde cada m\xF3dulo, sin perder nada." }),
          /* @__PURE__ */ jsx110("p", { className: "text-sm text-mute", children: "Cuando la app tenga proveedor configurado, este asistente vuelve solo." }),
          /* @__PURE__ */ jsxs91(FormActions, { children: [
            consultarConfig ? /* @__PURE__ */ jsx110(Button, { type: "button", variant: "outline", onClick: () => setReintento((valor) => valor + 1), children: "Volver a chequear" }) : null,
            /* @__PURE__ */ jsx110(Button, { type: "button", variant: "primary", onClick: onCerrar, children: "Entendido" })
          ] })
        ] }) : null,
        config?.configurada && permitidos.length === 0 ? /* @__PURE__ */ jsxs91("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx110(Nota, { tono: "warn", children: "No ten\xE9s permiso para crear ninguno de los tipos de este asistente." }),
          /* @__PURE__ */ jsx110(FormActions, { children: /* @__PURE__ */ jsx110(Button, { type: "button", variant: "primary", onClick: onCerrar, children: "Entendido" }) })
        ] }) : null,
        config?.configurada && permitidos.length > 0 && fase === "entrada" ? /* @__PURE__ */ jsxs91(
          "form",
          {
            className: "space-y-4",
            onSubmit: (evento) => {
              evento.preventDefault();
              void analizarTexto();
            },
            children: [
              /* @__PURE__ */ jsxs91("div", { children: [
                /* @__PURE__ */ jsx110(FormField, { label: "Texto para cargar", htmlFor: idTexto, hint: pista, children: /* @__PURE__ */ jsx110(
                  Textarea,
                  {
                    id: idTexto,
                    rows: 10,
                    maxLength: topeTexto,
                    value: entrada3,
                    disabled: analizando,
                    placeholder,
                    "aria-describedby": `${idTexto}-descripcion`,
                    onChange: (evento) => setEntrada(evento.target.value)
                  }
                ) }),
                /* @__PURE__ */ jsxs91("p", { className: "mt-1.5 text-right text-xs text-mute", children: [
                  entrada3.length.toLocaleString("es-PY"),
                  " / ",
                  topeTexto.toLocaleString("es-PY")
                ] })
              ] }),
              /* @__PURE__ */ jsxs91("p", { className: "text-xs leading-5 text-mute", children: [
                "Se manda solo este texto al proveedor de IA configurado",
                config.modelo ? ` (${config.modelo})` : "",
                " para armar la vista previa; no se guarda ni se toca la base.",
                " ",
                enlacePrivacidad ? /* @__PURE__ */ jsx110(
                  "a",
                  {
                    className: "font-medium text-fono-light underline-offset-2 hover:underline",
                    href: enlacePrivacidad,
                    target: "_blank",
                    rel: "noreferrer",
                    children: "Pol\xEDtica de privacidad"
                  }
                ) : null
              ] }),
              error ? /* @__PURE__ */ jsx110(Aviso, { tono: "error", children: error }) : null,
              /* @__PURE__ */ jsxs91(FormActions, { children: [
                /* @__PURE__ */ jsx110(Button, { type: "button", variant: "ghost", onClick: onCerrar, disabled: analizando, children: "Cancelar" }),
                /* @__PURE__ */ jsx110(Button, { type: "submit", variant: "primary", disabled: !entrada3.trim() || analizando, children: analizando ? "Analizando\u2026" : "Analizar con IA" })
              ] })
            ]
          }
        ) : null,
        config?.configurada && permitidos.length > 0 && fase === "revision" ? /* @__PURE__ */ jsxs91("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx110("p", { className: "text-sm text-mute", children: grupos.length > 0 ? /* @__PURE__ */ jsxs91(Fragment18, { children: [
            "Detectamos ",
            /* @__PURE__ */ jsx110("strong", { className: "text-fore", children: partes.join(", ") }),
            ". Revis\xE1, correg\xED o descart\xE1: nada se crea sin tu confirmaci\xF3n."
          ] }) : "No detectamos registros en el texto." }),
          avisos.length > 0 ? /* @__PURE__ */ jsx110(Nota, { tono: "warn", children: avisos.join(" ") }) : null,
          error ? /* @__PURE__ */ jsx110(Aviso, { tono: "error", children: error }) : null,
          grupos.length === 0 ? /* @__PURE__ */ jsx110(
            EmptyState,
            {
              icon: "sparkles",
              title: "No detectamos registros",
              description: "Prob\xE1 con un texto m\xE1s completo (nombres, fechas o precios) o volv\xE9 a pegar."
            }
          ) : null,
          grupos.map(({ tipo, registros: delTipo }) => /* @__PURE__ */ jsxs91("section", { "aria-label": `${tipo.label} detectados (${delTipo.length})`, className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxs91("h3", { className: "text-[10px] font-bold uppercase tracking-wider text-mute", children: [
              tipo.label,
              " ",
              /* @__PURE__ */ jsx110("span", { className: "text-mute/80", children: delTipo.length })
            ] }),
            delTipo.map((registro) => /* @__PURE__ */ jsx110(
              TarjetaRegistroIA,
              {
                registro,
                tipo,
                errores: intento ? valido.errores.get(registro.id) : void 0,
                onCambiar: (campoId, valor) => cambiarValor(registro.id, campoId, valor),
                onIncluir: (incluir) => cambiarInclusion(registro.id, incluir)
              },
              registro.id
            ))
          ] }, tipo.id)),
          /* @__PURE__ */ jsxs91(FormActions, { children: [
            /* @__PURE__ */ jsx110(Button, { type: "button", variant: "ghost", onClick: () => setFase("entrada"), disabled: creando, children: "Volver" }),
            /* @__PURE__ */ jsx110(
              Button,
              {
                type: "button",
                variant: "primary",
                onClick: () => void crearTodo(),
                disabled: creando || totalIncluidos === 0,
                children: creando ? "Creando\u2026" : `Crear todo (${totalIncluidos})`
              }
            )
          ] })
        ] }) : null,
        config?.configurada && permitidos.length > 0 && fase === "listo" && resumen ? /* @__PURE__ */ jsxs91("div", { className: "space-y-4", children: [
          resumen.creados === null ? /* @__PURE__ */ jsx110(Nota, { tono: "info", children: "La app termin\xF3 el alta; el detalle queda en su m\xF3dulo." }) : resumen.creados > 0 ? /* @__PURE__ */ jsx110(Aviso, { tono: "ok", children: resumen.total !== null && resumen.creados < resumen.total ? `Creamos ${resumen.creados} de ${resumen.total} registros.` : `Creamos ${listar(resumen.creados, "registro", "registros")}.` }) : resumen.errores.length === 0 ? /* @__PURE__ */ jsx110(Nota, { tono: "neutro", children: "No se cre\xF3 ning\xFAn registro." }) : null,
          resumen.advertencias.length > 0 ? /* @__PURE__ */ jsx110(Nota, { tono: "warn", children: resumen.advertencias.join(" ") }) : null,
          resumen.errores.length > 0 ? /* @__PURE__ */ jsx110(Aviso, { tono: "error", children: `No pudimos crear ${listar(resumen.errores.length, "registro", "registros")}: ${resumen.errores.join(" \xB7 ")}` }) : null,
          /* @__PURE__ */ jsxs91(FormActions, { children: [
            /* @__PURE__ */ jsx110(Button, { type: "button", variant: "ghost", onClick: cargarOtroTexto, children: "Cargar otro texto" }),
            /* @__PURE__ */ jsx110(Button, { type: "button", variant: "primary", onClick: onCerrar, children: "Listo" })
          ] })
        ] }) : null
      ]
    }
  );
}

// src/hooks/useSingleFlightSubmit.js
import { useCallback as useCallback5, useRef as useRef23, useState as useState37 } from "react";

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
async function completeSave(cerrar, refrescar, { avisar: avisar2 } = {}) {
  cerrar?.();
  try {
    await refrescar?.();
    return true;
  } catch {
    avisar2?.(AVISO_REFRESCO);
    return false;
  }
}

// src/hooks/useSingleFlightSubmit.js
function useSingleFlightSubmit(enviar) {
  const [pendiente, setPendiente] = useState37(false);
  const ultimoEnviar = useRef23(enviar);
  ultimoEnviar.current = enviar;
  const envio = useRef23(null);
  if (!envio.current) {
    envio.current = crearEnvioUnico(async (evento) => {
      setPendiente(true);
      try {
        await ultimoEnviar.current(evento);
      } finally {
        setPendiente(false);
      }
    });
  }
  const onSubmit = useCallback5(async (evento) => {
    evento?.preventDefault?.();
    await envio.current.ejecutar(evento);
  }, []);
  return { pendiente, onSubmit };
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
var TIPO_SOCIETARIO2 = /\b(S\.?A\.?|S\.?R\.?L\.?|S\.?A\.?C\.?I\.?|S\.?A\.?E\.?|S\.?A\.?S\.?|LTDA\.?|E\.?A\.?S\.?|C[IÍ]A\.?|SOCIEDAD|EMPRESA|COMPA[ÑN][IÍ]A|COOPERATIVA|FUNDACI[OÓ]N|ASOCIACI[OÓ]N|MUNICIPALIDAD|GOBERNACI[OÓ]N|MINISTERIO|UNIVERSIDAD|COLEGIO|CONSORCIO)\b/i;
function esRazonSocial(texto) {
  return TIPO_SOCIETARIO2.test(String(texto || ""));
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
  const minimo = tipo === "corta";
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
  if (minimo) {
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
  if (!minimo) pie();
  t.avanza(2).corte(corte);
  return { base64: () => t.base64(), lineas: () => t.lineas(), ref, validacion, sufijo, validador, corte: t.corteEnviado() };
}
function paginaDePruebaSimple(opciones = {}) {
  return paginaDePrueba({ ...opciones, tipo: "caracteres" });
}
export {
  ANCHOS_PAPEL,
  ANCHOS_PRUEBA,
  AVANCES_FIRMA,
  AVISO_REFRESCO,
  AjustesImpresion,
  AuthLayout,
  Avatar,
  Aviso,
  AvisoPrivacidad,
  AyudaModulo,
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  Badge,
  BancoCombobox,
  BancoLogo,
  BarraInferior,
  BarraLote,
  BarraProgreso,
  BloquePago,
  BotonCargaIA,
  BotonDentroCampo,
  BotonImprimir,
  BuscadorCliente,
  BuscadorDispositivo,
  BuscadorPersonas,
  BuscadorProveedor,
  Button,
  CAMPOS_DISPOSITIVO,
  CAMPOS_IA,
  CAPACIDADES_IPHONE,
  CATEGORIAS_ACCESORIOS,
  CATEGORIAS_FUSION,
  CATEGORIAS_PRODUCTO,
  CELDA_DATO,
  CELDA_ENCABEZADO,
  CELDA_IDENTIDAD,
  CELDA_IDENTIDAD_GRANDE,
  CELDA_NUMERO,
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
  CREDITO_PIE,
  CREDITO_PIE_URL,
  Calendario,
  CampanaAvisos,
  CampoSeriales,
  Card,
  CargaIA,
  CeldaMoneda,
  Checkbox,
  ChipEstado,
  ChipFusion,
  ChipOrigen,
  ChipPrioridad,
  ChipsLocks,
  CityAutocomplete,
  CodigoQr,
  ColumnaLote,
  ConfirmDialog,
  ConfirmarConPalabra,
  ConsentimientoDatos,
  ContadorLote,
  ContadoresCompra,
  ConteoChecklist,
  CountryPhoneSelect,
  Cronologia,
  CurrencySelect,
  DEPARTAMENTOS_PARAGUAY,
  DIAS_SEMANA,
  DISPOSITIVOS_MOBILE,
  DOMINIOS_EMAIL,
  DataTable,
  DestinoRecepcion,
  DialogoCargaIA,
  DocumentoImpresion,
  Dot,
  Drawer,
  ESPACIO_BARRA_INFERIOR,
  ESTADOS_CHIP,
  ESTADOS_COMPRA,
  ESTADOS_CUOTA,
  ESTADOS_ENVIO,
  ESTADOS_ITEM,
  ESTADOS_LOCK,
  ESTADOS_NECESIDAD,
  ESTADOS_PRESENCIA,
  ESTADOS_RECEPCION,
  ESTADOS_REVISION,
  ESTADO_IMPRESORA,
  ETIQUETAS_HITO,
  ETIQUETA_ESTADO,
  ETIQUETA_PERIODO,
  ETIQUETA_TRABAJO,
  EXTENSION_IMAGEN,
  EmailField,
  EmptyState,
  ErrorState,
  EstadoBadge,
  EstadoGuardado,
  EtiquetaLote,
  Eyebrow,
  FECHA_VERIFICACION_MARCAS_FINANCIERAS,
  FichaCertificado,
  FilaChecklist,
  FilaDato,
  FilaRevision,
  FormActions,
  FormField,
  GLIFOS_CATEGORIA,
  GRADOS_CONDICION,
  GRILLA_DOS_COLUMNAS,
  GRILLA_DOS_COLUMNAS_COMPACTA,
  GoogleButton,
  GoogleMark,
  GradoBadge,
  GraficoBarras,
  IA_BOTON,
  IA_RATE_LIMIT,
  IA_REGISTROS_MAX,
  IA_TEXTO_MAX,
  IA_TIMEOUT_MS,
  IA_TITULO,
  IA_TOKENS_MAX,
  IA_TOOLTIP,
  ICONOS,
  ICONOS_HITO,
  ICONO_CATEGORIA,
  INCIDENCIAS,
  Icon,
  IconAction,
  IconoCategoria,
  ImporteDelta,
  IndicadorConexion,
  Input,
  InstagramField,
  LIMITE_CUENTAS,
  LIMITE_MONTO_ALMACENABLE,
  LIMITE_MONTO_GENERAL,
  LIMITE_MONTO_VENTAS,
  LOCKS_DISPOSITIVO,
  LOGOS_BANCOS,
  Label,
  ListGridToggle,
  LoadingScreen,
  MARCAS_ACCESORIOS,
  MARCAS_MEDIOS_PAGO,
  MARGEN_VENTANA,
  MEDIOS_CUENTA,
  MEDIOS_PAGO_CON_MARCA,
  MENSAJE_RUC,
  MENSAJE_RUC_CONSULTA,
  MENSAJE_RUC_SIN_DATOS,
  MENSAJE_TELEFONO,
  METODOS_ENVIO,
  MIMES_IMAGEN,
  MODELOS_IPHONE,
  ManifiestoEnvio,
  MedidorBateria,
  MedidorStock,
  MedioPagoLogo,
  MenuDesplegable,
  Modal,
  Money,
  MoneyInput,
  NavLateral,
  NavegacionSeccion,
  Nota,
  NumericKeypad,
  OAuthDivider,
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
  PageHeader,
  PaletaComandos,
  PanelDerecho,
  PasosEquipo,
  PasswordInput,
  PegarEnlaceToken,
  PercentField,
  PeriodoTabs,
  PersonaChip,
  PhoneField,
  PilaPersonas,
  PinInput,
  PlanPagos,
  PreviewFusion,
  ProductCombobox,
  ProductFooter,
  ProductPrefooter,
  ProgresoChecklist,
  QR_OPCIONES,
  ROTULO_DATO,
  ROTULO_SECCION,
  RUC_RE,
  RangoFecha,
  ResumenDestinos,
  ResumenIncidencias,
  ResumenRecepcion,
  RucField,
  SELECTOR_ENFOCABLES,
  SIMBOLOS_CUENTA,
  SIMBOLOS_MONEDA,
  SIMBOLO_PYG,
  SaveActions,
  SearchField_default as SearchField,
  SeccionColapsable,
  SectionState,
  SegmentedField,
  Select,
  SelectorCuentaCobro,
  SelectorIncidencia,
  SemaforoItem,
  SerialField,
  SerialTexto,
  Skeleton,
  Stat,
  Stepper,
  SubidaImagen,
  Subtabs,
  Switch,
  TAMANOS_AVATAR,
  TAMANOS_CAMPO,
  TAMANOS_MODAL,
  TAMANO_MAXIMO_IMAGEN,
  TAMANO_MODAL_PREDETERMINADO,
  TAMANO_OBJETIVO_IMAGEN,
  TEMA_CLARO,
  TEMA_OSCURO,
  TIPOS_PRUEBA,
  TIPOS_TICKET_PRUEBA,
  TONOS,
  TONOS_ALIAS,
  TONOS_HITO,
  TONO_ESTADO,
  TableroKanban,
  TarjetaAjuste,
  TarjetaCompra,
  TarjetaCuentaCobro,
  TarjetaLote,
  TarjetaNecesidad,
  TarjetaRecepcion,
  TaxIdField,
  Textarea,
  ThemeToggle,
  TileEquipo,
  TileRol,
  ToastProvider,
  UMBRAL_BATERIA_ATENCION,
  UMBRAL_BATERIA_OK,
  VARIANTES_CORTE,
  VERSION_APP_RE,
  Vencimiento,
  VistaPreviaPapel,
  agregarEstado,
  agruparHitos,
  agruparPorDia,
  agruparResultados,
  agruparTarjetas,
  anchoParaLargo,
  aplicarTema,
  bloqueFirma,
  buscarCiudad,
  buscarDispositivo,
  buscarEnCatalogo,
  buscarPaisesTelefono,
  campoBuscableCliente,
  campoBuscableCuenta,
  campoDeTipoIA,
  caretTrasDigitos,
  categoriaDe,
  categoriasFusion,
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
  claveTelefonoCliente,
  cn,
  coberturaBancos,
  coberturaMediosPago,
  codigoDeDispositivo,
  codigoPais,
  coincideTelefonoCliente,
  colorBadge,
  colorDeBanco,
  colorDeNombre,
  colorDeTono,
  colorTrabajo,
  columnasDeAncho,
  columnasDelTablero,
  compararVersiones,
  completeSave,
  componerTelefono,
  conFormulario,
  conexionDeDestino,
  contarSinLeer,
  crearEnvioUnico,
  crearIdentidadApp,
  crearPilaCapas,
  crearRegistroPendientes,
  crearTicket,
  departamentoDe,
  destinoDeConexion,
  destinoDeTab,
  destinosDeTarjeta,
  detalleCliente,
  detalleCuentaCobro,
  detalleProveedor,
  diasHasta,
  digitosCliente,
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
  estadoPaleta,
  estadoRecepcion,
  estadoVencimiento,
  etiquetaCompra,
  etiquetaCondicion,
  etiquetaDeCategoria,
  etiquetaDeHito,
  etiquetaDia,
  etiquetaDiaCorta,
  etiquetaDispositivo,
  etiquetaEnvio,
  etiquetaMedioCuenta,
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
  filtrarClientes,
  filtrarCuentasCobro,
  filtrarPersonas,
  filtrarProveedores,
  formatGs,
  formatGsInput,
  formatMoney,
  formatPercent,
  formatUsd,
  formatUsdInput,
  formatoNumero,
  gradoCondicion,
  hayFusion,
  hayVersionNueva,
  hoyClave,
  iconoDeCategoria,
  iconoMedioCuenta,
  iconoMetodoEnvio,
  iconoOrigen,
  identidadDeUsuario,
  imeiValido,
  indiceSemana,
  inicialesDeBanco,
  inicialesDeNombre,
  internationalPhone,
  largoMaximoMonto,
  leerUsoPersonas,
  limiteMonto,
  limpiarDependientes,
  limpiarPercent,
  limpiarTaxId,
  logoDeBanco,
  logoDeMedioPago,
  maximoDeBarras,
  metodoEnvio,
  mimeDeImagen,
  mismoMes,
  montoConSigno,
  montoGs,
  montoTexto,
  montoUsd,
  motivoDeDiagnostico,
  motivosDuplicadoCliente,
  nombreDeDispositivo,
  nombrePartes,
  nombreProveedor,
  normalizarAnalisisIA,
  normalizarBanco,
  normalizarBusqueda,
  normalizarCategoria,
  normalizarInstagram,
  normalizarMarcaPago,
  normalizarMontoInput,
  normalizarNombre,
  normalizarPersonaTexto,
  normalizarProveedor,
  normalizarResultadoIA,
  normalizarSerial,
  normalizarSeriales,
  normalizarTelefono,
  normalizeTaxId,
  numeroParcialCuenta,
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
  parsePercent,
  parseTelefono,
  parseTelefonoInternacional,
  parseUsdInput,
  partesVersion,
  partirSerial,
  payloadPush,
  periodoDeRango,
  plantillaDePrueba,
  porcentajeBarra,
  prepararImagen,
  preseleccionDeCuenta,
  primerNombre,
  prioridadDe,
  progresoChecklist,
  puntoDeTono,
  qrDataUrl,
  rangoDePeriodo,
  rangoInvertido,
  rangoMes,
  rangoSemana,
  registrarUsoPersona,
  registroConsentimiento,
  registrosIncluidosIA,
  repartirLinea,
  resolverRecientes,
  resumenPresencia,
  rutaDeAviso,
  separarSeriales,
  serialEnmascarado,
  signoDe,
  simboloCuenta,
  soloDigitos,
  sugerenciasDe,
  sugerenciasDeBanco,
  sumarDias,
  sumarMeses,
  taxIdGenericoValid,
  taxIdValid,
  taxIdValidoParaPais,
  telefonoE164,
  telefonoInternacionalValido,
  telefonoValido,
  telefonoVisible,
  textoContador,
  textoDeTono,
  textoVerificacion,
  tipoDeEsquemaIA,
  tituloDeRegistroIA,
  tonoBateria,
  tonoCanonico,
  tonoCompra,
  tonoDelta,
  tonoEnvio,
  tonoNecesidad,
  tonoOrigen,
  tonoPrioridad,
  tonoRecepcion,
  tonoRevision,
  tonoVencimiento,
  ultimos4,
  useComboboxNavigation,
  useDialogClose,
  useDialogFocusTrap,
  useDialogPending,
  useSingleFlightSubmit,
  useTableroOptimista,
  useToast,
  validarImagen,
  validarRegistrosIA,
  valorVacioIA,
  ventanaDeLista,
  whatsappUrl
};
//# sourceMappingURL=index.js.map
