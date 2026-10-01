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

export function runPackageSmoke() {
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
      const cobertura = [...financial.coberturaBancos(), ...financial.coberturaMediosPago()]
      if (cobertura.some((item) => Object.values(item.variantes).some((visual) => visual.asset || visual.empaquetado))) {
        throw new Error('el paquete no debe habilitar assets financieros sin evidencia de redistribución')
      }
    `
    writeFileSync(join(app, 'smoke.mjs'), smoke)
    execFileSync(process.execPath, ['smoke.mjs'], { cwd: app, stdio: 'inherit' })

    const paquete = resolve(app, 'node_modules/owncoding-ui')
    for (const archivo of ['dist/index.d.ts', 'dist/utils.d.ts', 'dist/ia.d.ts', 'dist/phone.d.ts', 'dist/financial.d.ts', 'dist/financial-metadata.d.ts', 'dist/app-identity.d.ts', 'dist/email.d.ts']) {
      readFileSync(join(paquete, archivo))
    }
    for (const archivo of ['dist/financial.js', 'dist/financial-metadata.js']) {
      const fuente = readFileSync(join(paquete, archivo), 'utf8')
      if (/data:image\/svg\+xml,[^`"']{100,}/i.test(fuente) || /data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]{100,}/i.test(fuente)) {
        throw new Error(`${archivo} contiene bytes visuales financieros no autorizados`)
      }
    }
    if (existsSync(join(paquete, 'src/assets/financial')) || existsSync(join(paquete, 'dist/assets/financial'))) {
      throw new Error('el tarball contiene archivos financieros de terceros')
    }
    console.log('package smoke ok: npm pack + temp install + root/utils/ia/subpaths/types + financial redistribution gate')
  } finally {
    rmSync(temporal, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runPackageSmoke()
}
