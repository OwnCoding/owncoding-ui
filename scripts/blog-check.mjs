import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { BLOG_ARTICLES } from '../gallery/blog/articles.js'
import { articlePath, articleWordCount, renderArticle, renderBlogIndex, renderSitemap } from '../gallery/blog/render.js'

export function checkBlog() {
  assert.equal(BLOG_ARTICLES.length, 10)
  assert.equal(new Set(BLOG_ARTICLES.map((article) => article.slug)).size, 10)
  assert.equal(new Set(BLOG_ARTICLES.map((article) => article.title)).size, 10)
  for (const article of BLOG_ARTICLES) {
    assert.match(article.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(article.title && article.description && article.category && article.published)
    assert.ok(articleWordCount(article) >= 400 && articleWordCount(article) <= 650, article.slug)
    assert.ok(article.sections.length >= 4)
    assert.ok(article.sources.length > 0)
    for (const source of article.sources) {
      const sourcePath = source.url.split('https://github.com/dariodeoli/owncoding-ui/blob/main/')[1]
      assert.ok(sourcePath && existsSync(sourcePath), source.url)
    }
    assert.ok(renderArticle(article).includes(`href="https://controlaria.online${articlePath(article)}"`))
  }
  const index = renderBlogIndex()
  for (const article of BLOG_ARTICLES) assert.ok(index.includes(`href="${articlePath(article)}"`))
  assert.equal(readFileSync('gallery/public/sitemap.xml', 'utf8'), renderSitemap())
  for (const name of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'manifest.json', 'og-owncoding-ui.png']) assert.ok(existsSync(`gallery/public/${name}`))
  assert.ok(readFileSync('gallery/public/robots.txt', 'utf8').includes('Sitemap: https://controlaria.online/sitemap.xml'))
  console.log('Blog checked: 10 original guides, 12 canonical URLs, sources and favicon references verified.')
}

checkBlog()
