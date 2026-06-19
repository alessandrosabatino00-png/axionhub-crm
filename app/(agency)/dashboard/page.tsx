import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import MetricCard from '@/components/ui/MetricCard'
import { PageHeader } from '@/components/ui/PageHeader'

async function getAgencyData() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
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

  const [
    { data: agency },
    { count: total },
    { count: toContact },
    { count: meetings },
    { count: mandates },
  ] = await Promise.all([
    admin.from('agencies').select('name, city').eq('id', membership.agency_id).single(),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', membership.agency_id),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', membership.agency_id).eq('status', 'new'),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', membership.agency_id).eq('status', 'meeting'),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('agency_id', membership.agency_id).eq('status', 'mandate'),
  ])

  return { agency, total, toContact, meetings, mandates, agencyId: membership.agency_id }
}

export default async function AgencyDashboard() {
  const data = await getAgencyData()
  if (!data) return null

  const { agency, total, toContact, meetings, mandates } = data

  return (
    <div>
      <PageHeader
        title={agency?.name || 'Dashboard'}
        subtitle={`${agency?.city || ''} — Dashboard mensile`}
        live
      />

      <div className="grid grid-cols-4 rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
        <MetricCard label="Lead ricevuti" value={total ?? 0} />
        <MetricCard label="Da contattare" value={toContact ?? 0} sub="status: nuovo" />
        <MetricCard label="Appuntamenti" value={meetings ?? 0} sub="meeting fissati" />
        <MetricCard label="Mandati" value={mandates ?? 0} showBorder={false} sub="contratti firmati" />
      </div>
    </div>
  )
}
