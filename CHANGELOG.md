# Changelog

## [v0.1.0] — 2026-06-29

### Added
- Full converter UI: single file, batch, folder (webkitdirectory), ZIP input with Firefox fallback (2db860d)
- libwebp WASM engine via script-tag injection — bypasses Turbopack CJS bundling, works on all browsers including Firefox (2db860d)
- JSZip structure-preserving output — identical folder tree and filenames, .webp extension only (2db860d)
- Chunked batch processing (10/batch) with per-file progress feedback (2db860d)
- Quality slider (1–100) (2db860d)
- /api/reviews — GET + POST, Upstash Redis rate limit 1/hr per IP, HTML sanitised, 500-char cap (2db860d)
- SEO: meta titles/descriptions, sitemap.xml, robots.txt, JSON-LD (SoftwareApplication + WebSite), canonical tags (df1481b)
- Microinteractions and entrance animations across all interactive zones (e535ab3)
- Image slot placeholder system with paste-ready IMAGE-BRIEF tags (c01a6d4, a8af2df, 74d9968)
- Skeleton-shimmer on new image slots (3ad2dcb)
- Humanizer pass: de-AI all user-facing prose (8b3074b)

### Fixed
- 2 MEDIUM sentinel security findings (f93b152)
- 2 valley-of-death spec-vs-code audit FAILs (757abcc)

### Changed
- Waterborne: replaced check/cross glyphs with plain text in BRAIN.md (37b8322)
- Repo docs initialised: BRAIN.md, PLANNER.md, DESIGN_GUIDE.md, README.md, AGENTS.md, SITETREE.md (57d8b65)
