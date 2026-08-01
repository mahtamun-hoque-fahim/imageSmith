'use client'

import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { ArrowLeft, Mail, ExternalLink, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-bg">

      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-40 pb-24">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to converter
        </Link>

        <h1 className="text-4xl font-bold text-text mb-4">Contact</h1>
        <p className="text-text-muted text-lg mb-16">
          Got a bug, a feature idea, or just want to say hi? Fill in the form or reach out directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-16">

          {/* Form */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="bg-transparent border border-border text-text px-4 py-3 text-sm placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="bg-transparent border border-border text-text px-4 py-3 text-sm placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-muted">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="What's on your mind?"
                rows={6}
                className="bg-transparent border border-border text-text px-4 py-3 text-sm placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors resize-none rounded-lg"
              />
            </div>

            {status === 'success' && (
              <p className="text-sm text-green-400">Message sent. I'll get back to you soon.</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400">Something went wrong. Try again.</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="self-start flex items-center gap-2 px-8 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              <Send className="w-4 h-4" />
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-6 pt-1">
            <p className="text-sm text-text-muted uppercase tracking-widest">Reach out directly</p>

            <a
              href="mailto:mahtamunhoquefahim@gmail.com"
              className="flex items-center gap-3 text-sm text-text-muted hover:text-text transition-colors group"
            >
              <div className="w-9 h-9 border border-border flex items-center justify-center group-hover:border-accent transition-colors rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              mahtamunhoquefahim@gmail.com
            </a>

            <a
              href="https://www.linkedin.com/in/mahtamun-hoque-fahim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-text-muted hover:text-text transition-colors group"
            >
              <div className="w-9 h-9 border border-border flex items-center justify-center group-hover:border-accent transition-colors rounded-lg">
                <ExternalLink className="w-4 h-4" />
              </div>
              mahtamun-hoque-fahim
            </a>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
