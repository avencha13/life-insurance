import './UICard.css'

function UICard({ as: Component = 'section', children, className = '', ...props }) {
  return (
    <Component className={['ui-card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Component>
  )
}

export default UICard
