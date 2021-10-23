import Vue from 'vue'
import Router from 'vue-router'
import list from '@/pages/list'
import login from '@/pages/login'
import apply from '@/pages/apply'
import detail from '@/pages/detail'
import testtime from '@/pages/datePickerDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/list/:schoolId',
      name: 'list',
      component: list
    },
    {
      path: '/login/:schoolId',
      name: 'login',
      component: login
    },
    {
      path: '/apply/:schoolId',
      name: 'apply',
      component: apply
    } ,
    {
      path: '/testtime',
      name: 'testtime',
      component: testtime
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: detail
    }   ]
})

