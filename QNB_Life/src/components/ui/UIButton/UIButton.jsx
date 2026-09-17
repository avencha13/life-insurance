import './UIButton.css'

function UIButton({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  disabled = false,
  ...props
}) {
  const classNames = ['ui-button', `ui-button-${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classNames} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default UIButton
