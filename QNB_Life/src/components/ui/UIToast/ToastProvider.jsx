import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import './UIToast.css'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, tone = 'success', duration = 3200) => {
      const id = ++toastId
      setToasts((prev) => [...prev, { id, message: String(message || ''), tone }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      push,
      success: (message, duration) => push(message, 'success', duration),
      error: (message, duration) => push(message, 'error', duration),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="ui-toast-viewport" aria-live="polite">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`ui-toast tone-${toast.tone}`}
                  role="status"
                  onClick={() => dismiss(toast.id)}
                >
                  {toast.message}
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      push: () => {},
      success: () => {},
      error: () => {},
      dismiss: () => {},
    }
  }
  return ctx
}

export default ToastProvider
