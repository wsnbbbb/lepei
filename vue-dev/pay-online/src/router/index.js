import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import list from '@/pages/list'
import detailExpired from '@/pages/detail-expired'
import detailWaiting from '@/pages/detail-waiting'
import detailEnd from '@/pages/detail-end'
import detailWaitingResult from '@/pages/detail-waiting-result'
import detailWaitingResultIos from '@/pages/detail-waiting-result-ios'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/index/list',
      name: 'list',
      component: list
    },
    {
      path: '/detail-expired',
      name: 'detailExpired',
      component: detailExpired
    },
    {
      path: '/detail-waiting',
      name: 'detailWaiting',
      component: detailWaiting
    },
    {
      path: '/detail-end',
      name: 'detailEnd',
      component: detailEnd
    },
    {
      path: '/detail-waiting-result',
      name: 'detailWaitingResult',
      component: detailWaitingResult
    },
    {
      path: '/detail-waiting-result-ios',
      name: 'detailWaitingResultIos',
      component: detailWaitingResultIos
    },
 

    
  ]
})

