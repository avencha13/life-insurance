import './UISvgIcon.css'

function UISvgIcon({ src, alt = '', size = 20, className = '', ...props }) {
  return (
    <img
      className={['ui-svg-icon', className].filter(Boolean).join(' ')}
      src={src}
      alt={alt}
      width={size}
      height={size}
      {...props}
    />
  )
}

export default UISvgIcon
