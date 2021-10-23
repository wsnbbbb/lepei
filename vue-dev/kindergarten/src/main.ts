import Vue from 'vue';
import Component from "vue-class-component";
import App from './App.vue';
import router from './router/index';
import store from "./store";
import service from "./utils/https";
import urls from "./utils/urls";
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.config.productionTip = false;
import { Button, NavBar, Cell, Col, Row, Icon,  } from "vant";
Vue.use(Viewer)
Vue.use(Button);
Vue.use(NavBar);
Vue.use(Cell);
Vue.use(Col);
Vue.use(Row);
Vue.use(Icon);
Vue.config.productionTip = false;
Vue.prototype.$https = service; // 其他页面在使用 axios 的时候直接  this.$http 就可以了
Vue.prototype.$urls = urls; // 其他页面在使用 URLS 的时候直接  this.$urls 就可以了

Viewer.setDefaults({
  'inline':false,
  'button':true, //右上角按钮
  "navbar": false, //底部缩略图
  "title": false, //当前图片标题
  "toolbar": false, //底部工具栏
  "tooltip": true, //显示缩放百分比
  "movable": true, //是否可以移动
  "zoomable": true, //是否可以缩放
  "rotatable": true, //是否可旋转
  "scalable": true, //是否可翻转
  "transition": true, //使用 CSS3 过度
  "fullscreen": true, //播放时是否全屏
  "keyboard": false, //是否支持键盘
  "url": "data-source",
});

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
