'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  role: 'agent' | 'founder'
  agencyName?: string
}

const agentLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '▪' },
  { href: '/dashboard/leads', label: 'I miei lead', icon: '▪' },
  { href: '/dashboard/critical', label: 'Lead critici', icon: '▪' },
  { href: '/dashboard/history', label: 'Storico', icon: '▪' },
  { href: '/dashboard/performance', label: 'Performance', icon: '▪' },
]

const founderLinks = [
  { href: '/founder', label: 'Dashboard', icon: '▪' },
  { href: '/founder/leads', label: 'Tutti i lead', icon: '▪' },
  { href: '/founder/critical', label: 'Lead critici', icon: '▪' },
  { href: '/founder/agencies', label: 'Agenzie', icon: '▪' },
  { href: '/founder/funnel', label: 'Funnel', icon: '▪' },
  { href: '/founder/settings', label: 'Impostazioni', icon: '▪' },
]

export default function Sidebar({ role, agencyName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const links = role === 'founder' ? founderLinks : agentLinks

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r" style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}>
      
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
        <h1 className="text-base font-bold text-white tracking-tight">AXIONHub</h1>
        <p className="text-xs mt-0.5" style={{ color: '#CBD5E1' }}>
          {role === 'founder' ? 'Founder' : agencyName || 'Agenzia'}
        </p>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: isActive ? '#4F46E5' : 'transparent',
                color: isActive ? '#FFFFFF' : '#CBD5E1',
              }}
            >
              <span style={{ color: isActive ? '#FFFFFF' : '#4F46E5', fontSize: '8px' }}>●</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#1E293B', borderWidth: '0.5px' }}>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full transition-colors hover:bg-white/5"
          style={{ color: '#CBD5E1' }}
        >
          <span style={{ color: '#EF4444', fontSize: '8px' }}>●</span>
          Esci
        </button>
      </div>
    </aside>
  )
}
