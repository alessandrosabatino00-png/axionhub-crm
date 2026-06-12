const GHL_API_KEY = process.env.GHL_API_KEY!
const GHL_BASE_URL = 'https://rest.gohighlevel.com/v1'

// Mappatura stati CRM → custom field GHL
const STATUS_MAP: Record<string, string> = {
  new: 'Nuovo',
  contacted: 'Contattato',
  meeting: 'Appuntamento',
  mandate: 'Mandato',
  lost: 'Perso'
}

export async function updateGHLContactStatus(
  ghlContactId: string,
  status: string
) {
  const ghlStatus = STATUS_MAP[status]
  if (!ghlStatus) throw new Error(`Stato non mappato: ${status}`)

  const res = await fetch(`${GHL_BASE_URL}/contacts/${ghlContactId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customField: {
        crm_status: ghlStatus
      }
    })
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`GHL API error: ${error}`)
  }

  return res.json()
}
