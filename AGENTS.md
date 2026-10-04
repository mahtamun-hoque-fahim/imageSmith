# ImageSmith

Free, client-side image-to-WebP converter with folder-structure-preserving ZIP output. No visitor accounts, no server uploads, no paywall. Better Auth exists only for the single-admin dashboard.

## Session Start (mandatory)

Run these two lines at the start of every session, before any commit. Never ask, never skip.

```
git config user.name "mahtamun-hoque-fahim"
git config user.email "mahtamunhoquefahim@gmail.com"
```

## Current State

- Version: v0.2.2 (Redis health indicator + keep-alive cron on top of the v0.2.1 security hardening)
- Live: converter (single, batch, folder, ZIP input), reviews, contact form, /about, /privacy, admin dashboard (messages, reviews, stats)
- Auth: Better Auth email+password for ONE admin account; public sign-up disabled by default
- Admin APIs authorize with a server-validated session (`src/lib/admin.ts`); no shared secrets
- Rate limits (Upstash): reviews 1/IP/hour, contact 5/IP/hour, stats POST 60/IP/min. Limiters fail open if Redis is down; the admin dashboard shows Redis status and `vercel.json` runs a daily keep-alive (`CRON_SECRET`)
- Verified locally: `npx tsc --noEmit` clean, `npm run build` clean (13 routes), auth gates and validation smoke-tested
- Open: Redis must be recreated (see Session Log), no test runner, no lint script, CSP keeps `unsafe-eval`/`unsafe-inline` (see Security Gotchas), POST-BUILD audits (airborne, humanizer, cave-man, council POST) not recorded as done

## Setup & Commands

- Install: `npm install`
- Dev server: `npm run dev` (predev copies the libwebp WASM into `public/wasm`)
- Build: `npm run build`
- Type check: `npx tsc --noEmit` (run with the build before every push)
- DB push (dev only): `npm run db:push`
- DB migrate (production): `npm run db:generate` then `npm run db:migrate`

## Conventions & Non-Negotiables

- No emojis anywhere in code or UI — lucide-react icons only, no hand-rolled SVGs
- Dual deploy: Vercel (primary) + Cloudflare Workers via `@opennextjs/cloudflare` — every route must stay Edge Runtime compatible
- DB driver: `neon-http` only — never `neon-ws` or `pg` (Edge Runtime requirement)
- Visitors never need an account. Better Auth is for the admin dashboard only — do not add sign-up, social login, or any visitor-facing auth
- Conversion engine is libwebp WASM served same-origin from `/public/wasm` (copied by `scripts/copy-wasm.js`, loaded by script-tag injection) — never fall back to `canvas.toBlob('image/webp')` (Firefox encodes PNG, not WebP)
- CSP is set in `next.config.ts` for both deploy targets; the WASM runtime needs `wasm-unsafe-eval`
- Batch processing is chunked (10 images at a time) — never convert all images in parallel
- Reviews table caps at 50 rows returned — never query all rows
- Firefox folder fallback is ZIP input — JSZip unpacks client-side, not a server operation
- The CLI and MCP server ship separately as `@imagesmith/cli`. Do not add CLI code to this repo

## Security Gotchas

- `.env.local` is never committed — if a secret leaks, rotate it immediately
- Never put a secret in a `NEXT_PUBLIC_*` variable: it is inlined into the browser bundle
- Admin routes must call `getAdminSession(req.headers)` from `src/lib/admin.ts`. A session cookie existing is not authentication; `src/proxy.ts` is a UX redirect only
- Auth sign-up stays closed: `disableSignUp` is on unless `ALLOW_SIGNUP=true`. Set it only to seed an admin, then remove it and redeploy
- Optional `ADMIN_EMAIL` restricts admin to one account (recommended in production)
- Public write endpoints (`/api/reviews`, `/api/contact`, `/api/stats` POST) are rate limited with Upstash; do not remove or bypass this
- Free Upstash databases are deleted after long inactivity. Keep the daily cron in `vercel.json` and `CRON_SECRET` set; if the dashboard says "Rate limiter down", check Upstash first
- `/api/cron/keepalive` must keep failing closed when `CRON_SECRET` is unset
- Always derive the client IP with `getClientIp` from `src/lib/ip.ts`; never read `x-forwarded-for` directly (client-forgeable on Cloudflare)
- Never write a fallback for a secret (`?? 'changeme'`); fail closed
- Review content must be HTML-stripped and length-capped (max 500 chars) before writing to Neon
- No file data ever reaches the server — if any code path sends image data to an API route, that is a bug
- Known trade-off: CSP `script-src` includes `unsafe-eval` (the WASM embind runtime needs it) and `unsafe-inline` (Next.js inline scripts). Revisit with nonces if the WASM build changes

