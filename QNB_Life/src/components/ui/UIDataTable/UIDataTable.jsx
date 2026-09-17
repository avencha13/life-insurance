import { useEffect, useMemo, useRef, useState } from 'react'
import UICheckBox from '@/components/ui/UICheckBox/UICheckBox'
import UIText from '@/components/ui/UIText/UIText'
import { t } from '@/core/i18n/t'
import FilterDropdown from './FilterDropdown'
import HoverActionIcon, {
  IconDelete,
  IconEdit,
  IconEye,
} from './HoverActionIcon'
import StatusChip from './StatusChip'
import {
  PAGE_SIZE_OPTIONS,
  RowActionType,
  filterRows,
  getRowAction,
  rowHasAction,
  sortRows,
  uniqueColumnValues,
} from './utils'
import './UIDataTable.css'

function SortIndicator({ active, ascending }) {
  if (!active) return null
  return (
    <span className="ui-dt-sort-active" aria-hidden="true">
      {ascending ? '↑' : '↓'}
    </span>
  )
}

function FilterFunnelIcon({ filled = false }) {
  // Material Icons.filter_alt / filter_alt_outlined (funnel, not list)
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04c-.83 0-1.3.95-.79 1.61z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 6h10l-5.01 6.3L7 6zm-2.75-.39C5.27 8.2 9 13 9 13v6c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61zM7 6h10l-5.01 6.3L7 6z" />
    </svg>
  )
}

