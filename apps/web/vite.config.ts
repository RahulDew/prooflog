import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('@gsap') || id.includes('lenis')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-utils';
          }
        }
      },
      treeshake: {
        moduleSideEffects: (id) => id.endsWith('.css'),
        propertyReadSideEffects: false
      }
    }
  }
})
