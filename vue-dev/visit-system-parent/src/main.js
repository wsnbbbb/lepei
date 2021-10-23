// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './config/rem'
// import 'babel-polyfill'

import {Alert, Confirm, Toast} from 'wc-messagebox'
import 'wc-messagebox/style.css'
import VueScroller from 'vue-scroller'
import datePicker from 'multifunctional-datepicker'
import wcView from 'wc-view';
import 'wc-view/style.css';

Vue.prototype.$datepicker = datePicker

Vue.use(Alert, {})
Vue.use(Confirm, {})
Vue.use(Toast, {})
Vue.use(VueScroller)
Vue.use(wcView);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


