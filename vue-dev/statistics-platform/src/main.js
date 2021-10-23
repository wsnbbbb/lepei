import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import store from './vuex/store'
import Vuex from 'vuex'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import VCharts from 'v-charts'

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VCharts)

const rootVueObj = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default rootVueObj;

