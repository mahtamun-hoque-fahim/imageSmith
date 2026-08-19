'use client'

import { Download } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import ReviewList from '@/components/reviews/ReviewList'
import ConverterWrapper from '@/components/converter/ConverterWrapper'
import SurfaceCards from '@/components/surfaces/SurfaceCards'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useReveal } from '@/hooks/useReveal'

export default function HomePage() {
  const [offset, setOffset] = useState(0)

  const refConverter = useReveal<HTMLElement>()
  const refReviews   = useReveal<HTMLElement>()
  const refFooter    = useReveal<HTMLElement>()

  const btnRef = useRef<HTMLButtonElement>(null)

  const triggerShimmer = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    btn.classList.remove('is-shimmering')
    void btn.offsetWidth                    // force reflow — restarts animation
    btn.classList.add('is-shimmering')
  }, [])

  // Remove class when animation ends so next trigger restarts cleanly
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const onEnd = () => btn.classList.remove('is-shimmering')
    btn.addEventListener('animationend', onEnd)
    return () => btn.removeEventListener('animationend', onEnd)
  }, [])

  // Fire after 1s on load, then every 10s
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    const timer = setTimeout(() => {
      triggerShimmer()
      interval = setInterval(triggerShimmer, 10000)
    }, 1000)
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [triggerShimmer])

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
    <main className="min-h-screen bg-bg page-transition">

      <Navbar />

      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">

        {/* Background */}
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

        {/* Left folder icon */}
        <img
          src="/images/folder-icon.png"
          alt="Folder"
          className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-56 md:w-72 lg:w-80 pointer-events-none z-10 animate-float"
        />

        {/* Right ZIP icon */}
        <img
          src="/images/zip-icon.png"
          alt="ZIP"
          className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-56 md:w-72 lg:w-80 pointer-events-none z-10 animate-float-delayed"
        />

        {/* Text content */}
        <div className="relative z-20 text-center flex flex-col items-center gap-4 sm:gap-6 px-6">
          <p className="hero-reveal text-white text-base sm:text-xl font-medium">Fastest Conversion</p>
          <h1 className="hero-reveal-delay font-display font-bold text-5xl sm:text-8xl text-white leading-none">to .webp format.</h1>
          <button
            ref={btnRef}
            onClick={() => document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={triggerShimmer}
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
