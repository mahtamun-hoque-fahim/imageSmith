# ImageSmith — Planner

> Free, client-side image-to-WebP converter with folder-structure-preserving ZIP output. For developers who refuse to pay or upload their files to a third-party server.

## Project Overview

**Purpose.** Every online image converter either paywalls batch conversion, destroys folder structure on output, or uploads files to a server. ImageSmith solves all three at once: 100% client-side via libwebp WASM, batch + folder support, and a ZIP output that mirrors the exact input folder tree.

**Target user.** Developers converting project image assets — individually, in bulk, or as whole directory trees — who need it free, private, and folder-structure-preserving.

**Key value.** Drop a folder or ZIP of 1000 images in any format. Get back an identical ZIP with every image converted to WebP. Same folder tree. Same filenames. Just `.webp`.

**Current phase.** v0.2.1 live. Security hardening done; POST-BUILD audits and test setup remain.

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4
- Database: Neon (PostgreSQL) — reviews, contacts, stats, plus Better Auth tables
- ORM: Drizzle (neon-http driver)
- Auth: Better Auth, email + password, single admin account, public sign-up disabled
- Conversion engine: libwebp WASM (client-side, served same-origin from `/public/wasm`)
- ZIP output: JSZip (client-side)
- Rate limiting: Upstash Redis (reviews, contact, stats POST)
- Analytics: Vercel Analytics + first-party stats counters
- Deployment: Vercel (primary), Cloudflare Workers via @opennextjs/cloudflare (mirror)

**Deployment topology:**
- `main` → Vercel production
- PRs → Vercel preview
- `main` → Cloudflare Workers production (mirror via @opennextjs/cloudflare)

**Critical constraint:** Edge Runtime required for Cloudflare. Use `neon-http` driver only. Never `neon-ws` or `pg`.

**WASM loading strategy:** `scripts/copy-wasm.js` (run by `predev` and `prebuild`) copies the libwebp WASM into `public/wasm`. `src/lib/wasm/loader.ts` injects `/wasm/wasm_webp.js` as a script tag and the binary is fetched same-origin. This replaced the original jsDelivr CDN plan (2026-06-27). Public assets are served separately from the Worker bundle, so the Cloudflare 1MB limit is not hit.

**Firefox folder upload fallback:** `webkitdirectory` is unavailable on Firefox. Firefox users upload a ZIP file instead — JSZip unpacks it client-side, converts all images, repacks with identical structure.

**Folder structure (summary):**
```
src/
  app/
    page.tsx, layout.tsx, globals.css, sitemap.ts, icon.svg
    about/ contact/ privacy/ login/ admin/      pages
    api/
      reviews/route.ts        GET + POST (rate limited)
      contact/route.ts        POST (rate limited)
      stats/route.ts          GET (admin) + POST (rate limited)
      admin/contacts/route.ts GET + PATCH (admin)
      admin/health/route.ts   GET (admin) Redis status
      cron/keepalive/route.ts GET (cron) Redis keep-alive
      auth/[...all]/route.ts  Better Auth handler
  components/                 converter, reviews, surfaces, layout
  lib/
    db/                       index.ts (lazy getDb, neon-http), schema.ts
    wasm/loader.ts            libwebp init + singleton
    zip/processor.ts          JSZip pack/unpack + convert orchestrator
    auth.ts, auth-client.ts   Better Auth server + client
    admin.ts                  getAdminSession (server-side admin check)
    ip.ts                     getClientIp (platform-trusted client IP)
    redis.ts                  Upstash limiters
  proxy.ts                    optimistic /admin redirect (not authorization)
scripts/copy-wasm.js          copies WASM into public/wasm
vercel.json                   daily cron → /api/cron/keepalive
drizzle/                      generated migrations
```

---

## User Flows

### Flow 1: Single file conversion
1. User lands on `/`
2. Converter zone is visible immediately (WASM initializes in background)
3. User drops or selects a single image file
4. libwebp WASM converts it client-side with selected quality setting
5. Download button appears — user downloads the `.webp` file

### Flow 2: Batch file conversion
1. User lands on `/`
2. User selects multiple image files via file picker
3. Progress bar shows `converted X of N`
4. JSZip packages all converted files into a ZIP (flat structure — no folder to preserve)
5. Download button downloads the ZIP

### Flow 3: Folder conversion (Chrome / Edge / Safari)
1. User drops a folder or selects via folder picker
2. `webkitdirectory` captures all files with `file.webkitRelativePath`
3. libwebp WASM converts each image (chunked, 10 at a time)
4. JSZip rebuilds exact folder tree using `webkitRelativePath`
5. Download button downloads the structure-preserving ZIP

