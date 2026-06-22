'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Inbox } from 'lucide-react'

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
  if (hours >= 48) return 'rgba(239,68,68,0.06)'
  if (hours >= 2) return 'rgba(245,158,11,0.05)'
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
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors"
            style={{
              background: filter === f.key ? 'var(--ax-blue)' : 'var(--ax-bg2)',
              color: filter === f.key ? '#FFFFFF' : 'var(--ax-t2)',
              border: '0.5px solid',
              borderColor: filter === f.key ? 'var(--ax-blue)' : 'var(--ax-border)'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-[12px] overflow-hidden" style={{ border: '0.5px solid var(--ax-border)' }}>
        {filtered.length === 0 ? (
          <div style={{ background: 'var(--ax-bg2)' }}>
            <EmptyState icon={Inbox} title="Nessun lead in questa categoria" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ax-bg2)', borderBottom: '0.5px solid var(--ax-border)' }}>
                {['Proprietario', 'Immobile', 'Classe', 'Valore', 'Stato', 'Ricevuto', 'Note'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: 'var(--ax-t3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead: any) => (
                <tr key={lead.id} style={{ background: rowBg(lead), borderBottom: '0.5px solid var(--ax-border)' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[13px]" style={{ color: 'var(--ax-t1)' }}>{lead.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ax-t2)' }}>
                    <div>{lead.address || lead.cap || '—'}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ax-t3)' }}>{lead.property_type || ''}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.lead_class} type="class" />
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px]" style={{ color: 'var(--ax-t2)' }}>
                    {lead.estimated_value ? `€${Number(lead.estimated_value).toLocaleString('it-IT')}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={e => handleStatusChange(lead.id, e.target.value)}
                      className="text-[11px] rounded-[6px] px-2 py-1 border-0 outline-none cursor-pointer"
                      style={{ background: 'var(--ax-bg3)', color: 'var(--ax-t1)', border: '0.5px solid var(--ax-border)' }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono" style={{ color: 'var(--ax-t3)' }}>
                    {timeAgo(lead.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Aggiungi nota..."
                        value={notes[lead.id] ?? lead.notes ?? ''}
                        onChange={e => setNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        className="text-[11px] rounded-[6px] px-2 py-1 w-32"
                        style={{ background: 'var(--ax-bg3)', color: 'var(--ax-t1)', border: '0.5px solid var(--ax-border)' }}
                      />
                      <button
                        onClick={() => handleNoteSave(lead.id)}
                        className="text-[11px] px-2 py-1 rounded-[6px]"
                        style={{ background: 'var(--ax-blue)', color: '#FFFFFF' }}
                      >
                        {savingNote === lead.id ? '...' : '✓'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
