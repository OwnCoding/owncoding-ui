import { useCallback, useRef, useState } from 'react'
import { limpiarError, validarCampos } from '../utils/validacion.js'

// Estado de validación de un formulario (#323). Las reglas son puras
// (`utils/validacion.js`); acá solo viven los errores por campo, la limpieza al
// corregir y el resultado del submit:
//
//   const { errores, validar, limpiar, errorDe } = useValidacionCampos({
//     nombre: [obligatorio()],
//     email: [obligatorio(), patron(EMAIL_RE, 'Revisá el correo.')],
//   })
//   const alGuardar = (valores) => {
//     const { valido } = validar(valores)
//     if (!valido) return
//     guardar(valores)
//   }
//   <FormField label="Nombre" error={errorDe('nombre')}>…
//
// `limpiar()` sin campo borra todos (al reabrir el formulario).
export default function useValidacionCampos(reglas) {
  const [errores, setErrores] = useState({})
  const ultimasReglas = useRef(reglas)
  ultimasReglas.current = reglas
  const validar = useCallback((valores) => {
    const resultado = validarCampos(valores, ultimasReglas.current)
    setErrores(resultado.errores)
    return resultado
  }, [])
  const limpiar = useCallback((campo) => setErrores((actuales) => limpiarError(actuales, campo)), [])
  const errorDe = useCallback((campo) => errores[campo] || '', [errores])
  return { errores, validar, limpiar, errorDe }
}
