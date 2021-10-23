import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const router =  new Router({
  routes: [
    { path: '/', redirect: '/login'},
    {
      path: '/main/:id',
      name: 'Main',
      component: (resolve)=> require(['./pages/Main.vue'], resolve)
    },
    { 
      path: '/success',
      name: 'Success',
      component: (resolve)=> require(['./pages/Success.vue'], resolve)
    },
    { 
      path: '/visit-register',
      name: 'VisitRegister',
      component: (resolve)=> require(['./pages/VisitRegister.vue'], resolve)
    },
    { 
      path: '/login/:id',
      name: 'Login',
      component: (resolve)=> require(['./pages/Login.vue'], resolve)
    },
    { 
      path: '/entrance-apply',
      name: 'EntranceApply',
      component: (resolve)=> require(['./pages/EntranceApply.vue'], resolve)
    },
    { 
      path: '/child-health',
      name: 'ChildHealth',
      component: (resolve)=> require(['./pages/ChildHealth.vue'], resolve)
    },
    { 
      path: '/welcome',
      name: 'Welcome',
      component: (resolve)=> require(['./pages/welcome.vue'], resolve)
    },
    { 
      path: '/pulldata',
      name: 'Pulldata',
      component: (resolve)=> require(['./pages/pulldata.vue'], resolve)
    },
    { 
      path: '/search',
      name: 'Search',
      component: (resolve)=> require(['./pages/search.vue'], resolve)
    },
  ]
})

// 重置页面滚动条位置
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router