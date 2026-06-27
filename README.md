# ImageSmith

Free, client-side image-to-WebP converter. Drop a folder of 1000 images, get back an identical ZIP with everything converted — folder structure preserved.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Neon (PostgreSQL) + Drizzle ORM — reviews table only
- Upstash Redis — rate limiting on POST /api/reviews
- libwebp WASM (CDN) — client-side conversion engine
- JSZip — client-side ZIP pack/unpack
- Vercel (production), Cloudflare Workers via @opennextjs/cloudflare (mirror)

## Prerequisites

- Node 20+
- A Neon project (pooled + unpooled connection strings)
- An Upstash Redis project (REST URL + token)
- Vercel account
- Cloudflare account (for secondary deploy)

## Local setup

1. Clone the repo: `git clone https://github.com/mahtamun-hoque-fahim/imageSmith`
2. Install: `npm install`
3. Copy `.env.example` to `.env.local` and fill in values (see PLANNER.md → Env Vars)
4. Push schema: `npx drizzle-kit push`
5. Run dev: `npm run dev`

## Env vars

See PLANNER.md → Env Vars for descriptions. Names only:

```
DATABASE_URL
DATABASE_URL_UNPOOLED
NEXT_PUBLIC_APP_URL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

## Scripts

```bash
npm run dev                    # local dev server (Turbopack)
npm run build                  # production build
npm run start                  # serve production build
npm run lint                   # ESLint
npx drizzle-kit push           # push schema directly (dev only)
npx drizzle-kit generate       # generate migration from schema
npx drizzle-kit migrate        # apply migrations (production)
```

## Deploy

**Vercel:** Push to `main` → auto-deploys. Set env vars in Vercel dashboard (Production + Preview).

**Cloudflare:**
```bash
npx @opennextjs/cloudflare build
npx wrangler deploy
```
Set env vars in Cloudflare dashboard as Worker secrets.

Both deploys must have all five env vars set before going live.

## Folder structure

```
app/             routes and API handlers (App Router)
components/      converter, reviews, layout UI
lib/             db, wasm loader, zip processor, redis
drizzle/         generated migrations
```

See PLANNER.md → Architecture for full detail.
