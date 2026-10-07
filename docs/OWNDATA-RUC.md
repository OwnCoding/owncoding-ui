# OwnData y RucField

## Frontera de servicio

OwnData mantiene una base propia DNIT: el camino comercial usa su snapshot local,
no SUN ni fallback de red. **La API comercial está implementada pero deshabilitada**,
por política interna de publicación; no hay claves de clientes activadas por esta
integración. Este documento no habilita el servicio ni certifica jurídicamente
datos, finalidades o tratamientos.

`createOwnDataRucProvider({ lookup })` solo compone una función de transporte
inyectada. No recibe claves, URL ni configuración global, no hace fetch por defecto,
no reintenta y no inventa razón social, teléfono, correo o domicilio.

## Contrato

- `mapOwnDataRucResponse(envelope, requestedRuc)` exige identidad exacta: base de
  1–9 dígitos sin cero inicial, DV único y `fullRuc = base-DV`. Consulta por base
  debe coincidir con la base; consulta completa debe coincidir exactamente. No
  calcula ni corrige el DV. Los errores del servidor se conservan por código.
- Conserva `nameOfficial` exactamente como `name`, estado/equivalencia crudos,
  partición de origen y procedencia `dnit_official_snapshot` en `ownData`.
  El resultado incluye `reviewRequired: true`; solo la confirmación aplica datos.
- Metadatos de cuota/ambiente/procedencia deben tener forma válida; respuesta
  incompleta o identidad distinta falla cerrada como `OWNDATA_INVALID_RESPONSE`.
- `mapOwnDataRucError` devuelve Error con texto seguro propio, `code`, `status` y
  requestId acotado; retryAfter entero opcional solo para cuota. No retiene cuerpo,
  mensaje upstream, claves ni causa. Excepción de transporte produce
  `OWNDATA_TRANSPORT_ERROR`; no hay retry automático.
- Códigos: 400 `INVALID_RUC_FORMAT`; 401 `API_KEY_REQUIRED`, `API_KEY_INVALID`,
  `API_KEY_REVOKED`, `API_KEY_EXPIRED`, `API_KEY_ENVIRONMENT_MISMATCH`; 403
  `INSUFFICIENT_SCOPE`, `PLAN_REQUIRED`; 404 `REGISTERED_RUC_NOT_FOUND`; 429
  `DAILY_QUOTA_REACHED`; 503 `FREE_API_DISABLED`, `COMMERCIAL_API_DISABLED`,
  `COMMERCIAL_API_UNAVAILABLE`, `DNIT_DATA_UNAVAILABLE`. El código anterior
  `ENVIRONMENT_MISMATCH` sigue reconocido como 401 por compatibilidad.
  Un código desconocido o no textual falla cerrado con mensaje genérico.

El [contrato OpenAPI 1.1.0](https://app.controlaria.online/api/v1/openapi.json)
documenta `API_KEY_ENVIRONMENT_MISMATCH` (401) y `FREE_API_DISABLED` (503).
El adaptador muestra mensajes propios para estos estados y mantiene la entrada
manual disponible, sin aplicar datos, reintentar ni habilitar ningún servicio.
Nunca muestra mensajes ni cuerpos de diagnóstico del proveedor.

## Backend de la aplicación (ejemplo, no ruta implementada por la biblioteca)

La app debe autenticar al usuario, autorizar empresa/plan y validar formato antes
de usar una clave propia de servidor. La clave requiere ambiente test/live,
`ruc:read` y entitlement; nunca llega al navegador ni se registra en logs.

```js
// Solo servidor. El backend propio implementa su ruta autenticada /api/ruc/:ruc.
async function lookupOwnData(ruc) {
  const response = await fetch(
    `https://app.controlaria.online/api/v1/ruc/${encodeURIComponent(ruc)}`,
    { headers: { 'X-API-Key': process.env.OWNDATA_TEST_API_KEY } },
  )
  // Retorne únicamente el envelope contractual mediante su serializador seguro.
  // No copie headers, errores internos ni credenciales al cliente.
  return response.json()
}
```

Con el gate comercial deshabilitado, se espera `COMMERCIAL_API_DISABLED`; no
sustituya ese resultado por datos SUN o una demo en un flujo comercial.

## Frontend: transporte same-origin y referencia estable

```jsx
import { useMemo } from 'react'
import { RucField, createOwnDataRucProvider } from 'owncoding-ui'

