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
  const [mounted, setMounted] = useState(false)

  // two-frame trick: mount first, then set mounted to trigger CSS transition
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setMounted(true))
      )
      return () => cancelAnimationFrame(raf)
    } else {
      setMounted(false)
    }
  }, [open])

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // on desktop: close if accidentally open
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <>
      {/* ── Fixed bar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">

          {/* Hamburger — only visible on mobile via CSS, not sm:hidden */}
          <button
            className="flex sm:hidden items-center justify-center w-8 h-8 text-white"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <img src="/logo.svg" alt="ImageSmith" className="h-7 sm:h-8" />
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-8 text-white">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm font-medium hover:opacity-70 transition-opacity">
                {label}
              </Link>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex sm:hidden w-8" aria-hidden="true" />
        </div>
      </nav>

      {/* ── Mobile modal — no Tailwind breakpoint classes inside ──── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
          />

          {/* Card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: 9999,
              width: '78vw',
              maxWidth: '320px',
              transform: mounted
                ? 'translate(-50%, -50%)'
                : 'translate(calc(-50% - 80px), -50%)',
              opacity: mounted ? 1 : 0,
              transition: 'transform 0.32s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease',
              backgroundColor: '#1a1d28',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            {/* Logo + close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <img src="/logo.svg" alt="ImageSmith" style={{ height: '24px' }} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 0, padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Links */}
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {LINKS.map(({ href, label }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.85)',
                    borderBottom: i < LINKS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                  <ChevronRight size={16} color="rgba(255,255,255,0.35)" />
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
