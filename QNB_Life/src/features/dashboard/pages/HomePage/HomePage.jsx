import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import { UICard, UIDataTable, UIText } from '@/components/ui'
import { t } from '@/core/i18n/t'
import {
  loadDashboardHome,
  fetchUniqueLogins,
  fetchLiveUsers,
  fetchLoginAuditGraph,
  fetchLoginAuditLogs,
} from '@/features/dashboard/services/dashboardService'
import { boSvg } from '@/features/dashboard/menu/menuIconMaps'
import UISvgIcon from '@/components/ui/UISvgIcon/UISvgIcon'
import { homeMetricIcons } from '@/features/dashboard/pages/HomePage/homeMetricIcons'
import {
  PhoneAndroidIcon,
  LanguageIcon,
  AutorenewIcon,
  NorthEastIcon,
  SouthEastIcon,
  TrendingUpIcon,
  HistoryIcon,
  CheckIcon,
  CloseIcon,
  PriorityHighIcon,
  ChatBubbleOutlineIcon,
  ShieldOutlinedIcon,
  ShowChartIcon,
  GroupOutlinedIcon,
  QUICK_ACTION_ICONS,
} from '@/features/dashboard/pages/HomePage/homeMaterialIcons'
import { DonutChart, StackedFailureBarChart } from '@/features/dashboard/pages/HomePage/homeCharts'
import './HomePage.css'

const QUICK_ACTIONS = [
  { key: 'faq', label: 'Create New FAQ', to: '/dashboard/faq_management' },
  { key: 'mfa', label: 'Add MFA Configuration', to: '/dashboard/mfa_management' },
  { key: 'product', label: 'Manage Products', to: '/dashboard/apply_product' },
  { key: 'user', label: 'Add User', to: '/dashboard/user_creation' },
]

function MetricTile({ label, value, delta, icon: Icon }) {
  return (
    <UICard className="home-metric-tile">
      <Box className="home-metric-tile-inner">
        <span className="home-metric-tile-icon" aria-hidden="true">
          {Icon ? <Icon size={22} /> : null}
        </span>
        <Box className="home-metric-tile-body">
          <UIText variant="b12Regular" className="home-metric-tile-label">
            {label}
          </UIText>
          <UIText variant="h20SemiBold" className="home-metric-tile-value">
            {value == null ? '' : String(value)}
          </UIText>
        </Box>
        {delta ? <span className="home-metric-pill">{delta}</span> : null}
      </Box>
    </UICard>
  )
}

function DualLineChart({ ibPoints = [], mbPoints = [], emptyLabel }) {
  const hasData = ibPoints.length > 0 || mbPoints.length > 0
  if (!hasData) {
    return (
      <Box className="home-chart-empty">
        <UIText variant="b13Regular">{emptyLabel}</UIText>
      </Box>
    )
  }
  const all = [...ibPoints, ...mbPoints]
  const max = Math.max(...all.map((p) => p.y), 1)
  const len = Math.max(ibPoints.length, mbPoints.length, 2)
  const w = 320
  const h = 160
  const toPath = (points) =>
    points
      .map((p, i) => {
        const x = (i / Math.max(len - 1, 1)) * (w - 20) + 10
        const y = h - 10 - (p.y / max) * (h - 30)
        return `${i === 0 ? 'M' : 'L'}${x},${y}`
      })
      .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="home-line-chart" role="img">
      {ibPoints.length ? (
        <path d={toPath(ibPoints)} fill="none" stroke="var(--qnb-chart-ib)" strokeWidth="2" />
      ) : null}
      {mbPoints.length ? (
        <path d={toPath(mbPoints)} fill="none" stroke="var(--qnb-chart-mb)" strokeWidth="2" />
      ) : null}
    </svg>
  )
}

function SimpleLineChart({ points = [], emptyLabel }) {
  if (!points.length) {
    return (
      <Box className="home-chart-empty">
        <UIText variant="b13Regular">{emptyLabel}</UIText>
      </Box>
    )
  }
  const max = Math.max(...points.map((p) => p.y), 1)
  const w = 320
  const h = 140
  const path = points
    .map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * (w - 20) + 10
      const y = h - 10 - (p.y / max) * (h - 30)
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="home-line-chart" role="img">
      <path d={path} fill="none" stroke="var(--qnb-green-bar)" strokeWidth="2" />
    </svg>
  )
}

