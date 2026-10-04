// Resolve the client IP from headers the hosting platform sets itself.
//
// Never trust a header the client can forge:
// - On Vercel, x-forwarded-for / x-vercel-forwarded-for / x-real-ip are set by
//   the platform. A client-sent cf-connecting-ip is NOT overwritten, so it must
//   be ignored there.
// - On Cloudflare (OpenNext Worker), cf-connecting-ip is set by Cloudflare and
//   x-forwarded-for may carry client-supplied values, so cf-connecting-ip wins.
// process.env.VERCEL is set by Vercel at runtime; it is absent on Cloudflare
// and in local dev.

type HeaderSource = { headers: Headers }

function first(value: string | null): string | null {
  const v = value?.split(',')[0]?.trim()
  return v ? v : null
}

export function getClientIp(req: HeaderSource): string {
  const h = req.headers
  if (process.env.VERCEL) {
    return (
      first(h.get('x-vercel-forwarded-for')) ??
      first(h.get('x-real-ip')) ??
      first(h.get('x-forwarded-for')) ??
      'unknown'
    )
  }
  return (
    first(h.get('cf-connecting-ip')) ??
    first(h.get('x-forwarded-for')) ??
    '127.0.0.1'
  )
}
