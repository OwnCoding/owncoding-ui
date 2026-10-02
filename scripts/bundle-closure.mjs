import { readFileSync, realpathSync, statSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import { init, parse } from 'es-module-lexer'

export const DECLARED_EXTERNALS = Object.freeze(['@base-ui/react', 'react', 'react-dom', 'clsx', 'tailwind-merge', 'qrcode', 'libphonenumber-js/min'])
const contained = (root, file) => { const path = relative(root, file); return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path) }
const externalAllowed = (specifier, externals) => externals.some(name => specifier === name || specifier.startsWith(`${name}/`))

/** Sum unique reachable ESM files, including dynamic literal imports and cycles.
 * Gzip is measured per file, never by concatenating separately served modules.
 * Relative imports must stay inside dist even after resolving symlinks.
 */
export async function measureClosure(entry, { distRoot = 'dist', externals = DECLARED_EXTERNALS, pure = false } = {}) {
  await init
  const lexicalRoot = resolve(distRoot)
  const root = realpathSync(lexicalRoot)
  const seen = new Set()
  const files = []
  function visit(candidate) {
    const requested = resolve(candidate)
    if (!contained(root, requested) && !contained(lexicalRoot, requested)) throw new Error(`ESM import escapes dist: ${candidate}`)
    let file
    try { file = realpathSync(requested) } catch { throw new Error(`Missing ESM file: ${requested}`) }
    if (!contained(root, file)) throw new Error(`ESM symlink escapes dist: ${candidate}`)
    if (seen.has(file)) return
    if (!statSync(file).isFile() || !file.endsWith('.js')) throw new Error(`Invalid ESM file: ${file}`)
    seen.add(file)
    const bytes = readFileSync(file)
    const source = bytes.toString('utf8')
    if (pure && (/data:image\//i.test(source) || /^\s*["']use client["']/.test(source))) throw new Error(`Pure entry reaches visual bytes/module: ${file}`)
    files.push({ file, raw: bytes.byteLength, gzip: gzipSync(bytes).byteLength, source })
    const [imports] = parse(source)
    for (const item of imports) {
      if (item.d === -2) continue // import.meta is not a dependency.
      const specifier = item.n
      if (specifier === undefined) throw new Error(`Nonliteral ESM import: ${file}`)
      if (specifier.startsWith('./') || specifier.startsWith('../')) {
        if (/[?#%\\]/.test(specifier)) throw new Error(`Ambiguous relative ESM import: ${specifier}`)
        visit(resolve(dirname(file), specifier))
      } else {
        if (!externalAllowed(specifier, externals)) throw new Error(`Undeclared ESM external: ${specifier}`)
        if (pure && /^(react|react-dom)(\/|$)/.test(specifier)) throw new Error(`Pure entry imports visual external: ${specifier}`)
      }
    }
  }
  visit(entry)
  return { files, raw: files.reduce((sum, file) => sum + file.raw, 0), gzip: files.reduce((sum, file) => sum + file.gzip, 0) }
}
