interface StatusBadgeProps {
  status: string
  type?: 'status' | 'class'
}

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B', label: 'Nuovo' },
  contacted: { bg: 'rgba(96,165,250,0.1)',  color: '#60A5FA', label: 'Contattato' },
  meeting:   { bg: 'rgba(167,139,250,0.1)', color: '#A78BFA', label: 'Meeting' },
  mandate:   { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', label: 'Mandato' },
  lost:      { bg: 'rgba(239,68,68,0.07)',  color: '#EF4444', label: 'Perso' },
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
        className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-[5px] text-[11px] font-bold"
        style={{ background: style.bg, color: style.color }}
      >
        {status}
      </span>
    )
  }

  const style = statusStyles[status] || { bg: 'rgba(255,255,255,0.05)', color: '#CBD5E1', label: status }
  return (
    <span
      className="inline-flex items-center gap-[5px] text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: style.bg, color: style.color }}
    >
      <span className="w-[5px] h-[5px] rounded-full bg-current flex-shrink-0" />
      {style.label}
    </span>
  )
}
