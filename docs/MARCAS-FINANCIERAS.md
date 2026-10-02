# Marcas financieras

OwnCoding UI diferencia bancos, financieras, cooperativas, redes, procesadores,
billeteras y productos. `BancoLogo` y `MedioPagoLogo` consumen el mismo
catálogo puro, mientras `owncoding-ui/financial` adjunta los bytes visuales sin
obligar a `financial-metadata` o `utils` a importar imágenes.

## Variantes auténticas

- `compacto`: símbolo, app icon o favicon oficial cuando existe;
- `horizontal`: wordmark o lockup oficial;
- `horizontal-contained`: wordmark horizontal oficial completo contenido en el
  espacio compacto, explícitamente identificado como marca contenida, no como
  símbolo independiente (Citi, GNB y San Cristóbal);
- `marca-contained`: marca cuadrada o vertical oficial completa contenida en el
  espacio horizontal, sin afirmar que exista un lockup horizontal independiente
  (Itaú y Tu Financiera);
- nunca se recorta un wordmark para fabricar un símbolo ni se crea una letra
  que aparente ser el logo.

```jsx
import { BancoLogo, MedioPagoLogo } from 'owncoding-ui/financial'

<BancoLogo banco="ueno bank" variante="compacto" alto="h-8" />
<BancoLogo banco="ueno bank" variante="horizontal" alto="h-7" />
<MedioPagoLogo marca="Bancard" variante="compacto" alto="h-8" />
<MedioPagoLogo marca="Dinelco" variante="horizontal" alto="h-7" />
```

Las presentaciones contenidas incluyen una descripción explícita en el registro,
el nombre accesible y el tooltip de la UI. No se recortan ni reconstruyen.

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

## Revisión bancaria del 2026-10-02

Continental y Universitaria incorporan variantes oficiales independientes. Citi,
GNB y San Cristóbal conservan el wordmark completo en ambos espacios; Itaú y Tu
Financiera conservan la marca cuadrada/vertical en ambos espacios. No se inventan
símbolos ni tipografías. El SVG blanco de Itaú usa una superficie naranja de
contraste. Universitaria conserva toda su geometría y pintura: solo se retiró
el DOCTYPE externo del SVG, con el hash original registrado en el manifest.

Banco do Brasil sigue bloqueado: el ICO oficial descargado contiene tamaños
16/32/48px, inferiores al mínimo compacto de 64px. Tampoco se verificó un lockup
horizontal bancario independiente. No se amplía el favicon ni se permite una
excepción de calidad para llenar el catálogo. El bloqueo registra URL, hash y
fecha de la evidencia aunque ese archivo no se empaquete.

Los [términos de Citi](https://www.citigroup.com/global/terms) reservan derechos y
exigen consentimiento escrito previo. Su inclusión se apoya en la autorización
escrita ya documentada del usuario para el repositorio y web/galería OwnCoding;
no se afirma una licencia abierta ni un permiso universal de redistribución.
La fecha de verificación de estos assets es 2026-10-02; no se altera la fecha
histórica de la autorización del 2026-10-01 ni la evidencia previa de pagos.

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
