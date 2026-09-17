import { ToastProvider } from '@/components/ui/UIToast/ToastProvider'

function AppProviders({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}

export default AppProviders
