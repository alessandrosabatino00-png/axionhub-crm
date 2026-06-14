import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import StatusBadge from '@/components/ui/StatusBadge'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Storico</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          {mandates.length} mandati · {lost.length} persi
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}>
          <p className="font-medium text-white">Nessun lead nello storico</p>
          <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>I lead chiusi (mandato o perso) appariranno qui</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#16161F', borderBottom: '0.5px solid #1E293B' }}>
                {['Proprietario', 'Classe', 'Esito', 'Valore', 'Ricevuto', 'Primo contatto'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} style={{ borderBottom: '0.5px solid #1E293B' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="text-xs" style={{ color: '#CBD5E1' }}>{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={lead.lead_class} type="class" /></td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                    {lead.estimated_value ? `€${Number(lead.estimated_value).toLocaleString('it-IT')}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#CBD5E1' }}>{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#CBD5E1' }}>
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
