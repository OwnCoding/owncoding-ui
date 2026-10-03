import { useEffect, useId, useRef, useState } from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Button, useDialogClose } from './ui.jsx'
import Avatar from './Avatar.jsx'
import Icon from './Icon.jsx'
import MenuDesplegable from './MenuDesplegable.jsx'
import ProductFooter from './ProductFooter.jsx'
import ProductPrefooter from './ProductPrefooter.jsx'
import { cn } from '../utils/cn.js'

const surface = 'rounded-xl border border-interactivo bg-ink p-3 text-fore shadow-float'
const control = 'min-h-11 rounded-lg border border-interactivo bg-ink px-3 text-fore focus-visible:outline focus-visible:outline-2 focus-visible:outline-fono disabled:opacity-40'

export function CloseButton({ label = 'Cerrar', onClick, disabled = false, className, ...props }) {
  const requestClose = useDialogClose()
  return <button {...props} type="button" disabled={disabled} aria-label={label} className={cn('toque-44 inline-grid h-11 w-11 shrink-0 place-items-center rounded-lg text-mute hover:bg-ink-700 focus-visible:outline focus-visible:outline-fono', className)} onClick={event => { if (requestClose) requestClose(); else onClick?.(event) }}><Icon name="close" className="h-5 w-5" /></button>
}

export function Popover({ trigger, label, children, side = 'bottom', align = 'center', open, onOpenChange, disabled, className }) {
  return <BasePopover.Root open={open} onOpenChange={onOpenChange}><BasePopover.Trigger disabled={disabled} className={control}>{trigger}</BasePopover.Trigger><BasePopover.Portal><BasePopover.Positioner side={side} align={align} sideOffset={8} className="z-[70] max-w-[calc(100vw-2rem)]"><BasePopover.Popup aria-label={label} className={cn(surface, 'max-h-[var(--available-height)] overflow-y-auto', className)}>{children}</BasePopover.Popup></BasePopover.Positioner></BasePopover.Portal></BasePopover.Root>
}

export function Tooltip({ trigger, children, label, side = 'top', disabled = false }) {
  const [touchOpen, setTouchOpen] = useState(false)
  const triggerId = useId()
  return <BaseTooltip.Provider><BaseTooltip.Root open={touchOpen} triggerId={triggerId} onOpenChange={setTouchOpen} disabled={disabled}><BaseTooltip.Trigger disabled={disabled} id={triggerId} aria-describedby={touchOpen ? `${triggerId}-tip` : undefined} className={control} aria-label={label} closeOnClick={false} onClick={() => { if (!disabled) setTouchOpen(value => !value) }}>{trigger}</BaseTooltip.Trigger><BaseTooltip.Portal><BaseTooltip.Positioner side={side} sideOffset={6} className="z-[70] max-w-[calc(100vw-2rem)]"><BaseTooltip.Popup role="tooltip" id={`${triggerId}-tip`} className={cn(surface, 'max-w-xs text-sm')}>{children}</BaseTooltip.Popup></BaseTooltip.Positioner></BaseTooltip.Portal></BaseTooltip.Root></BaseTooltip.Provider>
}

