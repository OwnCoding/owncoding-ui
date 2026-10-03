# Carousel manual

Composición original de `Button`, `Icon` y `Card`; sin dependencias nuevas.
Referencias de patrones, no código copiado: [WAI APG](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
y [Embla](https://github.com/davidjerleke/embla-carousel).

| Prop | Contrato |
| --- | --- |
| `slides` | Array de `{ id, label, content }`; ids únicos estables y labels claros |
| `index`, `onIndexChange(index)` | Índice controlado y solicitud de cambio |
| `label` | Nombre accesible del grupo, default `Destacados` |
| `previousLabel`, `nextLabel` | Default `Anterior` / `Siguiente` |
| `emptyLabel` | Mensaje para array vacío |
| `disabled`, `motion` | Default false/true |
| `className` | Composición del contenedor |

Índices fuera de rango se acotan visualmente; no se llama al callback para
corregirlos. Vacío/único deshabilitan navegación; anterior/siguiente envuelven
los extremos con varios elementos para mantener el foco del control estable.
Pickers son botones nativos agrupados, no pestañas falsas; el actual declara
`aria-current`/`aria-disabled` y permanece enfocable con varios elementos.
Tab/Shift+Tab y Enter/Espacio siguen la semántica nativa, sin mover el foco por JS.

Solo el contenido activo está montado: los controles inactivos no son enfocables.
Guardar estado persistente de cada slide en la aplicación, no en hijos que se
van a desmontar. La app aporta contenido y `alt` de imágenes; la biblioteca no
consulta proveedores, inventa media ni reescribe texto alternativo.
El contador se anuncia cortésmente después de un cambio manual confirmado por
las props; no anuncia el montaje ni cambios externos no solicitados.

Entrada visual por opacidad con tokens compartidos y CSS `@starting-style`:
puntero opcional, teclado instantáneo. Movimiento reducido o `motion=false`
eliminan transiciones; sin soporte de `@starting-style`, aparece inmediatamente.
Importar `styles.css` o `tokens.css` + `base.css` para la presentación.
**Sin autoplay y sin swipe/drag:** no hay movimiento forzado ni bloqueo de scroll
vertical. Estas funciones no se implementan ni se afirman en este primer slice.
La vista diferida contiene tres fixtures locales, acciones visibles y controles
para probar un elemento o vacío; no tiene operaciones externas.
