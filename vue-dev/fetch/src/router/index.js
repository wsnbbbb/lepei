import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/pages/Index'
import detail from '@/pages/detail'
import detailExamine from '@/pages/detail-examine'
import detailMyapply from '@/pages/detail-myApply'
import add from '@/pages/add'
import submitlist from '@/pages/submitlist'
import rate from '@/pages/rate'
import rateSubmit from '@/pages/rateSubmit'
import rateWeb from '@/pages/rateWeb'
import rateSubmitWeb from '@/pages/rateSubmitWeb'



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
      path: '/index/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/index/detailExamine',
      name: 'detailExamine',
      component: detailExamine
    },
    {
      path: '/index/detailMyapply',
      name: 'detailMyapply',
      component: detailMyapply
    },
    {
      path: '/index/add',
      name: 'add',
      component: add
    },
    {
      path: '/index/submitlist',
      name: 'submitlist',
      component: submitlist
    },
    {
      path: '/index/rate',
      name: 'rate',
      component: rate
    },
    {
      path: '/index/rateSubmit',
      name: 'rateSubmit',
      component: rateSubmit
    },
    {
      path: '/index/rateWeb',
      name: 'rateWeb',
      component: rateWeb
    },
    {
      path: '/index/rateSubmitWeb',
      name: 'rateSubmitWeb',
      component: rateSubmitWeb
    }
  ]
})

