import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { JSDOM } from 'jsdom'
import { BLOG_ARTICLES } from '../gallery/blog/articles.js'
import { BLOG_POSTS } from '../gallery/blog/metadata.js'
import { articlePath, articleWordCount, escapeHtml, renderArticle, renderBlogIndex, renderSitemap, scriptJson, SITE_URL } from '../gallery/blog/render.js'
import { buildBlog } from '../scripts/blog-build.mjs'

const dom = (html) => new JSDOM(html).window.document

describe('static editorial SEO', () => {
  test('ten substantive unique guides use verified local sources and lightweight shared metadata', () => {
    expect(BLOG_ARTICLES).toHaveLength(10)
    expect(new Set(BLOG_ARTICLES.map((article) => article.slug)).size).toBe(10)
    expect(new Set(BLOG_ARTICLES.map((article) => article.title)).size).toBe(10)
    expect(new Set(BLOG_ARTICLES.map((article) => article.description)).size).toBe(10)
    expect(BLOG_POSTS.every((post) => !('sections' in post))).toBe(true)
    for (const article of BLOG_ARTICLES) {
      expect(articleWordCount(article)).toBeGreaterThanOrEqual(400)
      expect(articleWordCount(article)).toBeLessThanOrEqual(650)
      expect(article.sources.length).toBeGreaterThan(0)
      for (const source of article.sources) expect(existsSync(source.url.split('/blob/main/')[1]), source.url).toBe(true)
    }
  })

  test('index has crawlable direct links and Blog schema matching visible content', () => {
    const document = dom(renderBlogIndex())
    expect(document.querySelector('h1')?.textContent).toContain('Interfaces claras')
    expect(document.querySelectorAll('.article-card')).toHaveLength(10)
    const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)
    expect(schema['@graph'][0]['@type']).toBe('Blog')
    expect(schema['@graph'][0].blogPost).toHaveLength(10)
    for (const article of BLOG_ARTICLES) expect(document.querySelector(`a[href="${articlePath(article)}"]`)).not.toBeNull()
    expect(document.querySelector('script[src]')).toBeNull()
  })

  test.each(BLOG_ARTICLES)('$slug has complete HTML content, unique metadata and matching BlogPosting', (article) => {
    const document = dom(renderArticle(article))
    const canonical = `${SITE_URL}${articlePath(article)}`
    expect(document.querySelector('h1').textContent).toBe(article.title)
    expect(document.title).toBe(`${article.title} | OwnCoding UI`)
    expect(document.querySelector('meta[name="description"]').content).toBe(article.description)
    expect(document.querySelector('link[rel="canonical"]').href).toBe(canonical)
    expect(document.querySelector('meta[property="og:url"]').content).toBe(canonical)
    expect(document.querySelector('meta[property="og:type"]').content).toBe('article')
    expect(document.querySelector('meta[name="twitter:title"]').content).toBe(document.title)
    for (const section of article.sections) for (const paragraph of section.paragraphs) expect(document.querySelector('.article-body').textContent).toContain(paragraph)
    const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph']
    expect(schema[0]['@type']).toBe('BlogPosting')
    expect(schema[0].headline).toBe(document.querySelector('h1').textContent)
    expect(schema[0].datePublished).toBe(document.querySelector('time').dateTime)
    expect(schema[0].author.name).toBe('OwnCoding UI')
    expect(schema[0].wordCount).toBe(articleWordCount(article))
    expect(schema[1]['@type']).toBe('BreadcrumbList')
    expect(schema[1].itemListElement.at(-1).item).toBe(canonical)
    for (const link of document.querySelectorAll('a[href^="#"]')) expect(document.querySelector(link.getAttribute('href'))).not.toBeNull()
    for (const icon of document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"],link[rel="manifest"]')) expect(existsSync(`gallery/public${new URL(icon.href, SITE_URL).pathname}`)).toBe(true)
    expect(document.querySelector('script[src]')).toBeNull()
  })

  test('HTML and JSON-LD escaping cannot break out of attributes or script', () => {
    const unsafe = '</script><script>alert("x")</script>&\u2028'
    expect(scriptJson({ unsafe })).not.toContain('</script>')
    expect(JSON.parse(scriptJson({ unsafe })).unsafe).toBe(unsafe)
    expect(escapeHtml('<img onerror="x">')).toBe('&lt;img onerror=&quot;x&quot;&gt;')
    const article = { ...BLOG_ARTICLES[0], title: unsafe, description: unsafe }
    const document = dom(renderArticle(article))
    expect(document.querySelectorAll('script')).toHaveLength(1)
    expect(document.querySelector('h1').textContent).toBe(unsafe)
    expect(document.querySelector('meta[name="description"]').content).toBe(unsafe)
  })

  test('sitemap covers home, blog and exactly ten published routes', () => {
    const sitemap = renderSitemap()
    expect(sitemap.match(/<url>/g)).toHaveLength(12)
    expect(readFileSync('gallery/public/sitemap.xml', 'utf8')).toBe(sitemap)
    for (const article of BLOG_ARTICLES) expect(sitemap).toContain(`<loc>${SITE_URL}${articlePath(article)}</loc>`)
  })

  test('generator writes complete pages into deployment output reproducibly', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'owncoding-blog-test-'))
    try {
      await buildBlog(directory)
      const firstIndex = await readFile(join(directory, 'blog/index.html'), 'utf8')
      expect(firstIndex).toBe(renderBlogIndex())
      for (const article of BLOG_ARTICLES) expect(await readFile(join(directory, articlePath(article).slice(1), 'index.html'), 'utf8')).toBe(renderArticle(article))
      expect(await readFile(join(directory, 'sitemap.xml'), 'utf8')).toBe(renderSitemap())
      await buildBlog(directory)
      expect(await readFile(join(directory, 'blog/index.html'), 'utf8')).toBe(firstIndex)
    } finally { await rm(directory, { recursive: true, force: true }) }
  })

  test('production build and gallery navigation include the static blog', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    expect(packageJson.scripts['gallery:build']).toContain('node scripts/blog-build.mjs')
    const source = readFileSync('gallery/main.jsx', 'utf8')
    expect(source).toContain('href="/blog/"')
    expect(source).toContain("{ href: '/blog/', etiqueta: 'Blog' }")
    expect(source).not.toContain("from './blog/articles.js'")
  })
})
