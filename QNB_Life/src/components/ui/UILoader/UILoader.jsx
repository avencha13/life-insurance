import './UILoader.css'

function UILoader({ label }) {
  return (
    <div className="ui-loader" role="status" aria-live="polite">
      <span className="ui-loader-spinner" />
      {label ? <span className="ui-loader-label">{label}</span> : null}
    </div>
  )
}

export default UILoader
