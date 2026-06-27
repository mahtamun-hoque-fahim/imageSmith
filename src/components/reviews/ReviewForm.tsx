'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { Review } from '@/lib/db/schema'

interface ReviewFormProps {
  onSubmit: (review: Review) => void
}

const MAX_CHARS = 500

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [content, setContent] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const remaining = MAX_CHARS - content.length
  const canSubmit = content.trim().length > 0 && remaining >= 0 && state === 'idle'

  async function handleSubmit() {
    if (!canSubmit) return

    setState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Error ${res.status}`)
      }

      const review: Review = await res.json()
      onSubmit(review)
      setContent('')
      setState('done')

      // Reset to idle after 4 seconds
      setTimeout(() => setState('idle'), 4000)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Submission failed')
      setState('error')
      setTimeout(() => setState('idle'), 5000)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-text-muted" htmlFor="review-input">
        Share your experience
      </label>

      <textarea
        id="review-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How did ImageSmith work for you?"
        maxLength={MAX_CHARS}
        rows={3}
        disabled={state === 'submitting' || state === 'done'}
        className={[
          'w-full bg-surface border rounded-lg px-4 py-3',
          'text-text placeholder-text-faint text-sm font-inter',
          'transition-colors resize-none',
          'focus:border-accent focus:outline-none',
          state === 'error' ? 'border-danger/50' : 'border-border',
          state === 'done' ? 'opacity-50' : '',
        ].join(' ')}
      />

      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            'text-xs font-mono transition-colors',
            remaining < 50 ? 'text-warning' : 'text-text-faint',
            remaining < 0 ? 'text-danger' : '',
          ].join(' ')}
        >
          {remaining} left
        </span>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={[
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150',
            canSubmit
              ? 'bg-accent text-bg hover:bg-accent-hover cursor-pointer'
              : 'bg-surface border border-border text-text-faint cursor-not-allowed',
          ].join(' ')}
        >
          {state === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit
            </>
          )}
        </button>
      </div>

      {state === 'done' && (
        <div className="flex items-center gap-2 text-success text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Review submitted. Thank you!</span>
        </div>
      )}

      {state === 'error' && errorMsg && (
        <div className="flex items-center gap-2 text-danger text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}
