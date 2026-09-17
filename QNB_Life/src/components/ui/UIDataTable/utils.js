/** Flutter RowActionType parity */
export const RowActionType = {
  view: 'view',
  modify: 'modify',
  delete: 'delete',
  execute: 'execute',
  inlineEdit: 'inlineEdit',
  add: 'add',
  renew: 'renew',
}

export function rowAction(type, extras = {}) {
  return { type, ...extras }
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]

export { PAGE_SIZE_OPTIONS }

function looksLikeFileName(value) {
  if (typeof value !== 'string' || value.length <= 4 || !value.includes('.')) return false
  const ext = value.slice(value.lastIndexOf('.') + 1).toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'].includes(ext)
}

function tryParseNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.length > 0) {
    const first = value.charCodeAt(0)
    if ((first >= 48 && first <= 57) || first === 45 || first === 43) {
      const n = Number(value)
      return Number.isFinite(n) ? n : null
    }
  }
  return null
}

function tryParseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  if (typeof value === 'string') {
    if (looksLikeFileName(value)) return null
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return null
}

/** Flutter SortKey-style compare for mixed number/date/string cells */
export function compareCellValues(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  const na = tryParseNumber(a)
  const nb = tryParseNumber(b)
  if (na != null && nb != null) return na - nb

  const da = tryParseDate(a)
  const db = tryParseDate(b)
  if (da && db) return da.getTime() - db.getTime()

  return String(a).toLowerCase().localeCompare(String(b).toLowerCase(), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export function filterRows(rows, columns, searchText, columnSelections = {}) {
  let result = Array.isArray(rows) ? [...rows] : []
  const q = String(searchText || '')
    .trim()
    .toLowerCase()

  if (q) {
    result = result.filter((row) =>
      columns.some((col) => {
        const raw = row[col.key]
        if (raw == null) return false
        return String(raw).toLowerCase().includes(q)
      }),
    )
  }

  for (const [key, selections] of Object.entries(columnSelections)) {
    if (!selections || selections.size === 0 || selections.has('ALL')) continue
    result = result.filter((row) => {
      const val = String(row[key] ?? '')
      return selections.has(val)
    })
  }

  return result
}

export function sortRows(rows, sortKey, ascending) {
  if (!sortKey) return rows
  const sorted = [...rows]
  sorted.sort((ra, rb) => {
    const cmp = compareCellValues(ra[sortKey], rb[sortKey])
    return ascending ? cmp : -cmp
  })
  return sorted
}

export function uniqueColumnValues(rows, key) {
  const set = new Set()
  for (const row of rows || []) {
    const v = row[key]
    if (v == null || String(v).trim() === '') continue
    set.add(String(v))
  }
  return ['ALL', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
}

export function rowHasAction(rowActions, type) {
  if (!rowActions) return false
  const list = Array.isArray(rowActions) ? rowActions : Array.from(rowActions)
  return list.some((a) => a === type || a?.type === type)
}

export function getRowAction(rowActions, type) {
  if (!rowActions) return null
  const list = Array.isArray(rowActions) ? rowActions : Array.from(rowActions)
  return list.find((a) => a === type || a?.type === type) || null
}

export function normalizeStatusLabel(status) {
  const s = String(status || '')
    .toUpperCase()
    .trim()
  if (['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(s)) return 'Active'
  if (['N', 'NO', 'INACTIVE', '0', 'FALSE'].includes(s)) return 'Inactive'
  return status ? String(status) : ''
}
