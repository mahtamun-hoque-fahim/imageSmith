import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { stats } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

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

// GET — fetch stats (admin only)
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== (process.env.ADMIN_SECRET ?? 'changeme')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  await ensureStats(db)
  const [row] = await db.select().from(stats).where(eq(stats.id, STATS_ID))
  return NextResponse.json(row)
}

// POST — increment a counter
export async function POST(req: NextRequest) {
  // Skip admin IPs
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
