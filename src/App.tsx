import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes/index.tsx'
import { CartProvider } from './context/CartContext.tsx'

// 建立 Data Router（Plain Object 路由）
// ──────────────────────────────────────────────
// 註：於模組層級（元件外）建立 router，避免每次 render 重建而重置路由狀態。
// basename 取自 Vite 的 base（import.meta.env.BASE_URL），使子路徑部署
//（GitHub Pages 專案站台 /web-ordering-system-showcase/）下前端路由能正確解析；
// 去除結尾斜線以符合 react-router 對 basename 的格式要求。
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL.replace(/\/$/, ''),
})

// 應用程式進入點：以 CartProvider 提供全站購物車狀態，RouterProvider 啟用前端路由。
function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}

export default App
