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

        {/* IMAGE-BRIEF: hero-01 | 16:9 | abstract 3D render — floating JPG/PNG file cards on left dissolving into .webp cards on right, dark bg-surface background, accent glow on WebP output cards, soft volumetric light from top-left, no baked-in text, generous negative space */}
        <div
          data-image-slot="hero-01"
          className="w-full max-w-2xl aspect-video rounded-xl border border-dashed border-border bg-surface/40 mt-2"
        />
      </section>

      {/* Converter */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <ConverterWrapper />
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">

          {/* IMAGE-BRIEF: feat-01 | 3:1 | minimal flat line illustration — image files entering left, ZIP exiting right with visible nested folder tree intact, accent color for the output ZIP, text-muted lines for folder structure, bg-surface background, no labels or text baked in */}
          <div
            data-image-slot="feat-01"
            className="w-full rounded-xl border border-dashed border-border bg-surface/40"
            style={{ aspectRatio: '3 / 1' }}
          />

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
