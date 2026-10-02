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

La selección actual ofrece **19 entidades BCP + 6 cooperativas = 25**.

## Cooperativas: cobertura parcial

Se ofrecen Coomecipar, Medalla Milagrosa, San Cristóbal, Universitaria, Luque y
Coopeduc. Los originales de primera parte de las dos últimas se incorporan sin
modificar; su procedencia no equivale a una licencia abierta.
El [registro de INCOOP](https://www.incoop.gov.py/?page_id=131) y su
[informe de nómina de socios de 2025](https://www.incoop.gov.py/wp-content/uploads/2026/09/Informe-de-nomina-de-socios-2025.pdf)
requieren reconciliación por sector y vigencia. Las 554 cooperativas del informe
abarcan distintos sectores: **no equivalen a 554 entidades financieras activas**.
El padrón clasificado de 2025 tiene 477 entradas en 28 páginas escaneadas; no se
obtuvo una lectura íntegra verificable, por lo que no se publica un porcentaje
exhaustivo de cobertura.

El [informe financiero CAC tipo A de diciembre de 2025](https://www.incoop.gov.py/wp-content/uploads/2026/07/Informe-financiero-de-las-CAC-Tipo-A-Diciembre-2025.pdf)
permite identificar al menos 17 cooperativas ausentes de la selección actual:
Credivill, Coopensa, Lambaré, Ñandutí, Ñemby, 8 de Marzo, 24 de Octubre,
Judicial, Capiatá, Del Sur, Coodeñe, Mercado Nº 4, CACEC, Mburicaó,
Tobatí, Reducto y San Lorenzo.

Estos faltantes son evidencia para una futura ampliación, **no nuevas opciones
implementadas**. Queda pendiente reconciliar el padrón vigente y obtener assets
auténticos con procedencia y autorización de superficie documentadas. No se
inventan logos ni se incluyen automáticamente cooperativas de otros sectores.

## Candidatas pendientes de assets — 2026-10-02

- Capiatá: original horizontal de 192.846 B; el compacto indicado devolvió 404.
  El original horizontal excede el margen de los bundles inline.
- Ñemby: originales de 85.936 B (logo) y 57.394 B (favicon); incluso el menor
  excede el margen restante de los bundles inline.
- Lambaré: GIF original de 7.928 B, 121 × 122; el build y el auditor actual no
  admiten este formato con comprobación equivalente. Se requiere soporte
  específico sin transformar ni recrear el archivo.

No se ofrecen estas tres nuevas opciones sin asset verificado y presupuesto.
Sus límites son del empaquetado actual, no afirmaciones de inactividad ni falta
de autorización. No se aumenta ningún presupuesto. Los siete bloqueos previos
del manifiesto continúan separados de estas candidatas no incorporadas.

### Procedencia de originales examinados, aún no empaquetados

Recuperados e inspeccionados el 2026-10-02; se conservaron los bytes originales
para la evaluación. No se atribuye una licencia abierta a estas fuentes.

- [capiata-horizontal.png](https://www.capiata.coop.py/coop_capiata/assets/images/logo_horizontal.png), 192,846 B; SHA-256
  `8874f1afe65493224d613967e0680e90eb6e1c0d987de4d6637326461048967c`.
- [nemby.png](https://coopnemby.coop.py/img/logo.png), 85,936 B; SHA-256
  `a6214c5ac7d199387bd23828be8e635771019635e91ebd6840c497d17db127b8`.
- [nemby-compacto.png](https://coopnemby.coop.py/img/favicon.png), 57,394 B; SHA-256
  `b8f263d6e746bf84ac6e8d69013318867780f77f96b62a70ac0db6874021fda0`.
- [lambare.gif](https://www.lambare.coop.py/images/logo_07.gif), 7,928 B; SHA-256
  `9098ce09992d48bb9e3547c5bbce2ca51a0a629bf2fc9dc0134d8addd6a2416e`.

La URL compacta indicada de Capiatá
`https://www.capiata.coop.py/assets/images/logo.png` devolvió HTTP 404; no se
supone un archivo alternativo ni se construye un símbolo.
