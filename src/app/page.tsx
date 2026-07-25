import { Zap, Lock, FolderOpen, Download } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import ReviewList from '@/components/reviews/ReviewList'
import ConverterWrapper from '@/components/converter/ConverterWrapper'

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
    <main className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="px-6 py-6 flex items-center justify-between">
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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background with waves */}
        <div className="absolute inset-0">
          <img
            src="/images/background.png"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left decorative folder icon */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 opacity-90">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-lg">
            <path
              d="M3 6.5c0-.93.75-1.675 1.675-1.675h10.65c.93 0 1.675.745 1.675 1.675V17c0 .93-.745 1.675-1.675 1.675H4.675C3.745 18.675 3 17.93 3 17V6.5Z"
              stroke="url(#folderGrad)" strokeWidth="1.5" fill="url(#folderFill)"
            />
            <defs>
              <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="folderFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Right decorative ZIP icon */}
        <div className="absolute right-6 md:right-12 top-1/3 w-40 h-40 md:w-56 md:h-56 opacity-95">
          <img
            src="/images/zip-icon.png"
            alt="ZIP file"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center flex flex-col items-center gap-8 px-6 max-w-3xl">
          <p className="text-text text-lg font-medium tracking-wide">Rapid Conversion</p>
          <h1 className="font-display font-bold text-5xl md:text-7xl text-text leading-tight">
            to <span className="text-white ml-2">.WEBP</span>
          </h1>

          {/* CTA Button */}
          <button className="mt-8 px-10 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 shadow-xl hover:shadow-2xl">
            <Download className="w-5 h-5" />
            Drop Your Files
          </button>
        </div>
      </section>

      {/* Converter */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
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
