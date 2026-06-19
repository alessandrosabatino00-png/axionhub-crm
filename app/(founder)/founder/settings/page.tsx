'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/PageHeader'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    sla_hours: '2',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; url?: string; error?: string } | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/agencies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const checkoutRes = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agency_id: data.agency_id })
      })
      const checkoutData = await checkoutRes.json()
      setResult({ success: true, url: checkoutData.url })
      setForm({ name: '', email: '', city: '', sla_hours: '2' })
    } catch (err: any) {
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div>
      <PageHeader title="Impostazioni" subtitle="Gestione agenzie e configurazione" />

      <div className="space-y-5 max-w-2xl">
        <div
          className="rounded-[12px] p-6 space-y-5"
          style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}
        >
          <h2 className="text-[13px] font-semibold" style={{ color: 'var(--ax-t1)' }}>Nuova agenzia</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium" style={{ color: 'var(--ax-t3)' }}>Nome agenzia</label>
                <Input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Immobiliare Rossi"
                  required
                  style={{ background: 'var(--ax-bg3)', borderColor: 'var(--ax-border)', color: 'var(--ax-t1)' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium" style={{ color: 'var(--ax-t3)' }}>Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="info@agenzia.it"
                  required
                  style={{ background: 'var(--ax-bg3)', borderColor: 'var(--ax-border)', color: 'var(--ax-t1)' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium" style={{ color: 'var(--ax-t3)' }}>Città</label>
                <Input
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Torino"
                  style={{ background: 'var(--ax-bg3)', borderColor: 'var(--ax-border)', color: 'var(--ax-t1)' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium" style={{ color: 'var(--ax-t3)' }}>SLA ore</label>
                <Input
                  type="number"
                  value={form.sla_hours}
                  onChange={e => setForm({ ...form, sla_hours: e.target.value })}
                  min="1"
                  style={{ background: 'var(--ax-bg3)', borderColor: 'var(--ax-border)', color: 'var(--ax-t1)' }}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{ background: 'var(--ax-blue)', color: '#FFFFFF' }}
            >
              {loading ? 'Creazione in corso...' : 'Crea agenzia e genera link pagamento'}
            </Button>
          </form>

          {result?.success && (
            <div
              className="rounded-[10px] p-4 space-y-2"
              style={{ background: 'rgba(16,185,129,0.08)', border: '0.5px solid rgba(16,185,129,0.3)' }}
            >
              <p className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: '#10B981' }}>
                <CheckCircle2 size={14} /> Agenzia creata con successo
              </p>
              <p className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>Link pagamento Stripe:</p>
              <p className="text-[11px] break-all" style={{ color: 'var(--ax-blue)' }}>
                {result.url}
              </p>
              <Button
                onClick={() => window.open(result.url, '_blank')}
                className="text-[11px] h-7 px-3"
                style={{ background: 'var(--ax-blue)', color: '#FFFFFF' }}
              >
                Apri link pagamento
              </Button>
            </div>
          )}

          {result?.error && (
            <div
              className="rounded-[10px] p-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.3)' }}
            >
              <p className="text-[12px] flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                <XCircle size={14} /> {result.error}
              </p>
            </div>
          )}
        </div>

        <div
          className="rounded-[12px] p-6 space-y-3"
          style={{ background: 'var(--ax-bg2)', border: '0.5px solid var(--ax-border)' }}
        >
          <h2 className="text-[13px] font-semibold" style={{ color: 'var(--ax-t1)' }}>Webhook GHL</h2>
          <p className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>
            Configura questo URL come endpoint webhook in GoHighLevel:
          </p>
          <code
            className="block text-[11px] p-3 rounded-[8px] font-mono"
            style={{ background: 'var(--ax-bg3)', color: 'var(--ax-cyan)' }}
          >
            {origin}/api/webhook/ghl
          </code>
        </div>
      </div>
    </div>
  )
}
