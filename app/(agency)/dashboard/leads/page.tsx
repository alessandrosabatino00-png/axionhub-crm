import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import LeadTable from '@/components/leads/LeadTable'
import { PageHeader } from '@/components/ui/PageHeader'

async function getLeads() {
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

  const { data: leads } = await admin
    .from('leads')
    .select('*')
    .eq('agency_id', membership.agency_id)
    .order('created_at', { ascending: false })

  return { leads: leads || [], agencyId: membership.agency_id, userId: user.id }
}

export default async function AgencyLeadsPage() {
  const data = await getLeads()
  if (!data) return null

  return (
    <div>
      <PageHeader title="I miei lead" subtitle={`${data.leads.length} lead totali`} live />
      <LeadTable
        initialLeads={data.leads}
        agencyId={data.agencyId}
        userId={data.userId}
      />
    </div>
  )
}
