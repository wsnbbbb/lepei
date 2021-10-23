import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import list from '@/pages/list'
import index from '@/pages/index'
import addCard from '@/pages/add-card'
import charge from '@/pages/charge'
import comfirmCharge from '@/pages/comfirm-charge'
import test from '@/pages/test'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/index/:schoolId',
      name: 'index',
      component: index
    },
    {
      path: '/add-card/:schoolId',
      name: 'addCard',
      component: addCard
    },
    {
      path: '/charge',
      name: 'charge',
      component: charge
    },
    {
      path: '/comfirm-charge/:money/:orderNo',
      name: 'comfirmCharge',
      component: comfirmCharge
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/list',
      name: 'list',
      component: list
    }, 
   

  ]
})