import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  BANCO_DESTACADO,
  BANCOS_PREVIEW,
  MARCAS_PAGO_PREVIEW,
  SOLUCIONES_PAGO_COMERCIOS_PREVIEW,
} from '../gallery/financial-fixtures.js'
import {
  ASSET_KEYS_FINANCIEROS,
  BLOQUEOS_ASSETS_FINANCIEROS,
  BANCOS_PARAGUAY,
  BANCOS_Y_FINANCIERAS_PARAGUAY,
  COOPERATIVAS_PARAGUAY,
  MARCAS_MEDIOS_PAGO,
  MEDIOS_PAGO_CON_MARCA,
  SOLUCIONES_PAGO_COMERCIOS,
  BancoLogo,
  MedioPagoLogo,
  coberturaBancos,
  coberturaMediosPago,
  logoDeBanco,
  logoDeMedioPago,
} from '../src/financial/index.js'

const manifest = JSON.parse(readFileSync(join(process.cwd(), 'docs/financial-assets-manifest.json'), 'utf8'))

function variantesEmpaquetadas(entrada) {
  return Object.values(entrada.variantes).filter((visual) => visual.empaquetado)
}

function htmlLogo(Componente, prop, nombre, variante) {
  return renderToStaticMarkup(<Componente {...{ [prop]: nombre }} variante={variante} />)
}

