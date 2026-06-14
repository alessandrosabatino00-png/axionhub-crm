import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getPerformance() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase
    .from('agency_users')
    .select('agency_id')
    .eq('user_id', user.id)
    .single()

  if (!membership) return null

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: leads } = await admin
    .from('leads')
    .select('id, lead_class, status, created_at, first_contact_at, status_updated_at')
    .eq('agency_id', membership.agency_id)

  if (!leads) return null

  const total = leads.length
  const mandates = leads.filter(l => l.status === 'mandate').length
  const lost = leads.filter(l => l.status === 'lost').length
  const contacted = leads.filter(l => l.status !== 'new').length
  const classA = leads.filter(l => l.lead_class === 'A').length
  const classB = leads.filter(l => l.lead_class === 'B').length

  // Tempo medio risposta in minuti
  const responseTimes = leads
    .filter(l => l.first_contact_at)
    .map(l => (new Date(l.first_contact_at).getTime() - new Date(l.created_at).getTime()) / 60000)

  const avgResponse = responseTimes.length
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : null

  const convRate = total ? ((mandates / total) * 100).toFixed(1) : '0.0'
  const contactRate = total ? ((contacted / total) * 100).toFixed(1) : '0.0'

  return { total, mandates, lost, contacted, classA, classB, avgResponse, convRate, contactRate }
}

export default async function AgencyPerformance() {
  const stats = await getPerformance()
  if (!stats) return null

  const metrics = [
    { label: 'Lead totali', value: stats.total, color: '#FFFFFF' },
    { label: 'Contattati', value: `${stats.contactRate}%`, color: '#06B6D4' },
    { label: 'Mandati', value: stats.mandates, color: '#10B981' },
    { label: 'Tasso conversione', value: `${stats.convRate}%`, color: '#4F46E5' },
    { label: 'Lead A ricevuti', value: stats.classA, color: '#10B981' },
    { label: 'Lead B ricevuti', value: stats.classB, color: '#60A5FA' },
    { label: 'Persi', value: stats.lost, color: '#EF4444' },
    {
      label: 'Tempo medio risposta',
      value: stats.avgResponse
        ? stats.avgResponse < 60
          ? `${stats.avgResponse}m`
          : `${Math.floor(stats.avgResponse / 60)}h ${stats.avgResponse % 60}m`
        : '—',
      color: '#F59E0B'
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Performance</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          Le tue statistiche complessive
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map(m => (
          <div
            key={m.label}
            className="rounded-xl border p-5"
            style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
          >
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>{m.label}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
