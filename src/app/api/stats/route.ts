import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { stats } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export const runtime = 'edge'

const STATS_ID = 'global'
const ADMIN_IPS = (process.env.ADMIN_IPS ?? '').split(',').map(s => s.trim()).filter(Boolean)

function isAdminIp(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  return ADMIN_IPS.includes(ip)
}

async function ensureStats(db: ReturnType<typeof getDb>) {
  await db.insert(stats).values({
    id: STATS_ID,
    pageViews: 0,
    conversions: 0,
  }).onConflictDoNothing()
}

// GET — fetch stats (session protected)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  await ensureStats(db)
  const [row] = await db.select().from(stats).where(eq(stats.id, STATS_ID))
  return NextResponse.json(row)
}

// POST — increment a counter (public, but skips admin IPs)
export async function POST(req: NextRequest) {
  if (isAdminIp(req)) {
    return NextResponse.json({ skipped: true })
  }

  const { type } = await req.json()
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
