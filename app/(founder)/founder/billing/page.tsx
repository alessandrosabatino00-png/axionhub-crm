'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileText, Download } from 'lucide-react'

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

    doc.setFontSize(20)
    doc.setTextColor(26, 79, 214)
    doc.text('AXION', 20, 25)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text('Real Estate Intelligence', 20, 32)

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text(`Report Lead — ${monthLabel}`, 20, 48)

    doc.setFontSize(10)
    doc.setTextColor(60)
    doc.text(`Agenzia: ${item.agency.name}`, 20, 60)
    doc.text(`Email: ${item.agency.email}`, 20, 67)
    doc.text(`Città: ${item.agency.city || '—'}`, 20, 74)

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
      headStyles: { fillColor: [26, 79, 214] },
    })

    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text(`Totale da fatturare: € ${item.total.toLocaleString('it-IT')},00`, 20, finalY)

    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text('Bonifico a: AXION', 20, finalY + 12)
    doc.text('IBAN: DA CONFIGURARE', 20, finalY + 19)
    doc.text('Causale: Lead immobiliari ' + monthLabel, 20, finalY + 26)

    doc.save(`report_${item.agency.name.replace(/\s/g, '_')}_${month}.pdf`)
  }

  const totalMonth = billing.reduce((sum, b) => sum + b.total, 0)

  return (
    <div>
      <PageHeader
        title="Fatturazione"
        subtitle="Report mensile lead A per agenzia"
        actions={
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="text-[12px] rounded-[8px] px-3 py-1.5"
            style={{ background: 'var(--ax-bg3)', border: '0.5px solid var(--ax-border)', color: 'var(--ax-t1)' }}
          />
        }
      />

      <div
        className="rounded-[12px] p-5 mb-5"
        style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.8px]" style={{ color: 'var(--ax-t3)' }}>
          Totale da incassare nel mese
        </p>
        <p className="text-[28px] font-bold font-mono mt-1" style={{ color: 'var(--ax-t1)' }}>
          € {totalMonth.toLocaleString('it-IT')},00
        </p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ax-t3)' }} className="text-[12px]">Caricamento...</p>
      ) : billing.length === 0 ? (
        <div className="rounded-[12px]" style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}>
          <EmptyState icon={FileText} title="Nessun dato per questo mese" />
        </div>
      ) : (
        <div className="space-y-3">
          {billing.map(item => (
            <div
              key={item.agency.id}
              className="rounded-[12px] p-5 space-y-4"
              style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[13px]" style={{ color: 'var(--ax-t1)' }}>{item.agency.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--ax-t3)' }}>{item.agency.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{item.count} lead A</p>
                    <p className="font-bold font-mono text-[14px]" style={{ color: 'var(--ax-t1)' }}>
                      € {item.total.toLocaleString('it-IT')},00
                    </p>
                  </div>
                  <button
                    onClick={() => downloadPDF(item)}
                    disabled={item.count === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[11px] font-medium disabled:opacity-40 transition-colors"
                    style={{ background: 'var(--ax-blue)', color: '#FFFFFF' }}
                  >
                    <Download size={12} />
                    Scarica PDF
                  </button>
                </div>
              </div>

              {item.leads.length > 0 && (
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ borderBottom: '0.5px solid var(--ax-border)' }}>
                      {['#', 'Proprietario', 'Telefono', 'Data ricezione', 'Importo'].map(h => (
                        <th key={h} className="pb-2 text-left font-medium" style={{ color: 'var(--ax-t3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.leads.map((lead, i) => (
                      <tr key={lead.id} style={{ borderBottom: '0.5px solid var(--ax-border)' }}>
                        <td className="py-2" style={{ color: 'var(--ax-t3)' }}>{i + 1}</td>
                        <td className="py-2" style={{ color: 'var(--ax-t1)' }}>{lead.name}</td>
                        <td className="py-2" style={{ color: 'var(--ax-t2)' }}>{lead.phone}</td>
                        <td className="py-2" style={{ color: 'var(--ax-t2)' }}>
                          {new Date(lead.created_at).toLocaleDateString('it-IT')}
                        </td>
                        <td className="py-2 font-mono" style={{ color: '#10B981' }}>€ 120,00</td>
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
