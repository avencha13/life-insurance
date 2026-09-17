import { env } from '@/core/config/env'
import AuthService from '@/core/auth/AuthService'

/** Success code mirrors Flutter BO peers. */
export const API_SUCCESS_CODE = '000000'

export function isApiSuccess(payload) {
  return payload?.status?.code === API_SUCCESS_CODE
}

function joinUrl(base, path) {
  const b = String(base || '').replace(/\/$/, '')
  const p = String(path || '').replace(/^\//, '')
  return `${b}/${p}`
}

function resolveBase(base) {
  if (base === 'data') return env.dataApiBase
  if (base === 'wfc') return env.wfcApiBase
  return env.boApiBase
}

function parseBody(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** Flutter CommonRequestHeaders.deriveServiceIdFromEndpoint */
function deriveServiceId(path) {
  let endpoint = String(path || '').trim()
  const q = endpoint.indexOf('?')
  if (q >= 0) endpoint = endpoint.slice(0, q)
  while (endpoint.startsWith('/')) endpoint = endpoint.slice(1)
  if (!endpoint) return 'BO_UNKNOWN'
  return `BO_${endpoint}`
}

function resolveTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/**
 * HTTP client — credentials + Flutter CommonRequestHeaders parity
 * (Bearer, userID/userId, X-Timezone, serviceId). Session cookies via
 * credentials:include + AuthService document.cookie jar (browsers forbid
 * setting the Cookie header from JS).
 *
 * @param {string} path relative path e.g. auth-server/login
 * @param {{ base?: 'bo'|'data'|'wfc', method?: string, body?: unknown, headers?: Record<string,string>, authorization?: string, auth?: boolean }} options
 */
export async function apiRequest(path, options = {}) {
  const {
    base = 'bo',
    method = 'GET',
    body,
    headers = {},
    authorization,
    auth = true,
  } = options

  const root = resolveBase(base)
  const url = joinUrl(root, path)

  const reqHeaders = {
    Accept: 'application/json',
    channel: 'BO',
    channelName: env.channelName || 'Internet Banking',
    unit: 'PRD',
    partnerId: '1',
    'App-Id': env.appId || 'BO',
    DomainId: env.domainId || 'BO',
    ...headers,
  }

  let payload = body
  if (body != null && typeof body === 'object' && !(body instanceof FormData)) {
    reqHeaders['Content-Type'] = reqHeaders['Content-Type'] || 'application/json'
    payload = JSON.stringify(body)
  }

  const isGraphql = /(^|\/)graphql(\?|$)/i.test(String(path))

  if (auth) {
    if (!reqHeaders['X-Timezone'] && !reqHeaders['x-timezone']) {
      reqHeaders['X-Timezone'] = resolveTimezone()
    }

    const userId =
      reqHeaders.userID || reqHeaders.userId || AuthService.getUserId()
    if (userId) {
      reqHeaders.userID = userId
      reqHeaders.userId = userId
    }

    // Flutter autoFillServiceIdForGraphql = false
    if (isGraphql) {
      delete reqHeaders.serviceId
    } else if (!reqHeaders.serviceId) {
      reqHeaders.serviceId = deriveServiceId(path)
    }

    // Sync jar → document.cookie so credentials:include sends session
    AuthService.getCookieHeader()
  }

  const token = authorization || (auth ? AuthService.getToken() : '')
  if (token) {
    reqHeaders.Authorization = String(token).startsWith('Bearer ')
      ? String(token)
      : `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers: reqHeaders,
    body: method === 'GET' || method === 'HEAD' ? undefined : payload,
    credentials: 'include',
  })

  const text = await response.text()
  const data = parseBody(text)

  if (data && typeof data === 'object') {
    AuthService.ingestCookiesFromPayload(data)
  }
  AuthService.getCookieHeader()

  return {
    ok: response.ok,
    status: response.status,
    data,
    headers: response.headers,
  }
}

export function apiStatusDescription(payload, fallback = '') {
  const desc = payload?.status?.description
  if (desc && String(desc).trim()) return String(desc).trim()
  const code = payload?.status?.code
  if (code && String(code) !== API_SUCCESS_CODE) return String(code)
  return fallback
}

export function authStatusFromPayload(data) {
  if (!data || typeof data !== 'object') return ''
  return String(data.authStatus || '').trim()
}

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.name = 'ApiError'
    this.details = details
  }
}

export default {
  apiRequest,
  isApiSuccess,
  API_SUCCESS_CODE,
  apiStatusDescription,
  authStatusFromPayload,
  ApiError,
}
