# ImageSmith

![Version](https://img.shields.io/github/v/release/mahtamun-hoque-fahim/imageSmith?style=flat-square&color=6d66f5)
![License](https://img.shields.io/github/license/mahtamun-hoque-fahim/imageSmith?style=flat-square)
![Stars](https://img.shields.io/github/stars/mahtamun-hoque-fahim/imageSmith?style=flat-square)

Free, client-side image-to-WebP converter. Drop a folder of 1000 images, get back an identical ZIP with everything converted — folder structure preserved. No account. No uploads. Runs entirely in your browser.

**Live:** [imagesmith.vercel.app](https://imagesmith.vercel.app)

---

## Ecosystem

ImageSmith ships across three surfaces — same privacy guarantee on all of them.

| Surface | Package | Description |
|---|---|---|
| **Browser** | this repo | Drop files, convert, download. No install. |
| **CLI** | [`@imagesmith/cli`](https://www.npmjs.com/package/@imagesmith/cli) | `imagesmith convert ./assets` — for terminals and build pipelines. |
| **MCP** | [`@imagesmith/cli`](https://www.npmjs.com/package/@imagesmith/cli) | `imagesmith mcp` — tool server for Claude Code and AI agents. |

---

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **libwebp WASM** (CDN) — client-side conversion engine
- **JSZip** — client-side ZIP pack/unpack
- **Neon** (PostgreSQL) + **Drizzle ORM** — reviews table
- **Better Auth** — admin dashboard authentication
- **Upstash Redis** — rate limiting on review submissions
- **Vercel Analytics** — page view and conversion tracking
- **Vercel** (production) · **Cloudflare Workers** via `@opennextjs/cloudflare` (mirror)

---

## Prerequisites

- Node 20+
- Neon project (pooled + unpooled connection strings)
- Upstash Redis project (REST URL + token)
- Vercel account
- Cloudflare account (for secondary deploy)

## Local Setup

```bash
git clone https://github.com/mahtamun-hoque-fahim/imageSmith
cd imageSmith
npm install
cp .env.example .env.local   # fill in values — see PLANNER.md → Env Vars
npx drizzle-kit push
npm run dev
```

## Env Vars

```
DATABASE_URL
DATABASE_URL_UNPOOLED
NEXT_PUBLIC_APP_URL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
BETTER_AUTH_SECRET
BETTER_AUTH_URL
```

## Scripts

```bash
npm run dev          # local dev (Turbopack)
npm run build        # production build
npm run lint         # ESLint
npx drizzle-kit push # push schema (dev only)
```

## Deploy

**Vercel:** Push to `main` → auto-deploys. Set env vars in Vercel dashboard.

**Cloudflare:**
```bash
npx @opennextjs/cloudflare build
npx wrangler deploy
```

Both deploys require all env vars set before going live.

---

## Folder Structure

```
src/app/          routes and API handlers (App Router)
src/components/   converter, reviews, surfaces, layout UI
src/lib/          db, wasm loader, zip processor, redis
drizzle/          generated migrations
```

---

## License

MIT © [Mahtamun Hoque Fahim](https://github.com/mahtamun-hoque-fahim)
