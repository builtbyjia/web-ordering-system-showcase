import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useShopMode } from '../hooks/useShopMode'
import {
  createOrder,
  dateOptions,
  timeSlots,
  isValidTwPhone,
  PREP_MINUTES,
} from '../data/orders'

// ============================================================
// 取餐資訊 checkout（wireframe 1-5，US-03）
// 訂單摘要收合、取餐日期/時段 chips、姓名/手機、到攤付款、送出。
// ============================================================

function CheckoutPage() {
  const navigate = useNavigate()
  const { mode } = useShopMode()
  const isReserve = mode === 'reserve'
  const { lines, totalCount, totalPrice, clear } = useCart()

  // 預約模式：「今天」反灰（僅能預約未來），預設選明天
  const dates = useMemo(
    () => dateOptions(3).map((d, i) => (i === 0 && isReserve ? { ...d, closed: true } : d)),
    [isReserve],
  )
  const [date, setDate] = useState(isReserve ? dates[1].value : dates[0].value)
  const slots = useMemo(() => timeSlots(date), [date])
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const phoneValid = isValidTwPhone(phone)
  const firstAvailable = slots.find((s) => !s.disabled)?.value
  const hasBlockedSlots = slots.some((s) => s.disabled)
  const canSubmit = lines.length > 0 && time !== '' && name.trim() !== '' && phoneValid

  // 換日期：清掉已選時段（可能失效）
  function pickDate(value: string) {
    setDate(value)
    setTime('')
  }

  function handleSubmit() {
    setSubmitted(true)
    if (!canSubmit) return
    const order = createOrder({
      lines,
      totalCount,
      totalPrice,
      name: name.trim(),
      phone: phone.trim(),
      pickupDate: date,
      pickupTime: time,
      mode: isReserve ? 'reserve' : 'order',
    })
    clear()
    navigate(`/orders/${order.id}`)
  }

  // 空購物車直接進來 → 導回菜單
  if (lines.length === 0 && !submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto' }} className="text-center px-4">
        <p className="text-secondary mt-5">購物車是空的</p>
        <Link to="/" className="btn btn-primary">
          回菜單
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', paddingBottom: 110 }}>
      {/* 標題列 */}
      <header
        className="sticky-top d-flex align-items-center gap-2 px-3 py-3"
        style={{ background: 'var(--mw-cream)', zIndex: 1020, boxShadow: 'var(--mw-shadow-soft)' }}
      >
        <button
          type="button"
          className="btn btn-sm btn-link text-decoration-none p-0"
          style={{ color: 'var(--mw-cocoa)' }}
          onClick={() => navigate(-1)}
        >
          ← 返回
        </button>
        <h1 className="h5 fw-bold mb-0 ms-1">填寫{isReserve ? '預約' : '取餐'}資訊</h1>
      </header>

      <div className="px-3 pt-3">
        {/* 訂單摘要（收合） */}
        <button
          type="button"
          className="card w-100 text-start p-3 mb-4 border-0"
          onClick={() => setSummaryOpen((v) => !v)}
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">
              訂單摘要 {totalCount} 件・${totalPrice}
            </span>
            <span className="small text-secondary">{summaryOpen ? '收合 ▲' : '展開 ▼'}</span>
          </div>
          {summaryOpen && (
            <div className="mt-2 pt-2 border-top">
              {lines.map((l) => (
                <div key={l.key} className="d-flex justify-content-between small py-1">
                  <span>
                    {l.name}
                    {l.skin && `・${l.skin}皮`} ×{l.qty}
                  </span>
                  <span>${l.price * l.qty}</span>
                </div>
              ))}
            </div>
          )}
        </button>

        {/* 取餐日期 */}
        <div className="mb-4">
          <label className="fw-bold d-block mb-2">取餐日期</label>
          <div className="d-flex gap-2 flex-wrap">
            {dates.map((d) => (
              <button
                key={d.value}
                type="button"
                disabled={d.closed}
                className={`btn rounded-pill ${date === d.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => pickDate(d.value)}
              >
                {d.label}
                {d.closed && ' 公休'}
              </button>
            ))}
          </div>
        </div>

        {/* 取餐時段 */}
        <div className="mb-4">
          <label className="fw-bold d-block mb-2">取餐時段</label>
          <div className="d-flex gap-2 flex-wrap">
            {slots.map((s) => (
              <button
                key={s.value}
                type="button"
                disabled={s.disabled}
                className={`btn btn-sm rounded-pill ${time === s.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={s.disabled ? { opacity: 0.4 } : undefined}
                onClick={() => setTime(s.value)}
              >
                {s.value}
              </button>
            ))}
          </div>
          {hasBlockedSlots && firstAvailable && (
            <div className="small mt-2" style={{ color: 'var(--bs-danger)' }}>
              ⚠ 現做需 {PREP_MINUTES} 分鐘準備，最早可選 {firstAvailable} 之後的時段
            </div>
          )}
          {!firstAvailable && (
            <div className="small mt-2" style={{ color: 'var(--bs-danger)' }}>
              ⚠ 今日已無可取餐時段，請改選其他日期
            </div>
          )}
        </div>

        {/* 姓名 */}
        <div className="mb-3">
          <label className="fw-bold d-block mb-2">姓名／暱稱</label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="現場報名字用"
          />
        </div>

        {/* 手機 */}
        <div className="mb-4">
          <label className="fw-bold d-block mb-2">手機號碼</label>
          <input
            type="tel"
            inputMode="numeric"
            className="form-control form-control-lg"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxx"
          />
          {phone !== '' && !phoneValid && (
            <div className="small mt-2" style={{ color: 'var(--bs-danger)' }}>
              ⚠ 請輸入台灣手機格式 09xxxxxxxx
            </div>
          )}
        </div>

        {/* 付款方式 */}
        <div className="card border-0 p-3 mb-4">
          <span>💵 到攤取餐付款（現金／行動支付）</span>
        </div>

        {/* 送出 */}
        <button
          type="button"
          className={`btn w-100 py-3 fw-bold ${canSubmit ? 'btn-primary' : 'btn-secondary'}`}
          style={canSubmit ? { boxShadow: 'var(--mw-shadow-glow)' } : { opacity: 0.55 }}
          onClick={handleSubmit}
        >
          送出{isReserve ? '預約' : '訂單'}・${totalPrice}
        </button>
        {submitted && !canSubmit && (
          <div className="small mt-2 text-center" style={{ color: 'var(--bs-danger)' }}>
            請完成上方必填項目再送出
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