### Flow 4: Folder conversion (Firefox fallback)
1. User lands on `/` — browser detected as Firefox
2. A visible notice: "Folder upload requires Chrome or Edge. On Firefox, upload a ZIP file containing your folder."
3. User uploads a ZIP
4. JSZip unpacks it client-side — folder tree extracted
5. libwebp WASM converts each image (chunked)
6. JSZip repacks into output ZIP with identical folder tree
7. Download button downloads the output ZIP

### Flow 5: Review submission
1. User scrolls to footer review section (or clicks footer link)
2. Sees existing reviews (fetched from Neon via GET /api/reviews — latest 50)
3. Types a review (max 500 chars) and submits
4. POST /api/reviews — rate limited by Upstash Redis (1 per IP per hour)
5. Review appears in list immediately (optimistic update)

### Flow 6: Contact message
1. User opens `/contact` and submits name, email, message
2. POST /api/contact — validated, rate limited (5 per IP per hour), stored in Neon

### Flow 7: Admin
1. Admin signs in at `/login` (no sign-up exists)
2. `/admin` shows messages, reviews and stats
3. Admin APIs validate the session server-side on every request

---

## DB Schema

Drizzle schema lives in `src/lib/db/schema.ts`.

| table | purpose | notes |
|---|---|---|
| reviews | public star reviews | id, content (max 500, enforced in API), rating (default 5), createdAt |
| contacts | contact-form messages | id, name, email, message, read, createdAt |
| stats | global counters | single row `global`: pageViews, conversions, updatedAt |
| user, session, account, verification | Better Auth | one admin user; sign-up disabled |

No image data is ever stored.

---

## API Routes

| Method | Path | Auth | Limit | Notes |
|---|---|---|---|---|
| GET | /api/reviews | none | — | latest 50 |
| POST | /api/reviews | none | 1/IP/hour | `{ content, rating }`, HTML stripped, 429 on breach |
| POST | /api/contact | none | 5/IP/hour | `{ name, email, message }`, validated and length-capped |
| GET | /api/stats | admin session | — | counters |
| POST | /api/stats | none | 60/IP/min | `{ type: 'view' \| 'conversion' }`, skips `ADMIN_IPS` |
| GET | /api/admin/contacts | admin session | — | all messages |
| PATCH | /api/admin/contacts | admin session | — | `{ id }` marks read |
| GET | /api/admin/health | admin session | — | `{ redis: 'ok' \| 'down' }`, drives the dashboard indicator |
| GET | /api/cron/keepalive | Bearer `CRON_SECRET` | — | daily write to Redis; 401 if `CRON_SECRET` unset |
| * | /api/auth/[...all] | — | — | Better Auth; email sign-up disabled |

Rate limiting uses Upstash Redis keyed by `getClientIp` (`src/lib/ip.ts`). Limiters fail open if Redis is unreachable and log the failure. The admin dashboard shows a Redis health indicator, and a daily cron keeps the free-tier database from being deleted for inactivity.

**Admin check:** `getAdminSession(req.headers)` in `src/lib/admin.ts` validates the session against the database; if `ADMIN_EMAIL` is set, only that account passes.

---

## Env Vars

| Name | Required | Description |
|---|---|---|
| DATABASE_URL | yes | Neon pooled connection |
| DATABASE_URL_UNPOOLED | yes | Neon direct connection (migrations) |
| NEXT_PUBLIC_APP_URL | yes | Public app URL (not a secret) |
| UPSTASH_REDIS_REST_URL | yes | Upstash REST endpoint |
| UPSTASH_REDIS_REST_TOKEN | yes | Upstash REST token |
| BETTER_AUTH_SECRET | yes | Auth signing secret (`openssl rand -base64 32`) |
| BETTER_AUTH_URL | yes | Public app URL for auth origin checks |
| ADMIN_EMAIL | recommended | Only this account counts as admin |
| ADMIN_IPS | optional | Comma-separated IPs excluded from stats |
| CRON_SECRET | yes (for cron) | Bearer secret for `/api/cron/keepalive` (`openssl rand -base64 32`) |
| ALLOW_SIGNUP | leave unset | `true` only to seed the first admin, then remove |

Removed in v0.2.1: `ADMIN_SECRET`, `NEXT_PUBLIC_ADMIN_SECRET`. Delete them wherever they are set. Never put secrets in `NEXT_PUBLIC_*`.

---

## Timeline / Phases

### Phase 0 — Repo & infrastructure
Status: `[x]` done

