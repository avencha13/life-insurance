function Box({ as: Component = 'div', children, className = '', ...props }) {
  const classNames = [className].filter(Boolean).join(' ')
  return (
    <Component className={classNames || undefined} {...props}>
      {children}
    </Component>
  )
}

export default Box
