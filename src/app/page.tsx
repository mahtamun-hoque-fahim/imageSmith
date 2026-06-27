import { Zap, Lock, FolderOpen } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import ReviewList from '@/components/reviews/ReviewList'
import ConverterWrapper from '@/components/converter/ConverterWrapper'

const FEATURES = [
  {
    icon: Lock,
    title: 'Private by design',
    desc: 'Files never leave your device. 100% client-side via libwebp WASM.',
  },
  {
    icon: FolderOpen,
    title: 'Folder structure preserved',
    desc: 'Drop a nested folder. Get back an identical ZIP — only the format changes.',
  },
  {
    icon: Zap,
    title: 'No paywall. No limits.',
    desc: 'Batch convert 1000 images for free, forever. No account needed.',
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
          Drop a folder of a thousand images. Get back an identical ZIP with
          everything converted — same structure, same filenames, just{' '}
          <span className="font-mono text-text">.webp</span>. Free forever. No
          paywall.
        </p>
      </section>

      {/* Converter */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <ConverterWrapper />
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
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
