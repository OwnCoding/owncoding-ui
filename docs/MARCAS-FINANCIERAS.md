# Marcas financieras

OwnCoding UI diferencia bancos, financieras, cooperativas, redes, procesadores,
billeteras y productos. `BancoLogo` y `MedioPagoLogo` consumen el mismo
catálogo puro, mientras `owncoding-ui/financial` adjunta los bytes visuales sin
obligar a `financial-metadata` o `utils` a importar imágenes.

## Variantes auténticas

- `compacto`: símbolo, app icon o favicon oficial cuando existe;
- `horizontal`: wordmark o lockup oficial;
- si la fuente oficial no ofrece un símbolo separado, se usa una aplicación
  vertical auténtica dentro de la caja cuadrada o se declara la variante como
  pendiente; nunca se reutiliza un wordmark horizontal como falso ícono;
- nunca se recorta un wordmark para fabricar un símbolo ni se crea una letra
  que aparente ser el logo.

```jsx
import { BancoLogo, MedioPagoLogo } from 'owncoding-ui/financial'

<BancoLogo banco="ueno bank" variante="compacto" alto="h-8" />
<BancoLogo banco="ueno bank" variante="horizontal" alto="h-7" />
<MedioPagoLogo marca="Bancard" variante="compacto" alto="h-8" />
<MedioPagoLogo marca="Dinelco" variante="horizontal" alto="h-7" />
```

Las imágenes usan `<img alt="">` dentro de un contenedor con nombre accesible.
Con `decorativo`, todo el tratamiento se oculta del árbol de accesibilidad. Si
un archivo falla al decodificar, el componente muestra el nombre completo, no
una marca inventada.

## Autorización y procedencia

La publicación se basa en la autorización escrita proporcionada por el usuario
el **2026-10-01** para estas superficies:

1. repositorio público `dariodeoli/owncoding-ui`;
2. sitio y galería de Own UI / OwnCoding.

No se describe como licencia abierta ni como permiso universal para terceros.
Cada archivo de [`financial-assets-manifest.json`](financial-assets-manifest.json)
registra su clase de fuente, fecha de recuperación, SHA-256 y alcance. Las
fuentes oficiales conservan la URL exacta; las referencias entregadas por el
usuario se identifican explícitamente como `user-provided-reference` y nunca se
presentan como procedencia oficial. Los SVG
se rechazan si contienen scripts, handlers, `foreignObject`, entidades, imports
o referencias externas; se permiten únicamente fragmentos internos y datos de
imagen embebidos por el propio archivo oficial.

```js
import {
  ASSET_KEYS_FINANCIEROS,
  BLOQUEOS_ASSETS_FINANCIEROS,
  obtenerAssetFinanciero,
} from 'owncoding-ui/financial'

const uenoCompacto = obtenerAssetFinanciero('bancos/ueno-compacto.svg')
```

`npm run financial-assets:check` verifica manifiesto, hashes, firmas de archivo,
seguridad SVG, cobertura de variantes y ausencia de assets huérfanos. Para
bancos y marcas de pago también controla proporción compacta/horizontal,
resolución mínima, canvas transparente excesivo y reutilización accidental del
mismo archivo en ambas variantes. Las limitaciones históricas de primera parte
se declaran como excepciones específicas, sin debilitar la validación de assets
nuevos.

## Soluciones de aceptación para comercios

`SOLUCIONES_PAGO_COMERCIOS` ofrece una agrupación funcional reutilizable, en
orden estable: **Bancard**, **Dinelco**, **upay** y **Pik**. Sirve para comparar
alternativas de aceptación, procesamiento y cobro sin afirmar propiedad ni
afiliación entre las marcas.

```js
import { SOLUCIONES_PAGO_COMERCIOS } from 'owncoding-ui/financial-metadata'

SOLUCIONES_PAGO_COMERCIOS.marcas
// ['Bancard', 'Dinelco', 'upay', 'Pik']
```

Las relaciones corporativas siguen en `RELACIONES_FINANCIERAS`; por eso Pik
mantiene por separado su relación verificada con Itaú. El compacto de Bancard
usa la referencia cuadrada de alta resolución entregada por el usuario y se
identifica como `user-provided-reference`; el manifiesto conserva el SHA-256 y
las dimensiones de esa fuente 2500×2500 por separado del hash del derivado
runtime 512×512. El horizontal conserva el asset de primera parte.

## Instituciones y marcas conectadas

