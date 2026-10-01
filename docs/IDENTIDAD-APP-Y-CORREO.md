# Identidad de app, pie y correo transaccional

Contrato compartido para mostrar la versión realmente publicada y presentar
mensajes transaccionales sin acoplar la interfaz al backend.

## Identidad y versión

`crearIdentidadApp` crea un objeto inmutable. La versión usa exactamente
`X.Y.Z` o `X.Y.Z-rc.N`; el modelo agrega `etiquetaVersion` (`vX.Y.Z`) para la
interfaz. La biblioteca **no lee el `package.json` del consumidor**: cada app
conecta su fuente única (`brand`, `version.json` o variable generada por su
release).

```js
import { crearIdentidadApp } from 'owncoding-ui/utils'

export const APP = crearIdentidadApp({
  nombre: 'Mi App',
  version: APP_VERSION,
  url: 'https://app.example.com',
  logoUrl: 'https://app.example.com/icono.png',
  soporteUrl: 'https://app.example.com/ayuda',
})
```

`esVersionApp`, `etiquetaVersionApp` y `VERSION_APP_RE` están disponibles en
la entrada raíz y en `owncoding-ui/utils`.

## Footer y prefooter

`ProductFooter` conserva `nombre`, `version`, `credito`, `creditoUrl`, `anio`,
`leading` y `children`. Para nuevas adopciones acepta:

- `identidad`: el objeto de `crearIdentidadApp`;
- `modelo`: `compacto`, `apilado` o `distribuido`;
- `enlaces`: enlaces estructurados `{ href, etiqueta, externo? }`.

`ProductPrefooter` es opcional. Sus modelos son:

- `enlaces`: columnas de navegación;
- `accion`: un bloque de acción;
- `completo`: navegación + acción.

Los enlaces conservan foco visible, área táctil mínima de 44 px, texto mínimo
de 12 px y envoltura en anchos chicos.

```jsx
<ProductPrefooter
  modelo="completo"
  columnas={[{ titulo: 'Producto', enlaces: [{ href: '/estado', etiqueta: 'Estado' }] }]}
  accion={{ titulo: '¿Necesitás ayuda?', enlace: { href: '/soporte', etiqueta: 'Contactar' } }}
/>
<ProductFooter identidad={APP} modelo="distribuido" enlaces={[{ href: '/privacidad', etiqueta: 'Privacidad' }]} />
```

## Presentación de correo

La entrada pura `owncoding-ui/email` exporta:

- `crearCorreoTransaccional`;
- `renderCorreoHtml`;
- `renderCorreoTexto`.

El modelo tiene identidad, asunto, preheader, motivo, detalles, acción, cierre
y firma. Todo contenido se escapa; no existe un slot de HTML arbitrario. Si hay
CTA, la URL queda visible en HTML y texto como respaldo. Los renderers vuelven
a normalizar incluso modelos congelados construidos por un consumidor: solo
aceptan `https:` o `mailto:` y rechazan `javascript:`, `data:`, `vbscript:` y
`http:` antes de producir salida.

```js
import { crearCorreoTransaccional, renderCorreoHtml, renderCorreoTexto } from 'owncoding-ui/email'

const correo = crearCorreoTransaccional({
  identidad: APP,
  asunto: 'Confirmá tu cuenta',
  preheader: 'Tu acceso está casi listo',
  motivo: 'Recibimos una solicitud para activar tu cuenta.',
  detalles: [{ etiqueta: 'Cuenta', valor: usuario.email }],
  accion: { etiqueta: 'Confirmar cuenta', url: enlaceFirmado },
  cierre: 'Si no fuiste vos, ignorá este correo.',
})

const html = renderCorreoHtml(correo)
const text = renderCorreoTexto(correo)
```

### Límite de responsabilidad

Este paquete solo arma la **presentación**. El relay WEEM, el alias propio de
cada app bajo `weem.com.py`, las credenciales, el enlace firmado, la cola, los
reintentos, la entrega final y el tracking pertenecen al backend. Una
aceptación HTTP del relay no prueba entrega.
