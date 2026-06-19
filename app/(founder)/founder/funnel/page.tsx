'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import MetricCard from '@/components/ui/MetricCard'

interface FunnelStep {
  label: string
  value: number
  color: string
}

export default function FunnelPage() {
  const [leads, setLeads] = useState({
    total: 0,
    contacted: 0,
    meeting: 0,
    mandate: 0,
  })
  const [snapshot, setSnapshot] = useState({ ad_clicks: 0, budget: 0 })
  const [form, setForm] = useState({ ad_clicks: '', budget: '', campaign: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/founder/funnel')
      const data = await res.json()
      setLeads(data.leads)
      setSnapshot(data.snapshot)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/founder/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ad_clicks: parseInt(form.ad_clicks) || 0,
        budget: parseFloat(form.budget) || 0,
        campaign: form.campaign,
        date: new Date().toISOString().split('T')[0]
      })
    })
    setSaving(false)
    setForm({ ad_clicks: '', budget: '', campaign: '' })
    window.location.reload()
  }

  const steps: FunnelStep[] = [
    { label: 'Click Meta Ads', value: snapshot.ad_clicks, color: 'var(--ax-blue)' },
    { label: 'Lead qualificati', value: leads.total, color: 'var(--ax-cyan)' },
    { label: 'Contattati', value: leads.contacted, color: '#F59E0B' },
    { label: 'Appuntamenti', value: leads.meeting, color: '#A78BFA' },
    { label: 'Mandati firmati', value: leads.mandate, color: '#10B981' },
  ]

  const max = Math.max(...steps.map(s => s.value), 1)

  const cpl = snapshot.ad_clicks && leads.total
    ? (snapshot.budget / leads.total).toFixed(2)
    : '—'

  const closeRate = leads.total && leads.mandate
    ? ((leads.mandate / leads.total) * 100).toFixed(1)
    : '0.0'

  return (
    <div>
      <PageHeader title="Funnel" subtitle="Conversione end-to-end ads → mandati" />

      <div className="space-y-5 max-w-3xl">
        <div className="grid grid-cols-3 rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
          <MetricCard label="CPL qualificato" value={cpl === '—' ? '—' : `€${cpl}`} />
          <MetricCard label="Tasso chiusura" value={`${closeRate}%`} />
          <MetricCard label="Budget ads" value={snapshot.budget ? `€${snapshot.budget}` : '—'} showBorder={false} />
        </div>

        <div
          className="rounded-[12px] p-6 space-y-4"
          style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}
        >
          <h2 className="text-[13px] font-semibold" style={{ color: 'var(--ax-t1)' }}>Fasi del funnel</h2>
          {loading ? (
            <p className="text-[12px]" style={{ color: 'var(--ax-t3)' }}>Caricamento...</p>
          ) : (
            steps.map((step, i) => {
              const pct = Math.round((step.value / max) * 100)
              const convPrev = i > 0 && steps[i-1].value > 0
                ? ((step.value / steps[i-1].value) * 100).toFixed(1)
                : null
              return (
                <div key={step.label} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]" style={{ color: 'var(--ax-t2)' }}>{step.label}</span>
                    <div className="flex items-center gap-3">
                      {convPrev && (
                        <span className="text-[10px] font-mono" style={{ color: 'var(--ax-t3)' }}>
                          conv. {convPrev}%
                        </span>
                      )}
                      <span className="text-[13px] font-bold font-mono" style={{ color: 'var(--ax-t1)' }}>{step.value}</span>
                    </div>
                  </div>
                  <div className="h-[6px] rounded-full" style={{ background: 'var(--ax-bg3)' }}>
                    <div
                      className="h-[6px] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, background: step.color }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div
          className="rounded-[12px] p-6 space-y-4"
          style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}
        >
          <h2 className="text-[13px] font-semibold" style={{ color: 'var(--ax-t1)' }}>Inserimento dati ads</h2>
          <form onSubmit={handleSave} className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>Click ads</label>
              <input
                type="number"
                value={form.ad_clicks}
                onChange={e => setForm({ ...form, ad_clicks: e.target.value })}
                placeholder="0"
                className="w-full text-[12px] rounded-[8px] px-3 py-2"
                style={{ background: 'var(--ax-bg3)', border: '0.5px solid var(--ax-border)', color: 'var(--ax-t1)' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>Budget €</label>
              <input
                type="number"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
                placeholder="0"
                className="w-full text-[12px] rounded-[8px] px-3 py-2"
                style={{ background: 'var(--ax-bg3)', border: '0.5px solid var(--ax-border)', color: 'var(--ax-t1)' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>Campagna</label>
              <input
                type="text"
                value={form.campaign}
                onChange={e => setForm({ ...form, campaign: e.target.value })}
                placeholder="Nome campagna"
                className="w-full text-[12px] rounded-[8px] px-3 py-2"
                style={{ background: 'var(--ax-bg3)', border: '0.5px solid var(--ax-border)', color: 'var(--ax-t1)' }}
              />
            </div>
            <div className="col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-[8px] text-[12px] font-medium transition-opacity disabled:opacity-50"
                style={{ background: 'var(--ax-blue)', color: '#FFFFFF' }}
              >
                {saving ? 'Salvataggio...' : 'Salva dati'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
