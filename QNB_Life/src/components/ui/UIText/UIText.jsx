import './UIText.css'

const variants = {
  h45SemiBold: 'ui-text ui-text-h45 ui-text-semi',
  h35Regular: 'ui-text ui-text-h35 ui-text-regular',
  h35Medium: 'ui-text ui-text-h35 ui-text-medium',
  h35SemiBold: 'ui-text ui-text-h35 ui-text-semi',
  h31Bold: 'ui-text ui-text-h31 ui-text-bold',
  h28Bold: 'ui-text ui-text-h28 ui-text-bold',
  h24SemiBold: 'ui-text ui-text-h24 ui-text-semi',
  h20SemiBold: 'ui-text ui-text-h20 ui-text-semi',
  h20Bold: 'ui-text ui-text-h20 ui-text-bold',
  h18Bold: 'ui-text ui-text-h18 ui-text-bold',
  h18Extra: 'ui-text ui-text-h18 ui-text-extra',
  h16SemiBold: 'ui-text ui-text-h16 ui-text-semi',
  b18Regular: 'ui-text ui-text-h18 ui-text-regular',
  b16Regular: 'ui-text ui-text-h16 ui-text-regular',
  b16Medium: 'ui-text ui-text-h16 ui-text-medium',
  b15Medium: 'ui-text ui-text-h15 ui-text-medium',
  b14Regular: 'ui-text ui-text-h14 ui-text-regular',
  b14Medium: 'ui-text ui-text-h14 ui-text-medium',
  b14Bold: 'ui-text ui-text-h14 ui-text-bold',
  b14SemiBold: 'ui-text ui-text-h14 ui-text-semi',
  b13Regular: 'ui-text ui-text-h13 ui-text-regular',
  b13Medium: 'ui-text ui-text-h13 ui-text-medium',
  b12Regular: 'ui-text ui-text-h12 ui-text-regular',
  b12Medium: 'ui-text ui-text-h12 ui-text-medium',
  b12Bold: 'ui-text ui-text-h12 ui-text-bold',
  b11Regular: 'ui-text ui-text-h12 ui-text-regular',
  b11Medium: 'ui-text ui-text-h12 ui-text-medium',
  custom: 'ui-text',
}

function UIText({
  as: Component = 'p',
  children,
  className = '',
  variant = 'b14Regular',
  color,
  ...props
}) {
  const variantClass = variants[variant] ?? variants.b14Regular
  const classNames = [variantClass, className].filter(Boolean).join(' ')
  const style = color ? { color: `var(${color})`, ...props.style } : props.style

  return (
    <Component className={classNames} style={style} {...props}>
      {children}
    </Component>
  )
}

export default UIText
