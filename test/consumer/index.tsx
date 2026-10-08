import { createRef, useState } from 'react'
import { CityAutocomplete as FieldCity, PhoneField as FieldPhone, EmailField as FieldEmail } from 'owncoding-ui/fields'
import {
  BancoCombobox,
  CityAutocomplete,
  CurrencyConversion,
  Money,
  MoneyInput,
  PercentField,
  ProductFooter,
  ProductPrefooter,
  crearIdentidadApp,
} from 'owncoding-ui'
import { resolveInstitution, resolveLocality, INSTITUTIONS_PARAGUAY, LOCALITIES_PARAGUAY, formatGs } from 'owncoding-ui/utils'
import { IAError, motorIA } from 'owncoding-ui/ia'
import { PhoneField, telefonoE164 } from 'owncoding-ui/phone'
import { BancoLogo, MedioPagoLogo } from 'owncoding-ui/financial'
import {
  LOGOS_BANCOS,
  logoDeBanco,
  relacionFinancieraDe,
  sugerenciasDeMarcaPago,
  type RelacionFinanciera,
} from 'owncoding-ui/financial-metadata'
import { compararVersiones } from 'owncoding-ui/app-identity'
import { crearCorreoTransaccional, renderCorreoHtml } from 'owncoding-ui/email'

const identidad = crearIdentidadApp({ nombre: 'Consumer', version: '1.2.3' })
const correo = crearCorreoTransaccional({ identidad, asunto: 'Aviso', motivo: 'Contenido' })
resolveInstitution(INSTITUTIONS_PARAGUAY[0].id).record?.name
resolveLocality(LOCALITIES_PARAGUAY[0].id).record?.department
formatGs(1_000)
telefonoE164('+595981123456', 'PY')
compararVersiones('1.0.0', '1.0.1')
renderCorreoHtml(correo)
logoDeBanco('ueno bank')
LOGOS_BANCOS['ueno bank']
const relacion: RelacionFinanciera | null = relacionFinancieraDe('Mango')
relacion?.operador.nombreLegal
sugerenciasDeMarcaPago('Banco Familiar')
IAError
motorIA({ esquema: { tipos: [] } })

export function ConsumerFixture() {
  const [valor, setValor] = useState('')
  const ref = createRef<HTMLInputElement>()
  return (
    <>
      <FieldCity value={valor} onChange={setValor} onSelect={(city, department) => String(city + department)} />
      <FieldPhone phone={valor} country="PY" onChange={setValor} />
      <FieldEmail value={valor} onChange={setValor} />
      <CurrencyConversion originalAmount="1.25" originalCurrency="EUR" convertedAmount={6.75} convertedCurrency="BRL" rate={5.4} source="Fixture" asOf="2026-10-07T12:00:00Z" status="stale" locale="de-DE" labels={{ stale: 'Veraltet' }} />
      <Money value={null} currency="BRL" locale="pt-BR" numberFormatOptions={{ maximumFractionDigits: 4 }} />
      <MoneyInput ref={ref} value={1000} onValueChange={(monto) => String(monto)} />
      <PercentField value={valor} onChange={setValor} onValueChange={setValor} />
      <BancoCombobox value={valor} onChange={setValor} onSelect={setValor} onIdentitySelect={result => setValor(result.record?.id || '')} />
      <CityAutocomplete value={valor} onChange={setValor} onSelect={(ciudad, departamento) => setValor(`${ciudad}${departamento || ''}`)} onIdentitySelect={result => setValor(result.record?.id || '')} />
      <PhoneField onChange={setValor} onInternationalChange={(e164, meta) => setValor(e164 || meta.phone)} />
      <BancoLogo banco="ueno bank" variante="compacto" />
      <MedioPagoLogo marca="upay" variante="horizontal" />
      <ProductPrefooter modelo="accion" accion={{ titulo: 'Ayuda', enlace: { href: '/ayuda', etiqueta: 'Abrir' } }} />
      <ProductFooter identidad={identidad} enlaces={[{ href: '/legal', etiqueta: 'Legal' }]} />
    </>
  )
}

