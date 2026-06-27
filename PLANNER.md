# ImageSmith — Planner

> Free, client-side image-to-WebP converter with folder-structure-preserving ZIP output. For developers who refuse to pay or upload their files to a third-party server.

## Project Overview

**Purpose.** Every online image converter either paywalls batch conversion, destroys folder structure on output, or uploads files to a server. ImageSmith solves all three at once: 100% client-side via libwebp WASM, batch + folder support, and a ZIP output that mirrors the exact input folder tree.

**Target user.** Developers converting project image assets — individually, in bulk, or as whole directory trees — who need it free, private, and folder-structure-preserving.

**Key value.** Drop a folder or ZIP of 1000 images in any format. Get back an identical ZIP with every image converted to WebP. Same folder tree. Same filenames. Just `.webp`.

**Current phase.** Planning

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4
- Database: Neon (PostgreSQL) — reviews table only
- ORM: Drizzle
- Auth: None — no auth in V1
- Conversion engine: libwebp WASM (client-side, loaded from CDN)
- ZIP output: JSZip (client-side)
- Rate limiting: Upstash Redis (for /api/reviews only)
- Deployment: Vercel (primary), Cloudflare Workers via @opennextjs/cloudflare (secondary)

**Deployment topology:**
- `main` → Vercel production
- PRs → Vercel preview
- `main` → Cloudflare Workers production (mirror via @opennextjs/cloudflare)

**Critical constraint:** Edge Runtime required for Cloudflare. Use `neon-http` driver only. Never `neon-ws` or `pg`.

**WASM loading strategy:** libwebp WASM loads client-side from jsDelivr CDN, not bundled in the Next.js build. Reason: Cloudflare Workers have a 1MB compressed bundle limit; the WASM binary exceeds this. CDN loading avoids the limit entirely.

**Firefox folder upload fallback:** `webkitdirectory` is unavailable on Firefox. Firefox users upload a ZIP file instead — JSZip unpacks it client-side, converts all images, repacks with identical structure.

**Folder structure (summary):**
```
app/
  page.tsx          — single-page app (converter + about + footer)
  layout.tsx        — root layout, fonts, metadata
  globals.css       — Tailwind v4 @theme tokens
  api/
    reviews/
      route.ts      — GET + POST reviews
components/
  converter/        — ConverterZone, ProgressBar, DownloadButton
  reviews/          — ReviewForm, ReviewList
  layout/           — Footer
lib/
  db/
    index.ts        — lazy-getDb (neon-http)
    schema.ts       — reviews table
  wasm/
    loader.ts       — libwebp WASM init + singleton
  zip/
    processor.ts    — JSZip pack/unpack + convert orchestrator
  redis.ts          — Upstash Redis rate limiter
drizzle/            — generated migrations
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

---

## DB Schema

Drizzle schema lives in `lib/db/schema.ts`. Summary:

### reviews
| column | type | notes |
|---|---|---|
| id | text PK | nanoid |
| content | text | max 500 chars — enforced at API level |
| createdAt | timestamp | defaultNow |

No user table. No session table. No auth tables of any kind in V1.

---

## API Routes

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | /api/reviews | none | — | `Review[]` (latest 50, ordered by createdAt desc) |
| POST | /api/reviews | none (rate limited) | `{ content: string }` | `Review` |

**Rate limiting:** POST /api/reviews is rate limited via Upstash Redis — 1 request per IP per hour. Return 429 with message `"Too many reviews. Try again later."` on breach.

**Input validation (POST):**
- `content` required, string, min 1 char, max 500 chars
- Strip any HTML before writing to Neon
- Return 400 with message if validation fails

---

## Env Vars

| Name | Required | Description | Example |
|---|---|---|---|
| DATABASE_URL | yes | Neon pooled connection | `postgresql://...?sslmode=require` |
| DATABASE_URL_UNPOOLED | yes | Neon direct connection (migrations) | `postgresql://...?sslmode=require` |
| NEXT_PUBLIC_APP_URL | yes | Public app URL, client-readable | `https://imagesmith.vercel.app` |
| UPSTASH_REDIS_REST_URL | yes | Upstash Redis REST endpoint | `https://....upstash.io` |
| UPSTASH_REDIS_REST_TOKEN | yes | Upstash Redis REST token | `AX...` |

