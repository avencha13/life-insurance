function Footer({ children, className = '', ...props }) {
  return (
    <footer className={['ui-footer', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </footer>
  )
}

export default Footer
