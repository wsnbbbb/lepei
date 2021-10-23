// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './config/rem'

import {Alert, Confirm, Toast} from 'wc-messagebox'
import 'wc-messagebox/style.css'
import VueScroller from 'vue-scroller'

//highcharts的引入
import VueHighcharts from 'vue-highcharts';
// import Vue from 'vue'
import { Button, Cell,Picker  } from 'mint-ui'
// import App from './App.vue'

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Picker.name, Picker);

Vue.use(VueHighcharts);
Vue.config.productionTip = false

Vue.use(Alert, {})
Vue.use(Confirm, {})
Vue.use(Toast, {})
Vue.use(VueScroller)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


