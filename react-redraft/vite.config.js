import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  // Keep site under /ff/react-redraft/
  base: '/ff/react-redraft/',
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
