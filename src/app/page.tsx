import { Zap, Lock, FolderOpen } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import ReviewList from '@/components/reviews/ReviewList'
import ConverterWrapper from '@/components/converter/ConverterWrapper'

const FEATURES = [
  {
    icon: Lock,
    title: 'Your files never upload',
    desc: 'All conversion happens in your browser using libwebp. Nothing touches a server. Nothing leaves your device.',
  },
  {
    icon: FolderOpen,
    title: 'Folders come back whole',
    desc: 'Drop a nested folder. The output ZIP mirrors it exactly — subfolders, filenames, everything. Only the extension changes.',
  },
  {
    icon: Zap,
    title: 'No paywall. No limits.',
    desc: 'Convert 1000 images free. No account. No file size caps. Just drag, drop, download.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 pt-6 pb-2 flex items-center">
        <img src="/logo.svg" alt="ImageSmith" className="h-8" />
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-accent-faint border border-accent/20 rounded-full px-4 py-1.5 text-xs font-mono text-accent">
          libwebp WASM &middot; 100% client-side &middot; free
        </div>

        <h1 className="font-syne font-bold text-4xl md:text-6xl text-text leading-tight tracking-tight">
          Convert images to WebP.
          <br />
          <span className="text-accent">Keep your folders intact.</span>
        </h1>

        <p className="text-text-muted text-lg max-w-xl leading-relaxed">
          Drop a folder of 1000 images. Get back a ZIP with the same
          structure — same names, just{' '}
          <span className="font-mono text-text">.webp</span>. Nothing leaves
          your machine. No account required.
        </p>

        {/* IMAGE-BRIEF: hero-01 | 16:9 | WIRED → /public/images/hero.png — swap with 2560×1440 final render when ready */}
        {/* PROMPT: cinematic 3D product visualization, floating translucent file cards labeled JPG and PNG on the left gently dissolving and morphing into crisp WebP format cards on the right, deep dark navy background, volumetric indigo-violet glow radiating softly from the WebP output cards, soft rim lighting from top-left, subtle geometric motion blur on the transforming cards, generous negative space at center, zero UI chrome, zero text, zero watermarks, hyper-detailed surface materials, octane render, 8K resolution, professional dark tech product aesthetic, award-winning CGI --ar 16:9 --style raw --q 2 */}
        <div className="relative animate-fade-up w-full max-w-2xl aspect-video rounded-xl overflow-hidden mt-2" style={{ animationDelay: '120ms' }}>
          <img
            src="/images/hero.png"
            alt="JPG and PNG files transforming into WebP format"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 80px 32px #0d0f14' }} />
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
              <h3 className="font-syne font-semibold text-text">{title}</h3>
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
