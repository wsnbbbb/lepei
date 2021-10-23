import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import list from '@/pages/list'
import detailExpired from '@/pages/detail-expired'
import detailWaiting from '@/pages/detail-waiting'
import detailEnd from '@/pages/detail-end'
import detailWaitingResult from '@/pages/detail-waiting-result'
import payAll from '@/pages/pay-all'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    // {
    //   path: '/index',
    //   name: 'index',
    //   component: Index
    // },
    {
      path: '/index/list',
      name: 'list',
      component: list
    }, {
      path: '/detail-expired',
      name: 'detailExpired',
      component: detailExpired
    }, {
      path: '/detail-waiting',
      name: 'detailWaiting',
      component: detailWaiting
    },{
      path: '/detail-end',
      name: 'detailEnd',
      component: detailEnd
    }, {
      path: '/detail-waiting-result/:type',
      name: 'detailWaitingResult',
      component: detailWaitingResult
    },
      {
      path: '/pay-all/:money/:orderNo',
      name: 'payAll',
      component: payAll
    }

  ]
})