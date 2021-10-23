import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 引入七牛云前缀  使用方法imgBase(xxx.png)
import imgBase from '@/utils/imgBase'
Vue.use(imgBase)

import '@/icons' // 侧边导航栏的小图标
import '@/permission' // 权限文件（控制页面的权限）
Vue.use(ElementUI)

Vue.config.productionTip = false

const vueThis = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
export default vueThis
