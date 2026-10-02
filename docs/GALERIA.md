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

El dominio, DNS, HTTPS y el recurso de Coolify se configuran fuera de este
repositorio. Un webhook aceptado no confirma un deploy: hay que comprobar el
estado final, el healthcheck y un smoke del catálogo.
