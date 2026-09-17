import JSEncrypt from 'jsencrypt'

/**
 * Mirrors Flutter web/index.html encryptPasswordJS (JSEncrypt RSA).
 * @param {string} publicKeyPem
 * @param {string} data
 * @returns {string}
 */
export function encryptPassword(publicKeyPem, data) {
  if (!publicKeyPem) {
    throw new Error('Public key missing — RP step failed')
  }
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKeyPem)
  const encrypted = encrypt.encrypt(data)
  if (!encrypted) {
    throw new Error('Password encryption failed')
  }
  return encrypted
}

export default encryptPassword
