'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/ui/StatusBadge'

const STATUSES = ['new', 'contacted', 'meeting', 'mandate', 'lost']

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 24) return `${Math.floor(h / 24)}g fa`
  if (h > 0) return `${h}h fa`
  return `${m}m fa`
}

function rowBg(lead: any) {
  if (lead.status !== 'new') return 'transparent'
  const hours = (Date.now() - new Date(lead.status_updated_at).getTime()) / 3600000
  if (hours >= 48) return '#450A0A22'
  if (hours >= 2) return '#451A0322'
  return 'transparent'
}

interface LeadTableProps {
  initialLeads: any[]
  agencyId: string
  userId: string
}

export default function LeadTable({ initialLeads, agencyId, userId }: LeadTableProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [savingNote, setSavingNote] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  // Realtime: nuovi lead in cima senza refresh
  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads', filter: `agency_id=eq.${agencyId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads(prev => [payload.new as any, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setLeads(prev => prev.map(l => l.id === (payload.new as any).id ? payload.new as any : l))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [agencyId])

  async function handleStatusChange(leadId: string, newStatus: string) {
    await fetch('/api/leads/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId, new_status: newStatus, user_id: userId, agency_id: agencyId })
    })
  }

  async function handleNoteSave(leadId: string) {
    setSavingNote(leadId)
    await fetch('/api/leads/note', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId, notes: notes[leadId] })
    })
    setSavingNote(null)
  }

  const filters = [
    { key: 'all', label: 'Tutti' },
    { key: 'A', label: 'Lead A' },
    { key: 'B', label: 'Lead B' },
    { key: 'new', label: 'Da contattare' },
    { key: 'mandate', label: 'Mandato' },
  ]

  const filtered = leads.filter(l => {
    if (filter === 'all') return true
    if (filter === 'A' || filter === 'B' || filter === 'C') return l.lead_class === filter
    return l.status === filter
  })

  return (
    <div className="space-y-4">
      {/* Filtri pill */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: filter === f.key ? '#4F46E5' : '#16161F',
              color: filter === f.key ? '#FFFFFF' : '#CBD5E1',
              border: '0.5px solid',
              borderColor: filter === f.key ? '#4F46E5' : '#1E293B'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabella */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#16161F', borderBottom: '0.5px solid #1E293B' }}>
              {['Proprietario', 'Immobile', 'Classe', 'Valore', 'Stato', 'Ricevuto', 'Note'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#CBD5E1' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center" style={{ color: '#CBD5E1' }}>
                  Nessun lead in questa categoria.
                </td>
              </tr>
            )}
            {filtered.map((lead: any) => (
              <tr key={lead.id} style={{ backgroundColor: rowBg(lead), borderBottom: '0.5px solid #1E293B' }}>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{lead.name}</div>
                  <div className="text-xs" style={{ color: '#CBD5E1' }}>{lead.phone}</div>
                </td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                  <div>{lead.address || lead.cap || '—'}</div>
                  <div className="text-xs">{lead.property_type || ''}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.lead_class} type="class" />
                </td>
                <td className="px-4 py-3" style={{ color: '#CBD5E1' }}>
                  {lead.estimated_value ? `€${Number(lead.estimated_value).toLocaleString('it-IT')}` : '—'}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={e => handleStatusChange(lead.id, e.target.value)}
                    className="text-xs rounded px-2 py-1 border-0 outline-none cursor-pointer"
                    style={{ backgroundColor: '#0A0A14', color: '#FFFFFF', border: '0.5px solid #1E293B' }}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#CBD5E1' }}>
                  {timeAgo(lead.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Aggiungi nota..."
                      value={notes[lead.id] ?? lead.notes ?? ''}
                      onChange={e => setNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                      className="text-xs rounded px-2 py-1 w-32"
                      style={{ backgroundColor: '#0A0A14', color: '#FFFFFF', border: '0.5px solid #1E293B' }}
                    />
                    <button
                      onClick={() => handleNoteSave(lead.id)}
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: '#4F46E5', color: '#FFFFFF' }}
                    >
                      {savingNote === lead.id ? '...' : '✓'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
