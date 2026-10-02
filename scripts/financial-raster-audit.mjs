import { inflateSync } from 'node:zlib'

export function pngMetrics(source) {
  let offset = 8
  let width
  let height
  let bitDepth
  let colorType
  let interlace
  let transparency = null
  const chunks = []
  while (offset < source.length) {
    const length = source.readUInt32BE(offset)
    const type = source.toString('ascii', offset + 4, offset + 8)
    const data = source.subarray(offset + 8, offset + 8 + length)
    offset += length + 12
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      interlace = data[12]
    } else if (type === 'tRNS') transparency = data
    else if (type === 'IDAT') chunks.push(data)
    else if (type === 'IEND') break
  }
  const metrics = { width, height, transparentCoverage: null }
  if (bitDepth !== 8 || interlace !== 0 || ![3, 4, 6].includes(colorType)) return metrics

  const channels = colorType === 6 ? 4 : colorType === 4 ? 2 : 1
  const stride = width * channels
  const raw = inflateSync(Buffer.concat(chunks))
  const paeth = (left, up, upLeft) => {
    const estimate = left + up - upLeft
    const leftDistance = Math.abs(estimate - left)
    const upDistance = Math.abs(estimate - up)
    const diagonalDistance = Math.abs(estimate - upLeft)
    return leftDistance <= upDistance && leftDistance <= diagonalDistance ? left : upDistance <= diagonalDistance ? up : upLeft
  }
  let previous = Buffer.alloc(stride)
  let cursor = 0
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < height; y += 1) {
    const filter = raw[cursor]
    cursor += 1
    const row = Buffer.alloc(stride)
    for (let index = 0; index < stride; index += 1) {
      const encoded = raw[cursor]
      cursor += 1
      const left = index >= channels ? row[index - channels] : 0
      const up = previous[index] || 0
      const upLeft = index >= channels ? previous[index - channels] : 0
      const predictor = filter === 0 ? 0 : filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : paeth(left, up, upLeft)
      row[index] = (encoded + predictor) & 255
    }
    for (let x = 0; x < width; x += 1) {
      const alpha = colorType === 3 ? (transparency?.[row[x]] ?? 255) : row[x * channels + channels - 1]
      if (alpha > 8) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
    previous = row
  }
  if (maxX >= minX && maxY >= minY) metrics.transparentCoverage = ((maxX - minX + 1) * (maxY - minY + 1)) / (width * height)
  return metrics
}

/** Decode one bounded static GIF87a/89a frame for raster size/coverage checks.
 * Animation, malformed blocks, palette references and decompression expansion
 * fail closed; no browser, network, canvas or image rewriting is involved.
 */
export function gifMetrics(input) {
  const source = Buffer.from(input)
  let cursor = 0
  const read = count => { if (cursor + count > source.length) throw new Error('truncated block'); const bytes = source.subarray(cursor, cursor + count); cursor += count; return bytes }
  const word = () => read(2).readUInt16LE(0)
  const byte = () => read(1)[0]
  const blocks = () => { const chunks = []; let size; while ((size = byte()) !== 0) chunks.push(read(size)); return Buffer.concat(chunks) }
  const signature = read(6).toString('ascii')
  if (!['GIF87a', 'GIF89a'].includes(signature)) throw new Error('invalid signature')
  const width = word(), height = word(), flags = byte(); byte(); byte()
  if (!width || !height || width * height > 16_777_216) throw new Error('invalid or oversized canvas')
  let palette = flags & 128 ? read(3 * (2 ** ((flags & 7) + 1))) : null
  let transparent = null
  let frameCount = 0
  let pixels = null
  let frame
  let ended = false
  while (cursor < source.length) {
    const marker = byte()
    if (marker === 0x3b) { ended = true; break }
    if (marker === 0x21) {
      const label = byte()
      if (label === 0xf9) {
        if (byte() !== 4) throw new Error('invalid graphic control')
        const control = read(4)
        transparent = control[0] & 1 ? control[3] : null
        if (byte() !== 0) throw new Error('invalid control terminator')
      } else if (label === 0xfe) blocks()
      else throw new Error('unsupported GIF extension')
      continue
    }
    if (marker !== 0x2c || ++frameCount !== 1) throw new Error('invalid or animated GIF')
    const left = word(), top = word(), frameWidth = word(), frameHeight = word(), imageFlags = byte()
    if (!frameWidth || !frameHeight || left + frameWidth > width || top + frameHeight > height) throw new Error('frame outside canvas')
    if (imageFlags & 128) palette = read(3 * (2 ** ((imageFlags & 7) + 1)))
    if (!palette) throw new Error('missing color table')
    if (transparent !== null && transparent * 3 >= palette.length) throw new Error('invalid transparency index')
    const minimum = byte()
    if (minimum < 2 || minimum > 8) throw new Error('invalid LZW size')
    const compressed = blocks()
    const clear = 1 << minimum, end = clear + 1
    let dictionary, size, bit = 0, previous = null, finished = false
    const reset = () => { dictionary = Array.from({ length: clear }, (_, index) => [index]); dictionary.push(null, null); size = minimum + 1; previous = null }
    reset()
    const output = []
    while (bit + size <= compressed.length * 8) {
      let code = 0
      for (let shift = 0; shift < size; shift++) { code |= ((compressed[bit >> 3] >> (bit & 7)) & 1) << shift; bit++ }
      if (code === clear) { reset(); continue }
      if (code === end) { finished = true; break }
      const entry = dictionary[code] ?? (code === dictionary.length && previous ? [...previous, previous[0]] : null)
      if (!entry) throw new Error('invalid LZW code')
      if (output.length + entry.length > frameWidth * frameHeight) throw new Error('LZW exceeds frame')
      output.push(...entry)
      if (previous && dictionary.length < 4096) { dictionary.push([...previous, entry[0]]); if (dictionary.length === 1 << size && size < 12) size++ }
      previous = entry
    }
    if (!finished || output.length !== frameWidth * frameHeight || output.some(index => index * 3 >= palette.length)) throw new Error('incomplete or invalid raster')
    pixels = output
    frame = { left, top, width: frameWidth, height: frameHeight, interlaced: Boolean(imageFlags & 64) }
  }
  if (!ended || cursor !== source.length || !pixels) throw new Error('missing raster/trailer or trailing bytes')
  let minX = width, minY = height, maxX = -1, maxY = -1, offset = 0
  const rows = frame.interlaced ? [[0, 8], [4, 8], [2, 4], [1, 2]].flatMap(([start, step]) => { const result = []; for (let y = start; y < frame.height; y += step) result.push(y); return result }) : Array.from({ length: frame.height }, (_, y) => y)
  for (const y of rows) for (let x = 0; x < frame.width; x++) {
    if (pixels[offset++] !== transparent) { minX = Math.min(minX, x + frame.left); maxX = Math.max(maxX, x + frame.left); minY = Math.min(minY, y + frame.top); maxY = Math.max(maxY, y + frame.top) }
  }
  return { width, height, frameCount, transparentCoverage: maxX < minX ? 0 : ((maxX - minX + 1) * (maxY - minY + 1)) / (width * height) }
}
