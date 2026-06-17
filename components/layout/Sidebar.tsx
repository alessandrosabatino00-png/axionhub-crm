'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, AlertTriangle,
  TrendingUp, Building2, FileText, Settings, LogOut
} from 'lucide-react'
import { signOut } from '@/lib/auth'
const founderNav = [
  {
    label: 'Visione',
    items: [
      { href: '/founder', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/founder/leads', icon: Users, label: 'Lead' },
      { href: '/founder/critical', icon: AlertTriangle, label: 'Critici' },
    ]
  },
  {
    label: 'Gestione',
    items: [
      { href: '/founder/funnel', icon: TrendingUp, label: 'Funnel' },
      { href: '/founder/agencies', icon: Building2, label: 'Agenzie' },
      { href: '/founder/billing', icon: FileText, label: 'Fatturazione' },
      { href: '/founder/settings', icon: Settings, label: 'Impostazioni' },
    ]
  }
]
const agencyNav = [
  {
    label: 'Visione',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/leads', icon: Users, label: 'I miei lead' },
      { href: '/dashboard/critical', icon: AlertTriangle, label: 'Lead critici' },
    ]
  },
  {
    label: 'Storico',
    items: [
      { href: '/dashboard/history', icon: FileText, label: 'Storico' },
      { href: '/dashboard/performance', icon: TrendingUp, label: 'Performance' },
    ]
  }
]
interface SidebarProps {
  role: 'agent' | 'founder'
  agencyName?: string
}
export default function Sidebar({ role, agencyName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = role === 'founder' ? founderNav : agencyNav
  const isActive = (href: string) => {
    if (href === '/founder' || href === '/dashboard') return pathname === href
    return pathname.startsWith(href)
  }
  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }
  return (
    <aside
      className="w-[228px] flex-shrink-0 flex flex-col h-screen fixed left-0 top-0"
      style={{
        background: 'var(--ax-bg2)',
        borderRight: '0.5px solid var(--ax-border)',
        position: 'fixed',
      }}
    >
      {/* Accent line left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, var(--ax-blue) 25%, var(--ax-cyan) 75%, transparent 100%)',
          opacity: 0.3,
        }}
      />
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 min-h-[64px]"
        style={{
          borderBottom: '0.5px solid var(--ax-border)',
          background: 'linear-gradient(135deg, rgba(26,79,214,0.06) 0%, transparent 60%)',
        }}
      >
        <img src="/logo.png" alt="AXION" style={{ width: 44, height: 44, objectFit: "contain", flexShrink: 0 }}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold tracking-tight logo-gradient">
            AXION
          </span>
          <span
            className="text-[8.5px] uppercase tracking-[2px] mt-0.5"
            style={{ color: 'var(--ax-t3)' }}
          >
            Real Estate Intelligence
          </span>
        </div>
      </div>
      {/* Live status */}
      <div
        className="flex items-center gap-1.5 px-4 py-1.5 text-[10px]"
        style={{
          borderBottom: '0.5px solid var(--ax-border)',
          color: 'var(--ax-t3)',
          background: 'rgba(10,189,212,0.02)',
        }}
      >
        <div className="w-[5px] h-[5px] rounded-full bg-emerald-500 animate-pulse" />
        <span>Sistema attivo</span>
      </div>
      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2">
        {nav.map((group) => (
          <div key={group.label} className="px-2 mb-1">
            <div
              className="text-[9px] font-bold uppercase tracking-[1.2px] px-2.5 pt-3 pb-1.5"
              style={{ color: 'var(--ax-t3)' }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-2.5 py-[7px] rounded-[7px] text-[12.5px] transition-all duration-100 relative mb-0.5"
                  style={{
                    color: active ? 'var(--ax-t1)' : 'var(--ax-t2)',
                    background: active
                      ? 'linear-gradient(90deg, rgba(26,79,214,0.15) 0%, rgba(26,79,214,0.04) 100%)'
                      : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(59,91,219,0.08)'
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {active && <span className="nav-active" />}
                  <Icon
                    size={14}
                    className="flex-shrink-0"
                    style={{
                      opacity: active ? 1 : 0.55,
                      color: active ? 'var(--ax-cyan)' : 'inherit',
                    }}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      {/* User / Logout */}
      <div
        className="px-2 py-2.5"
        style={{
          borderTop: '0.5px solid var(--ax-border)',
          background: 'linear-gradient(0deg, rgba(26,79,214,0.04), transparent)',
        }}
      >
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-[7px] w-full transition-all text-[12.5px]"
          style={{ color: 'var(--ax-t2)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={14} style={{ opacity: 0.55 }} />
          <span>{role === 'founder' ? 'Founder' : agencyName || 'Agenzia'} · Esci</span>
        </button>
      </div>
    </aside>
  )
}
