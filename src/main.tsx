import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 全域樣式（內含 Bootstrap 與自訂設計層）
import './styles/main.scss'
// Bootstrap 互動元件所需的 JS（已含 Popper，供導覽列收合、下拉選單等使用）
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import App from './App.tsx'

// 掛載 React 應用程式。前端路由改用 Data Router（createBrowserRouter），
// 由 App 內的 <RouterProvider> 提供路由 context，故此處不再需要 <BrowserRouter> 包覆。
// 註：#root 必定存在於 index.html，故以非空斷言（!）排除 null。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
