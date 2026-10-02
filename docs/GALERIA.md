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

## Cobertura curada local (0.62.0)

146 de 146 exports visuales tienen una presentación curada (563 exports totales,
417 API). Los dos lotes agregan 35 vistas reales a las 111 anteriores. La ficha
individual monta una sola familia con estado local reiniciado al cambiar de
componente; no se repiten controles pesados en las tarjetas del catálogo.
Las cuatro prioridades originales, los activos financieros y el correo aislado
se conservan.

Las nuevas familias `receiving-previews.jsx` y `search-board-previews.jsx`
permiten elegir personas/proveedores/productos ficticios, mover y revertir
una tarjeta Kanban, seleccionar una ficha principal sin fusionarla, quitar y
restaurar un bloque de pago, simular una recepción, alternar incidencias y
explorar tarjetas operativas. Los botones de detalle solo actualizan un estado
local: no abren registros de negocio. El buscador de personas tiene `claveUso=""`
para no registrar uso en almacenamiento. Las pruebas instrumentan cada export
real y verifican selección, reversión y ausencia de solicitudes/persistencia.

Selectores para QA: `[data-demo-family="receiving"]`,
`[data-demo-family="search-board"]`, `[data-demo-export="TableroKanban"] select`,
`[data-demo-export="PreviewFusion"] input[type="radio"]` y
`[data-demo-export="BloquePago"] [data-testid="bloque-pago"]`.

El último módulo `specialized-previews.jsx` agrega BuscadorDispositivo,
Calendario, CodigoQr, BotonCargaIA, DialogoCargaIA, PegarEnlaceToken,
SelectorCuentaCobro, TarjetaCuentaCobro, SubidaImagen y ToastProvider.
El calendario usa octubre de 2026 como fixture fijo (incluido “hoy”), con
navegación y elección local. El QR codifica texto ficticio sin enlaces ni pagos;
se genera con `qrcode` y su efecto ignora resultados tras desmontarse.

Los dos exports IA abren un diálogo real con proveedor determinista en memoria:
el análisis no crea nada y la creación requiere revisar y confirmar. No hay
proveedor remoto, consulta de identidad ni escritura real. El código del enlace
es una secuencia ficticia sin validez y solo se extrae localmente. Las cuentas y
cotizaciones son fixtures; elegir o alternar no cobra ni transfiere.

La imagen es un pixel PNG de muestra: sus botones inyectan un File local al
campo real, ejercitan validación de tamaño y limpieza, y no permiten elegir o
arrastrar archivos personales. No se usan URLs de objeto, fotos ni canvas.
ToastProvider usa `demo=false` para no instalar el listener global de guardado,
un solo aviso persistente sin temporizador y cierre manual. La escena transformada
contiene su posición fixed y permite reiniciar/desmontar el provider sin avisos
residuales. Los tests comprueban estos contratos y la generación/limpieza QR.

Selectores especializados: `[data-demo-family="specialized"]`,
`[data-demo-export="Calendario"]`, `[data-demo-export="SelectorCuentaCobro"]`,
`[data-demo-export="SubidaImagen"] input[type="file"]`, `.gallery-toast-scene`
y `[role="dialog"]` tras abrir una simulación IA. Pruebe teclado en modelo,
cuenta y días del calendario; cambie de ficha para verificar limpieza del diálogo
y los avisos.

Sin exports visuales pendientes de mapping. Esto acredita fixtures curados y
pruebas locales, no todas las combinaciones de props, QA live ni despliegue.
Las limitaciones financieras y de procedencia están documentadas en
MARCAS-FINANCIERAS.md.
