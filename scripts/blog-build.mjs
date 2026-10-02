import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BLOG_ARTICLES } from '../gallery/blog/articles.js'
import { articlePath, renderArticle, renderBlogIndex, renderSitemap } from '../gallery/blog/render.js'

export async function buildBlog(outputDirectory = fileURLToPath(new URL('../site-dist', import.meta.url))) {
  const blogDirectory = resolve(outputDirectory, 'blog')
  await mkdir(blogDirectory, { recursive: true })
  await writeFile(resolve(blogDirectory, 'index.html'), renderBlogIndex())
  await writeFile(resolve(blogDirectory, 'blog.css'), await readFile(new URL('../gallery/blog/styles.css', import.meta.url)))
  for (const article of BLOG_ARTICLES) {
    const directory = resolve(outputDirectory, articlePath(article).slice(1))
    await mkdir(directory, { recursive: true })
    await writeFile(resolve(directory, 'index.html'), renderArticle(article))
  }
  await writeFile(resolve(outputDirectory, 'sitemap.xml'), renderSitemap())
  console.log(`Static blog: ${BLOG_ARTICLES.length} articles + index, 12 canonical sitemap URLs.`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildBlog()
