/**
 * ============================================================
 * 🚀 TITAN BUILD ORCHESTRATOR (v4.3 - Stealth Mode)
 * Ref: Report Section 4.2 (Development & Build Pipelines)
 * Purpose: Vite configuration for optimized bundling, proxying, 
 *          and automatic console telemetry cleanup.
 * ============================================================
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  // 🔥 NEW: STEALTH MODE - Automatically strips console.logs in Production!
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    port: 5173,      
    strictPort: true, 
    host: true,       
    proxy: {
      // 🛰️ NEURAL BACKEND LINK: Development Handshake
      '/api': {
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false,
        // Optional: Re-routing to clean paths if institutional node requires
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
      // 📡 SOCKET HANDSHAKE: Real-time telemetry proxy
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
  build: {
    // 🏗️ OPTIMIZED BUNDLING: Chunking strategy for large UI dashboards
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});