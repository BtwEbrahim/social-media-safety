import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base must match your repo name exactly for GitHub Pages project sites
// e.g. https://BtwEbrahim.github.io/social-media-safety/
export default defineConfig({
  base: '/social-media-safety/',
  plugins: [react(), tailwindcss()],
})
