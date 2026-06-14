import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const v = value.trim()
  if (!v || v === 'undefined' || v === 'null') return null
  return v
}

async function assignAgency(leadClass: string): Promise<string | null> {
  // Prende solo agenzie attive con abbonamento attivo
  const { data: agencies } = await supabaseAdmin
    .from('agencies')
    .select('id, plan, last_lead_assigned_at')
    .eq('active', true)
    .eq('subscription_active', true)
    .order('last_lead_assigned_at', { ascending: true, nullsFirst: true })

  if (!agencies || agencies.length === 0) return null

  // Lead B: solo agenzie con piano premium
  if (leadClass === 'B') {
    const premium = agencies.filter(a => a.plan === 'premium')
    if (premium.length === 0) return null
    return premium[0].id
  }

  // Lead A: prima agenzia in ordine di last_lead_assigned_at (round robin)
  if (leadClass === 'A') {
    return agencies[0].id
  }

  // Lead C: non assegnati automaticamente
  return null
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
    return NextResponse.json({ error: 'Invalid lead_class', received: leadClassRaw }, { status: 400 })
  }

  const scoreNum = parseInt(clean(body.score) || '0') || 0
  const sizeNum = parseInt(clean(body.size_sqm) || '') || null
  const valueNum = parseFloat(clean(body.estimated_value) || '') || null

  // Round robin — assegna agenzia automaticamente
  const agency_id = await assignAgency(normalizedClass)

  // Inserisce il lead
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

  // Aggiorna last_lead_assigned_at per il round robin
  if (agency_id) {
    await supabaseAdmin
      .from('agencies')
      .update({ last_lead_assigned_at: new Date().toISOString() })
      .eq('id', agency_id)
  }

  return NextResponse.json({ success: true, lead_id: data.id, assigned_to: agency_id })
}
