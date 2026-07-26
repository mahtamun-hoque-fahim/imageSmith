import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="relative border-t border-border mt-24"
      style={{ backgroundImage: 'url(/images/footer-bg.png)', backgroundSize: 'cover', backgroundPosition: 'bottom left' }}
    >
      {/* Dark overlay to match site tone */}
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/"><img src="/logo.svg" alt="ImageSmith" className="h-7" /></Link>
          <p className="text-text-muted text-sm leading-relaxed">
            A free WebP converter that runs entirely in your browser. Nothing uploads. Nothing needs an account.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <Link href="/about" className="text-sm text-text-muted hover:text-text transition-colors">About</Link>
          <Link href="/contact" className="text-sm text-text-muted hover:text-text transition-colors">Contact</Link>
          <Link href="/privacy" className="text-sm text-text-muted hover:text-text transition-colors">Privacy Policy</Link>
        </nav>
      </div>

      <div className="relative z-10 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-text-faint">
          <span>ImageSmith &copy; {new Date().getFullYear()} Mahtamun</span>
          <span>MIT License &middot; V1</span>
        </div>
      </div>
    </footer>
  )
}
