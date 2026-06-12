import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-ghl-secret')
  if (secret !== process.env.GHL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, phone, email, score, lead_class, agency_id, cap, estimated_value, ghl_contact_id } = body

  if (!name || !phone || !ghl_contact_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Normalizza lead_class — accetta sia "A" che "lead a"
  let normalizedClass = lead_class
  if (typeof lead_class === 'string') {
    const lower = lead_class.toLowerCase().trim()
    if (lower.includes('a')) normalizedClass = 'A'
    else if (lower.includes('b')) normalizedClass = 'B'
    else if (lower.includes('c')) normalizedClass = 'C'
  }

  if (!['A','B','C'].includes(normalizedClass)) {
    return NextResponse.json({ error: 'Invalid lead_class' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .upsert(
      {
        name,
        phone,
        email,
        score: parseInt(score) || 0,
        lead_class: normalizedClass,
        agency_id: agency_id || null,
        cap,
        estimated_value: estimated_value ? parseFloat(estimated_value) : null,
        ghl_contact_id,
        status: 'new',
        source: 'meta_ads'
      },
      { onConflict: 'ghl_contact_id' }
    )
    .select('id')
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, lead_id: data.id })
}