export function Combobox({ items = [], value, onChange, multiple = false, label = 'Seleccionar', placeholder = 'Buscar…', loading = false, error, disabled = false, onQueryChange, renderItem, className }) {
  const selected = multiple ? items.filter(item => (value || []).includes(item.id)) : items.find(item => item.id === value) ?? null
  return <div className={cn('min-w-0 space-y-2', className)}><BaseCombobox.Root items={items} multiple={multiple} value={selected} onValueChange={next => { if (!loading && !error) onChange?.(multiple ? next.map(item => item.id) : next?.id ?? null) }} onInputValueChange={onQueryChange} itemToStringLabel={item => item?.label ?? ''} isItemEqualToValue={(a, b) => a?.id === b?.id} disabled={disabled} autoHighlight>
    <label className="block text-sm font-medium">{label}<BaseCombobox.Input placeholder={placeholder} aria-label={label} aria-busy={loading} aria-invalid={!!error} className={cn(control, 'mt-1 w-full')} /></label>
    <BaseCombobox.Portal><BaseCombobox.Positioner sideOffset={4} className="z-[70] w-[var(--anchor-width)] max-w-[calc(100vw-2rem)]"><BaseCombobox.Popup className={cn(surface, 'max-h-72 overflow-y-auto')}>
      {loading ? <p role="status">Cargando opciones…</p> : error ? <p role="alert">{error}</p> : <><BaseCombobox.Empty>Sin resultados</BaseCombobox.Empty><BaseCombobox.List>{item => <BaseCombobox.Item key={item.id} value={item} disabled={item.disabled} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 data-[highlighted]:bg-ink-700 data-[disabled]:opacity-40"><BaseCombobox.ItemIndicator>✓</BaseCombobox.ItemIndicator>{renderItem ? renderItem(item) : item.label}</BaseCombobox.Item>}</BaseCombobox.List></>}
    </BaseCombobox.Popup></BaseCombobox.Positioner></BaseCombobox.Portal>
  </BaseCombobox.Root>{multiple && selected.length > 0 && <p className="text-xs text-mute">Seleccionados: {selected.map(item => item.label).join(', ')}</p>}{error && <p role="alert" className="text-sm text-bad-text">{error}</p>}</div>
}

function Header({ title, logo, items = [], actions, children, className, publicMode = false }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const escape = event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open])
  return <header className={cn('min-w-0 rounded-xl border border-interactivo bg-ink px-4 py-3 text-fore', className)}><div className="flex flex-wrap items-center gap-3"><div className="flex min-w-0 flex-1 items-center gap-2">{logo}<span className="truncate font-bold">{title}</span></div><div className="flex flex-wrap items-center gap-2">{actions}<button ref={trigger} type="button" className={cn(control, 'md:hidden')} aria-label="Abrir navegación" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name="menu" className="h-5 w-5" /></button></div></div><nav aria-label={publicMode ? 'Navegación pública' : 'Navegación de aplicación'} className={cn('mt-3 flex-wrap gap-2 md:flex', open ? 'flex' : 'hidden')}>{items.map(item => <a key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined} className={cn('inline-flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-ink-700', item.active && 'bg-fono/10 text-fono-dark dark:text-fono-light')} onClick={() => setOpen(false)}>{item.label}</a>)}</nav>{children}</header>
}
export function AppHeader(props) { return <Header {...props} /> }
export function PublicHeader(props) { return <Header {...props} publicMode /> }

export function ProfileCard({ name, email, role, image, actions, className }) {
  return <section aria-label={`Perfil de ${name}`} className={cn(surface, 'space-y-3', className)}><div className="flex min-w-0 items-center gap-3"><Avatar nombre={name} src={image} /><div className="min-w-0"><h3 className="break-words font-bold">{name}</h3>{email && <p className="break-all text-sm text-mute">{email}</p>}{role && <p className="text-xs text-mute">{role}</p>}</div></div>{actions}</section>
}
export function UserMenu({ name, image, items = [] }) { return <MenuDesplegable ariaLabel="Menú de usuario" trigger={<><Avatar nombre={name} src={image} /><span>{name}</span></>} items={items} /> }
export function AccountSwitcher({ accounts = [], value, onChange, disabled = false }) { return <MenuDesplegable disabled={disabled} ariaLabel="Cuentas" trigger={<span>Cambiar cuenta{value ? `: ${accounts.find(item => item.id === value)?.label ?? ''}` : ''}</span>} items={accounts.map(item => ({ ...item, disabled: disabled || item.disabled, onClick: () => onChange?.(item.id) }))} /> }

