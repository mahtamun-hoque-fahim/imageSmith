import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { pingRedis } from '@/lib/redis'

export const runtime = 'edge'

// Admin-only. Reports whether the rate limiter's Redis is reachable. When it is
// down, every limiter fails open (see lib/redis.ts), so this makes that visible.
export async function GET(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const redis = (await pingRedis()) ? 'ok' : 'down'
  return NextResponse.json({ redis })
}
