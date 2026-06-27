'use client'

import JSZip from 'jszip'
import { encodeToWebP, isImageFile } from '@/lib/wasm/loader'

export interface FileWithPath {
  file: File
  relativePath: string // e.g. "folder/sub/image.jpg"
}

export interface ConversionResult {
  relativePath: string
  webpBytes: Uint8Array
  originalSize: number
  webpSize: number
}

export interface ConversionProgress {
  done: number
  total: number
  currentFile: string
}

// ---------- Source gathering ----------

/** From a folder input (webkitdirectory) */
export function filesFromFolder(fileList: FileList): FileWithPath[] {
  return Array.from(fileList)
    .filter(f => isImageFile(f.name))
    .map(f => ({
      file: f,
      relativePath: f.webkitRelativePath || f.name,
    }))
}

/** From individual file picks (no folder structure) */
export function filesFromPick(fileList: FileList): FileWithPath[] {
  return Array.from(fileList)
    .filter(f => isImageFile(f.name))
    .map(f => ({
      file: f,
      relativePath: f.name,
    }))
}

/** From a ZIP upload (Firefox folder fallback) */
export async function filesFromZip(zipFile: File): Promise<FileWithPath[]> {
  const zip = await JSZip.loadAsync(zipFile)
  const results: FileWithPath[] = []

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue
    const filename = path.split('/').pop() ?? path
    if (!isImageFile(filename)) continue

    const blob = await entry.async('blob')
    const file = new File([blob], filename, { type: guessType(filename) })
    results.push({ file, relativePath: path })
  }

  return results
}

function guessType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', bmp: 'image/bmp', tiff: 'image/tiff',
    tif: 'image/tiff', webp: 'image/webp', avif: 'image/avif',
  }
  return map[ext ?? ''] ?? 'application/octet-stream'
}

// ---------- Conversion ----------

const CHUNK_SIZE = 10 // process N images at a time

export async function convertFiles(
  files: FileWithPath[],
  quality: number,
  onProgress: (p: ConversionProgress) => void
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = []
  let done = 0

  for (let i = 0; i < files.length; i += CHUNK_SIZE) {
    const chunk = files.slice(i, i + CHUNK_SIZE)

    const chunkResults = await Promise.all(
      chunk.map(async ({ file, relativePath }) => {
        onProgress({ done, total: files.length, currentFile: file.name })

        const webpBytes = await encodeToWebP(file, quality)

        // Replace extension with .webp
        const webpPath = relativePath.replace(/\.[^.]+$/, '.webp')

        done++
        onProgress({ done, total: files.length, currentFile: file.name })

        return {
          relativePath: webpPath,
          webpBytes,
          originalSize: file.size,
          webpSize: webpBytes.byteLength,
        } satisfies ConversionResult
      })
    )

    results.push(...chunkResults)
  }

  return results
}

// ---------- Output ZIP ----------

export async function buildOutputZip(results: ConversionResult[]): Promise<Blob> {
  const zip = new JSZip()

  for (const { relativePath, webpBytes } of results) {
    zip.file(relativePath, webpBytes)
  }

  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 1 }, // fast, WebP already compressed
  })
}

// ---------- Download helpers ----------

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadBytes(bytes: Uint8Array, filename: string): void {
  downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: "image/webp" }), filename)
}
