import { cn } from '../utils/cn.js'
import { formatMoney } from '../utils/moneda.js'
import { Money } from './ui.jsx'

const LABELS = {
  title: 'Currency conversion', original: 'Original amount', converted: 'Converted amount',
  rate: 'Exchange rate', source: 'Quote source', asOf: 'Quote as of',
  fresh: 'Current quote', stale: 'Stale quote', loading: 'Loading quote', unavailable: 'Quote unavailable', missing: '—',
}

function timestamp(asOf, locale, timeZone) {
  if (typeof asOf !== 'string') return null
  const parts = asOf.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/)
  if (!parts) return null
  const [, year, month, day, hour, minute, second] = parts.map(Number)
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  if (month < 1 || month > 12 || day < 1 || day > days || hour > 23 || minute > 59 || second > 59) return null
  const date = new Date(asOf)
  if (!Number.isFinite(date.getTime())) return null
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone, year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
    }).format(date)
  } catch { return null }
}

// Display only: callers supply amounts and classify freshness. No fetching,
// conversion, clock, portfolio valuation or financial rounding happens here.
export default function CurrencyConversion({
  originalAmount, originalCurrency, convertedAmount, convertedCurrency,
  rate, source, asOf, status = 'unavailable', locale = 'es-PY', timeZone = 'UTC',
  labels: suppliedLabels, amountFormatOptions, rateFormatOptions, className,
}) {
  const labels = { ...LABELS, ...suppliedLabels }
  const moneyOptions = { locale, numberFormatOptions: amountFormatOptions, vacio: '' }
  const original = typeof originalCurrency === 'string' && formatMoney(originalAmount, originalCurrency, moneyOptions)
  const converted = typeof convertedCurrency === 'string' && formatMoney(convertedAmount, convertedCurrency, moneyOptions)
  const quotedAt = timestamp(asOf, locale, timeZone)
  const validSource = typeof source === 'string' && source.trim().length > 0
  let rateText = ''
  if (typeof rate === 'number' && Number.isFinite(rate) && rate > 0) {
    try {
      rateText = new Intl.NumberFormat(locale, {
        ...(rateFormatOptions ?? { maximumSignificantDigits: 15 }), style: 'decimal',
      }).format(rate)
    } catch { /* Invalid presentation configuration remains unavailable. */ }
  }
  const complete = Boolean(original && converted && rateText && validSource && quotedAt)
  const displayStatus = status === 'loading' ? 'loading'
    : complete && (status === 'fresh' || status === 'stale') ? status : 'unavailable'
  const showConversion = displayStatus === 'fresh' || displayStatus === 'stale'
  const moneyProps = { locale, numberFormatOptions: amountFormatOptions, vacio: labels.missing }

  return (
    <section aria-label={labels.title} data-status={displayStatus} className={cn('min-w-0 rounded-xl border border-ink-500 p-4', className)}>
      <p role="status" aria-live="polite" className={cn('mb-3 text-sm font-medium', displayStatus === 'fresh' ? 'text-ok-text' : 'text-mute')}>{labels[displayStatus]}</p>
      <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-sm text-mute">{labels.original}</dt>
          <dd aria-label={`${labels.original} ${originalCurrency ?? ''}`} className="break-words font-semibold tabular-nums">{original ? <Money value={originalAmount} currency={originalCurrency} {...moneyProps} /> : labels.missing}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm text-mute">{labels.converted}</dt>
          <dd aria-label={`${labels.converted} ${convertedCurrency ?? ''}`} className="break-words font-semibold tabular-nums">{showConversion ? <Money value={convertedAmount} currency={convertedCurrency} {...moneyProps} /> : labels.missing}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm text-mute">{labels.rate}</dt>
          <dd className="break-words tabular-nums">{original && converted && rateText ? `1 ${originalCurrency ?? ''} = ${rateText} ${convertedCurrency ?? ''}` : labels.missing}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm text-mute">{labels.source}</dt>
          <dd className="break-words">{validSource ? source : labels.missing}</dd>
        </div>
        <div className="min-w-0 sm:col-span-2">
          <dt className="text-sm text-mute">{labels.asOf}</dt>
          <dd className="break-words">{quotedAt ? <time dateTime={asOf}>{quotedAt}</time> : labels.missing}</dd>
        </div>
      </dl>
    </section>
  )
}
