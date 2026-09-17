function Main({ children, className = '', ...props }) {
  return (
    <main className={['ui-main', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </main>
  )
}

export default Main
