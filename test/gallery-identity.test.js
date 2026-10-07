import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { expect, test } from 'vitest'
import { renderBlogIndex } from '../gallery/blog/render.js'

const read = (file) => readFileSync(file, 'utf8')
test('gallery identity is scoped, self-hosted and does not change consumer tokens', () => {
  const css = read('gallery/identity.css')
  expect(css).toContain('html.ownui-gallery')
  expect(css).toContain('--c-fono: 35 64 230')
  expect(css).toContain('--c-paper: 246 245 242')
  expect(css).toContain('Schibsted Grotesk')
  expect(css).not.toMatch(/https?:|@import/)
  expect(read('src/styles/tokens.css')).not.toContain('Schibsted Grotesk')
  for (const file of ['schibsted-grotesk-latin.woff2', 'jetbrains-mono-latin.woff2', 'jetbrains-mono-latin-ext.woff2', 'Schibsted-OFL.txt', 'JetBrains-OFL.txt']) {
    expect(existsSync(`gallery/public/fonts/${file}`)).toBe(true)
  }
})
test('web, social, README and blog share the grid identity', () => {
  const mark = read('gallery/public/favicon.svg')
  expect(mark).toContain('x="34" y="14"')
  expect(mark).toContain('#2340E6')
  expect(mark).toContain('fill="none"')
  expect(read('gallery/main.jsx')).toContain('owncoding<span>/ui</span>')
  expect(read('docs/assets/readme-hero.svg')).toContain('owncoding')
  expect(read('gallery/public/og-owncoding-ui.svg')).toContain('owncoding')
  expect(renderBlogIndex()).toContain('owncoding<b>/ui</b>')
})

test('self-hosted font inventory pins verified distribution bytes and copyright licenses', () => {
  const inventory = JSON.parse(read('gallery/public/fonts/sources.json'))
  expect(inventory).toHaveLength(3)
  for (const font of inventory) {
    const bytes = readFileSync(`gallery/public/fonts/${font.file}`)
    expect(bytes.subarray(0, 4).toString()).toBe('wOF2')
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(font.sha256)
    expect(new URL(font.verifiedSource).hostname).toBe('fonts.gstatic.com')
    expect(read(`gallery/public/fonts/${font.license}`)).toContain('SIL OPEN FONT LICENSE Version 1.1')
  }
})
