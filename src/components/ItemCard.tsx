import type { MenuItem } from '../data/menu'
import ProductThumb from './ProductThumb'

// ============================================================
// 品項卡（wireframe 1-1）：縮圖 + 名稱/描述/份量/價格 + 加入圓鈕。
// 點「＋」交由父層決定開品項選擇 sheet 或直接加入。
// disabled：暫停接單時反灰、不可加入。
// ============================================================

interface ItemCardProps {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  disabled?: boolean
}

function ItemCard({ item, onAdd, disabled = false }: ItemCardProps) {
  return (
    <div className="card h-100 p-3" style={disabled ? { opacity: 0.55 } : undefined}>
      <div className="d-flex align-items-center gap-3">
        <ProductThumb item={item} />

        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h3 className="h6 mb-0 fw-bold">{item.name}</h3>
            {item.tag && (
              <span
                className="badge rounded-pill"
                style={{ background: 'var(--mw-honey)', color: 'var(--mw-clay-deep)' }}
              >
                {item.tag}
              </span>
            )}
          </div>

          {item.desc && (
            <p className="small mb-1" style={{ color: 'var(--mw-cocoa-soft)' }}>
              {item.desc}
            </p>
          )}

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="fw-bold" style={{ color: 'var(--mw-clay-deep)' }}>
              ${item.price}
            </span>
            <span className="small text-secondary">1 份 {item.pieces} 個</span>
            {item.requiresSkin && (
              <span className="small" style={{ color: 'var(--mw-caramel)' }}>
                ・須選外皮
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary rounded-circle p-0 flex-shrink-0 d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44 }}
          aria-label={`加入 ${item.name}`}
          disabled={disabled}
          onClick={() => onAdd(item)}
        >
          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>＋</span>
        </button>
      </div>
    </div>
  )
}

export default ItemCard
