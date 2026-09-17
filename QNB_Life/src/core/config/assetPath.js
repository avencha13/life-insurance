/** Asset paths — mirrors Flutter AssetPath (public/assets). */
const IMAGE = '/assets/images/'
const SVG = '/assets/svg/'
const GIF = '/assets/gif/'
const LOTTIE = '/assets/lottie/'

export const assetPath = {
  image: {
    webLogoImg: `${IMAGE}logo/web_logo_image.png`,
    mannaiOfficeHero: `${IMAGE}login/mannai_office_hero.png`,
    loginRightImg: `${IMAGE}login_right_img.png`,
    loginBg: `${IMAGE}Login.png`,
    moneySecure: `${IMAGE}money_secure_login_screen_image.png`,
    loggingOut: `${IMAGE}logging_out.png`,
    profileImg: `${IMAGE}profileImg.png`,
    banner: `${IMAGE}banner.jpg`,
    sideImg: `${IMAGE}side_img.png`,
    // Flutter AssetPath.image customizer (dashboard drawer)
    vertical: `${IMAGE}customizer/vertical.png`,
    horizontal: `${IMAGE}customizer/horizontal.png`,
    light: `${IMAGE}customizer/light.png`,
    dark: `${IMAGE}customizer/dark.png`,
    boxed: `${IMAGE}customizer/boxed.png`,
    full: `${IMAGE}customizer/full.png`,
    fluid: `${IMAGE}customizer/fluid.png`,
    compact: `${IMAGE}customizer/compact.png`,
    border: `${IMAGE}customizer/border.png`,
    borderless: `${IMAGE}customizer/borderless.png`,
    smallHover: `${IMAGE}customizer/small_hover.png`,
  },
  svg: {
    dukhanLogoTextBlack: `${SVG}dukhan_logotext_black.svg`,
    dukhanLogoMark: `${SVG}dukhan_logo_mark.svg`,
    dashboard: `${SVG}menus_svg/dashboard.svg`,
    masters: `${SVG}menus_svg/Masters.svg`,
    userManagement: `${SVG}menus_svg/User_Management.svg`,
    notifications: `${SVG}menus_svg/Notifications.svg`,
    workflow: `${SVG}menus_svg/Workflow.svg`,
    screenConfiguration: `${SVG}menus_svg/Screen_configuration.svg`,
    contentManagement: `${SVG}menus_svg/Content_Management.svg`,
    customerSupport: `${SVG}menus_svg/Customer_Support_Service.svg`,
    license: `${SVG}menus_svg/License_Management.svg`,
    mfa: `${SVG}menus_svg/MFA_Management.svg`,
    offerDiscount: `${SVG}menus_svg/Offer_Discount.svg`,
    partnerOnboarding: `${SVG}menus_svg/Partner_Onboarding.svg`,
    propertySettings: `${SVG}menus_svg/Property_Settings.svg`,
    locator: `${SVG}menus_svg/Locator_management.svg`,
    otpBio: `${SVG}menus_svg/OTP_BIO.svg`,
    logout: `${SVG}logout-outlined.svg`,
    refresh: `${SVG}refresh.svg`,
    tableEdit: `${SVG}table_edit.svg`,
    tableDelete: `${SVG}table_delete.svg`,
    upload: `${SVG}upload_icon.svg`,
    bo: {
      dashboard: `${SVG}bo_svg/dashboard.svg`,
      settings: `${SVG}bo_svg/settings.svg`,
      users: `${SVG}bo_svg/users.svg`,
      layers: `${SVG}bo_svg/layers.svg`,
      helpCircle: `${SVG}bo_svg/help-circle.svg`,
      logOut: `${SVG}bo_svg/log-out.svg`,
      chevronLeft: `${SVG}bo_svg/chevron-left.svg`,
      chevronRight: `${SVG}bo_svg/chevron-right.svg`,
      chevronDown: `${SVG}bo_svg/chevron-down.svg`,
    },
  },
  gif: { base: GIF },
  lottie: { base: LOTTIE },
}

export default assetPath
