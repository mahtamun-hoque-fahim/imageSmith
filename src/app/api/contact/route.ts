import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { allowRequest } from '@/lib/redis'
import { getClientIp } from '@/lib/ip'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // 5 messages per IP per hour
  if (!(await allowRequest('contact', 5, '1 h', getClientIp(req)))) {
    return NextResponse.json(
      { error: 'Too many messages. Try again later.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, message } = (body ?? {}) as Record<string, unknown>

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const db = getDb()
    await db.insert(contacts).values({
      id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 200),
      message: message.trim().slice(0, 2000),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact submission error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
