// react-redraft/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // We want assets under /ff/react-redraft/
  base: '/ff/react-redraft/',
  build: { outDir: 'dist' }
})
