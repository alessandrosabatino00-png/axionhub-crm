import { createClient } from '@supabase/supabase-js'
import StatusBadge from '@/components/ui/StatusBadge'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lead critici</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          Lead non gestiti da più di 48h — {leads.length} in attesa
        </p>
      </div>

      {leads.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
        >
          <p className="text-2xl mb-2">✅</p>
          <p className="font-medium text-white">Nessun lead critico</p>
          <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
            Tutti i lead sono stati gestiti entro 48h
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#16161F', borderBottom: '0.5px solid #1E293B' }}>
                {['Proprietario', 'Classe', 'Agenzia', 'Stato', 'Ore in attesa'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>
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
                    style={{ backgroundColor: '#450A0A22', borderBottom: '0.5px solid #1E293B' }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-xs" style={{ color: '#CBD5E1' }}>{lead.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.lead_class} type="class" />
                    </td>
                    <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                      {(lead.agencies as any)?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold" style={{ color: '#EF4444' }}>
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
