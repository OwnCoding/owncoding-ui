import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { afterEach, expect, test } from 'vitest'
import { measureClosure } from '../scripts/bundle-closure.mjs'
const folders = []
function fixture(files) { const root = mkdtempSync(join(tmpdir(), 'owncoding-closure-')); folders.push(root); for (const [name, text] of Object.entries(files)) { mkdirSync(join(root, name, '..'), { recursive: true }); writeFileSync(join(root, name), text) }; return root }
afterEach(() => { folders.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })) })
test('closure counts shared files once, handles cycles and sums per-file gzip', async () => {
  const files = { 'index.js': "import './a.js'; import './b.js'", 'a.js': "import './shared.js'; export const a=1", 'b.js': "import './shared.js'; export const b=2", 'shared.js': "import './a.js'; export const c=3" }
  const root = fixture(files); const closure = await measureClosure(join(root, 'index.js'), { distRoot: root })
  expect(closure.files).toHaveLength(4)
  expect(closure.raw).toBe(Object.values(files).reduce((sum, text) => sum + Buffer.byteLength(text), 0))
  expect(closure.gzip).toBe(Object.values(files).reduce((sum, text) => sum + gzipSync(text).byteLength, 0))
})
test.each([['missing', "import './missing.js'", /Missing ESM/], ['escape', "import '../outside.js'", /escapes dist/], ['encoded', "import './%2e%2e/escape.js'", /Ambiguous/], ['absolute', "import '/outside.js'", /Undeclared/], ['undeclared', "import x from 'new-external'", /Undeclared/], ['computed', 'const p="./a.js"; import(p)', /Nonliteral/]])('rejects %s dependencies', async (_, source, error) => {
  const root = fixture({ 'index.js': source }); await expect(measureClosure(join(root, 'index.js'), { distRoot: root })).rejects.toThrow(error)
})
test('rejects symlink escape after canonical resolution', async () => {
  const root = fixture({ 'index.js': "import './linked.js'" }); const other = fixture({ 'outside.js': 'export const outside=1' }); symlinkSync(join(other, 'outside.js'), join(root, 'linked.js'))
  await expect(measureClosure(join(root, 'index.js'), { distRoot: root })).rejects.toThrow('symlink escapes')
})
test.each(['export const asset="data:image/png;base64,AA"', '"use client"; export const component=1', 'import React from "react"'])('pure closure rejects visual content %s', async source => {
  const root = fixture({ 'index.js': "import './visual.js'", 'visual.js': source }); await expect(measureClosure(join(root, 'index.js'), { distRoot: root, pure: true })).rejects.toThrow(/Pure entry/)
})
test('allows only declared dependency families and literal dynamic imports', async () => {
  const root = fixture({ 'index.js': "import 'react/jsx-runtime'; import('qrcode'); import('./part.js'); console.log(import.meta.url)", 'part.js': 'export const value=1' })
  expect((await measureClosure(join(root, 'index.js'), { distRoot: root })).files).toHaveLength(2)
})
