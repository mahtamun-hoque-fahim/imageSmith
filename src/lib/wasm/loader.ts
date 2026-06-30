'use client'

export const SUPPORTED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.avif',
])

export function isImageFile(name: string): boolean {
  const ext = '.' + name.split('.').pop()!.toLowerCase()
  return SUPPORTED_EXTENSIONS.has(ext)
}

// ---------- WASM via script-tag injection ----------
// We load wasm_webp.js from /public/wasm/ at runtime (not via import)
// so Turbopack never tries to bundle this CJS/Emscripten module.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebPModule = any

declare global {
  interface Window {
    // wasm_webp is exposed as a global var when the script is loaded via <script> tag
    wasm_webp: ((overrides: object) => Promise<WebPModule>) | undefined
    __webpModuleInstance: WebPModule | undefined
  }
}

let modulePromise: Promise<WebPModule> | null = null

// Diagnostic instrumentation -- temporary, helps pinpoint exactly where
// WASM loading stalls in production. Safe to strip once confirmed working.
const WASM_LOAD_TIMEOUT_MS = 15000

export async function getWebPEncoder(): Promise<WebPModule> {
  if (typeof window.__webpModuleInstance !== 'undefined') {
    return window.__webpModuleInstance
  }

  if (!modulePromise) {
    modulePromise = new Promise<WebPModule>((resolve, reject) => {
      console.log('[wasm] load sequence starting')

      const timer = setTimeout(() => {
        console.error(
          `[wasm] TIMEOUT -- factory promise never settled within ${WASM_LOAD_TIMEOUT_MS}ms. ` +
          'Check Network tab for /wasm/wasm_webp.wasm status code and response headers.'
        )
        reject(new Error('WASM engine load timed out'))
      }, WASM_LOAD_TIMEOUT_MS)

      const settleResolve = (m: WebPModule) => {
        clearTimeout(timer)
        resolve(m)
      }
      const settleReject = (e: unknown) => {
        clearTimeout(timer)
        reject(e)
      }

      // Already loaded?
      if (typeof window.wasm_webp === 'function') {
        console.log('[wasm] window.wasm_webp already present, calling factory directly')
        init(settleResolve, settleReject)
        return
      }

      const script = document.createElement('script')
      script.src = '/wasm/wasm_webp.js'
      script.async = true
      script.onload = () => {
        console.log('[wasm] script tag onload fired (wasm_webp.js downloaded + executed)')
        init(settleResolve, settleReject)
      }
      script.onerror = (e) => {
        console.error('[wasm] script tag onerror fired -- /wasm/wasm_webp.js failed to load', e)
        settleReject(new Error('Failed to load wasm_webp.js'))
      }
      document.head.appendChild(script)
      console.log('[wasm] script tag appended, src =', script.src)
    })
  }

  return modulePromise
}

function init(
  resolve: (m: WebPModule) => void,
  reject: (e: unknown) => void
): void {
  console.log('[wasm] init() running, checking window.wasm_webp')
  const factory = window.wasm_webp
  if (typeof factory !== 'function') {
    console.error('[wasm] window.wasm_webp is not a function, typeof =', typeof factory)
    reject(new Error('wasm_webp factory not found on window'))
    return
  }
  console.log('[wasm] calling factory() -- this triggers fetch of wasm_webp.wasm')
  factory({ locateFile: (file: string) => `/wasm/${file}` })
    .then((m: WebPModule) => {
      console.log('[wasm] factory promise RESOLVED -- engine ready', m)
      window.__webpModuleInstance = m
      resolve(m)
    })
    .catch((e: unknown) => {
      console.error('[wasm] factory promise REJECTED', e)
      reject(e)
    })
}

// ---------- Image → RGBA via Canvas ----------

export async function fileToRGBA(file: File): Promise<{
  data: Uint8Array
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Cannot get 2d context'))
        return
      }
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
      URL.revokeObjectURL(url)
      resolve({
        data: new Uint8Array(imageData.data.buffer),
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Failed to load image: ${file.name}`))
    }

    img.src = url
  })
}

// ---------- Main encode ----------

export async function encodeToWebP(
  file: File,
  quality: number
): Promise<Uint8Array> {
  const [module, { data, width, height }] = await Promise.all([
    getWebPEncoder(),
    fileToRGBA(file),
  ])
  const result = module.encode(data, width, height, 4, { quality }) as ArrayBufferView
  return new Uint8Array(result.buffer, result.byteOffset, result.byteLength)
}
