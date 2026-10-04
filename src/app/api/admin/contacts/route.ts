import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin'
import { desc, eq } from 'drizzle-orm'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  const messages = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt))

  return NextResponse.json(messages)
}

export async function PATCH(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const id = (body as { id?: unknown } | null)?.id
  if (typeof id !== 'string' || id.length === 0) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const db = getDb()
  await db.update(contacts).set({ read: true }).where(eq(contacts.id, id))

  return NextResponse.json({ success: true })
}
