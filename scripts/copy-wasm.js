const { copyFileSync, mkdirSync, existsSync } = require('fs')
const { join } = require('path')

const srcDir = join(__dirname, '..', 'node_modules', '@saschazar', 'wasm-webp')
const destDir = join(__dirname, '..', 'public', 'wasm')

mkdirSync(destDir, { recursive: true })

const files = ['wasm_webp.wasm', 'wasm_webp.js']
for (const f of files) {
  const src = join(srcDir, f)
  const dest = join(destDir, f)
  if (!existsSync(src)) {
    console.error(`${f} not found — run npm install first`)
    process.exit(1)
  }
  copyFileSync(src, dest)
  console.log(`${f} -> public/wasm/${f}`)
}
