/** i18n helper — mirrors Flutter getLocaleString(key, defaultValue). */
const catalog = {
  BACK_OFFICE: 'BACK OFFICE',
  Enterprise_Management: 'Enterprise Management',
  Welcome_back: 'Welcome back',
  Welcome_Back: 'Welcome back',
  Sign_in_to_continue: 'Sign in to your account to continue',
  User_Name: 'User Name',
  Username: 'Username',
  Enter_User_Name: 'Enter User Name',
  Password: 'Password',
  Enter_password: 'Enter password',
  Secure_Value: 'Secure Value',
  Sign_in: 'Sign in',
  Login: 'Login',
  Please_enter_user_name: 'Please enter user name',
  Please_enter_password: 'Please enter password',
  Login_hero_line1: 'Empowering\noperations.',
  Login_hero_line2: 'Enabling excellence.',
  Login_hero_desc:
    'Back Office is your secure and intelligent platform(RBX) to manage products, users, and operations with confidence and control.',
  Login_copyright_suffix: 'Mannai Corporation. All rights reserved.',
  Log_Out: 'Log Out',
  'Log_Out?': 'Log Out?',
  Are_You_sure_want_logout: 'Are you sure you want to logout?',
  Cancel: 'Cancel',
  Dashboard: 'Dashboard',
  Home: 'Home',
  Search: 'Search',
  Coming_Soon: 'Coming Soon',
  Coming_Soon_Message: 'This screen is stubbed for migration. Feature will be ported next.',
  Add_City: 'Add City',
  Edit_City: 'Edit City',
  View_City: 'View City',
  City: 'City',
  City_Code: 'City Code',
  City_Name: 'City Name',
  Country: 'Country',
  Status: 'Status',
  Active: 'Active',
  Inactive: 'Inactive',
  Actions: 'Actions',
  Save: 'Save',
  Close: 'Close',
  Delete: 'Delete',
  View: 'View',
  Edit: 'Edit',
  No_Records: 'No records found',
  Loading: 'Loading…',
  Session_Timed_Out: 'Your session has timed out',
  Session_Timed_Out_Message: 'Please log in again to continue.',
  Invalid_Credentials: 'Invalid username or password',
  Required_Field: 'This field is required',
  RP_Service_failed: 'RP Service failed',
  Login_request_failed: 'Login request failed',
  MFA_failed: 'MFA validation failed',
  OTP_failed: 'OTP verification failed',
  Enter_OTP: 'Enter OTP',
  OTP: 'OTP',
  INVALID_OTP: 'INVALID OTP',
}

export function t(key, defaultValue = '') {
  if (Object.prototype.hasOwnProperty.call(catalog, key)) {
    return catalog[key]
  }
  return defaultValue || key
}

export function setLocaleStrings(map) {
  Object.assign(catalog, map || {})
}

export default t
