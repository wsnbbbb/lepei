import Vue from 'vue'
import Vant from 'vant';
import vueEsign from 'vue-esign';
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import md5 from 'js-md5';
import { Lazyload } from 'vant';

Vue.config.productionTip = false
Vue.prototype.$md5 = md5;
Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(vueEsign);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
