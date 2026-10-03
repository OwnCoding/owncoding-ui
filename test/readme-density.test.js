import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { expect, it } from 'vitest'
const read = file => readFileSync(file, 'utf8')
it('README exposes inventory and fixed-version quickstart before priority visuals without losing reference docs', () => {
  const source = read('README.md')
  expect(source.indexOf('## Catálogo actual')).toBeLessThan(source.indexOf('## Inicio rápido'))
  expect(source.indexOf('## Inicio rápido')).toBeLessThan(source.indexOf('docs/assets/readme-financial.svg'))
  expect(source).toContain('Configurar Tailwind, estilos y primer componente')
  expect(source).toContain('no prueba de despliegue de este rediseño')
  for (const path of ['docs/ADOPCION.md', 'docs/REGLAS.md', 'docs/ACCESIBILIDAD.md']) expect(source).toContain(path)
  const images = ['financial', 'phone', 'smart-inputs'].map(name => source.indexOf(`docs/assets/readme-${name}.svg`))
  expect(images).toEqual([...images].sort((a, b) => a - b))
})
it('editorial panels have compact canvases and remain accessible, without external media', () => {
  const ceilings = { hero: 340, financial: 626, phone: 552, 'smart-inputs': 580, components: 626, identity: 554 }
  for (const [name, ceiling] of Object.entries(ceilings)) {
    const source = read(`docs/assets/readme-${name}.svg`)
    const height = Number(source.match(/<svg[^>]*height="(\d+)"/)[1])
    expect(height).toBeLessThanOrEqual(ceiling)
    expect(source).toContain('role="img"'); expect(source).toContain('<title'); expect(source).toContain('<desc')
    expect(source).not.toMatch(/<script|href="https?:/)
  }
})
// Embedded payload digests from the verified f269fe4 editorial baseline; labels may be historical.
const baselineAssets = {
  "bancos/ueno-compacto.svg": "7c4192237fc114c1e8688c4c19f6c428173d580aa2cdb1e3b04613cf718efec9",
  "bancos/ueno-horizontal.svg": "68ce499ed273ace6075006690089c32c6b51fd2e307c9b20229234252d5aa86b",
  "bancos/basa-horizontal.svg": "ace264e7547acb347009a62b69964b817f5baf7fef57f63d3156586244a2f2ec",
  "bancos/familiar-horizontal.webp": "50ce89718b045e424cde9d4e0184d738a35b482efc22d200bbb5907345b80b48",
  "bancos/sudameris-horizontal.svg": "11dbe174a816ecff14532c9d6e7d7b14633ea95a4d7e7e54e892bada4ed71f34",
  "bancos/bancop-horizontal.png": "302928c3475014c39324a543ec82893270a3f2112fa6fbff012a3da3213e53fc",
  "bancos/itau-horizontal.png": "6cf09c0b922bad5fb64518bd5454f0e869df9827ebee48885e7e921403eac036",
  "pagos/bancard-horizontal.png": "19975900383d461ebc65bb03843ba8d528ac5212a4d54af361a07a19c8dd50bf",
  "pagos/dinelco-horizontal.svg": "6c3b8b18579e6375722df1fdbb60a03220a55f098c8a54f325cbf36e33339d68",
  "pagos/upay-horizontal.svg": "beae5351ae9f194e7549a0a5ac460922f4e97c52df3ffef68e849753862346c7",
  "pagos/pagopar-horizontal.svg": "8903a9f990381b21a10ffa1b4d05f5136a2948db39b9e068795fa0d3f23babc9",
  "pagos/amex-horizontal.svg": "5b67bce7893fcbe8360c0c840c54607185f0025482efba7221b878a474c019d1",
  "pagos/mango-horizontal.svg": "43f2e45f30cba5f4f61712f30181bc043836687df193f723d51d4b9cb63469f6",
  "pagos/vaquita-horizontal.png": "9ef001513dd1edb3d2dae43d287de3874e0e0b939c493773c5db6cf52d0a4ce0",
  "pagos/eko-horizontal.svg": "c7a5b71f1ae1068fffe9f39f4073574eaa96ba7c8cd9aa0d3746e81e0ba63d44",
  "pagos/eclub-horizontal.svg": "317e954089a80baf2ab2430c204b7efd090821e769cceb32617e308dedb059d4",
  "pagos/pik-horizontal.svg": "7ca6cff1b1a8fc8bc704d4ccc4739b316859f17509c30097f57b3bacf94a719c"
}
it('financial composition preserves every baseline embedded asset byte-for-byte', () => {
  const source = read('docs/assets/readme-financial.svg')
  const images = [...source.matchAll(/<image\b[^>]*data-financial-asset="([^"]+)"[^>]*href="data:image\/[^;]+;base64,([^"]+)"/g)]
  expect(images).toHaveLength(18)
  expect(Object.keys(baselineAssets)).toHaveLength(17)
  expect([...new Set(images.map(([, file]) => file))].sort()).toEqual(Object.keys(baselineAssets).sort())
  for (const [, file, payload] of images) {
    const actual = createHash('sha256').update(Buffer.from(payload, 'base64')).digest('hex')
    expect(actual).toBe(baselineAssets[file])
  }
})
