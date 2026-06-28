import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { getRatelimit } from '@/lib/redis'
import { desc } from 'drizzle-orm'

const MAX_CONTENT_LENGTH = 500
const REVIEWS_LIMIT = 50

function sanitize(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

function nanoid(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)
  for (const byte of arr) id += chars[byte % chars.length]
  return id
}

export async function GET() {
  try {
    const db = getDb()
    const rows = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt))
      .limit(REVIEWS_LIMIT)

    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  // x-vercel-ip-address is injected by Vercel edge and cannot be forged by the client.
  // Fall back to x-forwarded-for only for local dev (where Vercel header is absent).
  const ip =
    req.headers.get('x-vercel-ip-address') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1'

  try {
    const rl = getRatelimit()
    const { success } = await rl.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many reviews. Try again later.' },
        { status: 429 }
      )
    }
  } catch {
    // If Redis is unavailable, log and continue (don't block the request)
    console.error('Rate limiter unavailable')
  }

  // Parse + validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || !('content' in body)) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }

  const raw = (body as Record<string, unknown>).content
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return NextResponse.json({ error: 'content must be a non-empty string' }, { status: 400 })
  }

  if (raw.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `content must be ${MAX_CONTENT_LENGTH} characters or fewer` },
      { status: 400 }
    )
  }

  const content = sanitize(raw)

  try {
    const db = getDb()
    const [row] = await db
      .insert(reviews)
      .values({ id: nanoid(), content })
      .returning()

    return NextResponse.json(row, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
  }
}
