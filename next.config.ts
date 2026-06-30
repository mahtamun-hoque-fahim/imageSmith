import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Compiler (stable in v16)
  reactCompiler: false,

  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 'unsafe-eval' is required in both envs: the libwebp WASM
              // module's embind runtime uses new Function() internally
              // (createNamedFunction/extendError, for its custom error
              // classes) -- this is JS-level eval, not WASM compile, so
              // 'wasm-unsafe-eval' alone does not cover it.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' blob: data:",
              "connect-src 'self'",
              "worker-src 'self' blob:",
              "font-src 'self' https://fonts.gstatic.com",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

export default nextConfig