export function NotificationCenter({ items = [], onSelect, onMarkAllRead, onLoadMore, hasMore = false, loading = false, error, types = [], label = 'Notificaciones', className }) {
  const [unread, setUnread] = useState(false)
  const [type, setType] = useState('')
  const visible = items.filter(item => (!unread || !item.read) && (!type || item.type === type))
  return <section aria-label={label} className={cn(surface, 'space-y-3', className)}><h3 className="font-bold">{label}</h3><div className="flex flex-wrap gap-2"><Button variant="outline" aria-pressed={!unread} onClick={() => setUnread(false)}>Todas</Button><Button variant="outline" aria-pressed={unread} onClick={() => setUnread(true)}>Sin leer</Button>{onMarkAllRead && <Button variant="ghost" disabled={loading || !items.some(item => !item.read)} onClick={onMarkAllRead}>Marcar todas como leídas</Button>}{types.length > 0 && <label>Tipo<select className={control} value={type} onChange={event => setType(event.target.value)}><option value="">Todos</option>{types.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>}</div>{error && <p role="alert">{error}</p>}<div className="max-h-80 overflow-y-auto">{visible.map((item, index) => <div key={item.id}>{item.group && item.group !== visible[index - 1]?.group && <h4 className="py-2 text-xs font-semibold text-mute">{item.group}</h4>}<button type="button" disabled={loading} onClick={() => onSelect?.(item)} className="block min-h-11 w-full rounded-lg p-3 text-left hover:bg-ink-700"><span className={item.read ? 'font-normal' : 'font-bold'}>{item.title}</span>{item.description && <span className="block text-sm text-mute">{item.description}</span>}</button></div>)}{!visible.length && !loading && <p className="p-4 text-sm text-mute">Sin notificaciones</p>}</div>{loading && <p role="status">Cargando notificaciones…</p>}{hasMore && <Button variant="outline" disabled={loading || !onLoadMore} onClick={onLoadMore}>Cargar más</Button>}</section>
}

export function AsyncButton({ action, onSuccess, onError, children, pendingLabel = 'Procesando…', successLabel = 'Completado', disabled, className, ...props }) {
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const locked = useRef(false)
  const mounted = useRef(true)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  async function run() {
    if (locked.current || disabled) return
    locked.current = true; setState('pending'); setError('')
    try { const result = await action?.(); if (mounted.current) setState('success'); onSuccess?.(result) }
    catch (reason) { if (mounted.current) { setState('error'); setError(reason instanceof Error ? reason.message : 'No se pudo completar la acción.') } onError?.(reason) }
    finally { locked.current = false }
  }
  return <span className={cn('inline-flex flex-col gap-1', className)}><Button {...props} type="button" disabled={disabled || state === 'pending'} aria-busy={state === 'pending'} onClick={run}>{state === 'pending' ? pendingLabel : state === 'success' ? successLabel : children}</Button>{error && <span role="alert" className="text-sm text-bad-text">{error}</span>}</span>
}

export function CopyButton({ text, copy, onCopied, label = 'Copiar', ...props }) {
  return <AsyncButton {...props} action={async () => { if (copy) await copy(text); else { if (!globalThis.navigator?.clipboard?.writeText) throw new Error('Portapapeles no disponible.'); await navigator.clipboard.writeText(text) } onCopied?.(text) }} successLabel="Copiado">{label}</AsyncButton>
}
export function ActionToolbar({ label = 'Acciones', children, className }) { return <div role="group" aria-label={label} className={cn('flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-interactivo bg-ink p-2', className)}>{children}</div> }
export function FooterPreset({ variant = 'app', name, version, links = [], columns = [], callToAction, children, className }) {
  return <div className={cn('rounded-xl', className)}>{variant === 'public' && <ProductPrefooter className="rounded-t-xl" modelo={callToAction ? 'completo' : 'enlaces'} titulo="Conocé más" columnas={columns} accion={callToAction} />}{children}<ProductFooter className={variant === 'public' ? 'rounded-b-xl' : 'rounded-xl'} nombre={name} version={version} enlaces={links} modelo={variant === 'auth' ? 'apilado' : 'distribuido'} /></div>
}
