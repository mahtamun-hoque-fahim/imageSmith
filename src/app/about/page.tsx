import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — ImageSmith',
  description: 'Learn about ImageSmith, the free browser-based WebP converter, and its creator Mahtamun Hoque Fahim.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">

      <Navbar />

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
        {/* Mobile: stacked, centered, full-width button. Desktop: horizontal card unchanged. */}
        <div className="p-6 border border-border rounded-lg flex flex-col items-center text-center gap-5 sm:flex-row sm:items-center sm:text-left sm:gap-4">
          <div className="flex-1">
            <p className="text-text font-bold text-xl sm:text-base sm:font-medium mb-1">Want to get in touch ?</p>
            <p className="text-text-muted text-sm">Reach out on the contact page — for bugs, ideas, or just to say hi.</p>
          </div>
          <Link
            href="/contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white text-accent text-sm font-semibold hover:bg-gray-100 transition-colors sm:bg-white sm:text-black shrink-0 rounded-sm"
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
