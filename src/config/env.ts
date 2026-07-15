// 環境變數統一讀取點：元件與服務一律 import { env }，不直接碰 import.meta.env。
// 新增變數時記得同步補 .env.example 與 src/vite-env.d.ts 的 ImportMetaEnv 型別。

/** 全域環境設定（自 VITE_* 環境變數集中讀取） */
export const env = {
  /** 後端 API 基底網址（階段六後端定案後指向真後端） */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  /** LIFF App ID（B-10 LIFF 包裝時使用；未設定時為空字串＝純網頁模式） */
  liffId: import.meta.env.VITE_LIFF_ID ?? '',
} as const
