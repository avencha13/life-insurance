import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

/** Upstream host from Flutter baseUrl — change only with approval.
 *  Flutter dataurl is 8443; React /data-api uses 8444 for login session parity. */
const FLUTTER_BO_ORIGIN = 'https://34.18.92.50:8444'
const FLUTTER_SERVICE_PATH = '/backoffice-insurance'
const FLUTTER_WFC_PATH = '/workflow-insurance'

/** Flutter clears CookieManager before RP; stale HttpOnly cookies make RP return 500. */
const PRE_LOGIN_COOKIE_STRIP =
  /auth-server\/(public\/rp|login|mfavalidation|otpverification)|token\/generate/i

function stripPreLoginCookies() {
  return {
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq, req) => {
        const url = req.url || ''
        if (PRE_LOGIN_COOKIE_STRIP.test(url)) {
          proxyReq.removeHeader('cookie')
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, rootDir, '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
        '@assets': path.resolve(rootDir, 'public/assets'),
      },
    },
    server: {
      proxy: {
        // React post-login session is established on 8444 (/bo-api). Flutter
        // CookieManager shares cookies across dataurl (8443) and baseUrl (8444);
        // browsers cannot, so /data-api must hit the same host as login.
        '/data-api': {
          target: FLUTTER_BO_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/data-api/, FLUTTER_SERVICE_PATH),
          ...stripPreLoginCookies(),
        },
        '/bo-api': {
          target: FLUTTER_BO_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/bo-api/, FLUTTER_SERVICE_PATH),
          ...stripPreLoginCookies(),
        },
        '/wfc-api': {
          target: FLUTTER_BO_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/wfc-api/, FLUTTER_WFC_PATH),
        },
      },
    },
  }
})
