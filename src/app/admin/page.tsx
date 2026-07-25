'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { CheckCheck, RefreshCw, LogOut, Mail, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'

type Contact = {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

type Review = {
  id: string
  content: string
  rating: number
  createdAt: string
}

type Tab = 'messages' | 'reviews'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('messages')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: session } = await authClient.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      await Promise.all([fetchContacts(), fetchReviews()])
      setLoading(false)
    }
    init()
  }, [])

  async function fetchContacts() {
    const res = await fetch('/api/admin/contacts', {
      headers: { 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '' },
    })
    if (res.ok) setContacts(await res.json())
  }

  async function fetchReviews() {
    const res = await fetch('/api/reviews')
    if (res.ok) {
      const data = await res.json()
      setReviews(data.reviews ?? data)
    }
  }

  async function markRead(id: string) {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '',
      },
      body: JSON.stringify({ id }),
    })
    setContacts(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/login')
  }

  const unread = contacts.filter(m => !m.read).length

  if (loading) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-12 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Link href="/"><img src="/logo.svg" alt="ImageSmith" className="h-7" /></Link>
          <span className="text-text-muted text-sm">/ Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { fetchContacts(); fetchReviews() }}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-8">
        <button
          onClick={() => setTab('messages')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === 'messages' ? 'border-white text-text' : 'border-transparent text-text-muted hover:text-text'}`}
        >
          <Mail className="w-4 h-4" />
          Messages
          {unread > 0 && (
            <span className="px-1.5 py-0.5 bg-accent text-black text-xs font-bold leading-none">
              {unread}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('reviews')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === 'reviews' ? 'border-white text-text' : 'border-transparent text-text-muted hover:text-text'}`}
        >
          <Star className="w-4 h-4" />
          Reviews
          <span className="text-text-faint text-xs">({reviews.length})</span>
        </button>
      </div>

      {/* Messages tab */}
      {tab === 'messages' && (
        <div className="flex flex-col gap-4">
          {contacts.length === 0 && (
            <p className="text-text-muted text-sm">No messages yet.</p>
          )}
          {contacts.map(m => (
            <div
              key={m.id}
              className={`border p-6 flex flex-col gap-3 transition-opacity ${m.read ? 'border-border opacity-50' : 'border-white/20 bg-white/5'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-text font-medium">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-text-muted hover:text-text transition-colors">{m.email}</a>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-text-faint">
                    {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
      )}

      {/* Reviews tab */}
      {tab === 'reviews' && (
        <div className="flex flex-col gap-4">
          {reviews.length === 0 && (
            <p className="text-text-muted text-sm">No reviews yet.</p>
          )}
          {reviews.map(r => (
            <div key={r.id} className="border border-border p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-text-faint'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-text-faint">
                  {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      )}

    </main>
  )
}
