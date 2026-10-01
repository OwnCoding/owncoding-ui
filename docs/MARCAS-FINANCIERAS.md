# Marcas financieras

Catálogo compartido de instituciones financieras paraguayas y marcas de pago.
La biblioteca distingue **entidad**, **red**, **procesador**, **producto** y
**tipo genérico de cuenta**. Por eso `Bancard`, `Dinelco`, `upay` y `uPOS` no
se guardan como si fueran `CARD` o `TRANSFER`.

## Variantes

`BancoLogo` y `MedioPagoLogo` aceptan:

- `variante="compacto"`: caja cuadrada con monograma seguro.
- `variante="horizontal"`: tratamiento textual para encabezados o tarjetas.

```jsx
import { BancoLogo, MedioPagoLogo } from 'owncoding-ui/financial'

<BancoLogo banco="ueno bank" variante="compacto" alto="h-8" />
<BancoLogo banco="ueno bank" variante="horizontal" alto="h-7" />
<MedioPagoLogo marca="Bancard" variante="compacto" alto="h-8" />
<MedioPagoLogo marca="Bancard" variante="horizontal" alto="h-7" />
```

La política de publicación es **fail-closed**. En v0.60.0 ninguna marca de
terceros tiene una licencia o autorización de redistribución explícita y
auditable dentro del repositorio. Por eso el paquete, `owncoding-ui/financial`
y la galería no incluyen bytes de esos logos: todos se muestran mediante un
monograma compacto o un tratamiento textual horizontal. `baseAssets` se
conserva únicamente por compatibilidad y no habilita un asset bloqueado.

## Estados, procedencia y permiso

Cada entrada de `LOGOS_BANCOS` y `MARCAS_MEDIOS_PAGO` declara:

- `categoria` y `alias`;
- `fuenteOficial` y `verificadoEn`;
- `estado` general;
- `redistribucion.permitida` y `redistribucion.evidencia`;
- `variantes.compacto` y `variantes.horizontal`, cada una con `tipo` y
  `estado` (`fallback`, `permiso-pendiente` o `producto-padre`).

`texto` y `monograma` son fallbacks neutrales, no logos oficiales.

```js
import { coberturaBancos, coberturaMediosPago } from 'owncoding-ui/financial-metadata'

const bancos = coberturaBancos()
const pagos = coberturaMediosPago()
```

Esos diagnósticos permiten auditar qué variante necesita un kit de marca y una
autorización antes de reemplazar el fallback. El único modo de publicar bytes
es registrar `permitida: true` junto con una referencia concreta en
`evidencia`; un estado `verificado` o una URL oficial no alcanzan.

`owncoding-ui/utils`, `owncoding-ui/financial-metadata` y
`owncoding-ui/financial` no contienen data URLs ni bytes de marcas de terceros
en v0.60.0. Las fuentes oficiales se conservan como procedencia y para una
auditoría futura; no equivalen a licencia.

El catálogo garantiza **cobertura de render** para las dos variantes. No afirma
que todas las entidades tengan un par oficial disponible. Bancard, Dinelco,
Procard, Citi y cualquier otra marca sin permiso demostrado se presentan con
fallback neutral. Que un archivo sea auténtico y esté en el sitio oficial no
autoriza por sí solo a redistribuirlo.

## Compatibilidad histórica

- `Financiera Finexpar` resuelve a `Zeta Banco`.
- `Financiera El Comercio` y `Visión Banco` resuelven a `ueno bank`.
- `Banco Río` resuelve a `Banco Continental`.
- `Pagopar` resuelve a `upay`.

Los alias no aparecen en los catálogos activos. La resolución ignora acentos y
mayúsculas. `uPOS` queda modelado como terminal/producto de `upay`, no como un
procesador independiente.

## Regla para agregar assets

1. Usar una fuente oficial y registrar la URL y la fecha de verificación.
2. Guardar la licencia o autorización explícita de redistribución como
   evidencia auditable dentro del repositorio.
3. Confirmar que el archivo corresponde a la variante declarada.
4. No crear símbolos recortando wordmarks.
5. Sin evidencia, usar `permiso-pendiente` y un fallback neutral.
6. Verificar que SVG no incluya scripts, manejadores de eventos ni imágenes
   remotas.
