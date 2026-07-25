import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { contacts } from '@/lib/db/schema'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

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
