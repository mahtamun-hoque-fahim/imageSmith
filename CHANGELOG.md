# Changelog

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
