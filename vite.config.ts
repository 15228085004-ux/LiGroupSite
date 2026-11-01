import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative assets work on GitHub project pages and custom domains.
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/gsap/') || id.includes('/node_modules/ogl/')) {
            return 'motion'
          }
          if (id.includes('/node_modules/@supabase/')) {
            return 'backend'
          }
          if (id.includes('/node_modules/react')) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },
})
