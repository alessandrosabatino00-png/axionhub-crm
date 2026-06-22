import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import StatusBadge from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { CheckCircle2 } from 'lucide-react'

async function getCriticalLeads() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: membership } = await supabase
    .from('agency_users')
    .select('agency_id')
    .eq('user_id', user.id)
    .single()

  if (!membership) return []

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cutoff = new Date(Date.now() - 2 * 3600000).toISOString()

  const { data } = await admin
    .from('leads')
    .select('id, name, phone, lead_class, status, status_updated_at')
    .eq('agency_id', membership.agency_id)
    .eq('status', 'new')
    .lt('status_updated_at', cutoff)
    .order('status_updated_at', { ascending: true })

  return data || []
}

function timeWaiting(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default async function AgencyCriticalLeads() {
  const leads = await getCriticalLeads()

  return (
    <div>
      <PageHeader
        title="Lead critici"
        subtitle={`Lead non contattati da più di 2h — ${leads.length} in attesa`}
      />

      {leads.length === 0 ? (
        <div className="rounded-[12px]" style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}>
          <EmptyState
            icon={CheckCircle2}
            title="Nessun lead critico"
            description="Tutti i lead sono stati contattati entro le 2h previste."
          />
        </div>
      ) : (
        <div className="rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ax-bg2)', borderBottom: '0.5px solid var(--ax-border)' }}>
                {['Proprietario', 'Classe', 'Stato', 'In attesa da'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: 'var(--ax-t3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '0.5px solid var(--ax-border)' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[13px]" style={{ color: 'var(--ax-t1)' }}>{lead.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={lead.lead_class} type="class" /></td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3">
                    <span className="font-bold font-mono text-[13px]" style={{ color: '#EF4444' }}>{timeWaiting(lead.status_updated_at)}</span>
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
