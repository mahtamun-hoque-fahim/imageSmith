# ImageSmith — Design Guide

Implementation spec for the design system. No rationale. No marketing copy. Just tokens, patterns, and constraints.

## Color tokens

CSS variables in `app/globals.css` (Tailwind v4 — tokens auto-promote to utilities):

```css
@import "tailwindcss";

@theme {
  /* Surfaces */
  --color-bg: #0d0f14;
  --color-surface: #13161f;
  --color-surface-elevated: #1a1d28;
  --color-border: #1e2030;

  /* Text */
  --color-text: #eef0ff;
  --color-text-muted: #8890b0;
  --color-text-faint: #4a5070;

  /* Brand — Studio / Indigo */
  --color-accent: #6d66f5;
  --color-accent-hover: #5c56d4;
  --color-accent-faint: #6d66f51a;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.4);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.5);
  --shadow-lg: 0 12px 32px rgb(0 0 0 / 0.6);
  --shadow-glow: 0 0 24px #6d66f51a;
}
```

## Typography

**Families** (loaded via `next/font` in `app/layout.tsx`):
- Display: Syne (`--font-syne`) — h1, h2, hero text, section headers
- Body: Inter (`--font-inter`) — default for all body copy, labels, UI text
- Mono: JetBrains Mono (`--font-mono`) — file names, paths, counters, conversion stats

**Weights used:**
- Body: 400 (regular), 500 (medium for emphasis), 600 (buttons, labels)
- Display: 600 (semibold), 700 (bold for hero)
- Mono: 400, 500

**Size scale (rem):**
| Token | Size | Use |
|---|---|---|
| `text-xs` | 0.75rem | Captions, file extensions, badges |
| `text-sm` | 0.875rem | Secondary text, form labels, review meta |
| `text-base` | 1rem | Body |
| `text-lg` | 1.125rem | Lead paragraphs |
| `text-xl` | 1.25rem | h4, card titles |
| `text-2xl` | 1.5rem | h3, section subheadings |
| `text-3xl` | 1.875rem | h2 |
| `text-4xl` | 2.25rem | h1 body pages |
| `text-6xl` | 3.75rem | Hero headline |

**Line height:** 1.6 for body, 1.2 for display.

## Spacing scale

Tailwind defaults. Common values: 2 (8px), 4 (16px), 6 (24px), 8 (32px), 12 (48px), 16 (64px), 24 (96px).

## Border radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Badges, file extension chips |
| `rounded-md` | 6px | Buttons (default) |
| `rounded-lg` | 8px | Cards, panels |
| `rounded-xl` | 12px | Converter drop zone, modals |
| `rounded-full` | 9999px | Progress indicators, pill badges |

## Shadows

```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.4);
--shadow-md: 0 4px 12px rgb(0 0 0 / 0.5);
--shadow-lg: 0 12px 32px rgb(0 0 0 / 0.6);
--shadow-glow: 0 0 24px var(--color-accent-faint);
```

Use sparingly — depth comes from surface lightness, not shadow.

## Components

### Button — primary
```tsx
<button className="bg-accent text-bg px-4 py-2 rounded-md font-semibold hover:bg-accent-hover transition-colors duration-150">
  Convert
</button>
```

### Button — secondary
```tsx
<button className="bg-surface text-text px-4 py-2 rounded-md border border-border hover:bg-surface-elevated transition-colors duration-150">
  Cancel
</button>
```

### Button — ghost
```tsx
<button className="text-text-muted hover:text-text px-3 py-2 rounded-md transition-colors duration-150">
  Clear
</button>
```

### Converter drop zone
```tsx
<div className="bg-surface border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-4
  hover:border-accent hover:bg-accent/5 transition-colors duration-150 cursor-pointer
  data-[active=true]:border-accent data-[active=true]:bg-accent/5">
  {/* icon + label + subtext */}
</div>
```

### Input (review text area)
```tsx
<textarea className="bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-faint
  focus:border-accent focus:outline-none transition-colors resize-none w-full" />
```

### Card
```tsx
<div className="bg-surface border border-border rounded-lg p-6">
  ...
</div>
```

### Badge — file format
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium font-mono bg-accent-faint text-accent">
  .JPG
</span>
```

### Progress bar
```tsx
<div className="w-full bg-surface-elevated rounded-full h-1.5">
  <div
    className="bg-accent h-1.5 rounded-full transition-all duration-150"
    style={{ width: `${percent}%` }}
  />
</div>
```

### WASM loading state
```tsx
<div className="flex items-center gap-2 text-text-muted text-sm">
  <Loader2 className="w-4 h-4 animate-spin text-accent" />
  <span>Loading conversion engine...</span>
</div>
```

### Browser compatibility notice (Firefox)
```tsx
<div className="flex items-start gap-3 bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-muted">
  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
  <span>Folder upload requires Chrome or Edge. Upload a ZIP file instead — folder structure is preserved.</span>
</div>
```

## Animation defaults

- Hover transitions: `transition-colors duration-150 ease-out`
- Progress bar fill: `transition-all duration-150 ease-out`
- Drop zone active state: `transition-colors duration-150 ease-out`
- Modal/overlay enter: `transition-opacity duration-200 ease-out`
- Maximum UI animation: 300ms. Longer feels sluggish on a conversion tool.

Always wrap motion in `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Dark mode notes

Dark-first. No light mode.

- Never use pure `#000000` for background — use `--color-bg` (#0d0f14)
- Never use pure `#ffffff` for text — use `--color-text` (#eef0ff)
- Elevation = surface lightness: bg → surface → surface-elevated
- Glow effects via `--shadow-glow` on accent elements only

## Focus indicators

Always visible. Never `outline: none` without a replacement.

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

## Icons

Lucide-react only. No hand-rolled SVGs. No emojis. Recommended icon set for this project:

| Context | Icon |
|---|---|
| File upload | `Upload` |
| Folder upload | `FolderOpen` |
| ZIP input | `FileArchive` |
| Converting | `Loader2` (animate-spin) |
| Done | `CheckCircle` |
| Download | `Download` |
| Error | `AlertCircle` |
| Browser notice | `Info` |
| Quality | `Sliders` |
| Review | `MessageSquare` |
