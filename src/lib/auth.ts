import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb } from '@/lib/db'

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), { provider: 'pg' }),
  emailAndPassword: {
    enabled: true,
    // Sign-up is closed by default: this is a single-admin dashboard.
    // To seed a new admin, temporarily set ALLOW_SIGNUP=true, create the
    // account, then remove the variable and redeploy.
    disableSignUp: process.env.ALLOW_SIGNUP !== 'true',
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'],
})
