import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/books': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/users': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/reviews': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/api/orders': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
})
