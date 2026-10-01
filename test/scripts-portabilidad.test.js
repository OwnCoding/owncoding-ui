import { describe, expect, test, vi } from 'vitest'

import { execNpmSync, npmInvocation } from '../scripts/npm-command.mjs'
import { packageInstallArgs } from '../scripts/package-smoke.mjs'

describe('subprocesses npm portables', () => {
  test('package smoke permite resolver dependencias faltantes sin relajar opciones seguras', () => {
    const args = packageInstallArgs('/tmp/owncoding-ui.tgz')

    expect(args).toEqual([
      'install',
      '/tmp/owncoding-ui.tgz',
      '--ignore-scripts',
      '--prefer-offline',
      '--no-audit',
      '--no-fund',
      '--package-lock=false',
    ])
    expect(args).not.toContain('--offline')
  })

  test('POSIX ejecuta npm directamente y conserva cada argumento', () => {
    const args = ['pack', '--pack-destination', '/tmp/path with spaces/&literal']

    expect(npmInvocation(args, { platform: 'linux' })).toEqual({
      executable: 'npm',
      args,
    })
  })

  test('Windows ejecuta npm-cli.js con Node sin interpolar argumentos en cmd.exe', () => {
    const args = ['install', 'C:\\Temp\\path with spaces\\package & literal.tgz', '--offline']

    expect(npmInvocation(args, {
      platform: 'win32',
      nodeExecutable: 'C:\\Program Files\\nodejs\\node.exe',
      npmExecPath: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
    })).toEqual({
      executable: 'C:\\Program Files\\nodejs\\node.exe',
      args: [
        'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
        ...args,
      ],
    })
  })

  test('Windows deriva npm-cli.js junto a Node cuando npm_execpath no existe', () => {
    expect(npmInvocation(['--version'], {
      platform: 'win32',
      nodeExecutable: 'C:\\nodejs\\node.exe',
      npmExecPath: '',
    })).toEqual({
      executable: 'C:\\nodejs\\node.exe',
      args: ['C:\\nodejs\\node_modules\\npm\\bin\\npm-cli.js', '--version'],
    })
  })

  test.each([
    {
      platform: 'linux',
      nodeExecutable: '/usr/bin/node',
      npmExecPath: '/usr/lib/node_modules/npm/bin/npm-cli.js',
      executable: 'npm',
      argv: ['pack', '--json'],
    },
    {
      platform: 'win32',
      nodeExecutable: 'C:\\nodejs\\node.exe',
      npmExecPath: 'C:\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
      executable: 'C:\\nodejs\\node.exe',
      argv: ['C:\\nodejs\\node_modules\\npm\\bin\\npm-cli.js', 'pack', '--json'],
    },
  ])('transporta argv, opciones y retorno en $platform', ({ platform, nodeExecutable, npmExecPath, executable, argv }) => {
    const resultado = Buffer.from('salida npm')
    const execFileSyncImpl = vi.fn(() => resultado)
    const options = { cwd: '/tmp/consumer', stdio: 'pipe' }

    expect(execNpmSync(['pack', '--json'], options, {
      platform,
      nodeExecutable,
      npmExecPath,
      execFileSyncImpl,
    })).toBe(resultado)
    expect(execFileSyncImpl).toHaveBeenCalledOnce()
    expect(execFileSyncImpl).toHaveBeenCalledWith(executable, argv, options)
  })

  test('propaga sin alterar los errores y codigos del subprocess', () => {
    const error = Object.assign(new Error('npm failed'), { status: 17, stdout: 'out', stderr: 'err' })

    expect(() => execNpmSync(['pack'], { stdio: 'pipe' }, {
      platform: 'linux',
      execFileSyncImpl: () => { throw error },
    })).toThrow(error)
  })
})
