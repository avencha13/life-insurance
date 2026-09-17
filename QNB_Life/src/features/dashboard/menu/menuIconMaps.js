/** Flutter bo_svg paths under public/assets/svg/bo_svg */
const BO = '/assets/svg/bo_svg'

export const boSvg = {
  dashboard: `${BO}/dashboard.svg`,
  settings: `${BO}/settings.svg`,
  users: `${BO}/users.svg`,
  layers: `${BO}/layers.svg`,
  wrench: `${BO}/wrench.svg`,
  refreshCw: `${BO}/refresh-cw.svg`,
  fileText: `${BO}/file-text.svg`,
  headphones: `${BO}/headphones.svg`,
  userPlus: `${BO}/user-plus.svg`,
  workflow: `${BO}/workflow.svg`,
  bell: `${BO}/bell.svg`,
  product: `${BO}/product.svg`,
  shield: `${BO}/shield.svg`,
  helpCircle: `${BO}/help-circle.svg`,
  globe: `${BO}/globe.svg`,
  tag: `${BO}/tag.svg`,
  mapPin: `${BO}/map-pin.svg`,
  monitor: `${BO}/monitor.svg`,
  image: `${BO}/image.svg`,
  keyRound: `${BO}/key-round.svg`,
  fingerprint: `${BO}/fingerprint.svg`,
  database: `${BO}/database.svg`,
  package: `${BO}/package.svg`,
  logOut: `${BO}/log-out.svg`,
  chevronRight: `${BO}/chevron-right.svg`,
  chevronLeft: `${BO}/chevron-left.svg`,
  chevronDown: `${BO}/chevron-down.svg`,
  // Flutter: ready_to_sync_table.svg — file absent in qnb-insurance-ui/assets; layers fallback
  readyToSync: `${BO}/layers.svg`,
  readyToSyncFlutterPath: `${BO}/ready_to_sync_table.svg`,
}

/**
 * Product-level icons — Flutter dashboard_page.dart getMenuIconSvg
 * + aliases for live API productCode / productDesc variants.
 */
export const productIconByCode = {
  dashboard: boSvg.dashboard,
  DASHBOARD: boSvg.dashboard,

  // Flutter exact productCode map
  CONFIGURATION_PARAMETER: boSvg.settings,
  MASTER: boSvg.users,
  LOCATOR_MANAGEMENT: boSvg.layers,
  LIMIT_SETUP: boSvg.wrench,
  OFFER_DISCOUNT_MANAGEMENT: boSvg.refreshCw,
  CONTENT_MANAGEMENT_CONFIG: boSvg.fileText,
  CUSTOMER_SERVICE_CONFIG: boSvg.headphones,
  USER_MANAGEMENT_CONFIG: boSvg.userPlus,
  WORKFLOW_CONFIG: boSvg.workflow,
  WORFLOW_CONFIG: boSvg.workflow,
  NOTIFICATIONS_MANAGEMENT_CONFIG: boSvg.bell,
  PRODUCT_MANAGEMENT: boSvg.product,
  MFA_MANAGEMENT: boSvg.shield,
  MFA_Management: boSvg.shield,

  // Live / category-mapping aliases
  SETTINGS: boSvg.settings,
  SCREEN_CONFIGURATION: boSvg.settings,
  SCREEN_CONFIG: boSvg.settings,
  OTP_BIO_CONFIGURATION: boSvg.keyRound,
  OTP_BIO_CONFIG: boSvg.keyRound,
  LICENSE_CONFIG: boSvg.shield,
  LICENSE_MANAGEMENT: boSvg.shield,
  LICENSE: boSvg.shield,
  BANK_MANAGEMENT: boSvg.users,
  PARTNER_ONBOARDING_CONFIG: boSvg.userPlus,
  CUSTOMER_SUPPORT: boSvg.headphones,
  RETAIL_PRODUCT_MANAGEMENT: boSvg.product,
  OFFER_AND_DISCOUNT_MANAGEMENT: boSvg.refreshCw,
  'OFFER AND DISCOUNT MANAGEMENT': boSvg.refreshCw,
  'Offer and Discount Management': boSvg.refreshCw,
}

/** productDesc (lowercased) → icon — mirrors Flutter visible labels */
export const productIconByDesc = {
  dashboard: boSvg.dashboard,
  settings: boSvg.settings,
  'screen configuration': boSvg.settings,
  locators: boSvg.layers,
  'locator management': boSvg.layers,
  'offer and discount management': boSvg.refreshCw,
  master: boSvg.users,
  'workflow configuration': boSvg.workflow,
  'otp and bio configuration': boSvg.keyRound,
  'limit setup': boSvg.wrench,
  'license management': boSvg.shield,
  'mfa management': boSvg.shield,
  'retail product management': boSvg.product,
  'product management': boSvg.product,
  'user management': boSvg.userPlus,
  'user management config': boSvg.userPlus,
  cms: boSvg.fileText,
  'content management': boSvg.fileText,
  'customer support': boSvg.headphones,
  'customer service': boSvg.headphones,
  'partner onboarding': boSvg.userPlus,
  notifications: boSvg.bell,
}

