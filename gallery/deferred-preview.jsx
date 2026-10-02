import React, { Component, useEffect, useState } from 'react'
import { PREVIEW_LOADERS } from './preview-loaders.js'

// Share successful/in-flight loads, but never cache rejected requests: retry must
// invoke the loader again instead of reusing React.lazy's rejected promise.
const requests = new Map()
function requestPreview(loader) {
  if (!requests.has(loader)) {
    const request = Promise.resolve().then(loader).catch(error => {
      requests.delete(loader)
      throw error
    })
    requests.set(loader, request)
  }
  return requests.get(loader)
}

function PreviewFailure({ name, retry }) {
  return <div role="alert" className="grid gap-3 rounded-xl border border-ink-600 p-4">
    <p>No se pudo cargar la vista de {name}. El catálogo sigue disponible.</p>
    <button type="button" className="min-h-11 rounded-lg border border-ink-600 px-3" onClick={retry}>Reintentar vista</button>
  </div>
}

class PreviewRenderBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <PreviewFailure name={this.props.name} retry={this.props.retry} /> : this.props.children
  }
}

export function DeferredPreview({ group, name, loader = PREVIEW_LOADERS[group] }) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ status: 'loading', Preview: null })
  useEffect(() => {
    let active = true
    setResult({ status: 'loading', Preview: null })
    requestPreview(loader).then(Preview => {
      if (active) setResult({ status: 'ready', Preview })
    }, () => {
      if (active) setResult({ status: 'failed', Preview: null })
    })
    return () => { active = false }
  }, [loader, attempt])
  const retry = () => setAttempt(value => value + 1)
  if (result.status === 'failed') return <PreviewFailure name={name} retry={retry} />
  if (result.status === 'loading') return <p role="status" aria-live="polite" className="min-h-20 p-4">Cargando vista de {name}…</p>
  const { Preview } = result
  return <PreviewRenderBoundary key={`${name}-${attempt}`} name={name} retry={retry}><Preview name={name} /></PreviewRenderBoundary>
}
