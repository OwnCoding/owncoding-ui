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

## Accepted ADR: shared synchronous visual ESM graph (2026-10-02)

Approved scope: root + financial in one esbuild multi-entry splitting build,
with data URL loaders and `"use client"` on both entries and their shared chunks.
Utils, metadata, IA, phone, identity and email retain separate builds. Emitted
file URLs or async asset APIs were rejected: they would change the raw Node SSR
contract. Recompression/cropping originals was rejected. Package includes chunks,
maps and original asset files; no package guard excludes those bytes.

The closure guard parses imports with es-module-lexer, sums unique reachable
in-dist JS (cycles/shared nodes once), sums gzip per file rather than a combined
stream, and rejects missing files, path/symlink escapes, ambiguous/encoded paths,
nonliteral imports and undeclared externals. Pure closures reject client modules,
React dependencies and data-image payloads. Pack smoke imports the actual tarball,
SSR-renders data-URL logos in raw Node, traverses its closure and checks all
shipped original hashes. Negative tests cover these boundaries.

### Three measured stages

Published baseline: `8607ac6`, unchanged 74 assets. Shared architecture measurement
was taken **before** adding assets or metadata; package figures below are the
observed snapshots before this expanded documentation (final figures are reported
by the required check). This is physical packaging deduplication, **not** reduced
traffic/cost of loading a financial/root closure.

| Guard | Published raw / gzip B | Shared, no additions | Shared + eligible originals |
| --- | ---: | ---: | ---: |
| Root reachable closure | 2,587,421 / 1,491,404 | 2,589,576 / 1,491,223 | 3,197,592 / 1,941,745 |
| Financial reachable closure | 2,006,529 / 1,356,434 | 2,008,581 / 1,357,019 | 2,616,597 / 1,807,543 |
| Utils pure closure | 163,119 / 39,718 | 163,119 / 39,718 | 165,395 / 40,147 |
| Financial metadata pure closure | 40,093 / 7,511 | 40,093 / 7,511 | 42,369 / 7,950 |
| Package packed / unpacked | 5,226,791 / 9,952,341 | 3,857,890 / 7,861,564 | 4,760,628 / 8,952,028 |

Ten unmodified originals add **453,383 B** source bytes. Root/financial closure
raw delta is 608,016 B each versus the shared stage, including metadata/wiring.
Gzip deltas are 450,522 B root and 450,524 B financial. Utils/metadata raw growth
is exactly 2,276 B of canonical byte-free institution/payment metadata; gzip
increases 429/439 B. Both retain the transitive purity guard.

The new public Visa PNG + Mastercard SVG are 7,156 + 2,543 = 9,699 B original.
Their two emitted asset modules contribute 12,628 raw B and 7,402 incremental
gzip B to the shared chunk, measured by removing only those two module blocks
in memory (not rewriting originals). This payload-only measurement excludes
metadata/wiring changes and is not a separate whole-package baseline.

A complete San Lorenzo horizontal-original trial measured 5,480,592 B packed,
exceeding the unchanged 5,250,000 B total cap by 230,592 B. That file is not
packaged; its genuine compact is used with explicit horizontal containment.

### Finite rebaseline, only attributable closures

| Guard | Previous cap raw / gzip B | New cap raw / gzip B |
| --- | ---: | ---: |
| Root | 2,600,000 / 1,500,000 | 3,262,000 / 1,981,000 |
| Financial | 2,010,000 / 1,360,000 | 2,669,000 / 1,844,000 |
| Utils | 165,000 / 42,000 | 168,702 / 40,949 |
| Financial metadata | 42,000 / 9,000 | 43,216 / 8,109 |

Visual caps round approximately 2% over actual reachable cost. Pure metadata
caps use floor(actual × 1.02), no more than 2% headroom; the unrelated pure entry
caps are unchanged. Package caps remain **5,250,000 packed / 10,010,000 unpacked**.
The two pure gzip ceilings decrease rather than preserving unnecessary margin.
Source permission remains project-surface authorization, not an open license.

### Consequences and rollback

Loading either visual closure still carries the inline artwork; importing both
in one ESM graph shares the physical module. Chunk names are internal and may
change per build. Consumers/tarballs must preserve all emitted relative chunks.
Rollback the multi-entry build, closure guard/tests and this new asset/metadata
batch together; keep previously published gallery fixtures and original assets.
Before final proof, regenerate dist; after source freeze use check-only commands.
