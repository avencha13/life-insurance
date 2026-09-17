import { API_SUCCESS_CODE } from '@/core/api/client'
import { urls } from '@/core/api/urls'

const seed = [
  { id: '1', cityCode: 'DOH', cityName: 'Doha', country: 'Qatar', status: 'Y' },
  { id: '2', cityCode: 'ALU', cityName: 'Al Udeid', country: 'Qatar', status: 'Y' },
  { id: '3', cityCode: 'WKR', cityName: 'Al Wakrah', country: 'Qatar', status: 'N' },
  { id: '4', cityCode: 'KHO', cityName: 'Al Khor', country: 'Qatar', status: 'Y' },
]

let cities = [...seed]

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** SoftFetch-style list reload after mutations. */
export async function fetchCities() {
  await delay()
  // url registered for future wiring: urls.city.fetchAll
  void urls.city.fetchAll
  return {
    status: { code: API_SUCCESS_CODE },
    data: cities.map((c) => ({ ...c })),
  }
}

export async function saveCity(payload) {
  await delay()
  if (payload.id) {
    cities = cities.map((c) => (c.id === payload.id ? { ...c, ...payload } : c))
  } else {
    cities = [
      ...cities,
      {
        ...payload,
        id: String(Date.now()),
      },
    ]
  }
  return { status: { code: API_SUCCESS_CODE } }
}

export async function deleteCity(id) {
  await delay()
  cities = cities.filter((c) => c.id !== id)
  return { status: { code: API_SUCCESS_CODE } }
}

export default { fetchCities, saveCity, deleteCity }
