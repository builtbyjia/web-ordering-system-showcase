// ============================================================
// My Way 燒雞蛋糕 — 菜單資料（Demo 靜態版）
// ------------------------------------------------------------
// 目前為前端 mock 資料，供高保真 demo 使用；日後接後端時，
// 改由 src/api/services/menu.ts 回傳相同型別即可，元件不需改動。
// 產品設定（階段二 PRD）：三分類、均一價 $65、
// 經典夾心與熱門推薦須選外皮（原味／奶茶）。
// ============================================================

// 外皮口味（經典夾心、熱門推薦須二選一）
export type SkinFlavor = '原味' | '奶茶'
export const SKIN_FLAVORS: SkinFlavor[] = ['原味', '奶茶']

// 分類 id
export type CategoryId = 'flavor' | 'filled' | 'popular'

// 分類
export interface Category {
  id: CategoryId
  name: string
  note: string // 份量與外皮規則說明
}

// 品項
export interface MenuItem {
  id: string
  name: string
  categoryId: CategoryId
  price: number // 均一價
  pieces: number // 一份幾個
  requiresSkin: boolean // 是否須選外皮
  desc?: string // 短描述
  emoji: string // placeholder 圖示（暫代實物照，之後換真實去背照）
  tag?: string // 標籤（如「熱門」「人氣」）
}

// 均一價
export const UNIT_PRICE = 65

// 過敏原（常駐警語）
export const ALLERGENS = '含蛋・奶・起司・花生・芝麻'

// 店家資訊（Demo 佔位資料——地址與電話為脫敏佔位值，非真實資訊）
export const SHOP_INFO = {
  name: 'My Way 燒雞蛋糕',
  address: '新北市新莊區○○路 00 號', // demo 佔位地址（脫敏）
  phone: '0900-000-000', // demo 佔位電話（脫敏）
  hours: '15:00–23:00',
}

export const categories: Category[] = [
  { id: 'flavor', name: '風味蛋糕', note: '1 份 4 個' },
  { id: 'filled', name: '經典夾心', note: '1 份 4 個・須選外皮' },
  { id: 'popular', name: '熱門推薦', note: '1 份 3 個・須選外皮' },
]

export const menuItems: MenuItem[] = [
  // 風味蛋糕（不須外皮）
  { id: 'original', name: '原味蛋糕', categoryId: 'flavor', price: UNIT_PRICE, pieces: 4, requiresSkin: false, desc: '金黃現烤、純粹蛋香', emoji: '🥚' },
  { id: 'milk-tea', name: '奶茶蛋糕', categoryId: 'flavor', price: UNIT_PRICE, pieces: 4, requiresSkin: false, desc: '奶茶風味麵糊、微甜回甘', emoji: '🧋' },

  // 經典夾心（須選外皮，1 份 4 個）
  { id: 'custard', name: '卡士達', categoryId: 'filled', price: UNIT_PRICE, pieces: 4, requiresSkin: true, desc: '濃稠卡士達流心', emoji: '🍮', tag: '人氣' },
  { id: 'chocolate', name: '巧克力', categoryId: 'filled', price: UNIT_PRICE, pieces: 4, requiresSkin: true, desc: '香濃巧克力夾心', emoji: '🍫' },
  { id: 'raisin', name: '葡萄乾', categoryId: 'filled', price: UNIT_PRICE, pieces: 4, requiresSkin: true, desc: '香甜葡萄乾夾心', emoji: '🍇' },
  { id: 'cranberry', name: '蔓越莓乾', categoryId: 'filled', price: UNIT_PRICE, pieces: 4, requiresSkin: true, desc: '酸甜蔓越莓乾', emoji: '🔴' },

  // 熱門推薦（須選外皮，1 份 3 個）
  { id: 'cheese', name: '牽絲起司', categoryId: 'popular', price: UNIT_PRICE, pieces: 3, requiresSkin: true, desc: '據說可以牽到 30 的起司', emoji: '🧀', tag: '熱門' },
  { id: 'brown-sugar-mochi', name: '黑糖麻糬', categoryId: 'popular', price: UNIT_PRICE, pieces: 3, requiresSkin: true, desc: '黑糖漿＋白玉麻糬', emoji: '🟤', tag: '熱門' },
  { id: 'white-mochi', name: '白玉麻糬', categoryId: 'popular', price: UNIT_PRICE, pieces: 3, requiresSkin: true, desc: '軟糯白玉麻糬', emoji: '⚪' },
  { id: 'sesame', name: '芝麻湯圓', categoryId: 'popular', price: UNIT_PRICE, pieces: 3, requiresSkin: true, desc: '黑芝麻流餡', emoji: '⚫' },
  { id: 'peanut', name: '花生湯圓', categoryId: 'popular', price: UNIT_PRICE, pieces: 3, requiresSkin: true, desc: '香濃花生醬餡', emoji: '🥜' },
  { id: 'pearl-milk-tea', name: '珍珠奶茶', categoryId: 'popular', price: UNIT_PRICE, pieces: 3, requiresSkin: true, desc: '奶茶餡＋黑糖珍珠', emoji: '🧋' },
]

// 依分類取得品項
export function itemsByCategory(categoryId: CategoryId): MenuItem[] {
  return menuItems.filter((item) => item.categoryId === categoryId)
}
