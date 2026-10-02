import { BLOG_ARTICLES } from './articles.js'
import { articlePath } from './metadata.js'
export { articlePath } from './metadata.js'

export const SITE_URL = 'https://controlaria.online'
export const BLOG_TITLE = 'Blog de OwnCoding UI: interfaces, formularios y componentes'
export const BLOG_DESCRIPTION = 'Guías prácticas de OwnCoding UI sobre React, bancos, pagos, teléfono +595, ciudad, RUC y accesibilidad. Ejemplos verificables y límites claros.'

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

export function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

export const articleWordCount = (article) => article.sections.reduce((total, section) => total + section.paragraphs.reduce((n, paragraph) => n + paragraph.trim().split(/\s+/u).length, 0), 0)
export const readingMinutes = (article) => Math.max(1, Math.ceil(articleWordCount(article) / 200))
const dateLabel = (date) => new Intl.DateTimeFormat('es-PY', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
const e = escapeHtml

function shell({ title, description, path, schema, body }) {
  const canonical = `${SITE_URL}${path}`
  return `<!doctype html>
<html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(description)}">
<meta name="robots" content="index, follow, max-image-preview:large"><meta name="theme-color" content="#0e1116"><meta name="color-scheme" content="dark light">
<link rel="canonical" href="${e(canonical)}">
<link rel="icon" href="/favicon.ico?v=b25d5a23f3e6" sizes="16x16 32x32 192x192" type="image/x-icon">
<link rel="icon" href="/favicon.svg?v=b25d5a23f3e6" sizes="any" type="image/svg+xml">
<link rel="icon" href="/favicon-32x32.png?v=b25d5a23f3e6" sizes="32x32" type="image/png">
<link rel="icon" href="/favicon-16x16.png?v=b25d5a23f3e6" sizes="16x16" type="image/png">
<link rel="mask-icon" href="/mask-icon.svg?v=b25d5a23f3e6" color="#05a36f">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=b25d5a23f3e6" sizes="180x180">
<link rel="manifest" href="/manifest.json?v=b25d5a23f3e6" type="application/json">
<link rel="stylesheet" href="/blog/blog.css">
<meta property="og:type" content="${path === '/blog/' ? 'website' : 'article'}"><meta property="og:site_name" content="OwnCoding UI"><meta property="og:locale" content="es_PY">
<meta property="og:url" content="${e(canonical)}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}">
<meta property="og:image" content="${SITE_URL}/og-owncoding-ui.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="OwnCoding UI: una base compartida para productos digitales consistentes">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(description)}"><meta name="twitter:image" content="${SITE_URL}/og-owncoding-ui.png"><meta name="twitter:image:alt" content="OwnCoding UI: una base compartida para productos digitales consistentes">
<script type="application/ld+json">${scriptJson({ '@context': 'https://schema.org', '@graph': schema })}</script>
</head><body><a class="skip-link" href="#contenido">Saltar al contenido</a>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="/"><img src="/favicon.svg" alt="" width="36" height="36"><span>OwnCoding <b>UI</b></span></a><nav aria-label="Navegación principal"><a href="/">Galería</a><a href="/blog/"${path === '/blog/' ? ' aria-current="page"' : ''}>Blog</a><a href="https://github.com/dariodeoli/owncoding-ui">Código</a></nav></div></header>
<main id="contenido" class="wrap">${body}</main>
<footer class="site-footer wrap"><p><strong>OwnCoding UI</strong> · Guías y ejemplos verificables.</p><nav aria-label="Enlaces del pie"><a href="/">Galería</a><a href="/blog/">Blog</a><a href="/status.json">Estado del build</a><a href="https://github.com/dariodeoli/owncoding-ui">Repositorio</a></nav><p class="fine-print">Los ejemplos de la galería son locales. Los logos no implican respaldo institucional ni integración activa.</p></footer>
</body></html>\n`
}

const breadcrumbs = (article) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Galería', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog/` },
    ...(article ? [{ '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}${articlePath(article)}` }] : []),
  ],
})

export function articleCard(article, index = 0) {
  return `<article class="article-card"><div class="card-top"><span class="category">${e(article.category)}</span><span class="article-number">${String(index + 1).padStart(2, '0')}</span></div><h2><a href="${articlePath(article)}">${e(article.title)}</a></h2><p>${e(article.description)}</p><div class="card-bottom"><span>${readingMinutes(article)} min de lectura</span><a href="${articlePath(article)}" aria-label="${e(`Leer: ${article.title}`)}">Leer guía <span aria-hidden="true">↗</span></a></div></article>`
}

export function renderBlogIndex(articles = BLOG_ARTICLES) {
  return shell({ title: BLOG_TITLE, description: BLOG_DESCRIPTION, path: '/blog/', schema: [
    { '@type': 'Blog', '@id': `${SITE_URL}/blog/#blog`, name: BLOG_TITLE, description: BLOG_DESCRIPTION, url: `${SITE_URL}/blog/`, inLanguage: 'es-PY', blogPost: articles.map((article) => ({ '@type': 'BlogPosting', headline: article.title, url: `${SITE_URL}${articlePath(article)}` })) },
    breadcrumbs(),
  ], body: `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="/">Galería</a><span aria-hidden="true">/</span><span>Blog</span></nav>
<section class="blog-hero"><div><p class="eyebrow">Del componente al producto</p><h1>Interfaces claras.<br><span>Decisiones compartidas.</span></h1><p class="hero-description">Guías prácticas para adoptar OwnCoding UI: formularios que ayudan, marcas que se reconocen y estados que explican lo que ocurre.</p><a class="primary-link" href="/#catalogo">Explorar los componentes <span aria-hidden="true">→</span></a></div><aside class="editorial-note"><span class="large-number">${articles.length}</span><p>guías de implementación</p><hr><strong>Basadas en el código.</strong><p>Ejemplos locales, referencias al repositorio y límites explícitos. Sin promesas de integraciones que no existen.</p></aside></section>
<section aria-labelledby="guias"><div class="section-heading"><h2 id="guias">Biblioteca de guías</h2><p>Arquitectura, formularios y experiencia de producto</p></div><div class="article-grid">${articles.map(articleCard).join('')}</div></section>
<section class="next-step"><div><p class="eyebrow">Comprobar antes de adoptar</p><h2>De la lectura a una preview real.</h2><p>Revisa el componente, cambia sus estados y valida el recorrido en tu aplicación.</p></div><a class="primary-link" href="/">Abrir la galería <span aria-hidden="true">→</span></a></section>` })
}

export function renderArticle(article, articles = BLOG_ARTICLES) {
  const path = articlePath(article)
  const url = `${SITE_URL}${path}`
  const related = articles.filter((entry) => entry.slug !== article.slug).slice(0, 3)
  return shell({ title: `${article.title} | OwnCoding UI`, description: article.description, path, schema: [
    { '@type': 'BlogPosting', '@id': `${url}#article`, mainEntityOfPage: url, url, headline: article.title, description: article.description, datePublished: article.published, inLanguage: 'es-PY', articleSection: article.category, wordCount: articleWordCount(article), image: `${SITE_URL}/og-owncoding-ui.png`, author: { '@type': 'Organization', name: 'OwnCoding UI', url: `${SITE_URL}/` }, publisher: { '@type': 'Organization', name: 'OwnCoding UI', url: `${SITE_URL}/` }, isPartOf: { '@id': `${SITE_URL}/blog/#blog` } },
    breadcrumbs(article),
  ], body: `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="/">Galería</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span>${e(article.title)}</span></nav>
<article><header class="article-hero"><p class="eyebrow">${e(article.category)}</p><h1>${e(article.title)}</h1><p class="hero-description">${e(article.description)}</p><p class="article-meta">Por OwnCoding UI · <time datetime="${article.published}">${dateLabel(article.published)}</time> · ${readingMinutes(article)} min de lectura</p></header>
<div class="article-layout"><aside class="contents"><nav aria-label="En esta guía"><h2>En esta guía</h2><ol>${article.sections.map((section, i) => `<li><a href="#seccion-${i + 1}">${e(section.heading)}</a></li>`).join('')}</ol></nav><a class="demo-link" href="/${article.demo}">Ver la preview <span aria-hidden="true">↗</span></a></aside>
<div class="article-body">${article.sections.map((section, i) => `<section aria-labelledby="seccion-${i + 1}"><h2 id="seccion-${i + 1}">${e(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${e(paragraph)}</p>`).join('')}</section>`).join('')}
<section class="source-note" aria-labelledby="fuentes"><h2 id="fuentes">Código y referencias</h2><p>Consulta el contrato actual antes de integrar. Esta guía describe la implementación revisada al publicarse; el repositorio puede evolucionar.</p><ul>${article.sources.map((source) => `<li><a href="${e(source.url)}">${e(source.label)}</a></li>`).join('')}</ul><a class="primary-link" href="/${article.demo}">Probar en la galería <span aria-hidden="true">→</span></a></section></div></div></article>
<section class="related" aria-labelledby="relacionadas"><div class="section-heading"><h2 id="relacionadas">Continuar explorando</h2><a href="/blog/">Todas las guías</a></div><div class="article-grid">${related.map(articleCard).join('')}</div></section>` })
}

export function renderSitemap(articles = BLOG_ARTICLES) {
  const paths = ['/', '/blog/', ...articles.map(articlePath)]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}\n</urlset>\n`
}
