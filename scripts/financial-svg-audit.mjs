import { JSDOM } from 'jsdom'

const EVENT_HANDLER = /\son[a-z][\w:-]*\s*=/i
const DECLARATION = /<!\s*(?:DOCTYPE|ENTITY)\b/i
const CSS_IMPORT = /@import\b/i
const XML_STYLESHEET = /<\?xml-stylesheet\b/i
const ACTIVE_LOCAL_NAMES = new Set([
  'script',
  'foreignobject',
  'set',
  'animate',
  'animatemotion',
  'animatetransform',
  'discard',
])
const DRAWABLE_LOCAL_NAMES = new Set([
  'circle',
  'ellipse',
  'image',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'text',
  'use',
])

function declaredPaint(element, property) {
  if (element.hasAttribute(property)) return element.getAttribute(property)
  const declaration = element.getAttribute('style')?.match(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, 'i'))
  return declaration?.[1]
}

function effectivePaint(element, property) {
  for (let current = element; current; current = current.parentElement) {
    const declared = declaredPaint(current, property)
    if (declared !== undefined) return declared.trim().toLowerCase()
  }
  return property === 'fill' ? 'black' : 'none'
}

function hasVisiblePaint(element) {
  const visible = (paint) => paint !== 'none' && paint !== 'transparent'
  return visible(effectivePaint(element, 'fill')) || visible(effectivePaint(element, 'stroke'))
}

// CSS escapes may hide active tokens (`@im\70ort`, `u\72l(...)`). Decode the
// lexical form before applying policy checks; this does not mutate the asset.
function decodeCssEscapes(value) {
  return String(value).replace(/\\([0-9a-f]{1,6})(?:\r\n|[\t\n\f\r ])?|\\([^\r\n\f])/gi, (_match, hex, escaped) => {
    if (hex) {
      const point = Number.parseInt(hex, 16)
      return point === 0 || point > 0x10ffff ? '\uFFFD' : String.fromCodePoint(point)
    }
    return escaped
  })
}

function decodeSvgDataUrl(value) {
  const match = value.match(/^data:image\/svg\+xml(?:;charset=[^;,]+)?(;base64)?,(.*)$/is)
  if (!match) return null
  try {
    return match[1]
      ? Buffer.from(match[2].replace(/\s/g, ''), 'base64').toString('utf8')
      : decodeURIComponent(match[2])
  } catch {
    return null
  }
}

function parseSvg(text) {
  try {
    const dom = new JSDOM(text, { contentType: 'image/svg+xml' })
    const root = dom.window.document.documentElement
    return root?.localName === 'svg' ? root : null
  } catch {
    return null
  }
}

export function auditSvg(file, source, depth = 0) {
  const errors = []
  const text = Buffer.isBuffer(source) ? source.toString('utf8') : String(source)
  const root = parseSvg(text)

  if (!root) return [`${file}: XML/SVG malformado`]
  if (!root.hasAttribute('viewBox')) errors.push(`${file}: SVG sin viewBox`)
  const elements = [root, ...root.querySelectorAll('*')]
  if (elements.some((element) => ACTIVE_LOCAL_NAMES.has(element.localName.toLowerCase()))) {
    errors.push(`${file}: elemento activo SVG no permitido`)
  }
  if (EVENT_HANDLER.test(text)) errors.push(`${file}: manejador de evento SVG no permitido`)
  if (DECLARATION.test(text)) errors.push(`${file}: declaración XML no permitida`)
  const cssNormalized = decodeCssEscapes(text)
  if (CSS_IMPORT.test(cssNormalized)) errors.push(`${file}: CSS @import no permitido`)
  if (XML_STYLESHEET.test(text)) errors.push(`${file}: stylesheet XML no permitido`)
  const drawable = elements.filter((element) => DRAWABLE_LOCAL_NAMES.has(element.localName.toLowerCase()))
  if (!root.querySelector('style') && drawable.length > 0 && !drawable.some(hasVisiblePaint)) {
    errors.push(`${file}: SVG sin pintura visible`)
  }

  for (const attribute of elements.flatMap((element) => [...element.attributes])) {
    if (attribute.localName.toLowerCase() !== 'href') continue
    const href = attribute.value.trim()
    if (href.startsWith('#')) continue
    if (/^data:image\/svg\+xml/i.test(href)) {
      if (depth >= 3) {
        errors.push(`${file}: SVG anidado excede la profundidad permitida`)
        continue
      }
      const nested = decodeSvgDataUrl(href)
      if (nested === null) errors.push(`${file}: data:image/svg+xml inválido`)
      else errors.push(...auditSvg(`${file}#data-svg`, nested, depth + 1))
      continue
    }
    if (!/^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(href)) {
      errors.push(`${file}: href externo o inseguro ${href}`)
    }
  }

  for (const match of cssNormalized.matchAll(/url\(\s*["']?([^\)"']+)/gi)) {
    if (!match[1].trim().startsWith('#')) errors.push(`${file}: CSS url externo ${match[1].trim()}`)
  }

  return errors
}
