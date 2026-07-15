import type { RouteObject } from 'react-router-dom'
import MenuPage from '../pages/MenuPage.tsx'
import CheckoutPage from '../pages/CheckoutPage.tsx'
import OrderPage from '../pages/OrderPage.tsx'
import LookupPage from '../pages/LookupPage.tsx'
import NotFoundPage from '../pages/NotFoundPage.tsx'

// 路由表（Plain Object 寫法）— My Way 燒雞蛋糕 線上點餐
// ──────────────────────────────────────────────
// 顧客端頁面；品項選擇 sheet 與購物車抽屜為菜單頁內元件，不設獨立路由。
export const routes: RouteObject[] = [
  { path: '/', element: <MenuPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/orders/:id', element: <OrderPage /> },
  { path: '/lookup', element: <LookupPage /> },
  { path: '*', element: <NotFoundPage /> },
  // 業主端後續補入：/admin 通行碼、/admin/orders 接單台、/admin/export 匯出
]
