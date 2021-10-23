import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/pages/Index'
import login from '@/pages/login'
import save from '@/pages/save'
import draw from '@/pages/draw'
import query from '@/pages/query'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index/save',
      name: 'save',
      component: save
    },
     {
      path: '/index/draw',
      name: 'draw',
      component: draw
    },
     {
      path: '/index/query',
      name: 'query',
      component: query
    },
 
   
  ]
})

