/**
 * Lightweight SVG charts matching Flutter DonutChart / UiStackedBarChart.
 */

const DONUT_COLORS = [
  '#10B981',
  '#374151',
  '#6366F1',
  '#64748B',
  '#65A30D',
  '#7C3AED',
  '#84CC16',
  '#8B5CF6',
  '#F43F5E',
]

export function DonutChart({ items = [], size = 200 }) {
  const parsed = items
    .map((item, i) => ({
      label: item.label || '—',
      value: Number(item.value) || 0,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    }))
    .filter((d) => d.value > 0)

  if (!parsed.length) {
    return <div className="home-donut-empty" aria-hidden="true" />
  }

  const total = parsed.reduce((s, d) => s + d.value, 0) || 1
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.36
  const stroke = size * 0.14
  let angle = -Math.PI / 2

  const arcs = parsed.map((d) => {
    const sweep = (d.value / total) * Math.PI * 2
    const start = angle
    angle += sweep
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(angle)
    const y2 = cy + r * Math.sin(angle)
    const large = sweep > Math.PI ? 1 : 0
    return {
      ...d,
      dAttr: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
      pct: Math.round((d.value / total) * 100),
    }
  })

  return (
    <div className="home-donut-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="home-donut-svg" role="img">
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.dAttr}
            fill="none"
            stroke={a.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <ul className="home-donut-legend">
        {arcs.map((a, i) => (
          <li key={i}>
            <span className="home-donut-swatch" style={{ background: a.color }} />
            <span className="home-donut-label">{a.label}</span>
            <span className="home-donut-pct">{a.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Flutter StackBarData — bars by category with info/warning/error stacks */
export function StackedFailureBarChart({ bars = [] }) {
  const data = bars.slice(0, 5)
  if (!data.length) return null

  const max = Math.max(
    ...data.map((b) => (b.info || 0) + (b.warning || 0) + (b.error || 0)),
    1,
  )
  const h = 180
  const pad = 28
  const w = Math.max(320, data.length * 72)
  const barW = 28
  const gap = (w - pad * 2) / data.length

  return (
    <svg viewBox={`0 0 ${w} ${h + 40}`} className="home-fail-bar-svg" role="img">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = h - pad - t * (h - pad * 2)
        const label = Math.round(max * t)
        return (
          <g key={t}>
            <line
              x1={pad}
              x2={w - 8}
              y1={y}
              y2={y}
              stroke="#F3F4F6"
              strokeWidth="1"
            />
            <text x={4} y={y + 4} className="home-fail-axis">
              {label}
            </text>
          </g>
        )
      })}
      {data.map((b, i) => {
        const x = pad + gap * i + (gap - barW) / 2
        const info = Number(b.info) || 0
        const warning = Number(b.warning) || 0
        const error = Number(b.error) || 0
        const scale = (h - pad * 2) / max
        let y = h - pad
        const segments = [
          { v: info, color: '#10B981' },
          { v: warning, color: '#F59E0B' },
          { v: error, color: '#F43F5E' },
        ]
        const rects = []
        segments.forEach((s) => {
          if (!s.v) return
          const bh = s.v * scale
          y -= bh
          rects.push(
            <rect
              key={`${i}-${s.color}`}
              x={x}
              y={y}
              width={barW}
              height={bh}
              fill={s.color}
              rx="2"
            />,
          )
        })
        const label = String(b.label || '').slice(0, 14)
        return (
          <g key={i}>
            {rects}
            <text
              x={x + barW / 2}
              y={h - 6}
              textAnchor="middle"
              className="home-fail-xlabel"
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export { DONUT_COLORS }
