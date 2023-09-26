import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

import * as child from 'child_process';

const commitId = child.execSync('git rev-parse --short HEAD').toString();
const branch = child.execSync('git rev-parse --abbrev-ref HEAD').toString();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        background_color: '#555555',
        categories: ['graphics'],
        display: 'fullscreen',
        icons: [
          {
            src: '/web-image-editor/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/web-image-editor/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/web-image-editor/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/web-image-editor/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/web-image-editor/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        name: 'Web Image Editor',
        orientation: 'any',
        scope: '/',
        short_name: 'Web Image Editor',
        start_url: '/web-image-editor/',
        theme_color: '#f69435',
      },
    }),
  ],
  base: '/web-image-editor/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  define: {
    __COMMIT_ID__: JSON.stringify(commitId.trim()),
    __GIT_BRANCH__: JSON.stringify(branch.trim()),
  },
  server: {
    headers: {
      'Strict-Transport-Security': 'max-age=86400; includeSubDomains', // Adds HSTS options to your website, with a expiry time of 1 day
      'X-Content-Type-Options': 'nosniff', // Protects from improper scripts runnings
      'X-Frame-Options': 'DENY', // Stops your site being used as an iframe
      'X-XSS-Protection': '1; mode=block', // Gives XSS protection to legacy browsers
    },
  },
});
