import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export const runtime = 'edge'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'changeme'

function isAuthorized(req: NextRequest) {
  const token = req.headers.get('x-admin-secret')
  return token === ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
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
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const db = getDb()
  await db.update(contacts).set({ read: true }).where(eq(contacts.id, id))

  return NextResponse.json({ success: true })
}
