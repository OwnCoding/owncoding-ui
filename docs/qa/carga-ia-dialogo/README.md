# Capturas — diálogo de «Carga con IA» (#16)

Antes/después del rediseño compacto, con el objeto real y datos ficticios (sin
PII). El arnés monta `DialogoCargaIA` con un **esquema chico** (2 tipos, 2
campos; tipo PagaYa) y uno **grande** (3 tipos, 6 campos; tipo EventOS), a
1440×900 y 390×844, claro y oscuro.

- `antes/`: `origin/main` (v0.60.1) — `Modal size="completo"` fijo
  (`max-w-5xl`) y textarea de 10 filas.
- `despues/`: el rediseño (#16) — entrada/resultado en `amplio`
  (`max-w-3xl`), revisión en `completo` solo con varias tarjetas o tipos
  densos, textarea de 5 filas acotado, contador en la fila del hint y avisos
  globales compactos.

Archivos (mismos nombres en cada carpeta): `entrada-1440-claro`,
`entrada-1440-oscuro`, `entrada-390-claro`, `revision-chico-1440-claro`,
`revision-chico-1440-oscuro`, `revision-grande-1440-claro`,
`revision-grande-1440-oscuro`, `revision-chico-390-claro`,
`revision-chico-390-oscuro`, `resultado-1440-claro`.
