# Public fields entry and financial graph separation

`owncoding-ui/fields` exports the existing CityAutocomplete, PhoneField and
EmailField implementations and their declarations. The root exports remain
compatible; no consumer may use private src/dist imports.

```jsx
import { CityAutocomplete, PhoneField, EmailField } from 'owncoding-ui/fields'
```

The visual build now has index, financial and fields entry points in the same
splitting graph. Shared field code and `cn` receive their own chunks; financial
artwork is not grouped with `cn` just because index and financial both consume it.
Consequently unused financial modules can be dropped when the root is consumed
selectively as well. This does not mark Object.freeze or arbitrary calls pure,
remove assets, change component APIs, or reduce existing budgets.

Measured with esbuild0.28.2 browser ESM/minify, React/react-dom/jsx-runtime external:
all three fields via root210817B/gzip56645B; via fields194143B/gzip52441B (zlib9).
Financial sentinel and inline PNG artwork are absent in both selected bundles.
The new unminified published fields closure is115889B/gzip32023B with finite
120000B/33000B budget; existing root/financial/package ceilings stay unchanged.
These are package fixtures, not production app or UX certification.

Regression uses the public package export with metafile and financial sentinel,
finite selected-consumer budgets, root/fields implementation identity, and a
real TypeScript consumer. Existing interaction suites still exercise the same
implementations. Prepared npm package smoke verifies installed exports/types.
