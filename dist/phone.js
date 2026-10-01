"use client"

// src/components/PhoneField.jsx
import { useMemo as useMemo3, useState as useState3 } from "react";

// src/components/ui.jsx
import { Children, cloneElement, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

// src/utils/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/utils/moneda.js
var GS_FORMATTER = new Intl.NumberFormat("es-PY", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});
var SIMBOLOS_MONEDA = { PYG: "Gs", USD: "US$", BRL: "R$", EUR: "\u20AC", USDT: "USDT" };
var LIMITE_MONTO_GENERAL = 1e10;
function excedeMonto(value, limite = LIMITE_MONTO_GENERAL) {
  const texto = String(value ?? "").trim().replace(/\./g, "").replace(",", ".");
  if (!texto) return false;
  const numero = Number(texto);
  return Number.isFinite(numero) && Math.abs(numero) > limite;
}
var USD_FORMATTER = new Intl.NumberFormat("es-PY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function formatGsInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? GS_FORMATTER.format(Number(digits)) : "";
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
function largoMaximoMonto(max = LIMITE_MONTO_GENERAL, { decimales = false } = {}) {
  const digitos = String(Math.trunc(Math.abs(Number(max) || 0))).length;
  const separadores = Math.floor((digitos - 1) / 3);
  return digitos + separadores + (decimales ? 3 : 0);
}
var NUMEROS_FORMATTER = new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 });

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

