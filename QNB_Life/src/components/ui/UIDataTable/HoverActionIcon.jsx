import './HoverActionIcon.css'

function HoverActionIcon({ children, onClick, tooltip, color, danger = false }) {
  return (
    <button
      type="button"
      className={`ui-hover-action${danger ? ' is-danger' : ''}`}
      onClick={onClick}
      title={tooltip || undefined}
      aria-label={tooltip || undefined}
      style={color ? { color } : undefined}
    >
      {children}
    </button>
  )
}

export function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5C7.5 5 3.43 7.95 1.5 12.5 3.43 17.05 7.5 20 12 20s8.57-2.95 10.5-7.5C20.57 7.95 16.5 5 12 5Zm0 12.5A5 5 0 1 1 17 12.5a5 5 0 0 1-5 5Zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconEdit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconDelete() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default HoverActionIcon
