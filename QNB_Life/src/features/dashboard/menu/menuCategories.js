/**
 * Port of UiSliderMenu._categoryMapping — display order:
 * configuration → management → CMS → operation
 */
export const CATEGORY_ORDER = ['configuration', 'management', 'CMS', 'operation']

export const CATEGORY_LABELS = {
  configuration: 'CONFIGURATION',
  management: 'MANAGEMENT',
  CMS: 'CMS',
  operation: 'OPERATION',
}

/** productCode → category key (Flutter exact + common casing variants) */
export const categoryMapping = {
  operation: [
    'PARTNER_ONBOARDING_CONFIG',
    'CUSTOMER_SUPPORT',
    'NOTIFICATIONS_MANAGEMENT_CONFIG',
    'CUSTOMER_SERVICE_CONFIG',
  ],
  configuration: [
    'WORFLOW_CONFIG',
    'WORKFLOW_CONFIG',
    'OTP_BIO_CONFIGURATION',
    'CONFIGURATION_PARAMETER',
    'LOCATOR_MANAGEMENT',
    'MASTER',
    'Offer and Discount Management',
    'OFFER_DISCOUNT_MANAGEMENT',
    'LIMIT_SETUP',
    'SETTINGS',
  ],
  CMS: ['CONTENT_MANAGEMENT_CONFIG'],
  management: [
    'MFA_Management',
    'MFA_MANAGEMENT',
    'PRODUCT_MANAGEMENT',
    'USER_MANAGEMENT_CONFIG',
    'LICENSE_CONFIG',
    'BANK_MANAGEMENT',
  ],
}

export function getCategoryForProductCode(productCode, productDesc = '') {
  const normalized = String(productCode || '').trim()
  const desc = String(productDesc || '').trim()
  const candidates = [normalized, desc].filter(Boolean)

  for (const candidate of candidates) {
    for (const [category, codes] of Object.entries(categoryMapping)) {
      if (
        codes.some(
          (code) =>
            code.trim() === candidate ||
            code.trim().toUpperCase() === candidate.toUpperCase() ||
            code.trim().replace(/\s+/g, '_').toUpperCase() ===
              candidate.replace(/[\s-]+/g, '_').toUpperCase(),
        )
      ) {
        return category
      }
    }
  }

  // Desc heuristics when API codes differ
  const d = desc.toLowerCase()
  if (!d) return null
  if (
    d.includes('settings') ||
    d.includes('locator') ||
    d.includes('offer') ||
    d.includes('master') ||
    d.includes('workflow') ||
    d.includes('otp') ||
    d.includes('bio') ||
    d.includes('screen configuration') ||
    d.includes('limit setup')
  ) {
    return 'configuration'
  }
  if (
    d.includes('license') ||
    d.includes('mfa') ||
    d.includes('product') ||
    d.includes('user management') ||
    d.includes('bank')
  ) {
    return 'management'
  }
  if (d === 'cms' || d.includes('content management')) return 'CMS'
  if (
    d.includes('partner') ||
    d.includes('customer support') ||
    d.includes('notification') ||
    d.includes('customer service')
  ) {
    return 'operation'
  }
  return null
}

/**
 * Group products: uncategorized first (Dashboard), then CATEGORY_ORDER.
 * Preserves API order within each group (Flutter UiSliderMenu behavior).
 */
export function groupProductsByCategory(products = []) {
  const grouped = { null: [] }
  for (const key of Object.keys(categoryMapping)) {
    grouped[key] = []
  }

  for (const product of products) {
    const category = getCategoryForProductCode(
      product.productCode,
      product.productDesc,
    )
    if (category == null) grouped.null.push(product)
    else grouped[category].push(product)
  }

  const sections = []
  if (grouped.null.length) {
    sections.push({ key: null, label: null, products: grouped.null })
  }
  for (const key of CATEGORY_ORDER) {
    if (grouped[key]?.length) {
      sections.push({
        key,
        label: CATEGORY_LABELS[key] || key.toUpperCase(),
        products: grouped[key],
      })
    }
  }
  return sections
}


export default {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  categoryMapping,
  getCategoryForProductCode,
  groupProductsByCategory,
}
