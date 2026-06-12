import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import MetricCard from '@/components/ui/MetricCard'

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{agency?.name}</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          {agency?.city} — Dashboard mensile
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Lead ricevuti" value={total ?? 0} />
        <MetricCard label="Da contattare" value={toContact ?? 0} accent="#F59E0B" />
        <MetricCard label="Appuntamenti" value={meetings ?? 0} accent="#A78BFA" />
        <MetricCard label="Mandati" value={mandates ?? 0} accent="#10B981" />
      </div>
    </div>
  )
}
