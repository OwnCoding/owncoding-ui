# Galería pública de OwnCoding UI

La galería React + Vite + Tailwind enumera la entrada raíz completa. Cada
export visual tiene metadata de catálogo; solo los fixtures aprobados en
`gallery/main.jsx` se renderizan. Nunca se ejecuta un export arbitrario por su
nombre. Los modelos y helpers aparecen como fichas de API.

## Uso local

```bash
npm run gallery:check
npm run gallery:dev
```

`gallery:check` compara `src/index.js` con `gallery/catalog.js` y falla ante
un export faltante, duplicado o mal clasificado. La búsqueda usa un valor
diferido y la navegación permite filtrar por tipo y categoría.

## Build estático

```bash
npm run gallery:build
```

La salida queda en `site-dist/` y no forma parte del paquete npm. El build
incluye `/status.json` como archivo estático real —no como fallback del SPA—:

```json
{
  "status": "ok",
  "service": "owncoding-ui-gallery",
  "packageVersion": "0.60.1",
  "buildIdentity": "<commit-o-BUILD_ID>"
}
```

La identidad pública se sirve desde `gallery/public/`: favicons, iconos para
pantalla de inicio, imagen social de 1200×630, manifest, `robots.txt` y un
`sitemap.xml` limitado a la portada. La URL canónica y las imágenes sociales
usan `https://controlaria.online/`; funcionan igual cuando el documento se
consulta desde `www` y evitan publicar rutas internas o privadas.

## Contrato para OwnCoding Hub / Coolify

- Runtime de build: **Node 24** actualizado (24.15 o posterior).
- Comando de build:
  `npm ci && npm run gallery:check && npm run gallery:build`
- Directorio publicado: `site-dist`
- Healthcheck HTTP: `/status.json`
- Código esperado: `200`; además validar `status: "ok"`, la versión y la
  identidad del build.

Los iconos y el manifest usan una revisión en la URL para invalidar cachés
anteriores sin cambiar la identidad visual. `/favicon.ico` también existe como
fallback convencional y contiene los PNG existentes de 16, 32 y 192 píxeles.
Cuando cambie el arte, actualizar la revisión de los enlaces y del manifest.

El enlace del manifest usa `/manifest.json` para aprovechar la asociación MIME
JSON del hosting sin modificar el servidor. `application/json` es válido para
un manifest, aunque `application/manifest+json` es el tipo recomendado por
[W3C](https://www.w3.org/TR/appmanifest/#using-a-link-element-to-link-to-a-manifest).
`site.webmanifest` se conserva como endpoint compatible con contenido idéntico;
el test de SEO impide que ambas copias diverjan. Actualizar ambos archivos juntos.
El endpoint legado puede seguir sirviéndose como `application/octet-stream` hasta
que el hosting configure su MIME. Después del deploy, comprobar que el enlace
activo `/manifest.json` responde con `application/json` y no con el fallback HTML.

El dominio, DNS, HTTPS y el recurso de Coolify se configuran fuera de este
repositorio. Un webhook aceptado no confirma un deploy: hay que comprobar el
estado final, el healthcheck y un smoke del catálogo.

## Cobertura curada local (0.61.1)

48 de 146 exports visuales tienen una presentación curada (antes: 30).
La ficha ampliada renderiza los componentes seleccionados y evita repetir
una misma familia pesada en cada tarjeta. Las cuatro prioridades originales
se conservan. PasswordInput, PinInput, SearchField, IconAction, Card, ErrorState
y Nota ya no se presentan mediante una demo de otro componente.

Se exponen los campos inteligentes existentes, una familia de tabla/filtros/vista,
diálogos confirmables, progreso y guardado simulado, modelos de footer/prefooter
y versión editable. El correo HTML/texto usa el renderer existente de
`owncoding-ui/email`, aislado mediante iframe sandbox sin permisos; no envía.
Los fixtures no representan APIs reales, DNIT ni datos persistidos.

Pendiente: 98 exports visuales todavía sin presentación curada (shell, acceso,
operación, documentos, impresión y otros objetos especializados). Un export
catalogado no equivale a un preview visual completo. Los originales bloqueados
de BB, Visa/Mastercard, Pix, Red Infonet, Panal y uPOS siguen pendientes de
fuente/autorización; no se inventan reemplazos. Deploy y QA live son etapas
separadas de este parche local.
