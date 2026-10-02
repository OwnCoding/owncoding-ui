// Tamaños del modal: el ancho máximo vive en el objeto y no en cada uso.
// `formulario` es el predeterminado para que un `<Modal>` sin `size` ya quede
// alineado con el estándar (#237, portado de MobOS).
export const TAMANOS_MODAL = {
  corto: 'max-w-md', // avisos, confirmaciones y formularios de un solo campo
  formulario: 'max-w-xl', // formularios de una columna
  amplio: 'max-w-3xl', // formularios de dos columnas, tablas y contenido amplio
  completo: 'max-w-5xl', // editores y pantallas grandes
}

export const TAMANO_MODAL_PREDETERMINADO = 'formulario'

// Cierre con cambios sin guardar: los textos canónicos del diálogo de descarte.
// El objeto los pisa por prop (`descarte`) solo cuando el contexto lo pide; el
// valor por defecto es el mensaje estándar del ecosistema.
export const CIERRE_CON_CAMBIOS = {
  titulo: '¿Descartar los cambios?',
  descripcion: 'Tenés cambios sin guardar en este formulario. Si cerrás ahora, se pierden.',
  confirmar: 'Descartar y cerrar',
  seguir: 'Seguir editando',
}
