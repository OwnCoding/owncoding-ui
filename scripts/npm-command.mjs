import { execFileSync } from 'node:child_process'
import { win32 } from 'node:path'

/**
 * Construye una invocacion portable y sin shell para npm.
 *
 * Windows distribuye npm como `npm.cmd`, que `execFileSync` no puede ejecutar
 * directamente. En lugar de interpolar argumentos dentro de `cmd.exe`, se
 * ejecuta el CLI JavaScript de npm con el mismo Node que corre este proceso.
 * Asi las rutas (incluidas las temporales) siguen siendo argumentos aislados.
 */
export function npmInvocation(
  args,
  {
    platform = process.platform,
    nodeExecutable = process.execPath,
    npmExecPath = process.env.npm_execpath,
  } = {},
) {
  if (!Array.isArray(args)) throw new TypeError('npm args must be an array')

  if (platform !== 'win32') {
    return { executable: 'npm', args: [...args] }
  }

  const npmCli = npmExecPath || win32.join(win32.dirname(nodeExecutable), 'node_modules', 'npm', 'bin', 'npm-cli.js')
  return { executable: nodeExecutable, args: [npmCli, ...args] }
}

/** Ejecuta npm preservando las opciones, salida y errores de `execFileSync`. */
export function execNpmSync(args, options, runtime = {}) {
  const { execFileSyncImpl = execFileSync, ...invocationRuntime } = runtime
  const invocation = npmInvocation(args, invocationRuntime)
  return execFileSyncImpl(invocation.executable, invocation.args, options)
}
