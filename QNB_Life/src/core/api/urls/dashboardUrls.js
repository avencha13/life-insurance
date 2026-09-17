/**
 * Mirrors Flutter DashboardUrl + Row2 metric feature URLs.
 * Proxy map (vite.config.js — all on 8444 for session parity):
 *   base 'bo'   → /bo-api   → /backoffice-insurance
 *   base 'data' → /data-api → /backoffice-insurance  (Flutter dataurl was 8443)
 *   base 'wfc'  → /wfc-api  → /workflow-insurance   (menu + workflowCounts graphql)
 */
export const dashboardUrls = {
  uniqueLogins: 'login/unique-logins',
  liveUsersCount: 'login/count/hour-wise',
  topFiveTransactions: 'transfer/topFiveTransactions',
  topFailureTransactions: 'transfer/topFailureTransactions',
  transferViewCount: 'transfer/viewCount',
  txnMetrics: 'transfer/txnMetrics',
  onboardingCount: 'onboarding/onboarding-counts',
  loginAuditGraph: 'dashboard/graph',
  loginAuditRecentLogs: 'dashboard/recent-auditlogs',
  recentActivity: 'recent-activity/Activity-Log',
  /** KPI strip — Flutter dataurl; React proxies data-api to same 8444 as BO */
  faqGetAll: 'faq/getAll',
  productGetAll: 'cproduct/getAll',
  subProductGetAll: 'csubproduct/getAll',
  offerGetAll: 'offer/getAll',
  /** Flutter: baseUrlWFC + PendingApprovalUrls.subProductCount ('graphql') */
  graphql: 'graphql',
}

export default dashboardUrls
