import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { MenuItem, SkinFlavor } from '../data/menu'

// ============================================================
// 購物車狀態（Context + localStorage 持久化）
// ------------------------------------------------------------
// US-02：重新整理內容不遺失（localStorage）。
// 同品項不同外皮視為不同列（key = 品項 id + 外皮）。
// ============================================================

// 購物車單列
export interface CartLine {
  key: string
  itemId: string
  name: string
  skin: SkinFlavor | null
  price: number
  qty: number
}

interface CartContextValue {
  lines: CartLine[]
  totalCount: number
  totalPrice: number
  addLine: (item: MenuItem, skin: SkinFlavor | null, qty: number) => void
  setQty: (key: string, qty: number) => void
  removeLine: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'myway-cart'

// 組出唯一鍵：品項 + 外皮
function lineKey(itemId: string, skin: SkinFlavor | null): string {
  return skin ? `${itemId}__${skin}` : itemId
}

export function CartProvider({ children }: { children: ReactNode }) {
  // 初始化：從 localStorage 還原（重新整理不遺失）
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartLine[]) : []
    } catch {
      return []
    }
  })

  // 變動即寫回 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // 忽略儲存失敗（例如隱私模式）
    }
  }, [lines])

  // 加入一列（同 key 則累加份數）
  function addLine(item: MenuItem, skin: SkinFlavor | null, qty: number) {
    const key = lineKey(item.id, skin)
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
      }
      return [...prev, { key, itemId: item.id, name: item.name, skin, price: item.price, qty }]
    })
  }

  // 設定份數（<= 0 則移除該列）
  function setQty(key: string, qty: number) {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    )
  }

  function removeLine(key: string) {
    setLines((prev) => prev.filter((l) => l.key !== key))
  }

  function clear() {
    setLines([])
  }

  const totalCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines])
  const totalPrice = useMemo(() => lines.reduce((s, l) => s + l.qty * l.price, 0), [lines])

  const value: CartContextValue = { lines, totalCount, totalPrice, addLine, setQty, removeLine, clear }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// 取用購物車的 hook
// eslint-disable-next-line react-refresh/only-export-components -- Context 檔同時提供 Provider 與存取 hook（慣例）
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart 必須在 <CartProvider> 內使用')
  return ctx
}
