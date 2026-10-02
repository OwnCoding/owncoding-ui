# Static editorial blog

## Architecture

`npm run gallery:build` builds the interactive Vite gallery first, then runs
`scripts/blog-build.mjs`. The generator writes `/blog/index.html`, one complete
HTML file per article, shared `/blog/blog.css`, and the canonical sitemap into
`site-dist`. No JavaScript or external service is required to read an article.
The production static server must serve those files, not return the gallery's
SPA fallback for blog routes.

The homepage links to the blog from its header, editorial cards, prefooter and
footer. A no-JavaScript fallback also links to the static blog. `robots.txt`
announces the sitemap. These mechanisms support discovery but do not promise
indexing, rankings or inclusion in AI answers; those outcomes are external.

## Editorial sources

- `gallery/blog/metadata.js`: lightweight titles, descriptions, slugs, categories,
  publication dates and gallery destinations. The interactive gallery imports
  this metadata only, not complete article bodies.
- `gallery/blog/articles.js`: original Spanish article sections and verified
  repository source links, merged with the metadata by slug.
- `gallery/blog/render.js`: HTML escaping, script-safe JSON-LD, canonical URLs,
  metadata, links, index and article templates.
- `gallery/blog/styles.css`: responsive editorial presentation, visible keyboard
  focus, system color-scheme support and reduced-motion handling.

Before editing content, inspect the component's actual implementation. Distinguish
local fixtures from external integrations, validation from identity verification,
and visual logos from commercial availability or institutional endorsement.
Do not invent authors, historical dates, providers, endorsements or metrics.
Set a publication date only for a real publication; do not create fake history.
Existing favicon and social-image artwork is reused unchanged.

## Validation and publishing

Run `npm run gallery:check`, `npm test`, `npm run gallery:build`,
`npm run readme:check`, and `git diff --check`. The blog check currently enforces
ten distinct substantive guides, 400–650 body words each, verified local source
paths and twelve canonical sitemap URLs. Update those deliberate checks when the
editorial scope actually changes; do not bypass them to publish placeholder text.

The checked-in `gallery/public/sitemap.xml` must match `renderSitemap()`; the build
also generates the final deployment sitemap. After deploying, verify the index,
all ten article URLs, stylesheet, icons, canonical tags and complete body content
on `https://controlaria.online`, including a direct page reload and mobile layout.
Search Console submission requires the site's existing verified property; no
verification credential or token is fabricated by this implementation.
