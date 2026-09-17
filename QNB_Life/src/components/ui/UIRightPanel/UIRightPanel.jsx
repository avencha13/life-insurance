import { useEffect } from 'react'
import UIText from '@/components/ui/UIText/UIText'
import './UIRightPanel.css'

function UIRightPanel({
  open = false,
  title,
  onClose,
  children,
  width = 420,
  className = '',
}) {
  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={['ui-right-panel-backdrop', className].filter(Boolean).join(' ')}
      onClick={() => onClose?.()}
      role="presentation"
    >
      <aside
        className="ui-right-panel"
        style={{ width: `min(${width}px, 100%)` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Panel'}
      >
        {title ? (
          <div className="ui-right-panel-head">
            <UIText as="h3" variant="h20SemiBold" className="ui-right-panel-title">
              {title}
            </UIText>
            <button
              type="button"
              className="ui-right-panel-close"
              onClick={() => onClose?.()}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ) : null}
        <div className="ui-right-panel-body">{children}</div>
      </aside>
    </div>
  )
}

export default UIRightPanel