/** Icon chrome only — title/time come from the activity service. */
function activityIconFor(kind = '') {
  const k = String(kind).toLowerCase()
  if (k.includes('faq') || k.includes('chat') || k.includes('message') || k.includes('offer')) {
    return { Icon: ChatBubbleOutlineIcon, color: '#60A5FA', bg: '#DCEEFB' }
  }
  if (k.includes('mfa') || k.includes('security') || k.includes('otp')) {
    return { Icon: ShieldOutlinedIcon, color: '#A78BFA', bg: '#EDE9FE' }
  }
  if (k.includes('product') || k.includes('channel') || k.includes('inventory')) {
    return { Icon: ShowChartIcon, color: '#60A5FA', bg: '#DCEEFB' }
  }
  if (k.includes('user') || k.includes('member') || k.includes('team') || k.includes('people')) {
    return { Icon: GroupOutlinedIcon, color: '#34D399', bg: '#D1FAE5' }
  }
  return { Icon: ShowChartIcon, color: '#9CA3AF', bg: '#F3F4F6' }
}

function LoginAuditCard({ title, category, icon }) {
  const [view, setView] = useState('trend')
  const [graph, setGraph] = useState(null)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [g, l] = await Promise.all([
        fetchLoginAuditGraph(category),
        fetchLoginAuditLogs(category),
      ])
      if (cancelled) return
      setGraph(g)
      setLogs(l.entries || [])
    })()
    return () => {
      cancelled = true
    }
  }, [category])

  const successRate = Number(graph?.successRate ?? 0)
  const priorDelta = Number(graph?.priorDelta ?? 0)
  const chartPoints =
    view === 'hour' && graph?.hourlySeries?.length
      ? graph.hourlySeries.map((p, i) => ({
          x: i,
          y: Number(p.successRate ?? p.value ?? 0),
        }))
      : graph?.dailySeries?.length
        ? graph.dailySeries
        : graph?.sparkline?.length
          ? graph.sparkline.map((v, i) => ({ x: i, y: Number(v) || 0 }))
          : [{ x: 0, y: successRate }]

  return (
    <UICard className="home-audit-card">
      <Box className="home-audit-head">
        <UISvgIcon src={icon} size={20} alt="" />
        <Box>
          <UIText variant="h16SemiBold">{title}</UIText>
          <Box className="home-audit-tags">
            {(graph?.categories?.length
              ? graph.categories
              : category === 'FO'
                ? ['login', 'biometriclogin']
                : ['auth-server']
            ).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </Box>
        </Box>
      </Box>

      <UIText variant="h28Bold">{`${successRate.toFixed(1)}%`}</UIText>
      <UIText
        variant="b12Medium"
        className={priorDelta >= 0 ? 'home-metric-delta' : 'home-danger'}
      >
        {priorDelta >= 0 ? '+' : ''}
        {priorDelta.toFixed(1)} pts {t('vs_prior_7_day', 'vs prior 7-day period')}
      </UIText>
      <Box className="home-audit-bar" />

      <Box className="home-audit-stats">
        <Box>
          <UIText variant="b11Regular" className="home-muted">
            {t('TOTAL_ATTEMPTS', 'TOTAL ATTEMPTS')}
          </UIText>
          <UIText variant="h16SemiBold">{graph?.totalAttempts ?? 0}</UIText>
        </Box>
        <Box>
          <UIText variant="b11Regular" className="home-muted">
            {t('SUCCESS', 'SUCCESS')}
          </UIText>
          <UIText variant="h16SemiBold">{graph?.successCount ?? 0}</UIText>
        </Box>
        <Box>
          <UIText variant="b11Regular" className="home-muted">
            {t('FAILED', 'FAILED')}
          </UIText>
          <UIText variant="h16SemiBold">{graph?.failedCount ?? 0}</UIText>
        </Box>
      </Box>

      <Box className="home-audit-toggles">
        {[
          { id: 'trend', label: t('Trend', 'Trend') },
          { id: 'hour', label: t('By_hour', 'By hour') },
          { id: 'table', label: t('Table', 'Table') },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={view === opt.id ? 'is-active' : ''}
            onClick={() => setView(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </Box>

      {view === 'table' ? (
        <Box className="home-activity-list">
          {logs.length ? (
            logs.slice(0, 5).map((row, i) => (
              <UIText key={i} variant="b12Regular">
                {row.message}
                {row.time ? ` · ${row.time}` : ''}
              </UIText>
            ))
          ) : (
            <UIText variant="b12Regular" className="home-muted">
              {t('No_recent_entries', 'No recent entries for selected range')}
            </UIText>
          )}
        </Box>
      ) : (
        <SimpleLineChart
          points={chartPoints}
          emptyLabel={t('Unable_to_fetch_data', 'Unable to fetch data.')}
        />
      )}
      <button type="button" className="home-view-log-btn">
        {t('View_full_log', 'View full log')}
      </button>
    </UICard>
  )
}

function HomePage() {
  const [tab, setTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [userCards, setUserCards] = useState([])
  const [live, setLive] = useState({ ok: false, ibPoints: [], mbPoints: [] })
  const [metrics, setMetrics] = useState({
    faqs: 0,
    products: 0,
    subProducts: 0,
    offers: 0,
    faqsDelta: '+12%',
    productsDelta: '+100%',
    subProductsDelta: '+15%',
    offersDelta: '+5%',
  })
  const [activity, setActivity] = useState([])
  const [incidents, setIncidents] = useState({
    pendingRequest: 0,
    pendingApproval: 0,
    rejected: 0,
  })
  const [txns, setTxns] = useState([])
  const [failures, setFailures] = useState([])
  const [failureBars, setFailureBars] = useState([])
  const [failuresOk, setFailuresOk] = useState(true)
  const [transferRows, setTransferRows] = useState([])
  const [onboarding, setOnboarding] = useState(null)
  const [txnRows, setTxnRows] = useState([])
  const [txnTotal, setTxnTotal] = useState(0)
  const [period] = useState('Last 7 days')

  const applyHomeData = useCallback((data) => {
    setUserCards(data.unique?.cards || [])
    setLive(data.live)
    setMetrics(data.metrics)
    setActivity(data.recent?.items || [])
    setIncidents(data.pending)
    setTxns(data.topTxn.items || [])
    setFailures(data.topFail.items || [])
    setFailureBars(data.topFail.bars || [])
    setFailuresOk(Boolean(data.topFail?.ok))
    setTransferRows(data.transfer.rows || [])
    setOnboarding(data.onboard?.ok ? data.onboard : null)
    setTxnRows(data.txnMetric?.rows || [])
    setTxnTotal(data.txnMetric?.total || 0)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const data = await loadDashboardHome()
      if (cancelled) return
      applyHomeData(data)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [applyHomeData])

  async function handleUserCountRefresh() {
    if (refreshing) return
    setRefreshing(true)
    try {
      const [unique, liveUsers] = await Promise.all([
        fetchUniqueLogins(),
        fetchLiveUsers('ALL'),
      ])
      setUserCards(unique.cards || [])
      setLive(liveUsers)
    } finally {
      setRefreshing(false)
    }
  }

  const kpiTiles = useMemo(
    () => [
      {
        key: 'faqs',
        label: t('Total_FAQs', 'Total FAQs'),
        value: metrics.faqs,
        delta: metrics.faqsDelta,
        icon: homeMetricIcons.faqs,
      },
      {
        key: 'products',
        label: t('Products', 'Products'),
        value: metrics.products,
        delta: metrics.productsDelta,
        icon: homeMetricIcons.products,
      },
      {
        key: 'subProducts',
        label: t('Sub_Products', 'Sub Products'),
        value: metrics.subProducts,
        delta: metrics.subProductsDelta,
        icon: homeMetricIcons.subProducts,
      },
      {
        key: 'offers',
        label: t('Active_Offers', 'Active Offers'),
        value: metrics.offers,
        delta: metrics.offersDelta,
        icon: homeMetricIcons.offers,
      },
    ],
    [metrics],
  )

  const failureYear = new Date().getFullYear()

  return (
    <Box className="home-page">
      <Box className="home-tabs">
        {[
          { id: 'home', label: t('Home', 'Home') },
          { id: 'ib', label: t('Internet_Banking', 'Internet Banking') },
          { id: 'mb', label: t('Mobile_Banking', 'Mobile Banking') },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'is-active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </Box>

      {loading ? (
        <UIText variant="b13Regular" className="home-muted">
          {t('Loading_dashboard', 'Loading dashboard…')}
        </UIText>
      ) : null}

      {tab !== 'home' ? (
        <UICard className="home-placeholder-tab">
          <UIText variant="b14Regular">
            {t('Channel_dashboard_soon', 'Channel dashboard coming soon.')}
          </UIText>
        </UICard>
      ) : (
        <Box className="home-rows">
          {/* Row1 — User Count + DAU */}
          <Box className="home-row home-row-2 home-row-tall">
            <UICard className="home-panel home-panel-tall">
              <Box className="home-panel-head">
                <UIText variant="h16SemiBold" className="home-panel-title">
                  {t('User_Count', 'User Count')}
                </UIText>
                <button
                  type="button"
                  className={`home-refresh-btn${refreshing ? ' is-active' : ''}`}
                  onClick={handleUserCountRefresh}
                  disabled={refreshing}
                >
                  <AutorenewIcon size={16} />
                  <span>{refreshing ? t('Refreshing', 'Refreshing…') : t('Refresh', 'Refresh')}</span>
                </button>
              </Box>
              <Box className="home-user-count-grid">
                {userCards.length ? (
                  userCards.map((card, i) => {
                    const ChannelIcon = card.channel === 'ib' ? LanguageIcon : PhoneAndroidIcon
                    return (
                      <Box key={i} className={`home-user-card tone-${card.tone}`}>
                        <Box className="home-user-card-top">
                          <span className={`home-user-card-icon tone-${card.tone}`}>
                            <ChannelIcon size={20} />
                          </span>
                          {card.month ? (
                            <span className="home-user-card-month-chip">{card.month}</span>
                          ) : null}
                        </Box>
                        <UIText variant="b12Medium" className="home-user-card-label">
                          {t(card.label, card.label)}
                        </UIText>
                        <Box className="home-user-card-bottom">
                          <UIText variant="h20SemiBold" className="home-user-card-value">
                            {card.value}
                          </UIText>
                          {card.percentage ? (
                            <span
                              className={`home-trend-pill ${card.increased ? 'is-up' : 'is-down'}`}
                            >
                              {card.increased ? (
                                <NorthEastIcon size={12} />
                              ) : (
                                <SouthEastIcon size={12} />
                              )}
                              {card.percentage}
                            </span>
                          ) : null}
                        </Box>
                      </Box>
                    )
                  })
                ) : (
                  <UIText variant="b13Regular" className="home-muted">
                    {t('Unable_to_fetch_data', 'Unable to fetch data.')}
                  </UIText>
                )}
              </Box>
            </UICard>

            <UICard className="home-panel home-panel-tall">
              <Box className="home-panel-head">
                <UIText variant="h16SemiBold">{t('Daily_Active_Users', 'Daily Active Users')}</UIText>
                <Box className="home-legend">
                  <span className="dot blue" /> {t('Internet_Banking', 'Internet Banking')}
                  <span className="dot pink" /> {t('Mobile_Banking', 'Mobile Banking')}
                </Box>
              </Box>
              <DualLineChart
                ibPoints={live.ibPoints}
                mbPoints={live.mbPoints}
                emptyLabel={t('Unable_to_fetch_data', 'Unable to fetch data.')}
              />
            </UICard>
          </Box>

          <Box className="home-kpi-row">
            {kpiTiles.map((tile) => (
              <MetricTile
                key={tile.key}
                label={tile.label}
                value={tile.value}
                delta={tile.delta}
                icon={tile.icon}
              />
            ))}
          </Box>

          {/* Row2 — Quick Actions + Recent Activity */}
          <Box className="home-row home-row-2">
            <UICard className="home-panel">
              <Box className="home-section-title">
                <TrendingUpIcon size={18} />
                <UIText variant="h16SemiBold">{t('Quick_Actions', 'Quick Actions')}</UIText>
              </Box>
              <Box className="home-quick-list">
                {QUICK_ACTIONS.map((action) => {
                  const meta = QUICK_ACTION_ICONS[action.key]
                  const Icon = meta?.Icon
                  return (
                    <Link key={action.key} to={action.to} className="home-quick-item">
                      <span
                        className="home-quick-icon"
                        style={{ color: meta?.color || '#0D59F2' }}
                      >
                        {Icon ? <Icon size={20} /> : null}
                      </span>
                      <UIText variant="b13Medium">{t(action.label, action.label)}</UIText>
                      <span className="home-quick-arrow">
                        <NorthEastIcon size={14} />
                      </span>
                    </Link>
                  )
                })}
              </Box>
            </UICard>

            <UICard className="home-panel">
              <Box className="home-section-title">
                <span className="home-activity-header-icon">
                  <HistoryIcon size={18} />
                </span>
                <UIText variant="h16SemiBold">{t('Recent_Activity', 'Recent Activity')}</UIText>
              </Box>
              <Box className="home-activity-list">
                {activity.length ? (
                  activity.map((item, i) => {
                    const meta = activityIconFor(item.kind)
                    const Icon = meta.Icon
                    return (
                      <Box key={i} className="home-activity-item">
                        <span
                          className="home-activity-icon-well"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          <Icon size={18} />
                        </span>
                        <Box>
                          <UIText variant="b13Medium">{item.title}</UIText>
                          {item.timeLabel ? (
                            <UIText variant="b11Regular" className="home-muted">
                              {item.timeLabel}
                            </UIText>
                          ) : null}
                        </Box>
                      </Box>
                    )
                  })
                ) : (
                  <UIText variant="b13Regular" className="home-muted">
                    {t('No_recent_activity', 'No recent activity')}
                  </UIText>
                )}
              </Box>
            </UICard>
          </Box>

          {/* Row3 — Incidents + Transaction Distribution */}
          <Box className="home-row home-row-2">
            <UICard className="home-panel">
              <UIText variant="h16SemiBold">{t('Customer_Incidents', 'Customer Incidents')}</UIText>
              <UIText variant="b12Regular" className="home-incident-sub">
                {t('Last_24_hours', 'Last 24 hours')}
              </UIText>
              <Box className="home-incident-list">
                {[
                  {
                    key: 'req',
                    label: t('Pending_Request', 'Pending Request'),
                    value: incidents.pendingRequest,
                    tone: 'green',
                    Icon: CheckIcon,
                  },
                  {
                    key: 'apr',
                    label: t('Pending_Approval', 'Pending Approval'),
                    value: incidents.pendingApproval,
                    tone: 'red',
                    Icon: CloseIcon,
                  },
                  {
                    key: 'rej',
                    label: t('Requests_Rejects', 'Requests Rejects'),
                    value: incidents.rejected,
                    tone: 'blue',
                    Icon: PriorityHighIcon,
                  },
                ].map((row) => (
                  <Box key={row.key} className={`home-incident-row tone-${row.tone}`}>
                    <Box className="home-incident-left">
                      <span className={`home-incident-icon tone-${row.tone}`}>
                        <span className="home-incident-icon-inner">
                          <row.Icon size={16} />
                        </span>
                      </span>
                      <UIText variant="b13Medium">{row.label}</UIText>
                    </Box>
                    <UIText variant="h18Bold" className={`home-incident-value tone-${row.tone}`}>
                      {row.value}
                    </UIText>
                  </Box>
                ))}
              </Box>
            </UICard>

            <UICard className="home-panel">
              <UIText variant="h16SemiBold">
                {t('Transaction_Distribution', 'Transaction Distribution')}
              </UIText>
              <DonutChart items={txns} />
            </UICard>
          </Box>

          {/* Row4 — Service Failure + Top Failure Rate */}
          <Box className="home-row home-row-fail">
            <UICard className="home-panel home-fail-chart-panel">
              <Box className="home-panel-head">
                <UIText variant="h16SemiBold">
                  {t('Service_Failure_Latency', 'Service Failure & Latency')}
                </UIText>
                <Box className="home-legend home-fail-legend">
                  <span className="dot green" /> {t('Info', 'Info')}
                  <span className="dot amber" /> {t('Warning', 'Warning')}
                  <span className="dot red" /> {t('Error', 'Error')}
                </Box>
              </Box>
              {!failuresOk ? (
                <Box className="home-chart-empty">
                  <UIText variant="h16SemiBold">{t('No_Content', 'No Content')}</UIText>
                  <UIText variant="b13Regular" className="home-muted">
                    {t(
                      'Unable_to_load_data_try_again',
                      'Unable to load data. Try again after sometime.',
                    )}
                  </UIText>
                </Box>
              ) : failureBars.length ? (
                <StackedFailureBarChart bars={failureBars} />
              ) : (
                <Box className="home-chart-empty">
                  <UIText variant="b13Regular" className="home-muted">
                    {t('No_data', 'No data')}
                  </UIText>
                </Box>
              )}
            </UICard>

            <UICard className="home-panel home-fail-rate-panel">
              <UIText variant="h16SemiBold">{t('Top_Failure_Rate', 'Top Failure Rate')}</UIText>
              <UIText variant="b12Regular" className="home-muted">
                {t('Based_on_year', 'Based on {year}').replace('{year}', String(failureYear))}
              </UIText>
              {!failuresOk ? (
                <UIText variant="h16SemiBold" className="home-fail-empty">
                  {t('No_Data_Found', 'No Data Found')}
                </UIText>
              ) : (
                <Box className="home-fail-rate-list">
                  {failures.length ? (
                    failures.map((item, i) => (
                      <Box key={i} className="home-fail-rate-row">
                        <UIText variant="b13Medium" className="home-fail-rate-label">
                          {item.label}
                        </UIText>
                        <span className="home-fail-rate-pill">
                          {item.percentage != null ? item.percentage : item.value}
                        </span>
                      </Box>
                    ))
                  ) : (
                    <UIText variant="h16SemiBold" className="home-fail-empty">
                      {t('No_Data_Found', 'No Data Found')}
                    </UIText>
                  )}
                </Box>
              )}
            </UICard>
          </Box>

          <Box className="home-row home-row-2">
            <UICard className="home-panel">
              <UIText variant="h16SemiBold">
                {t('Within_Account_Transfer', 'Within Account Transfer View')}
              </UIText>
              {transferRows.length ? (
                <Box className="home-donut-list">
                  {transferRows.slice(0, 6).map((row, i) => (
                    <Box key={i} className="home-donut-row">
                      <UIText variant="b12Medium">
                        {row.label} ({row.role})
                      </UIText>
                      <UIText variant="b12Bold">
                        ✓{row.success ?? 0} / ✗{row.failure ?? 0}
                      </UIText>
                    </Box>
                  ))}
                </Box>
              ) : (
                <UIText variant="b13Regular" className="home-muted">
                  {t('Unable_to_fetch_data', 'Unable to fetch data.')}
                </UIText>
              )}
            </UICard>
            <UICard className="home-panel">
              <UIText variant="h16SemiBold">{t('Onboarding', 'Onboarding')}</UIText>
              {onboarding ? (
                <Box className="home-donut-list">
                  {[
                    [t('Registered', 'Registered'), onboarding.registered],
                    [t('Started', 'Started'), onboarding.started],
                    [t('Broken', 'Broken'), onboarding.broken],
                    [t('Completed', 'Completed'), onboarding.completed],
                  ].map(([label, value]) => (
                    <Box key={label} className="home-donut-row">
                      <UIText variant="b12Medium">{label}</UIText>
                      <UIText variant="b12Bold">{value}</UIText>
                    </Box>
                  ))}
                </Box>
              ) : (
                <UIText variant="b13Regular" className="home-muted">
                  {t('Unable_to_fetch_data', 'Unable to fetch data.')}
                </UIText>
              )}
            </UICard>
          </Box>

          <UICard className="home-panel">
            <Box className="home-panel-head">
              <UIText variant="h16SemiBold">
                {t('Transaction_Analysis', 'Transaction Analysis')}
              </UIText>
              <UIText variant="b12Medium" className="home-muted">
                {t('Total', 'Total')}: {txnTotal}
              </UIText>
            </Box>
            <Box className="home-txn-table">
              <UIDataTable
                columns={[
                  { key: 'type', label: t('Type', 'Type') },
                  { key: 'count', label: t('Count', 'Count') },
                  { key: 'status', label: t('Status', 'Status') },
                ]}
                rows={txnRows}
                rowKey="type"
                showSearchBox={false}
                pageSize={8}
                emptyLabel={t('No_data', 'No data')}
              />
            </Box>
          </UICard>

          <Box className="home-audit-section">
            <Box className="home-audit-section-head">
              <UIText as="h2" variant="h20SemiBold">
                {t('Login_audit', 'Login audit')}
              </UIText>
              <button type="button" className="home-period-btn">
                {period}
              </button>
            </Box>
            <Box className="home-row home-row-2">
              <LoginAuditCard
                title={t('Front_office_logins', 'Front office logins')}
                category="FO"
                icon={boSvg.monitor}
              />
              <LoginAuditCard
                title={t('Back_office_logins', 'Back office logins')}
                category="BO"
                icon={boSvg.monitor}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HomePage
