# Cobertura de instituciones de Paraguay

Auditoría documental: **2026-10-02**. El catálogo es una selección de interfaz,
no un registro regulatorio exhaustivo ni una afirmación sobre licencias.

## Bancos y financieras

El [listado oficial de entidades supervisadas del BCP](https://www.bcp.gov.py/documents/20117/319021/20260320%2BLISTADO%2BDE%2BENTIDADES%2BSUPERVISADAS.pdf/72d9cd46-9945-f2d2-b40a-d2d5fb34345d?t=1780412378396)
identifica 16 bancos y 4 financieras. Las 20 instituciones tenían correspondencia
en el catálogo previo a la exclusión solicitada por el usuario.

Banco do Brasil figura en el padrón como sucursal extranjera y en el
[reporte FGD de mayo de 2026](https://www.bcp.gov.py/documents/20117/1369677/Reporte_FGD_Mayo_2026.pdf/5f6c90b1-7c8a-f33c-1ee8-54cefdeb5902?t=1782307239560.pdf).
Su exclusión del selector y de las tarjetas de galería es **curaduría del
usuario**, no evidencia de inactividad ni revocación. El lookup histórico sigue
resolviendo sus aliases y conserva el bloqueo de calidad del asset.

La selección actual ofrece **19 entidades BCP + 13 cooperativas = 32**.

## Cooperativas: cobertura parcial

Se ofrecen Coomecipar, Medalla Milagrosa, San Cristóbal, Universitaria, Luque,
Coopeduc, Capiatá, Ñemby, Lambaré, Coodeñe, Mburicaó, Mercado Nº 4 y San Lorenzo.
La ampliación incorpora originales sin modificar y no equivale a una licencia
abierta ni a un padrón financiero completo.
El [registro de INCOOP](https://www.incoop.gov.py/?page_id=131) y su
[informe de nómina de socios de 2025](https://www.incoop.gov.py/wp-content/uploads/2026/09/Informe-de-nomina-de-socios-2025.pdf)
requieren reconciliación por sector y vigencia. Las 554 cooperativas del informe
abarcan distintos sectores: **no equivalen a 554 entidades financieras activas**.
El padrón clasificado de 2025 tiene 477 entradas en 28 páginas escaneadas; no se
obtuvo una lectura íntegra verificable, por lo que no se publica un porcentaje
exhaustivo de cobertura.

El [informe financiero CAC tipo A de diciembre de 2025](https://www.incoop.gov.py/wp-content/uploads/2026/07/Informe-financiero-de-las-CAC-Tipo-A-Diciembre-2025.pdf)
permite identificar al menos 10 cooperativas ausentes de la selección actual:
Credivill, Coopensa, Ñandutí, 8 de Marzo, 24 de Octubre, Judicial, Del Sur,
CACEC, Tobatí y Reducto.

Estos faltantes son evidencia para una futura ampliación, **no nuevas opciones
implementadas**. Queda pendiente reconciliar el padrón vigente y obtener assets
auténticos con procedencia y autorización de superficie documentadas. No se
inventan logos ni se incluyen automáticamente cooperativas de otros sectores.

## Originales incorporados — 2026-10-02

El manifiesto registra URL exacta, dimensiones, SHA-256 y autorización de
superficie para cada original. Se incorporan Capiatá (horizontal completo
contenido en compacto), Ñemby (favicon y marca cuadrada contenida en horizontal),
Lambaré (GIF estático original 121 × 122 contenido en horizontal), Coodeñe y
Mburicaó (horizontales contenidos en compacto), Mercado Nº 4 (marca cuadrada
contenida en horizontal) y San Lorenzo (compacto 192 × 192 contenido en horizontal).

El soporte GIF valida firmas GIF87a/GIF89a, tablas, raster LZW, dimensiones,
transparencia y trailer; rechaza animación, extensiones no soportadas, truncados
y expansión fuera del frame. Aplica los mismos mínimos raster y de cobertura
que PNG, sin excepciones nuevas.

## Fuentes examinadas no empaquetadas

- Capiatá: compacto indicado devolvió 404; se reutiliza honestamente el horizontal.
- Mburicaó: favicon opcional devolvió 404; no se inventa otro símbolo.
- 24 de Octubre: [original 512 × 512](https://cooperativa24.coop.py/wp-content/uploads/2025/11/cropped-cropped-cropped-cropped-Logo-compsinfondo.png)
  y [favicon 192 × 192](https://cooperativa24.coop.py/wp-content/uploads/2025/11/cropped-cropped-Logo-compsinfondo-192x192.png)
  conservan cobertura transparente 0,525169 y 0,522786: inferior al mínimo
  vigente de 0,55. No se recortan ni se agrega una excepción.
- Tobatí: [original 2551 × 800](https://www.cooptobati.com.py/assets/images/logo-cooperativa-nuestra-tobati-dark.png)
  contiene un emblema y un rectángulo verde vacío, sin lockup utilizable completo.
  No se recorta el emblema ni se reconstruye texto; no se ofrece esta nueva opción.
- San Lorenzo: [horizontal original 2386 × 776](https://www.sanlorenzo.coop.py/wp-content/uploads/2026/01/LOGO-HORIZONTAL.png)
  de 375.010 B superó el límite packed en el ensayo completo: 5.480.592 B frente
  a 5.250.000 B. Su SHA-256 se conserva en el [registro de evaluación](financial-assets-evaluation.json);
  se publica solo el compacto genuino y se identifica el horizontal como contenido,
  no como lockup independiente.

Estos límites no afirman inactividad regulatoria ni ausencia de autorización.
La cobertura INCOOP permanece parcial. Las fuentes no incorporadas se mantienen
fuera del tarball; sus hashes documentan la evaluación, no assets del runtime.

Los originales descartados conservan URL, fecha, tamaño, dimensiones y SHA-256
en [financial-assets-evaluation.json](financial-assets-evaluation.json).
