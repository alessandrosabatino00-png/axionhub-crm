interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: string
}

export default function MetricCard({ label, value, sub, accent }: MetricCardProps) {
  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-2"
      style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: '#CBD5E1' }}>
        {label}
      </p>
      <p className="text-3xl font-bold" style={{ color: accent || '#FFFFFF' }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: '#CBD5E1' }}>{sub}</p>
      )}
    </div>
  )
}
