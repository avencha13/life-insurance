import { useMemo, useRef } from 'react'

/**
 * Flutter DataTableController parity — imperative helpers bound to UIDataTable.
 * Pass the returned object as `controller` prop.
 */
export function useDataTableController() {
  const apiRef = useRef({})

  return useMemo(
    () => ({
      _bind(api) {
        apiRef.current = api || {}
      },
      resetPagination() {
        apiRef.current.resetPagination?.()
      },
      clearSearch() {
        apiRef.current.clearSearch?.()
      },
      clearFilters() {
        apiRef.current.clearFilters?.()
      },
      clearSorting() {
        apiRef.current.clearSorting?.()
      },
      clearSelections() {
        apiRef.current.clearSelections?.()
      },
      clearGroups() {
        apiRef.current.clearGroups?.()
      },
    }),
    [],
  )
}

export default useDataTableController
