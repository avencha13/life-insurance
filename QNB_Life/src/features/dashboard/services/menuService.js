import {
  apiRequest,
  isApiSuccess,
  apiStatusDescription,
  ApiError,
} from '@/core/api/client'
import { menuUrls } from '@/core/api/urls/menuUrls'
import { normalizeMenuUrl } from '@/features/dashboard/menu/normalizeMenuUrl'
import { resolveProductIcon, resolveSubProductIcon } from '@/features/dashboard/menu/menuIconMaps'
import AuthService from '@/core/auth/AuthService'
import { t } from '@/core/i18n/t'

function mapChild(raw = {}) {
  const code = raw.childMenuProdCode || raw.childMenuCode || ''
  return {
    childMenuCode: code,
    childMenuProdCode: code,
    childMenuDesc: raw.childMenuDesc || '',
    childMenuUrl: normalizeMenuUrl(raw.childMenuUrl) || '/dashboard/coming_soon',
  }
}

function mapSub(raw = {}) {
  const code = raw.subProductCode || ''
  const desc = raw.subProductDesc || ''
  return {
    subProductCode: code,
    subProductDesc: desc,
    subProductUrl: normalizeMenuUrl(raw.subProductUrl) || '/dashboard/coming_soon',
    iconSvg: resolveSubProductIcon(code, desc),
    childMenus: (raw.childMenus || []).map(mapChild),
    functions: raw.functions || [],
  }
}

function mapProduct(raw = {}) {
  const code = raw.productCode || ''
  const desc = raw.productDesc || ''
  return {
    productCode: code,
    productDesc: desc,
    iconSvg: resolveProductIcon(code, desc),
    subProducts: (raw.subProducts || []).map(mapSub),
  }
}

function withDashboardNode(products) {
  const dashboard = {
    productCode: 'dashboard',
    productDesc: 'Dashboard',
    iconSvg: resolveProductIcon('dashboard', 'Dashboard'),
    subProducts: [],
  }
  const withoutDup = products.filter(
    (p) => String(p.productCode).toLowerCase() !== 'dashboard',
  )
  return [dashboard, ...withoutDup]
}

/**
 * Fetch access-control menu — Flutter getAccessControl.
 * No fixture/mock fallback — callers handle empty/error.
 */
export async function fetchAccessControlMenu() {
  const userId = AuthService.getUserId()
  const token = AuthService.getToken()
  if (!token && !AuthService.getCookieHeader()) {
    throw new ApiError(
      t(
        'Menu_session_required',
        'Failed to load menu: sign in again to refresh your session',
      ),
    )
  }

  const res = await apiRequest(menuUrls.access, {
    base: 'wfc',
    method: 'POST',
    body: {},
    headers: userId ? { userID: userId, userId } : {},
  })

  if (!res.ok || !isApiSuccess(res.data)) {
    const serverMsg = apiStatusDescription(res.data)
    const detail = serverMsg
      ? `${t('Menu_load_failed', 'Failed to load menu')}: ${serverMsg}`
      : t('Menu_load_failed', 'Failed to load menu')
    throw new ApiError(detail, res)
  }

  const list = Array.isArray(res.data?.data) ? res.data.data : []
  return withDashboardNode(list.map(mapProduct))
}

export default { fetchAccessControlMenu }
