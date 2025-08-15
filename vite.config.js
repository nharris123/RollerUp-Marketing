import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: For GitHub Pages, set base to the repo name with leading/trailing slashes.
export default defineConfig({
  plugins: [react()],
  base: '/RollerUp-Marketing/',
})
