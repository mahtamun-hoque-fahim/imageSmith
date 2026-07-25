export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-sm">
          <img src="/logo.svg" alt="ImageSmith" className="h-7" />
          <p className="text-text-muted text-sm leading-relaxed">
            A free WebP converter that runs entirely in your browser. Nothing uploads. Nothing needs an account.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <a href="#about" className="text-sm text-text-muted hover:text-text transition-colors">About</a>
          <a href="#contact" className="text-sm text-text-muted hover:text-text transition-colors">Contact</a>
          <a href="#privacy" className="text-sm text-text-muted hover:text-text transition-colors">Privacy Policy</a>
        </nav>
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
