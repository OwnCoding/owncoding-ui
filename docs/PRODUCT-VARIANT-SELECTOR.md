# ProductVariantSelector

Selector controlado de opciones y combinaciones. No calcula precios ni consulta
stock. Compone `Card` y botones compartidos, con radios nativos y fieldsets.

- `groups`: ID estable único, etiqueta y opciones con IDs/etiquetas; `disabled`
  opcional por opción. IDs y valores son strings no vacíos.
- `variants`: matriz de IDs únicos, valores por grupo y `available` explícito.
  La aplicación decide disponibilidad; combinaciones incompletas se ignoran.
- `value` y `onChange(next)`: selección parcial controlada. No autoselecciona,
  no corrige silenciosamente props y no invoca callbacks al montar/actualizar.
- Una opción se habilita solo si existe combinación disponible que coincida con
  las otras selecciones actuales. La app recibe la intención y actualiza props.
- `pending`, `disabled` o falta de callback bloquean radios y limpiar. Limpiar
  emite `{}`; sirve para cambiar a combinaciones incompatibles con la actual.
- Una selección obsoleta/no disponible permanece visible, con aviso vivo cortés;
  nunca implica autorización para comprar. Vacío muestra mensaje sin acciones.
- Tab y flechas usan el comportamiento nativo de los radios, sin animación ni
  retrasos. Grupos distintos e instancias distintas tienen nombres únicos.

```jsx
<ProductVariantSelector groups={groups} variants={inventoryMatrix}
  value={selection} onChange={setSelection} pending={refreshing} />
```

La app valida stock, precio, permisos y combinaciones en servidor antes de compra.
La galería usa una matriz local explícita y no ofrece productos comerciales.