describe('catálogo de instituciones financieras', () => {
  test('la revisión completa destaca ueno y muestra assets auténticos o bloqueos explícitos', () => {
    expect(BANCO_DESTACADO).toBe('ueno bank')
    expect(BANCOS_PREVIEW[0]).toBe(BANCO_DESTACADO)
    expect(BANCOS_PREVIEW).toHaveLength(BANCOS_PARAGUAY.length)

    for (const nombre of BANCOS_PREVIEW) {
      expect(BANCOS_PARAGUAY).toContain(nombre)
      for (const variante of ['compacto', 'horizontal']) {
        const registro = logoDeBanco(nombre, variante)
        expect(registro).toMatchObject({ banco: nombre })
        const html = htmlLogo(BancoLogo, 'banco', nombre, variante)
        if (registro.visual.empaquetado) {
          expect(registro).toMatchObject({ redistribucion: { permitida: true } })
          expect(registro.visual.asset).toMatch(/^(?:data:image\/|\/src\/assets\/financial\/)/)
          expect(html).toContain('<img')
          expect(html).toMatch(/src="(?:data:image\/|\/src\/assets\/financial\/)/)
          expect(html).not.toMatch(/src="https?:/)
        } else {
          expect(registro.visual).toMatchObject({ tipo: 'texto', estado: 'asset-bloqueado' })
        }
        expect(html).not.toContain('data-logo-tipo="monograma"')
      }
    }
  })

  test('completa siete instituciones con marcas oficiales y declara las presentaciones contenidas', () => {
    const contained = {
      Citi: ['compacto', 'horizontal-contained'],
      'Itaú': ['horizontal', 'marca-contained'],
      'Tu Financiera': ['horizontal', 'marca-contained'],
    }
    for (const nombre of ['Banco Continental', 'Banco GNB Paraguay', 'Citi', 'Itaú', 'Tu Financiera', 'Universitaria', 'San Cristóbal']) {
      for (const variante of ['compacto', 'horizontal']) {
        const registro = logoDeBanco(nombre, variante)
        expect(registro.estado).toBe('verificado')
        expect(registro.visual.empaquetado).toBeTruthy()
        expect(htmlLogo(BancoLogo, 'banco', nombre, variante)).toContain('<img')
      }
      expect(BLOQUEOS_ASSETS_FINANCIEROS.some((item) => item.catalogo === 'banco' && item.id === nombre)).toBe(false)
    }
    for (const [nombre, [variante, tipo]] of Object.entries(contained)) {
      const visual = logoDeBanco(nombre, variante).visual
      expect(visual).toMatchObject({ tipo, estado: 'oficial', descripcion: expect.stringContaining('contenida') })
      const html = htmlLogo(BancoLogo, 'banco', nombre, variante)
      expect(html).toContain(`data-logo-tipo="${tipo}"`)
      expect(html).toContain(visual.descripcion)
      expect(html).not.toContain(`aria-label="${nombre}, logo ${variante}"`)
    }
    for (const [name, file] of [['Banco GNB Paraguay', 'gnb-compacto.png'], ['San Cristóbal', 'san-cristobal-compacto.png']]) {
      expect(logoDeBanco(name, 'compacto').visual).toMatchObject({ tipo: 'archivo', estado: 'aportado-usuario', empaquetado: `bancos/${file}` })
    }
    expect(logoDeBanco('Itaú', 'horizontal').visual).toMatchObject({ fondo: '#EC7000', padding: true })
  })

  test('el catálogo ofrecido excluye Banco do Brasil y conserva lookup histórico', () => {
    expect(BANCOS_PARAGUAY).toHaveLength(32)
    expect(BANCOS_PARAGUAY).not.toContain('Banco do Brasil')
    expect(BANCOS_PREVIEW).not.toContain('Banco do Brasil')
    expect(logoDeBanco('Banco do Brasil', 'compacto').banco).toBe('Banco do Brasil')
  })

  test('Banco do Brasil conserva el bloqueo de calidad sin ampliar el favicon oficial', () => {
    for (const variante of ['compacto', 'horizontal']) {
      expect(logoDeBanco('Banco do Brasil', variante).visual).toMatchObject({ tipo: 'texto', estado: 'asset-bloqueado' })
    }
    const blocker = manifest.blockers.find((item) => item.id === 'Banco do Brasil')
    expect(blocker).toMatchObject({
      sourceUrl: 'https://www.bb.com.br/site/wp-content/themes/portal40/img/icn-am.ico',
      verifiedAt: '2026-10-02',
      dimensions: { width: 48, height: 48 },
      minimumRasterPixels: 64,
      sourceSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
    expect(manifest.assets.some((asset) => /brasil/.test(asset.file))).toBe(false)
  })

  test('los nuevos assets tienen fecha, dimensiones, hash y permiso limitado verificables', () => {
    for (const file of ['continental-horizontal.svg', 'citi-horizontal.svg', 'gnb-horizontal.svg', 'itau-compacto.svg', 'universitaria-compacto.png', 'universitaria-horizontal.svg']) {
      const asset = manifest.assets.find((item) => item.file === `bancos/${file}`)
      expect(asset).toMatchObject({
        sourceKind: 'official-first-party', retrievedAt: '2026-10-02',
        dimensions: { width: expect.any(Number), height: expect.any(Number) },
        authorization: { confirmedAt: '2026-10-01', note: expect.stringContaining('not represented as an open license') },
      })
      expect(asset.sha256).toBe(createHash('sha256').update(readFileSync(join(process.cwd(), 'src/assets/financial', asset.file))).digest('hex'))
    }
    const citi = manifest.assets.find((item) => item.file === 'bancos/citi-horizontal.svg')
    expect(citi).toMatchObject({ sourceUrl: 'https://www.citigroup.com/global/about-us/global-presence/paraguay', termsUrl: 'https://www.citigroup.com/global/terms', extraction: 'Decoded the first 204x118 SVG data URL in the official Paraguay page; artwork unchanged.' })
    const universitaria = manifest.assets.find((item) => item.file === 'bancos/universitaria-horizontal.svg')
    expect(universitaria).toMatchObject({ sourceSha256: expect.stringMatching(/^[a-f0-9]{64}$/), transformation: 'Removed the external DOCTYPE declaration, normalized line endings to LF and removed trailing whitespace only; geometry, paint and viewBox unchanged.' })
    expect(universitaria.sourceSha256).not.toBe(universitaria.sha256)
    const gnb = manifest.assets.find((item) => item.file === 'bancos/gnb-horizontal.svg')
    expect(gnb).toMatchObject({
      sourceSha256: '34e7b71b6a213db423ed962a8c4cfed75bb31262bd41439e686f59fd5ddb4cbf',
      transformation: 'Normalized line endings to LF and removed trailing whitespace only; geometry, paint and viewBox unchanged.',
    })
    expect(gnb.sourceSha256).not.toBe(gnb.sha256)
    for (const asset of [gnb, universitaria]) {
      const svg = readFileSync(join(process.cwd(), 'src/assets/financial', asset.file), 'utf8')
      expect(svg).not.toContain('\r')
      expect(svg).not.toMatch(/[ \t]+$/m)
    }
  })

  test('mantiene metadatos, alias y URLs oficiales corregidas', async () => {
    expect(BANCOS_Y_FINANCIERAS_PARAGUAY).toContain('Zeta Banco')
    expect(COOPERATIVAS_PARAGUAY).toEqual(['Coomecipar', 'Medalla Milagrosa', 'San Cristóbal', 'Universitaria', 'Luque', 'Coopeduc', 'Capiatá', 'Ñemby', 'Lambaré', 'Coodeñe', 'Mburicaó', 'Mercado Nº 4', 'San Lorenzo'])
    expect(logoDeBanco('FINANCIERA FINEXPAR')).toMatchObject({ banco: 'Zeta Banco' })
    expect(logoDeBanco('Visión Banco')).toMatchObject({ banco: 'ueno bank', aliasHistorico: 'Visión Banco' })
    expect(logoDeBanco('Banco Rio')).toMatchObject({ banco: 'Banco Continental', aliasHistorico: 'Banco Río' })
    expect(logoDeBanco('ITAU')).toMatchObject({ banco: 'Itaú' })

    const { LOGOS_BANCOS, sugerenciasDeBanco } = await import('../src/utils/bancos.js')
    expect(LOGOS_BANCOS['Medalla Milagrosa'].fuenteOficial).toBe('https://www.medalla.coop.py/')
    expect(LOGOS_BANCOS.Universitaria.fuenteOficial).toBe('https://www.universitaria.coop/')
    expect(LOGOS_BANCOS['Tu Financiera'].fuenteOficial).toBe('https://tu.com.py/')
    expect(LOGOS_BANCOS['Zeta Banco'].fuenteOficial).toBe('https://www.zbanco.com.py/')
    expect(sugerenciasDeBanco('Banco Itaú Paraguay')).toEqual(['Itaú'])
  })

  test('los logos claros conservan pintura y superficies de contraste explícitas', async () => {
    const { LOGOS_BANCOS } = await import('../src/utils/bancos.js')
    expect(LOGOS_BANCOS.Sudameris.variantes).toMatchObject({
      compacto: { fondo: '#FF0000', padding: true },
      horizontal: { fondo: '#FF0000', padding: true },
    })
    expect(LOGOS_BANCOS['Banco Nacional de Fomento'].variantes.horizontal).toMatchObject({ fondo: '#0B1F3A', padding: true })
    expect(LOGOS_BANCOS.Coomecipar.variantes.horizontal).toMatchObject({ fondo: '#092959', padding: true })
    expect(LOGOS_BANCOS['San Cristóbal'].variantes.horizontal).toMatchObject({ fondo: '#5FAD3E', padding: true })

    const sudamerisCompacto = readFileSync(join(process.cwd(), 'src/assets/financial/bancos/sudameris-compacto.svg'), 'utf8')
    expect(sudamerisCompacto).toMatch(/<path\s+fill="#FFFFFE"/)

    const css = readFileSync(join(process.cwd(), 'gallery/styles.css'), 'utf8')
    const superficie = css.match(/\.bank-variant__surface\s*\{([\s\S]*?)\n\}/)?.[1]
    expect(superficie).toContain('background: #fff')
    expect(superficie).toContain('color: #1f2937')
    expect(superficie).not.toContain('var(--c-ink)')
  })

  test('cada entidad conocida usa un asset oficial o un bloqueo textual explícito, nunca iniciales', () => {
    const bloqueados = new Set(BLOQUEOS_ASSETS_FINANCIEROS.filter((item) => item.catalogo === 'banco').map((item) => item.id))
    for (const entrada of coberturaBancos()) {
      expect(entrada.fuenteOficial).toMatch(/^https:\/\//)
      expect(entrada.verificadoEn).toBe('2026-10-02')
      for (const [variante, visual] of Object.entries(entrada.variantes)) {
        expect(visual.tipo).not.toBe('monograma')
        if (!visual.empaquetado) {
          expect(bloqueados).toContain(entrada.nombre)
          expect(visual.tipo).toBe('texto')
          expect(htmlLogo(BancoLogo, 'banco', entrada.nombre, variante)).not.toContain('data-logo-tipo="monograma"')
        }
      }
    }
  })
})

describe('marcas y productos de pago', () => {
  test('agrupa alternativas funcionales para comercios sin mezclar relaciones corporativas', () => {
    expect(SOLUCIONES_PAGO_COMERCIOS).toMatchObject({
      id: 'soluciones-pago-comercios',
      titulo: 'Aceptación y pagos para comercios',
      marcas: ['Bancard', 'Dinelco', 'upay', 'Pik'],
    })
    expect(SOLUCIONES_PAGO_COMERCIOS_PREVIEW).toBe(SOLUCIONES_PAGO_COMERCIOS)

    for (const nombre of SOLUCIONES_PAGO_COMERCIOS.marcas) {
      const compacto = logoDeMedioPago(nombre, 'compacto')
      const horizontal = logoDeMedioPago(nombre, 'horizontal')
      expect(compacto.visual).toMatchObject({ tipo: 'archivo', estado: 'oficial' })
      expect(horizontal.visual).toMatchObject({ tipo: 'archivo', estado: 'oficial' })
      expect(compacto.visual.empaquetado).not.toBe(horizontal.visual.empaquetado)
      expect(htmlLogo(MedioPagoLogo, 'marca', nombre, 'compacto')).toContain('<img')
      expect(htmlLogo(MedioPagoLogo, 'marca', nombre, 'horizontal')).toContain('<img')
    }

    expect(logoDeMedioPago('Pik')).toMatchObject({
      relacionFinanciera: expect.objectContaining({ financialProvider: 'Itaú' }),
    })
  })

  test('Bancard usa el compacto de alta resolución sin doble fondo ni padding', () => {
    expect(MARCAS_MEDIOS_PAGO.Bancard.variantes.compacto).toMatchObject({
      archivo: 'bancard-compacto.png',
      empaquetado: 'pagos/bancard-compacto.png',
    })
    expect(MARCAS_MEDIOS_PAGO.Bancard.variantes.compacto).not.toHaveProperty('fondo')
    expect(MARCAS_MEDIOS_PAGO.Bancard.variantes.compacto).not.toHaveProperty('padding')
    expect(MARCAS_MEDIOS_PAGO.Bancard.variantes.horizontal).toMatchObject({ fondo: '#F8FAFC', padding: true })

    const manifestAsset = manifest.assets.find((asset) => asset.file === 'pagos/bancard-compacto.png')
    expect(manifestAsset).toMatchObject({
      sourceKind: 'user-provided-reference',
      sourceRef: 'codex-clipboard-3d5d5ba4-bancard-compact.png',
      sourceIdentity: {
        sha256: '809a55d06848da60375d11634c9ac6189c807bcd704c74dd9fc64d1fb932a7b6',
        pixelWidth: 2500,
        pixelHeight: 2500,
      },
      sha256: '32ef3cdce8798c3143c2d06dc72dee8cac95b2a16c8d39625a0ac8faad1fba5f',
    })

    const runtimeAsset = readFileSync(join(process.cwd(), 'src/assets/financial/pagos/bancard-compacto.png'))
    expect([runtimeAsset.readUInt32BE(16), runtimeAsset.readUInt32BE(20)]).toEqual([512, 512])

    const html = htmlLogo(MedioPagoLogo, 'marca', 'Bancard', 'compacto')
    expect(html).not.toContain('background-color')
    expect(html).not.toContain('p-1.5')
  })

  test('Pagopar está activo bajo upay y uPOS no inventa una marca independiente', () => {
    expect(MEDIOS_PAGO_CON_MARCA).toContain('Pagopar')
    expect(MARCAS_MEDIOS_PAGO.Pagopar).toMatchObject({ categoria: 'producto', marcaPadre: 'upay', estado: 'verificado' })
    expect(logoDeMedioPago('Pagopar')).toMatchObject({ marca: 'Pagopar', marcaPadre: 'upay' })
    expect(MARCAS_MEDIOS_PAGO.uPOS).toMatchObject({ categoria: 'terminal', marcaPadre: 'upay' })
    expect(logoDeMedioPago('uPOS', 'horizontal').visual).toMatchObject({ tipo: 'texto', estado: 'producto-padre' })
    expect(BLOQUEOS_ASSETS_FINANCIEROS).toContainEqual(expect.objectContaining({ catalogo: 'pago', id: 'uPOS', variante: 'horizontal' }))
  })

  test('la muestra de pagos incluye marcas reales y ambas variantes como imágenes', () => {
    for (const nombre of ['Bancard', 'Dinelco', 'upay', 'Pagopar', 'Procard', 'PayPro', 'Wally', 'Zimple', 'Personal Pay', 'American Express', 'Cabal', 'Mango', 'Vaquita', 'EKO', 'eCLUB', 'Pik']) {
      expect(MARCAS_PAGO_PREVIEW).toContain(nombre)
      for (const variante of ['compacto', 'horizontal']) {
        const registro = logoDeMedioPago(nombre, variante)
        expect(registro.visual.asset).toMatch(/^(?:data:image\/|\/src\/assets\/financial\/)/)
        const html = htmlLogo(MedioPagoLogo, 'marca', nombre, variante)
        expect(html).toContain('<img')
        expect(html).not.toMatch(/src="https?:/)
      }
    }
    expect(logoDeMedioPago('Dinelco')).toMatchObject({ color: '#5E2A84', estado: 'verificado' })
  })

  test('cada marca conocida usa un asset oficial, texto de producto o bloqueo explícito, nunca monograma', () => {
    const bloqueados = new Set(BLOQUEOS_ASSETS_FINANCIEROS.filter((item) => item.catalogo === 'pago').map((item) => item.id))
    for (const entrada of coberturaMediosPago()) {
      for (const [variante, visual] of Object.entries(entrada.variantes)) {
        expect(visual.tipo).not.toBe('monograma')
        if (!visual.empaquetado && visual.estado !== 'producto-padre') expect(bloqueados).toContain(entrada.nombre)
        expect(htmlLogo(MedioPagoLogo, 'marca', entrada.nombre, variante)).not.toContain('data-logo-tipo="monograma"')
      }
    }
  })
})

describe('manifest y bundles financieros', () => {
  test('el API visual coincide con el manifest autorizado y cada archivo tiene una variante', () => {
    expect([...ASSET_KEYS_FINANCIEROS].sort()).toEqual(manifest.assets.map((asset) => asset.file).sort())
    expect(manifest.assets).toHaveLength(84)
    const referencias = new Set([
      ...coberturaBancos().flatMap(variantesEmpaquetadas),
      ...coberturaMediosPago().flatMap(variantesEmpaquetadas),
    ].map((visual) => visual.empaquetado))
    expect([...referencias].sort()).toEqual([...ASSET_KEYS_FINANCIEROS].sort())
    expect(manifest.blockers.map((item) => item.id).sort()).toEqual(BLOQUEOS_ASSETS_FINANCIEROS.map((item) => item.id).sort())
  })

  test('Pix stays blocked for missing browser-ready originals, not participant access', () => {
    const pix = BLOQUEOS_ASSETS_FINANCIEROS.find(item => item.id === 'Pix')
    expect(pix.motivo).toBe('kit-oficial-ai-eps-pdf-sin-original-png-svg-gif-jpg-webp')
    const manifest = JSON.parse(readFileSync(join(process.cwd(), 'docs/financial-assets-manifest.json'), 'utf8'))
    const recorded = manifest.blockers.find(item => item.id === 'Pix')
    expect(recorded.archiveFormatCounts).toEqual({ ai: 70, eps: 70, pdf: 52 })
    expect(recorded.browserReadyFiles).toBe(0)
    for (const variant of ['compacto', 'horizontal']) expect(logoDeMedioPago('Pix', variant).visual?.empaquetado).toBeUndefined()
  })

  test('el bundle visual contiene imágenes locales y metadata permanece sin bytes', async () => {
    const { BancoLogo: BancoLogoPublicado } = await import('../dist/index.js')
    const html = renderToStaticMarkup(<BancoLogoPublicado banco="ueno bank" variante="compacto" />)
    expect(html).toContain('<img')
    expect(html).toContain('src="data:image/')
    const metadataBundle = readFileSync(join(process.cwd(), 'dist/financial-metadata.js'), 'utf8')
    expect(metadataBundle).not.toMatch(/data:image\//)
  })
})

describe('ampliación acotada de cooperativas con originales', () => {
  test.each([
    ['Luque', 'cooperativa luque', 'bancos/luque-horizontal.svg', 'https://www.coopluque.com.py/images/logo.svg'],
    ['Coopeduc', 'cooperativa coopeduc', 'bancos/coopeduc-horizontal.png', 'https://www.coopeduc.com.py/coope/images/Logo2.png'],
  ])('%s conserva procedencia, autorización y presentación contenida honestas', (name, alias, file, sourceUrl) => {
    expect(COOPERATIVAS_PARAGUAY).toContain(name)
    expect(BANCOS_PREVIEW).toContain(name)
    expect(logoDeBanco(alias, 'horizontal').banco).toBe(name)
    expect(logoDeBanco(name, 'compacto').visual).toMatchObject({
      tipo: 'horizontal-contained', empaquetado: file, descripcion: expect.stringContaining('contenida'),
    })
    expect(logoDeBanco(name, 'horizontal').visual).toMatchObject({ tipo: 'archivo', empaquetado: file })
    const record = manifest.assets.find(asset => asset.file === file)
    expect(record).toMatchObject({ sourceKind: 'official-first-party', sourceUrl, retrievedAt: '2026-10-02' })
    expect(createHash('sha256').update(readFileSync(join('src/assets/financial', file))).digest('hex')).toBe(record.sha256)
    expect(record.transformation).toContain('preserved byte-for-byte')
    expect(record.authorization.scope).toEqual(['Public GitHub repository dariodeoli/owncoding-ui', 'Own UI / OwnCoding website and gallery'])
  })
  test('las candidatas no incorporadas no se ofrecen ni fabrican nuevas marcas', () => {
    expect(COOPERATIVAS_PARAGUAY).toHaveLength(13)
    for (const name of ['24 de Octubre', 'Tobatí']) expect(BANCOS_PARAGUAY).not.toContain(name)
    expect(BANCOS_PARAGUAY).not.toContain('Banco do Brasil')
  })
})
