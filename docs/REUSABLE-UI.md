# Componentes reutilizables

## Contratos

- **Combobox:** `items: [{id,label,disabled?}]`, valor controlado por ID o array de IDs con `multiple`. `onQueryChange` permite búsqueda remota; la app resuelve debounce, cancelación y respuestas obsoletas. `loading/error` comunican el estado; no hay fetch implícito. `renderItem` personaliza cada opción. Conservá los elementos seleccionados en `items` al sustituir resultados remotos.
- **Popover:** trigger de contenido (no otro botón), `label` obligatorio, `open/onOpenChange` opcionales, `side/align`. Portal, ajuste al viewport, cierre con Escape y devolución de foco provistos por Base UI.
- **Tooltip:** ayuda no interactiva; foco, hover y botón táctil. No reemplaza la etiqueta de un campo ni el Popover para acciones. `label` nombra el disparador.
- **CloseButton:** área de 44 px y etiqueta accesible. En Modal/Drawer invoca el cierre compartido que respeta busy/dirty y formularios pendientes; fuera invoca `onClick`. No lo uses para forzar el cierre de un diálogo ocupado.
- **AppHeader/PublicHeader:** enlaces reales por `href`, página actual por `active`, slots `logo/actions`. Menú móvil con Escape y restauración del foco. Las rutas pertenecen a la aplicación.
- **UserMenu/ProfileCard/AccountSwitcher:** presentación y callbacks. Reutilizan Avatar/MenuDesplegable. No autentican ni conceden acceso. Nunca confíes en una selección de cuenta como autorización del servidor.
- **NotificationCenter:** datos `items: [{id,title,description?,read?,type?,group?}]`; filtros locales. `onSelect/onMarkAllRead/onLoadMore` no mutan los datos. `hasMore/loading/error` para paginación controlada. Agrupá los avisos por `group` antes de pasarlos. CampanaAvisos permanece compatible para bandejas compactas; el centro puede mostrarse en una página o Popover.
- **AsyncButton:** `action` devuelve valor o promesa. Bloqueo sincrónico evita doble clic antes del rerender. `pendingLabel/successLabel`, error observable, `onSuccess/onError`. La app realiza idempotencia y autorización del servidor. No es botón submit: encapsula una acción explícita.
- **ToastProvider/useToast:** métodos previos conservados; devuelven ID. Nuevos `loading`, `dismiss(id)`, `update(id,details)` y `promise(operation,{loading,success,error})`. `promise` conserva resultado y vuelve a lanzar el error: el consumidor debe capturarlo. `action` o `undo: {label,onClick}` se ejecuta solo al pulsar y retira el aviso. Un Deshacer visual no revierte operaciones remotas por sí solo.
- **FooterPreset:** `variant: app|auth|public`, `name/version/links/columns/callToAction`. Compone ProductFooter/ProductPrefooter existentes y conserva el crédito institucional. Personalización avanzada sigue disponible en las bases.
- **CopyButton:** copia explícita por clic en contexto seguro; falla visible si el portapapeles no está disponible. `copy` permite un adaptador controlado para pruebas; no ejecuta copias al montar.
- **ActionToolbar:** grupo accesible y responsive, no role toolbar: conserva la navegación Tab nativa de sus botones y no promete un modelo roving inexistente.

## Ejemplo

```jsx
<Combobox label="Equipo" items={teams} value={team} onChange={setTeam} />
<AsyncButton action={() => saveDraft()} onError={reportError}>Guardar</AsyncButton>
<Popover label="Acciones" trigger="Más"><CopyButton text={code} /></Popover>
<CloseButton label="Cerrar detalle" />
```

## Base y referencias

Base UI 1.8.0 MIT se usa únicamente para combobox y overlays, compatible con React 18. No se copió código de las bibliotecas de referencia: https://github.com/mui/base-ui (interacciones accesibles), https://github.com/emilkowalski/sonner (acciones de avisos), https://github.com/shadcn-ui/ui (composición de shell). Se conserva la licencia original en el paquete dependiente. Sin dependencias Sonner/shadcn/cmdk adicionales.

Todas las nuevas fichas tienen previews interactivos diferidos, tokens compartidos claro/oscuro y fixtures locales explícitos. Extras elegidos por brecha real: CopyButton y ActionToolbar; Stepper, ThemeToggle, Button, iconos y navegación ya existían y no se duplicaron.
