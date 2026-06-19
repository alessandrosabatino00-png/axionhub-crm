'use client'

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  sub?: string
  critical?: boolean
  showBorder?: boolean
  onClick?: () => void
}

export default function MetricCard({
  label, value, delta, deltaUp, sub, critical, showBorder = true, onClick
}: MetricCardProps) {
  return (
    <div
      className="metric-card-glow px-[18px] py-5 cursor-pointer transition-all duration-150"
      style={{
        background: critical ? 'rgba(239,68,68,0.04)' : 'var(--ax-bg2)',
        borderRight: showBorder ? '0.5px solid var(--ax-border)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.background = critical ? 'rgba(239,68,68,0.08)' : 'var(--ax-bg3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = critical ? 'rgba(239,68,68,0.04)' : 'var(--ax-bg2)'
      }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-2.5" style={{ color: 'var(--ax-t3)' }}>
        {label}
      </div>
      <div
        className="text-[28px] font-bold leading-none font-mono tracking-[-1px] mb-[7px]"
        style={{ color: critical ? '#EF4444' : 'var(--ax-t1)' }}
      >
        {value}
      </div>
      {delta && (
        <span
          className="inline-flex items-center text-[10px] font-semibold font-mono px-[5px] py-0.5 rounded"
          style={deltaUp
            ? { background: 'rgba(16,185,129,0.12)', color: '#10B981' }
            : { background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}
        >
          {deltaUp ? '↑' : '↓'} {delta}
        </span>
      )}
      {sub && <div className="text-[10px] mt-1" style={{ color: 'var(--ax-t3)' }}>{sub}</div>}
    </div>
  )
}
