'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
      {/* Main bar */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        {/* Mobile: hamburger left */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-white"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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

        {/* Mobile: right side spacer to balance hamburger */}
        <div className="w-8 sm:hidden" aria-hidden="true" />
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden flex flex-col border-t border-white/5 bg-black/60 backdrop-blur-md animate-fade-in">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-6 py-4 text-sm font-medium text-white border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
