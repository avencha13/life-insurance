import './UISwitch.css'

function UISwitch({ checked = false, onChange, label, disabled = false }) {
  return (
    <label className={['ui-switch', disabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="ui-switch-track" />
      {label ? <span className="ui-switch-label">{label}</span> : null}
    </label>
  )
}

export default UISwitch
