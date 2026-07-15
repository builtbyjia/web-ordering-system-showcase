import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { env } from '../config/env'

// 建立 axios 實例：統一設定 baseURL、逾時與預設標頭。
// baseURL 統一經 src/config/env.ts 讀取（VITE_API_BASE_URL，見 .env.example），
// 未設定時退回 JSONPlaceholder，讓範例開箱即可運作。
const client = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器：送出前統一處理。範例為自動附帶登入 token。
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// 回應攔截器：成功時直接回傳 data（呼叫端拿到的就是資料本體）；
// 失敗時集中處理錯誤，可在此接上全域提示或登出導向。
// 註：因這裡把回傳值換成 data，service 層呼叫時請以第二個泛型參數標註實際資料型別。
client.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || '發生未知錯誤'
    console.error('[API 錯誤]', message)
    return Promise.reject(error)
  },
)

export default client
