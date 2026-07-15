import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 設定檔：https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/web-ordering-system-showcase/',
  css: {
    preprocessorOptions: {
      scss: {
        // 抑制 Bootstrap（相依套件）內部的 Sass 棄用警告，保持終端輸出乾淨
        quietDeps: true,
        // 自家 main.scss 仍使用 @import，故一併靜音 import 棄用提醒
        silenceDeprecations: ['import'],
      },
    },
  },
})