// src/components/ui.jsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var Input = forwardRef(function Input2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx(
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
var MoneyInput = forwardRef(function MoneyInput2({ currency = "PYG", symbol, value, onValueChange, className, max = LIMITE_MONTO_GENERAL, maxLength, integerOnly = false, onKeyDown, ...props }, ref) {
  const soloEnteros = currency === "PYG" || integerOnly;
  const prefix = String(symbol ?? "").trim() || SIMBOLOS_MONEDA[currency] || currency;
  const display = soloEnteros ? formatGsInput(String(value ?? "").split(".")[0]) : formatUsdInput(value);
  const excede = excedeMonto(value, max);
  const inputRef = useRef(null);
  const establecerRef = useCallback((node) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);
  const topeLargo = maxLength ?? largoMaximoMonto(max, { decimales: !soloEnteros });
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-xs font-semibold text-mute", children: prefix }),
    /* @__PURE__ */ jsx(
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
var ContextoDialogo = createContext(null);
var ContextoPie = createContext(null);
var ToastContext = createContext(null);

// src/components/CountryPhoneSelect.jsx
import { useEffect as useEffect2, useId as useId2, useMemo as useMemo2, useRef as useRef2, useState as useState2 } from "react";

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
  return countries.flatMap((entrada) => {
    if (typeof entrada === "object" && entrada?.custom === true) {
      const country = String(entrada.country || "").trim();
      const countryCode = `+${String(entrada.countryCode || "").replace(/\D/g, "")}`;
      if (!country || countryCode === "+" || vistos.has(country)) return [];
      vistos.add(country);
      return [Object.freeze({
        country,
        countryCode,
        name: String(entrada.name || `C\xF3digo internacional ${countryCode}`),
        flag: String(entrada.flag || "\u{1F310}"),
        custom: true
      })];
    }
    const iso = isoValido(typeof entrada === "string" ? entrada : entrada?.country);
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
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
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
  const reactId = useId2();
  const baseId = id || `pais-telefono-${reactId.replace(/:/g, "")}`;
  const listId = `${baseId}-lista`;
  const triggerRef = useRef2(null);
  const searchRef = useRef2(null);
  const rootRef = useRef2(null);
  const [open, setOpen] = useState2(false);
  const [query, setQuery] = useState2("");
  const [activeIndex, setActiveIndex] = useState2(0);
  const catalog = useMemo2(() => {
    const base = resolverPaisesTelefono(countries, locale);
    if (!customCountry?.countryCode) return base;
    return [customCountry, ...base.filter((pais) => pais.country !== customCountry.country)];
  }, [countries, customCountry, locale]);
  const selected = catalog.find((pais) => pais.country === country) || paisTelefonoPorIso(country, locale) || paisTelefonoPorIso("PY", locale);
  const options = useMemo2(() => buscarPaisesTelefono(query, catalog, locale), [catalog, locale, query]);
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
  useEffect2(() => {
    if (!open) return void 0;
    searchRef.current?.focus();
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);
  useEffect2(() => {
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
  return /* @__PURE__ */ jsxs2("div", { ref: rootRef, className: `relative w-24 shrink-0 ${className || ""}`.trim(), children: [
    /* @__PURE__ */ jsxs2(
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
          /* @__PURE__ */ jsx2("span", { "aria-hidden": "true", className: "text-base leading-none", children: selected.flag }),
          /* @__PURE__ */ jsx2("span", { className: "tabular-nums", children: selected.countryCode }),
          /* @__PURE__ */ jsx2("span", { "aria-hidden": "true", className: "text-[10px] text-mute", children: "\u25BE" })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsxs2("div", { className: "absolute left-0 top-full z-50 mt-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-ink-500 bg-ink-800 shadow-xl", children: [
      /* @__PURE__ */ jsx2("div", { className: "p-2", children: /* @__PURE__ */ jsx2(
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
      /* @__PURE__ */ jsx2("ul", { id: listId, role: "listbox", "aria-label": "Pa\xEDses", className: "max-h-64 overflow-y-auto p-1", children: options.map((pais, index) => /* @__PURE__ */ jsxs2(
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
            /* @__PURE__ */ jsx2("span", { "aria-hidden": "true", className: "text-lg leading-none", children: pais.flag }),
            /* @__PURE__ */ jsx2("span", { className: "min-w-0 flex-1 truncate text-left", children: pais.name }),
            /* @__PURE__ */ jsx2("span", { className: "text-xs font-medium uppercase text-mute", children: pais.country }),
            /* @__PURE__ */ jsx2("span", { className: "tabular-nums text-fore", children: pais.countryCode })
          ]
        },
        pais.country
      )) }),
      !options.length ? /* @__PURE__ */ jsx2("p", { role: "status", "aria-live": "polite", className: "px-3 py-4 text-center text-sm text-mute", children: "No se encontraron pa\xEDses" }) : null
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
  const entrada = /^00/.test(texto) ? `+${texto.replace(/^00[\s.-]*/, "")}` : texto;
  const paisPreferido = paisTelefonoPorIso(country) || paisTelefonoPorIso("PY");
  const parsed = parsePhoneNumberFromString(entrada, internacional ? void 0 : paisPreferido.country);
  if (parsed) {
    const countryCode = `+${parsed.countryCallingCode}`;
    const pais = paisCompatible(paisPreferido.country, countryCode) || parsed.country || paisesDeCodigo(countryCode)[0]?.country || paisPreferido.country;
    const phone = parsed.nationalNumber || "";
    const pyValido = pais !== "PY" || /^9\d{8}$/.test(phone);
    const isValid = parsed.isValid() && pyValido;
    return { country: pais, countryCode, phone, e164: isValid ? parsed.number : "", isValid };
  }
  if (internacional) {
    const digitos = entrada.replace(/\D/g, "");
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
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
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
  const catalog = useMemo3(() => catalogoDelCampo(countries, codigos, locale), [codigos, countries, locale]);
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
  const [paisInterno, setPaisInterno] = useState3(() => paisControlado?.country || paisesCompatibles[0]?.country || paisDesconocido?.country || "PY");
  const paisInternoCompatible = paisTelefonoPorIso(paisInterno, locale)?.countryCode === codigoControlado;
  const paisSeleccionado = paisControlado?.country || (paisDesconocido ? paisDesconocido.country : null) || (paisInternoCompatible ? paisInterno : paisesCompatibles[0]?.country) || "PY";
  const [tocado, setTocado] = useState3(false);
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
  return /* @__PURE__ */ jsxs3("div", { className, children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx3(
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
      /* @__PURE__ */ jsx3(
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
    invalido ? /* @__PURE__ */ jsx3("span", { id: errorId, role: "alert", className: "block pt-1 text-[11px] text-bad-text", children: mensajeInvalido }) : null
  ] });
}
export {
  CODIGOS_PAIS,
  CountryPhoneSelect,
  MENSAJE_TELEFONO,
  PAISES_TELEFONO,
  PhoneField,
  buscarPaisesTelefono,
  codigoPais,
  componerTelefono,
  internationalPhone,
  normalizarTelefono,
  paisTelefonoPorIso,
  paisesDeCodigo,
  parseTelefono,
  parseTelefonoInternacional,
  soloDigitos,
  telefonoE164,
  telefonoInternacionalValido,
  telefonoValido,
  telefonoVisible,
  whatsappUrl
};
//# sourceMappingURL=phone.js.map
