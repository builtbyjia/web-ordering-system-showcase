import { useEffect, type ReactNode } from 'react'

// ============================================================
// 共用底部滑出面板（bottom sheet / offcanvas）
// ------------------------------------------------------------
// 由下滑出、背景變暗，點背景、關閉鈕或 Esc 收起。
// 品項選擇 sheet 與購物車抽屜（案 B）共用此元件。
// ============================================================

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  maxHeightVh?: number
}

function BottomSheet({ open, onClose, title, children, footer, maxHeightVh = 88 }: BottomSheetProps) {
  // 開啟時鎖背景捲動；Esc 關閉
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <>
      {/* 背景遮罩 */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(31,27,17,0.42)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 240ms ease',
          zIndex: 1050,
        }}
      />
      {/* 面板 */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          maxWidth: 480,
          maxHeight: `${maxHeightVh}vh`,
          background: 'var(--mw-cream)',
          borderTopLeftRadius: '1.75rem',
          borderTopRightRadius: '1.75rem',
          boxShadow: '0 -18px 48px -24px rgba(31,27,17,0.5)',
          transform: open ? 'translateY(0)' : 'translateY(101%)',
          transition: 'transform 280ms cubic-bezier(0.2,0.7,0.3,1)',
          zIndex: 1055,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 拖曳把手 */}
        <div className="d-flex justify-content-center pt-2 pb-1">
          <span style={{ width: 40, height: 5, borderRadius: 99, background: 'rgba(88,66,58,0.28)' }} />
        </div>

        {/* 標題列 */}
        {title && (
          <div className="d-flex align-items-center justify-content-between px-4 pt-1 pb-2">
            <div className="fw-bold h5 mb-0">{title}</div>
            <button
              type="button"
              className="btn btn-sm btn-link text-secondary p-0 text-decoration-none"
              onClick={onClose}
              aria-label="關閉"
            >
              ✕
            </button>
          </div>
        )}

        {/* 內容（可捲動） */}
        <div className="px-4 pb-2" style={{ overflowY: 'auto' }}>
          {children}
        </div>

        {/* 底部固定區（如加入購物車鈕） */}
        {footer && <div className="px-4 pt-2 pb-4">{footer}</div>}
      </div>
    </>
  )
}

export default BottomSheet
