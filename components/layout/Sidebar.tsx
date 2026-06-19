'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, AlertTriangle,
  TrendingUp, Building2, FileText, Settings,
  History, BarChart3, LogOut
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
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
      { href: '/dashboard/history', icon: History, label: 'Storico' },
      { href: '/dashboard/performance', icon: BarChart3, label: 'Performance' },
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

  const displayName = role === 'founder' ? 'Founder' : (agencyName || 'Agenzia')
  const displayRole = role === 'founder' ? 'Admin' : 'Agenzia partner'
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside
      className="w-[228px] flex-shrink-0 flex flex-col h-screen fixed left-0 top-0"
      style={{ background: 'var(--ax-bg2)', borderRight: '0.5px solid var(--ax-border)' }}
    >
      {/* Accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, var(--ax-blue) 25%, var(--ax-cyan) 75%, transparent 100%)',
          opacity: 0.35,
        }}
      />

      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 min-h-[68px]"
        style={{
          borderBottom: '0.5px solid var(--ax-border)',
          background: 'linear-gradient(135deg, rgba(26,79,214,0.06) 0%, transparent 60%)',
        }}
      >
        <Image
          src="/logo.png"
          alt="AXION"
          width={42}
          height={42}
          className="object-contain flex-shrink-0"
          priority
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
        className="flex items-center gap-1.5 px-4 py-2 text-[10px]"
        style={{ borderBottom: '0.5px solid var(--ax-border)', color: 'var(--ax-t3)' }}
      >
        <span className="relative flex h-[7px] w-[7px]">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-500" />
        </span>
        <span>Sistema attivo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
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
                  className={`flex items-center gap-2 px-2.5 py-[7px] rounded-[8px] text-[12.5px] transition-all duration-150 relative mb-0.5 ${active ? 'nav-active-bar' : ''}`}
                  style={{
                    color: active ? 'var(--ax-t1)' : 'var(--ax-t2)',
                    background: active
                      ? 'linear-gradient(90deg, rgba(26,79,214,0.16) 0%, rgba(26,79,214,0.04) 100%)'
                      : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.background = 'var(--ax-bg3)'
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Icon
                    size={14}
                    className="flex-shrink-0"
                    style={{ opacity: active ? 1 : 0.6, color: active ? 'var(--ax-cyan)' : 'inherit' }}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Theme toggle */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: '0.5px solid var(--ax-border)' }}
      >
        <span className="text-[11px]" style={{ color: 'var(--ax-t2)' }}>Tema</span>
        <ThemeToggle />
      </div>

      {/* User / Logout */}
      <div
        className="px-2 py-2.5"
        style={{ borderTop: '0.5px solid var(--ax-border)' }}
      >
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-[8px] cursor-pointer transition-all w-full"
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ax-bg3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-white"
            style={{ background: 'linear-gradient(135deg, var(--ax-blue), var(--ax-cyan))' }}
          >
            {initials}
          </div>
          <div className="text-left">
            <div className="text-[11.5px] font-semibold" style={{ color: 'var(--ax-t1)' }}>
              {displayName}
            </div>
            <div className="text-[9.5px] flex items-center gap-1" style={{ color: 'var(--ax-t3)' }}>
              <LogOut size={9} />
              {displayRole} · Esci
            </div>
          </div>
        </button>
      </div>
    </aside>
  )
}