- [x] Create Next.js 16 project (`create-next-app`)
- [x] Configure Tailwind v4 with BRAIN.md palette tokens in `globals.css`
- [x] Set up Neon project, get connection strings
- [x] Set up Upstash Redis project, get REST credentials
- [x] Configure `wrangler.jsonc` and `open-next.config.ts` for Cloudflare
- [x] Verify libwebp WASM loads same-origin from /public/wasm under the CSP
- [x] Confirm `wasm-unsafe-eval` CSP header works on both Vercel and Cloudflare
- [x] Create `.env.example` with all required vars
- [x] Connect repo to Vercel
- [ ] Connect repo to Cloudflare and verify the Workers mirror (status not verified)

### Phase 1 — DB + API
Status: `[x]` done

- [x] Write Drizzle schema (`reviews` table)
- [x] Run `drizzle-kit push` on Neon
- [x] Build `lib/db/index.ts` (lazy-getDb, neon-http driver)
- [x] Build `lib/redis.ts` (Upstash rate limiter)
- [x] Build `app/api/reviews/route.ts` (GET + POST, rate limiting, input sanitization)
- [x] Test API routes locally

### Phase 2 — Conversion engine
Status: `[x]` done

- [x] Build `lib/wasm/loader.ts` — singleton init for libwebp WASM from CDN
- [x] Build `lib/zip/processor.ts` — JSZip unpack, convert, repack with path preservation
- [x] Handle chunked batch processing (10 images at a time)
- [x] Handle Firefox ZIP-input fallback path
- [x] Test: single file, batch files, folder (Chrome), ZIP input (Firefox)

### Phase 3 — UI
Status: `[x]` done

- [x] Root layout: fonts (Syne + Inter + JetBrains Mono), metadata, CSP headers
- [x] WASM loading state — spinner shown until engine is ready
- [x] `ConverterZone` — drag-and-drop + file picker + folder picker
- [x] Browser compatibility detection — show Firefox notice before user tries folder upload
- [x] Quality slider (0–100)
- [x] Progress bar — `converted X of N`
- [x] Download button — single file or ZIP
- [x] `ReviewForm` + `ReviewList`
- [x] Footer — about section, links, review anchor

### Phase 4 — Polish & deploy
Status: `[~]` in progress

- [ ] Mobile responsiveness audit
- [ ] OG image + metadata
- [ ] Verify CSP headers in production (Vercel + Cloudflare)
- [x] Run Waterborne (emoji sweep)
- [x] Run Valley of Death (spec vs code)
- [x] Run Sentinel (security audit) — repo audit and fixes shipped in v0.2.1
- [ ] Run Airborne + Humanizer (SEO + copy)
- [ ] Run cave-man (visual audit)
- [x] Run motion-hive (animation pass)
- [ ] Call Council POST

---

## Next Steps

In order:
1. Set `ADMIN_EMAIL`; delete `ADMIN_SECRET` / `NEXT_PUBLIC_ADMIN_SECRET` wherever set; confirm `ALLOW_SIGNUP` is unset
2. Add Vitest and a lint script
3. Finish POST-BUILD: Airborne + Humanizer, cave-man, Council POST
4. Decide on tightening CSP (nonces) if the WASM build allows removing `unsafe-eval`

---

## Notes & Decisions

**2026-06-27.** Canvas API explicitly rejected as conversion engine. `canvas.toBlob('image/webp')` fails silently on Firefox — falls back to PNG. libwebp WASM chosen for consistent output across all browsers.

**2026-06-27.** libwebp WASM originally planned to load from a CDN because of the Cloudflare Workers 1MB bundle limit. (Superseded: now served same-origin from `/public/wasm`, which is not part of the Worker bundle.)

**2026-06-27.** Firefox folder upload fallback is ZIP input, not a degraded experience. User uploads a ZIP, JSZip unpacks client-side, output is the same ZIP structure. No server involved.

**2026-06-27.** Reviews query caps at 50 rows (latest). Prevents Neon free tier DB from becoming a liability if the tool goes viral.

**2026-06-27.** Upstash Redis rate limiter on POST /api/reviews. (Superseded 2026-10-04: contact and stats POST are limited too.)

**2026-07-25.** Better Auth added for the admin dashboard (admin-only; visitors still never need an account). Contacts and stats tables added. The original "no auth, reviews table only" scope in this file was superseded.

**2026-10-04.** Upstash Redis was auto-deleted after long inactivity, so all limiters had been failing open. Added a dashboard health indicator and a daily keep-alive cron (v0.2.2).

**2026-10-04.** Security hardening (v0.2.1): admin APIs moved from a shared secret (unset in production, so the public default `'changeme'` was accepted) to server-validated sessions; sign-up disabled by default; contact and stats rate limited; client IP derived from platform-trusted headers; docs synced to the code.
