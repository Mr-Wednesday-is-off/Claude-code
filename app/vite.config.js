import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// After the build, tell the service worker which files to save for offline
// use, and stamp it with a version so each deploy replaces the old cache.
function serviceWorkerPrecache() {
  let outDir
  return {
    name: 'service-worker-precache',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const swPath = path.join(outDir, 'sw.js')
      if (!fs.existsSync(swPath)) return

      const files = fs
        .readdirSync(outDir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => path.relative(outDir, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
        .filter((file) => file !== 'sw.js')
        // Fonts: only the modern Latin files up front; any others are saved when first used.
        .filter((file) => !/\.woff2?$/.test(file) || /inter-latin-\d+-normal.*\.woff2$/.test(file))
        .sort()

      const hash = crypto.createHash('sha256')
      for (const file of files) hash.update(file).update(fs.readFileSync(path.join(outDir, file)))
      const version = hash.digest('hex').slice(0, 12)

      // '' is the app's start page (index.html served at the scope root)
      const precache = files.map((file) => (file === 'index.html' ? '' : file))

      const sw = fs
        .readFileSync(swPath, 'utf8')
        .replace('__SW_VERSION__', version)
        .replace('/*__SW_PRECACHE__*/[]', JSON.stringify(precache))
      fs.writeFileSync(swPath, sw)
    },
  }
}

export default defineConfig({
  base: '/Claude-code/',
  plugins: [react(), tailwindcss(), serviceWorkerPrecache()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
})
