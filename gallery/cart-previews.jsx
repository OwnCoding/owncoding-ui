import React, { useState } from 'react'
import { CartSummary, Button } from '../src/index.js'

export function CartSummaryPreview({ name }) {
  const fixture = [{ id: 'sample', label: 'Producto Demo', description: 'Fixture local, no oferta comercial.', quantity: 1, maxQuantity: 3, amount: 10000 }]
  const [items, setItems] = useState(fixture)
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState('Demo local; no pedidos ni pagos reales.')
  return <div data-demo-family="cart" data-demo-export={name} className="min-w-0 space-y-3">
    <p className="text-xs text-mute">{notice}</p>
    <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => { setItems(fixture); setPending(false) }}>Restablecer demo</Button>
      <Button type="button" variant="outline" onClick={() => setPending(value => !value)}>Alternar pendiente demo</Button></div>
    <CartSummary items={items} total={items.reduce((sum, item) => sum + item.amount, 0)} pending={pending}
      onQuantityChange={(id, quantity) => setItems(current => current.map(item => item.id === id ? { ...item, quantity, amount: quantity * 10000 } : item))}
      onRemove={id => setItems(current => current.filter(item => item.id !== id))}
      onCheckout={() => setNotice('Continuación simulada; no se creó una compra.')} />
  </div>
}
