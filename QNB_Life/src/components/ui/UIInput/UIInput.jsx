import UIText from '@/components/ui/UIText/UIText'
import './UIInput.css'

function UIInput({
  label,
  className = '',
  type = 'text',
  error,
  leftAdornment,
  rightAdornment,
  inputClassName = '',
  readOnly = false,
  disabled = false,
  ...props
}) {
  const wrapClass = [
    'ui-input-control-wrap',
    leftAdornment ? 'has-left' : '',
    rightAdornment ? 'has-right' : '',
    error ? 'has-error' : '',
    readOnly ? 'is-readonly' : '',
    disabled ? 'is-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label
      className={['ui-input-field', className, disabled ? 'is-disabled' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {label ? (
        <UIText as="span" variant="b14Medium" className="ui-input-label">
          {label}
        </UIText>
      ) : null}
      <span className={wrapClass}>
        {leftAdornment ? (
          <span className="ui-input-adornment ui-input-adornment-left">{leftAdornment}</span>
        ) : null}
        <input
          className={['ui-input-control', inputClassName].filter(Boolean).join(' ')}
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          {...props}
        />
        {rightAdornment ? (
          <span className="ui-input-adornment ui-input-adornment-right">{rightAdornment}</span>
        ) : null}
      </span>
      {error ? (
        <UIText as="span" variant="b12Regular" className="ui-input-error">
          {error}
        </UIText>
      ) : null}
    </label>
  )
}

export default UIInput
