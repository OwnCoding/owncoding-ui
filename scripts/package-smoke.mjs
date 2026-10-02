import { createHash } from 'node:crypto'
import { measureClosure } from './bundle-closure.mjs'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execNpmSync } from './npm-command.mjs'

export const PACKAGE_INSTALL_FLAGS = Object.freeze([
  '--ignore-scripts',
  '--prefer-offline',
  '--no-audit',
  '--no-fund',
  '--package-lock=false',
])

export function packageInstallArgs(tarball) {
  return ['install', tarball, ...PACKAGE_INSTALL_FLAGS]
}

export async function runPackageSmoke() {
  const temporal = mkdtempSync(join(tmpdir(), 'owncoding-ui-package-'))
  try {
    const salida = execNpmSync(['pack', '--json', '--ignore-scripts', '--pack-destination', temporal], { encoding: 'utf8' })
    const [{ filename }] = JSON.parse(salida)
    const tarball = join(temporal, filename)
    const app = join(temporal, 'consumer')
    mkdirSync(app)
    writeFileSync(join(app, 'package.json'), JSON.stringify({ private: true, type: 'module' }))
    execNpmSync(packageInstallArgs(tarball), { cwd: app, stdio: 'pipe' })

    const smoke = `
      import React from 'react'
      import { renderToStaticMarkup } from 'react-dom/server'
      import * as root from 'owncoding-ui'
      import * as utils from 'owncoding-ui/utils'
      import * as ia from 'owncoding-ui/ia'
      import * as phone from 'owncoding-ui/phone'
      import * as financial from 'owncoding-ui/financial'
      import * as metadata from 'owncoding-ui/financial-metadata'
      import * as identity from 'owncoding-ui/app-identity'
      import * as email from 'owncoding-ui/email'
      if (!root.Button || !root.CargaIA || !utils.formatGs || !phone.PhoneField || !financial.BancoLogo) throw new Error('exports visuales ausentes')
      if (!ia.motorIA || !metadata.LOGOS_BANCOS || !identity.crearIdentidadApp || !email.renderCorreoHtml) throw new Error('exports puros ausentes')
      if (metadata.logoDeBanco('ueno bank')?.visual?.asset) throw new Error('financial-metadata no debe incluir bytes visuales')
      const ueno = financial.logoDeBanco('ueno bank', 'compacto')
      if (!ueno?.visual?.asset?.startsWith('data:image/') || !ueno?.redistribucion?.permitida) throw new Error('asset autorizado de ueno ausente')
      const markup = renderToStaticMarkup(React.createElement(financial.BancoLogo, { banco: 'ueno bank', variante: 'compacto' }))
      if (!markup.includes('<img') || !markup.includes('src="data:image/') || markup.includes('file://')) throw new Error('raw Node SSR logo must stay an inline data URL')
      for (const key of financial.ASSET_KEYS_FINANCIEROS) if (!financial.obtenerAssetFinanciero(key)?.startsWith('data:image/')) throw new Error('asset URL contract changed: ' + key)
      if (financial.ASSET_KEYS_FINANCIEROS.length < 50 || financial.BLOQUEOS_ASSETS_FINANCIEROS.length < 1) throw new Error('manifest financiero incompleto')
    `
    writeFileSync(join(app, 'smoke.mjs'), smoke)
    execFileSync(process.execPath, ['smoke.mjs'], { cwd: app, stdio: 'inherit' })

    const paquete = resolve(app, 'node_modules/owncoding-ui')
    for (const archivo of ['dist/index.d.ts', 'dist/utils.d.ts', 'dist/ia.d.ts', 'dist/phone.d.ts', 'dist/financial.d.ts', 'dist/financial-metadata.d.ts', 'dist/app-identity.d.ts', 'dist/email.d.ts']) {
      readFileSync(join(paquete, archivo))
    }
    const visualClosure = await measureClosure(join(paquete, 'dist/financial.js'), { distRoot: join(paquete, 'dist') })
    await measureClosure(join(paquete, 'dist/index.js'), { distRoot: join(paquete, 'dist') })
    await measureClosure(join(paquete, 'dist/financial-metadata.js'), { distRoot: join(paquete, 'dist'), pure: true })
    if (!visualClosure.files.some(file => file.source.includes('data:image/'))) throw new Error('financial closure has no artwork')
    const manifest = JSON.parse(readFileSync(join(paquete, 'docs/financial-assets-manifest.json'), 'utf8'))
    for (const asset of manifest.assets) {
      const bytes = readFileSync(join(paquete, 'src/assets/financial', asset.file))
      if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error('tarball asset hash changed: ' + asset.file)
    }
    if (!existsSync(join(paquete, 'src/assets/financial')) || !existsSync(join(paquete, 'docs/financial-assets-manifest.json'))) {
      throw new Error('el tarball no contiene assets locales o su manifest')
    }
    console.log('package smoke ok: npm pack + temp install + subpaths/types + financial manifest autorizado')
  } finally {
    rmSync(temporal, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await runPackageSmoke()
}
