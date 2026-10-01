/**
 * Preset de Tailwind de OwnCoding UI.
 *
 * Uso en la app:
 *   // tailwind.config.js
 *   import preset, { owncodingContent } from 'owncoding-ui/tailwind-preset'
 *   export default { presets: [preset], content: [...owncodingContent, './src'] }
 *
 * ⚠️ Tailwind 3.4 **ignora** el `content` que declara un preset
 * (`normalizeConfig` arma la lista solo con el config del proyecto): si la app
 * no suma `owncodingContent`, Tailwind purga las clases de los objetos
 * compartidos y los íconos salen gigantes sin ningún error. Por eso la ruta
 * tiene que vivir en el `content` de la app. `owncodingContent` trae el bundle
 * (`dist`) y las fuentes (`src`), así funciona también con `--ignore-scripts`
 * o si se copia el paquete sin build.
 *
 * La paleta sale de CSS vars (`--c-*`), así cada app cambia su acento sin
 * tocar la librería: definí los valores en `:root` y `.dark`. Ver
 * `owncoding-ui/styles.css` (o `tokens.css`) para los valores de referencia.
 */

/** Rutas que la app suma a su `content`; se resuelven desde su raíz. */
export const owncodingContent = [
  './node_modules/owncoding-ui/dist/**/*.js',
  './node_modules/owncoding-ui/src/**/*.jsx',
]

export default {
  darkMode: 'class',
  // Se declara por si otra herramienta respeta el `content` del preset; en
  // Tailwind 3.4 la app **tiene** que sumar `owncodingContent` a su lista.
  content: owncodingContent,
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        fore: 'rgb(var(--c-fore) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          950: 'rgb(var(--c-ink-950) / <alpha-value>)',
          900: 'rgb(var(--c-ink-900) / <alpha-value>)',
          800: 'rgb(var(--c-ink-800) / <alpha-value>)',
          700: 'rgb(var(--c-ink-700) / <alpha-value>)',
          600: 'rgb(var(--c-ink-600) / <alpha-value>)',
          500: 'rgb(var(--c-ink-500) / <alpha-value>)',
        },
        // Acento de la app (token fono, configurable por CSS var)
        fono: {
          DEFAULT: 'rgb(var(--c-fono) / <alpha-value>)',
          dark: 'rgb(var(--c-fono-dark) / <alpha-value>)',
          light: 'rgb(var(--c-fono-light) / <alpha-value>)',
          text: 'rgb(var(--c-fono-text) / <alpha-value>)',
          glow: 'rgb(var(--c-fono-glow) / <alpha-value>)',
          soft: 'rgb(var(--c-fono) / .12)',
        },
        // Los tonos base son para relleno/punto/borde; `.text` es el par de
        // texto sobre relleno tenue (#5), medido ≥4.5:1 (ver tokens.css).
        ok: {
          DEFAULT: 'rgb(var(--c-ok) / <alpha-value>)',
          text: 'rgb(var(--c-ok-text) / <alpha-value>)',
        },
        bad: {
          DEFAULT: 'rgb(var(--c-bad) / <alpha-value>)',
          text: 'rgb(var(--c-bad-text) / <alpha-value>)',
        },
        warn: {
          DEFAULT: 'rgb(var(--c-warn) / <alpha-value>)',
          text: 'rgb(var(--c-warn-text) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--c-info) / <alpha-value>)',
          text: 'rgb(var(--c-info-text) / <alpha-value>)',
        },
        reserved: 'rgb(var(--c-reserved) / <alpha-value>)',
        // Verde pass/certificado y azul acción del tema consola (épica #241)
        pass: {
          DEFAULT: 'rgb(var(--c-pass) / <alpha-value>)',
          dark: 'rgb(var(--c-pass-dark) / <alpha-value>)',
          soft: 'rgb(var(--c-pass-soft) / <alpha-value>)',
          text: 'rgb(var(--c-pass-text) / <alpha-value>)',
        },
        accion: 'rgb(var(--c-accion) / <alpha-value>)',
        interactivo: 'rgb(var(--c-interactivo) / <alpha-value>)',
        mute: 'rgb(var(--c-mute) / <alpha-value>)',
        // Texto sobre el color de marca (en ambos temas)
        onbrand: 'rgb(var(--c-onbrand) / <alpha-value>)',
        // Texto sobre los rellenos llenos ok/bad (#13), par por tema
        'on-ok': 'rgb(var(--c-on-ok) / <alpha-value>)',
        'on-bad': 'rgb(var(--c-on-bad) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        // Profundidad por tema (#241): las apps usan `shadow-card` y
        // `shadow-float`; cada tema define su sombra en `tokens.css`.
        card: 'var(--oc-shadow-card)',
        float: 'var(--oc-shadow-float)',
        glow: '0 0 40px -10px rgb(var(--c-fono) / .45)',
      },
      backgroundImage: {
        'brand-blur': 'radial-gradient(120% 140% at 0% 0%, rgb(var(--c-fono)) 0%, rgb(var(--c-fono-dark)) 45%, rgb(var(--c-paper)) 100%)',
        'brand-line': 'linear-gradient(90deg, rgb(var(--c-fono)), rgb(var(--c-fono-light)))',
      },
    },
  },
  plugins: [],
}
