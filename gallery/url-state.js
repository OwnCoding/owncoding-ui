import { useEffect, useRef, useState } from 'react'
import { CATALOGO_EXPORTS, CATEGORIAS_CATALOGO } from './catalog.js'

export const DEFAULT_GALLERY_STATE = Object.freeze({ consulta: '', categoria: 'Todas', tipo: 'visual', exportName: null })
const exportNames = new Set(CATALOGO_EXPORTS.map(item => item.nombre))
const categories = new Set(['Todas', ...CATEGORIAS_CATALOGO])
const types = new Set(['visual', 'api', 'todos'])

export function readGalleryState(href) {
  const url = new URL(href, 'https://controlaria.online/')
  const query = url.searchParams.get('q') || ''
  const category = url.searchParams.get('category')
  const type = url.searchParams.get('type')
  const exportName = url.searchParams.get('export')
  return {
    consulta: query.length <= 200 && !/[\u0000-\u001f\u007f]/.test(query) ? query : '',
    categoria: categories.has(category) ? category : 'Todas',
    tipo: types.has(type) ? type : 'visual',
    exportName: exportNames.has(exportName) ? exportName : null,
  }
}

export function galleryStateUrl(href, state) {
  const url = new URL(href, 'https://controlaria.online/')
  for (const [key, value, defaultValue] of [
    ['q', state.consulta, ''],
    ['category', state.categoria, 'Todas'],
    ['type', state.tipo, 'visual'],
    ['export', state.exportName, null],
  ]) {
    if (value === defaultValue) url.searchParams.delete(key)
    else url.searchParams.set(key, value)
  }
  return url.href
}

export function useGalleryUrlState() {
  const [state, setState] = useState(() => typeof window === 'undefined' ? { ...DEFAULT_GALLERY_STATE } : readGalleryState(window.location.href))
  const current = useRef(state)
  const timer = useRef(null)
  useEffect(() => {
    const restore = () => {
      clearTimeout(timer.current)
      const next = readGalleryState(window.location.href)
      current.current = next
      setState(next)
    }
    window.addEventListener('popstate', restore)
    return () => { clearTimeout(timer.current); window.removeEventListener('popstate', restore) }
  }, [])

  function update(patch, mode = 'push') {
    clearTimeout(timer.current)
    const next = { ...current.current, ...patch }
    current.current = next
    setState(next)
    const write = () => {
      const href = galleryStateUrl(window.location.href, next)
      if (href !== window.location.href) window.history[mode === 'replace' ? 'replaceState' : 'pushState'](window.history.state, '', href)
    }
    if (mode === 'replace') timer.current = setTimeout(write, 250)
    else write()
  }
  return [state, update]
}