No `BETTER_AUTH_SECRET`, no `BETTER_AUTH_URL` — there is no auth in V1.

---

## Timeline / Phases

### Phase 0 — Repo & infrastructure
Status: `[ ]` pending

- [ ] Create Next.js 16 project (`create-next-app`)
- [ ] Configure Tailwind v4 with BRAIN.md palette tokens in `globals.css`
- [ ] Set up Neon project, get connection strings
- [ ] Set up Upstash Redis project, get REST credentials
- [ ] Configure `wrangler.jsonc` and `open-next.config.ts` for Cloudflare
- [ ] Verify libwebp WASM loads from jsDelivr CDN in browser (CSP test)
- [ ] Confirm `wasm-unsafe-eval` CSP header works on both Vercel and Cloudflare
- [ ] Create `.env.example` with all required vars
- [ ] Connect repo to Vercel and Cloudflare

### Phase 1 — DB + API
Status: `[ ]` pending

- [ ] Write Drizzle schema (`reviews` table)
- [ ] Run `drizzle-kit push` on Neon
- [ ] Build `lib/db/index.ts` (lazy-getDb, neon-http driver)
- [ ] Build `lib/redis.ts` (Upstash rate limiter)
- [ ] Build `app/api/reviews/route.ts` (GET + POST, rate limiting, input sanitization)
- [ ] Test API routes locally

### Phase 2 — Conversion engine
Status: `[ ]` pending

- [ ] Build `lib/wasm/loader.ts` — singleton init for libwebp WASM from CDN
- [ ] Build `lib/zip/processor.ts` — JSZip unpack, convert, repack with path preservation
- [ ] Handle chunked batch processing (10 images at a time)
- [ ] Handle Firefox ZIP-input fallback path
- [ ] Test: single file, batch files, folder (Chrome), ZIP input (Firefox)

### Phase 3 — UI
Status: `[ ]` pending

- [ ] Root layout: fonts (Syne + Inter + JetBrains Mono), metadata, CSP headers
- [ ] WASM loading state — spinner shown until engine is ready
- [ ] `ConverterZone` — drag-and-drop + file picker + folder picker
- [ ] Browser compatibility detection — show Firefox notice before user tries folder upload
- [ ] Quality slider (0–100)
- [ ] Progress bar — `converted X of N`
- [ ] Download button — single file or ZIP
- [ ] `ReviewForm` + `ReviewList`
- [ ] Footer — about section, links, review anchor

### Phase 4 — Polish & deploy
Status: `[ ]` pending

- [ ] Mobile responsiveness audit
- [ ] OG image + metadata
- [ ] Verify CSP headers in production (Vercel + Cloudflare)
- [ ] Run Waterborne (emoji sweep)
- [ ] Run Valley of Death (spec vs code)
- [ ] Run Sentinel (security audit)
- [ ] Run Airborne + Humanizer (SEO + copy)
- [ ] Run cave-man (visual audit)
- [ ] Run motion-hive (animation pass)
- [ ] Call Council POST

---

## Next Steps

In order:
1. Scaffold Next.js 16 project locally
2. Configure Tailwind v4 palette tokens from BRAIN.md
3. Verify libwebp WASM loads from CDN with correct CSP headers — this is Phase 0 gate

---

## Notes & Decisions

**2026-06-27.** Canvas API explicitly rejected as conversion engine. `canvas.toBlob('image/webp')` fails silently on Firefox — falls back to PNG. libwebp WASM chosen for consistent output across all browsers.

**2026-06-27.** libwebp WASM loads from CDN, not bundled. Reason: Cloudflare Workers 1MB compressed bundle limit. CDN approach also means WASM updates independently of the Next.js deploy.

**2026-06-27.** Firefox folder upload fallback is ZIP input, not a degraded experience. User uploads a ZIP, JSZip unpacks client-side, output is the same ZIP structure. No server involved.

**2026-06-27.** Reviews query caps at 50 rows (latest). Prevents Neon free tier DB from becoming a liability if the tool goes viral.

**2026-06-27.** Upstash Redis rate limiter on POST /api/reviews only. This is the entire attack surface of the app — everything else is client-side.
