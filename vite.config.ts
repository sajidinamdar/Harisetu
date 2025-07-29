import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            /<%= GOOGLE_MAPS_API_KEY %>/g,
            env.GOOGLE_MAPS_API_KEY || ''
          );
        },
      },
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // Disable source maps to avoid warnings about missing .map files
    build: {
      sourcemap: false,
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/send-otp': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/verify-otp': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/register-otp': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    define: {
      // Pass environment variables to the client
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(env.GOOGLE_MAPS_API_KEY),
      'process.env.WEATHER_API_KEY': JSON.stringify(env.WEATHER_API_KEY),
    },
  };
});
