import UIText from '@/components/ui/UIText/UIText'
import './UIDropdown.css'

function UIDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  className = '',
  disabled = false,
  readOnly = false,
  error,
}) {
  const locked = disabled || readOnly

  return (
    <label
      className={[
        'ui-dropdown',
        className,
        error ? 'has-error' : '',
        locked ? 'is-locked' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label ? (
        <UIText as="span" variant="b13Medium" className="ui-dropdown-label">
          {label}
        </UIText>
      ) : null}
      <select
        value={value}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={Boolean(error)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value
          const text = typeof opt === 'string' ? opt : opt.label
          return (
            <option key={val} value={val}>
              {text}
            </option>
          )
        })}
      </select>
      {error ? (
        <UIText as="span" variant="b12Regular" className="ui-dropdown-error">
          {error}
        </UIText>
      ) : null}
    </label>
  )
}

export default UIDropdown
