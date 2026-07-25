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
  return (
    <main className="min-h-screen bg-bg overflow-x-hidden">

      {/* Fixed Nav - floats over the hero */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between backdrop-blur-md bg-black/30 border-b border-white/5">
        <img src="/logo.svg" alt="ImageSmith" className="h-8" />
        <div className="flex items-center gap-8 text-white">
          <a href="#about" className="text-sm font-medium hover:opacity-70 transition-opacity">About</a>
          <a href="#contact" className="text-sm font-medium hover:opacity-70 transition-opacity">Contact</a>
          <a href="#privacy" className="text-sm font-medium hover:opacity-70 transition-opacity">Privacy Policy</a>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: 'url(/images/hero-bg-v2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Left folder icon */}
        <img
          src="/images/folder-icon.png"
          alt="Folder"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none z-10"
        />

        {/* Right ZIP icon */}
        <img
          src="/images/zip-icon.png"
          alt="ZIP"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none z-10"
        />

        {/* Text content */}
        <div className="relative z-20 text-center flex flex-col items-center gap-6">
          <p className="text-white text-xl font-medium">Rapid Conversion</p>
          <h1 className="font-display font-bold text-8xl text-white leading-none">to .WEBP</h1>
          <button
            onClick={() => document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-4 px-14 py-5 bg-white text-black font-bold text-lg flex items-center gap-3 cursor-pointer border-0"
          >
            <Download className="w-5 h-5" />
            Drop Your Files
          </button>
        </div>
      </section>

      {/* Converter - with breathing space */}
      <section id="converter-section" className="max-w-4xl mx-auto px-6 py-32">
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
