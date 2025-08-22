// react-redraft/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Pages URL will be: https://cjtags151508.github.io/ff/react-redraft/
  base: '/ff/react-redraft/',
  build: { outDir: 'dist' } // default is fine; keep 'dist'
})
