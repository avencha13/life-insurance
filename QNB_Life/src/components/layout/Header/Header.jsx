function Header({ children, className = '', ...props }) {
  return (
    <header className={['ui-header', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </header>
  )
}

export default Header
