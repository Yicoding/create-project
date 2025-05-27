import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  resolve: {
    // 设置路径别名
    alias: {
      '@': resolve(__dirname, 'src'),
      src: resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        dir: 'dist'
      }
    }
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' }
      ]
    })
  ],
}); 