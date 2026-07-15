import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrder, STATUS_LABEL, type OrderStatus } from '../data/orders'
import { SHOP_INFO } from '../data/menu'

// ============================================================
// 訂單確認・狀態頁（wireframe 1-6，US-04／US-05）
// 取餐編號大字、狀態進度條、明細、地圖、到攤報號取餐。
// ============================================================

const STEPS: OrderStatus[] = ['pending', 'accepted', 'ready', 'done']

function OrderPage() {
  const { id } = useParams()
  const order = id ? getOrder(id) : undefined
  const [copied, setCopied] = useState(false)

  if (!order) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto' }} className="text-center px-4">
        <p className="text-secondary mt-5">找不到這筆訂單</p>
        <Link to="/" className="btn btn-primary">
          回菜單
        </Link>
      </div>
    )
  }

  const stepIndex = STEPS.indexOf(order.status)
  const canceled = order.status === 'canceled'
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_INFO.address)}`

  function copyNo() {
    if (!order) return
    navigator.clipboard?.writeText(order.pickupNo).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      },
      () => {
        /* 忽略複製失敗 */
      },
    )
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', paddingBottom: 40 }} className="px-3">
      {/* 慶祝態 + 取餐編號 */}
      <div className="text-center pt-4">
        <div className="fw-bold" style={{ color: 'var(--mw-matcha)', fontSize: '1.1rem' }}>
          ✓ 訂單成立！
        </div>
        <div className="small text-secondary mt-3">取餐編號</div>
        <div
          className="fw-bold"
          style={{ fontSize: '3.6rem', color: 'var(--mw-clay-deep)', lineHeight: 1.1 }}
        >
          # {order.pickupNo}
        </div>
        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={copyNo}>
          {copied ? '已複製 ✓' : '複製'}
        </button>
      </div>

      {/* 狀態進度條 */}
      {canceled ? (
        <div
          className="card border-0 text-center py-3 my-4"
          style={{ background: '#fdecec', color: 'var(--bs-danger)' }}
        >
          <span className="fw-bold">此訂單已取消</span>
        </div>
      ) : (
        <div className="d-flex justify-content-between my-4">
          {STEPS.map((s, i) => (
            <div key={s} className="text-center" style={{ flex: 1 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 99,
                  margin: '0 auto',
                  background: i <= stepIndex ? 'var(--mw-clay)' : 'var(--mw-sand)',
                }}
              />
              <div
                className="mt-1"
                style={{
                  fontSize: '0.75rem',
                  color: i <= stepIndex ? 'var(--mw-clay-deep)' : 'var(--mw-cocoa-soft)',
                  fontWeight: i === stepIndex ? 700 : 400,
                }}
              >
                {STATUS_LABEL[s]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 取餐時間 */}
      <div className="card border-0 p-3 mb-3">
        <span>
          ⏰ {order.pickupDate} {order.pickupTime} 取餐
        </span>
      </div>

      {/* 明細 */}
      <div className="card border-0 p-3 mb-3">
        <div className="fw-bold mb-2">訂單明細</div>
        {order.lines.map((l) => (
          <div key={l.key} className="d-flex justify-content-between py-1">
            <span>
              {l.name}
              {l.skin && `・${l.skin}皮`} ×{l.qty}
            </span>
            <span>${l.price * l.qty}</span>
          </div>
        ))}
        <div className="d-flex justify-content-between fw-bold pt-2 mt-1 border-top">
          <span>合計 {order.totalCount} 件</span>
          <span style={{ color: 'var(--mw-clay-deep)' }}>${order.totalPrice}</span>
        </div>
      </div>

      {/* 地點 + 付款 */}
      <div className="card border-0 p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>📍 {SHOP_INFO.address}</span>
          <a href={mapUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary rounded-pill">
            開地圖
          </a>
        </div>
        <span className="small" style={{ color: 'var(--mw-cocoa-soft)' }}>
          💵 到攤報「取餐編號」取餐付款
        </span>
      </div>

      <Link to="/" className="btn btn-primary w-100 py-3 fw-bold">
        回菜單
      </Link>
    </div>
  )
}

export default OrderPage
