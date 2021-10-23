import axios from 'axios'
import { Message, Loading } from 'element-ui'
import { getToken } from '@/utils/auth'
import { base } from '@/config'
import vueThis from '../main'
let loading

const startLoading = () => { // 使用Element loading-start 方法
  loading = Loading.service({
    target: '.app-wrapper',
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.1)'
  })
}
const endLoading = () => { // 使用Element loading-close 方法
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
// 创建axios实例对象
const request = axios.create({
  baseURL: base,
  timeout: 30000 // request timeout
})
console.log('token', getToken())
// 定义header的一些默认参数
request.defaults.headers.common['Token'] = getToken() ? getToken() : ''
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 请求前
    if (getToken()) {
      config.headers['Token'] = getToken()
    }
    showFullScreenLoading()
    return config
  },
  error => {
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    const res = response.data
    if (res.code === 10007) { // 没有token或者token错误
      const currentUrl = window.location.href
      vueThis.$message.error('很抱歉！您没有访问权限！')
      const a = currentUrl.indexOf('#')
      const url = currentUrl.substring(0, a) + '#/welcome'
      window.location.href = res.data.redirectUrl + '?redirect_url=' + encodeURIComponent(url)
    } else if (res.code !== 10000) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return res
    } else {
      return res
    }
  },
  error => {
    tryHideFullScreenLoading()
    if (error.response && error.response.data.code === 10004) {
      Message({
        message: error.response.data.msg,
        type: 'error'
      })
    } else {
      Message({
        message: '网络不给力',
        type: 'error'
      })
    }
    return Promise.reject(error)
  }
)

export default request
