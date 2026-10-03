import React, { useMemo, useState } from 'react'
import { RucField, createOwnDataRucProvider } from '../src/index.js'

export function simulatedOwnDataEnvelope() {
  return { data: { ruc: '80012345', fullRuc: '80012345-6', dv: '6', nameOfficial: 'EMPRESA DEMO — CONTRATO SIMULADO', equivalenceRaw: null, stateRaw: 'ESTADO DEMO', sourcePartition: 'fixture' },
    requestId: 'fixture-own-data', meta: { environment: 'test', quota: { limit: 10, used: 1, remaining: 9, day: '2026-10-03', resetAfter: 60 },
      provenance: { source: 'dnit_official_snapshot', sourcePage: 'https://www.dnit.gov.py', publicationDate: '2026-10-03', publishedText: 'Fixture; no publicación real.', importedAt: '2026-10-03', snapshotHash: '0'.repeat(64) } } }
}
export function OwnDataIntegrationPreview() {
  const [value, setValue] = useState('80012345-6')
  const [blocked, setBlocked] = useState(true)
  const [result, setResult] = useState(null)
  const provider = useMemo(() => {
    const lookup = createOwnDataRucProvider({ lookup: async () => blocked
      ? { error: { code: 'COMMERCIAL_API_DISABLED' }, requestId: 'fixture-disabled' }
      : simulatedOwnDataEnvelope() })
    return async value => ({ ...await lookup(value), simulado: true })
  }, [blocked])
  return <section className="preview-panel col-span-full" aria-label="Integración OwnData mediante backend">
    <div className="preview-panel__heading"><div><p className="preview-kicker">OwnData + RucField</p><h4>Base propia DNIT; integración mediante backend</h4></div><span className="fixture-label">Contrato OwnData simulado</span></div>
    <p className="preview-note">La API comercial está deshabilitada, pendiente de autorización escrita de la fuente. Sin claves de clientes ni consultas reales desde esta galería.</p>
    <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={blocked} onChange={event => { setBlocked(event.target.checked); setResult(null) }} />Simular API deshabilitada</label>
    <RucField maxBaseDigits={9} ariaLabel="RUC del contrato OwnData simulado" value={value} onChange={setValue}
      consultar={provider} onAplicar={setResult} textoAyuda="Fixture local 80012345-6; extraiga y confirme para revisar metadatos simulados." />
    {result && <p role="status" className="preview-note">Confirmado solo en demo: {result.name} · {result.ownData.stateRaw} · revisión requerida.</p>}
    <a className="inline-flex min-h-11 items-center text-sm underline" href="https://github.com/dariodeoli/owncoding-ui/blob/main/docs/OWNDATA-RUC.md">Contrato de integración OwnData</a>
  </section>
}
