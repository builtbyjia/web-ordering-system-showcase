import { NavLink, Link } from 'react-router-dom'

// 導覽列：使用 Bootstrap navbar，在窄畫面（手機）自動收合為漢堡選單。
// 收合互動依賴 main.tsx 載入的 bootstrap.bundle.min.js。
function Navbar() {
  return (
    <nav className="navbar navbar-expand-md sticky-top bg-light border-bottom">
      <div className="container">
        {/* 品牌名稱：套用標題字型 */}
        <Link className="navbar-brand fw-bold" to="/" style={{ fontFamily: "'Fraunces', serif" }}>
          切版<span className="text-primary">.</span>模板
        </Link>

        {/* 漢堡按鈕：手機畫面點擊展開／收合選單 */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="切換導覽選單"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 導覽連結：NavLink 會自動為當前頁加上 active 樣式 */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                首頁
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                關於
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
