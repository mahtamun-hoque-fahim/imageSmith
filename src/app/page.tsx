'use client'

import { Zap, Lock, FolderOpen, Download } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import ReviewList from '@/components/reviews/ReviewList'
import ConverterWrapper from '@/components/converter/ConverterWrapper'
import { useEffect, useRef, useState } from 'react'

const FEATURES = [
  {
    icon: Lock,
    title: 'No Server. No Upload.',
    desc: 'All conversion happens in your browser using cutting-edge web technologies. Nothing touches a server. We don\'t know where is your camera is.',
  },
  {
    icon: FolderOpen,
    title: 'Folders come back whole',
    desc: 'Drop a nasty folder. The output ZIP mirrors it exactly — subfolders, filenames, everything. Only the fileextension changes.',
  },
  {
    icon: Zap,
    title: 'No paywall. No limits.',
    desc: 'Even if you convert 1000 images, it\'s still free. No account. Just drag, drop, download andrun.',
  },
]

export default function HomePage() {
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.scrollY * 0.5)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-bg">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 px-6 py-6 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/10">
        <img src="/logo.svg" alt="ImageSmith" className="h-8" />
        <div className="flex items-center gap-8 text-text">
          <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">
            About
          </a>
          <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">
            Contact
          </a>
          <a href="#privacy" className="text-sm font-medium hover:text-accent transition-colors">
            Privacy Policy
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background with parallax effect */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <img
            src="/images/background.png"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>

        {/* Left decorative folder icon */}
        <div className="absolute left-0 md:left-8 top-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 opacity-100 pointer-events-none z-[1]">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Folder body with 3D effect */}
            <defs>
              <linearGradient id="folderBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
              <linearGradient id="folderTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            {/* Folder tab */}
            <path d="M 30 60 L 80 30 L 90 30 L 90 60 Z" fill="url(#folderTop)" />
            {/* Folder body */}
            <path d="M 30 60 L 170 60 L 170 160 C 170 170 160 180 150 180 L 50 180 C 40 180 30 170 30 160 Z" fill="url(#folderBody)" />
            {/* Subtle 3D shadow */}
            <path d="M 30 60 L 50 80 L 50 160 C 50 170 40 180 30 180 Z" fill="#5b21b6" opacity="0.6" />
          </svg>
        </div>

        {/* Right decorative ZIP icon */}
        <div className="absolute right-0 md:right-0 bottom-0 md:bottom-0 w-80 h-80 md:w-[32rem] md:h-[32rem] opacity-100 pointer-events-none z-[1]">
          <img
            src="/images/zip-icon.png"
            alt="ZIP file"
            className="w-full h-full object-cover drop-shadow-2xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center flex flex-col items-center gap-12 px-6 max-w-4xl">
          <div className="space-y-6">
            <p className="text-white text-xl md:text-2xl font-medium tracking-wider">Rapid Conversion</p>
            <h1 className="font-display font-bold text-6xl md:text-8xl text-white leading-none">
              to <span className="text-white block md:inline-block mt-2 md:mt-0">.WEBP</span>
            </h1>
          </div>

          {/* CTA Button */}
          <button className="mt-6 px-12 py-5 bg-white text-black rounded-xl font-semibold text-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 flex items-center gap-3 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] border-0 outline-none cursor-pointer">
            <Download className="w-6 h-6" />
            Drop Your Files
          </button>
        </div>
      </section>

      {/* Converter - with breathing space */}
      <section className="max-w-4xl mx-auto px-6 py-32">
        <ConverterWrapper />
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">

          {/* IMAGE-BRIEF: feat-01 | 3:1 | WIRED → /public/images/feat-flow.png — swap with 2400×800 final render when ready */}
          {/* PROMPT: clean flat isometric vector illustration, horizontal flow diagram, left side shows a varied stack of image file format icons (JPG PNG GIF BMP) with subtle size variation, center has a minimal conversion funnel or arrow, right side shows a single ZIP archive file with an expanded nested folder tree floating beside it preserving the exact directory hierarchy, indigo-violet accent color on the ZIP output and folder nodes, desaturated muted blue-gray fine lines for folder path connectors, deep dark navy background, zero text labels, zero numbers, zero UI chrome, technical but approachable aesthetic, generous negative space top and bottom, precise vector-clean edges, high contrast, professional --ar 3:1 --style raw */}
          <div className="animate-fade-in w-full rounded-xl overflow-hidden">
            <img
              src="/images/feat-flow.png"
              alt="Image files converting to WebP with folder structure preserved"
              className="w-full object-cover"
              style={{ aspectRatio: '3 / 1' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3">
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

      {/* Reviews */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <ReviewList />
        </div>
      </section>

      <Footer />
    </main>
  )
}
