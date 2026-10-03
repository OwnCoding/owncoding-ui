import { Children, cloneElement } from 'react'
import { cn } from '../utils/cn.js'

/** Adds presentation to an existing surface; never creates an interactive div. */
export default function MotionSurface({ children, hover = false, press = false, elevation = false, motion = true, className }) {
  const child = Children.only(children)
  return cloneElement(child, {
    className: cn(child.props.className, 'oc-motion-surface', className),
    'data-oc-hover': hover ? 'on' : 'off',
    'data-oc-press': press ? 'on' : 'off',
    'data-oc-elevation': elevation ? 'on' : 'off',
    'data-motion': motion ? 'on' : 'off',
  })
}
