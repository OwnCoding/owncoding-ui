import Icon from './Icon.jsx'
import { textoDeTono } from '../utils/tonos.js'
import { cn } from '../utils/cn.js'

const icons = { idle: 'clock', loading: 'refresh', success: 'check', error: 'close' }
const tones = { idle: 'mute', loading: 'info', success: 'ok', error: 'bad' }

/** Controlled feedback only: the application owns the operation and result. */
export default function AnimatedStatus({ state = 'idle', children, motion = true, className, ...props }) {
  const current = Object.hasOwn(icons, state) ? state : 'idle'
  return <span {...props} role="status" aria-live="polite" aria-atomic="true"
    data-oc-status={current} data-motion={motion ? 'on' : 'off'}
    className={cn('inline-flex items-center gap-2 text-sm', textoDeTono(tones[current]), className)}>
    <span key={current} className="oc-status-icon" aria-hidden="true">
      <Icon name={icons[current]} className="h-5 w-5" />
    </span>
    <span>{children}</span>
  </span>
}
