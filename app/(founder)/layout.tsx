import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Sidebar from '@/components/layout/Sidebar'

export default async function FounderLayout({ children }: { children: React.ReactNode }) {
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
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'founder') redirect('/login')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A14' }}>
      <Sidebar role="founder" />
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  )
}
