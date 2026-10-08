import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El repo se llama Muu_Track, por eso GitHub Pages sirve el sitio en /Muu_Track/
export default defineConfig({
  base: '/Muu_Track/',
  plugins: [react(), tailwindcss()],
  test: { include: ['tests/**/*.test.ts'] },
})
