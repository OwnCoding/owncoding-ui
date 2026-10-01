// Entrada server del paquete: `owncoding-ui/ia`.
//
// Motor portable de «Carga con IA» (#12): sin React, sin dependencias y sin
// banner de cliente; se importa desde route handlers, server actions, jobs o
// scripts de Next. El contrato declarativo sigue en `owncoding-ui/utils` y acá
// se re-exportan sus límites para que la adopción se resuelva con un import.
//
// Reglas y guardas: docs/REGLAS.md §18. El endpoint de la app manda solo el
// texto pegado al proveedor (encargado, Ley 7593/2025), no persiste nada y
// crea los registros recién después de la confirmación de la persona.

export {
  IA_MODELO_PREDETERMINADO,
  IA_BASE_URL_PREDETERMINADA,
  IA_VENTANA_MS,
  IAError,
  configIA,
  estadoIA,
  proveedorIA,
  instruccionesIA,
  mensajesDeCargaIA,
  parsearSalidaIA,
  fechaDeTextoIA,
  validarAnalisisIA,
  analizarCargaIA,
  motorIA,
  crearLimitadorIA,
} from './motor.js'

// Límites del contrato, para el camino corto: un solo import en el route.
export { IA_TEXTO_MAX, IA_REGISTROS_MAX, IA_RATE_LIMIT, IA_TOKENS_MAX, IA_TIMEOUT_MS, CAMPOS_IA } from '../utils/cargaIA.js'
