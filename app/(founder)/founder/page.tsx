import { createClient } from '@supabase/supabase-js'
import MetricCard from '@/components/ui/MetricCard'
import { PageHeader } from '@/components/ui/PageHeader'

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
  const hasUnhandled = (unhandledLeads ?? 0) > 0

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Vista aggregata — tutte le agenzie"
        live
      />

      <div className="grid grid-cols-5 rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
        <MetricCard label="Lead totali" value={totalLeads ?? 0} />
        <MetricCard label="Agenzie attive" value={activeAgencies ?? 0} />
        <MetricCard
          label="Non gestiti"
          value={unhandledLeads ?? 0}
          critical={hasUnhandled}
          sub={hasUnhandled ? 'clicca per gestire' : 'tutto sotto controllo'}
        />
        <MetricCard label="Mandati" value={mandates ?? 0} sub="contratti firmati" />
        <MetricCard label="Tasso conversione" value={`${convRate}%`} showBorder={false} sub="lead → mandato" />
      </div>
    </div>
  )
}
