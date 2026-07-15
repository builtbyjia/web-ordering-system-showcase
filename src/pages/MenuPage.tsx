import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  categories,
  itemsByCategory,
  ALLERGENS,
  SHOP_INFO,
  type CategoryId,
  type MenuItem,
} from '../data/menu'
import { useShopMode } from '../hooks/useShopMode'
import ItemCard from '../components/ItemCard'
import ItemSheet from '../components/ItemSheet'
import CartBar from '../components/CartBar'
import CartDrawer from '../components/CartDrawer'

// ============================================================
// 菜單首頁（wireframe 1-1／1-2／1-3，US-01／US-08）
// 三種營業狀態：下單（order）／預約（reserve，非營業時間）／暫停接單（paused）。
// sticky 頂部：品牌列 + 狀態 banner + 過敏原 + 分類 tab。
// ============================================================

function MenuPage() {
  const navigate = useNavigate()
  const { mode, paused } = useShopMode()
  const isReserve = mode === 'reserve'

  const [activeItem, setActiveItem] = useState<MenuItem | null>(null)
  const [activeTab, setActiveTab] = useState<CategoryId>(categories[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  // 預約模式進站彈一次性提示
  const [showReserveModal, setShowReserveModal] = useState(isReserve && !paused)

  const ctaLabel = isReserve ? '預約' : '加入購物車'

  // 點分類 tab：捲動到對應區塊
  function goCategory(id: CategoryId) {
    setActiveTab(id)
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // 點加入：暫停接單時不開 sheet
  function handleAdd(item: MenuItem) {
    if (paused) return
    setActiveItem(item)
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      {/* sticky 頂部：品牌 + 狀態 banner + 過敏原 + 分類 tab */}
      <div
        className="sticky-top"
        style={{ background: 'var(--mw-cream)', zIndex: 1020, boxShadow: 'var(--mw-shadow-soft)' }}
      >
        <header className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2">
          <Link to="/" className="text-decoration-none">
            <span className="fw-bold" style={{ fontSize: '1.25rem' }}>
              <span style={{ color: 'var(--mw-clay)' }}>My Way</span>{' '}
              <span style={{ color: 'var(--mw-cocoa)' }}>燒雞蛋糕</span>
            </span>
          </Link>
          <Link to="/lookup" className="btn btn-sm btn-outline-secondary rounded-pill">
            查訂單
          </Link>
        </header>

        {/* 狀態 banner */}
        {paused && (
          <div className="px-3 py-2 fw-bold" style={{ background: '#fdecec', color: 'var(--bs-danger)' }}>
            ⏸ 暫停接單中，請稍後再來
          </div>
        )}
        {isReserve && !paused && (
          <div className="px-3 py-2 fw-semibold" style={{ background: '#edeefb', color: '#3f3d78' }}>
            🌙 預約模式・非營業時間（今日營業 {SHOP_INFO.hours}）
          </div>
        )}

        {/* 過敏原（常駐） */}
        <div className="px-3 py-2">
          <span className="small" style={{ color: 'var(--mw-cocoa-soft)' }}>
            ⓘ {ALLERGENS}
          </span>
        </div>

        {/* 分類 tab */}
        <nav className="d-flex gap-2 px-3 pb-2" style={{ overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm rounded-pill flex-shrink-0 ${
                activeTab === cat.id ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => goCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 各分類 section */}
      <main style={{ paddingBottom: paused ? 24 : 110 }}>
        {categories.map((cat) => (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className="px-3 pt-4"
            style={{ scrollMarginTop: 190 }}
          >
            <h2 className="h5 fw-bold d-flex align-items-center gap-2 mb-3">
              <span
                style={{
                  width: 5,
                  height: 20,
                  background: 'var(--mw-clay)',
                  borderRadius: 99,
                  display: 'inline-block',
                }}
              />
              {cat.name}
              <small className="text-secondary fw-normal" style={{ fontSize: '0.8rem' }}>
                （{cat.note}）
              </small>
            </h2>

            <div className="d-flex flex-column gap-3">
              {itemsByCategory(cat.id).map((item) => (
                <ItemCard key={item.id} item={item} onAdd={handleAdd} disabled={paused} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* 品項選擇 sheet */}
      <ItemSheet item={activeItem} onClose={() => setActiveItem(null)} ctaLabel={ctaLabel} />

      {/* sticky 購物車底欄（暫停接單時隱藏） */}
      {!paused && <CartBar onOpen={() => setCartOpen(true)} />}

      {/* 購物車抽屜（案 B offcanvas） */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        checkoutLabel={isReserve ? '填寫預約資訊' : '填寫取餐資訊'}
        onCheckout={() => {
          setCartOpen(false)
          navigate(isReserve ? '/checkout?mode=reserve' : '/checkout')
        }}
      />

      {/* 預約模式進站一次性提示 */}
      {showReserveModal && (
        <>
          <div
            onClick={() => setShowReserveModal(false)}
            aria-hidden
            style={{ position: 'fixed', inset: 0, background: 'rgba(31,27,17,0.42)', zIndex: 1060 }}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="card border-0 p-4 text-center"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(90vw, 360px)',
              zIndex: 1061,
              boxShadow: 'var(--mw-shadow-glow)',
            }}
          >
            <div style={{ fontSize: '2.5rem' }}>🌙</div>
            <h2 className="h5 fw-bold mt-2 mb-1">目前非營業時間</h2>
            <p className="mb-1">今日營業 {SHOP_INFO.hours}</p>
            <p className="small text-secondary mb-4">您可以「預約」未來時段取餐</p>
            <button
              type="button"
              className="btn btn-primary w-100 py-2 fw-bold"
              onClick={() => setShowReserveModal(false)}
            >
              我知道了，開始預約
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MenuPage
