import type { Metadata } from 'next'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://imagesmith.dev'

export const metadata: Metadata = {
  title: 'Free Batch WebP Converter — Folder Structure Preserved | ImageSmith',
  description:
    'Free WebP converter that preserves folder structure. Convert single images, batches, or entire folder trees — files stay on your device. No upload, no account, no paywall.',
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: 'Free Batch WebP Converter — Folder Structure Preserved',
    description:
      'Convert batches or entire folder trees to WebP. Files never leave your device. No paywall, no account, no upload — just fast, private WebP conversion.',
    type: 'website',
    url: APP_URL,
    images: [
      {
        // IMAGE-BRIEF: og-01 | 1.91:1 (1200x630px) | WIRED → /public/og.png — swap with ImageSmith-branded card when ready
        // PROMPT (background layer, composite in Figma): seamless dark tech micro-texture background, deep navy #0A0D15, extremely subtle 1px grid lines at 4% opacity forming a fine circuit-board mesh, zero gradients, zero glows, flat and even, suitable as a layer beneath typography, high resolution 1200x630px, professional minimal dark brand aesthetic, no text, no icons, no logos, pure background tile
        url: `${APP_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: 'ImageSmith — Free Batch WebP Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Batch WebP Converter — Folder Structure Preserved',
    description:
      'Convert batches or entire folder trees to WebP. Files never leave your device. No paywall, no account, no upload.',
    images: [`${APP_URL}/og.png`],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ImageSmith',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: APP_URL,
    description:
      'Free batch WebP converter that preserves folder structure. Convert single images, batches, or entire folder trees. 100% client-side — files never leave your device.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Batch image to WebP conversion',
      'Folder structure preserved in output ZIP',
      '100% client-side processing via libwebp WASM',
      'No file upload to server',
      'Firefox ZIP fallback for folder input',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ImageSmith',
    url: APP_URL,
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/css?f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  )
}
