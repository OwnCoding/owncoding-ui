# Stable catalog identities

`INSTITUTIONS_PARAGUAY`, `LOCALITIES_PARAGUAY`, `resolveInstitution` and
`resolveLocality` are available from `owncoding-ui` and the server-safe
`owncoding-ui/utils` entry. They perform no requests and contain no account data.

## Identity and provenance

IDs such as `oc:institution:py:018` and `oc:locality:py:033` are **internal
OwnCoding identifiers**, not official registration, banking or government codes.
They are explicit source literals: retain an ID when correcting a label or
reordering rows; never generate IDs from labels/positions and never reuse retired
IDs for another entity. Append new records with new IDs.

The 32 selectable institutions reuse the existing official-source links, alias
metadata and verification dates. These are inherited metadata dates, not a fresh
verification of operational status or artwork permission. Historical entries
outside the selectable catalog remain in existing logo metadata.

The 263 locality labels are inherited unchanged from the existing shared
OwnCoding/MobOS catalog. Their provenance explicitly says `inherited-catalog`
and links to the immutable baseline source. There is no independently verified
government source URL or official-code mapping in this migration; it does not
claim current authoritative municipality coverage.

Canonical arrays, records, aliases and provenance are frozen. Legacy string
arrays and bilingual city rows are derived from that same source. City rows keep
exactly `{ ciudad, departamento, city, department }`; no ID is added to them.

## Incremental migration

```js
import { resolveInstitution, resolveLocality } from 'owncoding-ui/utils'

const bank = resolveInstitution(savedBankName)
// Keep savedBankName separately; add bank.record.id only when resolved.
// 'vision' resolves to ueno's ID and retains input + historicalName.

const locality = resolveLocality(savedCity, savedDepartment)
// Persist the ID alongside original city/department only when resolved.
```

Resolvers return `status`, the original `input`, and `record` (or `null`). A
resolved result also identifies `matchedBy`. IDs and exact normalized names are
accepted; institution aliases and historical redirects reuse existing metadata.
`Banco Río` redirects to Continental and `Visión Banco` to ueno, while the
historical name remains available. This does **not** equate historical and current
account ownership, merge account records, or rewrite saved names.

Unknown/custom values stay unresolved and preserve their original input. No
substring/fuzzy match upgrades a custom institution. Unsupported historical
metadata such as Banco do Brasil is not silently added to the selectable catalog.

Localities use city **and department**. A city alone resolves only when unique;
ambiguous names return `ambiguous`, never the first row. A conflicting or empty
explicit department returns `unknown`. An omitted department permits unique-name
or ID lookup. The optional third resolver argument supports consumer-owned
canonical catalogs with the same record contract.

## Selector compatibility

`BancoCombobox.onSelect(name)` and `CityAutocomplete.onSelect(city, department)`
retain their original arguments. Add `onIdentitySelect(result)` to opt in to
identity metadata; existing consumers need no changes. The bank callback runs
on selection. The city callback also runs while typing/at exact-match blur so
consumers can clear stale IDs when text becomes custom. A selected custom-provider
city is identified only when its city/department exactly matches this catalog.
Applications still own persistence and must not discard manual input on an
unresolved result. No account, balance, connection or permission is created.
