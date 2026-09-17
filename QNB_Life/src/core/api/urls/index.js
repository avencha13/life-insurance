import { loginUrls } from './loginUrls'
import { menuUrls } from './menuUrls'
import { dashboardUrls } from './dashboardUrls'

/** URL registry — paths only; hosts live in env / Vite proxy. */
export const urls = {
  login: loginUrls.login,
  getRp: loginUrls.getRp,
  mfaValidate: loginUrls.mfaValidation,
  otpValidate: loginUrls.otpVerification,
  logout: 'auth-server/logout',
  menu: menuUrls.access,
  menuAccess: menuUrls.access,
  dashboard: dashboardUrls,
  city: {
    fetchAll: 'master/city/fetchAll',
    create: 'master/city/create',
    update: 'master/city/update',
    delete: 'master/city/delete',
  },
}

export { loginUrls, menuUrls, dashboardUrls }
export default urls
