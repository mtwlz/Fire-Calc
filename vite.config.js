import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = './'

// https://vite.dev/config/
export default defineConfig({
  base,
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        name: 'Fire Calc',
        short_name: 'FireCalc',
        description: 'A lightweight fire calculation app',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: './icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: './icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
    }),
  ],
})
