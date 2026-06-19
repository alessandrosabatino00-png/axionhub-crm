import { createClient } from '@supabase/supabase-js'
import StatusBadge from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'

async function getLeads() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('leads')
    .select(`
      id, name, phone, email, address, cap, city,
      property_type, estimated_value, score,
      lead_class, status, created_at, status_updated_at,
      agencies (name, city)
    `)
    .order('created_at', { ascending: false })

  return data || []
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 24) return `${Math.floor(h / 24)}g fa`
  if (h > 0) return `${h}h fa`
  return `${m}m fa`
}

function rowBg(lead: any) {
  if (lead.status !== 'new') return 'transparent'
  const hours = (Date.now() - new Date(lead.status_updated_at).getTime()) / 3600000
  if (hours >= 48) return 'rgba(239,68,68,0.06)'
  if (hours >= 2) return 'rgba(245,158,11,0.05)'
  return 'transparent'
}

export default async function FounderLeads() {
  const leads = await getLeads()

  return (
    <div>
      <PageHeader title="Tutti i lead" subtitle={`${leads.length} lead totali`} live />

      {leads.length === 0 ? (
        <div className="rounded-[12px]" style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}>
          <EmptyState
            icon={Users}
            title="Nessun lead ancora"
            description="I lead arriveranno automaticamente dal webhook GHL non appena GoHighLevel li classifica."
          />
        </div>
      ) : (
        <div className="rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ax-bg2)', borderBottom: '0.5px solid var(--ax-border)' }}>
                {['Proprietario', 'Indirizzo', 'Tipo', 'Classe', 'Valore', 'Agenzia', 'Stato', 'Ricevuto'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: 'var(--ax-t3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr
                  key={lead.id}
                  style={{ background: rowBg(lead), borderBottom: '0.5px solid var(--ax-border)' }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[13px]" style={{ color: 'var(--ax-t1)' }}>{lead.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ax-t2)' }}>
                    {lead.address || lead.cap || '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ax-t2)' }}>
                    {lead.property_type || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.lead_class} type="class" />
                  </td>
                  <td className="px-4 py-3 text-[12px] font-mono" style={{ color: 'var(--ax-t2)' }}>
                    {lead.estimated_value
                      ? `€${Number(lead.estimated_value).toLocaleString('it-IT')}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ax-t2)' }}>
                    {(lead.agencies as any)?.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono" style={{ color: 'var(--ax-t3)' }}>
                    {timeAgo(lead.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
