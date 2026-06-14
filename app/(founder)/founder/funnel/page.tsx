'use client'

import { useState, useEffect } from 'react'

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
    { label: 'Click Meta Ads', value: snapshot.ad_clicks, color: '#4F46E5' },
    { label: 'Lead qualificati', value: leads.total, color: '#06B6D4' },
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
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Funnel</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          Conversione end-to-end ads → mandati
        </p>
      </div>

      {/* Metriche derivate */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'CPL qualificato', value: cpl === '—' ? '—' : `€${cpl}` },
          { label: 'Tasso chiusura', value: `${closeRate}%` },
          { label: 'Budget ads', value: snapshot.budget ? `€${snapshot.budget}` : '—' },
        ].map(m => (
          <div
            key={m.label}
            className="rounded-xl border p-4"
            style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
          >
            <p className="text-xs uppercase tracking-wider" style={{ color: '#CBD5E1' }}>{m.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Barre funnel */}
      <div
        className="rounded-xl border p-6 space-y-4"
        style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
      >
        <h2 className="text-base font-semibold text-white">Fasi del funnel</h2>
        {loading ? (
          <p style={{ color: '#CBD5E1' }}>Caricamento...</p>
        ) : (
          steps.map((step, i) => {
            const pct = Math.round((step.value / max) * 100)
            const convPrev = i > 0 && steps[i-1].value > 0
              ? ((step.value / steps[i-1].value) * 100).toFixed(1)
              : null
            return (
              <div key={step.label} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#CBD5E1' }}>{step.label}</span>
                  <div className="flex items-center gap-3">
                    {convPrev && (
                      <span className="text-xs" style={{ color: '#CBD5E1' }}>
                        conv. {convPrev}%
                      </span>
                    )}
                    <span className="text-sm font-bold text-white">{step.value}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: '#1E293B' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: step.color }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Form inserimento manuale */}
      <div
        className="rounded-xl border p-6 space-y-4"
        style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
      >
        <h2 className="text-base font-semibold text-white">Inserimento dati ads</h2>
        <form onSubmit={handleSave} className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs" style={{ color: '#CBD5E1' }}>Click ads</label>
            <input
              type="number"
              value={form.ad_clicks}
              onChange={e => setForm({ ...form, ad_clicks: e.target.value })}
              placeholder="0"
              className="w-full text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', border: '0.5px solid #1E293B', color: '#FFFFFF' }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs" style={{ color: '#CBD5E1' }}>Budget €</label>
            <input
              type="number"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="0"
              className="w-full text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', border: '0.5px solid #1E293B', color: '#FFFFFF' }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs" style={{ color: '#CBD5E1' }}>Campagna</label>
            <input
              type="text"
              value={form.campaign}
              onChange={e => setForm({ ...form, campaign: e.target.value })}
              placeholder="Nome campagna"
              className="w-full text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', border: '0.5px solid #1E293B', color: '#FFFFFF' }}
            />
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#4F46E5', color: '#FFFFFF' }}
            >
              {saving ? 'Salvataggio...' : 'Salva dati'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