const consultar = useMemo(() => createOwnDataRucProvider({
  lookup: async ruc => {
    const response = await fetch(`/api/ruc/${encodeURIComponent(ruc)}`)
    return response.json() // Envelope validado del backend autenticado de la app.
  },
}), [])
<RucField maxBaseDigits={9} value={ruc} onChange={setRuc} consultar={consultar}
  onAplicar={result => reviewAndApply(result)} />
```

Para servidor/SSR, los mismos helpers salen de `owncoding-ui/utils`, sin React.
`RucField` conserva base de hasta 8 dígitos por defecto. Para OwnData use
`maxBaseDigits={9}`: nueve dígitos sin guion son base, el DV requiere guion
explícito y el límite es 11 caracteres. No recorta ni reinterpreta valores
controlados; extras/formato inválido deshabilitan extraer. El pegado inválido o
excedido se rechaza antes del límite nativo. No se corrige un DV equivocado.
No cambie de proveedor en cada render: una referencia nueva invalida la consulta.
Cambiar RUC/proveedor/disabled invalida resultados viejos; no se aplican sin confirmar.

La galería conserva sus fixtures habituales y agrega un **contrato OwnData
simulado** que usa el mapper real: comienza con éxito ficticio y requiere confirmación
manual. Ofrece tres empresas DEMO seleccionables; cada RUC devuelve solo su
fixture exacto. Otros RUC muestran un error de ejemplo no disponible. El error
de API deshabilitada se prueba mediante una casilla opcional; no refleja el
estado de una consulta real. La procedencia del fixture usa una URI local
`urn:owncoding-ui:local-demo`, no una publicación DNIT real.
No hay llamadas a contribuyentes, claves, autorización comercial ni datos DNIT reales.

### Metadatos específicos de la fuente

`sourcePartition` es opcional: cuando está presente, conserva un entero de 0 a 9
(incluido 0), sin convertirlo a texto. Su ausencia no invalida una respuesta.
`provenance.publishedText` conserva la cadena publicada, incluso si está vacía;
no se completa ni se infiere contenido. Valores presentes de partición inválidos
y valores no textuales de `publishedText` se rechazan.

## Consulta de cuenta y base documental

[Abrir consulta autenticada en OwnData](https://app.controlaria.online/panel/ruc)
abre la consulta web de cuenta existente: requiere sesión y respeta los límites
y controles de disponibilidad de OwnData. No se exige correo verificado desde
esta integración. La galería
permanece simulada, sin peticiones reales, claves ni proxy propio implementado.

La consulta de cuenta usa `POST /api/account/ruc` con cookies same-origin y
responde `{data, provenance, fullRuc, allowance}`. No use el mapper comercial
para ese envelope ni invente `meta.environment` o `meta.quota`. La API comercial
usa `GET /api/v1/ruc/{ruc}`, clave solo en servidor y el envelope documentado arriba.
El estado comercial deshabilitado no describe la disponibilidad de la cuenta web.

Fuentes primarias:

- [Decreto 4064/2015, artículo 38 y Anexo II](https://informacionpublica.paraguay.gov.py/public/decreto_4064.pdf): licencia general de reutilización de información pública no exceptuada por reserva legal; atribución de fuente/licencia, fecha conocida y ausencia de aval oficial.
- [Publicación oficial DNIT de RUC y equivalencias](https://www.dnit.gov.py/en/web/portal-institucional/listado-de-ruc-con-sus-equivalencias): fuente del snapshot, cuya fecha/procedencia deben conservarse.

Estas fuentes no prueban una exigencia general de carta separada para toda
reutilización. La autorización escrita adicional es una política interna más
estricta para publicar la API comercial, no una certificación o conclusión legal
universal. No se elimina ese guard ni los controles de datos privados, finalidad,
sesión, abuso y cuotas. OwnData no representa ni está patrocinado por DNIT o el
Estado paraguayo; no se habilitan exportación masiva ni enriquecimiento.
