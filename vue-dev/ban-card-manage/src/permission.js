import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getQueryString } from '@/utils/commonUtils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// router.beforeEach((to, from, next) => {
// start progress bar
// NProgress.start()
// 设置页面标题
// document.title = getPageTitle(to.meta.title)
// 确认token
// const hasToken = getQueryString('verify') || getToken()
// const hasToken = 'b3380aa726328b4f8ff3b171469e7dfa'
// if (!hasToken) {
//   window.location.href = 'http://zhxytest1.winshareyun.cn/#/thirdLogin?redirect_url=http://172.16.7.67/index.html#/welcome'
// } else {
//   next()
//   NProgress.done()
// }
// if (to.name !== '404' && !hasToken) {
//   NProgress.done()
//   next({ path: '/404' })
// } else {
//   next()
//   NProgress.done()
// }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
