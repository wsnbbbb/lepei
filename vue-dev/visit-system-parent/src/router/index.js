import Vue from 'vue'
import Router from 'vue-router'
import list from '@/pages/list'

import apply from '@/pages/apply'
import detail from '@/pages/detail'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/apply',
      name: 'apply',
      component: apply
    } ,
    {
      path: '/detail/:id',
      name: 'detail',
      component: detail
    }  ,
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: test
    // }   
  ]
})

