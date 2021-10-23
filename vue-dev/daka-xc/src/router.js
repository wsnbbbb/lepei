import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const router =  new Router({
  routes: [
    { path: '/', redirect: '/home'},
    {
      path: '/login',
      name: 'login',
      component: (resolve)=> require(['./pages/Login.vue'], resolve)
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/Home.vue'], resolve)
    },
    {
      path: '/person-info',
      name: 'personInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/PersonInfo.vue'], resolve)
    },
    {
      path: '/student-info',
      name: 'studentInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/StudentInfo.vue'], resolve)
    },
    {
      path: '/custody-info',
      name: 'custodyInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/CustodyInfo.vue'], resolve)
    },
    {
      path: '/traffic-info',
      name: 'trafficInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/TrafficInfo.vue'], resolve)
    }, 
    {
      path: '/teacher-info',
      name: 'teacherInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/TeacherInfo.vue'], resolve)
    },
    {
      path: '/sign-list',
      name: 'signList',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/SignList.vue'], resolve)
    },
    {
      path: '/sign-info',
      name: 'signInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/SignInfo.vue'], resolve)
    },
    { 
      path: '/write-info-list',
      name: 'writeInfoList',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/WriteInfoList.vue'], resolve)
    },
    
    { 
      path: '/mess-person',
      name: 'messPerson',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/MessPerson.vue'], resolve)
    },
    
    { 
      path: '/dirver-list',
      name: 'dirverList',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/DirverList.vue'], resolve)
    },
    { 
      path: '/school-bus',
      name: 'schoolBus',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/SchoolBus.vue'], resolve)
    },
    { 
      path: '/mess-person-info',
      name: 'messPersonInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/MessPersonInfo.vue'], resolve)
    },
    { 
      path: '/dirver-info', 
      name: '/dirverInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/DirverInfo.vue'], resolve)
    },
    { 
      path: '/school-bus-info',
      name: 'schoolBusInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/SchoolBusInfo.vue'], resolve)
    },
    { 
      path: '/alien-info-list',
      name: 'alienInfolist',
       meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/AlienInfoList.vue'], resolve)
    },
    { 
      path: '/alien-info',
      name: 'alienInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/AlienInfo.vue'], resolve)
    },
    { 
      path: '/alien-person-info',
      name: 'alienPersonInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/AlienPersonInfo.vue'], resolve)
    },
    { 
      path: '/clock-query',
      name: 'clockQuery',
      meta: {
        requireAuth: true
      },
      component: (resolve)=> require(['./pages/ClockQuery.vue'], resolve)
    },
    { 
      path: '/clock-type-list',
      name: 'clockTypeList',
      meta: {
        requireAuth: true
      },
      component: (resolve) => require(['./pages/ClockTypeList.vue'],resolve)
    },
    { 
      path: '/bind-class-list',
      name: 'bindClassList',
      meta: {
        requireAuth: true
      },
      component: (resolve) => require(['./pages/BindClassList.vue'],resolve)
    },
    { 
      path: '/bind-class-info',
      name: 'bindClassInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve) => require(['./pages/BindClassInfo.vue'],resolve)
    },
    { 
      path: '/travel-list',
      name: 'travelList',
      meta: {
        requireAuth: true
      },
      component: (resolve) => require(['./pages/TravelList.vue'],resolve)
    },
    { 
      path: '/travel-info',
      name: 'travelInfo',
      meta: {
        requireAuth: true
      },
      component: (resolve) => require(['./pages/TravelInfo.vue'],resolve)
    },
    { 
      path: '/epidemic-materials',
      name: 'epidemicMaterials',
      meta: {
        requireAuth: true
      },
      component: (resolve) => require(['./pages/EpidemicMaterials.vue'],resolve)
    },
    { 
      path: '/help-punch-card',
      name: 'helpPunchCard',
      meta: {
        requireAuth: true
      },
      component: (resolve) => require(['./pages/HelpPunchCard.vue'],resolve)
    },
   
    
  ]
})

// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
    if (localStorage.getItem('detailList')) {// 判断是否登录
      next()
    } else {// 没登录则跳转到登录界面
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})
// 重置页面滚动条位置
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router
