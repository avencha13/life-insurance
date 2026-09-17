import { useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import UISvgIcon from '@/components/ui/UISvgIcon/UISvgIcon'
import UIText from '@/components/ui/UIText/UIText'
import AuthService from '@/core/auth/AuthService'
import { t } from '@/core/i18n/t'
import { groupProductsByCategory } from '@/features/dashboard/menu/menuCategories'
import assetPath from '@/core/config/assetPath'
import {
  boSvg,
  resolveProductIcon,
  resolveSubProductIcon,
} from '@/features/dashboard/menu/menuIconMaps'
import routes from '@/app/routes'
import './SideMenu.css'

function pathActive(pathname, target) {
  if (!target) return false
  if (target === '/dashboard') return pathname === '/dashboard' || pathname === '/dashboard/'
  return pathname === target || pathname.startsWith(`${target}/`)
}

function initialsFromUser(user = {}) {
  const raw = user.userName || user.userId || user.firstName || 'U'
  const parts = String(raw).trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return String(raw).slice(0, 2).toUpperCase()
}

function MenuIcon({ src, size = 20, active = false }) {
  return (
    <UISvgIcon
      src={src}
      size={size}
      alt=""
      className={['side-menu-icon', active ? 'is-active' : ''].filter(Boolean).join(' ')}
    />
  )
}

function SideMenu({
  products = [],
  collapsed = false,
  loading = false,
  error = '',
  onCollapse,
  onLogout,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = AuthService.getUser()
  const [manualOpen, setManualOpen] = useState(() => new Set())
  const [manualClosed, setManualClosed] = useState(() => new Set())

  const sections = useMemo(() => groupProductsByCategory(products), [products])

  const activeTrail = useMemo(() => {
    for (const product of products) {
      if (String(product.productCode).toLowerCase() === 'dashboard') {
        if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
          return { productCode: product.productCode }
        }
      }
      for (const sub of product.subProducts || []) {
        if (pathActive(location.pathname, sub.subProductUrl)) {
          return { productCode: product.productCode, subCode: sub.subProductCode }
        }
        for (const child of sub.childMenus || []) {
          if (pathActive(location.pathname, child.childMenuUrl)) {
            return {
              productCode: product.productCode,
              subCode: sub.subProductCode,
              childCode: child.childMenuCode,
            }
          }
        }
      }
    }
    return null
  }, [location.pathname, products])

  function isOpen(code) {
    if (manualClosed.has(code)) return false
    if (manualOpen.has(code)) return true
    if (activeTrail?.productCode === code) return true
    if (activeTrail && `${activeTrail.productCode}:${activeTrail.subCode}` === code) return true
    return false
  }

  function toggle(code) {
    const currentlyOpen = isOpen(code)
    setManualOpen((prev) => {
      const next = new Set(prev)
      if (currentlyOpen) next.delete(code)
      else next.add(code)
      return next
    })
    setManualClosed((prev) => {
      const next = new Set(prev)
      if (currentlyOpen) next.add(code)
      else next.delete(code)
      return next
    })
  }

  function handleLogout() {
    if (onLogout) onLogout()
    else {
      AuthService.logout()
      navigate(routes.login, { replace: true })
    }
  }

  return (
    <aside className={['side-menu', collapsed ? 'is-collapsed' : ''].filter(Boolean).join(' ')}>
      <Box className="side-menu-brand">
        <img
          src={assetPath.svg.dukhanLogoMark}
          alt=""
          className="side-menu-logo"
        />
        {!collapsed ? (
          <UIText as="span" variant="b14SemiBold" className="side-menu-brand-text">
            {t('Back_Office', 'Back Office')}
          </UIText>
        ) : null}
        {!collapsed ? (
          <button type="button" className="side-menu-search" aria-label={t('Search', 'Search')}>
            ⌕
          </button>
        ) : null}
      </Box>

      <nav className="side-menu-nav" aria-label={t('Dashboard', 'Dashboard')}>
        {loading ? (
          <UIText variant="b12Regular" className="side-menu-status">
            {t('Loading', 'Loading…')}
          </UIText>
        ) : null}
        {!loading && error ? (
          <UIText variant="b12Regular" className="side-menu-status">
            {error}
          </UIText>
        ) : null}
        {!loading && !error && !products.length ? (
          <UIText variant="b12Regular" className="side-menu-status">
            {t('No_menu_items', 'No menu items')}
          </UIText>
        ) : null}

        {sections.map((section) => (
          <Box key={section.key || 'root'} className="side-menu-section">
            {section.label && !collapsed ? (
              <UIText as="p" variant="b11Medium" className="side-menu-section-label">
                {section.label}
              </UIText>
            ) : null}

            {section.products.map((product) => {
              const isDashboard = String(product.productCode).toLowerCase() === 'dashboard'
              const open = isOpen(product.productCode)
              const productActive = isDashboard
                ? location.pathname === '/dashboard' || location.pathname === '/dashboard/'
                : activeTrail?.productCode === product.productCode
              const productIcon =
                product.iconSvg ||
                resolveProductIcon(product.productCode, product.productDesc)

              if (isDashboard) {
                return (
                  <button
                    key={product.productCode}
                    type="button"
                    className={[
                      'side-menu-product',
                      'is-leaf',
                      productActive ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => navigate(routes.dashboard)}
                  >
                    <MenuIcon src={productIcon} size={20} active={productActive} />
                    {!collapsed ? (
                      <UIText as="span" variant="b14Medium" className="side-menu-label">
                        {t(product.productDesc, product.productDesc)}
                      </UIText>
                    ) : null}
                  </button>
                )
              }

              const hasSubs = (product.subProducts || []).length > 0

              return (
                <Box className="side-menu-group" key={product.productCode}>
                  <button
                    type="button"
                    className={[
                      'side-menu-product',
                      open ? 'is-open' : '',
                      productActive ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (hasSubs) toggle(product.productCode)
                    }}
                  >
                    <MenuIcon src={productIcon} size={20} active={productActive} />
                    {!collapsed ? (
                      <>
                        <UIText as="span" variant="b14Medium" className="side-menu-label">
                          {t(product.productDesc, product.productDesc)}
                        </UIText>
                        {hasSubs ? (
                          <UISvgIcon
                            src={open ? boSvg.chevronDown : boSvg.chevronRight}
                            size={14}
                            alt=""
                            className="side-menu-chevron-icon"
                          />
                        ) : null}
                      </>
                    ) : null}
                  </button>

                  {open && !collapsed && hasSubs ? (
                    <Box className="side-menu-subs">
                      {(product.subProducts || []).map((sub) => {
                        const hasChildren = (sub.childMenus || []).length > 0
                        const subKey = `${product.productCode}:${sub.subProductCode}`
                        const subOpen = isOpen(subKey)
                        const subActive = pathActive(location.pathname, sub.subProductUrl)
                        const subIcon =
                          sub.iconSvg ||
                          resolveSubProductIcon(sub.subProductCode, sub.subProductDesc)

                        if (hasChildren) {
                          return (
                            <Box key={sub.subProductCode}>
                              <button
                                type="button"
                                className={[
                                  'side-menu-sub',
                                  subActive ? 'is-active' : '',
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                onClick={() => toggle(subKey)}
                              >
                                <MenuIcon src={subIcon} size={18} active={subActive} />
                                <UIText as="span" variant="b13Medium" className="side-menu-label">
                                  {t(sub.subProductDesc, sub.subProductDesc)}
                                </UIText>
                                <UISvgIcon
                                  src={subOpen ? boSvg.chevronDown : boSvg.chevronRight}
                                  size={12}
                                  alt=""
                                  className="side-menu-chevron-icon"
                                />
                              </button>
                              {subOpen ? (
                                <Box className="side-menu-children">
                                  {sub.childMenus.map((child) => (
                                    <NavLink
                                      key={child.childMenuCode}
                                      to={child.childMenuUrl}
                                      className={({ isActive }) =>
                                        ['side-menu-child', isActive ? 'is-active' : '']
                                          .filter(Boolean)
                                          .join(' ')
                                      }
                                    >
                                      <MenuIcon src={boSvg.helpCircle} size={16} />
                                      <UIText as="span" variant="b12Regular">
                                        {t(child.childMenuDesc, child.childMenuDesc)}
                                      </UIText>
                                    </NavLink>
                                  ))}
                                </Box>
                              ) : null}
                            </Box>
                          )
                        }

                        return (
                          <NavLink
                            key={sub.subProductCode}
                            to={sub.subProductUrl}
                            end={sub.subProductUrl === '/dashboard'}
                            className={({ isActive }) =>
                              ['side-menu-sub', isActive ? 'is-active' : '']
                                .filter(Boolean)
                                .join(' ')
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <MenuIcon src={subIcon} size={18} active={isActive} />
                                <UIText as="span" variant="b13Medium" className="side-menu-label">
                                  {t(sub.subProductDesc, sub.subProductDesc)}
                                </UIText>
                              </>
                            )}
                          </NavLink>
                        )
                      })}
                    </Box>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        ))}
      </nav>

      <Box className="side-menu-footer">
        {!collapsed ? (
          <Box className="side-menu-user">
            <span className="side-menu-avatar">{initialsFromUser(user)}</span>
            <Box className="side-menu-user-text">
              <UIText as="span" variant="b13Medium" className="side-menu-user-id">
                {user.userId || user.userName || '—'}
              </UIText>
              <UIText as="span" variant="b11Regular" className="side-menu-user-name">
                {user.userName || user.firstName || ''}
              </UIText>
            </Box>
            <button
              type="button"
              className="side-menu-logout"
              aria-label={t('Log_Out', 'Log Out')}
              onClick={handleLogout}
            >
              <MenuIcon src={boSvg.logOut} size={18} />
            </button>
          </Box>
        ) : (
          <button
            type="button"
            className="side-menu-logout"
            aria-label={t('Log_Out', 'Log Out')}
            onClick={handleLogout}
          >
            <MenuIcon src={boSvg.logOut} size={18} />
          </button>
        )}

        <button type="button" className="side-menu-collapse" onClick={() => onCollapse?.()}>
          <MenuIcon src={collapsed ? boSvg.chevronRight : boSvg.chevronLeft} size={16} />
          {!collapsed ? (
            <UIText as="span" variant="b12Medium">
              {t('Collapse', 'Collapse')}
            </UIText>
          ) : null}
        </button>
      </Box>
    </aside>
  )
}

export default SideMenu
