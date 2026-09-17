import { apiRequest, isApiSuccess } from '@/core/api/client'
import { dashboardUrls } from '@/core/api/urls/dashboardUrls'
import AuthService from '@/core/auth/AuthService'

function payloadData(data) {
  if (!data || typeof data !== 'object') return null
  if (data.data !== undefined) return data.data
  return data
}

function listFromPayload(data) {
  const inner = payloadData(data)
  if (!inner) return []
  if (Array.isArray(inner)) return inner
  if (Array.isArray(inner.content)) return inner.content
  if (Array.isArray(inner.result)) return inner.result
  if (Array.isArray(inner.list)) return inner.list
  if (Array.isArray(inner.items)) return inner.items
  if (Array.isArray(inner.records)) return inner.records
  if (Array.isArray(inner.topFiveTransactions)) return inner.topFiveTransactions
  if (Array.isArray(inner.transferInfo)) return inner.transferInfo
  // Nested { data: [...] } after unwrap
  if (inner.data && Array.isArray(inner.data)) return inner.data
  return []
}

function countFromListPayload(data) {
  if (!data || typeof data !== 'object') return 0
  if (data?.status?.code && data.status.code !== '000000' && !isApiSuccess(data)) {
    return 0
  }
  if (typeof data?.totalElements === 'number') return data.totalElements
  if (typeof data?.totalCount === 'number') return data.totalCount
  if (typeof data?.count === 'number') return data.count
  const inner = payloadData(data)
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    if (typeof inner.totalElements === 'number') return inner.totalElements
    if (typeof inner.totalCount === 'number') return inner.totalCount
    if (typeof inner.count === 'number') return inner.count
  }
  return listFromPayload(data).length
}

function dateRangeDays(days = 7) {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - (days - 1))
  const fmt = (d) => d.toISOString().slice(0, 10)
  return { fromDate: fmt(from), toDate: fmt(to), startDate: fmt(from), endDate: fmt(to) }
}

/** Row1 — User Count — Flutter GET login/unique-logins */
export async function fetchUniqueLogins() {
  const res = await apiRequest(dashboardUrls.uniqueLogins, { method: 'GET' })
  const ok = res.ok && isApiSuccess(res.data)
  const rows = ok ? listFromPayload(res.data) : []
  if (!rows.length) {
    return { ok: false, cards: [], raw: res.data }
  }
  const cards = []
  const tones = ['orange', 'blue', 'green', 'purple']
  rows.slice(0, 2).forEach((row, idx) => {
    const month = row.month ?? ''
    const mb = row.mobile_banking || row.mobileBanking || {}
    const ib = row.internet_banking || row.internetBanking || {}
    cards.push({
      label: 'Active Mobile Banking',
      month,
      value: mb.count ?? '',
      percentage: mb.percentage ?? '',
      increased: String(mb.isIncreased || 'N').toUpperCase() === 'Y',
      tone: tones[idx * 2],
      channel: 'mb',
    })
    cards.push({
      label: 'Active Internet Banking',
      month,
      value: ib.count ?? '',
      percentage: ib.percentage ?? '',
      increased: String(ib.isIncreased || 'N').toUpperCase() === 'Y',
      tone: tones[idx * 2 + 1],
      channel: 'ib',
    })
  })
  return { ok: true, cards, raw: res.data }
}

/** Row1 — Daily Active Users — POST login/count/hour-wise?channelId=ALL */
export async function fetchLiveUsers(channelId = 'ALL') {
  const path = `${dashboardUrls.liveUsersCount}?channelId=${encodeURIComponent(channelId)}`
  const res = await apiRequest(path, { method: 'POST', body: {} })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const ib = Array.isArray(data.IB) ? data.IB : []
  const mb = Array.isArray(data.MB) ? data.MB : []
  return {
    ok,
    ibPoints: ib.map((r, i) => ({ x: i, y: Number(r.count ?? 0), time: r.time })),
    mbPoints: mb.map((r, i) => ({ x: i, y: Number(r.count ?? 0), time: r.time })),
    totalCount: Number(data.totalCount ?? 0),
    percentage: Number(data.percentage ?? 0),
    raw: res.data,
  }
}

async function fetchCountOnData(path) {
  const res = await apiRequest(path, { base: 'data', method: 'POST', body: {} })
  if (!res.ok && !isApiSuccess(res.data)) return 0
  return countFromListPayload(res.data)
}

