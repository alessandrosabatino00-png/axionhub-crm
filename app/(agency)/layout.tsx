import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Sidebar from '@/components/layout/Sidebar'

export default async function AgencyLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {}
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('agency_users')
    .select('role, agency_id')
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'agent') redirect('/login')

  const { data: agency } = await supabase
    .from('agencies')
    .select('name, subscription_active')
    .eq('id', membership.agency_id)
    .single()

  if (!agency?.subscription_active) redirect('/subscription-required')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A14' }}>
      <Sidebar role="agent" agencyName={agency.name} />
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  )
}
