import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import galleryApiPlugin from './vite-plugin-gallery-api'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), galleryApiPlugin()],
})
