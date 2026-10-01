# Accessibility interaction contracts

OwnCoding UI targets WCAG 2.1 AA. These contracts are part of the public component behavior and should not be removed by consuming applications.

## Comboboxes

`useComboboxNavigation` is the shared headless behavior used by the bank, city, email, product, and device fields.

- Focus remains on the input.
- The input exposes `role="combobox"`, `aria-controls`, `aria-expanded`, `aria-autocomplete="list"`, and `aria-activedescendant`.
- Arrow Up/Down wraps through options; Home/End jumps to the bounds; Enter selects; Escape closes.
- Options use stable IDs and must not contain nested links or buttons.
- Pointer selection prevents the input from losing focus before selection.

Consumers building a compatible field can use the returned `inputProps`, `listboxProps`, and `getOptionProps(index)` objects. When composing custom handlers, run the application handler first and skip the shared handler when `event.defaultPrevented` is true.

## Menus and popovers

`MenuDesplegable` follows the ARIA menu pattern: one roving Tab stop, Arrow Up/Down, Home/End, Escape, and focus restoration to the trigger. Separators use `role="separator"`.

`CampanaAvisos` is a non-modal dialog rather than a menu because its content can mix links, buttons, empty states, and footer actions. It moves focus into the panel, closes with Escape, and returns focus to its trigger. The trigger's accessible name includes the unread count.

## Tabs

`Subtabs` and `NavegacionSeccion` have one Tab stop and support Arrow Left/Right plus Home/End. `NavegacionSeccion` connects the active tab to its rendered `tabpanel`.

## Validation and feedback

`FormField` merges its hint/error ID with an existing `aria-describedby` value and applies `aria-invalid` to the matching form control. Keep `htmlFor` equal to the control ID.

Error toasts are persistent and assertive by default. Success and informational toasts default to four seconds and pause while hovered or focused:

```js
const toast = useToast()
toast.success('Saved', 'The changes are live.', { duration: 6000 })
toast.error('Could not save', 'Try again.')
toast.error('Temporary issue', undefined, { persistent: false, duration: 8000 })
```

## Motion and touch

Import `owncoding-ui/base.css` for the global `prefers-reduced-motion` fallback. Primary touch controls and icon actions expose at least a 44 by 44 CSS pixel target, either through `min-h-11`/`h-11 w-11` or the `toque-44` helper.
