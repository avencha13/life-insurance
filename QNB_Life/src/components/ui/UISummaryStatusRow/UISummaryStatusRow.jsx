import './UISummaryStatusRow.css'

function UISummaryStatusRow({
  items = [],
  value = 'all',
  onChange,
  className = '',
}) {
  return (
    <div className={['ui-summary-status-row', className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const key = item.key
        const active = String(value) === String(key)
        return (
          <button
            key={key}
            type="button"
            className={`ui-summary-chip${active ? ' is-active' : ''}`}
            onClick={() => onChange?.(key)}
          >
            <span className="ui-summary-chip-label">{item.label}</span>
            <span className="ui-summary-chip-count">{item.count ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}

export default UISummaryStatusRow
