import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import MetricCard from '@/components/ui/MetricCard'
import { PageHeader } from '@/components/ui/PageHeader'

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

  const responseLabel = stats.avgResponse
    ? stats.avgResponse < 60
      ? `${stats.avgResponse}m`
      : `${Math.floor(stats.avgResponse / 60)}h ${stats.avgResponse % 60}m`
    : '—'

  return (
    <div>
      <PageHeader title="Performance" subtitle="Le tue statistiche complessive" />

      <div className="grid grid-cols-4 rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
        <MetricCard label="Lead totali" value={stats.total} />
        <MetricCard label="Contattati" value={`${stats.contactRate}%`} />
        <MetricCard label="Mandati" value={stats.mandates} sub="contratti firmati" />
        <MetricCard label="Tasso conversione" value={`${stats.convRate}%`} showBorder={false} />
      </div>
      <div className="grid grid-cols-4 rounded-[12px] overflow-hidden mt-4" style={{ border: '0.5px solid var(--ax-border)' }}>
        <MetricCard label="Lead A ricevuti" value={stats.classA} />
        <MetricCard label="Lead B ricevuti" value={stats.classB} />
        <MetricCard label="Persi" value={stats.lost} critical={stats.lost > 0} />
        <MetricCard label="Tempo medio risposta" value={responseLabel} showBorder={false} sub="first contact" />
      </div>
    </div>
  )
}
