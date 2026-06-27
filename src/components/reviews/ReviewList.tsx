'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Loader2 } from 'lucide-react'
import ReviewForm from './ReviewForm'
import type { Review } from '@/lib/db/schema'

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data: Review[]) => setReviews(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleNewReview(review: Review) {
    setReviews((prev) => [review, ...prev])
  }

  return (
    <div id="reviews" className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-syne font-semibold text-text">
          What people are saying
        </h2>
      </div>

      <ReviewForm onSubmit={handleNewReview} />

      {loading && (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          <span>Loading reviews&hellip;</span>
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="text-text-muted text-sm">
          No reviews yet. Be the first.
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-surface border border-border rounded-lg px-5 py-4 flex flex-col gap-2"
            >
              <p className="text-text text-sm leading-relaxed">{r.content}</p>
              <span className="text-text-faint text-xs font-mono">
                {timeAgo(new Date(r.createdAt))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
