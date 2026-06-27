'use client'

import dynamic from 'next/dynamic'

// ConverterZone uses browser APIs (WASM, FileReader, Canvas, FileSystem)
// Must be loaded client-side only
const ConverterZone = dynamic(
  () => import('./ConverterZone'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl mx-auto h-64 bg-surface border border-border rounded-xl animate-pulse" />
    ),
  }
)

export default function ConverterWrapper() {
  return <ConverterZone />
}
