'use client'

import { useState } from 'react'
import { signIn, getUserRole } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { user } = await signIn(email, password)
      if (!user) throw new Error('Login fallito')

      const membership = await getUserRole(user.id)

      if (membership?.role === 'founder') {
        router.push('/founder')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError('Email o password non corretti')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A14' }}>
      <div className="w-full max-w-sm p-8 rounded-xl border" style={{ backgroundColor: '#16161F', borderColor: '#1E293B', borderWidth: '0.5px' }}>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">AXIONHub</h1>
          <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>CRM Immobiliare</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: '#CBD5E1' }}>Email</label>
            <Input
              type="email"
              placeholder="email@agenzia.it"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border-[0.5px]"
              style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', color: '#FFFFFF' }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: '#CBD5E1' }}>Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border-[0.5px]"
              style={{ backgroundColor: '#0A0A14', borderColor: '#1E293B', color: '#FFFFFF' }}
            />
          </div>
          {error && (
            <p className="text-sm text-center" style={{ color: '#EF4444' }}>{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-medium"
            style={{ backgroundColor: '#4F46E5', color: '#FFFFFF' }}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </form>
      </div>
    </div>
  )
}
