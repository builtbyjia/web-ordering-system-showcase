// 身分／登入抽象層：對外只暴露 user、login()、isLoggedIn，
// 內部負責判斷「LIFF 或一般瀏覽器」——元件永遠不直接碰 liff。
// 目前為訪客模式空殼；日後接上 LINE LIFF 時，於此回填 LIFF 分支（liff.getProfile() 等）。

import { useState } from 'react'
import { isInLineClient } from '../lib/liff'

/** 登入使用者資料（LIFF 模式對應 LINE profile；網頁模式暫無登入） */
export interface AuthUser {
  /** 使用者識別碼（LIFF 模式為 LINE userId） */
  id: string
  /** 顯示名稱 */
  displayName: string
  /** 頭像網址（可能沒有） */
  avatarUrl?: string
}

/**
 * 取得目前身分狀態的自訂 hook。
 * 目前一律為訪客模式（user 為 null）；點餐流程本就免登入（無登入牆），
 * 此接口為日後 LIFF 自動帶入 LINE 身分預留。
 */
export function useAuth() {
  // 訪客模式：尚無任何登入機制，state 預留給日後接上 LIFF 後更新
  const [user] = useState<AuthUser | null>(null)

  /** 觸發登入。網頁模式為 no-op；LIFF 模式改走 liff.login()。 */
  const login = (): void => {
    if (isInLineClient()) {
      // TODO（LINE LIFF 階段）：liff.login() → getProfile() → setUser(...)
    }
    // 網頁模式：本產品免登入，維持訪客
  }

  return { user, login, isLoggedIn: user !== null }
}
