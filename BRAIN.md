# BRAIN.md — ImageSmith

> This file is maintained by the Singularity skill. It is the identity document of this project.
> When Claude drifts, hallucinates, or loses context — this file is the source of truth.
> Do not confuse this with PLANNER.md (tasks/phases) or DESIGN_GUIDE.md (design tokens).

---

## The One-Line Truth

ImageSmith is a free, client-side web tool that converts any image or folder of images to WebP using libwebp WASM — preserving folder structure in the output ZIP — with no paywall, no uploads, and no account required.

---

## Why It Exists

Every online image converter either paywalls batch conversion, destroys folder structure on output, or uploads files to a server. Developers who need to convert 100–1000 images across nested folders have no clean, free, private solution. Fahim is building ImageSmith because he needs it himself, and because the folder-structured ZIP output gap is real and unsolved by existing tools including Squoosh.

---

## What It Must Become

Done feels like: drop a ZIP or folder of 1000 images in any format, get back an identical ZIP with every image converted to WebP — same folder tree, same filenames, just `.webp`. Fast, private, free, forever.

---

## Core Decisions (Locked)

- [LOCKED] Client-side only via libwebp WASM — files never leave the user's machine, no server processing
- [LOCKED] JSZip for output — rebuilds the exact folder tree in the output ZIP
- [LOCKED] `<input webkitdirectory>` for folder ingestion — uses `file.webkitRelativePath` to preserve paths
- [LOCKED] No visitor authentication — zero friction, open and use. Better Auth exists ONLY for the single-admin dashboard; public sign-up is disabled
- [LOCKED] Neon + Drizzle stores reviews, contact messages, usage stats and the Better Auth tables (user, session, account, verification)
- [LOCKED] V1 = web app only. V2 = CLI tool (out of scope for V1, do not implement)
- [LOCKED] No Supabase — Neon only
- [LOCKED] Conversion engine is libwebp WASM on ALL browsers — Canvas API is NOT used (Firefox cannot encode WebP via canvas.toBlob)
- [LOCKED] Folder upload via `webkitdirectory` — Chrome, Edge, Safari only
- [LOCKED] Firefox folder fallback — ZIP file upload instead; JSZip unpacks client-side, converts all images, repacks with identical structure
- [LOCKED] Firefox users get: single file upload (yes), ZIP upload (yes), folder drag-and-drop (no — clear browser notice shown)

---

## Visual Identity (Locked)

> Chosen in Phase 1.5 — Palette B "Studio". These values are locked. Do not substitute with `#00e676`, `#0a0a0a`, `#131720`, or `#6C63FF`. Do not invent new values. If you need a token not listed here, derive it from the accent at reduced opacity and flag it for Fahim.

| Token | Value | Usage |
|---|---|---|
| `bg` | #0A0D15 | Page background |
| `surface` | #13161f | Card, panel, input backgrounds |
| `surface-elevated` | #1a1d28 | Raised elements, dropdowns |
| `accent` | #6d66f5 | Primary actions, links, glows |
| `accent-faint` | #6d66f51a | Ring/border accent at 10% opacity |
| `border` | #1e2030 | Default border colour |
| `text` | #eef0ff | Primary text |
| Font (display) | Clash Display | Headings |
| Font (body) | Inter | Body copy |
| Font (mono) | JetBrains Mono | File names, paths, numbers |

---

## What It Must Never Become

- Never paywalled or subscription-gated — that's the entire reason it exists
- Never a server-side file processor — files must never leave the user's machine
- Never a general image editor — no crop, resize, filters, or format conversion beyond WebP
- Never account-required for visitors — no sign-up, no login wall (the admin login is not visitor-facing)
- Never a SaaS with plans and limits — it is and will always be completely free
- Never CLI code in this repo — the CLI and MCP server ship separately as `@imagesmith/cli`

---

## Current State

```
Status: v0.2.2 — live, security-hardened, Redis health + keep-alive
Last updated: 2026-10-04

What works:
- Full converter UI (single file, batch, folder, ZIP input), chunked 10 at a time
- libwebp WASM served same-origin from /public/wasm (script-tag injection)
- JSZip folder-structure-preserving output ZIP, Firefox ZIP fallback
- Reviews (GET/POST, 1/IP/hour), contact form (5/IP/hour), stats (60/IP/min)
- Admin dashboard (messages, reviews, stats) behind a validated Better Auth session; sign-up disabled
- Pages: /, /about, /contact, /privacy, /login, /admin
- Build: PASS, tsc: PASS

What's broken or incomplete:
- No test runner and no lint script
- CSP keeps unsafe-eval / unsafe-inline (WASM embind + Next inline scripts)
- airborne, humanizer, cave-man, council POST not recorded as done

What's next:
- Set ADMIN_EMAIL; delete ADMIN_SECRET / NEXT_PUBLIC_ADMIN_SECRET wherever set
- Add Vitest, add lint script
- Finish POST-BUILD pipeline
```

---

## The Stack (Frozen)

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Neon (PostgreSQL) + Drizzle ORM |
| Auth | Better Auth, single admin account, sign-up disabled |
| Conversion Engine | libwebp compiled to WASM (client-side) |
| ZIP Output | JSZip |
| Rate limiting | Upstash Redis |
| Deployment | Vercel (primary) + Cloudflare Workers via @opennextjs/cloudflare (mirror) |
| Edge Runtime | Required — neon-http driver only |

---

## Constraints & Non-Negotiables

- Must deploy to both Vercel and Cloudflare Workers (Edge Runtime compatible)
- No emojis in UI — lucide-react icons only
- Dark-first, no light mode
- No Supabase — Neon only
- Files must never leave the client — all processing is browser-side
- libwebp WASM is served same-origin from /public/wasm — not a remote API call
- No hand-rolled SVGs — lucide-react only
- No visitor-facing auth — the only login is the admin dashboard

---

## Context Hooks (for Claude)

- The conversion engine is **libwebp WASM**, not Canvas API — do not fall back to `canvas.toBlob('image/webp')` even if WASM feels complex
- JSZip rebuilds the **exact folder tree** using `file.webkitRelativePath` — do not flatten the output
- Neon/Drizzle holds reviews, contacts, stats and the Better Auth tables — do not add other tables unless Fahim explicitly asks
- Edge Runtime is required for Cloudflare — always use `neon-http` driver, never `neon-ws` or `pg`
- Auth is **admin-only**: use `getAdminSession` in `src/lib/admin.ts` for admin routes; never add visitor sign-up; never put secrets in `NEXT_PUBLIC_*`

---

*Last updated 2026-10-04 (security hardening sync)*
