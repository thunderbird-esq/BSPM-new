// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/BSPM-new/', // matches the GitHub repo name
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
})

