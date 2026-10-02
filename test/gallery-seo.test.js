import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

const SITE_URL = 'https://controlaria.online/'
const PUBLIC_DIR = 'gallery/public'
const INDEX = readFileSync('gallery/index.html', 'utf8')

function attribute(tag, name) {
  return tag.match(new RegExp(`${name}="([^"]+)"`))?.[1]
}

function metaBy(attributeName, value) {
  return INDEX.match(new RegExp(`<meta[^>]+${attributeName}="${value}"[^>]*>`))?.[0]
}

describe('identidad publica y SEO de la galeria', () => {
  test('publica metadata canonica, social y de indexacion coherente', () => {
    expect(INDEX).toContain(`<link rel="canonical" href="${SITE_URL}" />`)
    expect(attribute(metaBy('name', 'description'), 'content')?.length).toBeGreaterThanOrEqual(120)
    expect(attribute(metaBy('name', 'robots'), 'content')).toContain('index, follow')
    expect(attribute(metaBy('property', 'og:url'), 'content')).toBe(SITE_URL)
    expect(attribute(metaBy('property', 'og:locale'), 'content')).toBe('es_PY')
    expect(attribute(metaBy('property', 'og:image'), 'content')).toBe(`${SITE_URL}og-owncoding-ui.png`)
    expect(attribute(metaBy('property', 'og:image:width'), 'content')).toBe('1200')
    expect(attribute(metaBy('property', 'og:image:height'), 'content')).toBe('630')
    expect(attribute(metaBy('name', 'twitter:card'), 'content')).toBe('summary_large_image')
    expect(attribute(metaBy('name', 'twitter:image'), 'content')).toBe(`${SITE_URL}og-owncoding-ui.png`)
  })

  test('incluye favicons y manifest con todos sus archivos locales', () => {
    const expectedAssets = [
      'favicon.ico',
      'favicon.svg',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'apple-touch-icon.png',
      'mask-icon.svg',
      'app-icon-192.png',
      'app-icon-512.png',
      'app-icon-maskable-512.png',
      'og-owncoding-ui.png',
      'manifest.json',
      'site.webmanifest',
      'robots.txt',
      'sitemap.xml',
    ]

    for (const asset of expectedAssets) {
      expect(existsSync(`${PUBLIC_DIR}/${asset}`), asset).toBe(true)
    }

    const iconLinks = [...INDEX.matchAll(/<link rel="(?:icon|apple-touch-icon|mask-icon|manifest)"[^>]*>/g)].map(([tag]) => tag)
    expect(iconLinks).toHaveLength(7)
    const revisions = new Set()
    for (const tag of iconLinks) {
      const url = new URL(attribute(tag, 'href'), SITE_URL)
      expect(existsSync(`${PUBLIC_DIR}${url.pathname}`), url.pathname).toBe(true)
      expect(url.searchParams.get('v')).toMatch(/^[a-f0-9]{12}$/)
      revisions.add(url.searchParams.get('v'))
    }
    expect(revisions.size).toBe(1)
    expect(iconLinks.find((tag) => tag.includes('/favicon.svg?'))).toContain('sizes="any"')
    expect(iconLinks.find((tag) => tag.includes('/manifest.json?'))).toContain('type="application/json"')
    const revision = [...revisions][0]

    const manifestSource = readFileSync(`${PUBLIC_DIR}/manifest.json`, 'utf8')
    expect(manifestSource).toBe(readFileSync(`${PUBLIC_DIR}/site.webmanifest`, 'utf8'))
    const manifest = JSON.parse(manifestSource)
    expect(manifest.lang).toBe('es-PY')
    expect(manifest.icons.map(({ src, sizes, purpose }) => ({ src, sizes, purpose }))).toEqual([
      { src: `/app-icon-192.png?v=${revision}`, sizes: '192x192', purpose: 'any' },
      { src: `/app-icon-512.png?v=${revision}`, sizes: '512x512', purpose: 'any' },
      { src: `/app-icon-maskable-512.png?v=${revision}`, sizes: '512x512', purpose: 'maskable' },
    ])
  })

  test('serves a multi-size ICO containing the existing PNG artwork', () => {
    const ico = readFileSync(`${PUBLIC_DIR}/favicon.ico`)
    expect(ico.readUInt16LE(0)).toBe(0)
    expect(ico.readUInt16LE(2)).toBe(1)
    expect(ico.readUInt16LE(4)).toBe(3)
    const assets = ['favicon-16x16.png', 'favicon-32x32.png', 'app-icon-192.png']
    const sizes = [16, 32, 192]
    assets.forEach((asset, index) => {
      const entry = 6 + index * 16
      const length = ico.readUInt32LE(entry + 8)
      const offset = ico.readUInt32LE(entry + 12)
      expect(ico[entry]).toBe(sizes[index])
      expect(ico[entry + 1]).toBe(sizes[index])
      expect(ico.readUInt16LE(entry + 4)).toBe(1)
      expect(ico.readUInt16LE(entry + 6)).toBe(32)
      const png = ico.subarray(offset, offset + length)
      expect(png.equals(readFileSync(`${PUBLIC_DIR}/${asset}`))).toBe(true)
      expect(png.readUInt32BE(16)).toBe(sizes[index])
      expect(png.readUInt32BE(20)).toBe(sizes[index])
    })
  })

  test('mantiene robots, sitemap y JSON-LD limitados al sitio publico y sus guías', () => {
    const robots = readFileSync(`${PUBLIC_DIR}/robots.txt`, 'utf8')
    const sitemap = readFileSync(`${PUBLIC_DIR}/sitemap.xml`, 'utf8')
    expect(robots).toContain(`Sitemap: ${SITE_URL}sitemap.xml`)
    expect(sitemap).toContain(`<loc>${SITE_URL}</loc>`)
    expect(sitemap.match(/<url>/g)).toHaveLength(12)

    const jsonLd = INDEX.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
    expect(jsonLd).toBeTruthy()
    const schema = JSON.parse(jsonLd)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@graph'].map((item) => item['@type'])).toEqual(['WebSite', 'SoftwareApplication'])
    expect(JSON.stringify(schema)).not.toMatch(/aggregateRating|offers|address|sameAs/)
  })
})
