import { ExternalLink, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* About the tool */}
        <div className="flex flex-col gap-4">
          <h3 className="font-syne font-semibold text-text text-lg">
            ImageSmith
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            A free, client-side WebP converter. Drop a folder of a thousand
            images, get back an identical ZIP with everything converted — same
            folder tree, same filenames, just{' '}
            <span className="font-mono text-text">.webp</span>. No paywall.
            No account. Your files never leave your device.
          </p>
          <ul className="flex flex-col gap-1.5 text-sm text-text-muted">
            <li>&#8212; libwebp WASM quality control</li>
            <li>&#8212; Folder structure preserved in output ZIP</li>
            <li>&#8212; Single file, batch, folder, or ZIP input</li>
            <li>&#8212; Firefox support via ZIP upload fallback</li>
          </ul>
        </div>

        {/* About the developer */}
        <div className="flex flex-col gap-4">
          <h3 className="font-syne font-semibold text-text text-lg">
            Built by Fahim
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            CSE student at BGC Trust University Bangladesh, frontend AI
            engineering intern at Flyrank.ai, and indie developer operating
            under the{' '}
            <span className="text-text font-medium">Mahtamun</span> brand.
            Building tools he needs — and sharing them when they&apos;re
            ready.
          </p>
          <div className="flex items-center gap-4 mt-1">
            <a
              href="https://github.com/mahtamun-hoque-fahim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors duration-150"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://instagram.com/mahtamun.recode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors duration-150"
            >
              <Globe className="w-4 h-4" />
              @mahtamun.recode
            </a>
          </div>
          <a
            href="#reviews"
            className="self-start mt-1 text-sm text-accent hover:text-accent-hover transition-colors duration-150"
          >
            Leave a review
          </a>
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
