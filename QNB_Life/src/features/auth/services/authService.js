/**
 * Login services — mirrors Flutter login_api + MFA/OTP datasources.
 * Flow: RP (dataurl) → encrypt password → login (baseUrl) → optional MFA/OTP.
 */
import { apiRequest, ApiError, authStatusFromPayload } from '@/core/api/client'
import { loginUrls } from '@/core/api/urls/loginUrls'
import { env } from '@/core/config/env'
import { encryptPassword } from '@/core/crypto/encryptPassword'
import AuthService from '@/core/auth/AuthService'
import { t } from '@/core/i18n/t'

const LOGIN_HEADERS = {
  'App-Id': env.appId,
  channelName: env.channelName,
  CategoryName: env.categoryName,
  DomainId: env.domainId,
}

function mapUser(json = {}) {
  return {
    userId: json.userId || '',
    userName: json.userName || json.firstName || '',
    firstName: json.firstName || '',
    userType: json.userType || '',
    userLevel: json.userLevel || '',
    domainId: json.domainId || '',
    userEmail: json.email || '',
    userRole: json.userRole || '',
    enableChangePassword: json.enableChangePassword != null
      ? String(json.enableChangePassword)
      : 'N',
  }
}

function persistLoginSession(json) {
  // Flutter CookieManager.ingestFromPayload + GlobalCache on LOGIN SUCCESS
  AuthService.ingestCookiesFromPayload(json)
  const token = json?.token != null ? String(json.token) : ''
  AuthService.login({
    token,
    user: mapUser(json),
    cookies: AuthService.getCookies(),
  })
}

/** Step 1 — fetch RP public/private keys (Flutter LoginDatasource getRp). */
export async function fetchRpKeys() {
  // Flutter: networkClient.cookieManager.clear() before RP
  AuthService.clearCookies()
  AuthService.clearKeys()

  const attempt = () =>
    apiRequest(loginUrls.getRp, {
      // Same host as login (8444/backoffice-insurance) — matches Flutter session jar
      base: 'bo',
      method: 'POST',
      auth: false,
      body: {},
    })

  let res = await attempt()
  // Upstream occasionally 500s with a stale session cookie; retry once after clear
  if (!res.ok) {
    AuthService.clearCookies()
    AuthService.clearKeys()
    res = await attempt()
  }

  if (!res.ok || !res.data || typeof res.data !== 'object') {
    const status = res.status ? ` (HTTP ${res.status})` : ''
    throw new ApiError(
      `${t('RP_Service_failed', 'RP Service failed')}${status}`,
      res,
    )
  }

  const publicKey = res.data.publicKey || ''
  if (!publicKey) {
    throw new ApiError(t('RP_Service_failed', 'RP Service failed'), res)
  }

  const privateKey = res.data.privateKey || ''
  AuthService.setKeys({ publicKey, privateKey })
  AuthService.ingestCookiesFromPayload(res.data)
  return { publicKey, privateKey, encryEnabled: res.data.encryEnabled }
}

/**
 * Step 2 — login with encrypted password.
 * @returns {Promise<{authStatus:string,token?:string,mfaYn?:string,mfaType?:string,otpLength?:number,user?:object,needSecureValue?:boolean,needOtp?:boolean}>}
 */
