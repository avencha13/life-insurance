import './UICheckBox.css'

function UICheckBox({ checked = false, onChange, label, disabled = false }) {
  return (
    <label className={['ui-checkbox', disabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="ui-checkbox-box" />
      {label ? <span className="ui-checkbox-label">{label}</span> : null}
    </label>
  )
}

export default UICheckBox