`RELACIONES_FINANCIERAS` mantiene separados al banco o proveedor y a la marca
que ve la persona usuaria. La relación no convierte la marca en entidad
regulada ni permite que el logo de una parte sustituya al de la otra.

```js
import {
  institucionesSugeridasPorMarca,
  relacionFinancieraDe,
} from 'owncoding-ui/financial-metadata'

relacionFinancieraDe('Mango')
// proveedor: Tu Financiera; operador: Mango Payment S.A.

institucionesSugeridasPorMarca('App Vaquita')
// ['Finlatina']
```

- **Mango**: billetera operada por Mango Payment S.A.; proveedor financiero
  TU Financiera S.A.E.C.A. No se presenta como banco, financiera o EMPE.
- **Vaquita**: aplicación operada por MUTECH S.R.L.; proveedor financiero
  Finlatina S.A. de Finanzas. La relación no afirma propiedad de Finlatina.
- **EKO**: producto de Banco Familiar S.A.E.C.A., que actúa como institución
  padre y proveedor.
- **eCLUB**: cuenta digital operada por ECLUB Paraguay S.A. y respaldada por
  Interfisa Banco; no se afirma propiedad de Interfisa.
- **Pik**: marca de cobros para comercios operada por Pont S.A. y asociada con
  Itaú; no se clasifica como billetera de consumo.

Cada registro incluye fuente y fecha de relación, actividad vigente y operador
legal. `marcaPadre` se reserva para jerarquías de producto de pago verificadas,
como `Pagopar` → `upay`.

## Cobertura y bloqueos explícitos

El catálogo usa archivos auténticos para los bancos, financieras, cooperativas
y medios cuya fuente directa pudo verificarse. Estos IDs permanecen bloqueados
en esta versión; se muestra su nombre, no una inicial que pueda confundirse con
una marca:

- banco: `Banco Continental` (`horizontal`), `Banco do Brasil`, `Banco GNB Paraguay`, `Citi`, `Itaú` (`horizontal`), `San Cristóbal` (`compacto`), `Tu Financiera` (`horizontal`), `Universitaria`;
- pago: `Visa`, `Mastercard`, `Pix`, `Red Infonet`, `Panal`;
- producto: `uPOS` no tiene una marca independiente verificada; se conserva
  explícitamente como producto de `upay`.

Los motivos exactos y el estado de cada variante viven en
`BLOQUEOS_ASSETS_FINANCIEROS` y en el manifiesto. Un sitio bloqueado o un kit
restringido nunca se reemplaza con un mirror de terceros.

## Correcciones de catálogo

- `Pagopar` está activo y modelado como producto de `upay`; no es un alias
  histórico.
- `uPOS` es un producto de `upay`, no un procesador con marca independiente.
- Dinelco usa su identidad oficial púrpura/blanca actual.
- Sudameris usa el campo rojo `#FF0000` definido en su
  [guía oficial](https://www.sudameris.com.py/Descargar-arte-de-marca) para el
  lockup blanco; no se infiere un color desde otros productos.
- Banco Atlas usa su lockup blanco sobre el campo rojo de marca y un símbolo
  compacto genuino derivado del vector de primera parte.
- Banco Nación usa el vector vigente, sin conceptos ocultos ni metadata de
  Illustrator, sobre su superficie institucional; el compacto conserva el
  isotipo vectorial.
- BNF e Interfisa usan referencias visuales entregadas por el usuario, marcadas
  como tales en el manifiesto. FPJ aplica su superficie azul para conservar el
  contraste y Solar usa la aplicación vertical oficial en el espacio compacto.
- Las URLs oficiales son `https://www.medalla.coop.py/`,
  `https://www.universitaria.coop/`, `https://tu.com.py/` y
  `https://www.zbanco.com.py/`.
- `Financiera Finexpar` resuelve a `Zeta Banco`; `Financiera El Comercio` y
  `Visión Banco` a `ueno bank`; `Banco Río` a `Banco Continental`.

## Regla para agregar o actualizar un asset

1. Descargar solo del propietario oficial.
2. Registrar URL exacta, fecha, SHA-256 y alcance de autorización.
3. Conservar colores, geometría y `viewBox`; sanitizar sin redibujar.
4. Referenciar el archivo desde al menos una variante real.
5. Si no se puede verificar el archivo oficial, registrar el ID como bloqueo y
   no usar mirrors, hotlinks, iniciales ni reconstrucciones.
