import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import Form from '@/components/layout/Form/Form'
import Main from '@/components/layout/Main/Main'
import { UIButton, UIInput, UILoader, UIText } from '@/components/ui'
import assetPath from '@/core/config/assetPath'
import AuthService from '@/core/auth/AuthService'
import { t } from '@/core/i18n/t'
import routes from '@/app/routes'
import {
  completeSecureMfa,
  loginRequest,
  mfaValidation,
  validateOtp,
} from '@/features/auth/services/authService'
import './LoginPage.css'

function IconPerson() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.14 0-7.5 2.1-7.5 4.69V20h15v-.06c0-2.59-3.36-4.69-7.5-4.69Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm7 12H7v-8h10v8Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconEye({ off = false }) {
  if (off) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3.28 2.22 2.22 3.28l3.2 3.2A11.6 11.6 0 0 0 1.5 12C3.43 16.55 7.5 19.5 12 19.5c1.7 0 3.3-.35 4.74-.98l3.98 3.98 1.06-1.06L3.28 2.22ZM12 17.5c-3.6 0-6.85-2.28-8.5-5.5a9.8 9.8 0 0 1 3.4-3.74l2.03 2.03A3.5 3.5 0 0 0 12 15.5c.4 0 .78-.07 1.14-.2l1.6 1.6c-.87.39-1.8.6-2.74.6Zm0-11c3.6 0 6.85 2.28 8.5 5.5a9.9 9.9 0 0 1-1.86 2.5l-1.13-1.13A8 8 0 0 0 18.9 12C17.4 9.35 14.85 7.5 12 7.5c-.5 0-1 .05-1.48.14L9.2 6.32A10.7 10.7 0 0 1 12 6.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5C7.5 5 3.43 7.95 1.5 12.5 3.43 17.05 7.5 20 12 20s8.57-2.95 10.5-7.5C20.57 7.95 16.5 5 12 5Zm0 12.5A5 5 0 1 1 17 12.5a5 5 0 0 1-5 5Zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h12.2l-4.6-4.6L14 6l7 7-7 7-1.4-1.4 4.6-4.6H5V12Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LogoWidget() {
  return (
    <Box className="login-logo">
      <Box className="login-logo-titles">
        <UIText as="span" variant="h18Extra" className="login-logo-title">
          {t('BACK_OFFICE', 'BACK OFFICE')}
        </UIText>
        <UIText as="span" variant="b13Medium" className="login-logo-subtitle">
          {t('Enterprise_Management', 'Enterprise Management')}
        </UIText>
      </Box>
      <span className="login-logo-divider" aria-hidden="true" />
      <img
        src={assetPath.svg.dukhanLogoTextBlack}
        alt=""
        className="login-logo-img"
      />
    </Box>
  )
}

function LoginHeroPanel() {
  const year = new Date().getFullYear()
  const line1 = t('Login_hero_line1', 'Empowering\noperations.')
  const line2 = t('Login_hero_line2', 'Enabling excellence.')

  return (
    <Box className="login-hero">
      <img
        className="login-hero-image"
        src={assetPath.image.mannaiOfficeHero}
        alt=""
      />
      <Box className="login-hero-wash" aria-hidden="true" />
      <Box className="login-hero-arcs" aria-hidden="true" />
      <Box className="login-hero-content">
        <Box className="login-hero-main">
          <h2 className="login-hero-title">
            <span className="login-hero-title-navy">{line1}</span>
            {'\n'}
            <span className="login-hero-title-accent">{line2}</span>
          </h2>
          <span className="login-hero-bar" aria-hidden="true" />
          <UIText as="p" variant="b16Medium" className="login-hero-desc">
            {t(
              'Login_hero_desc',
              'Back Office is your secure and intelligent platform(RBX) to manage products, users, and operations with confidence and control.',
            )}
          </UIText>
        </Box>
        <UIText as="p" variant="b12Medium" className="login-hero-copy">
          {`© ${year} ${t('Login_copyright_suffix', 'Mannai Corporation. All rights reserved.')}`}
        </UIText>
      </Box>
    </Box>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secureValue, setSecureValue] = useState('')
  const [otp, setOtp] = useState('')
  const [showSecure, setShowSecure] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [mfaDetails, setMfaDetails] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const canSubmit = useMemo(() => !loading, [loading])
  const credentialsLocked = showSecure || showOtp

  function finishLogin() {
    navigate(routes.dashboard, { replace: true })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const usernameEmpty = !username.trim()
    const passwordEmpty = !password.trim()

    if (!credentialsLocked) {
      setUsernameError(
        usernameEmpty ? t('Please_enter_user_name', 'Please enter user name') : '',
      )
      setPasswordError(
        passwordEmpty ? t('Please_enter_password', 'Please enter password') : '',
      )
      if (usernameEmpty || passwordEmpty || loading) return
    } else if (loading) {
      return
    }

    setError('')
    setLoading(true)

    try {
      // OTP step
      if (showOtp) {
        const otpResult = await validateOtp({
          userId: username.trim(),
          otp,
        })
        if (otpResult.authStatus === 'OTP VERIFIED SUCCESSFULLY') {
          finishLogin()
          return
        }
        setError(otpResult.authStatus || t('INVALID_OTP', 'INVALID OTP'))
        return
      }

      // Secure-value MFA step
      if (showSecure && mfaDetails) {
        const mfaResult = await completeSecureMfa({
          username: username.trim(),
          mfaYn: mfaDetails.mfaYn,
          mfaType: mfaDetails.mfaType,
          secureValue,
        })
        if (mfaResult.authStatus === 'SECURE VALUE VALID') {
          finishLogin()
          return
        }
        setError(mfaResult.authStatus || t('MFA_failed', 'MFA validation failed'))
        return
      }

      // Primary login
      const result = await loginRequest({
        username: username.trim(),
        password,
      })

      if (result.needOtp) {
        setMfaDetails({
          mfaYn: result.mfaYn,
          mfaType: result.mfaType,
          otpLength: result.otpLength,
        })
        await mfaValidation({
          username: username.trim(),
          mfaYn: result.mfaYn,
          mfaType: result.mfaType,
          channelName: 'Internet Banking',
          secureValue: null,
        })
        setShowOtp(true)
        return
      }

      if (result.needSecureValue) {
        setMfaDetails({
          mfaYn: result.mfaYn,
          mfaType: result.mfaType,
          otpLength: result.otpLength,
        })
        setShowSecure(true)
        return
      }

      if (!AuthService.isLoggedIn()) {
        AuthService.login({
          token: result.token,
          user: result.user,
        })
      }
      finishLogin()
    } catch (err) {
      setError(err?.message || t('Invalid_Credentials', 'Invalid username or password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main className="login-page">
      <LoginHeroPanel />
      <Box className="login-panel">
        <Box className="login-panel-inner">
          <LogoWidget />
          <Box className="login-card">
            <UIText as="h1" variant="h20SemiBold" className="login-card-title">
              {t('Welcome_back', 'Welcome back')}
            </UIText>
            <UIText as="p" variant="b12Medium" className="login-card-support">
              {t('Sign_in_to_continue', 'Sign in to your account to continue')}
            </UIText>

            <Form onSubmit={handleSubmit} className="login-form" autoComplete="on">
              <UIInput
                className="login-field"
                label={t('User_Name', 'User Name')}
                name="username"
                autoComplete="username"
                placeholder={t('Enter_User_Name', 'Enter User Name')}
                value={username}
                readOnly={credentialsLocked}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setUsernameError(
                    e.target.value.trim()
                      ? ''
                      : t('Please_enter_user_name', 'Please enter user name'),
                  )
                }}
                error={usernameError}
                leftAdornment={<IconPerson />}
              />

              <UIInput
                className="login-field"
                label={t('Password', 'Password')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={t('Enter_password', 'Enter password')}
                value={password}
                readOnly={credentialsLocked}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(
                    e.target.value.trim()
                      ? ''
                      : t('Please_enter_password', 'Please enter password'),
                  )
                }}
                error={passwordError}
                leftAdornment={<IconLock />}
                rightAdornment={
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <IconEye off={!showPassword} />
                  </button>
                }
              />

              {showSecure ? (
                <UIInput
                  className="login-field"
                  label={t('Secure_Value', 'Secure Value')}
                  name="secureValue"
                  value={secureValue}
                  onChange={(e) => setSecureValue(e.target.value)}
                  leftAdornment={<IconLock />}
                />
              ) : null}

              {showOtp ? (
                <UIInput
                  className="login-field"
                  label={t('OTP', 'OTP')}
                  name="otp"
                  placeholder={t('Enter_OTP', 'Enter OTP')}
                  value={otp}
                  maxLength={mfaDetails?.otpLength || 8}
                  onChange={(e) => setOtp(e.target.value)}
                  leftAdornment={<IconLock />}
                />
              ) : null}

              {error ? (
                <UIText variant="b13Regular" className="login-error">
                  {error}
                </UIText>
              ) : null}

              <UIButton
                type="submit"
                variant="primary"
                className={['login-submit', loading ? 'is-loading' : ''].filter(Boolean).join(' ')}
                disabled={!canSubmit}
              >
                {loading ? (
                  <UILoader />
                ) : (
                  <>
                    <span>{t('Sign_in', 'Sign in')}</span>
                    <IconArrow />
                  </>
                )}
              </UIButton>
            </Form>
          </Box>
        </Box>
      </Box>
    </Main>
  )
}

export default LoginPage
