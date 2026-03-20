import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, //This locks React to port 3000 every time, which matches the CORS policy we set in the backend.

  },
})