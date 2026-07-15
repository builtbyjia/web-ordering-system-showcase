import type { MenuItem } from '../data/menu'

// ============================================================
// 商品縮圖 placeholder：暖色漸層底 + 品項 emoji。
// ------------------------------------------------------------
// 目前為佔位圖，維持暖光調性；日後有真實去背商品照時，
// 把內部改為 <img src={item.photo} alt={item.name} /> 即可，帶入感最強。
// ============================================================

interface ProductThumbProps {
  item: MenuItem
  size?: number
}

function ProductThumb({ item, size = 76 }: ProductThumbProps) {
  return (
    <div
      className="d-flex align-items-center justify-content-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: '1.1rem',
        background: 'radial-gradient(120% 120% at 30% 20%, #fbe6c8, #f3c98f)',
        boxShadow: 'inset 0 0 0 1px rgba(184,67,15,0.08)',
        fontSize: size * 0.42,
        lineHeight: 1,
      }}
      aria-hidden
    >
      <span>{item.emoji}</span>
    </div>
  )
}

export default ProductThumb
