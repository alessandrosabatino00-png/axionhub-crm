import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-ghl-secret')
  if (secret !== process.env.GHL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawBody = await req.json()

  // GHL invia i custom data dentro "customData" — uniamo i due livelli
  const body = { ...rawBody, ...(rawBody.customData || {}) }

  const { name, phone, email, score, lead_class, agency_id, cap, estimated_value, ghl_contact_id, property_type, size_sqm, address, city } = body

  if (!name || !phone || !ghl_contact_id) {
    console.error('Missing fields. Received:', JSON.stringify(rawBody))
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Normalizza lead_class — accetta "A", "lead a", o tag multipli "lead a, altro"
  let normalizedClass = ''
  if (typeof lead_class === 'string') {
    const lower = lead_class.toLowerCase()
    if (lower.includes('lead a') || lower.trim() === 'a') normalizedClass = 'A'
    else if (lower.includes('lead b') || lower.trim() === 'b') normalizedClass = 'B'
    else if (lower.includes('lead c') || lower.trim() === 'c') normalizedClass = 'C'
  }

  if (!['A','B','C'].includes(normalizedClass)) {
    console.error('Invalid lead_class. Received:', lead_class)
    return NextResponse.json({ error: 'Invalid lead_class', received: lead_class }, { status: 400 })
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
        city: city || 'torino',
        address,
        property_type,
        size_sqm: size_sqm ? parseInt(size_sqm) : null,
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
