import { createClient } from '@supabase/supabase-js'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Building2 } from 'lucide-react'

async function getAgencies() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: agencies } = await supabase
    .from('agencies')
    .select('*')
    .order('created_at', { ascending: false })

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
    <div>
      <PageHeader title="Agenzie" subtitle={`${agencies.length} agenzie registrate`} />

      {agencies.length === 0 ? (
        <div className="rounded-[12px]" style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}>
          <EmptyState
            icon={Building2}
            title="Nessuna agenzia ancora"
            description="Creane una dalla pagina Impostazioni per iniziare ad assegnare i lead."
          />
        </div>
      ) : (
        <div className="rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ax-bg2)', borderBottom: '0.5px solid var(--ax-border)' }}>
                {['Agenzia', 'Città', 'Lead totali', 'Non gestiti', 'Mandati', 'Conv%', 'SLA', 'Abbonamento'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: 'var(--ax-t3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency: any) => (
                <tr key={agency.id} style={{ borderBottom: '0.5px solid var(--ax-border)' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[13px]" style={{ color: 'var(--ax-t1)' }}>{agency.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{agency.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ax-t2)' }}>{agency.city || '—'}</td>
                  <td className="px-4 py-3 font-mono text-[13px]" style={{ color: 'var(--ax-t1)' }}>{agency.total ?? 0}</td>
                  <td className="px-4 py-3 font-mono text-[13px]">
                    <span style={{ color: agency.unhandled > 0 ? '#F59E0B' : '#10B981' }}>
                      {agency.unhandled ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px]" style={{ color: '#10B981' }}>{agency.mandates ?? 0}</td>
                  <td className="px-4 py-3 font-mono text-[13px]" style={{ color: 'var(--ax-blue)' }}>{agency.convRate}%</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ax-t2)' }}>{agency.sla_hours}h</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: agency.subscription_active ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
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
      )}
    </div>
  )
}
