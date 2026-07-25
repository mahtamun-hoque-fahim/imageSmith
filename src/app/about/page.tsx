import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — ImageSmith',
  description: 'Learn about ImageSmith, the free browser-based WebP converter, and its creator Mahtamun Hoque Fahim.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between backdrop-blur-md bg-black/30 border-b border-white/5">
        <Link href="/">
          <img src="/logo.svg" alt="ImageSmith" className="h-8" />
        </Link>
        <div className="flex items-center gap-8 text-white">
          <Link href="/about" className="text-sm font-medium opacity-100">About</Link>
          <Link href="/contact" className="text-sm font-medium hover:opacity-70 transition-opacity">Contact</Link>
          <Link href="/privacy" className="text-sm font-medium hover:opacity-70 transition-opacity">Privacy Policy</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pt-40 pb-24">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to converter
        </Link>

        {/* About the tool */}
        <section className="mb-20">
          <h1 className="text-4xl font-bold text-text mb-6">About ImageSmith</h1>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            ImageSmith is a free, browser-based WebP converter built for developers, designers, and anyone tired of uploading their files to some random third-party server just to convert an image format.
          </p>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            Drop a single file, a batch, an entire folder, or a ZIP archive — ImageSmith converts everything to WebP using libwebp compiled to WebAssembly, running entirely in your browser. Your files never leave your device.
          </p>
          <p className="text-text-muted text-lg leading-relaxed">
            The output ZIP preserves your exact folder structure. Same file names, same directory tree — just <span className="font-mono text-text">.webp</span> instead of whatever you started with.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-border mb-20" />

        {/* About the creator */}
        <section className="mb-16">
          <p className="text-sm text-text-muted uppercase tracking-widest mb-4">The Creator</p>
          <h2 className="text-3xl font-bold text-text mb-6">Mahtamun Hoque Fahim</h2>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            Fahim is a CSE student at BGC Trust University Bangladesh and a Frontend AI Engineering Intern at Flyrank.ai. He has been designing since 2016 — across brand identity, UI/UX, edtech, and print — and picked up development to build the tools he kept wishing existed.
          </p>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            ImageSmith came out of a real problem: converting hundreds of images while keeping a folder structure intact, without uploading anything to a server. So he built it. That's the pattern — notice the gap, ship the fix.
          </p>
          <p className="text-text-muted text-lg leading-relaxed">
            When he's not building tools, he's contributing to open source, competing in hackathons, and learning competitive programming in C++.
          </p>
        </section>

        {/* CTA to contact */}
        <div className="flex items-center gap-4 p-6 border border-border rounded-lg">
          <div className="flex-1">
            <p className="text-text font-medium mb-1">Want to get in touch?</p>
            <p className="text-text-muted text-sm">Reach out on the contact page — for bugs, ideas, or just to say hi.</p>
          </div>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors shrink-0"
          >
            Contact
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <Footer />
    </main>
  )
}
