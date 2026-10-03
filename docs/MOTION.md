# Movimiento reutilizable

Objetos originales, sin dependencias de animación ni material externo. La app
controla estados y resultados; la biblioteca no sube archivos, verifica
identidades ni acredita pagos. Importar `styles.css` o `tokens.css` + `base.css`
junto al preset Tailwind. Sin `base.css`, texto e iconos siguen siendo estáticos.

## AnimatedStatus

| Prop | Tipo | Default | Contrato |
| --- | --- | --- | --- |
| `state` | `idle / loading / success / error` | `idle` | Estado aportado por la app |
| `children` | `ReactNode` | requerido | Mensaje visible y accesible |
| `motion` | `boolean` | `true` | Permite apagar movimiento |
| `className` | `string` | — | Composición visual |

Región estable `role="status"`, `aria-live="polite"`, `aria-atomic="true"`.
Iconos compartidos decorativos: reloj, giro de carga, trazo de confirmación y
transición al error. No reemplaza `Aviso` ni validación de `FormField`. Pasar
siempre texto; no comunicar resultados solo con color o iconos.

## MotionSurface

Un único `children: ReactElement`; `hover`, `press`, `elevation` defaults `false`;
`motion` default `true`; `className` se combina con la clase existente.
Compone sin wrappers ni handlers; conserva props, callbacks y ref del hijo.
El hijo debe reenviar `className` y `data-*` a su raíz (`Card`/`Button` lo hacen).
No convierte tarjetas en acciones; usar controles nativos. No usar fragmentos,
múltiples hijos ni otra transformación en la misma raíz.

```jsx
<AnimatedStatus state={saving ? 'loading' : resultState}>{resultMessage}</AnimatedStatus>
<MotionSurface hover elevation><Card>Detalle</Card></MotionSurface>
<MotionSurface press><Button disabled={saving} onClick={save}>Guardar</Button></MotionSurface>
```

Movimiento reducido: mismos iconos/texto, sin giro, trazo ni transformaciones.
Hover exige puntero fino; foco visible y disabled no se transforman. Nunca
esperar animación para ejecutar callbacks, foco o navegación. Tokens:
`--oc-motion-fast`, `--oc-motion-feedback`, `--oc-motion-ease`; sombra sin animar.
Las vistas diferidas tienen flujos demo subida/verificación/pago, inicio
bloqueado al cargar y resultados explícitos; no son prueba de backend.
Pendiente: indicador `Subtabs` con wrap, OTP, carrito y adopción por aplicación.
