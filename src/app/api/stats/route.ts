import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { stats } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getAdminSession } from '@/lib/admin'
import { allowRequest } from '@/lib/redis'
import { getClientIp } from '@/lib/ip'

export const runtime = 'edge'

const STATS_ID = 'global'
const ADMIN_IPS = (process.env.ADMIN_IPS ?? '').split(',').map(s => s.trim()).filter(Boolean)

async function ensureStats(db: ReturnType<typeof getDb>) {
  await db.insert(stats).values({
    id: STATS_ID,
    pageViews: 0,
    conversions: 0,
  }).onConflictDoNothing()
}

// GET — fetch stats (admin session required)
export async function GET(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  await ensureStats(db)
  const [row] = await db.select().from(stats).where(eq(stats.id, STATS_ID))
  return NextResponse.json(row)
}

// POST — increment a counter (public, rate limited, skips admin IPs)
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (ADMIN_IPS.includes(ip)) {
    return NextResponse.json({ skipped: true })
  }

  // 60 counter hits per IP per minute
  if (!(await allowRequest('stats', 60, '1 m', ip))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = (body as { type?: unknown } | null)?.type
  if (type !== 'view' && type !== 'conversion') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const db = getDb()
  await ensureStats(db)

  if (type === 'view') {
    await db.update(stats)
      .set({ pageViews: sql`${stats.pageViews} + 1`, updatedAt: new Date() })
      .where(eq(stats.id, STATS_ID))
  } else {
    await db.update(stats)
      .set({ conversions: sql`${stats.conversions} + 1`, updatedAt: new Date() })
      .where(eq(stats.id, STATS_ID))
  }

  return NextResponse.json({ success: true })
}
