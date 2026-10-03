import React, { useState } from 'react'
import { ProductVariantSelector, Button } from '../src/index.js'
export function ProductVariantSelectorPreview({ name }) {
  const [value, setValue] = useState({})
  const [pending, setPending] = useState(false)
  const groups = [
    { id: 'color', label: 'Color demo', options: [{ id: 'blue', label: 'Azul' }, { id: 'black', label: 'Negro' }] },
    { id: 'size', label: 'Tamaño demo', options: [{ id: 'small', label: 'Pequeño' }, { id: 'large', label: 'Grande' }] },
  ]
  const variants = [
    { id: 'blue-small', values: { color: 'blue', size: 'small' }, available: true },
    { id: 'black-large', values: { color: 'black', size: 'large' }, available: true },
    { id: 'blue-large', values: { color: 'blue', size: 'large' }, available: false },
  ]
  return <div data-demo-family="variants" data-demo-export={name} className="min-w-0 space-y-3">
    <p className="text-xs text-mute">Matriz fixture local; no consulta inventario real.</p>
    <Button type="button" variant="outline" onClick={() => setPending(current => !current)}>Alternar pendiente demo</Button>
    <ProductVariantSelector groups={groups} variants={variants} value={value} onChange={setValue} pending={pending} />
  </div>
}
