import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,               // wymagane w Dockerze (0.0.0.0)
    port: 5173,
    watch: {
      usePolling: true        // hot reload na Windows/WSL2
    },
    hmr: {
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) || 5173
    },

    proxy: {
      '/api':   { target: 'http://app:8000', changeOrigin: false, secure: false },
      '/media': { target: 'http://app:8000', changeOrigin: false, secure: false },
      '/static':{ target: 'http://app:8000', changeOrigin: false, secure: false },
    }
  },
});
