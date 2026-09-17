import './UISpace.css'

function UISpace({ size = 16, axis = 'y', className = '' }) {
  const style =
    axis === 'x'
      ? { width: `var(--qnb-space-${size}, ${size}px)`, height: 1 }
      : { height: `var(--qnb-space-${size}, ${size}px)`, width: '100%' }

  return <div className={['ui-space', className].filter(Boolean).join(' ')} style={style} aria-hidden="true" />
}

export default UISpace
