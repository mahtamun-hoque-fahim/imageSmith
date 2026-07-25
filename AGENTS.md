# ImageSmith

Free, client-side image-to-WebP converter with folder-structure-preserving ZIP output. No auth, no server uploads, no paywall.

## Setup & Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`
- DB push (dev only): `npx drizzle-kit push`
- DB migrate (production): `npx drizzle-kit generate` then `npx drizzle-kit migrate`

## Conventions & Non-Negotiables

- No emojis anywhere in code or UI — lucide-react icons only, no hand-rolled SVGs
- Dual deploy: Vercel (primary) + Cloudflare Workers via `@opennextjs/cloudflare` — every route must stay Edge Runtime compatible
- DB driver: `neon-http` only — never `neon-ws` or `pg` (Edge Runtime requirement)
- No auth anywhere in V1 — do not add Better Auth, middleware auth guards, or session checks
- Conversion engine is libwebp WASM loaded from jsDelivr CDN — never fall back to `canvas.toBlob('image/webp')` (Firefox encodes PNG, not WebP)
- WASM CSP: `script-src 'wasm-unsafe-eval'` must be set in both Vercel and Cloudflare headers
- Batch processing is chunked (10 images at a time) — never convert all images in parallel
- Reviews table caps at 50 rows returned — never query all rows
- Firefox folder fallback is ZIP input — JSZip unpacks client-side, not a server operation
- V2 CLI tool is out of scope — do not implement, scaffold, or stub it

## Security Gotchas

- `.env.local` is never committed — if a secret leaks, rotate it immediately
- POST /api/reviews is the only server-side attack surface — Upstash Redis rate limits it to 1 per IP per hour; do not remove or bypass this
- Review content must be HTML-stripped and length-capped (max 500 chars) before writing to Neon
- No file data ever reaches the server — if any code path sends image data to an API route, that is a bug

## Session Log

(Newest first. Maximum 10 entries — drop the oldest when an 11th is added.)

### 2026-07-25 (Google Sans + scroll)
- Did: Added Google Sans font from Google Fonts across entire website. Changed default body font in globals.css from Inter to Google Sans. Fixed CTA button: added onClick handler with smooth scroll to converter section (document.getElementById + scrollIntoView). Added id="converter-section" to converter.
- Result: Consistent Google Sans typography across whole site. "Drop Your Files" button now scrolls to dropzone on click.

### 2026-07-25 (background coverage)
- Did: Fixed black gap on right side. Changed hero section from `w-full` to `w-screen` to span entire viewport width. Added explicit `w-full h-full` to background container. Background image now fills entire viewport, no more dark edges.

### 2026-07-25 (folder icon)
- Did: Replaced custom 3D SVG folder with generic lucide-react Folder icon. Added purple glow using `drop-shadow-[0_0_40px_rgba(192,132,250,0.6)]` and subtle pulse animation. Cleaner, simpler, more maintainable.

### 2026-07-25 (gap fix)
- Did: Fixed huge gap on right side. ZIP icon was positioned with `-right-16` (offscreen on mobile). Changed to `right-0 bottom-0` anchored to corner. Increased sizing from w-64/h-64 → w-80/h-80 (mobile) and w-96/h-96 → w-[32rem]/h-[32rem] (desktop). Changed from `object-contain` to `object-cover` so ZIP fills container.
- Result: ZIP icon now fills right side properly, balances folder on left, no more black gap.

### 2026-07-25 (final polish)
- Session Start: `git config user.name "mahtamun-hoque-fahim"` & `git config user.email "mahtamunhoquefahim@gmail.com"`
- Did: Final hero polish pass. Added parallax scroll effect to background image (translateY at 0.5x scroll speed). Made nav sticky (position: sticky, top-0, z-50) with backdrop-blur-md + bg-black/40 + subtle border-b. Increased breathing space between hero and converter (py-32).
- Stack: Converted page.tsx to client component ('use client'). Added useEffect hook for smooth scroll parallax. Tailwind sticky, backdrop-blur utilities.
- Result: Hero now has depth via parallax. Nav stays visible while scrolling with frosted-glass effect. Converter has proper whitespace separation.

### 2026-07-25 (continued)
- Did: Hero polish after live review. Replaced weak outline folder SVG with solid 3D gradient folder (purple/indigo gradient with shadow depth). Repositioned ZIP icon to bottom-right to prevent cutoff. Fixed button styling: solid white bg with border-0, larger shadow, better active states.
- Improved: Full min-h-screen (was min-h-[70vh]). Better spacing (gap-12). Text sizing scaled up (Rapid Conversion md:text-2xl, headline md:text-8xl). Added gradient overlay to background for text contrast.
- Result: Hero now matches design reference — solid icons, no cutoff, button is crisp white, full-screen proportions.

### 2026-07-25
- Session Start: `git config user.name "mahtamun-hoque-fahim"` & `git config user.email "mahtamunhoquefahim@gmail.com"`
- Did: Complete hero UI redesign. Rebuilt nav (added About/Contact/Privacy links), removed hero image + description paragraph, replaced with dark background with blue wave pattern. Added decorative folder icon (left) + zip icon (right). New headline: "Rapid Conversion to .WEBP". White CTA button "Drop Your Files" with Download icon.
- Assets: Copied background.png (dark hero with waves) and zip-icon.png to /public/images/. Folder icon implemented as inline SVG with gradient.
- Kept: Converter, features, reviews, footer sections untouched.
- Stack: Next.js 16, Tailwind v4, lucide-react (Download icon).

### 2026-06-27
- Did: Project anchored via Singularity. BRAIN.md, SITETREE.md, PLANNER.md, DESIGN_GUIDE.md, README.md, AGENTS.md all committed.
- Decided: libwebp WASM over Canvas API (Firefox WebP encoding failure). WASM loads from CDN not bundled (Cloudflare 1MB limit). Firefox folder fallback is ZIP upload.
- Next: Scaffold Next.js 16 project, configure Tailwind v4 palette tokens, verify WASM CDN loads with correct CSP headers.
