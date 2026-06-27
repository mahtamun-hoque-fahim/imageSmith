import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ImageSmith — Free WebP Converter',
  description:
    'Convert any image or folder of images to WebP in seconds. No paywall, no uploads, no account. Folder structure preserved in output ZIP.',
  openGraph: {
    title: 'ImageSmith — Free WebP Converter',
    description:
      'Batch convert images to WebP with folder structure preserved. 100% client-side, completely free.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageSmith — Free WebP Converter',
    description:
      'Batch convert images to WebP with folder structure preserved. 100% client-side, completely free.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  )
}
