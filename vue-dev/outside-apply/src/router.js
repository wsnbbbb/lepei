import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router =  new Router({
  routes: [
    { path: '/', redirect: '/login'},
    {
      path: '/login',
      name: 'login',
      component: (resolve)=> require(['./pages/Login.vue'], resolve)
    },
    {
      path: '/outside-list',
      name: 'outsideList',
      component: (resolve)=> require(['./pages/OutsideList.vue'], resolve)
    },
    {
      path: '/apply-list',
      name: 'applyList',
      component: (resolve)=> require(['./pages/ApplyList.vue'], resolve)
    },
    {
      path: '/apply-detail',
      name: 'applyDetail',
      component: (resolve)=> require(['./pages/ApplyDetail.vue'], resolve)
    },
    {
      path: '/audit-detail',
      name: 'auditDetail',
      component: (resolve)=> require(['./pages/AuditDetail.vue'], resolve)
    },
  ]
})

// 重置页面滚动条位置
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router
