# Original financial assets and bounded package budgets

Baseline update: **2026-10-02**, package **0.62.0**. The CI failure was a real
size-budget failure, not merely a build warning. The initial verification omitted
`npm run check:bundle`; this command is required after `npm run build` from now on.
The failed CI run must not be considered resolved until a new commit passes CI.

## Measured cause

This patch preserves the supplied GNB and San Cristóbal originals unchanged:
371,842 B + 123,530 B = **495,372 B** of PNG data. Their manifest hashes and source
bytes do not change. The existing build embeds them as base64 in both the root and
financial bundles, adding **660,500 B** of base64 payload to each bundle.

Removing only those payload strings in memory (not editing source/assets) measures
496,593 B of incremental gzip in the root and 494,827 B in financial. The complete
comparison against upstream `4cdff62555a29fbd7d08ffd42b3927803d63bedc` is:

| Artifact | Upstream raw / gzip B | With originals raw / gzip B |
| --- | ---: | ---: |
| `dist/index.js` | 1,884,587 / 968,388 | 2,545,371 / 1,465,049 |
| `dist/financial.js` | 1,306,835 / 835,526 | 1,967,619 / 1,330,428 |

The small difference from the payload-only measurement includes financial metadata,
registry wiring and the curated bank-list change. The upstream archive's
`npm pack --dry-run --json --ignore-scripts` measures 3,658,023 B packed and
7,987,053 B unpacked; the expanded package, before this budget note, measures
5,140,048 B packed and 9,810,090 B unpacked. Source PNGs, inline bundles, maps and
the associated docs explain why package growth exceeds a single copy of each PNG.
Package measurements are rechecked after this note and its tests are added.

## Only affected ceilings change

| Guard | Previous B | New B |
| --- | ---: | ---: |
| Root raw | 2,100,000 | 2,600,000 |
| Root gzip | 1,120,000 | 1,500,000 |
| Financial raw | 1,520,000 | 2,010,000 |
| Financial gzip | 990,000 | 1,360,000 |
| Package packed | 5,100,000 | 5,250,000 |
| Package unpacked | 9,800,000 | 10,010,000 |

These finite ceilings leave approximately 2% over the measured new baseline,
rounded for bounded tolerance; they do not preserve the old package's much larger
unused margin. Utilities, IA, phone, financial metadata, app identity and email
budgets are unchanged. Numbered-copy exclusion and all failure checks remain active.

## Architecture tradeoff

The root import still carries inline financial artwork. Consumers needing no images
should prefer the byte-free financial-metadata or utils entry points. Externalizing
assets would require separate public packaging/runtime-contract work; this patch
does not change that contract or optimize, crop, recompress or redraw originals.
The documented project-surface authorization is not an unlimited/open license.

## Required proof

Run `npm run gallery:check`, `npm test`, `npm run build`, **`npm run check:bundle`**,
`npm run test:types`, `npm run test:package`, `npm run gallery:build`,
`npm run readme:check`, `npm run financial-assets:check`, and `git diff --check`.
