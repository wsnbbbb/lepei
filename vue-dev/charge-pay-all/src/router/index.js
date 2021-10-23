import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import detailWaitingResult from '@/pages/detail-waiting-result'
import detailWaitingChargeParent from '@/pages/detail-waiting-charge-parent'
import detailWaitingChargeTeacher from '@/pages/detail-waiting-charge-teacher'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
   {
      path: '/detail-waiting-charge-parent/:money',
      name: 'detailWaitingChargeParent',
      component: detailWaitingChargeParent
    }, {
      path: '/detail-waiting-charge-teacher/:money',
      name: 'detailWaitingChargeTeacher',
      component: detailWaitingChargeTeacher
    },{
      path: '/detail-waiting-result/:type',
      name: 'detailWaitingResult',
      component: detailWaitingResult
    },

  ]
})