import { createClient } from '@supabase/supabase-js'
import StatusBadge from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { CheckCircle2 } from 'lucide-react'

async function getCriticalLeads() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cutoff = new Date(Date.now() - 48 * 3600000).toISOString()

  const { data } = await supabase
    .from('leads')
    .select(`
      id, name, phone, lead_class, status,
      status_updated_at, created_at,
      agencies (name)
    `)
    .eq('status', 'new')
    .lt('status_updated_at', cutoff)
    .order('status_updated_at', { ascending: true })

  return data || []
}

function hoursWaiting(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 3600000)
}

export default async function CriticalLeads() {
  const leads = await getCriticalLeads()

  return (
    <div>
      <PageHeader
        title="Lead critici"
        subtitle={`Lead non gestiti da più di 48h — ${leads.length} in attesa`}
      />

      {leads.length === 0 ? (
        <div className="rounded-[12px]" style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}>
          <EmptyState
            icon={CheckCircle2}
            title="Nessun lead critico"
            description="Tutti i lead sono stati gestiti entro le 48h previste dalla SLA."
          />
        </div>
      ) : (
        <div className="rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ax-bg2)', borderBottom: '0.5px solid var(--ax-border)' }}>
                {['Proprietario', 'Classe', 'Agenzia', 'Stato', 'Ore in attesa'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: 'var(--ax-t3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => {
                const hours = hoursWaiting(lead.status_updated_at)
                return (
                  <tr
                    key={lead.id}
                    style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '0.5px solid var(--ax-border)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-[13px]" style={{ color: 'var(--ax-t1)' }}>{lead.name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{lead.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.lead_class} type="class" />
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ax-t2)' }}>
                      {(lead.agencies as any)?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold font-mono text-[13px]" style={{ color: '#EF4444' }}>
                        {hours}h
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
