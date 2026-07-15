import { Link } from 'react-router-dom'

// 404 頁（wireframe 1-11）：空狀態 + 回菜單首頁。
function NotFoundPage() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }} className="text-center px-4">
      <div style={{ fontSize: '4rem' }} className="mt-5 mb-2">
        🥚
      </div>
      <p className="fw-bold mb-1">找不到這個頁面</p>
      <p className="small text-secondary mb-4">這裡沒有雞蛋糕，回菜單挑點好吃的吧！</p>
      <Link to="/" className="btn btn-primary">
        回菜單首頁
      </Link>
    </div>
  )
}

export default NotFoundPage
