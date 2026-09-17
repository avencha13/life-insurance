/**
 * Runtime API bases — default to Vite proxy paths (dev).
 * Flutter sources: dataurl / baseUrl in lib/network/url/base_url.dart
 */
export const env = {
  dataApiBase: (import.meta.env.VITE_DATA_API || '/data-api').replace(/\/$/, ''),
  boApiBase: (import.meta.env.VITE_BO_API || '/bo-api').replace(/\/$/, ''),
  wfcApiBase: (import.meta.env.VITE_WFC_API || '/wfc-api').replace(/\/$/, ''),
  channelName: 'Internet Banking',
  appId: 'BO',
  domainId: 'BO',
  categoryName: 'Login',
}


export default env
