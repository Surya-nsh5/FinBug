import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'build',
    // Enable minification with esbuild (faster and built-in)
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // manualChunks: {
        //   'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        //   'chart-vendor': ['recharts'],
        //   'ui-vendor': ['react-hot-toast', 'react-icons', 'emoji-picker-react'],
        //   'utils-vendor': ['axios', 'moment']
        // }
      }
    },
    // Enable source maps for production debugging (optional, disable for smaller builds)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Enable asset inlining for small files
    assetsInlineLimit: 4096 // 4kb
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    exclude: []
  },
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'FinBug - AI Finance Tracker',
        short_name: 'FinBug',
        description: 'Track your income and expenses with AI-powered insights.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false
  },
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: false
  }
})
