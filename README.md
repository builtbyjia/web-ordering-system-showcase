# My Way 燒雞蛋糕・線上點餐系統（作品集展示版）

夾心雞蛋糕攤販的線上點餐系統：顧客掃 QR code（或經 LINE）瀏覽菜單、選外皮下單、挑取餐時段；
業主用手機接單、流轉狀態、匯出訂單數據。目標是**錯單率歸零**與**看得見的營運數據**。

> 🔎 **關於本 repo**：這是**前端展示版**，作為需求 demo 與作品集使用。資料以瀏覽器 localStorage
> 模擬（無真實後端），店家聯絡資訊為脫敏佔位值。程式碼版權保留，歡迎閱讀參考，其他用途請先聯繫。

🔗 **線上 Demo**：`https://<你的帳號>.github.io/web-ordering-system-showcase/`

## 技術棧

- **Vite** — 開發伺服器與打包
- **React 19 + TypeScript** — UI 元件（strict 模式）
- **react-router-dom** — 前端路由（`createBrowserRouter`）
- **Bootstrap 5 + 自訂 SCSS** — 結構層＋設計層雙層樣式策略
- **axios** — API 串接（統一經 `src/api/client.ts`）
- **ESLint + Prettier** — 程式碼風格
- 部署：**GitHub Pages**（GitHub Actions 自動建置部署）

## 快速開始

```bash
npm install            # 安裝相依套件
npm run dev            # 啟動開發伺服器 http://localhost:5173
```

手機真機測試：`npm run dev -- --host`，手機連同網段 Wi-Fi 開啟終端機顯示的區網網址。

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 型別檢查後打包正式版到 `dist/`（並產生 SPA fallback 用的 `404.html`） |
| `npm run preview` | 預覽打包結果 |
| `npm run lint` | 以 ESLint 檢查程式碼 |
| `npm run format` | 以 Prettier 格式化 |

## 目錄結構

```
src/
├─ api/
│  └─ client.ts          # axios 實例＋攔截器（所有 API 唯一入口）
├─ components/           # 可重用元件（Navbar、購物車抽屜、品項卡…）
├─ config/
│  └─ env.ts             # 環境變數統一讀取點
├─ context/
│  └─ CartContext.tsx    # 全站購物車狀態
├─ data/                 # Demo mock 資料（menu、orders；以 localStorage 模擬）
├─ hooks/                # 自訂 hook（useShopMode、useAuth…）
├─ lib/
│  └─ liff.ts            # LINE LIFF 封裝（預留接口）
├─ pages/                # 頁面元件（需至 src/routes/index.tsx 註冊）
├─ routes/
│  └─ index.tsx          # 路由表（RouteObject[] Plain Object 寫法）
├─ styles/               # 全域樣式與主題（雙層樣式策略）
├─ App.tsx               # 建立 Router
├─ main.tsx              # 進入點
└─ vite-env.d.ts         # 環境變數型別宣告
```

## 樣式策略

本專案刻意避免「框架預設罐頭外觀」，採雙層結構：**Bootstrap 作為結構層**（版面、響應式網格、
無障礙元件、utility class），**自訂 SCSS 作為設計靈魂層**（`_variables.scss` 覆寫 Bootstrap 變數、
`_theme.scss` 定義 CSS 變數／字型／動態與背景氛圍），做出有記憶點的設計而非通用 AI 美感。

## 架構 roadmap（刻意預留的接口）

本展示版為純前端＋localStorage mock。為了讓「日後接後端／LINE」時元件層幾乎不用改，已先鋪好
幾個抽象接口——**目前尚未串接，屬有意保留的佔位**：

- **API 抽象層**：`src/api/client.ts`（axios 實例，全站 API 唯一入口）＋ `src/config/env.ts`
  （環境變數統一讀取點）。接後端時只需在 `src/api/services/` 補領域服務函式，元件不需改動。
- **LINE LIFF 整合**：`src/lib/liff.ts`（唯一 import `@line/liff` 之處）＋ `src/hooks/useAuth.ts`
  （身分抽象層）。接上 LIFF 後即可自動帶入 LINE 身分，元件無感。
- **業主端**：規劃於 `/admin`（PIN 通行碼）、`/admin/orders`（接單台）、`/admin/export`（CSV 匯出），
  與顧客端共用同一路由表、以路徑前綴分離。

## 環境變數

一律 `VITE_` 前綴，程式端統一經 `src/config/env.ts` 讀取；範本見 `.env.example`。

| 變數 | 用途 |
| --- | --- |
| `VITE_API_BASE_URL` | 後端 API 基底網址（未設定時退回公開測試 API） |
| `VITE_LIFF_ID` | LIFF App ID（接上 LINE LIFF 時填入；留空＝純網頁模式） |

## 部署

推送到 `main` 後由 `.github/workflows/deploy.yml` 自動建置並部署到 GitHub Pages。
**首次需**於 repo Settings → Pages → Source 選擇「GitHub Actions」。

因採 `createBrowserRouter` 且部署於子路徑，build 會把 `index.html` 複製成 `404.html` 作為
SPA fallback（GitHub Pages 對未知路徑會回 `404.html`，再由前端路由接手）；Vite `base` 與 router
`basename` 皆對齊 `/web-ordering-system-showcase/`。
