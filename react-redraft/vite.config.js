import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  // If your GitHub repo name is "ff", keep this as '/ff/'.
  // If the repo name is different, change to '/<REPO>/'.
  // If it's a user/org page repo named <username>.github.io, use '/'.
  base: '/ff/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        weekly: resolve(__dirname, 'weekly.html'),
      },
    },
  },
})
