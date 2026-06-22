import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import StatusBadge from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { History } from 'lucide-react'

async function getHistory() {
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

  const { data } = await admin
    .from('leads')
    .select('id, name, phone, lead_class, status, estimated_value, created_at, first_contact_at')
    .eq('agency_id', membership.agency_id)
    .in('status', ['mandate', 'lost'])
    .order('created_at', { ascending: false })

  return data || []
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function AgencyHistory() {
  const leads = await getHistory()
  const mandates = leads.filter(l => l.status === 'mandate')
  const lost = leads.filter(l => l.status === 'lost')

  return (
    <div>
      <PageHeader title="Storico" subtitle={`${mandates.length} mandati · ${lost.length} persi`} />

      {leads.length === 0 ? (
        <div className="rounded-[12px]" style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}>
          <EmptyState
            icon={History}
            title="Nessun lead nello storico"
            description="I lead chiusi (mandato o perso) appariranno qui."
          />
        </div>
      ) : (
        <div className="rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ax-bg2)', borderBottom: '0.5px solid var(--ax-border)' }}>
                {['Proprietario', 'Classe', 'Esito', 'Valore', 'Ricevuto', 'Primo contatto'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: 'var(--ax-t3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} style={{ borderBottom: '0.5px solid var(--ax-border)' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[13px]" style={{ color: 'var(--ax-t1)' }}>{lead.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={lead.lead_class} type="class" /></td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 font-mono text-[12px]" style={{ color: 'var(--ax-t2)' }}>
                    {lead.estimated_value ? `€${Number(lead.estimated_value).toLocaleString('it-IT')}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono" style={{ color: 'var(--ax-t3)' }}>{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3 text-[11px] font-mono" style={{ color: 'var(--ax-t3)' }}>
                    {lead.first_contact_at ? formatDate(lead.first_contact_at) : '—'}
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
