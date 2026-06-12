import { createClient } from '@supabase/supabase-js'

async function getAgencies() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: agencies } = await supabase
    .from('agencies')
    .select('*')
    .order('created_at', { ascending: false })

  // Per ogni agenzia prende i conteggi lead
  const enriched = await Promise.all(
    (agencies || []).map(async (agency) => {
      const [
        { count: total },
        { count: mandates },
        { count: unhandled },
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'mandate'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'new'),
      ])

      const convRate = total && mandates
        ? ((mandates / total) * 100).toFixed(1)
        : '0.0'

      return { ...agency, total, mandates, unhandled, convRate }
    })
  )

  return enriched
}

export default async function AgenciesPage() {
  const agencies = await getAgencies()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agenzie</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          {agencies.length} agenzie registrate
        </p>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#16161F', borderBottom: '0.5px solid #1E293B' }}>
              {['Agenzia', 'Città', 'Lead totali', 'Non gestiti', 'Mandati', 'Conv%', 'SLA', 'Abbonamento'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agencies.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center" style={{ color: '#CBD5E1' }}>
                  Nessuna agenzia ancora. Creane una dalle impostazioni.
                </td>
              </tr>
            )}
            {agencies.map((agency: any) => (
              <tr
                key={agency.id}
                style={{ borderBottom: '0.5px solid #1E293B' }}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{agency.name}</div>
                  <div className="text-xs" style={{ color: '#CBD5E1' }}>{agency.email}</div>
                </td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>{agency.city || '—'}</td>
                <td className="px-4 py-3 text-white">{agency.total ?? 0}</td>
                <td className="px-4 py-3">
                  <span style={{ color: agency.unhandled > 0 ? '#F59E0B' : '#10B981' }}>
                    {agency.unhandled ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: '#10B981' }}>{agency.mandates ?? 0}</td>
                <td className="px-4 py-3" style={{ color: '#4F46E5' }}>{agency.convRate}%</td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>{agency.sla_hours}h</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: agency.subscription_active ? '#064E3B' : '#450A0A',
                      color: agency.subscription_active ? '#10B981' : '#EF4444'
                    }}
                  >
                    {agency.subscription_active ? 'Attivo' : 'Inattivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