## Session Log

(Newest first. Maximum 10 entries — drop the oldest when an 11th is added.)

### 2026-10-04 (Redis health + keep-alive, v0.2.2)
- Did: Found the Upstash database had been auto-deleted for inactivity, so every limiter had been failing open. Added `/api/admin/health` + a "Rate limiter OK / down" chip on the dashboard, and a daily Vercel cron (`/api/cron/keepalive`, Bearer `CRON_SECRET`, fails closed). v0.2.1 was merged and verified on production first: old `changeme` header returns 401, sign-up disabled, session login works.
- Follow-up for Fahim: create a new Upstash database and update `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`; add `CRON_SECRET` in Vercel; mirror the same on Cloudflare; redeploy; re-run the contact rate-limit test (five 400s then a 429).

### 2026-10-04 (security hardening, v0.2.1)
- Did: Audited the repo. Replaced the shared-secret admin API (live behaviour: `ADMIN_SECRET` unset on Vercel, so the public default `'changeme'` was accepted) with server-validated Better Auth sessions; closed public sign-up; added rate limits to contact and stats; added trusted client-IP helper (fixes reviews limiter bypass on the Cloudflare mirror); added input type checks; added `.env.example`.
- Docs: synced BRAIN, PLANNER, SITETREE, README, CHANGELOG, sitemap to the real v0.2.x state.
- Follow-up for Fahim: set `ADMIN_EMAIL` in Vercel and Cloudflare; delete `ADMIN_SECRET` / `NEXT_PUBLIC_ADMIN_SECRET` wherever set (not present on Vercel; check Cloudflare); confirm `ALLOW_SIGNUP` is unset; treat stored contact messages as possibly read by others before the fix.
- Next: add Vitest, add a lint script, then POST-BUILD audits.

### 2026-07-25 (dashboard + auth complete)
- Session Start: `git config user.name "mahtamun-hoque-fahim"` & `git config user.email "mahtamunhoquefahim@gmail.com"`
- Did: Full admin auth flow. Better Auth installed (email+password). Schema: user, session, account, verification tables. proxy.ts protects /admin, redirects to /login. Login page built. Admin dashboard rebuilt with session check, Messages + Reviews tabs, mark-as-read, sign out. DB tables created via Neon SQL editor. Admin account seeded via browser console fetch. Dashboard confirmed working.
- Pages live: /login, /admin, /about, /contact, /privacy
- Stack: Better Auth + Drizzle + Neon, Next.js 16, Edge Runtime

### 2026-07-25 (Google Sans + scroll)
- Did: Added Google Sans from Google Fonts across the site (default body font in globals.css). CTA button smooth-scrolls to the converter (`id="converter-section"`).

### 2026-07-25 (hero redesign and polish, several passes)
- Did: Rebuilt the hero (dark wave background, folder icon left, ZIP icon right, headline "Rapid Conversion to .WEBP", white "Drop Your Files" CTA). Sticky frosted-glass nav with About/Contact/Privacy links. Parallax background (page.tsx is now a client component). Custom 3D folder icon image with glow.
- Fixed: right-side gap (caused by `w-screen` being wider than the viewport due to the scrollbar) by using `overflow-x-hidden` on the main container and `w-full` on the hero; ZIP icon positioning and sizing.

### 2026-06-27
- Did: Project anchored via Singularity. BRAIN.md, SITETREE.md, PLANNER.md, DESIGN_GUIDE.md, README.md, AGENTS.md all committed.
- Decided: libwebp WASM over Canvas API (Firefox WebP encoding failure). Firefox folder fallback is ZIP upload. (WASM later moved from CDN to same-origin `/public/wasm`.)
