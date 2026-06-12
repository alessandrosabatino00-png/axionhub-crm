import { createClient } from '@supabase/supabase-js'
import MetricCard from '@/components/ui/MetricCard'

async function getMetrics() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { count: totalLeads },
    { count: activeAgencies },
    { count: unhandledLeads },
    { count: mandates },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('agencies').select('*', { count: 'exact', head: true }).eq('active', true).eq('subscription_active', true),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'mandate'),
  ])

  const convRate = totalLeads && mandates
    ? ((mandates / totalLeads) * 100).toFixed(1)
    : '0.0'

  return { totalLeads, activeAgencies, unhandledLeads, mandates, convRate }
}

export default async function FounderDashboard() {
  const { totalLeads, activeAgencies, unhandledLeads, mandates, convRate } = await getMetrics()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          Vista aggregata — tutte le agenzie
        </p>
      </div>

      {/* Metriche */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard
          label="Lead totali"
          value={totalLeads ?? 0}
        />
        <MetricCard
          label="Agenzie attive"
          value={activeAgencies ?? 0}
          accent="#06B6D4"
        />
        <MetricCard
          label="Non gestiti"
          value={unhandledLeads ?? 0}
          accent={unhandledLeads && unhandledLeads > 0 ? '#F59E0B' : '#10B981'}
        />
        <MetricCard
          label="Mandati"
          value={mandates ?? 0}
          accent="#10B981"
        />
        <MetricCard
          label="Tasso conversione"
          value={`${convRate}%`}
          accent="#4F46E5"
        />
      </div>
    </div>
  )
}
