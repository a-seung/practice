import { fileURLToPath, URL } from 'node:url'
import path from 'node:path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'components': path.resolve(__dirname, './src/components'),
    }
  },
  server: {
    port: 5173, //포트 번호 고정
    open: true  //서버 시작시 자동으로 브라우저 열리게
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
