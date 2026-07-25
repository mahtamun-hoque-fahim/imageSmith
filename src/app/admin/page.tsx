'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCheck, RefreshCw } from 'lucide-react'

type Contact = {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [messages, setMessages] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchMessages(s: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/contacts', {
        headers: { 'x-admin-secret': s },
      })
      if (res.status === 401) {
        setError('Wrong secret.')
        setAuthed(false)
        return
      }
      const data = await res.json()
      setMessages(data)
      setAuthed(true)
    } catch {
      setError('Failed to fetch.')
    } finally {
      setLoading(false)
    }
  }

  async function markRead(id: string) {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify({ id }),
    })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <img src="/logo.svg" alt="ImageSmith" className="h-7 mb-4" />
          <p className="text-text-muted text-sm">Admin access required.</p>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchMessages(secret)}
            placeholder="Enter admin secret"
            className="bg-transparent border border-border text-text px-4 py-3 text-sm placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={() => fetchMessages(secret)}
            className="px-6 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Enter
          </button>
        </div>
      </main>
    )
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <main className="min-h-screen bg-bg px-6 py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="ImageSmith" className="h-7" />
          <span className="text-text-muted text-sm">/ Admin</span>
        </div>
        <button
          onClick={() => fetchMessages(secret)}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-text">Contact Messages</h1>
        {unread > 0 && (
          <span className="px-2 py-0.5 bg-accent text-black text-xs font-bold">
            {unread} unread
          </span>
        )}
      </div>

      {loading && <p className="text-text-muted text-sm">Loading...</p>}

      {!loading && messages.length === 0 && (
        <p className="text-text-muted text-sm">No messages yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={`border p-6 flex flex-col gap-3 ${m.read ? 'border-border opacity-60' : 'border-accent/40 bg-accent/5'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-text font-medium">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-sm text-text-muted hover:text-text transition-colors">{m.email}</a>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-text-faint">
                  {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                {!m.read && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark read
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
