import { Ratelimit, type Duration } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null
let ratelimit: Ratelimit | null = null
const limiters = new Map<string, Ratelimit>()

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return redis
}

// Reviews limiter: 1 request per IP per hour (unchanged behaviour).
export function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(1, '1 h'),
      analytics: false,
    })
  }
  return ratelimit
}

// Named limiter for other endpoints. Each name gets its own key prefix so
// limits never share a bucket.
function getLimiter(name: string, tokens: number, window: Duration): Ratelimit {
  const key = `${name}:${tokens}:${window}`
  let limiter = limiters.get(key)
  if (!limiter) {
    limiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(tokens, window),
      prefix: `imagesmith:${name}`,
      analytics: false,
    })
    limiters.set(key, limiter)
  }
  return limiter
}

// Returns true when the request may proceed. Fails open if Redis is
// unreachable (logged), matching the reviews endpoint.
export async function allowRequest(
  name: string,
  tokens: number,
  window: Duration,
  ip: string
): Promise<boolean> {
  try {
    const { success } = await getLimiter(name, tokens, window).limit(ip)
    return success
  } catch {
    console.error(`Rate limiter unavailable (${name})`)
    return true
  }
}
