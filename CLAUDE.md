# 開發規範

## 語言與註解

- 一律使用繁體中文（台灣用語）回應與撰寫文件。
- 所有函式、自訂 hook 都要加上繁體中文註解，說明用途。

## 技術棧

- 建置工具：**Vite**
- 框架：**React** + **TypeScript**
- 路由：**react-router-dom**
- UI 結構：**Bootstrap 5**（透過 SCSS 客製）
- API 串接：**axios**（統一經 `src/api/client.ts`）
- 型別檢查：**TypeScript**（strict 模式；設定見 `tsconfig.app.json`）
- 程式碼風格：ESLint + Prettier

## 樣式策略（重要）

本專案刻意避免「框架預設罐頭外觀」，採雙層結構：

- **Bootstrap 作為結構層**：版面、響應式網格、無障礙元件、utility class。
- **自訂設計層作為靈魂**：
  - `src/styles/_variables.scss`：覆寫 Bootstrap 變數（色票、字型、圓角）。
  - `src/styles/_theme.scss`：CSS 變數、字型細節、動態與背景氛圍。
  - `src/styles/main.scss`：彙整匯入順序（functions → 變數 → bootstrap → theme）。
- 新增頁面／元件時，挑選清晰的美學方向、獨特字型、協調色彩、適度動態，
  做出有記憶點的設計，而非通用 AI 美感。

## 響應式（必須）

- 所有頁面都要支援手機畫面，優先使用 Bootstrap 網格與響應式 utility（`col-*`、`d-*-*` 等）。
- 完成後請在手機寬度檢查版面。

## 目錄結構約定

- 副檔名慣例：含 JSX 的檔案用 `.tsx`，純邏輯（API／hook／設定）用 `.ts`。
- `src/pages/`：頁面元件，需到 `src/routes/index.tsx` 的路由表註冊路徑。
- `src/routes/`：路由表（Plain Object 寫法，型別為 `RouteObject[]`），由 `src/App.tsx` 以 `createBrowserRouter` 建立 Router。
- `src/components/`：可重用元件。
- `src/api/client.ts`：axios 實例；**所有 API 呼叫一律經過此實例**，勿在元件內直接用 `fetch`／`axios`。
- `src/api/services/`：依領域分檔的 API 服務函式（含資料型別定義）。
- `src/hooks/`：自訂 hook。
- `src/styles/`：全域樣式與主題。

## 環境變數

- 一律以 `VITE_` 前綴命名（Vite 限制），程式中以 `import.meta.env.VITE_XXX` 取用。
- 型別宣告於 `src/vite-env.d.ts` 的 `ImportMetaEnv` 介面，新增變數時一併補上以獲得型別提示。
- 範本見 `.env.example`；真正的 `.env` 不進版控。
