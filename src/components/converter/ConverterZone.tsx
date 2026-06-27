'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Upload,
  FolderOpen,
  FileArchive,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Sliders,
  RefreshCw,
  Info,
} from 'lucide-react'
import {
  getWebPEncoder,
  isImageFile,
  SUPPORTED_EXTENSIONS,
} from '@/lib/wasm/loader'
import {
  filesFromFolder,
  filesFromPick,
  filesFromZip,
  convertFiles,
  buildOutputZip,
  downloadBlob,
  downloadBytes,
  type FileWithPath,
  type ConversionProgress,
} from '@/lib/zip/processor'

// ---------- Types ----------

type EngineState = 'idle' | 'loading' | 'ready' | 'error'
type ConvertState = 'idle' | 'converting' | 'done' | 'error'

// ---------- Browser detection ----------

function isFirefox(): boolean {
  if (typeof navigator === 'undefined') return false
  return navigator.userAgent.toLowerCase().includes('firefox')
}

function supportsWebkitDirectory(): boolean {
  if (typeof document === 'undefined') return false
  const input = document.createElement('input')
  return 'webkitdirectory' in input
}

// ---------- Component ----------

export default function ConverterZone() {
  const [engineState, setEngineState] = useState<EngineState>('idle')
  const [convertState, setConvertState] = useState<ConvertState>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [quality, setQuality] = useState(85)
  const [progress, setProgress] = useState<ConversionProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null)
  const [resultFilename, setResultFilename] = useState<string>('')
  const [stats, setStats] = useState<{ count: number; savedKB: number } | null>(null)
  const [firefox, setFirefox] = useState(false)
  const [folderSupported, setFolderSupported] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  // Detect browser capabilities + warm up WASM on mount
  useEffect(() => {
    setFirefox(isFirefox())
    setFolderSupported(supportsWebkitDirectory())

    setEngineState('loading')
    getWebPEncoder()
      .then(() => setEngineState('ready'))
      .catch(() => setEngineState('error'))
  }, [])

  // ---------- Core convert handler ----------

  const handleFiles = useCallback(
    async (files: FileWithPath[]) => {
      if (files.length === 0) {
        setError('No supported image files found.')
        return
      }

      setConvertState('converting')
      setError(null)
      setResultBlob(null)
      setResultBytes(null)
      setStats(null)

      try {
        const results = await convertFiles(files, quality, (p) => setProgress(p))

        const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0)
        const totalWebP = results.reduce((s, r) => s + r.webpSize, 0)
        setStats({
          count: results.length,
          savedKB: Math.round((totalOriginal - totalWebP) / 1024),
        })

        if (results.length === 1) {
          setResultBytes(results[0].webpBytes)
          const base = files[0].file.name.replace(/\.[^.]+$/, '')
          setResultFilename(`${base}.webp`)
        } else {
          const blob = await buildOutputZip(results)
          setResultBlob(blob)
          setResultFilename('imagesmith-output.zip')
        }

        setConvertState('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Conversion failed')
        setConvertState('error')
      }
    },
    [quality]
  )

  // ---------- Input handlers ----------

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    handleFiles(filesFromPick(e.target.files))
    e.target.value = ''
  }

  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    handleFiles(filesFromFolder(e.target.files))
    e.target.value = ''
  }

  const handleZipInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const files = await filesFromZip(file)
      handleFiles(files)
    } catch {
      setError('Could not read ZIP file.')
    }
    e.target.value = ''
  }

  // ---------- Drag & drop ----------

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const onDragLeave = () => setIsDragging(false)

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const items = Array.from(e.dataTransfer.items)
    const fileList: FileWithPath[] = []

    // Check for directory entries
    const hasDir = items.some(
      (item) => item.webkitGetAsEntry?.()?.isDirectory
    )

    if (hasDir && folderSupported) {
      const allFiles = await readDroppedEntries(items)
      fileList.push(...allFiles)
    } else {
      const files = Array.from(e.dataTransfer.files)
      // Single ZIP
      if (files.length === 1 && files[0].name.endsWith('.zip')) {
        try {
          const extracted = await filesFromZip(files[0])
          fileList.push(...extracted)
        } catch {
          setError('Could not read ZIP file.')
          return
        }
      } else {
        fileList.push(
          ...files
            .filter((f) => isImageFile(f.name))
            .map((f) => ({ file: f, relativePath: f.name }))
        )
      }
    }

    handleFiles(fileList)
  }

  // Recursively read folder entries from DataTransferItemList
  async function readDroppedEntries(
    items: DataTransferItem[]
  ): Promise<FileWithPath[]> {
    const results: FileWithPath[] = []

    async function traverse(
      entry: FileSystemEntry,
      path: string
    ): Promise<void> {
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry
        const file = await new Promise<File>((res, rej) =>
          fileEntry.file(res, rej)
        )
        if (isImageFile(file.name)) {
          results.push({ file, relativePath: path + file.name })
        }
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry
        const reader = dirEntry.createReader()
        const entries = await new Promise<FileSystemEntry[]>((res, rej) =>
          reader.readEntries(res, rej)
        )
        for (const e of entries) {
          await traverse(e, path + entry.name + '/')
        }
      }
    }

    for (const item of items) {
      const entry = item.webkitGetAsEntry?.()
      if (entry) await traverse(entry, '')
    }

    return results
  }

  // ---------- Download ----------

  const handleDownload = () => {
    if (resultBlob) downloadBlob(resultBlob, resultFilename)
    else if (resultBytes) downloadBytes(resultBytes, resultFilename)
  }

  const handleReset = () => {
    setConvertState('idle')
    setProgress(null)
    setError(null)
    setResultBlob(null)
    setResultBytes(null)
    setStats(null)
  }

  // ---------- Derived ----------

  const engineReady = engineState === 'ready'
  const converting = convertState === 'converting'
  const done = convertState === 'done'
  const percent =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0

  const acceptedExts = Array.from(SUPPORTED_EXTENSIONS).join(',')

  // ---------- Render ----------

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Engine status */}
      {engineState === 'loading' && (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          <span>Loading conversion engine&hellip;</span>
        </div>
      )}

      {engineState === 'error' && (
        <div className="flex items-start gap-3 bg-surface border border-danger/30 rounded-lg px-4 py-3 text-sm text-danger">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Failed to load the WebP encoder. Try refreshing the page.
          </span>
        </div>
      )}

      {/* Firefox notice */}
      {firefox && (
        <div className="flex items-start gap-3 bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-muted">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span>
            Folder upload requires Chrome or Edge. On Firefox, upload a{' '}
            <strong className="text-text">ZIP file</strong> — folder
            structure is fully preserved in the output.
          </span>
        </div>
      )}

      {/* Quality slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="quality"
            className="flex items-center gap-1.5 text-sm text-text-muted"
          >
            <Sliders className="w-4 h-4" />
            Quality
          </label>
          <span className="font-mono text-sm text-accent">{quality}%</span>
        </div>
        <input
          id="quality"
          type="range"
          min={1}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          disabled={converting}
          className="w-full accent-accent cursor-pointer disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-text-faint font-mono">
          <span>1 — smallest file</span>
          <span>100 — best quality</span>
        </div>
      </div>

      {/* Drop zone */}
      {convertState === 'idle' && (
        <div
          ref={dropRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          data-active={isDragging || undefined}
          className={[
            'relative border-2 border-dashed rounded-xl p-12',
            'flex flex-col items-center justify-center gap-4',
            'transition-[colors,transform,border-color,background-color] duration-150 cursor-pointer',
            isDragging
              ? 'border-accent bg-accent-faint scale-[1.01]'
              : 'border-border bg-surface hover:border-accent hover:bg-accent-faint',
          ].join(' ')}
          onClick={() => engineReady && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === 'Enter' && engineReady && fileInputRef.current?.click()
          }
          aria-label="Drop images or click to select"
        >
          {isDragging ? (
            <Download className="w-10 h-10 text-accent" />
          ) : (
            <Upload className="w-10 h-10 text-text-faint" />
          )}

          <div className="text-center">
            <p className="text-text font-medium">
              {isDragging ? 'Drop to convert' : 'Drop images here'}
            </p>
            <p className="text-text-muted text-sm mt-1">
              or choose how to add files below
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="text-xs text-text-faint font-mono">
              {Array.from(SUPPORTED_EXTENSIONS).join('  ')}
            </span>
          </div>

          {!engineReady && (
            <div className="absolute inset-0 rounded-xl bg-bg/60 flex items-center justify-center">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Loading engine&hellip;</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* File action buttons */}
      {convertState === 'idle' && engineReady && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
          >
            <Upload className="w-4 h-4" />
            Select Files
          </button>

          {folderSupported && !firefox && (
            <button
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-surface border border-border text-text font-medium text-sm hover:bg-surface-elevated transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              <FolderOpen className="w-4 h-4 text-text-muted" />
              Select Folder
            </button>
          )}

          <button
            onClick={() => zipInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-surface border border-border text-text font-medium text-sm hover:bg-surface-elevated transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
          >
            <FileArchive className="w-4 h-4 text-text-muted" />
            Upload ZIP
          </button>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedExts}
        onChange={handleFileInput}
        className="sr-only"
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is not in standard React types
        webkitdirectory=""
        multiple
        onChange={handleFolderInput}
        className="sr-only"
      />
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip"
        onChange={handleZipInput}
        className="sr-only"
      />

      {/* Converting state */}
      {converting && (
        <div className="animate-fade-up bg-surface border border-border rounded-xl p-8 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span>Converting&hellip;</span>
          </div>

          {progress && (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-mono text-text-muted">
                  <span className="truncate max-w-[70%]">
                    {progress.currentFile}
                  </span>
                  <span>
                    {progress.done}&nbsp;/&nbsp;{progress.total}
                  </span>
                </div>
                <div className="w-full bg-surface-elevated rounded-full h-1.5">
                  <div
                    className="bg-accent h-1.5 rounded-full transition-[width] duration-150"
                    style={{ width: `${percent}%`, transitionTimingFunction: 'var(--ease-out)' }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Done state */}
      {done && (
        <div className="animate-scale-in bg-surface border border-border rounded-xl p-8 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {stats?.count === 1
                ? '1 image converted'
                : `${stats?.count} images converted`}
            </span>
          </div>

          {stats && stats.savedKB > 0 && (
            <p className="text-text-muted text-sm">
              Saved approximately{' '}
              <span className="text-text font-mono">{stats.savedKB} KB</span>{' '}
              vs original size.
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              <Download className="w-4 h-4" />
              Download{' '}
              {resultBlob
                ? 'ZIP'
                : resultFilename}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-surface border border-border text-text-muted text-sm hover:bg-surface-elevated hover:text-text transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              <RefreshCw className="w-4 h-4" />
              Convert more
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {convertState === 'error' && error && (
        <div className="animate-fade-up bg-surface border border-danger/30 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-start gap-2 text-danger text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleReset}
            className="self-start flex items-center gap-2 px-4 py-2 rounded-md bg-surface border border-border text-text-muted text-sm hover:bg-surface-elevated hover:text-text transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
