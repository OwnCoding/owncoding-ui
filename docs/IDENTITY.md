# OwnCoding UI identity

The gallery and repository use the `owncoding/ui` wordmark and a four-slot grid: two neutral filled slots, one cobalt active slot and one outlined slot. The mark has a near-black rounded container. Do not replace institutional logos with this mark or initials.

## Tokens and scope

- Paper: `#F6F5F2`; ink: `#0E1116`; dark canvas: `#0B0D11`.
- Action: `#2340E6`; dark-theme action text: `#8FA0FF`.
- Verification: green; warnings: amber. These semantic colors are not brand decoration.
- Typeface: Schibsted Grotesk; technical labels and numbers: JetBrains Mono.
- Rounded containers, restrained dividers, generous editorial heading scale.

`gallery/identity.css` overrides variables only under `html.ownui-gallery`. It does not change `src/styles/tokens.css`, exported consumer themes or application defaults. Existing component previews, fixture data, URLs and integration security contracts remain functional.

## Fonts and assets

Font binaries are self-hosted in `gallery/public/fonts`, extracted from the supplied identity reference without executing its HTML or JavaScript. The WOFF2 binaries match the official Google Fonts distribution byte-for-byte; `fonts/sources.json` records source URLs and SHA-256 values verified on 2026-10-07. Both families use the SIL Open Font License 1.1; retain the included copyright and license files when redistributing. License sources:

- [Schibsted Grotesk](https://github.com/google/fonts/blob/main/ofl/schibstedgrotesk/OFL.txt)
- [JetBrains Mono](https://github.com/google/fonts/blob/main/ofl/jetbrainsmono/OFL.txt)

`gallery/public/favicon.svg` is the icon source; `docs/assets/owncoding-ui-mark.svg` is its repository copy. `gallery/public/og-owncoding-ui.svg` is the 1200×630 social artwork source. Its PNG is the social crawler-compatible counterpart. Raster icons use the same geometry at 16, 32, 180, 192 and 512 px; the maskable icon keeps the grid inside its safe zone. ICO contains the exact 16, 32 and 192 px PNG payloads. Revisioned icon references must remain identical across the gallery head, blog head and both manifests.

README previews keep embedded official financial assets unchanged. Their backgrounds and labels adopt the gallery palette. Asset availability is not a claim of institutional endorsement or an active integration.

## Financial selector

See [BancoCombobox logo presentation](BANCO-COMBOBOX.md) for selected marks, option rows and opt-out props.
