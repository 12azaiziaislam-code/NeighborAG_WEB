import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

// The site is built to web/dist and served by the Worker (wrangler.toml [assets]). In dev, /api is proxied to
// `wrangler dev` so the frontend and backend run together.
export default defineConfig({
  root: here,
  base: '/',
  plugins: [react()],
  build: { outDir: resolve(here, 'dist'), emptyOutDir: true },
  server: { port: 5180, proxy: { '/api': 'http://127.0.0.1:8787' } },
})
