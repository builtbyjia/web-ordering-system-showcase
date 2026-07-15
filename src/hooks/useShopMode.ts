import { useSearchParams } from 'react-router-dom'
import { OPEN_HOUR, CLOSE_HOUR } from '../data/orders'

// ============================================================
// 營業模式 hook
// ------------------------------------------------------------
// 依現在時間判斷：營業時間內＝下單模式（order），
// 非營業時間＝預約模式（reserve，可預約未來時段取餐）。
// 暫停接單為店家手動狀態。
// Demo 覆蓋：網址帶 ?mode=order|reserve、?paused=1 可強制展示各情境，
// 方便向業主 demo 三種狀態。
// ============================================================

export type ShopMode = 'order' | 'reserve'

export function useShopMode(): { mode: ShopMode; paused: boolean } {
  const [params] = useSearchParams()

  const forceMode = params.get('mode')
  const forcePaused = params.get('paused')

  // 依時間判斷是否營業（demo 用整點簡化）
  const hour = new Date().getHours()
  const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR

  const mode: ShopMode =
    forceMode === 'reserve'
      ? 'reserve'
      : forceMode === 'order'
        ? 'order'
        : isOpen
          ? 'order'
          : 'reserve'

  const paused = forcePaused === '1'

  return { mode, paused }
}
