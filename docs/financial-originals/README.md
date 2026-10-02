# Retained official originals and faithful runtime derivatives

Approved on 2026-10-02: remove only empty outer margins and convert official
artwork to browser formats. Do not trace, redraw, recolor, stretch or invent a
compact symbol. The manifest records each exact original, SHA-256, source URL,
crop box and conversion recipe. Project-surface permission is not an open license.

## Infonet and Panal

Exact processor-published PNGs were retained byte-for-byte from:

- https://www.bancard.com.py/storage/app/media/marcas/Infonet.png
- https://www.bancard.com.py/storage/app/media/marcas/Panal.png

Panal is the standalone card mark supplied by its processor, not issuer-hosted
artwork and not Panal Seguros. Issuer identity confirmation:
https://www.universitaria.coop/tarjetas/panal

Pillow recipe (the exact version is recorded in the manifest):

```python
image = Image.open(original).convert('RGBA')
bounds = image.getbbox()
derived = image.crop(bounds)
derived.save(destination, optimize=True)
# All removed pixels must have zero alpha; remaining RGBA values are unchanged.
outside = image.getchannel('A').copy()
outside.paste(0, bounds)
assert outside.getextrema() == (0, 0)
assert derived.tobytes() == image.crop(bounds).tobytes()
```

No resampling/upscaling occurs. Infonet retains its entire horizontal mark in the
compact slot. Panal retains the entire square mark in its horizontal contained
slot. Neither is labeled an independent symbol/wordmark that does not exist.

## FPJ compact PNG

The pre-existing first-party FPJ compact PNG is retained byte-for-byte as
`fpj_compacto.png`. It is only losslessly re-encoded as an indexed PNG using
the exact RGBA mapping and ZopfliPNG recipe below. Dimensions and all decoded
pixels are identical; no resizing, margin crop or color quantization occurs.
This funds the added real logos inside the existing visual bundle ceilings.

## Pix

The exact two original PDFs are retained from the public BCB archive:
https://www.bcb.gov.br/content/estabilidadefinanceira/pix/marca/ArquivosdaMarcaPix.zip

ZIP SHA-256: `fcae3039f06bd33023f4236d8649eb289ce9cbf50e52f62516f2c201d2a600ac`.
Selected members are `ArquivosdaMarcaPix/pdf/` followed by each retained filename.
The compact mark uses the official symbol PDF, not a hand-extracted lockup.
The horizontal mark uses the official positive-color mark without the tagline.

PyMuPDF 1.28.2 converts each unchanged one-page PDF directly to vector SVG:

```python
page = pymupdf.open(original)[0]
svg = page.get_svg_image(text_as_path=True)
bounds = pymupdf.Rect()
for drawing in page.get_drawings():
    assert drawing['type'] == 'f'
    bounds |= drawing['rect']
```

Only root SVG width/height/viewBox is adjusted to remove blank outer canvas.
The drawing bounds are rounded outward to tenth points, with a further 0.1pt
empty margin on every side to prevent clipping. All converter-generated paths,
transforms and paints remain byte-identical. There is no tracing, path
simplification, recoloring or embedded raster. Only static SVG derivatives
enter browser components; the original PDFs are not loaded there.

The PNG derivatives use lossless indexed encoding: each unique RGBA tuple maps
to one palette index and its exact alpha. ZopfliPNG recompresses with
`lossy_transparent=False`, `lossy_8bit=False`, `num_iterations=15`. Decoded RGBA
bytes are checked against the original crop after both steps. No invisible RGB
values are discarded and no color quantization occurs. This keeps the unchanged
bundle ceilings without weakening quality checks.

## Still intentionally unavailable

uPOS is an upay terminal product. Its verified parent identity is retained; the
terminal illustration is not an independent logo and is not cropped into one.
Banco do Brasil remains excluded from the selectable catalog and its historical
lookup retains the existing 48px-source blocker.

## Gallery loading tradeoff

Vite gallery assetsInlineLimit is zero: small brand files are static URLs rather
than base64 literals in eager JavaScript. This adds separately cacheable image
requests and avoids a surprising eager-JS increase after lossless image
optimization. Package esbuild data URLs remain unchanged for synchronous SSR.
No budget ceiling or quality gate is raised.
