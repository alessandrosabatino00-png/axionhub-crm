type LeadClass = 'A' | 'B' | 'C'
type LeadStatusType = 'new' | 'contacted' | 'meeting' | 'mandate' | 'lost'

const classStyles: Record<LeadClass, { bg: string; color: string }> = {
  A: { bg: 'rgba(16,185,129,0.16)', color: '#10B981' },
  B: { bg: 'rgba(96,165,250,0.16)', color: '#60A5FA' },
  C: { bg: 'rgba(239,68,68,0.16)',  color: '#EF4444' },
}

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Nuovo' },
  contacted: { bg: 'rgba(96,165,250,0.12)', color: '#60A5FA', label: 'Contattato' },
  meeting:   { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA', label: 'Meeting' },
  mandate:   { bg: 'rgba(16,185,129,0.12)', color: '#10B981', label: 'Mandato' },
  lost:      { bg: 'rgba(239,68,68,0.10)',  color: '#EF4444', label: 'Perso' },
}

interface StatusBadgeProps {
  status: string
  type?: 'status' | 'class'
}

export default function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  if (type === 'class') {
    const s = classStyles[status as LeadClass] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--ax-t2)' }
    return (
      <span
        className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-[6px] text-[11px] font-bold font-mono"
        style={{ background: s.bg, color: s.color }}
      >
        {status}
      </span>
    )
  }

  const s = statusStyles[status] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--ax-t2)', label: status }
  return (
    <span
      className="inline-flex items-center gap-[5px] text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-[5px] h-[5px] rounded-full bg-current flex-shrink-0" />
      {s.label}
    </span>
  )
}
