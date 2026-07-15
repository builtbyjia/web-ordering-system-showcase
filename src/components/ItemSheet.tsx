import { useState } from 'react'
import type { MenuItem, SkinFlavor } from '../data/menu'
import { SKIN_FLAVORS } from '../data/menu'
import { useCart } from '../context/CartContext'
import BottomSheet from './BottomSheet'
import ProductThumb from './ProductThumb'

// ============================================================
// 品項選擇 bottom sheet（wireframe 1-1 附屬）
// ------------------------------------------------------------
// US-02 外皮必選阻擋發生處：須選外皮而未選時，按鈕反灰＋提示。
// 風味蛋糕（不須外皮）不顯示外皮區塊，直接選份數。
// ============================================================

interface ItemSheetProps {
  item: MenuItem | null
  onClose: () => void
  ctaLabel?: string // 下單模式「加入購物車」／預約模式「預約」
}

function ItemSheet({ item, onClose, ctaLabel = '加入購物車' }: ItemSheetProps) {
  const { addLine } = useCart()
  const [skin, setSkin] = useState<SkinFlavor | null>(null)
  const [qty, setQty] = useState(1)
  const [showSkinWarn, setShowSkinWarn] = useState(false)

  // 換品項時重置選擇：於 render 期間偵測 item 變化（React 官方建議，
  // 避免在 effect 內同步 setState 造成連鎖重繪）。
  const [prevItemId, setPrevItemId] = useState(item?.id)
  if (item?.id !== prevItemId) {
    setPrevItemId(item?.id)
    setSkin(null)
    setQty(1)
    setShowSkinWarn(false)
  }

  const needSkin = item?.requiresSkin ?? false
  const canAdd = !needSkin || skin !== null
  const subtotal = item ? item.price * qty : 0

  function handleAdd() {
    if (!item) return
    if (needSkin && skin === null) {
      setShowSkinWarn(true)
      return
    }
    addLine(item, skin, qty)
    onClose()
  }

  return (
    <BottomSheet
      open={item !== null}
      onClose={onClose}
      footer={
        item && (
          <button
            type="button"
            className={`btn w-100 py-3 fw-bold ${canAdd ? 'btn-primary' : 'btn-secondary'}`}
            style={canAdd ? { boxShadow: 'var(--mw-shadow-glow)' } : { opacity: 0.55 }}
            onClick={handleAdd}
          >
            {ctaLabel}・${subtotal}
          </button>
        )
      }
    >
      {item && (
        <>
          <div className="d-flex align-items-center gap-3 mb-3">
            <ProductThumb item={item} size={88} />
            <div>
              <h2 className="h4 mb-1 fw-bold">{item.name}</h2>
              <div className="small text-secondary">
                1 份 {item.pieces} 個・${item.price}
              </div>
              {item.desc && (
                <div className="small" style={{ color: 'var(--mw-cocoa-soft)' }}>
                  {item.desc}
                </div>
              )}
            </div>
          </div>

          {needSkin && (
            <div className="mb-3">
              <div className="fw-bold mb-2">
                外皮<span className="small text-secondary">（必選）</span>
              </div>
              <div className="d-flex gap-2">
                {SKIN_FLAVORS.map((f) => {
                  const active = skin === f
                  return (
                    <button
                      key={f}
                      type="button"
                      className={`btn flex-fill py-2 ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        setSkin(f)
                        setShowSkinWarn(false)
                      }}
                    >
                      {f}
                    </button>
                  )
                })}
              </div>
              {showSkinWarn && (
                <div className="small mt-2 fw-semibold" style={{ color: 'var(--bs-danger)' }}>
                  ⚠ 請先選擇外皮
                </div>
              )}
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="fw-bold">份數</div>
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="減少份數"
              >
                －
              </button>
              <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center' }}>
                {qty}
              </span>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
                onClick={() => setQty((q) => q + 1)}
                aria-label="增加份數"
              >
                ＋
              </button>
            </div>
          </div>
        </>
      )}
    </BottomSheet>
  )
}

export default ItemSheet
