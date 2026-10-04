import { auth } from '@/lib/auth'

// Server-side admin check. Validates the session against the database (a bare
// session cookie is not proof of anything). If ADMIN_EMAIL is set, only that
// account counts as admin; sign-up is closed by default (see auth.ts), so this
// is defense in depth.
export async function getAdminSession(headers: Headers) {
  const session = await auth.api.getSession({ headers })
  if (!session) return null

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (adminEmail && session.user.email.toLowerCase() !== adminEmail) return null

  return session
}
