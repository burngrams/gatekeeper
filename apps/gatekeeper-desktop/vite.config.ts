import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import svgr from 'vite-plugin-svgr'

// const svgr = require('vite-plugin-svgr').default

export default defineConfig({
  mode: 'development',
  plugins: [
    react(),
    svgr(),
    electron([
      {
        entry: 'electron/index.ts',
      },
      {
        entry: 'preload/preload.ts',
        onstart(options) {
          options.reload()
        },
      },
    ]),
  ],
})
