'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2, Star } from 'lucide-react'
import type { Review } from '@/lib/db/schema'

interface ReviewFormProps {
  onSubmit: (review: Review) => void
}

const MAX_CHARS = 500

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const remaining = MAX_CHARS - content.length
  const canSubmit =
    content.trim().length > 0 &&
    remaining >= 0 &&
    rating >= 1 &&
    state === 'idle'

  async function handleSubmit() {
    if (!canSubmit) return

    setState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, rating }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Error ${res.status}`)
      }

      const review: Review = await res.json()
      onSubmit(review)
      setContent('')
      setRating(0)
      setState('done')
      setTimeout(() => setState('idle'), 4000)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Submission failed')
      setState('error')
      setTimeout(() => setState('idle'), 5000)
    }
  }

  const displayRating = hovered || rating

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-text-muted" htmlFor="review-input">
        Leave a review
      </label>

      {/* Star picker */}
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
            disabled={state === 'submitting' || state === 'done'}
            className="p-0.5 transition-transform duration-100 hover:scale-110 active:scale-95 disabled:cursor-not-allowed"
            aria-label={`Rate ${n} star${n !== 1 ? 's' : ''}`}
          >
            <Star
              className="w-6 h-6 transition-colors duration-100"
              style={{
                color: n <= displayRating ? '#6d66f5' : '#4a5070',
                fill: n <= displayRating ? '#6d66f5' : 'transparent',
              }}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-xs font-mono text-text-muted">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
          </span>
        )}
      </div>

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
          'transition-[border-color,box-shadow] duration-150 resize-none',
          'focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_#6d66f51a]',
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
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-[background-color,transform] duration-150 ease-out',
            canSubmit
              ? 'bg-accent text-bg hover:bg-accent-hover active:scale-[0.97] cursor-pointer'
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
