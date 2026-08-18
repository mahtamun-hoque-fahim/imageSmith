'use client'

import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lock, FolderOpen, Zap } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'

const FEATURES = [
  {
    icon: Lock,
    title: 'No Server. No Upload.',
    desc: "All conversion happens in your browser using cutting-edge web technologies. Nothing touches a server. We don't know where your camera is.",
  },
  {
    icon: FolderOpen,
    title: 'Folders come back whole',
    desc: 'Drop a nasty folder. The output ZIP mirrors it exactly — subfolders, filenames, everything. Only the file extension changes.',
  },
  {
    icon: Zap,
    title: 'No paywall. No limits.',
    desc: "Even if you convert 1000 images, it's still free. No account. Just drag, drop, download and run.",
  },
]

export default function AboutPage() {
  const refTool     = useReveal<HTMLElement>()
  const refFeatImg  = useReveal<HTMLDivElement>()
  const refFeatCards = useReveal<HTMLDivElement>()
  const refCreator  = useReveal<HTMLElement>()
  const refCTA      = useReveal<HTMLDivElement>()

  return (
    <main className="min-h-screen bg-bg page-transition">

      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-40 pb-24">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to converter
        </Link>

        {/* About the tool */}
        <section ref={refTool} className="reveal mb-16">
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

        {/* Feature illustration */}
        <div ref={refFeatImg} className="reveal animate-fade-in w-full rounded-xl overflow-hidden mb-10">
          <img
            src="/images/feat-flow.png"
            alt="Image files converting to WebP with folder structure preserved"
            className="w-full object-cover"
            style={{ aspectRatio: '3 / 1' }}
          />
        </div>

        {/* Feature cards */}
        <div ref={refFeatCards} className="reveal grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="flex flex-col gap-3"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-9 h-9 rounded-lg bg-accent-faint flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-text">{title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-20" />

        {/* About the creator */}
        <section ref={refCreator} className="reveal mb-16">
          <p className="text-sm text-text-muted uppercase tracking-widest mb-4">The Creator</p>
          <h2 className="text-3xl font-bold text-text mb-6">Mahtamun Hoque Fahim</h2>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            Fahim is a CSE student at BGC Trust University Bangladesh and a Frontend AI Engineering Intern at Flyrank.ai. He has been designing since 2016 — across brand identity, UI/UX, edtech, and print — and picked up development to build the tools he kept wishing existed.
          </p>
          <p className="text-text-muted text-lg leading-relaxed mb-4">
            ImageSmith came out of a real problem: converting hundreds of images while keeping a folder structure intact, without uploading anything to a server. So he built it. That&apos;s the pattern — notice the gap, ship the fix.
          </p>
          <p className="text-text-muted text-lg leading-relaxed">
            When he&apos;s not building tools, he&apos;s contributing to open source, competing in hackathons, and learning competitive programming in C++.
          </p>
        </section>

        {/* CTA to contact */}
        <div ref={refCTA} className="reveal p-6 border border-border rounded-lg flex flex-col items-center text-center gap-5 sm:flex-row sm:items-center sm:text-left sm:gap-4">
          <div className="flex-1">
            <p className="text-text font-bold text-xl sm:text-base sm:font-medium mb-1">Want to get in touch?</p>
            <p className="text-text-muted text-sm">Reach out on the contact page — for bugs, ideas, or just to say hi.</p>
          </div>
          <Link
            href="/contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors shrink-0 rounded-sm"
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
