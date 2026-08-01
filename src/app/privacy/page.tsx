import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — ImageSmith',
  description: 'ImageSmith privacy policy. Your files never leave your device. No tracking, no uploads, no account required.',
}

const LAST_UPDATED = 'July 25, 2026'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg">

      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-40 pb-24">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to converter
        </Link>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-text mb-4">Privacy Policy</h1>
          <p className="text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-12 text-text-muted text-[15px] leading-relaxed">

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">The short version</h2>
            <p>
              ImageSmith converts your images entirely inside your browser. Your files are never uploaded to any server, never stored anywhere, and never seen by anyone — including us. There is no account, no login, and no tracking of what you convert.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">1. File processing</h2>
            <p>
              All image conversion happens locally on your device using WebAssembly (libwebp compiled to WASM). No file data, image content, or metadata is transmitted to any server at any point during the conversion process.
            </p>
            <p>
              Files are loaded into your browser's memory, processed, and the resulting WebP output is made available for download — entirely offline. Once you close or refresh the page, all file data is discarded.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">2. What we collect</h2>
            <p>We collect the bare minimum to keep the service running:</p>
            <ul className="flex flex-col gap-2 pl-4">
              <li className="flex gap-2"><span className="text-text shrink-0">—</span> <span><strong className="text-text">Contact form submissions</strong> — if you choose to send us a message via the contact page, we store your name, email address, and message content in order to respond to you.</span></li>
              <li className="flex gap-2"><span className="text-text shrink-0">—</span> <span><strong className="text-text">User reviews</strong> — if you leave a review, we store the review content and star rating.</span></li>
              <li className="flex gap-2"><span className="text-text shrink-0">—</span> <span><strong className="text-text">Standard server logs</strong> — Vercel, our hosting provider, may log basic request metadata (IP address, user agent, timestamp) as part of normal infrastructure operation. We do not access or use these logs for any purpose.</span></li>
            </ul>
            <p>We do not collect your name, email, location, or any personal information unless you explicitly provide it via the contact form.</p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">3. Cookies and tracking</h2>
            <p>
              ImageSmith does not use cookies, analytics trackers, advertising pixels, or any third-party tracking scripts. There is no Google Analytics, no Meta Pixel, no session recording — nothing.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">4. Third-party services</h2>
            <p>ImageSmith uses the following infrastructure providers:</p>
            <ul className="flex flex-col gap-2 pl-4">
              <li className="flex gap-2"><span className="text-text shrink-0">—</span> <span><strong className="text-text">Vercel</strong> — hosting and edge delivery. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-text underline hover:opacity-70 transition-opacity">Vercel's Privacy Policy</a>.</span></li>
              <li className="flex gap-2"><span className="text-text shrink-0">—</span> <span><strong className="text-text">Neon</strong> — PostgreSQL database for contact form messages and reviews. Subject to <a href="https://neon.tech/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-text underline hover:opacity-70 transition-opacity">Neon's Privacy Policy</a>.</span></li>
            </ul>
            <p>No data is sold, shared with, or disclosed to any other third party for any purpose.</p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">5. Data retention</h2>
            <p>
              Contact form messages are retained until manually deleted by the site administrator. If you would like your message removed, email <a href="mailto:mahtamunhoquefahim@gmail.com" className="text-text underline hover:opacity-70 transition-opacity">mahtamunhoquefahim@gmail.com</a> and it will be deleted promptly.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">6. Children's privacy</h2>
            <p>
              ImageSmith is a general-purpose developer tool and is not directed at children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">7. Changes to this policy</h2>
            <p>
              If this policy changes in any meaningful way, the "Last updated" date at the top of this page will reflect that. Continued use of ImageSmith after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <div className="border-t border-border" />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text">8. Contact</h2>
            <p>
              Questions about this policy? Reach out at <a href="mailto:mahtamunhoquefahim@gmail.com" className="text-text underline hover:opacity-70 transition-opacity">mahtamunhoquefahim@gmail.com</a> or via the <Link href="/contact" className="text-text underline hover:opacity-70 transition-opacity">contact page</Link>.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  )
}
