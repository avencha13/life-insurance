const SESSION_FLAG = 'bo_session_active'
const TOKEN_KEY = 'qnb_bo_token'
const USER_KEY = 'qnb_bo_user'
/** Legacy localStorage keys — purged only; RP keys stay in memory. */
const LEGACY_PUB_KEY = 'qnb_bo_pubkey'
const LEGACY_PRIV_KEY = 'qnb_bo_privkey'
const COOKIE_KEY = 'qnb_bo_cookies'
const LEGACY_FLAG = 'qnb_bo_session'

/** In-memory RP keys (Flutter GlobalCache for active SPA session; not localStorage). */
let _pubKey = ''
let _privKey = ''

function readJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value || {}))
}

function isSessionCookieKey(key) {
  const k = String(key || '').toLowerCase()
  return (
    k === 'jsessionid' ||
    k === 'sessionid' ||
    k === 'session_id' ||
    k === 'session'
  )
}

function ingestCookiesDeep(data, target = {}) {
  if (!data || typeof data !== 'object') return target
  if (Array.isArray(data)) {
    for (const item of data) ingestCookiesDeep(item, target)
    return target
  }
  for (const [key, value] of Object.entries(data)) {
    if (isSessionCookieKey(key) && value != null && String(value).trim()) {
      target.JSESSIONID = String(value).trim()
    } else if (value && typeof value === 'object') {
      ingestCookiesDeep(value, target)
    }
  }
  return target
}

function readDocumentCookies() {
  if (typeof document === 'undefined' || !document.cookie) return {}
  const out = {}
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const name = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (name && value) out[name] = decodeURIComponent(value)
  }
  return out
}

function writeDocumentCookies(cookies) {
  if (typeof document === 'undefined' || !cookies) return
  for (const [name, value] of Object.entries(cookies)) {
    const n = String(name || '').trim()
    const v = String(value || '').trim()
    if (!n || !v) continue
    document.cookie = `${n}=${v}; path=/; SameSite=Lax`
  }
}

function expireDocumentCookies() {
  if (typeof document === 'undefined' || !document.cookie) return
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim()
    if (!name) continue
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    document.cookie = `${name}=; path=/; Max-Age=0`
  }
}

export const AuthService = {
  isLoggedIn() {
    try {
      return (
        localStorage.getItem(SESSION_FLAG) === 'true' ||
        localStorage.getItem(LEGACY_FLAG) === '1'
      )
    } catch {
      return false
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || ''
  },

  getUser() {
    return readJson(USER_KEY, {})
  },

  getUserId() {
    const user = this.getUser()
    return String(user.userId || user.userID || user.userid || '').trim()
  },

  getPubKey() {
    return _pubKey || ''
  },

  getPrivateKey() {
    return _privKey || ''
  },

  setKeys({ publicKey = '', privateKey = '' } = {}) {
    if (publicKey) _pubKey = String(publicKey)
    if (privateKey) _privKey = String(privateKey)
  },

  /** Drop RP keys from memory and purge legacy localStorage PEM material. */
  clearKeys() {
    _pubKey = ''
    _privKey = ''
    try {
      localStorage.removeItem(LEGACY_PUB_KEY)
      localStorage.removeItem(LEGACY_PRIV_KEY)
    } catch {
      /* ignore */
    }
  },

  getCookies() {
    return readJson(COOKIE_KEY, {})
  },

  /** Merge cookies (Flutter CookieManager.persistCookie / capture). */
  setCookies(next = {}) {
    const merged = { ...this.getCookies(), ...next }
    for (const [k, v] of Object.entries(merged)) {
      if (!v) delete merged[k]
    }
    writeJson(COOKIE_KEY, merged)
    // Flutter browser_cookie_writer — path=/ so /bo-api and /wfc-api share jar
    writeDocumentCookies(merged)
    return merged
  },

  /**
   * Flutter CookieManager.clear() before RP — drop jar + non-HttpOnly cookies.
   * HttpOnly cookies are stripped on pre-login by the Vite proxy.
   */
  clearCookies() {
    localStorage.removeItem(COOKIE_KEY)
    expireDocumentCookies()
  },

  /** Flutter CookieManager.ingestFromPayload */
  ingestCookiesFromPayload(payload) {
    const found = ingestCookiesDeep(payload, {})
    if (Object.keys(found).length === 0) return this.getCookies()
    return this.setCookies(found)
  },

  /** Flutter CookieManager.syncFromBrowser + generateCookieHeader */
  getCookieHeader() {
    const merged = {
      ...this.getCookies(),
      ...readDocumentCookies(),
    }
    this.setCookies(merged)
    return Object.entries(merged)
      .filter(([, v]) => v != null && String(v).length > 0)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
  },

  /**
   * Persist session after LOGIN SUCCESS (Flutter GlobalCache parity).
   * @param {{ token?: string, user?: object, cookies?: object }} payload
   */
  login(payload = {}) {
    const { token = '', user = {}, cookies } = payload
    if (token) localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user || {}))
    localStorage.setItem(SESSION_FLAG, 'true')
    localStorage.setItem(LEGACY_FLAG, '1')
    if (cookies && typeof cookies === 'object') {
      this.setCookies(cookies)
    }
  },

  logout() {
    localStorage.removeItem(SESSION_FLAG)
    localStorage.removeItem(LEGACY_FLAG)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    this.clearKeys()
    this.clearCookies()
  },
}

export default AuthService
