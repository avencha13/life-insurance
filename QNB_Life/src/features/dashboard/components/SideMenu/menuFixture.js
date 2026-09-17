/**
 * Offline fallback when WFC menu API fails.
 * Uses Flutter productCodes so category grouping + bo_svg icons match.
 */
export const menuProducts = [
  {
    productCode: 'dashboard',
    productDesc: 'Dashboard',
    subProducts: [],
  },
  {
    productCode: 'SETTINGS',
    productDesc: 'Settings',
    subProducts: [
      {
        subProductCode: 'CONFIGURATION_PARAMETER',
        subProductDesc: 'Configuration Parameter',
        subProductUrl: '/dashboard/coming_soon',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'LOCATOR_MANAGEMENT',
    productDesc: 'Locators',
    subProducts: [
      {
        subProductCode: 'LOCATORS',
        subProductDesc: 'ATM / Branch Locator',
        subProductUrl: '/dashboard/atm_locator',
        childMenus: [],
      },
      {
        subProductCode: 'KIOSK_LOCATOR',
        subProductDesc: 'Kiosk Locator',
        subProductUrl: '/dashboard/kiosk_locator',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'OFFER_DISCOUNT_MANAGEMENT',
    productDesc: 'Offer and Discount Management',
    subProducts: [
      {
        subProductCode: 'OFFER_DISCOUNT',
        subProductDesc: 'Offer Management',
        subProductUrl: '/dashboard/offer_management',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'MASTER',
    productDesc: 'Master',
    subProducts: [
      {
        subProductCode: 'CITY_CONFIG',
        subProductDesc: 'City',
        subProductUrl: '/dashboard/city',
        childMenus: [],
      },
      {
        subProductCode: 'COUNTRY_CONFIG',
        subProductDesc: 'Country',
        subProductUrl: '/dashboard/country_nav',
        childMenus: [],
      },
      {
        subProductCode: 'CURRENCY_CONFIG',
        subProductDesc: 'Currency',
        subProductUrl: '/dashboard/currency_nav',
        childMenus: [],
      },
      {
        subProductCode: 'CHANNEL_CONFIG',
        subProductDesc: 'Channel',
        subProductUrl: '/dashboard/channel_nav',
        childMenus: [],
      },
      {
        subProductCode: 'UNIT_CONFIG',
        subProductDesc: 'Unit',
        subProductUrl: '/dashboard/unit_nav',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'WORFLOW_CONFIG',
    productDesc: 'Workflow Configuration',
    subProducts: [
      {
        subProductCode: 'WORKFLOW_CONFIGURATION',
        subProductDesc: 'Workflow',
        subProductUrl: '/dashboard/coming_soon',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'OTP_BIO_CONFIGURATION',
    productDesc: 'OTP and BIO Configuration',
    subProducts: [
      {
        subProductCode: 'OTP_CONFIG',
        subProductDesc: 'OTP Config',
        subProductUrl: '/dashboard/otp_config',
        childMenus: [],
      },
      {
        subProductCode: 'BIO_CONFIG',
        subProductDesc: 'Fingerprint',
        subProductUrl: '/dashboard/fingerprint_management',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'CONFIGURATION_PARAMETER',
    productDesc: 'Screen Configuration',
    subProducts: [
      {
        subProductCode: 'I18N_MANAGEMENT',
        subProductDesc: 'i18n Management',
        subProductUrl: '/dashboard/i18n-management',
        childMenus: [],
      },
      {
        subProductCode: 'BANNER_CONFIG',
        subProductDesc: 'Banner Configuration',
        subProductUrl: '/dashboard/banner-configuration',
        childMenus: [],
      },
      {
        subProductCode: 'TERM_CONDITION',
        subProductDesc: 'Terms & Conditions',
        subProductUrl: '/dashboard/term-condition',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'LIMIT_SETUP',
    productDesc: 'Limit Setup',
    subProducts: [
      {
        subProductCode: 'TRANSFER_LIMIT',
        subProductDesc: 'Transfer Limit',
        subProductUrl: '/dashboard/transfer_limit',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'LICENSE_CONFIG',
    productDesc: 'License Management',
    subProducts: [
      {
        subProductCode: 'LICENSE',
        subProductDesc: 'License',
        subProductUrl: '/dashboard/coming_soon',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'MFA_Management',
    productDesc: 'MFA Management',
    subProducts: [
      {
        subProductCode: 'MFA_CONFIG',
        subProductDesc: 'MFA Config',
        subProductUrl: '/dashboard/mfa_management',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'PRODUCT_MANAGEMENT',
    productDesc: 'Retail Product Management',
    subProducts: [
      {
        subProductCode: 'PRODUCT_CONFIG',
        subProductDesc: 'Products',
        subProductUrl: '/dashboard/retail_product',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'USER_MANAGEMENT_CONFIG',
    productDesc: 'User Management',
    subProducts: [
      {
        subProductCode: 'USER_MANAGEMENT',
        subProductDesc: 'Users',
        subProductUrl: '/dashboard/user_creation',
        childMenus: [],
      },
      {
        subProductCode: 'GROUP_MANAGEMENT',
        subProductDesc: 'Groups',
        subProductUrl: '/dashboard/group_management',
        childMenus: [],
      },
      {
        subProductCode: 'ROLE_MANAGEMENT',
        subProductDesc: 'Roles',
        subProductUrl: '/dashboard/role_management',
        childMenus: [],
      },
    ],
  },
  {
    productCode: 'CONTENT_MANAGEMENT_CONFIG',
    productDesc: 'CMS',
    subProducts: [
      {
        subProductCode: 'CONTENT_MANAGEMENT',
        subProductDesc: 'Content',
        subProductUrl: '/dashboard/coming_soon',
        childMenus: [],
      },
    ],
  },
]

export default menuProducts
