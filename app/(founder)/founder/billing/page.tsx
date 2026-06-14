'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  name: string
  phone: string
  created_at: string
  lead_class: string
}

interface AgencyBilling {
  agency: { id: string; name: string; email: string; city: string }
  leads: Lead[]
  count: number
  total: number
}

export default function BillingPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [billing, setBilling] = useState<AgencyBilling[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(`/api/founder/billing?month=${month}`)
      const data = await res.json()
      setBilling(data.billing || [])
      setLoading(false)
    }
    load()
  }, [month])

  async function downloadPDF(item: AgencyBilling) {
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF()
    const monthLabel = new Date(month + '-01').toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })

    // Header
    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text('AXIONHub', 20, 25)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text('CRM Immobiliare', 20, 32)

    // Titolo
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text(`Report Lead — ${monthLabel}`, 20, 48)

    // Dati agenzia
    doc.setFontSize(10)
    doc.setTextColor(60)
    doc.text(`Agenzia: ${item.agency.name}`, 20, 60)
    doc.text(`Email: ${item.agency.email}`, 20, 67)
    doc.text(`Città: ${item.agency.city || '—'}`, 20, 74)

    // Tabella lead
    autoTable(doc, {
      startY: 85,
      head: [['#', 'Proprietario', 'Telefono', 'Data ricezione', 'Classe', 'Importo']],
      body: item.leads.map((lead, i) => [
        i + 1,
        lead.name,
        lead.phone,
        new Date(lead.created_at).toLocaleDateString('it-IT'),
        'A',
        '€ 120,00'
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] },
    })

    // Totale
    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text(`Totale da fatturare: € ${item.total.toLocaleString('it-IT')},00`, 20, finalY)

    // IBAN
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text('Bonifico a: AXIONHub', 20, finalY + 12)
    doc.text('IBAN: DA CONFIGURARE', 20, finalY + 19)
    doc.text('Causale: Lead immobiliari ' + monthLabel, 20, finalY + 26)

    doc.save(`report_${item.agency.name.replace(/\s/g, '_')}_${month}.pdf`)
  }

  const totalMonth = billing.reduce((sum, b) => sum + b.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fatturazione</h1>
          <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
            Report mensile lead A per agenzia
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="text-sm rounded-lg px-3 py-2"
          style={{ backgroundColor: '#16161F', border: '0.5px solid #1E293B', color: '#FFFFFF' }}
        />
      </div>

      {/* Totale mese */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
      >
        <p className="text-xs uppercase tracking-wider" style={{ color: '#CBD5E1' }}>Totale da incassare nel mese</p>
        <p className="text-3xl font-bold text-white mt-1">€ {totalMonth.toLocaleString('it-IT')},00</p>
      </div>

      {/* Tabella per agenzia */}
      {loading ? (
        <p style={{ color: '#CBD5E1' }}>Caricamento...</p>
      ) : billing.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
        >
          <p className="font-medium text-white">Nessun dato per questo mese</p>
        </div>
      ) : (
        <div className="space-y-4">
          {billing.map(item => (
            <div
              key={item.agency.id}
              className="rounded-xl border p-5 space-y-4"
              style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{item.agency.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#CBD5E1' }}>{item.agency.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: '#CBD5E1' }}>{item.count} lead A</p>
                    <p className="font-bold text-white">€ {item.total.toLocaleString('it-IT')},00</p>
                  </div>
                  <button
                    onClick={() => downloadPDF(item)}
                    disabled={item.count === 0}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40"
                    style={{ backgroundColor: '#4F46E5', color: '#FFFFFF' }}
                  >
                    Scarica PDF
                  </button>
                </div>
              </div>

              {item.leads.length > 0 && (
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: '0.5px solid #1E293B' }}>
                      {['#', 'Proprietario', 'Telefono', 'Data ricezione', 'Importo'].map(h => (
                        <th key={h} className="pb-2 text-left font-medium" style={{ color: '#CBD5E1' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.leads.map((lead, i) => (
                      <tr key={lead.id} style={{ borderBottom: '0.5px solid #1E293B' }}>
                        <td className="py-2" style={{ color: '#CBD5E1' }}>{i + 1}</td>
                        <td className="py-2 text-white">{lead.name}</td>
                        <td className="py-2" style={{ color: '#CBD5E1' }}>{lead.phone}</td>
                        <td className="py-2" style={{ color: '#CBD5E1' }}>
                          {new Date(lead.created_at).toLocaleDateString('it-IT')}
                        </td>
                        <td className="py-2" style={{ color: '#10B981' }}>€ 120,00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
