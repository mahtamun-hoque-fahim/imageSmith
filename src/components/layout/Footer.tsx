import { } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-4">
          <img src="/logo.svg" alt="ImageSmith" className="h-7" />
          <p className="text-text-muted text-sm leading-relaxed">
            A free WebP converter that runs entirely in your browser. Drop a
            folder of 1000 images, get back a ZIP with the same folder tree
            — just{' '}
            <span className="font-mono text-text">.webp</span> instead of
            whatever you started with. Nothing uploads. Nothing needs an
            account.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-text-faint">
          <span>ImageSmith &copy; {new Date().getFullYear()} Mahtamun</span>
          <span>MIT License &middot; V1</span>
        </div>
      </div>
    </footer>
  )
}
