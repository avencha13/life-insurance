import { Navigate, Route, Routes } from 'react-router-dom'
import routes, { dashboardChildPaths } from '@/app/routes'
import { RedirectIfAuthed, RequireAuth } from '@/core/router/guards'
import LoginPage from '@/features/auth/pages/LoginPage/LoginPage'
import DashboardShell from '@/features/dashboard/components/DashboardShell/DashboardShell'
import HomePage from '@/features/dashboard/pages/HomePage/HomePage'
import ComingSoonPage from '@/features/common/pages/ComingSoonPage/ComingSoonPage'
import CityTablePage from '@/features/master/city/pages/CityTablePage/CityTablePage'

function stubPath(child) {
  return child.startsWith('/') ? child.replace(/^\//, '') : child
}

function App() {
  const stubChildren = dashboardChildPaths.filter((p) => p !== 'city' && p !== '')

  return (
    <Routes>
      <Route path={routes.root} element={<Navigate to={routes.login} replace />} />
      <Route
        path={routes.login}
        element={
          <RedirectIfAuthed>
            <LoginPage />
          </RedirectIfAuthed>
        }
      />

      <Route
        path={routes.dashboard}
        element={
          <RequireAuth>
            <DashboardShell />
          </RequireAuth>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="city" element={<CityTablePage />} />
        {stubChildren.map((child) => (
          <Route key={child} path={stubPath(child)} element={<ComingSoonPage />} />
        ))}
        <Route path="*" element={<ComingSoonPage />} />
      </Route>

      <Route path="*" element={<Navigate to={routes.login} replace />} />
    </Routes>
  )
}

export default App
