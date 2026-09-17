import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import AuthService from '@/core/auth/AuthService'
import { t } from '@/core/i18n/t'
import routes from '@/app/routes'
import BoAppBar from '@/features/dashboard/components/BoAppBar/BoAppBar'
import SideMenu from '@/features/dashboard/components/SideMenu/SideMenu'
import { fetchAccessControlMenu } from '@/features/dashboard/services/menuService'
import './DashboardShell.css'

function resolveBreadcrumbs(pathname, products = []) {
  for (const product of products) {
    if (
      String(product.productCode).toLowerCase() === 'dashboard' &&
      (pathname === '/dashboard' || pathname === '/dashboard/')
    ) {
      return [t('Dashboard', 'Dashboard')]
    }
    for (const sub of product.subProducts || []) {
      if (pathname === sub.subProductUrl || pathname.startsWith(`${sub.subProductUrl}/`)) {
        const crumbs = [
          t(product.productDesc, product.productDesc),
          t(sub.subProductDesc, sub.subProductDesc),
        ]
        for (const child of sub.childMenus || []) {
          if (pathname === child.childMenuUrl) {
            crumbs.push(t(child.childMenuDesc, child.childMenuDesc))
            return crumbs
          }
        }
        return crumbs
      }
      for (const child of sub.childMenus || []) {
        if (pathname === child.childMenuUrl) {
          return [
            t(product.productDesc, product.productDesc),
            t(sub.subProductDesc, sub.subProductDesc),
            t(child.childMenuDesc, child.childMenuDesc),
          ]
        }
      }
    }
  }
  if (pathname.startsWith('/dashboard/city')) {
    return [t('Masters', 'Masters'), t('City', 'City')]
  }
  if (pathname.startsWith('/dashboard/') && pathname !== '/dashboard') {
    const leaf = pathname.split('/').filter(Boolean).pop()
    return [t('Dashboard', 'Dashboard'), leaf]
  }
  return [t('Dashboard', 'Dashboard')]
}

function DashboardShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [products, setProducts] = useState([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [menuError, setMenuError] = useState('')
  const [fontScale, setFontScale] = useState(100)
  const [customizerOpen, setCustomizerOpen] = useState(false)

  const loadMenu = useCallback(async () => {
    setMenuLoading(true)
    setMenuError('')
    try {
      const list = await fetchAccessControlMenu()
      setProducts(list)
    } catch (err) {
      setProducts([])
      setMenuError(err?.message || t('Menu_load_failed', 'Failed to load menu'))
    } finally {
      setMenuLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMenu()
  }, [loadMenu])

  useEffect(() => {
    document.documentElement.style.setProperty('--qnb-app-font-scale', `${fontScale / 100}`)
  }, [fontScale])

  const breadcrumbs = useMemo(
    () => resolveBreadcrumbs(location.pathname, products),
    [location.pathname, products],
  )
  const title = breadcrumbs[breadcrumbs.length - 1] || t('Dashboard', 'Dashboard')

  function handleLogout() {
    AuthService.logout()
    navigate(routes.login, { replace: true })
  }

  return (
    <Box className="dashboard-shell">
      <Box className="dashboard-shell-body">
        <SideMenu
          products={products}
          collapsed={collapsed}
          loading={menuLoading}
          error={menuError}
          onCollapse={() => setCollapsed((v) => !v)}
          onLogout={handleLogout}
        />
        <Box className="dashboard-shell-main">
          <BoAppBar
            title={title}
            breadcrumbs={breadcrumbs}
            onMenuToggle={() => setCollapsed((v) => !v)}
            fontScale={fontScale}
            onFontScaleChange={setFontScale}
            onRefresh={loadMenu}
            customizerOpen={customizerOpen}
            onCustomizerToggle={() => setCustomizerOpen((v) => !v)}
            onLogout={handleLogout}
          />
          <Box className="dashboard-shell-content">
            <Outlet context={{ products, reloadMenu: loadMenu }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardShell
