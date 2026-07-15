import { useCart } from '../context/CartContext'
import BottomSheet from './BottomSheet'

// ============================================================
// 購物車抽屜（wireframe 1-4，案 B offcanvas）
// ------------------------------------------------------------
// 由菜單頁 sticky 底欄開啟，不離開菜單即可檢視/調整購物車。
// 同品項不同外皮為不同列；可加減、刪除；底部「填寫取餐資訊」。
// ============================================================

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  onCheckout: () => void
  checkoutLabel?: string // 下單模式「填寫取餐資訊」／預約模式可調整
}

function CartDrawer({ open, onClose, onCheckout, checkoutLabel = '填寫取餐資訊' }: CartDrawerProps) {
  const { lines, totalCount, totalPrice, setQty, removeLine } = useCart()

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={`購物車（${totalCount} 件）`}
      footer={
        lines.length > 0 && (
          <button
            type="button"
            className="btn btn-primary w-100 py-3 fw-bold"
            style={{ boxShadow: 'var(--mw-shadow-glow)' }}
            onClick={onCheckout}
          >
            {checkoutLabel} →
          </button>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="text-center py-5" style={{ color: 'var(--mw-cocoa-soft)' }}>
          購物車是空的
          <br />
          回菜單挑點好吃的吧！
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 py-2">
          {lines.map((line) => (
            <div key={line.key} className="d-flex align-items-center gap-2 pb-3 border-bottom">
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="fw-bold">
                  {line.name}
                  {line.skin && <span className="small text-secondary">・{line.skin}皮</span>}
                </div>
                <div className="small fw-bold" style={{ color: 'var(--mw-clay-deep)' }}>
                  ${line.price}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34 }}
                  onClick={() => setQty(line.key, line.qty - 1)}
                  aria-label="減少份數"
                >
                  －
                </button>
                <span className="fw-bold" style={{ minWidth: 20, textAlign: 'center' }}>
                  {line.qty}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34 }}
                  onClick={() => setQty(line.key, line.qty + 1)}
                  aria-label="增加份數"
                >
                  ＋
                </button>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-link text-secondary p-0 ms-1 text-decoration-none"
                onClick={() => removeLine(line.key)}
              >
                刪除
              </button>
            </div>
          ))}

          <div className="d-flex justify-content-between fw-bold pt-1">
            <span>小計 {totalCount} 件</span>
            <span style={{ color: 'var(--mw-clay-deep)' }}>${totalPrice}</span>
          </div>
        </div>
      )}
    </BottomSheet>
  )
}

export default CartDrawer
