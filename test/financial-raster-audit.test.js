import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
import { gifMetrics } from '../scripts/financial-raster-audit.mjs'
// One valid static palette pixel, encoded as clear/index/end LZW codes.
const tiny = Buffer.from([...'GIF89a'].map(char => char.charCodeAt(0)).concat([1,0,1,0,128,0,0,0,0,0,255,255,255,44,0,0,0,0,1,0,1,0,0,2,2,68,1,0,59]))
test.each(['GIF87a', 'GIF89a'])('decodes bounded static %s raster', signature => { const fixture = Buffer.from(tiny); fixture.write(signature); expect(gifMetrics(fixture)).toEqual({ width:1, height:1, frameCount:1, transparentCoverage:1 }) })
test('original Lambaré GIF decodes at native size with adequate coverage', () => { expect(gifMetrics(readFileSync('src/assets/financial/bancos/lambare-horizontal.gif'))).toMatchObject({ width:121, height:122, frameCount:1 }); expect(gifMetrics(readFileSync('src/assets/financial/bancos/lambare-horizontal.gif')).transparentCoverage).toBeGreaterThan(0.55) })
test('GIF rejects invalid signature, truncated raster and trailing bytes', () => { for (const fixture of [Buffer.from('not a GIF'),tiny.subarray(0,-2),Buffer.concat([tiny,Buffer.from('extra')])]) expect(() => gifMetrics(fixture)).toThrow() })
test('GIF rejects canvas bombs, invalid palettes, animations and unsupported extensions', () => {
  const large = Buffer.from(tiny); large.writeUInt16LE(65535,6); large.writeUInt16LE(65535,8)
  const palette = Buffer.from(tiny); palette[29]=124
  const animated = Buffer.concat([tiny.subarray(0,-1),tiny.subarray(19)])
  const extension = Buffer.concat([tiny.subarray(0,-1),Buffer.from([33,255,0,0,59])])
  for (const fixture of [large,palette,animated,extension]) expect(() => gifMetrics(fixture)).toThrow()
})
