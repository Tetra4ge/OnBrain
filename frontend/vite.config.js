import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from the frontend directory as requested by the user
  const envDir = process.cwd()
  const env = loadEnv(mode, envDir, '')
  const apiTarget = env.VITE_API_DEV_URL || env.VITE_API_URL || 'http://localhost:8000'

  return {
  envDir,
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
    proxy: {
      // Proxy /api/* → backend service (Docker: 'api', local: localhost:8000)
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      }
    }
  }
}})
