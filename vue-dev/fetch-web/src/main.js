// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './config/rem'

import {Alert, Confirm, Toast} from 'wc-messagebox'
import 'wc-messagebox/style.css'

Vue.use(Alert, {})
Vue.use(Confirm, {})
Vue.use(Toast, {})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


