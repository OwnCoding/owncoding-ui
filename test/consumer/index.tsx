import { createRef, useState } from 'react'
import {
  BancoCombobox,
  CityAutocomplete,
  MoneyInput,
  PercentField,
  ProductFooter,
  ProductPrefooter,
  crearIdentidadApp,
} from 'owncoding-ui'
import { formatGs } from 'owncoding-ui/utils'
import { IAError, motorIA } from 'owncoding-ui/ia'
import { PhoneField, telefonoE164 } from 'owncoding-ui/phone'
import { BancoLogo, MedioPagoLogo } from 'owncoding-ui/financial'
import { LOGOS_BANCOS, logoDeBanco } from 'owncoding-ui/financial-metadata'
import { compararVersiones } from 'owncoding-ui/app-identity'
import { crearCorreoTransaccional, renderCorreoHtml } from 'owncoding-ui/email'

const identidad = crearIdentidadApp({ nombre: 'Consumer', version: '1.2.3' })
const correo = crearCorreoTransaccional({ identidad, asunto: 'Aviso', motivo: 'Contenido' })
formatGs(1_000)
telefonoE164('+595981123456', 'PY')
compararVersiones('1.0.0', '1.0.1')
renderCorreoHtml(correo)
logoDeBanco('ueno bank')
LOGOS_BANCOS['ueno bank']
IAError
motorIA({ esquema: { tipos: [] } })

export function ConsumerFixture() {
  const [valor, setValor] = useState('')
  const ref = createRef<HTMLInputElement>()
  return (
    <>
      <MoneyInput ref={ref} value={1000} onValueChange={(monto) => String(monto)} />
      <PercentField value={valor} onChange={setValor} onValueChange={setValor} />
      <BancoCombobox value={valor} onChange={setValor} onSelect={setValor} />
      <CityAutocomplete value={valor} onChange={setValor} onSelect={(ciudad, departamento) => setValor(`${ciudad}${departamento || ''}`)} />
      <PhoneField onChange={setValor} onInternationalChange={(e164, meta) => setValor(e164 || meta.phone)} />
      <BancoLogo banco="ueno bank" variante="compacto" />
      <MedioPagoLogo marca="upay" variante="horizontal" />
      <ProductPrefooter modelo="accion" accion={{ titulo: 'Ayuda', enlace: { href: '/ayuda', etiqueta: 'Abrir' } }} />
      <ProductFooter identidad={identidad} enlaces={[{ href: '/legal', etiqueta: 'Legal' }]} />
    </>
  )
}
