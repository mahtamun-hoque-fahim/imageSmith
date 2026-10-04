import { NextRequest, NextResponse } from 'next/server'
import { touchRedis } from '@/lib/redis'

export const runtime = 'edge'

// Constant-time string comparison.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// Called daily by Vercel Cron (see vercel.json). Vercel sends
// "Authorization: Bearer <CRON_SECRET>" when the CRON_SECRET env var is set.
// Fails closed: with no CRON_SECRET configured, every request is rejected.
// The Cloudflare mirror shares the same Redis, so this keeps both deploys alive.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization') ?? ''

  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ok = await touchRedis()
  return NextResponse.json({ ok }, { status: ok ? 200 : 503 })
}
