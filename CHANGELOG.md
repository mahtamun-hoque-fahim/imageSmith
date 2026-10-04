# Changelog

## [v0.2.1] — 2026-10-04

### Security
- Admin messages API (`/api/admin/contacts`) now requires a validated Better Auth session. The shared-secret scheme is removed. In production `ADMIN_SECRET` was unset, so the server accepted the publicly visible default `'changeme'` (and any `NEXT_PUBLIC_ADMIN_SECRET` would have been shipped to the browser). Delete `ADMIN_SECRET` / `NEXT_PUBLIC_ADMIN_SECRET` anywhere they are set.
- Public sign-up is disabled by default (`disableSignUp`); set `ALLOW_SIGNUP=true` only to seed an admin.
- `/api/stats` GET uses the same server-side admin check; optional `ADMIN_EMAIL` allowlist added.
- Rate limits added: `POST /api/contact` 5 per IP per hour, `POST /api/stats` 60 per IP per minute.
- New `lib/ip.ts` resolves the client IP from platform-trusted headers (`cf-connecting-ip` on Cloudflare, Vercel headers on Vercel). Fixes the reviews rate limit being bypassable on the Cloudflare mirror via `x-forwarded-for`.
- Stricter JSON parsing and type checks on contact, stats and admin routes.

### Added
- `.env.example`

### Changed
- Docs synced to the code: BRAIN, PLANNER, AGENTS, SITETREE, README, sitemap now reflect v0.2.x (admin auth, extra tables, same-origin WASM).

## [v0.2.0] — 2026-07-25

### Added
- Hero section redesign: dark background with blue arc graphic, parallax scroll, floating folder + ZIP icons
- Sticky frosted-glass navbar with About / Contact / Privacy Policy links
- `/about` page: tool description + creator bio + link to contact
- `/contact` page: form with name/email/message, email + LinkedIn links
- `/privacy` page: 8-section privacy policy
- `/login` page: Better Auth email + password login
- `/admin` dashboard: Messages + Reviews tabs, mark-as-read, sign out, stats cards
- Page view + conversion tracking in DB
- Vercel Analytics integration
- Footer redesign: dark background image, nav links, copyright bar
- Contacts DB table + API routes (POST /api/contact, GET|PATCH /api/admin/contacts)
- Stats DB table + /api/stats (GET session-protected, POST public)
- Better Auth: user/session/account/verification tables via Drizzle adapter
- Google Sans font across entire site

### Fixed
- CSS syntax error in globals.css (orphaned keyframe body)
- ZIP icon distortion from fixed h-72 (removed, width-only sizing now)
- Horizontal overflow gap on right side of hero
- Build error: Linkedin not in lucide-react, replaced with ExternalLink
- Stats GET refactored to use Better Auth session (no NEXT_PUBLIC secret on client)

### Changed
- CTA button: sharp corners, scrolls to converter on click
- Hero background: clean dark graphic, no baked-in text
- Footer background: dark arc graphic matching site tone
- Nav links from anchor hashes to proper Next.js Link routing

## [v0.1.0] — 2026-06-27

- Initial release: WASM WebP converter, folder structure preserved in ZIP, Firefox ZIP upload fallback, star rating reviews system
