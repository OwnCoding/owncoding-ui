import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const paquete = JSON.parse(readFileSync('package.json', 'utf8'))

function git(argumentos, fallback = '') {
  try {
    return execFileSync('git', argumentos, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return fallback
  }
}

const revision = process.env.SOURCE_COMMIT
  || process.env.GIT_COMMIT_SHA
  || git(['rev-parse', '--short=12', 'HEAD'], 'local')
const sucio = git(['status', '--porcelain'], '') ? '-dirty' : ''
const buildIdentity = process.env.BUILD_ID || `${revision}${sucio}`
const estado = {
  status: 'ok',
  service: 'owncoding-ui-gallery',
  packageVersion: paquete.version,
  buildIdentity,
}

mkdirSync('gallery/public', { recursive: true })
writeFileSync('gallery/public/status.json', `${JSON.stringify(estado, null, 2)}\n`)
console.log(`gallery status: ${paquete.version} ${buildIdentity}`)
