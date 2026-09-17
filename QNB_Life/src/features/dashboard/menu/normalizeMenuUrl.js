/**
 * Normalize Flutter menu URLs to React /dashboard routes.
 * Keeps City working; unknown paths still under /dashboard for ComingSoon.
 */
export function normalizeMenuUrl(rawUrl) {
  if (rawUrl == null || rawUrl === '') return null
  let path = String(rawUrl).trim()
  if (!path) return null

  // Absolute URL → pathname only
  try {
    if (/^https?:\/\//i.test(path)) {
      path = new URL(path).pathname
    }
  } catch {
    /* keep path */
  }

  path = path.replace(/\/+/g, '/')
  if (!path.startsWith('/')) path = `/${path}`

  // Already under /dashboard
  if (path === '/dashboard' || path.startsWith('/dashboard/')) {
    return path === '/dashboard/' ? '/dashboard' : path
  }

  // Flutter often uses root paths like /city or /country_nav
  if (path === '/' || path.toLowerCase() === '/home') return '/dashboard'

  // City aliases
  const lower = path.toLowerCase()
  if (
    lower === '/city' ||
    lower.endsWith('/city') ||
    lower.includes('city_nav') ||
    lower.includes('master_city')
  ) {
    return '/dashboard/city'
  }

  // Strip leading slash and nest under dashboard
  const child = path.replace(/^\//, '')
  return `/dashboard/${child}`
}

export default normalizeMenuUrl
