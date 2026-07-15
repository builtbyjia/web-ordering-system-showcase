/// <reference types="vite/client" />

// 自訂環境變數型別（以 VITE_ 為前綴，經 import.meta.env 取用）。
// 與 Vite 內建的 ImportMetaEnv 介面合併；新增環境變數時於此補上欄位即可獲得型別提示。
interface ImportMetaEnv {
  /** API 基底網址（見 .env.example） */
  readonly VITE_API_BASE_URL?: string
  /** LIFF App ID（接上 LINE LIFF 時使用；留空＝純網頁模式） */
  readonly VITE_LIFF_ID?: string
}

// Bootstrap 的 JS bundle 未提供型別宣告，於此宣告模組以供 main.tsx 的 side-effect 匯入。
declare module 'bootstrap/dist/js/bootstrap.bundle.min.js'
