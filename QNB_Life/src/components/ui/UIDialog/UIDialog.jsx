import { useEffect } from 'react'
import UIButton from '@/components/ui/UIButton/UIButton'
import UIText from '@/components/ui/UIText/UIText'
import './UIDialog.css'

function UIDialog({
  open = false,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel,
  className = '',
}) {
  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onCancel?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className={['ui-dialog-backdrop', className].filter(Boolean).join(' ')}
      onClick={() => onCancel?.()}
      role="presentation"
    >
      <div
        className="ui-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ui-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <UIText as="h3" id="ui-dialog-title" variant="h16SemiBold" className="ui-dialog-title">
            {title}
          </UIText>
        ) : null}
        {message ? (
          <UIText as="p" variant="b14Regular" className="ui-dialog-message">
            {message}
          </UIText>
        ) : null}
        <div className="ui-dialog-actions">
          <UIButton type="button" variant="outline" onClick={() => onCancel?.()}>
            {cancelLabel}
          </UIButton>
          <UIButton
            type="button"
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={() => onConfirm?.()}
          >
            {confirmLabel}
          </UIButton>
        </div>
      </div>
    </div>
  )
}

export default UIDialog