export async function loginRequest({ username, password }) {
  const trimmedUsername = String(username || '').trim()
  const trimmedPassword = String(password || '').trim()

  if (!trimmedUsername || !trimmedPassword) {
    throw new ApiError(t('Required_Field', 'This field is required'))
  }

  const { publicKey } = await fetchRpKeys()
  const encryptedPassword = encryptPassword(publicKey, trimmedPassword)

  const res = await apiRequest(loginUrls.login, {
    base: 'bo',
    method: 'POST',
    auth: false,
    headers: LOGIN_HEADERS,
    body: {
      un: trimmedUsername,
      ps: encryptedPassword,
    },
  })

  const json = res.data && typeof res.data === 'object' ? res.data : {}
  const authStatus = authStatusFromPayload(json)

  if (!res.ok) {
    throw new ApiError(
      authStatus || t('Login_request_failed', 'Login request failed'),
      res,
    )
  }

  if (authStatus !== 'LOGIN SUCCESS') {
    throw new ApiError(
      authStatus || t('Invalid_Credentials', 'Invalid username or password'),
      res,
    )
  }

  // Flutter stores token/user on LOGIN SUCCESS even when MFA follows
  AuthService.ingestCookiesFromPayload(json)
  if (json.token && String(json.token).length > 0) {
    persistLoginSession(json)
  } else if (json.userId) {
    // Keep user id available for menu userID header even if token deferred to MFA
    AuthService.login({
      token: AuthService.getToken(),
      user: mapUser(json),
    })
  }

  const mfaYn = String(json.mfaYn || 'N').toUpperCase()
  const mfaType = String(json.mfaType || '')
  const otpLength = json.otpLength != null ? Number(json.otpLength) : null

  return {
    authStatus,
    token: json.token || '',
    mfaYn,
    mfaType,
    otpLength,
    user: mapUser(json),
    needOtp: mfaYn === 'Y' && mfaType.toLowerCase() === 'otp',
    needSecureValue: mfaYn === 'Y' && mfaType.toLowerCase() !== 'otp',
    raw: json,
  }
}

/** MFA validation — Flutter auth-server/mfavalidation */
export async function mfaValidation({
  username,
  mfaYn,
  mfaType,
  channelName = env.channelName,
  secureValue,
}) {
  const pubKey = AuthService.getPubKey()
  const body = {
    un: String(username || '').trim(),
    mfaYn: String(mfaYn),
    mfaType: String(mfaType),
    channelName,
  }

  if (secureValue != null && String(secureValue).length > 0) {
    body.secureValue = encryptPassword(pubKey, String(secureValue))
  }

  const res = await apiRequest(loginUrls.mfaValidation, {
    base: 'bo',
    method: 'POST',
    headers: {
      'App-Id': env.appId,
      channelId: '1',
    },
    body,
  })

  const json = res.data && typeof res.data === 'object' ? res.data : {}
  const authStatus = authStatusFromPayload(json)

  if (!res.ok) {
    throw new ApiError(
      authStatus || t('MFA_failed', 'MFA validation failed'),
      res,
    )
  }

  return {
    authStatus,
    mfaType: json.mfaType,
    mfaYn: json.mfaYn,
    raw: json,
  }
}

/** OTP verification — Flutter auth-server/otpverification */
export async function validateOtp({ userId, otp }) {
  const res = await apiRequest(loginUrls.otpVerification, {
    base: 'bo',
    method: 'POST',
    headers: {
      'App-Id': env.appId,
      channelId: '1',
    },
    body: {
      userId: String(userId || '').trim(),
      otp: String(otp || '').trim(),
    },
  })

  const json = res.data && typeof res.data === 'object' ? res.data : {}
  const authStatus = authStatusFromPayload(json)

  if (!res.ok) {
    throw new ApiError(
      authStatus || t('OTP_failed', 'OTP verification failed'),
      res,
    )
  }

  if (authStatus === 'OTP VERIFIED SUCCESSFULLY') {
    if (json.token) {
      persistLoginSession(json)
    } else {
      AuthService.login({ user: { userId } })
    }
  }

  return { authStatus, raw: json }
}

/**
 * Complete non-OTP MFA with secure value, then mark session if server says valid.
 */
export async function completeSecureMfa({ username, mfaYn, mfaType, secureValue }) {
  const result = await mfaValidation({
    username,
    mfaYn,
    mfaType,
    secureValue,
  })

  if (result.authStatus === 'SECURE VALUE VALID') {
    AuthService.login({
      token: AuthService.getToken(),
      user: { ...AuthService.getUser(), userId: username, userName: username },
    })
  }

  return result
}

export default {
  fetchRpKeys,
  loginRequest,
  mfaValidation,
  validateOtp,
  completeSecureMfa,
}
