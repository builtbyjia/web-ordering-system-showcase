import type { CartLine } from '../context/CartContext'

// ============================================================
// 訂單資料（Demo 靜態版，localStorage）
// ------------------------------------------------------------
// 送出訂單即產生取餐編號並存 localStorage；訂單頁／查詢頁讀取。
// 日後接後端時，改由 src/api/services/orders.ts 提供相同型別即可。
// ============================================================

export type OrderStatus = 'pending' | 'accepted' | 'ready' | 'done' | 'canceled'
export type OrderMode = 'order' | 'reserve'

export interface Order {
  id: string
  pickupNo: string // 取餐編號（短號，報號用）
  lines: CartLine[]
  totalCount: number
  totalPrice: number
  name: string
  phone: string
  pickupDate: string // YYYY-MM-DD
  pickupTime: string // HH:mm
  status: OrderStatus
  mode: OrderMode
  createdAt: number
}

const ORDERS_KEY = 'myway-orders'
const NO_KEY = 'myway-pickup-no'

// 營業時間（對外資訊）與現做規則
export const OPEN_HOUR = 15
export const CLOSE_HOUR = 23
export const PREP_MINUTES = 20 // 現做前置準備時間
const SLOT_MINUTES = 15 // 時段粒度

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

function writeAll(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch {
    // 忽略儲存失敗
  }
}

// 產生取餐編號（兩位循環，報號用；demo 版）
function nextPickupNo(): string {
  let current = 0 // 讀取失敗時的起算值
  try {
    current = Number(localStorage.getItem(NO_KEY) ?? '0') || 0
  } catch {
    // 讀取失敗則從 0 起算
  }
  const next = (current % 99) + 1
  try {
    localStorage.setItem(NO_KEY, String(next))
  } catch {
    // 忽略儲存失敗
  }
  return String(next)
}

// 建立訂單
export function createOrder(
  input: Omit<Order, 'id' | 'pickupNo' | 'status' | 'createdAt'>,
): Order {
  const order: Order = {
    ...input,
    id: `o_${Date.now().toString(36)}`,
    pickupNo: nextPickupNo(),
    status: 'pending',
    createdAt: Date.now(),
  }
  writeAll([order, ...readAll()])
  return order
}

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id)
}

// 以取餐編號 + 手機查詢（查無回 undefined，前端顯示統一錯誤）
export function findOrder(pickupNo: string, phone: string): Order | undefined {
  return readAll().find((o) => o.pickupNo === pickupNo.trim() && o.phone === phone.trim())
}

// 本機最近訂單（查詢頁快捷卡）
export function recentOrders(limit = 3): Order[] {
  return readAll().slice(0, limit)
}

// --- 取餐日期與時段 ---

export interface DateOption {
  value: string // YYYY-MM-DD
  label: string // 今 7/15 / 明 7/16
  closed: boolean
}

function fmtDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 產生未來數日日期選項（demo：暫無固定公休）
export function dateOptions(days = 3): DateOption[] {
  const out: DateOption[] = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const prefix = i === 0 ? '今 ' : i === 1 ? '明 ' : ''
    out.push({
      value: fmtDate(d),
      label: `${prefix}${d.getMonth() + 1}/${d.getDate()}`,
      closed: false,
    })
  }
  return out
}

export interface SlotOption {
  value: string // HH:mm
  disabled: boolean
}

// 產生某日的時段（今天需扣除現做前置時間；其餘日全開）
export function timeSlots(dateValue: string): SlotOption[] {
  const slots: SlotOption[] = []
  const now = new Date()
  const isToday = dateValue === fmtDate(now)

  let earliestMin = OPEN_HOUR * 60
  if (isToday) {
    const nowMin = now.getHours() * 60 + now.getMinutes() + PREP_MINUTES
    earliestMin = Math.max(earliestMin, Math.ceil(nowMin / SLOT_MINUTES) * SLOT_MINUTES)
  }

  for (let m = OPEN_HOUR * 60; m <= CLOSE_HOUR * 60; m += SLOT_MINUTES) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0')
    const mm = String(m % 60).padStart(2, '0')
    slots.push({ value: `${hh}:${mm}`, disabled: m < earliestMin })
  }
  return slots
}

// 台灣手機格式驗證（09xxxxxxxx）
export function isValidTwPhone(phone: string): boolean {
  return /^09\d{8}$/.test(phone.trim())
}

// 狀態中文標籤
export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '待確認',
  accepted: '已接單',
  ready: '可取餐',
  done: '已完成',
  canceled: '已取消',
}
