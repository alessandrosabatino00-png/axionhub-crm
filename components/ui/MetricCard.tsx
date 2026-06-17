interface MetricCardProps {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  sub?: string
  accent?: string
  critical?: boolean
}

export default function MetricCard({ label, value, delta, deltaUp, sub, accent, critical }: MetricCardProps) {
  return (
    <div
      className="metric-card relative overflow-hidden px-[18px] py-5 transition-all duration-150 rounded-xl"
      style={{
        background: critical ? 'rgba(239,68,68,0.03)' : 'var(--ax-bg2)',
        border: '0.5px solid var(--ax-border)',
      }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-2.5"
        style={{ color: 'var(--ax-t3)' }}
      >
        {label}
      </div>
      <div
        className="text-[30px] font-bold leading-none tracking-[-1px] mb-[7px]"
        style={{ color: critical ? '#EF4444' : accent || 'var(--ax-t1)' }}
      >
        {value}
      </div>
      {delta && (
        <span
          className="inline-flex items-center text-[10px] font-semibold px-[5px] py-0.5 rounded"
          style={
            deltaUp
              ? { background: 'rgba(16,185,129,0.1)', color: '#10B981' }
              : { background: 'rgba(239,68,68,0.1)', color: '#EF4444' }
          }
        >
          {deltaUp ? '↑' : '↓'} {delta}
        </span>
      )}
      {sub && (
        <div className="text-[10px] mt-1" style={{ color: 'var(--ax-t3)' }}>
          {sub}
        </div>
      )}
    </div>
  )
}