// Controlled reusable patterns: selection setters must remain type-safe.
import { Combobox, AsyncButton, Popover, Tooltip, NotificationCenter, FooterPreset, CopyButton, ActionToolbar, CloseButton, AppHeader, PublicHeader, ProfileCard, UserMenu, AccountSwitcher, useToast } from 'owncoding-ui'
export function ReusableConsumer() {
  const [team, setTeam] = useState<string | null>(null)
  const [teams, setTeams] = useState<string[]>([])
  const toast = useToast()
  const items = [{ id: 'demo', label: 'Demo' }]
  return <>
    <Combobox items={items} value={team} onChange={setTeam} />
    <Combobox multiple items={items} value={teams} onChange={setTeams} />
    <AsyncButton action={async () => toast.promise(Promise.resolve('demo'), { success: result => result })}>Guardar</AsyncButton>
    <Popover label="Ayuda" trigger="Abrir"><CloseButton /></Popover>
    <Tooltip trigger="Info">Ayuda</Tooltip>
    <NotificationCenter items={[{ id: '1', title: 'Demo', read: false }]} onMarkAllRead={() => {}} />
    <FooterPreset name="Demo" variant="public" links={[{ href: '/help', etiqueta: 'Ayuda' }]} />
    <ActionToolbar><CopyButton text="demo" /></ActionToolbar>
    <AppHeader title="Demo" /><PublicHeader title="Demo" />
    <ProfileCard name="Demo" /><UserMenu name="Demo" items={[{ label: 'Perfil', onClick: () => {} }]} />
    <AccountSwitcher accounts={items} value={team ?? undefined} onChange={setTeam} />
  </>
}

import { AnimatedStatus, MotionSurface } from 'owncoding-ui'
const motionContracts = <><AnimatedStatus state="loading" motion={false}>Saving</AnimatedStatus><MotionSurface hover press elevation><button disabled>Save</button></MotionSurface></>
void motionContracts

import { OtpVerification } from 'owncoding-ui'
const otpContract = <OtpVerification value="123456" onChange={() => {}} onVerify={code => { void code }} secondsRemaining={30} motion={false} />
void otpContract

import { Carousel } from 'owncoding-ui'
const carouselContract = <Carousel slides={[{ id: 'first', label: 'First', content: <p>Content</p> }]} index={0} onIndexChange={() => {}} motion={false} />
void carouselContract
import { CartSummary } from 'owncoding-ui'
const cartContract = <CartSummary items={[{ id: 'sample', label: 'Sample', quantity: 1, amount: 10 }]} total={10} onQuantityChange={(id: string, quantity: number) => {}} />
void cartContract

import { ProductVariantSelector } from 'owncoding-ui'
const variantContract = <ProductVariantSelector groups={[]} variants={[]} value={{}} onChange={(value: Record<string, string>) => {}} />
void variantContract

import { PricingCard } from 'owncoding-ui'
const pricingContract = <PricingCard title="Sample" price={100} features={[{ id: 'reports', label: 'Reports', included: true }]} onSelect={() => {}} />
void pricingContract
import { RucField, createOwnDataRucProvider, mapOwnDataRucResponse, mapOwnDataRucError } from 'owncoding-ui'
import { createOwnDataRucProvider as serverOwnDataProvider } from 'owncoding-ui/utils'
const ownDataProvider = createOwnDataRucProvider({ lookup: async () => ({}) })
const ownDataField = <RucField maxBaseDigits={9} value="80012345-6" onChange={() => {}} consultar={ownDataProvider} onAplicar={result => { const source: string = result.ownData.provenance.source; void source }} />
void ownDataField; void serverOwnDataProvider; void mapOwnDataRucResponse; void mapOwnDataRucError
