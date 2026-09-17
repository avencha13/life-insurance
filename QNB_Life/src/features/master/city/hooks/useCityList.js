import { useCallback, useEffect, useState } from 'react'
import { isApiSuccess } from '@/core/api/client'
import { deleteCity, fetchCities, saveCity } from '../services/cityService'

export function useCityList() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const softFetch = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchCities()
      if (!isApiSuccess(res)) throw new Error('Fetch failed')
      setRows(res.data)
    } catch (err) {
      setError(err.message || 'Fetch failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    softFetch()
  }, [softFetch])

  const upsert = useCallback(
    async (payload) => {
      const res = await saveCity(payload)
      if (!isApiSuccess(res)) throw new Error('Save failed')
      await softFetch()
    },
    [softFetch],
  )

  const remove = useCallback(
    async (id) => {
      const res = await deleteCity(id)
      if (!isApiSuccess(res)) throw new Error('Delete failed')
      await softFetch()
    },
    [softFetch],
  )

  return { rows, loading, error, softFetch, upsert, remove }
}

export default useCityList
