import { createClient } from '@supabase/supabase-js'
import StatusBadge from '@/components/ui/StatusBadge'

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

function rowColor(lead: any) {
  if (lead.status !== 'new') return 'transparent'
  const hours = (Date.now() - new Date(lead.status_updated_at).getTime()) / 3600000
  if (hours >= 48) return '#450A0A22'
  if (hours >= 2) return '#451A0322'
  return 'transparent'
}

export default async function FounderLeads() {
  const leads = await getLeads()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tutti i lead</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          {leads.length} lead totali
        </p>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#16161F', borderBottom: '0.5px solid #1E293B' }}>
              {['Proprietario', 'Indirizzo', 'Tipo', 'Classe', 'Valore', 'Agenzia', 'Stato', 'Ricevuto'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center" style={{ color: '#CBD5E1' }}>
                  Nessun lead ancora. Arriveranno dal webhook GHL.
                </td>
              </tr>
            )}
            {leads.map((lead: any) => (
              <tr
                key={lead.id}
                style={{
                  backgroundColor: rowColor(lead),
                  borderBottom: '0.5px solid #1E293B'
                }}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{lead.name}</div>
                  <div className="text-xs" style={{ color: '#CBD5E1' }}>{lead.phone}</div>
                </td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                  {lead.address || lead.cap || '—'}
                </td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                  {lead.property_type || '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.lead_class} type="class" />
                </td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                  {lead.estimated_value
                    ? `€${Number(lead.estimated_value).toLocaleString('it-IT')}`
                    : '—'}
                </td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                  {(lead.agencies as any)?.name || '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#CBD5E1' }}>
                  {timeAgo(lead.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
