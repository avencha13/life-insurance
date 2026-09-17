import UIButton from '@/components/ui/UIButton/UIButton'
import './UIAddButton.css'

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" fill="currentColor" />
    </svg>
  )
}

function UIAddButton({ label = 'Add', onClick, disabled = false, className = '', ...props }) {
  return (
    <UIButton
      type="button"
      variant="primary"
      className={['ui-add-button', className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <PlusIcon />
      <span>{label}</span>
    </UIButton>
  )
}

export default UIAddButton
