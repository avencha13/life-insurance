import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import { UIButton, UICard, UIText } from '@/components/ui'
import assetPath from '@/core/config/assetPath'
import AuthService from '@/core/auth/AuthService'
import { t } from '@/core/i18n/t'
import routes from '@/app/routes'
import { boSvg } from '@/features/dashboard/menu/menuIconMaps'
import UISvgIcon from '@/components/ui/UISvgIcon/UISvgIcon'
import './BoAppBar.css'

function initials(user = {}) {
  const raw = user.userName || user.userId || 'U'
  return String(raw).slice(0, 2).toUpperCase()
}

function BoAppBar({
  title,
  breadcrumbs = [],
  onMenuToggle,
  fontScale = 100,
  onFontScaleChange,
  onRefresh,
  customizerOpen = false,
  onCustomizerToggle,
  onLogout,
}) {
  const navigate = useNavigate()
  const user = AuthService.getUser()
  const [logoutOpen, setLogoutOpen] = useState(false)

  function confirmLogout() {
    if (onLogout) onLogout()
    else {
      AuthService.logout()
      navigate(routes.login, { replace: true })
    }
    setLogoutOpen(false)
  }

  function bumpFont(delta) {
    const next = Math.min(140, Math.max(80, fontScale + delta))
    onFontScaleChange?.(next)
  }

  return (
    <>
      <header className="bo-app-bar">
        <Box className="bo-app-bar-left">
          <UIButton variant="icon" type="button" aria-label="Menu" onClick={onMenuToggle}>
            ☰
          </UIButton>
          <Box>
            <UIText as="h1" variant="h18Bold">
              {title}
            </UIText>
            {breadcrumbs.length ? (
              <UIText as="p" variant="b12Regular" className="bo-app-bar-crumbs">
                {breadcrumbs.join(' / ')}
              </UIText>
            ) : null}
          </Box>
        </Box>

        <Box className="bo-app-bar-right">
          <Box className="bo-app-bar-font" role="group" aria-label={t('Font_Scale', 'Font scale')}>
            <button type="button" onClick={() => bumpFont(-10)} aria-label="Decrease font">
              A-
            </button>
            <span>{fontScale}%</span>
            <button type="button" onClick={() => bumpFont(10)} aria-label="Increase font">
              A+
            </button>
          </Box>

          <button
            type="button"
            className="bo-app-bar-icon-btn"
            aria-label={t('Refresh', 'Refresh')}
            onClick={() => onRefresh?.()}
          >
            <UISvgIcon src={assetPath.svg.refresh} size={18} alt="" />
          </button>

          <button
            type="button"
            className="bo-app-bar-icon-btn"
            aria-label={t('Notifications', 'Notifications')}
          >
            <UISvgIcon src={boSvg.bell} size={18} alt="" />
          </button>

          <button
            type="button"
            className="bo-app-bar-avatar-btn"
            aria-label={t('Profile', 'Profile')}
            onClick={() => setLogoutOpen(true)}
          >
            <span className="bo-app-bar-avatar">{initials(user)}</span>
          </button>

          <UIButton
            variant="outline"
            type="button"
            className={['bo-app-bar-customizer', customizerOpen ? 'is-open' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => onCustomizerToggle?.()}
          >
            <UISvgIcon src={boSvg.layers} size={16} alt="" />
            {t('Customizer', 'Customizer')}
          </UIButton>
        </Box>
      </header>

      {logoutOpen ? (
        <div className="bo-logout-backdrop" role="presentation" onClick={() => setLogoutOpen(false)}>
          <UICard
            className="bo-logout-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <UIText as="h2" variant="h24SemiBold">
              {t('Log_Out?', 'Log Out?')}
            </UIText>
            <img src={assetPath.image.loggingOut} alt="" className="bo-logout-img" />
            <UIText variant="b16Regular">
              {t('Are_You_sure_want_logout', 'Are you sure you want to logout?')}
            </UIText>
            <Box className="bo-logout-actions">
              <UIButton variant="outline" type="button" onClick={() => setLogoutOpen(false)}>
                {t('Cancel', 'Cancel')}
              </UIButton>
              <UIButton variant="primary" type="button" onClick={confirmLogout}>
                {t('Log_Out', 'Log Out')}
              </UIButton>
            </Box>
          </UICard>
        </div>
      ) : null}
    </>
  )
}

export default BoAppBar
