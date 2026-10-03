# PricingCard

Tarjeta de presentación comercial; compone `Card`, `Money`, `Badge`, `Button`,
`AnimatedStatus` y `MotionSurface`. No vende, factura ni crea suscripciones.

- `title`, `description`, `price`, `currency` (PYG/USD), `period` y `badge` son datos
  de la aplicación. Un precio inválido/negativo muestra raya y bloquea elegir.
  Cero es un precio válido; no se interpreta como promoción ni prueba gratuita.
- `features`: IDs únicos estables, etiqueta e `included` explícito; lista semántica
  con inclusión textual, no color como único indicador.
- `onSelect()` emite intención explícita. La aplicación controla `selected`,
  `pending`, errores/resultados mediante `message`; no hay promesas ni éxito local.
- `selected`, `unavailable`, `pending`, `disabled` o ausencia de callback bloquean
  elegir. La tarjeta no es clickeable: solo su botón nativo realiza la acción.
- `selectLabel`, `selectedLabel`, `unavailableLabel` personalizan CTA/feedback;
  título etiquetado, estado vivo cortés y ocupado accesible.
- Curvas y colores reutilizan tokens. Hover solo con puntero fino; teclado sin
  retrasos. `motion=false` y movimiento reducido desactivan movimiento compartido.

```jsx
<PricingCard title={plan.name} price={plan.price} period={plan.billingPeriod}
  features={plan.features} selected={selectedId === plan.id} pending={saving}
  onSelect={() => requestPlan(plan.id)} />
```

La aplicación autoriza precios, impuestos, periodos, contratos y cobro en servidor.
La galería contiene fixtures ficticios; confirmar demo no contrata ningún servicio.
