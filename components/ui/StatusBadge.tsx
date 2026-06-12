interface StatusBadgeProps {
  status: string
  type?: 'status' | 'class'
}

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: '#451A03', color: '#F59E0B', label: 'Nuovo' },
  contacted: { bg: '#1E3A5F', color: '#60A5FA', label: 'Contattato' },
  meeting:   { bg: '#2E1065', color: '#A78BFA', label: 'Appuntamento' },
  mandate:   { bg: '#064E3B', color: '#10B981', label: 'Mandato' },
  lost:      { bg: '#450A0A', color: '#EF4444', label: 'Perso' },
}

const classStyles: Record<string, { bg: string; color: string }> = {
  A: { bg: '#064E3B', color: '#10B981' },
  B: { bg: '#1E3A5F', color: '#60A5FA' },
  C: { bg: '#450A0A', color: '#EF4444' },
}

export default function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  if (type === 'class') {
    const style = classStyles[status] || { bg: '#1E293B', color: '#CBD5E1' }
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {status}
      </span>
    )
  }

  const style = statusStyles[status] || { bg: '#1E293B', color: '#CBD5E1', label: status }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  )
}
