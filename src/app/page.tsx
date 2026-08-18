'use client'

import { Zap, Lock, FolderOpen, Download } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import ReviewList from '@/components/reviews/ReviewList'
import ConverterWrapper from '@/components/converter/ConverterWrapper'
import SurfaceCards from '@/components/surfaces/SurfaceCards'
import { useEffect, useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

const FEATURES = [
  {
    icon: Lock,
    title: 'No Server. No Upload.',
    desc: "All conversion happens in your browser using cutting-edge web technologies. Nothing touches a server. We don't know where is your camera is.",
  },
  {
    icon: FolderOpen,
    title: 'Folders come back whole',
    desc: 'Drop a nasty folder. The output ZIP mirrors it exactly — subfolders, filenames, everything. Only the fileextension changes.',
  },
  {
    icon: Zap,
    title: 'No paywall. No limits.',
    desc: "Even if you convert 1000 images, it's still free. No account. Just drag, drop, download andrun.",
  },
]

export default function HomePage() {
  const [offset, setOffset] = useState(0)

  // scroll reveals
  const refConverter  = useReveal<HTMLElement>()
  const refFeatImg    = useReveal<HTMLDivElement>()
  const refFeatCards  = useReveal<HTMLDivElement>()
  const refReviews    = useReveal<HTMLElement>()
  const refFooter     = useReveal<HTMLElement>()

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view' }),
    }).catch(() => {})
  }, [])

  return (
    <main className="min-h-screen bg-bg overflow-x-hidden page-transition">

      <Navbar />

      {/* Hero */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background — mobile uses sm_bg, desktop uses hero-bg-v2 */}
        <div
          className="absolute inset-0 z-0 hidden sm:block"
          style={{
            backgroundImage: 'url(/images/hero-bg-v2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${offset}px)`,
            willChange: 'transform',
          }}
        />
        <div
          className="absolute inset-0 z-0 sm:hidden"
          style={{
            backgroundImage: 'url(/images/sm_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />

        {/* Left folder icon — hidden on mobile */}
        <img
          src="/images/folder-icon.png"
          alt="Folder"
          className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-56 md:w-72 lg:w-80 pointer-events-none z-10 animate-float"
        />

        {/* Right ZIP icon — hidden on mobile */}
        <img
          src="/images/zip-icon.png"
          alt="ZIP"
          className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-56 md:w-72 lg:w-80 pointer-events-none z-10 animate-float-delayed"
        />

        {/* Text content — staggered hero entrance */}
        <div className="relative z-20 text-center flex flex-col items-center gap-4 sm:gap-6 px-6">
          <p className="hero-reveal text-white text-base sm:text-xl font-medium">Rapid Conversion</p>
          <h1 className="hero-reveal-delay font-display font-bold text-5xl sm:text-8xl text-white leading-none">to .WEBP</h1>
          <button
            onClick={() => document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="hero-reveal-late mt-2 sm:mt-4 px-8 py-4 sm:px-14 sm:py-5 bg-white text-black font-bold text-base sm:text-lg flex items-center gap-3 cursor-pointer border-0 rounded-lg"
          >
            <Download className="w-5 h-5" />
            Drop Your Files
          </button>
        </div>
      </section>

      {/* Converter */}
      <section ref={refConverter} id="converter-section" className="reveal max-w-4xl mx-auto px-6 py-32">
        <ConverterWrapper />
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">

          {/* IMAGE-BRIEF: feat-01 | 3:1 | WIRED → /public/images/feat-flow.png — swap with 2400×800 final render when ready */}
          {/* PROMPT: clean flat isometric vector illustration, horizontal flow diagram, left side shows a varied stack of image file format icons (JPG PNG GIF BMP) with subtle size variation, center has a minimal conversion funnel or arrow, right side shows a single ZIP archive file with an expanded nested folder tree floating beside it preserving the exact directory hierarchy, indigo-violet accent color on the ZIP output and folder nodes, desaturated muted blue-gray fine lines for folder path connectors, deep dark navy background, zero text labels, zero numbers, zero UI chrome, technical but approachable aesthetic, generous negative space top and bottom, precise vector-clean edges, high contrast, professional --ar 3:1 --style raw */}
          <div ref={refFeatImg} className="reveal animate-fade-in w-full rounded-xl overflow-hidden">
            <img
              src="/images/feat-flow.png"
              alt="Image files converting to WebP with folder structure preserved"
              className="w-full object-cover"
              style={{ aspectRatio: '3 / 1' }}
            />
          </div>

          <div ref={refFeatCards} className="reveal grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* Surfaces — Browser / CLI / MCP */}
      <SurfaceCards />

      {/* Reviews */}
      <section ref={refReviews} className="reveal border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <ReviewList />
        </div>
      </section>

      <footer ref={refFooter} className="reveal">
        <Footer />
      </footer>
    </main>
  )
}
