const RUC = /^[1-9][0-9]{0,8}(-[0-9])?$/
const ERROR_STATUS = {
  INVALID_RUC_FORMAT: 400,
  API_KEY_REQUIRED: 401, API_KEY_INVALID: 401, API_KEY_REVOKED: 401, API_KEY_EXPIRED: 401, ENVIRONMENT_MISMATCH: 401,
  INSUFFICIENT_SCOPE: 403, PLAN_REQUIRED: 403, REGISTERED_RUC_NOT_FOUND: 404,
  DAILY_QUOTA_REACHED: 429, COMMERCIAL_API_DISABLED: 503, COMMERCIAL_API_UNAVAILABLE: 503, DNIT_DATA_UNAVAILABLE: 503,
}
const ERROR_MESSAGES = {
  INVALID_RUC_FORMAT: 'El formato del RUC no es válido.',
  REGISTERED_RUC_NOT_FOUND: 'No se encontró el RUC registrado.',
  DAILY_QUOTA_REACHED: 'Se alcanzó la cuota diaria. No se reintentó la consulta.',
  COMMERCIAL_API_DISABLED: 'La API comercial de OwnData está deshabilitada.',
}
function safeRequestId(value) { return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(value) ? value : undefined }
function failure(code, envelope) {
  const error = new Error(ERROR_MESSAGES[code] || (ERROR_STATUS[code] === 401 || ERROR_STATUS[code] === 403
    ? 'El backend no está autorizado para consultar OwnData.' : 'No se pudo consultar OwnData. Complete los datos manualmente.'))
  error.name = 'OwnDataRucError'
  error.code = code
  error.status = ERROR_STATUS[code] || 502
  const requestId = safeRequestId(envelope?.requestId)
  if (requestId) error.requestId = requestId
  const retryAfter = envelope?.retryAfter ?? envelope?.error?.retryAfter
  if (code === 'DAILY_QUOTA_REACHED' && Number.isSafeInteger(retryAfter) && retryAfter >= 0) error.retryAfter = retryAfter
  return error
}
/** Whitelist code and safe diagnostic fields; never retain upstream messages or bodies. */
export function mapOwnDataRucError(envelope) {
  const code = envelope?.error?.code
  return failure(typeof code === 'string' && Object.hasOwn(ERROR_STATUS, code) ? code : 'OWNDATA_INVALID_RESPONSE', envelope)
}
function requestedRuc(value) {
  if (typeof value !== 'string' || !RUC.test(value)) throw failure('INVALID_RUC_FORMAT')
  return value
}
const nonempty = value => typeof value === 'string' && value.trim().length > 0
const raw = value => value === null || typeof value === 'string'
/** Exact identity and official snapshot mapping; no DV repair or contact/name inference. */
export function mapOwnDataRucResponse(envelope, requested) {
  requestedRuc(requested)
  if (envelope?.error) throw mapOwnDataRucError(envelope)
  const data = envelope?.data, meta = envelope?.meta, source = meta?.provenance, quota = meta?.quota
  const base = typeof data?.ruc === 'number' && Number.isSafeInteger(data.ruc) ? String(data.ruc) : data?.ruc
  const dv = typeof data?.dv === 'number' && Number.isInteger(data.dv) ? String(data.dv) : data?.dv
  const valid = typeof base === 'string' && /^[1-9][0-9]{0,8}$/.test(base) && typeof dv === 'string' && /^[0-9]$/.test(dv) &&
    data.fullRuc === `${base}-${dv}` && (requested.includes('-') ? requested === data.fullRuc : requested === base) &&
    nonempty(data.nameOfficial) && raw(data.equivalenceRaw) && raw(data.stateRaw) && nonempty(data.sourcePartition) &&
    ['test', 'live'].includes(meta?.environment) && source?.source === 'dnit_official_snapshot' &&
    ['sourcePage', 'publicationDate', 'publishedText', 'importedAt', 'snapshotHash'].every(key => nonempty(source[key])) &&
    /^[a-f0-9]{64}$/i.test(source.snapshotHash) && quota &&
    ['limit', 'used', 'remaining', 'resetAfter'].every(key => Number.isSafeInteger(quota[key]) && quota[key] >= 0) && nonempty(quota.day)
  if (!valid) throw failure('OWNDATA_INVALID_RESPONSE', envelope)
  return {
    name: data.nameOfficial, fullRuc: data.fullRuc, reviewRequired: true,
    ownData: {
      ruc: base, dv: data.dv, nameOfficial: data.nameOfficial, equivalenceRaw: data.equivalenceRaw,
      stateRaw: data.stateRaw, sourcePartition: data.sourcePartition,
      requestId: safeRequestId(envelope.requestId), environment: meta.environment,
      quota: { limit: quota.limit, used: quota.used, remaining: quota.remaining, day: quota.day, resetAfter: quota.resetAfter },
      provenance: { source: source.source, sourcePage: source.sourcePage, publicationDate: source.publicationDate,
        publishedText: source.publishedText, importedAt: source.importedAt, snapshotHash: source.snapshotHash },
    },
  }
}
/** Inject a consumer-owned authenticated same-origin backend lookup, not a key or URL. */
export function createOwnDataRucProvider({ lookup }) {
  if (typeof lookup !== 'function') throw new TypeError('OwnData requiere una función lookup inyectada.')
  return async value => {
    const requested = requestedRuc(value)
    let envelope
    try { envelope = await lookup(requested) } catch { throw failure('OWNDATA_TRANSPORT_ERROR') }
    return mapOwnDataRucResponse(envelope, requested)
  }
}
