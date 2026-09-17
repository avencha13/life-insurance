function Form({ children, className = '', onSubmit, ...props }) {
  return (
    <form
      className={['ui-form', className].filter(Boolean).join(' ')}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
    </form>
  )
}

export default Form
