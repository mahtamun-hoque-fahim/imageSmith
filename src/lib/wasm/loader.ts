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

export async function getWebPEncoder(): Promise<WebPModule> {
  if (typeof window.__webpModuleInstance !== 'undefined') {
    return window.__webpModuleInstance
  }

  if (!modulePromise) {
    modulePromise = new Promise<WebPModule>((resolve, reject) => {
      // Already loaded?
      if (typeof window.wasm_webp === 'function') {
        init(resolve, reject)
        return
      }

      const script = document.createElement('script')
      script.src = '/wasm/wasm_webp.js'
      script.async = true
      script.onload = () => init(resolve, reject)
      script.onerror = () => reject(new Error('Failed to load wasm_webp.js'))
      document.head.appendChild(script)
    })
  }

  return modulePromise
}

function init(
  resolve: (m: WebPModule) => void,
  reject: (e: unknown) => void
): void {
  const factory = window.wasm_webp
  if (typeof factory !== 'function') {
    reject(new Error('wasm_webp factory not found on window'))
    return
  }
  factory({ locateFile: (file: string) => `/wasm/${file}` })
    .then((m: WebPModule) => {
      window.__webpModuleInstance = m
      resolve(m)
    })
    .catch(reject)
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