export async function fetchMetricsCounts() {
  const [faqs, products, subProducts, offers] = await Promise.allSettled([
    fetchCountOnData(dashboardUrls.faqGetAll),
    fetchCountOnData(dashboardUrls.productGetAll),
    fetchCountOnData(dashboardUrls.subProductGetAll),
    (async () => {
      const res = await apiRequest(dashboardUrls.offerGetAll, {
        base: 'data',
        method: 'POST',
        body: {},
      })
      if (!res.ok && !isApiSuccess(res.data)) return 0
      const list = listFromPayload(res.data)
      return list.filter((o) => {
        const status = String(o.offerStatus || o.status || '')
          .toUpperCase()
          .trim()
        return (
          status === 'ACTIVE' ||
          status === 'ACT' ||
          status === 'Y' ||
          status === 'YES' ||
          status === 'ENABLED' ||
          status === 'A'
        )
      }).length
    })(),
  ])
  // Flutter row2_metrics.dart hardcodes change badges (list APIs have no %)
  return {
    faqs: faqs.status === 'fulfilled' ? faqs.value : 0,
    products: products.status === 'fulfilled' ? products.value : 0,
    subProducts: subProducts.status === 'fulfilled' ? subProducts.value : 0,
    offers: offers.status === 'fulfilled' ? offers.value : 0,
    faqsDelta: '+12%',
    productsDelta: '+100%',
    subProductsDelta: '+15%',
    offersDelta: '+5%',
  }
}

function formatRelativeTime(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return String(dateString)
    const now = Date.now()
    const diffMs = now - date.getTime()
    const mins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMs / 3600000)
    const days = Math.floor(diffMs / 86400000)
    if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`
    if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    if (mins > 0) return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`
    return 'Just now'
  } catch {
    return String(dateString)
  }
}

/** Recent activity — POST recent-activity/Activity-Log + userId header */
export async function fetchRecentActivity() {
  const userId = AuthService.getUser()?.userId || ''
  const res = await apiRequest(dashboardUrls.recentActivity, {
    method: 'POST',
    body: {},
    headers: userId ? { userId } : {},
  })
  if (!res.ok) {
    return { ok: false, items: [] }
  }
  const list = listFromPayload(res.data)
  if (!list.length) {
    return { ok: true, items: [] }
  }
  return {
    ok: true,
    items: list.slice(0, 4).map((item) => {
      const kind = String(item.categoryCode || '').toLowerCase()
      const title = [item.categoryCode, item.resultStatus]
        .filter(Boolean)
        .join(' · ')
      return {
        title: title || String(item.message || item.description || ''),
        timeLabel: formatRelativeTime(item.reqDate) || item.reqDate || '',
        customerId: item.customerId || '',
        kind,
      }
    }),
  }
}


/**
 * Customer incidents — WFC graphql workflowCounts
 * Flutter posts GraphQL mutation; some gateways still return status/data envelope.
 */
export async function fetchPendingIncidentCounts() {
  try {
    const res = await apiRequest(dashboardUrls.graphql, {
      base: 'wfc',
      method: 'POST',
      body: {
        query:
          'mutation callGenericMutation($request: GenericApiRequest!) { callGenericMutation(request: $request) { status { code description } data } }',
        variables: {
          request: { serviceName: 'workflowCounts' },
        },
      },
    })
    let raw = payloadData(res.data) || {}
    // GraphQL nested shape
    const gqlData =
      res.data?.data?.callGenericMutation?.data ||
      res.data?.callGenericMutation?.data
    if (gqlData && typeof gqlData === 'object') raw = gqlData
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw)
      } catch {
        raw = {}
      }
    }
    return {
      pendingRequest: Number(raw.totalPendingRequestCount ?? 0),
      pendingApproval: Number(raw.totalPendingApprovalCount ?? 0),
      rejected: Number(raw.totalRejectedCount ?? raw.requestsRejects ?? 0),
    }
  } catch {
    return { pendingRequest: 0, pendingApproval: 0, rejected: 0 }
  }
}

