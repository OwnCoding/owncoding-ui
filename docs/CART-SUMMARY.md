# CartSummary

Resumen controlado que compone `Card`, `Money`, `Button`, `AnimatedStatus` y
`MotionSurface`. No calcula subtotales, impuestos, descuentos ni stock.

- `items`: IDs únicos estables, etiqueta, descripción opcional, cantidad entera
  positiva, límite opcional `maxQuantity`, importe de línea `amount` y `unavailable`.
- `total` y `totals`: importes explícitos de la aplicación; `currency` PYG o USD.
  Importes negativos/no finitos y cantidades inválidas bloquean continuar.
- `onQuantityChange(id, quantity)`, `onRemove(id)` y `onCheckout()` emiten intención;
  no mutan props ni esperan promesas. La aplicación actualiza datos y `pending`.
- `pending`/`disabled` bloquean todas las acciones. Una línea no disponible bloquea
  cantidad y checkout pero permite quitarla. Sin callback la acción queda inactiva.
- Vacío muestra `emptyLabel` y bloquea continuar. Un límite inválido falla cerrado.
- Botones nativos; grupo de cantidad etiquetado, lista y total semánticos, estado
  vivo cortés. `motion=false` o movimiento reducido desactiva feedback animado.
- La aplicación confirma precios, moneda, inventario, permisos y pago en servidor.

```jsx
<CartSummary items={cart.items} totals={cart.totals} total={cart.total}
  pending={saving} onQuantityChange={requestQuantity} onRemove={requestRemove}
  onCheckout={continueCheckout} />
```

La galería usa un fixture local explícito: sus cálculos y acciones no son servicios.
