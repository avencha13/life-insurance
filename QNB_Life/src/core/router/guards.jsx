import { Navigate, useLocation } from 'react-router-dom'
import AuthService from '@/core/auth/AuthService'
import routes from '@/app/routes'

export function RequireAuth({ children }) {
  const location = useLocation()
  if (!AuthService.isLoggedIn()) {
    return <Navigate to={routes.login} replace state={{ from: location }} />
  }
  return children
}

export function RedirectIfAuthed({ children }) {
  if (AuthService.isLoggedIn()) {
    return <Navigate to={routes.dashboard} replace />
  }
  return children
}

export default RequireAuth