export const subProductIconByCode = {
  UNIT_CONFIG: boSvg.globe,
  CURRENCY_CONFIG: boSvg.tag,
  BRANCH_CONFIG: boSvg.mapPin,
  PRODUCT_CONFIG: boSvg.product,
  SUB_PRODUCT_CONFIG: boSvg.layers,
  PRODUCT_AND_SUB_PRODUCT_MAPPING_CONFIG: boSvg.readyToSync,
  FUNCTIONS_CONFIG: boSvg.readyToSync,
  CHANNEL_CONFIG: boSvg.monitor,
  CHANNEL_MANAGEMENT: boSvg.monitor,
  COUNTRY_CONFIG: boSvg.globe,
  LANGUAGE_CONFIG: boSvg.globe,
  BO_USERS_CONFIG: boSvg.users,
  USER_MANAGEMENT: boSvg.users,
  GROUP_MANAGEMENT: boSvg.users,
  ROLE_MANAGEMENT: boSvg.users,
  RULE_MANAGEMENT: boSvg.users,
  TEAM_MANAGEMENT: boSvg.users,
  DOMAIN_MANAGEMENT: boSvg.workflow,
  PRODUCT_MANAGEMENT: boSvg.product,
  SUB_PRODUCT_MANAGEMENT: boSvg.layers,
  ACCESS_MANAGEMENT: boSvg.shield,
  WORKFLOW_CONFIG: boSvg.workflow,
  WORKFLOW_CONFIGURATION: boSvg.workflow,
  MENU_MANAGEMENT: boSvg.settings,
  MENU_ENTITLEMENT: boSvg.settings,
  SCREEN_CONFIG: boSvg.settings,
  CONFIGURATION_PARAMETER: boSvg.settings,
  I18N_MANAGEMENT: boSvg.globe,
  TERM_CONDITION: boSvg.fileText,
  BANNER_CONFIG: boSvg.image,
  NOTIFICATIONS_MANAGEMENT_CONFIG: boSvg.bell,
  NOTIFICATIONS_MANAGEMENT: boSvg.bell,
  PUSH_NOTIFICATION: boSvg.bell,
  PUSH_SUB: boSvg.bell,
  PUSH_CUST_SEG: boSvg.bell,
  MESSAGES: boSvg.bell,
  CAMP_MSG: boSvg.bell,
  CUSTOMER_SEGMENT: boSvg.users,
  CUST_SEG: boSvg.users,
  OTP_BIO_CONFIG: boSvg.keyRound,
  OTP_CONFIG: boSvg.keyRound,
  BIO_CONFIG: boSvg.fingerprint,
  OTP_AND_BIO_CONFIG: boSvg.keyRound,
  CONTENT_MANAGEMENT: boSvg.fileText,
  CONTENT_CONFIG: boSvg.fileText,
  LOCATOR_MANAGEMENT: boSvg.mapPin,
  LOCATORS: boSvg.mapPin,
  KIOSK_LOCATOR: boSvg.mapPin,
  MASTER_DATA: boSvg.database,
  MASTER_DATA_MANAGEMENT: boSvg.database,
  COUNTRY_MAINT: boSvg.globe,
  COUNTRY_AND_CRY_MAINT: boSvg.tag,
  TABLE_MIG: boSvg.database,
  TABLE_MIG_LIST: boSvg.database,
  OFFER_DISCOUNT: boSvg.package,
  OFFERS_DISCOUNTS: boSvg.package,
  OFFER_DISCOUNT_MANAGEMENT: boSvg.package,
  MFA_MANAGEMENT: boSvg.shield,
  MFA_CONFIG: boSvg.shield,
  CUSTOMER_SERVICE: boSvg.headphones,
  CUSTOMER_SUPPORT: boSvg.headphones,
  PARTNER_ONBOARDING: boSvg.userPlus,
  PARTNER_CONFIG: boSvg.userPlus,
  PROPERTIES_SETTINGS: boSvg.readyToSync,
  PROPERTIES_CONFIG: boSvg.readyToSync,
  BLOCK_USER: boSvg.shield,
  UNBLOCK_USER: boSvg.shield,
  SUBMENU_MANAGEMENT: boSvg.layers,
  CITY_CONFIG: boSvg.mapPin,
  TRANSFER_LIMIT: boSvg.wrench,
  LICENSE: boSvg.shield,
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase()
}

function lookupMap(map, raw) {
  if (raw == null || raw === '') return null
  const asIs = map[raw]
  if (asIs) return asIs
  const upper = map[String(raw).toUpperCase()]
  if (upper) return upper
  const normalized = map[normalizeKey(raw)]
  if (normalized) return normalized
  return null
}

export function resolveProductIcon(productCode, productDesc = '') {
  if (String(productCode).toLowerCase() === 'dashboard') return boSvg.dashboard

  const byCode = lookupMap(productIconByCode, productCode)
  if (byCode) return byCode

  const descKey = String(productDesc || '')
    .trim()
    .toLowerCase()
  if (descKey && productIconByDesc[descKey]) return productIconByDesc[descKey]

  // Partial desc match (truncated labels)
  if (descKey) {
    const hit = Object.entries(productIconByDesc).find(
      ([key]) => descKey.startsWith(key) || key.startsWith(descKey),
    )
    if (hit) return hit[1]
  }

  return boSvg.helpCircle
}

export function resolveSubProductIcon(subProductCode, subProductDesc = '') {
  const byCode = lookupMap(subProductIconByCode, subProductCode)
  if (byCode) return byCode

  const descKey = String(subProductDesc || '')
    .trim()
    .toLowerCase()
  if (descKey.includes('configuration parameter')) return boSvg.settings
  if (descKey.includes('otp')) return boSvg.keyRound
  if (descKey.includes('bio') || descKey.includes('fingerprint')) return boSvg.fingerprint
  if (descKey.includes('city')) return boSvg.mapPin
  if (descKey.includes('country')) return boSvg.globe
  if (descKey.includes('currency')) return boSvg.tag
  if (descKey.includes('channel')) return boSvg.monitor
  if (descKey.includes('unit')) return boSvg.globe

  return boSvg.helpCircle
}

export default {
  boSvg,
  productIconByCode,
  productIconByDesc,
  subProductIconByCode,
  resolveProductIcon,
  resolveSubProductIcon,
}
