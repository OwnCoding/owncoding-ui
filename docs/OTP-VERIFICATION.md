# OtpVerification

Composición original de `PinInput`, `FormField`, `AnimatedStatus`, `MotionSurface`
y `Button`. Una sola entrada real conserva selección, teclado, pegado parcial y
`autocomplete="one-time-code"`; no se duplican inputs ni se agrega dependencia.
Referencia conceptual: [input-otp](https://github.com/guilhermerodz/input-otp),
consultada por sus patrones de entrada única/autofill, sin copiar código.

| Props | Contrato |
| --- | --- |
| `value`, `onChange(value)` | Código controlado; cambios y pegado entregan solo dígitos |
| `onVerify(value)` | Acción explícita con código completo; no usa `onComplete` |
| `onResend?` | Acción opcional, solo disponible fuera de carga/cooldown |
| `status` | `idle` (default), `loading`, `success`, `error`, controlado por la app |
| `length` | 4, 5 o 6; default 6 |
| `secondsRemaining` | Segundos restantes externos, default 0; redondea hacia arriba |
| `disabled`, `motion` | Default false/true; carga o disabled bloquean campo y acciones |
| `masked` | Default false en OTP; `PinInput` mantiene su default true |
| `label`, `hint`, `error` | Etiqueta y mensaje relacionados con la única entrada |
| `statusMessage`, `verifyLabel`, `resendLabel` | Copy configurable; default en español |
| `id`, `className` | Identificador estable y composición del contenedor |

La app inicia la operación, establece `loading` inmediatamente y decide el
resultado real. El componente no espera promesas, hace requests ni inventa éxito.
Enter en el campo no envía un formulario contenedor; activar el botón Verificar
con teclado sí funciona. Cooldown inválido bloquea reenvío; un valor negativo
finito equivale a cero. No existe timer local: actualizar segundos desde el
estado/fecha límite de la app. Éxito no borra el código ni navega automáticamente.

Errores usan `FormField` y `aria-invalid`/`aria-describedby`; estado se anuncia
con `AnimatedStatus`. Movimiento reducido mantiene iconos/texto estáticos.
`PinInput` admite props nativas adicionales para accesibilidad; `masked=false`
dibuja los dígitos en las mismas posiciones sin modificar el valor accesible.
La demo contiene un código ficticio y botones de resultado/espera manuales:
no envía mensajes, autentica usuarios ni confirma verificación de backend.
