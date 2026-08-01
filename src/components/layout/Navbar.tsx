'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Fixed bar ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">

          {/* Mobile: hamburger left */}
          <button
            className="sm:hidden flex items-center justify-center w-8 h-8 text-white"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo — centered on mobile, left on desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <img src="/logo.svg" alt="ImageSmith" className="h-7 sm:h-8" />
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-8 text-white">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium hover:opacity-70 transition-opacity"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile: right spacer to balance hamburger */}
          <div className="w-8 sm:hidden" aria-hidden="true" />
        </div>
      </nav>

      {/* ── Mobile modal overlay ───────────────────────────────────────── */}
      {/* Backdrop — blurred, fades in */}
      <div
        className={[
          'fixed inset-0 z-[60] sm:hidden',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Modal card — slides in from left */}
      <div
        className={[
          'fixed top-1/2 left-1/2 z-[70] sm:hidden',
          '-translate-y-1/2',
          'w-[78vw] max-w-xs',
          'bg-surface border border-white/10 rounded-2xl',
          'px-6 py-7 flex flex-col gap-8',
          'transition-all duration-300 ease-out',
          open
            ? '-translate-x-1/2 opacity-100'
            : '-translate-x-[calc(50%+60vw)] opacity-0',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Top row — logo + close */}
        <div className="flex items-center justify-between">
          <img src="/logo.svg" alt="ImageSmith" className="h-6" />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-3 text-sm font-medium text-white/80 hover:text-white border-b border-white/5 last:border-0 transition-colors"
            >
              {label}
              <ChevronRight className="w-4 h-4 text-white/40" />
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
