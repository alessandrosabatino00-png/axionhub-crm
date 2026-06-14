import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7)

  const startDate = `${month}-01`
  const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString().slice(0, 10)

  const { data: agencies } = await supabaseAdmin
    .from('agencies')
    .select('id, name, email, city')
    .eq('active', true)

  if (!agencies) return NextResponse.json({ error: 'No agencies' }, { status: 500 })

  const billing = await Promise.all(
    agencies.map(async (agency) => {
      const { data: leads } = await supabaseAdmin
        .from('leads')
        .select('id, name, phone, created_at, lead_class')
        .eq('agency_id', agency.id)
        .eq('lead_class', 'A')
        .gte('created_at', startDate)
        .lt('created_at', endDate)
        .order('created_at', { ascending: true })

      const leadsA = leads || []
      const total = leadsA.length * 120

      return {
        agency,
        leads: leadsA,
        count: leadsA.length,
        total
      }
    })
  )

  return NextResponse.json({ billing, month })
}