/** Transaction distribution — POST transfer/topFiveTransactions?channelId=ALL */
export async function fetchTopTransactions(channelId = 'ALL') {
  const path = `${dashboardUrls.topFiveTransactions}?channelId=${encodeURIComponent(channelId)}`
  const body =
    channelId === 'ALL'
      ? { functionalId: 'BESTPERTXN' }
      : { functionalId: 'TOP5TXN' }
  const res = await apiRequest(path, { method: 'POST', body })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const list = Array.isArray(data.topFiveTransactions)
    ? data.topFiveTransactions
    : listFromPayload(res.data)
  return {
    ok,
    items: list.map((item) => ({
      label: item.transferDesc || item.transferType || item.name || '',
      value: item.count ?? item.txnCount ?? '',
    })),
  }
}

/** Service failure — POST transfer/topFailureTransactions */
export async function fetchTopFailures(channelId = 'ALL') {
  // Flutter row4 uses startDate 2024-12-18 through today
  const endDate = new Date().toISOString().slice(0, 10)
  const path = `${dashboardUrls.topFailureTransactions}?channelId=${encodeURIComponent(channelId)}`
  const res = await apiRequest(path, {
    method: 'POST',
    body: {
      unit: 'PRD',
      startDate: '2024-12-18',
      endDate,
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const block = data.serviceFailureAndLatency || data.serviceLatency || data
  const failures = Array.isArray(block.failedTransactionRate)
    ? block.failedTransactionRate
    : []
  const sliced = failures.slice(0, 5)
  return {
    ok,
    legend: block.legend || null,
    bars: sliced.map((f) => ({
      label: f.categoryDesc || f.categoryCode || '',
      info: Number.parseInt(String(f.info ?? 0), 10) || 0,
      warning: Number.parseInt(String(f.warning ?? 0), 10) || 0,
      error: Number.parseInt(String(f.error ?? 0), 10) || 0,
    })),
    items: sliced.map((f) => ({
      label: f.categoryDesc || f.categoryCode || '',
      value: f.failureCount ?? f.total ?? '',
      percentage:
        f.failurePercentage != null && f.failurePercentage !== ''
          ? String(f.failurePercentage)
          : null,
    })),
  }
}

/** Transfer view — GET transfer/viewCount */
export async function fetchTransferViewCount() {
  const res = await apiRequest(dashboardUrls.transferViewCount, { method: 'GET' })
  const ok = res.ok
  const data = payloadData(res.data) || {}
  const roles = Array.isArray(data.categoryCodes) ? data.categoryCodes : []
  const rows = []
  roles.forEach((role) => {
    ;(role.data || []).forEach((item) => {
      rows.push({
        role: role.role,
        label: item.categoryCodeDesc || item.categoryCode,
        success: item.categoryCodeData?.successCount ?? item.successCount,
        failure: item.categoryCodeData?.failureCount ?? item.failureCount,
      })
    })
  })
  return { ok, rows, raw: data }
}

/** Onboarding — GET onboarding/onboarding-counts */
export async function fetchOnboardingCounts() {
  const res = await apiRequest(dashboardUrls.onboardingCount, { method: 'GET' })
  const ok = res.ok && (isApiSuccess(res.data) || res.ok)
  const data = payloadData(res.data) || res.data || {}
  return {
    ok,
    registered: Number(data.registeredCount ?? 0),
    started: Number(data.startedCount ?? 0),
    broken: Number(data.brokenCount ?? 0),
    completed: Number(data.completedCount ?? 0),
  }
}

/** Txn analysis — POST transfer/txnMetrics */
export async function fetchTxnMetrics() {
  const range = dateRangeDays(7)
  const res = await apiRequest(dashboardUrls.txnMetrics, {
    method: 'POST',
    headers: { channel: 'MB', unit: 'PRD', 'Accept-Language': 'en' },
    body: {
      startDate: range.startDate,
      endDate: range.endDate,
      type: 'ALL',
      filter: { channels: ['MB', 'IB'], serviceTypes: [] },
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const analysis = data.transactionAnalysis || data
  const services = Array.isArray(analysis.services) ? analysis.services : []
  return {
    ok,
    total: Number(analysis.totalTransactions ?? 0),
    rows: services.map((s) => ({
      type: s.serviceType || '—',
      count: (s.successCount ?? 0) + (s.failureCount ?? 0),
      status: `${s.successRate || '0'}% ok / ${s.failureRate || '0'}% fail`,
      success: s.successCount,
      failure: s.failureCount,
    })),
  }
}

/** Login audit FO/BO */
export async function fetchLoginAuditGraph(category = 'FO') {
  const range = dateRangeDays(7)
  const res = await apiRequest(dashboardUrls.loginAuditGraph, {
    method: 'POST',
    headers: { 'Accept-Language': 'en' },
    body: {
      category,
      fromDate: range.fromDate,
      toDate: range.toDate,
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const summary = data.summary || {}
  const daily = Array.isArray(data.dailySeries) ? data.dailySeries : []
  return {
    ok,
    range,
    title: data.title || '',
    categories: data.categories || [],
    successRate: Number(summary.successRate ?? 0),
    totalAttempts: Number(summary.totalCount ?? 0),
    successCount: Number(summary.successCount ?? 0),
    failedCount: Number(summary.failureCount ?? 0),
    priorDelta: Number(summary.priorPeriodDeltaPts ?? 0),
    sparkline: Array.isArray(summary.sparklineValues) ? summary.sparklineValues : [],
    dailySeries: daily.map((p, i) => ({
      x: i,
      y: Number(p.successRate ?? p.value ?? 0),
      label: p.date || p.day || '',
    })),
    hourlySeries: Array.isArray(data.hourlySeries) ? data.hourlySeries : [],
    recentEntries: Array.isArray(data.recentEntries) ? data.recentEntries : [],
  }
}

export async function fetchLoginAuditLogs(category = 'FO', page = 0, size = 5) {
  const range = dateRangeDays(7)
  const res = await apiRequest(dashboardUrls.loginAuditRecentLogs, {
    method: 'POST',
    headers: { 'Accept-Language': 'en' },
    body: {
      category,
      fromDate: range.fromDate,
      toDate: range.toDate,
      page,
      size,
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data)
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.entries)
        ? data.entries
        : listFromPayload(res.data)
  return {
    ok,
    range,
    entries: list.map((row) => ({
      message:
        row.message ||
        row.status ||
        [row.userId, row.channel, row.result].filter(Boolean).join(' · ') ||
        JSON.stringify(row),
      time: row.time || row.timestamp || row.createdAt || '',
    })),
  }
}

/** Single entry for HomePage — all dashboard services in parallel */
export async function loadDashboardHome() {
  const [
    unique,
    live,
    metrics,
    recent,
    pending,
    topTxn,
    topFail,
    transfer,
    onboard,
    txnMetric,
  ] = await Promise.allSettled([
    fetchUniqueLogins(),
    fetchLiveUsers('ALL'),
    fetchMetricsCounts(),
    fetchRecentActivity(),
    fetchPendingIncidentCounts(),
    fetchTopTransactions('ALL'),
    fetchTopFailures('ALL'),
    fetchTransferViewCount(),
    fetchOnboardingCounts(),
    fetchTxnMetrics(),
  ])

  const settled = (r, fallback) => (r.status === 'fulfilled' ? r.value : fallback)

  return {
    unique: settled(unique, { ok: false, cards: [] }),
    live: settled(live, { ok: false, ibPoints: [], mbPoints: [] }),
    metrics: settled(metrics, {
      faqs: 0,
      products: 0,
      subProducts: 0,
      offers: 0,
      faqsDelta: '+12%',
      productsDelta: '+100%',
      subProductsDelta: '+15%',
      offersDelta: '+5%',
    }),
    recent: settled(recent, { ok: false, items: [] }),
    pending: settled(pending, { pendingRequest: 0, pendingApproval: 0, rejected: 0 }),
    topTxn: settled(topTxn, { ok: false, items: [] }),
    topFail: settled(topFail, { ok: false, items: [], bars: [] }),
    transfer: settled(transfer, { ok: false, rows: [] }),
    onboard: settled(onboard, {
      ok: false,
      registered: 0,
      started: 0,
      broken: 0,
      completed: 0,
    }),
    txnMetric: settled(txnMetric, { ok: false, rows: [], total: 0 }),
  }
}

export default {
  fetchUniqueLogins,
  fetchLiveUsers,
  fetchMetricsCounts,
  fetchRecentActivity,
  fetchPendingIncidentCounts,
  fetchTopTransactions,
  fetchTopFailures,
  fetchTransferViewCount,
  fetchOnboardingCounts,
  fetchTxnMetrics,
  fetchLoginAuditGraph,
  fetchLoginAuditLogs,
  loadDashboardHome,
}
