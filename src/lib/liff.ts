// LIFF 封裝層——全 app **唯一允許 import '@line/liff' 的地方**。
// 目前為刻意預留的空殼（尚未安裝 @line/liff）；其餘程式一律透過本檔的函式判斷執行環境，
// 日後接上 LINE LIFF 時，元件一行都不用改即可切換至 LIFF 模式。

/**
 * 初始化 LIFF SDK。
 * 目前為 no-op；接上 LIFF 時改為動態 import '@line/liff' 並以 env.liffId 呼叫 liff.init()。
 */
export function initLiff(): Promise<void> {
  // TODO（LINE LIFF 階段）：動態載入 @line/liff 並初始化；失敗時降級為一般網頁模式。
  return Promise.resolve()
}

/**
 * 是否在 LINE 內建瀏覽器（LIFF）中執行。
 * 目前固定回傳 false（純網頁模式）；接上 LIFF 時改為 liff.isInClient()。
 */
export function isInLineClient(): boolean {
  return false
}