function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages = new Set([0, total - 1, current, current - 1, current + 1])
  const list = Array.from(pages)
    .filter((p) => p >= 0 && p < total)
    .sort((a, b) => a - b)
  const out = []
  let prev = null
  for (const p of list) {
    if (prev != null && p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

function PaginationBar({
  showingFrom,
  showingTo,
  totalCount,
  rowsPerPage,
  safePage,
  pageCount,
  onRowsPerPage,
  onGoToPage,
}) {
  return (
    <div className="ui-dt-pager-bar">
      <span className="ui-dt-showing">
        {t('Showing', 'Showing')} {showingFrom}-{showingTo} {t('of', 'of')} {totalCount}
      </span>
      <div className="ui-dt-pager">
        <span className="ui-dt-rpp-label">{t('Rows_per_page', 'Rows per page:')}</span>
        <select
          className="ui-dt-rpp"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPage(Number(e.target.value))}
          aria-label={t('Rows_per_page', 'Rows per page:')}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ui-dt-page-nav"
          disabled={safePage <= 0}
          onClick={() => onGoToPage(safePage - 1)}
          aria-label={t('Previous', 'Previous')}
        >
          ‹
        </button>
        {pageNumbers(safePage, pageCount).map((item, i) =>
          item === '…' ? (
            <span key={`e-${i}`} className="ui-dt-page-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`ui-dt-page-num${item === safePage ? ' is-active' : ''}`}
              onClick={() => onGoToPage(item)}
            >
              {item + 1}
            </button>
          ),
        )}
        <button
          type="button"
          className="ui-dt-page-nav"
          disabled={safePage >= pageCount - 1}
          onClick={() => onGoToPage(safePage + 1)}
          aria-label={t('Next', 'Next')}
        >
          ›
        </button>
      </div>
    </div>
  )
}

function UIDataTable({
  columns = [],
  rows,
  data,
  rowKey = 'id',
  title,
  titleDatatableText,
  subtitle,
  subTitleDatatableText,
  showSearchBox = true,
  searchPlaceholder,
  pageSize: pageSizeProp = 10,
  rowActions,
  onView,
  onModify,
  onDelete,
  onExecute,
  onRenew,
  onInlineEdit,
  actionsRender,
  filterableColumns,
  columnFilterOptions,
  multiSelect = false,
  onMultiSelectChange,
  onRowSelect,
  onCheckBoxRowSelected,
  onMultiCheckBoxRowSelected,
  serverSide = false,
  isServerSidePagination = false,
  serverPage,
  serverCurrentPage,
  serverRowsPerPage,
  serverTotalCount,
  serverTotalPages,
  serverShowingFrom,
  serverShowingTo,
  onPaginationChange,
  onPaginationChanged,
  controller,
  actionColumnName,
  emptyLabel,
}) {
  const tableRows = rows ?? data ?? []
  const headerTitle = title ?? titleDatatableText
  const headerSubtitle = subtitle ?? subTitleDatatableText
  const serverMode = serverSide || isServerSidePagination
  const onPageChange = onPaginationChange || onPaginationChanged

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pageSizeProp || 10)
  const [sortKey, setSortKey] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [columnSelections, setColumnSelections] = useState({})
  const [filterOpenKey, setFilterOpenKey] = useState(null)
  const [selectedKeys, setSelectedKeys] = useState(() => new Set())
  const filterAnchors = useRef({})

  useEffect(() => {
    if (serverMode && serverRowsPerPage != null) {
      setRowsPerPage(serverRowsPerPage)
    }
  }, [serverMode, serverRowsPerPage])

  useEffect(() => {
    if (serverMode && (serverCurrentPage != null || serverPage != null)) {
      const p = (serverCurrentPage ?? serverPage) - 1
      if (p >= 0) setPage(p)
    }
  }, [serverMode, serverCurrentPage, serverPage])

  useEffect(() => {
    if (!controller || typeof controller._bind !== 'function') return undefined
    controller._bind({
      resetPagination: () => setPage(0),
      clearSearch: () => {
        setSearch('')
        setPage(0)
      },
      clearFilters: () => {
        setColumnSelections({})
        setFilterOpenKey(null)
        setPage(0)
      },
      clearSorting: () => {
        setSortKey(null)
        setSortAsc(true)
      },
      clearSelections: () => {
        setSelectedKeys(new Set())
        onMultiSelectChange?.(new Set())
        onMultiCheckBoxRowSelected?.(new Set())
      },
      clearGroups: () => {},
    })
    return () => controller._bind({})
  }, [controller, onMultiSelectChange, onMultiCheckBoxRowSelected])

  const filterableSet = useMemo(() => {
    // Flutter: filterableColumns == null → all columns filterable
    if (filterableColumns == null) return null
    return new Set(
      Array.isArray(filterableColumns)
        ? filterableColumns
        : Array.from(filterableColumns),
    )
  }, [filterableColumns])

  function isColumnFilterable(key) {
    if (filterableSet == null) return true
    return filterableSet.has(key)
  }

  function isColumnFiltered(key) {
    const sel = columnSelections[key]
    return Boolean(sel && sel.size > 0 && !sel.has('ALL'))
  }

  const processed = useMemo(() => {
    if (serverMode) return tableRows
    const filtered = filterRows(tableRows, columns, search, columnSelections)
    return sortRows(filtered, sortKey, sortAsc)
  }, [serverMode, tableRows, columns, search, columnSelections, sortKey, sortAsc])

  const totalCount = serverMode
    ? Number(serverTotalCount ?? tableRows.length)
    : processed.length

  const pageCount = serverMode
    ? Math.max(
        1,
        Number((serverTotalPages ?? Math.ceil(totalCount / rowsPerPage)) || 1),
      )
    : Math.max(1, Math.ceil(processed.length / rowsPerPage) || 1)

  const safePage = Math.min(page, pageCount - 1)

  const pageRows = useMemo(() => {
    if (serverMode) return tableRows
    const start = safePage * rowsPerPage
    return processed.slice(start, start + rowsPerPage)
  }, [serverMode, tableRows, processed, safePage, rowsPerPage])

  const showingFrom =
    serverShowingFrom != null
      ? serverShowingFrom
      : totalCount === 0
        ? 0
        : safePage * rowsPerPage + 1
  const showingTo =
    serverShowingTo != null
      ? serverShowingTo
      : Math.min((safePage + 1) * rowsPerPage, totalCount)

  function emitPagination(nextPage, nextSize) {
    onPageChange?.(nextPage + 1, nextSize)
  }

  function goToPage(next) {
    const clamped = Math.max(0, Math.min(next, pageCount - 1))
    setPage(clamped)
    if (serverMode) emitPagination(clamped, rowsPerPage)
  }

  function changeRowsPerPage(value) {
    setRowsPerPage(value)
    setPage(0)
    if (serverMode) emitPagination(0, value)
  }

  function toggleSort(key) {
    if (sortKey === key) {
      setSortAsc((v) => !v)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  function getRowId(row, index) {
    const id = row?.[rowKey]
    return id != null ? String(id) : `row-${index}`
  }

  function toggleSelectAll(checked) {
    if (!checked) {
      setSelectedKeys(new Set())
      onMultiSelectChange?.(new Set())
      onMultiCheckBoxRowSelected?.(new Set())
      return
    }
    const next = new Set(pageRows.map((row, i) => getRowId(row, i)))
    setSelectedKeys(next)
    const selectedRows = pageRows.filter((row, i) => next.has(getRowId(row, i)))
    onMultiSelectChange?.(next)
    onMultiCheckBoxRowSelected?.(new Set(selectedRows))
  }

  function toggleSelectRow(row, index, checked) {
    const id = getRowId(row, index)
    const next = new Set(selectedKeys)
    if (checked) next.add(id)
    else next.delete(id)
    setSelectedKeys(next)
    onRowSelect?.(row)
    onCheckBoxRowSelected?.(checked ? row : null)
    const selectedRows = pageRows.filter((r, i) => next.has(getRowId(r, i)))
    onMultiSelectChange?.(next)
    onMultiCheckBoxRowSelected?.(new Set(selectedRows))
  }

  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row, i) => selectedKeys.has(getRowId(row, i)))

  const hasBuiltInActions =
    rowHasAction(rowActions, RowActionType.view) ||
    rowHasAction(rowActions, RowActionType.modify) ||
    rowHasAction(rowActions, RowActionType.delete) ||
    rowHasAction(rowActions, RowActionType.execute) ||
    rowHasAction(rowActions, RowActionType.renew) ||
    rowHasAction(rowActions, RowActionType.inlineEdit)

  const showActions = Boolean(actionsRender || hasBuiltInActions)
  const colSpan =
    columns.length + (showActions ? 1 : 0) + (multiSelect ? 1 : 0)

  function renderActions(row) {
    if (actionsRender) return actionsRender(row)
    return (
      <div className="ui-dt-actions">
        {rowHasAction(rowActions, RowActionType.view) ? (
          <HoverActionIcon
            tooltip={getRowAction(rowActions, RowActionType.view)?.hoverMessage || t('View', 'View')}
            onClick={() => onView?.(row)}
          >
            <IconEye />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.modify) ? (
          <HoverActionIcon
            tooltip={
              getRowAction(rowActions, RowActionType.modify)?.hoverMessage || t('Edit', 'Edit')
            }
            onClick={() => onModify?.(row)}
          >
            <IconEdit />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.inlineEdit) ? (
          <HoverActionIcon
            tooltip={t('Inline_Edit', 'Inline Edit')}
            onClick={() => onInlineEdit?.(row)}
          >
            <IconEdit />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.execute) ? (
          <HoverActionIcon tooltip={t('Execute', 'Execute')} onClick={() => onExecute?.(row)}>
            <IconEye />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.renew) ? (
          <HoverActionIcon tooltip={t('Renew', 'Renew')} onClick={() => onRenew?.(row)}>
            <IconEdit />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.delete) ? (
          <HoverActionIcon
            danger
            tooltip={
              getRowAction(rowActions, RowActionType.delete)?.hoverMessage || t('Delete', 'Delete')
            }
            onClick={() => onDelete?.(row)}
          >
            <IconDelete />
          </HoverActionIcon>
        ) : null}
      </div>
    )
  }

  function renderCell(col, row) {
    if (typeof col.render === 'function') return col.render(row)
    if (col.statusChip) {
      return <StatusChip status={row[col.key]} />
    }
    const value = row[col.key]
    if (value == null) return ''
    return String(value)
  }

  const pagerProps = {
    showingFrom,
    showingTo,
    totalCount,
    rowsPerPage,
    safePage,
    pageCount,
    onRowsPerPage: changeRowsPerPage,
    onGoToPage: goToPage,
  }

  return (
    <div className="ui-data-table">
      {(headerTitle || headerSubtitle || showSearchBox) && (
        <div className="ui-dt-top">
          <div className="ui-dt-titles">
            {headerTitle ? (
              <UIText as="h3" variant="h16SemiBold" className="ui-dt-title">
                {headerTitle}
              </UIText>
            ) : null}
            {headerSubtitle ? (
              <UIText variant="b13Regular" className="ui-dt-subtitle">
                {headerSubtitle}
              </UIText>
            ) : null}
          </div>
          {showSearchBox ? (
            <div className="ui-dt-toolbar">
              <input
                className="ui-dt-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(0)
                }}
                placeholder={searchPlaceholder || t('Search', 'Search')}
              />
            </div>
          ) : null}
        </div>
      )}

      <PaginationBar {...pagerProps} />

      <div className="ui-dt-scroll">
        <table>
          <thead>
            <tr>
              {multiSelect ? (
                <th className="ui-dt-check-col">
                  <UICheckBox
                    checked={allPageSelected}
                    onChange={(checked) => toggleSelectAll(Boolean(checked))}
                  />
                </th>
              ) : null}
              {columns.map((col) => {
                const filterable = isColumnFilterable(col.key)
                const filtered = isColumnFiltered(col.key)
                const options =
                  columnFilterOptions?.[col.key] ||
                  uniqueColumnValues(tableRows, col.key)
                return (
                  <th key={col.key}>
                    <div className="ui-dt-th-inner">
                      <button
                        type="button"
                        className="ui-dt-th-sort"
                        onClick={() => toggleSort(col.key)}
                      >
                        <span>{col.label}</span>
                        <SortIndicator active={sortKey === col.key} ascending={sortAsc} />
                      </button>
                      {filterable ? (
                        <div
                          className="ui-dt-filter-wrap"
                          ref={(el) => {
                            filterAnchors.current[col.key] = el
                          }}
                        >
                          <button
                            type="button"
                            className={`ui-dt-filter-btn${filtered ? ' is-filtered' : ''}`}
                            aria-label={`Filter ${col.label}`}
                            onClick={() =>
                              setFilterOpenKey((k) => (k === col.key ? null : col.key))
                            }
                          >
                            <FilterFunnelIcon filled={filtered} />
                          </button>
                          <FilterDropdown
                            column={col.key}
                            columnLabel={col.label}
                            options={options}
                            selections={columnSelections[col.key]}
                            open={filterOpenKey === col.key}
                            onClose={() => setFilterOpenKey(null)}
                            anchorRef={{ current: filterAnchors.current[col.key] }}
                            onChange={(key, next) => {
                              setColumnSelections((prev) => ({ ...prev, [key]: next }))
                              setPage(0)
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </th>
                )
              })}
              {showActions ? (
                <th>{actionColumnName || t('Actions', 'Actions')}</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <UIText variant="b14Regular" className="ui-dt-empty">
                    {emptyLabel || t('No_Records', 'No records found')}
                  </UIText>
                </td>
              </tr>
            ) : (
              pageRows.map((row, index) => {
                const id = getRowId(row, index)
                return (
                  <tr key={id}>
                    {multiSelect ? (
                      <td className="ui-dt-check-col">
                        <UICheckBox
                          checked={selectedKeys.has(id)}
                          onChange={(checked) => toggleSelectRow(row, index, Boolean(checked))}
                        />
                      </td>
                    ) : null}
                    {columns.map((col) => (
                      <td key={col.key}>{renderCell(col, row)}</td>
                    ))}
                    {showActions ? (
                      <td className="ui-dt-actions-cell">{renderActions(row)}</td>
                    ) : null}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar {...pagerProps} />
    </div>
  )
}

export default UIDataTable
