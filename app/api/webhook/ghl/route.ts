import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GHL manda la stringa "undefined" per i campi vuoti — convertiamo in null
function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const v = value.trim()
  if (!v || v === 'undefined' || v === 'null') return null
  return v
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-ghl-secret')
  if (secret !== process.env.GHL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawBody = await req.json()
  const body = { ...rawBody, ...(rawBody.customData || {}) }

  const name = clean(body.name)
  const phone = clean(body.phone)
  const email = clean(body.email)
  const cap = clean(body.cap)
  const city = clean(body.city)
  const address = clean(body.address)
  const property_type = clean(body.property_type)
  const ghl_contact_id = clean(body.ghl_contact_id)
  const agency_id = clean(body.agency_id)

  if (!name || !phone || !ghl_contact_id) {
    console.error('Missing fields. Received:', JSON.stringify(rawBody))
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Normalizza lead_class
  let normalizedClass = ''
  const leadClassRaw = clean(body.lead_class) || ''
  const lower = leadClassRaw.toLowerCase()
  if (lower.includes('lead a') || lower === 'a') normalizedClass = 'A'
  else if (lower.includes('lead b') || lower === 'b') normalizedClass = 'B'
  else if (lower.includes('lead c') || lower === 'c') normalizedClass = 'C'

  if (!['A','B','C'].includes(normalizedClass)) {
    console.error('Invalid lead_class. Received:', leadClassRaw)
    return NextResponse.json({ error: 'Invalid lead_class', received: leadClassRaw }, { status: 400 })
  }

  const scoreNum = parseInt(clean(body.score) || '0') || 0
  const sizeNum = parseInt(clean(body.size_sqm) || '') || null
  const valueNum = parseFloat(clean(body.estimated_value) || '') || null

  const { data, error } = await supabaseAdmin
    .from('leads')
    .upsert(
      {
        name,
        phone,
        email,
        score: scoreNum,
        lead_class: normalizedClass,
        agency_id,
        cap,
        city: city || 'torino',
        address,
        property_type,
        size_sqm: sizeNum,
        estimated_value: valueNum,
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
