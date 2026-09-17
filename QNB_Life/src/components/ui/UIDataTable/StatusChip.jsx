import { normalizeStatusLabel } from './utils'
import './StatusChip.css'

function toneForStatus(status) {
  const lower = String(status || '')
    .toLowerCase()
    .trim()
  switch (lower) {
    case 'active':
    case 'true':
    case 'y':
    case 'yes':
    case '1':
    case 'completed':
    case 'enabled':
    case 'success':
      return 'success'
    case 'inactive':
    case 'false':
    case 'n':
    case 'no':
    case '0':
      return 'neutral'
    case 'failed':
    case 'rejected':
      return 'danger'
    case 'in_progress':
    case 'in progress':
    case 'pending':
      return 'info'
    case 'draft':
      return 'warning'
    default:
      return 'default'
  }
}

function StatusChip({ status, label }) {
  const display = label || normalizeStatusLabel(status) || String(status || '')
  if (!String(display).trim()) return null
  const tone = toneForStatus(display)
  return (
    <span className={`ui-status-chip tone-${tone}`}>
      {String(display).toUpperCase()}
    </span>
  )
}

export default StatusChip
