import Vue from 'vue'
import Router from 'vue-router'
import list from '@/pages/list'
import detail from '@/pages/detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: list
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    }  ]
})

