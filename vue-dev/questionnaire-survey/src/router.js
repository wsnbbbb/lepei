import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login'},
    {
      path: '/login',
      name: 'home',
      component: Home
    },
    { 
      path: '/questionnairedetail',
      name: 'questionnaireDetail',
      component: () => import('./pages/QuestionnaireDetail.vue')
    },
    { 
      path: '/questionnairelist',
      name: 'questionnaireList',
      component: () => import('./pages/QuestionnaireList.vue')
    },
  ]
})
