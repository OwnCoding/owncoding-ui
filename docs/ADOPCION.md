# Adoptar owncoding-ui en una app — guía práctica

Para sumar la biblioteca a una app existente (MobOS, ScaleOS, LedBox, PagaYa) o
a una nueva, sin romper nada. Complementa:

- `docs/V2.md` — tokens y objetos del sistema v2 (qué es cada cosa).
- `docs/MIGRACION-V2.md` — **cómo adaptar una pantalla** (paso a paso).
- `docs/REGLAS.md` — reglas de interfaz; `docs/REGLAS-ECOSISTEMA.md` — reglas
  del ecosistema (acceso, seguridad, infra, pagos, correo, publicación);
  `docs/ALIMENTAR.md` — cómo devolver objetos nuevos a la biblioteca.

## 1. Requisitos y versión

- **Node ≥ 18**, **React 18+**, **Tailwind CSS 3.4+**.
- Se adopta una **versión fija** (tag) y se sube a propósito: `#v0.14.7`.
  No mezclar tags con la rama `main` en la misma app.

## 2. Instalación

```bash
npm install github:dariodeoli/owncoding-ui#v0.14.7                 # git
npm install git+ssh://git@github.com:dariodeoli/owncoding-ui.git#v0.14.7   # SSH
```

- `prepare` corre el build al instalar; el bundle también queda **commiteado en
  `dist/`** para instalaciones con `--ignore-scripts` (npm 11 no ejecuta
  `prepare` de dependencias git por defecto: si el paquete no trajera `dist`,
  hay que instalarlo con el tag que ya lo incluye).
- Alternativa sin git: publicar el mismo paquete en GitHub Packages
  (`@dariodeoli/owncoding-ui`); cambia el registry, no el paquete.

## 3. Configuración

```js
// tailwind.config.js
import preset, { owncodingContent } from 'owncoding-ui/tailwind-preset'
export default { presets: [preset], content: [...owncodingContent, './index.html', './src/**/*.{js,jsx}'] }
```

```css
/* CSS principal, después de las directivas de Tailwind */
@import 'owncoding-ui/styles.css';   /* todo: tokens + base + componentes */
/* o por partes: */
@import 'owncoding-ui/tokens.css';   /* variables --c-* y temas */
@import 'owncoding-ui/base.css';     /* base recomendada (opcional) */
```

- Tailwind 3.4 **ignora el `content` que declara un preset**: la app tiene que
  sumar `owncodingContent` a su propio `content` (sin eso, Tailwind purga las
  clases de los componentes compartidos; síntoma típico: “el componente se ve
  sin estilos” y los íconos gigantes).
- El tema oscuro se activa con la clase `dark` (o `consola`/`tema-v2` para los
  scopes v2) en `<html>` o en el contenedor.
- Apps con TypeScript: el paquete ya trae `dist/index.d.ts` y tipos del preset.
- Utils en el **servidor** (server components, route handlers, scripts):
  importarlos de `owncoding-ui/utils`; la entrada principal es de cliente
  (`"use client"`) y en Next obligaría a `serverExternalPackages`.

## 4. Peers opcionales

- `qrcode` solo si la app usa **QR** (`CodigoQr`, `qrDataUrl`, `FichaCertificado`):
  `npm install qrcode`. El resto del paquete no la necesita (import dinámico:
  si falta, el QR devuelve vacío en vez de romper el import).

## 5. Estrategia de adopción (incremental)

1. Instalar + preset + CSS y **verificar que la app sigue igual** (captura).
2. Elegir **una pantalla piloto** y aplicar `tema-v2` a su contenedor.
3. Reemplazar **un objeto por commit** (chips → medidores → tablas → previews),
   con su captura antes/después y los checks de la app.
4. Cuando la app importe la biblioteca, **borrar los bloques locales** de tokens
   y los alias (`Toggle`, `CELDA_*` locales, mapas de estado propios).
5. Fases y tabla de reemplazos por pantalla: `docs/MIGRACION-V2.md`.

## 6. Errores comunes

| Síntoma | Causa | Solución |
| --- | --- | --- |
| Componente sin estilos | Tailwind purgó las clases | Sumar `owncodingContent` al `content` de la app (Tailwind 3.4 ignora el `content` del preset) |
| Los utils fallan en el servidor | Se importó la entrada de cliente | Importar de `owncoding-ui/utils` (sin `"use client"`) |
| Estilos “a medias” | Se importó el CSS antes de las directivas | Importarlo **después** de `@tailwind base/components/utilities` |
| El QR no aparece | Falta `qrcode` | `npm install qrcode` (peer opcional) |
| Tipos rotos en TS | Versión vieja sin `dist/index.d.ts` | Subir al tag que incluye tipos (≥ v0.14.0) |
| CI instala otra cosa | Se mezcló tag y `main` o no hay lockfile | Fijar el tag en `package.json` y usar `npm ci` |
| Cambios que se pierden | Se editó `dist/` a mano | Los objetos se cambian en `src/` de la biblioteca y se publica un tag nuevo |

## 7. Verificación y rollback

- Checks de la app: lint · tests · build · smoke; capturas por fase.
- Rollback: volver al tag anterior en `package.json` (`npm ci`) y, si hace
  falta, quitar el import del CSS y el preset. Nada de la app queda “casado”
  con la biblioteca.

## 8. Checklist por app

- [ ] Tag fijado en `package.json` (+ `npm ci` en CI).
- [ ] Preset y CSS importados en el orden correcto.
- [ ] `qrcode` instalado si se usa el informe/QR.
- [ ] Pantalla piloto con `tema-v2` y capturas antes/después.
- [ ] Objetos reemplazados uno por commit, sin ramas de estilo por pantalla.
- [ ] Bloques locales de tokens y alias eliminados.
- [ ] `docs/ALIMENTAR.md`: si falta un objeto, se crea acá y se adopta después.
