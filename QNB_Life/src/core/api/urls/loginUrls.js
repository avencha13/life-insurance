/** Mirrors Flutter lib/network/url/login_url.dart + MFA/OTP paths. */
export const loginUrls = {
  getRp: 'auth-server/public/rp',
  login: 'auth-server/login',
  mfaValidation: 'auth-server/mfavalidation',
  otpVerification: 'auth-server/otpverification',
  generateAccessToken: 'token/generate',
}

export default loginUrls
