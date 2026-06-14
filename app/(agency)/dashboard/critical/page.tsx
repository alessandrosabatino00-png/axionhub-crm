import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import StatusBadge from '@/components/ui/StatusBadge'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lead critici</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          Lead non contattati da più di 2h — {leads.length} in attesa
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}>
          <p className="text-2xl mb-2">✅</p>
          <p className="font-medium text-white">Nessun lead critico</p>
          <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>Tutti i lead sono stati contattati entro 2h</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#16161F', borderBottom: '0.5px solid #1E293B' }}>
                {['Proprietario', 'Classe', 'Stato', 'In attesa da'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} style={{ backgroundColor: '#450A0A22', borderBottom: '0.5px solid #1E293B' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="text-xs" style={{ color: '#CBD5E1' }}>{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={lead.lead_class} type="class" /></td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3">
                    <span className="font-bold" style={{ color: '#EF4444' }}>{timeWaiting(lead.status_updated_at)}</span>
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
