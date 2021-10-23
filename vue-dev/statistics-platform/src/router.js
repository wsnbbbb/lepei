
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'

Vue.use(Router)

import Login from '@/views/login.vue'
import NotFound from '@/views/404.vue'

const routerMap = {
  'Home':() => import('@/views/Home.vue'),
  'main':() => import('@/views/charts/main.vue'),
  'student-statistics': () => import('@/views/charts/studentStatistics'),
  'administration-staistics': () => import('@/views/charts/administrationStaistics'),
  'device-staistics': () => import('@/views/charts/deviceStaistics'),
  'account-manage': () => import('@/views/charts/accountManage'),
  'authority-manage': () => import('@/views/charts/authorityManage')
}

let staticRoutes =  [
    { path: '/student-statistics', component: routerMap['studentStatistics'], name: '师生统计', hidden: true },
    { path: '/administration-statistics', component: routerMap['administrationStaistics'], name: '行政统计', hidden: true },
    { path: '/device-staistics', component: routerMap['deviceStaistics'], name: '终端统计', hidden: true },
]

let routes = [
    {
        path: '/login',
        component: Login,
        name: '登录',
        hidden: true
    },
    // {
    //     path: '/',
    //     component: routerMap['Home'],
    //     name: '',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/main', component: main, name: '首页' },
    //         { path: '/student-statistics', component: routerMap['studentStatistics'], name: '师生统计', hidden: true },
    //         { path: '/administration-statistics', component: routerMap['administrationStaistics'], name: '行政统计', hidden: true },
    //         { path: '/device-staistics', component: routerMap['deviceStaistics'], name: '终端统计', hidden: true },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '系统设置',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/account-manage', component: accountManage, name: '账号管理' },
    //         { path: '/authority-manage', component: authorityManage, name: '权限管理' },
    //     ]
    // },
];

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('menu');
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
  }
  if(to.path == '/student-statistics'){
    store.commit('resetTab')
  }

  if (to.path == '/student-statistics'||to.path == '/administration-statistics'||to.path == '/device-staistics') {
    store.commit('toggleToTrue')
  }else{
    store.commit('toggleToFalse')
  }
  
  let token = sessionStorage.getItem('token');
  if (!token && to.path != '/login') {
    next({ path: '/login' })
  } else {
    if (!getRouter) {//不加这个判断，路由会陷入死循环
      if (!getObjArr('menu')) {
        next()
      } else {//从localStorage拿到了路由
        getRouter = getObjArr('menu')//拿到路由
        routerGo(to, next)
      }
    } else {
      next()
    }
    next()
  }
})

var getRouter

function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter) //过滤路由
  router.addRoutes(getRouter) //动态添加路由
  global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({ ...to, replace: true })
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
  sessionStorage.setItem(name, JSON.stringify(data))
}

function getObjArr(name) { //localStorage 获取数组对象的方法
  return JSON.parse(window.sessionStorage.getItem(name));

}

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.pid == 0) {
      route.component = routerMap['Home']
      route.path = '/'
    }else{
      route.path = `/${route.action}`
      route.component = routerMap[route.action]
    }
    route.name = route.title
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
      // if(route.action == '/main'){
      //   route.children.push(staticRoutes)
      // }
    }
    return true
  })
  return accessedRouters
}

export default router;