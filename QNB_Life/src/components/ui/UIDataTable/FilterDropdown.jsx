import { useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@/core/i18n/t'
import './FilterDropdown.css'

function FilterDropdown({
  column,
  columnLabel,
  options = [],
  selections,
  onChange,
  open,
  onClose,
  anchorRef,
}) {
  const panelRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const selected = selections && selections.size ? selections : new Set(['ALL'])

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return options.filter((option) => {
      if (option === 'ALL') return true
      if (!q) return true
      return String(option).toLowerCase().includes(q)
    })
  }, [options, searchQuery])

  useEffect(() => {
    if (!open) return undefined
    function onDoc(e) {
      if (panelRef.current?.contains(e.target)) return
      if (anchorRef?.current?.contains(e.target)) return
      onClose?.()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onClose, anchorRef])

  if (!open) return null

  function pick(option) {
    if (option === 'ALL') {
      onChange?.(column, new Set(['ALL']))
      onClose?.()
      return
    }
    onChange?.(column, new Set([option]))
    onClose?.()
  }

  function clear() {
    onChange?.(column, new Set(['ALL']))
    onClose?.()
  }

  const title = columnLabel || column

  return (
    <div className="ui-filter-dropdown" ref={panelRef} role="dialog">
      <div className="ui-filter-dropdown-header">
        <span className="ui-filter-dropdown-title">
          {t('Filter', 'Filter')} {title}
        </span>
        {!selected.has('ALL') ? (
          <button type="button" className="ui-filter-dropdown-clear" onClick={clear}>
            {t('Clear', 'Clear')}
          </button>
        ) : null}
      </div>
      <input
        className="ui-filter-dropdown-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('Search', 'Search')}
      />
      <ul className="ui-filter-dropdown-list">
        {filteredOptions.map((option) => {
          const active = selected.has(option) || (option === 'ALL' && selected.has('ALL'))
          return (
            <li key={option}>
              <button
                type="button"
                className={active ? 'is-active' : ''}
                onClick={() => pick(option)}
              >
                {option === 'ALL' ? t('ALL', 'ALL') : option}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FilterDropdown
