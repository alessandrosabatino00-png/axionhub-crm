'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Impostazioni</h1>
        <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>
          Gestione agenzie e configurazione
        </p>
      </div>

      <div
        className="rounded-xl border p-6 space-y-5"
        style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
      >
        <h2 className="text-base font-semibold text-white">Nuova agenzia</h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: '#CBD5E1' }}>Nome agenzia</label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Immobiliare Rossi"
                required
                style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', color: '#FFFFFF' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: '#CBD5E1' }}>Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="info@agenzia.it"
                required
                style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', color: '#FFFFFF' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: '#CBD5E1' }}>Città</label>
              <Input
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="Torino"
                style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', color: '#FFFFFF' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: '#CBD5E1' }}>SLA ore</label>
              <Input
                type="number"
                value={form.sla_hours}
                onChange={e => setForm({ ...form, sla_hours: e.target.value })}
                min="1"
                style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', color: '#FFFFFF' }}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#4F46E5', color: '#FFFFFF' }}
          >
            {loading ? 'Creazione in corso...' : 'Crea agenzia e genera link pagamento'}
          </Button>
        </form>

        {result?.success && (
          <div
            className="rounded-lg p-4 space-y-2"
            style={{ backgroundColor: '#064E3B22', border: '0.5px solid #10B981' }}
          >
            <p className="text-sm font-medium" style={{ color: '#10B981' }}>
              ✅ Agenzia creata con successo
            </p>
            <p className="text-xs" style={{ color: '#CBD5E1' }}>Link pagamento Stripe:</p>
            <p className="text-xs break-all" style={{ color: '#4F46E5' }}>
              {result.url}
            </p>
            <Button
              onClick={() => window.open(result.url, '_blank')}
              className="text-xs h-7 px-3"
              style={{ backgroundColor: '#4F46E5', color: '#FFFFFF' }}
            >
              Apri link pagamento
            </Button>
          </div>
        )}

        {result?.error && (
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: '#450A0A22', border: '0.5px solid #EF4444' }}
          >
            <p className="text-sm" style={{ color: '#EF4444' }}>❌ {result.error}</p>
          </div>
        )}
      </div>

      <div
        className="rounded-xl border p-6 space-y-3"
        style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}
      >
        <h2 className="text-base font-semibold text-white">Webhook GHL</h2>
        <p className="text-xs" style={{ color: '#CBD5E1' }}>
          Configura questo URL come endpoint webhook in GoHighLevel:
        </p>
        <code
          className="block text-xs p-3 rounded-lg"
          style={{ backgroundColor: '#0A0A14', color: '#06B6D4' }}
        >
          {origin}/api/webhook/ghl
        </code>
      </div>
    </div>
  )
}
