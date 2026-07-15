import { useCart } from '../context/CartContext'

// ============================================================
// Sticky 購物車底欄（wireframe 1-1）：購物車有內容才出現。
// 顯示件數與金額，點擊開啟購物車抽屜（案 B offcanvas）。
// ============================================================

interface CartBarProps {
  onOpen: () => void
  label?: string
}

function CartBar({ onOpen, label = '查看購物車' }: CartBarProps) {
  const { totalCount, totalPrice } = useCart()
  if (totalCount === 0) return null

  return (
    <div className="position-fixed bottom-0 start-0 end-0 p-3" style={{ zIndex: 1030 }}>
      <div className="container px-0" style={{ maxWidth: 480 }}>
        <button
          type="button"
          onClick={onOpen}
          className="btn btn-primary w-100 d-flex align-items-center justify-content-between px-4 py-3"
          style={{ boxShadow: 'var(--mw-shadow-glow)' }}
        >
          <span className="fw-bold">🛒 {totalCount} 件・${totalPrice}</span>
          <span className="fw-bold">{label} →</span>
        </button>
      </div>
    </div>
  )
}

export default CartBar
