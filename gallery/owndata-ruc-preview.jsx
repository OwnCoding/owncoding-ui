import React, { useMemo, useState } from 'react'
import { RucField, createOwnDataRucProvider } from '../src/index.js'

export const ownDataDemoCompanies = [
  { fullRuc: '80012345-6', name: 'EMPRESA DEMO — COMERCIO' },
  { fullRuc: '80054321-2', name: 'EMPRESA DEMO — TECNOLOGÍA' },
  { fullRuc: '80098765-4', name: 'EMPRESA DEMO — SERVICIOS' },
]

export function simulatedOwnDataEnvelope(requested = ownDataDemoCompanies[0].fullRuc) {
  const company = ownDataDemoCompanies.find(item => requested === item.fullRuc || requested === item.fullRuc.split('-')[0])
  if (!company) return { error: { code: 'REGISTERED_RUC_NOT_FOUND' }, requestId: 'fixture-not-found' }
  const [ruc, dv] = company.fullRuc.split('-')
  return { data: { ruc, fullRuc: company.fullRuc, dv, nameOfficial: company.name, equivalenceRaw: null, stateRaw: 'ESTADO DEMO', sourcePartition: 0 },
    requestId: 'fixture-own-data', meta: { environment: 'test', quota: { limit: 10, used: 1, remaining: 9, day: '2026-10-03', resetAfter: 60 },
      provenance: { source: 'dnit_official_snapshot', sourcePage: 'urn:owncoding-ui:local-demo', publicationDate: '2026-10-03', publishedText: 'Fixture; no publicación real.', importedAt: '2026-10-03', snapshotHash: '0'.repeat(64) } } }
}
export function OwnDataIntegrationPreview() {
  const [value, setValue] = useState('80012345-6')
  const [blocked, setBlocked] = useState(false)
  const [result, setResult] = useState(null)
  const provider = useMemo(() => {
    const lookup = createOwnDataRucProvider({ lookup: async requested => blocked
      ? { error: { code: 'COMMERCIAL_API_DISABLED' }, requestId: 'fixture-disabled' }
      : simulatedOwnDataEnvelope(requested) })
    return async value => {
      try { return { ...await lookup(value), simulado: true } }
      catch (error) {
        if (error.code === 'REGISTERED_RUC_NOT_FOUND') throw new Error('RUC no incluido en esta demo. Seleccione una empresa de ejemplo.')
        throw error
      }
    }
  }, [blocked])
  function changeRuc(next) {
    if (!/^[0-9-]*$/.test(next)) return
    setValue(next)
    setResult(null)
  }
  return <section className="preview-panel col-span-full" aria-label="Integración OwnData mediante backend">
    <div className="preview-panel__heading"><div><p className="preview-kicker">OwnData + RucField</p><h4>Extracción y confirmación de datos de empresa</h4></div><span className="fixture-label">Demo local interactiva</span></div>
    <p className="preview-note">Datos ficticios para probar RucField con el contrato OwnData. Esta demo no realiza consultas reales ni incluye claves de clientes.</p>
    <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={blocked} onChange={event => { setBlocked(event.target.checked); setResult(null) }} />Probar error: API deshabilitada</label>
    <label className="block space-y-2 text-sm">Empresa de ejemplo
      <select className="min-h-11 w-full rounded-xl border border-ink-600 bg-ink px-3" value={ownDataDemoCompanies.some(company => company.fullRuc === value) ? value : ''} onChange={event => changeRuc(event.target.value)}>
        <option value="" disabled>Seleccione un ejemplo</option>
        {ownDataDemoCompanies.map(company => <option key={company.fullRuc} value={company.fullRuc}>{company.name} · {company.fullRuc}</option>)}
      </select>
    </label>
    <RucField maxBaseDigits={9} ariaLabel="RUC de ejemplo OwnData" value={value} onChange={changeRuc}
      consultar={provider} onAplicar={setResult} textoAyuda="Seleccione una empresa o escriba su RUC de ejemplo, extraiga y confirme antes de aplicar." />
    {result && <p role="status" className="preview-note">Confirmado solo en demo: {result.name} · {result.ownData.stateRaw} · revisión requerida.</p>}
    <a className="inline-flex min-h-11 items-center text-sm underline" href="https://app.controlaria.online/panel/ruc" target="_blank" rel="noreferrer">Abrir consulta autenticada en OwnData</a>
    <p className="preview-note">La consulta real requiere iniciar sesión en OwnData. La cuenta y la API comercial usan contratos distintos.</p>
    <a className="inline-flex min-h-11 items-center text-sm underline" href="https://github.com/dariodeoli/owncoding-ui/blob/main/docs/OWNDATA-RUC.md">Contrato de integración OwnData</a>
  </section>
}
