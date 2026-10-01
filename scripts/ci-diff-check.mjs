import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const SHA_PATTERN = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i
const ZERO_SHA_PATTERN = /^(?:0{40}|0{64})$/

export function validateSha(value, label, { allowZero = false } = {}) {
  if (!SHA_PATTERN.test(value ?? '') || (!allowZero && ZERO_SHA_PATTERN.test(value))) {
    throw new Error(`${label} must be a non-zero Git object ID`)
  }
  return value
}

export function diffSelection({ eventName, beforeSha, baseSha, headSha, fallbackBaseSha, emptyTreeSha }) {
  const head = validateSha(headSha, 'head SHA')

  if (eventName === 'pull_request') {
    return {
      base: validateSha(baseSha, 'pull request base SHA'),
      head,
      separator: '...',
    }
  }

  if (eventName === 'push') {
    validateSha(beforeSha, 'push before SHA', { allowZero: true })
    return {
      base: ZERO_SHA_PATTERN.test(beforeSha) ? validateSha(emptyTreeSha, 'empty tree SHA') : beforeSha,
      head,
      separator: '..',
    }
  }

  return {
    base: validateSha(fallbackBaseSha || emptyTreeSha, 'fallback base SHA'),
    head,
    separator: '..',
  }
}

function git(args, options = {}) {
  const result = execFileSync('git', args, {
    encoding: 'utf8',
    stdio: options.stdio ?? ['ignore', 'pipe', 'inherit'],
    ...options,
  })
  return typeof result === 'string' ? result.trim() : ''
}

function objectExists(sha) {
  try {
    git(['cat-file', '-e', `${sha}^{commit}`], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function ensureCommit(sha) {
  if (objectExists(sha)) return
  git(['fetch', '--no-tags', '--depth=1', 'origin', sha], { stdio: 'inherit' })
  if (!objectExists(sha)) throw new Error(`Git object ${sha} is unavailable after fetch`)
}

function run() {
  const eventName = process.env.CI_EVENT_NAME || 'workflow_dispatch'
  const headSha = process.env.CI_HEAD_SHA || git(['rev-parse', 'HEAD'])
  const emptyTreeSha = git(['mktree'], { input: '' })
  let fallbackBaseSha = ''

  if (!['pull_request', 'push'].includes(eventName)) {
    try {
      fallbackBaseSha = git(['rev-parse', `${headSha}^`])
    } catch {
      fallbackBaseSha = emptyTreeSha
    }
  }

  const selection = diffSelection({
    eventName,
    beforeSha: process.env.CI_BEFORE_SHA,
    baseSha: process.env.CI_BASE_SHA,
    headSha,
    fallbackBaseSha,
    emptyTreeSha,
  })

  ensureCommit(selection.head)
  if (selection.base !== emptyTreeSha) ensureCommit(selection.base)
  git(['diff', '--check', `${selection.base}${selection.separator}${selection.head}`], { stdio: 'inherit' })
  console.log(`git diff --check ${selection.base}${selection.separator}${selection.head}: ok`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) run()
