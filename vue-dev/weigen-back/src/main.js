import babelpolyfill from 'babel-polyfill'
// import Vue from 'vue'
import App from './App'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
// import VueRouter from 'vue-router'
import store from './vuex/store'
// import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
// import routes from './routes/routes.js'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import router from './routes/index.js'

import { weigenRoutes, duFaceRoutes, bluetoothLocationRoutes } from './routes/routes.js'

// Vue.use(ElementUI)
// Vue.use(VueRouter)
// Vue.use(Vuex)


//NProgress.configure({ showSpinner: false });

// const router = new VueRouter({
//   routes
// })

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  // let user = JSON.parse(sessionStorage.getItem('user'));
  let token = sessionStorage.getItem('token');
  // let token = sessionStorage.getItem('token');
  if (!token && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }

  let includeRoute = [];//需要缓存的组件
  let excludeRoute = [];//不需要缓存的组件

  if (from.fullPath === '/') { 
    console.log("activeItem",sessionStorage.getItem('activeItem'))
    if(sessionStorage.getItem('activeItem') == 1){
      router.options.routes = router.options.routes.concat(weigenRoutes);
      router.addRoutes(weigenRoutes)
    }else if(sessionStorage.getItem('activeItem') == 2){
      router.options.routes = router.options.routes.concat(bluetoothLocationRoutes);
      router.addRoutes(bluetoothLocationRoutes)
    }else if(sessionStorage.getItem('activeItem') == 3){
      router.options.routes = router.options.routes.concat(duFaceRoutes);
      router.addRoutes(duFaceRoutes)
    }

    let cludeRoutes = router.options.routes.filter(ele => ele.children && ele.children.length > 0).map(ele => ele.children);
    if(cludeRoutes.length > 0){
      includeRoute = cludeRoutes[0].filter(ele => ele.meta && ele.meta.keepAlive).map(ele => ele.name)
      excludeRoute = cludeRoutes[0].filter(ele => !ele.meta || !ele.meta.keepAlive).map(ele => ele.name)
      store.dispatch("keepRoutes/setIncludeRoute", includeRoute);
      store.dispatch("keepRoutes/setExcludeRoute", excludeRoute);
    }
    console.log(router)
 
    // if(to.fullPath!=='/select'){
    //   if(sessionStorage.getItem("routers")){
    //     router.addRoutes(JSON.parse(sessionStorage.getItem("routers")))

    //   }
    // }
  }

})

//router.afterEach(transition => {
//NProgress.done();
//});

const rootVueObj = new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

export default rootVueObj;

