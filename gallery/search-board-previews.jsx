import React, { useState } from 'react'
import { BuscadorPersonas, BuscadorProveedor, ProductCombobox, TableroKanban, Button } from '../src/index.js'
const people = [{ id: 'a', nombre: 'Persona ficticia A', rol: 'Operaciones de muestra' }, { id: 'b', nombre: 'Persona ficticia B', rol: 'Revisión de muestra' }]
const suppliers = [{ id: 'a', name: 'Proveedor ficticio A', code: 'DEMO-A' }, { id: 'b', name: 'Proveedor ficticio B', code: 'DEMO-B' }]
const products = [{ id: 'a', name: 'Producto ficticio A' }, { id: 'b', name: 'Producto ficticio B' }]
const cards = [{ id: 'demo-a', estado: 'pendiente', titulo: 'Pedido ficticio A', subtitulo: 'Sin envío real' }]
const columns = [{ valor: 'pendiente', titulo: 'Pendiente' }, { valor: 'revisado', titulo: 'Revisado' }]
export const SEARCH_BOARD_DEMOS = {
  BuscadorPersonas: ({ selected, setSelected }) => <BuscadorPersonas personas={people} valor={selected} onCambiar={person => setSelected(person?.id || '')} claveUso="" ariaLabel="Persona ficticia" />,
  BuscadorProveedor: ({ selected, setSelected }) => <BuscadorProveedor proveedores={suppliers} selectedId={selected} onSelect={supplier => setSelected(supplier?.id || '')} ariaLabel="Proveedor ficticio" />,
  ProductCombobox: ({ selected, setSelected }) => <ProductCombobox products={products} selectedId={selected} onSelect={product => setSelected(product?.id || '')} placeholder="Buscar producto ficticio" />,
  TableroKanban: ({ board, setBoard, reject, setReject, setStatus }) => <><Button variant="outline" onClick={() => setReject(!reject)}>{reject ? 'Permitir movimiento local' : 'Simular rechazo local'}</Button><TableroKanban etiqueta="Tablero ficticio" columnas={columns} tarjetas={board} puedeMover onMover={(id, estado) => { if (reject) return { ok: false, error: 'Rechazo simulado' }; setBoard(current => current.map(card => card.id === id ? { ...card, estado } : card)); setStatus('Movimiento local aplicado; ningún pedido real modificado.'); return { ok: true } }} onError={() => setStatus('Movimiento revertido por rechazo local.')} /><Button variant="outline" onClick={() => { setBoard(cards); setStatus('Tablero ficticio restaurado.') }}>Restaurar tablero local</Button></>,
}
export function SearchBoardPreview({ name }) {
  const [selected, setSelected] = useState('')
  const [board, setBoard] = useState(cards)
  const [reject, setReject] = useState(false)
  const [status, setStatus] = useState('')
  const Demo = SEARCH_BOARD_DEMOS[name]
  return <div className="grid min-w-0 gap-3" data-demo-export={name} data-demo-family="search-board"><p className="text-xs text-mute">Fixtures locales sin consultas, creación real ni historial persistido.</p><Demo {...{ selected, setSelected, board, setBoard, reject, setReject, setStatus }} /><p role="status">{status || (selected ? `Selección local: ${selected}` : 'Sin selección local')}</p></div>
}
