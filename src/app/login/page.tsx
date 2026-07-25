'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)

    const { error } = await authClient.signIn.email({
      email,
      password,
    })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Link href="/">
          <img src="/logo.svg" alt="ImageSmith" className="h-7 mb-2" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Admin Login</h1>
          <p className="text-sm text-text-muted">Sign in to access the dashboard.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="admin@imagesmith.dev"
              className="bg-transparent border border-border text-text px-4 py-3 text-sm placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="bg-transparent border border-border text-text px-4 py-3 text-sm placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    </main>
  )
}
