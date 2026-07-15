import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { findOrder, recentOrders, STATUS_LABEL } from '../data/orders'

// ============================================================
// 訂單查詢（wireframe 1-7，US-05）
// 本機最近訂單快捷卡 + 編號/手機查詢；查無顯示統一錯誤（不透露何者錯）。
// ============================================================

function LookupPage() {
  const navigate = useNavigate()
  const [recent] = useState(() => recentOrders(3))
  const [no, setNo] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(false)

  function handleQuery() {
    const found = findOrder(no, phone)
    if (found) {
      navigate(`/orders/${found.id}`)
    } else {
      setError(true)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }} className="px-3">
      {/* 標題列 */}
      <header className="d-flex align-items-center gap-2 py-3">
        <Link to="/" className="btn btn-sm btn-link text-decoration-none p-0" style={{ color: 'var(--mw-cocoa)' }}>
          ← 回菜單
        </Link>
        <h1 className="h5 fw-bold mb-0 ms-1">查詢訂單</h1>
      </header>

      {/* 本機最近訂單快捷 */}
      {recent.length > 0 && (
        <div className="mb-4">
          <div className="small text-secondary mb-2">這個裝置最近的訂單</div>
          <div className="d-flex flex-column gap-2">
            {recent.map((o) => (
              <button
                key={o.id}
                type="button"
                className="card border-0 p-3 text-start"
                onClick={() => navigate(`/orders/${o.id}`)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">
                    #{o.pickupNo}・{o.pickupDate} {o.pickupTime}
                  </span>
                  <span className="small" style={{ color: 'var(--mw-clay-deep)' }}>
                    ${o.totalPrice}・{STATUS_LABEL[o.status]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 查詢表單 */}
      <div className="mb-3">
        <label className="fw-bold d-block mb-2">取餐編號</label>
        <input
          type="text"
          inputMode="numeric"
          className="form-control form-control-lg"
          value={no}
          onChange={(e) => {
            setNo(e.target.value)
            setError(false)
          }}
          placeholder="例如 12"
        />
      </div>
      <div className="mb-4">
        <label className="fw-bold d-block mb-2">手機號碼</label>
        <input
          type="tel"
          inputMode="numeric"
          className="form-control form-control-lg"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setError(false)
          }}
          placeholder="09xxxxxxxx"
        />
      </div>

      <button type="button" className="btn btn-primary w-100 py-3 fw-bold" onClick={handleQuery}>
        查詢
      </button>
      {error && (
        <div className="small mt-2 text-center" style={{ color: 'var(--bs-danger)' }}>
          ⚠ 查無此訂單，請確認編號與手機
        </div>
      )}
    </div>
  )
}

export default LookupPage
