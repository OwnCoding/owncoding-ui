# Currency conversion presentation

`CurrencyConversion` is a display-only root export. It reuses `Money` and
`formatMoney`; it does not fetch quotes, calculate conversions, choose a financial
rounding policy, classify quote age, read portfolio state or start timers.

```jsx
import { CurrencyConversion } from 'owncoding-ui'

<CurrencyConversion
  originalAmount={100}
  originalCurrency="EUR"
  convertedAmount={650}
  convertedCurrency="BRL"
  rate={6.5}
  source="Application quote provider"
  asOf="2026-10-07T12:00:00Z"
  status="stale"
  locale="es-PY"
  timeZone="America/Asuncion"
/>
```

The caller owns every amount, the rate direction (one original currency unit in
converted currency units), quote authorization, freshness thresholds, valuation,
rounding/storage policy and recovery behavior. Supplied amounts are never
recalculated from the rate. Provider keys do not belong in component props.

## Props and states

- `originalAmount` / `originalCurrency`: original value and three-letter uppercase
  currency code. Numeric decimal strings are accepted without localized parsing.
- `convertedAmount` / `convertedCurrency`: already-converted value and currency.
- `rate`: finite positive number; `source`: nonempty descriptive string.
- `asOf`: valid ISO 8601 date-time with seconds and explicit `Z`/UTC offset.
  Date-only values are not quote timestamps.
- `status`: `fresh`, `stale`, `loading` or `unavailable`; defaults to `unavailable`.
  The library never compares the timestamp to the current time.
- `locale` defaults to `es-PY`; `timeZone` defaults to `UTC` for deterministic SSR.
- `labels` overrides any default English label: `title`, `original`, `converted`,
  `rate`, `source`, `asOf`, `fresh`, `stale`, `loading`, `unavailable`, `missing`.
- `amountFormatOptions` and `rateFormatOptions` customize Intl **display precision**.
  They do not alter stored values or implement domain rounding. Rates default to
  15 significant display digits; amount precision uses Intl currency defaults.
- `className` extends the mobile-first, wrapping two-column-at-small-screen layout.

`fresh` and `stale` show a conversion only when both amounts/currencies, rate,
source and timestamp are valid. Incomplete/invalid data downgrades presentation
to `unavailable`, never a current zero quote. `loading` remains explicitly loading;
loading/unavailable suppress the converted amount but retain the valid original
and independently available provenance. The status is a polite live region;
amounts have currency-qualified labels and the timestamp uses a semantic `time`.
Explicit numeric zero amounts are valid. Missing, blank, boolean, object, malformed
and nonfinite values are not zero. Invalid locales/timezones fail closed.

## Opt-in shared formatter

```jsx
<Money value={12.5} currency="BRL" locale="pt-BR" />
formatMoney(12.5, 'EUR', { locale: 'de-DE', currencyDisplay: 'code' })
```

A `locale` explicitly opts into strict generalized currency display. `Money`
also accepts `currencyDisplay`, `numberFormatOptions` and `vacio` in that path.
Without `locale`, legacy Money/formatMoney parsing, symbols and fallback behavior
remain unchanged, including historical missing-to-zero behavior. New code that
needs missing-value safety should opt in. Non-three-letter values such as `USDT`
are unsupported in this Intl path and render the missing label, not guaraníes;
no token/provider valuation is implied by this component.
