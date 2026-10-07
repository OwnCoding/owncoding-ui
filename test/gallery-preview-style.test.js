import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { expect, test } from 'vitest'

const read = (path) => readFileSync(path, 'utf8')
const css = () => postcss.parse(read('gallery/previews.css'))
const luminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi).map((part) => {
    const value = Number.parseInt(part, 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}
const contrast = (foreground, background) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

test('preview stylesheet loads after gallery identity and scopes every selector', () => {
  const main = read('gallery/main.jsx')
  expect(main.indexOf("import './previews.css'")).toBeGreaterThan(main.indexOf("import './identity.css'"))
  css().walkRules((rule) => expect(rule.selector).toMatch(/^\.ownui-gallery\s/))
  expect(main).toContain('<h4>Paraguay listo por defecto</h4>')
  expect(main).not.toContain('🇵🇾 Paraguay listo por defecto')
})

test('dark result panels and selected examples meet normal text AA contrast', () => {
  const colors = new Set()
  css().walkDecls('color', ({ value }) => colors.add(value))
  for (const color of ['#F6F5F2', '#8B909A', '#8FA0FF', '#C9CCD3', '#B9BDC6']) {
    expect(colors.has(color)).toBe(true)
    expect(contrast(color, '#0E1116')).toBeGreaterThanOrEqual(4.5)
  }
  expect(contrast('#FFFFFF', '#2340E6')).toBeGreaterThanOrEqual(4.5)
  expect(read('gallery/previews.css')).toContain('button[aria-pressed="true"]')
  expect(read('gallery/previews.css')).toContain('prefers-reduced-motion: reduce')
})
